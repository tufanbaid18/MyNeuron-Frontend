import { Empty, Spin } from "antd";
import type { Conversation } from "../../types/inbox/inbox.types";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading?: boolean;
  activeUserId: number | null;
  onSelect: (userId: number) => void;
}

export const ConversationList = ({
  conversations,
  isLoading,
  activeUserId,
  onSelect,
}: ConversationListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spin />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Empty
        description="No conversations yet"
        className="py-12"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((c) => (
        <ConversationItem
          key={c.user.id}
          conversation={c}
          isActive={activeUserId === c.user.id}
          onClick={() => onSelect(c.user.id)}
        />
      ))}
    </div>
  );
};
