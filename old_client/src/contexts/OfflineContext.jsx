import React, { createContext, useContext, useState, useEffect } from 'react';
import { getQueuedOperations } from '../services/offlineQueue';

const OfflineContext = createContext(null);

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for pending operations
    checkPendingSync();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPendingSync = async () => {
    const ops = await getQueuedOperations();
    setPendingSyncCount(ops.length);
  };

  useEffect(() => {
    if (isOnline) {
      // Logic to trigger sync service would go here
      console.log('App is online. Ready to sync queued operations.');
    }
  }, [isOnline]);

  return (
    <OfflineContext.Provider value={{ isOnline, pendingSyncCount, checkPendingSync }}>
      {children}
      
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-[#D97706] text-white py-1 px-4 text-xs font-bold text-center z-[10000] animate-pulse">
          You are currently offline. Changes will be saved and synced later.
        </div>
      )}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
