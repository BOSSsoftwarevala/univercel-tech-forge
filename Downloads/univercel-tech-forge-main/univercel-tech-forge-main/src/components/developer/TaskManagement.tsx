import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, Clock, User, AlertCircle, CheckCircle2, 
  Timer, Bot, Code, Rocket, AlertTriangle
} from 'lucide-react';

interface Task {
  id: string;
  clientId: string;
  projectType: string;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed';
  aiEstimate: string;
  priority: 'high' | 'medium' | 'low';
}

const mockTasks: Task[] = [
  { 
    id: 'TSK-001', 
    clientId: 'vala(client)***', 
    projectType: 'POS System', 
    deadline: new Date(Date.now() + 86400000 * 2),
    status: 'pending',
    aiEstimate: '4.5 hours',
    priority: 'high'
  },
  { 
    id: 'TSK-002', 
    clientId: 'vala(franchise)***', 
    projectType: 'School ERP', 
    deadline: new Date(Date.now() + 86400000 * 5),
    status: 'in_progress',
    aiEstimate: '8 hours',
    priority: 'medium'
  },
  { 
    id: 'TSK-003', 
    clientId: 'vala(reseller)***', 
    projectType: 'Hospital CRM', 
    deadline: new Date(Date.now() + 86400000 * 3),
    status: 'pending',
    aiEstimate: '6 hours',
    priority: 'high'
  },
];

const TaskManagement = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState<Record<string, boolean>>({});
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({});

  const formatTimeRemaining = (deadline: Date) => {
    const diff = deadline.getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const handleStartTask = (taskId: string) => {
    if (!agreedToTerms[taskId]) return;
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'in_progress' } : task
    ));
    setActiveTimers(prev => ({ ...prev, [taskId]: Date.now() }));
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Management</h2>
          <p className="text-slate-400 mt-1">Manage and track your assigned tasks</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
            {tasks.filter(t => t.status === 'pending').length} Pending
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
            {tasks.filter(t => t.status === 'in_progress').length} In Progress
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-300 ${
              task.status === 'in_progress' 
                ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                : 'border-slate-700/50 hover:border-slate-600/50'
            }`}
          >
            {/* Status Indicator */}
            {task.status === 'in_progress' && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              />
            )}

            <div className="flex items-start justify-between gap-6">
              {/* Task Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-white">{task.id}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  {task.status === 'in_progress' && (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-medium"
                    >
                      IN PROGRESS
                    </motion.span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-300">{task.clientId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-300">{task.projectType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-cyan-400">Est: {task.aiEstimate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <motion.span
                      animate={{ opacity: task.priority === 'high' ? [1, 0.5, 1] : 1 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-sm text-amber-400 font-mono"
                    >
                      {formatTimeRemaining(task.deadline)}
                    </motion.span>
                  </div>
                </div>

                {/* Consent Checkbox */}
                {task.status === 'pending' && (
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={agreedToTerms[task.id] || false}
                        onChange={(e) => setAgreedToTerms(prev => ({ ...prev, [task.id]: e.target.checked }))}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all ${
                        agreedToTerms[task.id] 
                          ? 'bg-cyan-500 border-cyan-500' 
                          : 'border-slate-600 group-hover:border-cyan-500/50'
                      }`}>
                        {agreedToTerms[task.id] && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-slate-300">
                      I agree to complete this task within the estimated timeframe
                    </span>
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {task.status === 'pending' && (
                  <motion.button
                    whileHover={{ scale: agreedToTerms[task.id] ? 1.05 : 1 }}
                    whileTap={{ scale: agreedToTerms[task.id] ? 0.95 : 1 }}
                    onClick={() => handleStartTask(task.id)}
                    disabled={!agreedToTerms[task.id]}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      agreedToTerms[task.id]
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    START
                  </motion.button>
                )}

                {task.status === 'in_progress' && (
                  <>
                    <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <Timer className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                      <span className="text-lg font-mono text-white">02:34:15</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCompleteTask(task.id)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/20"
                    >
                      <Rocket className="w-4 h-4" />
                      DEPLOY
                    </motion.button>
                  </>
                )}

                {task.status === 'completed' && (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    DELIVERED
                  </div>
                )}
              </div>
            </div>

            {/* Progress Animation for In-Progress Tasks */}
            {task.status === 'in_progress' && (
              <motion.div
                className="mt-4 pt-4 border-t border-slate-700/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500"
                  />
                  <span className="text-sm text-cyan-400">Coding in progress...</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      animate={{ width: ['0%', '60%', '45%', '70%'] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;
