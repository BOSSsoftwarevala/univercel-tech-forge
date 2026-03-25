import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, CheckCircle2, Clock, AlertTriangle, Pause, Eye,
  Code2, Database, Bot, TestTube, Rocket, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';
import { toast } from 'sonner';

interface BuildJob {
  id: string;
  title: string;
  requestId: string;
  progress: number;
  stage: 'accepted' | 'structure' | 'features' | 'apis' | 'testing' | 'ready';
  status: 'running' | 'paused' | 'completed' | 'failed';
  startedAt: string;
  estimatedCompletion: string;
  logs: string[];
  aiBot: string;
}

const mockBuilds: BuildJob[] = [
  {
    id: 'BUILD-001',
    title: 'Restaurant POS with Table Management',
    requestId: 'REQ-001',
    progress: 65,
    stage: 'features',
    status: 'running',
    startedAt: '10 min ago',
    estimatedCompletion: '~45 min',
    logs: [
      '[VALA-DEV] Initializing project structure...',
      '[VALA-DEV] Creating database schema...',
      '[VALA-DEV] Building table management module...',
      '[VALA-DEV] Adding kitchen display component...',
    ],
    aiBot: 'VALA-DEV'
  },
  {
    id: 'BUILD-002',
    title: 'Bug Fix: Login Screen Crash',
    requestId: 'REQ-002',
    progress: 90,
    stage: 'testing',
    status: 'running',
    startedAt: '5 min ago',
    estimatedCompletion: '~5 min',
    logs: [
      '[VALA-SUPPORT] Analyzing error logs...',
      '[VALA-SUPPORT] Identified input validation issue...',
      '[VALA-DEV] Applying fix to auth module...',
      '[VALA-QA] Running automated tests...',
    ],
    aiBot: 'VALA-SUPPORT'
  },
  {
    id: 'BUILD-003',
    title: 'Hospital CRM Demo',
    requestId: 'REQ-004',
    progress: 100,
    stage: 'ready',
    status: 'completed',
    startedAt: '2 hours ago',
    estimatedCompletion: 'Completed',
    logs: [
      '[VALA-DEV] Demo generation complete',
      '[VALA-QA] All tests passed',
      '[VALA-SECURITY] Security scan passed',
      '[SYSTEM] Ready for deployment',
    ],
    aiBot: 'VALA-DEV'
  },
];

const stages = [
  { id: 'accepted', label: 'Accepted', icon: CheckCircle2, percent: 0 },
  { id: 'structure', label: 'Structure', icon: Database, percent: 20 },
  { id: 'features', label: 'Features', icon: Code2, percent: 40 },
  { id: 'apis', label: 'APIs Linked', icon: Zap, percent: 60 },
  { id: 'testing', label: 'Testing', icon: TestTube, percent: 80 },
  { id: 'ready', label: 'Ready', icon: Rocket, percent: 100 },
];

const ValaBuildProgress = () => {
  const { logAction } = useEnterpriseAudit();
  const [builds, setBuilds] = useState(mockBuilds);
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);

  const handlePause = async (buildId: string) => {
    await logAction({
      action: 'pause_build',
      module: 'vala_builder',
      severity: 'medium',
      target_id: buildId
    });
    setBuilds(prev => prev.map(b => 
      b.id === buildId ? { ...b, status: 'paused' as const } : b
    ));
    toast.success('Build paused');
  };

  const handleResume = async (buildId: string) => {
    await logAction({
      action: 'resume_build',
      module: 'vala_builder',
      severity: 'low',
      target_id: buildId
    });
    setBuilds(prev => prev.map(b => 
      b.id === buildId ? { ...b, status: 'running' as const } : b
    ));
    toast.success('Build resumed');
  };

  const handleDeploy = async (buildId: string) => {
    await logAction({
      action: 'deploy_build',
      module: 'vala_builder',
      severity: 'high',
      target_id: buildId
    });
    toast.success('Deployment initiated - Boss approval required');
  };

  const getStageIndex = (stage: string) => stages.findIndex(s => s.id === stage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-400" />
            Active Builds
          </h2>
          <p className="text-slate-400 text-sm">Live progress of AI-powered builds</p>
        </div>
      </div>

      <div className="space-y-4">
        {builds.map((build, index) => {
          const currentStageIndex = getStageIndex(build.stage);

          return (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border-slate-700 ${build.status === 'running' ? 'border-purple-500/30' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={
                          build.status === 'running' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          build.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          build.status === 'paused' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }>
                          {build.status === 'running' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                          {build.status}
                        </Badge>
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                          {build.id}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{build.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span>Started: {build.startedAt}</span>
                        <span>ETA: {build.estimatedCompletion}</span>
                        <span className="text-purple-400">Bot: {build.aiBot}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-400">{build.progress}%</div>
                      <div className="text-xs text-slate-400">Complete</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Progress value={build.progress} className="h-2 bg-slate-800" />
                  </div>

                  {/* Stage Indicators */}
                  <div className="flex justify-between mb-4">
                    {stages.map((stage, i) => {
                      const StageIcon = stage.icon;
                      const isComplete = i <= currentStageIndex;
                      const isCurrent = i === currentStageIndex;

                      return (
                        <div key={stage.id} className="flex flex-col items-center">
                          <div className={`p-2 rounded-full mb-1 ${
                            isComplete 
                              ? isCurrent 
                                ? 'bg-purple-500/30 text-purple-400 ring-2 ring-purple-500/50' 
                                : 'bg-emerald-500/30 text-emerald-400'
                              : 'bg-slate-800 text-slate-500'
                          }`}>
                            <StageIcon className="w-4 h-4" />
                          </div>
                          <span className={`text-xs ${isComplete ? 'text-white' : 'text-slate-500'}`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Logs Preview */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
                    {build.logs.slice(-3).map((log, i) => (
                      <div key={i} className="text-slate-400">
                        <span className="text-purple-400">&gt;</span> {log}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    {build.status === 'running' && (
                      <Button
                        onClick={() => handlePause(build.id)}
                        variant="outline"
                        className="text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    {build.status === 'paused' && (
                      <Button
                        onClick={() => handleResume(build.id)}
                        className="bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    {build.status === 'completed' && (
                      <Button
                        onClick={() => handleDeploy(build.id)}
                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Deploy
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="text-slate-400 hover:text-white ml-auto"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ValaBuildProgress;
