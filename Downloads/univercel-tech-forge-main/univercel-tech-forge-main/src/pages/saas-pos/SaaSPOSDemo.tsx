import React, { useState } from 'react';
import { SaaSPOSLayout } from '@/components/saas-pos/SaaSPOSLayout';
import { SaaSPOSDashboard } from '@/components/saas-pos/SaaSPOSDashboard';
import { OutletManagement } from '@/components/saas-pos/OutletManagement';
import { CentralCatalog } from '@/components/saas-pos/CentralCatalog';
import { SalesPayments } from '@/components/saas-pos/SalesPayments';
import { InventorySync } from '@/components/saas-pos/InventorySync';
import { ReportsAnalytics } from '@/components/saas-pos/ReportsAnalytics';
import { SecurityAudit } from '@/components/saas-pos/SecurityAudit';
import { SaaSPOSSettings } from '@/components/saas-pos/SaaSPOSSettings';

const SaaSPOSDemo: React.FC = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <SaaSPOSDashboard />;
      case 'outlets':
        return <OutletManagement />;
      case 'catalog':
        return <CentralCatalog />;
      case 'sales':
        return <SalesPayments />;
      case 'inventory':
        return <InventorySync />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'security':
        return <SecurityAudit />;
      case 'settings':
        return <SaaSPOSSettings />;
      default:
        return <SaaSPOSDashboard />;
    }
  };

  return (
    <SaaSPOSLayout 
      activeModule={activeModule} 
      onModuleChange={setActiveModule}
    >
      {renderModule()}
    </SaaSPOSLayout>
  );
};

export default SaaSPOSDemo;
