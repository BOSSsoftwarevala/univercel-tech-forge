/**
 * LIVE RUNNING TASKS
 * Shows compact list of running tasks with progress bars
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  name: string;
  progress: number;
  status: 'running' | 'waiting' | 'error' | 'completed';
}

export const LiveRunningTasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks] = useState<Task[]>([
    { id: '1', name: 'Data Sync', progress: 65, status: 'running' },
    { id: '2', name: 'Report Gen', progress: 30, status: 'running' },
    { id: '3', name: 'Backup', progress: 0, status: 'waiting' },
  ]);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />;
      case 'waiting':
        return <Clock className="w-3 h-3 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-emerald-400" />;
    }
  };

  const getProgressColor = (status: Task['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'waiting': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'completed': return 'bg-emerald-500';
    }
  };

  return (
    <>
      <div className="space-y-1.5">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            whileHover={{ x: 2 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/80 font-medium truncate max-w-[100px]">
                {task.name}
              </span>
              {getStatusIcon(task.status)}
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", getProgressColor(task.status))}
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Detail Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedTask(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{selectedTask.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{selectedTask.status}</p>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Progress</label>
                  <div className="mt-1">
                    <Progress value={selectedTask.progress} className="h-2" />
                    <p className="text-xs text-right mt-1">{selectedTask.progress}%</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">Task ID</label>
                  <p className="text-sm font-mono">{selectedTask.id}</p>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">Started</label>
                  <p className="text-sm">2 minutes ago</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
