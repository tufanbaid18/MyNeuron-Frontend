import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { Link, useParams, useRouter } from "@tanstack/react-router";
import { Button, Spin, Tabs } from "antd";
import { useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { HandshakeButton } from "../../components/gatc/speakers/HandshakeButton";
import { ProgramCard } from "../../components/gatc/speakers/ProgramCard";
import { ProgramList } from "../../components/gatc/speakers/ProgramList";
import { APP_ROUTES } from "../../constants/app.routes";
import { useGatcPrograms, useGatcSpeakerById } from "../../hooks/gatc/useGatc";
import {
  useCancelHandshake,
  useCreateHandshake,
  useGetMyHandshakes,
} from "../../hooks/gatc/useHandshake";
import { userProfileAtom } from "../../store/auth.store";
import { HandshakeStatus } from "../../types/gatc/handshake.types";
import { getAvatarByName } from "../../utils/avatar.utils";

const GatcSpeakerDetails = () => {
  const { speakerId } = useParams({ strict: false });
  const router = useRouter();
  const user = useAtomValue(userProfileAtom);

  // ── Speaker data ──────────────────────────────────────────
  const { data: speaker, isLoading: isSpeakerLoading } = useGatcSpeakerById(
    speakerId as string,
  );

  // ── Programs ──────────────────────────────────────────────
  const {
    mutate: fetchPrograms,
    data: programsData,
    isPending: isProgramsLoading,
  } = useGatcPrograms();

  useEffect(() => {
    if (speakerId) {
      fetchPrograms(speakerId);
    }
  }, [speakerId, fetchPrograms]);

  // ── Handshake ─────────────────────────────────────────────
  const { data: handshakes } = useGetMyHandshakes();
  const createHandshake = useCreateHandshake();
  const cancelHandshake = useCancelHandshake();

  const handshake = useMemo(() => {
    if (!speaker || !handshakes || !user)
      return { status: HandshakeStatus.NONE as const };

    return (
      handshakes.find(
        (h) =>
          (h.sender === user.id && h.receiver === speaker.id) ||
          (h.receiver === user.id && h.sender === speaker.id),
      ) ?? { status: HandshakeStatus.NONE as const }
    );
  }, [speaker, handshakes, user]);

  const handleSendHandshake = (receiverId: number) => {
    createHandshake.mutate({ receiver_id: receiverId });
  };

  const handleCancelHandshake = (handshakeId: number) => {
    cancelHandshake.mutate(handshakeId);
  };

  // ── Loading / Error states ────────────────────────────────
  if (isSpeakerLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!speaker) {
    return <div className="p-8 text-slate-500">Speaker not found.</div>;
  }

  const handleBack = () => {
    router.history.back();
  };

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
                speaker.profile_image ||
                getAvatarByName({
                  firstName: speaker.first_name,
                  lastName: speaker.last_name,
                })
              }
              alt={speaker.first_name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Name & Details */}
          <div className="flex flex-1 flex-col gap-2">
            <h1 className="mt-2 text-3xl font-semibold text-slate-800">
              {speaker.first_name}{" "}
              {speaker.middle_name ? `${speaker.middle_name} ` : ""}
              {speaker.last_name}
            </h1>

            {speaker.email && (
              <p className="text-sm text-slate-500">
                <span className="mr-2">Email: {speaker.email}</span>
                <span className="mr-2 text-slate-300">•</span>
              </p>
            )}

            {speaker.profile_title && (
              <p className="text-sm font-medium text-slate-600">
                {speaker.profile_title}
              </p>
            )}
          </div>

          {/* Handshake Button */}
          <div className="shrink-0" key={handshake.status}>
            <HandshakeButton
              speakerId={speaker.id}
              handshake={handshake}
              onSend={handleSendHandshake}
              onCancel={handleCancelHandshake}
              isSending={createHandshake.isPending}
              isCancelling={cancelHandshake.isPending}
            />
          </div>
        </div>

        {/* About Section */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">About</h2>
          <p className="leading-relaxed text-slate-600">
            {speaker.first_name} {speaker.last_name} is a speaker for the
            upcoming GATC program. Currently, their full bio is not available.
            Please reach out or connect via a handshake for more details
            directly from the speaker.
          </p>
        </div>

        {/* Programs Preview in Profile tab */}
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
      </div>

      {/* Right Sidebar */}
      <div className="w-full shrink-0 md:w-80">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Quick Actions
          </h3>
          <Link to={`${APP_ROUTES.INBOX}/${speaker.id}`}>
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
          },
        ]}
        className="gatc-speaker-tabs"
      />
    </div>
  );
};

export default GatcSpeakerDetails;
