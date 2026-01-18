/**
 * DEVICE ACCESS
 * App Only / Browser Only / Single Window / No Background
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Laptop,
  AppWindow,
  Globe,
  Layers,
  EyeOff,
  Shield,
  Lock,
  CheckCircle2,
} from 'lucide-react';

const ACCESS_MODES = [
  { id: 'app_only', label: 'App Only', icon: AppWindow, description: 'Access restricted to specific application', active: true },
  { id: 'browser_only', label: 'Browser Only', icon: Globe, description: 'Access limited to browser window', active: false },
  { id: 'single_window', label: 'Single Window', icon: Layers, description: 'Only one window visible at a time', active: true },
  { id: 'no_background', label: 'No Background', icon: EyeOff, description: 'Background processes hidden', active: true },
];

const CURRENT_ACCESS = {
  device: 'Windows 11 Desktop',
  user: 'USR-****42',
  activeWindow: 'Chrome - Support Portal',
  permissions: ['Screen View', 'Chat', 'File Transfer'],
  restrictions: ['No System Access', 'No Background', 'Single Window'],
};

export function AMDeviceAccess() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Device Access</h1>
          <p className="text-muted-foreground">Control what parts of the device can be accessed</p>
        </div>

        {/* Current Access Info */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Laptop className="h-5 w-5" />
              Current Session Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Device</p>
                <p className="font-medium text-sm">{CURRENT_ACCESS.device}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">User</p>
                <p className="font-mono text-sm">{CURRENT_ACCESS.user}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Window</p>
                <p className="font-medium text-sm">{CURRENT_ACCESS.activeWindow}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {CURRENT_ACCESS.permissions.map((p) => (
                    <Badge key={p} variant="default" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Restrictions</p>
                <div className="flex flex-wrap gap-2">
                  {CURRENT_ACCESS.restrictions.map((r) => (
                    <Badge key={r} variant="secondary" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Modes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Modes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACCESS_MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <div 
                    key={mode.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      mode.active ? 'bg-green-500/10 border border-green-500/30' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        mode.active ? 'bg-green-500/20' : 'bg-muted'
                      }`}>
                        <Icon className={`h-5 w-5 ${mode.active ? 'text-green-500' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{mode.label}</p>
                        <p className="text-xs text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                    <Switch checked={mode.active} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Window Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Visible Windows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Chrome - Support Portal', 'File Explorer', 'Settings'].map((window, i) => (
                <div 
                  key={window}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    i === 0 ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AppWindow className="h-4 w-4" />
                    <span className="text-sm">{window}</span>
                  </div>
                  <Badge variant={i === 0 ? 'default' : 'secondary'}>
                    {i === 0 ? 'Active' : 'Hidden'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-green-500">Restricted Access Mode</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Full system access is not allowed by default. Agent can only view the active window. 
                  All other windows, background processes, and system areas are hidden.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMDeviceAccess;
