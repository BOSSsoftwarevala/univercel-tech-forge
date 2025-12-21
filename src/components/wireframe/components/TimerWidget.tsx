import React from 'react';
import { Play, Pause, Square, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TimerWidgetProps {
  taskId: string;
  taskTitle: string;
  elapsedTime: string;
  status: 'running' | 'paused' | 'stopped' | 'promised';
  progress: number;
  deadline?: string;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onPromise?: () => void;
  isDark?: boolean;
}

export function TimerWidget({
  taskId,
  taskTitle,
  elapsedTime,
  status,
  progress,
  deadline,
  onStart,
  onPause,
  onStop,
  onPromise,
  isDark = true
}: TimerWidgetProps) {
  const statusColors = {
    running: 'bg-emerald-500',
    paused: 'bg-amber-500',
    stopped: 'bg-gray-500',
    promised: 'bg-cyan-500'
  };

  return (
    <div className={`p-4 rounded-xl border ${
      isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusColors[status]} animate-pulse`} />
          <Badge variant="outline" className="text-xs">
            {taskId}
          </Badge>
        </div>
        {deadline && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span>Deadline: {deadline}</span>
          </div>
        )}
      </div>

      {/* Task Title */}
      <h3 className="font-semibold mb-3 truncate">{taskTitle}</h3>

      {/* Timer Display */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold font-mono bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
          {elapsedTime}
        </div>
        <p className="text-xs text-muted-foreground mt-1 uppercase">{status}</p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {status === 'stopped' && (
          <Button onClick={onPromise} className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500">
            I Promise
          </Button>
        )}
        {(status === 'paused' || status === 'promised') && (
          <Button onClick={onStart} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
        )}
        {status === 'running' && (
          <>
            <Button onClick={onPause} variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button onClick={onStop} variant="destructive" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
