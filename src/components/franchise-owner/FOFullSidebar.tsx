/**
 * FRANCHISE OWNER FULL SIDEBAR
 * 12 Sections - Enterprise Operations Panel
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Package,
  Wallet,
  Users,
  Search,
  Headphones,
  ShieldCheck,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react';

export type FOSection =
  | 'franchise_home'
  | 'marketplace'
  | 'place_order'
  | 'orders_delivery'
  | 'invoices_wallet'
  | 'leads_customers'
  | 'seo_marketing'
  | 'support_issues'
  | 'promises_sla'
  | 'performance_reports'
  | 'agreement_legal'
  | 'settings';

interface FOFullSidebarProps {
  activeSection: FOSection;
  onSectionChange: (section: FOSection) => void;
}

const SIDEBAR_ITEMS: { id: FOSection; label: string; icon: React.ElementType }[] = [
  { id: 'franchise_home', label: 'Franchise Home', icon: LayoutDashboard },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'place_order', label: 'Place Order', icon: ShoppingCart },
  { id: 'orders_delivery', label: 'Orders & Delivery', icon: Package },
  { id: 'invoices_wallet', label: 'Invoices & Wallet', icon: Wallet },
  { id: 'leads_customers', label: 'Leads & Customers', icon: Users },
  { id: 'seo_marketing', label: 'SEO & Marketing', icon: Search },
  { id: 'support_issues', label: 'Support & Issues', icon: Headphones },
  { id: 'promises_sla', label: 'Promises & SLA', icon: ShieldCheck },
  { id: 'performance_reports', label: 'Performance & Reports', icon: BarChart3 },
  { id: 'agreement_legal', label: 'Agreement & Legal', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function FOFullSidebar({ activeSection, onSectionChange }: FOFullSidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Franchise Owner</h2>
            <p className="text-xs text-muted-foreground">Enterprise Operations</p>
          </div>
        </div>
      </div>

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
