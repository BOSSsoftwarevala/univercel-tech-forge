/**
 * DEMO SETTINGS SCREEN
 * Settings: Default Demo Duration, Dummy Data Level, AI Fix Depth, Alert Threshold
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Settings,
  Clock,
  Database,
  Bot,
  Bell,
  Save,
  RotateCcw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  icon: any;
  type: 'slider' | 'input' | 'toggle';
  value: number | string | boolean;
  min?: number;
  max?: number;
  unit?: string;
}

export const DMESettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<SettingItem[]>([
    { id: 'duration', label: 'Default Demo Duration', description: 'How long demo URLs stay active', icon: Clock, type: 'slider', value: 7, min: 1, max: 30, unit: 'days' },
    { id: 'dummy-level', label: 'Dummy Data Level', description: 'Amount of sample data to inject', icon: Database, type: 'slider', value: 75, min: 0, max: 100, unit: '%' },
    { id: 'ai-depth', label: 'AI Fix Depth', description: 'How deep AI should analyze issues', icon: Bot, type: 'slider', value: 3, min: 1, max: 5, unit: 'levels' },
    { id: 'alert-threshold', label: 'Alert Threshold', description: 'Minimum issues to trigger alert', icon: Bell, type: 'slider', value: 5, min: 1, max: 20, unit: 'issues' },
  ]);

  const [toggleSettings, setToggleSettings] = useState({
    autoScan: true,
    autoFix: false,
    notifications: true,
    watermark: true,
    geoBlock: true,
  });

  const handleSliderChange = (id: string, value: number[]) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, value: value[0] } : s
    ));
  };

  const handleToggle = (key: string) => {
    setToggleSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Demo Settings
          </h1>
          <p className="text-muted-foreground text-sm">Configure default demo behavior</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Settings */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Core Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <motion.div
                  key={setting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <Label className="text-sm font-medium">{setting.label}</Label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {setting.value} {setting.unit}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                  <Slider
                    value={[setting.value as number]}
                    onValueChange={(value) => handleSliderChange(setting.id, value)}
                    min={setting.min}
                    max={setting.max}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{setting.min} {setting.unit}</span>
                    <span>{setting.max} {setting.unit}</span>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Toggle Settings */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Feature Toggles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'autoScan', label: 'Auto Health Scan', description: 'Automatically scan demos every 6 hours' },
              { key: 'autoFix', label: 'Auto AI Fix', description: 'Let AI fix minor issues automatically (requires approval for major)' },
              { key: 'notifications', label: 'Alert Notifications', description: 'Send notifications for critical issues' },
              { key: 'watermark', label: 'Screenshot Watermark', description: 'Add watermark to all demo screenshots' },
              { key: 'geoBlock', label: 'Geo-Blocking', description: 'Enable geographic access restrictions' },
            ].map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-background/30"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  checked={toggleSettings[item.key as keyof typeof toggleSettings]}
                  onCheckedChange={() => handleToggle(item.key)}
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="glass-card border-border/50 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Settings Apply Globally</p>
            <p className="text-xs text-muted-foreground">
              These settings affect all new demos created. Existing demos retain their original configuration 
              unless manually updated. AI fixes always require Boss approval before deployment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
