/**
 * SUPPORT CHATBOT DASHBOARD
 * User-friendly, production-ready SaaS interface
 */

import React, { useState } from 'react';
import { ChatbotSidebar, ChatbotSection } from './ChatbotSidebar';
import { ChatbotCommandBar } from './ChatbotCommandBar';
import { CBOverview } from './screens/CBOverview';
import { CBChatbotManagement } from './screens/CBChatbotManagement';
import { CBLiveChatInbox } from './screens/CBLiveChatInbox';
import { CBBotTraining } from './screens/CBBotTraining';
import { CBAutomationRules } from './screens/CBAutomationRules';
import { CBMultiLanguage } from './screens/CBMultiLanguage';
import { CBAndroidIntegration } from './screens/CBAndroidIntegration';
import { CBAnalyticsLogs } from './screens/CBAnalyticsLogs';

export const SupportChatbotDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ChatbotSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <CBOverview />;
      case 'chatbots':
        return <CBChatbotManagement />;
      case 'live-chat':
        return <CBLiveChatInbox />;
      case 'training':
        return <CBBotTraining />;
      case 'automation':
        return <CBAutomationRules />;
      case 'languages':
        return <CBMultiLanguage />;
      case 'android':
        return <CBAndroidIntegration />;
      case 'analytics':
        return <CBAnalyticsLogs />;
      default:
        return <CBOverview />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <ChatbotSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatbotCommandBar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
