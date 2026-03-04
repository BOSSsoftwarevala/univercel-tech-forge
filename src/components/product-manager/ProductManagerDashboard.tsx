/**
 * PRODUCT MANAGER DASHBOARD
 * OpenAI Builder Style - Phase 2 UI Rebuild
 * 
 * Three-panel layout:
 * LEFT:   ProductManagerSidebar  (navigation)
 * CENTER: AIBuilderConsole       (command workspace) or section content
 * RIGHT:  AIAnalysisPanel        (AI analysis, shown for builder sections)
 */
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

// New OpenAI-style panels
import ProductManagerSidebar from './ProductManagerSidebar';
import AIBuilderConsole from './AIBuilderConsole';
import AIAnalysisPanel from './AIAnalysisPanel';
import SoftwareVault from './SoftwareVault';

// Existing section components (unchanged backend-connected views)
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
import PMModuleManagement from './screens/PMModuleManagement';
import PMAccessControl from './screens/PMAccessControl';
import PMFileBuild from './screens/PMFileBuild';
import PMDeploymentControl from './screens/PMDeploymentControl';
import PMApprovalFlow from './screens/PMApprovalFlow';
import PMSecurityLicense from './screens/PMSecurityLicense';
import PMReports from './screens/PMReports';
import PMSoftwareProfile from './screens/PMSoftwareProfile';
import ValaAICommandCenter from '@/components/vala-ai-module/ValaAICommandCenter';

// Sections that use the AI Builder Console (3-panel layout)
const AI_CONSOLE_SECTIONS = ['ai-console', 'dev-studio'] as const;

// Sections that use the Software Vault
const VAULT_SECTIONS = ['software-vault'] as const;

interface ProductManagerDashboardProps {
  viewOnly?: boolean;
  /** Optional initial section override */
  initialSection?: string;
}

const ProductManagerDashboard: React.FC<ProductManagerDashboardProps> = ({
  viewOnly = false,
  initialSection = 'ai-console',
}) => {
  const [activeSection, setActiveSection] = useState(initialSection);
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
    } catch {
      setStats({ totalProducts: 12, activeDemos: 8, pendingOrders: 5, pendingDeployments: 3, criticalIssues: 2 });
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleNavigate = (section: string) => setActiveSection(section);

  const handleAddProduct = () => setActiveSection('add-product');

  const handleProductSaved = () => {
    setActiveSection('all-products');
    fetchStats();
  };

  /** Determine whether the current section uses the 3-panel AI layout */
  const isAIConsoleSection = (section: string) =>
    (AI_CONSOLE_SECTIONS as readonly string[]).includes(section);

  const isVaultSection = (section: string) =>
    (VAULT_SECTIONS as readonly string[]).includes(section);

  /** Render the main center content for non-AI-console sections */
  const renderLegacyContent = () => {
    // Software Products
    if (['all-products', 'active-products', 'development-products', 'deployed-products', 'locked-products', 'archived-products'].includes(activeSection)) {
      return <PMAllProducts onAddProduct={handleAddProduct} />;
    }
    if (activeSection === 'software-profile') return <PMSoftwareProfile />;
    if (activeSection === 'dashboard') {
      return <PMDashboard onNavigate={handleNavigate} onAddProduct={handleAddProduct} />;
    }

    // Product Structure / Categories
    const levelMap: Record<string, 'main' | 'sub' | 'micro' | 'nano'> = {
      'main-category': 'main', 'sub-category': 'sub', 'micro-category': 'micro', 'nano-category': 'nano', 'feature-binding': 'main',
    };
    if (activeSection in levelMap) return <PMCategories level={levelMap[activeSection]} />;

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
    if (['server-assignment', 'environment-select', 'deploy', 'rollback', 'stop-deployment', 'deployment-logs', 'server-manager'].includes(activeSection)) {
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

    // Legacy sections
    switch (activeSection) {
      case 'demo-management': return <PMDemoManagement />;
      case 'pricing-plans': return <PMPricingPlans />;
      case 'inventory': return <PMInventory />;
      case 'orders': return <PMOrders />;
      case 'analytics': return <PMAnalytics />;
      case 'activity': return <PMActivityLog />;
      case 'settings': return <PMSettings />;
      case 'add-product': return <PMProductForm onSave={handleProductSaved} onCancel={() => setActiveSection('all-products')} />;
      default:
        // Fallback: show the AI console for unrecognized sections
        return <AIBuilderConsole />;
    }
  };

  return (
    <div
      className="flex h-[calc(100vh-4rem)] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)' }}
    >
      {/* LEFT SIDEBAR */}
      <ProductManagerSidebar
        activeSection={activeSection}
        onSectionChange={handleNavigate}
        stats={stats}
      />

      {/* CENTER + RIGHT PANELS */}
      <div className="flex flex-1 overflow-hidden min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-1 overflow-hidden min-w-0"
          >
            {isVaultSection(activeSection) ? (
              /* VAULT: full-width */
              <SoftwareVault className="flex-1" />
            ) : isAIConsoleSection(activeSection) ? (
              /* AI BUILDER: console + analysis panel */
              <>
                <AIBuilderConsole />
                <AIAnalysisPanel />
              </>
            ) : activeSection === 'dev-studio' ? (
              /* DEV STUDIO: ValaAI (existing) */
              <div className="flex-1 overflow-auto">
                <ValaAICommandCenter />
              </div>
            ) : (
              /* ALL OTHER SECTIONS: single content area */
              <div className="flex-1 overflow-auto bg-slate-950/50">
                {renderLegacyContent()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductManagerDashboard;
