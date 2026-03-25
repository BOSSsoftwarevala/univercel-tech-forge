/**
 * Server Cost Panel - Shows only costs, no technical details
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Calendar, AlertTriangle } from 'lucide-react';

const ServerCostPanel: React.FC = () => {
  const costData = {
    today: 47.82,
    yesterday: 52.10,
    thisWeek: 312.45,
    thisMonth: 1284.50,
    lastMonth: 1456.20,
    projected: 1520.00,
    savings: 245.80,
  };

  const serverCosts = [
    { name: 'Demo Server Alpha', cost: 126.00, trend: 'stable' },
    { name: 'Build Server Beta', cost: 195.00, trend: 'up' },
    { name: 'Production Delta', cost: 360.00, trend: 'stable' },
    { name: 'Test Server Gamma', cost: 114.00, trend: 'down' },
    { name: 'Staging Epsilon', cost: 150.00, trend: 'stable' },
  ];

  const alerts = [
    { type: 'warning', message: 'Staging Epsilon has payment overdue', action: 'Pay Now' },
    { type: 'info', message: 'AI reduced costs by 15% through auto-scaling', action: null },
  ];

  return (
    <div className="space-y-6">
      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Today</p>
                <p className="text-3xl font-bold text-foreground">${costData.today}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${costData.today < costData.yesterday ? 'text-emerald-500' : 'text-amber-500'}`}>
                {costData.today < costData.yesterday ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {Math.abs(((costData.today - costData.yesterday) / costData.yesterday) * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground">${costData.thisMonth}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projected</p>
                <p className="text-3xl font-bold text-foreground">${costData.projected}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-500/80">AI Savings</p>
                <p className="text-3xl font-bold text-emerald-500">${costData.savings}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Cost Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-primary/5 border border-primary/20'
                }`}
              >
                <span className="text-sm text-foreground">{alert.message}</span>
                {alert.action && (
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-500/20 text-amber-500 border-amber-500/50">
                    {alert.action}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Per-Server Costs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Cost by Server (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serverCosts.map((server, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-foreground">{server.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(server.cost / 400) * 100}%` }}
                    />
                  </div>
                  <span className="text-foreground font-medium w-20 text-right">${server.cost}</span>
                  {server.trend === 'up' && <TrendingUp className="h-4 w-4 text-amber-500" />}
                  {server.trend === 'down' && <TrendingDown className="h-4 w-4 text-emerald-500" />}
                  {server.trend === 'stable' && <div className="w-4" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerCostPanel;
