import { motion } from 'framer-motion';
import { ListTodo, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'critical';
  slaCountdown: string;
  status: 'pending' | 'accepted';
}

interface ActiveTasksCardProps {
  tasks: Task[];
  onAccept: (taskId: string) => void;
  onReject: (taskId: string) => void;
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  medium: { label: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  critical: { label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const ActiveTasksCard = ({ tasks, onAccept, onReject }: ActiveTasksCardProps) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/20">
          <ListTodo className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Active Tasks</h3>
        {pendingTasks.length > 0 && (
          <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            {pendingTasks.length} pending
          </Badge>
        )}
      </div>

      {pendingTasks.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400/50" />
          <p>No pending tasks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500 font-mono">{task.id}</span>
                    <Badge variant="outline" className={priorityConfig[task.priority].color}>
                      {task.priority === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {priorityConfig[task.priority].label}
                    </Badge>
                  </div>
                  <h4 className="text-white font-medium">{task.title}</h4>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{task.slaCountdown}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onAccept(task.id)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Task
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(task.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ActiveTasksCard;
