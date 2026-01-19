/**
 * FRANCHISE OWNER FULL LAYOUT
 * Combines Sidebar + Content Area
 */

import React, { useState } from 'react';
import { FOFullSidebar, FOSection } from './FOFullSidebar';
import { FOOverviewScreen } from './screens/FOOverviewScreen';
import { FOHRMScreen } from './screens/FOHRMScreen';
import { FOCRMScreen } from './screens/FOCRMScreen';
import { FOLeadScreen } from './screens/FOLeadScreen';
import { FOSEOScreen } from './screens/FOSEOScreen';
import { FOAdsScreen } from './screens/FOAdsScreen';
import { FOWalletScreen } from './screens/FOWalletScreen';
import { FOSalesScreen } from './screens/FOSalesScreen';
import { FOInfluencerScreen } from './screens/FOInfluencerScreen';
import { FOSupportScreen } from './screens/FOSupportScreen';
import { FOReportsScreen } from './screens/FOReportsScreen';
import { FOSettingsScreen } from './screens/FOSettingsScreen';
import { ScrollArea } from '@/components/ui/scroll-area';

export function FOFullLayout() {
  const [activeSection, setActiveSection] = useState<FOSection>('franchise_overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'franchise_overview':
        return <FOOverviewScreen />;
      case 'hrm_management':
        return <FOHRMScreen />;
      case 'crm_management':
        return <FOCRMScreen />;
      case 'lead_management':
        return <FOLeadScreen />;
      case 'seo_marketing':
        return <FOSEOScreen />;
      case 'ads_manager':
        return <FOAdsScreen />;
      case 'wallet_billing':
        return <FOWalletScreen />;
      case 'sales_performance':
        return <FOSalesScreen />;
      case 'influencer_leads':
        return <FOInfluencerScreen />;
      case 'customer_support':
        return <FOSupportScreen />;
      case 'reports_analytics':
        return <FOReportsScreen />;
      case 'franchise_settings':
        return <FOSettingsScreen />;
      default:
        return <FOOverviewScreen />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
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
