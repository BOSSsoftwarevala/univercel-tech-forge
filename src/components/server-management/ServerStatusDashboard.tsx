import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server, Shield, Cpu, HardDrive, Activity, 
  RefreshCw, Pause, Square, Search, Download,
  CheckCircle2, AlertTriangle, XCircle, Loader2,
  Sparkles, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ConnectedServer } from './ServerSetupPanel';

interface ServerStatusDashboardProps {
  servers: ConnectedServer[];
  onAddServer: () => void;
}

type ActionType = 'restart' | 'pause' | 'stop' | 'scan' | 'backup';

export const ServerStatusDashboard: React.FC<ServerStatusDashboardProps> = ({ 
  servers, 
  onAddServer 
}) => {
  const [loadingActions, setLoadingActions] = useState<Record<string, ActionType | null>>({});

  const handleAction = async (serverId: string, action: ActionType) => {
    setLoadingActions(prev => ({ ...prev, [serverId]: action }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Log the action
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: `server_${action}`,
          module: 'server_management',
          role: 'server_manager',
          meta_json: { server_id: serverId, action }
        });
      }

      const actionLabels: Record<ActionType, string> = {
        restart: 'Server restarted successfully',
        pause: 'Server paused',
        stop: 'Server stopped',
        scan: 'Security scan complete - No threats found',
        backup: 'Backup created successfully'
      };

      toast.success(actionLabels[action]);
    } catch (error) {
      toast.error(`Failed to ${action} server`);
    } finally {
      setLoadingActions(prev => ({ ...prev, [serverId]: null }));
    }
  };

  const getStatusIcon = (status: ConnectedServer['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusLabel = (status: ConnectedServer['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Online</Badge>;
      case 'risk':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Needs Attention</Badge>;
      case 'offline':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Offline</Badge>;
    }
  };

  const getSecurityBadge = (status: ConnectedServer['securityStatus']) => {
    if (status === 'safe') {
      return (
        <div className="flex items-center gap-2 text-green-500">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Secure</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-yellow-500">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Action Needed</span>
      </div>
    );
  };

  const getResourceColor = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (servers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Servers</h2>
          <p className="text-muted-foreground">AI monitors and protects everything automatically</p>
        </div>
        <Button onClick={onAddServer} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Server
        </Button>
      </div>

      {/* Server Cards */}
      <div className="grid gap-6">
        {servers.map((server) => (
          <Card key={server.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(server.status)}
                  <div>
                    <CardTitle className="text-lg">{server.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {server.brand.toUpperCase()} • {server.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getSecurityBadge(server.securityStatus)}
                  {getStatusLabel(server.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Simple Resource Bars */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span>CPU</span>
                    </div>
                    <span className="font-medium">{server.cpu}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getResourceColor(server.cpu)} transition-all`}
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span>Memory</span>
                    </div>
                    <span className="font-medium">{server.ram}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getResourceColor(server.ram)} transition-all`}
                      style={{ width: `${server.ram}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span>Storage</span>
                    </div>
                    <span className="font-medium">{server.disk}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getResourceColor(server.disk)} transition-all`}
                      style={{ width: `${server.disk}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary mb-1">AI Recommendation</p>
                  <p className="text-sm text-muted-foreground">{server.aiRecommendation}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(server.id, 'restart')}
                  disabled={loadingActions[server.id] !== null}
                  className="gap-2"
                >
                  {loadingActions[server.id] === 'restart' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Restart
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(server.id, 'pause')}
                  disabled={loadingActions[server.id] !== null}
                  className="gap-2"
                >
                  {loadingActions[server.id] === 'pause' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  Pause
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(server.id, 'stop')}
                  disabled={loadingActions[server.id] !== null}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  {loadingActions[server.id] === 'stop' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  Stop
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(server.id, 'scan')}
                  disabled={loadingActions[server.id] !== null}
                  className="gap-2"
                >
                  {loadingActions[server.id] === 'scan' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Scan
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(server.id, 'backup')}
                  disabled={loadingActions[server.id] !== null}
                  className="gap-2"
                >
                  {loadingActions[server.id] === 'backup' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
