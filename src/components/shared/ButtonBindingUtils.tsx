/**
 * BUTTON BINDING UTILITIES
 * Helper components and functions for ensuring all buttons have actions
 * 
 * USE THESE TO:
 * - Wrap existing buttons with action binding
 * - Create properly bound click handlers
 * - Generate button IDs consistently
 */

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useButtonActionRegistry, ActionDefinition } from '@/hooks/useButtonActionRegistry';

// Generate consistent button IDs
export function generateButtonId(
  category: 'header' | 'sidebar' | 'cta' | 'row' | 'icon' | 'toggle' | 'nav' | 'card' | 'modal',
  action: string,
  context?: string
): string {
  const base = `btn_${category}_${action.toLowerCase().replace(/\s+/g, '_')}`;
  return context ? `${base}_${context}` : base;
}

// Create a click handler with registry binding
export function useRegistryClickHandler(buttonId: string) {
  const { executeAction, hasAction, state } = useButtonActionRegistry();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleClick = useCallback(async (
    customAction?: () => void | Promise<void>,
    overrides?: Partial<ActionDefinition>
  ) => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    try {
      if (customAction) {
        await customAction();
      } else {
        await executeAction(buttonId, overrides);
      }
    } finally {
      setIsExecuting(false);
    }
  }, [buttonId, executeAction, isExecuting]);

  return {
    handleClick,
    isLoading: isExecuting || (state.isLoading && state.lastAction === buttonId),
    hasAction: hasAction(buttonId),
  };
}

// HOC to wrap any clickable element with registry binding
interface WithRegistryBindingProps {
  buttonId: string;
  children: (props: {
    onClick: () => void;
    isLoading: boolean;
    hasAction: boolean;
    'data-button-id': string;
  }) => React.ReactNode;
  onCustomClick?: () => void | Promise<void>;
}

export const WithRegistryBinding: React.FC<WithRegistryBindingProps> = ({
  buttonId,
  children,
  onCustomClick,
}) => {
  const { handleClick, isLoading, hasAction } = useRegistryClickHandler(buttonId);

  return (
    <>
      {children({
        onClick: () => handleClick(onCustomClick),
        isLoading,
        hasAction,
        'data-button-id': buttonId,
      })}
    </>
  );
};

// Ensure button has action - wrapper for any button
interface EnsureActionProps {
  buttonId: string;
  children: React.ReactElement;
  fallbackAction?: () => void;
  showWarning?: boolean;
}

export const EnsureAction: React.FC<EnsureActionProps> = ({
  buttonId,
  children,
  fallbackAction,
  showWarning = true,
}) => {
  const { executeAction, hasAction } = useButtonActionRegistry();

  const handleClick = useCallback(async (originalOnClick?: () => void) => {
    if (hasAction(buttonId)) {
      await executeAction(buttonId);
    } else if (fallbackAction) {
      fallbackAction();
    } else if (showWarning) {
      toast.warning('Action Not Available', {
        description: `No action configured for: ${buttonId}`,
      });
      console.warn(`[BUTTON_AUDIT] Unbound button clicked: ${buttonId}`);
    }
    
    // Call original onClick if exists
    if (originalOnClick) {
      originalOnClick();
    }
  }, [buttonId, hasAction, executeAction, fallbackAction, showWarning]);

  // Clone child with enhanced onClick
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      handleClick(children.props.onClick);
    },
    'data-button-id': buttonId,
    'data-has-action': hasAction(buttonId) ? 'true' : 'false',
  });
};

// Status indicator for button binding
interface ButtonStatusIndicatorProps {
  buttonId: string;
  showWhenBound?: boolean;
}

export const ButtonStatusIndicator: React.FC<ButtonStatusIndicatorProps> = ({
  buttonId,
  showWhenBound = false,
}) => {
  const { hasAction } = useButtonActionRegistry();
  const isBound = hasAction(buttonId);

  if (isBound && !showWhenBound) return null;

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
        isBound ? "bg-emerald-500" : "bg-red-500"
      )}
      title={isBound ? 'Action bound' : 'No action configured'}
    />
  );
};

// Clickable card with automatic binding
interface ClickableCardProps {
  buttonId: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
}

export const ClickableCard: React.FC<ClickableCardProps> = ({
  buttonId,
  children,
  className,
  disabled,
  onClick,
}) => {
  const { handleClick, isLoading } = useRegistryClickHandler(buttonId);

  return (
    <motion.div
      data-button-id={buttonId}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={() => !disabled && handleClick(onClick)}
      className={cn(
        'relative cursor-pointer transition-all',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
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

// Table row with click binding
interface ClickableRowProps {
  rowId: string;
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  className?: string;
}

export const ClickableRow: React.FC<ClickableRowProps> = ({
  rowId,
  children,
  onClick,
  className,
}) => {
  const buttonId = `btn_row_${rowId}`;
  const { handleClick, isLoading } = useRegistryClickHandler(buttonId);

  return (
    <tr
      data-button-id={buttonId}
      onClick={() => handleClick(onClick)}
      className={cn(
        'cursor-pointer hover:bg-muted/50 transition-colors relative',
        isLoading && 'opacity-50',
        className
      )}
    >
      {children}
    </tr>
  );
};

// Export all utilities
export const ButtonBindingUtils = {
  generateButtonId,
  useRegistryClickHandler,
  WithRegistryBinding,
  EnsureAction,
  ButtonStatusIndicator,
  ClickableCard,
  ClickableRow,
};

export default ButtonBindingUtils;
