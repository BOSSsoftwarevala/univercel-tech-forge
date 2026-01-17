/**
 * STEP 10: Sidebar & Button End-to-End Functionality Hook
 * Every sidebar item and button must trigger a state, open a screen, or execute an action
 */

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

// Action types for sidebar items
export type SidebarActionType = 
  | 'open_screen' 
  | 'submit_form' 
  | 'run_process' 
  | 'open_drawer' 
  | 'open_modal'
  | 'coming_soon';

// Screen action mapping
export interface ScreenAction {
  actionType: SidebarActionType;
  targetScreenId: string;
  successState?: string;
  failureState?: string;
  label: string;
  description?: string;
  isReady: boolean;
}

// Button types with visual styling
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonAction {
  id: string;
  label: string;
  variant: ButtonVariant;
  actionType: SidebarActionType;
  targetScreenId?: string;
  requiresConfirmation?: boolean;
  isReady: boolean;
}

// CRUD screen mapping for each entity
export interface CRUDScreenSet {
  create: string;
  read: string;
  update: string;
  archive: string;
}

// Master action registry - every subcategory ID maps to an action
export const SIDEBAR_ACTION_REGISTRY: Record<string, ScreenAction> = {
  // Boss Owner - Operations
  'overview': { actionType: 'open_screen', targetScreenId: 'boss-overview', label: 'Overview', isReady: true },
  'metrics': { actionType: 'open_screen', targetScreenId: 'boss-metrics', label: 'Key Metrics', isReady: true },
  'alerts': { actionType: 'open_screen', targetScreenId: 'boss-alerts', label: 'Critical Alerts', isReady: true },
  'pending-approvals': { actionType: 'open_screen', targetScreenId: 'approvals-pending', label: 'Pending Approvals', isReady: true },
  'approved-list': { actionType: 'open_screen', targetScreenId: 'approvals-approved', label: 'Approved List', isReady: true },
  'rejected-list': { actionType: 'open_screen', targetScreenId: 'approvals-rejected', label: 'Rejected List', isReady: true },
  
  // Infrastructure - Server Control
  'server-overview': { actionType: 'open_screen', targetScreenId: 'server-dashboard', label: 'Server Overview', isReady: true },
  'server-add': { actionType: 'open_modal', targetScreenId: 'server-create-modal', label: 'Add Server', isReady: true },
  'server-active': { actionType: 'open_screen', targetScreenId: 'server-list', label: 'Active Servers', isReady: true },
  'server-health': { actionType: 'open_screen', targetScreenId: 'server-health', label: 'Health & Load', isReady: true },
  'server-security': { actionType: 'open_screen', targetScreenId: 'server-security', label: 'Security', isReady: true },
  
  // Infrastructure - Development
  'dev-overview': { actionType: 'open_screen', targetScreenId: 'dev-dashboard', label: 'Dev Overview', isReady: true },
  'dev-tasks': { actionType: 'open_screen', targetScreenId: 'dev-tasks-list', label: 'Dev Tasks', isReady: true },
  'dev-bugs': { actionType: 'open_screen', targetScreenId: 'dev-bugs-list', label: 'Bug Tracker', isReady: true },
  'dev-releases': { actionType: 'open_screen', targetScreenId: 'dev-releases', label: 'Releases', isReady: true },
  
  // Business - Franchise
  'franchise-list': { actionType: 'open_screen', targetScreenId: 'franchise-all', label: 'All Franchises', isReady: true },
  'franchise-performance': { actionType: 'open_screen', targetScreenId: 'franchise-performance', label: 'Performance', isReady: true },
  'franchise-issues': { actionType: 'open_screen', targetScreenId: 'franchise-issues', label: 'Issues', isReady: true },
  
  // Business - Reseller
  'reseller-list': { actionType: 'open_screen', targetScreenId: 'reseller-all', label: 'All Resellers', isReady: true },
  'reseller-tiers': { actionType: 'open_screen', targetScreenId: 'reseller-tiers', label: 'Tiers', isReady: true },
  'reseller-commissions': { actionType: 'open_screen', targetScreenId: 'reseller-commissions', label: 'Commissions', isReady: true },
  
  // Business - Finance
  'finance-overview': { actionType: 'open_screen', targetScreenId: 'finance-dashboard', label: 'Finance Overview', isReady: true },
  'finance-transactions': { actionType: 'open_screen', targetScreenId: 'finance-transactions', label: 'Transactions', isReady: true },
  'finance-payouts': { actionType: 'open_screen', targetScreenId: 'finance-payouts', label: 'Payouts', isReady: true },
  
  // Growth - Marketing
  'marketing-dashboard': { actionType: 'open_screen', targetScreenId: 'marketing-main', label: 'Marketing Dashboard', isReady: true },
  'marketing-campaigns': { actionType: 'open_screen', targetScreenId: 'marketing-campaigns', label: 'Campaigns', isReady: true },
  'marketing-leads': { actionType: 'open_screen', targetScreenId: 'leads-all', label: 'All Leads', isReady: true },
  
  // Growth - Product
  'product-catalog': { actionType: 'open_screen', targetScreenId: 'product-list', label: 'Product Catalog', isReady: true },
  'product-demos': { actionType: 'open_screen', targetScreenId: 'demo-manager', label: 'Demo Manager', isReady: true },
  'product-pricing': { actionType: 'open_screen', targetScreenId: 'pricing-manager', label: 'Pricing', isReady: true },
  
  // Support & Security
  'support-tickets': { actionType: 'open_screen', targetScreenId: 'support-tickets-list', label: 'Tickets', isReady: true },
  'support-team': { actionType: 'open_screen', targetScreenId: 'support-team', label: 'Support Team', isReady: true },
  'support-sla': { actionType: 'open_screen', targetScreenId: 'support-sla', label: 'SLA Config', isReady: true },
  'security-overview': { actionType: 'open_screen', targetScreenId: 'security-main', label: 'Security Overview', isReady: true },
  'security-audit': { actionType: 'open_screen', targetScreenId: 'audit-log', label: 'Audit Log', isReady: true },
  'security-alerts': { actionType: 'open_screen', targetScreenId: 'security-alerts', label: 'Security Alerts', isReady: true },
  
  // System - Settings
  'settings-general': { actionType: 'open_screen', targetScreenId: 'settings-general', label: 'General Settings', isReady: true },
  'settings-users': { actionType: 'open_screen', targetScreenId: 'settings-users', label: 'User Management', isReady: true },
  'settings-permissions': { actionType: 'open_screen', targetScreenId: 'settings-permissions', label: 'Permissions', isReady: true },
  
  // CEO Views
  'ceo-overview': { actionType: 'open_screen', targetScreenId: 'ceo-dashboard', label: 'Business Overview', isReady: true },
  'ceo-revenue': { actionType: 'open_screen', targetScreenId: 'ceo-revenue', label: 'Revenue Insights', isReady: true },
  'ceo-analytics': { actionType: 'open_screen', targetScreenId: 'ceo-analytics', label: 'Analytics', isReady: true },
  'ceo-reports': { actionType: 'open_screen', targetScreenId: 'ceo-reports', label: 'Reports', isReady: true },
  
  // Continent Super Admin
  'csa-asia': { actionType: 'open_screen', targetScreenId: 'continent-asia', label: 'Asia Super Admin', isReady: true },
  'csa-africa': { actionType: 'open_screen', targetScreenId: 'continent-africa', label: 'Africa Super Admin', isReady: true },
  'csa-europe': { actionType: 'open_screen', targetScreenId: 'continent-europe', label: 'Europe Super Admin', isReady: true },
  'csa-north-america': { actionType: 'open_screen', targetScreenId: 'continent-na', label: 'North America', isReady: true },
  'csa-south-america': { actionType: 'open_screen', targetScreenId: 'continent-sa', label: 'South America', isReady: true },
  'csa-australia': { actionType: 'open_screen', targetScreenId: 'continent-oceania', label: 'Australia', isReady: true },
  'continent-admins': { actionType: 'open_screen', targetScreenId: 'admin-list', label: 'All Admins', isReady: true },
  'country-overview': { actionType: 'open_screen', targetScreenId: 'country-list', label: 'Country Overview', isReady: true },
  
  // Server Manager
  'server-dash': { actionType: 'open_screen', targetScreenId: 'server-manager-dash', label: 'Server Dashboard', isReady: true },
  'server-list': { actionType: 'open_screen', targetScreenId: 'server-list-all', label: 'Server List', isReady: true },
  'db-list': { actionType: 'open_screen', targetScreenId: 'database-list', label: 'All Databases', isReady: true },
  'server-monitoring': { actionType: 'open_screen', targetScreenId: 'server-monitor', label: 'Live Monitoring', isReady: true },
  
  // Franchise Manager
  'franchise-dash': { actionType: 'open_screen', targetScreenId: 'franchise-main', label: 'Franchise Dashboard', isReady: true },
  'branch-network': { actionType: 'open_screen', targetScreenId: 'branch-list', label: 'Branch Network', isReady: true },
  'franchise-perf': { actionType: 'open_screen', targetScreenId: 'franchise-metrics', label: 'Performance Metrics', isReady: true },
  
  // Reseller Manager
  'reseller-dash': { actionType: 'open_screen', targetScreenId: 'reseller-main', label: 'Reseller Dashboard', isReady: true },
  'reseller-all': { actionType: 'open_screen', targetScreenId: 'reseller-list-all', label: 'All Resellers', isReady: true },
  'reseller-apps': { actionType: 'open_screen', targetScreenId: 'reseller-applications', label: 'Applications', isReady: true },
  'reseller-kpi': { actionType: 'open_screen', targetScreenId: 'reseller-performance', label: 'Performance KPIs', isReady: true },
  
  // Lead Manager
  'leads-dash': { actionType: 'open_screen', targetScreenId: 'leads-main', label: 'Leads Dashboard', isReady: true },
  'leads-all': { actionType: 'open_screen', targetScreenId: 'leads-list', label: 'All Leads', isReady: true },
  'leads-assign': { actionType: 'open_modal', targetScreenId: 'lead-assign-modal', label: 'Assign Leads', isReady: true },
  'leads-pipeline': { actionType: 'open_screen', targetScreenId: 'leads-pipeline', label: 'Pipeline View', isReady: true },
  
  // Finance Manager
  'fin-dash': { actionType: 'open_screen', targetScreenId: 'finance-main', label: 'Finance Dashboard', isReady: true },
  'fin-wallet': { actionType: 'open_screen', targetScreenId: 'wallet-overview', label: 'Wallet Overview', isReady: true },
  'fin-transactions': { actionType: 'open_screen', targetScreenId: 'transactions-all', label: 'Transactions', isReady: true },
  'fin-payouts': { actionType: 'open_screen', targetScreenId: 'payouts-list', label: 'Payouts', isReady: true },
  'fin-statements': { actionType: 'open_screen', targetScreenId: 'statements-list', label: 'Statements', isReady: true },
  
  // Developer Management
  'devmgr-dash': { actionType: 'open_screen', targetScreenId: 'dev-manager-main', label: 'Dev Dashboard', isReady: true },
  'devmgr-tasks': { actionType: 'open_screen', targetScreenId: 'dev-tasks-all', label: 'All Tasks', isReady: true },
  'devmgr-bugs': { actionType: 'open_screen', targetScreenId: 'bugs-all', label: 'Bug Tracker', isReady: true },
  'devmgr-releases': { actionType: 'open_screen', targetScreenId: 'releases-all', label: 'Releases', isReady: true },
  'devmgr-team': { actionType: 'open_screen', targetScreenId: 'dev-team', label: 'Team', isReady: true },
  
  // Marketing Management
  'mkt-dash': { actionType: 'open_screen', targetScreenId: 'marketing-manager-main', label: 'Marketing Dashboard', isReady: true },
  'mkt-campaigns': { actionType: 'open_screen', targetScreenId: 'campaigns-all', label: 'All Campaigns', isReady: true },
  'mkt-analytics': { actionType: 'open_screen', targetScreenId: 'marketing-analytics', label: 'Analytics', isReady: true },
  'mkt-content': { actionType: 'open_screen', targetScreenId: 'content-library', label: 'Content Library', isReady: true },
  
  // Support Management
  'csm-dash': { actionType: 'open_screen', targetScreenId: 'support-manager-main', label: 'Support Dashboard', isReady: true },
  'csm-tickets': { actionType: 'open_screen', targetScreenId: 'tickets-all', label: 'All Tickets', isReady: true },
  'csm-team': { actionType: 'open_screen', targetScreenId: 'support-team-manage', label: 'Team Management', isReady: true },
  'csm-knowledge': { actionType: 'open_screen', targetScreenId: 'knowledge-base', label: 'Knowledge Base', isReady: true },
  
  // Role Manager
  'roles-dash': { actionType: 'open_screen', targetScreenId: 'roles-main', label: 'Roles Dashboard', isReady: true },
  'roles-all': { actionType: 'open_screen', targetScreenId: 'roles-list', label: 'All Roles', isReady: true },
  'roles-permissions': { actionType: 'open_screen', targetScreenId: 'permissions-matrix', label: 'Permissions Matrix', isReady: true },
  'roles-audit': { actionType: 'open_screen', targetScreenId: 'roles-audit-log', label: 'Role Changes', isReady: true },
  
  // Product Manager
  'pm-dash': { actionType: 'open_screen', targetScreenId: 'product-manager-main', label: 'Product Dashboard', isReady: true },
  'pm-catalog': { actionType: 'open_screen', targetScreenId: 'product-catalog-all', label: 'Full Catalog', isReady: true },
  'pm-demos': { actionType: 'open_screen', targetScreenId: 'demo-management', label: 'Demo Management', isReady: true },
  'pm-pricing': { actionType: 'open_screen', targetScreenId: 'pricing-config', label: 'Pricing Config', isReady: true },
};

