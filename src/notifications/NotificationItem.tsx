import styles from './notification.module.css';
import type { Notification } from './types';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => (
  <div className={`${styles.toast} ${notification.dismissing ? styles.dismissing : ''}`}>
    {notification.message}
  </div>
);
