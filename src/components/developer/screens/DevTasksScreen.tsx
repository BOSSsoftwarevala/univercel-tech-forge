/**
 * DEVELOPER TASKS SCREEN
 * My Tasks and Team Tasks with timeline
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ListTodo,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Timer,
  AlertCircle
} from 'lucide-react';

interface DevTasksScreenProps {
  view: 'my' | 'team';
}

export const DevTasksScreen: React.FC<DevTasksScreenProps> = ({ view }) => {
  const [activeTimer, setActiveTimer] = useState<number | null>(1);
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'sprint'>('daily');

  const myTasks = [
    { id: 1, title: 'Fix authentication timeout', project: 'E-Commerce Platform', priority: 'high', status: 'in-progress', time: '02:34:15', deadline: '2h left' },
    { id: 2, title: 'Implement payment gateway', project: 'CRM Dashboard', priority: 'high', status: 'pending', time: '00:00:00', deadline: '4h left' },
    { id: 3, title: 'Review PR #234', project: 'Healthcare Portal', priority: 'medium', status: 'pending', time: '00:00:00', deadline: 'Tomorrow' },
    { id: 4, title: 'Update API documentation', project: 'E-Commerce Platform', priority: 'low', status: 'completed', time: '01:15:30', deadline: 'Done' }
  ];

  const teamTasks = [
    { id: 5, title: 'Database optimization', assignee: 'John D.', project: 'E-Commerce Platform', priority: 'high', status: 'in-progress', deadline: '3h left' },
    { id: 6, title: 'Frontend refactoring', assignee: 'Sarah M.', project: 'CRM Dashboard', priority: 'medium', status: 'pending', deadline: '6h left' },
    { id: 7, title: 'Security audit', assignee: 'Mike R.', project: 'Healthcare Portal', priority: 'high', status: 'in-progress', deadline: '2h left' },
    { id: 8, title: 'Performance testing', assignee: 'Lisa K.', project: 'Payment Gateway', priority: 'medium', status: 'completed', deadline: 'Done' }
  ];

  const tasks = view === 'my' ? myTasks : teamTasks;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-cyan-500/20 text-cyan-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {view === 'my' ? 'My Tasks' : 'Team Tasks'}
          </h1>
          <p className="text-slate-400 text-sm">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2">
          {(['daily', 'weekly', 'sprint'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border transition-colors ${
              activeTimer === task.id && view === 'my'
                ? 'bg-cyan-500/5 border-cyan-500/30'
                : 'bg-slate-900/50 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Status indicator */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(task.status)}`}>
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : task.status === 'in-progress' ? (
                    <Timer className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>

                {/* Task info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{task.project}</span>
                    {view === 'team' && 'assignee' in task && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.assignee}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {task.deadline}
                    </span>
                  </div>
                </div>

                {/* Timer (My Tasks only) */}
                {view === 'my' && 'time' in task && (
                  <div className="text-right">
                    <p className={`font-mono text-lg ${activeTimer === task.id ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {task.time}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                {view === 'my' && task.status !== 'completed' && (
                  <>
                    {activeTimer === task.id ? (
                      <button
                        onClick={() => setActiveTimer(null)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm"
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTimer(task.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                    )}
                  </>
                )}
                {task.status !== 'completed' && (
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Done
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
