// ==============================================
// Deployments Manager
// CI/CD Only - Versioned - Canary/Staged - Rollback
// Manual Prod Edit BLOCKED
// ==============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, GitBranch, CheckCircle, Clock, 
  RotateCcw, AlertTriangle, Play, Pause, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Deployment {
  id: string;
  version: string;
  environment: 'production' | 'staging' | 'canary';
  status: 'pending' | 'deploying' | 'deployed' | 'failed' | 'rolled_back';
  deployedAt: string;
  deployedBy: string;
  commit: string;
  branch: string;
  progress: number;
  canRollback: boolean;
  changelog: string[];
}

export function SMDeployments() {
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: 'deploy-001',
      version: 'v2.4.1',
      environment: 'production',
      status: 'deployed',
      deployedAt: '2024-01-30 10:30',
      deployedBy: 'CI/CD Pipeline',
      commit: 'a1b2c3d',
      branch: 'main',
      progress: 100,
      canRollback: true,
      changelog: ['Fixed memory leak in cache module', 'Updated API rate limiting'],
    },
    {
      id: 'deploy-002',
      version: 'v2.4.2-canary',
      environment: 'canary',
      status: 'deploying',
      deployedAt: '2024-01-30 14:00',
      deployedBy: 'CI/CD Pipeline',
      commit: 'e4f5g6h',
      branch: 'release/2.4.2',
      progress: 65,
      canRollback: false,
      changelog: ['New dashboard widgets', 'Performance optimizations'],
    },
    {
      id: 'deploy-003',
      version: 'v2.4.2-rc1',
      environment: 'staging',
      status: 'deployed',
      deployedAt: '2024-01-29 16:45',
      deployedBy: 'CI/CD Pipeline',
      commit: 'i7j8k9l',
      branch: 'release/2.4.2',
      progress: 100,
      canRollback: true,
      changelog: ['All features for 2.4.2', 'Bug fixes from QA'],
    },
  ]);

  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'deploying': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'rolled_back': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEnvColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-red-500/20 text-red-400';
      case 'staging': return 'bg-blue-500/20 text-blue-400';
      case 'canary': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleRollback = async (deployId: string, version: string) => {
    setIsRollingBack(deployId);
    toast.info(`Initiating rollback for ${version}...`);
    
    // Simulate rollback
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setDeployments(prev => prev.map(dep => 
      dep.id === deployId 
        ? { ...dep, status: 'rolled_back' as const, canRollback: false }
        : dep
    ));
    
    setIsRollingBack(null);
    toast.success(`Rollback to previous version completed`);
  };

  const handlePromoteCanary = (deployId: string) => {
    toast.warning('BLOCKED: Canary promotion requires Admin approval');
  };

  const handleManualEdit = () => {
    toast.error('BLOCKED: Manual production edits not allowed. Use CI/CD pipeline.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          Deployments
        </h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleManualEdit} className="text-xs">
            <XCircle className="h-3 w-3 mr-1 text-red-400" />
            Manual Edit (Blocked)
          </Button>
          <Badge variant="outline" className="font-mono text-xs">
            CI/CD Only
          </Badge>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            <span>All deployments are automated via CI/CD. Manual production modifications are blocked.</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {deployments.map(deployment => (
          <Card key={deployment.id} className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getEnvColor(deployment.environment)}>
                    {deployment.environment.toUpperCase()}
                  </Badge>
                  <CardTitle className="text-base font-mono">{deployment.version}</CardTitle>
                  <Badge className={getStatusColor(deployment.status)}>
                    {deployment.status === 'deploying' && <Play className="h-3 w-3 mr-1 animate-pulse" />}
                    {deployment.status === 'deployed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {deployment.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                    {deployment.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {deployment.canRollback && deployment.status === 'deployed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRollback(deployment.id, deployment.version)}
                      disabled={isRollingBack === deployment.id}
                      className="text-xs"
                    >
                      <RotateCcw className={`h-3 w-3 mr-1 ${isRollingBack === deployment.id ? 'animate-spin' : ''}`} />
                      Rollback
                    </Button>
                  )}
                  {deployment.environment === 'canary' && deployment.status === 'deployed' && (
                    <Button
                      size="sm"
                      onClick={() => handlePromoteCanary(deployment.id)}
                      className="text-xs"
                    >
                      Promote to Prod
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {deployment.status === 'deploying' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Deployment Progress</span>
                    <span>{deployment.progress}%</span>
                  </div>
                  <Progress value={deployment.progress} className="h-2" />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Commit:</span>
                  <span className="ml-2 font-mono">{deployment.commit}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Branch:</span>
                  <span className="ml-2 font-mono flex items-center gap-1">
                    <GitBranch className="h-3 w-3" />
                    {deployment.branch}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Deployed:</span>
                  <span className="ml-2">{deployment.deployedAt}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">By:</span>
                  <span className="ml-2">{deployment.deployedBy}</span>
                </div>
              </div>

              {deployment.changelog.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Changelog:</span>
                  <ul className="mt-1 text-xs text-muted-foreground list-disc list-inside">
                    {deployment.changelog.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
