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

// BRAND THEME: Dark sidebar with blue accent
// Uses CSS variables for consistency
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
      className="fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex flex-col bg-sidebar border-r border-sidebar-border"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-6 flex items-center justify-center transition-colors bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border rounded-full text-muted-foreground"
        style={{
          width: '24px',
          height: '24px',
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
                collapsed && "justify-center",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-foreground border-l-[3px] border-l-primary" 
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground border-l-[3px] border-l-transparent"
              )}
              whileTap={{ scale: 0.98 }}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              {!collapsed && (
                <span className="truncate text-sm font-medium">
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-center uppercase tracking-widest text-[10px] text-muted-foreground">
            Boss Role Principle
          </div>
          <div className="text-center mt-1 text-[9px] text-primary">
            See Everything • Change Nothing Casually
          </div>
        </div>
      )}
    </motion.aside>
  );
}
