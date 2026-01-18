/**
 * LIVE STATUS INDICATORS
 * Shows system status, AI jobs, and pending actions with auto-refresh
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatusIndicator {
  id: string;
  label: string;
  status: 'running' | 'active' | 'pending' | 'error' | 'offline';
  value?: string | number;
}

export const LiveStatusIndicators: React.FC = () => {
  const [indicators, setIndicators] = useState<StatusIndicator[]>([
    { id: 'system', label: 'System Status', status: 'running', value: 'RUNNING' },
    { id: 'ai-jobs', label: 'AI Jobs', status: 'active', value: 'ACTIVE' },
    { id: 'pending', label: 'Pending Actions', status: 'pending', value: 12 },
  ]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators(prev => prev.map(ind => {
        if (ind.id === 'pending') {
          return { ...ind, value: Math.floor(Math.random() * 20) + 5 };
        }
        return ind;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: StatusIndicator['status']) => {
    switch (status) {
      case 'running': return 'bg-emerald-500';
      case 'active': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-zinc-500';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="space-y-1.5">
      {indicators.map((indicator) => (
        <motion.div
          key={indicator.id}
          className="flex items-center justify-between px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          whileHover={{ x: 2 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className={cn("w-2 h-2 rounded-full", getStatusColor(indicator.status))}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[11px] text-white/80 font-medium">{indicator.label}</span>
          </div>
          <span className={cn(
            "text-[10px] font-bold",
            indicator.status === 'running' ? 'text-emerald-400' :
            indicator.status === 'active' ? 'text-blue-400' :
            indicator.status === 'pending' ? 'text-amber-400' : 'text-white/60'
          )}>
            {indicator.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
