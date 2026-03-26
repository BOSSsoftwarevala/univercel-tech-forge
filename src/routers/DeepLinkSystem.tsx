/**
 * Deep Link System - Dynamic Route Structure
 * Pattern: /dashboard/{role}/{module}/{action}/{entityId}
 * All dashboards interconnected with shared middleware
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useSaaSGlobalStore, type SaaSRole, type SaaSModule } from '@/stores/saasGlobalStore';

// Import all dashboard components
import BossPanel from '@/pages/boss-panel/BossPanel';
import CEODashboard from '@/pages/ceo/CEODashboard';
import ValaAIDashboard from '@/pages/vala-ai/ValaAIDashboard';
import ServerManagerDashboard from '@/pages/server-manager/ServerManagerDashboard';
import AIAPIDashboard from '@/pages/ai-api-manager/AIAPIDashboard';
import DevelopmentManagerDashboard from '@/pages/development-manager/DevelopmentManagerDashboard';
import ProductManagerDashboard from '@/pages/product-manager/ProductManagerDashboard';
import DemoManagerDashboard from '@/pages/demo-manager/DemoManagerDashboard';
import TaskManagerDashboard from '@/pages/task-manager/TaskManagerDashboard';
import PromiseTrackerDashboard from '@/pages/promise-tracker/PromiseTrackerDashboard';
import AssetManagerDashboard from '@/pages/asset-manager/AssetManagerDashboard';
import MarketingManagerDashboard from '@/pages/marketing-manager/MarketingManagerDashboard';
import SEOManagerDashboard from '@/pages/seo-manager/SEOManagerDashboard';
import LeadManagerDashboard from '@/pages/lead-manager/LeadManagerDashboard';
import SalesManagerDashboard from '@/pages/sales-manager/SalesManagerDashboard';
import CustomerSupportDashboard from '@/pages/customer-support/CustomerSupportDashboard';
import FranchiseManagerDashboard from '@/pages/franchise-manager/FranchiseManagerDashboard';
import ResellerManagerDashboard from '@/pages/reseller-manager/ResellerManagerDashboard';
import InfluencerManagerDashboard from '@/pages/influencer-manager/InfluencerManagerDashboard';
import ContinentAdminDashboard from '@/pages/continent-admin/ContinentAdminDashboard';
import CountryAdminDashboard from '@/pages/country-admin/CountryAdminDashboard';
import FinanceManagerDashboard from '@/pages/finance-manager/FinanceManagerDashboard';
import LegalManagerDashboard from '@/pages/legal-manager/LegalManagerDashboard';
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import ProManagerDashboard from '@/pages/pro-manager/ProManagerDashboard';
import UserDashboard from '@/pages/user/UserDashboard';
import SecurityManagerDashboard from '@/pages/security-manager/SecurityManagerDashboard';
import SystemSettingsDashboard from '@/pages/system-settings/SystemSettingsDashboard';
import MarketplaceManagerDashboard from '@/pages/marketplace-manager/MarketplaceManagerDashboard';
import LicenseManagerDashboard from '@/pages/license-manager/LicenseManagerDashboard';
import DemoSystemManagerDashboard from '@/pages/demo-system-manager/DemoSystemManagerDashboard';
import DeploymentManagerDashboard from '@/pages/deployment-manager/DeploymentManagerDashboard';
import AnalyticsManagerDashboard from '@/pages/analytics-manager/AnalyticsManagerDashboard';
import NotificationManagerDashboard from '@/pages/notification-manager/NotificationManagerDashboard';
import IntegrationManagerDashboard from '@/pages/integration-manager/IntegrationManagerDashboard';
import AuditLogsManagerDashboard from '@/pages/audit-logs-manager/AuditLogsManagerDashboard';
import MarketplaceCoreDashboard from '@/pages/marketplace-core/MarketplaceCoreDashboard';

// ============= ROUTE CONFIGURATION =============
interface RouteConfig {
  component: React.ComponentType<any>;
  allowedRoles: SaaSRole[];
  defaultScreen: string;
  screens: Record<string, React.ComponentType<any>>;
}

const ROUTE_CONFIG: Record<string, RouteConfig> = {
  boss_panel: {
    component: BossPanel,
    allowedRoles: ['boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: BossPanel,
      analytics: BossPanel,
      users: BossPanel,
      settings: BossPanel,
    },
  },
  ceo_dashboard: {
    component: CEODashboard,
    allowedRoles: ['ceo_dashboard', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: CEODashboard,
      reports: CEODashboard,
      kpi: CEODashboard,
    },
  },
  vala_ai: {
    component: ValaAIDashboard,
    allowedRoles: ['vala_ai', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: ValaAIDashboard,
      chat: ValaAIDashboard,
      training: ValaAIDashboard,
    },
  },
  server_manager: {
    component: ServerManagerDashboard,
    allowedRoles: ['server_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: ServerManagerDashboard,
      monitoring: ServerManagerDashboard,
      logs: ServerManagerDashboard,
    },
  },
  ai_api_manager: {
    component: AIAPIDashboard,
    allowedRoles: ['ai_api_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: AIAPIDashboard,
      endpoints: AIAPIDashboard,
      usage: AIAPIDashboard,
    },
  },
  development_manager: {
    component: DevelopmentManagerDashboard,
    allowedRoles: ['development_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: DevelopmentManagerDashboard,
      projects: DevelopmentManagerDashboard,
      bugs: DevelopmentManagerDashboard,
    },
  },
  product_manager: {
    component: ProductManagerDashboard,
    allowedRoles: ['product_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: ProductManagerDashboard,
      products: ProductManagerDashboard,
      roadmap: ProductManagerDashboard,
    },
  },
  demo_manager: {
    component: DemoManagerDashboard,
    allowedRoles: ['demo_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: DemoManagerDashboard,
      demos: DemoManagerDashboard,
      scheduling: DemoManagerDashboard,
    },
  },
  task_manager: {
    component: TaskManagerDashboard,
    allowedRoles: ['task_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: TaskManagerDashboard,
      tasks: TaskManagerDashboard,
      assignments: TaskManagerDashboard,
    },
  },
  promise_tracker: {
    component: PromiseTrackerDashboard,
    allowedRoles: ['promise_tracker', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: PromiseTrackerDashboard,
      promises: PromiseTrackerDashboard,
      tracking: PromiseTrackerDashboard,
    },
  },
  asset_manager: {
    component: AssetManagerDashboard,
    allowedRoles: ['asset_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: AssetManagerDashboard,
      assets: AssetManagerDashboard,
      inventory: AssetManagerDashboard,
    },
  },
  marketing_manager: {
    component: MarketingManagerDashboard,
    allowedRoles: ['marketing_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: MarketingManagerDashboard,
      campaigns: MarketingManagerDashboard,
      analytics: MarketingManagerDashboard,
    },
  },
  seo_manager: {
    component: SEOManagerDashboard,
    allowedRoles: ['seo_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: SEOManagerDashboard,
      keywords: SEOManagerDashboard,
      rankings: SEOManagerDashboard,
    },
  },
  lead_manager: {
    component: LeadManagerDashboard,
    allowedRoles: ['lead_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: LeadManagerDashboard,
      leads: LeadManagerDashboard,
      assignments: LeadManagerDashboard,
    },
  },
  sales_manager: {
    component: SalesManagerDashboard,
    allowedRoles: ['sales_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: SalesManagerDashboard,
      sales: SalesManagerDashboard,
      pipeline: SalesManagerDashboard,
    },
  },
  customer_support: {
    component: CustomerSupportDashboard,
    allowedRoles: ['customer_support', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: CustomerSupportDashboard,
      tickets: CustomerSupportDashboard,
      knowledge: CustomerSupportDashboard,
    },
  },
  franchise_manager: {
    component: FranchiseManagerDashboard,
    allowedRoles: ['franchise_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: FranchiseManagerDashboard,
      franchises: FranchiseManagerDashboard,
      reports: FranchiseManagerDashboard,
    },
  },
  reseller_manager: {
    component: ResellerManagerDashboard,
    allowedRoles: ['reseller_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: ResellerManagerDashboard,
      resellers: ResellerManagerDashboard,
      commissions: ResellerManagerDashboard,
    },
  },
  influencer_manager: {
    component: InfluencerManagerDashboard,
    allowedRoles: ['influencer_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: InfluencerManagerDashboard,
      influencers: InfluencerManagerDashboard,
      campaigns: InfluencerManagerDashboard,
    },
  },
  continent_admin: {
    component: ContinentAdminDashboard,
    allowedRoles: ['continent_admin', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: ContinentAdminDashboard,
      regions: ContinentAdminDashboard,
      reports: ContinentAdminDashboard,
    },
  },
  country_admin: {
    component: CountryAdminDashboard,
    allowedRoles: ['country_admin', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: CountryAdminDashboard,
      countries: CountryAdminDashboard,
      reports: CountryAdminDashboard,
    },
  },
  finance_manager: {
    component: FinanceManagerDashboard,
    allowedRoles: ['finance_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: FinanceManagerDashboard,
      payments: FinanceManagerDashboard,
      reports: FinanceManagerDashboard,
    },
  },
  legal_manager: {
    component: LegalManagerDashboard,
    allowedRoles: ['legal_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: LegalManagerDashboard,
      compliance: LegalManagerDashboard,
      documents: LegalManagerDashboard,
    },
  },
  developer_dashboard: {
    component: DeveloperDashboard,
    allowedRoles: ['developer_dashboard', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: DeveloperDashboard,
      projects: DeveloperDashboard,
      tools: DeveloperDashboard,
    },
  },
  pro_manager: {
    component: ProManagerDashboard,
    allowedRoles: ['pro_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: ProManagerDashboard,
      tools: ProManagerDashboard,
      resources: ProManagerDashboard,
    },
  },
  user_dashboard: {
    component: UserDashboard,
    allowedRoles: ['user_dashboard', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: UserDashboard,
      profile: UserDashboard,
      licenses: UserDashboard,
    },
  },
  security_manager: {
    component: SecurityManagerDashboard,
    allowedRoles: ['security_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: SecurityManagerDashboard,
      threats: SecurityManagerDashboard,
      policies: SecurityManagerDashboard,
    },
  },
  system_settings: {
    component: SystemSettingsDashboard,
    allowedRoles: ['system_settings', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: SystemSettingsDashboard,
      configuration: SystemSettingsDashboard,
      maintenance: SystemSettingsDashboard,
    },
  },
  marketplace_manager: {
    component: MarketplaceManagerDashboard,
    allowedRoles: ['marketplace_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: MarketplaceManagerDashboard,
      products: MarketplaceManagerDashboard,
      vendors: MarketplaceManagerDashboard,
    },
  },
  license_manager: {
    component: LicenseManagerDashboard,
    allowedRoles: ['license_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: LicenseManagerDashboard,
      licenses: LicenseManagerDashboard,
      usage: LicenseManagerDashboard,
    },
  },
  demo_system_manager: {
    component: DemoSystemManagerDashboard,
    allowedRoles: ['demo_system_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: DemoSystemManagerDashboard,
      demos: DemoSystemManagerDashboard,
      scheduling: DemoSystemManagerDashboard,
    },
  },
  deployment_manager: {
    component: DeploymentManagerDashboard,
    allowedRoles: ['deployment_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: DeploymentManagerDashboard,
      deployments: DeploymentManagerDashboard,
      environments: DeploymentManagerDashboard,
    },
  },
  analytics_manager: {
    component: AnalyticsManagerDashboard,
    allowedRoles: ['analytics_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: AnalyticsManagerDashboard,
      reports: AnalyticsManagerDashboard,
      insights: AnalyticsManagerDashboard,
    },
  },
  notification_manager: {
    component: NotificationManagerDashboard,
    allowedRoles: ['notification_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: NotificationManagerDashboard,
      campaigns: NotificationManagerDashboard,
      templates: NotificationManagerDashboard,
    },
  },
  integration_manager: {
    component: IntegrationManagerDashboard,
    allowedRoles: ['integration_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: IntegrationManagerDashboard,
      integrations: IntegrationManagerDashboard,
      webhooks: IntegrationManagerDashboard,
    },
  },
  audit_logs_manager: {
    component: AuditLogsManagerDashboard,
    allowedRoles: ['audit_logs_manager', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: AuditLogsManagerDashboard,
      logs: AuditLogsManagerDashboard,
      reports: AuditLogsManagerDashboard,
    },
  },
  marketplace_core: {
    component: MarketplaceCoreDashboard,
    allowedRoles: ['marketplace_core', 'boss_panel'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: MarketplaceCoreDashboard,
      products: MarketplaceCoreDashboard,
      search: MarketplaceCoreDashboard,
    },
  },
};

// ============= DEEP LINK COMPONENT =============
interface DeepLinkRouteProps {
  role: string;
  module: string;
  action?: string;
  entityId?: string;
}

const DeepLinkRoute: React.FC<DeepLinkRouteProps> = ({ role, module, action, entityId }) => {
  const { setActiveRole, setActiveModule, setActiveScreen, selectEntity, isAuthenticated } = useSaaSGlobalStore();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsValid(false);
      return;
    }

    const config = ROUTE_CONFIG[module];
    if (!config) {
      setIsValid(false);
      return;
    }

    if (!config.allowedRoles.includes(role as SaaSRole)) {
      setIsValid(false);
      return;
    }

    // Set the active module and screen
    setActiveRole(role as SaaSRole);
    setActiveModule(module as SaaSModule, action || config.defaultScreen);
    
    // Select entity if provided
    if (entityId) {
      selectEntity({
        type: module,
        id: entityId,
      });
    }

    setIsValid(true);
  }, [role, module, action, entityId, setActiveRole, setActiveModule, setActiveScreen, selectEntity, isAuthenticated]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/dashboard" replace />;
  }

  const config = ROUTE_CONFIG[module];
  const ScreenComponent = action && config.screens[action] 
    ? config.screens[action] 
    : config.screens[config.defaultScreen];

  return <ScreenComponent />;
};

// ============= ROUTE MIDDLEWARE =============
const RouteMiddleware: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, currentUser } = useSaaSGlobalStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// ============= MAIN ROUTER COMPONENT =============
const DeepLinkSystem: React.FC = () => {
  const location = useLocation();
  const { setActiveModule, setActiveScreen } = useSaaSGlobalStore();

  // Parse URL and update store
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    if (pathParts[0] === 'dashboard' && pathParts.length >= 3) {
      const [, role, module, action, entityId] = pathParts;
      
      setActiveModule(module as SaaSModule, action || 'dashboard');
      if (entityId) {
        // Handle entity selection
      }
    }
  }, [location.pathname, setActiveModule, setActiveScreen]);

  return (
    <Routes>
      {/* Deep Link Routes */}
      <Route path="/dashboard/:role/:module" element={<DeepLinkRouteWrapper />} />
      <Route path="/dashboard/:role/:module/:action" element={<DeepLinkRouteWrapper />} />
      <Route path="/dashboard/:role/:module/:action/:entityId" element={<DeepLinkRouteWrapper />} />

      {/* Fallback Routes */}
      <Route path="/dashboard" element={<Navigate to="/dashboard/boss_panel/boss_panel" replace />} />
      
      {/* Legacy Route Support */}
      <Route path="/boss-panel" element={<Navigate to="/dashboard/boss_panel/boss_panel" replace />} />
      <Route path="/ceo-dashboard" element={<Navigate to="/dashboard/ceo_dashboard/ceo_dashboard" replace />} />
      <Route path="/marketplace" element={<Navigate to="/dashboard/marketplace_manager/marketplace_manager" replace />} />
      <Route path="/leads" element={<Navigate to="/dashboard/lead_manager/lead_manager" replace />} />
      <Route path="/sales" element={<Navigate to="/dashboard/sales_manager/sales_manager" replace />} />
      <Route path="/support" element={<Navigate to="/dashboard/customer_support/customer_support" replace />} />
      <Route path="/analytics" element={<Navigate to="/dashboard/analytics_manager/analytics_manager" replace />} />
      <Route path="/franchise" element={<Navigate to="/dashboard/franchise_manager/franchise_manager" replace />} />
      <Route path="/reseller" element={<Navigate to="/dashboard/reseller_manager/reseller_manager" replace />} />
      <Route path="/user" element={<Navigate to="/dashboard/user_dashboard/user_dashboard" replace />} />

      {/* Module-specific Routes */}
      <Route path="/app/*" element={<AppRoutesWrapper />} />
    </Routes>
  );
};

