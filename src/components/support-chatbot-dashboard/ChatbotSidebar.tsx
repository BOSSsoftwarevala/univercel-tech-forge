/**
 * CHATBOT SIDEBAR
 * Clean, collapsible navigation
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bot,
  MessageCircle,
  GraduationCap,
  Zap,
  Languages,
  Smartphone,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type ChatbotSection = 
  | 'overview'
  | 'chatbots'
  | 'live-chat'
  | 'training'
  | 'automation'
  | 'languages'
  | 'android'
  | 'analytics';

interface SidebarItem {
  id: ChatbotSection;
  label: string;
  icon: React.ElementType;
  description: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Dashboard summary' },
  { id: 'chatbots', label: 'My Chatbots', icon: Bot, description: 'Manage your bots' },
  { id: 'live-chat', label: 'Live Chat', icon: MessageCircle, description: 'Real-time conversations' },
  { id: 'training', label: 'Train Bot', icon: GraduationCap, description: 'Teach your bot' },
  { id: 'automation', label: 'Automation', icon: Zap, description: 'Rules & triggers' },
  { id: 'languages', label: 'Languages', icon: Languages, description: 'Multi-language setup' },
  { id: 'android', label: 'Android App', icon: Smartphone, description: 'Mobile integration' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Reports & logs' },
];

interface ChatbotSidebarProps {
  activeSection: ChatbotSection;
  onSectionChange: (section: ChatbotSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const ChatbotSidebar: React.FC<ChatbotSidebarProps> = ({
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
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center border-b border-slate-200 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 text-sm">Support Chat</span>
                <p className="text-[10px] text-slate-500">by Software Vala</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
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
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-blue-600")} />
                {!collapsed && (
                  <div className="text-left">
                    <span className="font-medium block">{item.label}</span>
                    <span className={cn(
                      "text-[10px] block",
                      isActive ? "text-blue-500" : "text-slate-400"
                    )}>
                      {item.description}
                    </span>
                  </div>
                )}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 text-white">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-slate-300">{item.description}</p>
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
