/**
 * QUICK ACTIONS
 * Icon-only vertical action buttons with tooltips
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, StopCircle, Lock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  hoverColor: string;
}

const actions: QuickAction[] = [
  { id: 'run', icon: Play, label: 'Run', color: 'text-emerald-400', hoverColor: 'hover:bg-emerald-500/20' },
  { id: 'pause', icon: Pause, label: 'Pause', color: 'text-amber-400', hoverColor: 'hover:bg-amber-500/20' },
  { id: 'stop', icon: StopCircle, label: 'Stop', color: 'text-red-400', hoverColor: 'hover:bg-red-500/20' },
  { id: 'lock', icon: Lock, label: 'Lock', color: 'text-blue-400', hoverColor: 'hover:bg-blue-500/20' },
  { id: 'escalate', icon: AlertTriangle, label: 'Escalate', color: 'text-orange-400', hoverColor: 'hover:bg-orange-500/20' },
];

export const QuickActions: React.FC = () => {
  const handleAction = (action: QuickAction) => {
    toast.success(`${action.label} action triggered`, {
      description: 'Processing your request...',
      duration: 2000,
    });
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <motion.button
                onClick={() => handleAction(action)}
                className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center bg-white/5 border border-white/10 transition-colors",
                  action.hoverColor
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={cn("w-3.5 h-3.5", action.color)} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {action.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
