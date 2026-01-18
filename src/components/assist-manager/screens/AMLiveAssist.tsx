/**
 * LIVE ASSIST
 * UltraViewer style - Real-time session control
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
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

export function AMLiveAssist() {
  const [cursorControl, setCursorControl] = useState(false);
  const [keyboardControl, setKeyboardControl] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Live Assist</h1>
            <p className="text-muted-foreground">Real-time remote session control</p>
          </div>
          <Badge variant="default" className="text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Connected
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Screen View */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Session: SVL-A8K2M9
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={isPaused ? 'secondary' : 'default'}>
                    {isPaused ? 'Paused' : 'Live'}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">12:34:56</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Screen Preview Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <Monitor className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Remote Screen View</p>
                  <p className="text-sm text-muted-foreground">USR-****42's Desktop</p>
                  <p className="text-xs text-muted-foreground mt-2">1920 × 1080 @ 30fps</p>
                </div>
              </div>

              {/* Control Bar */}
              <div className="flex items-center justify-center gap-4 mt-4 p-3 bg-muted rounded-lg">
                <Button 
                  variant={isPaused ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize className="h-4 w-4 mr-1" />
                  Fullscreen
                </Button>
                <Button variant="destructive" size="sm">
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
                    onCheckedChange={setCursorControl}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    <span className="text-sm">Keyboard Control</span>
                  </div>
                  <Switch 
                    checked={keyboardControl}
                    onCheckedChange={setKeyboardControl}
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
                  <span className="font-mono">USR-****42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent</span>
                  <span className="font-mono">AGT-****15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-mono">12:34</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="text-green-500">24ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution</span>
                  <span>1920×1080</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-3 space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  Request Control
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Send File
                </Button>
                <Button variant="outline" className="w-full" size="sm">
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
