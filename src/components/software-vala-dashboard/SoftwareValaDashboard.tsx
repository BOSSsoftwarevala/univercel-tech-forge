/**
 * SOFTWARE VALA AI CONTROL DASHBOARD
 * Production-ready, enterprise-grade SaaS interface
 */

import React, { useState } from 'react';
import { SoftwareValaSidebar, DashboardSection } from './SoftwareValaSidebar';
import { SVDashboardHome } from './screens/SVDashboardHome';
import { SVAIModels } from './screens/SVAIModels';
import { SVPromptStudio } from './screens/SVPromptStudio';
import { SVSupportBot } from './screens/SVSupportBot';
import { SVProductDemo } from './screens/SVProductDemo';
import { SVLanguages } from './screens/SVLanguages';
import { SVCountries } from './screens/SVCountries';
import { SVAndroidAPK } from './screens/SVAndroidAPK';
import { SVAPIStructure } from './screens/SVAPIStructure';
import { SVUsageBilling } from './screens/SVUsageBilling';
import { SVLogs } from './screens/SVLogs';
import { SVSettings } from './screens/SVSettings';
import { SVCommandBar } from './SVCommandBar';

export const SoftwareValaDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <SVDashboardHome />;
      case 'ai-models':
        return <SVAIModels />;
      case 'prompt-studio':
        return <SVPromptStudio />;
      case 'support-bot':
        return <SVSupportBot />;
      case 'product-demo':
        return <SVProductDemo />;
      case 'languages':
        return <SVLanguages />;
      case 'countries':
        return <SVCountries />;
      case 'android-apk':
        return <SVAndroidAPK />;
      case 'api-sdk':
        return <SVAPIStructure />;
      case 'usage-billing':
        return <SVUsageBilling />;
      case 'logs':
        return <SVLogs />;
      case 'settings':
        return <SVSettings />;
      default:
        return <SVDashboardHome />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <SoftwareValaSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SVCommandBar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
