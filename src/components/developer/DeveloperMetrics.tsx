import { motion } from 'framer-motion';
import { 
  FolderKanban, ListTodo, CheckCircle2, Clock, Bot, 
  Wallet, Star, TrendingUp, Activity
} from 'lucide-react';

const metrics = [
  { 
    label: 'Active Projects', 
    value: '8', 
    icon: FolderKanban, 
    change: '+2 this week',
    color: 'from-cyan-500 to-blue-500',
    glowColor: 'cyan'
  },
  { 
    label: 'Pending Tasks', 
    value: '12', 
    icon: ListTodo, 
    change: '3 urgent',
    color: 'from-amber-500 to-orange-500',
    glowColor: 'amber'
  },
  { 
    label: 'Completed Tasks', 
    value: '47', 
    icon: CheckCircle2, 
    change: '+8 this week',
    color: 'from-emerald-500 to-green-500',
    glowColor: 'emerald'
  },
  { 
    label: 'Avg Task Time', 
    value: '4.2h', 
    icon: Clock, 
    change: '-0.5h vs last month',
    color: 'from-violet-500 to-purple-500',
    glowColor: 'violet'
  },
  { 
    label: 'AI Assistance Used', 
    value: '23', 
    icon: Bot, 
    change: 'This month',
    color: 'from-blue-500 to-indigo-500',
    glowColor: 'blue'
  },
  { 
    label: 'Wallet Balance', 
    value: '₹45,280', 
    icon: Wallet, 
    change: '+₹12,400 pending',
    color: 'from-teal-500 to-cyan-500',
    glowColor: 'teal'
  },
  { 
    label: 'Rating Status', 
    value: '4.8', 
    icon: Star, 
    change: 'Top 5%',
    color: 'from-yellow-500 to-amber-500',
    glowColor: 'yellow'
  },
];

const DeveloperMetrics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Command Overview</h2>
          <p className="text-slate-400 mt-1">Real-time system metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400">All systems operational</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
              style={{ 
                background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
              }}
            />
            <div className="relative p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 group-hover:border-cyan-500/30 transition-all duration-300">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
              <div className="flex items-end gap-2">
                <motion.span
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {metric.value}
                </motion.span>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                {metric.change}
              </p>

              {/* Animated Border */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { time: '2 min ago', action: 'Deployed POS Module v2.3', type: 'deploy' },
            { time: '15 min ago', action: 'Bug fix merged - Invoice template', type: 'fix' },
            { time: '1 hour ago', action: 'Started new task - School ERP Dashboard', type: 'start' },
            { time: '2 hours ago', action: 'AI Assist used for code review', type: 'ai' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/20 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'deploy' ? 'bg-emerald-400' :
                activity.type === 'fix' ? 'bg-amber-400' :
                activity.type === 'ai' ? 'bg-cyan-400' : 'bg-blue-400'
              }`} />
              <span className="text-sm text-slate-400 w-24">{activity.time}</span>
              <span className="text-sm text-white flex-1">{activity.action}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperMetrics;