// CRUD screen sets for major entities
export const ENTITY_CRUD_SCREENS: Record<string, CRUDScreenSet> = {
  server: {
    create: 'server-create',
    read: 'server-list',
    update: 'server-edit',
    archive: 'server-archive'
  },
  franchise: {
    create: 'franchise-create',
    read: 'franchise-list',
    update: 'franchise-edit',
    archive: 'franchise-archive'
  },
  reseller: {
    create: 'reseller-create',
    read: 'reseller-list',
    update: 'reseller-edit',
    archive: 'reseller-archive'
  },
  lead: {
    create: 'lead-create',
    read: 'leads-list',
    update: 'lead-edit',
    archive: 'lead-archive'
  },
  product: {
    create: 'product-create',
    read: 'product-catalog',
    update: 'product-edit',
    archive: 'product-archive'
  },
  campaign: {
    create: 'campaign-create',
    read: 'campaigns-list',
    update: 'campaign-edit',
    archive: 'campaign-archive'
  },
  ticket: {
    create: 'ticket-create',
    read: 'tickets-list',
    update: 'ticket-edit',
    archive: 'ticket-archive'
  },
  task: {
    create: 'task-create',
    read: 'tasks-list',
    update: 'task-edit',
    archive: 'task-archive'
  },
  role: {
    create: 'role-create',
    read: 'roles-list',
    update: 'role-edit',
    archive: 'role-archive'
  }
};

