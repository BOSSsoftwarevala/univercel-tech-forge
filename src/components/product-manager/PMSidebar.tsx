import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MonitorPlay,
  DollarSign,
  Warehouse,
  ShoppingCart,
  BarChart3,
  Activity,
  Settings,
  ChevronRight,
  ChevronDown,
  Layers,
  Grid3X3,
  Microscope,
  Atom,
  Lock,
  Shield,
} from 'lucide-react';

interface PMSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  stats?: {
    totalProducts: number;
    activeDemos: number;
    pendingOrders: number;
  };
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  children?: { id: string; label: string; icon: React.ElementType }[];
  locked?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'all-products', label: 'All Products', icon: Package },
  { 
    id: 'categories', 
    label: 'Product Categories', 
    icon: FolderTree,
    children: [
      { id: 'main-category', label: 'Main Category', icon: Layers },
      { id: 'sub-category', label: 'Sub Category', icon: Grid3X3 },
      { id: 'micro-category', label: 'Micro Category', icon: Microscope },
      { id: 'nano-category', label: 'Nano Category', icon: Atom },
    ]
  },
  { id: 'demo-management', label: 'Demo Management', icon: MonitorPlay },
  { id: 'pricing-plans', label: 'Pricing & Plans', icon: DollarSign },
  { id: 'inventory', label: 'Inventory', icon: Warehouse },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'analytics', label: 'Product Analytics', icon: BarChart3 },
  { id: 'activity', label: 'Product Activity', icon: Activity },
  { id: 'settings', label: 'Product Settings', icon: Settings },
];

const PMSidebar: React.FC<PMSidebarProps> = ({ activeSection, onSectionChange, stats }) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['categories']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isActive = (id: string) => activeSection === id;
  const isChildActive = (item: MenuItem) => 
    item.children?.some(child => activeSection === child.id);

  return (
    <div className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Product Manager</h2>
            <p className="text-xs text-muted-foreground">Enterprise Control</p>
          </div>
        </div>
      </div>

      {/* Policy Badge */}
      <div className="p-4">
        <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">FULL CRUD MODE</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Create • Edit • Delete • Audit</p>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="px-4 pb-4 grid grid-cols-3 gap-2">
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-lg font-bold text-primary">{stats.totalProducts}</p>
            <p className="text-[9px] text-muted-foreground">Products</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-lg font-bold text-green-500">{stats.activeDemos}</p>
            <p className="text-[9px] text-muted-foreground">Demos</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-lg font-bold text-amber-500">{stats.pendingOrders}</p>
            <p className="text-[9px] text-muted-foreground">Orders</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);
            const active = isActive(item.id) || isChildActive(item);

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleExpand(item.id);
                    } else {
                      onSectionChange(item.id);
                    }
                  }}
                  disabled={item.locked}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    active
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : item.locked
                      ? "text-muted-foreground/50 cursor-not-allowed"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                  {item.locked && <Lock className="w-3 h-3" />}
                  {hasChildren && (
                    isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Children */}
                {hasChildren && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 mt-1 space-y-1"
                  >
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <button
                          key={child.id}
                          onClick={() => onSectionChange(child.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
                            isActive(child.id)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                          )}
                        >
                          <ChildIcon className="w-3.5 h-3.5" />
                          <span>{child.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3 text-green-500 animate-pulse" />
          <span>System Active</span>
        </div>
      </div>
    </div>
  );
};

export default PMSidebar;
