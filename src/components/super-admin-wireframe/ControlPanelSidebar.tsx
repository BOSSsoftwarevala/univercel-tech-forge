/**
 * CONTROL PANEL SIDEBAR - FINAL STRUCTURE
 * ========================================
 * FULL HEIGHT (100vh) • ONE SIDEBAR ONLY • PREMIUM CARD-STYLE BUTTONS
 * LOCKED STRUCTURE - BOSS APPROVAL REQUIRED FOR CHANGES
 * 
 * MASTER MODULE ORDER (LOCKED - 8 GRADES):
 * 
 * GRADE 1: Boss Dashboard, CEO Dashboard, Vala AI, Server Manager, AI API Manager
 * GRADE 2: Development Manager, Product Manager, Demo Manager, Task Manager, Promise Tracker, Assist Manager
 * GRADE 3: Marketing Manager, SEO Manager, Lead Manager, Sales & Support, Customer Support
 * GRADE 4: Franchise Owner, Reseller Manager, Influencer Manager, Influencer Dashboard
 * GRADE 5: Continent Admin, Country Admin
 * GRADE 6: Finance Manager, Legal Manager, Developer Dashboard, Pro Manager
 * GRADE 7: Pro User Dashboard, Basic User Dashboard
 * GRADE 8: Home, Security, Settings
 */

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Crown, Eye, Brain, Server, Globe2, Flag, Building2, 
  Headphones, Handshake, Target, Box, Terminal, 
  Star, Scale, ListTodo, DollarSign, Code2, 
  Megaphone, HeartHandshake, Users, LogOut, Zap, Timer, MonitorPlay, 
  Home, Shield, Settings, Search, User, UserCircle
} from "lucide-react";
// ScrollArea removed - NO SCROLLING in Control Panel

// ===== LOCKED COLORS (SOFTWARE VALA BLUE GRADIENT - DO NOT CHANGE) =====
const COLORS = {
  bg: '#0a1628',
  bgGradient: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)',
  border: '#1e3a5f',
  activeHighlight: '#2563eb',
  hoverBg: 'rgba(37, 99, 235, 0.2)',
  cardBg: 'rgba(30, 58, 95, 0.3)',
  cardGlow: 'rgba(37, 99, 235, 0.15)',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  iconColor: '#60a5fa',
};

