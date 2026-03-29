import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, Play, Pause, CheckCircle2, AlertTriangle, XCircle,
  Clock, Code2, Bug, TestTube, DollarSign, Wallet,
  TrendingDown, Shield, Flame, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface ActiveTask {
  id: string;
  title: string;
  category: string;
  status: 'working' | 'testing' | 'blocked';
  startedAt: number;
  deadlineAt: number; // timestamp
  slaMinutes: number;
  progress: number;
  pauseReason?: string;
  isPaused: boolean;
  pausedAt?: number;
  totalPausedMs: number;
  taskValue: number; // ₹ value of the task
  fineApplied: number; // ₹ fine so far
  finePercent: number;
  isCancelled: boolean;
  isCompleted: boolean;
}

interface FineLog {
  time: string;
  message: string;
  amount: number;
  type: 'warning' | 'fine' | 'cancel';
}

const DevTimerProgress = () => {
  const [activeTask, setActiveTask] = useState<ActiveTask>({
    id: '1',
    title: 'Payment Gateway Integration',
    category: 'Backend Development',
    status: 'working',
    startedAt: Date.now() - 2700000,
    deadlineAt: Date.now() + 300000, // 5 min from now for demo (normally 2h)
    slaMinutes: 120,
    progress: 45,
    isPaused: false,
    totalPausedMs: 0,
    taskValue: 500, // ₹500
    fineApplied: 0,
    finePercent: 0,
    isCancelled: false,
    isCompleted: false,
  });

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [fineLogs, setFineLogs] = useState<FineLog[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [overtimeMinutes, setOvertimeMinutes] = useState(0);

  // Calculate fine tier based on overtime
  const calculateFine = useCallback((overtimeMs: number, taskValue: number) => {
    const overtimeMin = Math.floor(overtimeMs / 60000);
    if (overtimeMin >= 30) {
      return { percent: 100, amount: taskValue, cancelled: true, tier: 'CANCELLED' };
    } else if (overtimeMin >= 20) {
      return { percent: 20, amount: Math.round(taskValue * 0.2), cancelled: false, tier: '20% Fine' };
    } else if (overtimeMin >= 10) {
      return { percent: 10, amount: Math.round(taskValue * 0.1), cancelled: false, tier: '10% Fine' };
    }
    return { percent: 0, amount: 0, cancelled: false, tier: 'On Time' };
  }, []);

  useEffect(() => {
    if (activeTask.isCompleted || activeTask.isCancelled) return;

    const timer = setInterval(() => {
      if (!activeTask.isPaused) {
        const now = Date.now();
        const remaining = activeTask.deadlineAt - now;
        const elapsed = now - activeTask.startedAt - activeTask.totalPausedMs;

        setTimeRemaining(remaining);
        setElapsedTime(elapsed);

        if (remaining < 0) {
          const overtime = Math.abs(remaining);
          const otMin = Math.floor(overtime / 60000);
          setOvertimeMinutes(otMin);

          const fine = calculateFine(overtime, activeTask.taskValue);

          // Update fine if it changed
          if (fine.percent !== activeTask.finePercent) {
            setActiveTask(prev => ({
              ...prev,
              finePercent: fine.percent,
              fineApplied: fine.amount,
              isCancelled: fine.cancelled,
            }));

            if (fine.cancelled) {
              setFineLogs(prev => [...prev, {
                time: new Date().toLocaleTimeString(),
                message: `🚫 PROJECT CANCELLED — 30+ min late. Full task value ₹${activeTask.taskValue} deducted from wallet.`,
                amount: activeTask.taskValue,
                type: 'cancel',
              }]);
              toast.error('Project CANCELLED! 30 min overtime exceeded. Full charges deducted.');
            } else if (fine.percent === 20 && activeTask.finePercent < 20) {
              setFineLogs(prev => [...prev, {
                time: new Date().toLocaleTimeString(),
                message: `⚠️ 20% Fine Applied — 20 min late. ₹${fine.amount} will be deducted.`,
                amount: fine.amount,
                type: 'fine',
              }]);
              toast.warning(`20% Fine! ₹${fine.amount} deducted. Complete before 30 min or project cancels!`);
            } else if (fine.percent === 10 && activeTask.finePercent < 10) {
              setFineLogs(prev => [...prev, {
                time: new Date().toLocaleTimeString(),
                message: `⚠️ 10% Fine Applied — 10 min late. ₹${fine.amount} will be deducted.`,
                amount: fine.amount,
                type: 'fine',
              }]);
              toast.warning(`10% Fine! ₹${fine.amount} deducted. Hurry up!`);
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTask, calculateFine]);

  const formatTime = (ms: number) => {
    const abs = Math.abs(ms);
    const h = Math.floor(abs / 3600000);
    const m = Math.floor((abs % 3600000) / 60000);
    const s = Math.floor((abs % 60000) / 1000);
    const prefix = ms < 0 ? '-' : '';
    return `${prefix}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStatusChange = (newStatus: 'working' | 'testing' | 'blocked') => {
    setActiveTask(prev => ({ ...prev, status: newStatus }));
    setFineLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message: `Status → ${newStatus.toUpperCase()}`,
      amount: 0,
      type: 'warning',
    }]);
    toast.success(`Status: ${newStatus.toUpperCase()}`);
  };

  const handlePause = () => {
    if (!pauseReason.trim()) {
      toast.error('Pause reason required!');
      return;
    }
    setActiveTask(prev => ({ ...prev, isPaused: true, pauseReason, pausedAt: Date.now() }));
    setShowPauseModal(false);
    setPauseReason('');
    setFineLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message: `⏸️ Paused: ${pauseReason}`,
      amount: 0,
      type: 'warning',
    }]);
    toast.info('Task paused. Timer stopped.');
  };

  const handleResume = () => {
    const pauseDuration = activeTask.pausedAt ? Date.now() - activeTask.pausedAt : 0;
    setActiveTask(prev => ({
      ...prev,
      isPaused: false,
      totalPausedMs: prev.totalPausedMs + pauseDuration,
      deadlineAt: prev.deadlineAt + pauseDuration, // extend deadline by pause duration
    }));
    toast.success('Resumed! Timer running.');
  };

  const handleProgressUpdate = (delta: number) => {
    setActiveTask(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, prev.progress + delta)),
    }));
    toast.success(`Progress: ${Math.min(100, activeTask.progress + delta)}%`);
  };

  const handleComplete = () => {
    setActiveTask(prev => ({ ...prev, isCompleted: true, progress: 100 }));
    const fine = activeTask.fineApplied;
    const earning = activeTask.taskValue - fine;
    setFineLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message: `✅ COMPLETED! Earning: ₹${earning} ${fine > 0 ? `(₹${fine} fine deducted)` : '(No fine)'}`,
      amount: earning,
      type: 'warning',
    }]);
    toast.success(`Task completed! You earned ₹${earning}${fine > 0 ? ` (₹${fine} fine)` : ''}`);
  };

  const isOverdue = timeRemaining < 0;
  const isNearDeadline = timeRemaining > 0 && timeRemaining < 600000; // < 10 min
  const progressPercent = Math.min(100, (elapsedTime / (activeTask.slaMinutes * 60000)) * 100);

  // Fine tier visual
  const getFineTierInfo = () => {
    if (activeTask.isCancelled) return { label: 'CANCELLED', color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500/50' };
    if (activeTask.finePercent >= 20) return { label: '20% FINE', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40' };
    if (activeTask.finePercent >= 10) return { label: '10% FINE', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/40' };
    if (isNearDeadline) return { label: 'HURRY UP!', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { label: 'ON TIME', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
  };

  const tierInfo = getFineTierInfo();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Timer className="w-7 h-7 text-cyan-400" />
            Task Timer & Deadline
          </h1>
          <p className="text-slate-400 mt-1">Fixed deadline — late delivery = automatic fine deduction</p>
        </div>
        <Badge variant="outline" className={`text-sm px-4 py-2 ${tierInfo.color} ${tierInfo.bg} ${tierInfo.border} font-bold`}>
          {tierInfo.label}
        </Badge>
      </div>

      {/* Fine Rules Card */}
      <Card className="bg-slate-900/50 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-white font-medium">Deadline Fine Rules</p>
              <div className="flex gap-4 mt-2">
                {[
                  { time: '0-10 min late', fine: '10% deduction', color: 'text-amber-400', icon: '⚠️' },
                  { time: '10-20 min late', fine: '20% deduction', color: 'text-orange-400', icon: '🔥' },
                  { time: '30+ min late', fine: 'PROJECT CANCELLED', color: 'text-red-400', icon: '🚫' },
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <span>{rule.icon}</span>
                    <div>
                      <p className={`text-xs font-medium ${rule.color}`}>{rule.time}</p>
                      <p className="text-[10px] text-slate-400">{rule.fine}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Timer Card */}
      <motion.div
        className={`p-8 rounded-2xl border backdrop-blur-sm relative overflow-hidden ${
          activeTask.isCancelled
            ? 'bg-red-500/10 border-red-500/50'
            : activeTask.isCompleted
              ? 'bg-emerald-500/10 border-emerald-500/50'
              : isOverdue 
                ? 'bg-red-500/10 border-red-500/50' 
                : activeTask.isPaused 
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : isNearDeadline
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-slate-800/50 border-slate-700/50'
        }`}
      >
        {/* Pulsing border for urgency */}
        {(isOverdue || isNearDeadline) && !activeTask.isCompleted && !activeTask.isCancelled && (
          <motion.div
            className={`absolute inset-0 rounded-2xl border-2 ${isOverdue ? 'border-red-500' : 'border-amber-500'}`}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}

        <div className="relative z-10">
          {/* Task Info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">{activeTask.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{activeTask.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs text-white ${
                  activeTask.status === 'working' ? 'bg-cyan-500' : 
                  activeTask.status === 'testing' ? 'bg-purple-500' : 'bg-red-500'
                }`}>
                  {activeTask.status.toUpperCase()}
                </span>
                {activeTask.isPaused && (
                  <Badge variant="outline" className="text-amber-400 bg-amber-500/20 border-amber-500/30 text-xs">PAUSED</Badge>
                )}
                {activeTask.isCompleted && (
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/20 border-emerald-500/30 text-xs">COMPLETED ✅</Badge>
                )}
                {activeTask.isCancelled && (
                  <Badge variant="outline" className="text-red-400 bg-red-500/20 border-red-500/30 text-xs">CANCELLED ❌</Badge>
                )}
              </div>
            </div>

            {/* Big Timer Display */}
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">{isOverdue ? 'OVERTIME' : 'Time Remaining'}</p>
              <motion.p
                className={`text-4xl font-mono font-black tracking-wider ${
                  activeTask.isCancelled ? 'text-red-500' :
                  activeTask.isCompleted ? 'text-emerald-400' :
                  isOverdue ? 'text-red-400' : 
                  isNearDeadline ? 'text-amber-400' : 'text-white'
                }`}
                animate={isOverdue && !activeTask.isCompleted && !activeTask.isCancelled ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                {activeTask.isCancelled ? 'CANCELLED' : activeTask.isCompleted ? '00:00:00' : formatTime(timeRemaining)}
              </motion.p>
              {isOverdue && !activeTask.isCompleted && !activeTask.isCancelled && (
                <div className="flex items-center gap-1 justify-end mt-1">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400 font-medium">{overtimeMinutes} min overtime</span>
                </div>
              )}
            </div>
          </div>

          {/* Timer Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-slate-900/50 rounded-xl text-center">
              <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-lg font-mono font-bold text-white">{formatTime(elapsedTime)}</p>
              <p className="text-[10px] text-slate-400">Elapsed</p>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl text-center">
              <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-400">₹{activeTask.taskValue}</p>
              <p className="text-[10px] text-slate-400">Task Value</p>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl text-center">
              <TrendingDown className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <p className={`text-lg font-bold ${activeTask.fineApplied > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                ₹{activeTask.fineApplied}
              </p>
              <p className="text-[10px] text-slate-400">Fine</p>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl text-center">
              <Wallet className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-cyan-400">₹{activeTask.taskValue - activeTask.fineApplied}</p>
              <p className="text-[10px] text-slate-400">You'll Earn</p>
            </div>
          </div>

          {/* Fine Progress Bar */}
          {isOverdue && !activeTask.isCompleted && !activeTask.isCancelled && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-red-400 font-medium">Fine Timeline</span>
                <span className="text-red-400">{overtimeMinutes}/30 min</span>
              </div>
              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                {/* 10 min marker */}
                <div className="absolute left-[33%] top-0 bottom-0 w-px bg-amber-500/50 z-10" />
                {/* 20 min marker */}
                <div className="absolute left-[66%] top-0 bottom-0 w-px bg-red-500/50 z-10" />
                <motion.div
                  className={`h-full rounded-full ${
                    overtimeMinutes >= 20 ? 'bg-gradient-to-r from-amber-500 to-red-500' :
                    overtimeMinutes >= 10 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                    'bg-amber-400'
                  }`}
                  animate={{ width: `${Math.min(100, (overtimeMinutes / 30) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                <span>Start</span>
                <span className="text-amber-400">10min (10%)</span>
                <span className="text-red-400">20min (20%)</span>
                <span className="text-red-500 font-bold">30min (Cancel)</span>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-400">Task Progress</span>
              <span className="text-sm text-cyan-400 font-medium">{activeTask.progress}%</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  activeTask.isCompleted ? 'bg-emerald-500' :
                  activeTask.progress >= 75 ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' :
                  'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                animate={{ width: `${activeTask.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {/* Progress buttons */}
            {!activeTask.isCompleted && !activeTask.isCancelled && (
              <div className="flex gap-2 mt-2">
                {[10, 25, 50].map(v => (
                  <Button key={v} size="sm" variant="outline" onClick={() => handleProgressUpdate(v)}
                    className="text-xs border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30">
                    +{v}%
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Status Buttons */}
          {!activeTask.isCompleted && !activeTask.isCancelled && (
            <>
              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  { id: 'working' as const, label: 'Working', icon: Code2, color: 'bg-cyan-500 hover:bg-cyan-600' },
                  { id: 'testing' as const, label: 'Testing', icon: TestTube, color: 'bg-purple-500 hover:bg-purple-600' },
                  { id: 'blocked' as const, label: 'Blocked', icon: Bug, color: 'bg-red-500 hover:bg-red-600' },
                ].map(btn => {
                  const Icon = btn.icon;
                  return (
                    <Button key={btn.id}
                      variant={activeTask.status === btn.id ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(btn.id)}
                      className={activeTask.status === btn.id ? btn.color : 'border-slate-700 text-slate-400'}>
                      <Icon className="w-4 h-4 mr-2" /> {btn.label}
                    </Button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {activeTask.isPaused ? (
                  <Button onClick={handleResume} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                    <Play className="w-4 h-4 mr-2" /> Resume Task
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setShowPauseModal(true)}
                    className="flex-1 border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                    <Pause className="w-4 h-4 mr-2" /> Pause (Logged)
                  </Button>
                )}
                <Button onClick={handleComplete} className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  disabled={activeTask.progress < 80}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Complete (≥80%)
                </Button>
              </div>
            </>
          )}

          {/* Cancelled State */}
          {activeTask.isCancelled && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-red-400">Project Cancelled</p>
              <p className="text-sm text-slate-400 mt-1">30+ min overtime. ₹{activeTask.taskValue} deducted from wallet.</p>
              <p className="text-xs text-slate-500 mt-2">Task reassigned. This affects your performance score.</p>
            </div>
          )}

          {/* Completed State */}
          {activeTask.isCompleted && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-emerald-400">Task Completed! 🎉</p>
              <p className="text-sm text-slate-400 mt-1">
                Earned: ₹{activeTask.taskValue - activeTask.fineApplied}
                {activeTask.fineApplied > 0 && <span className="text-red-400"> (₹{activeTask.fineApplied} fine deducted)</span>}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Activity & Fine Log */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" /> Activity & Fine Log
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {fineLogs.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No activity yet. Timer is running...</p>
            )}
            {fineLogs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  log.type === 'cancel' ? 'bg-red-500/5 border-red-500/20' :
                  log.type === 'fine' ? 'bg-amber-500/5 border-amber-500/20' :
                  'bg-slate-800/30 border-slate-700/30'
                }`}>
                <span className="text-[10px] text-slate-500 font-mono w-16 flex-shrink-0">{log.time}</span>
                <span className="text-sm text-slate-300 flex-1">{log.message}</span>
                {log.amount > 0 && (
                  <span className={`text-xs font-bold ${log.type === 'cancel' ? 'text-red-400' : log.type === 'fine' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {log.type === 'fine' || log.type === 'cancel' ? '-' : '+'}₹{log.amount}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pause Modal */}
      <AnimatePresence>
        {showPauseModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPauseModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-md p-6 bg-slate-900 border border-amber-500/30 rounded-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Pause Task</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                ⚠️ Pause extends your deadline. Reason is <span className="text-amber-400 font-medium">permanently logged</span>.
              </p>
              <Textarea value={pauseReason} onChange={e => setPauseReason(e.target.value)}
                placeholder="Enter reason (e.g., waiting for API docs, blocker from team lead)..."
                className="mb-4 bg-slate-800 border-slate-700" />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowPauseModal(false)}>Cancel</Button>
                <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-medium" onClick={handlePause}>
                  Confirm Pause
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevTimerProgress;
