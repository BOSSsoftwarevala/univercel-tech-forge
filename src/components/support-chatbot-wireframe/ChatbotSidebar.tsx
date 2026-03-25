/**
 * CHATBOT SIDEBAR
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Bot, MessageSquare, BookOpen, Zap,
  Globe, BarChart3, ScrollText, Settings, ChevronLeft,
  ChevronRight, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ChatbotScreen } from './SupportChatbotWireframe';

interface ChatbotSidebarProps {
  activeScreen: ChatbotScreen;
  onScreenChange: (screen: ChatbotScreen) => void;
  collapsed: boolean;
  onToggle: () => void;
  onBack?: () => void;
}

const navItems: { id: ChatbotScreen; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chatbots', label: 'Chatbots', icon: Bot },
  { id: 'live-chats', label: 'Live Chats', icon: MessageSquare },
  { id: 'training', label: 'Training', icon: BookOpen },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'languages', label: 'Languages', icon: Globe },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'logs', label: 'Logs', icon: ScrollText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const ChatbotSidebar: React.FC<ChatbotSidebarProps> = ({
  activeScreen,
  onScreenChange,
  collapsed,
  onToggle,
  onBack,
}) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-40"
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="font-semibold text-sm">Support Bot</span>
          </motion.div>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 shrink-0">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Back Button */}
      {onBack && (
        <div className="p-2 border-b border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onBack}
                className={cn(
                  "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="text-sm">Back</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Back</TooltipContent>}
          </Tooltip>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onScreenChange(item.id)}
                  whileHover={{ x: collapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-emerald-600")} />
                  {!collapsed && <span>{item.label}</span>}
                </motion.button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        {!collapsed ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>3 Bots Active</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </motion.aside>
  );
};
