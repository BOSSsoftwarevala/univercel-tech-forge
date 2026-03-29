/**
 * FRANCHISE OWNER FULL LAYOUT
 * 10 Module Enterprise Dashboard
 */

import React, { useState, useEffect } from 'react';
import { FOFullSidebar, FOSection } from './FOFullSidebar';
import { FOMasterDashboard } from './screens/FOMasterDashboard';
import { FOOrderManagement } from './screens/FOOrderManagement';
import { FOCommissionScreen } from './screens/FOCommissionScreen';
import { FOInvoiceScreen } from './screens/FOInvoiceScreen';
import { FOWalletManagement } from './screens/FOWalletManagement';
import { FOCRMHRMScreen } from './screens/FOCRMHRMScreen';
import { FOTeamPerformance } from './screens/FOTeamPerformance';
import { FODomainHosting } from './screens/FODomainHosting';
import { FOSupportEscalation } from './screens/FOSupportEscalation';
import { FOReportsAnalytics } from './screens/FOReportsAnalytics';
import { ScrollArea } from '@/components/ui/scroll-area';

export function FOFullLayout() {
  const [activeSection, setActiveSection] = useState<FOSection>('dashboard');

  // Security: Block right-click, copy, screenshot
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) ||
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
      }
    };
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <FOMasterDashboard onNavigate={setActiveSection} />;
      case 'order_management':
        return <FOOrderManagement />;
      case 'commission':
        return <FOCommissionScreen />;
      case 'invoices':
        return <FOInvoiceScreen />;
      case 'wallet':
        return <FOWalletManagement />;
      case 'crm_hrm':
        return <FOCRMHRMScreen />;
      case 'team_performance':
        return <FOTeamPerformance />;
      case 'domain_hosting':
        return <FODomainHosting />;
      case 'support':
        return <FOSupportEscalation />;
      case 'reports':
        return <FOReportsAnalytics />;
      default:
        return <FOMasterDashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background select-none">
      <FOFullSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {renderContent()}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

export default FOFullLayout;
