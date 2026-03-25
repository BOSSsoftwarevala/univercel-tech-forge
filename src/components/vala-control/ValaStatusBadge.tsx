import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Lock, ArrowUpRight, AlertTriangle, CheckCircle } from 'lucide-react';

export type ActionStatus = 'pending' | 'locked' | 'forwarded' | 'blocked' | 'complete';

interface ValaStatusBadgeProps {
  status: ActionStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<ActionStatus, {
  label: string;
  icon: React.ElementType;
  bg: string;
  text: string;
  border: string;
}> = {
  pending: {
    label: 'PENDING',
    icon: Clock,
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30'
  },
  locked: {
    label: 'LOCKED',
    icon: Lock,
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30'
  },
  forwarded: {
    label: 'FORWARDED',
    icon: ArrowUpRight,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30'
  },
  blocked: {
    label: 'BLOCKED',
    icon: AlertTriangle,
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30'
  },
  complete: {
    label: 'COMPLETE',
    icon: CheckCircle,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30'
  }
};

export function ValaStatusBadge({ status, size = 'md' }: ValaStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-1.5 font-mono font-semibold tracking-wider
        rounded border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}
      `}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </motion.div>
  );
}
