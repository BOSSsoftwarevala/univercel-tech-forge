import { motion } from "framer-motion";
import { 
  Loader2, CheckCircle2, AlertCircle, Pause, Play, 
  Rocket, TestTube, Code2, Brain, Globe, Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BuildStatus } from "@/pages/auto-dev/AutoDevDashboard";

interface BuildProgressProps {
  status: BuildStatus;
  progress: number;
  project: {
    name: string;
    description: string;
    status: string;
  } | null;
  onPause: () => void;
  onResume: () => void;
}

export const BuildProgress = ({ status, progress, project, onPause, onResume }: BuildProgressProps) => {
  const stages = [
    { id: 'understanding', label: 'Understanding', icon: Brain, color: 'text-violet-400' },
    { id: 'building', label: 'Building', icon: Code2, color: 'text-blue-400' },
    { id: 'testing', label: 'Testing', icon: TestTube, color: 'text-amber-400' },
    { id: 'deploying', label: 'Deploying', icon: Rocket, color: 'text-emerald-400' },
    { id: 'complete', label: 'Live', icon: Globe, color: 'text-green-400' },
  ];

  const getStageStatus = (stageId: string): 'pending' | 'active' | 'complete' => {
    const stageOrder = ['idle', 'understanding', 'clarifying', 'building', 'testing', 'deploying', 'complete'];
    const currentIndex = stageOrder.indexOf(status);
    const stageIndex = stageOrder.indexOf(stageId);
    
    if (status === 'paused') {
      return stageIndex < currentIndex ? 'complete' : 'pending';
    }
    if (stageIndex < currentIndex) return 'complete';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'complete': return 'from-emerald-500 to-green-500';
      case 'error': return 'from-red-500 to-rose-500';
      case 'paused': return 'from-amber-500 to-yellow-500';
      default: return 'from-violet-500 to-purple-500';
    }
  };

  return (
    <Card className="bg-slate-900/50 border-border/50 overflow-hidden">
      {/* Progress Bar Overlay */}
      <div className="h-1 bg-slate-800">
        <motion.div
          className={cn("h-full bg-gradient-to-r", getStatusColor())}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            {status === 'complete' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : status === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : status === 'paused' ? (
              <Pause className="w-4 h-4 text-amber-400" />
            ) : status !== 'idle' ? (
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 text-muted-foreground" />
            )}
            Build Progress
          </div>
          {progress > 0 && (
            <span className="text-xs font-mono text-muted-foreground">{progress}%</span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Info */}
        {project && (
          <div className="p-3 rounded-lg bg-slate-800/50 border border-border/30">
            <h4 className="font-medium text-white capitalize">{project.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{project.status}</p>
          </div>
        )}

        {/* Build Stages */}
        <div className="space-y-2">
          {stages.map((stage, index) => {
            const stageStatus = getStageStatus(stage.id);
            const Icon = stage.icon;
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  stageStatus === 'active' && "bg-violet-500/10",
                  stageStatus === 'complete' && "bg-emerald-500/5"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  stageStatus === 'complete' 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : stageStatus === 'active'
                    ? "bg-violet-500/20 text-violet-400"
                    : "bg-slate-800 text-muted-foreground"
                )}>
                  {stageStatus === 'complete' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : stageStatus === 'active' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={cn(
                  "text-sm",
                  stageStatus === 'complete' 
                    ? "text-emerald-400" 
                    : stageStatus === 'active'
                    ? "text-white"
                    : "text-muted-foreground"
                )}>
                  {stage.label}
                </span>
                {stageStatus === 'active' && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-violet-500/20 text-violet-300">
                    In Progress
                  </Badge>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Control Buttons */}
        {status !== 'idle' && status !== 'complete' && (
          <div className="flex gap-2 pt-2">
            {status === 'paused' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onResume}
                className="flex-1 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
              >
                <Play className="w-4 h-4 mr-1" />
                Resume
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onPause}
                className="flex-1 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
            )}
          </div>
        )}

        {/* Completion State */}
        {status === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30 text-center"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-300">Your software is live!</p>
            <p className="text-xs text-muted-foreground mt-1">Domain & license auto-configured</p>
          </motion.div>
        )}

        {/* Idle State */}
        {status === 'idle' && !project && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No active build</p>
            <p className="text-xs mt-1">Start by describing what you want to create</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
