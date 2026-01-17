/**
 * SERVER MODULE CONTAINER
 * Main container that renders sidebar + content
 * For use within RoleSwitchDashboard
 */

import React, { useState } from 'react';
import { 
  ServerModuleSidebar, 
  ServerModuleSection,
  ServerOverview,
  AddServerForm,
  ActiveServersList,
  ServerHealthLoad,
  ServerSecurity,
  ServerBackups,
  ServerLogs,
  AIActions,
  ServerSettings
} from './index';

interface ServerModuleContainerProps {
  initialSection?: ServerModuleSection;
}

export const ServerModuleContainer: React.FC<ServerModuleContainerProps> = ({
  initialSection = 'overview'
}) => {
  const [activeSection, setActiveSection] = useState<ServerModuleSection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <ServerOverview />;
      case 'add-server':
        return <AddServerForm />;
      case 'active-servers':
        return <ActiveServersList />;
      case 'health-load':
        return <ServerHealthLoad />;
      case 'security':
        return <ServerSecurity />;
      case 'backups':
        return <ServerBackups />;
      case 'logs':
        return <ServerLogs />;
      case 'ai-actions':
        return <AIActions />;
      case 'settings':
        return <ServerSettings />;
      default:
        return <ServerOverview />;
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <ServerModuleSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ServerModuleContainer;
