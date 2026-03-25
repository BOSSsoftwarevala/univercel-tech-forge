import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import type useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import type { AMSection } from '../AMFullSidebar';
import {
  Radio,
  Monitor,
  MousePointer2,
  Keyboard,
  Pause,
  Play,
  Square,
  Maximize,
  Eye,
  Hand,
} from 'lucide-react';

interface AMLiveAssistProps {
  system: ReturnType<typeof useAssistManagerSystem>;
  onNavigate: (section: AMSection) => void;
}

const maskId = (value: string) => `${value.slice(0, 4)}****${value.slice(-2)}`;

export function AMLiveAssist({ system, onNavigate }: AMLiveAssistProps) {
  const [cursorControl, setCursorControl] = useState(false);
  const [keyboardControl, setKeyboardControl] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [permissionToken, setPermissionToken] = useState('');

  const session = system.sessionDetail?.session || system.sessions.find((item) => item.session_id === system.selectedSessionId) || system.liveSessions[0];
  const activeToken = session ? system.permissionTokens[session.session_id] || permissionToken : permissionToken;

  const updateControl = (scope: 'mouse' | 'keyboard', enabled: boolean) => {
    if (!session) return;
    if (scope === 'mouse') setCursorControl(enabled);
    if (scope === 'keyboard') setKeyboardControl(enabled);
    system.sendControlEvent.mutate({
      session_id: session.session_id,
      event_type: enabled ? `${scope}_enabled` : `${scope}_disabled`,
      scope,
      payload: { enabled },
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Live Assist</h1>
            <p className="text-muted-foreground">Real-time remote session control backed by audited signaling and permission enforcement</p>
          </div>
          <Badge variant="default" className="text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            {session?.status || 'No Session'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Screen View */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Session: {session?.session_id || 'Select a session'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={session?.status === 'paused' || isPaused ? 'secondary' : 'default'}>
                    {session?.status === 'paused' || isPaused ? 'Paused' : session?.status || 'Idle'}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{session?.started_at ? new Date(session.started_at).toLocaleTimeString() : '--:--:--'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Screen Preview Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <Monitor className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Remote Screen View</p>
                  <p className="text-sm text-muted-foreground">{session ? `${maskId(session.target_user_id)} desktop relay` : 'No active relay selected'}</p>
                  <p className="text-xs text-muted-foreground mt-2">Safe relay signaling is active once the permission token starts the approved session.</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <Input placeholder="Permission token required to start approved sessions" value={activeToken} onChange={(event) => setPermissionToken(event.target.value)} />
                <Button disabled={!session || session.status !== 'approved' || !activeToken} onClick={() => session && system.startSession.mutate({ session_id: session.session_id, permission_token: activeToken })}>
                  Start Approved Session
                </Button>
                <Button variant="outline" onClick={() => onNavigate('active_sessions')}>
                  Browse Sessions
                </Button>
              </div>

              {/* Control Bar */}
              <div className="flex items-center justify-center gap-4 mt-4 p-3 bg-muted rounded-lg">
                <Button 
                  variant={isPaused ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setIsPaused(!isPaused);
                    if (session) {
                      system.pauseSession.mutate({ session_id: session.session_id, reason: 'Paused from Live Assist surface' });
                    }
                  }}
                >
                  {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize className="h-4 w-4 mr-1" />
                  Fullscreen
                </Button>
                <Button variant="destructive" size="sm" onClick={() => session && system.endSession.mutate({ session_id: session.session_id, reason: 'Ended from Live Assist surface' })}>
                  <Square className="h-4 w-4 mr-1" />
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Control Panel */}
          <div className="space-y-4">
            {/* Mode Toggle */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Session Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">View Only</span>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center gap-2">
                    <Hand className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Control</span>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Control Toggles */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Control Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointer2 className="h-4 w-4" />
                    <span className="text-sm">Cursor Control</span>
                  </div>
                  <Switch 
                    checked={cursorControl}
                    onCheckedChange={(checked) => updateControl('mouse', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    <span className="text-sm">Keyboard Control</span>
                  </div>
                  <Switch 
                    checked={keyboardControl}
                    onCheckedChange={(checked) => updateControl('keyboard', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target</span>
                  <span className="font-mono">{session ? maskId(session.target_user_id) : '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent</span>
                  <span className="font-mono">{session ? maskId(session.agent_id) : '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-mono">{session?.max_duration_minutes || 0} min max</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="text-green-500">relay-managed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution</span>
                  <span>{session?.relay_session_id ? 'Signaling Ready' : 'Pending Relay'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-3 space-y-2">
                <Button variant="outline" className="w-full" size="sm" onClick={() => session && system.sendControlEvent.mutate({ session_id: session.session_id, event_type: 'request_control', scope: 'mouse', payload: { requested: true } })}>
                  Request Control
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={() => onNavigate('file_transfer')}>
                  Send File
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={() => onNavigate('chat_voice')}>
                  Open Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AMLiveAssist;
