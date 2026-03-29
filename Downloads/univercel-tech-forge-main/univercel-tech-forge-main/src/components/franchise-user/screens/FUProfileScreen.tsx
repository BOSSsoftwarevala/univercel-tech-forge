import React from 'react';
import { UserCircle, MapPin, Key, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export function FUProfileScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-primary" />
            Profile & Settings
          </h1>
          <p className="text-muted-foreground">Your account information.</p>
        </div>
      </div>

      {/* Profile Info */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">Franchise ID</span>
            <Badge variant="outline" className="text-lg">FR***015</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">Mobile</span>
            <Badge variant="outline" className="text-lg">98***45678</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">Email</span>
            <Badge variant="outline" className="text-lg">fr***@email.com</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            My Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">Country</span>
            <Badge variant="outline" className="text-lg">India</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">City</span>
            <Badge variant="outline" className="text-lg">Mumbai West</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">Territory</span>
            <Badge variant="outline" className="text-lg">Maharashtra</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plan & Key */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Plan & License
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">Active Plan</span>
            <Badge className="bg-emerald-500 text-lg">Premium</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">License Key</span>
            <Badge variant="outline" className="text-lg">TXN***8745</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
            <span className="font-medium">Valid Until</span>
            <Badge variant="outline" className="text-lg">Dec 2024</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: 'New Lead Alerts', enabled: true },
            { name: 'Sales Updates', enabled: true },
            { name: 'Marketing Reports', enabled: true },
            { name: 'Support Replies', enabled: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
              <span className="font-medium">{item.name}</span>
              <Switch checked={item.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-amber-500" />
            <div>
              <p className="font-medium">Security</p>
              <p className="text-sm text-muted-foreground">
                Your data is protected. No export or inspect allowed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
