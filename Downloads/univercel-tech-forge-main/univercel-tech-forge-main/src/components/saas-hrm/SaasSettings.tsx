import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Building,
  Bell,
  Globe,
  Palette,
  Database,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  Languages,
  Clock,
  Mail,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const settingsSections = [
  {
    title: 'Organization',
    icon: Building,
    items: [
      { label: 'Company Name', value: 'Acme Corporation', type: 'input' },
      { label: 'Industry', value: 'Technology', type: 'select' },
      { label: 'Company Size', value: '100-500', type: 'select' },
    ]
  },
  {
    title: 'Localization',
    icon: Globe,
    items: [
      { label: 'Language', value: 'en', type: 'select' },
      { label: 'Timezone', value: 'America/Los_Angeles', type: 'select' },
      { label: 'Date Format', value: 'MM/DD/YYYY', type: 'select' },
    ]
  },
];

const SaasSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your workspace preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-violet-600" />
                  Organization Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input defaultValue="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Website</Label>
                    <Input defaultValue="https://acme.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input defaultValue="hr@acme.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Localization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-violet-600" />
                  Localization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="pst">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                        <SelectItem value="est">Eastern Time (ET)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-violet-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Email notifications', description: 'Receive updates via email', enabled: true },
                  { label: 'Push notifications', description: 'Browser push alerts', enabled: true },
                  { label: 'Leave request alerts', description: 'Get notified of new requests', enabled: true },
                  { label: 'Payroll reminders', description: 'Monthly payroll processing reminders', enabled: false },
                  { label: 'Weekly reports', description: 'Receive weekly summary reports', enabled: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: Shield, label: 'Security Settings', action: () => toast.success('Opening Security Settings...') },
                  { icon: CreditCard, label: 'Billing & Plans', action: () => toast.success('Opening Billing & Plans...') },
                  { icon: Database, label: 'Data Export', action: () => {
                    toast.loading('Preparing data export...', { id: 'export' });
                    setTimeout(() => toast.success('Export ready! Downloading...', { id: 'export' }), 1500);
                  }},
                  { icon: HelpCircle, label: 'Help Center', action: () => window.open('https://help.softwarevala.com', '_blank') },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-slate-500" />
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-violet-600" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => toast.success('Light theme applied')}
                    className="p-4 rounded-xl border-2 border-violet-500 bg-white text-center"
                  >
                    <Sun className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <span className="text-sm font-medium text-slate-900">Light</span>
                  </button>
                  <button 
                    onClick={() => toast.success('Dark theme applied')}
                    className="p-4 rounded-xl border-2 border-slate-200 bg-slate-100 text-center hover:border-slate-300 transition-colors"
                  >
                    <Moon className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                    <span className="text-sm font-medium text-slate-700">Dark</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <Button 
            onClick={() => {
              toast.loading('Saving changes...', { id: 'save' });
              setTimeout(() => toast.success('Settings saved successfully!', { id: 'save' }), 1000);
            }}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-200"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaasSettings;
