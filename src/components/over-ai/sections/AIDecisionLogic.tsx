/**
 * OVER AI - Decision Logic (Micro Level)
 * LOCKED - DO NOT MODIFY
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Users,
  BarChart3,
  TrendingUp,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
} from 'lucide-react';

const DECISION_METRICS = [
  { id: 'user-behavior', name: 'User Behavior Prediction', value: 94.2, trend: 'up', confidence: 96 },
  { id: 'feature-usage', name: 'Feature Usage Heatmap', value: 87.5, trend: 'stable', confidence: 91 },
  { id: 'load-forecast', name: 'Load Spike Forecast', value: 23, trend: 'down', confidence: 88 },
  { id: 'demo-readiness', name: 'Demo → Live Readiness', value: 78.3, trend: 'up', confidence: 85 },
];

const AI_SUGGESTIONS = [
  { type: 'upgrade', message: 'Recommend upgrading cache tier for AP region', confidence: 92, impact: 'high' },
  { type: 'downgrade', message: 'Suggest downgrading EU backup to save costs', confidence: 78, impact: 'medium' },
  { type: 'optimize', message: 'Auto-optimize query patterns detected', confidence: 95, impact: 'high' },
  { type: 'alert', message: 'Predicted spike in 2 hours - pre-warming cache', confidence: 89, impact: 'medium' },
];

export function AIDecisionLogic() {
  const [metrics, setMetrics] = useState(DECISION_METRICS);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: Math.max(10, Math.min(99, m.value + (Math.random() - 0.5) * 2)),
          confidence: Math.max(75, Math.min(99, m.confidence + (Math.random() - 0.5))),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-amber-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400';
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Decision Logic</h1>
            <p className="text-cyan-400/70 text-sm">Micro-level intelligence • Predictive analysis</p>
          </div>
        </div>
        <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          AI ANALYZING
        </Badge>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:border-violet-500/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-white">{metric.name}</CardTitle>
                  {getTrendIcon(metric.trend)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-3">
                  <span className="text-3xl font-bold text-violet-400 font-mono">{metric.value.toFixed(1)}%</span>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Confidence</p>
                    <p className="text-sm font-bold text-cyan-400">{metric.confidence.toFixed(0)}%</p>
                  </div>
                </div>
                <Progress value={metric.value} className="h-1.5" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Suggestions */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Suggestions (Auto-Generated)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {AI_SUGGESTIONS.map((suggestion, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    {suggestion.type === 'upgrade' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                    {suggestion.type === 'downgrade' && <ArrowDownRight className="w-5 h-5 text-amber-400" />}
                    {suggestion.type === 'optimize' && <Gauge className="w-5 h-5 text-cyan-400" />}
                    {suggestion.type === 'alert' && <BarChart3 className="w-5 h-5 text-violet-400" />}
                  </div>
                  <div>
                    <p className="text-sm text-white/90">{suggestion.message}</p>
                    <p className="text-xs text-white/50">Confidence: {suggestion.confidence}%</p>
                  </div>
                </div>
                <Badge className={getImpactColor(suggestion.impact)}>{suggestion.impact.toUpperCase()} IMPACT</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Heatmap Placeholder */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Feature Usage Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => {
              const intensity = Math.random();
              return (
                <div
                  key={i}
                  className="aspect-square rounded-lg"
                  style={{
                    backgroundColor: `rgba(139, 92, 246, ${0.1 + intensity * 0.6})`,
                  }}
                />
              );
            })}
          </div>
          <p className="text-xs text-white/50 mt-3 text-center">Live feature usage distribution</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIDecisionLogic;
