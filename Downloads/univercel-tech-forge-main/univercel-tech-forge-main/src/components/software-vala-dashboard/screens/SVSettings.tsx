/**
 * SETTINGS SCREEN
 * Platform configuration
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings,
  Bell,
  Shield,
  Globe2,
  Mail,
  Smartphone,
  Save,
  Key
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SVSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsAlerts: false,
    twoFactorAuth: true,
    apiLogging: true,
    autoScaling: true,
    defaultLanguage: 'en',
    timezone: 'UTC',
    webhookUrl: '',
  });

  const handleSave = () => {
    toast({ title: 'Settings Saved', description: 'Your preferences have been updated' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure your platform preferences</p>
      </div>

      {/* Notifications */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive alerts and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive alerts via email</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(v) => setSettings(s => ({ ...s, emailNotifications: v }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-800">Push Notifications</p>
                <p className="text-sm text-slate-500">Browser push notifications</p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(v) => setSettings(s => ({ ...s, pushNotifications: v }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-800">SMS Alerts</p>
                <p className="text-sm text-slate-500">Critical alerts via SMS</p>
              </div>
            </div>
            <Switch
              checked={settings.smsAlerts}
              onCheckedChange={(v) => setSettings(s => ({ ...s, smsAlerts: v }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Security
          </CardTitle>
          <CardDescription>Manage security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500">Add an extra layer of security</p>
              </div>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(v) => setSettings(s => ({ ...s, twoFactorAuth: v }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-800">API Request Logging</p>
                <p className="text-sm text-slate-500">Log all API requests for debugging</p>
              </div>
            </div>
            <Switch
              checked={settings.apiLogging}
              onCheckedChange={(v) => setSettings(s => ({ ...s, apiLogging: v }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* General */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-600" />
            General
          </CardTitle>
          <CardDescription>Platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select 
                value={settings.defaultLanguage} 
                onValueChange={(v) => setSettings(s => ({ ...s, defaultLanguage: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(v) => setSettings(s => ({ ...s, timezone: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="IST">IST (India)</SelectItem>
                  <SelectItem value="EST">EST (US East)</SelectItem>
                  <SelectItem value="PST">PST (US West)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              placeholder="https://your-webhook-endpoint.com/callback"
              value={settings.webhookUrl}
              onChange={(e) => setSettings(s => ({ ...s, webhookUrl: e.target.value }))}
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-500">Receive real-time events at this endpoint</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Auto-Scaling</p>
              <p className="text-sm text-slate-500">Automatically scale resources based on demand</p>
            </div>
            <Switch
              checked={settings.autoScaling}
              onCheckedChange={(v) => setSettings(s => ({ ...s, autoScaling: v }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
