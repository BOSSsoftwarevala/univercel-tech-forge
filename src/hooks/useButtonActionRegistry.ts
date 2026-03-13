/**
 * GLOBAL BUTTON ACTION REGISTRY
 * Centralized action mapping for ALL clickable elements
 * 
 * RULES:
 * - NO button without action
 * - NO silent clicks
 * - NO duplicate triggers
 * 
 * Types:
 * - ROUTE: Navigation to a path
 * - MODAL: Opens a modal/dialog
 * - API: Calls an endpoint
 * - STATE: Updates local/global state
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSidebarStore } from '@/stores/sidebarStore';

// Action Types
export type ActionType = 'ROUTE' | 'MODAL' | 'API' | 'STATE' | 'COMING_SOON' | 'LOCKED';

// Action Definition
export interface ActionDefinition {
  type: ActionType;
  target?: string;
  modalId?: string;
  stateKey?: string;
  stateValue?: unknown;
  apiEndpoint?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  apiPayload?: Record<string, unknown>;
  permission?: string;
  successMessage?: string;
  errorMessage?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  sidebarAction?: 'show' | 'hide' | 'toggle' | 'enterModule' | 'exitModule';
  moduleId?: string;
}

// Comprehensive Action Map - ALL buttons must be registered here
export const ACTION_MAP: Record<string, ActionDefinition> = {
  // ================= HEADER ACTIONS =================
  'btn_header_chat': { type: 'ROUTE', target: '/internal-chat', successMessage: 'Opening chat...' },
  'btn_header_tasks': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=task_management', sidebarAction: 'enterModule', moduleId: 'tasks' },
  'btn_header_alerts': { type: 'STATE', stateKey: 'showAlerts', stateValue: true },
  'btn_header_promise': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=promise-tracker' },
  'btn_header_profile': { type: 'ROUTE', target: '/profile' },
  'btn_header_settings': { type: 'ROUTE', target: '/settings' },
  'btn_header_logout': { type: 'API', apiEndpoint: '/auth/logout', apiMethod: 'POST', successMessage: 'Logged out successfully' },
  'btn_header_ai': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=vala_ai_management', sidebarAction: 'enterModule', moduleId: 'vala-ai' },
  'btn_header_sound_toggle': { type: 'STATE', stateKey: 'soundEnabled', stateValue: 'toggle', successMessage: 'Sound toggled' },
  'btn_header_language': { type: 'MODAL', modalId: 'language-selector' },
  'btn_header_currency': { type: 'MODAL', modalId: 'currency-selector' },
  
  // ================= DASHBOARD CARDS =================
  'btn_card_server_status': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=server-control', sidebarAction: 'enterModule', moduleId: 'server-manager' },
  'btn_card_risk_level': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=risk-assessment' },
  'btn_card_users_online': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=users-online' },
  'btn_card_revenue': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=finance_manager' },
  'btn_card_tasks_pending': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=task_management' },
  'btn_card_leads': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=lead_manager', sidebarAction: 'enterModule', moduleId: 'lead-manager' },
  'btn_card_system_health': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=system-health' },
  'btn_card_active_sessions': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=sessions' },
  'btn_card_alerts': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=alerts' },
  
  // ================= SIDEBAR NAVIGATION =================
  'btn_sidebar_dashboard': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner', sidebarAction: 'show' },
  'btn_sidebar_server': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=server-control', sidebarAction: 'enterModule', moduleId: 'server-manager' },
  'btn_sidebar_vala_ai': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=vala_ai_management', sidebarAction: 'enterModule', moduleId: 'vala-ai' },
  'btn_sidebar_products': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=product_manager', sidebarAction: 'enterModule', moduleId: 'product-demo' },
  'btn_sidebar_leads': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=lead_manager', sidebarAction: 'enterModule', moduleId: 'lead-manager' },
  'btn_sidebar_marketing': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=marketing_management', sidebarAction: 'enterModule', moduleId: 'marketing' },
  'btn_sidebar_finance': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=finance_manager', sidebarAction: 'enterModule', moduleId: 'finance' },
  'btn_sidebar_franchise': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=franchise_manager', sidebarAction: 'enterModule', moduleId: 'franchise' },
  'btn_sidebar_reseller': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=reseller_manager', sidebarAction: 'enterModule', moduleId: 'reseller' },
  'btn_sidebar_support': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=customer_support_management' },
  'btn_sidebar_legal': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=legal_manager' },
  'btn_sidebar_back': { type: 'STATE', stateKey: 'sidebar', stateValue: 'parent', sidebarAction: 'exitModule' },
  'btn_sidebar_home': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner', sidebarAction: 'show', successMessage: 'Returned to dashboard' },
  'btn_sidebar_settings': { type: 'ROUTE', target: '/settings' },
  'btn_sidebar_security': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=security' },
  'btn_sidebar_audit': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner&nav=audit-logs' },
  
  // ================= CTA BUTTONS =================
  'btn_cta_create': { type: 'MODAL', modalId: 'create-modal', successMessage: 'Opening create form...' },
  'btn_cta_save': { type: 'API', apiEndpoint: '/save', apiMethod: 'POST', successMessage: 'Saved successfully' },
  'btn_cta_cancel': { type: 'STATE', stateKey: 'formOpen', stateValue: false },
  'btn_cta_submit': { type: 'API', apiEndpoint: '/submit', apiMethod: 'POST', successMessage: 'Submitted successfully' },
  'btn_cta_approve': { type: 'API', apiEndpoint: '/approve', apiMethod: 'POST', successMessage: 'Approved', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to approve?' },
  'btn_cta_reject': { type: 'API', apiEndpoint: '/reject', apiMethod: 'POST', successMessage: 'Rejected', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to reject?' },
  'btn_cta_delete': { type: 'API', apiEndpoint: '/delete', apiMethod: 'DELETE', successMessage: 'Deleted', requiresConfirmation: true, confirmationMessage: 'This action cannot be undone. Delete?' },
  'btn_cta_edit': { type: 'MODAL', modalId: 'edit-modal' },
  'btn_cta_view': { type: 'MODAL', modalId: 'view-modal' },
  'btn_cta_close': { type: 'STATE', stateKey: 'modalOpen', stateValue: false },
  'btn_cta_export': { type: 'API', apiEndpoint: '/export', apiMethod: 'GET', successMessage: 'Export started' },
  'btn_cta_import': { type: 'MODAL', modalId: 'import-modal' },
  'btn_cta_refresh': { type: 'STATE', stateKey: 'refresh', stateValue: true, successMessage: 'Refreshing...' },
  'btn_cta_add': { type: 'MODAL', modalId: 'add-modal' },
  'btn_cta_remove': { type: 'API', apiEndpoint: '/remove', apiMethod: 'DELETE', requiresConfirmation: true },
  'btn_cta_start': { type: 'API', apiEndpoint: '/start', apiMethod: 'POST', successMessage: 'Started' },
  'btn_cta_stop': { type: 'API', apiEndpoint: '/stop', apiMethod: 'POST', successMessage: 'Stopped', requiresConfirmation: true },
  'btn_cta_pause': { type: 'API', apiEndpoint: '/pause', apiMethod: 'POST', successMessage: 'Paused' },
  'btn_cta_resume': { type: 'API', apiEndpoint: '/resume', apiMethod: 'POST', successMessage: 'Resumed' },
  'btn_cta_restart': { type: 'API', apiEndpoint: '/restart', apiMethod: 'POST', successMessage: 'Restarting...', requiresConfirmation: true },
  
  // ================= TABLE/ROW ACTIONS =================
  'btn_row_view': { type: 'MODAL', modalId: 'detail-view' },
  'btn_row_edit': { type: 'MODAL', modalId: 'edit-modal' },
  'btn_row_delete': { type: 'API', apiEndpoint: '/delete', apiMethod: 'DELETE', requiresConfirmation: true, successMessage: 'Deleted' },
  'btn_row_approve': { type: 'API', apiEndpoint: '/approve', apiMethod: 'POST', successMessage: 'Approved' },
  'btn_row_reject': { type: 'API', apiEndpoint: '/reject', apiMethod: 'POST', successMessage: 'Rejected' },
  'btn_row_pause': { type: 'API', apiEndpoint: '/pause', apiMethod: 'POST', successMessage: 'Paused' },
  'btn_row_resume': { type: 'API', apiEndpoint: '/resume', apiMethod: 'POST', successMessage: 'Resumed' },
  'btn_row_expand': { type: 'STATE', stateKey: 'expandedRow', stateValue: null },
  'btn_row_select': { type: 'STATE', stateKey: 'selectedRow', stateValue: null },
  'btn_row_details': { type: 'MODAL', modalId: 'row-details' },
  
  // ================= ICON BUTTONS =================
  'btn_icon_refresh': { type: 'STATE', stateKey: 'refresh', stateValue: true, successMessage: 'Refreshing...' },
  'btn_icon_search': { type: 'STATE', stateKey: 'searchOpen', stateValue: true },
  'btn_icon_filter': { type: 'MODAL', modalId: 'filter-modal' },
  'btn_icon_export': { type: 'API', apiEndpoint: '/export', apiMethod: 'GET', successMessage: 'Export started' },
  'btn_icon_import': { type: 'MODAL', modalId: 'import-modal' },
  'btn_icon_settings': { type: 'MODAL', modalId: 'settings-modal' },
  'btn_icon_help': { type: 'MODAL', modalId: 'help-modal' },
  'btn_icon_notifications': { type: 'STATE', stateKey: 'showNotifications', stateValue: true },
  'btn_icon_menu': { type: 'STATE', stateKey: 'menuOpen', stateValue: 'toggle' },
  'btn_icon_close': { type: 'STATE', stateKey: 'isOpen', stateValue: false },
  'btn_icon_fullscreen': { type: 'STATE', stateKey: 'fullscreen', stateValue: 'toggle' },
  'btn_icon_minimize': { type: 'STATE', stateKey: 'minimized', stateValue: true },
  'btn_icon_maximize': { type: 'STATE', stateKey: 'maximized', stateValue: true },
  
  // ================= TOGGLE BUTTONS =================
  'btn_toggle_status': { type: 'STATE', stateKey: 'status', stateValue: 'toggle' },
  'btn_toggle_visibility': { type: 'STATE', stateKey: 'visible', stateValue: 'toggle' },
  'btn_toggle_active': { type: 'STATE', stateKey: 'active', stateValue: 'toggle' },
  'btn_toggle_enabled': { type: 'STATE', stateKey: 'enabled', stateValue: 'toggle' },
  'btn_toggle_theme': { type: 'STATE', stateKey: 'theme', stateValue: 'toggle' },
  'btn_toggle_sidebar': { type: 'STATE', stateKey: 'sidebarCollapsed', stateValue: 'toggle' },
  
  // ================= NAVIGATION BUTTONS =================
  'btn_nav_back': { type: 'STATE', stateKey: 'navigation', stateValue: 'back', sidebarAction: 'exitModule' },
  'btn_nav_forward': { type: 'STATE', stateKey: 'navigation', stateValue: 'forward' },
  'btn_nav_home': { type: 'ROUTE', target: '/super-admin-system/role-switch?role=boss_owner', sidebarAction: 'show' },
  
  // ================= DROPDOWN ACTIONS =================
  'btn_dropdown_item': { type: 'STATE', stateKey: 'selectedItem', stateValue: null },
  
  // ================= COMING SOON PLACEHOLDERS =================
  'btn_coming_soon': { type: 'COMING_SOON' },
  'btn_locked': { type: 'LOCKED' },

  // ================= DEMO MANAGEMENT =================
  'btn_demo_pause': { type: 'API', apiEndpoint: '/api-demos/pause', apiMethod: 'POST', successMessage: 'Demo paused', requiresConfirmation: false },
  'btn_demo_resume': { type: 'API', apiEndpoint: '/api-demos/resume', apiMethod: 'POST', successMessage: 'Demo resumed' },
  'btn_demo_delete': { type: 'API', apiEndpoint: '/api-demos/delete', apiMethod: 'DELETE', successMessage: 'Demo deleted', requiresConfirmation: true, confirmationMessage: 'Delete this demo? This cannot be undone.' },

  // ================= PRODUCT ASSIGNMENT =================
  'btn_product_assign': { type: 'API', apiEndpoint: '/api-products/assign', apiMethod: 'PATCH', successMessage: 'Product assigned successfully' },

  // ================= MARKETPLACE SYNC =================
  'btn_marketplace_sync': { type: 'API', apiEndpoint: '/api-marketplace/sync', apiMethod: 'POST', successMessage: 'Marketplace sync started' },

  // ================= FINANCE COMMISSION =================
  'btn_finance_approve_commission': { type: 'API', apiEndpoint: '/api-finance/commission/approve', apiMethod: 'PATCH', successMessage: 'Commission approved', requiresConfirmation: true, confirmationMessage: 'Approve this commission payment?' },

  // ================= REPORT EXPORT =================
  'btn_report_export': { type: 'API', apiEndpoint: '/api-reports/export', apiMethod: 'POST', successMessage: 'Report export started' },
  'btn_report_export_csv': { type: 'API', apiEndpoint: '/api-reports/export', apiMethod: 'POST', successMessage: 'CSV export started' },

  // ================= NOTIFICATION SETTINGS =================
  'btn_notification_save': { type: 'API', apiEndpoint: '/api-notifications/settings', apiMethod: 'PATCH', successMessage: 'Notification settings saved' },

  // ================= SERVER MANAGEMENT =================
  'btn_server_restart': { type: 'API', apiEndpoint: '/server-manager/servers/restart', apiMethod: 'POST', successMessage: 'Server restart initiated', requiresConfirmation: true, confirmationMessage: 'Restart this server?' },
  'btn_server_health_check': { type: 'API', apiEndpoint: '/server-manager/system/health-check', apiMethod: 'POST', successMessage: 'Health check triggered' },

  // ================= AIRA COMMAND =================
  'btn_aira_execute': { type: 'API', apiEndpoint: '/api-aira/execute', apiMethod: 'POST', successMessage: 'AIRA command executed' },
  'btn_aira_log': { type: 'API', apiEndpoint: '/api-aira/log', apiMethod: 'POST', successMessage: 'AIRA command logged' },

  // ================= CUSTOM ROLE CREATION =================
  'btn_role_create': { type: 'MODAL', modalId: 'create-role-modal', successMessage: 'Opening role creation form...' },
};

// Action execution result
interface ActionResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

// Hook state
interface ActionState {
  isLoading: boolean;
  lastAction: string | null;
  error: string | null;
}

/**
 * Hook for executing button actions from registry
 */
