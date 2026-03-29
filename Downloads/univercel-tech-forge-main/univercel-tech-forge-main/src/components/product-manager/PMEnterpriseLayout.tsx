import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import PMSidebar from './PMSidebar';
import PMDashboard from './PMDashboard';
import PMDemoManagement from './PMDemoManagement';
import PMPricingPlans from './PMPricingPlans';
import PMInventory from './PMInventory';
import PMOrders from './PMOrders';
import PMAnalytics from './PMAnalytics';
import PMCategories from './PMCategories';
import PMProductForm from './PMProductForm';
import PMActivityLog from './PMActivityLog';
import PMSettings from './PMSettings';
import PMModuleManagement from './screens/PMModuleManagement';
import PMAccessControl from './screens/PMAccessControl';
import PMFileBuild from './screens/PMFileBuild';
import PMDeploymentControl from './screens/PMDeploymentControl';
import PMApprovalFlow from './screens/PMApprovalFlow';
import PMSecurityLicense from './screens/PMSecurityLicense';
import PMReports from './screens/PMReports';
import PMSoftwareProfile from './screens/PMSoftwareProfile';
import PMGitHubIntegration from './screens/PMGitHubIntegration';
import PMDevStudio from './screens/PMDevStudio';
import PMFactoryProducts from './screens/PMFactoryProducts';

type PMSection = 
  | 'dashboard' 
  | 'all-products' 
  | 'active-products'
  | 'development-products'
  | 'deployed-products'
  | 'locked-products'
  | 'archived-products'
  | 'software-profile'
  | 'github-integration'
  | 'main-category' 
  | 'sub-category' 
  | 'micro-category' 
  | 'nano-category'
  | 'feature-binding'
  | 'core-modules'
  | 'optional-modules'
  | 'role-modules'
  | 'locked-modules'
  | 'disabled-modules'
  | 'view-permission'
  | 'copy-permission'
  | 'download-permission'
  | 'edit-permission'
  | 'role-visibility'
  | 'country-control'
  | 'upload-build'
  | 'apk-builds'
  | 'web-builds'
  | 'assets'
  | 'file-lock'
  | 'view-only-mode'
  | 'version-history'
  | 'server-assignment'
  | 'environment-select'
  | 'deploy'
  | 'rollback'
  | 'stop-deployment'
  | 'deployment-logs'
  | 'deployment-approval'
  | 'version-approval'
  | 'module-approval'
  | 'emergency-override'
  | 'license-lock'
  | 'domain-lock'
  | 'api-key-binding'
  | 'expiry-control'
  | 'abuse-protection'
  | 'product-changes'
  | 'file-upload-logs'
  | 'lock-unlock-history'
  | 'deployment-history'
  | 'approval-history'
  | 'software-usage'
  | 'deployment-success'
  | 'failure-reports'
  | 'export-reports'
  | 'notifications'
  | 'security-settings'
  | 'profile'
  | 'logout'
  | 'demo-management' 
  | 'pricing-plans' 
  | 'inventory' 
  | 'orders' 
  | 'analytics' 
  | 'activity'
  | 'settings'
  | 'add-product'
  | 'dev-studio';

interface PMEnterpriseLayoutProps {
  viewOnly?: boolean;
}

const PMEnterpriseLayout: React.FC<PMEnterpriseLayoutProps> = ({ viewOnly = false }) => {
  const [activeSection, setActiveSection] = useState<PMSection>('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeDemos: 0,
    pendingOrders: 0,
    pendingDeployments: 0,
    criticalIssues: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const [productsRes, demosRes] = await Promise.all([
        supabase.from('products').select('product_id', { count: 'exact', head: true }),
        supabase.from('demos').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      ]);

      setStats({
        totalProducts: productsRes.count || 12,
        activeDemos: demosRes.count || 8,
        pendingOrders: 5,
        pendingDeployments: 3,
        criticalIssues: 2,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set mock data on error
      setStats({
        totalProducts: 12,
        activeDemos: 8,
        pendingOrders: 5,
        pendingDeployments: 3,
        criticalIssues: 2,
      });
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
    // Dashboard
    if (activeSection === 'dashboard') {
      return <PMDashboard onNavigate={handleNavigate} onAddProduct={handleAddProduct} />;
    }
    
    // Software Products
    if (['all-products', 'active-products', 'development-products', 'deployed-products', 'locked-products', 'archived-products'].includes(activeSection)) {
      const statusMap: Record<string, 'active' | 'in_development' | 'deployed' | 'locked' | 'archived' | undefined> = {
        'all-products': undefined,
        'active-products': 'active',
        'development-products': 'in_development',
        'deployed-products': 'deployed',
        'locked-products': 'locked',
        'archived-products': 'archived',
      };
      return <PMFactoryProducts statusFilter={statusMap[activeSection]} />;
    }
    if (activeSection === 'software-profile') {
      return <PMSoftwareProfile />;
    }

    if (activeSection === 'github-integration') {
      return <PMGitHubIntegration />;
    }
    
    // Product Structure / Categories
    if (['main-category', 'sub-category', 'micro-category', 'nano-category', 'feature-binding'].includes(activeSection)) {
      const levelMap: Record<string, 'main' | 'sub' | 'micro' | 'nano'> = {
        'main-category': 'main',
        'sub-category': 'sub',
        'micro-category': 'micro',
        'nano-category': 'nano',
        'feature-binding': 'main',
      };
      return <PMCategories level={levelMap[activeSection] || 'main'} />;
    }
    
    // Module Management
    if (['core-modules', 'optional-modules', 'role-modules', 'locked-modules', 'disabled-modules'].includes(activeSection)) {
      return <PMModuleManagement moduleType={activeSection} />;
    }
    
    // Access & Control
    if (['view-permission', 'copy-permission', 'download-permission', 'edit-permission', 'role-visibility', 'country-control'].includes(activeSection)) {
      return <PMAccessControl permissionType={activeSection} />;
    }
    
    // File & Build Management
    if (['upload-build', 'apk-builds', 'web-builds', 'assets', 'file-lock', 'view-only-mode', 'version-history'].includes(activeSection)) {
      return <PMFileBuild buildType={activeSection} />;
    }
    
    // Deployment Control
    if (['server-assignment', 'environment-select', 'deploy', 'rollback', 'stop-deployment', 'deployment-logs'].includes(activeSection)) {
      return <PMDeploymentControl deploymentType={activeSection} />;
    }
    
    // Approval Flow
    if (['deployment-approval', 'version-approval', 'module-approval', 'emergency-override'].includes(activeSection)) {
      return <PMApprovalFlow approvalType={activeSection} />;
    }
    
    // Security & License
    if (['license-lock', 'domain-lock', 'api-key-binding', 'expiry-control', 'abuse-protection'].includes(activeSection)) {
      return <PMSecurityLicense securityType={activeSection} />;
    }
    
    // Activity & Audit Logs
    if (['product-changes', 'file-upload-logs', 'lock-unlock-history', 'deployment-history', 'approval-history'].includes(activeSection)) {
      return <PMActivityLog />;
    }
    
    // Reports
    if (['software-usage', 'deployment-success', 'failure-reports', 'export-reports'].includes(activeSection)) {
      return <PMReports reportType={activeSection} />;
    }
    
    // Settings
    if (['notifications', 'security-settings', 'profile', 'logout'].includes(activeSection)) {
      return <PMSettings />;
    }

    // Dev Studio
    if (activeSection === 'dev-studio') {
      return <PMDevStudio />;
    }

    // Legacy sections
    switch (activeSection) {
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
