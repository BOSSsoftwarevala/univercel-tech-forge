/**
 * RESELLER SALES DASHBOARD LAYOUT
 * Sales-only mode - No white-label
 */
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RSFullSidebar, RSSection } from './RSFullSidebar';
import { RSDashboardScreen } from './screens/RSDashboardScreen';
import { RSProductsScreen } from './screens/RSProductsScreen';
import { RSLeadsScreen } from './screens/RSLeadsScreen';
import { RSSalesScreen } from './screens/RSSalesScreen';
import { RSCommissionScreen } from './screens/RSCommissionScreen';
import { RSMarketingScreen } from './screens/RSMarketingScreen';
import { RSSupportScreen } from './screens/RSSupportScreen';
import { RSProfileScreen } from './screens/RSProfileScreen';
import { useNavigate } from 'react-router-dom';

interface RSFullLayoutProps {
  onBack?: () => void;
}

export function RSFullLayout({ onBack }: RSFullLayoutProps) {
  const [activeSection, setActiveSection] = useState<RSSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/super-admin-system/role-switch?role=boss_owner');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <RSDashboardScreen onNavigate={setActiveSection} />;
      case 'products':
        return <RSProductsScreen />;
      case 'leads':
        return <RSLeadsScreen />;
      case 'sales':
        return <RSSalesScreen />;
      case 'commission':
        return <RSCommissionScreen />;
      case 'marketing':
        return <RSMarketingScreen />;
      case 'support':
        return <RSSupportScreen />;
      case 'profile':
        return <RSProfileScreen />;
      default:
        return <RSDashboardScreen onNavigate={setActiveSection} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-full w-full bg-slate-950">
        <RSFullSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onBack={handleBack}
        />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-900">
          {renderContent()}
        </main>
      </div>
    </TooltipProvider>
  );
}

export default RSFullLayout;
