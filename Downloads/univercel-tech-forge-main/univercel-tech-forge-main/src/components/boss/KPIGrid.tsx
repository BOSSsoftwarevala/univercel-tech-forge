/**
 * Responsive KPI Grid Component
 * Auto-adjusting grid with proper breakpoints
 * Desktop: 4 boxes per row | Tablet: 2 boxes | Mobile: 1 box
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KPIGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export function KPIGrid({ children, className, gap = 'md' }: KPIGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={cn(
        // Base grid with auto-wrap
        'grid w-full',
        // Responsive columns: 1 on mobile, 2 on tablet, 3-4 on desktop, 6 on xl
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
        // Gap
        gapClasses[gap],
        // Auto-rows to ensure consistent height
        'auto-rows-fr',
        className
      )}
    >
      {children}
    </div>
  );
}

interface KPIBoxProps {
  id: string;
  label: string;
  value: string | number;
  subValues?: string[];
  status: 'healthy' | 'warning' | 'critical' | 'action';
  icon: React.ElementType;
  source: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  lastUpdate?: string;
  isSelected?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function KPIBox({
  id,
  label,
  value,
  subValues,
  status,
  icon: Icon,
  source,
  urgency,
  lastUpdate,
  isSelected,
  onClick,
  actions,
  className,
}: KPIBoxProps) {
  const statusColors = {
    healthy: 'bg-green-500',
    warning: 'bg-amber-500',
    critical: 'bg-destructive',
    action: 'bg-blue-500',
  };

  const urgencyStyles = {
    low: 'border-green-500/50 text-green-600 bg-green-500/10',
    medium: 'border-amber-500/50 text-amber-600 bg-amber-500/10',
    high: 'border-orange-500/50 text-orange-600 bg-orange-500/10',
    critical: 'border-destructive/50 text-destructive bg-destructive/10',
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        // Base styles
        'relative cursor-pointer transition-all duration-200 group',
        // Fixed height with flexible content
        'min-h-[140px] h-full',
        // Card styling
        'p-4 rounded-xl border bg-card shadow-sm',
        // Hover/selected states
        'hover:shadow-md',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background border-primary',
        className
      )}
    >
      {/* Live Pulse Indicator */}
      <div
        className={cn(
          'absolute top-3 right-3 w-2 h-2 rounded-full',
          statusColors[status],
          status === 'critical' ? 'animate-pulse' : 'animate-pulse [animation-duration:2s]'
        )}
      />

      {/* Content Container */}
      <div className="flex flex-col h-full">
        {/* Top Row: Label + Value + Icon */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold leading-none truncate">
              {label}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p
                className={cn(
                  'text-2xl font-bold leading-none',
                  status === 'critical' && 'text-destructive',
                  status === 'healthy' && 'text-green-500'
                )}
              >
                {value}
              </p>
            </div>
            {/* Sub-values summary */}
            {subValues && subValues.length > 0 && (
              <p className="text-[9px] text-muted-foreground mt-1 leading-relaxed line-clamp-1">
                {subValues.join(' • ')}
              </p>
            )}
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Bottom Row: Source + Urgency + Actions */}
        <div className="flex items-center justify-between mt-auto pt-2 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[8px] text-muted-foreground truncate">{source}</span>
            <span
              className={cn(
                'text-[7px] font-semibold px-1.5 py-0.5 rounded border',
                urgencyStyles[urgency]
              )}
            >
              {urgency.toUpperCase()}
            </span>
          </div>
          
          {/* Inline Actions (shown on hover or when selected) */}
          {actions && (
            <div className={cn(
              'flex items-center gap-1 transition-opacity',
              'opacity-0 group-hover:opacity-100',
              isSelected && 'opacity-100'
            )}>
              {actions}
            </div>
          )}
        </div>

        {/* Last Update (optional) */}
        {lastUpdate && (
          <div className="text-[8px] text-muted-foreground/60 mt-1">
            Updated: {lastUpdate}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Quick action button for KPI boxes
interface KPIActionButtonProps {
  action: string;
  icon: React.ElementType;
  onClick: (e: React.MouseEvent) => void;
  loading?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm';
}

export function KPIActionButton({
  action,
  icon: Icon,
  onClick,
  loading,
  variant = 'default',
  size = 'xs',
}: KPIActionButtonProps) {
  const variantStyles = {
    default: 'bg-secondary hover:bg-secondary/80 text-foreground',
    success: 'bg-green-500/20 hover:bg-green-500/30 text-green-600',
    warning: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-600',
    danger: 'bg-destructive/20 hover:bg-destructive/30 text-destructive',
  };

  const sizeStyles = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!loading) onClick(e);
      }}
      disabled={loading}
      title={action}
      className={cn(
        'rounded flex items-center justify-center transition-colors',
        sizeStyles[size],
        variantStyles[variant],
        loading && 'opacity-50 cursor-wait'
      )}
    >
      <Icon className={cn('w-3 h-3', loading && 'animate-spin')} />
    </button>
  );
}
