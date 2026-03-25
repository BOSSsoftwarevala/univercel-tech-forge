import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Brain, Zap, TrendingUp, Shield, Eye, Cpu,
  BarChart3, Clock, Target, AlertTriangle, CheckCircle2,
  Code2, Bug, Gauge, Flame, Trophy, Star, Sparkles
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useDeveloperAI } from '@/hooks/useDeveloperAI';

const AIMonitoringCenter = () => {
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    codeQuality: 94,
    productivity: 87,
    focusScore: 92,
    errorRate: 2.3,
    avgResponseTime: 1.2,
    tasksCompleted: 12,
    linesWritten: 847,
    aiSuggestions: 23,
  });

  const [neuralActivity, setNeuralActivity] = useState<number[]>([]);
  const [predictions, setPredictions] = useState({
    earningsToday: 4500,
    tasksETA: '3 more tasks possible',
    optimalBreak: '15 min recommended in 45 min',
    burnoutRisk: 'Low',
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        codeQuality: Math.min(100, prev.codeQuality + (Math.random() - 0.5) * 2),
        productivity: Math.min(100, prev.productivity + (Math.random() - 0.5) * 3),
        focusScore: Math.min(100, prev.focusScore + (Math.random() - 0.5) * 2),
        linesWritten: prev.linesWritten + Math.floor(Math.random() * 5),
      }));

      setNeuralActivity(prev => {
        const newValue = 50 + Math.random() * 50;
        return [...prev.slice(-29), newValue];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-cyan-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-cyan-500';
    if (score >= 70) return 'from-cyan-500 to-blue-500';
    if (score >= 50) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            AI Monitoring Center
          </h1>
          <p className="text-slate-400 mt-1">Real-time performance intelligence & predictive analytics</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50"
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-medium">AI Active</span>
        </motion.div>
      </div>

      {/* Neural Activity Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            Neural Processing Activity
          </h3>
          <span className="text-sm text-purple-400">Real-time</span>
        </div>
        <div className="h-24 flex items-end gap-1">
          {neuralActivity.map((value, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${value}%` }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {[
            { label: 'Processing', value: '2.4 GHz', icon: Cpu },
            { label: 'Memory Usage', value: '67%', icon: Gauge },
            { label: 'AI Queries', value: '23/hr', icon: Sparkles },
            { label: 'Latency', value: '12ms', icon: Zap },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-800/50 text-center">
              <item.icon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Code Quality', value: realTimeMetrics.codeQuality, icon: Code2, suffix: '%' },
          { label: 'Productivity', value: realTimeMetrics.productivity, icon: TrendingUp, suffix: '%' },
          { label: 'Focus Score', value: realTimeMetrics.focusScore, icon: Target, suffix: '%' },
          { label: 'Error Rate', value: realTimeMetrics.errorRate, icon: Bug, suffix: '%', invert: true },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <metric.icon className={`w-5 h-5 ${metric.invert ? 'text-red-400' : getScoreColor(metric.value)}`} />
              <span className={`text-2xl font-bold ${metric.invert ? 'text-red-400' : getScoreColor(metric.value)}`}>
                {metric.value.toFixed(1)}{metric.suffix}
              </span>
            </div>
            <p className="text-sm text-slate-400">{metric.label}</p>
            <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${metric.invert ? 'from-red-500 to-pink-500' : getScoreGradient(metric.value)}`}
                animate={{ width: `${metric.invert ? 100 - metric.value * 10 : metric.value}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Predictions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          AI Predictions & Insights
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1">Earnings Today</p>
            <p className="text-xl font-bold text-emerald-400">₹{predictions.earningsToday.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">+12% from yesterday</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1">Task Capacity</p>
            <p className="text-lg font-bold text-cyan-400">{predictions.tasksETA}</p>
            <p className="text-xs text-slate-500 mt-1">Based on current pace</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1">Break Recommendation</p>
            <p className="text-lg font-bold text-amber-400">{predictions.optimalBreak}</p>
            <p className="text-xs text-slate-500 mt-1">Optimized for focus</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1">Burnout Risk</p>
            <p className="text-xl font-bold text-emerald-400">{predictions.burnoutRisk}</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-4 h-1 rounded ${i <= 1 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Productivity Heatmap (Last 7 Days)
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center">
                <p className="text-xs text-slate-500 mb-2">{day}</p>
                <div className="space-y-1">
                  {[...Array(6)].map((_, i) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={i}
                        className={`h-4 rounded ${
                          intensity > 0.8 ? 'bg-emerald-500' :
                          intensity > 0.6 ? 'bg-emerald-600' :
                          intensity > 0.4 ? 'bg-emerald-700' :
                          intensity > 0.2 ? 'bg-slate-700' : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-slate-500">Less</span>
            {[800, 700, 600, 500].map((shade, i) => (
              <div key={i} className={`w-3 h-3 rounded bg-emerald-${shade}`} style={{ backgroundColor: `rgb(${52 + i * 30}, ${211 - i * 30}, ${153 - i * 20})` }} />
            ))}
            <span className="text-xs text-slate-500">More</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Achievement Progress
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Speed Demon', progress: 87, desc: 'Complete 50 tasks under deadline', icon: Zap },
              { name: 'Quality Master', progress: 92, desc: 'Maintain 95%+ code quality', icon: Star },
              { name: 'Streak Champion', progress: 65, desc: '30-day streak', icon: Flame },
              { name: 'AI Collaborator', progress: 45, desc: 'Use AI 100 times', icon: Brain },
            ].map((achievement, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-slate-700/50">
                  <achievement.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{achievement.name}</span>
                    <span className="text-xs text-amber-400">{achievement.progress}%</span>
                  </div>
                  <Progress value={achievement.progress} className="h-1.5" />
                  <p className="text-xs text-slate-500 mt-1">{achievement.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Live Stats Footer */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Lines Written Today', value: realTimeMetrics.linesWritten, icon: Code2, color: 'cyan' },
          { label: 'Tasks Completed', value: realTimeMetrics.tasksCompleted, icon: CheckCircle2, color: 'emerald' },
          { label: 'AI Suggestions Used', value: realTimeMetrics.aiSuggestions, icon: Sparkles, color: 'purple' },
          { label: 'Avg Response Time', value: `${realTimeMetrics.avgResponseTime}s`, icon: Clock, color: 'amber' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/30 text-center`}
            whileHover={{ scale: 1.02 }}
          >
            <stat.icon className={`w-6 h-6 text-${stat.color}-400 mx-auto mb-2`} />
            <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIMonitoringCenter;
