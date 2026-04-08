import { Bell } from "lucide-react";
import { Button, Drawer, Empty, List, Spin, Tabs } from "antd";
import { useState } from "react";
import type { Notification } from "../../types/notification.types";
import { NotificationItem } from "./NotificationItem";

interface NotificationDrawerProps {
  open: boolean;
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}

export const NotificationDrawer = ({
  open,
  notifications,
  unreadCount,
  isLoading,
  onClose,
  onMarkAsRead,
  onMarkAllRead,
  onDelete,
}: NotificationDrawerProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const displayed =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const tabItems = [
    { key: "all", label: `All (${notifications.length})` },
    { key: "unread", label: `Unread (${unreadCount})` },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <Bell size={16} />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 text-xs font-semibold rounded-full bg-blue-500 text-white px-1.5">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      }
      extra={
        unreadCount > 0 ? (
          <Button type="link" size="small" onClick={onMarkAllRead}>
            Mark all as read
          </Button>
        ) : null
      }
      onClose={onClose}
      open={open}
      styles={{ body: { padding: 5 } }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="px-5!"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spin />
        </div>
      ) : displayed.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            activeTab === "unread"
              ? "You're all caught up!"
              : "No notifications yet"
          }
          className="py-16"
        />
      ) : (
        <List
          dataSource={displayed}
          renderItem={(notification) => (
            <NotificationItem
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          )}
        />
      )}
    </Drawer>
  );
};
