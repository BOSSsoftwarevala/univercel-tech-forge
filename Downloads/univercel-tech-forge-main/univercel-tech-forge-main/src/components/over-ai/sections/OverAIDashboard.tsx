/**
 * OVER AI - Main Dashboard
 * LOCKED - DO NOT MODIFY
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Server,
  Shield,
  Clock,
} from 'lucide-react';

export function OverAIDashboard() {
  const [metrics, setMetrics] = useState({
    responseSpeedMs: 47,
    systemLoadPercent: 34,
    activeFlowsCount: 1247,
    errorsAutoResolved: 89,
    predictedFailures24h: 3,
    uptime: 99.97,
  });

  // Live metric simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        responseSpeedMs: Math.floor(Math.random() * 30) + 35,
        systemLoadPercent: Math.floor(Math.random() * 20) + 30,
        activeFlowsCount: prev.activeFlowsCount + Math.floor(Math.random() * 10) - 5,
        errorsAutoResolved: prev.errorsAutoResolved + Math.floor(Math.random() * 2),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Response Speed',
      value: `${metrics.responseSpeedMs}ms`,
      target: '<100ms',
      icon: Zap,
      color: 'cyan',
      progress: Math.max(0, 100 - metrics.responseSpeedMs),
    },
    {
      title: 'System Load',
      value: `${metrics.systemLoadPercent}%`,
      target: '<70%',
      icon: Activity,
      color: 'blue',
      progress: metrics.systemLoadPercent,
    },
    {
      title: 'Active Flows',
      value: metrics.activeFlowsCount.toLocaleString(),
      target: 'Live',
      icon: Clock,
      color: 'violet',
      progress: 100,
    },
    {
      title: 'Auto-Resolved',
      value: metrics.errorsAutoResolved.toString(),
      target: 'Today',
      icon: CheckCircle2,
      color: 'emerald',
      progress: 100,
    },
    {
      title: 'Predicted Failures',
      value: metrics.predictedFailures24h.toString(),
      target: 'Next 24h',
      icon: AlertTriangle,
      color: 'amber',
      progress: (metrics.predictedFailures24h / 10) * 100,
    },
    {
      title: 'System Uptime',
      value: `${metrics.uptime}%`,
      target: 'All Time',
      icon: Server,
      color: 'emerald',
      progress: metrics.uptime,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Dashboard</h1>
            <p className="text-cyan-400/70 text-sm">Real-time system intelligence</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
          ALL SYSTEMS OPTIMAL
        </Badge>
      </motion.div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:border-cyan-500/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-white/70">{stat.title}</CardTitle>
                    <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-2">
                    <span className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</span>
                    <span className="text-xs text-white/50">Target: {stat.target}</span>
                  </div>
                  <Progress value={stat.progress} className="h-1.5" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Live Activity Feed */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Live AI Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Cache rebuilt', target: 'Query Engine', time: '2s ago', status: 'success' },
              { action: 'Route optimized', target: 'API Gateway', time: '5s ago', status: 'success' },
              { action: 'Error auto-resolved', target: 'Payment Module', time: '12s ago', status: 'success' },
              { action: 'Predictive cache hit', target: 'User Dashboard', time: '18s ago', status: 'success' },
              { action: 'Server failover', target: 'Region: EU-West', time: '45s ago', status: 'success' },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-white/90">{activity.action}</span>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 text-xs">
                    {activity.target}
                  </Badge>
                </div>
                <span className="text-xs text-white/50">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Control Status */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-10 h-10 text-cyan-400" />
              <div>
                <p className="text-lg font-bold text-white">OVER AI CONTROLS EVERYTHING</p>
                <p className="text-sm text-cyan-400/70">Zero manual dependency • Speed is priority #1</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-mono">99.97% Efficiency</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OverAIDashboard;
