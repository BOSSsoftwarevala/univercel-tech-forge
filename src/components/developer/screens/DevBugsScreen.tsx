/**
 * DEVELOPER BUGS SCREEN
 * Reported Bugs and Auto Detected Bugs
 * LOCK: No modifications without approval
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bug,
  Wrench,
  RefreshCw,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Layers,
  Search
} from 'lucide-react';

interface DevBugsScreenProps {
  view: 'reported' | 'auto';
}

export const DevBugsScreen: React.FC<DevBugsScreenProps> = ({ view }) => {
  const reportedBugs = [
    { id: 1, title: 'Login timeout after 2 minutes', module: 'Authentication', severity: 'critical', status: 'open', rootCause: 'Token expiry misconfiguration', reported: '2h ago' },
    { id: 2, title: 'Payment fails on Safari', module: 'Payment Gateway', severity: 'high', status: 'in-progress', rootCause: 'WebKit compatibility issue', reported: '5h ago' },
    { id: 3, title: 'Dashboard slow loading', module: 'Dashboard', severity: 'medium', status: 'open', rootCause: 'Unoptimized queries', reported: '1d ago' },
    { id: 4, title: 'Email notification delay', module: 'Notifications', severity: 'low', status: 'resolved', rootCause: 'Queue processing delay', reported: '3d ago' }
  ];

  const autoBugs = [
    { id: 5, title: 'Memory leak in OrderService', module: 'Orders', severity: 'critical', status: 'open', rootCause: 'Uncleared event listeners', detected: 'AI Scan - 1h ago' },
    { id: 6, title: 'SQL injection vulnerability', module: 'Search', severity: 'critical', status: 'open', rootCause: 'Unsanitized input', detected: 'Security Scan - 3h ago' },
    { id: 7, title: 'Deprecated API usage', module: 'Integration', severity: 'medium', status: 'open', rootCause: 'Outdated SDK version', detected: 'Dependency Scan - 6h ago' }
  ];

  const bugs = view === 'reported' ? reportedBugs : autoBugs;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400';
      case 'in-progress': return 'bg-cyan-500/20 text-cyan-400';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {view === 'reported' ? 'Reported Bugs' : 'Auto Detected Bugs'}
          </h1>
          <p className="text-slate-400 text-sm">
            {bugs.filter(b => b.status !== 'resolved').length} open issue{bugs.filter(b => b.status !== 'resolved').length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search bugs..."
            className="pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Severity Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">Severity:</span>
        <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm">All</button>
        <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/30">Critical</button>
        <button className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-sm border border-orange-500/30">High</button>
        <button className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm border border-amber-500/30">Medium</button>
        <button className="px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-400 text-sm border border-slate-500/30">Low</button>
      </div>

      {/* Bugs List */}
      <div className="space-y-4">
        {bugs.map((bug, index) => (
          <motion.div
            key={bug.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-xl border ${
              bug.severity === 'critical'
                ? 'bg-red-500/5 border-red-500/30'
                : 'bg-slate-900/50 border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getSeverityColor(bug.severity)}`}>
                  {getSeverityIcon(bug.severity)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{bug.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {bug.module}
                    </span>
                    <span>{'reported' in bug ? bug.reported : bug.detected}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(bug.severity)}`}>
                  {bug.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bug.status)}`}>
                  {bug.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Root Cause */}
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 mb-4">
              <p className="text-xs text-slate-400 mb-1">Root Cause:</p>
              <p className="text-sm text-white">{bug.rootCause}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {bug.status !== 'resolved' && (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm">
                    <Wrench className="w-4 h-4" />
                    Fix
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm">
                    <RefreshCw className="w-4 h-4" />
                    Re-Test
                  </button>
                </>
              )}
              {bug.status === 'resolved' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm">
                  <XCircle className="w-4 h-4" />
                  Close
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
