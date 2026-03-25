import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Key,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Monitor,
  LogOut,
  Settings,
  Users,
  FileText,
  Activity,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const activityLogs = [
  { id: '1', user: 'Sarah Johnson', action: 'Login successful', ip: '192.168.1.100', device: 'Chrome / Windows', time: '2 min ago', status: 'success' },
  { id: '2', user: 'Mike Chen', action: 'Password changed', ip: '10.0.0.45', device: 'Safari / macOS', time: '15 min ago', status: 'success' },
  { id: '3', user: 'Emma Davis', action: 'Failed login attempt', ip: '172.16.0.20', device: 'Firefox / Linux', time: '1 hr ago', status: 'warning' },
  { id: '4', user: 'Alex Wilson', action: 'Profile updated', ip: '192.168.1.55', device: 'Mobile / iOS', time: '2 hr ago', status: 'success' },
  { id: '5', user: 'Lisa Brown', action: '2FA enabled', ip: '10.0.0.80', device: 'Chrome / macOS', time: '3 hr ago', status: 'success' },
];

const activeSessions = [
  { id: '1', device: 'Chrome on Windows', location: 'San Francisco, CA', ip: '192.168.1.100', lastActive: 'Now', current: true },
  { id: '2', device: 'Safari on macOS', location: 'New York, NY', ip: '10.0.0.45', lastActive: '2 hours ago', current: false },
  { id: '3', device: 'Mobile App on iOS', location: 'Los Angeles, CA', ip: '172.16.0.20', lastActive: '1 day ago', current: false },
];

const permissions = [
  { id: '1', role: 'HR Admin', users: 5, permissions: ['All HR functions', 'User management', 'Reports'] },
  { id: '2', role: 'Manager', users: 12, permissions: ['Team attendance', 'Leave approval', 'Reports'] },
  { id: '3', role: 'Employee', users: 139, permissions: ['Self-service', 'Leave requests', 'Documents'] },
];

const SaasSecurity: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security & Audit</h1>
        <p className="text-slate-500 mt-1">Manage security settings and monitor activity</p>
      </div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Security Score</p>
                <h2 className="text-4xl font-bold mt-2">92/100</h2>
                <p className="text-white/80 text-sm mt-2">Your organization has excellent security posture</p>
              </div>
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-4">
              {[
                { label: '2FA Enabled', value: '89%' },
                { label: 'Strong Passwords', value: '94%' },
                { label: 'Updated Profiles', value: '97%' },
                { label: 'Active Sessions', value: '156' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-white/80">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="authentication" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200/60 p-1">
          <TabsTrigger value="authentication" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Authentication
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Permissions
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Sessions
          </TabsTrigger>
        </TabsList>

        {/* Authentication Tab */}
        <TabsContent value="authentication">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-violet-600" />
                    Password Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-slate-500">At least 8 characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-slate-500">Contains uppercase and lowercase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-slate-500">Contains numbers</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Two-Factor Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-violet-600" />
                    Two-Factor Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">2FA Status</h4>
                        <p className="text-sm text-slate-500">
                          {twoFactorEnabled ? 'Your account is protected' : 'Enable for extra security'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Authentication Methods</h4>
                    {[
                      { icon: Smartphone, label: 'Authenticator App', status: 'active' },
                      { icon: Key, label: 'Security Key', status: 'inactive' },
                      { icon: FileText, label: 'Backup Codes', status: 'active' },
                    ].map((method) => (
                      <div
                        key={method.label}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <method.icon className="w-5 h-5 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">{method.label}</span>
                        </div>
                        <Badge className={
                          method.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 border-0'
                            : 'bg-slate-100 text-slate-600 border-0'
                        }>
                          {method.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure 2FA Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="activity">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Activity Logs</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search logs..." className="pl-10" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        log.status === 'success' ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        {log.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{log.user}</h4>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600">{log.action}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {log.ip}
                          </span>
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            {log.device}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">{log.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Role Permissions</CardTitle>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                  <Shield className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-xl bg-slate-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{role.role}</h4>
                          <p className="text-sm text-slate-500">{role.users} users</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="bg-white">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Sessions</CardTitle>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      session.current ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{session.device}</h4>
                          {session.current && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-0">Current</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {session.location}
                          </span>
                          <span>•</span>
                          <span>{session.ip}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">{session.lastActive}</span>
                      {!session.current && (
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                          <LogOut className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaasSecurity;
