/**
 * AI ALERTS PANEL
 * Shows AI system alerts and errors
 */

import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const alerts = [
  { id: 'ALT-001', type: 'critical', message: 'High latency detected on image generation endpoint', time: '12 mins ago', resolved: false },
  { id: 'ALT-002', type: 'warning', message: 'Credit threshold 80% reached', time: '2 hours ago', resolved: false },
  { id: 'ALT-003', type: 'info', message: 'New model deployment scheduled for maintenance window', time: '4 hours ago', resolved: false },
  { id: 'ALT-004', type: 'critical', message: 'Rate limit exceeded for gpt-5 model', time: '6 hours ago', resolved: true },
  { id: 'ALT-005', type: 'warning', message: 'Unusual spike in API requests detected', time: '1 day ago', resolved: true },
];

export const AIAlertsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          AI Alerts
        </h1>
        <p className="text-sm text-muted-foreground mt-1">System alerts and notifications</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-500">1</p>
            <p className="text-xs text-red-500/70">Critical</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-500">1</p>
            <p className="text-xs text-amber-500/70">Warnings</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Info className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-500">1</p>
            <p className="text-xs text-blue-500/70">Info</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-500">2</p>
            <p className="text-xs text-emerald-500/70">Resolved</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">All Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg ${alert.resolved ? 'bg-muted/20' : 'bg-muted/30'} flex items-start justify-between gap-4`}>
              <div className="flex items-start gap-3">
                {alert.type === 'critical' && <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />}
                {alert.type === 'info' && <Info className="w-5 h-5 text-blue-500 mt-0.5" />}
                <div>
                  <p className={`text-sm ${alert.resolved ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.id} • {alert.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {alert.resolved ? (
                  <Badge className="bg-emerald-500/20 text-emerald-500">Resolved</Badge>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Acknowledge</Button>
                    <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90">Resolve</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
