/**
 * AUTO SERVER ORCHESTRATION - INTERNAL ONLY
 * Fully automated, AI-driven, zero-manual configuration
 * User controls: Run, Stop, Pay/Renew ONLY
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Server, Activity, DollarSign, Shield, Zap, TrendingUp } from 'lucide-react';
import ServerList from '@/components/server-orchestration/ServerList';
import ServerCostPanel from '@/components/server-orchestration/ServerCostPanel';
import ServerStatusMonitor from '@/components/server-orchestration/ServerStatusMonitor';
import ServerAutoScale from '@/components/server-orchestration/ServerAutoScale';

const ServerOrchestrationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('servers');

  // Mock stats - in production, these come from real-time monitoring
  const stats = {
    totalServers: 12,
    running: 8,
    stopped: 4,
    costToday: 47.82,
    costMonth: 1284.50,
    healthScore: 98.5,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Server className="h-8 w-8 text-primary" />
              Auto Server Orchestration
            </h1>
            <p className="text-muted-foreground mt-1">
              Fully automated • AI-managed • Zero configuration required
            </p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            AI Active
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.totalServers}</div>
              <div className="text-xs text-muted-foreground">Total Servers</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-500">{stats.running}</div>
              <div className="text-xs text-emerald-500/80">Running</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">{stats.stopped}</div>
              <div className="text-xs text-amber-500/80">Stopped</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">${stats.costToday}</div>
              <div className="text-xs text-muted-foreground">Cost Today</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">${stats.costMonth}</div>
              <div className="text-xs text-muted-foreground">Cost This Month</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.healthScore}%</div>
              <div className="text-xs text-primary/80">Health Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="servers" className="gap-2">
              <Server className="h-4 w-4" />
              Servers
            </TabsTrigger>
            <TabsTrigger value="status" className="gap-2">
              <Activity className="h-4 w-4" />
              Status Monitor
            </TabsTrigger>
            <TabsTrigger value="costs" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Costs
            </TabsTrigger>
            <TabsTrigger value="autoscale" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Auto Scale
            </TabsTrigger>
          </TabsList>

          <TabsContent value="servers">
            <ServerList />
          </TabsContent>

          <TabsContent value="status">
            <ServerStatusMonitor />
          </TabsContent>

          <TabsContent value="costs">
            <ServerCostPanel />
          </TabsContent>

          <TabsContent value="autoscale">
            <ServerAutoScale />
          </TabsContent>
        </Tabs>

        {/* AI Status Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">
                AI is continuously monitoring and optimizing your infrastructure
              </span>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30">
              Auto-managed
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServerOrchestrationDashboard;
