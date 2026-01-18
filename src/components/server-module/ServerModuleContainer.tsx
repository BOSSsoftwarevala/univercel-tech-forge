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
  onBack?: () => void;
}

export const ServerModuleContainer: React.FC<ServerModuleContainerProps> = ({
  initialSection = 'overview',
  onBack
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
    <div className="flex min-h-screen w-full" style={{ background: '#0B0F1A' }}>
      <ServerModuleSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBack={onBack}
      />
      <div className="flex-1 p-6 overflow-auto" style={{ color: '#FFFFFF' }}>{renderContent()}</div>
    </div>
  );
};
