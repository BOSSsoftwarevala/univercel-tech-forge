import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, AlertTriangle, RefreshCcw, Eye, BarChart3, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PerformanceAlert {
  id: string;
  valaId: string;
  alertType: 'declining' | 'refund_linked' | 'low_quality' | 'spike';
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const mockAlerts: PerformanceAlert[] = [
  { id: '1', valaId: 'VL-7382916', alertType: 'declining', metric: 'Conversion Rate', currentValue: 1.2, previousValue: 2.5, change: -52, timestamp: '2 hours ago', severity: 'high' },
  { id: '2', valaId: 'VL-4827163', alertType: 'refund_linked', metric: 'Refund-linked Traffic', currentValue: 23, previousValue: 8, change: 187, timestamp: '4 hours ago', severity: 'high' },
  { id: '3', valaId: 'VL-2918374', alertType: 'low_quality', metric: 'Lead Quality Score', currentValue: 45, previousValue: 72, change: -37, timestamp: '6 hours ago', severity: 'medium' },
  { id: '4', valaId: 'VL-9173628', alertType: 'spike', metric: 'Click Volume', currentValue: 8500, previousValue: 2100, change: 304, timestamp: '1 day ago', severity: 'medium' },
];

const qualityMetrics = [
  { label: 'Avg. Lead Quality', value: 72, target: 80, status: 'warning' },
  { label: 'Valid Click Rate', value: 94.5, target: 95, status: 'ok' },
  { label: 'Conversion Rate', value: 2.3, target: 2.5, status: 'warning' },
  { label: 'Refund Rate', value: 3.2, target: 5, status: 'ok' },
];

export function IMPerformanceAlerts() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'refund_linked': return <RefreshCcw className="w-4 h-4 text-amber-400" />;
      case 'spike': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Performance & Quality Alerts</h2>
          <p className="text-sm text-muted-foreground">Monitor influencer performance • READ-ONLY metrics</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Manual Edit BLOCKED
        </Badge>
      </div>

      {/* Quality Overview - READ ONLY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {qualityMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <Eye className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}{metric.label.includes('Rate') ? '%' : ''}
                </div>
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-1 mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {metric.target}{metric.label.includes('Rate') ? '%' : ''}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Alerts */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Active Performance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getAlertIcon(alert.alertType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-foreground">{alert.valaId}</span>
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.metric}: {alert.previousValue} → {alert.currentValue}
                    <span className={`ml-2 ${alert.change > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      ({alert.change > 0 ? '+' : ''}{alert.change}%)
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                <Badge variant="outline" className="mt-1">
                  {alert.alertType.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Refund-Linked Traffic Warning */}
      <Card className="bg-red-500/5 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-400">
            <RefreshCcw className="w-5 h-5" />
            Refund-Linked Traffic Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-400">47</p>
              <p className="text-xs text-muted-foreground">Refund-linked clicks today</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">3</p>
              <p className="text-xs text-muted-foreground">Influencers flagged</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">₹12,450</p>
              <p className="text-xs text-muted-foreground">Potential fraud value</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <Eye className="w-3 h-3" /> This data is READ-ONLY. Manual stat editing is BLOCKED.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
