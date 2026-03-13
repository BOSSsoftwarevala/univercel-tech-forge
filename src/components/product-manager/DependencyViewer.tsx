import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Dependency {
  name: string;
  version: string;
  latest?: string;
  status: 'ok' | 'outdated' | 'vulnerable' | 'missing';
  type: 'dependency' | 'devDependency';
}

interface DependencyViewerProps {
  dependencies?: Dependency[];
  isLoading?: boolean;
  className?: string;
}

const DEFAULT_DEPS: Dependency[] = [
  { name: 'react', version: '18.3.1', latest: '18.3.1', status: 'ok', type: 'dependency' },
  { name: 'react-dom', version: '18.3.1', latest: '18.3.1', status: 'ok', type: 'dependency' },
  { name: 'framer-motion', version: '12.23.26', latest: '12.23.26', status: 'ok', type: 'dependency' },
  { name: 'lucide-react', version: '0.462.0', latest: '0.512.0', status: 'outdated', type: 'dependency' },
  { name: '@tanstack/react-query', version: '5.56.2', latest: '5.62.0', status: 'outdated', type: 'dependency' },
  { name: 'typescript', version: '5.5.3', latest: '5.8.2', status: 'outdated', type: 'devDependency' },
  { name: 'vite', version: '5.4.1', latest: '6.2.0', status: 'outdated', type: 'devDependency' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ok: { label: 'Up to date', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2 },
  outdated: { label: 'Outdated', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: AlertTriangle },
  vulnerable: { label: 'Vulnerable', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: AlertTriangle },
  missing: { label: 'Missing', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30', icon: Package },
};

const DependencyViewer: React.FC<DependencyViewerProps> = ({
  dependencies = DEFAULT_DEPS,
  isLoading = false,
  className,
}) => {
  const [filter, setFilter] = useState<'all' | 'outdated' | 'vulnerable'>('all');

  const filtered = dependencies.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const counts = {
    all: dependencies.length,
    outdated: dependencies.filter((d) => d.status === 'outdated').length,
    vulnerable: dependencies.filter((d) => d.status === 'vulnerable').length,
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Filter tabs */}
      <div className="flex items-center gap-1">
        {(['all', 'outdated', 'vulnerable'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-2.5 py-1 text-[11px] rounded-md capitalize transition-colors',
              filter === f
                ? 'bg-slate-700 text-slate-200'
                : 'text-slate-500 hover:text-slate-400'
            )}
          >
            {f}
            {counts[f] > 0 && (
              <span
                className={cn(
                  'ml-1.5 px-1.5 py-0.5 rounded-full text-[9px]',
                  f === 'vulnerable'
                    ? 'bg-red-500/20 text-red-400'
                    : f === 'outdated'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-slate-700 text-slate-400'
                )}
              >
                {counts[f]}
              </span>
            )}
          </button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-6 w-6 p-0 text-slate-500 hover:text-slate-300"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Dependency list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-4 h-4 text-violet-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((dep, idx) => {
            const config = STATUS_CONFIG[dep.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={dep.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800/40 group transition-colors"
              >
                <Package className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-300">{dep.name}</span>
                    <span className="text-[10px] text-slate-600">{dep.version}</span>
                    {dep.latest && dep.latest !== dep.version && (
                      <span className="text-[10px] text-emerald-500">→ {dep.latest}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600">{dep.type}</span>
                </div>
                <Badge className={cn('text-[9px] h-4 px-1.5 border shrink-0', config.color)}>
                  <StatusIcon className="w-2.5 h-2.5 mr-1" />
                  {config.label}
                </Badge>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DependencyViewer;
