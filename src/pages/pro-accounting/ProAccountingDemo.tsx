import React, { useState } from 'react';
import ProAccountingLayout from '@/components/pro-accounting/ProAccountingLayout';
import ProAccountingDashboard from '@/components/pro-accounting/ProAccountingDashboard';
import TaxConfiguration from '@/components/pro-accounting/TaxConfiguration';
import AdvancedInvoicing from '@/components/pro-accounting/AdvancedInvoicing';
import BankCashManagement from '@/components/pro-accounting/BankCashManagement';
import ComplianceReports from '@/components/pro-accounting/ComplianceReports';
import AuditTrail from '@/components/pro-accounting/AuditTrail';
import ProAccountingSettings from '@/components/pro-accounting/ProAccountingSettings';

const ProAccountingDemo: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ProAccountingDashboard />;
      case 'tax-config':
        return <TaxConfiguration />;
      case 'invoicing':
        return <AdvancedInvoicing />;
      case 'bank':
        return <BankCashManagement />;
      case 'compliance':
        return <ComplianceReports />;
      case 'audit':
        return <AuditTrail />;
      case 'settings':
        return <ProAccountingSettings />;
      default:
        return <ProAccountingDashboard />;
    }
  };

  return (
    <ProAccountingLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </ProAccountingLayout>
  );
};

export default ProAccountingDemo;
