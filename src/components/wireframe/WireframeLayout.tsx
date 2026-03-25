import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { WireframeHeader } from './WireframeHeader';
import { WireframeSidebar } from './WireframeSidebar';
import { WireframeFooter } from './WireframeFooter';
import { InternalChatDock } from './InternalChatDock';
import { AIAssistantWidget } from './AIAssistantWidget';

interface WireframeLayoutProps {
  children?: React.ReactNode;
}

export function WireframeLayout({ children }: WireframeLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Fixed Top Header */}
      <WireframeHeader 
        theme={theme} 
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onChatToggle={() => setChatOpen(!chatOpen)}
      />

      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <WireframeSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          theme={theme}
        />

        {/* Main Body */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} ${chatOpen ? 'mr-80' : 'mr-0'} p-6`}>
          {children || <Outlet />}
        </main>

        {/* Right Chat Dock */}
        <InternalChatDock open={chatOpen} onClose={() => setChatOpen(false)} theme={theme} />
      </div>

      {/* AI Assistant Floating Widget */}
      <AIAssistantWidget theme={theme} />

      {/* Footer */}
      <WireframeFooter theme={theme} />
    </div>
  );
}
