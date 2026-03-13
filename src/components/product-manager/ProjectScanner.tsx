import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine, Play, CheckCircle2, AlertTriangle, Loader2,
  FolderSearch, GitBranch, Package, Shield, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ScanResult {
  category: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
  count?: number;
}

interface ProjectScannerProps {
  onScanComplete?: (results: ScanResult[]) => void;
  className?: string;
}

const SCAN_STEPS = [
  { id: 'structure', label: 'Project Structure', icon: FolderSearch, duration: 600 },
  { id: 'frameworks', label: 'Framework Detection', icon: Zap, duration: 800 },
  { id: 'dependencies', label: 'Dependency Analysis', icon: Package, duration: 1000 },
  { id: 'security', label: 'Security Audit', icon: Shield, duration: 900 },
  { id: 'compatibility', label: 'Compatibility Check', icon: GitBranch, duration: 700 },
];

const DEMO_RESULTS: ScanResult[] = [
  { category: 'Project Structure', status: 'pass', detail: '47 files scanned, structure valid' },
  { category: 'Framework Detection', status: 'pass', detail: 'React 18 + TypeScript detected', count: 6 },
  { category: 'Dependencies', status: 'warn', detail: '4 packages need updates', count: 247 },
  { category: 'Security', status: 'warn', detail: '2 medium issues found', count: 2 },
  { category: 'Compatibility', status: 'pass', detail: 'Compatible with target environment' },
];

const ProjectScanner: React.FC<ProjectScannerProps> = ({
  onScanComplete,
  className,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [results, setResults] = useState<ScanResult[] | null>(null);
  const [progress, setProgress] = useState(0);

  const runScan = async () => {
    setIsScanning(true);
    setCompletedSteps([]);
    setResults(null);
    setProgress(0);

    for (let i = 0; i < SCAN_STEPS.length; i++) {
      const step = SCAN_STEPS[i];
      setCurrentStep(i);
      setProgress(Math.round((i / SCAN_STEPS.length) * 90));

      await new Promise((res) => setTimeout(res, step.duration));
      setCompletedSteps((prev) => [...prev, step.id]);
    }

    setProgress(100);
    setCurrentStep(-1);
    setIsScanning(false);
    setResults(DEMO_RESULTS);
    onScanComplete?.(DEMO_RESULTS);
    toast.success('Project scan complete', { description: 'Results are ready for review' });
  };

  const STATUS_ICON = {
    pass: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    warn: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
    fail: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Scan trigger */}
      <div className="flex items-center gap-3">
        <Button
          onClick={runScan}
          disabled={isScanning}
          className={cn(
            'gap-2 h-9 text-xs font-medium',
            isScanning
              ? 'bg-slate-800 text-slate-500'
              : 'bg-violet-600 hover:bg-violet-500 text-white'
          )}
        >
          {isScanning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ScanLine className="w-3.5 h-3.5" />
          )}
          {isScanning ? 'Scanning...' : 'Scan Project'}
        </Button>
        {results && !isScanning && (
          <Button
            onClick={runScan}
            variant="outline"
            className="gap-2 h-9 text-xs border-slate-700 text-slate-400 hover:text-slate-200"
          >
            <Play className="w-3.5 h-3.5" />
            Re-scan
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Progress value={progress} className="h-1.5 bg-slate-800" />

            {/* Scan steps */}
            <div className="space-y-1.5">
              {SCAN_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isDone = completedSteps.includes(step.id);
                const isActive = currentStep === idx;
                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex items-center gap-2.5 p-2 rounded-lg transition-colors',
                      isActive ? 'bg-violet-500/10 border border-violet-500/20' : '',
                      isDone ? 'opacity-60' : isActive ? 'opacity-100' : 'opacity-30'
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin shrink-0" />
                    ) : (
                      <Icon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span
                      className={cn(
                        'text-xs',
                        isActive ? 'text-violet-300' : isDone ? 'text-slate-400' : 'text-slate-600'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1.5"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Scan Results</p>
            {results.map((result, idx) => (
              <motion.div
                key={result.category}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50"
              >
                {STATUS_ICON[result.status]}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300">{result.category}</p>
                  <p className="text-[10px] text-slate-500">{result.detail}</p>
                </div>
                {result.count !== undefined && (
                  <span className="text-[10px] text-slate-600 shrink-0">{result.count}</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectScanner;
