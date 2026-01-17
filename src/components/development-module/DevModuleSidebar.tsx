/**
 * DEVELOPMENT MODULE SIDEBAR
 * Strict sidebar for Development Management
 * 10 items only as per specification
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Rocket, 
  Code, 
  Factory, 
  Bug, 
  TestTube, 
  CloudUpload, 
  GitBranch, 
  FileText, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type DevSection = 
  | 'overview' 
  | 'start-build' 
  | 'active-builds' 
  | 'demo-factory' 
  | 'bug-fix' 
  | 'testing' 
  | 'deployment' 
  | 'versions' 
  | 'logs' 
  | 'settings';

interface DevModuleSidebarProps {
  activeSection: DevSection;
  onSectionChange: (section: DevSection) => void;
}

const sidebarItems: { id: DevSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'start-build', label: 'Start New Build', icon: Rocket },
  { id: 'active-builds', label: 'Active Builds', icon: Code },
  { id: 'demo-factory', label: 'Demo Factory', icon: Factory },
  { id: 'bug-fix', label: 'Bug Fix Center', icon: Bug },
  { id: 'testing', label: 'Testing', icon: TestTube },
  { id: 'deployment', label: 'Deployment', icon: CloudUpload },
  { id: 'versions', label: 'Versions', icon: GitBranch },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const DevModuleSidebar: React.FC<DevModuleSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-56 bg-card/50 border-r border-border/50 h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          Development
        </h2>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="dev-active-indicator"
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
