import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Notification } from "../../types/notification.types";
import { subscribeToNotifications } from "../../services/notification/notification.service";
import { NOTIFICATIONS_QUERY_KEY } from "./useNotifications";

/**
 * Subscribes to new notifications from Firebase Realtime Database.
 * When a new notification arrives, it prepends it to the React Query cache.
 * Automatically unsubscribes on unmount.
 */
export const useNotificationListener = (userId: number | string | undefined) => {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!userId) return;

    unsubscribeRef.current = subscribeToNotifications(userId, (notification) => {
      // Prepend new notification to cache, deduped by id
      queryClient.setQueryData<Notification[]>(
        NOTIFICATIONS_QUERY_KEY(userId),
        (old) => {
          if (!old) return [notification];
          // Avoid duplicates if onChildAdded also fires for existing items
          if (old.some((n) => n.id === notification.id)) return old;
          return [notification, ...old];
        },
      );
    });

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [userId, queryClient]);
};
