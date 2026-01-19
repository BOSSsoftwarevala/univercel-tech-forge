/**
 * VALA AI MANAGER VIEW
 * Content-only component for use within RoleSwitchDashboard
 * Uses the ValaAIModuleContainer
 */

import React from 'react';
import { ValaAIModuleContainer } from '@/components/vala-ai-module/ValaAIModuleContainer';
import type { ValaAISection } from '@/components/vala-ai-module/ValaAISidebar';

interface ValaAIManagerViewProps {
  activeNav?: string;
}

const ValaAIManagerView: React.FC<ValaAIManagerViewProps> = ({ activeNav = 'command-center' }) => {
  const getSectionFromNav = (nav: string): ValaAISection => {
    const mapping: Record<string, ValaAISection> = {
      'dashboard': 'command-center',
      'home': 'command-center',
      'command-center': 'command-center',
      'active-project': 'active-project',
      'prompt-history': 'prompt-history',
      'execution-logs': 'execution-logs',
      'error-detection': 'error-detection',
      'rollback': 'rollback',
      'lock-status': 'lock-status',
      'models': 'models',
      'credits': 'credits',
      'settings': 'settings',
    };
    return mapping[nav] || 'command-center';
  };

  return (
    <ValaAIModuleContainer initialSection={getSectionFromNav(activeNav)} />
  );
};

export default ValaAIManagerView;
