import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Database, Upload, FolderTree,
  Cpu, Rocket, Server, Terminal, Settings, ChevronRight,
  ChevronDown, Search, Activity, Shield, BarChart3,
  Code, Lock, Archive, Box, CheckCircle2, History,
  Bell, User, LogOut, AlertCircle, Zap, GitBranch,
  Globe2, FileCode, Eye, Copy, Download, Edit3,
  RotateCcw, StopCircle, Timer, ShieldAlert, Key,
  ClipboardList, UserCheck, ToggleLeft, Layers, Microscope,
  Atom, Link2, Grid3X3, Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  children?: SidebarItem[];
  dividerAfter?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'software-products',
    label: 'Products',
    icon: Package,
    children: [
      { id: 'all-products', label: 'All Software', icon: Box },
      { id: 'active-products', label: 'Active', icon: CheckCircle2 },
      { id: 'development-products', label: 'In Development', icon: Code },
      { id: 'deployed-products', label: 'Deployed', icon: Rocket },
      { id: 'locked-products', label: 'Locked', icon: Lock },
      { id: 'archived-products', label: 'Archived', icon: Archive },
      { id: 'software-profile', label: 'Software Profile', icon: FileCode },
    ],
  },
  { id: 'software-vault', label: 'Software Vault', icon: Database, badge: '7K+', badgeColor: 'text-violet-400' },
  { id: 'upload-build', label: 'Upload Software', icon: Upload },
  {
    id: 'product-structure',
    label: 'Repository',
    icon: FolderTree,
    children: [
      { id: 'main-category', label: 'Category', icon: Layers },
      { id: 'sub-category', label: 'Sub-Category', icon: Grid3X3 },
      { id: 'micro-category', label: 'Micro-Category', icon: Microscope },
      { id: 'nano-category', label: 'Nano-Category', icon: Atom },
      { id: 'feature-binding', label: 'Feature Binding', icon: Link2 },
    ],
  },
  {
    id: 'module-management',
    label: 'Frameworks',
    icon: Cpu,
    children: [
      { id: 'core-modules', label: 'Core Modules', icon: Cpu },
      { id: 'optional-modules', label: 'Optional Modules', icon: ToggleLeft },
      { id: 'role-modules', label: 'Role Modules', icon: UserCheck },
      { id: 'locked-modules', label: 'Locked', icon: Lock },
      { id: 'disabled-modules', label: 'Disabled', icon: StopCircle },
    ],
  },
  {
    id: 'deployment-control',
    label: 'Deployments',
    icon: Rocket,
    badge: 3,
    badgeColor: 'text-amber-400',
    children: [
      { id: 'server-assignment', label: 'Server Assignment', icon: Server },
      { id: 'environment-select', label: 'Environment', icon: GitBranch },
      { id: 'deploy', label: 'Deploy', icon: Rocket },
      { id: 'rollback', label: 'Rollback', icon: RotateCcw },
      { id: 'stop-deployment', label: 'Stop', icon: StopCircle },
      { id: 'deployment-logs', label: 'Deployment Logs', icon: FileCode },
    ],
  },
  { id: 'server-manager', label: 'Server Manager', icon: Server },
  {
    id: 'activity-logs',
    label: 'Logs',
    icon: Terminal,
    children: [
      { id: 'product-changes', label: 'Product Changes', icon: Edit3 },
      { id: 'file-upload-logs', label: 'Upload Logs', icon: Upload },
      { id: 'lock-unlock-history', label: 'Lock History', icon: Lock },
      { id: 'deployment-history', label: 'Deploy History', icon: Rocket },
      { id: 'approval-history', label: 'Approvals', icon: CheckCircle2 },
    ],
  },
  {
    id: 'security-license',
    label: 'Security',
    icon: Shield,
    badge: 2,
    badgeColor: 'text-red-400',
    children: [
      { id: 'license-lock', label: 'License Lock', icon: Lock },
      { id: 'domain-lock', label: 'Domain Lock', icon: Globe2 },
      { id: 'api-key-binding', label: 'API Keys', icon: Key },
      { id: 'expiry-control', label: 'Expiry', icon: Timer },
      { id: 'abuse-protection', label: 'Abuse Protection', icon: ShieldAlert },
    ],
  },
  {
    id: 'access-control',
    label: 'Access Control',
    icon: Eye,
    children: [
      { id: 'view-permission', label: 'View', icon: Eye },
      { id: 'copy-permission', label: 'Copy', icon: Copy },
      { id: 'download-permission', label: 'Download', icon: Download },
      { id: 'edit-permission', label: 'Edit', icon: Edit3 },
      { id: 'role-visibility', label: 'Role Visibility', icon: UserCheck },
      { id: 'country-control', label: 'Country/Franchise', icon: Globe2 },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    children: [
      { id: 'software-usage', label: 'Usage', icon: BarChart3 },
      { id: 'deployment-success', label: 'Deploy Success', icon: CheckCircle2 },
      { id: 'failure-reports', label: 'Failures', icon: AlertCircle },
      { id: 'export-reports', label: 'Export', icon: Download },
    ],
  },
  {
    id: 'approval-flow',
    label: 'Approvals',
    icon: CheckCircle2,
    children: [
      { id: 'deployment-approval', label: 'Deploy Approval', icon: Rocket },
      { id: 'version-approval', label: 'Version Approval', icon: GitBranch },
      { id: 'module-approval', label: 'Module Approval', icon: Cpu },
      { id: 'emergency-override', label: 'Emergency Override', icon: AlertCircle },
    ],
  },
  { id: 'dev-studio', label: 'Dev Studio', icon: Code, badge: 'LIVE', badgeColor: 'text-emerald-400' },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'security-settings', label: 'Security', icon: Shield },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'logout', label: 'Logout', icon: LogOut },
    ],
  },
];

