import React, { useState } from 'react';
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
  ChevronDown,
  ChevronRight,
  Code2,
  Server,
  Brain,
  Store
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BossPanelSection } from './BossPanelLayout';

interface BossPanelSidebarProps {
  activeSection: BossPanelSection;
  onSectionChange: (section: BossPanelSection) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

// ─── SAP FIORI SIDEBAR COLOR TOKENS ──────────────────────────
const SAP_SIDE = {
  bg: 'hsl(0, 0%, 100%)',
  border: 'hsl(213, 18%, 90%)',
  groupLabel: 'hsl(213, 14%, 55%)',
  text: 'hsl(214, 27%, 26%)',
  textActive: 'hsl(210, 100%, 46%)',
  activeBg: 'hsl(210, 100%, 96%)',
  activeBar: 'hsl(210, 100%, 46%)',
  hoverBg: 'hsl(210, 25%, 97%)',
  icon: 'hsl(213, 14%, 55%)',
  iconActive: 'hsl(210, 100%, 46%)',
};

interface MenuGroup {
  label: string;
  items: { id: BossPanelSection; label: string; icon: React.ElementType }[];
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'live-activity', label: 'Live Activity', icon: Activity },
    ],
  },
  {
    label: 'Organization',
    items: [
      { id: 'hierarchy', label: 'Hierarchy Control', icon: Network },
      { id: 'super-admins', label: 'Super Admins', icon: Users },
      { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'modules', label: 'System Modules', icon: Boxes },
      { id: 'products', label: 'Product & Demo', icon: Package },
      { id: 'marketplace-manager', label: 'Marketplace', icon: Store },
      { id: 'server-hosting', label: 'CodeLab Cloud', icon: Server },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'vala-ai', label: 'VALA AI', icon: Brain },
      { id: 'aira', label: 'AIRA', icon: Brain },
      { id: 'codepilot', label: 'CodePilot', icon: Code2 },
    ],
  },
  {
    label: 'Distribution',
    items: [
      { id: 'reseller-dashboard', label: 'Reseller', icon: Users },
      { id: 'franchise-dashboard', label: 'Franchise', icon: Network },
    ],
  },
  {
    label: 'Finance & Security',
    items: [
      { id: 'revenue', label: 'Revenue Snapshot', icon: DollarSign },
      { id: 'audit', label: 'Audit & Blackbox', icon: FileSearch },
      { id: 'security', label: 'Security & Legal', icon: Lock },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function BossPanelSidebar({ 
  activeSection, 
  onSectionChange, 
  collapsed, 
  onCollapsedChange 
}: BossPanelSidebarProps) {
  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    // Find which group contains the active section and expand it
    const activeGroup = menuGroups.find(g => g.items.some(i => i.id === activeSection));
    const initial = new Set<string>();
    if (activeGroup) initial.add(activeGroup.label);
    // Always expand Overview
    initial.add('Overview');
    return initial;
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <aside
      className="fixed left-0 h-[calc(100vh-44px)] z-40 flex flex-col overflow-hidden transition-all duration-200"
      style={{ 
        top: '44px',
        width: collapsed ? '48px' : '240px',
        background: SAP_SIDE.bg,
        borderRight: `1px solid ${SAP_SIDE.border}`,
      }}
    >
      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin' }}>
        {menuGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          const hasActive = group.items.some(i => i.id === activeSection);

          if (collapsed) {
            // Collapsed: show only icons
            return (
              <div key={group.label} className="px-1 mb-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      title={item.label}
                      className="w-full flex items-center justify-center py-2 rounded transition-colors"
                      style={{
                        background: isActive ? SAP_SIDE.activeBg : 'transparent',
                        borderLeft: isActive ? `3px solid ${SAP_SIDE.activeBar}` : '3px solid transparent',
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: isActive ? SAP_SIDE.iconActive : SAP_SIDE.icon }} />
                    </button>
                  );
                })}
              </div>
            );
          }

          return (
            <div key={group.label} className="mb-0.5">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors"
                style={{ 
                  color: SAP_SIDE.groupLabel,
                  background: hasActive && !isExpanded ? SAP_SIDE.activeBg : 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = SAP_SIDE.hoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = hasActive && !isExpanded ? SAP_SIDE.activeBg : 'transparent')}
              >
                <span>{group.label}</span>
                {isExpanded 
                  ? <ChevronDown className="w-3 h-3" style={{ color: SAP_SIDE.groupLabel }} />
                  : <ChevronRight className="w-3 h-3" style={{ color: SAP_SIDE.groupLabel }} />
                }
              </button>

              {/* Group Items */}
              {isExpanded && (
                <div className="pb-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className="w-full flex items-center gap-2.5 pl-4 pr-3 py-2 text-[13px] transition-colors"
                        style={{
                          background: isActive ? SAP_SIDE.activeBg : 'transparent',
                          color: isActive ? SAP_SIDE.textActive : SAP_SIDE.text,
                          fontWeight: isActive ? 600 : 400,
                          borderLeft: isActive ? `3px solid ${SAP_SIDE.activeBar}` : '3px solid transparent',
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = SAP_SIDE.hoverBg; }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? SAP_SIDE.iconActive : SAP_SIDE.icon }} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${SAP_SIDE.border}` }}>
          <p className="text-[10px] text-center uppercase tracking-widest" style={{ color: SAP_SIDE.groupLabel }}>
            Software Vala • Boss Panel
          </p>
        </div>
      )}
    </aside>
  );
}
