import { motion } from 'framer-motion';
import { 
  BarChart3, Target, Bug, Clock, TrendingUp, TrendingDown, Star,
  CheckCircle2, XCircle, AlertTriangle, Award, Zap, Calendar
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DeveloperPerformanceSection = () => {
  const metrics = [
    { 
      label: 'Tasks Completed', 
      value: 127, 
      target: 150,
      icon: Target, 
      color: 'cyan',
      trend: '+12',
      trendUp: true,
      period: 'This Month'
    },
    { 
      label: 'Bugs Resolved', 
      value: 43, 
      target: 50,
      icon: Bug, 
      color: 'emerald',
      trend: '+8',
      trendUp: true,
      period: 'This Month'
    },
    { 
      label: 'Avg Completion Time', 
      value: '2.4h', 
      target: '3h',
      icon: Clock, 
      color: 'blue',
      trend: '-15%',
      trendUp: true,
      period: 'Faster than average'
    },
    { 
      label: 'Code Quality', 
      value: '92%', 
      target: '90%',
      icon: Star, 
      color: 'amber',
      trend: '+3%',
      trendUp: true,
      period: 'Based on reviews'
    },
  ];

  const performanceBreakdown = {
    productivity: 92,
    quality: 88,
    onTime: 95,
    communication: 85,
    codeReview: 90,
  };

  const recentActivity = [
    { action: 'Task completed: Payment Gateway', time: '2 hours ago', type: 'success' },
    { action: 'Bug fixed: Mobile Safari issue', time: '4 hours ago', type: 'success' },
    { action: 'Code submitted for review', time: '5 hours ago', type: 'info' },
    { action: 'Task started: Dashboard Analytics', time: '6 hours ago', type: 'start' },
    { action: 'Bug assigned: Chart loading', time: '1 day ago', type: 'warning' },
    { action: 'Code approved: Login Module', time: '2 days ago', type: 'success' },
  ];

  const weeklyStats = [
    { day: 'Mon', tasks: 5, bugs: 2 },
    { day: 'Tue', tasks: 3, bugs: 4 },
    { day: 'Wed', tasks: 7, bugs: 1 },
    { day: 'Thu', tasks: 4, bugs: 3 },
    { day: 'Fri', tasks: 6, bugs: 2 },
    { day: 'Sat', tasks: 2, bugs: 0 },
    { day: 'Sun', tasks: 0, bugs: 0 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'start': return <Zap className="w-4 h-4 text-cyan-400" />;
      default: return <Target className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            Performance Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Track your productivity and quality metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
          <Award className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">Top 10% Performer</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-xl bg-${metric.color}-500/10 border border-${metric.color}-500/20 hover:border-${metric.color}-500/40 transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${metric.color}-500/20`}>
                <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
              </div>
              <div className={`flex items-center gap-1 text-xs ${metric.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {metric.trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {metric.trend}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="text-xs text-slate-500 mt-1">{metric.period}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Performance Breakdown
          </h2>
          <div className="space-y-5">
            {Object.entries(performanceBreakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className={`text-sm font-semibold ${
                    value >= 90 ? 'text-emerald-400' : value >= 80 ? 'text-cyan-400' : 'text-amber-400'
                  }`}>{value}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      value >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 
                      value >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 
                      'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            This Week
          </h2>
          <div className="space-y-3">
            {weeklyStats.map((day, i) => (
              <div key={day.day} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-8">{day.day}</span>
                <div className="flex-1 flex gap-1">
                  {/* Tasks bar */}
                  <motion.div
                    className="h-6 bg-cyan-500/50 rounded-l"
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.tasks / 7) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                  {/* Bugs bar */}
                  <motion.div
                    className="h-6 bg-emerald-500/50 rounded-r"
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.bugs / 4) * 40}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}
                  />
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-cyan-400">{day.tasks}</span>
                  <span className="text-emerald-400">{day.bugs}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500/50 rounded" />
              <span className="text-xs text-slate-400">Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500/50 rounded" />
              <span className="text-xs text-slate-400">Bugs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg"
            >
              {getActivityIcon(activity.type)}
              <span className="flex-1 text-sm text-slate-300">{activity.action}</span>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quality Score Card */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Quality Score (Based on Rework)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Lower rework = higher score. You're doing great!
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">92<span className="text-lg text-slate-400">/100</span></p>
            <p className="text-sm text-emerald-400 flex items-center gap-1 justify-end">
              <TrendingUp className="w-4 h-4" />
              +5 from last month
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-slate-900/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-emerald-400">2%</p>
            <p className="text-xs text-slate-400">Rework Rate</p>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-cyan-400">98%</p>
            <p className="text-xs text-slate-400">First-Pass Rate</p>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-400">4.9</p>
            <p className="text-xs text-slate-400">Avg Review Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPerformanceSection;
