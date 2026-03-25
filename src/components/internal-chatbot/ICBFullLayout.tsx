/**
 * INTERNAL CHAT BOT - FULL LAYOUT
 * Secure Assist Chat System
 */

import React, { useState } from 'react';
import { ICBFullSidebar, ICBScreen } from './ICBFullSidebar';
import { ICBChatDashboard } from './screens/ICBChatDashboard';
import { ICBNewInquiry } from './screens/ICBNewInquiry';
import { ICBMyInquiries } from './screens/ICBMyInquiries';
import { ICBPendingApproval } from './screens/ICBPendingApproval';
import { ICBApprovedChats } from './screens/ICBApprovedChats';
import { ICBActiveChats } from './screens/ICBActiveChats';
import { ICBUrgentRequests } from './screens/ICBUrgentRequests';
import { ICBAIFirstResponse } from './screens/ICBAIFirstResponse';
import { ICBEscalatedChats } from './screens/ICBEscalatedChats';
import { ICBClosedChats } from './screens/ICBClosedChats';
import { ICBBlockedUsers } from './screens/ICBBlockedUsers';
import { ICBChatRules } from './screens/ICBChatRules';
import { ICBAuditLogs } from './screens/ICBAuditLogs';
import { ICBSettings } from './screens/ICBSettings';

export const ICBFullLayout: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ICBScreen>('chat_dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'chat_dashboard':
        return <ICBChatDashboard onNavigate={setActiveScreen} />;
      case 'new_inquiry':
        return <ICBNewInquiry />;
      case 'my_inquiries':
        return <ICBMyInquiries />;
      case 'pending_approval':
        return <ICBPendingApproval />;
      case 'approved_chats':
        return <ICBApprovedChats />;
      case 'active_chats':
        return <ICBActiveChats />;
      case 'urgent_requests':
        return <ICBUrgentRequests />;
      case 'ai_first_response':
        return <ICBAIFirstResponse />;
      case 'escalated_chats':
        return <ICBEscalatedChats />;
      case 'closed_chats':
        return <ICBClosedChats />;
      case 'blocked_users':
        return <ICBBlockedUsers />;
      case 'chat_rules':
        return <ICBChatRules />;
      case 'audit_logs':
        return <ICBAuditLogs />;
      case 'settings':
        return <ICBSettings />;
      default:
        return <ICBChatDashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <ICBFullSidebar
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 overflow-auto p-6">
        {renderScreen()}
      </div>
    </div>
  );
};

export default ICBFullLayout;
