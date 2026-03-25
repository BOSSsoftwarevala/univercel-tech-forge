/**
 * SUPPORT CHATBOT WIREFRAME
 * Low-fidelity enterprise SaaS dashboard
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatbotSidebar } from './ChatbotSidebar';
import { ChatbotTopBar } from './ChatbotTopBar';
import { SCDashboard } from './screens/SCDashboard';
import { SCChatbotList } from './screens/SCChatbotList';
import { SCLiveChatInbox } from './screens/SCLiveChatInbox';
import { SCBotTraining } from './screens/SCBotTraining';
import { SCAutomationRules } from './screens/SCAutomationRules';
import { SCLanguages } from './screens/SCLanguages';
import { SCAnalytics } from './screens/SCAnalytics';
import { SCLogs } from './screens/SCLogs';
import { SCSettings } from './screens/SCSettings';

export type ChatbotScreen = 
  | 'dashboard'
  | 'chatbots'
  | 'live-chats'
  | 'training'
  | 'automation'
  | 'languages'
  | 'analytics'
  | 'logs'
  | 'settings';

interface SupportChatbotWireframeProps {
  onBack?: () => void;
}

export const SupportChatbotWireframe: React.FC<SupportChatbotWireframeProps> = ({ onBack }) => {
  const [activeScreen, setActiveScreen] = useState<ChatbotScreen>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <SCDashboard onNavigate={setActiveScreen} />;
      case 'chatbots':
        return <SCChatbotList />;
      case 'live-chats':
        return <SCLiveChatInbox />;
      case 'training':
        return <SCBotTraining />;
      case 'automation':
        return <SCAutomationRules />;
      case 'languages':
        return <SCLanguages />;
      case 'analytics':
        return <SCAnalytics />;
      case 'logs':
        return <SCLogs />;
      case 'settings':
        return <SCSettings />;
      default:
        return <SCDashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <ChatbotSidebar 
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onBack={onBack}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
        <ChatbotTopBar />

        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SupportChatbotWireframe;
