/**
 * SERVER SETTINGS
 * Global settings for server management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, RotateCcw, Bell, Shield, Database,
  Brain, Clock, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

export const ServerSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingItem[]>([
    { id: 'auto_backup', label: 'Auto Backup', description: 'Daily automated backups for all servers', icon: Database, enabled: true },
    { id: 'ai_monitoring', label: 'AI Monitoring', description: 'AI-powered health monitoring and alerts', icon: Brain, enabled: true },
    { id: 'auto_scaling', label: 'Auto Scaling', description: 'Automatically scale resources based on load', icon: RotateCcw, enabled: true },
    { id: 'security_scan', label: 'Security Scanning', description: 'Continuous security threat detection', icon: Shield, enabled: true },
    { id: 'alert_notifications', label: 'Alert Notifications', description: 'Send alerts via email and in-app', icon: Bell, enabled: true },
    { id: 'auto_healing', label: 'Auto Healing', description: 'Automatically recover from failures', icon: CheckCircle, enabled: true },
  ]);

  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [alertThreshold, setAlertThreshold] = useState('80');

  const handleToggle = (id: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure server management preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Toggle Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Automation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <motion.div
                  key={setting.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={setting.enabled}
                    onCheckedChange={() => handleToggle(setting.id)}
                  />
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Options */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Backup Frequency */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Backup Frequency</Label>
                <p className="text-sm text-muted-foreground">How often to run automatic backups</p>
              </div>
            </div>
            <Select value={backupFrequency} onValueChange={setBackupFrequency}>
              <SelectTrigger className="w-40 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alert Threshold */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Alert Threshold</Label>
                <p className="text-sm text-muted-foreground">Resource usage % to trigger alerts</p>
              </div>
            </div>
            <Select value={alertThreshold} onValueChange={setAlertThreshold}>
              <SelectTrigger className="w-40 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="70">70%</SelectItem>
                <SelectItem value="80">80%</SelectItem>
                <SelectItem value="90">90%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Changes are applied to all servers. Critical settings require Boss approval.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerSettings;