// ============= WRAPPER COMPONENTS =============
const DeepLinkRouteWrapper: React.FC = () => {
  const params = useParams();
  return (
    <RouteMiddleware>
      <DeepLinkRoute 
        role={params.role!}
        module={params.module!}
        action={params.action}
        entityId={params.entityId}
      />
    </RouteMiddleware>
  );
};

const AppRoutesWrapper: React.FC = () => {
  // Import existing AppRoutes for backward compatibility
  const { AppRoutes } = require('@/routes/appRoutes');
  return <AppRoutes />;
};

// ============= UTILITY FUNCTIONS =============
export const generateDeepLink = (
  role: string, 
  module: string, 
  action?: string, 
  entityId?: string
): string => {
  const parts = ['/dashboard', role, module];
  if (action) parts.push(action);
  if (entityId) parts.push(entityId);
  return parts.join('/');
};

export const parseDeepLink = (url: string): {
  role: string;
  module: string;
  action?: string;
  entityId?: string;
} | null => {
  const parts = url.split('/').filter(Boolean);
  
  if (parts.length < 3 || parts[0] !== 'dashboard') {
    return null;
  }

  const [, role, module, action, entityId] = parts;
  
  return {
    role,
    module,
    action,
    entityId,
  };
};

export const validateDeepLink = (url: string, userRole: string): boolean => {
  const parsed = parseDeepLink(url);
  
  if (!parsed) return false;
  
  const config = ROUTE_CONFIG[parsed.module];
  if (!config) return false;
  
  return config.allowedRoles.includes(userRole as SaaSRole);
};

export default DeepLinkSystem;
