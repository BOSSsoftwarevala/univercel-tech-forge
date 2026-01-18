/**
 * TASK MANAGER - TASK SETTINGS (LIMITED)
 * Priority Rules • SLA Defaults • Automation Limits • Escalation Rules
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, AlertTriangle, Clock, Zap, ArrowUpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TMTaskSettings: React.FC = () => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Settings</h1>
          <p className="text-muted-foreground">Configure task management rules • Limited access</p>
        </div>

        {/* Priority Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Priority Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Critical Priority Threshold</Label>
                <Select defaultValue="1h">
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="2h">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Auto-escalate High Priority</Label>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm text-muted-foreground">Enabled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SLA Defaults */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              SLA Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Default SLA (Hours)</Label>
                <Input type="number" defaultValue="24" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">SLA Warning Threshold (%)</Label>
                <Input type="number" defaultValue="80" className="bg-background" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <Label className="text-foreground">Enable SLA breach notifications</Label>
            </div>
          </CardContent>
        </Card>

        {/* Automation Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automation Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Max Retry Attempts</Label>
                <Input type="number" defaultValue="3" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Retry Delay (Minutes)</Label>
                <Input type="number" defaultValue="15" className="bg-background" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <Label className="text-foreground">Enable AI auto-fix</Label>
            </div>
          </CardContent>
        </Card>

        {/* Escalation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5" />
              Escalation Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Escalation Level 1 (Minutes)</Label>
                <Input type="number" defaultValue="30" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Escalation Level 2 (Minutes)</Label>
                <Input type="number" defaultValue="60" className="bg-background" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <Label className="text-foreground">Auto-escalate to Boss on Level 5</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TMTaskSettings;
