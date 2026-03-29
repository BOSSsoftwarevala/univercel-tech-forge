import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, MemoryStick, Network, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { serverManagerAPI } from '@/hooks/useServerManagerAPI';

interface HealthMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ServerNode {
  id: string;
  name: string;
  region: string;
  status: 'online' | 'degraded' | 'offline';
  cpu: HealthMetric;
  ram: HealthMetric;
  disk: HealthMetric;
  network: HealthMetric;
  uptime: string;
  lastCheck: string;
}

interface HealthOverviewResponse {
  nodes: ServerNode[];
}

export function SMSystemHealth() {
  const [nodes, setNodes] = useState<ServerNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadHealth = async (silent = false) => {
      try {
        const data = await serverManagerAPI.getHealthOverview() as HealthOverviewResponse;
        if (!cancelled) {
          setNodes(data.nodes || []);
        }
      } catch (error) {
        if (!silent) {
          toast.error(error instanceof Error ? error.message : 'Failed to load system health');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadHealth();
    const interval = window.setInterval(() => {
      void loadHealth(true);
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical':
      case 'offline':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  const MetricCard = ({ metric, icon: Icon }: { metric: HealthMetric; icon: React.ElementType }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{metric.name}</span>
        </div>
        <span className="text-sm font-mono">
          {metric.value.toFixed(1)}
          {metric.unit}
        </span>
      </div>
      <div className="relative">
        <Progress value={(metric.value / metric.max) * 100} className="h-2" />
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all ${getProgressColor(metric.status)}`}
          style={{ width: `${(metric.value / metric.max) * 100}%` }}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center h-64">
          <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          System Health
        </h2>
        <Badge variant="outline" className="font-mono text-xs">
          Live • Auto-refresh 5s
        </Badge>
      </div>

      <div className="grid gap-4">
        {nodes.map((node) => (
          <Card key={node.id} className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{node.name}</CardTitle>
                  <Badge variant="outline" className="text-xs font-mono">
                    {node.region}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(node.status)}>
                    {node.status === 'online' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {node.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Uptime: {node.uptime}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard metric={node.cpu} icon={Cpu} />
                <MetricCard metric={node.ram} icon={MemoryStick} />
                <MetricCard metric={node.disk} icon={HardDrive} />
                <MetricCard metric={node.network} icon={Network} />
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-right">Last check: {node.lastCheck}</div>
            </CardContent>
          </Card>
        ))}

        {!nodes.length && (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-sm text-muted-foreground text-center">
              No server health records available.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}