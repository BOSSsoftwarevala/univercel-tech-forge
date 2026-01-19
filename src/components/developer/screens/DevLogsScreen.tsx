/**
 * DEVELOPER LOGS SCREEN
 * Activity Logs and Build Logs
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Search,
  Filter
} from 'lucide-react';

interface DevLogsScreenProps {
  view: 'activity' | 'build';
}

export const DevLogsScreen: React.FC<DevLogsScreenProps> = ({ view }) => {
  const activityLogs = [
    { id: 1, time: '14:32:15', action: 'Started build for E-Commerce Platform', result: 'success', user: 'You' },
    { id: 2, time: '14:28:42', action: 'Merged PR #234 into main branch', result: 'success', user: 'You' },
    { id: 3, time: '14:15:03', action: 'Deployed CRM Dashboard to staging', result: 'success', user: 'You' },
    { id: 4, time: '13:52:18', action: 'Build failed for Healthcare Portal', result: 'error', user: 'You' },
    { id: 5, time: '13:45:00', action: 'Code review submitted for Payment Gateway', result: 'success', user: 'You' },
    { id: 6, time: '12:30:22', action: 'Task marked as complete: API documentation', result: 'success', user: 'You' },
    { id: 7, time: '11:15:45', action: 'Security scan detected vulnerability', result: 'warning', user: 'System' }
  ];

  const buildLogs = [
    { id: 1, time: '14:32:15', message: '[INFO] Starting TypeScript compilation...', level: 'info' },
    { id: 2, time: '14:32:18', message: '[INFO] Compiling 234 files...', level: 'info' },
    { id: 3, time: '14:32:45', message: '[WARN] Unused variable in OrderService.ts:45', level: 'warning' },
    { id: 4, time: '14:33:02', message: '[INFO] Running ESLint checks...', level: 'info' },
    { id: 5, time: '14:33:15', message: '[INFO] Running unit tests...', level: 'info' },
    { id: 6, time: '14:33:45', message: '[SUCCESS] All 156 tests passed', level: 'success' },
    { id: 7, time: '14:34:00', message: '[INFO] Building production bundle...', level: 'info' },
    { id: 8, time: '14:34:30', message: '[SUCCESS] Build completed successfully', level: 'success' }
  ];

  const logs = view === 'activity' ? activityLogs : buildLogs;

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <CheckCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-cyan-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {view === 'activity' ? 'Activity Logs' : 'Build Logs'}
          </h1>
          <p className="text-slate-400 text-sm">{logs.length} entries</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-700 overflow-hidden">
        {view === 'activity' ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Result</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-slate-400">{log.time}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-white">{log.action}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getResultIcon(log.result)}
                      <span className={`text-xs capitalize ${
                        log.result === 'success' ? 'text-emerald-400' :
                        log.result === 'error' ? 'text-red-400' :
                        'text-amber-400'
                      }`}>
                        {log.result}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 font-mono text-sm space-y-1 max-h-[500px] overflow-y-auto">
            {buildLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-start gap-2"
              >
                <span className="text-slate-500 shrink-0">{log.time}</span>
                <span className={getLevelColor(log.level)}>{log.message}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
