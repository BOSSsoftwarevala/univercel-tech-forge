import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Eye,
  Search,
  Filter,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Lock
} from 'lucide-react';
import { useActivePromises, usePromiseFines, usePromiseMetrics, useTopPerformers } from '@/hooks/usePromiseData';
import { useEscalatedPromises } from '@/hooks/usePromiseApproval';
import { formatDistanceToNow, differenceInMinutes, isPast, format } from 'date-fns';

const getStatusConfig = (status: string, deadline: string) => {
  const isOverdue = isPast(new Date(deadline));
  
  switch (status) {
    case 'pending_approval':
      return { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock, label: 'pending approval' };
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

interface PromiseDetailProps {
  promise: any;
  onClose: () => void;
}

function PromiseDetailDialog({ promise, onClose }: PromiseDetailProps) {
  const config = getStatusConfig(promise.status, promise.deadline);
  const StatusIcon = config.icon;
  const isOverdue = isPast(new Date(promise.deadline));

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Promise Details
            <Badge className={config.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-1">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Promise ID</p>
                <p className="font-mono text-sm">{promise.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={config.color}>{config.label}</Badge>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-3 bg-muted/30 rounded-lg space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Timeline
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p>{format(new Date(promise.promise_time), 'PPp')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className={isOverdue ? 'text-red-400' : ''}>
                    {format(new Date(promise.deadline), 'PPp')}
                  </p>
                </div>
                {promise.finished_time && (
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p>{format(new Date(promise.finished_time), 'PPp')}</p>
                  </div>
                )}
                {promise.approved_at && (
                  <div>
                    <p className="text-xs text-muted-foreground">Approved</p>
                    <p>{format(new Date(promise.approved_at), 'PPp')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Linked Entity */}
            <div className="p-3 bg-muted/30 rounded-lg space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> Assignment
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Developer ID</p>
                  <p className="font-mono">{promise.developer_id.slice(0, 12)}...</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Task ID</p>
                  <p className="font-mono">{promise.task_id.slice(0, 12)}...</p>
                </div>
                {promise.promise_type && (
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="capitalize">{promise.promise_type}</p>
                  </div>
                )}
                {promise.priority && (
                  <div>
                    <p className="text-xs text-muted-foreground">Priority</p>
                    <p className="capitalize">{promise.priority}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Escalation Info */}
            {promise.escalation_level > 0 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg space-y-2">
                <p className="text-sm font-medium flex items-center gap-2 text-orange-400">
                  <AlertCircle className="h-4 w-4" /> Escalation
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Level</p>
                    <p className="text-orange-400 font-bold">{promise.escalation_level}</p>
                  </div>
                  {promise.escalated_at && (
                    <div>
                      <p className="text-xs text-muted-foreground">Escalated At</p>
                      <p>{format(new Date(promise.escalated_at), 'PPp')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Breach Info */}
            {promise.breach_reason && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg space-y-2">
                <p className="text-sm font-medium flex items-center gap-2 text-red-400">
                  <XCircle className="h-4 w-4" /> Breach Details
                </p>
                <p className="text-sm">{promise.breach_reason}</p>
              </div>
            )}

            {/* Extensions */}
            {(promise.extended_count || 0) > 0 && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm">
                  <span className="text-muted-foreground">Extensions:</span>{' '}
                  <span className="font-bold">{promise.extended_count}</span>
                </p>
              </div>
            )}

            {/* Lock Status */}
            {promise.is_locked && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                This promise is locked and cannot be modified
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PromiseTrackerScreen() {
  const { data: promises, isLoading: promisesLoading, refetch: refetchPromises } = useActivePromises();
  const { data: escalated, isLoading: escalatedLoading } = useEscalatedPromises();
  const { data: fines, isLoading: finesLoading, refetch: refetchFines } = usePromiseFines();
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = usePromiseMetrics();
  const { data: topPerformers, isLoading: performersLoading } = useTopPerformers();

  const [selectedPromise, setSelectedPromise] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    refetchPromises();
    refetchFines();
    refetchMetrics();
  };

  // Filter promises
  const filteredPromises = (promises || []).filter((p: any) => {
    const matchesSearch = p.id.includes(searchTerm) || 
                          p.task_id.includes(searchTerm) || 
                          p.developer_id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header - READ ONLY INDICATOR */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <Target className="h-8 w-8 text-rose-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Promise Tracker</h1>
            <p className="text-muted-foreground">Real-time Promise Monitoring (Read-Only)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
            <Eye className="h-3 w-3 mr-1" />
            View Only
          </Badge>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics - READ ONLY */}
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
            <Card className="bg-blue-500/10 border-blue-500/30 cursor-pointer hover:border-blue-500/50"
                  onClick={() => setStatusFilter('all')}>
              <CardContent className="p-4 text-center">
                <Timer className="h-6 w-6 mx-auto text-blue-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.activePromises || 0}</p>
                <p className="text-xs text-muted-foreground">Active Promises</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10 border-green-500/30 cursor-pointer hover:border-green-500/50"
                  onClick={() => setStatusFilter('completed')}>
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-6 w-6 mx-auto text-green-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.completedToday || 0}</p>
                <p className="text-xs text-muted-foreground">Completed Today</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/30 cursor-pointer hover:border-red-500/50"
                  onClick={() => setStatusFilter('breached')}>
              <CardContent className="p-4 text-center">
                <XCircle className="h-6 w-6 mx-auto text-red-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.breachedToday || 0}</p>
                <p className="text-xs text-muted-foreground">Breached Today</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30 cursor-pointer hover:border-orange-500/50">
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-6 w-6 mx-auto text-orange-400 mb-2" />
                <p className="text-2xl font-bold">{escalated?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Escalated</p>
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

      {/* Filters - READ ONLY */}
      <Card className="bg-card/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, Task, or Developer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="promised">Promised</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="breached">Breached</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="text-xs">
              Last updated: {currentTime.toLocaleTimeString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Promise List - READ ONLY, NO ACTION BUTTONS */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Promise Timers
              <Badge className="bg-blue-500/20 text-blue-400 ml-auto">
                Live Tracking
              </Badge>
              <Badge variant="outline" className="ml-2">
                {filteredPromises.length} results
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {promisesLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredPromises.length > 0 ? (
              <div className="space-y-4">
                {filteredPromises.map((promise: any) => {
                  const config = getStatusConfig(promise.status, promise.deadline);
                  const StatusIcon = config.icon;
                  const progress = calculateProgress(promise.promise_time, promise.deadline, promise.finished_time);
                  const timeRemaining = formatTimeRemaining(promise.deadline);
                  const isOverdue = isPast(new Date(promise.deadline)) && !['completed', 'breached'].includes(promise.status);

                  return (
                    <div key={promise.id} className={`p-4 bg-muted/30 rounded-lg border ${isOverdue ? 'border-red-500/50' : 'border-border/50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">{promise.id.slice(0, 8)}</span>
                          <Badge className={config.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                          {promise.escalation_level > 0 && (
                            <Badge className="bg-orange-500/20 text-orange-400">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              L{promise.escalation_level}
                            </Badge>
                          )}
                          {promise.is_locked && (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`font-mono text-lg font-bold ${isOverdue ? 'text-red-500' : ''}`}>
                            {timeRemaining}
                          </p>
                          <p className="text-xs text-muted-foreground">remaining</p>
                        </div>
                      </div>
                      
                      <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Task:</span>{' '}
                          <span className="font-mono">{promise.task_id.slice(0, 8)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Developer:</span>{' '}
                          <span className="font-mono">{promise.developer_id.slice(0, 8)}</span>
                        </div>
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
                          <p className="text-muted-foreground">Started</p>
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

                      {/* READ-ONLY: Only Details button, no action buttons */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedPromise(promise)}
                        >
                          <Eye className="h-3 w-3 mr-1" /> View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No Promises Found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Top Performers - READ ONLY */}
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
                  {topPerformers.map((dev: any, index: number) => (
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

          {/* Recent Fines - READ ONLY */}
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
                  {fines.map((fine: any) => (
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

      {/* Promise Detail Dialog - READ ONLY */}
      {selectedPromise && (
        <PromiseDetailDialog 
          promise={selectedPromise} 
          onClose={() => setSelectedPromise(null)} 
        />
      )}
    </div>
  );
}
