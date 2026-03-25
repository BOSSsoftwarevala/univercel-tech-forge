/**
 * LIVE STATUS INDICATORS
 * Shows system status, AI jobs, and pending actions
 * OPTIMIZED: Reduced animations, memoized components
 */

import React, { useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface StatusIndicator {
  id: string;
  label: string;
  status: 'running' | 'active' | 'pending' | 'error' | 'offline';
  value?: string | number;
}

const StatusDot = memo<{ status: StatusIndicator['status'] }>(({ status }) => {
  const color = {
    running: 'bg-emerald-500',
    active: 'bg-blue-500',
    pending: 'bg-amber-500',
    error: 'bg-red-500',
    offline: 'bg-zinc-500',
  }[status] || 'bg-zinc-500';
  
  // Only pulse for running status, use CSS animation instead of framer-motion
  return (
    <div className={cn(
      "w-2 h-2 rounded-full",
      color,
      status === 'running' && "animate-pulse"
    )} />
  );
});

StatusDot.displayName = 'StatusDot';

const StatusRow = memo<{ indicator: StatusIndicator }>(({ indicator }) => {
  const textColor = {
    running: 'text-emerald-400',
    active: 'text-blue-400',
    pending: 'text-amber-400',
    error: 'text-red-400',
    offline: 'text-white/60',
  }[indicator.status] || 'text-white/60';

  return (
    <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
      <div className="flex items-center gap-2">
        <StatusDot status={indicator.status} />
        <span className="text-[11px] text-white/80 font-medium">{indicator.label}</span>
      </div>
      <span className={cn("text-[10px] font-bold", textColor)}>
        {indicator.value}
      </span>
    </div>
  );
});

StatusRow.displayName = 'StatusRow';

export const LiveStatusIndicators: React.FC = memo(() => {
  const [indicators, setIndicators] = useState<StatusIndicator[]>([
    { id: 'system', label: 'System Status', status: 'running', value: 'RUNNING' },
    { id: 'ai-jobs', label: 'AI Jobs', status: 'active', value: 'ACTIVE' },
    { id: 'pending', label: 'Pending Actions', status: 'pending', value: 12 },
  ]);

  // Refresh every 30 seconds instead of 5 (less frequent updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators(prev => prev.map(ind => {
        if (ind.id === 'pending') {
          return { ...ind, value: Math.floor(Math.random() * 20) + 5 };
        }
        return ind;
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1.5">
      {indicators.map((indicator) => (
        <StatusRow key={indicator.id} indicator={indicator} />
      ))}
    </div>
  );
});

LiveStatusIndicators.displayName = 'LiveStatusIndicators';
