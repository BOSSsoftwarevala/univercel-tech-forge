import React from 'react';
import { motion } from 'framer-motion';
import { Bug, CheckCircle, Lock, ArrowRight, Shield } from 'lucide-react';

export type ActionStage = 'debug' | 'check' | 'lock' | 'forward' | 'complete';

interface ValaStepIndicatorProps {
  currentStage: ActionStage;
  isProcessing?: boolean;
}

const stages: { id: ActionStage; label: string; icon: React.ElementType }[] = [
  { id: 'debug', label: 'DEBUG', icon: Bug },
  { id: 'check', label: 'CHECK', icon: CheckCircle },
  { id: 'lock', label: 'LOCK', icon: Lock },
  { id: 'forward', label: 'FORWARD', icon: ArrowRight },
];

export function ValaStepIndicator({ currentStage, isProcessing }: ValaStepIndicatorProps) {
  const currentIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="flex items-center justify-center gap-1 p-3 bg-black/40 border border-zinc-800 rounded-lg">
      {stages.map((stage, idx) => {
        const isActive = stage.id === currentStage;
        const isComplete = idx < currentIndex || currentStage === 'complete';
        const Icon = stage.icon;

        return (
          <React.Fragment key={stage.id}>
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                opacity: isComplete || isActive ? 1 : 0.4
              }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded
                ${isComplete ? 'bg-emerald-500/20 text-emerald-400' : ''}
                ${isActive ? 'bg-zinc-700 text-white' : ''}
                ${!isComplete && !isActive ? 'text-zinc-600' : ''}
              `}
            >
              {isProcessing && isActive ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="text-xs font-mono font-semibold tracking-wider">
                {stage.label}
              </span>
            </motion.div>

            {idx < stages.length - 1 && (
              <div className={`w-6 h-0.5 ${isComplete ? 'bg-emerald-500/50' : 'bg-zinc-800'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
