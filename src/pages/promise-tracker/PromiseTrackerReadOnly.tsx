/**
 * READ-ONLY Promise Tracker Dashboard
 * Observer role with ZERO control power
 * All data is read-only, all views are logged
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  AlertCircle,
  Calendar,
  Lock,
  Download,
  RefreshCw,
  Shield,
  FileText,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  useTrackerMetrics,
  useTrackerPromises,
  useTrackerOverdue,
  useTrackerEscalated,
  useTrackerFulfilled,
  useTrackerPromiseDetail,
  useTrackerAuditHistory,
  useLogPromiseView,
  useLogPromiseExport,
  useTrackerRealtime,
  useServerTime,
  calculateRemainingTime,
  generatePromiseCSV,
  TrackerPromise,
  TrackerFilters,
} from '@/hooks/usePromiseTracker';

// Status badge configuration
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending_approval':
      return { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock, label: 'Pending Approval' };
    case 'assigned':
      return { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Clock, label: 'Assigned' };
    case 'promised':
      return { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: Target, label: 'Promised' };
    case 'in_progress':
      return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Timer, label: 'In Progress' };
    case 'completed':
      return { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2, label: 'Fulfilled' };
    case 'breached':
      return { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle, label: 'Breached' };
    default:
      return { color: 'bg-muted text-muted-foreground', icon: Clock, label: status };
  }
};

// Promise Detail Dialog (Read-Only)
function PromiseDetailDialog({
  promiseId,
  onClose,
}: {
  promiseId: string;
  onClose: () => void;
}) {
  const { data: promise, isLoading } = useTrackerPromiseDetail(promiseId);
  const { data: auditLogs } = useTrackerAuditHistory(promiseId);
  const serverTime = useServerTime();
  const logView = useLogPromiseView();

  useEffect(() => {
    // Log detail view
    logView.mutate({ promiseId, viewType: 'detail' });
  }, [promiseId]);

  if (isLoading || !promise) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <Skeleton className="h-64 w-full" />
        </DialogContent>
      </Dialog>
    );
  }

  const config = getStatusConfig(promise.status);
  const StatusIcon = config.icon;
  const remaining = calculateRemainingTime(promise.due_date, serverTime);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Promise Detail (Read-Only)
            <Badge variant="outline" className="ml-2">
              <Lock className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Status & ID */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Promise ID</p>
                <p className="font-mono text-sm">{promise.promise_id}</p>
              </div>
              <Badge className={config.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>

            {/* Timeline */}
            <Card className="bg-muted/30">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p>{format(new Date(promise.start_date), 'PPp')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className={remaining.isOverdue ? 'text-red-400' : ''}>
                    {format(new Date(promise.due_date), 'PPp')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Remaining Time</p>
                  <p className={remaining.isOverdue ? 'text-red-400 font-bold' : 'text-green-400'}>
                    {remaining.text}
                  </p>
                </div>
                {promise.finished_time && (
                  <div>
                    <p className="text-xs text-muted-foreground">Completed At</p>
                    <p className="text-green-400">{format(new Date(promise.finished_time), 'PPp')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assignment Info (Masked) */}
            <Card className="bg-muted/30">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Assignment (Masked)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Assigned Role</p>
                  <p className="capitalize">{promise.assigned_role}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned User</p>
                  <p className="font-mono">{promise.assigned_user_masked}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Linked Module</p>
                  <p className="capitalize">{promise.linked_module}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Task ID</p>
                  <p className="font-mono text-xs">{promise.task_id.slice(0, 12)}...</p>
                </div>
              </CardContent>
            </Card>

            {/* Escalation (if applicable) */}
            {promise.escalation_level > 0 && (
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-orange-400">
                    <AlertCircle className="h-4 w-4" />
                    Escalation Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Level</p>
                    <p className="text-orange-400 font-bold text-lg">{promise.escalation_level}</p>
                  </div>
                  {promise.escalated_at && (
                    <div>
                      <p className="text-xs text-muted-foreground">Escalated At</p>
                      <p>{format(new Date(promise.escalated_at), 'PPp')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Breach Info (if applicable) */}
            {promise.breach_reason && (
              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-red-400">
                    <XCircle className="h-4 w-4" />
                    Breach Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{promise.breach_reason}</p>
                </CardContent>
              </Card>
            )}

            {/* Audit History (Timeline) */}
            <Card className="bg-muted/30">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Audit History (Read-Only)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auditLogs && auditLogs.length > 0 ? (
                  <div className="space-y-2">
                    {auditLogs.slice(0, 10).map((log: any) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 text-xs p-2 bg-background/50 rounded"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        <div className="flex-1">
                          <p className="font-medium capitalize">{log.action_type}</p>
                          <p className="text-muted-foreground">
                            {format(new Date(log.server_timestamp), 'PPp')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No audit history available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Lock Status */}
            {promise.is_locked && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                <Lock className="h-4 w-4" />
                This promise is locked and permanently closed
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer - View Only */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Badge variant="outline" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Read-Only View
          </Badge>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Dashboard Component
export default function PromiseTrackerReadOnly() {
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<TrackerFilters>({});
  const [selectedPromiseId, setSelectedPromiseId] = useState<string | null>(null);

  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useTrackerMetrics();
  const { data: promises, isLoading: promisesLoading } = useTrackerPromises(filters);
  const { data: overduePromises } = useTrackerOverdue();
  const { data: escalatedPromises } = useTrackerEscalated();
  const { data: fulfilledPromises } = useTrackerFulfilled();
  const { lastUpdate } = useTrackerRealtime();
  const serverTime = useServerTime();
  const logView = useLogPromiseView();
  const logExport = useLogPromiseExport();

  // Log list view on mount
  useEffect(() => {
    logView.mutate({ viewType: 'list' });
  }, []);

  // Handle export
  const handleExport = useCallback(async (format: 'csv' | 'pdf') => {
    if (!promises || promises.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      // Log the export
      await logExport.mutateAsync({
        format,
        filterCriteria: filters,
        recordsExported: promises.length,
      });

      if (format === 'csv') {
        const csv = generatePromiseCSV(promises);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `promise-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('CSV exported successfully');
      } else {
        toast.info('PDF export coming soon');
      }
    } catch (error) {
      toast.error('Export failed');
    }
  }, [promises, filters, logExport]);

  // Get display data based on active tab
  const displayPromises = activeTab === 'overdue' 
    ? overduePromises 
    : activeTab === 'escalated' 
      ? escalatedPromises 
      : activeTab === 'fulfilled'
        ? fulfilledPromises
        : promises;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Promise Tracker</h1>
              <p className="text-muted-foreground">Real-time Monitoring (Read-Only)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              <Lock className="h-3 w-3 mr-1" />
              View Only Mode
            </Badge>
            <Button variant="outline" size="sm" onClick={() => refetchMetrics()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Metrics Cards (Clickable for filtering) */}
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
              <Card 
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => { setActiveTab('all'); setFilters({}); }}
              >
                <CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{metrics?.total_promises || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Promises</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-blue-500/10 border-blue-500/30 cursor-pointer hover:border-blue-500/50"
                onClick={() => { setActiveTab('all'); setFilters({ status: 'in_progress' }); }}
              >
                <CardContent className="p-4 text-center">
                  <Timer className="h-6 w-6 mx-auto text-blue-400 mb-2" />
                  <p className="text-2xl font-bold">{metrics?.active_promises || 0}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-red-500/10 border-red-500/30 cursor-pointer hover:border-red-500/50"
                onClick={() => setActiveTab('overdue')}
              >
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-6 w-6 mx-auto text-red-400 mb-2" />
                  <p className="text-2xl font-bold text-red-400">{metrics?.overdue_promises || 0}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-green-500/10 border-green-500/30 cursor-pointer hover:border-green-500/50"
                onClick={() => setActiveTab('fulfilled')}
              >
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 mx-auto text-green-400 mb-2" />
                  <p className="text-2xl font-bold">{metrics?.fulfilled_promises || 0}</p>
                  <p className="text-xs text-muted-foreground">Fulfilled</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-orange-500/10 border-orange-500/30 cursor-pointer hover:border-orange-500/50"
                onClick={() => setActiveTab('escalated')}
              >
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-6 w-6 mx-auto text-orange-400 mb-2" />
                  <p className="text-2xl font-bold">{metrics?.escalated_promises || 0}</p>
                  <p className="text-xs text-muted-foreground">Escalated</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto text-yellow-400 mb-2" />
                  <p className="text-2xl font-bold">{metrics?.pending_approval || 0}</p>
                  <p className="text-xs text-muted-foreground">Pending Approval</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, Task, or User..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
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
                Last sync: {serverTime.toLocaleTimeString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Promise List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Promise List (Read-Only)
              <Badge className="bg-blue-500/20 text-blue-400 ml-auto">
                Live Tracking
              </Badge>
              <Badge variant="outline" className="ml-2">
                {displayPromises?.length || 0} results
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="overdue" className="text-red-400">Overdue</TabsTrigger>
                <TabsTrigger value="escalated" className="text-orange-400">Escalated</TabsTrigger>
                <TabsTrigger value="fulfilled" className="text-green-400">Fulfilled</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Promise ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Role</TableHead>
                      <TableHead>User (Masked)</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Escalation</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promisesLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={8}>
                            <Skeleton className="h-12 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : displayPromises?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No promises found
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayPromises?.map((promise) => {
                        const config = getStatusConfig(promise.status);
                        const StatusIcon = config.icon;
                        const remaining = calculateRemainingTime(promise.due_date, serverTime);

                        return (
                          <TableRow
                            key={promise.promise_id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedPromiseId(promise.promise_id)}
                          >
                            <TableCell className="font-mono text-xs">
                              {promise.promise_id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <Badge className={config.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize">{promise.assigned_role}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {promise.assigned_user_masked}
                            </TableCell>
                            <TableCell className="text-xs">
                              {format(new Date(promise.due_date), 'MMM d, HH:mm')}
                            </TableCell>
                            <TableCell>
                              <span className={remaining.isOverdue ? 'text-red-400 font-bold' : 'text-green-400'}>
                                {remaining.text}
                              </span>
                            </TableCell>
                            <TableCell>
                              {promise.escalation_level > 0 ? (
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                  Level {promise.escalation_level}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        {/* Promise Detail Dialog */}
        {selectedPromiseId && (
          <PromiseDetailDialog
            promiseId={selectedPromiseId}
            onClose={() => setSelectedPromiseId(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
