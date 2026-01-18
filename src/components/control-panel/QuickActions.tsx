/**
 * QUICK ACTIONS
 * Icon-only vertical action buttons with tooltips
 * OPTIMIZED: Removed framer-motion whileHover/whileTap
 */

import React, { memo, useCallback } from 'react';
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

const ActionButton = memo<{ action: QuickAction; onClick: () => void }>(({ action, onClick }) => {
  const Icon = action.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-7 h-7 rounded-md flex items-center justify-center bg-white/5 border border-white/10 transition-all",
            action.hoverColor,
            "active:scale-95"
          )}
        >
          <Icon className={cn("w-3.5 h-3.5", action.color)} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {action.label}
      </TooltipContent>
    </Tooltip>
  );
});

ActionButton.displayName = 'ActionButton';

export const QuickActions: React.FC = memo(() => {
  const handleAction = useCallback((action: QuickAction) => {
    toast.success(`${action.label} action triggered`, {
      description: 'Processing your request...',
      duration: 2000,
    });
  }, []);

  return (
    <div className="flex items-center justify-center gap-1">
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          action={action}
          onClick={() => handleAction(action)}
        />
      ))}
    </div>
  );
});

QuickActions.displayName = 'QuickActions';
