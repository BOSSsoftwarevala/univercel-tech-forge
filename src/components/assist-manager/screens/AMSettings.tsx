/**
 * SETTINGS
 * System configuration for Assist Manager
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Settings,
  Clock,
  Shield,
  Brain,
  Bell,
  Save,
  RotateCcw,
} from 'lucide-react';

const SETTINGS_SECTIONS = [
  {
    title: 'Session Defaults',
    icon: Clock,
    settings: [
      { id: 'default_duration', label: 'Default Session Duration', type: 'select', value: '30' },
      { id: 'max_duration', label: 'Maximum Session Duration', type: 'select', value: '120' },
      { id: 'auto_timeout', label: 'Auto Timeout (minutes)', type: 'number', value: '15' },
      { id: 'require_consent', label: 'Require User Consent', type: 'toggle', value: true },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    settings: [
      { id: 'no_screenshot', label: 'Block Screenshots', type: 'toggle', value: true },
      { id: 'no_recording', label: 'Block Recording', type: 'toggle', value: true },
      { id: 'mask_sensitive', label: 'Mask Sensitive Data', type: 'toggle', value: true },
      { id: 'auto_delete', label: 'Auto Delete Files', type: 'toggle', value: true },
    ],
  },
  {
    title: 'AI Configuration',
    icon: Brain,
    settings: [
      { id: 'ai_enabled', label: 'Enable AI Assist', type: 'toggle', value: true },
      { id: 'ai_translate', label: 'Auto Translate', type: 'toggle', value: true },
      { id: 'ai_summarize', label: 'Auto Summarize', type: 'toggle', value: true },
      { id: 'ai_risk', label: 'Risk Detection', type: 'toggle', value: true },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      { id: 'notify_new', label: 'New Request Alert', type: 'toggle', value: true },
      { id: 'notify_end', label: 'Session End Alert', type: 'toggle', value: true },
      { id: 'notify_security', label: 'Security Alert', type: 'toggle', value: true },
      { id: 'notify_ai', label: 'AI Suggestion Alert', type: 'toggle', value: false },
    ],
  },
];

export function AMSettings() {
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
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SETTINGS_SECTIONS.map((section) => {
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
                        />
                      ) : setting.type === 'number' ? (
                        <Input 
                          id={setting.id}
                          type="number"
                          defaultValue={setting.value as string}
                          className="w-20 text-right"
                        />
                      ) : (
                        <select 
                          id={setting.id}
                          defaultValue={setting.value as string}
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
