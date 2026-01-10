import React, { useState } from 'react';
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
  | 'settings';

interface BossPanelLayoutProps {
  children?: React.ReactNode;
}

export function BossPanelLayout({ children }: BossPanelLayoutProps) {
  const [activeSection, setActiveSection] = useState<BossPanelSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [streamingOn, setStreamingOn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a10] via-[#0d0d14] to-[#0a0a10] text-white flex flex-col">
      {/* Fixed Global Header */}
      <BossPanelHeader 
        streamingOn={streamingOn}
        onStreamingToggle={() => setStreamingOn(!streamingOn)}
      />

      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <BossPanelSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-6`}>
          {children || <Outlet context={{ activeSection, streamingOn }} />}
        </main>
      </div>
    </div>
  );
}
