/**
 * VALA AI - AUTO FIX QUEUE
 * Queue of issues being automatically fixed by AI
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, CheckCircle2, Clock, XCircle, RefreshCw,
  Play, Pause, Eye, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface FixJob {
  id: string;
  issueTitle: string;
  fixDescription: string;
  status: 'queued' | 'in-progress' | 'testing' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  estimatedTime: string;
}

const mockFixJobs: FixJob[] = [
  { id: 'fix-001', issueTitle: 'Login button not responding', fixDescription: 'Increasing touch target and adding feedback', status: 'testing', progress: 85, startedAt: '3 min ago', estimatedTime: '1 min' },
  { id: 'fix-002', issueTitle: 'Slow chart rendering', fixDescription: 'Implementing data virtualization', status: 'in-progress', progress: 45, startedAt: '8 min ago', estimatedTime: '5 min' },
  { id: 'fix-003', issueTitle: 'CSS overflow issue', fixDescription: 'Adding proper container constraints', status: 'queued', progress: 0, startedAt: '-', estimatedTime: '2 min' },
  { id: 'fix-004', issueTitle: 'Image optimization', fixDescription: 'Implementing lazy loading and WebP conversion', status: 'completed', progress: 100, startedAt: '15 min ago', estimatedTime: 'Done' },
  { id: 'fix-005', issueTitle: 'Memory leak in useEffect', fixDescription: 'Adding cleanup function', status: 'failed', progress: 60, startedAt: '20 min ago', estimatedTime: 'Failed' },
];

const getStatusConfig = (status: FixJob['status']) => {
  switch (status) {
    case 'queued': return { icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted/50' };
    case 'in-progress': return { icon: Wrench, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' };
    case 'testing': return { icon: Play, color: 'text-amber-500', bgColor: 'bg-amber-500/10' };
    case 'completed': return { icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' };
    case 'failed': return { icon: XCircle, color: 'text-rose-500', bgColor: 'bg-rose-500/10' };
  }
};

export const ValaAIAutoFixQueue: React.FC = () => {
  const [jobs, setJobs] = useState<FixJob[]>(mockFixJobs);
  const [selectedJob, setSelectedJob] = useState<FixJob | null>(null);

  const handleRetry = (jobId: string) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, status: 'queued' as const, progress: 0 } : j
    ));
    toast.success('Fix job requeued');
  };

  const handlePause = (jobId: string) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId && (j.status === 'in-progress' || j.status === 'testing')
        ? { ...j, status: 'queued' as const }
        : j
    ));
    toast.info('Fix job paused and moved to queue');
  };

  const handleView = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      toast.success(`Viewing: ${job.issueTitle}`);
    }
  };

  const queuedCount = jobs.filter(j => j.status === 'queued').length;
  const inProgressCount = jobs.filter(j => j.status === 'in-progress' || j.status === 'testing').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const failedCount = jobs.filter(j => j.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-500" />
            Auto Fix Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered automatic issue resolution
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{queuedCount} Queued</Badge>
          <Badge className="bg-cyan-500/20 text-cyan-500 border-cyan-500/30">{inProgressCount} Active</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">{completedCount} Done</Badge>
          {failedCount > 0 && (
            <Badge className="bg-rose-500/20 text-rose-500 border-rose-500/30">{failedCount} Failed</Badge>
          )}
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{queuedCount}</p>
            <p className="text-xs text-muted-foreground">In Queue</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cyan-500">{inProgressCount}</p>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Fixed Today</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">94%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {jobs.map((job, idx) => {
          const statusConfig = getStatusConfig(job.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">{job.issueTitle}</h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {job.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{job.fixDescription}</p>
                      
                      {(job.status === 'in-progress' || job.status === 'testing') && (
                        <div className="mt-2">
                          <Progress value={job.progress} className="h-1.5" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {job.progress}% • ETA: {job.estimatedTime}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{job.id.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(job.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {(job.status === 'in-progress' || job.status === 'testing') && (
                        <Button variant="ghost" size="sm" onClick={() => handlePause(job.id)}>
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      {job.status === 'failed' && (
                        <Button variant="ghost" size="sm" onClick={() => handleRetry(job.id)}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Note */}
      <Card className="bg-muted/30 border-border/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">AI-Only Handling</p>
              <p className="text-xs text-muted-foreground mt-1">
                Human developers never edit code directly. AI handles all fixes automatically.
                Complex issues are escalated to Boss for approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
