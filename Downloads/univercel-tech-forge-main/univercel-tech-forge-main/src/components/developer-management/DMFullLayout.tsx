/**
 * DEVELOPER MANAGEMENT - FULL LAYOUT
 * Enterprise Mode • AI-Assisted • Zero-Leak
 */

import React, { useState } from 'react';
import { DMFullSidebar, DMScreen } from './DMFullSidebar';
import { DMDeveloperDashboard } from './screens/DMDeveloperDashboard';
import { DMDeveloperRegistry } from './screens/DMDeveloperRegistry';
import { DMOnboardingRequests } from './screens/DMOnboardingRequests';
import { DMRoleSkillMapping } from './screens/DMRoleSkillMapping';
import { DMTaskManagement } from './screens/DMTaskManagement';
import { DMSprintMilestone } from './screens/DMSprintMilestone';
import { DMBuildAssignment } from './screens/DMBuildAssignment';
import { DMCodeSubmission } from './screens/DMCodeSubmission';
import { DMReviewQA } from './screens/DMReviewQA';
import { DMBugFixTracker } from './screens/DMBugFixTracker';
import { DMPerformanceKPI } from './screens/DMPerformanceKPI';
import { DMPaymentIncentive } from './screens/DMPaymentIncentive';
import { DMComplianceNDA } from './screens/DMComplianceNDA';
import { DMSecurityAccess } from './screens/DMSecurityAccess';
import { DMAlertsEscalation } from './screens/DMAlertsEscalation';
import { DMAuditLogs } from './screens/DMAuditLogs';
import { DMSettings } from './screens/DMSettings';

export const DMFullLayout: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<DMScreen>('developer_dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'developer_dashboard':
        return <DMDeveloperDashboard onNavigate={setActiveScreen} />;
      case 'developer_registry':
        return <DMDeveloperRegistry />;
      case 'onboarding_requests':
        return <DMOnboardingRequests />;
      case 'role_skill_mapping':
        return <DMRoleSkillMapping />;
      case 'task_management':
        return <DMTaskManagement />;
      case 'sprint_milestone':
        return <DMSprintMilestone />;
      case 'build_assignment':
        return <DMBuildAssignment />;
      case 'code_submission':
        return <DMCodeSubmission />;
      case 'review_qa':
        return <DMReviewQA />;
      case 'bug_fix_tracker':
        return <DMBugFixTracker />;
      case 'performance_kpi':
        return <DMPerformanceKPI />;
      case 'payment_incentive':
        return <DMPaymentIncentive />;
      case 'compliance_nda':
        return <DMComplianceNDA />;
      case 'security_access':
        return <DMSecurityAccess />;
      case 'alerts_escalation':
        return <DMAlertsEscalation />;
      case 'audit_logs':
        return <DMAuditLogs />;
      case 'settings':
        return <DMSettings />;
      default:
        return <DMDeveloperDashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <DMFullSidebar
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

export default DMFullLayout;
