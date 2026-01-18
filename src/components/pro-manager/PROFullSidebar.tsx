/**
 * PRO MANAGER - FULL SIDEBAR
 * Post-Sale Premium User Control
 * NO DELETE • NO EDIT • NO COPY • NO SHARE
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Package,
  Key,
  HeadphonesIcon,
  Bug,
  Handshake,
  Timer,
  ArrowUpCircle,
  CalendarClock,
  Gauge,
  Bot,
  MessageSquare,
  AlertTriangle,
  Star,
  Shield,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export type PROScreen =
  | 'pro_dashboard'
  | 'pro_user_registry'
  | 'product_ownership'
  | 'license_domain'
  | 'support_requests'
  | 'issue_bug_tracker'
  | 'premium_assist'
  | 'promise_sla_tracker'
  | 'upgrade_addons'
  | 'renewal_expiry'
  | 'usage_limits'
  | 'ai_helpdesk'
  | 'communication_log'
  | 'alerts_escalation'
  | 'satisfaction_rating'
  | 'compliance_policy'
  | 'audit_logs'
  | 'settings';

interface SidebarItem {
  id: PROScreen;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'pro_dashboard', label: 'Pro Dashboard', icon: LayoutDashboard },
  { id: 'pro_user_registry', label: 'Pro User Registry', icon: Users },
  { id: 'product_ownership', label: 'Product Ownership', icon: Package },
  { id: 'license_domain', label: 'License & Domain', icon: Key },
  { id: 'support_requests', label: 'Support Requests', icon: HeadphonesIcon, badge: 8 },
  { id: 'issue_bug_tracker', label: 'Issue & Bug Tracker', icon: Bug, badge: 5 },
  { id: 'premium_assist', label: 'Premium Assist', icon: Handshake, badge: 3 },
  { id: 'promise_sla_tracker', label: 'Promise & SLA Tracker', icon: Timer, badge: 4 },
  { id: 'upgrade_addons', label: 'Upgrade & Add-ons', icon: ArrowUpCircle },
  { id: 'renewal_expiry', label: 'Renewal & Expiry', icon: CalendarClock, badge: 12 },
  { id: 'usage_limits', label: 'Usage & Limits', icon: Gauge },
  { id: 'ai_helpdesk', label: 'AI Helpdesk', icon: Bot },
  { id: 'communication_log', label: 'Communication Log', icon: MessageSquare },
  { id: 'alerts_escalation', label: 'Alerts & Escalation', icon: AlertTriangle, badge: 2 },
  { id: 'satisfaction_rating', label: 'Satisfaction & Rating', icon: Star },
  { id: 'compliance_policy', label: 'Compliance & Policy', icon: Shield },
  { id: 'audit_logs', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface PROFullSidebarProps {
  activeScreen: PROScreen;
  onScreenChange: (screen: PROScreen) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const PROFullSidebar: React.FC<PROFullSidebarProps> = ({
  activeScreen,
  onScreenChange,
  collapsed = false,
  onToggleCollapse
}) => {
  return (
    <div className={cn(
      "h-full bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">Pro Manager</span>
          </div>
        )}
        {collapsed && <Star className="h-5 w-5 text-primary mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="h-4 w-4 text-foreground" /> : <ChevronLeft className="h-4 w-4 text-foreground" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeScreen === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                collapsed && "justify-center px-2"
              )}
              onClick={() => onScreenChange(item.id)}
            >
              <item.icon className="h-4 w-4 shrink-0 text-foreground" />
              {!collapsed && (
                <>
                  <span className="text-sm truncate text-foreground">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            PREMIUM SUPPORT • INTERNAL ONLY
          </div>
        )}
      </div>
    </div>
  );
};

export default PROFullSidebar;
