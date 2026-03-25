import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import type { AMSection } from '../AMFullSidebar';
import {
  MonitorPlay,
  Eye,
  Pause,
  Square,
  Shield,
  Clock,
  User,
} from 'lucide-react';

interface AMActiveSessionsProps {
  system: ReturnType<typeof useAssistManagerSystem>;
  onNavigate: (section: AMSection) => void;
}

const maskId = (value: string) => `${value.slice(0, 4)}****${value.slice(-2)}`;

const formatDuration = (startedAt: string | null) => {
  if (!startedAt) return '--:--';
  const totalSeconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  return `${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${Math.floor(totalSeconds % 60).toString().padStart(2, '0')}`;
};

export function AMActiveSessions({ system, onNavigate }: AMActiveSessionsProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Active Sessions</h1>
            <p className="text-muted-foreground">Currently live assist connections</p>
          </div>
          <Badge variant="default" className="text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            {system.liveSessions.length} Live
          </Badge>
        </div>

        {/* Session Cards */}
        <div className="space-y-4">
          {system.liveSessions.map((session) => (
            <Card key={session.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Session Info */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Session ID</p>
                      <p className="font-mono text-sm font-medium">{session.session_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User (Masked)</p>
                      <p className="font-mono text-sm">{maskId(session.target_user_id)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Agent (Masked)</p>
                      <p className="font-mono text-sm">{maskId(session.agent_id)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <Badge variant="outline">{session.assist_type}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mode</p>
                      <Badge variant={session.permission_scope.includes('keyboard') || session.permission_scope.includes('mouse') ? 'destructive' : 'secondary'}>
                        {session.permission_scope.includes('keyboard') || session.permission_scope.includes('mouse') ? 'Control' : 'View'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono text-sm">{formatDuration(session.started_at)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">AI Score</p>
                      <span className={`font-medium ${session.ai_risk_score < 50 ? 'text-green-500' : session.ai_risk_score < 75 ? 'text-amber-500' : 'text-red-500'}`}>
                        {session.ai_risk_score}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Permissions</p>
                      <div className="flex gap-1 flex-wrap">
                        {session.permission_scope.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">
                            {p.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => { system.setSelectedSessionId(session.session_id); onNavigate('live_assist'); }}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => system.pauseSession.mutate({ session_id: session.session_id, reason: 'Paused from Active Sessions console' })}>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => system.endSession.mutate({ session_id: session.session_id, reason: 'Ended from Active Sessions console' })}>
                      <Square className="h-4 w-4 mr-1" />
                      End
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MonitorPlay className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{system.liveSessions.length}</p>
              <p className="text-xs text-muted-foreground">Active Now</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{new Set(system.sessions.map((session) => session.agent_id)).size}</p>
              <p className="text-xs text-muted-foreground">Agents Online</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs text-muted-foreground">Secure</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AMActiveSessions;
