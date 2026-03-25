import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, Clock, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface BlockedTask {
  taskId: string;
  title: string;
  assignee: string;
  blockedReason: string;
  blockedSince: string;
  blockedHours: number;
  autoEscalateThreshold: number;
}

const mockBlockedTasks: BlockedTask[] = [
  { 
    taskId: 'TSK-4823', 
    title: 'UI Component Library', 
    assignee: 'DEV-5104', 
    blockedReason: 'Waiting for design assets from external team',
    blockedSince: '2024-12-30T10:00:00Z',
    blockedHours: 36,
    autoEscalateThreshold: 24
  },
  { 
    taskId: 'TSK-4827', 
    title: 'Third-party API Integration', 
    assignee: 'DEV-7842', 
    blockedReason: 'API credentials pending approval',
    blockedSince: '2024-12-31T08:00:00Z',
    blockedHours: 12,
    autoEscalateThreshold: 24
  },
];

export default function DevManagerBlockedTasks() {
  const { toast } = useToast();

  const handleEscalate = (task: BlockedTask) => {
    console.log(`[AUDIT] Manual escalation for blocked task ${task.taskId} at ${new Date().toISOString()}`);
    
    toast({
      title: "Escalation Triggered",
      description: `${task.taskId} escalated to upper management`,
    });
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            BLOCKED TASKS
          </CardTitle>
          <Badge variant="outline" className="font-mono text-red-400 border-red-500/30">
            {mockBlockedTasks.length} Blocked
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockBlockedTasks.map((task, idx) => {
          const isAutoEscalated = task.blockedHours >= task.autoEscalateThreshold;
          
          return (
            <motion.div
              key={task.taskId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-lg border ${
                isAutoEscalated 
                  ? 'border-red-500/50 bg-red-500/10' 
                  : 'border-amber-500/30 bg-amber-500/5'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs">{task.taskId}</span>
                    {isAutoEscalated && (
                      <Badge className="text-xs bg-red-500/20 text-red-400">
                        AUTO-ESCALATED
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-zinc-500 font-mono">{task.assignee}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.blockedHours}h blocked</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Threshold: {task.autoEscalateThreshold}h
                  </p>
                </div>
              </div>

              {/* Blocked Reason */}
              <div className="p-3 bg-zinc-800/50 rounded border border-zinc-700/50 mb-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">BLOCKED REASON</p>
                    <p className="text-sm">{task.blockedReason}</p>
                  </div>
                </div>
              </div>

              {!isAutoEscalated && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  onClick={() => handleEscalate(task)}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Manual Escalate
                </Button>
              )}
            </motion.div>
          );
        })}

        {mockBlockedTasks.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            <AlertOctagon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No blocked tasks</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
