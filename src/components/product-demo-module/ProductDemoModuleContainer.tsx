/**
 * PRODUCT & DEMO MODULE CONTAINER
 */
import React, { useState } from 'react';
import { ProductDemoModuleSidebar, type ProductDemoSection } from './ProductDemoModuleSidebar';
import { ProductDemoOverview } from './ProductDemoOverview';
import { AllProducts } from './AllProducts';
import { Categories } from './Categories';
import { DemoManagement } from './DemoManagement';
import { ProductDemoFactory } from './ProductDemoFactory';
import { PricingManagement } from './PricingManagement';
import { Technologies } from './Technologies';
import { OrdersLink } from './OrdersLink';
import { ProductDemoSettings } from './ProductDemoSettings';

interface ProductDemoModuleContainerProps {
  initialSection?: ProductDemoSection;
}

export const ProductDemoModuleContainer: React.FC<ProductDemoModuleContainerProps> = ({ 
  initialSection = 'overview' 
}) => {
  const [activeSection, setActiveSection] = useState<ProductDemoSection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <ProductDemoOverview />;
      case 'all-products': return <AllProducts />;
      case 'categories': return <Categories />;
      case 'demos': return <DemoManagement />;
      case 'demo-factory': return <ProductDemoFactory />;
      case 'pricing': return <PricingManagement />;
      case 'technologies': return <Technologies />;
      case 'orders': return <OrdersLink />;
      case 'settings': return <ProductDemoSettings />;
      default: return <ProductDemoOverview />;
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)]">
      <ProductDemoModuleSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
};
