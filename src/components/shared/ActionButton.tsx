/**
 * STEP 10: Universal Action Button Component
 * Shows loading, success, error, and retry states
 * Every button must give visual feedback
 */

import React, { useState, useCallback } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, RotateCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type ActionState = 'idle' | 'loading' | 'success' | 'error' | 'retry' | 'disabled';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ActionButtonProps extends Omit<ButtonProps, 'onClick' | 'onError'> {
  actionId: string;
  label: string;
  buttonVariant?: ButtonVariant;
  onClick: () => Promise<void> | void;
  onSuccess?: () => void;
  onActionError?: (error: string) => void;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  isReady?: boolean;
  comingSoonMessage?: string;
  showStateIcon?: boolean;
  maxRetries?: number;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
};

const stateStyles: Record<ActionState, string> = {
  idle: '',
  loading: 'opacity-80 cursor-wait',
  success: 'border-green-500/50 bg-green-500/10',
  error: 'border-red-500/50 bg-red-500/10',
  retry: 'border-yellow-500/50 bg-yellow-500/10',
  disabled: 'opacity-50 cursor-not-allowed'
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  actionId,
  label,
  buttonVariant = 'primary',
  onClick,
  onSuccess,
  onActionError,
  requiresConfirmation = false,
  confirmationMessage,
  isReady = true,
  comingSoonMessage = 'Coming soon',
  showStateIcon = true,
  maxRetries = 3,
  className,
  disabled,
  children,
  ...props
}) => {
  const [state, setState] = useState<ActionState>('idle');
  const [retryCount, setRetryCount] = useState(0);

  const executeAction = useCallback(async () => {
    if (!isReady) {
      toast.info('Coming Soon', { description: comingSoonMessage });
      return;
    }

    setState('loading');
    toast.loading(`Processing: ${label}...`, { id: actionId });

    try {
      await onClick();
      setState('success');
      toast.success(`${label} completed`, { id: actionId, duration: 2000 });
      onSuccess?.();
      
      // Reset after success animation
      setTimeout(() => {
        setState('idle');
        setRetryCount(0);
      }, 2000);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Action failed';
      setState('error');
      toast.error(`${label} failed`, { id: actionId, description: errorMsg });
      onActionError?.(errorMsg);
      
      // Show retry state if retries available
      if (retryCount < maxRetries) {
        setTimeout(() => setState('retry'), 1500);
      }
    }
  }, [actionId, label, onClick, onSuccess, onActionError, isReady, comingSoonMessage, retryCount, maxRetries]);

  const handleClick = useCallback(() => {
    if (state === 'loading') return;
    
    if (state === 'retry') {
      setRetryCount(prev => prev + 1);
      executeAction();
      return;
    }

    if (requiresConfirmation) {
      // Show confirmation toast with action
      toast.custom((t) => (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium mb-2">
            {confirmationMessage || `Are you sure you want to ${label.toLowerCase()}?`}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={buttonVariant === 'danger' ? 'destructive' : 'default'}
              onClick={() => {
                toast.dismiss(t);
                executeAction();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      ), { duration: 10000 });
    } else {
      executeAction();
    }
  }, [state, requiresConfirmation, confirmationMessage, label, buttonVariant, executeAction]);

  const renderIcon = () => {
    if (!showStateIcon) return null;
    
    switch (state) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin mr-2" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500 mr-2" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500 mr-2" />;
      case 'retry':
        return <RotateCw className="h-4 w-4 text-yellow-500 mr-2" />;
      default:
        return null;
    }
  };

  const buttonContent = (
    <Button
      onClick={handleClick}
      disabled={disabled || state === 'loading' || state === 'disabled'}
      className={cn(
        'gap-1 transition-all duration-200',
        variantStyles[buttonVariant],
        stateStyles[state],
        !isReady && 'opacity-60',
        className
      )}
      {...props}
    >
      {renderIcon()}
      {children || label}
      {state === 'retry' && (
        <span className="text-xs ml-1">({maxRetries - retryCount} left)</span>
      )}
    </Button>
  );

  if (!isReady) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block">
            {buttonContent}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
            <span>{comingSoonMessage}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
};

export default ActionButton;
