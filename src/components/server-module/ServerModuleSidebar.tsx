/**
 * SERVER MODULE SIDEBAR
 * Ultra-simple sidebar with exactly 9 items as specified
 * Includes Back to Boss button for navigation
 * SINGLE SIDEBAR ENFORCEMENT: Uses sidebar store
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Plus, Server, Activity, Shield, 
  Database, FileText, Brain, Settings, ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';

export type ServerModuleSection = 
  | 'overview'
  | 'add-server'
  | 'active-servers'
  | 'health-load'
  | 'security'
  | 'backups'
  | 'logs'
  | 'ai-actions'
  | 'settings';

interface ServerModuleSidebarProps {
  activeSection: ServerModuleSection;
  onSectionChange: (section: ServerModuleSection) => void;
  onBack?: () => void;
}

const sidebarItems: { id: ServerModuleSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'add-server', label: 'Add Server', icon: Plus },
  { id: 'active-servers', label: 'Active Servers', icon: Server },
  { id: 'health-load', label: 'Health & Load', icon: Activity },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'backups', label: 'Backups', icon: Database },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'ai-actions', label: 'AI Actions', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const ServerModuleSidebar: React.FC<ServerModuleSidebarProps> = ({
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
  const isThisModuleActive = activeSidebar === 'category' && activeCategorySidebar === 'server-manager';
  
  // When in module view, the global sidebar is hidden and we should render
  // When NOT in module view, don't render the module sidebar at all
  if (!isThisModuleActive) {
    return null;
  }
  
  return (
    <div className="w-56 bg-card/50 border-r border-border/50 flex flex-col">
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
      
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Server className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Servers</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* AI Status Footer */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400">AI Active</span>
        </div>
      </div>
    </div>
  );
};

export default ServerModuleSidebar;
