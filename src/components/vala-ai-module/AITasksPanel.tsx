/**
 * AI TASKS PANEL
 * Shows running AI tasks
 */

import React from 'react';
import { ListTodo, Play, Pause, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const tasks = [
  { id: 'TASK-001', name: 'Content Moderation Batch', progress: 67, status: 'running', eta: '12 mins' },
  { id: 'TASK-002', name: 'Image Classification Pipeline', progress: 89, status: 'running', eta: '3 mins' },
  { id: 'TASK-003', name: 'Document Processing Queue', progress: 23, status: 'running', eta: '45 mins' },
  { id: 'TASK-004', name: 'Sentiment Analysis Batch', progress: 100, status: 'completed', eta: 'Done' },
  { id: 'TASK-005', name: 'Translation Service', progress: 45, status: 'paused', eta: 'Paused' },
];

export const AITasksPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-primary" />
          AI Tasks Running
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor active AI processing tasks</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">156</p>
            <p className="text-xs text-emerald-500/70">Running</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">12</p>
            <p className="text-xs text-amber-500/70">Paused</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">1,247</p>
            <p className="text-xs text-blue-500/70">Completed Today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Active Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{task.name}</p>
                  <p className="text-xs text-muted-foreground">{task.id} • ETA: {task.eta}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    task.status === 'running' ? 'bg-emerald-500/20 text-emerald-500' :
                    task.status === 'paused' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-blue-500/20 text-blue-500'
                  }>
                    {task.status}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    {task.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
