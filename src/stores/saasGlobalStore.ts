/**
 * SaaS Global Store - Complete Global State Management
 * 37+ role dashboards interconnected with shared data
 * Central store for auth, roles, permissions, leads, sales, payments, licenses, analytics
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============= ROLE DEFINITIONS =============
export type SaaSRole = 
  // Executive
  | 'boss_panel' | 'ceo_dashboard' | 'vala_ai'
  // Management
  | 'server_manager' | 'ai_api_manager' | 'development_manager' | 'product_manager' 
  | 'demo_manager' | 'task_manager' | 'promise_tracker' | 'asset_manager' 
  | 'marketing_manager' | 'seo_manager' | 'lead_manager' | 'sales_manager' 
  | 'customer_support' | 'franchise_manager' | 'reseller_manager' | 'influencer_manager'
  // Geographic
  | 'continent_admin' | 'country_admin'
  // Functional
  | 'finance_manager' | 'legal_manager' | 'developer_dashboard' | 'pro_manager' 
  | 'user_dashboard' | 'security_manager' | 'system_settings' | 'marketplace_manager' 
  | 'license_manager' | 'demo_system_manager' | 'deployment_manager' 
  | 'analytics_manager' | 'notification_manager' | 'integration_manager' 
  | 'audit_logs_manager' | 'marketplace_core';

// ============= MODULE DEFINITIONS =============
export type SaaSModule = 
  | 'boss_panel' | 'ceo_dashboard' | 'vala_ai' | 'server_manager' | 'ai_api_manager'
  | 'development_manager' | 'product_manager' | 'demo_manager' | 'task_manager'
  | 'promise_tracker' | 'asset_manager' | 'marketing_manager' | 'seo_manager'
  | 'lead_manager' | 'sales_manager' | 'customer_support' | 'franchise_manager'
  | 'reseller_manager' | 'influencer_manager' | 'continent_admin' | 'country_admin'
  | 'finance_manager' | 'legal_manager' | 'developer_dashboard' | 'pro_manager'
  | 'user_dashboard' | 'security_manager' | 'system_settings' | 'marketplace_manager'
  | 'license_manager' | 'demo_system_manager' | 'deployment_manager'
  | 'analytics_manager' | 'notification_manager' | 'integration_manager'
  | 'audit_logs_manager' | 'marketplace_core';

// ============= DATA FLOW STAGES =============
export type DataFlowStage = 
  | 'marketplace' | 'lead' | 'sales' | 'payment' | 'license' | 'usage' | 'support' | 'analytics' | 'boss_panel';

// ============= ENTITY TYPES =============
export interface User {
  id: string;
  email: string;
  name: string;
  role: SaaSRole;
  permissions: string[];
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
  metadata: Record<string, any>;
  franchiseId?: string;
  resellerId?: string;
  continent?: string;
  country?: string;
}

export interface Lead {
  id: string;
  source: 'marketplace' | 'influencer' | 'franchise' | 'reseller' | 'direct';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  contactInfo: {
    email: string;
    phone?: string;
    name: string;
    company?: string;
  };
  assignedTo?: string;
  value: number;
  probability: number;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
  franchiseId?: string;
  resellerId?: string;
  influencerId?: string;
}

export interface Sale {
  id: string;
  leadId: string;
  customerId: string;
  productId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  salesManagerId: string;
  commission: {
    reseller?: number;
    franchise?: number;
    influencer?: number;
  };
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
}

export interface Payment {
  id: string;
  saleId: string;
  amount: number;
  currency: string;
  method: 'card' | 'bank' | 'crypto' | 'wallet';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  gateway: string;
  gatewayTransactionId?: string;
  createdAt: string;
  completedAt?: string;
  metadata: Record<string, any>;
}

export interface License {
  id: string;
  userId: string;
  productId: string;
  saleId: string;
  type: 'trial' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'suspended' | 'cancelled';
  expiresAt?: string;
  features: string[];
  usageLimits: {
    apiCalls?: number;
    storage?: number;
    users?: number;
  };
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
}

export interface UsageLog {
  id: string;
  userId: string;
  licenseId: string;
  action: string;
  resource: string;
  quantity: number;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface SupportTicket {
  id: string;
  userId: string;
  licenseId?: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
}

export interface Analytics {
  id: string;
  module: SaaSModule;
  metric: string;
  value: number;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  timestamp: string;
  dimensions: Record<string, string>;
  metadata: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  metadata: Record<string, any>;
}

// ============= STORE STATE =============
interface SaaSGlobalState {
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // Active Module State
  activeRole: SaaSRole | null;
  activeModule: SaaSModule;
  activeScreen: string;
  selectedEntity: {
    type: string;
    id: string;
    data?: any;
  } | null;

  // Data Pipeline State
  pipeline: {
    marketplace: {
      traffic: number;
      visitors: number;
      conversions: number;
    };
    leads: Lead[];
    sales: Sale[];
    payments: Payment[];
    licenses: License[];
    usage: UsageLog[];
    support: SupportTicket[];
    analytics: Analytics[];
  };

  // Real-time Updates
  realTimeUpdates: {
    newLeads: number;
    newSales: number;
    newPayments: number;
    newTickets: number;
    lastUpdate: string;
  };

  // UI State
  ui: {
    isLoading: boolean;
    loadingMessage?: string;
    error?: string;
    success?: string;
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark' | 'system';
  };

  // Filters and Pagination
  filters: Record<string, any>;
  pagination: Record<string, { page: number; pageSize: number; total: number }>;

  // Notifications
  notifications: Notification[];

  // Navigation History
  navigationHistory: Array<{
    module: SaaSModule;
    screen: string;
    entity?: any;
    timestamp: string;
  }>;
}

// ============= STORE ACTIONS =============
interface SaaSGlobalActions {
  // Authentication actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setActiveRole: (role: SaaSRole) => void;
  
  // Module actions
  setActiveModule: (module: SaaSModule, screen?: string) => void;
  setActiveScreen: (screen: string) => void;
  selectEntity: (entity: any) => void;
  clearSelection: () => void;
  
  // Data Pipeline actions
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  addSale: (sale: Sale) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  
  addLicense: (license: License) => void;
  updateLicense: (id: string, updates: Partial<License>) => void;
  
  addUsageLog: (log: UsageLog) => void;
  addSupportTicket: (ticket: SupportTicket) => void;
  updateSupportTicket: (id: string, updates: Partial<SupportTicket>) => void;
  
  addAnalytics: (analytics: Analytics) => void;
  updateRealTimeMetrics: (updates: Partial<SaaSGlobalState['realTimeUpdates']>) => void;

  // UI actions
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error?: string) => void;
  setSuccess: (success?: string) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Filter actions
  setFilter: (module: string, filter: any) => void;
  clearFilter: (module: string) => void;
  setPagination: (module: string, pagination: any) => void;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Navigation
  goBack: () => boolean;
  goHome: () => void;
  clearHistory: () => void;

  // Reset
  resetStore: () => void;
}

// ============= ROLE-MODULE MAPPING =============
const ROLE_MODULE_MAPPING: Record<SaaSRole, SaaSModule[]> = {
  boss_panel: ['boss_panel', 'analytics_manager'],
  ceo_dashboard: ['ceo_dashboard', 'analytics_manager'],
  vala_ai: ['vala_ai'],
  server_manager: ['server_manager'],
  ai_api_manager: ['ai_api_manager'],
  development_manager: ['development_manager'],
  product_manager: ['product_manager'],
  demo_manager: ['demo_manager'],
  task_manager: ['task_manager'],
  promise_tracker: ['promise_tracker'],
  asset_manager: ['asset_manager'],
  marketing_manager: ['marketing_manager'],
  seo_manager: ['seo_manager'],
  lead_manager: ['lead_manager'],
  sales_manager: ['sales_manager'],
  customer_support: ['customer_support'],
  franchise_manager: ['franchise_manager'],
  reseller_manager: ['reseller_manager'],
  influencer_manager: ['influencer_manager'],
  continent_admin: ['continent_admin'],
  country_admin: ['country_admin'],
  finance_manager: ['finance_manager'],
  legal_manager: ['legal_manager'],
  developer_dashboard: ['developer_dashboard'],
  pro_manager: ['pro_manager'],
  user_dashboard: ['user_dashboard'],
  security_manager: ['security_manager'],
  system_settings: ['system_settings'],
  marketplace_manager: ['marketplace_manager'],
  license_manager: ['license_manager'],
  demo_system_manager: ['demo_system_manager'],
  deployment_manager: ['deployment_manager'],
  analytics_manager: ['analytics_manager'],
  notification_manager: ['notification_manager'],
  integration_manager: ['integration_manager'],
  audit_logs_manager: ['audit_logs_manager'],
  marketplace_core: ['marketplace_core'],
};

// ============= DEFAULT VALUES =============
const defaultState: SaaSGlobalState = {
  currentUser: null,
  isAuthenticated: false,
  token: null,
  activeRole: null,
  activeModule: 'marketplace_core',
  activeScreen: 'dashboard',
  selectedEntity: null,
  pipeline: {
    marketplace: { traffic: 0, visitors: 0, conversions: 0 },
    leads: [],
    sales: [],
    payments: [],
    licenses: [],
    usage: [],
    support: [],
    analytics: [],
  },
  realTimeUpdates: {
    newLeads: 0,
    newSales: 0,
    newPayments: 0,
    newTickets: 0,
    lastUpdate: new Date().toISOString(),
  },
  ui: {
    isLoading: false,
    sidebarCollapsed: false,
    theme: 'system',
  },
  filters: {},
  pagination: {},
  notifications: [],
  navigationHistory: [],
};

// ============= STORE IMPLEMENTATION =============
export const useSaaSGlobalStore = create<SaaSGlobalState & SaaSGlobalActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // Authentication actions
      login: (user, token) => {
        set({
          currentUser: user,
          isAuthenticated: true,
          token,
          activeRole: user.role,
          activeModule: ROLE_MODULE_MAPPING[user.role]?.[0] || 'user_dashboard',
          activeScreen: 'dashboard',
          ui: { ...get().ui, isLoading: false },
        });
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          token: null,
          activeRole: null,
          activeModule: 'marketplace_core',
          activeScreen: 'dashboard',
          selectedEntity: null,
          ui: { ...get().ui, isLoading: false },
        });
      },

      updateUser: (updates) => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
      })),

      setActiveRole: (role) => {
        const current = get();
        const newHistory = [
          ...current.navigationHistory,
          {
            module: current.activeModule,
            screen: current.activeScreen,
            entity: current.selectedEntity,
            timestamp: new Date().toISOString(),
          }
        ].slice(-20);

        set({
          activeRole: role,
          activeModule: ROLE_MODULE_MAPPING[role]?.[0] || 'user_dashboard',
          activeScreen: 'dashboard',
          selectedEntity: null,
          navigationHistory: newHistory,
        });
      },

      // Module actions
      setActiveModule: (module, screen = 'dashboard') => {
        const current = get();
        const newHistory = [
          ...current.navigationHistory,
          {
            module: current.activeModule,
            screen: current.activeScreen,
            entity: current.selectedEntity,
            timestamp: new Date().toISOString(),
          }
        ].slice(-20);

        set({
          activeModule: module,
          activeScreen: screen,
          selectedEntity: null,
          navigationHistory: newHistory,
        });
      },

      setActiveScreen: (screen) => set({ activeScreen: screen }),
      
      selectEntity: (entity) => set({ selectedEntity: entity }),
      clearSelection: () => set({ selectedEntity: null }),

      // Data Pipeline actions
      addLead: (lead) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          leads: [lead, ...state.pipeline.leads],
        },
        realTimeUpdates: {
          ...state.realTimeUpdates,
          newLeads: state.realTimeUpdates.newLeads + 1,
          lastUpdate: new Date().toISOString(),
        },
      })),

      updateLead: (id, updates) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          leads: state.pipeline.leads.map(lead => 
            lead.id === id ? { ...lead, ...updates } : lead
          ),
        },
      })),

      deleteLead: (id) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          leads: state.pipeline.leads.filter(lead => lead.id !== id),
        },
      })),

      addSale: (sale) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          sales: [sale, ...state.pipeline.sales],
        },
        realTimeUpdates: {
          ...state.realTimeUpdates,
          newSales: state.realTimeUpdates.newSales + 1,
          lastUpdate: new Date().toISOString(),
        },
      })),

      updateSale: (id, updates) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          sales: state.pipeline.sales.map(sale => 
            sale.id === id ? { ...sale, ...updates } : sale
          ),
        },
      })),

      deleteSale: (id) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          sales: state.pipeline.sales.filter(sale => sale.id !== id),
        },
      })),

      addPayment: (payment) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          payments: [payment, ...state.pipeline.payments],
        },
        realTimeUpdates: {
          ...state.realTimeUpdates,
          newPayments: state.realTimeUpdates.newPayments + 1,
          lastUpdate: new Date().toISOString(),
        },
      })),

      updatePayment: (id, updates) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          payments: state.pipeline.payments.map(payment => 
            payment.id === id ? { ...payment, ...updates } : payment
          ),
        },
      })),

      addLicense: (license) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          licenses: [license, ...state.pipeline.licenses],
        },
      })),

      updateLicense: (id, updates) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          licenses: state.pipeline.licenses.map(license => 
            license.id === id ? { ...license, ...updates } : license
          ),
        },
      })),

      addUsageLog: (log) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          usage: [log, ...state.pipeline.usage],
        },
      })),

      addSupportTicket: (ticket) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          support: [ticket, ...state.pipeline.support],
        },
        realTimeUpdates: {
          ...state.realTimeUpdates,
          newTickets: state.realTimeUpdates.newTickets + 1,
          lastUpdate: new Date().toISOString(),
        },
      })),

      updateSupportTicket: (id, updates) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          support: state.pipeline.support.map(ticket => 
            ticket.id === id ? { ...ticket, ...updates } : ticket
          ),
        },
      })),

      addAnalytics: (analytics) => set((state) => ({
        pipeline: {
          ...state.pipeline,
          analytics: [analytics, ...state.pipeline.analytics],
        },
      })),

      updateRealTimeMetrics: (updates) => set((state) => ({
        realTimeUpdates: {
          ...state.realTimeUpdates,
          ...updates,
          lastUpdate: new Date().toISOString(),
        },
      })),

      // UI actions
      setLoading: (loading, message) => set((state) => ({
        ui: {
          ...state.ui,
          isLoading: loading,
          loadingMessage: message,
          error: loading ? undefined : state.ui.error,
        },
      })),

      setError: (error) => set((state) => ({
        ui: {
          ...state.ui,
          error,
          isLoading: false,
        },
      })),

      setSuccess: (success) => set((state) => ({
        ui: {
          ...state.ui,
          success,
          isLoading: false,
        },
      })),

      toggleSidebar: () => set((state) => ({
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
      })),

      setTheme: (theme) => set((state) => ({
        ui: { ...state.ui, theme },
      })),

      // Filter actions
      setFilter: (module, filter) => set((state) => ({
        filters: {
          ...state.filters,
          [module]: { ...state.filters[module], ...filter },
        },
      })),

      clearFilter: (module) => set((state) => {
        const newFilters = { ...state.filters };
        delete newFilters[module];
        return { filters: newFilters };
      }),

      setPagination: (module, pagination) => set((state) => ({
        pagination: {
          ...state.pagination,
          [module]: pagination,
        },
      })),

      // Notification actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50),
        }));
      },

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ),
      })),

      clearNotifications: () => set({ notifications: [] }),

      // Navigation
      goBack: () => {
        const history = get().navigationHistory;
        if (history.length === 0) return false;
        
        const newHistory = [...history];
        const previous = newHistory.pop();
        
        if (previous) {
          set({
            activeModule: previous.module,
            activeScreen: previous.screen,
            selectedEntity: previous.entity,
            navigationHistory: newHistory,
          });
          return true;
        }
        return false;
      },

      goHome: () => set((state) => ({
        activeModule: ROLE_MODULE_MAPPING[state.activeRole || 'user_dashboard']?.[0] || 'user_dashboard',
        activeScreen: 'dashboard',
        selectedEntity: null,
      })),

      clearHistory: () => set({ navigationHistory: [] }),

      // Reset
      resetStore: () => set(defaultState),
    }),
    {
      name: 'saas-global-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        activeRole: state.activeRole,
        activeModule: state.activeModule,
        activeScreen: state.activeScreen,
        ui: {
          sidebarCollapsed: state.ui.sidebarCollapsed,
          theme: state.ui.theme,
        },
        navigationHistory: state.navigationHistory.slice(-10),
      }),
    }
  )
);

export default useSaaSGlobalStore;
