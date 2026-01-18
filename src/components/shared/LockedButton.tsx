/**
 * LOCKED BUTTON COMPONENT
 * Shows tooltip when user has no permission
 * No navigation on locked state
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LockedButtonProps {
  children: React.ReactNode;
  isLocked: boolean;
  lockedTooltip?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const LockedButton: React.FC<LockedButtonProps> = ({
  children,
  isLocked,
  lockedTooltip = 'Access Restricted',
  onClick,
  className,
  disabled,
}) => {
  if (isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "relative cursor-not-allowed opacity-60",
              className
            )}
            whileHover={{ scale: 1.02 }}
          >
            {children}
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg backdrop-blur-[1px]">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-800 text-white border-slate-700">
          <p className="text-xs">{lockedTooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={!disabled ? onClick : undefined}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

export default LockedButton;
