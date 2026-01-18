/**
 * TASK MANAGER - TASK ANALYTICS
 * Completion Rate • SLA Breach % • AI vs Human • Avg Resolution Time
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart3, TrendingUp, Clock, Bot, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const analyticsData = {
  completionRate: 94.5,
  slaBreachRate: 3.2,
  aiRatio: 87,
  humanRatio: 13,
  avgResolutionTime: '2h 15m',
  totalTasksToday: 342,
  tasksCompleted: 298,
  tasksPending: 44,
};

export const TMTaskAnalytics: React.FC = () => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Analytics</h1>
          <p className="text-muted-foreground">Performance metrics and insights</p>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.completionRate}%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.slaBreachRate}%</p>
                  <p className="text-sm text-muted-foreground">SLA Breach</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.avgResolutionTime}</p>
                  <p className="text-sm text-muted-foreground">Avg Resolution</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.totalTasksToday}</p>
                  <p className="text-sm text-muted-foreground">Tasks Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI vs Human Ratio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              AI vs Human Task Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Bot className="h-5 w-5 text-cyan-400" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-foreground">AI Tasks</span>
                    <span className="text-sm text-foreground">{analyticsData.aiRatio}%</span>
                  </div>
                  <Progress value={analyticsData.aiRatio} className="h-3" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-purple-400" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-foreground">Human Tasks</span>
                    <span className="text-sm text-foreground">{analyticsData.humanRatio}%</span>
                  </div>
                  <Progress value={analyticsData.humanRatio} className="h-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Today's Task Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-foreground">{analyticsData.totalTasksToday}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10">
                <p className="text-3xl font-bold text-green-400">{analyticsData.tasksCompleted}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10">
                <p className="text-3xl font-bold text-yellow-400">{analyticsData.tasksPending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TMTaskAnalytics;
