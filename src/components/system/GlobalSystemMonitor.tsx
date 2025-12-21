import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Activity, 
  Server, 
  Database, 
  Cloud, 
  Wifi, 
  Shield,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Globe,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  lastIncident?: string;
  region: string;
}

const GlobalSystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: 45, max: 100, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Memory', value: 12.4, max: 32, unit: 'GB', status: 'healthy', trend: 'up' },
    { name: 'Storage', value: 456, max: 1000, unit: 'GB', status: 'healthy', trend: 'up' },
    { name: 'Network I/O', value: 234, max: 1000, unit: 'Mbps', status: 'healthy', trend: 'stable' },
    { name: 'API Latency', value: 45, max: 200, unit: 'ms', status: 'healthy', trend: 'down' },
    { name: 'Error Rate', value: 0.02, max: 5, unit: '%', status: 'healthy', trend: 'stable' }
  ]);

  const [services] = useState<ServiceStatus[]>([
    { name: 'API Gateway', status: 'operational', uptime: 99.99, region: 'Global' },
    { name: 'Database Cluster', status: 'operational', uptime: 99.97, region: 'Multi-Region' },
    { name: 'Authentication', status: 'operational', uptime: 99.99, region: 'Global' },
    { name: 'File Storage', status: 'operational', uptime: 99.95, region: 'CDN' },
    { name: 'Real-time Engine', status: 'operational', uptime: 99.98, region: 'Edge' },
    { name: 'AI Processing', status: 'degraded', uptime: 99.89, lastIncident: '2 hours ago', region: 'US-West' },
    { name: 'Email Service', status: 'operational', uptime: 99.92, region: 'Global' },
    { name: 'Payment Gateway', status: 'operational', uptime: 99.99, region: 'Global' }
  ]);

  const [autoScaling, setAutoScaling] = useState(true);
  const [disasterRecovery, setDisasterRecovery] = useState(true);
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(metric.max, metric.value + (Math.random() - 0.5) * (metric.max * 0.05)))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'outage': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
    }
  };

  const getMetricColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Global System Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time infrastructure monitoring and automation (Features 581-600)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            Live Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-yellow-400" />
                <div>
                  <h4 className="font-semibold">Auto-Orchestrated Scaling</h4>
                  <p className="text-xs text-muted-foreground">Automatic resource allocation</p>
                </div>
              </div>
              <Switch checked={autoScaling} onCheckedChange={setAutoScaling} />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-400" />
                <div>
                  <h4 className="font-semibold">Disaster Recovery</h4>
                  <p className="text-xs text-muted-foreground">Hyper backup & restore ready</p>
                </div>
              </div>
              <Switch checked={disasterRecovery} onCheckedChange={setDisasterRecovery} />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-blue-400" />
                <div>
                  <h4 className="font-semibold">Ultra-Low Bandwidth Mode</h4>
                  <p className="text-xs text-muted-foreground">2G+ network optimization</p>
                </div>
              </div>
              <Switch checked={lowBandwidthMode} onCheckedChange={setLowBandwidthMode} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="backdrop-blur-xl bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{metric.name}</span>
                  <Badge variant="outline" className={getMetricColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className={`text-3xl font-bold ${getMetricColor(metric.status)}`}>
                    {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {metric.max} {metric.unit}
                  </span>
                </div>
                <Progress 
                  value={(metric.value / metric.max) * 100} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Service Status */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Service Status
              </CardTitle>
              <CardDescription>
                Real-time status of all system services
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs">Operational</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-xs">Degraded</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs">Outage</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border ${service.status === 'operational' ? 'border-green-500/30' : service.status === 'degraded' ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                      <h4 className="font-semibold text-sm">{service.name}</h4>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="text-green-400">{service.uptime}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Region</span>
                        <span>{service.region}</span>
                      </div>
                      {service.lastIncident && (
                        <div className="flex justify-between text-yellow-400">
                          <span>Last Incident</span>
                          <span>{service.lastIncident}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Cloud className="h-5 w-5" />, label: 'Federated Cloud Sync', status: 'Active', color: 'text-blue-400' },
          { icon: <Database className="h-5 w-5" />, label: 'Runtime Schema Migration', status: 'Ready', color: 'text-purple-400' },
          { icon: <Lock className="h-5 w-5" />, label: 'Deadlock Recovery', status: 'Monitoring', color: 'text-green-400' },
          { icon: <Clock className="h-5 w-5" />, label: 'Nanosecond Log Indexing', status: 'Active', color: 'text-orange-400' }
        ].map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted/30 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{feature.label}</h4>
                      <Badge variant="outline" className={feature.color}>
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GlobalSystemMonitor;
