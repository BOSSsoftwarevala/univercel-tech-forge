import React from 'react';
import { Settings, User, Bell, Shield, Globe, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const settingsGroups = [
  {
    title: 'Profile Settings',
    icon: User,
    settings: [
      { name: 'Display Name', value: 'FR***015', editable: false },
      { name: 'Region', value: 'Mumbai', editable: false },
      { name: 'Territory', value: 'Maharashtra', editable: false },
    ]
  },
  {
    title: 'Notification Settings',
    icon: Bell,
    settings: [
      { name: 'Lead Notifications', toggle: true, enabled: true },
      { name: 'Sales Alerts', toggle: true, enabled: true },
      { name: 'Support Ticket Updates', toggle: true, enabled: true },
      { name: 'AI Suggestions', toggle: true, enabled: true },
    ]
  },
  {
    title: 'System Preferences',
    icon: Globe,
    settings: [
      { name: 'Language', value: 'English', editable: false },
      { name: 'Timezone', value: 'IST (UTC+5:30)', editable: false },
      { name: 'Currency', value: 'INR (₹)', editable: false },
    ]
  },
];

export function FOSettingsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Franchise Settings
          </h1>
          <p className="text-muted-foreground">Profile • Notifications • Preferences</p>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-amber-500" />
            <div>
              <h3 className="font-semibold">Security & Rules</h3>
              <p className="text-sm text-muted-foreground">
                Masked data • No inspect • No export • Soft delete only • All actions logged
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Groups */}
      {settingsGroups.map((group, idx) => (
        <Card key={idx} className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <group.icon className="h-5 w-5 text-primary" />
              {group.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.settings.map((setting, sIdx) => (
                <div key={sIdx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="font-medium">{setting.name}</span>
                  {'toggle' in setting ? (
                    <Switch checked={setting.enabled} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{setting.value}</Badge>
                      {!setting.editable && (
                        <Badge variant="secondary" className="text-xs">Locked</Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Auto Features Status */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            AI Auto Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Auto Lead Assignment', status: 'Active' },
              { name: 'Auto Ad Optimization', status: 'Active' },
              { name: 'Auto SEO Improvements', status: 'Active' },
              { name: 'Daily Suggestions Popup', status: 'Active' },
              { name: 'Country-based Strategy', status: 'Active' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <span className="font-medium">{feature.name}</span>
                <Badge variant="default" className="bg-emerald-500">{feature.status}</Badge>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Note: AI features run automatically. No manual configuration required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
