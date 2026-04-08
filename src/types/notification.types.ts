export interface Notification {
  /** Firebase push() key — used as list key */
  id?: string;
  title?: string;
  message?: string;
  type?: "info" | "success" | "warning" | "error" | "default";
  read?: boolean;
  /** Unix timestamp in milliseconds */
  timestamp?: number;
  /** Optional route to navigate to when clicked */
  link?: string;
  /** Display name of the sender */
  senderName?: string;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
}
