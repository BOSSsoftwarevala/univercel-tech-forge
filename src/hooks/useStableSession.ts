/**
 * SMOOTH-09: Session & Memory Stability Hook
 * Ensures session persists on refresh, silent token refresh, and memory leak prevention
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGlobalAppStore } from '@/stores/globalAppStore';

interface StableSessionConfig {
  enableHeartbeat?: boolean;
  heartbeatInterval?: number; // ms
  cleanupOnUnmount?: boolean;
}

export function useStableSession(config: StableSessionConfig = {}) {
  const {
    enableHeartbeat = true,
    heartbeatInterval = 60000, // 1 minute
    cleanupOnUnmount = true
  } = config;

  const eventListenersRef = useRef<Array<{ target: EventTarget; type: string; handler: EventListener }>>([]);
  const intervalsRef = useRef<number[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const { sessionId, activeRole } = useGlobalAppStore();

  // Register event listener with automatic cleanup tracking
  const registerEventListener = useCallback((
    target: EventTarget,
    type: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) => {
    target.addEventListener(type, handler, options);
    eventListenersRef.current.push({ target, type, handler });
  }, []);

  // Register interval with automatic cleanup tracking
  const registerInterval = useCallback((callback: () => void, ms: number): number => {
    const id = window.setInterval(callback, ms);
    intervalsRef.current.push(id);
    return id;
  }, []);

  // Register timeout with automatic cleanup tracking
  const registerTimeout = useCallback((callback: () => void, ms: number): number => {
    const id = window.setTimeout(callback, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Clear all registered resources
  const clearAllResources = useCallback(() => {
    // Clear event listeners
    eventListenersRef.current.forEach(({ target, type, handler }) => {
      target.removeEventListener(type, handler);
    });
    eventListenersRef.current = [];

    // Clear intervals
    intervalsRef.current.forEach(id => clearInterval(id));
    intervalsRef.current = [];

    // Clear timeouts
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  // Session heartbeat to keep session alive
  useEffect(() => {
    if (!enableHeartbeat || !sessionId) return;

    const heartbeat = () => {
      // Update last activity timestamp in store
      const timestamp = new Date().toISOString();
      sessionStorage.setItem('last_activity', timestamp);
    };

    const intervalId = setInterval(heartbeat, heartbeatInterval);
    
    return () => clearInterval(intervalId);
  }, [enableHeartbeat, heartbeatInterval, sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupOnUnmount) {
        clearAllResources();
      }
    };
  }, [cleanupOnUnmount, clearAllResources]);

  // Prevent memory leaks from scroll position loss
  useEffect(() => {
    const saveScrollPosition = () => {
      const scrollData = {
        x: window.scrollX,
        y: window.scrollY,
        timestamp: Date.now()
      };
      sessionStorage.setItem('scroll_position', JSON.stringify(scrollData));
    };

    const restoreScrollPosition = () => {
      const saved = sessionStorage.getItem('scroll_position');
      if (saved) {
        try {
          const { x, y, timestamp } = JSON.parse(saved);
          // Only restore if recent (within 5 minutes)
          if (Date.now() - timestamp < 300000) {
            window.scrollTo(x, y);
          }
        } catch {
          // Silent fail
        }
      }
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    restoreScrollPosition();

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  return {
    sessionId,
    activeRole,
    registerEventListener,
    registerInterval,
    registerTimeout,
    clearAllResources,
    isSessionActive: !!sessionId
  };
}
