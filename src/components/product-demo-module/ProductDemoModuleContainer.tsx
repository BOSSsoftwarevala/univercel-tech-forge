/**
 * PRODUCT & DEMO MODULE CONTAINER (Step 8)
 */
import React, { useState } from 'react';
import { ProductDemoModuleSidebar, type ProductDemoSection } from './ProductDemoModuleSidebar';
import { ProductDashboard } from './ProductDashboard';
import { AllProducts } from './AllProducts';
import { ProductDemoFactory } from './ProductDemoFactory';
import { Categories } from './Categories';
import { FeaturesLibrary } from './FeaturesLibrary';
import { PricingManagement } from './PricingManagement';
import { Versions } from './Versions';
import { Issues } from './Issues';
import { Approvals } from './Approvals';
import { ProductReports } from './ProductReports';
import { ProductDemoSettings } from './ProductDemoSettings';

interface ProductDemoModuleContainerProps {
  initialSection?: ProductDemoSection;
}

export const ProductDemoModuleContainer: React.FC<ProductDemoModuleContainerProps> = ({ 
  initialSection = 'dashboard' 
}) => {
  const [activeSection, setActiveSection] = useState<ProductDemoSection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <ProductDashboard />;
      case 'products': return <AllProducts />;
      case 'demo-factory': return <ProductDemoFactory />;
      case 'categories': return <Categories />;
      case 'features': return <FeaturesLibrary />;
      case 'pricing': return <PricingManagement />;
      case 'versions': return <Versions />;
      case 'issues': return <Issues />;
      case 'approvals': return <Approvals />;
      case 'reports': return <ProductReports />;
      case 'settings': return <ProductDemoSettings />;
      default: return <ProductDashboard />;
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)]">
      <ProductDemoModuleSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
};
