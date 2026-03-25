import { motion } from 'framer-motion';
import { 
  Bug, AlertTriangle, AlertCircle, Info, Bot, 
  Timer, Link2, CheckCircle2, Clock
} from 'lucide-react';

const bugs = [
  {
    id: 'BUG-001',
    title: 'Invoice PDF not rendering properly',
    severity: 'high',
    status: 'open',
    reproSteps: 'Navigate to Invoice > Generate > PDF format',
    commitLink: '#commit-abc123',
    reportedAt: '2 hours ago',
    aiSuggestion: 'Check PDF library version compatibility'
  },
  {
    id: 'BUG-002',
    title: 'Dashboard chart data delay',
    severity: 'medium',
    status: 'in_progress',
    reproSteps: 'Load dashboard with large dataset',
    commitLink: '#commit-def456',
    reportedAt: '5 hours ago',
    aiSuggestion: 'Implement data pagination or virtualization'
  },
  {
    id: 'BUG-003',
    title: 'Minor styling issue in mobile nav',
    severity: 'low',
    status: 'open',
    reproSteps: 'Open app on mobile < 375px width',
    commitLink: null,
    reportedAt: '1 day ago',
    aiSuggestion: 'Add responsive breakpoint for small devices'
  },
];

const BugTracker = () => {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high':
        return { 
          icon: AlertTriangle, 
          color: 'text-red-400', 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/30',
          label: 'Critical'
        };
      case 'medium':
        return { 
          icon: AlertCircle, 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/30',
          label: 'Medium'
        };
      default:
        return { 
          icon: Info, 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/30',
          label: 'Low'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Bug Tracker</h2>
          <p className="text-slate-400 mt-1">Track and resolve issues</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {bugs.filter(b => b.severity === 'high').length} Critical
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
            {bugs.filter(b => b.status === 'open').length} Open
          </span>
        </div>
      </div>

      {/* Bug List */}
      <div className="space-y-4">
        {bugs.map((bug, index) => {
          const severityConfig = getSeverityConfig(bug.severity);
          const SeverityIcon = severityConfig.icon;

          return (
            <motion.div
              key={bug.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-300 ${
                bug.status === 'in_progress' 
                  ? 'border-cyan-500/30' 
                  : 'border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                {/* Bug Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${severityConfig.bg} ${severityConfig.border} border`}>
                      <SeverityIcon className={`w-4 h-4 ${severityConfig.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 font-mono">{bug.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityConfig.bg} ${severityConfig.color} ${severityConfig.border} border`}>
                          {severityConfig.label}
                        </span>
                        {bug.status === 'in_progress' && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-medium">
                            In Progress
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mt-1">{bug.title}</h3>
                    </div>
                  </div>

                  {/* Repro Steps */}
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <p className="text-xs text-slate-500 mb-1">Reproduction Steps:</p>
                    <p className="text-sm text-slate-300">{bug.reproSteps}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4" />
                      {bug.reportedAt}
                    </span>
                    {bug.commitLink && (
                      <a href={bug.commitLink} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                        <Link2 className="w-4 h-4" />
                        View Commit
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {bug.status === 'in_progress' && (
                    <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <Timer className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                      <span className="text-sm font-mono text-white">00:45:12</span>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 hover:border-cyan-400/50 transition-all text-sm font-medium"
                  >
                    <Bot className="w-4 h-4" />
                    AI Fix
                  </motion.button>

                  {bug.status !== 'in_progress' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 hover:border-slate-600 transition-all text-sm font-medium"
                    >
                      Start Fix
                    </motion.button>
                  )}
                </div>
              </div>

              {/* AI Suggestion */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-slate-700/30"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                  <Bot className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-cyan-400 font-medium mb-1">AI Suggestion</p>
                    <p className="text-sm text-slate-400">{bug.aiSuggestion}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BugTracker;
