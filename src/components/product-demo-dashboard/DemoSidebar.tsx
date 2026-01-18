/**
 * DEMO SIDEBAR
 * Collapsible navigation for Product Demo Manager
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Play,
  Calendar,
  FileVideo,
  Users,
  Smartphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Presentation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type DemoSection = 
  | 'overview' 
  | 'demos' 
  | 'calendar' 
  | 'content' 
  | 'leads' 
  | 'integration' 
  | 'analytics' 
  | 'settings';

interface DemoSidebarProps {
  activeSection: DemoSection;
  onSectionChange: (section: DemoSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems: { id: DemoSection; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Dashboard summary' },
  { id: 'demos', label: 'Demo Manager', icon: Play, description: 'Manage product demos' },
  { id: 'calendar', label: 'Scheduling', icon: Calendar, description: 'Calendar & bookings' },
  { id: 'content', label: 'Demo Content', icon: FileVideo, description: 'Create & edit demos' },
  { id: 'leads', label: 'Leads', icon: Users, description: 'Attendee management' },
  { id: 'integration', label: 'Integration', icon: Smartphone, description: 'APK & Web embed' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Reports & feedback' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Configuration' },
];

export const DemoSidebar: React.FC<DemoSidebarProps> = ({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-sm',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Presentation className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-800">Demo Manager</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-slate-500 hover:text-slate-700"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            const button = (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-blue-600')} />
                {!collapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-slate-400">{item.description}</span>
                  </div>
                )}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-100">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3">
              <p className="text-xs text-slate-600 font-medium">Demo Manager v2.0</p>
              <p className="text-xs text-slate-400">Powered by Software Vala</p>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
};
