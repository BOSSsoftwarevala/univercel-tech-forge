import { motion } from 'framer-motion';
import { Bug, AlertTriangle, Clock, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BugItem {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  slaTimer: string;
  reopenCount: number;
  status: 'open' | 'in_progress' | 'fixed';
}

interface BugHandlingCardProps {
  bugs: BugItem[];
  onMarkFixed: (bugId: string) => void;
  onReopen: (bugId: string) => void;
}

const severityConfig = {
  low: { label: 'Low', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  medium: { label: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  high: { label: 'High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  critical: { label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const BugHandlingCard = ({ bugs, onMarkFixed, onReopen }: BugHandlingCardProps) => {
  const activeBugs = bugs.filter(b => b.status !== 'fixed');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-red-500/20">
          <Bug className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Bug & Issue Handling</h3>
        {activeBugs.length > 0 && (
          <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
            {activeBugs.length} active
          </Badge>
        )}
      </div>

      {bugs.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Bug className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No bugs assigned</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {bugs.map((bug) => (
            <motion.div
              key={bug.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border transition-all ${
                bug.status === 'fixed'
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-red-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500 font-mono">{bug.id}</span>
                    <Badge variant="outline" className={severityConfig[bug.severity].color}>
                      {bug.severity === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {severityConfig[bug.severity].label}
                    </Badge>
                    {bug.reopenCount > 0 && (
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        Reopened {bug.reopenCount}x
                      </Badge>
                    )}
                  </div>
                  <h4 className={`font-medium ${bug.status === 'fixed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                    {bug.title}
                  </h4>
                </div>
                {bug.status !== 'fixed' && (
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{bug.slaTimer}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {bug.status !== 'fixed' ? (
                  <Button
                    size="sm"
                    onClick={() => onMarkFixed(bug.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Fixed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReopen(bug.id)}
                    className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reopen
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BugHandlingCard;
