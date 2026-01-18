/**
 * LIVE RUNNING TASKS
 * Shows compact list of running tasks with progress bars
 * OPTIMIZED: Removed framer-motion, memoized components
 */

import React, { useState, memo, useCallback } from 'react';
import { X, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  name: string;
  progress: number;
  status: 'running' | 'waiting' | 'error' | 'completed';
}

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

const TaskRow = memo<{ task: Task; onClick: () => void }>(({ task, onClick }) => (
  <div
    onClick={onClick}
    className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
  >
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] text-white/80 font-medium truncate max-w-[100px]">
        {task.name}
      </span>
      {getStatusIcon(task.status)}
    </div>
    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-500", getProgressColor(task.status))}
        style={{ width: `${task.progress}%` }}
      />
    </div>
  </div>
));

TaskRow.displayName = 'TaskRow';

const TaskDetail = memo<{ task: Task; onClose: () => void }>(({ task, onClose }) => (
  <>
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={onClose}
    />
    <div className="fixed right-0 top-0 bottom-0 w-72 bg-card border-l border-border z-50 flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{task.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">{task.status}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Progress</label>
          <div className="mt-1">
            <Progress value={task.progress} className="h-2" />
            <p className="text-xs text-right mt-1">{task.progress}%</p>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground">Task ID</label>
          <p className="text-sm font-mono">{task.id}</p>
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground">Started</label>
          <p className="text-sm">2 minutes ago</p>
        </div>
      </div>
    </div>
  </>
));

TaskDetail.displayName = 'TaskDetail';

export const LiveRunningTasks: React.FC = memo(() => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks] = useState<Task[]>([
    { id: '1', name: 'Data Sync', progress: 65, status: 'running' },
    { id: '2', name: 'Report Gen', progress: 30, status: 'running' },
    { id: '3', name: 'Backup', progress: 0, status: 'waiting' },
  ]);

  const handleClose = useCallback(() => setSelectedTask(null), []);

  return (
    <>
      <div className="space-y-1.5">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={handleClose} />
      )}
    </>
  );
});

LiveRunningTasks.displayName = 'LiveRunningTasks';
