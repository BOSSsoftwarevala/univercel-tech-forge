import { motion } from 'framer-motion';
import { 
  Gauge, TrendingUp, Clock, Target, BarChart3, 
  ArrowUpRight, ArrowDownRight, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const performanceData = [
  { server: 'prod-api-01', score: 94, sla: 99.98, responseTime: 45, errorRate: 0.02 },
  { server: 'prod-api-02', score: 92, sla: 99.95, responseTime: 52, errorRate: 0.05 },
  { server: 'prod-db-01', score: 78, sla: 99.80, responseTime: 120, errorRate: 0.15 },
  { server: 'prod-cache-01', score: 98, sla: 99.99, responseTime: 12, errorRate: 0.01 },
];

const trendData = {
  daily: { score: 91, change: '+2%' },
  weekly: { score: 89, change: '+5%' },
  monthly: { score: 87, change: '+8%' },
};

const SMPerformance = () => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/20';
    if (score >= 70) return 'bg-amber-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Performance & Tracking</h1>
        <p className="text-slate-400">Server performance metrics, SLA tracking, and trends</p>
      </div>

      {/* Trend Comparison */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(trendData).map(([period, data]) => (
          <Card key={period} className="bg-slate-900/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm capitalize">{period} Average</span>
                <div className="flex items-center gap-1 text-emerald-400 text-sm">
                  <ArrowUpRight className="w-3 h-3" />
                  {data.change}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{data.score}</p>
                <span className="text-slate-500">/ 100</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall SLA */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Overall SLA Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-700"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="text-emerald-400"
                  initial={{ strokeDasharray: '0 352' }}
                  animate={{ strokeDasharray: '345 352' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">99.9%</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target SLA</span>
                <span className="text-white font-medium">99.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current SLA</span>
                <span className="text-emerald-400 font-medium">99.93%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Downtime This Month</span>
                <span className="text-white font-medium">5m 12s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-Server Performance */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Server Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.map((server, i) => (
              <motion.div
                key={server.server}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getScoreBg(server.score)} flex items-center justify-center`}>
                      <span className={`font-bold ${getScoreColor(server.score)}`}>{server.score}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{server.server}</p>
                      <p className="text-slate-400 text-sm">Performance Score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-emerald-400 font-medium">{server.sla}%</p>
                      <p className="text-slate-500 text-xs">SLA Uptime</p>
                    </div>
                    <div className="text-center">
                      <p className="text-cyan-400 font-medium">{server.responseTime}ms</p>
                      <p className="text-slate-500 text-xs">Response</p>
                    </div>
                    <div className="text-center">
                      <p className={`font-medium ${server.errorRate > 0.1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {server.errorRate}%
                      </p>
                      <p className="text-slate-500 text-xs">Error Rate</p>
                    </div>
                  </div>
                </div>
                <Progress value={server.score} className="h-1.5 bg-slate-700" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMPerformance;
