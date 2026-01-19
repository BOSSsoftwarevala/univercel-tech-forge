/**
 * VALA AI - DEMO ENGINE SCREEN
 * AI Capabilities: Clone, Inject dummy data, Repair UI, Fix APIs, Match theme
 * Controls: Start, Pause, Stop, Review, Approve/Reject
 * Rule: AI NEVER deploys without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Bot,
  Play,
  Pause,
  Square,
  Eye,
  Check,
  X,
  Copy,
  Database,
  Paintbrush,
  Plug,
  Palette,
  Sparkles,
  Clock,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface AITask {
  id: string;
  software: string;
  taskType: 'clone' | 'dummy-data' | 'repair-ui' | 'fix-api' | 'match-theme';
  status: 'queued' | 'running' | 'paused' | 'completed' | 'pending-approval';
  progress: number;
  startedAt: string;
  estimatedTime: string;
}

const aiTasks: AITask[] = [
  { id: '1', software: 'SchoolERP Pro Clone', taskType: 'clone', status: 'running', progress: 67, startedAt: '10 min ago', estimatedTime: '5 min left' },
  { id: '2', software: 'HospitalCRM', taskType: 'repair-ui', status: 'pending-approval', progress: 100, startedAt: '25 min ago', estimatedTime: 'Done' },
  { id: '3', software: 'RetailPOS Master', taskType: 'fix-api', status: 'queued', progress: 0, startedAt: '-', estimatedTime: '~15 min' },
  { id: '4', software: 'BuilderCRM Elite', taskType: 'dummy-data', status: 'running', progress: 45, startedAt: '8 min ago', estimatedTime: '10 min left' },
  { id: '5', software: 'LogisticsERP', taskType: 'match-theme', status: 'completed', progress: 100, startedAt: '1 hour ago', estimatedTime: 'Done' },
];

const aiCapabilities = [
  { id: 'clone', name: 'Clone Master Software', icon: Copy, description: 'Create exact copy of master template' },
  { id: 'dummy-data', name: 'Inject Dummy Data', icon: Database, description: 'Add realistic test data automatically' },
  { id: 'repair-ui', name: 'Repair UI Flows', icon: Paintbrush, description: 'Fix broken screens and navigation' },
  { id: 'fix-api', name: 'Fix Broken APIs', icon: Plug, description: 'Reconnect and repair API endpoints' },
  { id: 'match-theme', name: 'Match Theme EXACTLY', icon: Palette, description: 'Ensure consistent branding' },
];

export const DMEValaAIScreen: React.FC = () => {
  const [tasks, setTasks] = useState(aiTasks);

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'clone': return <Copy className="w-4 h-4" />;
      case 'dummy-data': return <Database className="w-4 h-4" />;
      case 'repair-ui': return <Paintbrush className="w-4 h-4" />;
      case 'fix-api': return <Plug className="w-4 h-4" />;
      case 'match-theme': return <Palette className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">Running</Badge>;
      case 'queued': return <Badge className="bg-muted text-muted-foreground">Queued</Badge>;
      case 'paused': return <Badge className="bg-neon-orange/20 text-neon-orange border-neon-orange/30">Paused</Badge>;
      case 'completed': return <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">Completed</Badge>;
      case 'pending-approval': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending Approval</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleControl = (taskId: string, action: string) => {
    toast.success(`${action} action for task: ${taskId}`);
  };

  const stats = {
    running: tasks.filter(t => t.status === 'running').length,
    queued: tasks.filter(t => t.status === 'queued').length,
    pending: tasks.filter(t => t.status === 'pending-approval').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Vala AI — Demo Engine
          </h1>
          <p className="text-muted-foreground text-sm">AI-powered demo automation • Never deploys without approval</p>
        </div>
        <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/30 animate-pulse">
          <Activity className="w-3 h-3 mr-1" />
          AI ACTIVE
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.running}</p>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{stats.queued}</p>
            <p className="text-xs text-muted-foreground">Queued</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Completed Today</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Capabilities */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            AI Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {aiCapabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.id} className="p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-foreground">{cap.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{cap.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <p className="text-sm text-yellow-400">
          <strong>RULE:</strong> AI NEVER deploys changes without explicit Boss approval. All outputs require review.
        </p>
      </div>

      {/* Active Tasks */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Active AI Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-background/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getTaskTypeIcon(task.taskType)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{task.software}</p>
                      <p className="text-xs text-muted-foreground capitalize">{task.taskType.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {task.estimatedTime}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <Progress value={task.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{task.progress}% complete</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {task.status === 'running' && (
                    <>
                      <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => handleControl(task.id, 'Pause')}>
                        <Pause className="w-3 h-3" />
                        Pause
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-red-400" onClick={() => handleControl(task.id, 'Stop')}>
                        <Square className="w-3 h-3" />
                        Stop
                      </Button>
                    </>
                  )}
                  {task.status === 'paused' && (
                    <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => handleControl(task.id, 'Resume')}>
                      <Play className="w-3 h-3" />
                      Resume
                    </Button>
                  )}
                  {task.status === 'queued' && (
                    <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => handleControl(task.id, 'Start')}>
                      <Play className="w-3 h-3" />
                      Start Now
                    </Button>
                  )}
                  {task.status === 'pending-approval' && (
                    <>
                      <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => handleControl(task.id, 'Review')}>
                        <Eye className="w-3 h-3" />
                        Review
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-neon-green" onClick={() => handleControl(task.id, 'Approve')}>
                        <Check className="w-3 h-3" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-red-400" onClick={() => handleControl(task.id, 'Reject')}>
                        <X className="w-3 h-3" />
                        Reject
                      </Button>
                    </>
                  )}
                  {task.status === 'completed' && (
                    <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => handleControl(task.id, 'View Output')}>
                      <Eye className="w-3 h-3" />
                      View Output
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
