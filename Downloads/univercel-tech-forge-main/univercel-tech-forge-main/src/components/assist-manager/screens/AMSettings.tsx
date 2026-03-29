import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import {
  Settings,
  Clock,
  Shield,
  Brain,
  Bell,
  Save,
  RotateCcw,
} from 'lucide-react';

interface AMSettingsProps {
  system: ReturnType<typeof useAssistManagerSystem>;
}

export function AMSettings({ system }: AMSettingsProps) {
  const [localSettings, setLocalSettings] = useState(system.settings);

  useEffect(() => {
    setLocalSettings(system.settings);
  }, [system.settings]);

  const settingsSections = localSettings ? [
    {
      title: 'Session Defaults',
      icon: Clock,
      settings: [
        { id: 'default_duration_minutes', label: 'Default Session Duration', type: 'select', value: String(localSettings.default_duration_minutes) },
        { id: 'max_duration_minutes', label: 'Maximum Session Duration', type: 'select', value: String(localSettings.max_duration_minutes) },
        { id: 'auto_timeout_minutes', label: 'Auto Timeout (minutes)', type: 'number', value: String(localSettings.auto_timeout_minutes) },
        { id: 'require_consent', label: 'Require User Consent', type: 'toggle', value: localSettings.require_consent },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        { id: 'approval_required', label: 'Require Manager Approval', type: 'toggle', value: localSettings.approval_required },
        { id: 'mask_sensitive', label: 'Mask Sensitive Data', type: 'toggle', value: localSettings.mask_sensitive },
        { id: 'allow_file_transfer', label: 'Allow File Transfer', type: 'toggle', value: localSettings.allow_file_transfer },
        { id: 'working_hours_only', label: 'Working Hours Only', type: 'toggle', value: localSettings.working_hours_only },
      ],
    },
    {
      title: 'AI Configuration',
      icon: Brain,
      settings: [
        { id: 'auto_escalate', label: 'Auto Escalate', type: 'toggle', value: localSettings.auto_escalate },
        { id: 'auto_end_over_limit', label: 'Auto End Over Limit', type: 'toggle', value: localSettings.auto_end_over_limit },
        { id: 'allow_voice', label: 'Allow Voice', type: 'toggle', value: localSettings.allow_voice },
        { id: 'ai_risk_threshold', label: 'AI Risk Threshold', type: 'number', value: String(localSettings.ai_risk_threshold) },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { id: 'approval_required', label: 'New Request Alert', type: 'toggle', value: localSettings.approval_required },
        { id: 'auto_end_over_limit', label: 'Session End Alert', type: 'toggle', value: localSettings.auto_end_over_limit },
        { id: 'auto_escalate', label: 'Security Alert', type: 'toggle', value: localSettings.auto_escalate },
        { id: 'mask_sensitive', label: 'AI Suggestion Alert', type: 'toggle', value: localSettings.mask_sensitive },
      ],
    },
  ] : [];

  const updateValue = (id: string, value: string | boolean) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      [id]: typeof value === 'string' && ['default_duration_minutes', 'max_duration_minutes', 'auto_timeout_minutes', 'ai_risk_threshold'].includes(id)
        ? Number(value)
        : value,
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure Assist Manager preferences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Defaults
            </Button>
            <Button onClick={() => localSettings && system.updateSettings.mutate(localSettings)} disabled={!localSettings || system.updateSettings.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <Label htmlFor={setting.id} className="text-sm">
                        {setting.label}
                      </Label>
                      {setting.type === 'toggle' ? (
                        <Switch 
                          id={setting.id}
                          checked={setting.value as boolean}
                          onCheckedChange={(checked) => updateValue(setting.id, checked)}
                        />
                      ) : setting.type === 'number' ? (
                        <Input 
                          id={setting.id}
                          type="number"
                          value={setting.value as string}
                          onChange={(event) => updateValue(setting.id, event.target.value)}
                          className="w-20 text-right"
                        />
                      ) : (
                        <select 
                          id={setting.id}
                          value={setting.value as string}
                          onChange={(event) => updateValue(setting.id, event.target.value)}
                          className="text-sm bg-muted border border-border rounded px-2 py-1"
                        >
                          <option value="15">15 min</option>
                          <option value="30">30 min</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                        </select>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Approval Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Approval Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium text-sm">View Only Sessions</p>
                <p className="text-xs text-muted-foreground mt-1">Manager approval</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium text-sm">Control Sessions</p>
                <p className="text-xs text-muted-foreground mt-1">Boss Owner approval</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium text-sm">File Transfer</p>
                <p className="text-xs text-muted-foreground mt-1">Dual approval required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Rules Notice */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-amber-500">System Rules</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Some settings are locked by system policy and cannot be changed. 
                  No session without approval. No permanent access. No invisible actions. 
                  All changes logged to audit trail.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMSettings;
