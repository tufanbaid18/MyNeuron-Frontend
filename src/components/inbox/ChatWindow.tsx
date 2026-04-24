import type { ConversationUser } from "../../types/inbox/inbox.types";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

interface ChatWindowProps {
  user: Pick<ConversationUser, "id" | "first_name" | "last_name" | "profile_image">;
  messages: Array<{
    id: number;
    sender: number;
    receiver: number;
    content: string;
    is_read: boolean;
    created_at: string;
  }>;
  currentUserId: number;
  onBack: () => void;
  onSend: (content: string) => void;
  isLoading?: boolean;
  isSending?: boolean;
}

export const ChatWindow = ({
  user,
  messages,
  currentUserId,
  onBack,
  onSend,
  isLoading,
  isSending,
}: ChatWindowProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader user={user} onBack={onBack} showBackButton />

      <ChatMessages
        messages={messages as never}
        currentUserId={currentUserId}
        isLoading={isLoading}
      />

      <ChatInput onSend={onSend} isPending={isSending} />
    </div>
  );
};
