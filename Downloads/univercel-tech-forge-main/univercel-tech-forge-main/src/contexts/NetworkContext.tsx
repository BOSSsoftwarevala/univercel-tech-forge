import React, { createContext, useContext, ReactNode } from 'react';
import { useNetworkStatus, PerformanceMode } from '@/hooks/useNetworkStatus';

interface NetworkContextType {
  isOnline: boolean;
  speed: 'fast' | 'medium' | 'slow' | 'offline';
  type: '4g' | '3g' | '2g' | 'wifi' | 'ethernet' | 'unknown' | 'offline';
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  performanceMode: PerformanceMode;
  setPerformanceMode: (mode: PerformanceMode | 'auto') => void;
  userPreferredMode: PerformanceMode | undefined;
  isAutoMode: boolean;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const networkStatus = useNetworkStatus();
  
  return (
    <NetworkContext.Provider value={networkStatus}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextType {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}