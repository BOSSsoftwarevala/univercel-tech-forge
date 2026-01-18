/**
 * ASSIST MANAGER FULL SIDEBAR
 * VALA CONNECT - UltraViewer Style Remote Assist
 * Style: Reseller/Product Manager
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  MonitorPlay,
  PlusCircle,
  Inbox,
  Clock,
  Radio,
  Monitor,
  FileUp,
  MessageSquare,
  Shield,
  Laptop,
  FileText,
  Brain,
  AlertOctagon,
  Settings,
} from 'lucide-react';

export type AMSection =
  | 'assist_dashboard'
  | 'active_sessions'
  | 'create_assist'
  | 'session_requests'
  | 'pending_approval'
  | 'live_assist'
  | 'screen_control'
  | 'file_transfer'
  | 'chat_voice'
  | 'privacy_controls'
  | 'device_access'
  | 'session_logs'
  | 'ai_assist_layer'
  | 'emergency_stop'
  | 'settings';

interface AMFullSidebarProps {
  activeSection: AMSection;
  onSectionChange: (section: AMSection) => void;
}

const SIDEBAR_ITEMS: { id: AMSection; label: string; icon: React.ElementType }[] = [
  { id: 'assist_dashboard', label: 'Assist Dashboard', icon: LayoutDashboard },
  { id: 'active_sessions', label: 'Active Sessions', icon: MonitorPlay },
  { id: 'create_assist', label: 'Create New Assist', icon: PlusCircle },
  { id: 'session_requests', label: 'Session Requests', icon: Inbox },
  { id: 'pending_approval', label: 'Pending Approval', icon: Clock },
  { id: 'live_assist', label: 'Live Assist', icon: Radio },
  { id: 'screen_control', label: 'Screen Control', icon: Monitor },
  { id: 'file_transfer', label: 'File Transfer', icon: FileUp },
  { id: 'chat_voice', label: 'Chat & Voice', icon: MessageSquare },
  { id: 'privacy_controls', label: 'Privacy Controls', icon: Shield },
  { id: 'device_access', label: 'Device Access', icon: Laptop },
  { id: 'session_logs', label: 'Session Logs', icon: FileText },
  { id: 'ai_assist_layer', label: 'AI Assist Layer', icon: Brain },
  { id: 'emergency_stop', label: 'Emergency Stop', icon: AlertOctagon },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AMFullSidebar({ activeSection, onSectionChange }: AMFullSidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MonitorPlay className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Assist Manager</h2>
            <p className="text-xs text-muted-foreground">VALA Connect</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isEmergency = item.id === 'emergency_stop';

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isEmergency
                    ? 'text-destructive hover:bg-destructive/10'
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
          <span className="text-muted-foreground">System Secure</span>
        </div>
      </div>
    </aside>
  );
}

export default AMFullSidebar;
