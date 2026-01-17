/**
 * PRODUCT & DEMO MODULE SIDEBAR
 * 9-item sidebar as per Step 5 spec
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, FolderTree, Monitor, Factory,
  DollarSign, Cpu, ShoppingCart, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export type ProductDemoSection = 
  | 'overview'
  | 'all-products'
  | 'categories'
  | 'demos'
  | 'demo-factory'
  | 'pricing'
  | 'technologies'
  | 'orders'
  | 'settings';

interface ProductDemoModuleSidebarProps {
  activeSection: ProductDemoSection;
  onSectionChange: (section: ProductDemoSection) => void;
}

const menuItems: { id: ProductDemoSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'all-products', label: 'All Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'demos', label: 'Demos', icon: Monitor },
  { id: 'demo-factory', label: 'Demo Factory', icon: Factory },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'technologies', label: 'Technologies', icon: Cpu },
  { id: 'orders', label: 'Orders Link', icon: ShoppingCart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const ProductDemoModuleSidebar: React.FC<ProductDemoModuleSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-56 bg-card/50 border-r border-border/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Product & Demo</h2>
            <p className="text-[10px] text-muted-foreground">Catalog Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
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
                <Icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-violet-400" : "text-muted-foreground"
                )} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Status */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Catalog Active</span>
        </div>
      </div>
    </div>
  );
};
