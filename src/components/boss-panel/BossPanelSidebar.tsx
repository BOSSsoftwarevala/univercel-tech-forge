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
  Code2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BossPanelSection } from './BossPanelLayout';

interface BossPanelSidebarProps {
  activeSection: BossPanelSection;
  onSectionChange: (section: BossPanelSection) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

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
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function BossPanelSidebar({ 
  activeSection, 
  onSectionChange, 
  collapsed, 
  onCollapsedChange 
}: BossPanelSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0d0d14] via-[#12121a] to-[#0a0a10] backdrop-blur-xl border-r border-amber-500/15 z-40 flex flex-col"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center text-amber-400 hover:bg-amber-500/30 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
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
                isActive 
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-amber-400" : "text-amber-500/50")} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-amber-500/15">
          <div className="text-[10px] text-white/40 uppercase tracking-widest text-center">
            Boss Role Principle
          </div>
          <div className="text-[9px] text-amber-400/60 text-center mt-1">
            See Everything • Change Nothing Casually
          </div>
        </div>
      )}
    </motion.aside>
  );
}
