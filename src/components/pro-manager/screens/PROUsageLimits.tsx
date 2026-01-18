/**
 * USAGE & LIMITS
 * API Usage • Storage • AI Calls • Fair Usage Alerts
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gauge, Database, Bot, AlertTriangle } from 'lucide-react';

const mockUsage = [
  { user: 'PRO-***21', api: 85, storage: 72, aiCalls: 45, alert: true },
  { user: 'PRO-***45', api: 45, storage: 30, aiCalls: 20, alert: false },
  { user: 'PRO-***78', api: 92, storage: 88, aiCalls: 78, alert: true },
  { user: 'PRO-***92', api: 15, storage: 10, aiCalls: 5, alert: false },
];

export const PROUsageLimits: React.FC = () => {
  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usage & Limits</h1>
        <p className="text-muted-foreground">Monitor resource usage and fair usage compliance</p>
      </div>

      <div className="grid gap-4">
        {mockUsage.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gauge className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">{item.user}</CardTitle>
                </div>
                {item.alert && (
                  <Badge className="bg-amber-500/20 text-amber-500">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Fair Usage Alert
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      API Usage
                    </span>
                    <span className="text-sm font-medium text-foreground">{item.api}%</span>
                  </div>
                  <Progress value={item.api} className={getProgressColor(item.api)} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Storage
                    </span>
                    <span className="text-sm font-medium text-foreground">{item.storage}%</span>
                  </div>
                  <Progress value={item.storage} className={getProgressColor(item.storage)} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      AI Calls
                    </span>
                    <span className="text-sm font-medium text-foreground">{item.aiCalls}%</span>
                  </div>
                  <Progress value={item.aiCalls} className={getProgressColor(item.aiCalls)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PROUsageLimits;
