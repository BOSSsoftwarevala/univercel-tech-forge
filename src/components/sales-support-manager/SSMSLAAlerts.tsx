import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Timer,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

type AlertType = 'sla_warning' | 'sla_breach' | 'no_response' | 'escalation_pending';

interface SLAAlert {
  id: string;
  type: AlertType;
  entityType: 'lead' | 'ticket';
  entityId: string;
  entityName: string;
  owner: string;
  severity: 'critical' | 'high' | 'medium';
  timeRemaining?: number;
  message: string;
  createdAt: string;
  autoEscalateAt?: string;
}

const mockAlerts: SLAAlert[] = [
  {
    id: '1',
    type: 'sla_breach',
    entityType: 'ticket',
    entityId: 'TKT-2024-8901',
    entityName: 'Payment gateway integration failing',
    owner: 'VL-SA-001',
    severity: 'critical',
    message: 'SLA breached - Critical ticket unresolved for 4+ hours',
    createdAt: '2024-01-15T10:05:00Z',
    autoEscalateAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'sla_warning',
    entityType: 'lead',
    entityId: 'LD-2024-4521',
    entityName: 'Rajesh Kumar - Initial Contact',
    owner: 'VL-SE-002',
    severity: 'high',
    timeRemaining: 45,
    message: 'SLA at risk - 45 minutes remaining for initial contact',
    createdAt: '2024-01-15T09:45:00Z'
  },
  {
    id: '3',
    type: 'no_response',
    entityType: 'ticket',
    entityId: 'TKT-2024-8905',
    entityName: 'API rate limit questions',
    owner: 'VL-SA-002',
    severity: 'medium',
    message: 'No response in 2 hours - Customer waiting',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '4',
    type: 'escalation_pending',
    entityType: 'lead',
    entityId: 'LD-2024-4515',
    entityName: 'Enterprise deal - Metro Industries',
    owner: 'VL-SE-001',
    severity: 'high',
    message: 'Lead stuck in Qualified stage for 7 days',
    createdAt: '2024-01-15T07:00:00Z'
  }
];

export const SSMSLAAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SLAAlert[]>(mockAlerts);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Alert acknowledged and logged');
  };

  const handleEscalate = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Escalated to Pro Manager');
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'sla_breach':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'sla_warning':
        return <Timer className="h-4 w-4 text-yellow-500" />;
      case 'no_response':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'escalation_pending':
        return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-500/5';
      case 'high':
        return 'border-orange-500 bg-orange-500/5';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/5';
      default:
        return 'border-border bg-background';
    }
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const breachCount = alerts.filter(a => a.type === 'sla_breach').length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="h-5 w-5 text-yellow-500" />
            SLA & Response Alerts
          </CardTitle>
          <div className="flex items-center gap-2">
            {breachCount > 0 && (
              <Badge className="bg-red-500 text-white animate-pulse">
                {breachCount} BREACHED
              </Badge>
            )}
            {criticalCount > 0 && (
              <Badge className="bg-red-500/10 text-red-500 border-red-500/30">
                {criticalCount} Critical
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Server-based timers • Near-breach alerts • Auto-escalation on breach
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background rounded-lg">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={
                        alert.severity === 'critical' ? 'bg-red-500 text-white' :
                        alert.severity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="font-mono text-sm text-primary">{alert.entityId}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.entityType}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-foreground">{alert.entityName}</h4>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                {alert.timeRemaining && (
                  <Badge className="bg-yellow-500/10 text-yellow-500 font-mono">
                    <Timer className="h-3 w-3 mr-1" />
                    {alert.timeRemaining}m left
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
                  Owner: {alert.owner} • Triggered: {new Date(alert.createdAt).toLocaleTimeString()}
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                  {alert.severity === 'critical' && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleEscalate(alert.id)}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Escalate
                    </Button>
                  )}
                </div>
              </div>

              {alert.autoEscalateAt && (
                <div className="mt-2 p-2 bg-red-500/10 rounded text-xs text-red-500">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Auto-escalation scheduled at {new Date(alert.autoEscalateAt).toLocaleTimeString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No active SLA alerts</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted/30 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>SLA Enforcement:</strong> Timers are server-controlled and cannot be modified.
            Breached SLAs automatically escalate to Pro Manager.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
