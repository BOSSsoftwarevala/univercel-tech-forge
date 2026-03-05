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
    // Return default values if context not available (fallback)
    return {
      activeSection: 'dashboard' as BossPanelSection,
      streamingOn: true,
      setActiveSection: () => {}
    };
  }
  return context;
}

// LOCKED: Background #0B0F1A, text #FFFFFF
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
        style={{ 
          background: '#F8FAFC',
          color: '#1E293B'
        }}
      >
        {/* Fixed Global Header - LOCKED 64px */}
        <BossPanelHeader 
          streamingOn={streamingOn}
          onStreamingToggle={() => setStreamingOn(!streamingOn)}
        />

        <div className="flex flex-1" style={{ paddingTop: '64px' }}>
          {/* Left Sidebar - LOCKED 260px/80px */}
          <BossPanelSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />

          {/* Main Content - White background like reference */}
          <main 
            className="flex-1 p-6 transition-all duration-300"
            style={{ 
              marginLeft: sidebarCollapsed ? '80px' : '260px',
              background: '#F8FAFC'
            }}
          >
            {children || <Outlet context={{ activeSection, streamingOn }} />}
          </main>
        </div>
      </div>
    </BossPanelContext.Provider>
  );
}
