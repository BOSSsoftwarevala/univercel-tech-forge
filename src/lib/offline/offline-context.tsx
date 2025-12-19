/**
 * Offline Context Provider
 * Provides offline state and utilities throughout the app
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { networkDetector, NetworkQuality, DataMode } from '../network/network-detector';
import { offlineQueue } from '../offline/sync-queue';
import { cacheManager } from '../offline/cache-manager';
import { indexedDB } from '../offline/indexed-db';
import { registerServiceWorker } from '../offline/service-worker-registration';

interface OfflineContextValue {
  isOnline: boolean;
  networkQuality: NetworkQuality;
  dataMode: DataMode;
  pendingActions: number;
  lowDataMode: boolean;
  setLowDataMode: (enabled: boolean) => void;
  forceSync: () => void;
  clearCache: () => Promise<void>;
  getCacheStats: () => Promise<{ entries: number; size: number; maxSize: number }>;
}

const OfflineContext = createContext<OfflineContextValue | null>(null);

interface OfflineProviderProps {
  children: React.ReactNode;
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('wifi');
  const [dataMode, setDataMode] = useState<DataMode>('normal');
  const [pendingActions, setPendingActions] = useState(0);
  const [lowDataMode, setLowDataModeState] = useState(false);

  useEffect(() => {
    // Initialize offline infrastructure
    const init = async () => {
      await indexedDB.init();
      await registerServiceWorker();
      
      // Check for saved low-data preference
      const savedPref = localStorage.getItem('low_data_mode');
      if (savedPref === 'true') {
        setLowDataModeState(true);
      }
    };
    init();

    // Subscribe to network changes
    const unsubscribe = networkDetector.subscribe((info) => {
      setIsOnline(info.isOnline);
      setNetworkQuality(info.quality);
      setDataMode(info.dataMode);
    });

    // Initial network info
    const info = networkDetector.getInfo();
    setIsOnline(info.isOnline);
    setNetworkQuality(info.quality);
    setDataMode(info.dataMode);

    // Subscribe to sync queue changes
    const unsubscribeSync = offlineQueue.onSync(() => {
      updatePendingCount();
    });

    // Initial pending count
    updatePendingCount();

    return () => {
      unsubscribe();
      unsubscribeSync();
    };
  }, []);

  const updatePendingCount = useCallback(async () => {
    const count = await offlineQueue.getQueueSize();
    setPendingActions(count);
  }, []);

  const setLowDataMode = useCallback((enabled: boolean) => {
    setLowDataModeState(enabled);
    localStorage.setItem('low_data_mode', enabled.toString());
  }, []);

  const forceSync = useCallback(() => {
    offlineQueue.forceSync();
  }, []);

  const clearCache = useCallback(async () => {
    await cacheManager.clear();
  }, []);

  const getCacheStats = useCallback(async () => {
    return cacheManager.getStats();
  }, []);

  const value: OfflineContextValue = {
    isOnline,
    networkQuality,
    dataMode,
    pendingActions,
    lowDataMode: lowDataMode || dataMode === 'ultra-low' || dataMode === 'low',
    setLowDataMode,
    forceSync,
    clearCache,
    getCacheStats
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline(): OfflineContextValue {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}

// Export individual hooks for convenience
export function useNetworkQuality(): NetworkQuality {
  const { networkQuality } = useOffline();
  return networkQuality;
}

export function useIsOnline(): boolean {
  const { isOnline } = useOffline();
  return isOnline;
}

export function useLowDataMode(): [boolean, (enabled: boolean) => void] {
  const { lowDataMode, setLowDataMode } = useOffline();
  return [lowDataMode, setLowDataMode];
}
