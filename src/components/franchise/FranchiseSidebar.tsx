import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  MapPin, 
  PlayCircle, 
  UserPlus, 
  Bot, 
  HeadphonesIcon,
  TrendingUp,
  Shield,
  AlertTriangle,
  Package,
  Megaphone,
  Lock,
  FileText,
  Zap,
  ChevronRight,
  BarChart3,
  Globe,
  Scale,
  History
} from 'lucide-react';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'territory', label: 'Territory Control', icon: MapPin },
  { id: 'leads', label: 'Lead Intake', icon: Users, badge: 23 },
  { id: 'demos', label: 'Demo Distribution', icon: PlayCircle },
  { id: 'resellers', label: 'Reseller Hub', icon: UserPlus },
  { id: 'wallet', label: 'Commission Wallet', icon: Wallet },
  { id: 'marketing', label: 'Local Marketing', icon: Megaphone },
  { id: 'escalation', label: 'Escalation', icon: HeadphonesIcon },
  { id: 'insights', label: 'Territory Insights', icon: TrendingUp },
  { id: 'orders', label: 'Order Execution', icon: Package },
  { id: 'compliance', label: 'Compliance Guard', icon: Shield },
  { id: 'conflicts', label: 'Conflict Resolution', icon: Scale },
  { id: 'expansion', label: 'Region Expansion', icon: Globe },
  { id: 'ai-lead', label: 'AI Lead Gen', icon: Bot },
  { id: 'success', label: 'Success Dashboard', icon: BarChart3 },
  { id: 'audit', label: 'Audit Logs', icon: History },
  { id: 'products', label: 'Product Library', icon: FileText }
];

interface FranchiseSidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export const FranchiseSidebar = ({ 
  activeItem, 
  onItemChange, 
  collapsed, 
  onCollapsedChange 
}: FranchiseSidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} hidden lg:block`}>
      <div className="h-full glass-panel border-r border-border/30 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
            >
              <Zap className="w-5 h-5 text-background" />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <p className="font-mono font-bold text-sm text-foreground">SOFTWARE VALA</p>
                  <p className="text-[10px] text-primary">Franchise Portal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => onItemChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeItem === item.id
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                whileHover={{ x: 3 }}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium flex-1 text-left truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="m-4 p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors self-end"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </aside>
  );
};
