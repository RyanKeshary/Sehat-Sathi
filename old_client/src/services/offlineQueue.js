import { openDB } from 'idb';

const DB_NAME = 'sehatsetu_db';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Operation queue for syncing when back online
      if (!db.objectStoreNames.contains('offlineQueue')) {
        db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
      }
      
      // Cache for records, prescriptions etc.
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache');
      }
    },
  });
};

export const queueOfflineOperation = async (operation) => {
  const db = await initDB();
  return db.add('offlineQueue', {
    ...operation,
    timestamp: Date.now(),
    retryCount: 0,
  });
};

export const getQueuedOperations = async () => {
  const db = await initDB();
  return db.getAll('offlineQueue');
};

export const clearQueuedOperation = async (id) => {
  const db = await initDB();
  return db.delete('offlineQueue', id);
};

export const cacheData = async (key, data) => {
  const db = await initDB();
  return db.put('cache', data, key);
};

export const getCachedData = async (key) => {
  const db = await initDB();
  return db.get('cache', key);
};
