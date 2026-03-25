import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Clock, CheckCircle2, XCircle, AlertTriangle,
  Code2, Timer, Play, Shield, FileText, Tag, Handshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import PromiseTaskCard from '@/components/shared/PromiseTaskCard';
import { PromiseStatus } from '@/components/shared/PromiseButton';
import promiseHandshakeIcon from '@/assets/promise-handshake-icon.jpg';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  maxDeliveryHours: number;
  buzzerActive: boolean;
  assignedAt: Date;
  clientInfo: { masked: true; industry: string };
  promiseStatus: PromiseStatus;
  deadline?: string;
  startedAt?: string;
  slaHours?: number;
}

const DevTaskAssignment = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Payment Gateway Integration',
      description: 'Integrate Razorpay payment gateway with existing checkout flow. Handle success/failure callbacks.',
      category: 'Backend Development',
      techStack: ['Node.js', 'Express', 'MongoDB'],
      priority: 'urgent',
      estimatedHours: 2,
      maxDeliveryHours: 2,
      buzzerActive: true,
      assignedAt: new Date(),
      clientInfo: { masked: true, industry: 'E-commerce' },
      promiseStatus: 'assigned',
      slaHours: 2,
    },
    {
      id: '2',
      title: 'Dashboard Analytics Widget',
      description: 'Create interactive charts for sales analytics using Chart.js. Include date filters.',
      category: 'Frontend Development',
      techStack: ['React', 'TypeScript', 'Chart.js'],
      priority: 'high',
      estimatedHours: 1.5,
      maxDeliveryHours: 2,
      buzzerActive: true,
      assignedAt: new Date(Date.now() - 300000),
      clientInfo: { masked: true, industry: 'Finance' },
      promiseStatus: 'assigned',
      slaHours: 2,
    },
    {
      id: '3',
      title: 'User Authentication Module',
      description: 'Implement JWT-based authentication with refresh token rotation.',
      category: 'Backend Development',
      techStack: ['Node.js', 'JWT', 'Redis'],
      priority: 'medium',
      estimatedHours: 3,
      maxDeliveryHours: 4,
      buzzerActive: false,
      assignedAt: new Date(Date.now() - 3600000),
      clientInfo: { masked: true, industry: 'SaaS' },
      promiseStatus: 'in_progress',
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      deadline: new Date(Date.now() + 7200000).toISOString(),
      slaHours: 4,
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPromiseModal, setShowPromiseModal] = useState(false);

  const handlePromiseStart = async (taskId: string, deadline: Date) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            buzzerActive: false,
            promiseStatus: 'promised' as PromiseStatus,
            startedAt: new Date().toISOString(),
            deadline: deadline.toISOString(),
          }
        : t
    ));
    
    // Simulate updating database
    // In production: await supabase.from('promise_logs').insert(...)
  };

  const handlePromiseComplete = async (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            promiseStatus: 'completed' as PromiseStatus,
          }
        : t
    ));
  };

  const handleRejectTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.error("Task Rejected - Will be reassigned to another developer");
  };

  const pendingTasks = tasks.filter(t => t.promiseStatus === 'assigned');
  const activeTasks = tasks.filter(t => t.promiseStatus === 'promised' || t.promiseStatus === 'in_progress');
  const completedTasks = tasks.filter(t => t.promiseStatus === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <img 
              src={promiseHandshakeIcon} 
              alt="Promise" 
              className="w-10 h-10 rounded-full border-2 border-cyan-500/50"
            />
            Task Assignment
          </h1>
          <p className="text-slate-400 mt-1">Accept tasks to start the promise timer. Buzzer requires action.</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingTasks.some(t => t.buzzerActive) && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <Bell className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">
                {pendingTasks.filter(t => t.buzzerActive).length} BUZZER ACTIVE
              </span>
            </motion.div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">{pendingTasks.length} Pending</span>
          </div>
        </div>
      </div>

      {/* Promise Legend */}
      <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Handshake className="w-4 h-4 text-cyan-400" />
          Promise Status Guide
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { status: 'assigned', label: 'Assigned', color: 'slate' },
            { status: 'promised', label: 'Promised', color: 'cyan' },
            { status: 'in_progress', label: 'In Progress', color: 'amber' },
            { status: 'completed', label: 'Completed', color: 'green' },
            { status: 'breached', label: 'Breached', color: 'red' },
          ].map(item => (
            <div 
              key={item.status}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${item.color}-500/20 border border-${item.color}-500/30`}
            >
              <div className={`w-2 h-2 rounded-full bg-${item.color}-400`} />
              <span className={`text-xs text-${item.color}-400`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Tasks Section */}
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Pending Tasks ({pendingTasks.length})
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="relative">
                {/* Buzzer Alert Overlay */}
                {task.buzzerActive && (
                  <motion.div
                    className="absolute -inset-1 bg-red-500/20 rounded-2xl z-0"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
                <div className="relative z-10">
                  <PromiseTaskCard
                    task={{
                      ...task,
                      clientMasked: `[MASKED] • ${task.clientInfo.industry}`,
                    }}
                    onPromiseStart={handlePromiseStart}
                    onPromiseComplete={handlePromiseComplete}
                    showTimer={false}
                  />
                  {/* Reject Button */}
                  <div className="mt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectTask(task.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Task
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Tasks Section */}
      {activeTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Timer className="w-5 h-5 text-cyan-400" />
            Active Promises ({activeTasks.length})
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {activeTasks.map((task) => (
              <PromiseTaskCard
                key={task.id}
                task={{
                  ...task,
                  clientMasked: `[MASKED] • ${task.clientInfo.industry}`,
                }}
                onPromiseStart={handlePromiseStart}
                onPromiseComplete={handlePromiseComplete}
                showTimer={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Completed Today ({completedTasks.length})
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {completedTasks.map((task) => (
              <PromiseTaskCard
                key={task.id}
                task={{
                  ...task,
                  clientMasked: `[MASKED] • ${task.clientInfo.industry}`,
                }}
                showTimer={false}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
          <p className="text-slate-400">No pending tasks at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default DevTaskAssignment;
