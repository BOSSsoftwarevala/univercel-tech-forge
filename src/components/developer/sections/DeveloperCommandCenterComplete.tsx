import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Target, CheckCircle2, AlertTriangle, Clock, 
  TrendingUp, Wallet, Bot, Send, Zap, Sparkles, Play, Pause,
  AlertCircle, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const DeveloperCommandCenterComplete = () => {
  const [aiMessage, setAiMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([
    'Focus on the Payment Gateway task first - it has the shortest deadline.',
    'Consider breaking down the Dashboard Analytics task into smaller subtasks.',
    'You have 2 bugs assigned - tackle the critical one before the high priority.',
  ]);

  const todayStats = {
    activeTasks: 3,
    completedToday: 2,
    bugsAssigned: 2,
    hoursWorked: '4h 35m',
  };

  const priorityAlerts = [
    { type: 'urgent', message: 'Payment Gateway deadline in 1h 15m', action: 'Resume' },
    { type: 'warning', message: 'Bug BUG-001 marked as critical', action: 'View' },
    { type: 'info', message: 'Code review pending for Login Module', action: 'Check' },
  ];

  const blockedTasks = [
    { id: 'TASK-041', title: 'API Documentation', reason: 'Waiting for backend specs', since: '2 hours' },
  ];

  const activeTasks = [
    { id: 'TASK-042', title: 'Payment Gateway Integration', priority: 'urgent', progress: 65, deadline: '1h 15m' },
    { id: 'TASK-039', title: 'Dashboard Analytics Widget', priority: 'high', progress: 30, deadline: '3h' },
    { id: 'TASK-045', title: 'User Profile Update', priority: 'medium', progress: 10, deadline: '6h' },
  ];

  const quickActions = [
    { label: 'Accept Next Task', icon: Play, color: 'cyan' },
    { label: 'Resume Timer', icon: Clock, color: 'emerald' },
    { label: 'Submit Code', icon: ArrowRight, color: 'violet' },
  ];

  const handleAISend = () => {
    if (!aiMessage.trim()) return;
    // In real implementation, this would call the AI
    setAiMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-cyan-400" />
            Command Center
          </h1>
          <p className="text-slate-400 mt-1">Your daily developer dashboard with AI insights</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">Online</span>
        </motion.div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-400">Active Tasks</span>
          </div>
          <p className="text-3xl font-bold text-white">{todayStats.activeTasks}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Completed</span>
          </div>
          <p className="text-3xl font-bold text-white">{todayStats.completedToday}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-slate-400">Bugs</span>
          </div>
          <p className="text-3xl font-bold text-white">{todayStats.bugsAssigned}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-violet-500/10 border border-violet-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-violet-400" />
            <span className="text-sm text-slate-400">Time Worked</span>
          </div>
          <p className="text-3xl font-bold text-white">{todayStats.hoursWorked}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Priority Alerts
          </h2>
          <div className="space-y-3">
            {priorityAlerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  alert.type === 'urgent' 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : alert.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <span className={`text-sm ${
                  alert.type === 'urgent' ? 'text-red-400' : alert.type === 'warning' ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  {alert.message}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`${
                    alert.type === 'urgent' ? 'text-red-400 hover:bg-red-500/20' : 
                    alert.type === 'warning' ? 'text-amber-400 hover:bg-amber-500/20' : 
                    'text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  {alert.action}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Blocked Tasks */}
          {blockedTasks.length > 0 && (
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Blocked Tasks ({blockedTasks.length})
              </h3>
              {blockedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-500">{task.id}</span>
                    <p className="text-sm text-white">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.reason} • Blocked for {task.since}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400">
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-3">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                className={`flex-1 border-${action.color}-500/30 text-${action.color}-400 hover:bg-${action.color}-500/10`}
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-400" />
            AI Suggestions
            <Sparkles className="w-4 h-4 text-violet-400" />
          </h2>
          
          <div className="space-y-3 mb-4">
            {aiSuggestions.map((suggestion, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20"
              >
                <p className="text-sm text-slate-300">{suggestion}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAISend()}
              placeholder="Ask AI..."
              className="bg-slate-900/50 border-violet-500/30 text-sm"
            />
            <Button onClick={handleAISend} className="bg-violet-600 hover:bg-violet-500">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          Active Tasks
        </h2>
        <div className="space-y-4">
          {activeTasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">{task.id}</span>
                  <h4 className="font-medium text-white">{task.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${
                    task.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    task.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                    'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {task.priority}
                  </Badge>
                  <span className="text-amber-400 text-sm flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {task.deadline}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-slate-400">Progress</span>
                <span className="text-cyan-400">{task.progress}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperCommandCenterComplete;
