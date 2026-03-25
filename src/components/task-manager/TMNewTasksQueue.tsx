import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertCircle, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UnassignedTask {
  id: string;
  sourceType: string;
  sourceId: string;
  title: string;
  priority: string;
  createdAt: string;
  slaHours: number;
}

const mockUnassignedTasks: UnassignedTask[] = [
  { id: 'TSK-001', sourceType: 'Lead', sourceId: 'LD-4521', title: 'Initial consultation follow-up', priority: 'high', createdAt: '2024-01-15T09:00:00Z', slaHours: 24 },
  { id: 'TSK-002', sourceType: 'Order', sourceId: 'ORD-7823', title: 'Order processing verification', priority: 'critical', createdAt: '2024-01-15T08:30:00Z', slaHours: 4 },
  { id: 'TSK-003', sourceType: 'Ticket', sourceId: 'TKT-1234', title: 'Bug report investigation', priority: 'medium', createdAt: '2024-01-15T10:15:00Z', slaHours: 48 },
];

const TMNewTasksQueue: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    sourceType: '',
    sourceId: '',
    taskType: '',
    description: '',
    priority: '',
    dueDate: '',
    requiredSkill: '',
    slaFlag: false
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const validateForm = () => {
    const requiredFields = ['sourceType', 'sourceId', 'taskType', 'description', 'priority', 'dueDate', 'requiredSkill'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Missing required field: ${field.replace(/([A-Z])/g, ' $1').trim()}`);
        return false;
      }
    }
    return true;
  };

  const handleCreateTask = () => {
    if (!validateForm()) return;

    // Log task creation
    console.log('[TASK_MANAGER] Task created:', {
      timestamp: new Date().toISOString(),
      action: 'task_created',
      data: formData
    });

    toast.success('Task created successfully');
    setIsCreateOpen(false);
    setFormData({
      sourceType: '',
      sourceId: '',
      taskType: '',
      description: '',
      priority: '',
      dueDate: '',
      requiredSkill: '',
      slaFlag: false
    });
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          New Tasks (Unassigned)
        </CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source Type *</Label>
                  <Select value={formData.sourceType} onValueChange={(v) => setFormData({...formData, sourceType: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="order">Order</SelectItem>
                      <SelectItem value="ticket">Ticket</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Source ID *</Label>
                  <Input 
                    placeholder="e.g., LD-4521" 
                    value={formData.sourceId}
                    onChange={(e) => setFormData({...formData, sourceId: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Task Type *</Label>
                <Select value={formData.taskType} onValueChange={(v) => setFormData({...formData, taskType: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="bug_fix">Bug Fix</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea 
                  placeholder="Task description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date *</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Skill *</Label>
                <Select value={formData.requiredSkill} onValueChange={(v) => setFormData({...formData, requiredSkill: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="qa">QA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="slaFlag"
                  checked={formData.slaFlag}
                  onChange={(e) => setFormData({...formData, slaFlag: e.target.checked})}
                  className="rounded border-border"
                />
                <Label htmlFor="slaFlag">SLA Critical Flag</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockUnassignedTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-muted-foreground">{task.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.sourceType}: {task.sourceId}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="font-medium">{task.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      SLA: {task.slaHours}h
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Assign
                </Button>
              </div>
            </motion.div>
          ))}
          {mockUnassignedTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No unassigned tasks
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TMNewTasksQueue;
