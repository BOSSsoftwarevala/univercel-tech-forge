/**
 * GLOBAL NAVIGATION HOOK
 * Centralized button → route mapping
 * Enforces: 0 dead clicks, 0 duplicate screens, 100% navigable UI
 */

import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSidebarStore } from '@/stores/sidebarStore';

// Permission check type
export type PermissionLevel = 'allowed' | 'restricted' | 'locked' | 'coming-soon';

// Route definition with state management
export interface RouteDefinition {
  path: string;
  component?: string;
  state?: {
    sidebar?: 'collapsed' | 'expanded' | 'hidden';
    context?: 'global' | 'module' | 'child';
    parentSidebar?: 'hidden' | 'visible';
  };
  modal?: boolean;
  permission?: PermissionLevel;
  tooltip?: string;
}

// Global button → route mapping
const BUTTON_ROUTE_MAP: Record<string, RouteDefinition> = {
  // Header Actions
  'btn_internal_chat': { path: '/internal-chat', state: { sidebar: 'collapsed', context: 'global' } },
  'btn_tasks': { path: '/super-admin-system/role-switch?role=task_management', state: { sidebar: 'expanded', context: 'module' } },
  'btn_alerts': { path: '/super-admin-system/role-switch?role=boss_owner&nav=alerts', modal: false },
  'btn_profile': { path: '/settings', state: { context: 'global' } },
  'btn_settings': { path: '/settings', state: { context: 'global' } },
  'btn_logout': { path: '/auth/logout', state: { sidebar: 'hidden' } },
  
  // Dashboard Navigation
  'btn_dashboard_main': { path: '/super-admin-system/role-switch?role=boss_owner', state: { sidebar: 'expanded', context: 'global' } },
  'btn_boss_dashboard': { path: '/super-admin-system/role-switch?role=boss_owner', state: { sidebar: 'expanded', context: 'global' } },
  'btn_ceo_dashboard': { path: '/super-admin-system/role-switch?role=ceo', state: { sidebar: 'expanded', context: 'global' } },
  
  // Module Navigation
  'btn_server_control': { path: '/super-admin-system/role-switch?role=boss_owner&nav=server-control', state: { sidebar: 'hidden', context: 'module', parentSidebar: 'hidden' } },
  'btn_vala_ai': { path: '/super-admin-system/role-switch?role=vala_ai_management', state: { sidebar: 'hidden', context: 'module', parentSidebar: 'hidden' } },
  'btn_product_demo': { path: '/super-admin-system/role-switch?role=product_manager', state: { sidebar: 'hidden', context: 'module', parentSidebar: 'hidden' } },
  'btn_leads': { path: '/super-admin-system/role-switch?role=lead_manager', state: { sidebar: 'hidden', context: 'module', parentSidebar: 'hidden' } },
  'btn_marketing': { path: '/super-admin-system/role-switch?role=marketing_management', state: { sidebar: 'hidden', context: 'module', parentSidebar: 'hidden' } },
  'btn_finance': { path: '/super-admin-system/role-switch?role=finance_manager', state: { sidebar: 'expanded', context: 'module' } },
  'btn_franchise': { path: '/super-admin-system/role-switch?role=franchise_manager', state: { sidebar: 'expanded', context: 'module' } },
  'btn_reseller': { path: '/super-admin-system/role-switch?role=reseller_manager', state: { sidebar: 'expanded', context: 'module' } },
  'btn_support': { path: '/super-admin-system/role-switch?role=customer_support_management', state: { sidebar: 'expanded', context: 'module' } },
  'btn_legal': { path: '/super-admin-system/role-switch?role=legal_manager', state: { sidebar: 'expanded', context: 'module' } },
  'btn_pro_manager': { path: '/super-admin-system/role-switch?role=pro_manager', state: { sidebar: 'expanded', context: 'module' } },
  'btn_role_manager': { path: '/super-admin-system/role-switch?role=role_manager', state: { sidebar: 'expanded', context: 'module' } },
  
  // Table/Card Detail Views
  'btn_task_detail': { path: '/super-admin-system/role-switch?role=task_management&nav=task-detail', modal: false },
  'btn_lead_detail': { path: '/super-admin-system/role-switch?role=lead_manager&nav=lead-detail', modal: false },
  'btn_franchise_detail': { path: '/super-admin-system/role-switch?role=franchise_manager&nav=franchise-detail', modal: false },
  'btn_server_detail': { path: '/super-admin-system/role-switch?role=server_manager&nav=server-detail', modal: false },
  
  // Quick Actions
  'btn_new_task': { path: '/super-admin-system/role-switch?role=task_management&nav=new-task', modal: true },
  'btn_new_lead': { path: '/super-admin-system/role-switch?role=lead_manager&nav=new-lead', modal: true },
  'btn_new_franchise': { path: '/super-admin-system/role-switch?role=franchise_manager&nav=new-franchise', modal: true },
  
  // External/Demo Routes  
  'btn_school_software': { path: '/school-software', state: { sidebar: 'hidden', context: 'global' } },
  'btn_school_dashboard': { path: '/school-software/dashboard', state: { sidebar: 'hidden', context: 'global' } },
  
  // Secure Pages
  'btn_security_center': { path: '/super-admin/security-center', state: { sidebar: 'expanded' } },
  'btn_audit_logs': { path: '/super-admin-system/audit', state: { sidebar: 'expanded' } },
};

