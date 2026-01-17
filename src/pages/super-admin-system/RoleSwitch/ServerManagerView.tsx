/**
 * SERVER MANAGER VIEW
 * Content-only component for use within RoleSwitchDashboard
 * Uses the new ultra-simple ServerModuleContainer
 */

import React from 'react';
import { ServerModuleContainer } from '@/components/server-module/ServerModuleContainer';

interface ServerManagerViewProps {
  activeNav?: string;
}

const ServerManagerView: React.FC<ServerManagerViewProps> = ({ activeNav = 'overview' }) => {
  // Map old nav values to new section values if needed
  const getSectionFromNav = (nav: string): 
    'overview' | 'add-server' | 'active-servers' | 'health-load' | 'security' | 'backups' | 'logs' | 'ai-actions' | 'settings' => {
    const mapping: Record<string, any> = {
      'dashboard': 'overview',
      'servers': 'active-servers',
      'databases': 'overview',
      'storage': 'overview',
      'monitoring': 'health-load',
      'performance': 'health-load',
      'security': 'security',
      'activity': 'logs',
      'settings': 'settings',
      'overview': 'overview',
      'add-server': 'add-server',
      'active-servers': 'active-servers',
      'health-load': 'health-load',
      'backups': 'backups',
      'logs': 'logs',
      'ai-actions': 'ai-actions',
    };
    return mapping[nav] || 'overview';
  };

  return (
    <ServerModuleContainer initialSection={getSectionFromNav(activeNav)} />
  );
};

export default ServerManagerView;
