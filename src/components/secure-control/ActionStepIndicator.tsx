import { CheckCircle, Loader2, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type ActionStep = 'pending' | 'debug' | 'check' | 'lock' | 'forward' | 'complete' | 'blocked';

interface ActionStepIndicatorProps {
  currentStep: ActionStep;
  className?: string;
}

const steps = [
  { id: 'debug', label: 'Debug' },
  { id: 'check', label: 'Check' },
  { id: 'lock', label: 'Lock' },
  { id: 'forward', label: 'Forward' }
];

const stepOrder: Record<ActionStep, number> = {
  pending: -1,
  debug: 0,
  check: 1,
  lock: 2,
  forward: 3,
  complete: 4,
  blocked: -2
};

export function ActionStepIndicator({ currentStep, className }: ActionStepIndicatorProps) {
  const currentIndex = stepOrder[currentStep];
  const isBlocked = currentStep === 'blocked';

  const getStepStatus = (stepIndex: number) => {
    if (isBlocked) return 'blocked';
    if (currentIndex === 4) return 'complete'; // All complete
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'active':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Lock className="h-4 w-4 text-neutral-600" />;
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        
        return (
          <div key={step.id} className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ 
                scale: status === 'active' ? 1.1 : 1,
                opacity: status === 'pending' ? 0.4 : 1
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded border",
                status === 'complete' && "bg-green-950/30 border-green-800/50",
                status === 'active' && "bg-blue-950/30 border-blue-800/50",
                status === 'blocked' && "bg-red-950/30 border-red-800/50",
                status === 'pending' && "bg-neutral-900/50 border-neutral-800/50"
              )}
            >
              {getStepIcon(status)}
              <span className={cn(
                "text-xs font-medium uppercase tracking-wider",
                status === 'complete' && "text-green-400",
                status === 'active' && "text-blue-400",
                status === 'blocked' && "text-red-400",
                status === 'pending' && "text-neutral-600"
              )}>
                {step.label}
              </span>
            </motion.div>
            
            {index < steps.length - 1 && (
              <ArrowRight className={cn(
                "h-4 w-4",
                index < currentIndex ? "text-green-600" : "text-neutral-700"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
