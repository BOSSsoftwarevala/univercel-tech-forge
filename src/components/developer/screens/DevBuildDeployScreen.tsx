/**
 * DEVELOPER BUILD & DEPLOY SCREEN
 * Build Queue and Deploy Queue management
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Play,
  Square,
  RotateCcw,
  RefreshCw,
  Globe,
  Server,
  Key,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface DevBuildDeployScreenProps {
  view: 'build' | 'deploy';
}

export const DevBuildDeployScreen: React.FC<DevBuildDeployScreenProps> = ({ view }) => {
  const builds = [
    { id: 1, project: 'E-Commerce Platform', branch: 'main', status: 'running', progress: 67, started: '5 min ago', env: 'staging' },
    { id: 2, project: 'CRM Dashboard', branch: 'feature/auth', status: 'queued', progress: 0, started: 'Pending', env: 'dev' },
    { id: 3, project: 'Healthcare Portal', branch: 'hotfix/login', status: 'completed', progress: 100, started: '15 min ago', env: 'production' },
    { id: 4, project: 'Payment Gateway', branch: 'develop', status: 'failed', progress: 45, started: '10 min ago', env: 'staging' }
  ];

  const deployments = [
    { id: 1, project: 'Healthcare Portal', version: 'v2.3.1', status: 'deploying', progress: 82, domain: 'healthcare.example.com', env: 'production' },
    { id: 2, project: 'E-Commerce Platform', version: 'v3.0.0-beta', status: 'queued', progress: 0, domain: 'staging.ecommerce.com', env: 'staging' },
    { id: 3, project: 'CRM Dashboard', version: 'v1.5.0', status: 'completed', progress: 100, domain: 'crm.client.com', env: 'production' }
  ];

  const currentItems = view === 'build' ? builds : deployments;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'deploying':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'queued':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'deploying':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'queued':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getEnvColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-red-500/20 text-red-400';
      case 'staging':
        return 'bg-amber-500/20 text-amber-400';
      case 'dev':
        return 'bg-emerald-500/20 text-emerald-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {view === 'build' ? 'Build Queue' : 'Deploy Queue'}
        </h1>
        <p className="text-slate-400 text-sm">
          {currentItems.length} item{currentItems.length !== 1 ? 's' : ''} in queue
        </p>
      </div>

      {/* Environment Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">Environment:</span>
        <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm">All</button>
        <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/30">Production</button>
        <button className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm border border-amber-500/30">Staging</button>
        <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/30">Dev</button>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {currentItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 rounded-xl bg-slate-900/50 border border-slate-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.project}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {view === 'build' && 'branch' in item && (
                      <span className="text-xs text-slate-400">Branch: {item.branch}</span>
                    )}
                    {view === 'deploy' && 'version' in item && (
                      <span className="text-xs text-slate-400">Version: {item.version}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getEnvColor(item.env)}`}>
                  {item.env.toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(item.status)}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {(item.status === 'running' || item.status === 'deploying' || item.status === 'failed') && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-cyan-400">{item.progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.status === 'failed'
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Deploy specific info */}
            {view === 'deploy' && 'domain' in item && (
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">{item.domain}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {item.status === 'running' || item.status === 'deploying' ? (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm">
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              ) : item.status === 'queued' ? (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm">
                  <Play className="w-4 h-4" />
                  Start {view === 'build' ? 'Build' : 'Deploy'}
                </button>
              ) : null}

              {item.status === 'completed' && view === 'deploy' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm">
                  <RotateCcw className="w-4 h-4" />
                  Rollback
                </button>
              )}

              {item.status === 'failed' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm">
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              )}

              {item.status === 'completed' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm">
                  <RefreshCw className="w-4 h-4" />
                  Redeploy
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
