/**
 * PRODUCT & DEMO MODULE SIDEBAR
 * Full enterprise sidebar with all Product Manager & Demo Manager features
 * 
 * SINGLE-CONTEXT ENFORCEMENT:
 * - Only renders when activeContext === 'module' AND category === 'product-demo'
 * - Back button triggers full context switch to Control Panel
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, Monitor, Plus, PlusCircle,
  DollarSign, Key, Bug, BarChart3, Archive, ArrowLeft,
  Layers, Settings, GitBranch, BookOpen, MessageSquare,
  Bot, TrendingUp, Eye, EyeOff, Lock, Users, Globe,
  FileText, Zap, Shield, Target
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarStore } from '@/stores/sidebarStore';

export type ProductDemoSection = 
  | 'dashboard'
  | 'all-products'
  | 'modules'
  | 'features'
  | 'pricing-plans'
  | 'versions'
  | 'integrations'
  | 'ai-config'
  | 'bug-tracker'
  | 'roadmap'
  | 'documentation'
  | 'analytics'
  | 'support-handover'
  // Demo Manager sections
  | 'demo-manager'
  | 'demo-environments'
  | 'demo-access'
  | 'client-sessions'
  | 'feature-visibility'
  | 'restrictions'
  | 'ai-demo-assistant'
  | 'feedback'
  | 'conversion-tracker'
  | 'reports'
  | 'create-product'
  | 'create-demo'
  | 'license-domain'
  | 'demo-issues'
  | 'performance'
  | 'archive';

interface ProductDemoModuleSidebarProps {
  activeSection: ProductDemoSection;
  onSectionChange: (section: ProductDemoSection) => void;
  onBack?: () => void;
  mode?: 'product' | 'demo' | 'combined';
}

// PRODUCT MANAGER MENU ITEMS
const productMenuItems: { id: ProductDemoSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'all-products', label: 'Products', icon: Package },
  { id: 'modules', label: 'Modules', icon: Layers },
  { id: 'features', label: 'Features', icon: Zap },
  { id: 'pricing-plans', label: 'Pricing Plans', icon: DollarSign },
  { id: 'versions', label: 'Versions & Updates', icon: GitBranch },
  { id: 'integrations', label: 'Integrations', icon: Settings },
  { id: 'ai-config', label: 'AI Configuration', icon: Bot },
  { id: 'bug-tracker', label: 'Bug & Issue Tracker', icon: Bug },
  { id: 'roadmap', label: 'Roadmap', icon: Target },
  { id: 'documentation', label: 'Documentation', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'support-handover', label: 'Support Handover', icon: MessageSquare },
];

// DEMO MANAGER MENU ITEMS
const demoMenuItems: { id: ProductDemoSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'demo-manager', label: 'Live Software', icon: Monitor },
  { id: 'demo-environments', label: 'Environments', icon: Globe },
  { id: 'demo-access', label: 'Access Control', icon: Shield },
  { id: 'client-sessions', label: 'Client Sessions', icon: Users },
  { id: 'feature-visibility', label: 'Feature Visibility', icon: Eye },
  { id: 'restrictions', label: 'Restrictions', icon: Lock },
  { id: 'ai-demo-assistant', label: 'AI Assistant', icon: Bot },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'conversion-tracker', label: 'Conversion Tracker', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: FileText },
];

// COMBINED MENU ITEMS (for Boss view)
const combinedMenuItems: { id: ProductDemoSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'all-products', label: 'All Products', icon: Package },
  { id: 'demo-manager', label: 'Live Software', icon: Monitor },
  { id: 'create-product', label: 'Create Product', icon: Plus },
  { id: 'create-demo', label: 'Create Instance', icon: PlusCircle },
  { id: 'pricing-plans', label: 'Pricing & Plans', icon: DollarSign },
  { id: 'license-domain', label: 'License & Domain', icon: Key },
  { id: 'demo-issues', label: 'Issues', icon: Bug },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'archive', label: 'Archive', icon: Archive },
];

export const ProductDemoModuleSidebar: React.FC<ProductDemoModuleSidebarProps> = ({
  activeSection,
  onSectionChange,
  onBack,
  mode = 'combined',
}) => {
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('product-demo');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };

  // Select menu items based on mode
  const menuItems = mode === 'product' ? productMenuItems : 
                    mode === 'demo' ? demoMenuItems : 
                    combinedMenuItems;

  const titleText = mode === 'product' ? 'PRODUCT MANAGER' : 
                    mode === 'demo' ? 'DEMO MANAGER' : 
                    'Product & Demo';

  const subtitleText = mode === 'product' ? 'Enterprise Management' : 
                       mode === 'demo' ? 'LIVE SOFTWARE MODE' : 
                       'Enterprise Manager';

  // ===== LOCKED COLORS: Dark Navy Blue Sidebar (matches Control Panel) =====
  const SIDEBAR_COLORS = {
    bg: '#0a1628',
    bgGradient: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)',
    border: '#1e3a5f',
    activeHighlight: '#2563eb',
    hoverBg: 'rgba(37, 99, 235, 0.15)',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.7)',
    iconColor: '#60a5fa',
  };
  
  return (
    <div 
      className="w-56 flex flex-col h-full shrink-0"
      style={{ 
        background: SIDEBAR_COLORS.bgGradient, 
        borderRight: `1px solid ${SIDEBAR_COLORS.border}` 
      }}
    >
      {/* Back Button */}
      <div className="p-2" style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <motion.button
          onClick={handleBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: SIDEBAR_COLORS.textMuted }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Control Panel</span>
        </motion.button>
      </div>
      
      {/* Header */}
      <div className="p-4" style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: SIDEBAR_COLORS.activeHighlight }}
          >
            <Package className="w-4 h-4" style={{ color: SIDEBAR_COLORS.text }} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: SIDEBAR_COLORS.text }}>{titleText}</h2>
            <p className="text-[10px]" style={{ color: SIDEBAR_COLORS.textMuted }}>{subtitleText}</p>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px]"
               style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            RUNNING
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px]"
               style={{ background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa' }}>
            <Bot className="w-3 h-3" />
            AI ACTIVE
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 py-2">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: isActive ? SIDEBAR_COLORS.activeHighlight : 'transparent',
                  color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.textMuted,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.iconColor }} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Status */}
      <div className="p-3" style={{ borderTop: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: SIDEBAR_COLORS.textMuted }}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Healthy</span>
        </div>
      </div>
    </div>
  );
};
