/**
 * TASK MANAGER - FULL LAYOUT
 * Enterprise Mode • AI-First • Zero-Miss • End-to-End Execution
 */

import React, { useState } from 'react';
import { TMFullSidebar, TMScreen } from './TMFullSidebar';
import { TMDashboard } from './screens/TMDashboard';
import { TMTaskInbox } from './screens/TMTaskInbox';
import { TMTaskCreation } from './screens/TMTaskCreation';
import { TMAITaskGenerator } from './screens/TMAITaskGenerator';
import { TMTaskAssignment } from './screens/TMTaskAssignment';
import { TMTaskExecution } from './screens/TMTaskExecution';
import { TMTaskDependency } from './screens/TMTaskDependency';
import { TMTaskApproval } from './screens/TMTaskApproval';
import { TMTaskReview } from './screens/TMTaskReview';
import { TMSLATracker } from './screens/TMSLATracker';
import { TMTaskEscalation } from './screens/TMTaskEscalation';
import { TMTaskAutomation } from './screens/TMTaskAutomation';
import { TMTaskHistory } from './screens/TMTaskHistory';
import { TMTaskAnalytics } from './screens/TMTaskAnalytics';
import { TMTaskAuditLog } from './screens/TMTaskAuditLog';
import { TMTaskSettings } from './screens/TMTaskSettings';

export const TMFullLayout: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<TMScreen>('task_dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'task_dashboard':
        return <TMDashboard onNavigate={setActiveScreen} />;
      case 'task_inbox':
        return <TMTaskInbox />;
      case 'task_creation':
        return <TMTaskCreation />;
      case 'ai_task_generator':
        return <TMAITaskGenerator />;
      case 'task_assignment':
        return <TMTaskAssignment />;
      case 'task_execution':
        return <TMTaskExecution />;
      case 'task_dependency':
        return <TMTaskDependency />;
      case 'task_approval':
        return <TMTaskApproval />;
      case 'task_review':
        return <TMTaskReview />;
      case 'task_sla_tracker':
        return <TMSLATracker />;
      case 'task_escalation':
        return <TMTaskEscalation />;
      case 'task_automation':
        return <TMTaskAutomation />;
      case 'task_history':
        return <TMTaskHistory />;
      case 'task_analytics':
        return <TMTaskAnalytics />;
      case 'task_audit_log':
        return <TMTaskAuditLog />;
      case 'task_settings':
        return <TMTaskSettings />;
      default:
        return <TMDashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <TMFullSidebar
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 overflow-auto p-6">
        {renderScreen()}
      </div>
    </div>
  );
};

export default TMFullLayout;
