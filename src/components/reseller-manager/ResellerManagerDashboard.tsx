import { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ResellerManagerSidebar, ResellerManagerSection } from './ResellerManagerSidebar';
import { ResellerDashboardOverview } from './ResellerDashboardOverview';
import { AllResellersView } from './AllResellersView';
import { CommissionsPayoutsView } from './CommissionsPayoutsView';
import { IssuesEscalationsView } from './IssuesEscalationsView';
import { AIInsightsView } from './AIInsightsView';
import RMComplianceStatus from './RMComplianceStatus';
import RMAIFraudFlags from './RMAIFraudFlags';

export function ResellerManagerDashboard() {
  const [activeSection, setActiveSection] = useState<ResellerManagerSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ResellerDashboardOverview onNavigate={setActiveSection} />;
      case 'all-resellers':
        return <AllResellersView />;
      case 'commissions':
        return <CommissionsPayoutsView />;
      case 'issues':
        return <IssuesEscalationsView />;
      case 'compliance':
        return <RMComplianceStatus />;
      case 'ai-insights':
        return <AIInsightsView />;
      case 'reseller-map':
        return <div className="text-white p-6"><h2 className="text-xl font-bold mb-4">Reseller Map</h2><p className="text-slate-400">Interactive map view coming soon</p></div>;
      case 'performance':
        return <div className="text-white p-6"><h2 className="text-xl font-bold mb-4">Performance & Revenue</h2><p className="text-slate-400">Performance analytics view</p></div>;
      case 'partner-activity':
        return <RMAIFraudFlags />;
      case 'settings':
        return <div className="text-white p-6"><h2 className="text-xl font-bold mb-4">Settings</h2><p className="text-slate-400">Reseller manager settings</p></div>;
      default:
        return <ResellerDashboardOverview onNavigate={setActiveSection} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-950">
        <ResellerManagerSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </TooltipProvider>
  );
}

export default ResellerManagerDashboard;
