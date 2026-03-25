import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { BossPanelSection } from './BossPanelLayout';
import { BossDashboard } from './sections/BossDashboard';
import { FullAutoSystem } from './sections/FullAutoSystem';
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

interface BossPanelContext {
  activeSection: BossPanelSection;
  streamingOn: boolean;
}

export function BossPanelContent() {
  const { activeSection, streamingOn } = useOutletContext<BossPanelContext>();

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <BossDashboard />;
      case 'full-auto':
        return <FullAutoSystem />;
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
      case 'settings':
        return <BossSettings />;
      default:
        return <BossDashboard />;
    }
  };

  return renderSection();
}
