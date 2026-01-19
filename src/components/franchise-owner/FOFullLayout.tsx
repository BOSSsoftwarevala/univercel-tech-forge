/**
 * FRANCHISE OWNER FULL LAYOUT
 * Header + Sidebar + Content Area
 */

import React, { useState } from 'react';
import { FOFullSidebar, FOSection } from './FOFullSidebar';
import { FOHeader } from './FOHeader';
import { FOHomeScreen } from './screens/FOHomeScreen';
import { FOMarketplaceScreen } from './screens/FOMarketplaceScreen';
import { FOPlaceOrderScreen } from './screens/FOPlaceOrderScreen';
import { FOOrdersScreen } from './screens/FOOrdersScreen';
import { FOInvoicesWalletScreen } from './screens/FOInvoicesWalletScreen';
import { FOLeadsCustomersScreen } from './screens/FOLeadsCustomersScreen';
import { FOSEOMarketingScreen } from './screens/FOSEOMarketingScreen';
import { FOSupportIssuesScreen } from './screens/FOSupportIssuesScreen';
import { FOPromisesSLAScreen } from './screens/FOPromisesSLAScreen';
import { FOPerformanceReportsScreen } from './screens/FOPerformanceReportsScreen';
import { FOAgreementLegalScreen } from './screens/FOAgreementLegalScreen';
import { FOFranchiseSettingsScreen } from './screens/FOFranchiseSettingsScreen';
import { ScrollArea } from '@/components/ui/scroll-area';

export function FOFullLayout() {
  const [activeSection, setActiveSection] = useState<FOSection>('franchise_home');

  const renderContent = () => {
    switch (activeSection) {
      case 'franchise_home':
        return <FOHomeScreen />;
      case 'marketplace':
        return <FOMarketplaceScreen />;
      case 'place_order':
        return <FOPlaceOrderScreen />;
      case 'orders_delivery':
        return <FOOrdersScreen />;
      case 'invoices_wallet':
        return <FOInvoicesWalletScreen />;
      case 'leads_customers':
        return <FOLeadsCustomersScreen />;
      case 'seo_marketing':
        return <FOSEOMarketingScreen />;
      case 'support_issues':
        return <FOSupportIssuesScreen />;
      case 'promises_sla':
        return <FOPromisesSLAScreen />;
      case 'performance_reports':
        return <FOPerformanceReportsScreen />;
      case 'agreement_legal':
        return <FOAgreementLegalScreen />;
      case 'settings':
        return <FOFranchiseSettingsScreen />;
      default:
        return <FOHomeScreen />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <FOFullSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        <FOHeader
          walletBalance={45200}
          orderAlerts={3}
          promiseStatus="healthy"
          unreadMessages={2}
          notifications={5}
          franchiseCode="FO-2024-001"
          territory="North Region"
          onAddMoney={() => setActiveSection('invoices_wallet')}
        />
        <ScrollArea className="flex-1">
          <div className="p-6">
            {renderContent()}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

export default FOFullLayout;
