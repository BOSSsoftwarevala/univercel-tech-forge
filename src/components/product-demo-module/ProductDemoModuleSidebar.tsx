/**
 * PRODUCT & DEMO MODULE SIDEBAR
 * 11-item sidebar as per Step 8 spec
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, Factory, FolderTree, Puzzle,
  DollarSign, GitBranch, Bug, Shield, BarChart3, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export type ProductDemoSection = 
  | 'dashboard'
  | 'products'
  | 'demo-factory'
  | 'categories'
  | 'features'
  | 'pricing'
  | 'versions'
  | 'issues'
  | 'approvals'
  | 'reports'
  | 'settings';

interface ProductDemoModuleSidebarProps {
  activeSection: ProductDemoSection;
  onSectionChange: (section: ProductDemoSection) => void;
}

const menuItems: { id: ProductDemoSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'demo-factory', label: 'Demo Factory', icon: Factory },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'features', label: 'Features Library', icon: Puzzle },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'versions', label: 'Versions', icon: GitBranch },
  { id: 'issues', label: 'Issues', icon: Bug },
  { id: 'approvals', label: 'Approvals', icon: Shield },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const ProductDemoModuleSidebar: React.FC<ProductDemoModuleSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-56 bg-card/50 border-r border-border/50 flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Product & Demo</h2>
            <p className="text-[10px] text-muted-foreground">AI-Driven Manager</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 py-2">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                  isActive 
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-violet-400" : "text-muted-foreground")} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Active</span>
        </div>
      </div>
    </div>
  );
};
