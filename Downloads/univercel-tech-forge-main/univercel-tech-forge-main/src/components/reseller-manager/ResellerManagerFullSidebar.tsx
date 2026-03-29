/**
 * RESELLER MANAGER FULL SIDEBAR
 * Comprehensive hierarchical sidebar with all 12 sections
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  AlertTriangle,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Link,
  FileCheck,
  CreditCard,
  MapPin,
  Globe,
  Map,
  Building,
  Lock,
  Unlock,
  DollarSign,
  Wallet,
  Receipt,
  PieChart,
  Calculator,
  FileSpreadsheet,
  Target,
  UserCircle,
  UserMinus,
  Shuffle,
  Package,
  Tag,
  Percent,
  Gift,
  FileText,
  FileLock,
  Shield,
  CalendarClock,
  Upload,
  HeadphonesIcon,
  AlertCircle,
  ArrowUpCircle,
  MessageSquare,
  CheckCircle,
  History,
  KeyRound,
  ClipboardList,
  Bell,
  Megaphone,
  Send,
  Timer,
  BarChart3,
  Download,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Store,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export type ResellerSection = string;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  children?: MenuItem[];
}

const sidebarMenu: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { id: 'dashboard-overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'dashboard-live-activity', label: 'Live Activity', icon: Activity },
      { id: 'dashboard-performance', label: 'Performance Snapshot', icon: TrendingUp },
      { id: 'dashboard-alerts', label: 'Pending Alerts', icon: AlertTriangle, badge: 5 },
    ],
  },
  {
    id: 'reseller-management',
    label: 'Reseller Management',
    icon: Users,
    children: [
      { id: 'all-resellers', label: 'All Resellers', icon: Users },
      { id: 'resellers-active', label: 'Active', icon: UserCheck },
      { id: 'resellers-pending', label: 'Pending Approval', icon: Clock, badge: 3 },
      { id: 'resellers-suspended', label: 'Suspended', icon: UserX },
      { id: 'resellers-terminated', label: 'Terminated', icon: UserMinus },
      { id: 'add-reseller', label: 'Add New Reseller', icon: UserPlus },
      { id: 'add-manual', label: 'Manual Add', icon: FileCheck },
      { id: 'add-invite', label: 'Invite via Link', icon: Link },
      { id: 'approval-queue', label: 'Approval Queue', icon: ClipboardList, badge: 8 },
      { id: 'kyc-pending', label: 'KYC Pending', icon: Shield },
      { id: 'agreement-pending', label: 'Agreement Pending', icon: FileText },
      { id: 'payment-pending', label: 'Payment Pending', icon: CreditCard },
      { id: 'reseller-profile', label: 'Reseller Profile', icon: UserCircle },
    ],
  },
  {
    id: 'territory',
    label: 'Territory & Region',
    icon: MapPin,
    children: [
      { id: 'territory-country', label: 'Country Allocation', icon: Globe },
      { id: 'territory-state', label: 'State / Region Allocation', icon: Map },
      { id: 'territory-city', label: 'City / Zone Allocation', icon: Building },
      { id: 'territory-conflict', label: 'Conflict Resolver', icon: AlertCircle },
      { id: 'territory-lock', label: 'Lock Territory', icon: Lock },
      { id: 'territory-unlock', label: 'Unlock Territory', icon: Unlock },
    ],
  },
  {
    id: 'sales-revenue',
    label: 'Sales & Revenue',
    icon: DollarSign,
    children: [
      { id: 'sales-total', label: 'Total Sales', icon: DollarSign },
      { id: 'sales-monthly', label: 'Monthly Sales', icon: BarChart3 },
      { id: 'payout-pending', label: 'Pending Payout', icon: Clock, badge: 12 },
      { id: 'payout-cleared', label: 'Cleared Payout', icon: CheckCircle },
      { id: 'commission-breakdown', label: 'Commission Breakdown', icon: PieChart },
      { id: 'commission-product', label: 'Product-wise', icon: Package },
      { id: 'commission-reseller', label: 'Reseller-wise', icon: Users },
      { id: 'commission-region', label: 'Region-wise', icon: Globe },
      { id: 'payout-approval', label: 'Payout Request Approval', icon: FileCheck, badge: 4 },
      { id: 'manual-adjustment', label: 'Manual Adjustment', icon: Calculator },
    ],
  },
  {
    id: 'leads-clients',
    label: 'Leads & Clients',
    icon: Target,
    children: [
      { id: 'leads-all', label: 'All Leads', icon: Target },
      { id: 'leads-assigned', label: 'Assigned Leads', icon: UserCheck },
      { id: 'leads-converted', label: 'Converted Clients', icon: CheckCircle },
      { id: 'leads-lost', label: 'Lost / Dropped Leads', icon: UserMinus },
      { id: 'leads-source', label: 'Lead Source Tracking', icon: TrendingUp },
      { id: 'leads-transfer', label: 'Transfer Lead', icon: Shuffle },
    ],
  },
  {
    id: 'products-pricing',
    label: 'Products & Pricing',
    icon: Package,
    children: [
      { id: 'products-allowed', label: 'Allowed Products', icon: Package },
      { id: 'products-restricted', label: 'Restricted Products', icon: Lock },
      { id: 'price-slabs', label: 'Reseller Price Slabs', icon: Tag },
      { id: 'discount-rules', label: 'Discount Rules', icon: Percent },
      { id: 'special-offers', label: 'Special Offers Control', icon: Gift },
      { id: 'commission-control', label: 'Commission % Control', icon: Calculator },
    ],
  },
  {
    id: 'contracts-documents',
    label: 'Contracts & Documents',
    icon: FileText,
    children: [
      { id: 'docs-agreements', label: 'Agreements', icon: FileText },
      { id: 'docs-nda', label: 'NDAs', icon: FileLock },
      { id: 'docs-kyc', label: 'KYC Documents', icon: Shield },
      { id: 'docs-expiry', label: 'Expiry Tracker', icon: CalendarClock },
      { id: 'docs-upload', label: 'Upload / Replace', icon: Upload },
    ],
  },
  {
    id: 'support-escalation',
    label: 'Support & Escalation',
    icon: HeadphonesIcon,
    children: [
      { id: 'support-tickets', label: 'Support Tickets', icon: HeadphonesIcon, badge: 7 },
      { id: 'support-priority', label: 'Priority Issues', icon: AlertTriangle, badge: 2 },
      { id: 'support-escalated', label: 'Escalated to Admin', icon: ArrowUpCircle },
      { id: 'support-complaints', label: 'Reseller Complaints', icon: MessageSquare },
      { id: 'support-resolution', label: 'Resolution Status', icon: CheckCircle },
    ],
  },
  {
    id: 'activity-audit',
    label: 'Activity & Audit Logs',
    icon: History,
    children: [
      { id: 'audit-login', label: 'Login History', icon: KeyRound },
      { id: 'audit-action', label: 'Action History', icon: ClipboardList },
      { id: 'audit-approval', label: 'Approval History', icon: FileCheck },
      { id: 'audit-financial', label: 'Financial Actions', icon: DollarSign },
      { id: 'audit-territory', label: 'Territory Changes', icon: MapPin },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    children: [
      { id: 'notif-system', label: 'System Alerts', icon: Bell, badge: 3 },
      { id: 'notif-reseller', label: 'Reseller Notifications', icon: Users },
      { id: 'notif-broadcast', label: 'Broadcast Message', icon: Megaphone },
      { id: 'notif-warning', label: 'Warning / Notice Send', icon: AlertCircle },
      { id: 'notif-reminder', label: 'Auto Reminder System', icon: Timer },
    ],
  },
  {
    id: 'reports-exports',
    label: 'Reports & Exports',
    icon: BarChart3,
    children: [
      { id: 'report-sales', label: 'Sales Report', icon: DollarSign },
      { id: 'report-performance', label: 'Reseller Performance', icon: TrendingUp },
      { id: 'report-territory', label: 'Territory Performance', icon: MapPin },
      { id: 'report-commission', label: 'Commission Report', icon: PieChart },
      { id: 'report-download', label: 'Download CSV / PDF', icon: Download },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { id: 'settings-profile', label: 'Profile Settings', icon: User },
      { id: 'settings-notifications', label: 'Notification Preferences', icon: Bell },
      { id: 'settings-security', label: 'Password / Security', icon: Shield },
      { id: 'settings-logout', label: 'Logout', icon: LogOut },
    ],
  },
];

interface ResellerManagerFullSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onBack?: () => void;
}

export function ResellerManagerFullSidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  onBack,
}: ResellerManagerFullSidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>(['dashboard', 'reseller-management']);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const handleSectionClick = (sectionId: string, label: string) => {
    onSectionChange(sectionId);
    toast.success(`Navigating to ${label}`, { duration: 1500 });
  };

  const handleBack = () => {
    onBack?.();
  };

  const isActive = (id: string) => activeSection === id;
  const isParentActive = (item: MenuItem) =>
    item.children?.some(child => activeSection === child.id);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 280 }}
      className="h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col"
    >
      {/* Back Button */}
      {!collapsed && (
        <div className="p-2 border-b border-slate-700/50">
          <motion.button
            onClick={handleBack}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Boss</span>
          </motion.button>
        </div>
      )}

      {/* Header */}
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">Reseller Manager</p>
              <p className="text-[10px] text-slate-400">Global Team Management</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-slate-400 hover:text-white flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {sidebarMenu.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus.includes(item.id);
            const parentActive = isParentActive(item);

            if (collapsed) {
              return (
                <Tooltip key={item.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => hasChildren ? toggleMenu(item.id) : handleSectionClick(item.id, item.label)}
                      className={cn(
                        "w-full justify-center px-2 h-10 relative",
                        parentActive || isActive(item.id)
                          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Collapsible
                key={item.id}
                open={isOpen}
                onOpenChange={() => hasChildren && toggleMenu(item.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 h-9 px-3 relative",
                      parentActive || isActive(item.id)
                        ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    )}
                    onClick={() => !hasChildren && handleSectionClick(item.id, item.label)}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-sm flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0">
                        {item.badge}
                      </Badge>
                    )}
                    {hasChildren && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform flex-shrink-0",
                        isOpen && "rotate-180"
                      )} />
                    )}
                  </Button>
                </CollapsibleTrigger>

                {hasChildren && (
                  <CollapsibleContent>
                    <div className="ml-4 pl-2 border-l border-slate-700/50 space-y-0.5 mt-1">
                      {item.children!.map((child) => (
                        <Button
                          key={child.id}
                          variant="ghost"
                          onClick={() => handleSectionClick(child.id, child.label)}
                          className={cn(
                            "w-full justify-start gap-2 h-8 px-2 text-xs",
                            isActive(child.id)
                              ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                              : "text-slate-500 hover:text-white hover:bg-slate-800/50"
                          )}
                        >
                          <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate flex-1 text-left">{child.label}</span>
                          {child.badge && (
                            <Badge className="ml-auto bg-red-500/20 text-red-400 text-[9px] px-1 py-0">
                              {child.badge}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 text-center">
            Reseller Manager Control Panel
          </p>
        </div>
      )}
    </motion.aside>
  );
}

export default ResellerManagerFullSidebar;
