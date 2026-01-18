/**
 * VALA AI MODULE CONTAINER
 * Main container that combines sidebar + content
 * RENAMED: From Development Manager to VALA AI
 * FULL FEATURES: Dashboard, Models, Tasks, API, Automation, Credits, Alerts
 */

import React, { useState } from 'react';
import { ValaAISidebar, ValaAISection } from './ValaAISidebar';
import { ValaAIHome } from './ValaAIHome';
import { ValaAINewProject } from './ValaAINewProject';
import { ValaAILiveBuilds } from './ValaAILiveBuilds';
import { ValaAIIssueInbox } from './ValaAIIssueInbox';
import { ValaAIAutoFixQueue } from './ValaAIAutoFixQueue';
import { AIClientDeployPanel } from './AIClientDeployPanel';
import { ValaAIFullDashboard } from './ValaAIFullDashboard';
import { AIModelsPanel } from './AIModelsPanel';
import { AITasksPanel } from './AITasksPanel';
import { AIAPIPanel } from './AIAPIPanel';
import { AIAutomationPanel } from './AIAutomationPanel';
import { AICreditsPanel } from './AICreditsPanel';
import { AIAlertsPanel } from './AIAlertsPanel';
import { DevVersions } from './DevVersions';
import { DevLogs } from './DevLogs';
import { DevSettings } from './DevSettings';
import { DemoFactory } from './DemoFactory';

interface ValaAIModuleContainerProps {
  initialSection?: ValaAISection;
  onBack?: () => void;
}

export const ValaAIModuleContainer: React.FC<ValaAIModuleContainerProps> = ({
  initialSection = 'home',
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<ValaAISection>(initialSection);

  const handleNavigate = (section: ValaAISection) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <ValaAIHome onNavigate={handleNavigate} />;
      case 'dashboard':
        return <ValaAIFullDashboard />;
      case 'new-project':
        return <ValaAINewProject />;
      case 'live-builds':
        return <ValaAILiveBuilds />;
      case 'active-demos':
        return <DemoFactory />;
      case 'issue-inbox':
        return <ValaAIIssueInbox />;
      case 'auto-fix-queue':
        return <ValaAIAutoFixQueue />;
      case 'deployment':
        return <AIClientDeployPanel />;
      case 'models':
        return <AIModelsPanel />;
      case 'tasks':
        return <AITasksPanel />;
      case 'api':
        return <AIAPIPanel />;
      case 'automation':
        return <AIAutomationPanel />;
      case 'credits':
        return <AICreditsPanel />;
      case 'alerts':
        return <AIAlertsPanel />;
      case 'versions':
        return <DevVersions />;
      case 'logs':
        return <DevLogs />;
      case 'settings':
        return <DevSettings />;
      default:
        return <ValaAIHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: '#0B0F1A' }}>
      <ValaAISidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBack={onBack}
      />
      <div className="flex-1 p-6 overflow-y-auto" style={{ color: '#FFFFFF' }}>
        {renderContent()}
      </div>
    </div>
  );
};
