/**
 * OVER AI - Speed Engine (Light-Speed Mode)
 * LOCKED - DO NOT MODIFY
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Zap,
  Database,
  GitBranch,
  Layers,
  ListOrdered,
  Gauge,
  CheckCircle2,
} from 'lucide-react';

const SPEED_MODULES = [
  {
    id: 'predictive-cache',
    name: 'Predictive Cache Engine',
    icon: Database,
    status: 'optimal',
    latencyMs: 12,
    hitRate: 94.5,
    description: 'Pre-loads user queries based on behavior patterns',
  },
  {
    id: 'preloaded-query',
    name: 'Preloaded Query Resolver',
    icon: Layers,
    status: 'active',
    latencyMs: 8,
    hitRate: 91.2,
    description: 'Resolves common queries before user action',
  },
  {
    id: 'edge-routing',
    name: 'Auto Edge Routing',
    icon: GitBranch,
    status: 'optimal',
    latencyMs: 15,
    hitRate: 97.8,
    description: 'Routes to nearest edge server automatically',
  },
  {
    id: 'task-splitter',
    name: 'Background Task Splitter',
    icon: Layers,
    status: 'active',
    latencyMs: 5,
    hitRate: 99.1,
    description: 'Splits heavy tasks into micro-operations',
  },
  {
    id: 'priority-queue',
    name: 'Priority Queue Optimizer',
    icon: ListOrdered,
    status: 'optimal',
    latencyMs: 3,
    hitRate: 98.7,
    description: 'Optimizes request priority in real-time',
  },
];

export function AISpeedEngine() {
  const [modules, setModules] = useState(SPEED_MODULES);
  const [lightSpeedMode, setLightSpeedMode] = useState(true);
  const [avgLatency, setAvgLatency] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setModules((prev) =>
        prev.map((m) => ({
          ...m,
          latencyMs: Math.max(1, m.latencyMs + Math.floor(Math.random() * 5) - 2),
          hitRate: Math.min(100, Math.max(85, m.hitRate + (Math.random() - 0.5))),
        }))
      );
      setAvgLatency((prev) => Math.max(30, Math.min(80, prev + Math.floor(Math.random() * 10) - 5)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'active':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'standby':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Speed Engine</h1>
            <p className="text-cyan-400/70 text-sm">Light-Speed Mode • Target: &lt;100ms</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Light-Speed Mode</span>
            <Switch checked={lightSpeedMode} onCheckedChange={setLightSpeedMode} />
          </div>
          <Badge className={lightSpeedMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
            {lightSpeedMode ? 'ENABLED' : 'DISABLED'}
          </Badge>
        </div>
      </motion.div>

      {/* Overall Speed Metric */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Gauge className="w-12 h-12 text-cyan-400" />
              <div>
                <p className="text-sm text-white/70">Average Response Time</p>
                <p className="text-4xl font-bold text-cyan-400 font-mono">{avgLatency}ms</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">Target</p>
              <p className="text-2xl font-bold text-emerald-400">&lt;100ms</p>
              <Badge className="bg-emerald-500/20 text-emerald-400 mt-1">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                ON TARGET
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speed Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module, i) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:border-cyan-500/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-cyan-400" />
                      <CardTitle className="text-sm text-white">{module.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(module.status)}>{module.status.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-white/50 mb-4">{module.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/50">Latency</p>
                      <p className="text-xl font-bold text-cyan-400 font-mono">{module.latencyMs}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Hit Rate</p>
                      <p className="text-xl font-bold text-emerald-400 font-mono">{module.hitRate.toFixed(1)}%</p>
                    </div>
                  </div>
                  <Progress value={module.hitRate} className="h-1.5 mt-3" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Rule Card */}
      <Card className="bg-slate-900/50 border-amber-500/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-sm font-bold text-white">SPEED RULE</p>
              <p className="text-xs text-amber-400/70">USER ACTION → RESPONSE &lt;100ms (TARGET)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AISpeedEngine;
