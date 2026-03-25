/**
 * JIRA-BTN-01/02/03: Enterprise Button Component
 * Renders buttons with proper states: hover, loading, success, error, retry
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type ButtonState = 'idle' | 'loading' | 'success' | 'error' | 'confirming' | 'disabled';

interface EnterpriseButtonProps extends Omit<ButtonProps, 'onClick'> {
  state: ButtonState;
  onClick: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  confirmationTitle?: string;
  confirmationMessage?: string;
  disabledReason?: string;
  icon?: React.ReactNode;
  showStateIcon?: boolean;
}

export const EnterpriseButton: React.FC<EnterpriseButtonProps> = ({
  state,
  onClick,
  onConfirm,
  onCancel,
  onRetry,
  confirmationTitle = 'Confirm Action',
  confirmationMessage = 'Are you sure you want to proceed?',
  disabledReason,
  icon,
  showStateIcon = true,
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const renderStateIcon = () => {
    if (!showStateIcon) return icon;

    switch (state) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'disabled':
        return <Lock className="w-4 h-4" />;
      default:
        return icon;
    }
  };

  const getStateClassName = () => {
    switch (state) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'disabled':
        return 'opacity-50 cursor-not-allowed';
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (state === 'disabled' || state === 'loading') return;
    
    if (state === 'error' && onRetry) {
      onRetry();
      return;
    }
    
    onClick();
  };

  const button = (
    <Button
      onClick={handleClick}
      disabled={state === 'loading' || state === 'disabled'}
      variant={variant}
      className={cn(getStateClassName(), className)}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={state}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2"
        >
          {renderStateIcon()}
          {state === 'error' && onRetry ? (
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Retry
            </span>
          ) : (
            children
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );

  return (
    <>
      {/* Tooltip for disabled state */}
      {state === 'disabled' && disabledReason ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent>
              <p>{disabledReason}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={state === 'confirming'} onOpenChange={() => onCancel?.()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmationTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EnterpriseButton;
