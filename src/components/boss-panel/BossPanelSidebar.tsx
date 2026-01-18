import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Activity, 
  Network, 
  Users, 
  Shield, 
  Boxes,
  Package,
  DollarSign,
  FileSearch,
  Lock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Code2,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BossPanelSection } from './BossPanelLayout';

interface BossPanelSidebarProps {
  activeSection: BossPanelSection;
  onSectionChange: (section: BossPanelSection) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

// LOCKED: Menu items with fixed icons (20px)
const menuItems: { id: BossPanelSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-activity', label: 'Live Activity Stream', icon: Activity },
  { id: 'hierarchy', label: 'Hierarchy Control', icon: Network },
  { id: 'super-admins', label: 'Super Admins', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'modules', label: 'System Modules', icon: Boxes },
  { id: 'products', label: 'Product & Demo', icon: Package },
  { id: 'revenue', label: 'Revenue Snapshot', icon: DollarSign },
  { id: 'audit', label: 'Audit & Blackbox', icon: FileSearch },
  { id: 'security', label: 'Security & Legal', icon: Lock },
  { id: 'codepilot', label: 'CodePilot', icon: Code2 },
  { id: 'server-hosting', label: 'CodeLab Cloud', icon: Server },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ===== LOCKED COLORS: Dark Navy Blue Sidebar =====
// DO NOT CHANGE - Final approved color scheme
const SIDEBAR_COLORS = {
  bg: '#0a1628',           // Dark Navy background
  bgGradient: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)',
  border: '#1e3a5f',       // Navy border
  activeHighlight: '#2563eb', // Bright Blue active state
  hoverBg: 'rgba(37, 99, 235, 0.15)',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  iconColor: '#60a5fa',    // Soft blue icons
};

export function BossPanelSidebar({ 
  activeSection, 
  onSectionChange, 
  collapsed, 
  onCollapsedChange 
}: BossPanelSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex flex-col"
      style={{ 
        background: SIDEBAR_COLORS.bgGradient,
        borderRight: `1px solid ${SIDEBAR_COLORS.border}`,
      }}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-6 flex items-center justify-center transition-colors rounded-full"
        style={{
          width: '24px',
          height: '24px',
          background: SIDEBAR_COLORS.activeHighlight,
          border: '2px solid white',
          color: 'white'
        }}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left",
                collapsed && "justify-center"
              )}
              style={{
                background: isActive ? SIDEBAR_COLORS.activeHighlight : 'transparent',
                color: SIDEBAR_COLORS.text,
                borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" style={{ color: isActive ? '#ffffff' : SIDEBAR_COLORS.iconColor }} />
              {!collapsed && (
                <span className="truncate text-sm font-medium" style={{ color: SIDEBAR_COLORS.text }}>
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4" style={{ borderTop: `1px solid ${SIDEBAR_COLORS.border}` }}>
          <div className="text-center uppercase tracking-widest text-[10px]" style={{ color: SIDEBAR_COLORS.textMuted }}>
            Boss Role Principle
          </div>
          <div className="text-center mt-1 text-[9px]" style={{ color: SIDEBAR_COLORS.text }}>
            See Everything • Change Nothing Casually
          </div>
        </div>
      )}
    </motion.aside>
  );
}
