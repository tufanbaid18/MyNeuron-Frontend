import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import type { ConversationUser } from "../../types/inbox/inbox.types";
import { getAvatarByName } from "../../utils/avatar.utils";

interface UserAvatarProps {
  user: Pick<ConversationUser, "first_name" | "last_name" | "profile_image">;
  size?: number;
  showIcon?: boolean;
}

export const UserAvatar = ({
  user,
  size = 40,
  showIcon = true,
}: UserAvatarProps) => (
  <Avatar
    size={size}
    src={user.profile_image || getAvatarByName({ firstName: user.first_name, lastName: user.last_name })}
    icon={showIcon && !user.profile_image && <UserOutlined />}
    className="shrink-0"
  />
);
