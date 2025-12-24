import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Target, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Timer,
  DollarSign,
  BarChart3,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useActivePromises, usePromiseFines, usePromiseMetrics, useTopPerformers } from '@/hooks/usePromiseData';
import { formatDistanceToNow, differenceInMinutes, isPast } from 'date-fns';

const getStatusConfig = (status: string, deadline: string) => {
  const isOverdue = isPast(new Date(deadline));
  
  switch (status) {
    case 'in_progress': 
      return { 
        color: isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400', 
        icon: Timer,
        label: isOverdue ? 'overdue' : 'in progress'
      };
    case 'promised': 
      return { 
        color: isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400', 
        icon: Target,
        label: isOverdue ? 'overdue' : 'promised'
      };
    case 'assigned': 
      return { color: 'bg-purple-500/20 text-purple-400', icon: Clock, label: 'assigned' };
    case 'breached': 
      return { color: 'bg-red-500/20 text-red-400', icon: XCircle, label: 'breached' };
    case 'completed': 
      return { color: 'bg-green-500/20 text-green-400', icon: CheckCircle2, label: 'completed' };
    default: 
      return { color: 'bg-muted text-muted-foreground', icon: Clock, label: status };
  }
};

const calculateProgress = (promiseTime: string, deadline: string, finishedTime: string | null) => {
  if (finishedTime) return 100;
  
  const start = new Date(promiseTime).getTime();
  const end = new Date(deadline).getTime();
  const now = Date.now();
  
  const total = end - start;
  const elapsed = now - start;
  
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
};

const formatTimeRemaining = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffMinutes = differenceInMinutes(deadlineDate, now);
  
  if (diffMinutes < 0) {
    return `-${Math.abs(diffMinutes)}m`;
  }
  
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export function PromiseTrackerScreen() {
  const { data: promises, isLoading: promisesLoading, refetch: refetchPromises } = useActivePromises();
  const { data: fines, isLoading: finesLoading, refetch: refetchFines } = usePromiseFines();
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = usePromiseMetrics();
  const { data: topPerformers, isLoading: performersLoading } = useTopPerformers();

  const handleRefresh = () => {
    refetchPromises();
    refetchFines();
    refetchMetrics();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <Target className="h-8 w-8 text-rose-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Promise Tracker</h1>
            <p className="text-muted-foreground">Real-time Developer Promise Monitoring</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {metricsLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-6 mx-auto mb-2" />
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <Timer className="h-6 w-6 mx-auto text-blue-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.activePromises || 0}</p>
                <p className="text-xs text-muted-foreground">Active Promises</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-6 w-6 mx-auto text-green-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.completedToday || 0}</p>
                <p className="text-xs text-muted-foreground">Completed Today</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-4 text-center">
                <XCircle className="h-6 w-6 mx-auto text-red-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.breachedToday || 0}</p>
                <p className="text-xs text-muted-foreground">Breached Today</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto text-yellow-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.atRisk || 0}</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto text-emerald-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.avgCompletionRate || 0}%</p>
                <p className="text-xs text-muted-foreground">On-Time Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto text-amber-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.totalFines || '₹0'}</p>
                <p className="text-xs text-muted-foreground">Fines Pending</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Promises */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Active Promise Timers
              <Badge className="bg-blue-500/20 text-blue-400 ml-auto">
                Live Tracking
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {promisesLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : promises && promises.length > 0 ? (
              <div className="space-y-4">
                {promises.map((promise) => {
                  const config = getStatusConfig(promise.status, promise.deadline);
                  const StatusIcon = config.icon;
                  const progress = calculateProgress(promise.promise_time, promise.deadline, promise.finished_time);
                  const timeRemaining = formatTimeRemaining(promise.deadline);
                  const isOverdue = isPast(new Date(promise.deadline));

                  return (
                    <div key={promise.id} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">{promise.id.slice(0, 8)}</span>
                          <Badge className={config.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono text-lg font-bold ${isOverdue ? 'text-red-500' : ''}`}>
                            {timeRemaining}
                          </p>
                          <p className="text-xs text-muted-foreground">remaining</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="font-medium">Task: {promise.task_id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">Developer: {promise.developer_id.slice(0, 8)}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress 
                          value={progress} 
                          className={`h-2 ${isOverdue ? '[&>div]:bg-red-500' : ''}`}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/30 text-xs">
                        <div>
                          <p className="text-muted-foreground">Promised</p>
                          <p className="font-medium">
                            {formatDistanceToNow(new Date(promise.promise_time), { addSuffix: true })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deadline</p>
                          <p className="font-medium">
                            {new Date(promise.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Extensions</p>
                          <p className="font-medium">{promise.extended_count || 0}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" /> Details
                        </Button>
                        {isOverdue && (
                          <Button size="sm" variant="destructive" className="flex-1">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Escalate
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No Active Promises</p>
                <p className="text-sm">Developer promises will appear here when created</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {performersLoading ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : topPerformers && topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {topPerformers.map((dev, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium font-mono">{dev.developer_id.slice(0, 8)}</span>
                        <Badge className="bg-green-500/20 text-green-400">
                          {dev.rate}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Completed: <span className="text-foreground">{dev.completed}</span></div>
                        <div>Total: <span className="text-foreground">{dev.total}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No performance data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Fines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <XCircle className="h-5 w-5" />
                Recent Fines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {finesLoading ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : fines && fines.length > 0 ? (
                <div className="space-y-3">
                  {fines.map((fine) => (
                    <div key={fine.id} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium font-mono">{fine.developer_id.slice(0, 8)}</span>
                        <Badge className="bg-red-500/20 text-red-400">
                          ₹{fine.fine_amount}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{fine.fine_reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(fine.applied_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-50" />
                  <p className="text-sm">No fines recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
