import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { BossPanelHeader } from './BossPanelHeader';
import { BossPanelSidebar } from './BossPanelSidebar';

export type BossPanelSection = 
  | 'dashboard'
  | 'ceo-dashboard'
  | 'vala-ai'
  | 'server-manager'
  | 'ai-api-manager'
  | 'dev-manager'
  | 'product-manager'
  | 'demo-manager'
  | 'task-manager'
  | 'promise-tracker'
  | 'asset-manager'
  | 'marketing-manager'
  | 'seo-manager'
  | 'lead-manager'
  | 'sales-manager'
  | 'customer-support'
  | 'franchise-manager'
  | 'reseller-manager'
  | 'influencer-manager'
  | 'continent-admin'
  | 'country-admin'
  | 'finance-manager'
  | 'legal-manager'
  | 'developer-dashboard'
  | 'pro-manager'
  | 'user-dashboard'
  | 'security-manager'
  | 'system-settings'
  | 'marketplace-manager'
  | 'license-manager'
  | 'demo-system-manager'
  | 'deployment-manager'
  | 'analytics-manager'
  | 'notification-manager'
  | 'integration-manager'
  | 'audit-logs-manager'
  | 'marketplace-user-system'
  // legacy aliases
  | 'live-activity'
  | 'hierarchy'
  | 'super-admins'
  | 'roles'
  | 'modules'
  | 'products'
  | 'revenue'
  | 'audit'
  | 'security'
  | 'codepilot'
  | 'server-hosting'
  | 'reseller-dashboard'
  | 'franchise-dashboard'
  | 'aira'
  | 'settings';

interface BossPanelLayoutProps {
  children?: React.ReactNode;
}

interface BossPanelContextType {
  activeSection: BossPanelSection;
  streamingOn: boolean;
  setActiveSection: (section: BossPanelSection) => void;
}

const BossPanelContext = createContext<BossPanelContextType | null>(null);

export function useBossPanelContext() {
  const context = useContext(BossPanelContext);
  if (!context) {
    return {
      activeSection: 'dashboard' as BossPanelSection,
      streamingOn: true,
      setActiveSection: () => {}
    };
  }
  return context;
}

// ─── ENTERPRISE DARK THEME TOKENS ─────────────────────────────
const LAYOUT = {
  shellHeight: '48px',
  sidebarWidth: '260px',
  sidebarCollapsed: '56px',
  pageBg: 'hsl(222, 47%, 6%)',
  contentBg: 'hsl(222, 47%, 8%)',
  text: 'hsl(210, 40%, 98%)',
};

export function BossPanelLayout({ children }: BossPanelLayoutProps) {
  const [activeSection, setActiveSection] = useState<BossPanelSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [streamingOn, setStreamingOn] = useState(true);

  const contextValue: BossPanelContextType = {
    activeSection,
    streamingOn,
    setActiveSection
  };

  return (
    <BossPanelContext.Provider value={contextValue}>
      <div 
        className="min-h-screen flex flex-col"
        style={{ background: LAYOUT.pageBg, color: LAYOUT.text }}
      >
        {/* Enterprise Shell Bar */}
        <BossPanelHeader 
          streamingOn={streamingOn}
          onStreamingToggle={() => setStreamingOn(!streamingOn)}
        />

        <div className="flex flex-1" style={{ paddingTop: LAYOUT.shellHeight }}>
          {/* Enterprise Side Navigation */}
          <BossPanelSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />

          {/* Main Content Area */}
          <main 
            className="flex-1 transition-all duration-200 overflow-auto"
            style={{ 
              marginLeft: sidebarCollapsed ? LAYOUT.sidebarCollapsed : LAYOUT.sidebarWidth,
              background: LAYOUT.contentBg,
              padding: '20px 24px',
              minHeight: `calc(100vh - ${LAYOUT.shellHeight})`,
            }}
          >
            {children || <Outlet context={{ activeSection, streamingOn }} />}
          </main>
        </div>
      </div>
    </BossPanelContext.Provider>
  );
}
