/**
 * FRANCHISE USER SIDEBAR
 * Simple • 9 Sections • Non-Tech Friendly
 * NOT for Control Panel - For Franchise Users Only
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  Users,
  Megaphone,
  Sparkles,
  Wallet,
  HeadphonesIcon,
  UserCircle,
} from 'lucide-react';

export type FUSection =
  | 'dashboard'
  | 'my_leads'
  | 'my_sales'
  | 'my_customers'
  | 'marketing_seo'
  | 'ads_ai'
  | 'wallet'
  | 'support'
  | 'profile_settings';

interface FUFullSidebarProps {
  activeSection: FUSection;
  onSectionChange: (section: FUSection) => void;
}

const SIDEBAR_ITEMS: { id: FUSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'my_leads', label: 'My Leads', icon: Target },
  { id: 'my_sales', label: 'My Sales', icon: TrendingUp },
  { id: 'my_customers', label: 'My Customers', icon: Users },
  { id: 'marketing_seo', label: 'Marketing & SEO', icon: Megaphone },
  { id: 'ads_ai', label: 'Ads (Auto AI)', icon: Sparkles },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'support', label: 'Support', icon: HeadphonesIcon },
  { id: 'profile_settings', label: 'Profile & Settings', icon: UserCircle },
];

export function FUFullSidebar({ activeSection, onSectionChange }: FUFullSidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">My Franchise</h2>
            <p className="text-xs text-muted-foreground">Mumbai Region</p>
          </div>
        </div>
      </div>

      {/* Navigation - Big Buttons for Easy Use */}
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Status */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground">System Active</span>
        </div>
      </div>
    </aside>
  );
}

export default FUFullSidebar;
