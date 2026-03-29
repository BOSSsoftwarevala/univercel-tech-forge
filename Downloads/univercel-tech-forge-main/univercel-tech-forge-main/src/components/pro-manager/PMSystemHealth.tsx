import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, AlertTriangle, XCircle, TrendingUp, Users, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

const mockMetrics: HealthMetric[] = [
  {
    id: 'HM-001',
    name: 'Promise Fulfillment Rate',
    status: 'healthy',
    value: '94.2%',
    trend: 'up',
    description: 'Overall promise completion across all teams'
  },
  {
    id: 'HM-002',
    name: 'SLA Compliance',
    status: 'warning',
    value: '87.5%',
    trend: 'down',
    description: 'Tasks completed within SLA window'
  },
  {
    id: 'HM-003',
    name: 'Escalation Resolution',
    status: 'healthy',
    value: '91.8%',
    trend: 'stable',
    description: 'Escalations resolved within target time'
  },
  {
    id: 'HM-004',
    name: 'Quality Score',
    status: 'healthy',
    value: '4.6/5.0',
    trend: 'up',
    description: 'Average quality rating across deliverables'
  },
  {
    id: 'HM-005',
    name: 'Active Issues',
    status: 'warning',
    value: '12',
    trend: 'up',
    description: 'Unresolved quality issues pending review'
  },
  {
    id: 'HM-006',
    name: 'Team Utilization',
    status: 'healthy',
    value: '78%',
    trend: 'stable',
    description: 'Average developer workload capacity'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'critical':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Activity className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'healthy':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Healthy</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Warning</Badge>;
    case 'critical':
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
};

export const PMSystemHealth: React.FC = () => {
  const healthyCount = mockMetrics.filter(m => m.status === 'healthy').length;
  const warningCount = mockMetrics.filter(m => m.status === 'warning').length;
  const criticalCount = mockMetrics.filter(m => m.status === 'critical').length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            System Health Overview
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Non-Technical View
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-400">{healthyCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Healthy</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-400">{warningCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Warning</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold text-red-400">{criticalCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
        </div>

        {/* Metrics List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {mockMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-muted/30 border border-border/50 rounded-lg p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(metric.status)}
                  <div>
                    <p className="font-medium text-sm">{metric.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">{metric.value}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(metric.status)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            Read-only view • No technical metrics exposed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
