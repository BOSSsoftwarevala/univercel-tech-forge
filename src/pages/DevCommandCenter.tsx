import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import DevNewSidebar from '@/components/developer/DevNewSidebar';
import DevNewHeader from '@/components/developer/DevNewHeader';
import ActiveTasksCard from '@/components/developer/cards/ActiveTasksCard';
import TaskExecutionCard from '@/components/developer/cards/TaskExecutionCard';
import CodeSubmissionCard from '@/components/developer/cards/CodeSubmissionCard';
import BugHandlingCard from '@/components/developer/cards/BugHandlingCard';
import AIAssistantCard from '@/components/developer/cards/AIAssistantCard';
import PerformanceMetricsCard from '@/components/developer/cards/PerformanceMetricsCard';
import TaskChatCard from '@/components/developer/cards/TaskChatCard';
import { toast } from 'sonner';

// Types
interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'critical';
  slaCountdown: string;
  status: 'pending' | 'accepted';
}

interface BugItem {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  slaTimer: string;
  reopenCount: number;
  status: 'open' | 'in_progress' | 'fixed';
}

// Mock data
const mockTasks: Task[] = [
  { id: 'TASK-001', title: 'Implement user authentication flow', priority: 'critical', slaCountdown: '02:30:00', status: 'pending' },
  { id: 'TASK-002', title: 'Fix payment gateway integration', priority: 'medium', slaCountdown: '04:00:00', status: 'pending' },
  { id: 'TASK-003', title: 'Update dashboard UI components', priority: 'low', slaCountdown: '08:00:00', status: 'pending' },
];

const mockBugs: BugItem[] = [
  { id: 'BUG-101', title: 'Login button not responding on mobile', severity: 'high', slaTimer: '01:15:00', reopenCount: 0, status: 'open' },
  { id: 'BUG-102', title: 'Memory leak in data fetching', severity: 'critical', slaTimer: '00:45:00', reopenCount: 1, status: 'in_progress' },
];

const mockChatMessages = [
  { id: '1', maskedSender: 'MGR-***47', message: 'Please prioritize the authentication task', timestamp: '10:30 AM', isAutoTranslated: false },
  { id: '2', maskedSender: 'DEV-***23', message: 'Working on it now', timestamp: '10:32 AM', isAutoTranslated: false },
];

