/**
 * Promise Management Dashboard
 * ZERO-LOOPHOLE Promise Control System
 * Role: Promise Management (Control Role) - READ-ONLY Control, No Execution
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ListTodo, Shield, BarChart3, AlertTriangle,
  CheckCircle, Clock, XCircle, TrendingUp, Target, Lock,
  Search, RefreshCw, Eye, FileText, ChevronRight,
  ArrowUpRight, Ban, CheckCheck, History, Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import {
  usePromiseManagerMetrics,
  usePromisesList,
  usePendingApprovals,
  useOverduePromises,
  useEscalatedPromises,
  usePromiseAuditLogs,
  useApprovePromiseStrict,
  useRejectPromiseStrict,
  useFulfillPromise,
  useEscalatePromise,
  type PromiseWithDetails,
} from '@/hooks/usePromiseManager';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending_approval: { label: 'Pending Approval', color: 'bg-amber-500', icon: Clock },
  assigned: { label: 'Active', color: 'bg-blue-500', icon: Target },
  promised: { label: 'Promised', color: 'bg-cyan-500', icon: TrendingUp },
  in_progress: { label: 'In Progress', color: 'bg-indigo-500', icon: TrendingUp },
  completed: { label: 'Fulfilled', color: 'bg-green-500', icon: CheckCircle },
  breached: { label: 'Breached', color: 'bg-red-500', icon: XCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-slate-400' },
  normal: { label: 'Normal', color: 'bg-blue-400' },
  high: { label: 'High', color: 'bg-orange-500' },
  critical: { label: 'Critical', color: 'bg-red-600' },
};

export default function PromiseManagementDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPromise, setSelectedPromise] = useState<PromiseWithDetails | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Data hooks
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = usePromiseManagerMetrics();
  const { data: allPromises = [], isLoading: promisesLoading, refetch: refetchPromises } = usePromisesList({ 
    status: filterStatus !== 'all' ? filterStatus : undefined 
  });
  const { data: pendingApprovals = [] } = usePendingApprovals();
  const { data: overduePromises = [] } = useOverduePromises();
  const { data: escalatedPromises = [] } = useEscalatedPromises();
  const { data: auditLogs = [] } = usePromiseAuditLogs(selectedPromise?.id);

  // Mutations
  const approvePromise = useApprovePromiseStrict();
  const rejectPromise = useRejectPromiseStrict();
  const fulfillPromise = useFulfillPromise();
  const escalatePromise = useEscalatePromise();

  const filteredPromises = allPromises.filter(p => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      p.id.toLowerCase().includes(search) ||
      p.promise_type?.toLowerCase().includes(search) ||
      p.priority?.toLowerCase().includes(search)
    );
  });

  const handleRefresh = () => {
    refetchMetrics();
    refetchPromises();
    toast.success('Data refreshed');
  };

  const handleApprove = async (promise: PromiseWithDetails) => {
    await approvePromise.mutateAsync(promise.id);
  };

  const handleReject = async () => {
    if (!selectedPromise) return;
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is mandatory');
      return;
    }
    await rejectPromise.mutateAsync({ promiseId: selectedPromise.id, reason: rejectReason });
    setRejectDialogOpen(false);
    setRejectReason('');
    setSelectedPromise(null);
  };

  const handleEscalate = async (promise: PromiseWithDetails) => {
    await escalatePromise.mutateAsync(promise.id);
  };

  const handleFulfill = async (promise: PromiseWithDetails) => {
    await fulfillPromise.mutateAsync({ promiseId: promise.id });
  };

  const openRejectDialog = (promise: PromiseWithDetails) => {
    setSelectedPromise(promise);
    setRejectDialogOpen(true);
  };

  const openDetailsDialog = (promise: PromiseWithDetails) => {
    setSelectedPromise(promise);
    setDetailsDialogOpen(true);
  };

  const isOverdue = (deadline: string) => new Date(deadline) < new Date();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Promise Management</h1>
              <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/50">
                <Shield className="w-3 h-3" />
                Control Role
              </Badge>
            </div>
            <p className="text-muted-foreground">Zero-loophole promise control, validation, tracking & enforcement</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Lock className="w-3 h-3" />
              Read-Only Control
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className={`w-4 h-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards - Clickable */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card 
            className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => { setFilterStatus('all'); setActiveTab('promises'); }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <ListTodo className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold">{metrics?.total_promises || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Total Promises</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-colors"
            onClick={() => { setFilterStatus('assigned'); setActiveTab('promises'); }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold">{metrics?.total_active || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Active</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-colors"
            onClick={() => setActiveTab('approvals')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Clock className="w-8 h-8 text-amber-500" />
                <span className="text-2xl font-bold">{metrics?.pending_approval || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Pending Approval</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20 cursor-pointer hover:border-red-500/40 transition-colors"
            onClick={() => setActiveTab('overdue')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <span className="text-2xl font-bold">{metrics?.overdue || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Overdue</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 cursor-pointer hover:border-green-500/40 transition-colors"
            onClick={() => { setFilterStatus('completed'); setActiveTab('promises'); }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold">{metrics?.fulfilled || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Fulfilled</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-purple-500" />
                <span className="text-2xl font-bold">{metrics?.fulfillment_rate || 0}%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Fulfillment Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="promises" className="gap-2">
              <ListTodo className="w-4 h-4" />
              All Promises
            </TabsTrigger>
            <TabsTrigger value="approvals" className="gap-2">
              <Shield className="w-4 h-4" />
              Approvals
              {pendingApprovals.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {pendingApprovals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Overdue
              {overduePromises.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {overduePromises.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="escalations" className="gap-2">
              <Bell className="w-4 h-4" />
              Escalations
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <History className="w-4 h-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Active Promises
                  </CardTitle>
                  <CardDescription>Currently active promise commitments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {allPromises.filter(p => !['completed', 'breached'].includes(p.status)).slice(0, 5).map((promise) => {
                        const status = statusConfig[promise.status] || statusConfig.assigned;
                        const StatusIcon = status.icon;
                        const overdue = isOverdue(promise.deadline);
                        return (
                          <motion.div
                            key={promise.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer
                              ${overdue ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30' : 'bg-secondary/30 hover:bg-secondary/50'}`}
                            onClick={() => openDetailsDialog(promise)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${status.color} flex items-center justify-center`}>
                                <StatusIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{promise.promise_type}</p>
                                <p className="text-xs text-muted-foreground">
                                  Due: {format(new Date(promise.deadline), 'MMM dd, yyyy HH:mm')}
                                  {overdue && <span className="text-red-500 ml-2">• OVERDUE</span>}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`${priorityConfig[promise.priority]?.color || 'bg-slate-400'} text-white border-0`}>
                                {promise.priority}
                              </Badge>
                              {promise.is_locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </motion.div>
                        );
                      })}
                      {allPromises.filter(p => !['completed', 'breached'].includes(p.status)).length === 0 && (
                        <p className="text-muted-foreground text-center py-8">No active promises</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Fulfillment Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Fulfillment Progress
                  </CardTitle>
                  <CardDescription>Promise completion metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Fulfillment Rate</span>
                      <span className="font-medium">{metrics?.fulfillment_rate || 0}%</span>
                    </div>
                    <Progress value={metrics?.fulfillment_rate || 0} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-2xl font-bold text-green-500">{metrics?.fulfilled || 0}</p>
                      <p className="text-sm text-muted-foreground">Fulfilled</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-2xl font-bold text-red-500">{metrics?.breached || 0}</p>
                      <p className="text-sm text-muted-foreground">Breached</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Quick Stats</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Active Escalations</span>
                      <Badge variant="outline" className={metrics?.active_escalations ? 'text-red-500' : ''}>
                        {metrics?.active_escalations || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Pending Approvals</span>
                      <Badge variant="outline" className={pendingApprovals.length ? 'text-amber-500' : ''}>
                        {pendingApprovals.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Overdue Promises</span>
                      <Badge variant="outline" className={overduePromises.length ? 'text-red-500' : ''}>
                        {overduePromises.length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Promises Tab */}
          <TabsContent value="promises" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search promises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending_approval', 'assigned', 'in_progress', 'completed', 'breached'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                  >
                    {status === 'all' ? 'All' : statusConfig[status]?.label || status}
                  </Button>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Promise Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Escalation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromises.map((promise) => {
                      const status = statusConfig[promise.status] || statusConfig.assigned;
                      const StatusIcon = status.icon;
                      const overdue = isOverdue(promise.deadline) && !['completed', 'breached'].includes(promise.status);
                      return (
                        <TableRow key={promise.id} className={overdue ? 'bg-red-500/5' : ''}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {promise.promise_type}
                              {promise.is_locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${status.color} text-white border-0 gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${priorityConfig[promise.priority]?.color || 'bg-slate-400'} text-white border-0`}>
                              {promise.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className={overdue ? 'text-red-500 font-medium' : ''}>
                              {format(new Date(promise.deadline), 'MMM dd, yyyy HH:mm')}
                              {overdue && <span className="ml-2 text-xs">OVERDUE</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            {promise.escalation_level > 0 ? (
                              <Badge variant="destructive">Level {promise.escalation_level}</Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openDetailsDialog(promise)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {!promise.is_locked && overdue && (
                                <Button variant="ghost" size="icon" onClick={() => handleEscalate(promise)}>
                                  <ArrowUpRight className="w-4 h-4 text-amber-500" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredPromises.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No promises found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Review and approve or reject promise requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovals.map((promise) => (
                      <motion.div
                        key={promise.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border bg-secondary/20"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-amber-500 text-white">Pending</Badge>
                              <Badge variant="outline" className={`${priorityConfig[promise.priority]?.color || 'bg-slate-400'} text-white border-0`}>
                                {promise.priority}
                              </Badge>
                            </div>
                            <h4 className="font-medium">{promise.promise_type}</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Deadline: {format(new Date(promise.deadline), 'MMM dd, yyyy HH:mm')}</p>
                              <p>Created: {formatDistanceToNow(new Date(promise.created_at), { addSuffix: true })}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openRejectDialog(promise)}
                              disabled={rejectPromise.isPending}
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleApprove(promise)}
                              disabled={approvePromise.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overdue Tab */}
          <TabsContent value="overdue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                  Overdue Promises
                </CardTitle>
                <CardDescription>Promises that have exceeded their deadline</CardDescription>
              </CardHeader>
              <CardContent>
                {overduePromises.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50 text-green-500" />
                    <p>No overdue promises</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Promise Type</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Time Overdue</TableHead>
                        <TableHead>Escalation Level</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overduePromises.map((promise) => (
                        <TableRow key={promise.id} className="bg-red-500/5">
                          <TableCell className="font-medium">{promise.promise_type}</TableCell>
                          <TableCell>{format(new Date(promise.deadline), 'MMM dd, yyyy HH:mm')}</TableCell>
                          <TableCell className="text-red-500 font-medium">
                            {formatDistanceToNow(new Date(promise.deadline), { addSuffix: false })} overdue
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">Level {promise.escalation_level || 0}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleEscalate(promise)}
                              disabled={escalatePromise.isPending}
                            >
                              <ArrowUpRight className="w-4 h-4 mr-1" />
                              Escalate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Escalations Tab */}
          <TabsContent value="escalations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Active Escalations
                </CardTitle>
                <CardDescription>Promises that have been escalated (cannot be muted or deleted)</CardDescription>
              </CardHeader>
              <CardContent>
                {escalatedPromises.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50 text-green-500" />
                    <p>No active escalations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {escalatedPromises.map((promise) => (
                      <div key={promise.id} className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="destructive">Escalation Level {promise.escalation_level}</Badge>
                              <Badge variant="outline" className={`${priorityConfig[promise.priority]?.color || 'bg-slate-400'} text-white border-0`}>
                                {promise.priority}
                              </Badge>
                            </div>
                            <h4 className="font-medium">{promise.promise_type}</h4>
                            <p className="text-sm text-muted-foreground">
                              Overdue since: {formatDistanceToNow(new Date(promise.deadline), { addSuffix: true })}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => openDetailsDialog(promise)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Immutable Audit Logs
                </CardTitle>
                <CardDescription>Read-only, append-only audit trail (cannot be modified or deleted)</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg bg-secondary/30 border text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">
                            {log.action_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.server_timestamp), 'MMM dd, yyyy HH:mm:ss')}
                          </span>
                        </div>
                        <div className="text-muted-foreground space-y-1">
                          <p>
                            <span className="font-medium">By:</span> {log.action_by_role}
                            {log.is_system_action && <Badge variant="secondary" className="ml-2 text-xs">SYSTEM</Badge>}
                          </p>
                          {log.previous_status && (
                            <p><span className="font-medium">Status:</span> {log.previous_status} → {log.new_status}</p>
                          )}
                          {log.reason && <p><span className="font-medium">Reason:</span> {log.reason}</p>}
                        </div>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No audit logs available</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Promise</DialogTitle>
            <DialogDescription>
              Provide a mandatory reason for rejection. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason (mandatory)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectPromise.isPending}>
              Reject Promise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Promise Details
              {selectedPromise?.is_locked && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Locked
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedPromise && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Promise Type</p>
                  <p className="font-medium">{selectedPromise.promise_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`${statusConfig[selectedPromise.status]?.color || 'bg-slate-500'} text-white`}>
                    {statusConfig[selectedPromise.status]?.label || selectedPromise.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge className={`${priorityConfig[selectedPromise.priority]?.color || 'bg-slate-400'} text-white`}>
                    {selectedPromise.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{format(new Date(selectedPromise.deadline), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Role</p>
                  <p className="font-medium">{selectedPromise.assigned_role || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Escalation Level</p>
                  <p className="font-medium">{selectedPromise.escalation_level || 0}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Approval Info</p>
                {selectedPromise.approved_at ? (
                  <p className="text-sm">Approved at: {format(new Date(selectedPromise.approved_at), 'MMM dd, yyyy HH:mm')}</p>
                ) : selectedPromise.rejection_reason ? (
                  <div className="text-sm text-red-500">
                    <p>Rejected: {selectedPromise.rejection_reason}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Pending approval</p>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Promise ID</p>
                <code className="text-xs bg-secondary p-2 rounded block">{selectedPromise.id}</code>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            {selectedPromise && !selectedPromise.is_locked && selectedPromise.status !== 'pending_approval' && (
              <Button onClick={() => handleFulfill(selectedPromise)} disabled={fulfillPromise.isPending}>
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark Fulfilled
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