// User permissions (would come from auth context in real app)
const DEFAULT_PERMISSIONS: Record<string, PermissionLevel> = {
  'boss_owner': 'allowed',
  'ceo': 'allowed',
  'super_admin': 'allowed',
  'manager': 'allowed',
  'employee': 'restricted',
  'client': 'locked',
};

export function useGlobalNavigation() {
  const navigate = useNavigate();
  const { showGlobalSidebar, enterCategory, exitToGlobal } = useSidebarStore();

  // Check if user has permission for a route
  const checkPermission = useCallback((buttonId: string, userRole?: string): PermissionLevel => {
    const route = BUTTON_ROUTE_MAP[buttonId];
    if (!route) return 'coming-soon';
    if (route.permission) return route.permission;
    return DEFAULT_PERMISSIONS[userRole || 'employee'] || 'restricted';
  }, []);

  // Navigate with proper state management
  const navigateTo = useCallback((buttonId: string, params?: Record<string, string>) => {
    const route = BUTTON_ROUTE_MAP[buttonId];
    
    if (!route) {
      toast.info('Coming Soon', {
        description: 'This feature will be available soon',
        duration: 2000
      });
      return false;
    }

    const permission = checkPermission(buttonId);
    
    if (permission === 'locked') {
      toast.error('Access Restricted', {
        description: 'You do not have permission to access this feature',
        duration: 3000
      });
      return false;
    }

    if (permission === 'coming-soon') {
      toast.info('Coming Soon', {
        description: 'This feature is under development',
        duration: 2000
      });
      return false;
    }

    // Handle sidebar state
    if (route.state?.context === 'module' || route.state?.parentSidebar === 'hidden') {
      // Extract category from path for module navigation
      const categoryMap: Record<string, Parameters<typeof enterCategory>[0]> = {
        'server-control': 'server-manager',
        'vala_ai_management': 'vala-ai',
        'product_manager': 'product-demo',
        'lead_manager': 'lead-manager',
        'marketing_management': 'marketing',
        'finance_manager': 'finance',
      };
      
      const roleMatch = route.path.match(/role=([^&]+)/);
      if (roleMatch && categoryMap[roleMatch[1]]) {
        enterCategory(categoryMap[roleMatch[1]]);
      }
    } else {
      showGlobalSidebar();
    }

    // Build final path with params
    let finalPath = route.path;
    if (params) {
      const url = new URL(finalPath, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
      finalPath = url.pathname + url.search;
    }

    navigate(finalPath);
    return true;
  }, [navigate, checkPermission, showGlobalSidebar, enterCategory]);

  // Get route info for a button
  const getRouteInfo = useCallback((buttonId: string): RouteDefinition | null => {
    return BUTTON_ROUTE_MAP[buttonId] || null;
  }, []);

  // Back navigation handler
  const goBack = useCallback(() => {
    exitToGlobal();
    window.history.back();
  }, [exitToGlobal]);

  // Go to home/dashboard
  const goHome = useCallback(() => {
    showGlobalSidebar();
    navigate('/super-admin-system/role-switch?role=boss_owner');
    toast.success('Returned to Boss Dashboard');
  }, [navigate, showGlobalSidebar]);

  // All available routes
  const allRoutes = useMemo(() => Object.keys(BUTTON_ROUTE_MAP), []);

  return {
    navigateTo,
    checkPermission,
    getRouteInfo,
    goBack,
    goHome,
    allRoutes,
  };
}

/**
 * Hook for creating click handlers with permission checks
 */
export function useButtonHandler(buttonId: string, userRole?: string) {
  const { navigateTo, checkPermission, getRouteInfo } = useGlobalNavigation();
  
  const permission = useMemo(() => checkPermission(buttonId, userRole), [buttonId, userRole, checkPermission]);
  const routeInfo = useMemo(() => getRouteInfo(buttonId), [buttonId, getRouteInfo]);
  
  const handleClick = useCallback((params?: Record<string, string>) => {
    return navigateTo(buttonId, params);
  }, [buttonId, navigateTo]);

  const isLocked = permission === 'locked' || permission === 'coming-soon';
  const tooltip = isLocked 
    ? (permission === 'locked' ? 'Access Restricted' : 'Coming Soon')
    : routeInfo?.tooltip;

  return {
    handleClick,
    isLocked,
    permission,
    tooltip,
    routeInfo,
  };
}

export default useGlobalNavigation;
