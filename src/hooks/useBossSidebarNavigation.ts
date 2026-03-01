/**
 * Boss Sidebar Navigation Hook
 * Handles sidebar item routing and module activation
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBossDashboardStore, BossModule } from '@/stores/bossDashboardStore';
import { useEnterpriseAudit } from './useEnterpriseAudit';

export interface SidebarRoute {
  id: string;
  module: BossModule;
  path: string;
  label: string;
  isImplemented: boolean;
}

// Define all sidebar routes with their target modules
const SIDEBAR_ROUTES: SidebarRoute[] = [
  { id: 'dashboard', module: 'dashboard', path: '/boss/dashboard', label: 'Dashboard', isImplemented: true },
  { id: 'server-control', module: 'server', path: '/boss/server', label: 'Server Control', isImplemented: true },
  { id: 'vala-ai', module: 'vala-ai', path: '/boss/vala-ai', label: 'VALA AI', isImplemented: true },
  { id: 'franchise-control', module: 'franchise', path: '/boss/franchise', label: 'Franchise Control', isImplemented: true },
  { id: 'reseller-control', module: 'reseller', path: '/boss/reseller', label: 'Reseller Control', isImplemented: true },
  { id: 'marketing', module: 'marketing', path: '/boss/marketing', label: 'Marketing', isImplemented: true },
  { id: 'leads', module: 'leads', path: '/boss/leads', label: 'Lead Management', isImplemented: true },
  { id: 'product-demo', module: 'product-demo', path: '/boss/product-demo', label: 'Product Demo', isImplemented: true },
  { id: 'finance', module: 'finance', path: '/boss/finance', label: 'Finance', isImplemented: true },
  { id: 'security', module: 'security', path: '/boss/security', label: 'Security', isImplemented: true },
  { id: 'ai-ceo', module: 'ai-ceo', path: '/boss/ai-ceo', label: 'AIRA', isImplemented: true },
  { id: 'support-overview', module: 'support', path: '/boss/support', label: 'Support', isImplemented: true },
  { id: 'settings', module: 'settings', path: '/boss/settings', label: 'Settings', isImplemented: true },
];

export function useBossSidebarNavigation() {
  const navigate = useNavigate();
  const { logButtonClick } = useEnterpriseAudit();
  const { 
    activeModule, 
    activeSidebarItem,
    setActiveModule, 
    setActiveSidebarItem,
    navigateToModule,
    goBack 
  } = useBossDashboardStore();

  /**
   * Handle sidebar item click
   */
  const handleSidebarClick = useCallback(async (itemId: string) => {
    const route = SIDEBAR_ROUTES.find(r => r.id === itemId);
    
    if (!route) {
      toast.info('Coming Soon', { description: 'This feature is under development' });
      return;
    }

    if (!route.isImplemented) {
      toast.info('Coming Soon', { 
        description: `${route.label} will be available soon`,
        duration: 2000 
      });
      return;
    }

    // Log the navigation action
    await logButtonClick(
      `sidebar_${itemId}`,
      route.label,
      'system',
      { target_module: route.module }
    );

    // Update state
    setActiveSidebarItem(itemId);
    setActiveModule(route.module);

    // Show feedback
    toast.success(`Loading: ${route.label}`, { duration: 1500 });
  }, [logButtonClick, setActiveModule, setActiveSidebarItem]);

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    const success = goBack();
    if (!success) {
      // Already at root, go to dashboard
      navigateToModule('dashboard');
    }
    return success;
  }, [goBack, navigateToModule]);

  /**
   * Navigate to a specific module
   */
  const navigateTo = useCallback((module: BossModule, screen?: string) => {
    navigateToModule(module, screen);
    toast.success(`Opening: ${module.replace('-', ' ')}`, { duration: 1500 });
  }, [navigateToModule]);

  /**
   * Check if a sidebar item is active
   */
  const isActive = useCallback((itemId: string) => {
    return activeSidebarItem === itemId || activeModule === itemId;
  }, [activeSidebarItem, activeModule]);

  /**
   * Get route info for an item
   */
  const getRouteInfo = useCallback((itemId: string) => {
    return SIDEBAR_ROUTES.find(r => r.id === itemId);
  }, []);

  return {
    activeModule,
    activeSidebarItem,
    handleSidebarClick,
    handleBack,
    navigateTo,
    isActive,
    getRouteInfo,
    routes: SIDEBAR_ROUTES,
  };
}
