import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, AlertCircle, Info, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  file?: string;
  line?: number;
  cwe?: string;
}

interface SecurityIssuesPanelProps {
  issues?: SecurityIssue[];
  isLoading?: boolean;
  className?: string;
}

const DEFAULT_ISSUES: SecurityIssue[] = [
  {
    id: '1',
    severity: 'high',
    title: 'Exposed API Key in Source',
    description: 'API key found in environment variable usage without proper validation.',
    file: 'src/config.ts',
    line: 12,
    cwe: 'CWE-312',
  },
  {
    id: '2',
    severity: 'medium',
    title: 'Missing Rate Limiting',
    description: 'Authentication endpoint lacks rate limiting protection.',
    file: 'src/api/auth.ts',
    line: 45,
    cwe: 'CWE-307',
  },
  {
    id: '3',
    severity: 'low',
    title: 'Outdated Dependency',
    description: 'Package lodash@4.17.20 has known vulnerability. Update to 4.17.21+.',
    cwe: 'CVE-2021-23337',
  },
  {
    id: '4',
    severity: 'info',
    title: 'CORS Configuration',
    description: 'CORS policy allows wildcard origins. Consider restricting to specific domains.',
  },
];

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  critical: { color: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/40', icon: Lock },
  high: { color: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-500/40', icon: AlertCircle },
  medium: { color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/40', icon: AlertTriangle },
  low: { color: 'text-blue-300', bg: 'bg-blue-500/10', border: 'border-blue-500/40', icon: Shield },
  info: { color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/40', icon: Info },
};

const SecurityIssuesPanel: React.FC<SecurityIssuesPanelProps> = ({
  issues = DEFAULT_ISSUES,
  isLoading = false,
  className,
}) => {
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const highCount = issues.filter((i) => i.severity === 'high').length;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Summary row */}
      <div className="flex items-center gap-2 flex-wrap">
        {criticalCount > 0 && (
          <Badge className="text-[10px] bg-red-500/15 text-red-300 border border-red-500/30 px-2 py-0">
            {criticalCount} Critical
          </Badge>
        )}
        {highCount > 0 && (
          <Badge className="text-[10px] bg-orange-500/15 text-orange-300 border border-orange-500/30 px-2 py-0">
            {highCount} High
          </Badge>
        )}
        <span className="text-[10px] text-slate-500 ml-auto">{issues.length} total</span>
      </div>

      {/* Issues list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Shield className="w-4 h-4 text-violet-400 animate-pulse" />
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-6">
          <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs text-emerald-400 font-medium">No security issues found</p>
          <p className="text-[10px] text-slate-600 mt-1">Your project looks clean!</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {issues.map((issue, idx) => {
            const config = SEVERITY_CONFIG[issue.severity];
            const Icon = config.icon;
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  'p-2.5 rounded-lg border',
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon className={cn('w-3.5 h-3.5 mt-0.5 shrink-0', config.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('text-xs font-medium', config.color)}>
                        {issue.title}
                      </span>
                      <Badge
                        className={cn(
                          'text-[9px] h-3.5 px-1.5 border capitalize',
                          config.bg,
                          config.color,
                          config.border
                        )}
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                      {issue.description}
                    </p>
                    {(issue.file || issue.cwe) && (
                      <div className="flex items-center gap-2 mt-1">
                        {issue.file && (
                          <span className="text-[9px] font-mono text-slate-600">
                            {issue.file}{issue.line ? `:${issue.line}` : ''}
                          </span>
                        )}
                        {issue.cwe && (
                          <span className="text-[9px] text-slate-600">{issue.cwe}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SecurityIssuesPanel;
