import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Database, Users, Globe, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: typeof Activity;
}

const SALiveSystemStatus = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { id: '1', name: 'Active Users', value: 12847, unit: '', status: 'healthy', trend: 'up', icon: Users },
    { id: '2', name: 'API Response', value: 142, unit: 'ms', status: 'healthy', trend: 'stable', icon: Zap },
    { id: '3', name: 'Server Load', value: 67, unit: '%', status: 'warning', trend: 'up', icon: Server },
    { id: '4', name: 'Database', value: 99.9, unit: '%', status: 'healthy', trend: 'stable', icon: Database },
    { id: '5', name: 'CDN Status', value: 100, unit: '%', status: 'healthy', trend: 'stable', icon: Globe },
    { id: '6', name: 'Queue Depth', value: 234, unit: '', status: 'healthy', trend: 'down', icon: Activity },
  ]);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.name === 'Active Users' 
          ? metric.value + Math.floor(Math.random() * 20) - 10
          : metric.value
      })));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />;
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Live System Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 rounded-lg bg-background/50 border border-border/30"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-4 h-4 text-muted-foreground" />
                <Badge variant="outline" className={`text-[10px] px-1.5 ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </Badge>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold">
                  {typeof metric.value === 'number' && metric.value > 1000 
                    ? `${(metric.value / 1000).toFixed(1)}K`
                    : metric.value}
                </span>
                <span className="text-xs text-muted-foreground mb-1">{metric.unit}</span>
                <TrendIcon trend={metric.trend} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.name}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SALiveSystemStatus;
