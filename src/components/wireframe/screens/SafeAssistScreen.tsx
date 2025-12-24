import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Shield, 
  Eye, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Monitor,
  Lock,
  Unlock,
  Video,
  Activity,
  Zap,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useSafeAssistSessions, useSafeAssistAlerts, useSafeAssistMetrics } from '@/hooks/useSafeAssistData';
import { useEndSession, useTerminateSession } from '@/hooks/useSafeAssistActions';
import { formatDistanceToNow } from 'date-fns';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400';
    case 'pending': return 'bg-yellow-500/20 text-yellow-400';
    case 'ended': return 'bg-slate-500/20 text-slate-400';
    case 'expired': return 'bg-red-500/20 text-red-400';
    case 'cancelled': return 'bg-slate-500/20 text-slate-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getRiskColor = (score: number) => {
  if (score >= 70) return 'text-red-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-green-500';
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-400';
    case 'high': return 'bg-orange-500/20 text-orange-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    case 'low': return 'bg-blue-500/20 text-blue-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function SafeAssistScreen() {
  const [sessionCode, setSessionCode] = useState('');
  
  const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useSafeAssistSessions();
  const { data: alerts, isLoading: alertsLoading, refetch: refetchAlerts } = useSafeAssistAlerts();
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useSafeAssistMetrics();
  
  const endSession = useEndSession();
  const terminateSession = useTerminateSession();

  const handleRefresh = () => {
    refetchSessions();
    refetchAlerts();
    refetchMetrics();
  };

  const activeSessions = sessions?.filter(s => s.status === 'active' || s.status === 'pending') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Shield className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Safe Assist</h1>
            <p className="text-muted-foreground">AI-Monitored Remote Support Sessions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Enter session code..." 
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              className="w-48"
            />
            <Button>
              <Video className="h-4 w-4 mr-2" />
              Join Session
            </Button>
          </div>
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
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Monitor className="h-6 w-6 mx-auto text-green-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.activeSessions || 0}</p>
                <p className="text-xs text-muted-foreground">Active Sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto text-blue-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.totalToday || 0}</p>
                <p className="text-xs text-muted-foreground">Total Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto text-cyan-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.avgDuration || '0:00'}</p>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto text-yellow-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.aiAlerts || 0}</p>
                <p className="text-xs text-muted-foreground">AI Alerts</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-4 text-center">
                <Zap className="h-6 w-6 mx-auto text-red-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.terminatedByAI || 0}</p>
                <p className="text-xs text-muted-foreground">AI Terminated</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-400 mb-2" />
                <p className="text-2xl font-bold">{metrics?.satisfactionRate || 0}%</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Sessions
              <Badge className="bg-green-500/20 text-green-400 ml-auto">
                {activeSessions.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{session.session_code}</span>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {session.started_at 
                            ? formatDistanceToNow(new Date(session.started_at), { addSuffix: true })
                            : 'Not started'}
                        </span>
                        {session.status === 'active' && (
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">User</p>
                        <p className="font-medium">{session.user_role}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Agent</p>
                        <p className="font-medium">{session.agent_masked_id || 'Unassigned'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">AI Risk</p>
                        <p className={`font-bold ${getRiskColor(session.ai_risk_score || 0)}`}>
                          {session.ai_risk_score || 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Mode</p>
                        <p className="font-medium">{session.mode}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
                      <div className="flex items-center gap-1 text-xs">
                        {session.user_consent_given ? (
                          <><Unlock className="h-3 w-3 text-green-400" /> Consent</>
                        ) : (
                          <><Lock className="h-3 w-3 text-yellow-400" /> Pending</>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {session.dual_verified ? (
                          <><CheckCircle2 className="h-3 w-3 text-green-400" /> Verified</>
                        ) : (
                          <><AlertTriangle className="h-3 w-3 text-yellow-400" /> Unverified</>
                        )}
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" /> Watch
                        </Button>
                        {session.status === 'active' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => endSession.mutate(session.id)}
                              disabled={endSession.isPending}
                            >
                              {endSession.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'End'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => terminateSession.mutate({ sessionId: session.id })}
                              disabled={terminateSession.isPending}
                            >
                              {terminateSession.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Terminate'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No Active Sessions</p>
                <p className="text-sm">Sessions will appear here when users request support</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Monitoring Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : alerts && alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={getSeverityColor(alert.risk_level || 'low')}>
                        {alert.risk_level || 'info'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp 
                          ? formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })
                          : 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{alert.event_type}</p>
                    {alert.action_recommended && (
                      <p className="text-xs text-muted-foreground">Recommended: {alert.action_recommended}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500 opacity-50" />
                <p className="text-sm">No recent alerts</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="font-medium">AI Protection Active</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All sessions are monitored in real-time. Suspicious activity triggers automatic alerts and can terminate sessions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
