/**
 * VALA AI MODULE CONTAINER
 * ================================================
 * CORE AI ENGINE - TEXT-ONLY COMMAND SYSTEM
 * ================================================
 * LOCKED: DO NOT CHANGE COLORS/FONTS/THEME
 */

import React, { useState } from 'react';
import { ValaAISidebar, ValaAISection } from './ValaAISidebar';
import ValaAICommandCenter from './ValaAICommandCenter';
import { AIModelsPanel } from './AIModelsPanel';
import { AICreditsPanel } from './AICreditsPanel';
import { DevSettings } from './DevSettings';
import { DevLogs } from './DevLogs';

interface ValaAIModuleContainerProps {
  initialSection?: ValaAISection;
  onBack?: () => void;
}

export const ValaAIModuleContainer: React.FC<ValaAIModuleContainerProps> = ({
  initialSection = 'command-center',
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<ValaAISection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'command-center':
      case 'active-project':
      case 'prompt-history':
      case 'execution-logs':
      case 'error-detection':
      case 'rollback':
      case 'lock-status':
        // All core functions route to Command Center
        return <ValaAICommandCenter />;
      case 'models':
        return <AIModelsPanel />;
      case 'credits':
        return <AICreditsPanel />;
      case 'settings':
        return <DevSettings />;
      default:
        return <ValaAICommandCenter />;
    }
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: '#0B0F1A' }}>
      <ValaAISidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBack={onBack}
      />
      <div className="flex-1 overflow-hidden" style={{ color: '#FFFFFF' }}>
        {renderContent()}
      </div>
    </div>
  );
};
