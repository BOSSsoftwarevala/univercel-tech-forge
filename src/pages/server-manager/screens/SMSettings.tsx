import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Bell, Shield, Key, Globe, 
  Save, Moon, Sun, Mail, Smartphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const SMSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    smsAlerts: false,
    slackIntegration: true,
    autoRefresh: true,
    darkMode: true,
    twoFactor: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Manage your Server Manager preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Navigation */}
        <Card className="bg-slate-900/50 border-cyan-500/20 lg:col-span-1">
          <CardContent className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Tab Content */}
        <Card className="bg-slate-900/50 border-cyan-500/20 lg:col-span-3">
          <CardContent className="p-6">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <Input 
                      defaultValue="Server Admin" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <Input 
                      defaultValue="admin@company.com" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Role</Label>
                    <Input 
                      value="Server Manager" 
                      disabled
                      className="bg-slate-800/50 border-slate-700 text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Timezone</Label>
                    <Input 
                      defaultValue="Asia/Kolkata (IST)" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">Email Alerts</p>
                        <p className="text-slate-400 text-sm">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={preferences.emailAlerts}
                      onCheckedChange={(checked) => setPreferences({...preferences, emailAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">SMS Alerts</p>
                        <p className="text-slate-400 text-sm">Critical alerts via SMS</p>
                      </div>
                    </div>
                    <Switch 
                      checked={preferences.smsAlerts}
                      onCheckedChange={(checked) => setPreferences({...preferences, smsAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-white font-medium">Slack Integration</p>
                        <p className="text-slate-400 text-sm">Send alerts to Slack channel</p>
                      </div>
                    </div>
                    <Switch 
                      checked={preferences.slackIntegration}
                      onCheckedChange={(checked) => setPreferences({...preferences, slackIntegration: checked})}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-slate-400 text-sm">Require 2FA for sensitive actions</p>
                      </div>
                    </div>
                    <Switch 
                      checked={preferences.twoFactor}
                      onCheckedChange={(checked) => setPreferences({...preferences, twoFactor: checked})}
                    />
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <h4 className="text-white font-medium mb-3">Change Password</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Current Password</Label>
                        <Input 
                          type="password"
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">New Password</Label>
                        <Input 
                          type="password"
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <Button className="mt-4 bg-cyan-500 hover:bg-cyan-600">
                      Update Password
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">API Keys</h3>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Server Manager API Key</p>
                      <p className="text-slate-400 text-sm">Use this key for API access</p>
                    </div>
                    <Button variant="outline" className="border-cyan-500/30 text-cyan-400">
                      Regenerate
                    </Button>
                  </div>
                  <div className="p-3 rounded bg-slate-900 font-mono text-sm text-slate-300">
                    sm_live_****************************xxxx
                  </div>
                </div>
                <p className="text-amber-400 text-sm">
                  ⚠️ Keep your API key secure. Do not share it publicly.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SMSettings;
