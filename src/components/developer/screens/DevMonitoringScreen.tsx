/**
 * DEVELOPER MONITORING SCREEN
 * Live Build and Server Status
 * LOCK: No modifications without approval
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  AlertTriangle,
  CheckCircle,
  Eye,
  Square,
  RefreshCw
} from 'lucide-react';

interface DevMonitoringScreenProps {
  view: 'build' | 'server';
}

export const DevMonitoringScreen: React.FC<DevMonitoringScreenProps> = ({ view }) => {
  const buildStatus = [
    { id: 1, project: 'E-Commerce Platform', status: 'building', progress: 67, step: 'Compiling TypeScript...', logs: 234 },
    { id: 2, project: 'CRM Dashboard', status: 'testing', progress: 85, step: 'Running unit tests...', logs: 156 },
    { id: 3, project: 'Healthcare Portal', status: 'completed', progress: 100, step: 'Build successful', logs: 89 }
  ];

  const serverStatus = [
    { id: 1, name: 'Production Server 1', status: 'healthy', cpu: 45, ram: 62, disk: 38, uptime: '45d 12h' },
    { id: 2, name: 'Production Server 2', status: 'healthy', cpu: 52, ram: 71, disk: 42, uptime: '45d 12h' },
    { id: 3, name: 'Staging Server', status: 'warning', cpu: 78, ram: 85, disk: 67, uptime: '12d 8h' },
    { id: 4, name: 'Dev Server', status: 'healthy', cpu: 25, ram: 34, disk: 22, uptime: '3d 4h' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'warning':
      case 'building':
      case 'testing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-red-400';
    if (value >= 60) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'from-red-500 to-red-600';
    if (value >= 60) return 'from-amber-500 to-amber-600';
    return 'from-emerald-500 to-teal-500';
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {view === 'build' ? 'Build Status' : 'Server Status'}
        </h1>
        <p className="text-slate-400 text-sm">Live monitoring dashboard</p>
      </div>

      {/* Build Status View */}
      {view === 'build' && (
        <div className="space-y-4">
          {buildStatus.map((build, index) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{build.project}</h3>
                  <p className="text-sm text-slate-400">{build.step}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(build.status)}`}>
                  {build.status.toUpperCase()}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-cyan-400">{build.progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${build.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  Watch Live
                </button>
                {build.status !== 'completed' && (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm">
                    <Square className="w-4 h-4" />
                    Stop
                  </button>
                )}
                <span className="text-xs text-slate-500 ml-auto">{build.logs} log entries</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Server Status View */}
      {view === 'server' && (
        <div className="grid md:grid-cols-2 gap-4">
          {serverStatus.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 rounded-xl border ${
                server.status === 'warning'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-slate-900/50 border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getStatusColor(server.status)}`}>
                    {server.status === 'healthy' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{server.name}</h3>
                    <p className="text-xs text-slate-400">Uptime: {server.uptime}</p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Cpu className="w-3 h-3" /> CPU
                    </span>
                    <span className={getMetricColor(server.cpu)}>{server.cpu}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(server.cpu)}`}
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <MemoryStick className="w-3 h-3" /> RAM
                    </span>
                    <span className={getMetricColor(server.ram)}>{server.ram}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(server.ram)}`}
                      style={{ width: `${server.ram}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <HardDrive className="w-3 h-3" /> Disk
                    </span>
                    <span className={getMetricColor(server.disk)}>{server.disk}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(server.disk)}`}
                      style={{ width: `${server.disk}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-xs">
                  <Eye className="w-3 h-3" />
                  Details
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors text-xs">
                  <RefreshCw className="w-3 h-3" />
                  Restart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
