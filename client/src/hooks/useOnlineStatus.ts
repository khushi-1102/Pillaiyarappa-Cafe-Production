import { useEffect, useState } from 'react';
import { appStore } from '../services/store';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [justSyncedCount, setJustSyncedCount] = useState<number>(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically sync queued enquiries when returning online
      const synced = appStore.syncOfflineEnquiries();
      if (synced > 0) {
        setJustSyncedCount(synced);
        setTimeout(() => setJustSyncedCount(0), 4000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, justSyncedCount };
}
