import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Save, 
  Clock, 
  Bell, 
  Shield, 
  Calendar,
  Users,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export default function PTSettings() {
  const [settings, setSettings] = useState({
    autoReminder: true,
    reminderBefore: '24',
    autoEscalation: true,
    escalationDelay: '4',
    workingHoursOnly: true,
    workStartTime: '09:00',
    workEndTime: '18:00',
    promiseExpiry: '30',
    requireApproval: true,
    lockAfterFulfill: true,
  });

  const handleSave = () => {
    toast.success('Settings Saved', { description: 'Promise tracker settings updated' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-500/20 rounded-xl">
            <Settings className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-slate-400">Configure promise tracker behavior</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">RUNNING</Badge>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Auto Reminder</p>
                <p className="text-xs text-slate-400">Send reminder before deadline</p>
              </div>
              <Switch 
                checked={settings.autoReminder} 
                onCheckedChange={(v) => setSettings({ ...settings, autoReminder: v })} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Remind Before (hours)</Label>
              <Select 
                value={settings.reminderBefore} 
                onValueChange={(v) => setSettings({ ...settings, reminderBefore: v })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Auto Escalation */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5" />
              Auto Escalation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Enable Auto Escalation</p>
                <p className="text-xs text-slate-400">Escalate missed promises automatically</p>
              </div>
              <Switch 
                checked={settings.autoEscalation} 
                onCheckedChange={(v) => setSettings({ ...settings, autoEscalation: v })} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Escalate After (hours overdue)</Label>
              <Select 
                value={settings.escalationDelay} 
                onValueChange={(v) => setSettings({ ...settings, escalationDelay: v })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Working Hours Only</p>
                <p className="text-xs text-slate-400">Calculate time within working hours</p>
              </div>
              <Switch 
                checked={settings.workingHoursOnly} 
                onCheckedChange={(v) => setSettings({ ...settings, workingHoursOnly: v })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Start Time</Label>
                <Input 
                  type="time" 
                  value={settings.workStartTime}
                  onChange={(e) => setSettings({ ...settings, workStartTime: e.target.value })}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">End Time</Label>
                <Input 
                  type="time" 
                  value={settings.workEndTime}
                  onChange={(e) => setSettings({ ...settings, workEndTime: e.target.value })}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promise Policy */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" />
              Promise Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Promise Expiry (days)</Label>
              <Select 
                value={settings.promiseExpiry} 
                onValueChange={(v) => setSettings({ ...settings, promiseExpiry: v })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Require Approval</p>
                <p className="text-xs text-slate-400">New promises need manager approval</p>
              </div>
              <Switch 
                checked={settings.requireApproval} 
                onCheckedChange={(v) => setSettings({ ...settings, requireApproval: v })} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Lock After Fulfill</p>
                <p className="text-xs text-slate-400">Prevent edits after completion</p>
              </div>
              <Switch 
                checked={settings.lockAfterFulfill} 
                onCheckedChange={(v) => setSettings({ ...settings, lockAfterFulfill: v })} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Rules */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-red-400" />
            System Rules (Locked)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-800/50 rounded-lg flex items-center gap-2">
              <Badge className="bg-red-500/20 text-red-400">LOCKED</Badge>
              <span className="text-slate-300">Promise can never be deleted</span>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg flex items-center gap-2">
              <Badge className="bg-red-500/20 text-red-400">LOCKED</Badge>
              <span className="text-slate-300">Status change is always logged</span>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg flex items-center gap-2">
              <Badge className="bg-red-500/20 text-red-400">LOCKED</Badge>
              <span className="text-slate-300">AI is assist only - no auto execution</span>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg flex items-center gap-2">
              <Badge className="bg-red-500/20 text-red-400">LOCKED</Badge>
              <span className="text-slate-300">Final control always with human</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
