/**
 * DEV DEPLOYMENT
 * Deployment management with Boss approval
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CloudUpload, 
  Globe,
  Key,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DeploymentItem {
  id: string;
  name: string;
  version: string;
  status: 'deployed' | 'pending' | 'failed';
  environment: 'production' | 'staging';
  domain?: string;
  deployedAt?: string;
}

const deployments: DeploymentItem[] = [
  { id: '1', name: 'CRM-Pro', version: 'v2.1.4', status: 'deployed', environment: 'production', domain: 'crm.softwarewala.net', deployedAt: '2 hours ago' },
  { id: '2', name: 'Shop-Demo', version: 'v1.0.3', status: 'pending', environment: 'production' },
  { id: '3', name: 'Analytics-Hub', version: 'v3.0.0', status: 'deployed', environment: 'staging', deployedAt: '1 day ago' },
  { id: '4', name: 'POS-Master', version: 'v2.0.1', status: 'failed', environment: 'production' },
];

const preDeployChecks = [
  { id: 'domain', label: 'Domain Bind', icon: Globe, status: 'passed' },
  { id: 'license', label: 'License Attach', icon: Key, status: 'passed' },
  { id: 'security', label: 'Security Check', icon: Shield, status: 'passed' },
];

export const DevDeployment: React.FC = () => {
  const handleRequestDeploy = (id: string) => {
    toast.success('Deploy request sent to Boss for approval');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CloudUpload className="w-5 h-5 text-blue-400" />
          Deployment
        </h1>
        <p className="text-sm text-muted-foreground">Manage deployments with Boss approval</p>
      </div>

      {/* Pre-Deploy Checks */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Pre-Deploy Checks</h3>
          <div className="grid grid-cols-3 gap-4">
            {preDeployChecks.map((check) => {
              const Icon = check.icon;
              return (
                <div 
                  key={check.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{check.label}</p>
                    <p className="text-xs text-emerald-400">Passed</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Deployments */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Deployments</h3>
          
          <div className="space-y-3">
            {deployments.map((deploy, index) => (
              <motion.div
                key={deploy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border",
                  deploy.status === 'deployed' ? "bg-emerald-500/5 border-emerald-500/30" :
                  deploy.status === 'pending' ? "bg-amber-500/5 border-amber-500/30" :
                  "bg-red-500/5 border-red-500/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    deploy.status === 'deployed' ? "bg-emerald-500/20" :
                    deploy.status === 'pending' ? "bg-amber-500/20" : "bg-red-500/20"
                  )}>
                    {deploy.status === 'deployed' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : deploy.status === 'pending' ? (
                      <Clock className="w-5 h-5 text-amber-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{deploy.name}</p>
                      <Badge variant="outline" className="text-xs">{deploy.version}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={cn(
                        "text-xs",
                        deploy.environment === 'production' ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                      )}>
                        {deploy.environment}
                      </Badge>
                      {deploy.domain && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {deploy.domain}
                        </span>
                      )}
                      {deploy.deployedAt && (
                        <span className="text-xs text-muted-foreground">{deploy.deployedAt}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "text-xs",
                    deploy.status === 'deployed' ? "bg-emerald-500/20 text-emerald-400" :
                    deploy.status === 'pending' ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"
                  )}>
                    {deploy.status === 'deployed' ? 'Deployed' :
                     deploy.status === 'pending' ? 'Awaiting Approval' : 'Failed'}
                  </Badge>
                  
                  {deploy.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleRequestDeploy(deploy.id)}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Request Deploy
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
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