interface ProductManagerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  stats?: {
    totalProducts: number;
    activeDemos: number;
    pendingOrders: number;
    pendingDeployments?: number;
    criticalIssues?: number;
  };
}

const SidebarItemComponent: React.FC<{
  item: SidebarItem;
  activeSection: string;
  onSectionChange: (id: string) => void;
  depth?: number;
}> = ({ item, activeSection, onSectionChange, depth = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeSection === item.id;
  const isChildActive = hasChildren && item.children!.some((c) => c.id === activeSection);

  const [isExpanded, setIsExpanded] = useState(isChildActive || item.id === 'software-products');

  const Icon = item.icon;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      onSectionChange(item.id);
    }
  };

  if (depth === 0) {
    return (
      <div>
        <button
          onClick={handleClick}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all',
            isActive || isChildActive
              ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
          )}
        >
          <Icon className={cn('w-4 h-4 shrink-0', isActive || isChildActive ? 'text-violet-400' : '')} />
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {item.badge !== undefined && (
            <span className={cn('text-[10px]', item.badgeColor || 'text-slate-500')}>
              {item.badge}
            </span>
          )}
          {hasChildren && (
            isExpanded
              ? <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              : <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          )}
        </button>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden ml-3 mt-0.5 border-l border-slate-800 pl-2 space-y-0.5"
            >
              {item.children!.map((child) => (
                <SidebarItemComponent
                  key={child.id}
                  item={child}
                  activeSection={activeSection}
                  onSectionChange={onSectionChange}
                  depth={depth + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Child item
  return (
    <button
      onClick={() => onSectionChange(item.id)}
      className={cn(
        'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] transition-all',
        isActive
          ? 'bg-violet-500/10 text-violet-300'
          : 'text-slate-600 hover:text-slate-300 hover:bg-slate-800/40'
      )}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span className="flex-1 text-left truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span className={cn('text-[9px]', item.badgeColor || 'text-slate-600')}>{item.badge}</span>
      )}
    </button>
  );
};

const ProductManagerSidebar: React.FC<ProductManagerSidebarProps> = ({
  activeSection,
  onSectionChange,
  stats,
}) => {
  const [search, setSearch] = useState('');

  const filteredItems = search
    ? SIDEBAR_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          item.children?.some((c) => c.label.toLowerCase().includes(search.toLowerCase()))
      )
    : SIDEBAR_ITEMS;

  return (
    <div className="w-64 flex flex-col h-full bg-slate-950 border-r border-slate-800">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100">Product Manager</p>
            <p className="text-[10px] text-slate-500">AI Builder Console</p>
          </div>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-sm font-bold text-violet-400">{stats.totalProducts}</p>
              <p className="text-[9px] text-slate-600">Products</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-sm font-bold text-amber-400">{stats.pendingDeployments ?? 0}</p>
              <p className="text-[9px] text-slate-600">Pending</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-sm font-bold text-red-400">{stats.criticalIssues ?? 0}</p>
              <p className="text-[9px] text-slate-600">Critical</p>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="h-7 pl-8 text-xs bg-slate-900 border-slate-800 text-slate-300 placeholder:text-slate-600 focus-visible:ring-violet-500/50"
          />
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-0.5">
          {filteredItems.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer status */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[10px] text-slate-600">System Active • v3.0</span>
          <div className="ml-auto flex items-center gap-1">
            <Zap className="w-3 h-3 text-violet-400" />
            <span className="text-[10px] text-violet-400">AI Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagerSidebar;
