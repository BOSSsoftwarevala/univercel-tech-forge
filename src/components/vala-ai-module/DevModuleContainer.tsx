/**
 * DEV MODULE CONTAINER
 * Main container that combines sidebar + content
 */

import React, { useState } from 'react';
import { DevModuleSidebar, DevSection } from './DevModuleSidebar';
import { DevOverview } from './DevOverview';
import { StartNewBuild } from './StartNewBuild';
import { ActiveBuilds } from './ActiveBuilds';
import { DemoFactory } from './DemoFactory';
import { BugFixCenter } from './BugFixCenter';
import { DevTesting } from './DevTesting';
import { DevDeployment } from './DevDeployment';
import { DevVersions } from './DevVersions';
import { DevLogs } from './DevLogs';
import { DevSettings } from './DevSettings';

interface DevModuleContainerProps {
  initialSection?: DevSection;
  onBack?: () => void;
}

export const DevModuleContainer: React.FC<DevModuleContainerProps> = ({
  initialSection = 'overview',
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<DevSection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DevOverview />;
      case 'start-build':
        return <StartNewBuild />;
      case 'active-builds':
        return <ActiveBuilds />;
      case 'demo-factory':
        return <DemoFactory />;
      case 'bug-fix':
        return <BugFixCenter />;
      case 'testing':
        return <DevTesting />;
      case 'deployment':
        return <DevDeployment />;
      case 'versions':
        return <DevVersions />;
      case 'logs':
        return <DevLogs />;
      case 'settings':
        return <DevSettings />;
      default:
        return <DevOverview />;
    }
  };

  return (
    <div className="flex h-full bg-background/50 rounded-xl border border-border/50 overflow-hidden">
      <DevModuleSidebar 
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
