/**
 * HeaderIconButton - Unified icon button for header actions
 * STEP 8: Icon size 20px, Hit area 40x40px, with tooltips
 */

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface HeaderIconButtonProps {
  icon?: LucideIcon;
  iconElement?: ReactNode;
  onClick: () => void;
  tooltip: string;
  badge?: number | string;
  badgeVariant?: 'default' | 'danger' | 'success' | 'warning';
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'purple' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
  isActive?: boolean;
  pulseActive?: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
}

export const HeaderIconButton = ({
  icon: Icon,
  iconElement,
  onClick,
  tooltip,
  badge,
  badgeVariant = 'default',
  variant = 'default',
  gradientFrom,
  gradientTo,
  isActive = false,
  pulseActive = false,
  disabled = false,
  className,
  iconClassName,
}: HeaderIconButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/10 border-primary/30 hover:border-primary/50';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50';
      case 'danger':
        return 'bg-red-500/10 border-red-500/30 hover:border-red-500/50';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50';
      case 'purple':
        return 'bg-gradient-to-br from-violet-600 to-purple-600 border-purple-400/30';
      case 'gradient':
        return gradientFrom && gradientTo 
          ? `bg-gradient-to-br ${gradientFrom} ${gradientTo}` 
          : 'bg-gradient-to-br from-primary to-primary/80';
      default:
        return 'bg-secondary/80 border-border/50 hover:border-primary/50';
    }
  };

  const getBadgeClasses = () => {
    switch (badgeVariant) {
      case 'danger':
        return 'bg-red-500 text-white';
      case 'success':
        return 'bg-emerald-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-amber-900';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case 'purple':
      case 'gradient':
        return 'text-white';
      case 'success':
        return 'text-emerald-400';
      case 'danger':
        return 'text-red-400';
      case 'warning':
        return 'text-amber-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md group border",
        getVariantClasses(),
        isActive && "ring-2 ring-primary/50",
        pulseActive && "animate-pulse",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      title={tooltip}
    >
      {Icon && (
        <Icon className={cn("w-5 h-5", getIconClasses(), iconClassName)} />
      )}
      {iconElement}
      
      {/* Badge */}
      {badge !== undefined && badge !== 0 && (
        <span className={cn(
          "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center shadow-md",
          getBadgeClasses()
        )}>
          {badge}
        </span>
      )}
      
      {/* Tooltip */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {tooltip}
      </div>
    </motion.button>
  );
};

export default HeaderIconButton;
