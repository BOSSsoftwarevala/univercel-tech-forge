/**
 * FRANCHISE OWNER FULL SIDEBAR
 * 12 Sections - All-in-One Business Control
 * Style: Same as Core Theme
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Target,
  Search,
  Megaphone,
  Wallet,
  TrendingUp,
  Star,
  HeadphonesIcon,
  BarChart3,
  Settings,
} from 'lucide-react';

export type FOSection =
  | 'franchise_overview'
  | 'hrm_management'
  | 'crm_management'
  | 'lead_management'
  | 'seo_marketing'
  | 'ads_manager'
  | 'wallet_billing'
  | 'sales_performance'
  | 'influencer_leads'
  | 'customer_support'
  | 'reports_analytics'
  | 'franchise_settings';

interface FOFullSidebarProps {
  activeSection: FOSection;
  onSectionChange: (section: FOSection) => void;
}

const SIDEBAR_ITEMS: { id: FOSection; label: string; icon: React.ElementType }[] = [
  { id: 'franchise_overview', label: 'Franchise Overview', icon: LayoutDashboard },
  { id: 'hrm_management', label: 'HRM Management', icon: Users },
  { id: 'crm_management', label: 'CRM Management', icon: UserCheck },
  { id: 'lead_management', label: 'Lead Management', icon: Target },
  { id: 'seo_marketing', label: 'SEO & Marketing', icon: Search },
  { id: 'ads_manager', label: 'Ads Manager (AI)', icon: Megaphone },
  { id: 'wallet_billing', label: 'Wallet & Billing', icon: Wallet },
  { id: 'sales_performance', label: 'Sales Performance', icon: TrendingUp },
  { id: 'influencer_leads', label: 'Influencer Leads', icon: Star },
  { id: 'customer_support', label: 'Customer Support', icon: HeadphonesIcon },
  { id: 'reports_analytics', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'franchise_settings', label: 'Franchise Settings', icon: Settings },
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
            <p className="text-xs text-muted-foreground">Business Control</p>
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
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
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
          <span className="text-muted-foreground">System Active</span>
        </div>
      </div>
    </aside>
  );
}

export default FOFullSidebar;
