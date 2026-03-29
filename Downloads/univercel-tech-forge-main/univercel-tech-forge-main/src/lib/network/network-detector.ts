/**
 * Network Detection & Quality Assessment
 * Detects connection type, speed, and quality for adaptive UI
 */

export type NetworkQuality = 'offline' | '2g' | '3g' | '4g' | 'wifi';
export type DataMode = 'ultra-low' | 'low' | 'normal' | 'high';

interface NetworkInfo {
  quality: NetworkQuality;
  dataMode: DataMode;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  isOnline: boolean;
  isMetered: boolean;
}

interface NetworkConnection {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
  addEventListener?: (event: string, callback: () => void) => void;
  removeEventListener?: (event: string, callback: () => void) => void;
}

type NetworkChangeCallback = (info: NetworkInfo) => void;

class NetworkDetector {
  private listeners: Set<NetworkChangeCallback> = new Set();
  private currentInfo: NetworkInfo;
  private measurementInterval: number | null = null;

  constructor() {
    this.currentInfo = this.detectNetwork();
    this.setupListeners();
  }

  private getConnection(): NetworkConnection | null {
    const nav = navigator as Navigator & { connection?: NetworkConnection; mozConnection?: NetworkConnection; webkitConnection?: NetworkConnection };
    return nav.connection || nav.mozConnection || nav.webkitConnection || null;
  }

  private detectNetwork(): NetworkInfo {
    const connection = this.getConnection();
    const isOnline = navigator.onLine;

    if (!isOnline) {
      return {
        quality: 'offline',
        dataMode: 'ultra-low',
        effectiveType: 'offline',
        downlink: 0,
        rtt: Infinity,
        saveData: true,
        isOnline: false,
        isMetered: true
      };
    }

    const effectiveType = connection?.effectiveType || '4g';
    const downlink = connection?.downlink || 10;
    const rtt = connection?.rtt || 50;
    const saveData = connection?.saveData || false;

    const quality = this.determineQuality(effectiveType, downlink, rtt);
    const dataMode = this.determineDataMode(quality, saveData);

    return {
      quality,
      dataMode,
      effectiveType,
      downlink,
      rtt,
      saveData,
      isOnline: true,
      isMetered: connection?.type === 'cellular'
    };
  }

  private determineQuality(effectiveType: string, downlink: number, rtt: number): NetworkQuality {
    // Prioritize actual measurements over reported type
    if (downlink < 0.1 || rtt > 2000) return '2g';
    if (downlink < 0.5 || rtt > 800) return '2g';
    if (downlink < 1.5 || rtt > 400) return '3g';
    if (downlink < 5 || rtt > 100) return '4g';
    
    // Fallback to reported type
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return '2g';
      case '3g':
        return '3g';
      case '4g':
        return '4g';
      default:
        return 'wifi';
    }
  }

  private determineDataMode(quality: NetworkQuality, saveData: boolean): DataMode {
    if (saveData) return 'ultra-low';
    switch (quality) {
      case 'offline':
      case '2g':
        return 'ultra-low';
      case '3g':
        return 'low';
      case '4g':
        return 'normal';
      case 'wifi':
        return 'high';
      default:
        return 'normal';
    }
  }

  private setupListeners(): void {
    window.addEventListener('online', () => this.handleChange());
    window.addEventListener('offline', () => this.handleChange());

    const connection = this.getConnection();
    if (connection?.addEventListener) {
      connection.addEventListener('change', () => this.handleChange());
    }

    // Periodic measurement for accuracy
    this.measurementInterval = window.setInterval(() => {
      this.measureActualSpeed();
    }, 30000);
  }

  private handleChange(): void {
    const newInfo = this.detectNetwork();
    if (JSON.stringify(newInfo) !== JSON.stringify(this.currentInfo)) {
      this.currentInfo = newInfo;
      this.notifyListeners();
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentInfo));
  }

  private async measureActualSpeed(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      const startTime = performance.now();
      // Use a tiny resource for measurement
      const response = await fetch('/favicon.ico', { 
        cache: 'no-store',
        method: 'HEAD'
      });
      const endTime = performance.now();
      
      const rtt = endTime - startTime;
      
      // Update based on actual measurement
      if (rtt > 2000 && this.currentInfo.quality !== '2g') {
        this.currentInfo = { ...this.currentInfo, quality: '2g', dataMode: 'ultra-low', rtt };
        this.notifyListeners();
      }
    } catch {
      // Measurement failed, possibly offline
    }
  }

  public getInfo(): NetworkInfo {
    return { ...this.currentInfo };
  }

  public subscribe(callback: NetworkChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  public isLowBandwidth(): boolean {
    return ['offline', '2g', '3g'].includes(this.currentInfo.quality);
  }

  public shouldReduceData(): boolean {
    return this.currentInfo.dataMode === 'ultra-low' || this.currentInfo.dataMode === 'low';
  }

  public destroy(): void {
    if (this.measurementInterval) {
      clearInterval(this.measurementInterval);
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const networkDetector = new NetworkDetector();

// React hook for network status
export function useNetworkStatus() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(networkDetector.getInfo());

  useEffect(() => {
    return networkDetector.subscribe(setNetworkInfo);
  }, []);

  return networkInfo;
}

// Import for hook
import { useState, useEffect } from 'react';
