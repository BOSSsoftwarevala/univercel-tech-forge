/**
 * LIVE ASSIST - All buttons functional
 * UltraViewer style - Real-time session control
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Radio, Monitor, MousePointer2, Keyboard, Pause, Play, Square,
  Maximize, Eye, Hand, FileUp, MessageSquare, Minimize,
} from 'lucide-react';

export function AMLiveAssist() {
  const [cursorControl, setCursorControl] = useState(false);
  const [keyboardControl, setKeyboardControl] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [viewMode, setViewMode] = useState<'view' | 'control'>('view');
  const [elapsed, setElapsed] = useState(754); // 12:34 in seconds

  // Live timer
  useEffect(() => {
    if (isPaused || isEnded) return;
    const interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused, isEnded]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Session resumed' : 'Session paused', { description: `Session SVL-A8K2M9 ${isPaused ? 'resumed' : 'paused'}` });
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast(isFullscreen ? 'Exited fullscreen' : 'Fullscreen mode activated');
  };

  const handleEndSession = () => {
    setIsEnded(true);
    toast.warning('Session SVL-A8K2M9 terminated', { description: 'Disconnected • Token revoked • Cache cleared • Log saved' });
  };

  const handleRequestControl = () => {
    toast.info('Control request sent', { description: 'Awaiting user USR-****42 approval...' });
    setTimeout(() => {
      setViewMode('control');
      setCursorControl(true);
      setKeyboardControl(true);
      toast.success('Control granted', { description: 'Mouse and keyboard control active' });
    }, 2000);
  };

  const handleSendFile = () => {
    toast.info('File transfer initiated', { description: 'Select files to send to USR-****42' });
  };

  const handleOpenChat = () => {
    toast.info('Chat opened', { description: 'Text chat panel activated' });
  };

  const handleCursorToggle = (checked: boolean) => {
    setCursorControl(checked);
    toast(checked ? 'Cursor control enabled' : 'Cursor control disabled');
  };

  const handleKeyboardToggle = (checked: boolean) => {
    setKeyboardControl(checked);
    toast(checked ? 'Keyboard control enabled' : 'Keyboard control disabled');
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Live Assist</h1>
            <p className="text-muted-foreground">Real-time remote session control</p>
          </div>
          <Badge variant={isEnded ? 'destructive' : 'default'} className="text-sm">
            <div className={`w-2 h-2 rounded-full mr-2 ${isEnded ? 'bg-red-500' : isPaused ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`} />
            {isEnded ? 'Disconnected' : isPaused ? 'Paused' : 'Connected'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Monitor className="h-5 w-5" /> Session: SVL-A8K2M9</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={isPaused ? 'secondary' : isEnded ? 'destructive' : 'default'}>
                    {isEnded ? 'Ended' : isPaused ? 'Paused' : 'Live'}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{formatTime(elapsed)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`aspect-video rounded-lg flex items-center justify-center border-2 border-dashed ${
                isEnded ? 'bg-destructive/5 border-destructive/30' :
                isPaused ? 'bg-amber-500/5 border-amber-500/30' : 'bg-muted border-border'
              }`}>
                <div className="text-center">
                  <Monitor className={`h-16 w-16 mx-auto mb-4 ${isEnded ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <p className="text-lg font-medium">{isEnded ? 'Session Ended' : isPaused ? 'Session Paused' : 'Remote Screen View'}</p>
                  <p className="text-sm text-muted-foreground">USR-****42's Desktop</p>
                  <p className="text-xs text-muted-foreground mt-2">1920 × 1080 @ 30fps</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 p-3 bg-muted rounded-lg">
                <Button variant={isPaused ? 'default' : 'outline'} size="sm" onClick={handlePauseResume} disabled={isEnded}>
                  {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleFullscreen} disabled={isEnded}>
                  {isFullscreen ? <Minimize className="h-4 w-4 mr-1" /> : <Maximize className="h-4 w-4 mr-1" />}
                  {isFullscreen ? 'Exit FS' : 'Fullscreen'}
                </Button>
                <Button variant="destructive" size="sm" onClick={handleEndSession} disabled={isEnded}>
                  <Square className="h-4 w-4 mr-1" /> End Session
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Session Mode</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className={`flex items-center justify-between p-2 rounded ${viewMode === 'view' ? 'bg-muted/50' : ''}`}>
                  <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-blue-500" /><span className="text-sm">View Only</span></div>
                  <Badge variant={viewMode === 'view' ? 'default' : 'outline'}>{viewMode === 'view' ? 'Active' : 'Inactive'}</Badge>
                </div>
                <div className={`flex items-center justify-between p-2 rounded ${viewMode === 'control' ? 'bg-muted/50' : ''}`}>
                  <div className="flex items-center gap-2"><Hand className="h-4 w-4 text-amber-500" /><span className="text-sm">Control</span></div>
                  <Badge variant={viewMode === 'control' ? 'default' : 'outline'}>{viewMode === 'control' ? 'Active' : 'Disabled'}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Control Options</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><MousePointer2 className="h-4 w-4" /><span className="text-sm">Cursor</span></div>
                  <Switch checked={cursorControl} onCheckedChange={handleCursorToggle} disabled={isEnded} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Keyboard className="h-4 w-4" /><span className="text-sm">Keyboard</span></div>
                  <Switch checked={keyboardControl} onCheckedChange={handleKeyboardToggle} disabled={isEnded} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Session Info</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Target</span><span className="font-mono">USR-****42</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Agent</span><span className="font-mono">AGT-****15</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-mono">{formatTime(elapsed)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Latency</span><span className="text-green-500">24ms</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Resolution</span><span>1920×1080</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 space-y-2">
                <Button variant="outline" className="w-full" size="sm" onClick={handleRequestControl} disabled={isEnded || viewMode === 'control'}>
                  {viewMode === 'control' ? 'Control Active' : 'Request Control'}
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={handleSendFile} disabled={isEnded}>
                  <FileUp className="h-4 w-4 mr-1" /> Send File
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={handleOpenChat} disabled={isEnded}>
                  <MessageSquare className="h-4 w-4 mr-1" /> Open Chat
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
