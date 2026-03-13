/**
 * SCREEN CONTROL - All buttons functional
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Monitor, Eye, Hand, Pause, Play, Snowflake, MousePointer2, Keyboard, AppWindow, Maximize } from 'lucide-react';

type ControlMode = 'view' | 'control' | 'pause' | 'resume' | 'freeze';

export function AMScreenControl() {
  const [activeMode, setActiveMode] = useState<ControlMode>('view');
  const [controls, setControls] = useState({ cursor: false, keyboard: false, window: true, resolution: true });

  const CONTROL_MODES = [
    { id: 'view' as const, label: 'View Only', icon: Eye, description: 'Watch screen without any control' },
    { id: 'control' as const, label: 'Control', icon: Hand, description: 'Full mouse and keyboard control' },
    { id: 'pause' as const, label: 'Pause', icon: Pause, description: 'Temporarily freeze screen view' },
    { id: 'resume' as const, label: 'Resume', icon: Play, description: 'Continue paused session' },
    { id: 'freeze' as const, label: 'Freeze', icon: Snowflake, description: 'Lock current screen state' },
  ];

  const handleModeChange = (mode: ControlMode) => {
    if (mode === 'control') {
      toast.info('Control request sent', { description: 'Awaiting target user approval...' });
      setTimeout(() => {
        setActiveMode(mode);
        setControls(prev => ({ ...prev, cursor: true, keyboard: true }));
        toast.success('Control mode activated');
      }, 1500);
    } else {
      setActiveMode(mode);
      if (mode === 'view') setControls(prev => ({ ...prev, cursor: false, keyboard: false }));
      toast.info(`Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`, { description: `Switched to ${mode} mode` });
    }
  };

  const handleToggleControl = (key: keyof typeof controls) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
    toast(controls[key] ? `${key} disabled` : `${key} enabled`);
  };

  const CONTROL_OPTIONS = [
    { id: 'cursor' as const, label: 'Cursor Control', icon: MousePointer2 },
    { id: 'keyboard' as const, label: 'Keyboard Input', icon: Keyboard },
    { id: 'window' as const, label: 'Window Specific', icon: AppWindow },
    { id: 'resolution' as const, label: 'Resolution Lock', icon: Maximize },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Screen Control</h1>
          <p className="text-muted-foreground">Manage screen viewing and control permissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Monitor className="h-5 w-5" /> Control Modes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {CONTROL_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                  <Card key={mode.id} className={`cursor-pointer transition-colors ${isActive ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'}`}
                    onClick={() => handleModeChange(mode.id)}>
                    <CardContent className="p-4 text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${isActive ? 'text-primary' : 'text-foreground'}`} />
                      <p className="font-medium text-sm">{mode.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
                      <Badge variant={isActive ? 'default' : 'outline'} className="mt-2">{isActive ? 'active' : 'available'}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Input Controls</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {CONTROL_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer" onClick={() => handleToggleControl(option.id)}>
                    <div className="flex items-center gap-3"><Icon className="h-5 w-5" /><span className="text-sm">{option.label}</span></div>
                    <Badge variant={controls[option.id] ? 'default' : 'secondary'}>{controls[option.id] ? 'Enabled' : 'Disabled'}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Restrictions</CardTitle></CardHeader>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <Button variant={activeMode === 'view' ? 'default' : 'outline'} onClick={() => handleModeChange('view')}>
                <Eye className="h-4 w-4 mr-2" /> Switch to View Only
              </Button>
              <Button variant={activeMode === 'control' ? 'default' : 'outline'} onClick={() => handleModeChange('control')}>
                <Hand className="h-4 w-4 mr-2" /> Request Control
              </Button>
              <Button variant={activeMode === 'pause' ? 'default' : 'outline'} onClick={() => handleModeChange('pause')}>
                <Pause className="h-4 w-4 mr-2" /> Pause Session
              </Button>
              <Button variant={activeMode === 'freeze' ? 'default' : 'outline'} onClick={() => handleModeChange('freeze')}>
                <Snowflake className="h-4 w-4 mr-2" /> Freeze Screen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMScreenControl;
