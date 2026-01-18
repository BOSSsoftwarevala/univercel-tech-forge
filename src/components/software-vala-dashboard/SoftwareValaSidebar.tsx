/**
 * SOFTWARE VALA SIDEBAR
 * Collapsible navigation with enterprise styling
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Brain,
  Languages,
  Globe2,
  Smartphone,
  Code2,
  CreditCard,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type DashboardSection = 
  | 'dashboard'
  | 'ai-models'
  | 'prompt-studio'
  | 'support-bot'
  | 'product-demo'
  | 'role-permissions'
  | 'languages'
  | 'countries'
  | 'android-apk'
  | 'api-sdk'
  | 'usage-billing'
  | 'logs'
  | 'settings';

interface SidebarItem {
  id: DashboardSection;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ai-models', label: 'AI Models', icon: Brain },
  { id: 'prompt-studio', label: 'Prompt Studio', icon: Sparkles, badge: 'New' },
  { id: 'support-bot', label: 'Support Bot', icon: Languages },
  { id: 'product-demo', label: 'Product Demo', icon: Globe2 },
  { id: 'role-permissions', label: 'Role Permissions', icon: Settings },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'countries', label: 'Countries', icon: Globe2 },
  { id: 'android-apk', label: 'Android APK', icon: Smartphone },
  { id: 'api-sdk', label: 'API & SDK', icon: Code2 },
  { id: 'usage-billing', label: 'Usage & Billing', icon: CreditCard },
  { id: 'logs', label: 'Logs', icon: ScrollText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SoftwareValaSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const SoftwareValaSidebar: React.FC<SoftwareValaSidebarProps> = ({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center border-b border-slate-200 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-800">Software Vala</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            
            const button = (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-blue-600")} />
                {!collapsed && (
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-600 rounded">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 text-white">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700",
              !collapsed && "justify-start px-3"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};
