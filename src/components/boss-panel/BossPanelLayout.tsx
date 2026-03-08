import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { BossPanelHeader } from './BossPanelHeader';
import { BossPanelSidebar } from './BossPanelSidebar';

export type BossPanelSection = 
  | 'dashboard'
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
  | 'vala-ai'
  | 'reseller-dashboard'
  | 'franchise-dashboard'
  | 'marketplace-manager'
  | 'aira'
  | 'settings';

interface BossPanelLayoutProps {
  children?: React.ReactNode;
}

// Context for Boss Panel state
interface BossPanelContextType {
  activeSection: BossPanelSection;
  streamingOn: boolean;
  setActiveSection: (section: BossPanelSection) => void;
}

const BossPanelContext = createContext<BossPanelContextType | null>(null);

// Hook to access Boss Panel context
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

// ─── SAP FIORI LAYOUT TOKENS ─────────────────────────────────
const LAYOUT = {
  shellHeight: '44px',          // SAP Shell Bar height
  sidebarWidth: '240px',        // SAP Side Navigation width
  sidebarCollapsed: '48px',     // Collapsed icon-only width
  contentBg: 'hsl(210, 25%, 97%)', // SAP Fiori page background
  text: 'hsl(214, 27%, 19%)',
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
        style={{ background: LAYOUT.contentBg, color: LAYOUT.text }}
      >
        {/* SAP Shell Bar - 44px */}
        <BossPanelHeader 
          streamingOn={streamingOn}
          onStreamingToggle={() => setStreamingOn(!streamingOn)}
        />

        <div className="flex flex-1" style={{ paddingTop: LAYOUT.shellHeight }}>
          {/* SAP Side Navigation */}
          <BossPanelSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />

          {/* Main Content Area - SAP Object Page style */}
          <main 
            className="flex-1 transition-all duration-200"
            style={{ 
              marginLeft: sidebarCollapsed ? LAYOUT.sidebarCollapsed : LAYOUT.sidebarWidth,
              background: LAYOUT.contentBg,
              padding: '20px 24px',
            }}
          >
            {children || <Outlet context={{ activeSection, streamingOn }} />}
          </main>
        </div>
      </div>
    </BossPanelContext.Provider>
  );
}
