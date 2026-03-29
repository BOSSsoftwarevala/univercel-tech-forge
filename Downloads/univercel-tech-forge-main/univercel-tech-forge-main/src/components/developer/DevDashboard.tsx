import { motion } from 'framer-motion';
import { 
  CheckCircle2, Clock, AlertTriangle, TrendingUp, 
  Wallet, Star, Timer, Code2, Zap, Target
} from 'lucide-react';

const DevDashboard = () => {
  const stats = [
    { label: 'Active Tasks', value: '3', icon: Code2, color: 'cyan', trend: '+2 today' },
    { label: 'Completed Today', value: '5', icon: CheckCircle2, color: 'emerald', trend: '100% on-time' },
    { label: 'Pending Review', value: '2', icon: Clock, color: 'amber', trend: 'Awaiting QA' },
    { label: 'Performance Score', value: '92%', icon: TrendingUp, color: 'blue', trend: '+3% this week' },
  ];

  const activeTasks = [
    { id: 1, title: 'API Integration - Payment Gateway', priority: 'urgent', status: 'working', timeLeft: '45 min', progress: 65 },
    { id: 2, title: 'Bug Fix - User Dashboard', priority: 'high', status: 'testing', timeLeft: '1h 20min', progress: 85 },
    { id: 3, title: 'Feature - Report Generator', priority: 'medium', status: 'assigned', timeLeft: '2h', progress: 0 },
  ];

  const recentActivity = [
    { action: 'Task Completed', task: 'Login Module Update', time: '10 min ago', type: 'success' },
    { action: 'Code Submitted', task: 'API Integration', time: '25 min ago', type: 'info' },
    { action: 'Task Accepted', task: 'Bug Fix - Dashboard', time: '1 hour ago', type: 'info' },
    { action: 'Payment Received', task: '₹2,500 credited', time: '2 hours ago', type: 'success' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'text-cyan-400 bg-cyan-500/20';
      case 'testing': return 'text-purple-400 bg-purple-500/20';
      case 'assigned': return 'text-amber-400 bg-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Developer Dashboard</h1>
          <p className="text-slate-400">Welcome back! You have 3 active tasks.</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">Online</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <span className="text-xs text-slate-500">{stat.trend}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Active Tasks
            </h2>
            <span className="text-xs text-slate-400">Updated just now</span>
          </div>
          <div className="space-y-4">
            {activeTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded text-xs border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Timer className="w-4 h-4" />
                    <span className="text-sm font-medium">{task.timeLeft}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-400">Progress</span>
                  <span className="text-xs text-cyan-400">{task.progress}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-all"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.task}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-400">Rating</span>
          </div>
          <p className="text-2xl font-bold text-white">4.8<span className="text-sm text-slate-400">/5.0</span></p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-white">47 <span className="text-sm text-slate-400">tasks</span></p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400">Earnings</span>
          </div>
          <p className="text-2xl font-bold text-white">₹45,200</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-400">Penalties</span>
          </div>
          <p className="text-2xl font-bold text-white">0 <span className="text-sm text-emerald-400">✓</span></p>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;
