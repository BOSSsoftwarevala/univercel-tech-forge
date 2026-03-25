/**
 * Boss Empty State Component
 * Shows when no data/action is required for a section
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}

export function BossEmptyState({
  title = 'No Action Required',
  description = 'All items are up to date. Nothing requires your attention.',
  type = 'success',
  icon,
  action,
  className,
}: EmptyStateProps) {
  const typeConfig = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  };

  const config = typeConfig[type];
  const IconComponent = icon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 rounded-xl border',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className={cn('w-16 h-16 rounded-full flex items-center justify-center mb-4', config.bgColor)}>
        <IconComponent className={cn('w-8 h-8', config.iconColor)} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

/**
 * Loading Skeleton for KPI Grid
 */
export function KPIGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[140px] rounded-xl bg-muted/50 animate-pulse border border-border/50"
        />
      ))}
    </div>
  );
}

/**
 * Module Loading State
 */
export function ModuleLoadingState({ moduleName }: { moduleName: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
      <p className="text-muted-foreground">Loading {moduleName}...</p>
    </div>
  );
}
