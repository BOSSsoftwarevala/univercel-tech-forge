/**
 * DEVICE ACCESS - All toggles functional
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Laptop, AppWindow, Globe, Layers, EyeOff, Shield, Lock, CheckCircle2 } from 'lucide-react';

export function AMDeviceAccess() {
  const [modes, setModes] = useState([
    { id: 'app_only', label: 'App Only', icon: AppWindow, description: 'Access restricted to specific application', active: true },
    { id: 'browser_only', label: 'Browser Only', icon: Globe, description: 'Access limited to browser window', active: false },
    { id: 'single_window', label: 'Single Window', icon: Layers, description: 'Only one window visible at a time', active: true },
    { id: 'no_background', label: 'No Background', icon: EyeOff, description: 'Background processes hidden', active: true },
  ]);

  const [activeWindow, setActiveWindow] = useState(0);

  const windows = ['Chrome - Support Portal', 'File Explorer', 'Settings'];

  const handleModeToggle = (id: string) => {
    setModes(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
    const mode = modes.find(m => m.id === id);
    toast(mode?.active ? `${mode?.label} disabled` : `${mode?.label} enabled`, {
      description: mode?.active ? 'Access restriction removed' : 'Access restriction applied'
    });
  };

  const handleWindowSelect = (idx: number) => {
    setActiveWindow(idx);
    toast.info(`Window switched to: ${windows[idx]}`, { description: 'Agent can now view this window' });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Device Access</h1>
          <p className="text-muted-foreground">Control what parts of the device can be accessed</p>
        </div>

        <Card className="border-primary/50">
          <CardHeader><CardTitle className="flex items-center gap-2"><Laptop className="h-5 w-5" /> Current Session Access</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><p className="text-xs text-muted-foreground">Device</p><p className="font-medium text-sm">Windows 11 Desktop</p></div>
              <div><p className="text-xs text-muted-foreground">User</p><p className="font-mono text-sm">USR-****42</p></div>
              <div><p className="text-xs text-muted-foreground">Active Window</p><p className="font-medium text-sm">{windows[activeWindow]}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {['Screen View', 'Chat', 'File Transfer'].map(p => (
                    <Badge key={p} variant="default" className="text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />{p}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Restrictions</p>
                <div className="flex flex-wrap gap-2">
                  {['No System Access', 'No Background', 'Single Window'].map(r => (
                    <Badge key={r} variant="secondary" className="text-xs"><Lock className="h-3 w-3 mr-1" />{r}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Access Modes</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <div key={mode.id} className={`flex items-center justify-between p-4 rounded-lg ${mode.active ? 'bg-green-500/10 border border-green-500/30' : 'bg-muted/50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mode.active ? 'bg-green-500/20' : 'bg-muted'}`}>
                        <Icon className={`h-5 w-5 ${mode.active ? 'text-green-500' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{mode.label}</p>
                        <p className="text-xs text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                    <Switch checked={mode.active} onCheckedChange={() => handleModeToggle(mode.id)} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Visible Windows</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {windows.map((window, i) => (
                <div key={window} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  i === activeWindow ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50 hover:bg-muted'
                }`} onClick={() => handleWindowSelect(i)}>
                  <div className="flex items-center gap-2"><AppWindow className="h-4 w-4" /><span className="text-sm">{window}</span></div>
                  <Badge variant={i === activeWindow ? 'default' : 'secondary'}>{i === activeWindow ? 'Active' : 'Hidden'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-green-500">Restricted Access Mode</p>
                <p className="text-xs text-muted-foreground mt-1">Full system access is not allowed by default. Agent can only view the active window.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMDeviceAccess;
