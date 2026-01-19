/**
 * DEVELOPER FULL LAYOUT
 * Main container for Developer Dashboard
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { DevFullSidebar, DevSection } from './DevFullSidebar';
import { DevFullHeader } from './DevFullHeader';
import { DevHomeScreen } from './screens/DevHomeScreen';
import { DevProjectsScreen } from './screens/DevProjectsScreen';
import { DevBuildDeployScreen } from './screens/DevBuildDeployScreen';
import { DevTasksScreen } from './screens/DevTasksScreen';
import { DevBugsScreen } from './screens/DevBugsScreen';
import { DevAICopilotScreen } from './screens/DevAICopilotScreen';
import { DevMonitoringScreen } from './screens/DevMonitoringScreen';
import { DevPromisesScreen } from './screens/DevPromisesScreen';
import { DevLogsScreen } from './screens/DevLogsScreen';
import { DevToolsScreen } from './screens/DevToolsScreen';
import { DevCommunicationScreen } from './screens/DevCommunicationScreen';
import { DevSettingsScreen } from './screens/DevSettingsScreen';

interface DevFullLayoutProps {
  initialSection?: DevSection;
  onBack?: () => void;
}

export const DevFullLayout: React.FC<DevFullLayoutProps> = ({
  initialSection = 'home',
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<DevSection>(initialSection);

  const handleNavigate = (section: string) => {
    setActiveSection(section as DevSection);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DevHomeScreen onNavigate={handleNavigate} />;
      
      // Projects
      case 'projects-active':
        return <DevProjectsScreen view="active" />;
      case 'projects-waiting':
        return <DevProjectsScreen view="waiting" />;
      case 'projects-hold':
        return <DevProjectsScreen view="hold" />;
      case 'projects-completed':
        return <DevProjectsScreen view="completed" />;
      
      // Build & Deploy
      case 'build-queue':
        return <DevBuildDeployScreen view="build" />;
      case 'deploy-queue':
        return <DevBuildDeployScreen view="deploy" />;
      
      // Tasks
      case 'tasks-my':
        return <DevTasksScreen view="my" />;
      case 'tasks-team':
        return <DevTasksScreen view="team" />;
      
      // Bugs
      case 'bugs-reported':
        return <DevBugsScreen view="reported" />;
      case 'bugs-auto':
        return <DevBugsScreen view="auto" />;
      
      // AI Co-Pilot
      case 'ai-suggestions':
        return <DevAICopilotScreen view="suggestions" />;
      case 'ai-autofix':
        return <DevAICopilotScreen view="autofix" />;
      case 'ai-assist':
        return <DevAICopilotScreen view="assist" />;
      
      // Monitoring
      case 'monitor-build':
        return <DevMonitoringScreen view="build" />;
      case 'monitor-server':
        return <DevMonitoringScreen view="server" />;
      
      // Promises
      case 'promises-my':
        return <DevPromisesScreen view="my" />;
      case 'promises-team':
        return <DevPromisesScreen view="team" />;
      
      // Logs
      case 'logs-activity':
        return <DevLogsScreen view="activity" />;
      case 'logs-build':
        return <DevLogsScreen view="build" />;
      
      // Tools
      case 'tools-formatter':
        return <DevToolsScreen view="formatter" />;
      case 'tools-optimizer':
        return <DevToolsScreen view="optimizer" />;
      case 'tools-validator':
        return <DevToolsScreen view="validator" />;
      
      // Communication
      case 'comm-chat':
        return <DevCommunicationScreen view="chat" />;
      case 'comm-issues':
        return <DevCommunicationScreen view="issues" />;
      
      // Settings
      case 'settings':
        return <DevSettingsScreen />;
      
      default:
        return <DevHomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950">
      <DevFullHeader />
      <div className="flex flex-1 overflow-hidden">
        <DevFullSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onBack={onBack}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
