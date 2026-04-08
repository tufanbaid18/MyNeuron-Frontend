import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Notification } from "../../types/notification.types";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../../services/notification/notification.service";

export const NOTIFICATIONS_QUERY_KEY = (userId: number | string) => [
  "notifications",
  userId,
];

/** Fetch all notifications for a user */
export const useFetchNotifications = (userId: number | string | undefined) => {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY(userId as string | number),
    queryFn: () => fetchNotifications(userId as string | number),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/** Mark a single notification as read */
export const useMarkAsRead = (userId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(userId as string | number, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY(userId as string | number) });
    },
  });
};

/** Mark all unread notifications as read */
export const useMarkAllAsRead = (userId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notifications: Notification[]) =>
      markAllAsRead(userId as string | number, notifications),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY(userId as string | number) });
    },
  });
};

/** Delete a single notification */
export const useDeleteNotification = (userId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      deleteNotification(userId as string | number, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY(userId as string | number) });
    },
  });
};

/** Clear all notifications */
export const useClearAllNotifications = (userId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearAllNotifications(userId as string | number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY(userId as string | number) });
    },
  });
};
