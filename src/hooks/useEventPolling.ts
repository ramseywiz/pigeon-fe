import { useCallback, useEffect } from 'react';
import { fetchEvents } from '../store/eventSlice';
import { useAppDispatch } from '../store/hooks';
import { useNotification } from '../notifications/useNotification';

const POLL_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

export const useEventPolling = () => {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();

  const refresh = useCallback(async () => {
    const resolve = notify('Refreshing events...');
    try {
      await dispatch(fetchEvents()).unwrap();
      resolve('success', 'Events refreshed.');
    } catch {
      resolve('error', 'Failed to refresh events.');
    }
  }, [dispatch, notify]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh]);
};
