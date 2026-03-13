/**
 * RESELLER SIDEBAR - WHMCS CLIENT AREA CLONE
 * White sidebar with blue accents, grouped navigation
 */
import React, { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, ShoppingBag, Package, ShoppingCart,
  Percent, Banknote, Users, HeadphonesIcon, BarChart3, Settings,
  ChevronDown, ChevronRight, Bell, LogOut, Activity, FileText,
  DollarSign, Briefcase, Star, Clock, AlertCircle, Target,
  PieChart, Calendar, CreditCard, Globe, Wallet
} from 'lucide-react';

export type ResellerView =
  // Dashboard
  | 'dash_overview' | 'dash_kpis' | 'dash_alerts' | 'dash_activity'
  // Sales
  | 'sales_overview' | 'sales_pipeline' | 'sales_growth' | 'sales_targets'
  // Products
  | 'prod_catalog' | 'prod_pricing' | 'prod_licenses' | 'prod_demos'
  // Orders
  | 'ord_all' | 'ord_pending' | 'ord_completed' | 'ord_cancelled'
  // Commissions
  | 'comm_overview' | 'comm_earned' | 'comm_pending' | 'comm_history'
  // Payouts
  | 'pay_balance' | 'pay_request' | 'pay_history' | 'pay_settings'
  // Clients
  | 'cli_all' | 'cli_active' | 'cli_leads' | 'cli_segments'
  // Support
  | 'sup_tickets' | 'sup_knowledge' | 'sup_escalations'
  // Reports
  | 'rpt_sales' | 'rpt_commission' | 'rpt_performance' | 'rpt_financial'
  // Settings
  | 'set_profile' | 'set_notifications' | 'set_security' | 'set_api';

interface SidebarGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: { id: ResellerView; label: string; icon: React.ElementType; badge?: number }[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard,
    items: [
      { id: 'dash_overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'dash_kpis', label: 'KPI Cards', icon: Activity },
      { id: 'dash_alerts', label: 'Alerts', icon: Bell, badge: 3 },
      { id: 'dash_activity', label: 'Recent Activity', icon: Clock },
    ]
  },
  {
    id: 'sales', label: 'Sales', icon: TrendingUp,
    items: [
      { id: 'sales_overview', label: 'Sales Overview', icon: TrendingUp },
      { id: 'sales_pipeline', label: 'Pipeline', icon: Target },
      { id: 'sales_growth', label: 'Growth Analytics', icon: BarChart3 },
      { id: 'sales_targets', label: 'Monthly Targets', icon: Star },
    ]
  },
  {
    id: 'products', label: 'Products', icon: Package,
    items: [
      { id: 'prod_catalog', label: 'Product Catalog', icon: Package },
      { id: 'prod_pricing', label: 'Pricing & Plans', icon: DollarSign },
      { id: 'prod_licenses', label: 'Licenses', icon: FileText },
      { id: 'prod_demos', label: 'Demo Access', icon: Globe },
    ]
  },
  {
    id: 'orders', label: 'Orders', icon: ShoppingCart,
    items: [
      { id: 'ord_all', label: 'All Orders', icon: ShoppingCart },
      { id: 'ord_pending', label: 'Pending', icon: Clock, badge: 5 },
      { id: 'ord_completed', label: 'Completed', icon: ShoppingBag },
      { id: 'ord_cancelled', label: 'Cancelled', icon: AlertCircle },
    ]
  },
  {
    id: 'commissions', label: 'Commissions', icon: Percent,
    items: [
      { id: 'comm_overview', label: 'Commission Overview', icon: Percent },
      { id: 'comm_earned', label: 'Earned', icon: DollarSign },
      { id: 'comm_pending', label: 'Pending', icon: Clock },
      { id: 'comm_history', label: 'History', icon: Calendar },
    ]
  },
  {
    id: 'payouts', label: 'Payouts', icon: Banknote,
    items: [
      { id: 'pay_balance', label: 'Wallet Balance', icon: Wallet },
      { id: 'pay_request', label: 'Request Payout', icon: Banknote },
      { id: 'pay_history', label: 'Payout History', icon: FileText },
      { id: 'pay_settings', label: 'Payout Settings', icon: CreditCard },
    ]
  },
  {
    id: 'clients', label: 'Clients', icon: Users,
    items: [
      { id: 'cli_all', label: 'All Clients', icon: Users },
      { id: 'cli_active', label: 'Active Clients', icon: Briefcase },
      { id: 'cli_leads', label: 'Leads', icon: Target },
      { id: 'cli_segments', label: 'Segments', icon: PieChart },
    ]
  },
  {
    id: 'support', label: 'Support', icon: HeadphonesIcon,
    items: [
      { id: 'sup_tickets', label: 'Support Tickets', icon: HeadphonesIcon, badge: 2 },
      { id: 'sup_knowledge', label: 'Knowledge Base', icon: FileText },
      { id: 'sup_escalations', label: 'Escalations', icon: AlertCircle },
    ]
  },
  {
    id: 'reports', label: 'Reports', icon: BarChart3,
    items: [
      { id: 'rpt_sales', label: 'Sales Reports', icon: TrendingUp },
      { id: 'rpt_commission', label: 'Commission Reports', icon: Percent },
      { id: 'rpt_performance', label: 'Performance', icon: Activity },
      { id: 'rpt_financial', label: 'Financial Summary', icon: PieChart },
    ]
  },
  {
    id: 'settings', label: 'Settings', icon: Settings,
    items: [
      { id: 'set_profile', label: 'Profile', icon: Users },
      { id: 'set_notifications', label: 'Notifications', icon: Bell },
      { id: 'set_security', label: 'Security', icon: Settings },
      { id: 'set_api', label: 'API Access', icon: Globe },
    ]
  },
];

