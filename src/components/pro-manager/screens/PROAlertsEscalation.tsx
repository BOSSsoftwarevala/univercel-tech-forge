/**
 * ALERTS & ESCALATION
 * SLA Breach Alert • Payment Alert • Security Alert
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Timer, Wallet, Shield } from 'lucide-react';

const mockAlerts = [
  { id: 'ALT-001', type: 'sla', message: 'SLA breach for PRO-***21 - Response time exceeded', severity: 'high', time: '5 min ago' },
  { id: 'ALT-002', type: 'payment', message: 'Payment failed for PRO-***45 - Card declined', severity: 'medium', time: '1 hour ago' },
  { id: 'ALT-003', type: 'security', message: 'Suspicious login attempt for PRO-***78', severity: 'critical', time: '2 hours ago' },
  { id: 'ALT-004', type: 'sla', message: 'Promise deadline approaching for PRO-***92', severity: 'low', time: '3 hours ago' },
];

export const PROAlertsEscalation: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sla': return <Timer className="h-5 w-5 text-amber-500" />;
      case 'payment': return <Wallet className="h-5 w-5 text-red-500" />;
      case 'security': return <Shield className="h-5 w-5 text-purple-500" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge className="bg-red-500/20 text-red-500">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500/20 text-orange-500">High</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-500">Medium</Badge>;
      case 'low': return <Badge className="bg-blue-500/20 text-blue-500">Low</Badge>;
      default: return <Badge>{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alerts & Escalation</h1>
        <p className="text-muted-foreground">Monitor critical alerts and escalations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Timer className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-xs text-muted-foreground">SLA Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Wallet className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-xs text-muted-foreground">Payment Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-xs text-muted-foreground">Security Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                {getTypeIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-foreground">{alert.id}</span>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm text-foreground mt-1">{alert.message}</p>
                </div>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PROAlertsEscalation;
