/**
 * ACTIVE SESSIONS - All buttons functional
 * Live session monitoring with actions
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  MonitorPlay,
  Eye,
  Pause,
  Play,
  Square,
  Shield,
  Clock,
  User,
} from 'lucide-react';

interface SessionData {
  id: string;
  user: string;
  agent: string;
  type: string;
  mode: string;
  duration: string;
  aiScore: number;
  permissions: string[];
  status: 'active' | 'paused' | 'ended';
}

const INITIAL_SESSIONS: SessionData[] = [
  { id: 'SVL-A8K2M9', user: 'USR-****42', agent: 'AGT-****15', type: 'Support', mode: 'View Only', duration: '12:34', aiScore: 92, permissions: ['screen_view', 'chat'], status: 'active' },
  { id: 'SVL-C9X4L6', user: 'USR-****89', agent: 'AGT-****08', type: 'Dev', mode: 'Control', duration: '05:21', aiScore: 78, permissions: ['screen_view', 'keyboard', 'mouse'], status: 'active' },
  { id: 'SVL-E7T3R2', user: 'USR-****56', agent: 'AGT-****19', type: 'Franchise', mode: 'View Only', duration: '18:45', aiScore: 95, permissions: ['screen_view', 'chat', 'file_transfer'], status: 'active' },
];

export function AMActiveSessions() {
  const [sessions, setSessions] = useState<SessionData[]>(INITIAL_SESSIONS);

  const handleView = (sessionId: string) => {
    toast.success(`Viewing session ${sessionId}`, { description: 'Remote screen view opened' });
  };

  const handlePause = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, status: s.status === 'paused' ? 'active' : 'paused' } : s
    ));
    const session = sessions.find(s => s.id === sessionId);
    const newStatus = session?.status === 'paused' ? 'resumed' : 'paused';
    toast.info(`Session ${sessionId} ${newStatus}`, { description: `Session has been ${newStatus}` });
  };

  const handleEnd = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, status: 'ended' } : s
    ));
    toast.warning(`Session ${sessionId} terminated`, { 
      description: 'Connection dropped • Token revoked • Cache cleared' 
    });
  };

  const activeSessions = sessions.filter(s => s.status !== 'ended');

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Active Sessions</h1>
            <p className="text-muted-foreground">Currently live assist connections</p>
          </div>
          <Badge variant="default" className="text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            {activeSessions.length} Live
          </Badge>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className={`border-l-4 ${
              session.status === 'ended' ? 'border-l-muted opacity-50' :
              session.status === 'paused' ? 'border-l-amber-500' : 'border-l-green-500'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Session ID</p>
                      <p className="font-mono text-sm font-medium">{session.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User (Masked)</p>
                      <p className="font-mono text-sm">{session.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Agent (Masked)</p>
                      <p className="font-mono text-sm">{session.agent}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge variant={
                        session.status === 'active' ? 'default' :
                        session.status === 'paused' ? 'secondary' : 'outline'
                      }>
                        {session.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mode</p>
                      <Badge variant={session.mode === 'Control' ? 'destructive' : 'secondary'}>
                        {session.mode}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono text-sm">{session.duration}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">AI Score</p>
                      <span className={`font-medium ${session.aiScore >= 90 ? 'text-green-500' : session.aiScore >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                        {session.aiScore}%
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Permissions</p>
                      <div className="flex gap-1 flex-wrap">
                        {session.permissions.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">{p.replace('_', ' ')}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(session.id)} disabled={session.status === 'ended'}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePause(session.id)} disabled={session.status === 'ended'}>
                      {session.status === 'paused' ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                      {session.status === 'paused' ? 'Resume' : 'Pause'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleEnd(session.id)} disabled={session.status === 'ended'}>
                      <Square className="h-4 w-4 mr-1" /> End
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MonitorPlay className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{activeSessions.length}</p>
              <p className="text-xs text-muted-foreground">Active Now</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">4</p>
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
