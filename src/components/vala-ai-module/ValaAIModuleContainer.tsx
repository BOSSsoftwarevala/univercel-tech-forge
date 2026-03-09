/**
 * VALA AI MODULE CONTAINER
 * ================================================
 * CORE AI ENGINE - TEXT-ONLY COMMAND SYSTEM
 * ================================================
 * LOCKED: DO NOT CHANGE COLORS/FONTS/THEME
 */

import React, { useState, lazy, Suspense } from 'react';
import { ValaAISidebar, ValaAISection } from './ValaAISidebar';
import ValaAICommandCenter from './ValaAICommandCenter';
import ActiveProjectPanel from './sections/ActiveProjectPanel';
import PromptHistoryPanel from './sections/PromptHistoryPanel';
import ExecutionLogsPanel from './sections/ExecutionLogsPanel';
import ErrorDetectionPanel from './sections/ErrorDetectionPanel';
import RollbackPanel from './sections/RollbackPanel';
import LockStatusPanel from './sections/LockStatusPanel';
import { AIModelsPanel } from './AIModelsPanel';
import { AICreditsPanel } from './AICreditsPanel';
import { DevSettings } from './DevSettings';

const ContinuousCreationDashboard = lazy(() => import('./ContinuousCreationDashboard'));

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
        return <ValaAICommandCenter />;
      case 'continuous-creation':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-white/50 font-mono text-sm">Loading Auto Builder...</div></div>}>
            <ContinuousCreationDashboard />
          </Suspense>
        );
      case 'active-project':
        return <ActiveProjectPanel />;
      case 'prompt-history':
        return <PromptHistoryPanel />;
      case 'execution-logs':
        return <ExecutionLogsPanel />;
      case 'error-detection':
        return <ErrorDetectionPanel />;
      case 'rollback':
        return <RollbackPanel />;
      case 'lock-status':
        return <LockStatusPanel />;
      case 'models':
        return (
          <div className="p-6 overflow-y-auto h-full">
            <AIModelsPanel />
          </div>
        );
      case 'credits':
        return (
          <div className="p-6 overflow-y-auto h-full">
            <AICreditsPanel />
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 overflow-y-auto h-full">
            <DevSettings />
          </div>
        );
      default:
        return <ValaAICommandCenter />;
    }
  };

  return (
    <div className="flex w-full overflow-hidden min-h-[100dvh] h-[100dvh]" style={{ background: '#0B0F1A' }}>
      <ValaAISidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBack={onBack}
      />
      <div className="flex-1 overflow-hidden h-full min-h-0" style={{ color: '#FFFFFF' }}>
        {renderContent()}
      </div>
    </div>
  );
};
