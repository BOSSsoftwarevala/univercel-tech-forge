/**
 * CONTROL PANEL SIDEBAR - FINAL STRUCTURE
 * ========================================
 * FULL HEIGHT (100vh) • ONE SIDEBAR ONLY • PREMIUM CARD-STYLE BUTTONS
 * 20 ROLE BUTTONS + STATUS STRIP AT BOTTOM
 * LOCKED STRUCTURE - BOSS APPROVAL REQUIRED FOR CHANGES
 * 
 * EXACT ORDER (LOCKED - 20 ROLES):
 * 1. Boss / Owner
 * 2. CEO
 * 3. Vala AI
 * 4. Server Manager
 * 5. Continent Admin
 * 6. Country Head
 * 7. Franchise Manager
 * 8. Sales & Support Manager
 * 9. Reseller Manager
 * 10. Lead Manager
 * 11. Product Manager
 * 12. Demo Manager
 * 13. Pro Manager
 * 14. Legal Manager
 * 15. Task Management
 * 16. Finance Manager
 * 17. Developer Management
 * 18. Marketing Management
 * 19. Customer Support Management
 * 20. Role Manager
 */

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Crown, Eye, Brain, Server, Globe2, Flag, Building2, 
  Headphones, Handshake, Target, Box, Terminal, 
  Star, Scale, ListTodo, DollarSign, Code2, 
  Megaphone, HeartHandshake, Users, LogOut, Zap
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

// ===== 21 ROLE CATEGORIES (EXACT ORDER - LOCKED) =====
// IDs MUST match ActiveRole type in RoleSwitchSidebar.tsx
const ROLE_CATEGORIES = [
  { id: 'boss_owner', label: 'Boss / Owner', icon: Crown },
  { id: 'ceo', label: 'CEO', icon: Eye },
  { id: 'vala_ai_management', label: 'Vala AI', icon: Brain },
  { id: 'server_manager', label: 'Server Manager', icon: Server },
  { id: 'continent_super_admin', label: 'Continent Admin', icon: Globe2 },
  { id: 'country_head', label: 'Country Head', icon: Flag },
  { id: 'franchise_manager', label: 'Franchise Manager', icon: Building2 },
  { id: 'sales_support_manager', label: 'Sales & Support Manager', icon: Headphones },
  { id: 'reseller_manager', label: 'Reseller Manager', icon: Handshake },
  { id: 'lead_manager', label: 'Lead Manager', icon: Target },
  { id: 'product_manager', label: 'Product Manager', icon: Box },
  { id: 'demo_manager', label: 'Demo Manager', icon: Terminal },
  { id: 'pro_manager', label: 'Pro Manager', icon: Star },
  { id: 'legal_manager', label: 'Legal Manager', icon: Scale },
  { id: 'task_management', label: 'Task Management', icon: ListTodo },
  { id: 'finance_manager', label: 'Finance Manager', icon: DollarSign },
  { id: 'developer_management', label: 'Developer Management', icon: Code2 },
  { id: 'marketing_management', label: 'Marketing Management', icon: Megaphone },
  { id: 'customer_support_management', label: 'Customer Support Management', icon: HeartHandshake },
  { id: 'role_manager', label: 'Role Manager', icon: Users },
  { id: 'api_ai_manager', label: 'API & AI Manager', icon: Zap },
] as const;

type RoleId = typeof ROLE_CATEGORIES[number]['id'];

interface ControlPanelSidebarProps {
  activeRole?: RoleId;
  onRoleSelect: (roleId: RoleId) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout: () => void;
}

// ===== PREMIUM CARD-STYLE ROLE BUTTON =====
// Rounded rectangle, large height, soft glow, icon in circular badge
const RoleButton = memo<{
  role: typeof ROLE_CATEGORIES[number];
  isActive: boolean;
  onClick: () => void;
  index: number;
}>(({ role, isActive, onClick, index }) => {
  const Icon = role.icon;
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 rounded-2xl transition-all duration-200",
        "px-4 py-4 text-left group relative overflow-hidden",
        isActive && "ring-2 ring-blue-400/50"
      )}
      style={{
        background: isActive 
          ? `linear-gradient(135deg, ${COLORS.activeHighlight} 0%, #1d4ed8 100%)`
          : COLORS.cardBg,
        boxShadow: isActive 
          ? `0 8px 32px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
          : `0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 8px 32px ${COLORS.cardGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Soft glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${COLORS.cardGlow} 0%, transparent 70%)`
        }}
      />
      
      {/* Icon in circular badge */}
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10",
        "transition-all duration-200",
        isActive 
          ? "bg-white/20 shadow-lg shadow-blue-500/30" 
          : "bg-white/10 group-hover:bg-white/15"
      )}>
        <Icon 
          className="w-6 h-6 transition-colors" 
          style={{ color: isActive ? '#ffffff' : COLORS.iconColor }} 
        />
      </div>
      
      {/* Text - clearly readable, no tiny fonts */}
      <span 
        className={cn(
          "text-base font-semibold truncate relative z-10 transition-colors",
          isActive ? "text-white" : "text-white/90 group-hover:text-white"
        )}
      >
        {role.label}
      </span>
    </motion.button>
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
      className="flex flex-col flex-shrink-0 fixed left-0 top-0 z-40"
      style={{
        width: 320,
        height: '100vh',
        background: COLORS.bgGradient,
        borderRight: `1px solid ${COLORS.border}`,
      }}
    >
      {/* SECTION 1 - SYSTEM NAME */}
      <div className="px-6 py-6 flex-shrink-0" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <h1 className="text-2xl font-bold text-white tracking-tight">Control Panel</h1>
        <p className="text-sm text-white/60 mt-1 font-medium">Super Admin</p>
      </div>

      {/* SECTION 2 - CORE ROLES (CARD-STYLE BUTTONS) */}
      {/* FORCE: guarantee scroll height by giving ScrollArea an explicit parent height */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <nav className="space-y-2 px-4 py-4 pb-10">
            {ROLE_CATEGORIES.map((role, index) => (
              <RoleButton
                key={role.id}
                role={role}
                isActive={activeRole === role.id}
                onClick={() => handleRoleClick(role.id)}
                index={index}
              />
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* SECTION 3 - SYSTEM STATUS (BOTTOM FIXED) */}
      <div className="px-4 py-4 flex-shrink-0" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Running</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">AI Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Healthy</span>
          </div>
        </div>
        
        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Logout</span>
        </motion.button>
      </div>
    </aside>
  );
});

ControlPanelSidebar.displayName = 'ControlPanelSidebar';
export default ControlPanelSidebar;
export type { RoleId };
