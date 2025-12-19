import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Play, Pause, CheckCircle, AlertTriangle,
  FileCode, Upload, MessageSquare, Timer, Target,
  Zap, ArrowRight, Coffee
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const checkpoints = [
  { id: 'started', label: 'Started', icon: Play },
  { id: 'coding', label: 'Coding', icon: FileCode },
  { id: 'testing', label: 'Testing', icon: Target },
  { id: 'ready', label: 'Ready', icon: CheckCircle },
];

const WorkProgressPanel = () => {
  const [currentCheckpoint, setCurrentCheckpoint] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [elapsedTime, setElapsedTime] = useState(4875); // seconds
  const [promiseDialogOpen, setPromiseDialogOpen] = useState(false);

  const currentTask = {
    id: 'TSK-2846',
    title: 'API Integration - Payment Gateway',
    category: 'Backend Development',
    techStack: ['Node.js', 'Express', 'Stripe'],
    slaHours: 2,
    taskAmount: 3000,
    deadline: new Date(Date.now() + 3600000)
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemaining = () => {
    const totalSLASeconds = currentTask.slaHours * 3600;
    const remaining = totalSLASeconds - elapsedTime;
    if (remaining <= 0) return { text: 'OVERDUE', color: 'text-red-400', percentage: 100 };
    return { 
      text: formatTime(remaining), 
      color: remaining < 1800 ? 'text-orange-400' : 'text-cyan-400',
      percentage: (elapsedTime / totalSLASeconds) * 100
    };
  };

  const handlePause = () => {
    setPauseDialogOpen(true);
  };

  const confirmPause = () => {
    if (pauseReason.length > 10) {
      setIsPaused(true);
      setPauseDialogOpen(false);
      setPauseReason('');
    }
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const advanceCheckpoint = () => {
    if (currentCheckpoint < checkpoints.length - 1) {
      setCurrentCheckpoint(prev => prev + 1);
    }
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Work Progress</h1>
          <p className="text-slate-400 text-sm mt-1">Track and update your current task</p>
        </div>
        <Badge className={isPaused ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'}>
          {isPaused ? 'PAUSED' : 'ACTIVE'}
        </Badge>
      </div>

      {/* Main Timer Card */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Timer Display */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={isPaused ? {} : { scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isPaused ? 'bg-yellow-500/20' : 'bg-cyan-500/20'
                }`}
              >
                <Timer className={`w-6 h-6 ${isPaused ? 'text-yellow-400' : 'text-cyan-400'}`} />
              </motion.div>
              <div>
                <p className="text-sm text-slate-400">Elapsed Time</p>
                <p className="text-3xl font-mono font-bold text-white">{formatTime(elapsedTime)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Time Remaining</span>
                <span className={`font-mono font-bold ${timeRemaining.color}`}>
                  {timeRemaining.text}
                </span>
              </div>
              <Progress value={timeRemaining.percentage} className="h-3" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Start</span>
                <span>SLA: {currentTask.slaHours}h</span>
              </div>
            </div>
          </div>

          {/* Task Info */}
          <div className="lg:w-80 p-4 bg-slate-800/50 rounded-xl border border-cyan-500/20">
            <p className="text-xs text-slate-400 mb-1">{currentTask.id}</p>
            <h3 className="text-lg font-semibold text-white mb-2">{currentTask.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {currentTask.techStack.map(tech => (
                <span key={tech} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap className="w-4 h-4" />
              <span className="font-semibold">₹{currentTask.taskAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-3">
            {isPaused ? (
              <Button 
                onClick={handleResume}
                className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
              >
                <Play className="w-4 h-4" />
                Resume Work
              </Button>
            ) : (
              <Button 
                onClick={handlePause}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause Timer
              </Button>
            )}
            <Button 
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Escalate Issue
            </Button>
          </div>
        </div>
      </Card>

      {/* Checkpoint Progress */}
      <Card className="p-6 bg-slate-900/50 border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Progress Checkpoints</h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-700">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentCheckpoint / (checkpoints.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Checkpoint Items */}
          <div className="relative flex justify-between">
            {checkpoints.map((checkpoint, index) => {
              const Icon = checkpoint.icon;
              const isCompleted = index < currentCheckpoint;
              const isCurrent = index === currentCheckpoint;

              return (
                <div key={checkpoint.id} className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted 
                        ? 'bg-cyan-500 border-cyan-500 text-white' 
                        : isCurrent
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-slate-800 border-slate-600 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span className={`mt-2 text-sm font-medium ${
                    isCompleted || isCurrent ? 'text-cyan-400' : 'text-slate-500'
                  }`}>
                    {checkpoint.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advance Button */}
        {currentCheckpoint < checkpoints.length - 1 && (
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={advanceCheckpoint}
              className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
            >
              Mark as {checkpoints[currentCheckpoint + 1]?.label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {currentCheckpoint === checkpoints.length - 1 && (
          <div className="mt-6 flex justify-center">
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            >
              <Upload className="w-4 h-4" />
              Submit Deliverables
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Today\'s Tasks', value: '3', icon: FileCode, color: 'cyan' },
          { label: 'Completed', value: '2', icon: CheckCircle, color: 'emerald' },
          { label: 'Total Hours', value: '5.2h', icon: Clock, color: 'purple' },
          { label: 'Earned Today', value: '₹4,500', icon: Zap, color: 'yellow' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-slate-900/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pause Dialog */}
      <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <DialogContent className="bg-slate-900 border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Coffee className="w-5 h-5 text-yellow-400" />
              Pause Work Timer
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Please provide a reason for pausing. This will be logged for transparency.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Explain why you need to pause (minimum 10 characters)..."
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              className="bg-slate-800 border-cyan-500/20 text-white min-h-[100px]"
            />
            <p className="text-xs text-slate-500">
              Note: Excessive pausing may affect your performance score
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setPauseDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmPause}
                disabled={pauseReason.length < 10}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Confirm Pause
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkProgressPanel;
