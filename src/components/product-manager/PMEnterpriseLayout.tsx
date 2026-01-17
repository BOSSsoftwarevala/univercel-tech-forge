import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import PMSidebar from './PMSidebar';
import PMDashboard from './PMDashboard';
import PMAllProducts from './PMAllProducts';
import PMDemoManagement from './PMDemoManagement';
import PMPricingPlans from './PMPricingPlans';
import PMInventory from './PMInventory';
import PMOrders from './PMOrders';
import PMAnalytics from './PMAnalytics';
import PMCategories from './PMCategories';
import PMProductForm from './PMProductForm';
import PMActivityLog from './PMActivityLog';
import PMSettings from './PMSettings';

type PMSection = 
  | 'dashboard' 
  | 'all-products' 
  | 'main-category' 
  | 'sub-category' 
  | 'micro-category' 
  | 'nano-category'
  | 'demo-management' 
  | 'pricing-plans' 
  | 'inventory' 
  | 'orders' 
  | 'analytics' 
  | 'activity'
  | 'settings'
  | 'add-product';

interface PMEnterpriseLayoutProps {
  viewOnly?: boolean;
}

const PMEnterpriseLayout: React.FC<PMEnterpriseLayoutProps> = ({ viewOnly = false }) => {
  const [activeSection, setActiveSection] = useState<PMSection>('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeDemos: 0,
    pendingOrders: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const [productsRes, demosRes] = await Promise.all([
        supabase.from('products').select('product_id', { count: 'exact', head: true }),
        supabase.from('demos').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      ]);

      setStats({
        totalProducts: productsRes.count || 0,
        activeDemos: demosRes.count || 0,
        pendingOrders: 0, // Mock for now
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleNavigate = (section: string) => {
    setActiveSection(section as PMSection);
  };

  const handleAddProduct = () => {
    setActiveSection('add-product');
  };

  const handleProductSaved = () => {
    setActiveSection('all-products');
    fetchStats();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <PMDashboard onNavigate={handleNavigate} onAddProduct={handleAddProduct} />;
      case 'all-products':
        return <PMAllProducts onAddProduct={handleAddProduct} />;
      case 'main-category':
        return <PMCategories level="main" />;
      case 'sub-category':
        return <PMCategories level="sub" />;
      case 'micro-category':
        return <PMCategories level="micro" />;
      case 'nano-category':
        return <PMCategories level="nano" />;
      case 'demo-management':
        return <PMDemoManagement />;
      case 'pricing-plans':
        return <PMPricingPlans />;
      case 'inventory':
        return <PMInventory />;
      case 'orders':
        return <PMOrders />;
      case 'analytics':
        return <PMAnalytics />;
      case 'activity':
        return <PMActivityLog />;
      case 'settings':
        return <PMSettings />;
      case 'add-product':
        return <PMProductForm onSave={handleProductSaved} onCancel={() => setActiveSection('all-products')} />;
      default:
        return <PMDashboard onNavigate={handleNavigate} onAddProduct={handleAddProduct} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <PMSidebar 
        activeSection={activeSection} 
        onSectionChange={handleNavigate}
        stats={stats}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PMEnterpriseLayout;
