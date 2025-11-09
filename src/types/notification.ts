/**
 * Notification type enum
 */
export enum NotificationType {
  BookRead = 'book-read',
  BookAdded = 'book-added',
  Milestone = 'milestone',
}

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  bookId?: string;
  bookTitle?: string;
  timestamp: number;
  read: boolean;
}

/**
 * Notification state interface for Zustand store
 */
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}
