/**
 * KPIActionButtons - Guaranteed Action Buttons for KPI Cards
 * 
 * Each button has a guaranteed click handler with:
 * - Visual feedback
 * - Loading states
 * - Confirmation dialogs for destructive actions
 * - Proper event propagation handling
 */

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Check, X, Eye, Pause, Play, RefreshCw, 
  Archive, MoreHorizontal, Loader2, LucideIcon 
} from 'lucide-react';
import { toast } from 'sonner';

export type KPIActionType = 'approve' | 'reject' | 'view' | 'pause' | 'resume' | 'refresh' | 'archive' | 'more';

interface KPIActionConfig {
  type: KPIActionType;
  label: string;
  icon: LucideIcon;
  variant: 'success' | 'danger' | 'warning' | 'info' | 'default';
  requiresConfirmation?: boolean;
}

const ACTION_CONFIG: Record<KPIActionType, KPIActionConfig> = {
  approve: { type: 'approve', label: 'Approve', icon: Check, variant: 'success', requiresConfirmation: true },
  reject: { type: 'reject', label: 'Reject', icon: X, variant: 'danger', requiresConfirmation: true },
  view: { type: 'view', label: 'View', icon: Eye, variant: 'info' },
  pause: { type: 'pause', label: 'Pause', icon: Pause, variant: 'warning' },
  resume: { type: 'resume', label: 'Resume', icon: Play, variant: 'success' },
  refresh: { type: 'refresh', label: 'Refresh', icon: RefreshCw, variant: 'default' },
  archive: { type: 'archive', label: 'Archive', icon: Archive, variant: 'warning', requiresConfirmation: true },
  more: { type: 'more', label: 'More', icon: MoreHorizontal, variant: 'default' },
};

const VARIANT_STYLES = {
  success: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/30',
  info: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30',
  default: 'bg-white/10 hover:bg-white/20 text-white/80 border-white/20',
};

interface KPIActionButtonProps {
  action: KPIActionType;
  onClick: (action: KPIActionType) => void | Promise<void>;
  disabled?: boolean;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  itemLabel?: string;
  className?: string;
}

export const KPIActionButton = ({
  action,
  onClick,
  disabled = false,
  size = 'sm',
  showLabel = false,
  itemLabel,
  className,
}: KPIActionButtonProps) => {
  const [loading, setLoading] = useState(false);
  const config = ACTION_CONFIG[action];
  const Icon = config.icon;

  const executeAction = useCallback(async () => {
    setLoading(true);
    try {
      await onClick(action);
      toast.success(`${config.label} completed`, {
        description: itemLabel ? `Action applied to ${itemLabel}` : undefined,
        duration: 2000,
      });
    } catch (error) {
      toast.error(`${config.label} failed`, {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  }, [action, onClick, config.label, itemLabel]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled || loading) return;

    if (config.requiresConfirmation) {
      toast.custom((t) => (
        <div className="bg-card border border-border rounded-lg p-4 shadow-xl">
          <p className="text-sm font-medium mb-3">
            {`Are you sure you want to ${config.label.toLowerCase()}${itemLabel ? ` "${itemLabel}"` : ''}?`}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1.5 text-xs rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
              onClick={() => toast.dismiss(t)}
            >
              Cancel
            </button>
            <button
              className={cn(
                "px-3 py-1.5 text-xs rounded-md transition-colors",
                config.variant === 'danger' 
                  ? 'bg-destructive text-white hover:bg-destructive/90' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
              onClick={() => {
                toast.dismiss(t);
                executeAction();
              }}
            >
              {config.label}
            </button>
          </div>
        </div>
      ), { duration: 10000 });
    } else {
      executeAction();
    }
  }, [disabled, loading, config, itemLabel, executeAction]);

  const sizeClasses = size === 'sm' 
    ? 'w-7 h-7 text-xs' 
    : 'w-9 h-9 text-sm';

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.1 }}
      whileTap={disabled || loading ? {} : { scale: 0.9 }}
      title={config.label}
      className={cn(
        'relative flex items-center justify-center rounded-lg border transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        sizeClasses,
        VARIANT_STYLES[config.variant],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        showLabel && 'px-3 gap-1.5 w-auto',
        className
      )}
    >
      {loading ? (
        <Loader2 className={cn(iconSize, 'animate-spin')} />
      ) : (
        <>
          <Icon className={iconSize} />
          {showLabel && <span>{config.label}</span>}
        </>
      )}
    </motion.button>
  );
};

interface KPIActionBarProps {
  actions: KPIActionType[];
  onAction: (action: KPIActionType) => void | Promise<void>;
  disabled?: boolean;
  size?: 'sm' | 'md';
  itemLabel?: string;
  className?: string;
}

export const KPIActionBar = ({
  actions,
  onAction,
  disabled = false,
  size = 'sm',
  itemLabel,
  className,
}: KPIActionBarProps) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {actions.map((action) => (
        <KPIActionButton
          key={action}
          action={action}
          onClick={onAction}
          disabled={disabled}
          size={size}
          itemLabel={itemLabel}
        />
      ))}
    </div>
  );
};

export default KPIActionButton;
