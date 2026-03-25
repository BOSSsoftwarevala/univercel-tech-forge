import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Activity, User, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ActiveTask {
  id: string;
  title: string;
  assignee: string;
  assigneeId: string;
  status: 'assigned' | 'in_progress';
  priority: string;
  sourceType: string;
  sourceId: string;
  dueDate: string;
  slaHours: number;
  hoursRemaining: number;
}

const mockActiveTasks: ActiveTask[] = [
  { id: 'TSK-101', title: 'API Integration for payment module', assignee: 'DEV-A1B2', assigneeId: 'dev-001', status: 'in_progress', priority: 'high', sourceType: 'Order', sourceId: 'ORD-5521', dueDate: '2024-01-16T18:00:00Z', slaHours: 24, hoursRemaining: 8 },
  { id: 'TSK-102', title: 'Frontend form validation', assignee: 'DEV-C3D4', assigneeId: 'dev-002', status: 'assigned', priority: 'medium', sourceType: 'Ticket', sourceId: 'TKT-8832', dueDate: '2024-01-17T12:00:00Z', slaHours: 48, hoursRemaining: 32 },
  { id: 'TSK-103', title: 'Database optimization', assignee: 'DEV-E5F6', assigneeId: 'dev-003', status: 'in_progress', priority: 'critical', sourceType: 'Lead', sourceId: 'LD-9923', dueDate: '2024-01-15T20:00:00Z', slaHours: 8, hoursRemaining: 2 },
];

// Status flow: Pending → Assigned → In Progress → Completed (or Blocked)
const STATUS_FLOW = {
  'pending': ['assigned'],
  'assigned': ['in_progress', 'blocked'],
  'in_progress': ['completed', 'blocked'],
  'blocked': ['in_progress'],
  'completed': [] // Immutable
};

const TMActiveTasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<ActiveTask | null>(null);
  const [reassignReason, setReassignReason] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [isReassignOpen, setIsReassignOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'assigned': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'blocked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const handleReassign = () => {
    if (!reassignReason.trim()) {
      toast.error('Reassignment reason is mandatory');
      return;
    }
    if (!newAssignee) {
      toast.error('Please select new assignee');
      return;
    }

    // Log reassignment
    console.log('[TASK_MANAGER] Task reassigned:', {
      timestamp: new Date().toISOString(),
      action: 'task_reassigned',
      taskId: selectedTask?.id,
      previousAssignee: selectedTask?.assigneeId,
      newAssignee,
      reason: reassignReason
    });

    toast.success('Task reassigned successfully');
    setIsReassignOpen(false);
    setReassignReason('');
    setNewAssignee('');
    setSelectedTask(null);
  };

  const handleStatusChange = (task: ActiveTask, newStatus: string) => {
    const allowedTransitions = STATUS_FLOW[task.status as keyof typeof STATUS_FLOW] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      toast.error(`Cannot transition from ${task.status} to ${newStatus}. Status flow is locked.`);
      return;
    }

    // Log status change
    console.log('[TASK_MANAGER] Status changed:', {
      timestamp: new Date().toISOString(),
      action: 'status_changed',
      taskId: task.id,
      previousStatus: task.status,
      newStatus
    });

    toast.success(`Task status updated to ${newStatus}`);
  };

  return (
    <>
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Active Tasks
            <Badge variant="secondary" className="ml-2">{mockActiveTasks.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockActiveTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg bg-background/50 border transition-colors ${
                  task.hoursRemaining <= 4 ? 'border-red-500/50' : 'border-border/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-sm text-muted-foreground">{task.id}</span>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.hoursRemaining <= 4 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          SLA Risk
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium mb-2">{task.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.hoursRemaining}h remaining
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {task.sourceType}: {task.sourceId}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsReassignOpen(true);
                      }}
                    >
                      Reassign
                    </Button>
                    {task.status === 'assigned' && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleStatusChange(task, 'in_progress')}
                        className="gap-1"
                      >
                        Start <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Task: {selectedTask?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-3 rounded bg-muted/50 text-sm">
              <p className="font-medium">{selectedTask?.title}</p>
              <p className="text-muted-foreground">Current: {selectedTask?.assignee}</p>
            </div>
            
            <div className="space-y-2">
              <Label>New Assignee *</Label>
              <Select value={newAssignee} onValueChange={setNewAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select developer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev-004">DEV-G7H8</SelectItem>
                  <SelectItem value="dev-005">DEV-I9J0</SelectItem>
                  <SelectItem value="dev-006">DEV-K1L2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reason for Reassignment *</Label>
              <Textarea
                placeholder="Mandatory: Explain why this task is being reassigned..."
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsReassignOpen(false)}>Cancel</Button>
              <Button onClick={handleReassign}>Confirm Reassign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TMActiveTasks;
