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

// LOCKED: Sidebar width 260px expanded, 80px collapsed
// LOCKED: Background #0B0F1A
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
        background: '#0B0F1A',
        borderRight: '1px solid #1F2937'
      }}
    >
      {/* Collapse Toggle - LOCKED */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-6 flex items-center justify-center transition-colors hover:bg-[#1E293B]"
        style={{
          width: '24px',
          height: '24px',
          background: '#111827',
          border: '1px solid #1F2937',
          borderRadius: '50%',
          color: '#9CA3AF'
        }}
      >
        {collapsed ? (
          <ChevronRight style={{ width: '14px', height: '14px' }} />
        ) : (
          <ChevronLeft style={{ width: '14px', height: '14px' }} />
        )}
      </button>

      {/* Navigation - LOCKED */}
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
                background: isActive ? '#1E293B' : 'transparent',
                borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                color: isActive ? '#FFFFFF' : '#BFC7D5'
              }}
              whileHover={{ 
                backgroundColor: '#111827',
                color: '#FFFFFF'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  flexShrink: 0,
                  color: isActive ? '#2563EB' : '#9CA3AF'
                }} 
              />
              {!collapsed && (
                <span 
                  className="truncate"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500 
                  }}
                >
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer - LOCKED */}
      {!collapsed && (
        <div 
          className="p-4"
          style={{ borderTop: '1px solid #1F2937' }}
        >
          <div 
            className="text-center uppercase tracking-widest"
            style={{ fontSize: '10px', color: '#6B7280' }}
          >
            Boss Role Principle
          </div>
          <div 
            className="text-center mt-1"
            style={{ fontSize: '9px', color: '#2563EB' }}
          >
            See Everything • Change Nothing Casually
          </div>
        </div>
      )}
    </motion.aside>
  );
}