// ===== ROLE CATEGORIES (EXACT ORDER - LOCKED BY GRADE) =====
// IDs MUST match ActiveRole type in RoleSwitchSidebarNew.tsx
const ROLE_CATEGORIES = [
  // GRADE 1
  { id: 'boss_owner', label: 'Boss Dashboard', icon: Crown },
  { id: 'ceo', label: 'CEO Dashboard', icon: Eye },
  { id: 'vala_ai_management', label: 'Vala AI', icon: Brain },
  { id: 'server_manager', label: 'Server Manager', icon: Server },
  { id: 'api_ai_manager', label: 'AI API Manager', icon: Zap },
  // GRADE 2
  { id: 'developer_management', label: 'Development Manager', icon: Code2 },
  { id: 'product_manager', label: 'Product Manager', icon: Box },
  { id: 'demo_manager', label: 'Demo Manager', icon: Terminal },
  { id: 'task_management', label: 'Task Manager', icon: ListTodo },
  { id: 'promise_tracker_manager', label: 'Promise Tracker', icon: Timer },
  { id: 'assist_manager', label: 'Assist Manager', icon: MonitorPlay },
  // GRADE 3
  { id: 'marketing_management', label: 'Marketing Manager', icon: Megaphone },
  { id: 'seo_manager', label: 'SEO Manager', icon: Search },
  { id: 'lead_manager', label: 'Lead Manager', icon: Target },
  { id: 'sales_support_manager', label: 'Sales & Support', icon: Headphones },
  { id: 'customer_support_management', label: 'Customer Support', icon: HeartHandshake },
  // GRADE 4
  { id: 'franchise_manager', label: 'Franchise Owner', icon: Building2 },
  { id: 'reseller_manager', label: 'Reseller Manager', icon: Handshake },
  { id: 'influencer_manager', label: 'Influencer Manager', icon: Users },
  { id: 'influencer_dashboard', label: 'Influencer Dashboard', icon: User },
  // GRADE 5
  { id: 'continent_super_admin', label: 'Continent Admin', icon: Globe2 },
  { id: 'country_head', label: 'Country Admin', icon: Flag },
  // GRADE 6
  { id: 'finance_manager', label: 'Finance Manager', icon: DollarSign },
  { id: 'legal_manager', label: 'Legal Manager', icon: Scale },
  { id: 'developer_dashboard', label: 'Developer Dashboard', icon: Code2 },
  { id: 'pro_manager', label: 'Pro Manager', icon: Star },
  // GRADE 7
  { id: 'pro_user_dashboard', label: 'Pro User Dashboard', icon: UserCircle },
  { id: 'basic_user_dashboard', label: 'Basic User Dashboard', icon: User },
  // GRADE 8 (LAST)
  { id: 'home', label: 'Home', icon: Home },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type RoleId = typeof ROLE_CATEGORIES[number]['id'];

interface ControlPanelSidebarProps {
  activeRole?: RoleId;
  onRoleSelect: (roleId: RoleId) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout: () => void;
}

// ===== COMPACT ROLE BUTTON (NO SCROLL - ALL FIT ON SCREEN) =====
const RoleButton = memo<{
  role: typeof ROLE_CATEGORIES[number];
  isActive: boolean;
  onClick: () => void;
}>(({ role, isActive, onClick }) => {
  const Icon = role.icon;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 rounded-lg transition-all duration-150",
        "px-2 py-1.5 text-left group relative",
        isActive 
          ? "bg-blue-600 ring-1 ring-blue-400/50" 
          : "hover:bg-white/10"
      )}
      style={{
        background: isActive 
          ? `linear-gradient(135deg, ${COLORS.activeHighlight} 0%, #1d4ed8 100%)`
          : undefined,
      }}
    >
      {/* Compact Icon */}
      <div className={cn(
        "w-6 h-6 rounded flex items-center justify-center flex-shrink-0",
        isActive ? "bg-white/20" : "bg-white/10"
      )}>
        <Icon 
          className="w-3.5 h-3.5" 
          style={{ color: isActive ? '#ffffff' : COLORS.iconColor }} 
        />
      </div>
      
      {/* Text - compact */}
      <span 
        className={cn(
          "text-xs font-medium truncate",
          isActive ? "text-white" : "text-white/80"
        )}
      >
        {role.label}
      </span>
    </button>
  );
});
RoleButton.displayName = 'RoleButton';

// ===== MAIN SIDEBAR COMPONENT =====
export const ControlPanelSidebar = memo<ControlPanelSidebarProps>(({
  activeRole,
  onRoleSelect,
  onLogout,
}) => {
  const handleRoleClick = useCallback((roleId: RoleId) => {
    onRoleSelect(roleId);
  }, [onRoleSelect]);

  return (
    <aside
      className="flex flex-col flex-shrink-0 fixed left-0 top-0 z-40 overflow-hidden"
      style={{
        width: 280,
        height: '100vh',
        background: COLORS.bgGradient,
        borderRight: `1px solid ${COLORS.border}`,
      }}
    >
      {/* SECTION 1 - SYSTEM NAME (Compact) */}
      <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <h1 className="text-lg font-bold text-white tracking-tight">Control Panel</h1>
        <p className="text-xs text-white/60 font-medium">Super Admin</p>
      </div>

      {/* SECTION 2 - ALL MODULES (NO SCROLL - FIXED HEIGHT) */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 py-1 overflow-hidden">
        {ROLE_CATEGORIES.map((role) => (
          <RoleButton
            key={role.id}
            role={role}
            isActive={activeRole === role.id}
            onClick={() => handleRoleClick(role.id)}
          />
        ))}
      </nav>

      {/* SECTION 3 - STATUS + LOGOUT (Compact) */}
      <div className="px-2 py-2 flex-shrink-0" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Live</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase">AI</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase">OK</span>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
});

ControlPanelSidebar.displayName = 'ControlPanelSidebar';
export default ControlPanelSidebar;
export type { RoleId };
