'use client';

import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false);

  const syncData = async () => {
    setIsSyncing(true);
    // Simulate syncing offline data to server
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    return { success: true, syncedRecords: 3 };
  };

  return { isSyncing, syncData };
}
