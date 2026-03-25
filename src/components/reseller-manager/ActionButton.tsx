import React, { useState, useCallback } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionState, ActionType } from '@/hooks/useEnterpriseAction';
import { ConfirmationDialog } from './ConfirmationDialog';

interface ActionButtonProps extends Omit<ButtonProps, 'onClick' | 'onError'> {
  actionType: ActionType;
  onClick: () => Promise<void>;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  entityName?: string;
  showStateIcons?: boolean;
  onSuccess?: () => void;
  onActionError?: (error: Error) => void;
}

// JIRA-BTN-03: All button states
export const ActionButton: React.FC<ActionButtonProps> = ({
  actionType,
  onClick,
  requiresConfirmation = false,
  confirmationMessage,
  entityName,
  showStateIcons = true,
  onSuccess,
  onActionError,
  children,
  className,
  disabled,
  ...props
}) => {
  const [state, setState] = useState<ActionState>('idle');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const executeAction = useCallback(async () => {
    setState('loading');
    try {
      await onClick();
      setState('success');
      onSuccess?.();
      // Reset after success animation
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('error');
      if (onActionError) {
        onActionError(error instanceof Error ? error : new Error('Action failed'));
      }
      // Show retry state if retries available
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => setState('retry'), 1500);
      }
    }
  }, [onClick, onSuccess, onActionError, retryCount]);

  const handleClick = useCallback(() => {
    if (requiresConfirmation) {
      setShowConfirmation(true);
    } else {
      executeAction();
    }
  }, [requiresConfirmation, executeAction]);

  const handleConfirm = useCallback(() => {
    setShowConfirmation(false);
    executeAction();
  }, [executeAction]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    executeAction();
  }, [executeAction]);

  const renderIcon = () => {
    if (!showStateIcons) return null;
    
    switch (state) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'retry':
        return (
          <button onClick={handleRetry} className="flex items-center gap-1">
            <RotateCw className="h-4 w-4 text-yellow-500" />
          </button>
        );
      default:
        return null;
    }
  };

  const getStateClassName = () => {
    switch (state) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'retry':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return '';
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled || state === 'loading'}
        className={cn(
          'gap-2 transition-all duration-200',
          getStateClassName(),
          className
        )}
        {...props}
      >
        {state !== 'idle' && renderIcon()}
        {children}
      </Button>

      <ConfirmationDialog
        open={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
        actionType={actionType}
        entityName={entityName}
        message={confirmationMessage}
        state={state}
        onRetry={state === 'error' ? handleRetry : undefined}
      />
    </>
  );
};