// Button definitions for common actions
export const STANDARD_BUTTONS: Record<string, ButtonAction[]> = {
  create: [
    { id: 'save', label: 'Save', variant: 'primary', actionType: 'submit_form', isReady: true },
    { id: 'save-continue', label: 'Save & Add Another', variant: 'secondary', actionType: 'submit_form', isReady: true },
  ],
  edit: [
    { id: 'save', label: 'Save Changes', variant: 'primary', actionType: 'submit_form', isReady: true },
    { id: 'cancel', label: 'Cancel', variant: 'secondary', actionType: 'open_screen', isReady: true },
    { id: 'archive', label: 'Archive', variant: 'danger', actionType: 'run_process', requiresConfirmation: true, isReady: true },
  ],
  list: [
    { id: 'create', label: 'Create New', variant: 'primary', actionType: 'open_modal', isReady: true },
    { id: 'export', label: 'Export', variant: 'secondary', actionType: 'run_process', isReady: true },
    { id: 'refresh', label: 'Refresh', variant: 'secondary', actionType: 'run_process', isReady: true },
  ],
  approval: [
    { id: 'approve', label: 'Approve', variant: 'primary', actionType: 'run_process', isReady: true },
    { id: 'reject', label: 'Reject', variant: 'danger', actionType: 'run_process', requiresConfirmation: true, isReady: true },
    { id: 'escalate', label: 'Escalate', variant: 'secondary', actionType: 'run_process', isReady: true },
  ],
  status: [
    { id: 'enable', label: 'Enable', variant: 'primary', actionType: 'run_process', isReady: true },
    { id: 'disable', label: 'Disable', variant: 'danger', actionType: 'run_process', requiresConfirmation: true, isReady: true },
    { id: 'pause', label: 'Pause', variant: 'secondary', actionType: 'run_process', isReady: true },
    { id: 'resume', label: 'Resume', variant: 'primary', actionType: 'run_process', isReady: true },
  ],
};

