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

const ValaAIManagerView: React.FC<ValaAIManagerViewProps> = ({ activeNav = 'overview' }) => {
  const getSectionFromNav = (nav: string): ValaAISection => {
    const mapping: Record<string, ValaAISection> = {
      'dashboard': 'overview',
      'overview': 'overview',
      'ai-requests': 'ai-requests',
      'ai-tasks': 'ai-tasks',
      'ai-models': 'ai-models',
      'ai-alerts': 'ai-alerts',
      'ai-usage': 'ai-usage',
      'ai-credits': 'ai-credits',
      'ai-api': 'ai-api',
      'ai-automation': 'ai-automation',
    };
    return mapping[nav] || 'overview';
  };

  return (
    <ValaAIModuleContainer initialSection={getSectionFromNav(activeNav)} />
  );
};

export default ValaAIManagerView;
