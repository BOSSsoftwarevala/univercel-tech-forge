/**
 * FRANCHISE OWNER FULL SIDEBAR
 * 10 Modules - Enterprise-Grade Business Control
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  ShoppingCart,
  Percent,
  FileText,
  Wallet,
  Users,
  TrendingUp,
  Globe,
  HeadphonesIcon,
  BarChart3,
} from 'lucide-react';

export type FOSection =
  | 'dashboard'
  | 'order_management'
  | 'commission'
  | 'invoices'
  | 'wallet'
  | 'crm_hrm'
  | 'team_performance'
  | 'domain_hosting'
  | 'support'
  | 'reports';

interface FOFullSidebarProps {
  activeSection: FOSection;
  onSectionChange: (section: FOSection) => void;
}

const SIDEBAR_ITEMS: { id: FOSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Master Dashboard', icon: LayoutDashboard },
  { id: 'order_management', label: 'Order Management', icon: ShoppingCart },
  { id: 'commission', label: 'Commission & Payouts', icon: Percent },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'wallet', label: 'Wallet Management', icon: Wallet },
  { id: 'crm_hrm', label: 'CRM + HRM', icon: Users },
  { id: 'team_performance', label: 'Team Performance', icon: TrendingUp },
  { id: 'domain_hosting', label: 'Domain & Hosting', icon: Globe },
  { id: 'support', label: 'Support & Escalation', icon: HeadphonesIcon },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
];

export function FOFullSidebar({ activeSection, onSectionChange }: FOFullSidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Franchise Owner</h2>
            <p className="text-xs text-muted-foreground">Enterprise Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Status */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground">System Active • Locked</span>
        </div>
      </div>
    </aside>
  );
}

export default FOFullSidebar;
