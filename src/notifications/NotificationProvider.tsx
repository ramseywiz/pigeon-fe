import { createContext, useCallback, useRef, useState, type ReactNode } from 'react';
import type { Notification, NotificationStatus, ResolveNotification } from './types';

const AUTO_DISMISS_MS: Record<Exclude<NotificationStatus, 'pending'>, number> = {
  success: 3000,
  error: 5000,
};

const EXIT_ANIMATION_MS = 220;

interface NotificationContextValue {
  notifications: Notification[];
  notify: (message: string) => ResolveNotification;
  dismiss: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Phase 1: mark as dismissing so the exit animation plays
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, dismissing: true } : n)));
    // Phase 2: remove after the animation finishes
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, EXIT_ANIMATION_MS);
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const notify = useCallback(
    (pendingMessage: string): ResolveNotification => {
      const id = crypto.randomUUID();

      setNotifications((prev) => [...prev, { id, message: pendingMessage, status: 'pending' }]);

      return (status, resolvedMessage) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, message: resolvedMessage, status } : n)),
        );
        const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS[status]);
        timers.current.set(id, timer);
      };
    },
    [dismiss],
  );

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
};
