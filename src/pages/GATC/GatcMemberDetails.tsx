import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { Link, useParams, useRouter } from "@tanstack/react-router";
import { Button, Spin, Tabs, Tag } from "antd";
import { useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { HandshakeButton } from "../../components/gatc/speakers/HandshakeButton";
import { ProgramCard } from "../../components/gatc/speakers/ProgramCard";
import { ProgramList } from "../../components/gatc/speakers/ProgramList";
import { APP_ROUTES } from "../../constants/app.routes";
import { useGatcMemberById, useGatcPrograms } from "../../hooks/gatc/useGatc";
import {
  useCancelHandshake,
  useCreateHandshake,
  useGetMyHandshakes,
} from "../../hooks/gatc/useHandshake";
import { userProfileAtom } from "../../store/auth.store";
import { HandshakeStatus } from "../../types/gatc/handshake.types";
import { getAvatarByName } from "../../utils/avatar.utils";

const GatcMemberDetails = () => {
  const { memberId } = useParams({ strict: false });
  const router = useRouter();
  const currentUser = useAtomValue(userProfileAtom);

  // ── Member data (response: { id, user: {...}, event, role, created_at }) ──
  const { data: member, isLoading: isMemberLoading } = useGatcMemberById(
    memberId as string,
  );

  // ── Programs ──────────────────────────────────────────────
  const {
    mutate: fetchPrograms,
    data: programsData,
    isPending: isProgramsLoading,
  } = useGatcPrograms();

  useEffect(() => {
    if (!member) return;
    if (member.role === "speaker") {
      fetchPrograms(member.user.id);
    }
  }, [member, fetchPrograms]);

  // ── Handshake (uses user.id, NOT membership id) ───────────
  const { data: handshakes } = useGetMyHandshakes();
  const createHandshake = useCreateHandshake();
  const cancelHandshake = useCancelHandshake();

  const handshake = useMemo(() => {
    const userId = member?.user?.id;
    if (!userId || !handshakes || !currentUser)
      return { status: HandshakeStatus.NONE as const };

    return (
      handshakes.find(
        (h) =>
          (h.sender === currentUser.id && h.receiver === userId) ||
          (h.receiver === currentUser.id && h.sender === userId),
      ) ?? { status: HandshakeStatus.NONE as const }
    );
  }, [member, handshakes, currentUser]);

  const handleSendHandshake = (receiverId: number) => {
    createHandshake.mutate({ receiver_id: receiverId });
  };

  const handleCancelHandshake = (handshakeId: number) => {
    cancelHandshake.mutate(handshakeId);
  };

  // ── Loading / Error states ────────────────────────────────
  if (isMemberLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!member || !member.user) {
    return <div className="p-8 text-slate-500">Member not found.</div>;
  }

  // Destructure nested user for cleaner JSX
  const { user } = member;

  const handleBack = () => {
    router.history.back();
  };

  const roleLabel = member.role === "speaker" ? "Speaker" : "Participant";
  const roleColor = member.role === "speaker" ? "green" : "blue";

  // ── Tab: Programs ─────────────────────────────────────────
  const programsContent = (
    <div className="mt-6">
      <ProgramList
        programs={programsData || []}
        isLoading={isProgramsLoading}
      />
    </div>
  );

  // ── Tab: Profile ──────────────────────────────────────────
  const profileContent = (
    <div className="mt-6 flex flex-col gap-8 md:flex-row">
      <div className="flex-1">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="h-40 w-40 shrink-0 overflow-hidden rounded-full bg-blue-50 shadow-sm">
            <img
              src={
                user.profile_image ||
                getAvatarByName({
                  firstName: user.first_name,
                  lastName: user.last_name,
                })
              }
              alt={user.first_name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Name & Details */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="mt-2 text-3xl font-semibold text-slate-800">
                {user.first_name}{" "}
                {user.middle_name ? `${user.middle_name} ` : ""}
                {user.last_name}
              </h1>
            </div>

            {user.email && (
              <p className="text-sm text-slate-500">Email: {user.email}</p>
            )}

            <Tag color={roleColor} className="w-max px-3! py-1! font-medium">
              {roleLabel}
            </Tag>

            {user.profile_title && (
              <p className="text-sm font-medium text-slate-600">
                {user.profile_title}
              </p>
            )}
          </div>

          {/* Handshake Button — uses user.id (not member.id) */}
          {user.id !== currentUser?.id && (
            <div className="shrink-0" key={handshake.status}>
              <HandshakeButton
                userId={user.id}
                handshake={handshake}
                onSend={handleSendHandshake}
                onCancel={handleCancelHandshake}
                isSending={createHandshake.isPending}
                isCancelling={cancelHandshake.isPending}
              />
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">About</h2>
          <p className="leading-relaxed text-slate-600">
            {user.first_name} {user.last_name} is a {roleLabel.toLowerCase()}{" "}
            for the upcoming GATC program. Currently, their full bio is not
            available. Please reach out or connect via a handshake for more
            details.
          </p>
        </div>

        {/* Programs Preview in Profile tab */}
        {member?.role === "speaker" && (
          <div className="w-full">
            <h2 className="mb-4 border-b border-gray-100 pb-2 text-xl font-semibold text-slate-800">
              Programs at GATC
            </h2>
            <div className="mt-4 flex flex-col">
              {programsData && programsData.length > 0 ? (
                programsData.map((prog) => (
                  <ProgramCard key={prog.id} program={prog} />
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  No specific programs registered yet.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar — inbox uses user.id */}
      {user.id !== currentUser?.id && (
        <div className="w-full shrink-0 md:w-80">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Quick Actions
            </h3>
            <Link to={`${APP_ROUTES.INBOX}/${user.id}`}>
              <Button
                block
                icon={<SendOutlined />}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Send Message
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto min-h-screen bg-white p-6">
      <Button
        onClick={handleBack}
        icon={<ArrowLeftOutlined />}
        type="default"
        className="mb-6 rounded-md hover:border-emerald-500 hover:text-emerald-500"
      >
        Back
      </Button>

      <Tabs
        defaultActiveKey="profile"
        items={[
          { key: "profile", label: "Profile", children: profileContent },
          {
            key: "programs",
            label: "GATC Programs",
            children: programsContent,
            disabled: member?.role !== "speaker",
          },
        ]}
        className="gatc-speaker-tabs"
      />
    </div>
  );
};

export default GatcMemberDetails;
