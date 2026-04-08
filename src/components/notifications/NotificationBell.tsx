import { Badge } from "antd";
import { useState } from "react";
import { RiNotification3Line } from "react-icons/ri";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../store/auth.store";
import { useFetchNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from "../../hooks/notification/useNotifications";
import { useNotificationListener } from "../../hooks/notification/useNotificationListener";
import { NotificationDrawer } from "./NotificationDrawer";

export const NotificationBell = () => {
  const user = useAtomValue(userProfileAtom);
  const userId = user?.id;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: notifications = [], isLoading } = useFetchNotifications(userId);
  useNotificationListener(userId);

  const markAsReadMutation   = useMarkAsRead(userId);
  const markAllAsReadMutation = useMarkAllAsRead(userId);
  const deleteMutation       = useDeleteNotification(userId);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllAsReadMutation.mutate(notifications);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const displayCount =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : undefined;

  return (
    <>
      <button
        className="relative rounded-full border border-gray-500 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setDrawerOpen(true)}
        aria-label="Notifications"
      >
        <RiNotification3Line size={18} />
        {unreadCount > 0 && (
          <Badge
            count={displayCount}
            size="small"
            offset={[2, -2]}
            className="pointer-events-none"
          />
        )}
      </button>

      <NotificationDrawer
        open={drawerOpen}
        notifications={notifications}
        unreadCount={unreadCount}
        isLoading={isLoading}
        onClose={() => setDrawerOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllRead={handleMarkAllRead}
        onDelete={handleDelete}
      />
    </>
  );
};
