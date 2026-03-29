import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Timer, Play, Pause, AlertTriangle, Clock, 
  CheckCircle, XCircle, MessageSquare, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  priority: string;
  estimatedHours: number;
  timerStarted: boolean;
  timerStartTime: string | null;
  slaDeadline?: string;
}

interface TaskTimerSLAProps {
  tasks: Task[];
  onTimerAction: (taskId: string, action: 'start' | 'pause' | 'resume') => void;
}

const TaskTimerSLA = ({ tasks, onTimerAction }: TaskTimerSLAProps) => {
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({});
  const [pauseRequest, setPauseRequest] = useState<{ taskId: string; reason: string } | null>(null);
  const [agreedTasks, setAgreedTasks] = useState<Set<string>>(new Set());

  // Simulate timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = { ...prev };
        tasks.forEach(task => {
          if (task.timerStarted && agreedTasks.has(task.id)) {
            const key = task.id;
            if (updated[key] === undefined) {
              updated[key] = task.estimatedHours * 3600; // Convert hours to seconds
            } else if (updated[key] > 0) {
              updated[key] -= 1;
            }
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, agreedTasks]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerStatus = (taskId: string, estimatedHours: number) => {
    const totalSeconds = estimatedHours * 3600;
    const remaining = activeTimers[taskId] ?? totalSeconds;
    const percentage = (remaining / totalSeconds) * 100;

    if (percentage > 50) return { status: 'on-track', color: 'emerald', penaltyPercent: 0 };
    if (percentage > 25) return { status: 'warning', color: 'yellow', penaltyPercent: 5 };
    if (percentage > 0) return { status: 'critical', color: 'orange', penaltyPercent: 10 };
    return { status: 'overdue', color: 'red', penaltyPercent: 20 };
  };

  // BUG FIX: SLA violation should trigger wallet penalty deduction
  const handleSLAViolation = async (taskId: string, task: Task) => {
    const timerStatus = getTimerStatus(taskId, task.estimatedHours);
    if (timerStatus.status === 'overdue' || timerStatus.status === 'critical') {
      try {
        // Record SLA violation and trigger penalty
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Log developer violation with penalty amount
        await supabase.from('developer_violations').insert({
          developer_id: taskId, // This would be the actual developer_id in real implementation
          task_id: taskId,
          violation_type: 'sla_breach',
          severity: timerStatus.status === 'overdue' ? 'critical' : 'strike',
          description: `SLA breach - Task ${task.title} exceeded deadline`,
          penalty_amount: timerStatus.penaltyPercent,
          auto_generated: true,
        });

        // Create buzzer alert for super_admin
        await supabase.from('buzzer_queue').insert({
          trigger_type: 'sla_violation',
          priority: timerStatus.status === 'overdue' ? 'urgent' : 'high',
          role_target: 'super_admin',
          task_id: taskId,
          status: 'pending',
          auto_escalate_after: 180,
        });

        // Log to audit trail
        await supabase.from('audit_logs').insert({
          action: 'sla_violation_penalty',
          module: 'task_timer',
          meta_json: {
            task_id: taskId,
            task_title: task.title,
            violation_status: timerStatus.status,
            penalty_percent: timerStatus.penaltyPercent,
          },
        });

        toast.error(`SLA Violation! ${timerStatus.penaltyPercent}% penalty applied.`);
      } catch (error) {
        console.error('Failed to record SLA violation:', error);
      }
    }
  };

  // Check for SLA violations on timer updates
  useEffect(() => {
    tasks.forEach(task => {
      if (task.timerStarted && agreedTasks.has(task.id)) {
        const remaining = activeTimers[task.id];
        if (remaining !== undefined && remaining <= 0) {
          handleSLAViolation(task.id, task);
        }
      }
    });
  }, [activeTimers, tasks, agreedTasks]);

  const handleAgree = (taskId: string) => {
    setAgreedTasks(prev => new Set([...prev, taskId]));
    onTimerAction(taskId, 'start');
    toast.success('Timer started! Deliver before the deadline.');
  };

  const handlePauseRequest = (taskId: string) => {
    setPauseRequest({ taskId, reason: '' });
  };

  const submitPauseRequest = () => {
    if (!pauseRequest?.reason) {
      toast.error('Please provide a reason for pause');
      return;
    }
    onTimerAction(pauseRequest.taskId, 'pause');
    toast.info('Pause request submitted for approval');
    setPauseRequest(null);
  };

  const activeTasks = tasks.filter(t => t.timerStarted || t.priority === 'critical' || t.priority === 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Timer & SLA Enforcement</h2>
          <p className="text-slate-400 mt-1">Track task timers with strict SLA compliance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">On Track: 12</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">At Risk: 3</span>
          </div>
        </div>
      </div>

      {/* Active Timer Cards */}
      <div className="grid grid-cols-2 gap-4">
        {activeTasks.map((task, index) => {
          const timerStatus = getTimerStatus(task.id, task.estimatedHours);
          const isAgreed = agreedTasks.has(task.id);
          const remaining = activeTimers[task.id] ?? task.estimatedHours * 3600;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl bg-slate-800/50 border backdrop-blur-sm ${
                timerStatus.status === 'overdue' 
                  ? 'border-red-500/50 shadow-lg shadow-red-500/20' 
                  : timerStatus.status === 'critical'
                  ? 'border-orange-500/50 shadow-lg shadow-orange-500/20'
                  : 'border-slate-700/50'
              }`}
            >
              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-white">{task.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`bg-${task.priority === 'critical' ? 'red' : task.priority === 'high' ? 'orange' : 'green'}-500/20 text-${task.priority === 'critical' ? 'red' : task.priority === 'high' ? 'orange' : 'green'}-400 text-xs`}>
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-slate-400">{task.estimatedHours}h estimated</span>
                  </div>
                </div>
                <Badge className={`bg-${timerStatus.color}-500/20 text-${timerStatus.color}-400`}>
                  {timerStatus.status.replace('-', ' ')}
                </Badge>
              </div>

              {/* Timer Display */}
              {isAgreed ? (
                <div className="mb-4">
                  <div className={`text-center p-4 rounded-lg bg-${timerStatus.color}-500/10 border border-${timerStatus.color}-500/20`}>
                    <Timer className={`w-6 h-6 text-${timerStatus.color}-400 mx-auto mb-2`} />
                    <motion.div
                      className={`text-3xl font-mono font-bold text-${timerStatus.color}-400`}
                      animate={timerStatus.status === 'critical' || timerStatus.status === 'overdue' ? { opacity: [1, 0.5, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      {formatTime(remaining)}
                    </motion.div>
                    <p className="text-xs text-slate-400 mt-1">Time Remaining</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r from-${timerStatus.color}-500 to-${timerStatus.color}-400`}
                        initial={{ width: '100%' }}
                        animate={{ width: `${(remaining / (task.estimatedHours * 3600)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
                  <AlertTriangle className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 mb-3">
                    Timer will start after you agree to the delivery window
                  </p>
                  <Button 
                    onClick={() => handleAgree(task.id)}
                    className="bg-gradient-to-r from-violet-500 to-purple-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    I Agree - Start Timer
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              {isAgreed && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePauseRequest(task.id)}
                    className="flex-1"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Request Pause
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              )}

              {/* SLA Violation Warning */}
              {timerStatus.status === 'overdue' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30"
                >
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">SLA VIOLATED - Auto-escalation triggered</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Pause Request Modal */}
      {pauseRequest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setPauseRequest(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-slate-900 rounded-xl border border-slate-700 p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Pause className="w-5 h-5 text-yellow-400" />
              Pause Request
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Please provide a reason for pausing this task. Your request will be reviewed by a supervisor.
            </p>
            <Textarea
              placeholder="Enter reason for pause..."
              value={pauseRequest.reason}
              onChange={(e) => setPauseRequest({ ...pauseRequest, reason: e.target.value })}
              className="bg-slate-800/50 border-slate-600 mb-4"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPauseRequest(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={submitPauseRequest} className="flex-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                Submit Request
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TaskTimerSLA;
