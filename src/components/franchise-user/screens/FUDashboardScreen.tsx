/**
 * FRANCHISE OWNER DASHBOARD SCREEN
 * LOCKED: Same color/theme as core system
 * Header: 5 metrics + Place Order button
 * Body: Operations only (no duplicate metrics)
 */

import React, { useState, useCallback } from 'react';
import { 
  Wallet, FolderKanban, Users, ListTodo, HeadphonesIcon, 
  Plus, Activity, Sparkles, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FOPlaceOrderForm } from './FOPlaceOrderForm';

// Header metric type
interface HeaderMetric {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

export function FUDashboardScreen() {
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Header metrics (read-only from DB - mock for now)
  const headerMetrics: HeaderMetric[] = [
    { label: 'Wallet Balance', value: '₹15,230', icon: Wallet },
    { label: 'Active Projects', value: 8, icon: FolderKanban },
    { label: 'Active Clients', value: 24, icon: Users },
    { label: 'Open Tasks', value: 5, icon: ListTodo },
    { label: 'Support Tickets', value: 2, icon: HeadphonesIcon },
  ];

  // Mock operational data
  const activeProjects = [
    { id: 'PRJ-2024-001', name: 'E-Commerce Platform', status: 'in_progress', client: 'ABC Corp', progress: 65 },
    { id: 'PRJ-2024-002', name: 'CRM System', status: 'pending_approval', client: 'XYZ Ltd', progress: 0 },
    { id: 'PRJ-2024-003', name: 'Mobile App', status: 'completed', client: 'Tech Inc', progress: 100 },
  ];

  const aiSuggestions = [
    { id: 1, text: 'Project PRJ-2024-002 requires additional domain configuration', type: 'warning' },
    { id: 2, text: 'Client ABC Corp payment pending for 3 days', type: 'alert' },
    { id: 3, text: 'New software update available for E-Commerce template', type: 'info' },
  ];

  const recentActivities = [
    { id: 1, action: 'Project PRJ-2024-001 status updated', time: '2 hours ago' },
    { id: 2, action: 'New lead assigned from HQ', time: '5 hours ago' },
    { id: 3, action: 'Wallet credited ₹5,000', time: '1 day ago' },
    { id: 4, action: 'Support ticket #12 resolved', time: '2 days ago' },
  ];

  const taskProgress = [
    { id: 1, task: 'Complete client onboarding', status: 'done', due: 'Completed' },
    { id: 2, task: 'Submit domain details', status: 'pending', due: 'Today' },
    { id: 3, task: 'Review AI suggestions', status: 'pending', due: 'Tomorrow' },
  ];

  const handleOpenOrderForm = useCallback(() => {
    setShowOrderForm(true);
  }, []);

  const handleCloseOrderForm = useCallback(() => {
    setShowOrderForm(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>;
      case 'pending_approval':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending Approval</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Unknown</Badge>;
    }
  };

  // Full-screen order form
  if (showOrderForm) {
    return <FOPlaceOrderForm onClose={handleCloseOrderForm} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* FIXED HEADER - No Scroll */}
      <div className="shrink-0 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Metrics Row */}
          <div className="flex items-center gap-4 flex-wrap">
            {headerMetrics.map((metric, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border"
              >
                <metric.icon className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{metric.label}</span>
                  <span className="text-sm font-semibold">{metric.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Place Order Button - Always Visible */}
          <Button 
            onClick={handleOpenOrderForm}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Place Order
          </Button>
        </div>
      </div>

      {/* DASHBOARD BODY - Operations Only */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Row 1: Active Projects + Project Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Projects */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-primary" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="font-medium text-sm mt-1">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.client}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Suggestions (Read-Only) */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Suggestions
                  <Badge variant="outline" className="ml-2 text-[10px]">READ-ONLY</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      suggestion.type === 'alert' 
                        ? 'bg-destructive/10 border-destructive/30' 
                        : suggestion.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    {suggestion.type === 'alert' ? (
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    ) : suggestion.type === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm">{suggestion.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Recent Activities + Task Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                  >
                    <p className="text-sm">{activity.action}</p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Task Progress */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-primary" />
                  Task Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {taskProgress.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {item.status === 'done' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                      <p className={`text-sm ${item.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {item.task}
                      </p>
                    </div>
                    <span className={`text-xs ${item.status === 'done' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {item.due}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Support Status */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HeadphonesIcon className="h-4 w-4 text-primary" />
                Support Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <p className="font-medium">2 Open Tickets</p>
                  <p className="text-sm text-muted-foreground">Average response time: 2 hours</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  All Systems Operational
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}