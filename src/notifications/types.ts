export type NotificationStatus = 'pending' | 'success' | 'error';

export interface Notification {
  id: string;
  message: string;
  status: NotificationStatus;
  dismissing?: boolean;
}

export type ResolveNotification = (
  status: Exclude<NotificationStatus, 'pending'>,
  message: string,
) => void;
