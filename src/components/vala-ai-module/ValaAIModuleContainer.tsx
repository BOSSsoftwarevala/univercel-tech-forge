/**
 * VALA AI MODULE CONTAINER
 * Main container that combines sidebar + content
 * RENAMED: From Development Manager to VALA AI
 */

import React, { useState } from 'react';
import { ValaAISidebar, ValaAISection } from './ValaAISidebar';
import { ValaAIHome } from './ValaAIHome';
import { ValaAINewProject } from './ValaAINewProject';
import { ValaAILiveBuilds } from './ValaAILiveBuilds';
import { ValaAIIssueInbox } from './ValaAIIssueInbox';
import { ValaAIAutoFixQueue } from './ValaAIAutoFixQueue';
import { AIClientDeployPanel } from './AIClientDeployPanel';
import { AIDeploymentHistoryPanel } from './AIDeploymentHistoryPanel';
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
    <div className="flex h-full w-full">
      <ValaAISidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBack={onBack}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};
