/**
 * PRIVACY CONTROLS
 * Maximum privacy - All enabled by default
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Shield,
  Camera,
  Video,
  Clipboard,
  FileX,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const PRIVACY_SETTINGS = [
  { id: 'no_screenshot', label: 'No Screenshot', icon: Camera, description: 'Block all screenshot attempts', enabled: true, critical: true },
  { id: 'no_recording', label: 'No Screen Recording', icon: Video, description: 'Prevent any screen recording', enabled: true, critical: true },
  { id: 'no_clipboard', label: 'No Clipboard Copy', icon: Clipboard, description: 'Block clipboard access', enabled: true, critical: true },
  { id: 'no_persistence', label: 'No File Persistence', icon: FileX, description: 'Auto-delete all transferred files', enabled: true, critical: true },
  { id: 'no_background', label: 'No Background Access', icon: Eye, description: 'Block background process visibility', enabled: true, critical: true },
  { id: 'mask_sensitive', label: 'Mask Sensitive Fields', icon: Lock, description: 'Auto-blur password and sensitive inputs', enabled: true, critical: true },
  { id: 'auto_blur', label: 'Auto Blur Password Areas', icon: Lock, description: 'Detect and blur password fields', enabled: true, critical: false },
];

export function AMPrivacyControls() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Privacy Controls</h1>
            <p className="text-muted-foreground">Maximum privacy - Zero data leakage</p>
          </div>
          <Badge variant="default" className="bg-green-600">
            <Shield className="h-4 w-4 mr-1" />
            All Protected
          </Badge>
        </div>

        {/* Security Status */}
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-green-500">Maximum Privacy Active</p>
                <p className="text-sm text-muted-foreground">
                  All 7 privacy controls are enabled. No data can leak during session.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRIVACY_SETTINGS.map((setting) => {
            const Icon = setting.icon;
            return (
              <Card 
                key={setting.id}
                className={`${
                  setting.enabled ? 'border-green-500/30' : 'border-destructive/30'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        setting.enabled ? 'bg-green-500/10' : 'bg-destructive/10'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          setting.enabled ? 'text-green-500' : 'text-destructive'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{setting.label}</p>
                          {setting.critical && (
                            <Badge variant="outline" className="text-xs">Critical</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                      </div>
                    </div>
                    <Switch checked={setting.enabled} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Warning */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-amber-500">Security Warning</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Disabling any privacy control requires Boss Owner approval and will be logged. 
                  All changes are audited and cannot be hidden.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enabled by Default Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Default Protections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>All privacy controls enabled by default</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Cannot be disabled without approval</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>All changes logged to audit trail</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Auto-reset to maximum on session end</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMPrivacyControls;
