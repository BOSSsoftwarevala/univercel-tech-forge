import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle2, AlertTriangle, X, Clock, Server, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CheckItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  detail?: string;
}

interface DeploymentReadinessProps {
  score?: number;
  checks?: CheckItem[];
  environment?: string;
  onDeploy?: () => void;
  className?: string;
}

const DEFAULT_CHECKS: CheckItem[] = [
  { id: '1', label: 'Build successful', status: 'pass', detail: 'Last build 2 min ago' },
  { id: '2', label: 'Tests passing', status: 'pass', detail: '127/127 tests passed' },
  { id: '3', label: 'No critical vulnerabilities', status: 'warning', detail: '2 medium issues' },
  { id: '4', label: 'Environment variables set', status: 'pass', detail: 'All 14 vars configured' },
  { id: '5', label: 'Database migrations', status: 'pass', detail: 'Migrations up to date' },
  { id: '6', label: 'Server capacity', status: 'pass', detail: 'Load at 34%' },
  { id: '7', label: 'Backup configured', status: 'pending', detail: 'Checking...' },
];

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  pass: { icon: CheckCircle2, color: 'text-emerald-400' },
  fail: { icon: X, color: 'text-red-400' },
  warning: { icon: AlertTriangle, color: 'text-amber-400' },
  pending: { icon: Clock, color: 'text-slate-500' },
};

const DeploymentReadiness: React.FC<DeploymentReadinessProps> = ({
  score = 84,
  checks = DEFAULT_CHECKS,
  environment = 'Production',
  onDeploy,
  className,
}) => {
  const passingCount = checks.filter((c) => c.status === 'pass').length;
  const failingCount = checks.filter((c) => c.status === 'fail').length;
  const isReady = failingCount === 0 && score >= 80;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Score ring */}
      <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(71,85,105,0.3)" strokeWidth="4" />
            <motion.circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 22}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - score / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                'text-sm font-bold',
                score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
              )}
            >
              {score}%
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-200">Deployment Readiness</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {passingCount}/{checks.length} checks passed
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <Server className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] text-slate-500">{environment}</span>
            <GitBranch className="w-3 h-3 text-slate-500 ml-1" />
            <span className="text-[10px] text-slate-500">main</span>
          </div>
        </div>
      </div>

      {/* Checks list */}
      <div className="space-y-1">
        {checks.map((check, idx) => {
          const config = STATUS_CONFIG[check.status];
          const Icon = config.icon;
          return (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800/40 transition-colors"
            >
              <Icon className={cn('w-3.5 h-3.5 shrink-0', config.color)} />
              <span className="text-[11px] text-slate-300 flex-1">{check.label}</span>
              {check.detail && (
                <span className="text-[10px] text-slate-600">{check.detail}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Deploy button */}
      <Button
        onClick={onDeploy}
        disabled={!isReady}
        className={cn(
          'w-full h-9 text-xs font-medium transition-all',
          isReady
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
        )}
      >
        <Rocket className="w-3.5 h-3.5 mr-2" />
        {isReady ? 'Deploy to Production' : 'Fix Issues Before Deploying'}
      </Button>
    </div>
  );
};

export default DeploymentReadiness;
