/**
 * UNIVERSAL CLICK WRAPPER
 * Wraps ANY element to ensure click handling
 * 
 * Use this for:
 * - Table rows
 * - List items
 * - Card elements
 * - Any clickable non-button elements
 */

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useButtonActionRegistry } from '@/hooks/useButtonActionRegistry';

interface UniversalClickWrapperProps {
  /** Unique element identifier */
  elementId: string;
  /** Child elements to wrap */
  children: React.ReactNode;
  /** Custom click handler - if provided, used instead of registry */
  onClick?: () => void | Promise<void>;
  /** Context data for registry action */
  context?: Record<string, unknown>;
  /** Permission check */
  hasPermission?: boolean;
  /** Locked tooltip text */
  lockedTooltip?: string;
  /** Disable click interaction */
  disabled?: boolean;
  /** Show hover animation */
  animate?: boolean;
  /** Additional class names */
  className?: string;
  /** Cursor style */
  cursor?: 'pointer' | 'default' | 'not-allowed';
}

export const UniversalClickWrapper: React.FC<UniversalClickWrapperProps> = ({
  elementId,
  children,
  onClick,
  context,
  hasPermission = true,
  lockedTooltip = 'Access Restricted',
  disabled = false,
  animate = true,
  className,
  cursor = 'pointer',
}) => {
  const { executeAction, hasAction } = useButtonActionRegistry();
  const [isLoading, setIsLoading] = useState(false);
  const isLocked = !hasPermission;
  const actionExists = hasAction(elementId) || !!onClick;

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isLoading || isLocked || disabled) {
      if (isLocked) {
        toast.error('Access Restricted', {
          description: lockedTooltip,
          duration: 2000
        });
      }
      return;
    }

    setIsLoading(true);
    try {
      if (onClick) {
        // Use custom handler
        await onClick();
      } else {
        // Use registry action
        await executeAction(elementId, undefined, context);
      }
    } finally {
      setIsLoading(false);
    }
  }, [elementId, onClick, context, executeAction, isLoading, isLocked, disabled, lockedTooltip]);

  // Warn about unmapped elements in development
  if (!actionExists && process.env.NODE_ENV === 'development') {
    console.warn(`[CLICK_AUDIT] Element "${elementId}" has no action mapped`);
  }

  const baseClasses = cn(
    'relative',
    cursor === 'pointer' && 'cursor-pointer',
    cursor === 'not-allowed' && 'cursor-not-allowed',
    isLocked && 'opacity-60',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const content = (
    <motion.div
      whileHover={animate && !isLocked && !disabled ? { scale: 1.01 } : undefined}
      whileTap={animate && !isLocked && !disabled ? { scale: 0.99 } : undefined}
      onClick={handleClick}
      className={baseClasses}
    >
      {children}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg z-10">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </div>
      )}
      
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 rounded-lg z-10">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );

  // Wrap with tooltip if locked
  if (isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-800 text-white border-slate-700">
          <p className="text-xs">{lockedTooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

/**
 * Table Row Click Wrapper
 */
interface TableRowClickProps {
  rowId: string;
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  hasPermission?: boolean;
}

export const TableRowClick: React.FC<TableRowClickProps> = ({
  rowId,
  onClick,
  children,
  className,
  hasPermission = true,
}) => {
  return (
    <UniversalClickWrapper
      elementId={`btn_row_${rowId}`}
      onClick={onClick}
      hasPermission={hasPermission}
      className={cn('w-full', className)}
      animate={false}
    >
      {children}
    </UniversalClickWrapper>
  );
};

/**
 * List Item Click Wrapper
 */
interface ListItemClickProps {
  itemId: string;
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  hasPermission?: boolean;
}

export const ListItemClick: React.FC<ListItemClickProps> = ({
  itemId,
  onClick,
  children,
  className,
  hasPermission = true,
}) => {
  return (
    <UniversalClickWrapper
      elementId={`btn_list_${itemId}`}
      onClick={onClick}
      hasPermission={hasPermission}
      className={className}
    >
      {children}
    </UniversalClickWrapper>
  );
};

export default UniversalClickWrapper;
