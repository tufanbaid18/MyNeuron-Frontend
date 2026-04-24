import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import type { ConversationUser } from "../../types/inbox/inbox.types";
import { UserAvatar } from "./UserAvatar";

const { Text } = Typography;

interface ChatHeaderProps {
  user: Pick<ConversationUser, "id" | "first_name" | "last_name" | "profile_image">;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ChatHeader = ({ user, onBack, showBackButton = true }: ChatHeaderProps) => {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-2.5">
      {showBackButton && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="md:hidden"
          size="small"
        />
      )}

      <UserAvatar user={user} size={36} />

      <div>
        <Text strong className="text-slate-800">
          {user.first_name} {user.last_name}
        </Text>
      </div>
    </div>
  );
};
