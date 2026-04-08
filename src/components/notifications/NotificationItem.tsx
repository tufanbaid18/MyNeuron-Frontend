import { InfoCircleOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, List, Tooltip } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Trash2 } from "lucide-react";
import type { Notification } from "../../types/notification.types";

dayjs.extend(relativeTime);

const NOTIFICATION_ICON_MAP = {
  info:    <InfoCircleOutlined    style={{ color: "#1677ff" }} />,
  success: <CheckCircleOutlined  style={{ color: "#52c41a" }} />,
  warning: <WarningOutlined      style={{ color: "#faad14" }} />,
  error:   <CloseCircleOutlined  style={{ color: "#ff4d4f" }} />,
  default: <InfoCircleOutlined   style={{ color: "#1677ff" }} />,
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete:     (id: string) => void;
  onNavigate?:  (notification: Notification) => void;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onNavigate,
}: NotificationItemProps) => {
  const { id, title, message, type = "default", read, timestamp } = notification;

  const handleClick = () => {
    if (id) {
      if (!read) onMarkAsRead(id);
      if (onNavigate) onNavigate(notification);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) onDelete(id);
  };

  const icon = NOTIFICATION_ICON_MAP[type] ?? NOTIFICATION_ICON_MAP.default;
  const timeLabel = timestamp ? dayjs(timestamp).fromNow() : null;

  return (
    <List.Item
      key={id}
      className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 px-4 ${
        !read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
      }`}
      onClick={handleClick}
    >
      <List.Item.Meta
        avatar={
          <div className="flex items-start pt-1">
            {icon}
            {!read && (
              <span className="ml-2 mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
            )}
          </div>
        }
        title={
          <span className={`text-sm ${!read ? "font-semibold" : "font-normal"}`}>
            {title ?? "Notification"}
          </span>
        }
        description={
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {message ?? ""}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {timeLabel && (
                <span className="text-xs text-gray-400">{timeLabel}</span>
              )}
              <Tooltip title="Delete">
                <Button
                  type="text"
                  size="small"
                  icon={<Trash2 size={13} />}
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-500"
                />
              </Tooltip>
            </div>
          </div>
        }
      />
    </List.Item>
  );
};
