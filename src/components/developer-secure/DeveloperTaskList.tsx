import React, { useState } from 'react';
import { 
  Clock, AlertTriangle, CheckCircle, Play, Pause, 
  MessageSquare, FileUp, ChevronRight, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { DeveloperTask } from '@/hooks/useDeveloperGuard';

interface DeveloperTaskListProps {
  tasks: DeveloperTask[];
  onAcceptTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
  onViewTask: (task: DeveloperTask) => void;
  isLoading?: boolean;
}

export function DeveloperTaskList({
  tasks,
  onAcceptTask,
  onUpdateStatus,
  onViewTask,
  isLoading
}: DeveloperTaskListProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500/50' };
      case 'high':
        return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500/50' };
      case 'medium':
        return { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500/50' };
      case 'low':
        return { bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-500/50' };
      default:
        return { bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-500/50' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Pending' };
      case 'accepted':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Accepted' };
      case 'in_progress':
        return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'In Progress' };
      case 'blocked':
        return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Blocked' };
      case 'completed':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Completed' };
      case 'review':
        return { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Under Review' };
      default:
        return { bg: 'bg-slate-500/20', text: 'text-slate-400', label: status };
    }
  };

  const formatSlaTime = (minutes: number | null) => {
    if (minutes === null || minutes === undefined) return '--:--';
    if (minutes < 0) return 'BREACHED';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-8 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-8 text-center">
        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-semibold text-white mb-2">No Tasks Assigned</h3>
        <p className="text-muted-foreground text-sm">You're all caught up! New tasks will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const priorityConfig = getPriorityConfig(task.priority);
        const statusConfig = getStatusConfig(task.status);
        const isSlaWarning = task.sla_remaining_minutes !== null && task.sla_remaining_minutes <= 60 && task.sla_remaining_minutes > 0;
        const isSlaBreached = task.sla_breached || (task.sla_remaining_minutes !== null && task.sla_remaining_minutes <= 0);

        return (
          <div
            key={task.id}
            className={`rounded-xl border bg-slate-800/50 p-4 transition-all hover:bg-slate-800/70 cursor-pointer ${
              isSlaBreached ? 'border-red-500/50 animate-pulse' : 
              isSlaWarning ? 'border-amber-500/50' : 
              'border-slate-700'
            }`}
            onClick={() => onViewTask(task)}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left - Task Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-2 w-2 rounded-full ${priorityConfig.bg}`} />
                  <Badge variant="outline" className="text-xs">{task.task_id}</Badge>
                  <Badge className={`text-xs ${statusConfig.bg} ${statusConfig.text}`}>
                    {statusConfig.label}
                  </Badge>
                  {task.priority === 'critical' && (
                    <Badge className="bg-red-500/20 text-red-400 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Critical
                    </Badge>
                  )}
                </div>

                <h4 className="font-semibold text-white mb-1">{task.title}</h4>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {task.description}
                  </p>
                )}

                {/* Tech Stack */}
                {task.tech_stack && task.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tech_stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-[10px] bg-purple-500/10">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Right - SLA & Actions */}
              <div className="flex flex-col items-end gap-2">
                {/* SLA Timer */}
                <div className={`text-right px-3 py-2 rounded-lg ${
                  isSlaBreached ? 'bg-red-500/20' :
                  isSlaWarning ? 'bg-amber-500/20' :
                  'bg-slate-700/50'
                }`}>
                  <div className="flex items-center gap-1">
                    <Clock className={`h-4 w-4 ${
                      isSlaBreached ? 'text-red-500' :
                      isSlaWarning ? 'text-amber-500' :
                      'text-cyan-500'
                    }`} />
                    <span className={`font-mono font-bold ${
                      isSlaBreached ? 'text-red-500' :
                      isSlaWarning ? 'text-amber-500' :
                      'text-cyan-500'
                    }`}>
                      {formatSlaTime(task.sla_remaining_minutes)}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">SLA Remaining</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {task.status === 'pending' && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-purple-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptTask(task.id);
                      }}
                    >
                      Accept Task
                    </Button>
                  )}
                  
                  {task.status === 'accepted' && (
                    <Button
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(task.id, 'in_progress');
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  )}

                  {task.status === 'in_progress' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(task.id, 'blocked');
                        }}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Blocked
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(task.id, 'completed');
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    </>
                  )}

                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* SLA Warning Banner */}
            {isSlaBreached && (
              <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-400">SLA BREACHED - This will be logged and affect your performance score</span>
              </div>
            )}

            {isSlaWarning && !isSlaBreached && (
              <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-amber-400">SLA Warning - Less than 1 hour remaining</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
