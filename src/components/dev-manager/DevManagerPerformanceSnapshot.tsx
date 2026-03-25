import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Clock, CheckCircle, XCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DeveloperPerformance {
  valaId: string;
  completedTasks: number;
  onTimeRate: number;
  avgCompletionTime: number;
  qualityScore: number;
  trend: 'up' | 'down' | 'stable';
}

const mockPerformance: DeveloperPerformance[] = [
  { valaId: 'DEV-7842', completedTasks: 24, onTimeRate: 92, avgCompletionTime: 4.2, qualityScore: 88, trend: 'up' },
  { valaId: 'DEV-3291', completedTasks: 18, onTimeRate: 85, avgCompletionTime: 5.1, qualityScore: 91, trend: 'stable' },
  { valaId: 'DEV-5104', completedTasks: 31, onTimeRate: 78, avgCompletionTime: 6.3, qualityScore: 82, trend: 'down' },
  { valaId: 'DEV-8877', completedTasks: 22, onTimeRate: 95, avgCompletionTime: 3.8, qualityScore: 94, trend: 'up' },
];

const getTrendIcon = (trend: DeveloperPerformance['trend']) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
    case 'stable': return <BarChart3 className="w-4 h-4 text-zinc-400" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-400';
  if (score >= 75) return 'text-amber-400';
  return 'text-red-400';
};

export default function DevManagerPerformanceSnapshot() {
  const avgOnTimeRate = Math.round(mockPerformance.reduce((sum, d) => sum + d.onTimeRate, 0) / mockPerformance.length);
  const avgQualityScore = Math.round(mockPerformance.reduce((sum, d) => sum + d.qualityScore, 0) / mockPerformance.length);
  const totalCompleted = mockPerformance.reduce((sum, d) => sum + d.completedTasks, 0);

  return (
    <div className="space-y-4">
      {/* READ-ONLY Notice */}
      <div className="flex items-center gap-2 p-2 bg-zinc-800/50 border border-zinc-700 rounded-lg">
        <Lock className="w-4 h-4 text-zinc-500" />
        <span className="text-xs text-zinc-500 font-mono">READ-ONLY VIEW</span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-mono font-bold">{totalCompleted}</p>
            <p className="text-xs text-zinc-500">Completed (30d)</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-blue-400" />
            <p className={`text-2xl font-mono font-bold ${getScoreColor(avgOnTimeRate)}`}>{avgOnTimeRate}%</p>
            <p className="text-xs text-zinc-500">Avg On-Time</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-5 h-5 mx-auto mb-2 text-purple-400" />
            <p className={`text-2xl font-mono font-bold ${getScoreColor(avgQualityScore)}`}>{avgQualityScore}</p>
            <p className="text-xs text-zinc-500">Avg Quality</p>
          </CardContent>
        </Card>
      </div>

      {/* Developer Performance List */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400">
            DEVELOPER PERFORMANCE (30 DAYS)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockPerformance.map((dev, idx) => (
            <motion.div
              key={dev.valaId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{dev.valaId}</span>
                  {getTrendIcon(dev.trend)}
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {dev.completedTasks} tasks
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">On-Time Rate</p>
                  <div className="flex items-center gap-2">
                    <Progress value={dev.onTimeRate} className="h-1.5 flex-1" />
                    <span className={`text-sm font-mono ${getScoreColor(dev.onTimeRate)}`}>
                      {dev.onTimeRate}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Quality Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={dev.qualityScore} className="h-1.5 flex-1" />
                    <span className={`text-sm font-mono ${getScoreColor(dev.qualityScore)}`}>
                      {dev.qualityScore}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Avg Time</p>
                  <p className="text-sm font-mono text-zinc-300">{dev.avgCompletionTime}h</p>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
