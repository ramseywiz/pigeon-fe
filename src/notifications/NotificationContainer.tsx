import styles from './notification.module.css';
import { useNotification } from './useNotification';
import { NotificationItem } from './NotificationItem';

export const NotificationContainer = () => {
  const { notifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container}>
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
};