// Hook state
interface SidebarActionState {
  isLoading: boolean;
  activeScreen: string | null;
  lastAction: string | null;
  modalOpen: string | null;
  drawerOpen: string | null;
}

/**
 * Main hook for sidebar and button actions
 */
export function useSidebarActions() {
  const [state, setState] = useState<SidebarActionState>({
    isLoading: false,
    activeScreen: null,
    lastAction: null,
    modalOpen: null,
    drawerOpen: null
  });

  /**
   * Execute sidebar item click
   */
  const handleSidebarClick = useCallback((
    subCategoryId: string,
    onNavigate?: (screenId: string) => void
  ) => {
    const action = SIDEBAR_ACTION_REGISTRY[subCategoryId];
    
    if (!action) {
      toast.error('Action not configured', { 
        description: `No action defined for: ${subCategoryId}` 
      });
      return;
    }

    if (!action.isReady) {
      toast.info('Coming Soon', { 
        description: `${action.label} is not yet available` 
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, lastAction: subCategoryId }));

    switch (action.actionType) {
      case 'open_screen':
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          activeScreen: action.targetScreenId 
        }));
        onNavigate?.(action.targetScreenId);
        toast.success(`Loading: ${action.label}`, { 
          description: 'Screen loading...',
          duration: 1500
        });
        break;
        
      case 'open_modal':
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          modalOpen: action.targetScreenId 
        }));
        toast.info(`Opening: ${action.label}`);
        break;
        
      case 'open_drawer':
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          drawerOpen: action.targetScreenId 
        }));
        break;
        
      case 'coming_soon':
        setState(prev => ({ ...prev, isLoading: false }));
        toast.info('Coming Soon', { 
          description: `${action.label} will be available soon` 
        });
        break;
        
      default:
        setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Execute button click with proper feedback
   */
  const handleButtonClick = useCallback(async (
    buttonId: string,
    buttonAction: ButtonAction,
    onExecute?: () => Promise<void>,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    if (!buttonAction.isReady) {
      toast.info('Coming Soon', { 
        description: `This feature is not yet available` 
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Show loading state
      toast.loading(`Processing: ${buttonAction.label}...`, { id: buttonId });

      if (onExecute) {
        await onExecute();
      } else {
        // Simulate action for demo
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Success feedback
      toast.success(`${buttonAction.label} completed`, { 
        id: buttonId,
        duration: 2000
      });
      onSuccess?.();

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Action failed';
      toast.error(`${buttonAction.label} failed`, { 
        id: buttonId,
        description: errorMsg 
      });
      onError?.(errorMsg);

    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Get CRUD screens for an entity
   */
  const getCRUDScreens = useCallback((entityType: string): CRUDScreenSet | null => {
    return ENTITY_CRUD_SCREENS[entityType] || null;
  }, []);

  /**
   * Get standard buttons for a screen type
   */
  const getStandardButtons = useCallback((screenType: string): ButtonAction[] => {
    return STANDARD_BUTTONS[screenType] || [];
  }, []);

  /**
   * Check if a sidebar item is configured
   */
  const isConfigured = useCallback((subCategoryId: string): boolean => {
    return !!SIDEBAR_ACTION_REGISTRY[subCategoryId];
  }, []);

  /**
   * Check if a sidebar item is ready
   */
  const isReady = useCallback((subCategoryId: string): boolean => {
    const action = SIDEBAR_ACTION_REGISTRY[subCategoryId];
    return action?.isReady ?? false;
  }, []);

  /**
   * Close modal/drawer
   */
  const closeOverlay = useCallback(() => {
    setState(prev => ({ ...prev, modalOpen: null, drawerOpen: null }));
  }, []);

  return {
    ...state,
    handleSidebarClick,
    handleButtonClick,
    getCRUDScreens,
    getStandardButtons,
    isConfigured,
    isReady,
    closeOverlay
  };
}
