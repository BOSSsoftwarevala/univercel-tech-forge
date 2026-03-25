/**
 * SETTINGS (Limited)
 * Limited configuration options for Pro Manager
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Bot, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const PROSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Limited configuration options</p>
      </div>

      <Card className="border-amber-500/50">
        <CardContent className="p-4 flex items-center gap-3">
          <Lock className="h-6 w-6 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-foreground">Limited Access</p>
            <p className="text-xs text-muted-foreground">Some settings require higher authorization</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Notification Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sla-alerts" className="text-foreground">SLA Breach Alerts</Label>
              <Switch id="sla-alerts" defaultChecked onCheckedChange={() => toast.success('Setting updated')} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="payment-alerts" className="text-foreground">Payment Alerts</Label>
              <Switch id="payment-alerts" defaultChecked onCheckedChange={() => toast.success('Setting updated')} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="security-alerts" className="text-foreground">Security Alerts</Label>
              <Switch id="security-alerts" defaultChecked onCheckedChange={() => toast.success('Setting updated')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">AI Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-first" className="text-foreground">AI First Response</Label>
              <Switch id="ai-first" defaultChecked onCheckedChange={() => toast.success('Setting updated')} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-resolve" className="text-foreground">AI Auto-Resolution</Label>
              <Switch id="auto-resolve" defaultChecked onCheckedChange={() => toast.success('Setting updated')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Security Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="session-log" className="text-foreground">Log All Sessions</Label>
              <Switch id="session-log" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mask-data" className="text-foreground">Mask Sensitive Data</Label>
              <Switch id="mask-data" defaultChecked disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PROSettings;