const DevCommandCenter = () => {
  const [activeSection, setActiveSection] = useState('command-center');
  const [tasks, setTasks] = useState(mockTasks);
  const [bugs, setBugs] = useState(mockBugs);
  const [chatMessages, setChatMessages] = useState(mockChatMessages);
  
  // Active task state
  const [activeTask, setActiveTask] = useState<{ id: string; title: string } | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [status, setStatus] = useState<'assigned' | 'in_progress' | 'blocked' | 'review'>('assigned');

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Tab visibility detection for auto-pause
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && timerRunning) {
        setTimerRunning(false);
        toast.warning('Timer paused - tab switched');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [timerRunning]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Task handlers
  const handleAcceptTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActiveTask({ id: task.id, title: task.title });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'accepted' as const } : t));
      setStatus('in_progress');
      setTimerRunning(true);
      setElapsedSeconds(0);
      toast.success('Task accepted! Timer started.');
      // Play sound
      const audio = new Audio('/sounds/accept.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const handleRejectTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    toast.info('Task rejected');
  };

  // Timer handlers
  const handleStartTimer = () => {
    setTimerRunning(true);
    toast.success('Timer started');
    const audio = new Audio('/sounds/start.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handlePauseTimer = () => {
    setTimerRunning(false);
    setStatus('blocked');
    toast.warning('Timer paused');
  };

  const handleRequestHelp = () => {
    toast.info('Help request sent to manager');
  };

  const handleRequestExtension = () => {
    toast.info('Extension request sent');
  };

  // Code submission
  const handleCodeSubmit = (commitHash: string, notes: string) => {
    setStatus('review');
    setTimerRunning(false);
    toast.success('Code submitted for review!');
  };

  // Bug handlers
  const handleMarkFixed = (bugId: string) => {
    setBugs(bugs.map(b => b.id === bugId ? { ...b, status: 'fixed' as const } : b));
    toast.success('Bug marked as fixed');
  };

  const handleReopenBug = (bugId: string) => {
    setBugs(bugs.map(b => b.id === bugId ? { ...b, status: 'open' as const, reopenCount: b.reopenCount + 1 } : b));
    toast.warning('Bug reopened');
  };

  // AI handlers
  const handleAnalyze = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Analysis: This task involves implementing a secure authentication flow. Key areas to focus on: JWT token handling, session management, and proper error handling for edge cases.';
  };

  const handleEstimate = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Estimated completion time: 3-4 hours based on complexity and your historical performance on similar tasks.';
  };

  const handleDetectRisk = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Risk detected: Token expiry handling might cause issues if not properly implemented. Recommend implementing refresh token mechanism.';
  };

  const handleOptimize = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Optimization suggestions: Consider using useMemo for expensive computations, implement lazy loading for non-critical components.';
  };

  // Chat handler
  const handleSendMessage = (message: string) => {
    const newMsg = {
      id: Date.now().toString(),
      maskedSender: 'DEV-***23',
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAutoTranslated: false,
    };
    setChatMessages([...chatMessages, newMsg]);
  };

  // Can submit check (timer must meet SLA - for demo, > 60 seconds)
  const canSubmit = activeTask && elapsedSeconds > 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08),transparent_50%)]" />
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Header */}
      <DevNewHeader
        timerRunning={timerRunning}
        elapsedTime={formatTime(elapsedSeconds)}
        status={status}
        maskedId="DEV-***23"
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <DevNewSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 min-h-screen">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'command-center' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Row 1 */}
                <ActiveTasksCard
                  tasks={tasks}
                  onAccept={handleAcceptTask}
                  onReject={handleRejectTask}
                />
                <TaskExecutionCard
                  taskId={activeTask?.id || null}
                  taskTitle={activeTask?.title || null}
                  timerRunning={timerRunning}
                  elapsedTime={formatTime(elapsedSeconds)}
                  onStartTimer={handleStartTimer}
                  onPauseTimer={handlePauseTimer}
                  onRequestHelp={handleRequestHelp}
                  onRequestExtension={handleRequestExtension}
                />
                <CodeSubmissionCard
                  taskId={activeTask?.id || null}
                  repoLink="github.com/softwarevala/project-alpha"
                  canSubmit={canSubmit}
                  onSubmit={handleCodeSubmit}
                />
                
                {/* Row 2 */}
                <BugHandlingCard
                  bugs={bugs}
                  onMarkFixed={handleMarkFixed}
                  onReopen={handleReopenBug}
                />
                <AIAssistantCard
                  taskId={activeTask?.id || null}
                  taskTitle={activeTask?.title || null}
                  onAnalyze={handleAnalyze}
                  onEstimate={handleEstimate}
                  onDetectRisk={handleDetectRisk}
                  onOptimize={handleOptimize}
                />
                <PerformanceMetricsCard
                  productivity={87}
                  onTime={92}
                  quality={85}
                  penaltyStatus="none"
                />
                
                {/* Row 3 - Full Width Chat */}
                <div className="lg:col-span-2 xl:col-span-3">
                  <TaskChatCard
                    taskId={activeTask?.id || null}
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>
            )}

            {activeSection === 'tasks' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActiveTasksCard
                  tasks={tasks}
                  onAccept={handleAcceptTask}
                  onReject={handleRejectTask}
                />
                <TaskExecutionCard
                  taskId={activeTask?.id || null}
                  taskTitle={activeTask?.title || null}
                  timerRunning={timerRunning}
                  elapsedTime={formatTime(elapsedSeconds)}
                  onStartTimer={handleStartTimer}
                  onPauseTimer={handlePauseTimer}
                  onRequestHelp={handleRequestHelp}
                  onRequestExtension={handleRequestExtension}
                />
              </div>
            )}

            {activeSection === 'bugs' && (
              <BugHandlingCard
                bugs={bugs}
                onMarkFixed={handleMarkFixed}
                onReopen={handleReopenBug}
              />
            )}

            {activeSection === 'code-submission' && (
              <CodeSubmissionCard
                taskId={activeTask?.id || null}
                repoLink="github.com/softwarevala/project-alpha"
                canSubmit={canSubmit}
                onSubmit={handleCodeSubmit}
              />
            )}

            {activeSection === 'timer' && (
              <TaskExecutionCard
                taskId={activeTask?.id || null}
                taskTitle={activeTask?.title || null}
                timerRunning={timerRunning}
                elapsedTime={formatTime(elapsedSeconds)}
                onStartTimer={handleStartTimer}
                onPauseTimer={handlePauseTimer}
                onRequestHelp={handleRequestHelp}
                onRequestExtension={handleRequestExtension}
              />
            )}

            {activeSection === 'ai-assistant' && (
              <AIAssistantCard
                taskId={activeTask?.id || null}
                taskTitle={activeTask?.title || null}
                onAnalyze={handleAnalyze}
                onEstimate={handleEstimate}
                onDetectRisk={handleDetectRisk}
                onOptimize={handleOptimize}
              />
            )}

            {activeSection === 'performance' && (
              <PerformanceMetricsCard
                productivity={87}
                onTime={92}
                quality={85}
                penaltyStatus="bonus"
                penaltyAmount={50}
              />
            )}

            {activeSection === 'settings' && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
                <p className="text-slate-400">Developer settings are managed by administrators.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DevCommandCenter;
