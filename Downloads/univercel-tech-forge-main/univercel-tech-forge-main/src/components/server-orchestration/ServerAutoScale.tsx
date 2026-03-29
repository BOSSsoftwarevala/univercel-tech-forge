/**
 * Server Auto Scale - Shows AI-managed scaling without technical details
 * User sees only high-level performance and cost impact
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap, Clock, DollarSign, Activity } from 'lucide-react';

const ServerAutoScale: React.FC = () => {
  const scalingEvents = [
    { server: 'Build Server Beta', action: 'Scaled Up', reason: 'High traffic detected', time: '15 min ago', impact: '+$0.80/hr' },
    { server: 'Demo Server Alpha', action: 'Scaled Down', reason: 'Low activity period', time: '2 hours ago', impact: '-$0.50/hr' },
    { server: 'Production Delta', action: 'Maintained', reason: 'Optimal load', time: '3 hours ago', impact: '$0' },
  ];

  const schedules = [
    { name: 'Night Mode', description: 'Reduce resources during low-traffic hours', status: 'active', savings: '$12/day' },
    { name: 'Weekend Scale', description: 'Adjust capacity for weekend patterns', status: 'active', savings: '$8/day' },
    { name: 'Idle Shutdown', description: 'Stop unused servers after 4 hours', status: 'active', savings: '$15/day' },
  ];

  const performanceMetrics = [
    { label: 'Response Time', value: '45ms', trend: 'stable', status: 'optimal' },
    { label: 'Uptime', value: '99.98%', trend: 'stable', status: 'optimal' },
    { label: 'Load Balance', value: 'Even', trend: 'stable', status: 'optimal' },
    { label: 'Cost Efficiency', value: '92%', trend: 'up', status: 'optimal' },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="text-xs text-muted-foreground mb-2">{metric.label}</div>
              <Badge 
                variant="outline" 
                className={metric.status === 'optimal' ? 'text-emerald-500 border-emerald-500/30' : 'text-amber-500 border-amber-500/30'}
              >
                {metric.status === 'optimal' ? '✓ Optimal' : 'Attention'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto Scaling Events */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Scaling Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scalingEvents.map((event, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  {event.action === 'Scaled Up' && <TrendingUp className="h-4 w-4 text-amber-500" />}
                  {event.action === 'Scaled Down' && <TrendingDown className="h-4 w-4 text-emerald-500" />}
                  {event.action === 'Maintained' && <Zap className="h-4 w-4 text-primary" />}
                  <div>
                    <div className="text-sm font-medium text-foreground">{event.server}</div>
                    <div className="text-xs text-muted-foreground">{event.reason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={
                      event.action === 'Scaled Up' ? 'text-amber-500 border-amber-500/30' :
                      event.action === 'Scaled Down' ? 'text-emerald-500 border-emerald-500/30' :
                      'text-primary border-primary/30'
                    }
                  >
                    {event.action}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">{event.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Schedules */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              AI Cost Optimization Schedules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedules.map((schedule, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{schedule.name}</div>
                  <div className="text-xs text-muted-foreground">{schedule.description}</div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                    {schedule.status}
                  </Badge>
                  <div className="text-xs text-emerald-500 mt-1 flex items-center gap-1 justify-end">
                    <DollarSign className="h-3 w-3" />
                    Saves {schedule.savings}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Info Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <div>
              <div className="font-medium text-foreground">Fully Automated Scaling</div>
              <div className="text-sm text-muted-foreground">
                AI continuously monitors load, traffic patterns, and usage to optimize performance and minimize costs. 
                No manual configuration required.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerAutoScale;
