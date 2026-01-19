/**
 * RESELLER SALES DASHBOARD SIDEBAR
 * Sales-only mode - No white-label
 * Brand = Software Vala (fixed)
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Percent,
  Megaphone,
  MessageSquare,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type RSSection =
  | 'dashboard'
  | 'products'
  | 'leads'
  | 'sales'
  | 'commission'
  | 'marketing'
  | 'support'
  | 'profile';

interface RSFullSidebarProps {
  activeSection: RSSection;
  onSectionChange: (section: RSSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onBack?: () => void;
}

const menuItems: { id: RSSection; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
  { id: 'commission', label: 'Commission', icon: Percent },
  { id: 'marketing', label: 'Marketing Tools', icon: Megaphone },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'profile', label: 'Profile & Security', icon: User },
];

export function RSFullSidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  onBack,
}: RSFullSidebarProps) {
  return (
    <aside
      className={cn(
        'h-full bg-slate-900/80 backdrop-blur-xl border-r border-emerald-500/20 flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-emerald-500/20">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-white font-bold text-sm">SV</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Software Vala</h2>
                <p className="text-xs text-emerald-400">Reseller Portal</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Back Button */}
      {onBack && (
        <div className="p-3 border-b border-slate-800">
          <Button
            variant="ghost"
            onClick={onBack}
            className={cn(
              'w-full text-slate-400 hover:text-white hover:bg-slate-800',
              collapsed ? 'justify-center px-2' : 'justify-start'
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Back to Control</span>}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-emerald-400')} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-500/20">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-slate-500">Powered by</p>
            <p className="text-xs text-emerald-400 font-medium">Software Vala</p>
          </div>
        )}
      </div>
    </aside>
  );
}
