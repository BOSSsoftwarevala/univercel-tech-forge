/**
 * useModuleState - Manages active module state for single-view isolation
 * STEP 9: Only ONE module view can be active at a time
 */

import { useState, useCallback, useMemo } from 'react';

export type ModuleState = 
  | 'BOSS_DASHBOARD'
  | 'SERVER_MANAGER'
  | 'FRANCHISE_MANAGER'
  | 'RESELLER_MANAGER'
  | 'DEVELOPMENT_MANAGER'
  | 'SUPPORT_MANAGER'
  | 'MARKETING_MANAGER'
  | 'PRODUCT_MANAGER'
  | 'LEAD_MANAGER'
  | 'FINANCE_MANAGER'
  | 'LEGAL_MANAGER'
  | 'TASK_MANAGER'
  | 'ROLE_MANAGER';

interface ModuleStateHistory {
  state: ModuleState;
  nav?: string;
  subNav?: string;
}

export function useModuleState(initialState: ModuleState = 'BOSS_DASHBOARD') {
  const [currentState, setCurrentState] = useState<ModuleState>(initialState);
  const [history, setHistory] = useState<ModuleStateHistory[]>([{ state: initialState }]);
  const [currentNav, setCurrentNav] = useState<string>('dashboard');
  const [currentSubNav, setCurrentSubNav] = useState<string | undefined>(undefined);

  // Set active module - STEP 9: Only one state = true at a time
  const setActiveModule = useCallback((state: ModuleState, nav?: string, subNav?: string) => {
    // Push current state to history before changing
    setHistory(prev => [...prev, { state: currentState, nav: currentNav, subNav: currentSubNav }]);
    
    // Set new state
    setCurrentState(state);
    setCurrentNav(nav || 'dashboard');
    setCurrentSubNav(subNav);
  }, [currentState, currentNav, currentSubNav]);

  // Go back to previous module
  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      const previousState = newHistory.pop()!;
      const targetState = newHistory[newHistory.length - 1];
      
      setHistory(newHistory);
      setCurrentState(targetState.state);
      setCurrentNav(targetState.nav || 'dashboard');
      setCurrentSubNav(targetState.subNav);
      
      return true;
    }
    return false;
  }, [history]);

  // Go home - always returns to Boss Dashboard
  const goHome = useCallback(() => {
    setHistory([{ state: 'BOSS_DASHBOARD' }]);
    setCurrentState('BOSS_DASHBOARD');
    setCurrentNav('dashboard');
    setCurrentSubNav(undefined);
  }, []);

  // Update navigation within current module (doesn't change module state)
  const setNavigation = useCallback((nav: string, subNav?: string) => {
    setCurrentNav(nav);
    setCurrentSubNav(subNav);
  }, []);

  // Check if a specific module is active
  const isModuleActive = useCallback((state: ModuleState) => {
    return currentState === state;
  }, [currentState]);

  // Get breadcrumb path
  const breadcrumbPath = useMemo(() => {
    const path: { label: string; state?: ModuleState; nav?: string }[] = [];
    
    // Always start with Boss Dashboard
    if (currentState !== 'BOSS_DASHBOARD') {
      path.push({ label: 'Boss Dashboard', state: 'BOSS_DASHBOARD' });
    }
    
    // Add current module
    const moduleLabels: Record<ModuleState, string> = {
      'BOSS_DASHBOARD': 'Dashboard',
      'SERVER_MANAGER': 'Server Control',
      'FRANCHISE_MANAGER': 'Franchise Management',
      'RESELLER_MANAGER': 'Reseller Management',
      'DEVELOPMENT_MANAGER': 'Development',
      'SUPPORT_MANAGER': 'Support',
      'MARKETING_MANAGER': 'Marketing',
      'PRODUCT_MANAGER': 'Product Demo',
      'LEAD_MANAGER': 'Lead Management',
      'FINANCE_MANAGER': 'Finance',
      'LEGAL_MANAGER': 'Legal',
      'TASK_MANAGER': 'Tasks',
      'ROLE_MANAGER': 'Roles',
    };
    
    path.push({ 
      label: moduleLabels[currentState] || currentState,
      state: currentState,
      nav: currentNav
    });
    
    // Add sub-navigation if exists
    if (currentSubNav && currentSubNav !== 'dashboard') {
      path.push({ 
        label: currentSubNav.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        nav: currentSubNav 
      });
    }
    
    return path;
  }, [currentState, currentNav, currentSubNav]);

  // Check if we can go back
  const canGoBack = history.length > 1;

  return {
    currentState,
    currentNav,
    currentSubNav,
    setActiveModule,
    setNavigation,
    goBack,
    goHome,
    isModuleActive,
    breadcrumbPath,
    canGoBack,
  };
}

export default useModuleState;
