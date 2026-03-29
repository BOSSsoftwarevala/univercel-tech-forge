import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Ban, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BlockedTask {
  id: string;
  title: string;
  assignee: string;
  blockReason: string;
  blockedAt: string;
  blockedHours: number;
  autoEscalateThreshold: number;
  priority: string;
  sourceId: string;
}

const mockBlockedTasks: BlockedTask[] = [
  { id: 'TSK-201', title: 'Third-party API integration', assignee: 'DEV-M3N4', blockReason: 'Waiting for API credentials from vendor', blockedAt: '2024-01-14T14:00:00Z', blockedHours: 28, autoEscalateThreshold: 24, priority: 'high', sourceId: 'ORD-3344' },
  { id: 'TSK-202', title: 'Database schema migration', assignee: 'DEV-O5P6', blockReason: 'Dependency on another task (TSK-198)', blockedAt: '2024-01-15T09:00:00Z', blockedHours: 6, autoEscalateThreshold: 12, priority: 'medium', sourceId: 'TKT-5567' },
];

const TMBlockedTasks: React.FC = () => {
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<BlockedTask | null>(null);
  const [escalationNote, setEscalationNote] = useState('');
  const [escalateTo, setEscalateTo] = useState<'dev_manager' | 'pro_manager' | 'super_admin'>('dev_manager');

  const handleEscalate = () => {
    if (!escalationNote.trim()) {
      toast.error('Escalation note is required');
      return;
    }

    // Log escalation
    console.log('[TASK_MANAGER] Task escalated:', {
      timestamp: new Date().toISOString(),
      action: 'task_escalated',
      taskId: selectedTask?.id,
      escalateTo,
      blockReason: selectedTask?.blockReason,
      blockedHours: selectedTask?.blockedHours,
      escalationNote
    });

    toast.success(`Task escalated to ${escalateTo.replace('_', ' ')}`);
    setIsEscalateOpen(false);
    setEscalationNote('');
    setSelectedTask(null);
  };

  const handleUnblock = (task: BlockedTask) => {
    // Log unblock
    console.log('[TASK_MANAGER] Task unblocked:', {
      timestamp: new Date().toISOString(),
      action: 'task_unblocked',
      taskId: task.id,
      totalBlockedHours: task.blockedHours
    });

    toast.success('Task unblocked and moved to In Progress');
  };

  return (
    <>
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Ban className="h-5 w-5 text-destructive" />
            Blocked Tasks
            <Badge variant="destructive" className="ml-2">{mockBlockedTasks.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBlockedTasks.map((task, index) => {
              const isAutoEscalated = task.blockedHours >= task.autoEscalateThreshold;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    isAutoEscalated 
                      ? 'bg-red-500/10 border-red-500/50' 
                      : 'bg-background/50 border-border/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-sm text-muted-foreground">{task.id}</span>
                        <Badge variant="destructive">Blocked</Badge>
                        {isAutoEscalated && (
                          <Badge className="bg-red-500/30 text-red-300 gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Auto-Escalated
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium mb-2">{task.title}</p>
                      
                      <div className="p-2 rounded bg-muted/30 text-sm mb-2">
                        <span className="text-muted-foreground">Block Reason: </span>
                        <span>{task.blockReason}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Blocked: {task.blockedHours}h
                        </span>
                        <span>Threshold: {task.autoEscalateThreshold}h</span>
                        <Badge variant="outline" className="text-xs">{task.sourceId}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsEscalateOpen(true);
                        }}
                        className="gap-1"
                      >
                        <ArrowUpRight className="h-3 w-3" />
                        Escalate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUnblock(task)}
                      >
                        Unblock
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {mockBlockedTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Ban className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No blocked tasks
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEscalateOpen} onOpenChange={setIsEscalateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalate Blocked Task: {selectedTask?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-3 rounded bg-destructive/10 border border-destructive/30 text-sm">
              <p className="font-medium text-destructive">{selectedTask?.title}</p>
              <p className="text-muted-foreground mt-1">
                Blocked for {selectedTask?.blockedHours} hours
              </p>
              <p className="text-sm mt-2">{selectedTask?.blockReason}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Escalate To</Label>
              <div className="flex gap-2">
                <Button 
                  variant={escalateTo === 'dev_manager' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEscalateTo('dev_manager')}
                >
                  Dev Manager
                </Button>
                <Button 
                  variant={escalateTo === 'pro_manager' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEscalateTo('pro_manager')}
                >
                  Pro Manager
                </Button>
                <Button 
                  variant={escalateTo === 'super_admin' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setEscalateTo('super_admin')}
                >
                  Super Admin
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Escalation Note *</Label>
              <Textarea
                placeholder="Describe why this escalation is needed..."
                value={escalationNote}
                onChange={(e) => setEscalationNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEscalateOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleEscalate}>
                Confirm Escalation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TMBlockedTasks;
