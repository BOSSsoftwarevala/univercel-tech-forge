import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Activity, Users, Shield, Boxes, Package,
  DollarSign, FileSearch, Lock, Settings, ChevronDown, ChevronLeft,
  Server, Brain, Store, Zap, BarChart3, FileText, Bell,
  TrendingUp, Network, Briefcase, Globe, MapPin, Scale,
  UserCircle, Megaphone, Search, HeartHandshake, ShoppingCart,
  Key, Rocket, LineChart, Link2, ScrollText, UserCog,
  Code2, Monitor, Target, Headphones, Cpu, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BossPanelSection } from './BossPanelLayout';

interface BossPanelSidebarProps {
  activeSection: BossPanelSection;
  onSectionChange: (section: BossPanelSection) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const NAV = {
  bg:         'hsl(222, 47%, 7%)',
  border:     'hsla(215, 40%, 35%, 0.2)',
  groupLabel: 'hsl(215, 22%, 50%)',
  text:       'hsl(210, 22%, 72%)',
  textActive: 'hsl(217, 92%, 65%)',
  textHover:  'hsl(210, 40%, 98%)',
  activeBg:   'hsla(217, 92%, 65%, 0.12)',
  activeBar:  'hsl(217, 92%, 65%)',
  hoverBg:    'hsla(217, 92%, 65%, 0.06)',
  iconDim:    'hsl(215, 20%, 46%)',
  badge:      'hsl(346, 82%, 55%)',
  badgeBg:    'hsla(346, 82%, 55%, 0.15)',
  green:      'hsl(160, 84%, 44%)',
  greenBg:    'hsla(160, 84%, 44%, 0.12)',
};

/**
 * STANDALONE ROUTE MAP
 * Modules that navigate AWAY from Boss Panel to their own standalone route.
 * If a module ID is here, clicking it does navigate() instead of inline render.
 */
const STANDALONE_ROUTES: Record<string, string> = {
  'ceo-dashboard': '/super-admin-system/role-switch?role=aira',
  'vala-ai': '/super-admin-system/role-switch?role=aira&nav=vala-ai',
  'product-manager': '/super-admin/product-manager',
};

interface MenuItem {
  id: BossPanelSection;
  label: string;
  icon: React.ElementType;
  badge?: number;
  status?: 'live' | 'alert';
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Command Center',
    items: [
      { id: 'dashboard', label: 'Boss Panel', icon: LayoutDashboard, status: 'live' },
      { id: 'ceo-dashboard', label: 'CEO Dashboard', icon: Monitor },
      { id: 'vala-ai', label: 'Vala AI', icon: Brain, status: 'live' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { id: 'server-manager', label: 'Server Manager', icon: Server },
      { id: 'ai-api-manager', label: 'AI API Manager', icon: Cpu },
      { id: 'deployment-manager', label: 'Deployment Manager', icon: Rocket },
      { id: 'integration-manager', label: 'Integration Manager', icon: Link2 },
    ],
  },
  {
    label: 'Development',
    items: [
      { id: 'dev-manager', label: 'Development Manager', icon: Code2 },
      { id: 'product-manager', label: 'Product Manager', icon: Package },
      { id: 'demo-manager', label: 'Demo Manager', icon: Activity },
      { id: 'demo-system-manager', label: 'Demo System Manager', icon: Boxes },
      { id: 'task-manager', label: 'Task Manager', icon: FileText },
      { id: 'promise-tracker', label: 'Promise Tracker', icon: HeartHandshake },
    ],
  },
  {
    label: 'Business & Sales',
    items: [
      { id: 'marketplace-manager', label: 'Marketplace Manager', icon: Store },
      { id: 'marketplace-user-system', label: 'Marketplace User System', icon: ShoppingCart },
      { id: 'license-manager', label: 'License Manager', icon: Key },
      { id: 'lead-manager', label: 'Lead Manager', icon: Target },
      { id: 'sales-manager', label: 'Sales Manager', icon: TrendingUp },
      { id: 'asset-manager', label: 'Asset Manager', icon: Briefcase },
    ],
  },
  {
    label: 'Marketing & Growth',
    items: [
      { id: 'marketing-manager', label: 'Marketing Manager', icon: Megaphone },
      { id: 'seo-manager', label: 'SEO Manager', icon: Search },
      { id: 'influencer-manager', label: 'Influencer Manager', icon: Zap },
    ],
  },
  {
    label: 'Distribution Network',
    items: [
      { id: 'franchise-manager', label: 'Franchise Manager', icon: Network },
      { id: 'reseller-manager', label: 'Reseller Manager', icon: TrendingUp },
      { id: 'continent-admin', label: 'Continent Admin', icon: Globe },
      { id: 'country-admin', label: 'Country Admin', icon: MapPin },
    ],
  },
  {
    label: 'People & Support',
    items: [
      { id: 'customer-support', label: 'Customer Support', icon: Headphones },
      { id: 'developer-dashboard', label: 'Developer Dashboard', icon: Code2 },
      { id: 'pro-manager', label: 'Pro Manager', icon: UserCog },
      { id: 'user-dashboard', label: 'User Dashboard', icon: UserCircle },
    ],
  },
  {
    label: 'Finance & Legal',
    items: [
      { id: 'finance-manager', label: 'Finance Manager', icon: DollarSign },
      { id: 'legal-manager', label: 'Legal Manager', icon: Scale },
    ],
  },
  {
    label: 'Security & Audit',
    items: [
      { id: 'security-manager', label: 'Security Manager', icon: Shield },
      { id: 'audit-logs-manager', label: 'Audit Logs Manager', icon: ScrollText },
      { id: 'analytics-manager', label: 'Analytics Manager', icon: LineChart },
      { id: 'notification-manager', label: 'Notification Manager', icon: Bell },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { id: 'system-settings', label: 'System Settings', icon: Settings },
    ],
  },
];

export function BossPanelSidebar({ activeSection, onSectionChange, collapsed, onCollapsedChange }: BossPanelSidebarProps) {
  const navigate = useNavigate();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const activeGroup = menuGroups.find(g => g.items.some(i => i.id === activeSection));
    const initial = new Set<string>();
    if (activeGroup) initial.add(activeGroup.label);
    initial.add('Command Center');
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

  /** Click handler — standalone modules navigate away, others render inline */
  const handleItemClick = (id: BossPanelSection) => {
    const standaloneRoute = STANDALONE_ROUTES[id];
    if (standaloneRoute) {
      navigate(standaloneRoute);
    } else {
      onSectionChange(id);
    }
  };

  /** Back button → Control Panel */
  const handleBack = () => {
    navigate('/super-admin-system/role-switch?role=boss_owner');
  };

  return (
    <aside
      className="fixed left-0 z-40 flex flex-col transition-all duration-300"
      style={{ 
        top: '48px',
        height: 'calc(100vh - 48px)',
        width: collapsed ? '56px' : '260px',
        background: NAV.bg,
        borderRight: `1px solid ${NAV.border}`,
      }}
    >
      {/* TOP: Back + Collapse */}
      <div className="flex items-center justify-between px-2 py-1.5" style={{ borderBottom: `1px solid ${NAV.border}` }}>
        <button
          onClick={handleBack}
          title="Back to Control Panel"
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold transition-all"
          style={{ color: NAV.text }}
          onMouseEnter={(e) => { e.currentTarget.style.background = NAV.hoverBg; e.currentTarget.style.color = NAV.textHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAV.text; }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {!collapsed && <span>BACK</span>}
        </button>

        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
          style={{ color: NAV.iconDim }}
          onMouseEnter={(e) => { e.currentTarget.style.background = NAV.hoverBg; e.currentTarget.style.color = NAV.textHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAV.iconDim; }}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin', scrollbarColor: `${NAV.border} transparent` }}>
        {menuGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label);

          if (collapsed) {
            return (
              <div key={group.label} className="px-1.5 mb-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const isStandalone = !!STANDALONE_ROUTES[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      title={`${item.label}${isStandalone ? ' ↗' : ''}`}
                      className="relative w-full flex items-center justify-center py-2 rounded-md mb-px transition-all duration-200"
                      style={{
                        background: isActive ? NAV.activeBg : 'transparent',
                        borderLeft: isActive ? `3px solid ${NAV.activeBar}` : '3px solid transparent',
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = NAV.hoverBg; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isActive ? NAV.activeBg : 'transparent'; }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: isActive ? NAV.textActive : NAV.iconDim }} />
                      {item.status === 'live' && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: NAV.green }} />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          }

          return (
            <div key={group.label} className="mb-0.5">
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] transition-colors"
                style={{ color: NAV.groupLabel }}
                onMouseEnter={(e) => (e.currentTarget.style.color = NAV.textHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = NAV.groupLabel)}
              >
                <span>{group.label}</span>
                <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.15 }}>
                  <ChevronDown className="w-3 h-3" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      const isStandalone = !!STANDALONE_ROUTES[item.id];
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          className="w-full flex items-center gap-2.5 pl-5 pr-3 py-[6px] text-[12px] transition-all duration-150 relative"
                          style={{
                            background: isActive ? NAV.activeBg : 'transparent',
                            color: isActive ? NAV.textActive : NAV.text,
                            fontWeight: isActive ? 600 : 400,
                            borderLeft: isActive ? `3px solid ${NAV.activeBar}` : '3px solid transparent',
                          }}
                          onMouseEnter={(e) => { 
                            if (!isActive) {
                              e.currentTarget.style.background = NAV.hoverBg; 
                              e.currentTarget.style.color = NAV.textHover;
                            }
                          }}
                          onMouseLeave={(e) => { 
                            if (!isActive) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = NAV.text;
                            }
                          }}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isActive ? NAV.textActive : NAV.iconDim }} />
                          <span className="truncate">{item.label}</span>

                          {/* Standalone indicator */}
                          {isStandalone && (
                            <span className="ml-auto text-[8px] font-bold px-1 py-px rounded"
                              style={{ background: 'hsla(217, 92%, 65%, 0.1)', color: NAV.textActive }}>
                              ↗
                            </span>
                          )}

                          {item.status === 'live' && !isStandalone && (
                            <span className="ml-auto flex items-center gap-1 px-1.5 py-px rounded text-[8px] font-bold"
                              style={{ background: NAV.greenBg, color: NAV.green }}>
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: NAV.green }} />
                              LIVE
                            </span>
                          )}
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="ml-auto text-[9px] font-bold px-1.5 py-px rounded-full"
                              style={{ background: NAV.badgeBg, color: NAV.badge }}>{item.badge}</span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-2" style={{ borderTop: `1px solid ${NAV.border}` }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: NAV.green }} />
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: NAV.groupLabel }}>
              Software Vala • Enterprise
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