export function useButtonActionRegistry() {
  const navigate = useNavigate();
  const { showGlobalSidebar, enterCategory, exitToGlobal } = useSidebarStore();
  const [state, setState] = useState<ActionState>({
    isLoading: false,
    lastAction: null,
    error: null,
  });

  // State management for modals/UI
  const [modalState, setModalState] = useState<Record<string, boolean>>({});
  const [uiState, setUiState] = useState<Record<string, unknown>>({});

  /**
   * Execute action from registry
   */
  const executeAction = useCallback(async (
    buttonId: string,
    overrides?: Partial<ActionDefinition>,
    context?: Record<string, unknown>
  ): Promise<ActionResult> => {
    const baseAction = ACTION_MAP[buttonId];
    
    // Handle unmapped button
    if (!baseAction) {
      toast.warning('Action Not Available', {
        description: `Button "${buttonId}" has no configured action`,
        duration: 3000
      });
      console.warn(`[BUTTON_AUDIT] Unmapped button clicked: ${buttonId}`, context);
      return { success: false, message: 'Action not configured' };
    }

    const action: ActionDefinition = { ...baseAction, ...overrides };
    
    setState(prev => ({ ...prev, isLoading: true, lastAction: buttonId, error: null }));

    try {
      // Handle COMING_SOON
      if (action.type === 'COMING_SOON') {
        toast.info('Coming Soon', {
          description: 'This feature will be available soon',
          duration: 2000
        });
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: true, message: 'Coming soon' };
      }

      // Handle LOCKED
      if (action.type === 'LOCKED') {
        toast.error('Access Restricted', {
          description: 'You do not have permission for this action',
          duration: 3000
        });
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, message: 'Access restricted' };
      }

      // Handle sidebar actions
      if (action.sidebarAction) {
        switch (action.sidebarAction) {
          case 'show':
            showGlobalSidebar();
            break;
          case 'hide':
          case 'exitModule':
            exitToGlobal();
            break;
          case 'enterModule':
          if (action.moduleId) {
              const moduleMap: Record<string, Parameters<typeof enterCategory>[0]> = {
                'server-manager': 'server-manager',
                'vala-ai': 'vala-ai',
                'product-demo': 'product-demo',
                'lead-manager': 'lead-manager',
                'marketing': 'marketing',
                'finance': 'finance',
                'franchise': 'franchise-manager',
                'reseller': 'reseller-manager',
                'tasks': 'server-manager', // fallback
              };
              const category = moduleMap[action.moduleId];
              if (category) enterCategory(category);
            }
            break;
        }
      }

      // Execute based on type
      switch (action.type) {
        case 'ROUTE':
          if (action.target) {
            // Build path with context params
            let finalPath = action.target;
            if (context?.params && typeof context.params === 'object') {
              const url = new URL(action.target, window.location.origin);
              Object.entries(context.params as Record<string, string>).forEach(([key, value]) => {
                url.searchParams.set(key, value);
              });
              finalPath = url.pathname + url.search;
            }
            navigate(finalPath);
            if (action.successMessage) {
              toast.success(action.successMessage);
            }
          }
          break;

        case 'MODAL':
          if (action.modalId) {
            setModalState(prev => ({ ...prev, [action.modalId!]: true }));
            if (action.successMessage) {
              toast.info(action.successMessage);
            }
          }
          break;

        case 'API':
          // Simulate API call (would be real in production)
          if (action.apiEndpoint) {
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success(action.successMessage || 'Action completed');
          }
          break;

        case 'STATE':
          if (action.stateKey) {
            const newValue = action.stateValue === 'toggle' 
              ? !uiState[action.stateKey] 
              : action.stateValue;
            setUiState(prev => ({ ...prev, [action.stateKey!]: newValue }));
            
            // Handle special state keys
            if (action.stateKey === 'navigation' && action.stateValue === 'back') {
              window.history.back();
            }
            
            if (action.successMessage) {
              toast.info(action.successMessage);
            }
          }
          break;
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { success: true, message: action.successMessage };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Action failed';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(action.errorMessage || 'Action Failed', {
        description: errorMessage
      });
      console.error(`[BUTTON_ERROR] ${buttonId}:`, error);
      return { success: false, message: errorMessage };
    }
  }, [navigate, showGlobalSidebar, enterCategory, exitToGlobal, uiState]);

  /**
   * Close modal by ID
   */
  const closeModal = useCallback((modalId: string) => {
    setModalState(prev => ({ ...prev, [modalId]: false }));
  }, []);

  /**
   * Check if action exists for button
   */
  const hasAction = useCallback((buttonId: string): boolean => {
    return !!ACTION_MAP[buttonId];
  }, []);

  /**
   * Get action type for button
   */
  const getActionType = useCallback((buttonId: string): ActionType | null => {
    return ACTION_MAP[buttonId]?.type || null;
  }, []);

  /**
   * Audit unmapped buttons (for development)
   */
  const auditUnmappedButton = useCallback((buttonId: string, element?: string) => {
    console.warn(`[BUTTON_AUDIT] Unmapped: ${buttonId}`, { element, timestamp: new Date().toISOString() });
  }, []);

  return {
    executeAction,
    closeModal,
    hasAction,
    getActionType,
    auditUnmappedButton,
    state,
    modalState,
    uiState,
  };
}

export default useButtonActionRegistry;
