/**
 * LIVE COMMITMENTS / QUEUE
 * Shows SLA timers and priority items
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Commitment {
  id: string;
  country: string;
  module: string;
  slaSeconds: number;
  priority: 'high' | 'medium' | 'low';
}

export const LiveCommitments: React.FC = () => {
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([
    { id: '1', country: 'USA', module: 'Finance', slaSeconds: 1800, priority: 'high' },
    { id: '2', country: 'UK', module: 'Support', slaSeconds: 3600, priority: 'medium' },
    { id: '3', country: 'DE', module: 'Legal', slaSeconds: 7200, priority: 'low' },
  ]);

  // SLA countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCommitments(prev => prev.map(c => ({
        ...c,
        slaSeconds: Math.max(0, c.slaSeconds - 1)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const getPriorityColor = (priority: Commitment['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <>
      <div className="space-y-1.5">
        {commitments.map((commitment) => (
          <motion.div
            key={commitment.id}
            onClick={() => setSelectedCommitment(commitment)}
            className={cn(
              "px-2 py-1.5 rounded-md border transition-colors cursor-pointer",
              getPriorityColor(commitment.priority)
            )}
            whileHover={{ x: 2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold">{commitment.country}</span>
                <span className="text-[9px] opacity-70">•</span>
                <span className="text-[10px] opacity-80">{commitment.module}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span className={cn(
                  "text-[10px] font-mono font-bold",
                  commitment.slaSeconds < 600 && "animate-pulse"
                )}>
                  {formatTime(commitment.slaSeconds)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Commitment Detail Drawer */}
      <AnimatePresence>
        {selectedCommitment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedCommitment(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{selectedCommitment.country} - {selectedCommitment.module}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{selectedCommitment.priority} Priority</p>
                </div>
                <button
                  onClick={() => setSelectedCommitment(null)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 p-4 space-y-4">
                <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                  <AlertTriangle className={cn(
                    "w-5 h-5",
                    selectedCommitment.priority === 'high' ? 'text-red-400' :
                    selectedCommitment.priority === 'medium' ? 'text-amber-400' : 'text-blue-400'
                  )} />
                  <div>
                    <p className="text-xs text-muted-foreground">Time Remaining</p>
                    <p className="text-lg font-bold font-mono">
                      {formatTime(selectedCommitment.slaSeconds)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">Country</label>
                  <p className="text-sm font-medium">{selectedCommitment.country}</p>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">Module</label>
                  <p className="text-sm font-medium">{selectedCommitment.module}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
