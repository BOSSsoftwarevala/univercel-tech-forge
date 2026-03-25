import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'blocked' | 'review';
  dueDate: string;
  slaHoursRemaining: number;
  promiseId?: string;
}

const mockTasks: Task[] = [
  { id: 'TSK-4821', title: 'API Integration Module', assignedTo: 'DEV-7842', priority: 'high', status: 'in_progress', dueDate: '2025-01-02', slaHoursRemaining: 8, promiseId: 'PRM-112' },
  { id: 'TSK-4822', title: 'Database Migration', assignedTo: 'DEV-3291', priority: 'critical', status: 'pending', dueDate: '2025-01-01', slaHoursRemaining: 2, promiseId: 'PRM-115' },
  { id: 'TSK-4823', title: 'UI Component Library', assignedTo: 'DEV-5104', priority: 'medium', status: 'blocked', dueDate: '2025-01-03', slaHoursRemaining: 24 },
  { id: 'TSK-4824', title: 'Auth Flow Refactor', assignedTo: 'DEV-8877', priority: 'high', status: 'review', dueDate: '2025-01-02', slaHoursRemaining: 12, promiseId: 'PRM-118' },
];

const developers = ['DEV-7842', 'DEV-3291', 'DEV-5104', 'DEV-8877'];

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'low': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }
};

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'pending': return 'bg-zinc-500';
    case 'in_progress': return 'bg-blue-500';
    case 'blocked': return 'bg-red-500';
    case 'review': return 'bg-purple-500';
  }
};

export default function DevManagerActiveTasksView() {
  const { toast } = useToast();
  const [reassignDialog, setReassignDialog] = useState<Task | null>(null);
  const [newAssignee, setNewAssignee] = useState('');
  const [reassignReason, setReassignReason] = useState('');

  const handleReassign = () => {
    if (!newAssignee || !reassignReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Reassignment reason is mandatory.",
        variant: "destructive"
      });
      return;
    }

    // Log the reassignment action
    console.log(`[AUDIT] Task ${reassignDialog?.id} reassigned from ${reassignDialog?.assignedTo} to ${newAssignee}. Reason: ${reassignReason}`);

    toast({
      title: "Task Reassigned",
      description: `${reassignDialog?.id} → ${newAssignee}`,
    });

    setReassignDialog(null);
    setNewAssignee('');
    setReassignReason('');
  };

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-mono tracking-wider text-zinc-400">
              ACTIVE TASKS BY DEVELOPER
            </CardTitle>
            <Badge variant="outline" className="font-mono">
              {mockTasks.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockTasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-zinc-500">{task.id}</span>
                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    {task.promiseId && (
                      <Badge variant="outline" className="text-xs font-mono">
                        {task.promiseId}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium">{task.title}</h4>
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-mono">{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className={task.slaHoursRemaining <= 4 ? 'text-red-400' : ''}>
                      {task.slaHoursRemaining}h remaining
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-xs"
                  onClick={() => setReassignDialog(task)}
                >
                  <RefreshCw className="w-3 h-3" />
                  Reassign
                </Button>
              </div>

              {task.slaHoursRemaining <= 4 && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2 text-xs text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  SLA at risk - escalation may be required
                </div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Reassign Dialog */}
      <Dialog open={!!reassignDialog} onOpenChange={() => setReassignDialog(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="font-mono">
              Reassign Task {reassignDialog?.id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-sm text-zinc-400">Current Assignee</p>
              <p className="font-mono">{reassignDialog?.assignedTo}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">New Assignee</label>
              <Select value={newAssignee} onValueChange={setNewAssignee}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select developer" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {developers
                    .filter(d => d !== reassignDialog?.assignedTo)
                    .map(dev => (
                      <SelectItem key={dev} value={dev} className="font-mono">
                        {dev}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">
                Reason <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Mandatory: Explain why this task is being reassigned..."
                className="bg-zinc-800 border-zinc-700 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setReassignDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleReassign} className="gap-2">
              <ArrowRight className="w-4 h-4" />
              Confirm Reassignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
