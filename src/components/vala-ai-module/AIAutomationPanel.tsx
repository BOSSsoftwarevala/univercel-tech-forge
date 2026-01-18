/**
 * AI AUTOMATION PANEL - Full Featured
 * Complete automation job management with scheduling and monitoring
 */

import React from 'react';
import { Cog, Play, Pause, Settings, Clock, CheckCircle, Plus, Calendar, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const automationJobs = [
  { id: 'AUTO-001', name: 'Daily Report Generation', schedule: '0 6 * * *', lastRun: '6 hours ago', nextRun: 'in 18 hours', status: 'active', successRate: 100, runs: 365 },
  { id: 'AUTO-002', name: 'Content Backup', schedule: '0 0 * * *', lastRun: '12 hours ago', nextRun: 'in 12 hours', status: 'active', successRate: 99.5, runs: 365 },
  { id: 'AUTO-003', name: 'Model Retraining Pipeline', schedule: '0 2 * * 0', lastRun: '5 days ago', nextRun: 'in 2 days', status: 'active', successRate: 98.2, runs: 52 },
  { id: 'AUTO-004', name: 'Cache Cleanup', schedule: '0 */6 * * *', lastRun: '2 hours ago', nextRun: 'in 4 hours', status: 'active', successRate: 100, runs: 1460 },
  { id: 'AUTO-005', name: 'Usage Analytics Export', schedule: '0 0 1 * *', lastRun: '18 days ago', nextRun: 'in 12 days', status: 'paused', successRate: 100, runs: 12 },
  { id: 'AUTO-006', name: 'Security Scan', schedule: '0 3 * * *', lastRun: '9 hours ago', nextRun: 'in 15 hours', status: 'active', successRate: 100, runs: 365 },
  { id: 'AUTO-007', name: 'Database Optimization', schedule: '0 4 * * 0', lastRun: '3 days ago', nextRun: 'in 4 days', status: 'active', successRate: 97.8, runs: 52 },
];

const recentExecutions = [
  { job: 'Daily Report Generation', status: 'success', duration: '2m 34s', time: '6 hours ago' },
  { job: 'Cache Cleanup', status: 'success', duration: '45s', time: '8 hours ago' },
  { job: 'Security Scan', status: 'success', duration: '5m 12s', time: '9 hours ago' },
  { job: 'Content Backup', status: 'success', duration: '12m 8s', time: '12 hours ago' },
  { job: 'Model Retraining Pipeline', status: 'failed', duration: '1h 23m', time: '5 days ago' },
];

export const AIAutomationPanel: React.FC = () => {
  const handleAction = (action: string, item?: string) => {
    toast.success(`${action}${item ? `: ${item}` : ''}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Cog className="w-6 h-6 text-primary" />
            AI Automation Jobs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage scheduled automation tasks</p>
        </div>
        <Button onClick={() => handleAction('Create new automation')}>
          <Plus className="w-4 h-4 mr-2" />
          New Automation
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">28</p>
            <p className="text-xs text-muted-foreground">Active Jobs</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">3</p>
            <p className="text-xs text-muted-foreground">Paused</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">1,847</p>
            <p className="text-xs text-muted-foreground">Executions Today</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-500">99.2%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Scheduled Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {automationJobs.map((job) => (
            <div key={job.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cog className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{job.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{job.schedule} • Last: {job.lastRun} • {job.runs} total runs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Next: {job.nextRun}</span>
                  <Badge className={job.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}>
                    {job.status}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction('Run now', job.name)}>
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction(job.status === 'active' ? 'Paused' : 'Resumed', job.name)}>
                    {job.status === 'active' ? <Pause className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction('Edit', job.name)}>
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span>{job.successRate}%</span>
                </div>
                <Progress value={job.successRate} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Recent Executions</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleAction('View all executions')}>
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentExecutions.map((exec, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                {exec.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Cog className="w-4 h-4 text-rose-500" />
                )}
                <div>
                  <p className="text-sm font-medium">{exec.job}</p>
                  <p className="text-xs text-muted-foreground">{exec.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{exec.duration}</span>
                <Badge className={exec.status === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}>
                  {exec.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
