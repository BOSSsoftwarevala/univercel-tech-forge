import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Star, Clock, CheckCircle2,
  AlertTriangle, Award, Zap, Target, Medal
} from 'lucide-react';

const DevPerformance = () => {
  const performanceMetrics = {
    speedScore: 92,
    qualityScore: 88,
    communicationScore: 95,
    overallScore: 91,
    onTimeDelivery: 96,
    tasksCompleted: 47,
    averageTime: '1.8h',
    rating: 4.8,
  };

  const monthlyStats = [
    { month: 'Jan', tasks: 38, onTime: 35, score: 85 },
    { month: 'Feb', tasks: 42, onTime: 40, score: 88 },
    { month: 'Mar', tasks: 45, onTime: 44, score: 92 },
    { month: 'Apr', tasks: 47, onTime: 45, score: 91 },
  ];

  const penalties = [
    { reason: 'Late delivery - API Task', amount: -50, date: '2 weeks ago' },
  ];

  const incentives = [
    { reason: 'Early completion bonus', amount: 500, date: '3 days ago' },
    { reason: 'Perfect week streak', amount: 300, date: '1 week ago' },
    { reason: 'Quality bonus', amount: 200, date: '2 weeks ago' },
  ];

  const achievements = [
    { title: 'Speed Demon', description: 'Complete 10 tasks ahead of schedule', icon: Zap, unlocked: true },
    { title: 'Quality Master', description: 'Maintain 90%+ quality for a month', icon: Star, unlocked: true },
    { title: 'Perfect Streak', description: '7 days with 100% on-time delivery', icon: Target, unlocked: true },
    { title: 'Code Ninja', description: 'Complete 100 tasks', icon: Medal, unlocked: false },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-teal-500';
    if (score >= 75) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
          <p className="text-slate-400">Track your scores, achievements, and growth</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">+5% this month</span>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Speed Score', value: performanceMetrics.speedScore, icon: Zap, color: 'cyan' },
          { label: 'Quality Score', value: performanceMetrics.qualityScore, icon: Star, color: 'amber' },
          { label: 'Communication', value: performanceMetrics.communicationScore, icon: CheckCircle2, color: 'emerald' },
          { label: 'Overall Score', value: performanceMetrics.overallScore, icon: TrendingUp, color: 'purple' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
              <span className="text-sm text-slate-400">{metric.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-bold ${getScoreColor(metric.value)}`}>{metric.value}</span>
              <span className="text-slate-500 text-sm mb-1">/ 100</span>
            </div>
            <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getScoreBarColor(metric.value)}`}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
          <p className="text-sm text-slate-400 mb-1">Tasks Completed</p>
          <p className="text-2xl font-bold text-white">{performanceMetrics.tasksCompleted}</p>
          <p className="text-xs text-emerald-400 mt-1">+8 this week</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <p className="text-sm text-slate-400 mb-1">On-Time Rate</p>
          <p className="text-2xl font-bold text-white">{performanceMetrics.onTimeDelivery}%</p>
          <p className="text-xs text-emerald-400 mt-1">Excellent</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <p className="text-sm text-slate-400 mb-1">Avg. Completion</p>
          <p className="text-2xl font-bold text-white">{performanceMetrics.averageTime}</p>
          <p className="text-xs text-cyan-400 mt-1">Per task</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <p className="text-sm text-slate-400 mb-1">Rating</p>
          <p className="text-2xl font-bold text-white flex items-center gap-1">
            {performanceMetrics.rating}
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </p>
          <p className="text-xs text-amber-400 mt-1">Top 10%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Penalties & Incentives */}
        <div className="space-y-6">
          {/* Penalties */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Penalties
            </h3>
            {penalties.length > 0 ? (
              <div className="space-y-3">
                {penalties.map((penalty, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div>
                      <p className="text-sm text-white">{penalty.reason}</p>
                      <p className="text-xs text-slate-400">{penalty.date}</p>
                    </div>
                    <span className="text-red-400 font-semibold">₹{penalty.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No penalties! Keep up the good work.</p>
            )}
          </div>

          {/* Incentives */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-emerald-400" />
              Incentives Earned
            </h3>
            <div className="space-y-3">
              {incentives.map((incentive, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div>
                    <p className="text-sm text-white">{incentive.reason}</p>
                    <p className="text-xs text-slate-400">{incentive.date}</p>
                  </div>
                  <span className="text-emerald-400 font-semibold">+₹{incentive.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-amber-400" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border text-center ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30'
                    : 'bg-slate-900/50 border-slate-700/50 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  achievement.unlocked ? 'bg-amber-500/20' : 'bg-slate-700/50'
                }`}>
                  <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-amber-400' : 'text-slate-500'}`} />
                </div>
                <h4 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>
                {achievement.unlocked && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                    Unlocked
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Performance Trend</h3>
        <div className="flex items-end gap-4 h-40">
          {monthlyStats.map((stat, index) => (
            <div key={stat.month} className="flex-1 flex flex-col items-center">
              <motion.div
                className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${stat.score}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
              <span className="text-xs text-slate-400 mt-2">{stat.month}</span>
              <span className="text-xs text-cyan-400">{stat.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevPerformance;
