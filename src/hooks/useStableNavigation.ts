/**
 * SMOOTH-01 & SMOOTH-02: Unified Navigation State Manager
 * Single global app state controller with route stability
 */

import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalAppStore } from '@/stores/globalAppStore';
import { useSidebarStore } from '@/stores/sidebarStore';

interface NavigationState {
  previousPath: string | null;
  currentPath: string;
  timestamp: number;
  role: string | null;
}

const NAVIGATION_HISTORY_KEY = 'nav_history_stack';
const MAX_HISTORY = 20;

export function useStableNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole, activeModule, setActiveModule } = useGlobalAppStore();
  const { activeContext, showGlobalSidebar, exitToGlobal } = useSidebarStore();
  
  const isNavigatingRef = useRef(false);
  const lastNavigationRef = useRef<number>(0);
  const historyStackRef = useRef<NavigationState[]>([]);

  // Load history from session storage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(NAVIGATION_HISTORY_KEY);
      if (stored) {
        historyStackRef.current = JSON.parse(stored);
      }
    } catch {
      historyStackRef.current = [];
    }
  }, []);

  // Save current location to history
  useEffect(() => {
    const state: NavigationState = {
      previousPath: historyStackRef.current[historyStackRef.current.length - 1]?.currentPath || null,
      currentPath: location.pathname + location.search,
      timestamp: Date.now(),
      role: activeRole
    };

    // Don't duplicate consecutive same paths
    const lastEntry = historyStackRef.current[historyStackRef.current.length - 1];
    if (lastEntry?.currentPath !== state.currentPath) {
      historyStackRef.current.push(state);
      
      // Limit history size
      if (historyStackRef.current.length > MAX_HISTORY) {
        historyStackRef.current = historyStackRef.current.slice(-MAX_HISTORY);
      }
      
      // Persist
      try {
        sessionStorage.setItem(NAVIGATION_HISTORY_KEY, JSON.stringify(historyStackRef.current));
      } catch {
        // Silent fail
      }
    }
  }, [location, activeRole]);

  // Stable navigation with debounce
  const navigateTo = useCallback((
    path: string,
    options?: { replace?: boolean; state?: unknown }
  ): boolean => {
    const now = Date.now();
    
    // Prevent rapid navigation (debounce 100ms)
    if (now - lastNavigationRef.current < 100) {
      return false;
    }
    
    // Prevent navigation while already navigating
    if (isNavigatingRef.current) {
      return false;
    }

    isNavigatingRef.current = true;
    lastNavigationRef.current = now;

    try {
      navigate(path, {
        replace: options?.replace,
        state: options?.state
      });
      return true;
    } finally {
      // Reset after a brief delay
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 50);
    }
  }, [navigate]);

  // Go back using history stack
  const goBack = useCallback((fallbackPath = '/super-admin-system/control-panel'): boolean => {
    // Pop current entry
    historyStackRef.current.pop();
    
    // Get previous entry
    const previousEntry = historyStackRef.current[historyStackRef.current.length - 1];
    
    if (previousEntry) {
      return navigateTo(previousEntry.currentPath, { replace: true });
    }
    
    // Fallback to control panel
    return navigateTo(fallbackPath, { replace: true });
  }, [navigateTo]);

  // Navigate to control panel (reset state)
  const goToControlPanel = useCallback((): boolean => {
    // Clear sidebar state
    exitToGlobal();
    showGlobalSidebar();
    
    return navigateTo('/super-admin-system/control-panel', { replace: true });
  }, [navigateTo, exitToGlobal, showGlobalSidebar]);

  // Check if can go back
  const canGoBack = useCallback((): boolean => {
    return historyStackRef.current.length > 1;
  }, []);

  // Get current navigation state
  const getCurrentState = useCallback((): NavigationState | null => {
    return historyStackRef.current[historyStackRef.current.length - 1] || null;
  }, []);

  // Clear navigation history
  const clearHistory = useCallback((): void => {
    historyStackRef.current = [];
    sessionStorage.removeItem(NAVIGATION_HISTORY_KEY);
  }, []);

  return {
    navigateTo,
    goBack,
    goToControlPanel,
    canGoBack,
    getCurrentState,
    clearHistory,
    isNavigating: isNavigatingRef.current,
    currentPath: location.pathname + location.search,
    activeRole,
    activeModule,
    sidebarContext: activeContext
  };
}
