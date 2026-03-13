import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle, AlertCircle, Zap, Cpu, Shield, Rocket } from 'lucide-react';
import type { PipelineStep } from './PMBuilderLayout';

interface PMBuilderPipelineProps {
  steps: PipelineStep[];
}

const PMBuilderPipeline = ({ steps }: PMBuilderPipelineProps) => {
  const completedCount = steps.filter(s => s.status === 'done').length;
  const isActive = steps.some(s => s.status === 'running');
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="w-[240px] border-l border-border/50 bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-foreground tracking-wider uppercase block leading-tight">
              AI Pipeline
            </span>
            <span className="text-[9px] text-muted-foreground">13-Stage Autonomous</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] text-muted-foreground">{completedCount}/{steps.length} steps</span>
          {isActive && (
            <div className="flex items-center gap-1">
              <Loader2 className="w-2.5 h-2.5 text-emerald-400 animate-spin" />
              <span className="text-[9px] text-emerald-400 font-medium">Processing</span>
            </div>
          )}
          {completedCount === steps.length && completedCount > 0 && (
            <div className="flex items-center gap-1">
              <Rocket className="w-2.5 h-2.5 text-emerald-400" />
              <span className="text-[9px] text-emerald-400 font-medium">Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-auto px-3 py-3">
        <div className="space-y-0.5">
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
              'text-muted-foreground/30';

            const textColor =
              step.status === 'done' ? 'text-foreground/90' :
              step.status === 'running' ? 'text-amber-300' :
              step.status === 'error' ? 'text-red-400' :
              'text-muted-foreground/50';

            const bgClass =
              step.status === 'running' ? 'bg-amber-500/5 border border-amber-500/10' :
              step.status === 'done' ? 'bg-emerald-500/5' :
              '';

            return (
              <motion.div
                key={step.id}
                className={`flex items-center gap-2.5 py-1.5 px-2 rounded-md ${bgClass}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="relative shrink-0">
                  <StatusIcon className={`w-3.5 h-3.5 ${iconColor} ${step.status === 'running' ? 'animate-spin' : ''}`} />
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[6px] top-[16px] w-[1.5px] h-3 ${
                      step.status === 'done' ? 'bg-emerald-500/30' : 'bg-muted-foreground/8'
                    }`} />
                  )}
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] text-muted-foreground/40 font-mono w-4 shrink-0">{String(step.id).padStart(2, '0')}</span>
                  <span className={`text-[11px] font-medium ${textColor} truncate`}>
                    {step.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer stats */}
      <div className="p-3 border-t border-border/30">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="text-center p-1.5 rounded-md bg-muted/15">
            <p className="text-sm font-bold text-emerald-400">{completedCount}</p>
            <p className="text-[8px] text-muted-foreground uppercase">Done</p>
          </div>
          <div className="text-center p-1.5 rounded-md bg-muted/15">
            <p className="text-sm font-bold text-amber-400">{steps.filter(s => s.status === 'running').length}</p>
            <p className="text-[8px] text-muted-foreground uppercase">Active</p>
          </div>
          <div className="text-center p-1.5 rounded-md bg-muted/15">
            <p className="text-sm font-bold text-foreground/70">{steps.length}</p>
            <p className="text-[8px] text-muted-foreground uppercase">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMBuilderPipeline;
