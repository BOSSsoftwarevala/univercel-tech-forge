// ==============================================
// Admin System Overview
// Non-Technical View - Operations Focus
// ==============================================

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, Users, FileCheck, AlertTriangle,
  CheckCircle, Clock, TrendingUp, Shield
} from 'lucide-react';

interface SystemMetric {
  label: string;
  value: number;
  max: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface OperationSummary {
  pendingApprovals: number;
  activeOperations: number;
  escalations: number;
  complianceAlerts: number;
}

export function AdminSystemOverview() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [summary, setSummary] = useState<OperationSummary>({
    pendingApprovals: 0,
    activeOperations: 0,
    escalations: 0,
    complianceAlerts: 0,
  });

  useEffect(() => {
    // Simulated non-technical metrics
    setMetrics([
      { label: 'System Health', value: 94, max: 100, status: 'healthy', trend: 'stable' },
      { label: 'User Activity', value: 78, max: 100, status: 'healthy', trend: 'up' },
      { label: 'Operations Completed', value: 156, max: 200, status: 'healthy', trend: 'up' },
      { label: 'Compliance Score', value: 98, max: 100, status: 'healthy', trend: 'stable' },
    ]);

    setSummary({
      pendingApprovals: 12,
      activeOperations: 8,
      escalations: 3,
      complianceAlerts: 2,
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{summary.pendingApprovals}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <FileCheck className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Operations</p>
                <p className="text-2xl font-bold">{summary.activeOperations}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Escalations</p>
                <p className="text-2xl font-bold">{summary.escalations}</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/20">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Alerts</p>
                <p className="text-2xl font-bold">{summary.complianceAlerts}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/20">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map(metric => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status === 'healthy' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {metric.status.toUpperCase()}
                    </Badge>
                    {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400" />}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={(metric.value / metric.max) * 100} className="flex-1 h-2" />
                  <span className="text-sm font-mono w-12 text-right">
                    {metric.value}{metric.max === 100 ? '%' : `/${metric.max}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-xs text-muted-foreground">Active Users Today</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold">98.5%</p>
            <p className="text-xs text-muted-foreground">Uptime This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">2.3s</p>
            <p className="text-xs text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
