import { useState, useEffect, useCallback } from 'react';

export type NetworkSpeed = 'fast' | 'medium' | 'slow' | 'offline';
export type NetworkType = '4g' | '3g' | '2g' | 'wifi' | 'ethernet' | 'unknown' | 'offline';
export type PerformanceMode = 'full' | 'lite' | 'ultra-lite';

interface NetworkInfo {
  isOnline: boolean;
  speed: NetworkSpeed;
  type: NetworkType;
  effectiveType: string;
  downlink: number; // Mbps
  rtt: number; // Round-trip time in ms
  saveData: boolean;
  performanceMode: PerformanceMode;
}

interface NavigatorConnection {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
}

declare global {
  interface Navigator {
    connection?: NavigatorConnection;
    mozConnection?: NavigatorConnection;
    webkitConnection?: NavigatorConnection;
  }
}

const getConnection = (): NavigatorConnection | null => {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
};

const determineNetworkSpeed = (connection: NavigatorConnection | null): NetworkSpeed => {
  if (!navigator.onLine) return 'offline';
  if (!connection) return 'medium';

  const effectiveType = connection.effectiveType || '';
  const downlink = connection.downlink || 0;
  const rtt = connection.rtt || 0;

  // Fast: 4G/WiFi with good metrics
  if ((effectiveType === '4g' || downlink > 5) && rtt < 100) {
    return 'fast';
  }
  
  // Slow: 2G or very poor metrics
  if (effectiveType === '2g' || effectiveType === 'slow-2g' || downlink < 0.5 || rtt > 400) {
    return 'slow';
  }
  
  // Medium: 3G or moderate metrics
  return 'medium';
};

const determineNetworkType = (connection: NavigatorConnection | null): NetworkType => {
  if (!navigator.onLine) return 'offline';
  if (!connection) return 'unknown';

  const effectiveType = connection.effectiveType || '';
  
  switch (effectiveType) {
    case '4g': return '4g';
    case '3g': return '3g';
    case '2g':
    case 'slow-2g': return '2g';
    default: return 'unknown';
  }
};

const determinePerformanceMode = (
  speed: NetworkSpeed,
  saveData: boolean,
  userPreference?: PerformanceMode
): PerformanceMode => {
  // User preference takes priority
  if (userPreference) return userPreference;
  
  // Save data mode forces lite
  if (saveData) return 'lite';
  
  // Auto-determine based on network
  switch (speed) {
    case 'fast': return 'full';
    case 'medium': return 'lite';
    case 'slow':
    case 'offline': return 'ultra-lite';
    default: return 'lite';
  }
};

export function useNetworkStatus() {
  const [userPreferredMode, setUserPreferredMode] = useState<PerformanceMode | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    const saved = localStorage.getItem('performanceMode');
    return saved as PerformanceMode | undefined;
  });

  const getNetworkInfo = useCallback((): NetworkInfo => {
    const connection = getConnection();
    const isOnline = navigator.onLine;
    const speed = determineNetworkSpeed(connection);
    const type = determineNetworkType(connection);
    const saveData = connection?.saveData || false;

    return {
      isOnline,
      speed,
      type,
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData,
      performanceMode: determinePerformanceMode(speed, saveData, userPreferredMode),
    };
  }, [userPreferredMode]);

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(getNetworkInfo);

  const updateNetworkInfo = useCallback(() => {
    setNetworkInfo(getNetworkInfo());
  }, [getNetworkInfo]);

  const setPerformanceMode = useCallback((mode: PerformanceMode | 'auto') => {
    if (mode === 'auto') {
      setUserPreferredMode(undefined);
      localStorage.removeItem('performanceMode');
    } else {
      setUserPreferredMode(mode);
      localStorage.setItem('performanceMode', mode);
    }
  }, []);

  useEffect(() => {
    updateNetworkInfo();
  }, [userPreferredMode, updateNetworkInfo]);

  useEffect(() => {
    const connection = getConnection();

    // Listen for online/offline changes
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    // Listen for connection changes
    if (connection?.addEventListener) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
      if (connection?.removeEventListener) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, [updateNetworkInfo]);

  return {
    ...networkInfo,
    setPerformanceMode,
    userPreferredMode,
    isAutoMode: !userPreferredMode,
  };
}

// Export types and hook only - Context provider should be in a .tsx file
export type { NetworkInfo };