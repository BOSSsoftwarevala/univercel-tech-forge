/**
 * Deep Link Router - Dynamic Route Structure
 * Pattern: /dashboard/{role}/{module}/{action}/{entityId}
 * All dashboards interconnected with shared middleware
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useUnifiedSaaSStore } from '@/stores/unifiedSaaSStore';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { RequireRole } from '@/components/auth/RequireRole';
import { Loader2 } from 'lucide-react';

// Import all dashboard components
import BossPanel from '@/pages/BossPanel';
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
  allowedRoles: string[];
  defaultScreen: string;
  screens: Record<string, React.ComponentType<any>>;
}

const ROUTE_CONFIG: Record<string, RouteConfig> = {
  boss_panel: {
    component: BossPanel,
    allowedRoles: ['boss_owner'],
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
    allowedRoles: ['ceo', 'boss_owner'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: CEODashboard,
      reports: CEODashboard,
      kpi: CEODashboard,
    },
  },
  vala_ai: {
    component: ValaAIDashboard,
    allowedRoles: ['vala_ai', 'boss_owner'],
    defaultScreen: 'dashboard',
    screens: {
      dashboard: ValaAIDashboard,
      chat: ValaAIDashboard,
      training: ValaAIDashboard,
    },
  },
  // Add all other role configurations...
};

// ============= DEEP LINK COMPONENT =============
interface DeepLinkRouteProps {
  role: string;
  module: string;
  action?: string;
  entityId?: string;
}

const DeepLinkRoute: React.FC<DeepLinkRouteProps> = ({ role, module, action, entityId }) => {
  const { setActiveRole, setActiveModule, setActiveScreen, selectEntity, isAuthenticated } = useUnifiedSaaSStore();
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

    if (!config.allowedRoles.includes(role)) {
      setIsValid(false);
      return;
    }

    // Set the active module and screen
    setActiveRole(role as any);
    setActiveModule(module as any, action || config.defaultScreen);
    
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
        <Loader2 className="w-8 h-8 animate-spin" />
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
  const { isAuthenticated, currentUser } = useUnifiedSaaSStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// ============= MAIN ROUTER COMPONENT =============
const DeepLinkRouter: React.FC = () => {
  const location = useLocation();
  const { setActiveModule, setActiveScreen } = useUnifiedSaaSStore();

  // Parse URL and update store
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    if (pathParts[0] === 'dashboard' && pathParts.length >= 3) {
      const [, role, module, action, entityId] = pathParts;
      
      setActiveModule(module as any, action || 'dashboard');
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
      <Route path="/dashboard" element={<Navigate to="/dashboard/boss_owner/boss_panel" replace />} />
      
      {/* Legacy Route Support */}
      <Route path="/boss-panel" element={<Navigate to="/dashboard/boss_owner/boss_panel" replace />} />
      <Route path="/ceo-dashboard" element={<Navigate to="/dashboard/ceo/ceo_dashboard" replace />} />
      <Route path="/marketplace" element={<Navigate to="/dashboard/marketplace_manager/marketplace_manager" replace />} />
      <Route path="/leads" element={<Navigate to="/dashboard/lead_manager/lead_manager" replace />} />
      <Route path="/sales" element={<Navigate to="/dashboard/sales_manager/sales_manager" replace />} />
      <Route path="/support" element={<Navigate to="/dashboard/customer_support/customer_support" replace />} />
      <Route path="/analytics" element={<Navigate to="/dashboard/analytics_manager/analytics_manager" replace />} />
      <Route path="/franchise" element={<Navigate to="/dashboard/franchise_manager/franchise_manager" replace />} />
      <Route path="/reseller" element={<Navigate to="/dashboard/reseller_manager/reseller_manager" replace />} />
      <Route path="/user" element={<Navigate to="/dashboard/user/user_dashboard" replace />} />

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
  
  return config.allowedRoles.includes(userRole);
};

export default DeepLinkRouter;
