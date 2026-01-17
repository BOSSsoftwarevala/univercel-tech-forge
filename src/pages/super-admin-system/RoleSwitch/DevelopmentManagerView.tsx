/**
 * DEVELOPMENT MANAGER VIEW
 * Content-only component for use within RoleSwitchDashboard
 * Uses the new DevModuleContainer
 */

import React from 'react';
import { DevModuleContainer } from '@/components/development-module/DevModuleContainer';

interface DevelopmentManagerViewProps {
  activeNav?: string;
}

const DevelopmentManagerView: React.FC<DevelopmentManagerViewProps> = ({ activeNav = 'overview' }) => {
  const getSectionFromNav = (nav: string): any => {
    const mapping: Record<string, any> = {
      'dashboard': 'overview',
      'overview': 'overview',
      'start-build': 'start-build',
      'active-builds': 'active-builds',
      'demo-factory': 'demo-factory',
      'bug-fix': 'bug-fix',
      'testing': 'testing',
      'deployment': 'deployment',
      'versions': 'versions',
      'logs': 'logs',
      'settings': 'settings',
    };
    return mapping[nav] || 'overview';
  };

  return (
    <DevModuleContainer initialSection={getSectionFromNav(activeNav)} />
  );
};

export default DevelopmentManagerView;
