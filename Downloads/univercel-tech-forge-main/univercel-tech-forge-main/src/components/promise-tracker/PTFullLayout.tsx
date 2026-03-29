import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import PTFullSidebar from './PTFullSidebar';
import PTOverview from './screens/PTOverview';
import PTAllPromises from './screens/PTAllPromises';
import PTCreatePromise from './screens/PTCreatePromise';
import PTCategories from './screens/PTCategories';
import PTActivePromises from './screens/PTActivePromises';
import PTDelayedPromises from './screens/PTDelayedPromises';
import PTBrokenPromises from './screens/PTBrokenPromises';
import PTFulfilledPromises from './screens/PTFulfilledPromises';
import PTEscalations from './screens/PTEscalations';
import PTFineTipRules from './screens/PTFineTipRules';
import PTAIInsights from './screens/PTAIInsights';
import PTAuditLogs from './screens/PTAuditLogs';
import PTSettings from './screens/PTSettings';

export default function PTFullLayout() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/super-admin-system/role-switch?role=boss_owner');
  };

  const renderContent = () => {
    // Overview
    if (activeSection === 'overview') {
      return <PTOverview />;
    }

    // All Promises
    if (activeSection === 'all-promises') {
      return <PTAllPromises />;
    }

    // Create Promise
    if (activeSection === 'create-promise') {
      return <PTCreatePromise />;
    }

    // Promise Categories
    if (activeSection.startsWith('cat-') || activeSection === 'promise-categories') {
      const category = activeSection.replace('cat-', '');
      return <PTCategories category={category} />;
    }

    // Active Promises
    if (activeSection === 'active-promises') {
      return <PTActivePromises />;
    }

    // Delayed Promises
    if (activeSection === 'delayed-promises') {
      return <PTDelayedPromises />;
    }

    // Broken Promises
    if (activeSection === 'broken-promises') {
      return <PTBrokenPromises />;
    }

    // Fulfilled Promises
    if (activeSection === 'fulfilled-promises') {
      return <PTFulfilledPromises />;
    }

    // Escalations
    if (activeSection === 'escalations') {
      return <PTEscalations />;
    }

    // Fine & Tip Rules
    if (activeSection === 'fine-tip-rules') {
      return <PTFineTipRules />;
    }

    // AI Insights
    if (activeSection === 'ai-insights') {
      return <PTAIInsights />;
    }

    // Audit Logs
    if (activeSection === 'audit-logs') {
      return <PTAuditLogs />;
    }

    // Settings
    if (activeSection === 'settings') {
      return <PTSettings />;
    }

    return <PTOverview />;
  };

  return (
    <TooltipProvider>
      <div className="flex h-full w-full bg-slate-950">
        <PTFullSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onBack={handleBack}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </TooltipProvider>
  );
}
