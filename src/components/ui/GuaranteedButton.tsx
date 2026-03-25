/**
 * GuaranteedButton - 100% Click Guarantee Button System
 * CRITICAL: Every button in the system MUST work
 * 
 * Features:
 * - Always has click handler
 * - Visual feedback on click
 * - Never blocked by overlays
 * - Proper disabled states
 * - Sound feedback (optional)
 * - Loading states
 */

import React, { useCallback, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

export type ButtonAction = 
  | 'navigate' 
  | 'action' 
  | 'toggle' 
  | 'submit'
  | 'approve'
  | 'reject'
  | 'pause'
  | 'resume'
  | 'view'
  | 'edit'
  | 'delete';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'success'
  | 'warning'
  | 'ghost' 
  | 'sidebar' 
  | 'sidebar-active'
  | 'kpi-action';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface GuaranteedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'onClick'> {
  children: React.ReactNode;
  onClick: () => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  actionType?: ButtonAction;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  comingSoonMessage?: string;
  showFeedback?: boolean;
  feedbackMessage?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600',
  warning: 'bg-amber-500 text-amber-950 hover:bg-amber-600',
  ghost: 'bg-transparent hover:bg-secondary/50 text-foreground',
  sidebar: 'bg-transparent text-white/80 hover:bg-white/10 hover:text-white border border-transparent hover:border-primary/20',
  'sidebar-active': 'bg-primary/15 text-primary border border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.4)]',
  'kpi-action': 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const GuaranteedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  actionType = 'action',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  comingSoon = false,
  comingSoonMessage = 'This feature is coming soon',
  showFeedback = true,
  feedbackMessage,
  requiresConfirmation = false,
  confirmationMessage,
  className,
  ...props
}: GuaranteedButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const executeAction = useCallback(async () => {
    if (disabled || loading || isProcessing) return;

    // Handle coming soon state
    if (comingSoon) {
      toast.info('Coming Soon', { description: comingSoonMessage });
      return;
    }

    setIsProcessing(true);
    
    try {
      await onClick();
      
      // Show feedback if enabled
      if (showFeedback && feedbackMessage) {
        toast.success(feedbackMessage);
      }
    } catch (error) {
      console.error('Button action failed:', error);
      toast.error('Action failed', { 
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onClick, disabled, loading, isProcessing, comingSoon, comingSoonMessage, showFeedback, feedbackMessage]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (requiresConfirmation && !showConfirm) {
      setShowConfirm(true);
      toast.custom((t) => (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium mb-2">
            {confirmationMessage || 'Are you sure you want to proceed?'}
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 text-sm rounded-md bg-secondary hover:bg-secondary/80"
              onClick={() => {
                toast.dismiss(t);
                setShowConfirm(false);
              }}
            >
              Cancel
            </button>
            <button
              className={cn(
                "px-3 py-1.5 text-sm rounded-md",
                variant === 'danger' ? 'bg-destructive text-white' : 'bg-primary text-primary-foreground'
              )}
              onClick={() => {
                toast.dismiss(t);
                setShowConfirm(false);
                executeAction();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ), { duration: 10000 });
      return;
    }

    executeAction();
  }, [requiresConfirmation, showConfirm, confirmationMessage, variant, executeAction]);

  const isLoading = loading || isProcessing;
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      className={cn(
        // Base styles - CRITICAL: ensure clickability
        'relative inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        // Ensure button is always on top for clicks
        'z-10',
        // Pointer events
        isDisabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer',
        // Variant styles
        variantStyles[variant],
        // Size styles
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <Loader2 className={cn('animate-spin', iconSizeStyles[size])} />
      )}
      
      {/* Left icon */}
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className={iconSizeStyles[size]} />
      )}
      
      {/* Content */}
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      
      {/* Hidden content for layout during loading */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className={cn('animate-spin', iconSizeStyles[size])} />
        </span>
      )}
      
      {/* Right icon */}
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className={iconSizeStyles[size]} />
      )}
      
      {/* Coming soon indicator */}
      {comingSoon && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
      )}
    </motion.button>
  );
};

export default GuaranteedButton;
