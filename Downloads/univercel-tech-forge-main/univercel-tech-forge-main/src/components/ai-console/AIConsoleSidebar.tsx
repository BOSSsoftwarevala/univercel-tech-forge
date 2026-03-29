import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Activity, ToggleLeft, Database, 
  Cpu, DollarSign, FileText, Shield, AlertTriangle, 
  LifeBuoy, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AIConsoleSidebarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'traffic', label: 'AI Traffic Monitor', icon: Activity },
  { id: 'mode-switcher', label: 'AI Mode Switcher', icon: ToggleLeft },
  { id: 'cache-manager', label: 'Cache Manager', icon: Database },
  { id: 'lite-manager', label: 'Lite Model Manager', icon: Cpu },
  { id: 'cost-guardrail', label: 'Cost Guardrail', icon: DollarSign },
  { id: 'logs', label: 'Logs & Insights', icon: FileText },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'failsafe', label: 'Emergency Override', icon: AlertTriangle },
  { id: 'support', label: 'Support', icon: LifeBuoy },
];

const AIConsoleSidebar = ({ 
  activeScreen, 
  onScreenChange, 
  collapsed, 
  onToggleCollapse 
}: AIConsoleSidebarProps) => {
  return (
    <motion.aside 
      className={`fixed left-0 top-[120px] bottom-0 bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-foreground" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
          )}
        </button>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeScreen === item.id;
            const Icon = item.icon;

            return collapsed ? (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => onScreenChange(item.id)}
                    className={`w-full p-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/20 text-primary border-l-2 border-primary shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <motion.button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/20 text-primary border-l-2 border-primary shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-neon-purple/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">AI Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default AIConsoleSidebar;
