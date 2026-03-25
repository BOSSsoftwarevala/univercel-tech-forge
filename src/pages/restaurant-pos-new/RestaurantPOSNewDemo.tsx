import React, { useState } from 'react';
import { RestaurantPOSLayout } from '@/components/restaurant-pos/RestaurantPOSLayout';
import { RestaurantPOSScreen } from '@/components/restaurant-pos/RestaurantPOSScreen';
import { OrderManagement } from '@/components/restaurant-pos/OrderManagement';
import { KitchenDisplay } from '@/components/restaurant-pos/KitchenDisplay';
import { TableManagement } from '@/components/restaurant-pos/TableManagement';
import { MenuManagement } from '@/components/restaurant-pos/MenuManagement';
import { StaffManagement } from '@/components/restaurant-pos/StaffManagement';
import { RestaurantReports } from '@/components/restaurant-pos/RestaurantReports';

const RestaurantPOSNewDemo: React.FC = () => {
  const [activeModule, setActiveModule] = useState('pos');

  const renderContent = () => {
    switch (activeModule) {
      case 'pos':
        return <RestaurantPOSScreen />;
      case 'orders':
        return <OrderManagement />;
      case 'kitchen':
        return <KitchenDisplay />;
      case 'tables':
        return <TableManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'reports':
        return <RestaurantReports />;
      default:
        return <RestaurantPOSScreen />;
    }
  };

  return (
    <RestaurantPOSLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderContent()}
    </RestaurantPOSLayout>
  );
};

export default RestaurantPOSNewDemo;
