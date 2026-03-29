/**
 * RESELLER MANAGER SIDEBAR
 * SINGLE SIDEBAR ENFORCEMENT: Uses sidebar store
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Map,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Shield,
  Activity,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  ArrowLeft,
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';

export type ResellerManagerSection = 
  | 'dashboard'
  | 'all-resellers'
  | 'reseller-map'
  | 'performance'
  | 'commissions'
  | 'issues'
  | 'compliance'
  | 'partner-activity'
  | 'ai-insights'
  | 'settings';

interface ResellerManagerSidebarProps {
  activeSection: ResellerManagerSection;
  onSectionChange: (section: ResellerManagerSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onBack?: () => void;
}

const menuItems: { id: ResellerManagerSection; label: string; icon: any; badge?: number }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'all-resellers', label: 'All Resellers', icon: Users },
  { id: 'reseller-map', label: 'Reseller Map', icon: Map },
  { id: 'performance', label: 'Performance & Revenue', icon: TrendingUp },
  { id: 'commissions', label: 'Commissions & Payouts', icon: DollarSign },
  { id: 'issues', label: 'Issues & Escalations', icon: AlertTriangle, badge: 5 },
  { id: 'compliance', label: 'Compliance & Risk', icon: Shield },
  { id: 'partner-activity', label: 'Partner Activity', icon: Activity },
  { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function ResellerManagerSidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  onBack,
}: ResellerManagerSidebarProps) {
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('reseller-manager');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className="h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col"
    >
      {/* Back Button */}
      {!collapsed && (
        <div className="p-2 border-b border-slate-700/50">
          <motion.button
            onClick={handleBack}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Boss</span>
          </motion.button>
        </div>
      )}

      {/* Header */}
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">Reseller Manager</p>
              <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400">
                Active
              </Badge>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;

          const button = (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-10 relative",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-emerald-400" : "text-slate-400"
              )} />
              {!collapsed && (
                <>
                  <span className="truncate text-sm">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-red-500/20 text-red-400 text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 text-center">
            Enterprise Reseller Control
          </p>
        </div>
      )}
    </motion.aside>
  );
}

export default ResellerManagerSidebar;