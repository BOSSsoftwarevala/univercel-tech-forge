// Continent Super Admin - Tasks Screen
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TasksView = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const assignedTasks = [
    { id: '1', title: 'Review Q4 Budget', assignee: 'John Okafor', sla: '2 days', status: 'In Progress' },
    { id: '2', title: 'Audit Compliance Check', assignee: 'Mary Wanjiku', sla: '5 days', status: 'Pending' },
    { id: '3', title: 'Sales Report Analysis', assignee: 'David Nkosi', sla: '3 days', status: 'In Progress' },
  ];

  const atRiskTasks = [
    { id: '4', title: 'Security Audit', assignee: 'Ahmed Hassan', sla: 'Overdue', risk: 'High' },
    { id: '5', title: 'KYC Verification', assignee: 'Kwame Asante', sla: '1 day left', risk: 'Medium' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground">Create and manage tasks for area managers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Task */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Plus className="h-5 w-5" />
              Create Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">Task Title</Label>
              <Input
                id="title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-foreground">Assign To</Label>
              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select area manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Okafor - Nigeria</SelectItem>
                  <SelectItem value="mary">Mary Wanjiku - Kenya</SelectItem>
                  <SelectItem value="david">David Nkosi - South Africa</SelectItem>
                  <SelectItem value="kwame">Kwame Asante - Ghana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-foreground">Priority</Label>
              <Select>
                <SelectTrigger className="bg-background border-border">
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
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description"
                className="bg-background border-border"
                rows={3}
              />
            </div>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </CardContent>
        </Card>

        {/* Assigned Tasks */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ClipboardList className="h-5 w-5" />
              Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-background rounded-lg border border-border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.assignee}</p>
                    </div>
                    <Badge variant="secondary">{task.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    SLA: {task.sla}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At Risk Tasks */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            At Risk Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atRiskTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-red-500/10 rounded-lg border border-red-500/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.assignee}</p>
                  </div>
                  <Badge variant="destructive">{task.risk} Risk</Badge>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
                  <Clock className="h-3 w-3" />
                  {task.sla}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksView;
