import {
  get,
  remove,
  ref,
  update,
  type Unsubscribe,
  onChildAdded,
  limitToLast,
  query,
} from "firebase/database";
import { getFirebaseDB } from "../../firebase/firebase";
import type { Notification } from "../../types/notification.types";

const NOTIFICATIONS_PATH = (userId: number | string) =>
  `notifications/${userId}`;

/** Fetch all notifications for a user, sorted newest-first */
export const fetchNotifications = async (
  userId: number | string,
): Promise<Notification[]> => {
  const db = getFirebaseDB();
  const snapshot = await get(ref(db, NOTIFICATIONS_PATH(userId)));
  if (!snapshot.exists()) return [];

  const raw = snapshot.val() as Record<string, Omit<Notification, "id">>;
  return Object.entries(raw)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
};

/** Mark a single notification as read */
export const markAsRead = async (
  userId: number | string,
  notificationId: string,
): Promise<void> => {
  const db = getFirebaseDB();
  await update(ref(db, NOTIFICATIONS_PATH(userId)), {
    [`/${notificationId}/read`]: true,
  });
};

/** Mark all unread notifications as read */
export const markAllAsRead = async (
  userId: number | string,
  notifications: Notification[],
): Promise<void> => {
  const db = getFirebaseDB();
  const updates: Record<string, boolean> = {};
  notifications
    .filter((n) => !n.read)
    .forEach((n) => {
      if (n.id) updates[`/${n.id}/read`] = true;
    });

  if (Object.keys(updates).length > 0) {
    await update(ref(db, NOTIFICATIONS_PATH(userId)), updates);
  }
};

/** Delete a single notification */
export const deleteNotification = async (
  userId: number | string,
  notificationId: string,
): Promise<void> => {
  const db = getFirebaseDB();
  await remove(ref(db, `${NOTIFICATIONS_PATH(userId)}/${notificationId}`));
};

/** Clear all notifications for a user */
export const clearAllNotifications = async (
  userId: number | string,
): Promise<void> => {
  const db = getFirebaseDB();
  await remove(ref(db, NOTIFICATIONS_PATH(userId)));
};

/**
 * Subscribe to new incoming notifications in real-time.
 * Calls `onNewNotification` for every new child added.
 * Returns an unsubscribe function — call it on cleanup.
 */
export const subscribeToNotifications = (
  userId: number | string,
  onNewNotification: (notification: Notification) => void,
): Unsubscribe => {
  const db = getFirebaseDB();
  const notifRef = ref(db, NOTIFICATIONS_PATH(userId));

  // Listen to last 100 notifications; onChildAdded fires for each existing
  // child on first attach AND for each newly added child thereafter.
  const q = query(notifRef, limitToLast(100));

  const unsubscribe = onChildAdded(q, (snapshot) => {
    if (!snapshot.exists()) return;
    const data = snapshot.val() as Omit<Notification, "id">;
    const notification: Notification = { id: snapshot.key ?? undefined, ...data };
    onNewNotification(notification);
  });

  return unsubscribe;
};
