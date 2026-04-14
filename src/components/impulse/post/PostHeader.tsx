import type { MenuProps } from "antd";
import { Avatar, Dropdown, Tag } from "antd";
import { MoreHorizontal } from "lucide-react";
import type { FeedPostUser } from "../../../types/impulse/post.types";
import { formatTimeAgo } from "../../../utils/impulse.utils";

interface PostHeaderProps {
  author: FeedPostUser;
  displayName: string;
  subtitle: string;
  isUserPost: boolean;
  createdAt: string;
}

export const PostHeader = ({
  author,
  displayName,
  subtitle,
  isUserPost,
  createdAt,
}: PostHeaderProps) => {
  const menuItems: MenuProps["items"] = [
    { key: "save", label: "Save post" },
    { key: "hide", label: "Hide post" },
    { key: "report", label: "Report", danger: true },
  ];

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar src={author.profile_image_url} size={44} className="bg-primary shrink-0">
          {!author.profile_image_url && author.first_name?.[0]}
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 truncate">{displayName}</span>
            {isUserPost && author.is_following && (
              <Tag color="default" className="text-xs m-0">
                Following
              </Tag>
            )}
          </div>
          <p className="text-sm text-gray-500 m-0 truncate">{subtitle}</p>
          <p className="text-xs text-gray-400 m-0">
            {formatTimeAgo(createdAt)}
          </p>
        </div>
      </div>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </Dropdown>
    </div>
  );
};
