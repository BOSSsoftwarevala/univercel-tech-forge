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
  | 'settings';

interface BossPanelLayoutProps {
  children?: React.ReactNode;
}

export function BossPanelLayout({ children }: BossPanelLayoutProps) {
  const [activeSection, setActiveSection] = useState<BossPanelSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [streamingOn, setStreamingOn] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex flex-col">
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
