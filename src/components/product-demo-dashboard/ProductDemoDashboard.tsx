/**
 * PRODUCT DEMO MANAGER DASHBOARD
 * User-friendly, production-ready SaaS interface
 */

import React, { useState } from 'react';
import { DemoSidebar, DemoSection } from './DemoSidebar';
import { DemoCommandBar } from './DemoCommandBar';
import { PDOverview } from './screens/PDOverview';
import { PDDemoManagement } from './screens/PDDemoManagement';
import { PDSchedulingCalendar } from './screens/PDSchedulingCalendar';
import { PDDemoContent } from './screens/PDDemoContent';
import { PDLeadManagement } from './screens/PDLeadManagement';
import { PDIntegration } from './screens/PDIntegration';
import { PDAnalyticsFeedback } from './screens/PDAnalyticsFeedback';
import { PDSettings } from './screens/PDSettings';

export const ProductDemoDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DemoSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <PDOverview />;
      case 'demos':
        return <PDDemoManagement />;
      case 'calendar':
        return <PDSchedulingCalendar />;
      case 'content':
        return <PDDemoContent />;
      case 'leads':
        return <PDLeadManagement />;
      case 'integration':
        return <PDIntegration />;
      case 'analytics':
        return <PDAnalyticsFeedback />;
      case 'settings':
        return <PDSettings />;
      default:
        return <PDOverview />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <DemoSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DemoCommandBar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
