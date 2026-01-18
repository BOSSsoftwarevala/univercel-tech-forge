/**
 * CONTROL PANEL SIDEBAR
 * Clean sidebar with ONLY role category navigation
 * NO stats, alerts, activity, or widgets
 * Same locked blue theme
 */

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Crown, Eye, Globe2, Flag, Server, Building2, Headphones, 
  Handshake, Target, Box, Terminal, ChevronLeft, ChevronRight, LogOut, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

// ===== LOCKED COLORS: Dark Navy Blue Sidebar =====
// DO NOT CHANGE - Final approved color scheme
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

// Role categories - exact order from spec
const ROLE_CATEGORIES = [
  { id: 'boss_owner', label: 'Boss / Owner', icon: Crown },
  { id: 'ceo', label: 'CEO', icon: Eye },
  { id: 'vala_ai', label: 'Vala AI', icon: Brain },
  { id: 'server_manager', label: 'Server Manager', icon: Server },
  { id: 'continent_super_admin', label: 'Continent Admin', icon: Globe2 },
  { id: 'country_head', label: 'Country Head', icon: Flag },
  { id: 'franchise_manager', label: 'Franchise Manager', icon: Building2 },
  { id: 'sales_support_manager', label: 'Sales & Support Manager', icon: Headphones },
  { id: 'reseller_manager', label: 'Reseller Manager', icon: Handshake },
  { id: 'lead_manager', label: 'Lead Manager', icon: Target },
  { id: 'product_manager', label: 'Product Manager', icon: Box },
  { id: 'demo_manager', label: 'Demo Manager', icon: Terminal },
] as const;

type RoleId = typeof ROLE_CATEGORIES[number]['id'];

interface ControlPanelSidebarProps {
  activeRole?: RoleId;
  onRoleSelect: (roleId: RoleId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

// Memoized Role Button Component
const RoleButton = memo<{
  role: typeof ROLE_CATEGORIES[number];
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
  index: number;
}>(({ role, isActive, collapsed, onClick, index }) => {
  const Icon = role.icon;
  
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          onClick={onClick}
          className={cn(
            "w-full flex items-center gap-4 rounded-lg transition-all duration-150 relative group",
            collapsed ? "justify-center px-3 py-4" : "px-4 py-4",
            isActive
              ? "text-white font-semibold"
              : "text-white/80 hover:text-white"
          )}
          style={{
            background: isActive ? SIDEBAR_COLORS.activeHighlight : 'transparent',
            borderLeft: isActive ? `4px solid ${SIDEBAR_COLORS.text}` : '4px solid transparent',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = SIDEBAR_COLORS.hoverBg;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {/* Icon Container */}
          <div 
            className={cn(
              "flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-150",
              isActive ? "bg-white/20" : "bg-white/10 group-hover:bg-white/15"
            )}
            style={{ width: 44, height: 44 }}
          >
            <Icon 
              className="transition-colors duration-150" 
              style={{ 
                width: 22, 
                height: 22,
                color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.iconColor 
              }} 
            />
          </div>
          
          {/* Label */}
          {!collapsed && (
            <span 
              className="text-base font-medium truncate flex-1 text-left"
              style={{ fontSize: '15px' }}
            >
              {role.label}
            </span>
          )}
          
          {/* Active Indicator Arrow */}
          {!collapsed && isActive && (
            <ChevronRight className="w-5 h-5 text-white/80 flex-shrink-0" />
          )}
        </motion.button>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right" sideOffset={12} className="text-sm font-medium">
          {role.label}
        </TooltipContent>
      )}
    </Tooltip>
  );
});

RoleButton.displayName = 'RoleButton';

export const ControlPanelSidebar = memo<ControlPanelSidebarProps>(({
  activeRole,
  onRoleSelect,
  collapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const handleRoleClick = useCallback((roleId: RoleId) => {
    onRoleSelect(roleId);
  }, [onRoleSelect]);

  return (
    <aside
      className="flex flex-col border-r transition-all duration-150 h-screen"
      style={{
        width: collapsed ? 80 : 300,
        background: SIDEBAR_COLORS.bgGradient,
        borderColor: SIDEBAR_COLORS.border,
      }}
    >
      {/* ========================================== */}
      {/* HEADER - Control Panel Title */}
      {/* ========================================== */}
      <div 
        className="sticky top-0 z-20 px-4 py-5"
        style={{ 
          background: SIDEBAR_COLORS.bg,
          borderBottom: `1px solid ${SIDEBAR_COLORS.border}` 
        }}
      >
        {!collapsed ? (
          <div className="space-y-1">
            <h1 
              className="text-xl font-bold tracking-tight"
              style={{ color: SIDEBAR_COLORS.text }}
            >
              Control Panel
            </h1>
            <p 
              className="text-sm font-medium"
              style={{ color: SIDEBAR_COLORS.textMuted }}
            >
              Role: Super Admin
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Crown className="w-7 h-7" style={{ color: SIDEBAR_COLORS.iconColor }} />
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* ROLE CATEGORIES - Main Navigation */}
      {/* ONLY categories, NO stats, NO widgets */}
      {/* ========================================== */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {ROLE_CATEGORIES.map((role, index) => (
            <RoleButton
              key={role.id}
              role={role}
              isActive={activeRole === role.id}
              collapsed={collapsed}
              onClick={() => handleRoleClick(role.id)}
              index={index}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* ========================================== */}
      {/* STATUS STRIP - System Health Indicators */}
      {/* ========================================== */}
      <div 
        className="px-3 py-3"
        style={{ borderTop: `1px solid ${SIDEBAR_COLORS.border}` }}
      >
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">RUNNING</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-medium text-cyan-400">AI: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs font-medium text-blue-400">HEALTHY</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              </TooltipTrigger>
              <TooltipContent side="right">System Running</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
              </TooltipTrigger>
              <TooltipContent side="right">AI Active</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <span className="w-3 h-3 rounded-full bg-blue-400" />
              </TooltipTrigger>
              <TooltipContent side="right">System Healthy</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* FOOTER - Collapse & Logout */}
      {/* ========================================== */}
      <div 
        className="p-3 space-y-2"
        style={{ borderTop: `1px solid ${SIDEBAR_COLORS.border}` }}
      >
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleCollapse}
          className={cn(
            "w-full text-white hover:bg-white/20 hover:text-white h-12",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-3" />
              <span className="text-base">Collapse</span>
            </>
          )}
        </Button>

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              onClick={onLogout}
              className={cn(
                "w-full text-white/80 hover:text-white hover:bg-red-500/30 h-12",
                collapsed ? "justify-center px-0" : "justify-start gap-3"
              )}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="text-base">Logout</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={12}>
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
});

ControlPanelSidebar.displayName = 'ControlPanelSidebar';

export default ControlPanelSidebar;
export type { RoleId };
