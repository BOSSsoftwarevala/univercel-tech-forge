/**
 * FRANCHISE SIDEBAR
 * SINGLE-CONTEXT ENFORCEMENT: Uses sidebar store for strict isolation
 */

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
  Package,
  Megaphone,
  FileText,
  BarChart3,
  Globe,
  Scale,
  History,
  Star,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useSidebarStore, useShouldRenderSidebar } from '@/stores/sidebarStore';

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
  onBack?: () => void;
}

export const FranchiseSidebar = ({ 
  activeItem, 
  onItemChange, 
  collapsed, 
  onCollapsedChange,
  onBack 
}: FranchiseSidebarProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal } = useSidebarStore();
  
  // Use dedicated hook for strict visibility check
  const shouldRender = useShouldRenderSidebar('category', 'franchise-manager');
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };
  
  // STRICT ISOLATION: Only render when in Module context with matching category
  if (!shouldRender) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <aside className={`w-64 bg-card/50 border-r border-border/50 flex flex-col h-full`}>
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Franchise Portal</h2>
            <p className="text-xs text-muted-foreground">Territory Management</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative ${
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium flex-1 text-left truncate">
                {item.label}
              </span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="franchiseActiveIndicator"
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Performance Widget */}
      <div className="mx-3 mb-3 p-3 rounded-xl bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-muted-foreground">Performance</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-primary mt-1">Rating: 4.8/5.0</p>
      </div>
    </aside>
  );
};
