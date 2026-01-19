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
import { PaymentGatewayScreen } from '@/components/wallet/PaymentGatewayScreen';
import { AddMoneyScreen } from '@/components/wallet/AddMoneyScreen';
import { WalletHistoryScreen } from '@/components/wallet/WalletHistoryScreen';
import { WalletHeader } from '@/components/wallet/WalletHeader';
import { useNavigate } from 'react-router-dom';

interface RSFullLayoutProps {
  onBack?: () => void;
}

export function RSFullLayout({ onBack }: RSFullLayoutProps) {
  const [activeSection, setActiveSection] = useState<RSSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [walletBalance] = useState(850);
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/super-admin-system/role-switch?role=boss_owner');
    }
  };

  const handleAddMoney = () => setActiveSection('add_money');

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
      case 'wallet':
        return <WalletHistoryScreen />;
      case 'payment_gateway':
        return <PaymentGatewayScreen />;
      case 'add_money':
        return <AddMoneyScreen />;
      case 'wallet_history':
        return <WalletHistoryScreen />;
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
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-900 flex flex-col">
          {/* Wallet Header - Always Visible */}
          <div className="p-4 border-b border-emerald-500/20">
            <WalletHeader balance={walletBalance} onAddMoney={handleAddMoney} />
          </div>
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

export default RSFullLayout;
