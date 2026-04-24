import type { MenuProps } from "antd";
import { Avatar, Dropdown, Tag, Tooltip, Typography } from "antd";
import { MoreHorizontal } from "lucide-react";
import type { FeedPostUser } from "../../../types/impulse/post.types";
import { formatTimeAgo } from "../../../utils/impulse.utils";

const { Text } = Typography;

interface PostHeaderProps {
  author: FeedPostUser;
  displayName: string;
  subtitle: string;
  isUserPost: boolean;
  createdAt: string;
  isOwnPost?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostHeader = ({
  author,
  displayName,
  subtitle,
  isUserPost,
  createdAt,
  isOwnPost,
  onEdit,
  onDelete,
}: PostHeaderProps) => {
  const menuItems: MenuProps["items"] = [
    // { key: "save", label: "Save post" },
    // { key: "hide", label: "Hide post" },
    ...(isOwnPost
      ? [
          { key: "edit", label: "Edit post", onClick: onEdit },
          { type: "divider" as const },
          {
            key: "delete",
            label: "Delete post",
            danger: true,
            onClick: onDelete,
          },
        ]
      : []),
    // { key: "report", label: "Report", danger: true },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flex: 1,
          minWidth: 0,
        }}
      >
        <Avatar
          src={author.profile_image_url}
          size={44}
          style={{ flexShrink: 0, aspectRatio: "1 / 1" }}
          className="bg-primary"
        >
          {!author.profile_image_url && author.first_name?.[0]}
        </Avatar>
        <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Tooltip title={displayName}>
              <Text
                strong
                ellipsis
                style={{
                  maxWidth: "100%",
                  display: "block",
                  fontSize: 14,
                  color: "#1a1a1a",
                }}
              >
                {displayName}
              </Text>
            </Tooltip>
            {isUserPost && author.is_following && (
              <Tag color="default" style={{ margin: 0, fontSize: 11 }}>
                Following
              </Tag>
            )}
          </div>
          <Tooltip title={subtitle}>
            <Text
              type="secondary"
              ellipsis
              style={{
                display: "block",
                fontSize: 13,
                maxWidth: "100%",
              }}
            >
              {subtitle}
            </Text>
          </Tooltip>
          <Text type="secondary" style={{ fontSize: 12, color: "#9ca3af" }}>
            {formatTimeAgo(createdAt)}
          </Text>
        </div>
      </div>
      {isOwnPost && (
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button
            style={{
              padding: 8,
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="hover:bg-gray-100"
          >
            <MoreHorizontal
              style={{ width: 20, height: 20, color: "#6b7280" }}
            />
          </button>
        </Dropdown>
      )}
    </div>
  );
};
