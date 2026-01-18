/**
 * VALA AI MODULE SIDEBAR
 * Sidebar for VALA AI Management
 * 8 items with Back to Boss button
 * SINGLE SIDEBAR ENFORCEMENT: Uses sidebar store
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Brain,
  ListTodo,
  Cpu,
  AlertTriangle,
  BarChart3,
  Wallet,
  Webhook,
  Cog,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';

export type ValaAISection = 
  | 'overview' 
  | 'ai-requests' 
  | 'ai-tasks' 
  | 'ai-models' 
  | 'ai-alerts' 
  | 'ai-usage' 
  | 'ai-credits' 
  | 'ai-api' 
  | 'ai-automation';

interface ValaAISidebarProps {
  activeSection: ValaAISection;
  onSectionChange: (section: ValaAISection) => void;
  onBack?: () => void;
}

const sidebarItems: { id: ValaAISection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'ai-requests', label: 'AI Requests', icon: Brain },
  { id: 'ai-tasks', label: 'AI Tasks Running', icon: ListTodo },
  { id: 'ai-models', label: 'AI Models Active', icon: Cpu },
  { id: 'ai-alerts', label: 'AI Alerts', icon: AlertTriangle },
  { id: 'ai-usage', label: 'AI Usage Today', icon: BarChart3 },
  { id: 'ai-credits', label: 'AI Credits Balance', icon: Wallet },
  { id: 'ai-api', label: 'AI API Calls', icon: Webhook },
  { id: 'ai-automation', label: 'AI Automation Jobs', icon: Cog },
];

export const ValaAISidebar: React.FC<ValaAISidebarProps> = ({
  activeSection,
  onSectionChange,
  onBack,
}) => {
  // SINGLE SIDEBAR ENFORCEMENT: Use store for navigation
  const { exitToGlobal, activeSidebar, activeCategorySidebar } = useSidebarStore();
  
  // Handle back navigation - updates store AND calls prop callback
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };
  
  // Only render if this is the active category sidebar
  const isActive = activeSidebar === 'category' && activeCategorySidebar === 'vala-ai';
  const shouldRender = isActive || activeSidebar === 'global';
  
  if (!shouldRender && activeSidebar === 'category' && activeCategorySidebar !== 'vala-ai') {
    return null;
  }
  
  return (
    <div className="w-56 bg-card/50 border-r border-border/50 h-full flex flex-col">
      {/* Back Button */}
      <div className="p-2 border-b border-border/50">
        <motion.button
          onClick={handleBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Boss</span>
        </motion.button>
      </div>
      
      <div className="p-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          VALA AI
        </h2>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isItemActive = activeSection === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                isItemActive 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {isItemActive && (
                <motion.div
                  layoutId="vala-ai-active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
