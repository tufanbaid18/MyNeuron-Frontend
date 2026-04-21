import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Empty, Modal, Spin, Tag, Typography } from "antd";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import {
  useAcceptHandshake,
  useCancelHandshake,
  useCreateHandshake,
  useDeclineHandshake,
  useGetMyHandshakes,
} from "../../hooks/gatc/useHandshake";
import { userProfileAtom } from "../../store/auth.store";
import type { Handshake } from "../../types/gatc/handshake.types";
import {
  HandshakeDirection,
  HandshakeStatus,
} from "../../types/gatc/handshake.types";
import { getAvatarByName } from "../../utils/avatar.utils";

const { Text, Title } = Typography;

// ════════════════════════════════════════════════════════════════
// Tabs configuration
// ════════════════════════════════════════════════════════════════

enum HandshakeTab {
  ALL = "all",
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

const TABS = [
  { key: HandshakeTab.ALL, label: "All" },
  { key: HandshakeTab.PENDING, label: "Pending" },
  { key: HandshakeTab.ACCEPTED, label: "Accepted" },
  { key: HandshakeTab.DECLINED, label: "Declined" },
];

// ════════════════════════════════════════════════════════════════
// Helper: normalize a handshake for display
// ════════════════════════════════════════════════════════════════

type NormalizedHandshake = {
  id: number;
  status: string;
  createdAt: string;
  direction: HandshakeDirection;
  otherUser: {
    id: number;
    name: string;
    avatar: string | null;
  };
  raw: Handshake;
};

const normalizeHandshake = (
  h: Handshake,
  currentUserId: number,
): NormalizedHandshake => {
  const isSender = h.sender === currentUserId;
  const otherDetails = isSender ? h.receiver_details : h.sender_details;

  // Map backend status "declined" / "cancelled" for display
  let status = h.status as string;
  if (status === "declined") status = "declined";
  if (status === "cancelled") status = "cancelled";

  return {
    id: h.id,
    status,
    createdAt: h.created_at?.split("T")[0] ?? "",
    direction: isSender ? HandshakeDirection.SENT : HandshakeDirection.RECEIVED,
    otherUser: {
      id: otherDetails.id,
      name: otherDetails.name || "Unknown",
      avatar: otherDetails.profile_image,
    },
    raw: h,
  };
};

// ════════════════════════════════════════════════════════════════
// Status badge colors
// ════════════════════════════════════════════════════════════════

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: "gold", label: "PENDING" },
  accepted: { color: "green", label: "ACCEPTED" },
  declined: { color: "red", label: "DECLINED" },
  cancelled: { color: "default", label: "CANCELLED" },
};

// ════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════

const GatcMyHandshakes = () => {
  // const router = useRouter();
  const user = useAtomValue(userProfileAtom);

  const { data: handshakes = [], isLoading } = useGetMyHandshakes();
  const cancelHandshake = useCancelHandshake();
  const createHandshake = useCreateHandshake();
  const acceptHandshake = useAcceptHandshake();
  const declineHandshake = useDeclineHandshake();

  const [activeTab, setActiveTab] = useState<HandshakeTab>(HandshakeTab.ALL);
  const [undoTarget, setUndoTarget] = useState<Handshake | null>(null);

  // ── Normalize handshakes ──────────────────────────────────
  const normalized = useMemo(() => {
    if (!handshakes || !user) return [];
    return handshakes.map((h) => normalizeHandshake(h, user.id));
  }, [handshakes, user]);

  // ── Filter by active tab ─────────────────────────────────
  const filtered = useMemo(() => {
    if (activeTab === HandshakeTab.ALL) return normalized;
    return normalized.filter((h) => h.status === activeTab);
  }, [normalized, activeTab]);

  // ── Cancel with undo flow ─────────────────────────────────
  const handleCancel = (h: NormalizedHandshake) => {
    Modal.confirm({
      title: "Cancel Handshake",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this handshake request?",
      okText: "Yes, Cancel",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        cancelHandshake.mutate(h.id, {
          onSuccess: () => {
            setUndoTarget(h.raw);
          },
        });
      },
    });
  };

  const handleUndo = () => {
    if (!undoTarget) return;
    createHandshake.mutate(
      { receiver_id: undoTarget.receiver },
      { onSuccess: () => setUndoTarget(null) },
    );
  };

  // ── Navigate to profile ───────────────────────────────────
  // const viewProfile = (userId: number) => {
  //   router.navigate({ to: APP_ROUTES.GATC_MEMBER(userId) });
  // };

  // ── Loading state ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <Title level={3} className="mb-6! text-slate-800">
        Handshakes
      </Title>

      {/* Undo banner */}
      {undoTarget && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <Text className="text-amber-800">
            Handshake cancelled. Click undo to restore.
          </Text>
          <div className="flex items-center gap-2">
            <Button size="small" onClick={handleUndo}>
              Undo
            </Button>
            <Button
              type="text"
              size="small"
              onClick={() => setUndoTarget(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === t.key
                ? "bg-emerald-600 text-white"
                : "border border-emerald-600 bg-white text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Handshake list */}
      {filtered.length === 0 ? (
        <Empty
          description={`No ${activeTab === HandshakeTab.ALL ? "" : activeTab + " "}handshakes found.`}
          className="py-16"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((h) => {
            const config = STATUS_CONFIG[h.status] ?? {
              color: "default",
              label: h.status.toUpperCase(),
            };

            // Extract first/last name for avatar fallback
            const nameParts = h.otherUser.name.split(" ");
            const firstName = nameParts[0] ?? "";
            const lastName = nameParts.slice(1).join(" ") || undefined;

            return (
              <div
                key={h.id}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Avatar */}
                <Avatar
                  size={48}
                  src={
                    h.otherUser.avatar ||
                    getAvatarByName({ firstName, lastName })
                  }
                  icon={<UserOutlined />}
                  className="shrink-0"
                />

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <Text strong className="block text-slate-800">
                    {h.otherUser.name}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {h.direction === HandshakeDirection.SENT
                      ? "Sent"
                      : "Received"}{" "}
                    on {h.createdAt}
                  </Text>
                </div>

                {/* Status badge */}
                <Tag color={config.color} className="rounded-full font-medium">
                  {config.label}
                </Tag>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* <Button
                    size="small"
                    icon={<UserOutlined />}
                    className="border-slate-300 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                    onClick={() => viewProfile(h.otherUser.id)}
                  >
                    View Profile
                  </Button> */}

                  {/* Sender can cancel pending */}
                  {h.direction === HandshakeDirection.SENT &&
                    h.status === HandshakeStatus.PENDING && (
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleCancel(h)}
                        loading={cancelHandshake.isPending}
                      >
                        Cancel
                      </Button>
                    )}

                  {/* Receiver can accept/decline pending */}
                  {h.direction === HandshakeDirection.RECEIVED &&
                    h.status === HandshakeStatus.PENDING && (
                      <>
                        <Button
                          size="small"
                          type="primary"
                          icon={<CheckOutlined />}
                          className="bg-emerald-600 hover:bg-emerald-500"
                          onClick={() => acceptHandshake.mutate(h.id)}
                          loading={acceptHandshake.isPending}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => declineHandshake.mutate(h.id)}
                          loading={declineHandshake.isPending}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GatcMyHandshakes;
