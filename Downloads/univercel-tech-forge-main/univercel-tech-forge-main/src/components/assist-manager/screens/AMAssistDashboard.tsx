import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import { Radio, Clock, CheckCircle, XCircle, Brain, AlertTriangle, MonitorPlay, Users } from 'lucide-react';
import type { AMSection } from '../AMFullSidebar';

interface AMAssistDashboardProps {
  onNavigate: (section: AMSection) => void;
  system: ReturnType<typeof useAssistManagerSystem>;
}

const maskId = (value: string) => `${value.slice(0, 4)}****${value.slice(-2)}`;

const formatDuration = (startedAt: string | null, endedAt: string | null) => {
  if (!startedAt) return '--:--';
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const totalSeconds = Math.max(0, Math.floor((end - new Date(startedAt).getTime()) / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export function AMAssistDashboard({ onNavigate, system }: AMAssistDashboardProps) {
  const cards = [
    { id: 'active_sessions', label: 'Live Sessions', value: system.metrics.activeSessions, icon: Radio, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'session_requests', label: 'Pending Requests', value: system.metrics.pendingRequests, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'pending_approval', label: 'Approved Sessions', value: system.metrics.approvedSessions, icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'emergency_stop', label: 'Blocked Sessions', value: system.metrics.blockedSessions, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 'ai_assist_layer', label: 'AI Assisted', value: system.metrics.aiAssisted, icon: Brain, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { id: 'emergency_stop', label: 'Security Alerts', value: system.metrics.securityAlerts, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Assist Dashboard</h1>
            <p className="text-muted-foreground">VALA Connect remote control system with approval, audit, and AI risk tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">{system.isLoading ? 'Syncing live state' : 'System Online'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} className="cursor-pointer hover:border-primary transition-colors" onClick={() => onNavigate(card.id as AMSection)}>
                <CardContent className="p-4">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorPlay className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Session ID</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">User (Masked)</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Agent (Masked)</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {system.dashboard?.recentSessions?.length ? system.dashboard.recentSessions.map((session) => (
                    <tr key={session.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3 font-mono text-xs">{session.session_id}</td>
                      <td className="px-4 py-3 font-mono text-xs">{maskId(session.target_user_id)}</td>
                      <td className="px-4 py-3 font-mono text-xs">{maskId(session.agent_id)}</td>
                      <td className="px-4 py-3">{session.assist_type}</td>
                      <td className="px-4 py-3">
                        <Badge variant={session.status === 'active' ? 'default' : session.status === 'pending' || session.status === 'approved' ? 'secondary' : 'outline'} className="text-xs">
                          {session.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{formatDuration(session.started_at, session.ended_at)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No assist sessions have been recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Online Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {system.sessions.slice(0, 4).map((session, index) => (
                <div key={session.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs">{maskId(session.agent_id)}</p>
                    <p className="text-xs text-muted-foreground">{session.status === 'active' ? 'In Session' : 'Available'}</p>
                  </div>
                  <div className={`ml-auto h-2 w-2 rounded-full ${index < 2 ? 'bg-amber-500' : 'bg-green-500'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMAssistDashboard;
