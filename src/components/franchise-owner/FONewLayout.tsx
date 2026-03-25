/**
 * FRANCHISE OWNER NEW LAYOUT
 * Complete layout with fixed header and sidebar
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FONewSidebar } from './FONewSidebar';
import { FOFixedHeader } from './FOFixedHeader';
import { FOHomeDashboard } from './screens/FOHomeDashboard';
import { FOMarketplaceScreen } from './screens/FOMarketplaceScreen';
import { FOMyOrdersScreen } from './screens/FOMyOrdersScreen';
import { FOLeadsSEOScreen } from './screens/FOLeadsSEOScreen';
import { FOEmployeesScreen } from './screens/FOEmployeesScreen';
import { FOInvoicesScreen } from './screens/FOInvoicesScreen';
import { FOSupportAssistScreen } from './screens/FOSupportAssistScreen';
import { FOLegalScreen } from './screens/FOLegalScreen';
import { FOWalletScreen } from './screens/FOWalletScreen';
import { FOPlaceOrderForm } from '../franchise-user/screens/FOPlaceOrderForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FOSection } from './FranchiseOwnerTypes';

export function FONewLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionFromUrl = searchParams.get('section') as FOSection | null;
  const [activeSection, setActiveSection] = useState<FOSection>(sectionFromUrl || 'dashboard');
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    if (sectionFromUrl && sectionFromUrl !== activeSection) {
      setActiveSection(sectionFromUrl);
    }
  }, [activeSection, sectionFromUrl]);

  const handleNavigate = useCallback((section: FOSection) => {
    setActiveSection(section);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('section', section);
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handlePlaceOrder = useCallback(() => {
    setShowOrderForm(true);
  }, []);

  const handleCloseOrder = useCallback(() => {
    setShowOrderForm(false);
  }, []);

  // Full-screen order form
  if (showOrderForm) {
    return <FOPlaceOrderForm onClose={handleCloseOrder} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <FOHomeDashboard onNavigate={handleNavigate} />;
      case 'marketplace': return <FOMarketplaceScreen />;
      case 'my_orders': return <FOMyOrdersScreen />;
      case 'leads_seo': return <FOLeadsSEOScreen />;
      case 'employees': return <FOEmployeesScreen />;
      case 'invoices': return <FOInvoicesScreen />;
      case 'wallet': return <FOWalletScreen />;
      case 'support_assist': return <FOSupportAssistScreen />;
      case 'legal': return <FOLegalScreen />;
      case 'settings': return <FOHomeDashboard onNavigate={handleNavigate} />;
      default: return <FOHomeDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <FONewSidebar activeSection={activeSection} onSectionChange={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FOFixedHeader 
          onNavigate={handleNavigate}
          onPlaceOrder={handlePlaceOrder}
          activeSection={activeSection}
        />
        <ScrollArea className="flex-1">
          <div className="p-6">{renderContent()}</div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default FONewLayout;
