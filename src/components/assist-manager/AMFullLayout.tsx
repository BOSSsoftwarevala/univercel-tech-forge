/**
 * ASSIST MANAGER FULL LAYOUT
 * VALA CONNECT - Complete Layout with Sidebar
 */

import React, { useState } from 'react';
import { AMFullSidebar, type AMSection } from './AMFullSidebar';
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

  const renderContent = () => {
    switch (activeSection) {
      case 'assist_dashboard':
        return <AMAssistDashboard onNavigate={setActiveSection} />;
      case 'active_sessions':
        return <AMActiveSessions />;
      case 'create_assist':
        return <AMCreateAssist />;
      case 'session_requests':
        return <AMSessionRequests />;
      case 'pending_approval':
        return <AMPendingApproval />;
      case 'live_assist':
        return <AMLiveAssist />;
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
        return <AMEmergencyStop />;
      case 'settings':
        return <AMSettings />;
      default:
        return <AMAssistDashboard onNavigate={setActiveSection} />;
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