interface Props {
  activeView: ResellerView;
  onViewChange: (view: ResellerView) => void;
  onLogout?: () => void;
}

export default function ResellerWHMCSSidebar({ activeView, onViewChange, onLogout }: Props) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    const active = sidebarGroups.find(g => g.items.some(i => i.id === activeView));
    return active ? [active.id] : ['dashboard'];
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col h-full border-r overflow-hidden" style={{ background: '#ffffff', borderColor: '#e3e6f0' }}>
      {/* Logo / Brand */}
      <div className="h-[50px] flex items-center px-5 border-b" style={{ borderColor: '#e3e6f0' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4e73df' }}>
            <span className="text-white font-bold text-sm">SV</span>
          </div>
          <div>
            <div className="text-[13px] font-bold" style={{ color: '#1a1f36' }}>Reseller Portal</div>
            <div className="text-[10px]" style={{ color: '#858796' }}>WHMCS Client Area</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3" style={{ scrollbarWidth: 'thin' }}>
        {sidebarGroups.map(group => {
          const isExpanded = expandedGroups.includes(group.id);
          const hasActive = group.items.some(i => i.id === activeView);
          const Icon = group.icon;

          return (
            <div key={group.id} className="mb-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-semibold uppercase tracking-wider transition-colors"
                style={{
                  color: hasActive ? '#4e73df' : '#858796',
                  background: hasActive ? 'rgba(78,115,223,0.06)' : 'transparent',
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                {isExpanded
                  ? <ChevronDown className="w-3.5 h-3.5" />
                  : <ChevronRight className="w-3.5 h-3.5" />
                }
              </button>

              {isExpanded && (
                <div className="ml-4 pl-3 border-l mt-0.5 mb-2" style={{ borderColor: '#e3e6f0' }}>
                  {group.items.map(item => {
                    const isActive = item.id === activeView;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className="w-full flex items-center gap-2 px-2.5 py-[6px] rounded text-[12.5px] transition-all"
                        style={{
                          color: isActive ? '#4e73df' : '#5a5c69',
                          background: isActive ? 'rgba(78,115,223,0.08)' : 'transparent',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        <ItemIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                            style={{ background: item.badge > 3 ? '#e74a3b' : '#f6c23e', color: item.badge > 3 ? '#fff' : '#1a1f36' }}
                          >
                            {item.badge}
                          </span>
                        )}
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
      <div className="border-t px-3 py-3" style={{ borderColor: '#e3e6f0' }}>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-[12px] transition-colors"
            style={{ color: '#e74a3b' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
        <div className="mt-2 px-3">
          <div className="text-[10px]" style={{ color: '#b7b9cc' }}>Software Vala © 2026</div>
        </div>
      </div>
    </aside>
  );
}
