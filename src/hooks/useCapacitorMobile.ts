/**
 * Capacitor Mobile Hook
 * Handles native mobile features for Android APK
 */

import { useEffect, useCallback, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';

interface MobileState {
  isNative: boolean;
  platform: string;
  isOnline: boolean;
  isReady: boolean;
}

export function useCapacitorMobile() {
  const [state, setState] = useState<MobileState>({
    isNative: false,
    platform: 'web',
    isOnline: navigator.onLine,
    isReady: false
  });

  useEffect(() => {
    // Detect if running in Capacitor native app
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();

    setState(prev => ({
      ...prev,
      isNative,
      platform,
      isReady: true
    }));

    // Online/Offline detection
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Handle Android back button
    if (isNative) {
      const handleBackButton = (e: Event) => {
        e.preventDefault();
        
        // Check if we can go back in history
        if (window.history.length > 1) {
          window.history.back();
        }
      };

      document.addEventListener('backbutton', handleBackButton);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        document.removeEventListener('backbutton', handleBackButton);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Trigger haptic feedback on button press
   */
  const triggerHaptic = useCallback(async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!state.isNative) return;

    try {
      const styleMap = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy
      };

      await Haptics.impact({ style: styleMap[style] });
    } catch {
      // Haptics not available
    }
  }, [state.isNative]);

  /**
   * Hide splash screen when app is ready
   */
  const hideSplash = useCallback(async () => {
    if (!state.isNative) return;

    try {
      await SplashScreen.hide();
    } catch {
      // Splash screen not available
    }
  }, [state.isNative]);

  /**
   * Set status bar style
   */
  const setStatusBar = useCallback(async (dark: boolean = true) => {
    if (!state.isNative) return;

    try {
      await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
      await StatusBar.setBackgroundColor({ color: '#1a1a2e' });
    } catch {
      // Status bar not available
    }
  }, [state.isNative]);

  /**
   * Get device info
   */
  const getDeviceInfo = useCallback(async () => {
    if (!state.isNative) {
      return {
        platform: 'web',
        model: navigator.userAgent,
        operatingSystem: 'browser',
        osVersion: 'N/A',
        isVirtual: false
      };
    }

    try {
      return await Device.getInfo();
    } catch {
      return null;
    }
  }, [state.isNative]);

  /**
   * Check network status
   */
  const getNetworkStatus = useCallback(async () => {
    if (!state.isNative) {
      return {
        connected: navigator.onLine,
        connectionType: 'unknown'
      };
    }

    try {
      return await Network.getStatus();
    } catch {
      return { connected: navigator.onLine, connectionType: 'unknown' };
    }
  }, [state.isNative]);

  return {
    ...state,
    triggerHaptic,
    hideSplash,
    setStatusBar,
    getDeviceInfo,
    getNetworkStatus
  };
}
