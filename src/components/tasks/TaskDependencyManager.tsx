import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, Plus, Link2, Clock, User, CheckCircle, 
  XCircle, AlertTriangle, ChevronDown, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Subtask {
  id: string;
  title: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimatedHours: number;
}

interface TaskWithDeps {
  id: string;
  title: string;
  status: string;
  priority: string;
  dependencies: string[];
  subtasks: Subtask[];
  isBlocked: boolean;
  blockedBy?: string;
}

const mockTasks: TaskWithDeps[] = [
  {
    id: 'T001',
    title: 'E-Commerce Platform Redesign',
    status: 'in_progress',
    priority: 'high',
    dependencies: [],
    isBlocked: false,
    subtasks: [
      { id: 'S001', title: 'Database Schema Update', assignee: 'vala(dev)4412', status: 'completed', estimatedHours: 4 },
      { id: 'S002', title: 'API Endpoints', assignee: 'vala(dev)7823', status: 'in_progress', estimatedHours: 8 },
      { id: 'S003', title: 'Frontend Components', assignee: 'vala(dev)5567', status: 'pending', estimatedHours: 12 },
      { id: 'S004', title: 'Testing & QA', assignee: 'vala(qa)2341', status: 'blocked', estimatedHours: 6 },
    ]
  },
  {
    id: 'T002',
    title: 'Payment Gateway Integration',
    status: 'blocked',
    priority: 'critical',
    dependencies: ['T001'],
    isBlocked: true,
    blockedBy: 'E-Commerce Platform Redesign',
    subtasks: [
      { id: 'S005', title: 'Razorpay SDK Setup', assignee: 'vala(dev)4412', status: 'blocked', estimatedHours: 3 },
      { id: 'S006', title: 'Payment Flow Implementation', assignee: 'vala(dev)7823', status: 'pending', estimatedHours: 10 },
    ]
  },
  {
    id: 'T003',
    title: 'Admin Dashboard Updates',
    status: 'pending',
    priority: 'medium',
    dependencies: ['T001', 'T002'],
    isBlocked: true,
    blockedBy: 'Payment Gateway Integration',
    subtasks: []
  }
];

const TaskDependencyManager = () => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(['T001']));
  const [tasks] = useState<TaskWithDeps[]>(mockTasks);

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const updated = new Set(prev);
      if (updated.has(taskId)) {
        updated.delete(taskId);
      } else {
        updated.add(taskId);
      }
      return updated;
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'emerald', icon: CheckCircle };
      case 'in_progress':
        return { color: 'blue', icon: Clock };
      case 'blocked':
        return { color: 'red', icon: XCircle };
      default:
        return { color: 'slate', icon: Clock };
    }
  };

  const completedSubtasks = (subtasks: Subtask[]) => 
    subtasks.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Dependencies & Subtasking</h2>
          <p className="text-slate-400 mt-1">Manage parent/child tasks and dependency chains</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Parent Task
        </Button>
      </div>

      {/* Dependency Chain Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-slate-800/50 border border-violet-500/20 backdrop-blur-sm"
      >
        <h3 className="text-sm font-medium text-slate-400 mb-4">Dependency Chain</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex items-center gap-2">
              <div className={`px-4 py-2 rounded-lg border ${
                task.isBlocked 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : task.status === 'in_progress'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                <div className="text-xs font-mono text-slate-500">{task.id}</div>
                <div className="text-sm font-medium truncate max-w-[150px]">{task.title}</div>
              </div>
              {index < tasks.length - 1 && (
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Link2 className="w-5 h-5 text-slate-500" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Task List with Subtasks */}
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const isExpanded = expandedTasks.has(task.id);
          const statusConfig = getStatusConfig(task.status);

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl border backdrop-blur-sm overflow-hidden ${
                task.isBlocked 
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              {/* Parent Task Header */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                    <div className={`w-10 h-10 rounded-lg bg-${statusConfig.color}-500/20 flex items-center justify-center`}>
                      <GitBranch className={`w-5 h-5 text-${statusConfig.color}-400`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">{task.id}</span>
                        <Badge className={`bg-${task.priority === 'critical' ? 'red' : task.priority === 'high' ? 'orange' : 'green'}-500/20 text-${task.priority === 'critical' ? 'red' : task.priority === 'high' ? 'orange' : 'green'}-400`}>
                          {task.priority}
                        </Badge>
                        {task.isBlocked && (
                          <Badge className="bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Blocked
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-white mt-1">{task.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {task.subtasks.length > 0 && (
                      <div className="text-sm text-slate-400">
                        {completedSubtasks(task.subtasks)}/{task.subtasks.length} subtasks
                      </div>
                    )}
                    {task.dependencies.length > 0 && (
                      <div className="text-xs text-slate-500">
                        Depends on: {task.dependencies.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {task.isBlocked && task.blockedBy && (
                  <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Blocked by: {task.blockedBy}
                  </div>
                )}
              </div>

              {/* Subtasks */}
              {isExpanded && task.subtasks.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-700/50"
                >
                  <div className="p-4 bg-slate-900/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-400">Subtasks</span>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Add Subtask
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {task.subtasks.map((subtask) => {
                        const subConfig = getStatusConfig(subtask.status);
                        return (
                          <motion.div
                            key={subtask.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              subtask.status === 'blocked'
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-slate-800/50 border-slate-700/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <subConfig.icon className={`w-4 h-4 text-${subConfig.color}-400`} />
                              <div>
                                <p className="text-sm text-white">{subtask.title}</p>
                                <p className="text-xs text-slate-500">{subtask.estimatedHours}h estimated</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <User className="w-3 h-3" />
                                {subtask.assignee}
                              </div>
                              <Badge className={`bg-${subConfig.color}-500/20 text-${subConfig.color}-400 text-xs`}>
                                {subtask.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskDependencyManager;
