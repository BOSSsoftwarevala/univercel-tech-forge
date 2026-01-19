/**
 * FRANCHISE SETTINGS SCREEN
 * Password, 2FA, Language, Notification
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Key,
  Shield,
  Globe,
  Bell,
  Save,
  Smartphone,
} from 'lucide-react';

export function FOFranchiseSettingsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <Button className="w-full gap-2">
              <Save className="h-4 w-4" />
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* 2FA */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-xs text-muted-foreground">Use an authenticator app for 2FA</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">SMS Verification</p>
                  <p className="text-xs text-muted-foreground">Receive codes via SMS</p>
                </div>
              </div>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">
              Configure 2FA
            </Button>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST (UTC-5)</SelectItem>
                  <SelectItem value="pst">PST (UTC-8)</SelectItem>
                  <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-xs text-muted-foreground">Get notified on order status changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">New Leads</p>
                <p className="text-xs text-muted-foreground">Alert when new leads arrive</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">SLA Alerts</p>
                <p className="text-xs text-muted-foreground">Promise deadline reminders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">Wallet Alerts</p>
                <p className="text-xs text-muted-foreground">Low balance notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">Marketing Updates</p>
                <p className="text-xs text-muted-foreground">Campaign performance reports</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FOFranchiseSettingsScreen;
