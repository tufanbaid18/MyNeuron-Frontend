import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Space, Tag, Typography } from "antd";
import { HandshakeStatus } from "../../../types/gatc/handshake.types";
import type { Handshake } from "../../../types/gatc/handshake.types";

// ════════════════════════════════════════════════════════════════
// HandshakeButton — Renders contextual UI based on handshake status
// ════════════════════════════════════════════════════════════════

type HandshakeButtonProps = {
  userId: number;
  handshake: Handshake | { status: HandshakeStatus.NONE };
  onSend: (receiverId: number) => void;
  onCancel: (handshakeId: number) => void;
  isSending: boolean;
  isCancelling: boolean;
};

const { Text } = Typography;

export const HandshakeButton = ({
  userId,
  handshake,
  onSend,
  onCancel,
  isSending,
  isCancelling,
}: HandshakeButtonProps) => {
  if (isSending || isCancelling) {
    return (
      <Button disabled icon={<LoadingOutlined spin />}>
        {isSending ? "Sending…" : "Cancelling…"}
      </Button>
    );
  }

  switch (handshake.status) {
    case HandshakeStatus.PENDING:
      return (
        <Space direction="vertical" size={4} align="end">
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            className="rounded-full px-4 py-1 text-sm font-medium"
          >
            Handshake Requested
          </Tag>

          {"created_at" in handshake && (
            <Text type="secondary" className="text-xs">
              Sent on{" "}
              {new Date(handshake.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          )}

          {"id" in handshake && (
            <Text
              type="danger"
              className="cursor-pointer text-xs underline"
              onClick={() => onCancel(handshake.id)}
            >
              Undo Request
            </Text>
          )}
        </Space>
      );

    case HandshakeStatus.ACCEPTED:
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color="success"
          className="rounded-full border-emerald-500 px-4 py-1 text-sm font-medium"
        >
          Request <strong>accepted</strong>
        </Tag>
      );

    case HandshakeStatus.DECLINED:
      return (
        <Tag
          icon={<CloseCircleOutlined />}
          color="error"
          className="rounded-full px-4 py-1 text-sm font-medium"
        >
          Request <strong>declined</strong>
        </Tag>
      );

    case HandshakeStatus.NONE:
    default:
      return (
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => onSend(userId)}
          className="bg-emerald-600 font-medium hover:bg-emerald-500"
        >
          Send Handshake
        </Button>
      );
  }
};
