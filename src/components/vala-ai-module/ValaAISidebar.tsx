/**
 * VALA AI SIDEBAR
 * Single Workspace - AI Command Center
 * RENAMED FROM: Development Manager
 * SINGLE SIDEBAR ENFORCEMENT: Uses sidebar store
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home,
  Plus,
  PlayCircle,
  Monitor,
  Inbox,
  Wrench,
  Rocket,
  GitBranch,
  FileText,
  Settings,
  ArrowLeft,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';

export type ValaAISection = 
  | 'home' 
  | 'new-project' 
  | 'live-builds' 
  | 'active-demos' 
  | 'issue-inbox' 
  | 'auto-fix-queue' 
  | 'deployment' 
  | 'versions'
  | 'logs'
  | 'settings';

interface ValaAISidebarProps {
  activeSection: ValaAISection;
  onSectionChange: (section: ValaAISection) => void;
  onBack?: () => void;
}

const sidebarItems: { id: ValaAISection; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'new-project', label: 'New Project', icon: Plus },
  { id: 'live-builds', label: 'Live Builds', icon: PlayCircle },
  { id: 'active-demos', label: 'Active Demos', icon: Monitor },
  { id: 'issue-inbox', label: 'Issue Inbox', icon: Inbox },
  { id: 'auto-fix-queue', label: 'Auto Fix Queue', icon: Wrench },
  { id: 'deployment', label: 'Deployment', icon: Rocket },
  { id: 'versions', label: 'Versions', icon: GitBranch },
  { id: 'logs', label: 'Logs', icon: FileText, badge: 'Read-only' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: 'Limited' },
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
  
  // SINGLE SIDEBAR ENFORCEMENT: Only render when this module is active
  // No fallback - strict isolation to prevent double sidebar
  const isThisModuleActive = activeSidebar === 'category' && activeCategorySidebar === 'vala-ai';
  
  if (!isThisModuleActive) {
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
        <p className="text-xs text-muted-foreground mt-1">AI Command Center</p>
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
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {item.badge}
                </span>
              )}
              {isItemActive && (
                <motion.div
                  layoutId="vala-ai-active-indicator"
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
