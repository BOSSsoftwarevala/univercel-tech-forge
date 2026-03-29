import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Lock, AlertTriangle, CheckCircle, 
  Hash, Clock, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ValaStatusBadge, ActionStatus } from './ValaStatusBadge';
import { ValaStepIndicator, ActionStage } from './ValaStepIndicator';
import { toast } from 'sonner';

interface ValaActionCardProps {
  actionId: string;
  title: string;
  timestamp: number;
  status: ActionStatus;
  stage: ActionStage;
  checksum: string;
  onProcess?: (actionId: string) => Promise<void>;
  disabled?: boolean;
}

export function ValaActionCard({
  actionId,
  title,
  timestamp,
  status,
  stage,
  checksum,
  onProcess,
  disabled
}: ValaActionCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<ActionStage>(stage);
  const [currentStatus, setCurrentStatus] = useState<ActionStatus>(status);

  const handleProcess = useCallback(async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);

    try {
      // Simulate stage progression
      const stages: ActionStage[] = ['debug', 'check', 'lock', 'forward', 'complete'];
      const currentIdx = stages.indexOf(currentStage);

      for (let i = currentIdx; i < stages.length - 1; i++) {
        setCurrentStage(stages[i]);
        await new Promise(r => setTimeout(r, 800));
      }

      setCurrentStage('complete');
      setCurrentStatus('forwarded');
      
      if (onProcess) await onProcess(actionId);
      
      toast.success('Action forwarded to next level');
    } catch (err) {
      setCurrentStatus('blocked');
      toast.error('Processing failed');
    } finally {
      setIsProcessing(false);
    }
  }, [actionId, currentStage, disabled, isProcessing, onProcess]);

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const canProcess = currentStatus === 'pending' && !disabled && !isProcessing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-black rounded">
            <Hash className="w-3 h-3 text-zinc-500" />
            <span className="font-mono text-xs text-zinc-400">{actionId}</span>
          </div>
          <h3 className="font-medium text-zinc-100">{title}</h3>
        </div>
        <ValaStatusBadge status={currentStatus} size="sm" />
      </div>

      {/* Step Indicator */}
      <div className="px-4 py-3 border-b border-zinc-800/50">
        <ValaStepIndicator currentStage={currentStage} isProcessing={isProcessing} />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{formatTime(timestamp)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span className="font-mono">{checksum.slice(0, 8)}...</span>
          </div>
        </div>

        <Button
          onClick={handleProcess}
          disabled={!canProcess}
          size="sm"
          className={`
            font-mono text-xs tracking-wider
            ${canProcess 
              ? 'bg-white text-black hover:bg-zinc-200' 
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }
          `}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mr-2"
              >
                <Lock className="w-3 h-3" />
              </motion.div>
              PROCESSING
            </>
          ) : currentStatus === 'forwarded' ? (
            <>
              <CheckCircle className="w-3 h-3 mr-2" />
              FORWARDED
            </>
          ) : currentStatus === 'blocked' ? (
            <>
              <AlertTriangle className="w-3 h-3 mr-2" />
              BLOCKED
            </>
          ) : (
            <>
              PROCESS
              <ChevronRight className="w-3 h-3 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
