import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Clock, Star, AlertTriangle,
  CheckCircle, Zap, Award, BarChart3, Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const PerformanceInsights = () => {
  const performanceData = {
    overallScore: 92,
    speedScore: 88,
    qualityScore: 95,
    communicationScore: 90,
    onTimePercentage: 94,
    tasksCompleted: 47,
    tasksOnTime: 44,
    totalHoursWorked: 156.5,
    strikes: 1,
    bonusesEarned: 12500,
    penaltiesApplied: 500
  };

  const recentPerformance = [
    { task: 'TSK-2846', score: 95, rating: 5, onTime: true },
    { task: 'TSK-2845', score: 88, rating: 4, onTime: true },
    { task: 'TSK-2844', score: 72, rating: 3, onTime: false },
    { task: 'TSK-2843', score: 91, rating: 5, onTime: true },
    { task: 'TSK-2842', score: 85, rating: 4, onTime: true },
  ];

  const scoreCategories = [
    { label: 'Speed', value: performanceData.speedScore, icon: Zap, color: 'cyan' },
    { label: 'Quality', value: performanceData.qualityScore, icon: Star, color: 'yellow' },
    { label: 'Communication', value: performanceData.communicationScore, icon: Activity, color: 'purple' },
    { label: 'On-Time', value: performanceData.onTimePercentage, icon: Clock, color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Performance Insights</h1>
          <p className="text-slate-400 text-sm mt-1">Your performance metrics and ratings</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-lg px-4 py-2">
          <Award className="w-5 h-5 mr-2" />
          Top 10% Developer
        </Badge>
      </div>

      {/* Overall Score Card */}
      <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Score Circle */}
          <div className="relative w-40 h-40 mx-auto lg:mx-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-700"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 440" }}
                animate={{ strokeDasharray: `${performanceData.overallScore * 4.4} 440` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{performanceData.overallScore}</span>
              <span className="text-sm text-slate-400">Overall Score</span>
            </div>
          </div>

          {/* Score Categories */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {scoreCategories.map((category, index) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className={`w-4 h-4 text-${category.color}-400`} />
                  <span className="text-sm text-slate-400">{category.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">{category.value}%</span>
                  <Progress value={category.value} className="flex-1 h-2" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="lg:w-48 space-y-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Completed</span>
              </div>
              <p className="text-xl font-bold text-emerald-400">{performanceData.tasksCompleted} tasks</p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-slate-400">Bonuses</span>
              </div>
              <p className="text-xl font-bold text-yellow-400">₹{performanceData.bonusesEarned.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-slate-400">Strikes</span>
              </div>
              <p className="text-xl font-bold text-red-400">{performanceData.strikes}/3</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Task Scores */}
        <Card className="p-6 bg-slate-900/50 border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Recent Task Scores
          </h3>
          
          <div className="space-y-3">
            {recentPerformance.map((task, index) => (
              <motion.div
                key={task.task}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">{task.task}</span>
                  {task.onTime ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">On Time</Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400 text-xs">Late</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${
                          star <= task.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-lg font-bold ${
                    task.score >= 90 ? 'text-emerald-400' :
                    task.score >= 75 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {task.score}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Performance Trends */}
        <Card className="p-6 bg-slate-900/50 border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Performance Trend
          </h3>
          
          <div className="h-48 flex items-end justify-between gap-2">
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => {
              const scores = [85, 88, 92, 94];
              return (
                <div key={week} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${scores[index]}%` }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    className="w-full bg-gradient-to-t from-cyan-500/50 to-purple-500/50 rounded-t-lg relative"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-white">
                      {scores[index]}
                    </span>
                  </motion.div>
                  <span className="text-xs text-slate-400">{week}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <p className="text-sm text-emerald-400">
              📈 Your performance has improved by 9% over the last month!
            </p>
          </div>
        </Card>
      </div>

      {/* AI Coaching Suggestions */}
      <Card className="p-6 bg-slate-900/50 border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          AI Performance Coaching
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <h4 className="font-medium text-purple-400 mb-2">Speed Improvement</h4>
            <p className="text-sm text-slate-300">
              Your average task completion time is 1.8 hours. Consider using code snippets for common patterns to reduce this to 1.5 hours.
            </p>
          </div>
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <h4 className="font-medium text-cyan-400 mb-2">Quality Focus</h4>
            <p className="text-sm text-slate-300">
              Excellent quality scores! Maintain your code review process. Consider documenting your approach for future reference.
            </p>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <h4 className="font-medium text-yellow-400 mb-2">Skill Recommendation</h4>
            <p className="text-sm text-slate-300">
              Based on your tasks, learning TypeScript advanced patterns could help you handle complex projects more efficiently.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PerformanceInsights;
