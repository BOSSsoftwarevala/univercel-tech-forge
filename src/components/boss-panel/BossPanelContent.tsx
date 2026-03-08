import React, { lazy, Suspense } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import type { BossPanelSection } from './BossPanelLayout';
import { useBossPanelContext } from './BossPanelLayout';
import { BossDashboard } from './sections/BossDashboard';
import { LiveActivityStream } from './sections/LiveActivityStream';
import { HierarchyControl } from './sections/HierarchyControl';
import { SuperAdminsView } from './sections/SuperAdminsView';
import { RolesPermissions } from './sections/RolesPermissions';
import { SystemModules } from './sections/SystemModules';
import { ProductDemo } from './sections/ProductDemo';
import { RevenueSnapshot } from './sections/RevenueSnapshot';
import { AuditBlackbox } from './sections/AuditBlackbox';
import { SecurityLegal } from './sections/SecurityLegal';
import { BossSettings } from './sections/BossSettings';
import { CodePilot } from './sections/CodePilot';
import { ServerHosting } from './sections/ServerHosting';

import { MMFullLayout } from '@/components/marketplace-manager/MMFullLayout';
import { ServerManagerLayout } from '@/components/server-manager/ServerManagerLayout';
import { AIAPIManagerLayout } from '@/components/ai-api-manager/AIAPIManagerLayout';

const ResellerDashboardEmbed = lazy(() => import('@/pages/ResellerDashboard'));
const FranchiseDashboardEmbed = lazy(() => import('@/pages/franchise/Dashboard'));

interface BossPanelOutletContext {
  activeSection: BossPanelSection;
  streamingOn: boolean;
}

const LoadingFallback = ({ label }: { label: string }) => (
  <div className="p-6 text-center text-sm" style={{ color: 'hsl(215, 22%, 65%)' }}>Loading {label}...</div>
);

/** Placeholder for modules that exist in sidebar but have no dedicated component yet */
const ModulePlaceholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="text-center space-y-3">
      <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'hsla(217, 92%, 65%, 0.1)' }}>
        <span className="text-2xl">🔧</span>
      </div>
      <h2 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 98%)' }}>{title}</h2>
      <p className="text-sm" style={{ color: 'hsl(215, 22%, 65%)' }}>Module under development</p>
    </div>
  </div>
);

