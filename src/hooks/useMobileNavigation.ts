/**
 * Mobile Navigation Hook
 * Handles drawer-based navigation for mobile app
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCapacitorMobile } from './useCapacitorMobile';

interface MobileNavState {
  isDrawerOpen: boolean;
  canGoBack: boolean;
  currentSection: string;
  historyStack: string[];
}

export function useMobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isNative, triggerHaptic } = useCapacitorMobile();

  const [state, setState] = useState<MobileNavState>({
    isDrawerOpen: false,
    canGoBack: false,
    currentSection: 'dashboard',
    historyStack: []
  });

  // Track navigation history
  useEffect(() => {
    setState(prev => ({
      ...prev,
      historyStack: [...prev.historyStack, location.pathname].slice(-10),
      canGoBack: prev.historyStack.length > 0
    }));
  }, [location.pathname]);

  /**
   * Open drawer with haptic feedback
   */
  const openDrawer = useCallback(async () => {
    if (isNative) await triggerHaptic('light');
    setState(prev => ({ ...prev, isDrawerOpen: true }));
  }, [isNative, triggerHaptic]);

  /**
   * Close drawer with haptic feedback
   */
  const closeDrawer = useCallback(async () => {
    if (isNative) await triggerHaptic('light');
    setState(prev => ({ ...prev, isDrawerOpen: false }));
  }, [isNative, triggerHaptic]);

  /**
   * Toggle drawer state
   */
  const toggleDrawer = useCallback(async () => {
    if (isNative) await triggerHaptic('light');
    setState(prev => ({ ...prev, isDrawerOpen: !prev.isDrawerOpen }));
  }, [isNative, triggerHaptic]);

  /**
   * Navigate to section with drawer close
   */
  const navigateToSection = useCallback(async (section: string, path?: string) => {
    if (isNative) await triggerHaptic('medium');
    
    setState(prev => ({ 
      ...prev, 
      isDrawerOpen: false,
      currentSection: section 
    }));

    if (path) {
      navigate(path);
    }
  }, [isNative, triggerHaptic, navigate]);

  /**
   * Go back with haptic feedback
   */
  const goBack = useCallback(async () => {
    if (isNative) await triggerHaptic('light');
    
    if (state.historyStack.length > 1) {
      const newStack = [...state.historyStack];
      newStack.pop(); // Remove current
      const previousPath = newStack[newStack.length - 1];
      
      setState(prev => ({
        ...prev,
        historyStack: newStack,
        canGoBack: newStack.length > 1
      }));

      navigate(previousPath || '/control-panel');
    } else {
      navigate('/control-panel');
    }
  }, [isNative, triggerHaptic, state.historyStack, navigate]);

  /**
   * Exit to control panel
   */
  const exitToControlPanel = useCallback(async () => {
    if (isNative) await triggerHaptic('medium');
    
    setState(prev => ({
      ...prev,
      isDrawerOpen: false,
      historyStack: [],
      currentSection: 'dashboard'
    }));

    navigate('/control-panel');
  }, [isNative, triggerHaptic, navigate]);

  return {
    ...state,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    navigateToSection,
    goBack,
    exitToControlPanel,
    isNative
  };
}
