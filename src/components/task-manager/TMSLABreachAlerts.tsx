import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface SLAAlert {
  id: string;
  taskId: string;
  title: string;
  assignee: string;
  slaHours: number;
  hoursRemaining: number;
  status: 'near_breach' | 'breached';
  priority: string;
  autoEscalated: boolean;
}

const mockSLAAlerts: SLAAlert[] = [
  { id: 'SLA-001', taskId: 'TSK-301', title: 'Critical payment gateway fix', assignee: 'DEV-Q7R8', slaHours: 4, hoursRemaining: 1, status: 'near_breach', priority: 'critical', autoEscalated: false },
  { id: 'SLA-002', taskId: 'TSK-302', title: 'User authentication bypass', assignee: 'DEV-S9T0', slaHours: 2, hoursRemaining: -2, status: 'breached', priority: 'critical', autoEscalated: true },
  { id: 'SLA-003', taskId: 'TSK-303', title: 'Dashboard performance optimization', assignee: 'DEV-U1V2', slaHours: 24, hoursRemaining: 3, status: 'near_breach', priority: 'high', autoEscalated: false },
];

const TMSLABreachAlerts: React.FC = () => {
  const nearBreachCount = mockSLAAlerts.filter(a => a.status === 'near_breach').length;
  const breachedCount = mockSLAAlerts.filter(a => a.status === 'breached').length;

  const handleEscalate = (alert: SLAAlert) => {
    console.log('[TASK_MANAGER] SLA escalation:', {
      timestamp: new Date().toISOString(),
      action: 'sla_escalated',
      alertId: alert.id,
      taskId: alert.taskId,
      status: alert.status,
      hoursRemaining: alert.hoursRemaining
    });

    toast.success('SLA breach escalated to management');
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            SLA Alerts
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-400">
              Near Breach: {nearBreachCount}
            </Badge>
            <Badge variant="destructive">
              Breached: {breachedCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockSLAAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                alert.status === 'breached'
                  ? 'bg-red-500/10 border-red-500/50'
                  : 'bg-yellow-500/10 border-yellow-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-sm text-muted-foreground">{alert.taskId}</span>
                    <Badge className={
                      alert.status === 'breached'
                        ? 'bg-red-500/30 text-red-300'
                        : 'bg-yellow-500/30 text-yellow-300'
                    }>
                      {alert.status === 'breached' ? 'BREACHED' : 'Near Breach'}
                    </Badge>
                    <Badge className="bg-red-500/20 text-red-400">
                      {alert.priority}
                    </Badge>
                    {alert.autoEscalated && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Auto-Escalated
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium mb-2">{alert.title}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Assignee: {alert.assignee}</span>
                    <span className={`flex items-center gap-1 font-medium ${
                      alert.hoursRemaining < 0 ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      <Clock className="h-3 w-3" />
                      {alert.hoursRemaining < 0 
                        ? `${Math.abs(alert.hoursRemaining)}h overdue`
                        : `${alert.hoursRemaining}h remaining`
                      }
                    </span>
                  </div>
                </div>
                {!alert.autoEscalated && (
                  <Button 
                    size="sm" 
                    variant={alert.status === 'breached' ? 'destructive' : 'outline'}
                    onClick={() => handleEscalate(alert)}
                    className="gap-1"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    Escalate
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
          {mockSLAAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No SLA alerts
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TMSLABreachAlerts;
