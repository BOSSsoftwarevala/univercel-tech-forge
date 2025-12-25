import React from 'react';
import { Bell, AlertTriangle, Shield, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AMAlerts: React.FC = () => {
  const alerts = [
    { id: 'ALT-001', type: 'SLA Breach', message: 'Ticket T-001 exceeded response time', severity: 'high', time: '5 min ago' },
    { id: 'ALT-002', type: 'Fraud Detection', message: 'Suspicious activity on Reseller R-005', severity: 'critical', time: '15 min ago' },
    { id: 'ALT-003', type: 'Performance Drop', message: 'Franchise F-002 conversion rate below threshold', severity: 'medium', time: '1 hour ago' },
    { id: 'ALT-004', type: 'System Alert', message: 'High server load in region', severity: 'low', time: '2 hours ago' },
    { id: 'ALT-005', type: 'Compliance', message: 'KYC verification pending for 5 users', severity: 'medium', time: '3 hours ago' },
  ];

  const riskSummary = [
    { label: 'Critical Alerts', value: 1, color: 'text-red-400', bg: 'bg-red-500/20' },
    { label: 'High Priority', value: 3, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { label: 'Medium Priority', value: 5, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { label: 'Low Priority', value: 8, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Risk & Alerts</h2>
        <p className="text-muted-foreground">Active alerts and risk monitoring</p>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-4 gap-4">
        {riskSummary.map((item, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${item.bg}`}>
                  <AlertTriangle className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Alerts */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-400" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                alert.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-muted/30 border-border/30'
              }`}>
                <div className="flex items-center gap-4">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-red-400' :
                    alert.severity === 'high' ? 'text-orange-400' :
                    alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{alert.type}</p>
                      <Badge variant={
                        alert.severity === 'critical' ? 'destructive' :
                        alert.severity === 'high' ? 'default' : 'secondary'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{alert.time}</span>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  {(alert.severity === 'critical' || alert.severity === 'high') && (
                    <Button size="sm" variant="destructive">
                      Escalate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMAlerts;
