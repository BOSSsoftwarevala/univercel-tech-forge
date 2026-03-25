import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Shield,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ManagerMetric {
  managerId: string;
  role: 'task_manager' | 'dev_manager' | 'lead_manager';
  slaCompliance: number;
  escalationsHandled: number;
  escalationsPending: number;
  avgResolutionTime: string;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'critical';
}

const mockManagers: ManagerMetric[] = [
  {
    managerId: 'TM-7823',
    role: 'task_manager',
    slaCompliance: 94,
    escalationsHandled: 23,
    escalationsPending: 2,
    avgResolutionTime: '2.4h',
    trend: 'up',
    status: 'healthy'
  },
  {
    managerId: 'DM-3421',
    role: 'dev_manager',
    slaCompliance: 87,
    escalationsHandled: 18,
    escalationsPending: 5,
    avgResolutionTime: '3.8h',
    trend: 'down',
    status: 'warning'
  },
  {
    managerId: 'LM-5432',
    role: 'lead_manager',
    slaCompliance: 91,
    escalationsHandled: 12,
    escalationsPending: 1,
    avgResolutionTime: '1.9h',
    trend: 'stable',
    status: 'healthy'
  },
  {
    managerId: 'TM-8912',
    role: 'task_manager',
    slaCompliance: 78,
    escalationsHandled: 15,
    escalationsPending: 8,
    avgResolutionTime: '5.2h',
    trend: 'down',
    status: 'critical'
  }
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'task_manager':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Task Manager</Badge>;
    case 'dev_manager':
      return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Dev Manager</Badge>;
    case 'lead_manager':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Lead Manager</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
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
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Target className="h-4 w-4 text-muted-foreground" />;
  }
};

const getComplianceColor = (value: number) => {
  if (value >= 90) return 'bg-green-500';
  if (value >= 80) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const PMManagerSnapshot: React.FC = () => {
  const avgCompliance = Math.round(
    mockManagers.reduce((acc, m) => acc + m.slaCompliance, 0) / mockManagers.length
  );
  const totalPending = mockManagers.reduce((acc, m) => acc + m.escalationsPending, 0);
  const criticalCount = mockManagers.filter(m => m.status === 'critical').length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Manager Performance Snapshot
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            View Only • No Manual Scoring
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{avgCompliance}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Avg SLA Compliance</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-400">{totalPending}</span>
            </div>
            <p className="text-xs text-muted-foreground">Pending Escalations</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold text-red-400">{criticalCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Critical Status</p>
          </div>
        </div>

        {/* Manager List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {mockManagers.map((manager, index) => (
            <motion.div
              key={manager.managerId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-3 ${
                manager.status === 'critical'
                  ? 'bg-red-500/5 border-red-500/30'
                  : manager.status === 'warning'
                  ? 'bg-yellow-500/5 border-yellow-500/30'
                  : 'bg-muted/30 border-border/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-bold text-sm">{manager.managerId}</span>
                  {getRoleBadge(manager.role)}
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(manager.trend)}
                  {getStatusBadge(manager.status)}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">SLA Compliance</span>
                    <span className="font-medium">{manager.slaCompliance}%</span>
                  </div>
                  <Progress 
                    value={manager.slaCompliance} 
                    className="h-1.5"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-muted-foreground">Handled</p>
                    <p className="font-medium flex items-center justify-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {manager.escalationsHandled}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Pending</p>
                    <p className="font-medium flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3 text-yellow-500" />
                      {manager.escalationsPending}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Avg Time</p>
                    <p className="font-medium">{manager.avgResolutionTime}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            Read-only metrics • No manual scoring • No HR actions
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
