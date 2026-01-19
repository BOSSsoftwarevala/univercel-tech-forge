import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Settings, Bell, Shield, Users, DollarSign,
  Clock, AlertTriangle, Mail, Lock, Save,
  RefreshCw, Globe2, FileText, Zap
} from 'lucide-react';

const RMSettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    alertOnNewReseller: true,
    alertOnPayoutRequest: true,
    alertOnIssue: true,
    // Thresholds
    minPayoutAmount: 5000,
    autoApproveThreshold: 10000,
    riskScoreThreshold: 70,
    inactivityDays: 30,
    // Policies
    requireKYC: true,
    twoFactorRequired: false,
    autoSuspendOnViolation: true,
    commissionHoldDays: 7,
    // Display
    defaultCurrency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully', { description: 'All changes have been applied' });
  };

  const handleReset = () => {
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            Reseller Manager Settings
          </h1>
          <p className="text-sm text-slate-400">Configure reseller management preferences and policies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              Notifications
            </CardTitle>
            <CardDescription>Configure alert and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <Label>Email Notifications</Label>
              </div>
              <Switch 
                checked={settings.emailNotifications} 
                onCheckedChange={(v) => setSettings({...settings, emailNotifications: v})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-slate-400" />
                <Label>Push Notifications</Label>
              </div>
              <Switch 
                checked={settings.pushNotifications} 
                onCheckedChange={(v) => setSettings({...settings, pushNotifications: v})}
              />
            </div>
            <Separator className="bg-slate-700/50" />
            <div className="flex items-center justify-between">
              <Label className="text-slate-400">Alert on new reseller registration</Label>
              <Switch 
                checked={settings.alertOnNewReseller} 
                onCheckedChange={(v) => setSettings({...settings, alertOnNewReseller: v})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-400">Alert on payout request</Label>
              <Switch 
                checked={settings.alertOnPayoutRequest} 
                onCheckedChange={(v) => setSettings({...settings, alertOnPayoutRequest: v})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-400">Alert on issues/escalations</Label>
              <Switch 
                checked={settings.alertOnIssue} 
                onCheckedChange={(v) => setSettings({...settings, alertOnIssue: v})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Thresholds */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Financial Thresholds
            </CardTitle>
            <CardDescription>Set payout and approval limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Minimum Payout Amount (₹)</Label>
              <Input 
                type="number"
                value={settings.minPayoutAmount}
                onChange={(e) => setSettings({...settings, minPayoutAmount: parseInt(e.target.value)})}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Auto-Approve Threshold (₹)</Label>
              <Input 
                type="number"
                value={settings.autoApproveThreshold}
                onChange={(e) => setSettings({...settings, autoApproveThreshold: parseInt(e.target.value)})}
                className="bg-slate-800/50 border-slate-700"
              />
              <p className="text-xs text-slate-400">Payouts below this amount are auto-approved</p>
            </div>
            <div className="space-y-2">
              <Label>Commission Hold Period (days)</Label>
              <Input 
                type="number"
                value={settings.commissionHoldDays}
                onChange={(e) => setSettings({...settings, commissionHoldDays: parseInt(e.target.value)})}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Compliance */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Security & Compliance
            </CardTitle>
            <CardDescription>Manage security policies for resellers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <Label>Require KYC Verification</Label>
              </div>
              <Switch 
                checked={settings.requireKYC} 
                onCheckedChange={(v) => setSettings({...settings, requireKYC: v})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-slate-400" />
                <Label>Two-Factor Authentication Required</Label>
              </div>
              <Switch 
                checked={settings.twoFactorRequired} 
                onCheckedChange={(v) => setSettings({...settings, twoFactorRequired: v})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <Label>Auto-Suspend on Policy Violation</Label>
              </div>
              <Switch 
                checked={settings.autoSuspendOnViolation} 
                onCheckedChange={(v) => setSettings({...settings, autoSuspendOnViolation: v})}
              />
            </div>
            <Separator className="bg-slate-700/50" />
            <div className="space-y-2">
              <Label>Risk Score Threshold</Label>
              <Input 
                type="number"
                value={settings.riskScoreThreshold}
                onChange={(e) => setSettings({...settings, riskScoreThreshold: parseInt(e.target.value)})}
                className="bg-slate-800/50 border-slate-700"
              />
              <p className="text-xs text-slate-400">Resellers above this score are flagged for review</p>
            </div>
            <div className="space-y-2">
              <Label>Inactivity Threshold (days)</Label>
              <Input 
                type="number"
                value={settings.inactivityDays}
                onChange={(e) => setSettings({...settings, inactivityDays: parseInt(e.target.value)})}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-cyan-400" />
              Display Preferences
            </CardTitle>
            <CardDescription>Customize display and regional settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select 
                value={settings.defaultCurrency} 
                onValueChange={(v) => setSettings({...settings, defaultCurrency: v})}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(v) => setSettings({...settings, timezone: v})}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                  <SelectItem value="America/New_York">US Eastern</SelectItem>
                  <SelectItem value="Europe/London">UK (GMT)</SelectItem>
                  <SelectItem value="Asia/Dubai">UAE (GST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select 
                value={settings.dateFormat} 
                onValueChange={(v) => setSettings({...settings, dateFormat: v})}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RMSettingsView;
