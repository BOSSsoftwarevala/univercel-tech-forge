/**
 * TASK MANAGER - FULL SIDEBAR
 * Enterprise Operation Control - Internal Only
 * NO DELETE • NO EDIT • NO COPY • NO SHARE
 */

import React from 'react';
import { cn } from '@/lib/utils';
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';
import {
  LayoutDashboard,
  Inbox,
  PlusCircle,
  Bot,
  UserCheck,
  Play,
  GitBranch,
  CheckCircle,
  ClipboardCheck,
  Clock,
  ArrowUpCircle,
  Zap,
  History,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export type TMScreen =
  | 'task_dashboard'
  | 'task_inbox'
  | 'task_creation'
  | 'ai_task_generator'
  | 'task_assignment'
  | 'task_execution'
  | 'task_dependency'
  | 'task_approval'
  | 'task_review'
  | 'task_sla_tracker'
  | 'task_escalation'
  | 'task_automation'
  | 'task_history'
  | 'task_analytics'
  | 'task_audit_log'
  | 'task_settings';

interface SidebarItem {
  id: TMScreen;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'task_dashboard', label: 'Task Dashboard', icon: LayoutDashboard },
  { id: 'task_inbox', label: 'Task Inbox', icon: Inbox, badge: 12 },
  { id: 'task_creation', label: 'Task Creation', icon: PlusCircle },
  { id: 'ai_task_generator', label: 'AI Task Generator', icon: Bot },
  { id: 'task_assignment', label: 'Task Assignment', icon: UserCheck },
  { id: 'task_execution', label: 'Task Execution', icon: Play, badge: 5 },
  { id: 'task_dependency', label: 'Task Dependency', icon: GitBranch },
  { id: 'task_approval', label: 'Task Approval', icon: CheckCircle, badge: 8 },
  { id: 'task_review', label: 'Task Review', icon: ClipboardCheck },
  { id: 'task_sla_tracker', label: 'Task SLA Tracker', icon: Clock, badge: 3 },
  { id: 'task_escalation', label: 'Task Escalation', icon: ArrowUpCircle, badge: 2 },
  { id: 'task_automation', label: 'Task Automation', icon: Zap },
  { id: 'task_history', label: 'Task History', icon: History },
  { id: 'task_analytics', label: 'Task Analytics', icon: BarChart3 },
  { id: 'task_audit_log', label: 'Task Audit Log', icon: FileText },
  { id: 'task_settings', label: 'Task Settings', icon: Settings },
];

interface TMFullSidebarProps {
  activeScreen: TMScreen;
  onScreenChange: (screen: TMScreen) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TMFullSidebar: React.FC<TMFullSidebarProps> = ({
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
        <div className={cn("flex justify-center", collapsed ? "w-full" : "flex-1")}>
          <img src={softwareValaLogo} alt="Software Vala Logo" className="w-10 h-10 rounded-full object-contain border-2 border-cyan-500/30" />
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onToggleCollapse}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 absolute right-1"
            onClick={onToggleCollapse}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
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
            ENTERPRISE • AI-FIRST • ZERO-MISS
          </div>
        )}
      </div>
    </div>
  );
};

export default TMFullSidebar;
