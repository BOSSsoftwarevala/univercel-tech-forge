/**
 * Server Status Monitor - Real-time status without technical details
 * Shows only: Status, Performance (simple), AI Actions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, AlertTriangle, RefreshCw, Zap, Shield } from 'lucide-react';

interface StatusEvent {
  id: string;
  time: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'ai_action';
}

const ServerStatusMonitor: React.FC = () => {
  const [events, setEvents] = useState<StatusEvent[]>([
    { id: '1', time: '2 min ago', message: 'AI optimized resource allocation for Demo Server Alpha', type: 'ai_action' },
    { id: '2', time: '5 min ago', message: 'All systems operating normally', type: 'success' },
    { id: '3', time: '12 min ago', message: 'Auto-scaled Build Server Beta due to increased load', type: 'ai_action' },
    { id: '4', time: '1 hour ago', message: 'Scheduled maintenance completed successfully', type: 'success' },
    { id: '5', time: '2 hours ago', message: 'Payment reminder: Staging Epsilon due in 5 days', type: 'warning' },
  ]);

  const serverHealth = [
    { name: 'Demo Server Alpha', health: 98, status: 'optimal' },
    { name: 'Build Server Beta', health: 95, status: 'optimal' },
    { name: 'Production Delta', health: 99, status: 'optimal' },
    { name: 'Test Server Gamma', health: 0, status: 'stopped' },
    { name: 'Staging Epsilon', health: 0, status: 'payment_required' },
  ];

  const aiActions = {
    today: 12,
    thisWeek: 67,
    optimizations: 'Auto-scaling, Resource balancing, Idle shutdown',
  };

  const getEventIcon = (type: StatusEvent['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'ai_action':
        return <Zap className="h-4 w-4 text-primary" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'bg-emerald-500';
    if (health >= 80) return 'bg-amber-500';
    if (health > 0) return 'bg-destructive';
    return 'bg-muted';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Health Overview */}
      <Card className="lg:col-span-2 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Server Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {serverHealth.map((server, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{server.name}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      server.status === 'optimal' ? 'text-emerald-500 border-emerald-500/30' :
                      server.status === 'stopped' ? 'text-slate-400 border-slate-500/30' :
                      'text-amber-500 border-amber-500/30'
                    }
                  >
                    {server.status === 'optimal' ? 'Optimal' : 
                     server.status === 'stopped' ? 'Stopped' : 'Payment Required'}
                  </Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getHealthColor(server.health)}`}
                    style={{ width: `${server.health}%` }}
                  />
                </div>
              </div>
              <span className="text-lg font-bold text-foreground w-12 text-right">
                {server.health > 0 ? `${server.health}%` : '-'}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Actions Summary */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-primary">{aiActions.today}</div>
              <div className="text-xs text-muted-foreground">Actions Today</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-primary">{aiActions.thisWeek}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background/50">
            <div className="text-xs text-muted-foreground mb-1">Active Optimizations</div>
            <div className="text-sm text-foreground">{aiActions.optimizations}</div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            All actions logged & auditable
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card className="lg:col-span-3 bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">Auto-updating</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                {getEventIcon(event.type)}
                <span className="flex-1 text-sm text-foreground">{event.message}</span>
                <span className="text-xs text-muted-foreground">{event.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerStatusMonitor;
