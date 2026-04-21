import { Badge, Typography } from "antd";
import type { Conversation } from "../../types/inbox/inbox.types";
import { UserAvatar } from "./UserAvatar";

const { Text } = Typography;

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export const ConversationItem = ({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) => {
  const { user, last_message, unread_count } = conversation;

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
        isActive
          ? "border-l-2 border-emerald-500 bg-emerald-50/50"
          : ""
      }`}
    >
      <UserAvatar user={user} size={42} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <Text strong className="truncate text-sm text-slate-800">
            {user.first_name} {user.last_name}
          </Text>
          {last_message && (
            <Text className="shrink-0 text-xs text-slate-400">
              {formatTime(last_message.created_at)}
            </Text>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Text className="truncate text-xs text-slate-500">
            {last_message?.content || "Start a conversation"}
          </Text>
          {unread_count > 0 && (
            <Badge
              count={unread_count}
              size="small"
              className="ml-2"
              color="#10b981"
            />
          )}
        </div>
      </div>
    </div>
  );
};
