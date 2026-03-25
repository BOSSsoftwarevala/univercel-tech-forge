/**
 * PRO MANAGER - FULL LAYOUT
 * Enterprise Mode • Premium • Support-Focused • AI-Assisted
 */

import React, { useState } from 'react';
import { PROFullSidebar, PROScreen } from './PROFullSidebar';
import { PRODashboard } from './screens/PRODashboard';
import { PROUserRegistry } from './screens/PROUserRegistry';
import { PROProductOwnership } from './screens/PROProductOwnership';
import { PROLicenseDomain } from './screens/PROLicenseDomain';
import { PROSupportRequests } from './screens/PROSupportRequests';
import { PROIssueBugTracker } from './screens/PROIssueBugTracker';
import { PROPremiumAssist } from './screens/PROPremiumAssist';
import { PROPromiseSLATracker } from './screens/PROPromiseSLATracker';
import { PROUpgradeAddons } from './screens/PROUpgradeAddons';
import { PRORenewalExpiry } from './screens/PRORenewalExpiry';
import { PROUsageLimits } from './screens/PROUsageLimits';
import { PROAIHelpdesk } from './screens/PROAIHelpdesk';
import { PROCommunicationLog } from './screens/PROCommunicationLog';
import { PROAlertsEscalation } from './screens/PROAlertsEscalation';
import { PROSatisfactionRating } from './screens/PROSatisfactionRating';
import { PROCompliancePolicy } from './screens/PROCompliancePolicy';
import { PROAuditLogs } from './screens/PROAuditLogs';
import { PROSettings } from './screens/PROSettings';

export const PROFullLayout: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<PROScreen>('pro_dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'pro_dashboard':
        return <PRODashboard onNavigate={setActiveScreen} />;
      case 'pro_user_registry':
        return <PROUserRegistry />;
      case 'product_ownership':
        return <PROProductOwnership />;
      case 'license_domain':
        return <PROLicenseDomain />;
      case 'support_requests':
        return <PROSupportRequests />;
      case 'issue_bug_tracker':
        return <PROIssueBugTracker />;
      case 'premium_assist':
        return <PROPremiumAssist />;
      case 'promise_sla_tracker':
        return <PROPromiseSLATracker />;
      case 'upgrade_addons':
        return <PROUpgradeAddons />;
      case 'renewal_expiry':
        return <PRORenewalExpiry />;
      case 'usage_limits':
        return <PROUsageLimits />;
      case 'ai_helpdesk':
        return <PROAIHelpdesk />;
      case 'communication_log':
        return <PROCommunicationLog />;
      case 'alerts_escalation':
        return <PROAlertsEscalation />;
      case 'satisfaction_rating':
        return <PROSatisfactionRating />;
      case 'compliance_policy':
        return <PROCompliancePolicy />;
      case 'audit_logs':
        return <PROAuditLogs />;
      case 'settings':
        return <PROSettings />;
      default:
        return <PRODashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <PROFullSidebar
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

export default PROFullLayout;
