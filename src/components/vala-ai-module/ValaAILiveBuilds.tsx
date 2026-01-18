/**
 * VALA AI - LIVE BUILDS
 * Real-time progress display for all active builds
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, PauseCircle, XCircle, CheckCircle2, 
  Clock, AlertTriangle, RefreshCw, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Build {
  id: string;
  name: string;
  progress: number;
  stage: string;
  status: 'running' | 'paused' | 'failed' | 'completed';
  startedAt: string;
  estimatedCompletion: string;
}

const initialBuilds: Build[] = [
  { id: 'build-001', name: 'E-Commerce Dashboard', progress: 82, stage: 'Testing', status: 'running', startedAt: '10 min ago', estimatedCompletion: '3 min' },
  { id: 'build-002', name: 'Analytics Module', progress: 45, stage: 'Features Applied', status: 'running', startedAt: '25 min ago', estimatedCompletion: '15 min' },
  { id: 'build-003', name: 'User Auth System', progress: 65, stage: 'AI / API Linked', status: 'paused', startedAt: '1 hour ago', estimatedCompletion: 'Paused' },
  { id: 'build-004', name: 'Mobile App UI', progress: 23, stage: 'Structure Ready', status: 'running', startedAt: '35 min ago', estimatedCompletion: '30 min' },
  { id: 'build-005', name: 'Payment Gateway', progress: 100, stage: 'Ready', status: 'completed', startedAt: '2 hours ago', estimatedCompletion: 'Done' },
  { id: 'build-006', name: 'Report Generator', progress: 15, stage: 'Structure Ready', status: 'failed', startedAt: '45 min ago', estimatedCompletion: 'Failed' },
];

const getStatusColor = (status: Build['status']) => {
  switch (status) {
    case 'running': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    case 'paused': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    case 'failed': return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    case 'completed': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    default: return 'text-muted-foreground';
  }
};

const getStatusIcon = (status: Build['status']) => {
  switch (status) {
    case 'running': return PlayCircle;
    case 'paused': return PauseCircle;
    case 'failed': return XCircle;
    case 'completed': return CheckCircle2;
    default: return Clock;
  }
};

export const ValaAILiveBuilds: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>(initialBuilds);

  // Simulate real-time progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuilds(prev => prev.map(build => {
        if (build.status === 'running' && build.progress < 100) {
          const newProgress = Math.min(build.progress + Math.random() * 2, 100);
          let newStage = build.stage;
          
          if (newProgress >= 100) newStage = 'Ready';
          else if (newProgress >= 80) newStage = 'Testing';
          else if (newProgress >= 60) newStage = 'AI / API Linked';
          else if (newProgress >= 40) newStage = 'Features Applied';
          else if (newProgress >= 20) newStage = 'Structure Ready';
          
          return {
            ...build,
            progress: Math.round(newProgress * 10) / 10,
            stage: newStage,
            status: newProgress >= 100 ? 'completed' : 'running'
          };
        }
        return build;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (buildId: string, action: 'pause' | 'resume' | 'retry' | 'view') => {
    if (action === 'pause') {
      setBuilds(prev => prev.map(b => b.id === buildId ? { ...b, status: 'paused' as const } : b));
      toast.info('Build paused');
    } else if (action === 'resume') {
      setBuilds(prev => prev.map(b => b.id === buildId ? { ...b, status: 'running' as const } : b));
      toast.success('Build resumed');
    } else if (action === 'retry') {
      setBuilds(prev => prev.map(b => b.id === buildId ? { ...b, status: 'running' as const, progress: 0, stage: 'Project Initialized' } : b));
      toast.success('Build restarted');
    } else if (action === 'view') {
      toast.info('Opening build details...');
    }
  };

  const runningCount = builds.filter(b => b.status === 'running').length;
  const pausedCount = builds.filter(b => b.status === 'paused').length;
  const failedCount = builds.filter(b => b.status === 'failed').length;
  const completedCount = builds.filter(b => b.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-emerald-500" />
            Live Builds
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time build progress monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor('running')}>{runningCount} Running</Badge>
          <Badge className={getStatusColor('paused')}>{pausedCount} Paused</Badge>
          <Badge className={getStatusColor('failed')}>{failedCount} Failed</Badge>
          <Badge className={getStatusColor('completed')}>{completedCount} Done</Badge>
        </div>
      </div>

      {/* Builds List */}
      <div className="space-y-4">
        <AnimatePresence>
          {builds.map((build, idx) => {
            const StatusIcon = getStatusIcon(build.status);
            
            return (
              <motion.div
                key={build.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(build.status).split(' ').slice(1).join(' ')}`}>
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(build.status).split(' ')[0]}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{build.name}</h3>
                          <p className="text-xs text-muted-foreground">Started {build.startedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {build.stage}
                        </Badge>
                        {build.status === 'running' && (
                          <Button variant="ghost" size="sm" onClick={() => handleAction(build.id, 'pause')}>
                            <PauseCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {build.status === 'paused' && (
                          <Button variant="ghost" size="sm" onClick={() => handleAction(build.id, 'resume')}>
                            <PlayCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {build.status === 'failed' && (
                          <Button variant="ghost" size="sm" onClick={() => handleAction(build.id, 'retry')}>
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleAction(build.id, 'view')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={`font-medium ${
                          build.status === 'completed' ? 'text-emerald-500' :
                          build.status === 'failed' ? 'text-rose-500' :
                          'text-foreground'
                        }`}>
                          {build.progress}%
                        </span>
                      </div>
                      <Progress 
                        value={build.progress} 
                        className={`h-2 ${
                          build.status === 'failed' ? '[&>div]:bg-rose-500' :
                          build.status === 'completed' ? '[&>div]:bg-emerald-500' :
                          build.status === 'paused' ? '[&>div]:bg-amber-500' : ''
                        }`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>ETA: {build.estimatedCompletion}</span>
                        <span>{build.id.toUpperCase()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
