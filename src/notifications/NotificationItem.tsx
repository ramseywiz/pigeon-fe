import styles from './notification.module.css';
import type { Notification } from './types';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => (
  <div
    className={[
      styles.toast,
      styles[notification.status],
      notification.dismissing ? styles.dismissing : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {notification.message}
  </div>
);
