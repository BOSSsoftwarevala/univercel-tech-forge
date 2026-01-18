/**
 * VALA AI MODULE CONTAINER
 * Main container that combines sidebar + content
 */

import React, { useState } from 'react';
import { ValaAISidebar, ValaAISection } from './ValaAISidebar';
import { ValaAIOverview } from './ValaAIOverview';
import { AIRequestsPanel } from './AIRequestsPanel';
import { AITasksPanel } from './AITasksPanel';
import { AIModelsPanel } from './AIModelsPanel';
import { AIAlertsPanel } from './AIAlertsPanel';
import { AIUsagePanel } from './AIUsagePanel';
import { AICreditsPanel } from './AICreditsPanel';
import { AIAPIPanel } from './AIAPIPanel';
import { AIAutomationPanel } from './AIAutomationPanel';

interface ValaAIModuleContainerProps {
  initialSection?: ValaAISection;
  onBack?: () => void;
}

export const ValaAIModuleContainer: React.FC<ValaAIModuleContainerProps> = ({
  initialSection = 'overview',
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<ValaAISection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <ValaAIOverview />;
      case 'ai-requests':
        return <AIRequestsPanel />;
      case 'ai-tasks':
        return <AITasksPanel />;
      case 'ai-models':
        return <AIModelsPanel />;
      case 'ai-alerts':
        return <AIAlertsPanel />;
      case 'ai-usage':
        return <AIUsagePanel />;
      case 'ai-credits':
        return <AICreditsPanel />;
      case 'ai-api':
        return <AIAPIPanel />;
      case 'ai-automation':
        return <AIAutomationPanel />;
      default:
        return <ValaAIOverview />;
    }
  };

  return (
    <div className="flex h-full bg-background/50 rounded-xl border border-border/50 overflow-hidden">
      <ValaAISidebar 
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
