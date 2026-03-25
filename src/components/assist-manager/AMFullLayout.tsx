/**
 * ASSIST MANAGER FULL LAYOUT
 * VALA CONNECT - Complete Layout with Sidebar
 */

import React, { useState } from 'react';
import { AMFullSidebar, type AMSection } from './AMFullSidebar';
import useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import { AMAssistDashboard } from './screens/AMAssistDashboard';
import { AMActiveSessions } from './screens/AMActiveSessions';
import { AMCreateAssist } from './screens/AMCreateAssist';
import { AMSessionRequests } from './screens/AMSessionRequests';
import { AMPendingApproval } from './screens/AMPendingApproval';
import { AMLiveAssist } from './screens/AMLiveAssist';
import { AMScreenControl } from './screens/AMScreenControl';
import { AMFileTransfer } from './screens/AMFileTransfer';
import { AMChatVoice } from './screens/AMChatVoice';
import { AMPrivacyControls } from './screens/AMPrivacyControls';
import { AMDeviceAccess } from './screens/AMDeviceAccess';
import { AMSessionLogs } from './screens/AMSessionLogs';
import { AMAIAssistLayer } from './screens/AMAIAssistLayer';
import { AMEmergencyStop } from './screens/AMEmergencyStop';
import { AMSettings } from './screens/AMSettings';

export function AMFullLayout() {
  const [activeSection, setActiveSection] = useState<AMSection>('assist_dashboard');
  const system = useAssistManagerSystem();

  const renderContent = () => {
    switch (activeSection) {
      case 'assist_dashboard':
        return <AMAssistDashboard onNavigate={setActiveSection} system={system} />;
      case 'active_sessions':
        return <AMActiveSessions system={system} onNavigate={setActiveSection} />;
      case 'create_assist':
        return <AMCreateAssist system={system} />;
      case 'session_requests':
        return <AMSessionRequests system={system} onNavigate={setActiveSection} />;
      case 'pending_approval':
        return <AMPendingApproval system={system} onNavigate={setActiveSection} />;
      case 'live_assist':
        return <AMLiveAssist system={system} onNavigate={setActiveSection} />;
      case 'screen_control':
        return <AMScreenControl />;
      case 'file_transfer':
        return <AMFileTransfer />;
      case 'chat_voice':
        return <AMChatVoice />;
      case 'privacy_controls':
        return <AMPrivacyControls />;
      case 'device_access':
        return <AMDeviceAccess />;
      case 'session_logs':
        return <AMSessionLogs />;
      case 'ai_assist_layer':
        return <AMAIAssistLayer />;
      case 'emergency_stop':
        return <AMEmergencyStop system={system} />;
      case 'settings':
        return <AMSettings system={system} />;
      default:
        return <AMAssistDashboard onNavigate={setActiveSection} system={system} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <AMFullSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default AMFullLayout;
