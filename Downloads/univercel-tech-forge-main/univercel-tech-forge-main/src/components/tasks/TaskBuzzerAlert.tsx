import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, AlertTriangle, Volume2, VolumeX, CheckCircle, 
  Clock, User, Zap, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UnassignedTask {
  id: string;
  title: string;
  priority: string;
  createdAt: string;
  waitingTime: number; // in minutes
  targetRole: string;
}

const TaskBuzzerAlert = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [acknowledgedTasks, setAcknowledgedTasks] = useState<Set<string>>(new Set());
  const [unassignedTasks, setUnassignedTasks] = useState<UnassignedTask[]>([
    { id: '1', title: 'Critical Bug - Payment Gateway', priority: 'critical', createdAt: '10:30 AM', waitingTime: 45, targetRole: 'Developer' },
    { id: '2', title: 'Client Demo Setup', priority: 'high', createdAt: '11:15 AM', waitingTime: 30, targetRole: 'Sales' },
    { id: '3', title: 'Support Escalation - Prime User', priority: 'prime', createdAt: '11:45 AM', waitingTime: 15, targetRole: 'Support' },
  ]);

  // Buzzer effect for critical tasks
  useEffect(() => {
    const interval = setInterval(() => {
      const criticalUnacknowledged = unassignedTasks.filter(
        t => (t.priority === 'critical' || t.priority === 'prime') && !acknowledgedTasks.has(t.id)
      );
      
      if (criticalUnacknowledged.length > 0 && soundEnabled) {
        // Trigger visual buzzer effect
        document.body.style.animation = 'none';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 10);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [unassignedTasks, acknowledgedTasks, soundEnabled]);

  const handleAcknowledge = (taskId: string) => {
    setAcknowledgedTasks(prev => new Set([...prev, taskId]));
  };

  const handleAcceptTask = (taskId: string) => {
    setUnassignedTasks(prev => prev.filter(t => t.id !== taskId));
    setAcknowledgedTasks(prev => {
      const updated = new Set(prev);
      updated.delete(taskId);
      return updated;
    });
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { color: 'red', icon: AlertTriangle, label: 'CRITICAL' };
      case 'prime':
        return { color: 'purple', icon: Zap, label: 'PRIME PRIORITY' };
      case 'high':
        return { color: 'orange', icon: Bell, label: 'HIGH' };
      default:
        return { color: 'blue', icon: Bell, label: 'NORMAL' };
    }
  };

  const unacknowledgedCount = unassignedTasks.filter(t => !acknowledgedTasks.has(t.id)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Buzzer Alert System</h2>
          <p className="text-slate-400 mt-1">Tasks waiting for assignment with forced acknowledgment</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={soundEnabled ? 'border-emerald-500/50 text-emerald-400' : 'border-slate-600 text-slate-400'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
            Sound {soundEnabled ? 'On' : 'Off'}
          </Button>
          {unacknowledgedCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50"
            >
              <Bell className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">{unacknowledgedCount} Unacknowledged</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Unassigned Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {unassignedTasks.map((task, index) => {
            const config = getPriorityConfig(task.priority);
            const isAcknowledged = acknowledgedTasks.has(task.id);
            const isCritical = task.priority === 'critical' || task.priority === 'prime';

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  boxShadow: !isAcknowledged && isCritical 
                    ? ['0 0 0 0 rgba(239,68,68,0)', '0 0 30px 10px rgba(239,68,68,0.3)', '0 0 0 0 rgba(239,68,68,0)']
                    : 'none'
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.1,
                  boxShadow: { duration: 1.5, repeat: Infinity }
                }}
                className={`p-4 rounded-xl border backdrop-blur-sm ${
                  isCritical && !isAcknowledged
                    ? `bg-${config.color}-500/10 border-${config.color}-500/50`
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                {/* Buzzer Animation Overlay */}
                {!isAcknowledged && isCritical && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{ 
                      background: [
                        'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
                        'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)'
                      ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                {/* Task Header */}
                <div className="flex items-start justify-between mb-4 relative">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={!isAcknowledged && isCritical ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className={`w-10 h-10 rounded-lg bg-${config.color}-500/20 flex items-center justify-center`}
                    >
                      <config.icon className={`w-5 h-5 text-${config.color}-400`} />
                    </motion.div>
                    <div>
                      <Badge className={`bg-${config.color}-500/20 text-${config.color}-400 mb-1`}>
                        {config.label}
                      </Badge>
                      <h3 className="font-medium text-white">{task.title}</h3>
                    </div>
                  </div>
                  {isAcknowledged && (
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Acknowledged
                    </Badge>
                  )}
                </div>

                {/* Task Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Created: {task.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Target: {task.targetRole}</span>
                  </div>
                </div>

                {/* Waiting Time */}
                <div className={`p-3 rounded-lg mb-4 ${
                  task.waitingTime > 30 
                    ? 'bg-red-500/10 border border-red-500/20' 
                    : 'bg-slate-900/50 border border-slate-700/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Waiting Time</span>
                    <span className={`text-lg font-bold ${
                      task.waitingTime > 30 ? 'text-red-400' : 'text-white'
                    }`}>
                      {task.waitingTime} minutes
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!isAcknowledged ? (
                    <Button 
                      onClick={() => handleAcknowledge(task.id)}
                      className={`flex-1 bg-${config.color}-500/20 text-${config.color}-400 hover:bg-${config.color}-500/30`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Acknowledge
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={() => handleAcceptTask(task.id)}
                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600"
                      >
                        Accept Task
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1"
                      >
                        Reassign
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {unassignedTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">All Clear!</h3>
          <p className="text-slate-400">No unassigned tasks waiting</p>
        </motion.div>
      )}
    </div>
  );
};

export default TaskBuzzerAlert;
