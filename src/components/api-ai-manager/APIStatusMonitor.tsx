import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Activity, Globe, Zap, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface APIStatus {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  requests24h: number;
  errors24h: number;
  lastCheck: string;
}

const mockAPIs: APIStatus[] = [
  { id: '1', name: 'Authentication API', status: 'healthy', latency: 45, uptime: 99.98, requests24h: 125000, errors24h: 12, lastCheck: '2 min ago' },
  { id: '2', name: 'Payment Gateway', status: 'healthy', latency: 120, uptime: 99.95, requests24h: 45000, errors24h: 5, lastCheck: '1 min ago' },
  { id: '3', name: 'Lead Management API', status: 'healthy', latency: 38, uptime: 99.99, requests24h: 89000, errors24h: 3, lastCheck: '30 sec ago' },
  { id: '4', name: 'Notification Service', status: 'degraded', latency: 450, uptime: 98.5, requests24h: 67000, errors24h: 156, lastCheck: '1 min ago' },
  { id: '5', name: 'Analytics API', status: 'healthy', latency: 85, uptime: 99.92, requests24h: 234000, errors24h: 28, lastCheck: '45 sec ago' },
  { id: '6', name: 'File Storage API', status: 'down', latency: 0, uptime: 95.2, requests24h: 12000, errors24h: 890, lastCheck: '5 min ago' },
];

export function APIStatusMonitor() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default: return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'degraded': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const healthyCount = mockAPIs.filter(a => a.status === 'healthy').length;
  const degradedCount = mockAPIs.filter(a => a.status === 'degraded').length;
  const downCount = mockAPIs.filter(a => a.status === 'down').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Active APIs Status</h2>
          <p className="text-sm text-muted-foreground">Real-time API health monitoring</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400">
            {healthyCount} Healthy
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400">
            {degradedCount} Degraded
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 text-red-400">
            {downCount} Down
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{mockAPIs.length}</div>
            <div className="text-xs text-muted-foreground">Total APIs</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {mockAPIs.reduce((sum, a) => sum + a.requests24h, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Requests (24h)</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {Math.round(mockAPIs.reduce((sum, a) => sum + a.latency, 0) / mockAPIs.length)}ms
            </div>
            <div className="text-xs text-muted-foreground">Avg Latency</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {(mockAPIs.reduce((sum, a) => sum + a.uptime, 0) / mockAPIs.length).toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* API List */}
      <div className="space-y-3">
        {mockAPIs.map((api, index) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-card/50 ${
              api.status === 'down' ? 'border-red-500/30' :
              api.status === 'degraded' ? 'border-amber-500/30' : 'border-border/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {getStatusIcon(api.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{api.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Last check: {api.lastCheck}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">{api.latency}ms</p>
                      <p className="text-xs text-muted-foreground">Latency</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">{api.uptime}%</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">{api.requests24h.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Requests</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${api.errors24h > 100 ? 'text-red-400' : 'text-foreground'}`}>
                        {api.errors24h}
                      </p>
                      <p className="text-xs text-muted-foreground">Errors</p>
                    </div>
                    <Badge variant="outline" className={getStatusBadge(api.status)}>
                      {api.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {api.status !== 'healthy' && (
                  <div className="mt-3 p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {api.status === 'degraded' 
                        ? '⚠️ Performance degraded. Monitoring increased latency and error rates.'
                        : '🔴 Service unavailable. Incident response team notified.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
