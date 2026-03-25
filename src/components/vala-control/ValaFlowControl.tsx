import { motion } from 'framer-motion';
import { 
  Play, CheckCircle, Lock, ArrowRight, 
  Loader2, AlertTriangle, Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useValaSecurity } from '@/contexts/ValaSecurityContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type FlowStep = 'debug' | 'check' | 'lock' | 'forward';

interface ValaFlowControlProps {
  currentStep: FlowStep;
  actionData: Record<string, any>;
  onStepComplete: (step: FlowStep, checksum: string) => void;
  onForward: (checksum: string) => void;
  disabled?: boolean;
}

const STEP_CONFIG: Record<FlowStep, { icon: any; label: string; action: string; color: string }> = {
  debug: { icon: Play, label: 'Debug', action: 'Run Debug', color: 'from-amber-500 to-orange-500' },
  check: { icon: CheckCircle, label: 'Check', action: 'Verify Data', color: 'from-blue-500 to-cyan-500' },
  lock: { icon: Lock, label: 'Lock', action: 'Lock Entry', color: 'from-violet-500 to-purple-500' },
  forward: { icon: ArrowRight, label: 'Forward', action: 'Forward to Next', color: 'from-emerald-500 to-teal-500' },
};

const ValaFlowControl = ({
  currentStep,
  actionData,
  onStepComplete,
  onForward,
  disabled = false,
}: ValaFlowControlProps) => {
  const { logAction, generateChecksum, valaId } = useValaSecurity();
  const [processing, setProcessing] = useState(false);
  const [stepStatus, setStepStatus] = useState<Record<FlowStep, 'pending' | 'processing' | 'complete' | 'error'>>({
    debug: 'pending',
    check: 'pending',
    lock: 'pending',
    forward: 'pending',
  });

  const executeStep = async (step: FlowStep) => {
    if (disabled || processing) return;

    setProcessing(true);
    setStepStatus(prev => ({ ...prev, [step]: 'processing' }));

    try {
      // Generate checksum for the action
      const checksum = generateChecksum({
        step,
        data: actionData,
        valaId,
        timestamp: Date.now(),
      });

      // Simulate step processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Log the action
      const logged = await logAction(`step_${step}`, checksum);
      
      if (!logged) {
        throw new Error('Failed to log action');
      }

      setStepStatus(prev => ({ ...prev, [step]: 'complete' }));

      if (step === 'forward') {
        onForward(checksum);
        toast.success('Action Forwarded', {
          description: `Checksum: ${checksum.substring(0, 8)}...`,
        });
      } else {
        onStepComplete(step, checksum);
        toast.success(`${STEP_CONFIG[step].label} Complete`, {
          description: 'Proceeding to next step',
        });
      }
    } catch (error) {
      setStepStatus(prev => ({ ...prev, [step]: 'error' }));
      toast.error('Action Failed', {
        description: 'Could not complete this step. Try again.',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStepOrder = (): FlowStep[] => ['debug', 'check', 'lock', 'forward'];
  const stepOrder = getStepOrder();
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="space-y-6">
      {/* Flow Progress */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Action Flow Control
        </h3>

        <div className="flex items-center justify-between">
          {stepOrder.map((step, index) => {
            const config = STEP_CONFIG[step];
            const status = stepStatus[step];
            const isActive = step === currentStep;
            const isComplete = index < currentIndex || status === 'complete';
            const Icon = config.icon;

            return (
              <div key={step} className="flex items-center">
                <motion.div
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
                  className={cn(
                    'flex flex-col items-center',
                    isComplete && 'opacity-60',
                    !isActive && !isComplete && 'opacity-40'
                  )}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all',
                    isComplete && 'bg-emerald-500/20 border border-emerald-500/50',
                    isActive && 'bg-blue-500/20 border-2 border-blue-500',
                    !isActive && !isComplete && 'bg-slate-800 border border-slate-700'
                  )}>
                    {status === 'processing' ? (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    ) : isComplete ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : status === 'error' ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <Icon className={cn(
                        'w-5 h-5',
                        isActive ? 'text-blue-400' : 'text-slate-500'
                      )} />
                    )}
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-blue-400' : 'text-slate-500'
                  )}>
                    {config.label}
                  </span>
                </motion.div>

                {index < stepOrder.length - 1 && (
                  <div className={cn(
                    'w-16 h-0.5 mx-3',
                    isComplete ? 'bg-emerald-500' : 'bg-slate-700'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Action Button */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-slate-900/50 border border-slate-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {STEP_CONFIG[currentStep].label} Action
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {currentStep === 'forward' 
                ? 'Submit to next role for approval'
                : `Execute ${STEP_CONFIG[currentStep].label.toLowerCase()} verification`
              }
            </p>
          </div>

          <Button
            onClick={() => executeStep(currentStep)}
            disabled={disabled || processing || stepStatus[currentStep] === 'complete'}
            className={cn(
              'bg-gradient-to-r px-6',
              STEP_CONFIG[currentStep].color,
              'hover:opacity-90 disabled:opacity-50'
            )}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : stepStatus[currentStep] === 'complete' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                {(() => {
                  const Icon = STEP_CONFIG[currentStep].icon;
                  return <Icon className="w-4 h-4 mr-2" />;
                })()}
                {STEP_CONFIG[currentStep].action}
              </>
            )}
          </Button>
        </div>

        {/* Checksum Display */}
        {stepStatus[currentStep] === 'complete' && (
          <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3 h-3" />
              <span>Checksum verified and logged</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Warning Notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-300">
          <p className="font-medium mb-1">No Edit After Submit</p>
          <p className="text-amber-400/80">
            Once an action is forwarded, it cannot be edited or deleted. 
            All actions are logged in an append-only ledger.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValaFlowControl;
