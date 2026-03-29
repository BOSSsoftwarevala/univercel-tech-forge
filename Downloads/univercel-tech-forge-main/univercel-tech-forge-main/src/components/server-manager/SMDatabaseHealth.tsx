import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Activity, Clock, AlertTriangle, CheckCircle, Zap, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { serverManagerAPI } from '@/hooks/useServerManagerAPI';

interface DatabaseMetrics {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  connections: {
    active: number;
    idle: number;
    max: number;
  };
  replication: {
    lag: number;
    status: 'synced' | 'lagging' | 'disconnected';
  };
  storage: {
    used: number;
    total: number;
  };
  uptime: string;
  version: string;
}

interface SlowQuery {
  id: string;
  duration: number;
  calls: number;
  avgTime: number;
  queryPattern: string;
  lastSeen: string;
}

interface DatabaseHealthResponse {
  databases: DatabaseMetrics[];
  slow_queries: SlowQuery[];
}

export function SMDatabaseHealth() {
  const [databases, setDatabases] = useState<DatabaseMetrics[]>([]);
  const [slowQueries, setSlowQueries] = useState<SlowQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadHealth = async () => {
      try {
        const data = await serverManagerAPI.getDatabaseHealth() as DatabaseHealthResponse;
        if (!cancelled) {
          setDatabases(data.databases || []);
          setSlowQueries(data.slow_queries || []);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load database health');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'synced':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'degraded':
      case 'lagging':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'down':
      case 'disconnected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

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
    <div className="space-y-6">
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Lock className="h-4 w-4" />
            <span>Health metrics and query patterns only. Row-level data and PII access remains blocked.</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Database Instances
        </h2>

        <div className="grid gap-4">
          {databases.map((database) => (
            <Card key={database.name} className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{database.name}</CardTitle>
                    <Badge variant="outline" className="text-xs font-mono">
                      {database.version}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(database.status)}>
                    {database.status === 'healthy' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                    {database.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Connections</span>
                      <span>
                        {database.connections.active}/{database.connections.max}
                      </span>
                    </div>
                    <Progress value={(database.connections.active / Math.max(database.connections.max, 1)) * 100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Active: {database.connections.active} | Idle: {database.connections.idle}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Storage</span>
                      <span>
                        {database.storage.used}/{database.storage.total} GB
                      </span>
                    </div>
                    <Progress value={database.storage.total ? (database.storage.used / database.storage.total) * 100 : 0} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {database.storage.total ? ((database.storage.used / database.storage.total) * 100).toFixed(1) : '0.0'}% used
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Replication</span>
                      <Badge className={getStatusColor(database.replication.status)} variant="outline">
                        {database.replication.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Lag: {database.replication.lag.toFixed(1)}s</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Uptime</span>
                    </div>
                    <div className="text-sm font-medium">{database.uptime}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!databases.length && (
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-sm text-center text-muted-foreground">
                No managed database instances found.
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Slow Query Patterns
          </h2>
          <Badge variant="outline" className="text-xs">
            Metadata Only • No Actual Queries
          </Badge>
        </div>

        <div className="space-y-3">
          {slowQueries.map((query) => (
            <Card key={query.id} className="bg-card border-border">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{query.queryPattern}</span>
                  <Badge variant="outline">{query.duration}ms</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                  <span>Calls: {query.calls}</span>
                  <span>Avg: {query.avgTime}ms</span>
                  <span>Last seen: {query.lastSeen}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {!slowQueries.length && (
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-sm text-center text-muted-foreground">
                No slow query pressure detected in the latest telemetry.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}