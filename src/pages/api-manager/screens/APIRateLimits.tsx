import React from 'react';
import { Activity, AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const APIRateLimits: React.FC = () => {
  const globalLimits = [
    { name: 'Total API Requests', current: 85000, limit: 100000, unit: '/hour' },
    { name: 'AI Model Calls', current: 450, limit: 500, unit: '/min' },
    { name: 'Database Operations', current: 12000, limit: 50000, unit: '/hour' },
    { name: 'File Uploads', current: 80, limit: 100, unit: '/min' },
  ];

  const perKeyLimits = [
    { key: 'key_***a1b2', service: 'Payment Gateway', current: 800, limit: 1000, status: 'normal' },
    { key: 'key_***c3d4', service: 'SMS Service', current: 490, limit: 500, status: 'warning' },
    { key: 'key_***e5f6', service: 'Email Service', current: 150, limit: 200, status: 'normal' },
    { key: 'key_***i9j0', service: 'AI Gateway', current: 48, limit: 50, status: 'critical' },
  ];

  const burstThresholds = [
    { name: 'Spike Protection', threshold: '5x normal', window: '1 minute', status: 'active' },
    { name: 'DDoS Shield', threshold: '10x normal', window: '10 seconds', status: 'active' },
    { name: 'Cost Control', threshold: '$100/hour', window: '1 hour', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Rate Limits</h2>
        <p className="text-muted-foreground">Global and per-key rate limit configuration</p>
      </div>

      {/* Global Limits */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Global Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {globalLimits.map((limit, index) => {
              const percentage = (limit.current / limit.limit) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">{limit.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {limit.current.toLocaleString()} / {limit.limit.toLocaleString()} {limit.unit}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${
                      percentage >= 90 ? '[&>div]:bg-red-500' :
                      percentage >= 75 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Per-Key Limits */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            Per-Key Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Key ID</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Service</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Usage</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {perKeyLimits.map((limit, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-foreground">{limit.key}</td>
                    <td className="p-3 text-foreground">{limit.service}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(limit.current / limit.limit) * 100} 
                          className="w-24 h-2"
                        />
                        <span className="text-sm text-muted-foreground">
                          {limit.current}/{limit.limit}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        limit.status === 'critical' ? 'destructive' :
                        limit.status === 'warning' ? 'default' : 'secondary'
                      }>
                        {limit.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">
                        Request Change
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Burst Thresholds */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Burst Protection Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {burstThresholds.map((threshold, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{threshold.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Threshold: {threshold.threshold} • Window: {threshold.window}
                  </p>
                </div>
                <Badge variant="default" className="bg-green-500/20 text-green-400">
                  {threshold.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIRateLimits;
