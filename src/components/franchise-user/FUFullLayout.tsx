/**
 * FRANCHISE USER FULL LAYOUT
 * Simple Dashboard for Franchise Users
 * NOT for Control Panel
 */

import React, { useCallback, useState } from 'react';
import { FUFullSidebar, FUSection } from './FUFullSidebar';
import { FUDashboardScreen } from './screens/FUDashboardScreen';
import { FULeadsScreen } from './screens/FULeadsScreen';
import { FUSalesScreen } from './screens/FUSalesScreen';
import { FUCustomersScreen } from './screens/FUCustomersScreen';
import { FUMarketingScreen } from './screens/FUMarketingScreen';
import { FUAdsScreen } from './screens/FUAdsScreen';
import { FUWalletScreen } from './screens/FUWalletScreen';
import { FUSupportScreen } from './screens/FUSupportScreen';
import { FUProfileScreen } from './screens/FUProfileScreen';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GlobalBackButton } from '@/components/shared/GlobalBackButton';
import { toast } from 'sonner';

export function FUFullLayout() {
  const [activeSection, setActiveSection] = useState<FUSection>('dashboard');

  const handleBackToModuleHome = useCallback(() => {
    if (activeSection === 'dashboard') {
      toast.info('You are already on your dashboard');
      return;
    }
    setActiveSection('dashboard');
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <FUDashboardScreen />;
      case 'my_leads':
        return <FULeadsScreen />;
      case 'my_sales':
        return <FUSalesScreen />;
      case 'my_customers':
        return <FUCustomersScreen />;
      case 'marketing_seo':
        return <FUMarketingScreen />;
      case 'ads_ai':
        return <FUAdsScreen />;
      case 'wallet':
        return <FUWalletScreen />;
      case 'support':
        return <FUSupportScreen />;
      case 'profile_settings':
        return <FUProfileScreen />;
      default:
        return <FUDashboardScreen />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <FUFullSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-hidden">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-background">
          <GlobalBackButton
            onBack={handleBackToModuleHome}
            activeScreen={activeSection}
            homeScreen="dashboard"
            showHome={false}
          />
          <div className="text-sm text-muted-foreground">
            Franchise Dashboard
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="p-6">{renderContent()}</div>
        </ScrollArea>
      </main>
    </div>
  );
}

export default FUFullLayout;
