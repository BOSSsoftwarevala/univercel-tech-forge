import React, { useState } from 'react';
import AccountingLayout from '@/components/accounting/AccountingLayout';
import AccountingDashboard from '@/components/accounting/AccountingDashboard';
import SalesEntry from '@/components/accounting/SalesEntry';
import PurchaseEntry from '@/components/accounting/PurchaseEntry';
import ExpenseManagement from '@/components/accounting/ExpenseManagement';
import LedgerView from '@/components/accounting/LedgerView';
import AccountingReports from '@/components/accounting/AccountingReports';
import AccountingSettings from '@/components/accounting/AccountingSettings';

const AccountingDemo: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AccountingDashboard />;
      case 'sales':
        return <SalesEntry />;
      case 'purchases':
        return <PurchaseEntry />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'ledger':
        return <LedgerView />;
      case 'reports':
        return <AccountingReports />;
      case 'settings':
        return <AccountingSettings />;
      default:
        return <AccountingDashboard />;
    }
  };

  return (
    <AccountingLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </AccountingLayout>
  );
};

export default AccountingDemo;
