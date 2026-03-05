import React, { lazy, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';
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
import { ValaAIModuleContainer } from '@/components/vala-ai-module/ValaAIModuleContainer';
import { MMFullLayout } from '@/components/marketplace-manager/MMFullLayout';

const ResellerDashboardEmbed = lazy(() => import('@/pages/ResellerDashboard'));
const FranchiseDashboardEmbed = lazy(() => import('@/pages/franchise/Dashboard'));
const CEODashboardEmbed = lazy(() => import('@/pages/super-admin-system/RoleSwitch/CEODashboard'));

interface BossPanelOutletContext {
  activeSection: BossPanelSection;
  streamingOn: boolean;
}

export function BossPanelContent() {
  // Try outlet context first (for router-based usage), fallback to React context
  let activeSection: BossPanelSection = 'dashboard';
  let streamingOn = true;
  
  try {
    const outletContext = useOutletContext<BossPanelOutletContext>();
    if (outletContext?.activeSection) {
      activeSection = outletContext.activeSection;
      streamingOn = outletContext.streamingOn ?? true;
    }
  } catch {
    // Outlet context not available, use React context
  }
  
  // Fallback to React context if outlet didn't provide values
  const bossPanelContext = useBossPanelContext();
  if (activeSection === 'dashboard' && bossPanelContext.activeSection !== 'dashboard') {
    activeSection = bossPanelContext.activeSection;
    streamingOn = bossPanelContext.streamingOn;
  }
  
  // Use the context values if available
  if (bossPanelContext.activeSection) {
    activeSection = bossPanelContext.activeSection;
    streamingOn = bossPanelContext.streamingOn;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <BossDashboard />;
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
      case 'vala-ai':
        return <ValaAIModuleContainer />;
      case 'marketplace-manager':
        return <MMFullLayout />;
      case 'reseller-dashboard':
        return <Suspense fallback={<div className="p-6 text-center">Loading Reseller Dashboard...</div>}><ResellerDashboardEmbed /></Suspense>;
      case 'franchise-dashboard':
        return <Suspense fallback={<div className="p-6 text-center">Loading Franchise Dashboard...</div>}><FranchiseDashboardEmbed /></Suspense>;
      case 'aira':
        return <Suspense fallback={<div className="p-6 text-center">Loading AIRA...</div>}><CEODashboardEmbed /></Suspense>;
      case 'settings':
        return <BossSettings />;
      default:
        return <BossDashboard />;
    }
  };

  return renderSection();
}
