import { useState, useEffect, useCallback, useRef } from 'react';

interface SyncItem {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retries: number;
}

const SYNC_QUEUE_KEY = 'offline_sync_queue';
const MAX_RETRIES = 3;

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncInProgress = useRef(false);

  // Load queue from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SYNC_QUEUE_KEY);
    if (stored) {
      try {
        setSyncQueue(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SYNC_QUEUE_KEY);
      }
    }
  }, []);

  // Persist queue to localStorage
  useEffect(() => {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
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

  const addToQueue = useCallback((item: Omit<SyncItem, 'id' | 'timestamp' | 'retries'>) => {
    const newItem: SyncItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0
    };
    
    setSyncQueue(prev => [...prev, newItem]);
    
    // If online, try to sync immediately
    if (navigator.onLine) {
      processQueue();
    }
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setSyncQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const processQueue = useCallback(async () => {
    if (syncInProgress.current || !navigator.onLine) return;
    
    syncInProgress.current = true;
    setIsSyncing(true);

    const queue = [...syncQueue];
    
    for (const item of queue) {
      if (item.retries >= MAX_RETRIES) {
        console.error('Max retries reached for sync item:', item);
        removeFromQueue(item.id);
        continue;
      }

      try {
        // Import supabase dynamically to avoid circular deps
        const { supabase } = await import('@/integrations/supabase/client');
        
        let error;
        
        switch (item.type) {
          case 'insert':
            ({ error } = await (supabase.from(item.table as any) as any).insert(item.data));
            break;
          case 'update':
            ({ error } = await (supabase.from(item.table as any) as any).update(item.data).eq('id', item.data.id));
            break;
          case 'delete':
            ({ error } = await (supabase.from(item.table as any) as any).delete().eq('id', item.data.id));
            break;
        }

        if (error) throw error;
        
        removeFromQueue(item.id);
      } catch (error) {
        console.error('Sync error:', error);
        setSyncQueue(prev => 
          prev.map(i => 
            i.id === item.id ? { ...i, retries: i.retries + 1 } : i
          )
        );
      }
    }

    syncInProgress.current = false;
    setIsSyncing(false);
  }, [syncQueue, removeFromQueue]);

  // Periodic sync attempt
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine && syncQueue.length > 0) {
        processQueue();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [syncQueue, processQueue]);

  return {
    isOnline,
    isSyncing,
    syncQueue,
    queueLength: syncQueue.length,
    addToQueue,
    removeFromQueue,
    processQueue,
    clearQueue: () => setSyncQueue([])
  };
};

export default useOfflineSync;
