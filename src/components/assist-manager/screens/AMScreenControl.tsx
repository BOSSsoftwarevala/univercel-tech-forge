/**
 * SCREEN CONTROL
 * Deep control categories - View/Control/Pause/Resume/Freeze
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Monitor,
  Eye,
  Hand,
  Pause,
  Play,
  Snowflake,
  MousePointer2,
  Keyboard,
  AppWindow,
  Maximize,
} from 'lucide-react';

const CONTROL_MODES = [
  { id: 'view', label: 'View Only', icon: Eye, description: 'Watch screen without any control', status: 'active' },
  { id: 'control', label: 'Control', icon: Hand, description: 'Full mouse and keyboard control', status: 'disabled' },
  { id: 'pause', label: 'Pause', icon: Pause, description: 'Temporarily freeze screen view', status: 'available' },
  { id: 'resume', label: 'Resume', icon: Play, description: 'Continue paused session', status: 'available' },
  { id: 'freeze', label: 'Freeze', icon: Snowflake, description: 'Lock current screen state', status: 'available' },
];

const CONTROL_OPTIONS = [
  { id: 'cursor', label: 'Cursor Control', icon: MousePointer2, enabled: false },
  { id: 'keyboard', label: 'Keyboard Input', icon: Keyboard, enabled: false },
  { id: 'window', label: 'Window Specific', icon: AppWindow, enabled: true },
  { id: 'resolution', label: 'Resolution Lock', icon: Maximize, enabled: true },
];

export function AMScreenControl() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Screen Control</h1>
          <p className="text-muted-foreground">Manage screen viewing and control permissions</p>
        </div>

        {/* Control Modes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Control Modes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {CONTROL_MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <Card 
                    key={mode.id}
                    className={`cursor-pointer transition-colors ${
                      mode.status === 'active' ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${
                        mode.status === 'active' ? 'text-primary' : 
                        mode.status === 'disabled' ? 'text-muted-foreground' : 'text-foreground'
                      }`} />
                      <p className="font-medium text-sm">{mode.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
                      <Badge 
                        variant={
                          mode.status === 'active' ? 'default' :
                          mode.status === 'disabled' ? 'secondary' : 'outline'
                        }
                        className="mt-2"
                      >
                        {mode.status}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Control Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Input Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONTROL_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <div 
                    key={option.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{option.label}</span>
                    </div>
                    <Badge variant={option.enabled ? 'default' : 'secondary'}>
                      {option.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Restrictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm font-medium text-green-500">NO FULL SYSTEM ACCESS</p>
                <p className="text-xs text-muted-foreground mt-1">Default restriction - window specific only</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm font-medium text-amber-500">LATENCY OPTIMIZATION</p>
                <p className="text-xs text-muted-foreground mt-1">Auto-adjust quality based on connection</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm font-medium text-blue-500">RESOLUTION LOCKED</p>
                <p className="text-xs text-muted-foreground mt-1">Match target display resolution</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Switch to View Only
              </Button>
              <Button variant="outline">
                <Hand className="h-4 w-4 mr-2" />
                Request Control
              </Button>
              <Button variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause Session
              </Button>
              <Button variant="outline">
                <Snowflake className="h-4 w-4 mr-2" />
                Freeze Screen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMScreenControl;
