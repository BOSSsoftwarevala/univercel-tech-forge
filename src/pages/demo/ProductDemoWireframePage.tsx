/**
 * Product Demo Wireframe Page
 */
import React from 'react';
import { ProductDemoWireframe } from '@/components/product-demo-wireframe';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

const ProductDemoWireframePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <ProductDemoWireframe onBack={() => navigate(-1)} />
    </TooltipProvider>
  );
};

export default ProductDemoWireframePage;
