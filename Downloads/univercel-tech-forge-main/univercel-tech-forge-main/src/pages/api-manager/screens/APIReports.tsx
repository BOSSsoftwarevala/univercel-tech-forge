import React from 'react';
import { BarChart3, Lock, DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const APIReports: React.FC = () => {
  const dailyUsage = [
    { date: 'Mon', requests: 245000, cost: 125 },
    { date: 'Tue', requests: 312000, cost: 156 },
    { date: 'Wed', requests: 298000, cost: 148 },
    { date: 'Thu', requests: 356000, cost: 178 },
    { date: 'Fri', requests: 289000, cost: 144 },
    { date: 'Sat', requests: 156000, cost: 78 },
    { date: 'Sun', requests: 134000, cost: 67 },
  ];

  const costBreakdown = [
    { service: 'AI Models (GPT-4)', cost: 456, percentage: 45 },
    { service: 'Payment Processing', cost: 234, percentage: 23 },
    { service: 'SMS/Messaging', cost: 156, percentage: 15 },
    { service: 'Email Service', cost: 89, percentage: 9 },
    { service: 'Other APIs', cost: 78, percentage: 8 },
  ];

  const failureAnalysis = [
    { type: 'Timeout Errors', count: 45, trend: 'down', change: '-12%' },
    { type: 'Rate Limit Hits', count: 89, trend: 'up', change: '+8%' },
    { type: 'Auth Failures', count: 23, trend: 'down', change: '-25%' },
    { type: 'Server Errors', count: 12, trend: 'stable', change: '0%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Reports</h2>
        <p className="text-muted-foreground">Usage analytics and cost summaries</p>
      </div>

      {/* Security Notice */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Export Disabled</p>
              <p className="text-sm text-muted-foreground">
                Report export and copy features are disabled for security. View-only access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Usage */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Daily Usage (This Week)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {dailyUsage.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-500/50 rounded-t"
                  style={{ height: `${(day.requests / 400000) * 150}px` }}
                />
                <span className="text-xs text-muted-foreground">{day.date}</span>
                <span className="text-xs text-green-400 font-mono">${day.cost}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-border/30">
            <span className="text-muted-foreground">Total Requests: <span className="text-blue-400 font-mono">1.79M</span></span>
            <span className="text-muted-foreground">Total Cost: <span className="text-green-400 font-mono">$896</span></span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {costBreakdown.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">{item.service}</span>
                    <span className="font-mono text-green-400">${item.cost}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Failure Analysis */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Failure Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failureAnalysis.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-foreground">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.count} occurrences</p>
                  </div>
                  <Badge variant={
                    item.trend === 'down' ? 'default' :
                    item.trend === 'up' ? 'destructive' : 'secondary'
                  }>
                    {item.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIReports;
