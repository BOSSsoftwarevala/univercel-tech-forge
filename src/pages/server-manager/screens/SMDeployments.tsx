import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, CheckCircle2, Clock, XCircle, RefreshCw, 
  GitBranch, Server, Calendar, Eye, RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const deployments = [
  { 
    id: 'dep-001', name: 'API v2.4.1', branch: 'main', server: 'prod-api-01', 
    status: 'success', time: '10 min ago', duration: '2m 34s'
  },
  { 
    id: 'dep-002', name: 'DB Migration #45', branch: 'main', server: 'prod-db-01', 
    status: 'success', time: '1 hour ago', duration: '1m 12s'
  },
  { 
    id: 'dep-003', name: 'Cache Config', branch: 'staging', server: 'prod-cache-01', 
    status: 'pending', time: 'In progress', duration: '0m 45s'
  },
  { 
    id: 'dep-004', name: 'API v2.4.0', branch: 'main', server: 'prod-api-02', 
    status: 'failed', time: '2 hours ago', duration: '3m 01s'
  },
];

const SMDeployments = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[status] || styles.pending;
  };

  const handleRollback = (name: string) => {
    toast.success(`Rollback initiated for ${name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Deployments</h1>
          <p className="text-slate-400">Manage and monitor server deployments</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Rocket className="w-4 h-4 mr-2" />
          New Deployment
        </Button>
      </div>

      {/* Deployment Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Deployments', value: '156', icon: Rocket, color: 'cyan' },
          { label: 'Successful', value: '148', icon: CheckCircle2, color: 'emerald' },
          { label: 'Failed', value: '5', icon: XCircle, color: 'red' },
          { label: 'In Progress', value: '3', icon: Clock, color: 'amber' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-slate-900/50 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Deployments */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-400" />
            Recent Deployments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deployments.map((deployment, i) => (
              <motion.div
                key={deployment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <p className="text-white font-medium">{deployment.name}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {deployment.branch}
                      </span>
                      <span className="flex items-center gap-1">
                        <Server className="w-3 h-3" />
                        {deployment.server}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-slate-300 text-sm">{deployment.time}</p>
                    <p className="text-slate-500 text-xs">Duration: {deployment.duration}</p>
                  </div>
                  <Badge variant="outline" className={getStatusBadge(deployment.status)}>
                    {deployment.status}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-400">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {deployment.status === 'success' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-amber-400"
                        onClick={() => handleRollback(deployment.name)}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMDeployments;
