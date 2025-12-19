import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, AlertTriangle, CheckCircle, Play, Pause,
  FileCode, Tag, Calendar, Timer, ChevronRight,
  Bell, Zap, Filter, Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  title: string;
  category: string;
  techStack: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'in_progress' | 'testing' | 'completed';
  slaHours: number;
  assignedAt: Date;
  deadline: Date;
  taskAmount: number;
  buzzerActive: boolean;
  clientMasked: string;
}

const mockTasks: Task[] = [
  {
    id: 'TSK-2847',
    title: 'E-commerce Cart Module Development',
    category: 'Frontend Development',
    techStack: ['React', 'TypeScript', 'Node.js'],
    priority: 'urgent',
    status: 'pending',
    slaHours: 2,
    assignedAt: new Date(),
    deadline: new Date(Date.now() + 7200000),
    taskAmount: 2500,
    buzzerActive: true,
    clientMasked: 'Client_ABC***'
  },
  {
    id: 'TSK-2846',
    title: 'API Integration - Payment Gateway',
    category: 'Backend Development',
    techStack: ['Node.js', 'Express', 'Stripe'],
    priority: 'high',
    status: 'in_progress',
    slaHours: 2,
    assignedAt: new Date(Date.now() - 3600000),
    deadline: new Date(Date.now() + 3600000),
    taskAmount: 3000,
    buzzerActive: false,
    clientMasked: 'Client_XYZ***'
  },
  {
    id: 'TSK-2845',
    title: 'Dashboard Analytics Component',
    category: 'Frontend Development',
    techStack: ['React', 'Recharts', 'TailwindCSS'],
    priority: 'medium',
    status: 'testing',
    slaHours: 2,
    assignedAt: new Date(Date.now() - 5400000),
    deadline: new Date(Date.now() + 900000),
    taskAmount: 2000,
    buzzerActive: false,
    clientMasked: 'Client_DEF***'
  }
];

const TaskInbox = () => {
  const [tasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-500/20 text-slate-400';
      case 'accepted': return 'bg-blue-500/20 text-blue-400';
      case 'in_progress': return 'bg-cyan-500/20 text-cyan-400';
      case 'testing': return 'bg-purple-500/20 text-purple-400';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTimeRemaining = (deadline: Date) => {
    const diff = deadline.getTime() - Date.now();
    if (diff <= 0) return { text: 'Overdue', color: 'text-red-400', urgent: true };
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours === 0 && minutes < 30) return { text: `${minutes}m`, color: 'text-red-400', urgent: true };
    if (hours === 0) return { text: `${minutes}m`, color: 'text-orange-400', urgent: false };
    return { text: `${hours}h ${minutes}m`, color: 'text-cyan-400', urgent: false };
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Inbox</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your assigned tasks with SLA timers</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 bg-slate-800/50 border border-cyan-500/20 rounded-xl p-1">
            {['all', 'pending', 'in_progress', 'testing'].map((f) => (
              <Button
                key={f}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(f)}
                className={`text-xs capitalize ${filter === f ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
              >
                {f.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredTasks.map((task, index) => {
            const timeRemaining = getTimeRemaining(task.deadline);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`p-4 bg-slate-900/50 border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer ${
                    task.buzzerActive ? 'ring-2 ring-red-500/50 animate-pulse' : ''
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        {task.buzzerActive && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          >
                            <Bell className="w-4 h-4 text-red-400" />
                          </motion.div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white truncate">{task.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{task.category}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {task.techStack.map((tech) => (
                          <span 
                            key={tech}
                            className="px-2 py-1 bg-slate-800 text-cyan-400 text-xs rounded-lg"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timer & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {/* SLA Timer */}
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                        timeRemaining.urgent 
                          ? 'bg-red-500/10 border border-red-500/30' 
                          : 'bg-slate-800/50 border border-cyan-500/20'
                      }`}>
                        <Timer className={`w-5 h-5 ${timeRemaining.color}`} />
                        <span className={`font-mono text-lg font-bold ${timeRemaining.color}`}>
                          {timeRemaining.text}
                        </span>
                      </div>

                      {/* Task Amount */}
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Zap className="w-4 h-4" />
                        <span className="font-semibold">₹{task.taskAmount.toLocaleString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {task.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
                          >
                            <Play className="w-4 h-4" />
                            I Agree & Start
                          </Button>
                        )}
                        {task.status === 'in_progress' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Submit
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for active tasks */}
                  {task.status === 'in_progress' && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      <div className="flex justify-between mt-2">
                        {['Started', 'Coding', 'Testing', 'Ready'].map((step, i) => (
                          <span 
                            key={step}
                            className={`text-xs ${i <= 1 ? 'text-cyan-400' : 'text-slate-500'}`}
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskInbox;
