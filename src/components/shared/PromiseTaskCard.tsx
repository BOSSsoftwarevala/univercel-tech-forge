import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  User, 
  Code2, 
  AlertTriangle, 
  ChevronRight,
  Timer,
  Pause,
  Play,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PromiseButton, { PromiseStatus } from './PromiseButton';

interface PromiseTaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    category: string;
    techStack?: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status?: string;
    promiseStatus: PromiseStatus;
    deadline?: string;
    startedAt?: string;
    estimatedHours?: number;
    developerId?: string;
    clientMasked?: string;
    slaHours?: number;
  };
  onPromiseStart?: (taskId: string, deadline: Date) => void;
  onPromiseComplete?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  onChat?: (taskId: string) => void;
  showTimer?: boolean;
}

const priorityColors = {
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  medium: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const PromiseTaskCard: React.FC<PromiseTaskCardProps> = ({
  task,
  onPromiseStart,
  onPromiseComplete,
  onViewDetails,
  onChat,
  showTimer = true,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Timer logic
  useEffect(() => {
    if (task.startedAt && (task.promiseStatus === 'promised' || task.promiseStatus === 'in_progress') && !isPaused) {
      const startTime = new Date(task.startedAt).getTime();
      
      const interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [task.startedAt, task.promiseStatus, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeProgress = () => {
    if (!task.slaHours) return 0;
    const slaSeconds = task.slaHours * 3600;
    return Math.min((elapsedTime / slaSeconds) * 100, 100);
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date();
  const timeProgress = getTimeProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`
        bg-slate-900/60 backdrop-blur-sm border transition-all duration-300
        ${isOverdue 
          ? 'border-red-500/50 shadow-lg shadow-red-500/10' 
          : task.promiseStatus === 'in_progress'
            ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
            : 'border-slate-700/50 hover:border-cyan-500/30'
        }
      `}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={priorityColors[task.priority]}>
                  {task.priority.toUpperCase()}
                </Badge>
                <Badge className="bg-slate-700/50 text-slate-300 border-0">
                  {task.category}
                </Badge>
              </div>
              <h3 className="text-white font-semibold truncate">{task.title}</h3>
              {task.description && (
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>
            
            {/* Promise Button - Top Right */}
            <PromiseButton
              taskId={task.id}
              developerId={task.developerId}
              currentStatus={task.promiseStatus}
              deadline={task.deadline}
              onPromiseStart={onPromiseStart}
              onPromiseComplete={onPromiseComplete}
              size="md"
            />
          </div>

          {/* Tech Stack */}
          {task.techStack && task.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full flex items-center gap-1"
                >
                  <Code2 className="w-3 h-3" />
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Timer Section */}
          {showTimer && (task.promiseStatus === 'promised' || task.promiseStatus === 'in_progress') && (
            <div className="mb-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer className={`w-4 h-4 ${isOverdue ? 'text-red-400' : 'text-cyan-400'}`} />
                  <span className="text-slate-400 text-sm">Time Elapsed</span>
                </div>
                <div className={`font-mono text-lg font-bold ${isOverdue ? 'text-red-400' : 'text-cyan-400'}`}>
                  {formatTime(elapsedTime)}
                </div>
              </div>
              
              <Progress 
                value={timeProgress} 
                className="h-1.5 bg-slate-700"
              />
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">
                  SLA: {task.slaHours}h
                </span>
                {task.deadline && (
                  <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
                    Due: {new Date(task.deadline).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Pause/Resume Controls */}
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPaused(!isPaused)}
                  className={`h-7 ${isPaused ? 'text-green-400' : 'text-amber-400'}`}
                >
                  {isPaused ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                {isPaused && (
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Timer paused - reason required
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {task.clientMasked && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {task.clientMasked}
                </span>
              )}
              {task.estimatedHours && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Est. {task.estimatedHours}h
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {onChat && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onChat(task.id)}
                  className="text-slate-400 hover:text-cyan-400 h-7"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              )}
              {onViewDetails && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails(task.id)}
                  className="text-slate-400 hover:text-cyan-400 h-7"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Overdue Warning */}
          {isOverdue && task.promiseStatus !== 'completed' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">
                Promise breach detected - task is overdue
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PromiseTaskCard;
