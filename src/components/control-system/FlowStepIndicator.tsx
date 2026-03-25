/**
 * Flow Step Indicator Component
 * 
 * Visual indicator for the vertical flow stages:
 * Debug → Check → Lock → Forward
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, Lock, ArrowUp, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type FlowStage = 'pending' | 'debug' | 'check' | 'lock' | 'forward' | 'completed' | 'blocked';

interface FlowStepIndicatorProps {
  currentStage: FlowStage;
  isProcessing?: boolean;
  className?: string;
}

const STEPS = [
  { id: 'debug', label: 'Debug', icon: Activity, description: 'Auto validation' },
  { id: 'check', label: 'Check', icon: CheckCircle, description: 'Risk assessment' },
  { id: 'lock', label: 'Lock', icon: Lock, description: 'Immutable lock' },
  { id: 'forward', label: 'Forward', icon: ArrowUp, description: 'Send upward' }
] as const;

export function FlowStepIndicator({ 
  currentStage, 
  isProcessing = false,
  className 
}: FlowStepIndicatorProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStage);
  const isBlocked = currentStage === 'blocked';

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div className="relative h-1 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            isBlocked ? 'bg-destructive' : 'bg-primary'
          )}
          initial={{ width: '0%' }}
          animate={{ 
            width: isBlocked ? '100%' : `${((currentIndex + 1) / STEPS.length) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {isProcessing && (
          <motion.div
            className="absolute inset-y-0 bg-primary/50"
            animate={{ 
              left: ['0%', '100%'],
              width: ['20%', '20%']
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </div>

      {/* Step Icons */}
      <div className="flex justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStage;
          const isCompleted = currentIndex > index || currentStage === 'completed';
          const isPending = currentIndex < index && !isBlocked;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 min-w-[80px]"
            >
              {/* Step Circle */}
              <motion.div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                  isActive && !isBlocked && 'bg-primary/20 border-primary text-primary',
                  isCompleted && 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
                  isPending && 'bg-muted border-border text-muted-foreground',
                  isBlocked && index >= currentIndex && 'bg-destructive/20 border-destructive text-destructive'
                )}
                initial={false}
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isActive && isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isBlocked && index >= currentIndex ? (
                  <XCircle className="w-5 h-5" />
                ) : isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </motion.div>

              {/* Step Label */}
              <div className="text-center">
                <div className={cn(
                  'font-mono text-xs font-medium uppercase',
                  isActive && 'text-primary',
                  isCompleted && 'text-emerald-400',
                  isPending && 'text-muted-foreground',
                  isBlocked && index >= currentIndex && 'text-destructive'
                )}>
                  {step.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FlowStepIndicator;
