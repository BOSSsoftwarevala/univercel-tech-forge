import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Target,
  BarChart3,
  FileText,
  Shield,
  Zap,
  Loader2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActivePromises, usePromiseMetrics, useTopPerformers } from '@/hooks/usePromiseData';
import { useCompletePromise, useBreachPromise } from '@/hooks/usePromiseActions';
import { usePendingApprovals, useApprovePromise, useRejectPromise, useEscalatedPromises } from '@/hooks/usePromiseApproval';
import { useAuth } from '@/hooks/useAuth';

export function PromiseManagementScreen() {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  
  const { data: promises, isLoading: promisesLoading } = useActivePromises();
  const { data: pendingApprovals, isLoading: pendingLoading } = usePendingApprovals();
  const { data: escalated, isLoading: escalatedLoading } = useEscalatedPromises();
  const { data: metrics, isLoading: metricsLoading } = usePromiseMetrics();
  const { data: topPerformers, isLoading: performersLoading } = useTopPerformers();
  
  const completePromise = useCompletePromise();
  const breachPromise = useBreachPromise();
  const approvePromise = useApprovePromise();
  const rejectPromise = useRejectPromise();

  const canApprove = ['super_admin', 'master', 'promise_management', 'task_manager'].includes(userRole || '');
  const isLoading = promisesLoading || metricsLoading || performersLoading || pendingLoading;

  const stats = [
    { label: 'Pending Approval', value: pendingApprovals?.length || 0, icon: Clock, color: 'text-yellow-400' },
    { label: 'Active Promises', value: metrics?.activePromises || 0, icon: FileCheck, color: 'text-blue-400' },
    { label: 'Escalated', value: escalated?.length || 0, icon: AlertCircle, color: 'text-orange-400' },
    { label: 'Completed Today', value: metrics?.completedToday || 0, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'Breached Today', value: metrics?.breachedToday || 0, icon: XCircle, color: 'text-red-400' },
  ];

  const getStatusBadge = (status: string, isLocked?: boolean) => {
    if (isLocked) {
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><Lock className="h-3 w-3 mr-1" />Locked</Badge>;
    }
    
    switch (status) {
      case 'pending_approval':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending Approval</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'in_progress':
      case 'assigned':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>;
      case 'breached':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Breached</Badge>;
      case 'promised':
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Promised</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressFromPromise = (promise: any) => {
    if (promise.status === 'completed' || promise.is_locked) return 100;
    if (promise.status === 'breached') return 100;
    const now = new Date();
    const start = new Date(promise.promise_time);
    const end = new Date(promise.deadline);
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-400',
      high: 'bg-orange-500/20 text-orange-400',
      normal: 'bg-blue-500/20 text-blue-400',
      low: 'bg-gray-500/20 text-gray-400',
    };
    return <Badge className={colors[priority] || colors.normal}>{priority}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            Promise Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Control and approve organizational commitments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10">
            <Zap className="w-3 h-3 mr-1" />
            Live Tracking
          </Badge>
          {canApprove && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Approver
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => {
                    if (stat.label === 'Pending Approval') setActiveTab('pending');
                    else if (stat.label === 'Active Promises') setActiveTab('active');
                    else if (stat.label === 'Escalated') setActiveTab('escalated');
                  }}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="relative">
            Pending Approval
            {(pendingApprovals?.length || 0) > 0 && (
              <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full px-2">{pendingApprovals?.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="escalated" className="relative">
            Escalated
            {(escalated?.length || 0) > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2">{escalated?.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Pending Approvals Tab */}
        <TabsContent value="pending">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Pending Approval Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!pendingApprovals || pendingApprovals.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map((promise) => (
                    <div 
                      key={promise.id}
                      className="p-4 rounded-lg bg-background/50 border border-yellow-500/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground">{promise.id.slice(0, 8)}</span>
                          {getStatusBadge(promise.status)}
                          {getPriorityBadge(promise.priority)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(promise.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Task</p>
                          <p className="font-mono">{promise.task_id.slice(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deadline</p>
                          <p>{new Date(promise.deadline).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="capitalize">{promise.promise_type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Developer</p>
                          <p className="font-mono">{promise.developer_id.slice(0, 8)}</p>
                        </div>
                      </div>
                      {canApprove && (
                        <div className="flex gap-2 pt-3 border-t border-border/30">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => approvePromise.mutate(promise.id)}
                            disabled={approvePromise.isPending}
                          >
                            {approvePromise.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                              <><CheckCircle2 className="h-4 w-4 mr-1" /> Approve</>
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1"
                            onClick={() => rejectPromise.mutate({ promiseId: promise.id, reason: 'Rejected by manager' })}
                            disabled={rejectPromise.isPending}
                          >
                            {rejectPromise.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                              <><XCircle className="h-4 w-4 mr-1" /> Reject</>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Promises Tab */}
        <TabsContent value="active">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Active Promises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(!promises || promises.length === 0) ? (
                  <p className="text-muted-foreground text-center py-8">No active promises</p>
                ) : (
                  promises.map((promise: any) => (
                    <div 
                      key={promise.id}
                      className="p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground">{promise.id.slice(0, 8)}</span>
                          <span className="font-medium text-sm">Task: {promise.task_id.slice(0, 8)}</span>
                        </div>
                        {getStatusBadge(promise.status, promise.is_locked)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Deadline: {new Date(promise.deadline).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={getProgressFromPromise(promise)} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {getProgressFromPromise(promise)}%
                        </span>
                      </div>
                      {!promise.is_locked && promise.status !== 'completed' && promise.status !== 'breached' && canApprove && (
                        <div className="flex gap-2 pt-2 border-t border-border/30">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 h-7 text-xs"
                            onClick={() => completePromise.mutate(promise.id)}
                            disabled={completePromise.isPending}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Complete
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1 h-7 text-xs"
                            onClick={() => breachPromise.mutate({ promiseId: promise.id, reason: 'Manager override' })}
                            disabled={breachPromise.isPending}
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Mark Breached
                          </Button>
                        </div>
                      )}
                      {promise.is_locked && (
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                          <Lock className="h-3 w-3" /> This promise is locked and cannot be modified
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escalated Tab */}
        <TabsContent value="escalated">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Escalated Promises
              </CardTitle>
            </CardHeader>
            <CardContent>
              {escalatedLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (!escalated || escalated.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No escalated promises</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {escalated.map((promise: any) => (
                    <div 
                      key={promise.id}
                      className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono">{promise.id.slice(0, 8)}</span>
                          <Badge className="bg-orange-500/20 text-orange-400">
                            Level {promise.escalation_level}
                          </Badge>
                          {getStatusBadge(promise.status)}
                        </div>
                        <span className="text-xs text-red-400">
                          Overdue: {new Date(promise.deadline).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Developer</p>
                          <p className="font-mono">{promise.developer_id.slice(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Escalated At</p>
                          <p>{promise.escalated_at ? new Date(promise.escalated_at).toLocaleString() : 'N/A'}</p>
                        </div>
                      </div>
                      {canApprove && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1"
                            onClick={() => breachPromise.mutate({ promiseId: promise.id, reason: 'Escalation - deadline exceeded' })}
                            disabled={breachPromise.isPending}
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" /> Mark Breached
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(!topPerformers || topPerformers.length === 0) ? (
                  <p className="text-muted-foreground text-center py-4">No performance data</p>
                ) : (
                  topPerformers.map((performer: any) => (
                    <div key={performer.developer_id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-mono">Dev {performer.developer_id.slice(0, 6)}</span>
                        <span className="text-muted-foreground">{performer.completed}/{performer.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={performer.rate} 
                          className={`h-2 flex-1 ${
                            performer.rate >= 90 ? '[&>div]:bg-green-500' : 
                            performer.rate >= 75 ? '[&>div]:bg-yellow-500' : 
                            '[&>div]:bg-red-500'
                          }`}
                        />
                        <span className="text-xs font-medium w-10 text-right">{performer.rate}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
