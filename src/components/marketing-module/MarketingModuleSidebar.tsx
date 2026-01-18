/**
 * MARKETING MODULE SIDEBAR (Step 10)
 * 10-item sidebar with Back to Boss button
 * 
 * SINGLE-CONTEXT ENFORCEMENT:
 * - Only renders when activeContext === 'module' AND category === 'marketing'
 * - Back button triggers full context switch to Boss
 */
import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  Megaphone,
  PenTool,
  FileSearch,
  Globe2,
  Wallet,
  TrendingUp,
  BarChart3,
  Settings,
  Target,
  ArrowLeft
} from "lucide-react";
import { useSidebarStore } from '@/stores/sidebarStore';

interface MarketingModuleSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onBack?: () => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "seo-manager", label: "SEO Manager", icon: Search },
  { id: "ads-manager", label: "Ads Manager", icon: Megaphone },
  { id: "content-studio", label: "Content Studio", icon: PenTool },
  { id: "keyword-planner", label: "Keyword Planner", icon: FileSearch },
  { id: "country-strategy", label: "Country Strategy", icon: Globe2 },
  { id: "lead-funnel", label: "Lead Funnel", icon: Target },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "budget-control", label: "Budget Control", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings },
];

export const MarketingModuleSidebar = ({ activeSection, setActiveSection, onBack }: MarketingModuleSidebarProps) => {
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('marketing');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };

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
      className="w-64 min-h-full flex flex-col shrink-0"
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
      
      <div className="p-4" style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: SIDEBAR_COLORS.activeHighlight }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: SIDEBAR_COLORS.text }} />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: SIDEBAR_COLORS.text }}>Marketing & SEO</h2>
            <p className="text-xs" style={{ color: SIDEBAR_COLORS.textMuted }}>AI-Powered Growth</p>
          </div>
        </div>
      </div>
      
      <nav className="p-3 space-y-1 flex-1 overflow-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isActive ? SIDEBAR_COLORS.activeHighlight : 'transparent',
                color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.textMuted,
              }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.iconColor }} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};