/**
 * Assist Manager Screen (Role 26)
 * 
 * RULES:
 * - NEVER assists clients directly
 * - CONTROLS who can assist, how, and when
 * - CANNOT access wallet, payments, roles, or admin core
 * - Every assist action must be visible, traceable, and stoppable
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Headphones, 
  Users, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Shield,
  BarChart3,
  Star,
  Loader2,
  XCircle,
  Eye,
  StopCircle,
  AlertOctagon,
  FileText,
  Settings2,
  Ban
} from 'lucide-react';
import { useSafeAssistSessions, useSafeAssistMetrics, useSafeAssistAlerts } from '@/hooks/useSafeAssistData';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

// Custom hooks for Assist Manager specific data
function useAssistRequestQueue() {
  return useQuery({
    queryKey: ['assist-request-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assist_request_queue')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

function useAbuseFlags() {
  return useQuery({
    queryKey: ['assist-abuse-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assist_abuse_flags')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

function useForceEndLogs() {
  return useQuery({
    queryKey: ['assist-force-end-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assist_force_end_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });
}

function useForceEndSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sessionId, reason }: { sessionId: string; reason: string }) => {
      const { data, error } = await supabase
        .rpc('force_end_assist_session', { 
          p_session_id: sessionId, 
          p_reason: reason,
          p_end_type: 'force_single'
        });
      if (error) throw error;
      const result = data as { success?: boolean; error?: string; session_id?: string } | null;
      if (!result?.success) throw new Error(result?.error || 'Failed to force end session');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safe-assist-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['assist-force-end-logs'] });
      toast.success('Session force ended successfully');
    },
    onError: (error) => {
      toast.error('Failed to force end session: ' + error.message);
    },
  });
}

function useForceEndAllSessions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reason: string) => {
      const { data, error } = await supabase
        .rpc('force_end_all_assist_sessions', { p_reason: reason });
      if (error) throw error;
      const result = data as { success?: boolean; error?: string; sessions_ended?: number } | null;
      if (!result?.success) throw new Error(result?.error || 'Failed to force end all sessions');
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['safe-assist-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['assist-force-end-logs'] });
      toast.success(`Force ended ${data?.sessions_ended || 0} sessions`);
    },
    onError: (error) => {
      toast.error('Failed to force end all sessions: ' + error.message);
    },
  });
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': case 'connected': return 'bg-green-500/20 text-green-400';
    case 'pending': return 'bg-yellow-500/20 text-yellow-400';
    case 'ended': return 'bg-slate-500/20 text-slate-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};

export function AssistManagerScreen() {
  const { data: sessions, isLoading: sessionsLoading } = useSafeAssistSessions();
  const { data: metrics, isLoading: metricsLoading } = useSafeAssistMetrics();
  const { data: alerts } = useSafeAssistAlerts();
  const { data: requestQueue } = useAssistRequestQueue();
  const { data: abuseFlags } = useAbuseFlags();
  const { data: forceEndLogs } = useForceEndLogs();
  
  const forceEndSession = useForceEndSession();
  const forceEndAllSessions = useForceEndAllSessions();
  
  const [forceEndDialog, setForceEndDialog] = useState<{ open: boolean; sessionId?: string; sessionCode?: string }>({ open: false });
  const [forceEndAllDialog, setForceEndAllDialog] = useState(false);
  const [forceEndReason, setForceEndReason] = useState('');
  const [activeTab, setActiveTab] = useState<'sessions' | 'requests' | 'flags' | 'logs'>('sessions');

  const isLoading = sessionsLoading || metricsLoading;

  // Get counts
  const activeSessions = React.useMemo(() => 
    sessions?.filter(s => ['active', 'connected', 'pending'].includes(s.status)) || [], 
    [sessions]
  );
  const todaySessions = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions?.filter(s => new Date(s.created_at) >= today) || [];
  }, [sessions]);
  const forcedEndCount = React.useMemo(() => 
    forceEndLogs?.filter(l => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(l.created_at) >= today;
    }).length || 0, 
    [forceEndLogs]
  );
  const pendingRequests = requestQueue?.filter(r => r.status === 'pending') || [];

  const handleForceEnd = () => {
    if (!forceEndReason.trim() || forceEndReason.length < 5) {
      toast.error('Please provide a valid reason (minimum 5 characters)');
      return;
    }
    if (forceEndDialog.sessionId) {
      forceEndSession.mutate({ sessionId: forceEndDialog.sessionId, reason: forceEndReason });
    }
    setForceEndDialog({ open: false });
    setForceEndReason('');
  };

  const handleForceEndAll = () => {
    if (!forceEndReason.trim() || forceEndReason.length < 5) {
      toast.error('Please provide a valid reason (minimum 5 characters)');
      return;
    }
    forceEndAllSessions.mutate(forceEndReason);
    setForceEndAllDialog(false);
    setForceEndReason('');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sky-500/20 rounded-xl">
            <Shield className="h-8 w-8 text-sky-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Assist Manager</h1>
            <p className="text-muted-foreground">Control & Orchestrate Safe Assist Operations</p>
          </div>
        </div>
        <div className="flex gap-2">
          {activeSessions.length > 0 && (
            <Button 
              variant="destructive"
              onClick={() => setForceEndAllDialog(true)}
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Force End All ({activeSessions.length})
            </Button>
          )}
        </div>
      </div>

      {/* Top Metrics (READ-ONLY) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:border-primary/50" onClick={() => setActiveTab('sessions')}>
          <CardContent className="p-4 text-center">
            <Headphones className="h-6 w-6 mx-auto text-green-400 mb-2" />
            <p className="text-2xl font-bold">{activeSessions.length}</p>
            <p className="text-xs text-muted-foreground">Active Sessions</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50" onClick={() => setActiveTab('requests')}>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 mx-auto text-blue-400 mb-2" />
            <p className="text-2xl font-bold">{todaySessions.length}</p>
            <p className="text-xs text-muted-foreground">Requests Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-yellow-400 mb-2" />
            <p className="text-2xl font-bold">{metrics?.avgDuration || 0}m</p>
            <p className="text-xs text-muted-foreground">Avg Duration</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50" onClick={() => setActiveTab('logs')}>
          <CardContent className="p-4 text-center">
            <XCircle className="h-6 w-6 mx-auto text-orange-400 mb-2" />
            <p className="text-2xl font-bold">{forcedEndCount}</p>
            <p className="text-xs text-muted-foreground">Forced Stops Today</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50" onClick={() => setActiveTab('flags')}>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto text-red-400 mb-2" />
            <p className="text-2xl font-bold">{abuseFlags?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Flagged Issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { id: 'sessions', label: 'Active Sessions', icon: Eye },
          { id: 'requests', label: 'Pending Requests', icon: FileText, count: pendingRequests.length },
          { id: 'flags', label: 'Abuse Flags', icon: AlertOctagon, count: abuseFlags?.length },
          { id: 'logs', label: 'Force End Logs', icon: FileText },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Badge variant="secondary" className="ml-1">{tab.count}</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Assist Session List (READ-ONLY)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Assisted User</TableHead>
                  <TableHead>Support Staff</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Consent Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No sessions found
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions?.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-mono text-sm">{session.session_code}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">User-{session.user_id?.slice(0, 4)}****</span>
                      </TableCell>
                      <TableCell>
                        {session.agent_masked_id || (session.support_agent_id ? `Agent-${session.support_agent_id.slice(0, 4)}****` : '-')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {session.started_at ? format(new Date(session.started_at), 'HH:mm:ss') : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {session.started_at 
                          ? formatDistanceToNow(new Date(session.started_at), { addSuffix: false })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {session.mode === 'readonly' ? 'Read-Only' : 'Navigation'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {['active', 'connected', 'pending'].includes(session.status) && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setForceEndDialog({ 
                              open: true, 
                              sessionId: session.id,
                              sessionCode: session.session_code 
                            })}
                          >
                            <StopCircle className="h-3 w-3 mr-1" />
                            Force End
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pending Requests Tab */}
      {activeTab === 'requests' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assist Request Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Requested Staff</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestQueue?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No pending requests
                    </TableCell>
                  </TableRow>
                ) : (
                  requestQueue?.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-sm">{req.id.slice(0, 8)}</TableCell>
                      <TableCell>User-{req.requesting_user_id?.slice(0, 4)}****</TableCell>
                      <TableCell>{req.requested_support_staff_id?.slice(0, 8) || 'Any'}</TableCell>
                      <TableCell>{req.requested_duration_minutes}min</TableCell>
                      <TableCell>
                        <Badge variant="outline">{req.requested_mode}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          req.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {req.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-green-400">
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-400">
                              <Ban className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Abuse Flags Tab */}
      {activeTab === 'flags' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-red-400" />
              Active Abuse Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {abuseFlags?.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-400" />
                <p>No abuse flags detected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {abuseFlags?.map((flag) => (
                  <div key={flag.id} className={`p-4 rounded-lg border ${getSeverityColor(flag.severity)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-medium capitalize">{flag.flag_type.replace(/_/g, ' ')}</span>
                      </div>
                      <Badge className={getSeverityColor(flag.severity)}>
                        {flag.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Staff ID: {flag.staff_id?.slice(0, 8)}**** • Count: {flag.flag_count}
                    </p>
                    <p className="text-xs">
                      Flagged: {format(new Date(flag.created_at), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Force End Logs Tab */}
      {activeTab === 'logs' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Force End Audit Logs (IMMUTABLE)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Ended By</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forceEndLogs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No force end logs
                    </TableCell>
                  </TableRow>
                ) : (
                  forceEndLogs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.created_at), 'MMM dd, HH:mm')}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.session_id?.slice(0, 8)}</TableCell>
                      <TableCell>{log.ended_by?.slice(0, 8)}****</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.ended_by_role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          log.end_type === 'force_all' ? 'bg-red-500/20 text-red-400' :
                          'bg-orange-500/20 text-orange-400'
                        }>
                          {log.end_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{Math.floor((log.session_duration_seconds || 0) / 60)}m</TableCell>
                      <TableCell className="max-w-[200px] truncate">{log.reason}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Force End Single Session Dialog */}
      <Dialog open={forceEndDialog.open} onOpenChange={(open) => setForceEndDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <StopCircle className="h-5 w-5" />
              Force End Session
            </DialogTitle>
            <DialogDescription>
              You are about to force end session <strong>{forceEndDialog.sessionCode}</strong>. 
              This action is logged and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason (Required)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for force ending this session (minimum 5 characters)..."
                value={forceEndReason}
                onChange={(e) => setForceEndReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForceEndDialog({ open: false })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleForceEnd}
              disabled={forceEndSession.isPending || forceEndReason.length < 5}
            >
              {forceEndSession.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <StopCircle className="h-4 w-4 mr-2" />
              )}
              Force End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force End All Sessions Dialog */}
      <Dialog open={forceEndAllDialog} onOpenChange={setForceEndAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertOctagon className="h-5 w-5" />
              Force End ALL Active Sessions
            </DialogTitle>
            <DialogDescription>
              This will immediately terminate <strong>{activeSessions.length}</strong> active sessions.
              This action is logged and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason-all">Reason (Required)</Label>
              <Textarea
                id="reason-all"
                placeholder="Enter reason for force ending all sessions (minimum 5 characters)..."
                value={forceEndReason}
                onChange={(e) => setForceEndReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForceEndAllDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleForceEndAll}
              disabled={forceEndAllSessions.isPending || forceEndReason.length < 5}
            >
              {forceEndAllSessions.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <AlertOctagon className="h-4 w-4 mr-2" />
              )}
              Force End All Sessions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
