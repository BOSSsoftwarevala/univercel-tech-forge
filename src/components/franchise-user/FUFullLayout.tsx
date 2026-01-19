/**
 * FRANCHISE USER FULL LAYOUT
 * Simple Dashboard for Franchise Users
 * NOT for Control Panel
 */

import React, { useState } from 'react';
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
import { PaymentGatewayScreen } from '@/components/wallet/PaymentGatewayScreen';
import { AddMoneyScreen } from '@/components/wallet/AddMoneyScreen';
import { WalletHistoryScreen } from '@/components/wallet/WalletHistoryScreen';
import { WalletHeader } from '@/components/wallet/WalletHeader';
import { ScrollArea } from '@/components/ui/scroll-area';

export function FUFullLayout() {
  const [activeSection, setActiveSection] = useState<FUSection>('dashboard');
  const [walletBalance] = useState(1500);

  const handleAddMoney = () => setActiveSection('add_money');

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
      case 'payment_gateway':
        return <PaymentGatewayScreen />;
      case 'add_money':
        return <AddMoneyScreen />;
      case 'wallet_history':
        return <WalletHistoryScreen />;
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
      <FUFullSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Wallet Header - Always Visible */}
        <div className="p-4 border-b border-border">
          <WalletHeader balance={walletBalance} onAddMoney={handleAddMoney} />
        </div>
        <ScrollArea className="flex-1">
          <div className="p-6">
            {renderContent()}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

export default FUFullLayout;
