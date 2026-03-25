/**
 * INTERNAL CHAT BOT - FULL SIDEBAR
 * Secure Assist Chat - Internal Team Only
 * NO DELETE • NO EDIT • NO COPY • NO SHARE
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  PlusCircle,
  FileQuestion,
  Clock,
  CheckCircle,
  MessageCircle,
  AlertTriangle,
  Bot,
  ArrowUpCircle,
  XCircle,
  ShieldOff,
  BookOpen,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export type ICBScreen =
  | 'chat_dashboard'
  | 'new_inquiry'
  | 'my_inquiries'
  | 'pending_approval'
  | 'approved_chats'
  | 'active_chats'
  | 'urgent_requests'
  | 'ai_first_response'
  | 'escalated_chats'
  | 'closed_chats'
  | 'blocked_users'
  | 'chat_rules'
  | 'audit_logs'
  | 'settings';

interface SidebarItem {
  id: ICBScreen;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'chat_dashboard', label: 'Chat Dashboard', icon: MessageSquare },
  { id: 'new_inquiry', label: 'New Inquiry', icon: PlusCircle },
  { id: 'my_inquiries', label: 'My Inquiries', icon: FileQuestion },
  { id: 'pending_approval', label: 'Pending Approval', icon: Clock, badge: 5 },
  { id: 'approved_chats', label: 'Approved Chats', icon: CheckCircle },
  { id: 'active_chats', label: 'Active Chats', icon: MessageCircle, badge: 3 },
  { id: 'urgent_requests', label: 'Urgent Requests', icon: AlertTriangle, badge: 2 },
  { id: 'ai_first_response', label: 'AI First Response', icon: Bot },
  { id: 'escalated_chats', label: 'Escalated Chats', icon: ArrowUpCircle },
  { id: 'closed_chats', label: 'Closed Chats', icon: XCircle },
  { id: 'blocked_users', label: 'Blocked Users', icon: ShieldOff },
  { id: 'chat_rules', label: 'Chat Rules', icon: BookOpen },
  { id: 'audit_logs', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface ICBFullSidebarProps {
  activeScreen: ICBScreen;
  onScreenChange: (screen: ICBScreen) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ICBFullSidebar: React.FC<ICBFullSidebarProps> = ({
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
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Internal Chat Bot</span>
          </div>
        )}
        {collapsed && <MessageSquare className="h-5 w-5 text-primary mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
            SECURE • INTERNAL ONLY
          </div>
        )}
      </div>
    </div>
  );
};

export default ICBFullSidebar;
