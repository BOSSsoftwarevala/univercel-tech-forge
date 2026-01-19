/**
 * DEVELOPER PROMISES SCREEN
 * My Promises and Team Promises with SLA tracking
 * LOCK: No modifications without approval
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  User
} from 'lucide-react';

interface DevPromisesScreenProps {
  view: 'my' | 'team';
}

export const DevPromisesScreen: React.FC<DevPromisesScreenProps> = ({ view }) => {
  const myPromises = [
    { id: 1, title: 'Complete E-Commerce checkout fix', deadline: '2024-02-10 14:00', risk: 'low', status: 'on-track', timeLeft: '4h 32m' },
    { id: 2, title: 'Deploy CRM dashboard update', deadline: '2024-02-10 18:00', risk: 'medium', status: 'on-track', timeLeft: '8h 32m' },
    { id: 3, title: 'Security patch implementation', deadline: '2024-02-10 12:00', risk: 'high', status: 'at-risk', timeLeft: '2h 32m' },
    { id: 4, title: 'API documentation update', deadline: '2024-02-09', risk: 'none', status: 'completed', timeLeft: 'Done' }
  ];

  const teamPromises = [
    { id: 5, title: 'Database migration', assignee: 'John D.', deadline: '2024-02-10 16:00', risk: 'medium', status: 'on-track', timeLeft: '6h 32m' },
    { id: 6, title: 'Frontend optimization', assignee: 'Sarah M.', deadline: '2024-02-11 10:00', risk: 'low', status: 'on-track', timeLeft: '20h 32m' },
    { id: 7, title: 'Load testing', assignee: 'Mike R.', deadline: '2024-02-10 11:00', risk: 'critical', status: 'breached', timeLeft: 'Overdue' },
    { id: 8, title: 'Code review completion', assignee: 'Lisa K.', deadline: '2024-02-09', risk: 'none', status: 'completed', timeLeft: 'Done' }
  ];

  const promises = view === 'my' ? myPromises : teamPromises;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'none': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-emerald-500/20 text-emerald-400';
      case 'at-risk': return 'bg-amber-500/20 text-amber-400';
      case 'breached': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="w-4 h-4" />;
      case 'at-risk': return <AlertTriangle className="w-4 h-4" />;
      case 'breached': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {view === 'my' ? 'My Promises' : 'Team Promises'}
        </h1>
        <p className="text-slate-400 text-sm">SLA and deadline tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <p className="text-xs text-slate-400 mb-1">On Track</p>
          <p className="text-2xl font-bold text-emerald-400">
            {promises.filter(p => p.status === 'on-track').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-xs text-slate-400 mb-1">At Risk</p>
          <p className="text-2xl font-bold text-amber-400">
            {promises.filter(p => p.status === 'at-risk').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-xs text-slate-400 mb-1">Breached</p>
          <p className="text-2xl font-bold text-red-400">
            {promises.filter(p => p.status === 'breached').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-xs text-slate-400 mb-1">Completed</p>
          <p className="text-2xl font-bold text-cyan-400">
            {promises.filter(p => p.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Promises List */}
      <div className="space-y-4">
        {promises.map((promise, index) => (
          <motion.div
            key={promise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-xl border ${
              promise.status === 'breached'
                ? 'bg-red-500/5 border-red-500/30'
                : promise.status === 'at-risk'
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-slate-900/50 border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(promise.status)}`}>
                  {getStatusIcon(promise.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{promise.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                    {view === 'team' && 'assignee' in promise && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {promise.assignee}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {promise.deadline}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full border ${getRiskColor(promise.risk)}`}>
                  {promise.risk === 'none' ? 'COMPLETED' : `${promise.risk.toUpperCase()} RISK`}
                </span>
                <p className={`text-lg font-mono mt-2 ${
                  promise.status === 'breached' ? 'text-red-400' :
                  promise.status === 'at-risk' ? 'text-amber-400' :
                  promise.status === 'completed' ? 'text-cyan-400' :
                  'text-emerald-400'
                }`}>
                  {String(promise.timeLeft)}
                </p>
              </div>
            </div>

            {/* Actions */}
            {promise.status !== 'completed' && (
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm">
                  <RefreshCw className="w-4 h-4" />
                  Update Status
                </button>
                {(promise.status === 'at-risk' || promise.status === 'breached') && (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm">
                    <Clock className="w-4 h-4" />
                    Request Extension
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
