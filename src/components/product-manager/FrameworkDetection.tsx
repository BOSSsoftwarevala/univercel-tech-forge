import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, AlertTriangle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Framework {
  name: string;
  version?: string;
  confidence: number;
  type: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops';
  status: 'detected' | 'compatible' | 'warning' | 'missing';
}

interface FrameworkDetectionProps {
  frameworks?: Framework[];
  isScanning?: boolean;
  className?: string;
}

const DEFAULT_FRAMEWORKS: Framework[] = [
  { name: 'React', version: '18.3.0', confidence: 98, type: 'frontend', status: 'detected' },
  { name: 'TypeScript', version: '5.5.3', confidence: 97, type: 'frontend', status: 'detected' },
  { name: 'Vite', version: '5.4.1', confidence: 95, type: 'devops', status: 'detected' },
  { name: 'Tailwind CSS', version: '3.4.17', confidence: 94, type: 'frontend', status: 'compatible' },
  { name: 'Supabase', version: '2.x', confidence: 90, type: 'database', status: 'detected' },
  { name: 'Node.js', version: '>=18', confidence: 88, type: 'backend', status: 'compatible' },
];

const TYPE_COLORS: Record<string, string> = {
  frontend: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  backend: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  mobile: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  database: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  devops: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  detected: CheckCircle2,
  compatible: CheckCircle2,
  warning: AlertTriangle,
  missing: Package,
};

const STATUS_COLORS: Record<string, string> = {
  detected: 'text-emerald-400',
  compatible: 'text-blue-400',
  warning: 'text-amber-400',
  missing: 'text-red-400',
};

const FrameworkDetection: React.FC<FrameworkDetectionProps> = ({
  frameworks = DEFAULT_FRAMEWORKS,
  isScanning = false,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {isScanning ? (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/60">
          <Cpu className="w-4 h-4 text-violet-400 animate-pulse" />
          <span className="text-xs text-slate-400">Scanning project for frameworks...</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {frameworks.map((fw, idx) => {
            const StatusIcon = STATUS_ICONS[fw.status];
            return (
              <motion.div
                key={fw.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 transition-colors"
              >
                {/* Status icon */}
                <StatusIcon className={cn('w-3.5 h-3.5 shrink-0', STATUS_COLORS[fw.status])} />

                {/* Name & version */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-200">{fw.name}</span>
                    {fw.version && (
                      <span className="text-[10px] text-slate-500">v{fw.version}</span>
                    )}
                  </div>
                </div>

                {/* Type badge */}
                <Badge
                  className={cn(
                    'text-[9px] h-4 px-1.5 border capitalize',
                    TYPE_COLORS[fw.type]
                  )}
                >
                  {fw.type}
                </Badge>

                {/* Confidence bar */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fw.confidence}%` }}
                      transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
                      className="h-full bg-violet-500 rounded-full"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 w-7 text-right">
                    {fw.confidence}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FrameworkDetection;
