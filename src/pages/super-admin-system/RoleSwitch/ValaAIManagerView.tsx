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

const ValaAIManagerView: React.FC<ValaAIManagerViewProps> = ({ activeNav = 'home' }) => {
  const getSectionFromNav = (nav: string): ValaAISection => {
    const mapping: Record<string, ValaAISection> = {
      'dashboard': 'home',
      'home': 'home',
      'new-project': 'new-project',
      'live-builds': 'live-builds',
      'active-demos': 'active-demos',
      'issue-inbox': 'issue-inbox',
      'auto-fix-queue': 'auto-fix-queue',
      'deployment': 'deployment',
      'versions': 'versions',
      'logs': 'logs',
      'settings': 'settings',
    };
    return mapping[nav] || 'home';
  };

  return (
    <ValaAIModuleContainer initialSection={getSectionFromNav(activeNav)} />
  );
};

export default ValaAIManagerView;