export function BossPanelContent() {
  let activeSection: BossPanelSection = 'dashboard';
  let streamingOn = true;
  
  try {
    const outletContext = useOutletContext<BossPanelOutletContext>();
    if (outletContext?.activeSection) {
      activeSection = outletContext.activeSection;
      streamingOn = outletContext.streamingOn ?? true;
    }
  } catch {
    // Outlet context not available
  }
  
  const bossPanelContext = useBossPanelContext();
  if (bossPanelContext.activeSection) {
    activeSection = bossPanelContext.activeSection;
    streamingOn = bossPanelContext.streamingOn;
  }

  const renderSection = () => {
    switch (activeSection) {
      // ─── Command Center ───
      case 'dashboard':
        return <BossDashboard />;
      case 'ceo-dashboard':
        return <Navigate to="/super-admin-system/role-switch?role=aira" replace />;
      case 'vala-ai':
        return <Navigate to="/super-admin-system/role-switch?role=aira&nav=vala-ai" replace />;

      // ─── Infrastructure ───
      case 'server-manager':
        return <ServerManagerLayout />;
      case 'ai-api-manager':
        return <AIAPIManagerLayout />;
      case 'deployment-manager':
        return <ModulePlaceholder title="Deployment Manager" />;
      case 'integration-manager':
        return <ModulePlaceholder title="Integration Manager" />;

      // ─── Development ───
      case 'dev-manager':
        return <ModulePlaceholder title="Development Manager" />;
      case 'product-manager':
        return <Navigate to="/super-admin/product-manager" replace />;
      case 'demo-manager':
        return <ModulePlaceholder title="Demo Manager" />;
      case 'demo-system-manager':
        return <ModulePlaceholder title="Demo System Manager" />;
      case 'task-manager':
        return <ModulePlaceholder title="Task Manager" />;
      case 'promise-tracker':
        return <ModulePlaceholder title="Promise Tracker" />;

      // ─── Business & Sales ───
      case 'marketplace-manager':
        return <MMFullLayout />;
      case 'marketplace-user-system':
        return <ModulePlaceholder title="Marketplace User System" />;
      case 'license-manager':
        return <ModulePlaceholder title="License Manager" />;
      case 'lead-manager':
        return <ModulePlaceholder title="Lead Manager" />;
      case 'sales-manager':
        return <ModulePlaceholder title="Sales Manager" />;
      case 'asset-manager':
        return <ModulePlaceholder title="Asset Manager" />;

      // ─── Marketing & Growth ───
      case 'marketing-manager':
        return <ModulePlaceholder title="Marketing Manager" />;
      case 'seo-manager':
        return <ModulePlaceholder title="SEO Manager" />;
      case 'influencer-manager':
        return <ModulePlaceholder title="Influencer Manager" />;

      // ─── Distribution Network ───
      case 'franchise-manager':
        return <Suspense fallback={<LoadingFallback label="Franchise Manager" />}><FranchiseDashboardEmbed /></Suspense>;
      case 'reseller-manager':
        return <Suspense fallback={<LoadingFallback label="Reseller Manager" />}><ResellerDashboardEmbed /></Suspense>;
      case 'continent-admin':
        return <ModulePlaceholder title="Continent Admin" />;
      case 'country-admin':
        return <ModulePlaceholder title="Country Admin" />;

      // ─── People & Support ───
      case 'customer-support':
        return <ModulePlaceholder title="Customer Support" />;
      case 'developer-dashboard':
        return <ModulePlaceholder title="Developer Dashboard" />;
      case 'pro-manager':
        return <ModulePlaceholder title="Pro Manager" />;
      case 'user-dashboard':
        return <ModulePlaceholder title="User Dashboard" />;

      // ─── Finance & Legal ───
      case 'finance-manager':
        return <ModulePlaceholder title="Finance Manager" />;
      case 'legal-manager':
        return <ModulePlaceholder title="Legal Manager" />;

      // ─── Security & Audit ───
      case 'security-manager':
        return <ModulePlaceholder title="Security Manager" />;
      case 'audit-logs-manager':
        return <ModulePlaceholder title="Audit Logs Manager" />;
      case 'analytics-manager':
        return <ModulePlaceholder title="Analytics Manager" />;
      case 'notification-manager':
        return <ModulePlaceholder title="Notification Manager" />;

      // ─── Configuration ───
      case 'system-settings':
        return <ModulePlaceholder title="System Settings" />;

      // ─── Legacy aliases ───
      case 'live-activity':
        return <LiveActivityStream streamingOn={streamingOn} />;
      case 'hierarchy':
        return <HierarchyControl />;
      case 'super-admins':
        return <SuperAdminsView />;
      case 'roles':
        return <RolesPermissions />;
      case 'modules':
        return <SystemModules />;
      case 'products':
        return <ProductDemo />;
      case 'revenue':
        return <RevenueSnapshot />;
      case 'audit':
        return <AuditBlackbox />;
      case 'security':
        return <SecurityLegal />;
      case 'codepilot':
        return <CodePilot />;
      case 'server-hosting':
        return <ServerHosting />;
      case 'reseller-dashboard':
        return <Suspense fallback={<LoadingFallback label="Reseller Dashboard" />}><ResellerDashboardEmbed /></Suspense>;
      case 'franchise-dashboard':
        return <Suspense fallback={<LoadingFallback label="Franchise Dashboard" />}><FranchiseDashboardEmbed /></Suspense>;
      case 'aira':
        return <Navigate to="/super-admin-system/role-switch?role=aira" replace />;
      case 'settings':
        return <BossSettings />;

      default:
        return <BossDashboard />;
    }
  };

  return renderSection();
}
