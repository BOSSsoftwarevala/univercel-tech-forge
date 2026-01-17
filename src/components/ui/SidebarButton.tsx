/**
 * SidebarButton - Guaranteed Clickable Sidebar Navigation Button
 * 
 * CRITICAL RULES:
 * - Always has onClick handler
 * - Never blocked by overlays
 * - Proper active state management
 * - Visual feedback on interaction
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, ChevronRight, Lock, Clock } from 'lucide-react';
import { toast } from 'sonner';

export type SidebarButtonStatus = 'active' | 'locked' | 'coming-soon' | 'disabled';

interface SidebarButtonProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  isActive?: boolean;
  isExpanded?: boolean;
  status?: SidebarButtonStatus;
  level?: 1 | 2 | 3;
  hasChildren?: boolean;
  collapsed?: boolean;
  onClick: (id: string) => void;
  className?: string;
  badge?: number | string;
  badgeVariant?: 'default' | 'danger' | 'warning' | 'success';
}

const levelStyles = {
  1: 'px-3 py-2.5 text-sm font-semibold',
  2: 'pl-6 pr-3 py-2 text-sm font-medium',
  3: 'pl-9 pr-3 py-1.5 text-xs font-medium',
};

const badgeVariantStyles = {
  default: 'bg-primary/20 text-primary',
  danger: 'bg-red-500/20 text-red-400',
  warning: 'bg-amber-500/20 text-amber-400',
  success: 'bg-emerald-500/20 text-emerald-400',
};

export const SidebarButton = ({
  id,
  label,
  icon: Icon,
  isActive = false,
  isExpanded = false,
  status = 'active',
  level = 1,
  hasChildren = false,
  collapsed = false,
  onClick,
  className,
  badge,
  badgeVariant = 'default',
}: SidebarButtonProps) => {
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Handle locked/coming-soon status
    if (status === 'locked') {
      toast.info('Locked', { 
        description: 'This feature is currently locked',
        duration: 2000
      });
      return;
    }
    
    if (status === 'coming-soon') {
      toast.info('Coming Soon', { 
        description: `${label} will be available soon`,
        duration: 2000
      });
      return;
    }

    if (status === 'disabled') {
      return;
    }
    
    // Execute click handler
    onClick(id);
  }, [id, label, status, onClick]);

  const isDisabled = status === 'disabled';
  const isLocked = status === 'locked';
  const isComingSoon = status === 'coming-soon';

  // Status icon overlay
  const StatusIcon = isLocked ? Lock : isComingSoon ? Clock : null;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={isDisabled ? {} : { x: 2 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      className={cn(
        // Base styles
        'relative w-full flex items-center gap-2 rounded-lg transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        // Level-specific padding
        levelStyles[level],
        // Active state
        isActive && !isDisabled && [
          'bg-white/15 text-white',
          level === 3 && 'border-l-2 border-primary'
        ],
        // Inactive state
        !isActive && !isDisabled && 'text-white/80 hover:bg-white/10 hover:text-white',
        // Disabled/locked states
        isDisabled && 'opacity-50 cursor-not-allowed',
        (isLocked || isComingSoon) && 'opacity-70 cursor-not-allowed',
        className
      )}
    >
      {/* Active indicator for level 1 */}
      {isActive && level === 1 && (
        <motion.div 
          layoutId={`sidebar-active-${level}`}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full"
        />
      )}

      {/* Icon */}
      {Icon && !collapsed && (
        <div className={cn(
          'flex-shrink-0 w-5 h-5 flex items-center justify-center',
          isActive ? 'text-white' : 'text-white/70'
        )}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      
      {/* Icon only when collapsed */}
      {Icon && collapsed && (
        <div className="w-full flex justify-center">
          <Icon className="w-5 h-5 text-white/80" />
        </div>
      )}

      {/* Label */}
      {!collapsed && (
        <span className="flex-1 text-left truncate">{label}</span>
      )}

      {/* Badge */}
      {!collapsed && badge !== undefined && badge !== 0 && (
        <span className={cn(
          'px-1.5 py-0.5 text-[10px] font-bold rounded-full',
          badgeVariantStyles[badgeVariant]
        )}>
          {badge}
        </span>
      )}

      {/* Status icon */}
      {!collapsed && StatusIcon && (
        <StatusIcon className="w-3.5 h-3.5 text-white/50" />
      )}

      {/* Expand arrow for items with children */}
      {!collapsed && hasChildren && (
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRight className="w-4 h-4 text-white/50" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default SidebarButton;
