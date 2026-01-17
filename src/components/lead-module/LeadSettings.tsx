/**
 * LEAD SETTINGS
 */

import React from 'react';
import { Settings, Lock, Eye, Shield, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export const LeadSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          Lead Settings
        </h1>
        <p className="text-sm text-muted-foreground">Configure lead management settings</p>
      </div>

      {/* Security Settings */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Security Rules
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Mask Email & Phone</p>
                  <p className="text-xs text-muted-foreground">Show masked data by default</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Role-Based Access</p>
                  <p className="text-xs text-muted-foreground">Full view only for assigned role</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Action Logging</p>
                  <p className="text-xs text-muted-foreground">All actions are logged to audit</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto Settings */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Automation Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="font-medium text-foreground">Auto-route new leads</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="font-medium text-foreground">AI lead scoring</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="font-medium text-foreground">Follow-up reminders</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="font-medium text-foreground">Duplicate detection</span>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
