import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle, AlertCircle, Zap } from 'lucide-react';
import type { PipelineStep } from './PMBuilderLayout';

interface PMBuilderPipelineProps {
  steps: PipelineStep[];
}

const PMBuilderPipeline = ({ steps }: PMBuilderPipelineProps) => {
  const completedCount = steps.filter(s => s.status === 'done').length;
  const isActive = steps.some(s => s.status === 'running');

  return (
    <div className="w-[220px] border-l border-border/50 bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-foreground tracking-wider uppercase">
            AI Pipeline — 10x Parallel
          </span>
        </div>
        {isActive && (
          <div className="flex items-center gap-1.5 mt-2">
            <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
            <span className="text-[10px] text-emerald-400">Processing...</span>
          </div>
        )}
        {completedCount === steps.length && completedCount > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400">All steps complete</span>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          {steps.map((step, i) => {
            const StatusIcon = 
              step.status === 'done' ? CheckCircle2 :
              step.status === 'running' ? Loader2 :
              step.status === 'error' ? AlertCircle :
              Circle;

            const iconColor = 
              step.status === 'done' ? 'text-emerald-400' :
              step.status === 'running' ? 'text-amber-400' :
              step.status === 'error' ? 'text-red-400' :
              'text-muted-foreground/40';

            const textColor =
              step.status === 'done' ? 'text-foreground' :
              step.status === 'running' ? 'text-amber-300' :
              step.status === 'error' ? 'text-red-400' :
              'text-muted-foreground/60';

            return (
              <motion.div
                key={step.id}
                className="flex items-center gap-3 py-2 px-2 rounded-md"
                animate={step.status === 'running' ? { backgroundColor: 'hsl(var(--muted) / 0.3)' } : {}}
              >
                <div className="relative">
                  <StatusIcon className={`w-4 h-4 ${iconColor} ${step.status === 'running' ? 'animate-spin' : ''}`} />
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[7px] top-[18px] w-[2px] h-4 ${
                      step.status === 'done' ? 'bg-emerald-500/40' : 'bg-muted-foreground/10'
                    }`} />
                  )}
                </div>
                <span className={`text-xs font-medium ${textColor}`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-border/30">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 rounded-md bg-muted/20">
            <p className="text-lg font-bold text-emerald-400">{completedCount}</p>
            <p className="text-[9px] text-muted-foreground uppercase">Done</p>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/20">
            <p className="text-lg font-bold text-foreground">{steps.length}</p>
            <p className="text-[9px] text-muted-foreground uppercase">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMBuilderPipeline;
