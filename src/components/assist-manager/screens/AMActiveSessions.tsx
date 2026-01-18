/**
 * ACTIVE SESSIONS
 * Live session monitoring with actions
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MonitorPlay,
  Eye,
  Pause,
  Square,
  Shield,
  Clock,
  User,
} from 'lucide-react';

const ACTIVE_SESSIONS = [
  { 
    id: 'SVL-A8K2M9', 
    user: 'USR-****42', 
    agent: 'AGT-****15', 
    type: 'Support',
    mode: 'View Only',
    duration: '12:34',
    aiScore: 92,
    permissions: ['screen_view', 'chat'],
  },
  { 
    id: 'SVL-C9X4L6', 
    user: 'USR-****89', 
    agent: 'AGT-****08', 
    type: 'Dev',
    mode: 'Control',
    duration: '05:21',
    aiScore: 78,
    permissions: ['screen_view', 'keyboard', 'mouse'],
  },
  { 
    id: 'SVL-E7T3R2', 
    user: 'USR-****56', 
    agent: 'AGT-****19', 
    type: 'Franchise',
    mode: 'View Only',
    duration: '18:45',
    aiScore: 95,
    permissions: ['screen_view', 'chat', 'file_transfer'],
  },
];

export function AMActiveSessions() {
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
            {ACTIVE_SESSIONS.length} Live
          </Badge>
        </div>

        {/* Session Cards */}
        <div className="space-y-4">
          {ACTIVE_SESSIONS.map((session) => (
            <Card key={session.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Session Info */}
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
                      <p className="text-xs text-muted-foreground">Type</p>
                      <Badge variant="outline">{session.type}</Badge>
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
                          <Badge key={p} variant="outline" className="text-xs">
                            {p.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                    <Button size="sm" variant="destructive">
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
              <p className="text-2xl font-bold">{ACTIVE_SESSIONS.length}</p>
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
