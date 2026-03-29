import { motion } from 'framer-motion';
import { Play, Pause, AlertCircle, HelpCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface TaskExecutionCardProps {
  taskId: string | null;
  taskTitle: string | null;
  timerRunning: boolean;
  elapsedTime: string;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onRequestHelp: () => void;
  onRequestExtension: () => void;
}

const blockedReasons = [
  { value: 'waiting_info', label: 'Waiting for information' },
  { value: 'tech_issue', label: 'Technical issue' },
  { value: 'dependency', label: 'Dependency blocked' },
  { value: 'clarification', label: 'Need clarification' },
  { value: 'other', label: 'Other' },
];

const TaskExecutionCard = ({
  taskId,
  taskTitle,
  timerRunning,
  elapsedTime,
  onStartTimer,
  onPauseTimer,
  onRequestHelp,
  onRequestExtension,
}: TaskExecutionCardProps) => {
  const [blockedReason, setBlockedReason] = useState<string>('');

  if (!taskId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-slate-700/50">
            <Play className="w-5 h-5 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-500">Task Execution Panel</h3>
        </div>
        <div className="text-center py-8 text-slate-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Accept a task to begin execution</p>
          <p className="text-xs mt-2 text-slate-600">Timer will start when you accept</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${timerRunning ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
            {timerRunning ? (
              <Play className="w-5 h-5 text-emerald-400" />
            ) : (
              <Pause className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Task Execution</h3>
            <p className="text-xs text-slate-400">{taskId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-cyan-400">{elapsedTime}</p>
          <p className="text-xs text-slate-400">Elapsed Time</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-4">
        <p className="text-white font-medium">{taskTitle}</p>
      </div>

      {/* Timer Controls */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {!timerRunning ? (
          <Button
            onClick={onStartTimer}
            className="col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Timer
          </Button>
        ) : (
          <Button
            onClick={onPauseTimer}
            variant="outline"
            className="col-span-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause Timer
          </Button>
        )}
      </div>

      {/* Blocked Reason */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-2 block">Blocked Reason (if applicable)</label>
        <Select value={blockedReason} onValueChange={setBlockedReason}>
          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Select reason if blocked" />
          </SelectTrigger>
          <SelectContent>
            {blockedReasons.map((reason) => (
              <SelectItem key={reason.value} value={reason.value}>
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onRequestHelp}
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Request Help
        </Button>
        <Button
          variant="outline"
          onClick={onRequestExtension}
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          <Clock className="w-4 h-4 mr-2" />
          Request Extension
        </Button>
      </div>

      {/* Rules Notice */}
      <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs text-amber-400">
          ⚠️ Timer auto-pauses on tab change or logout. No submission allowed if timer is below SLA.
        </p>
      </div>
    </motion.div>
  );
};

export default TaskExecutionCard;
