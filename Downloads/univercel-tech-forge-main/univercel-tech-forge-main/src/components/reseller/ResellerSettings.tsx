import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Building2, CreditCard, Bell, Shield, 
  Moon, Sun, Globe, Save, LogOut, History, Eye, EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ResellerSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    leadAlerts: true,
    commissionAlerts: true,
    theme: 'dark',
    language: 'English',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleLogoutAllSessions = async () => {
    await signOut();
    toast.success('Logged out from all sessions');
    navigate('/auth');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Navigation */}
        <Card className="bg-slate-900/50 border-emerald-500/20 lg:col-span-1">
          <CardContent className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
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
        <Card className="bg-slate-900/50 border-emerald-500/20 lg:col-span-3">
          <CardContent className="p-6">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <Input 
                      defaultValue="[MASKED]" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <Input 
                      defaultValue="reseller@example.com" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Phone</Label>
                    <Input 
                      defaultValue="+91 98***45" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Reseller ID</Label>
                    <Input 
                      value="RSL-2024-0042" 
                      disabled
                      className="bg-slate-800/50 border-slate-700 text-slate-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'business' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Company Name</Label>
                    <Input 
                      defaultValue="ABC Enterprises" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">GST / Tax ID</Label>
                    <Input 
                      placeholder="Enter GST number" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-300">Business Address</Label>
                    <Input 
                      placeholder="Enter full address" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">City</Label>
                    <Input 
                      defaultValue="Mumbai" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">State</Label>
                    <Input 
                      defaultValue="Maharashtra" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Bank Name</Label>
                    <Input 
                      defaultValue="HDFC Bank" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Account Number</Label>
                    <Input 
                      defaultValue="****4521" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">IFSC Code</Label>
                    <Input 
                      defaultValue="HDFC0001234" 
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">UPI ID</Label>
                    <Input 
                      placeholder="Enter UPI ID" 
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
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-slate-400 text-sm">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div>
                      <p className="text-white font-medium">SMS Notifications</p>
                      <p className="text-slate-400 text-sm">Receive SMS for urgent alerts</p>
                    </div>
                    <Switch 
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) => setPreferences({...preferences, smsNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div>
                      <p className="text-white font-medium">Lead Alerts</p>
                      <p className="text-slate-400 text-sm">Get notified for new leads</p>
                    </div>
                    <Switch 
                      checked={preferences.leadAlerts}
                      onCheckedChange={(checked) => setPreferences({...preferences, leadAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div>
                      <p className="text-white font-medium">Commission Alerts</p>
                      <p className="text-slate-400 text-sm">Notify when commission is credited</p>
                    </div>
                    <Switch 
                      checked={preferences.commissionAlerts}
                      onCheckedChange={(checked) => setPreferences({...preferences, commissionAlerts: checked})}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-white font-medium mb-4">Appearance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        {preferences.theme === 'dark' ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                        <span className="text-white">Theme</span>
                      </div>
                      <span className="text-slate-400 capitalize">{preferences.theme}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <span className="text-white">Language</span>
                      </div>
                      <span className="text-slate-400">{preferences.language}</span>
                    </div>
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
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <h4 className="text-white font-medium mb-4">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Current Password</Label>
                        <div className="relative">
                          <Input 
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter current password" 
                            className="bg-slate-700/50 border-slate-600 text-white pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">New Password</Label>
                        <Input 
                          type="password"
                          placeholder="Enter new password" 
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600">
                      Update Password
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-white font-medium">Session History</p>
                          <p className="text-slate-400 text-sm">View your login history</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-emerald-500/30 text-emerald-400"
                        onClick={() => toast.info('Session history: Last 5 logins from India (Mumbai). All sessions secure.')}
                      >
                        View History
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="text-white font-medium">Logout All Sessions</p>
                          <p className="text-slate-400 text-sm">Sign out from all devices</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={handleLogoutAllSessions}
                      >
                        Logout All
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResellerSettings;
