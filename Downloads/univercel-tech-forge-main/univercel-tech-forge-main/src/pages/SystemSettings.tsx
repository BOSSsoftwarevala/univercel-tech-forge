import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Shield, Bell, Database, Users, Globe, 
  Lock, Key, Palette, Server, Cloud, Activity,
  AlertTriangle, CheckCircle, RefreshCw, Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // Security
    twoFactorAuth: true,
    sessionTimeout: 30,
    ipWhitelist: false,
    auditLogging: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    buzzerAlerts: true,
    escalationNotify: true,
    
    // System
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    compressionEnabled: true,
    
    // Features
    maskingEnabled: true,
    walletEnabled: true,
    promiseSystem: true,
    demoMonitor: true,
  });

  const handleSettingChange = (key: string, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(`Setting updated: ${key}`);
  };

  const systemStatus = [
    { name: 'Database', status: 'healthy', latency: '12ms', icon: Database },
    { name: 'Auth Service', status: 'healthy', latency: '8ms', icon: Shield },
    { name: 'API Gateway', status: 'healthy', latency: '15ms', icon: Server },
    { name: 'Cloud Storage', status: 'warning', latency: '45ms', icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]" />
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="settings-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#settings-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-400" />
              System Settings
            </h1>
            <p className="text-slate-400 mt-1">Configure system-wide settings and preferences</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        {/* System Status */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {systemStatus.map((service) => (
                <motion.div
                  key={service.name}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <service.icon className="w-5 h-5 text-blue-400" />
                    {service.status === 'healthy' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="font-medium text-white">{service.name}</div>
                  <div className="text-xs text-slate-400">Latency: {service.latency}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Server className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Palette className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure authentication and security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-blue-400" />
                      <div>
                        <Label className="text-white">Two-Factor Authentication</Label>
                        <p className="text-xs text-slate-400">Require 2FA for all admin users</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <div>
                        <Label className="text-white">IP Whitelist</Label>
                        <p className="text-xs text-slate-400">Restrict access to specific IPs</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.ipWhitelist}
                      onCheckedChange={(checked) => handleSettingChange('ipWhitelist', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-blue-400" />
                      <div>
                        <Label className="text-white">Audit Logging</Label>
                        <p className="text-xs text-slate-400">Log all user actions permanently</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.auditLogging}
                      onCheckedChange={(checked) => handleSettingChange('auditLogging', checked)}
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <RefreshCw className="w-5 h-5 text-blue-400" />
                      <Label className="text-white">Session Timeout (minutes)</Label>
                    </div>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Notification Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure how notifications are delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send notifications via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'buzzerAlerts', label: 'Buzzer Alerts', desc: 'Enable blocking buzzer system' },
                  { key: 'escalationNotify', label: 'Escalation Notifications', desc: 'Alert on auto-escalations' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div>
                      <Label className="text-white">{item.label}</Label>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <Switch
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Core system configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put system in maintenance mode', danger: true },
                  { key: 'debugMode', label: 'Debug Mode', desc: 'Enable detailed logging', danger: true },
                  { key: 'autoBackup', label: 'Automatic Backups', desc: 'Daily automated backups' },
                  { key: 'compressionEnabled', label: 'Data Compression', desc: 'Compress stored data' },
                ].map((item) => (
                  <div key={item.key} className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.danger ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-800/50 border-slate-700/50'
                  }`}>
                    <div>
                      <Label className={item.danger ? 'text-red-400' : 'text-white'}>{item.label}</Label>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <Switch
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Feature Toggles</CardTitle>
                <CardDescription className="text-slate-400">
                  Enable or disable system features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'maskingEnabled', label: 'Identity Masking', desc: 'Mask phone/email in all views' },
                  { key: 'walletEnabled', label: 'Wallet System', desc: 'Enable unified wallet transactions' },
                  { key: 'promiseSystem', label: 'Promise Button', desc: 'Enable promise & timer system' },
                  { key: 'demoMonitor', label: 'Demo Monitor', desc: 'Auto-monitor demo health' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div>
                      <Label className="text-white">{item.label}</Label>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <Switch
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
