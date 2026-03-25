/**
 * SAFE BUTTON COMPONENT
 * Wrapper that ensures EVERY button has an action
 * 
 * Features:
 * - Auto-registry lookup
 * - Failsafe toast for unmapped
 * - Loading states
 * - Permission checks
 * - Never silent clicks
 */

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock, AlertCircle } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useButtonActionRegistry, ActionDefinition } from '@/hooks/useButtonActionRegistry';

interface SafeButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Unique button identifier for action registry */
  buttonId: string;
  /** Override action definition */
  actionOverride?: Partial<ActionDefinition>;
  /** Context data to pass to action */
  context?: Record<string, unknown>;
  /** Custom click handler (runs after registry action) */
  onCustomClick?: () => void | Promise<void>;
  /** Permission check - if false, shows locked state */
  hasPermission?: boolean;
  /** Tooltip for locked state */
  lockedTooltip?: string;
  /** Show loading spinner during action */
  showLoadingState?: boolean;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
}

export const SafeButton: React.FC<SafeButtonProps> = ({
  buttonId,
  actionOverride,
  context,
  onCustomClick,
  hasPermission = true,
  lockedTooltip = 'Access Restricted',
  showLoadingState = true,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  variant = 'default',
  ...props
}) => {
  const { executeAction, hasAction, state } = useButtonActionRegistry();
  const [isExecuting, setIsExecuting] = useState(false);

  const isLoading = showLoadingState && (isExecuting || (state.isLoading && state.lastAction === buttonId));
  const isLocked = !hasPermission;
  const actionExists = hasAction(buttonId);

  const handleClick = useCallback(async () => {
    if (isLoading || isLocked || disabled) return;

    setIsExecuting(true);
    try {
      // Execute registry action
      await executeAction(buttonId, actionOverride, context);
      
      // Run custom handler if provided
      if (onCustomClick) {
        await onCustomClick();
      }
    } finally {
      setIsExecuting(false);
    }
  }, [buttonId, actionOverride, context, onCustomClick, executeAction, isLoading, isLocked, disabled]);

  // Locked state
  if (isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            className={cn('opacity-60 cursor-not-allowed', className)}
            disabled
            {...props}
          >
            <Lock className="w-4 h-4 mr-2" />
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-800 text-white border-slate-700">
          <p className="text-xs">{lockedTooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Render content with proper icon/loading state
  const renderContent = () => (
    <>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
      {!actionExists && !isLoading && (
        <AlertCircle className="w-3 h-3 ml-1 text-amber-500" />
      )}
    </>
  );

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Button
        variant={variant}
        className={cn(
          !actionExists && 'border-amber-500/30',
          className
        )}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {renderContent()}
      </Button>
    </motion.div>
  );
};

/**
 * Safe Icon Button - for icon-only buttons
 */
interface SafeIconButtonProps {
  buttonId: string;
  icon: React.ReactNode;
  tooltip?: string;
  hasPermission?: boolean;
  lockedTooltip?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  context?: Record<string, unknown>;
  disabled?: boolean;
}

export const SafeIconButton: React.FC<SafeIconButtonProps> = ({
  buttonId,
  icon,
  tooltip,
  hasPermission = true,
  lockedTooltip = 'Access Restricted',
  className,
  size = 'md',
  variant = 'ghost',
  context,
  disabled,
}) => {
  const { executeAction, state } = useButtonActionRegistry();
  const isLoading = state.isLoading && state.lastAction === buttonId;
  const isLocked = !hasPermission;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const handleClick = useCallback(async () => {
    if (isLoading || isLocked || disabled) return;
    await executeAction(buttonId, undefined, context);
  }, [buttonId, context, executeAction, isLoading, isLocked, disabled]);

  const button = (
    <motion.button
      whileHover={{ scale: disabled || isLocked ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLocked ? 1 : 0.95 }}
      onClick={handleClick}
      disabled={disabled || isLocked || isLoading}
      className={cn(
        'rounded-lg flex items-center justify-center transition-all',
        sizeClasses[size],
        variant === 'ghost' && 'hover:bg-muted',
        variant === 'outline' && 'border border-border hover:border-primary/50',
        variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        isLocked && 'opacity-50 cursor-not-allowed',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isLocked ? (
        <Lock className="w-4 h-4" />
      ) : (
        icon
      )}
    </motion.button>
  );

  if (tooltip || isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-800 text-white border-slate-700">
          <p className="text-xs">{isLocked ? lockedTooltip : tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};

/**
 * Safe Card Button - for clickable cards
 */
interface SafeCardButtonProps {
  buttonId: string;
  children: React.ReactNode;
  hasPermission?: boolean;
  lockedTooltip?: string;
  className?: string;
  context?: Record<string, unknown>;
}

export const SafeCardButton: React.FC<SafeCardButtonProps> = ({
  buttonId,
  children,
  hasPermission = true,
  lockedTooltip = 'Access Restricted',
  className,
  context,
}) => {
  const { executeAction, state } = useButtonActionRegistry();
  const isLoading = state.isLoading && state.lastAction === buttonId;
  const isLocked = !hasPermission;

  const handleClick = useCallback(async () => {
    if (isLoading || isLocked) return;
    await executeAction(buttonId, undefined, context);
  }, [buttonId, context, executeAction, isLoading, isLocked]);

  if (isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('relative opacity-60 cursor-not-allowed', className)}>
            {children}
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg backdrop-blur-[1px]">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-800 text-white border-slate-700">
          <p className="text-xs">{lockedTooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn('cursor-pointer', className)}
    >
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}
    </motion.div>
  );
};

export default SafeButton;
