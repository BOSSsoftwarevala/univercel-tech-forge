import React, { useState } from 'react';
import { RetailPOSLayout } from '@/components/retail-pos/RetailPOSLayout';
import { POSScreen } from '@/components/retail-pos/POSScreen';
import { ProductManagement } from '@/components/retail-pos/ProductManagement';
import { CustomerManagement } from '@/components/retail-pos/CustomerManagement';
import { POSReports } from '@/components/retail-pos/POSReports';
import { POSSettings } from '@/components/retail-pos/POSSettings';

const RetailPOSDemo: React.FC = () => {
  const [activeModule, setActiveModule] = useState('pos');

  const renderContent = () => {
    switch (activeModule) {
      case 'pos':
        return <POSScreen />;
      case 'products':
        return <ProductManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'reports':
        return <POSReports />;
      case 'settings':
        return <POSSettings />;
      default:
        return <POSScreen />;
    }
  };

  return (
    <RetailPOSLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderContent()}
    </RetailPOSLayout>
  );
};

export default RetailPOSDemo;
