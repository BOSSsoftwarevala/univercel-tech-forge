/**
 * PRODUCT & DEMO MODULE CONTAINER (Step 11)
 */
import React, { useState } from 'react';
import { ProductDemoModuleSidebar, type ProductDemoSection } from './ProductDemoModuleSidebar';
import { ProductDashboard } from './ProductDashboard';
import { AllProducts } from './AllProducts';
import { DemoManager } from './DemoManager';
import { CreateProduct } from './CreateProduct';
import { CreateDemo } from './CreateDemo';
import { PricingPlans } from './PricingPlans';
import { LicenseDomain } from './LicenseDomain';
import { DemoIssues } from './DemoIssues';
import { ProductPerformance } from './ProductPerformance';
import { ProductArchive } from './ProductArchive';

interface ProductDemoModuleContainerProps {
  initialSection?: ProductDemoSection;
  onBack?: () => void;
}

export const ProductDemoModuleContainer: React.FC<ProductDemoModuleContainerProps> = ({ 
  initialSection = 'dashboard',
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<ProductDemoSection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <ProductDashboard />;
      case 'all-products': return <AllProducts />;
      case 'demo-manager': return <DemoManager />;
      case 'create-product': return <CreateProduct />;
      case 'create-demo': return <CreateDemo />;
      case 'pricing-plans': return <PricingPlans />;
      case 'license-domain': return <LicenseDomain />;
      case 'demo-issues': return <DemoIssues />;
      case 'performance': return <ProductPerformance />;
      case 'archive': return <ProductArchive />;
      default: return <ProductDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: '#0B0F1A' }}>
      <ProductDemoModuleSidebar activeSection={activeSection} onSectionChange={setActiveSection} onBack={onBack} />
      <div className="flex-1 p-6 overflow-auto" style={{ color: '#FFFFFF' }}>{renderContent()}</div>
    </div>
  );
};
