/**
 * TRACKED BUTTON COMPONENT
 * Universal button with automatic action logging
 * Every click = DB log entry
 */
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useActionLogger, ActionType } from '@/hooks/useActionLogger';
import { cn } from '@/lib/utils';

interface TrackedButtonProps extends ButtonProps {
  buttonId: string;
  moduleName: string;
  actionType: ActionType;
  onAction?: () => Promise<void> | void;
  showLoadingState?: boolean;
}

export const TrackedButton: React.FC<TrackedButtonProps> = ({
  buttonId,
  moduleName,
  actionType,
  onAction,
  showLoadingState = true,
  children,
  className,
  disabled,
  ...props
}) => {
  const { logAction } = useActionLogger();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    const startTime = performance.now();
    
    if (showLoadingState) {
      setIsLoading(true);
    }

    try {
      // Execute the action
      if (onAction) {
        await onAction();
      }

      // Log success
      const responseTimeMs = Math.round(performance.now() - startTime);
      await logAction({
        buttonId,
        moduleName,
        actionType,
        actionResult: 'success',
        responseTimeMs,
      });
    } catch (error) {
      // Log failure
      const responseTimeMs = Math.round(performance.now() - startTime);
      await logAction({
        buttonId,
        moduleName,
        actionType,
        actionResult: 'failure',
        responseTimeMs,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      {...props}
      className={cn(className)}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      {isLoading && showLoadingState ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default TrackedButton;
