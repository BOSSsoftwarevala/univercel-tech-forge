import React, { useState } from 'react';
import { 
  Building2, 
  Users,
  Shield,
  Save,
  Upload,
  Mail,
  Key,
  Bell,
  Database,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProAccountingSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-500">Configure system preferences and security settings</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Globe className="w-4 h-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Legal Name</Label>
                    <Input defaultValue="ABC Industries Pvt. Ltd." />
                  </div>
                  <div className="space-y-2">
                    <Label>Trade Name</Label>
                    <Input defaultValue="ABC Industries" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GSTIN</Label>
                    <Input defaultValue="29ABCDE1234F1Z5" className="font-mono uppercase" />
                  </div>
                  <div className="space-y-2">
                    <Label>PAN</Label>
                    <Input defaultValue="ABCDE1234F" className="font-mono uppercase" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CIN</Label>
                    <Input placeholder="Corporate Identity Number" className="font-mono uppercase" />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select defaultValue="29">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="29">Karnataka (29)</SelectItem>
                        <SelectItem value="27">Maharashtra (27)</SelectItem>
                        <SelectItem value="33">Tamil Nadu (33)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Registered Address</Label>
                  <Textarea 
                    defaultValue="123, Industrial Estate, Electronic City, Bangalore - 560100, Karnataka, India" 
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Company Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                  <div className="w-20 h-20 bg-indigo-100 rounded-xl mx-auto flex items-center justify-center mb-4">
                    <Building2 className="w-10 h-10 text-indigo-600" />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 2MB</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users & Roles */}
        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-900">User Accounts</CardTitle>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'CA Rahul Sharma', email: 'rahul@abc.com', role: 'accountant', status: 'active' },
                  { name: 'Auditor Singh', email: 'auditor@abc.com', role: 'auditor', status: 'active' },
                  { name: 'Admin User', email: 'admin@abc.com', role: 'admin', status: 'active' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        user.role === 'admin' ? 'bg-purple-500' :
                        user.role === 'accountant' ? 'bg-indigo-500' :
                        'bg-amber-500'
                      }`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Role Permissions</CardTitle>
                <CardDescription>Define access levels for each role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-indigo-900">Accountant</span>
                  </div>
                  <p className="text-sm text-indigo-700">Full access to create, edit, and delete entries. Can file returns.</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-amber-900">Auditor</span>
                  </div>
                  <p className="text-sm text-amber-700">Read-only access to all modules. Can view reports and audit trails.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Admin</span>
                  </div>
                  <p className="text-sm text-purple-700">Full system access including user management and settings.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Add extra security with 2FA</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Session Timeout</p>
                      <p className="text-sm text-slate-500">Auto-logout after inactivity</p>
                    </div>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Login Alerts</p>
                      <p className="text-sm text-slate-500">Email on new device login</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Auto Backup</p>
                      <p className="text-sm text-slate-500">Daily automated backups</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Encryption</p>
                      <p className="text-sm text-slate-500">AES-256 data encryption</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-sm text-emerald-700">
                    <strong>Last Backup:</strong> Today at 02:00 AM
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">GST Portal Integration</CardTitle>
              <CardDescription>Connect with government GST portal for automated filings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GST Username</Label>
                  <Input placeholder="Enter GST portal username" />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" placeholder="Enter API key" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">E-Invoice Integration</p>
                  <p className="text-sm text-slate-500">Generate IRN directly from system</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">E-Way Bill Integration</p>
                  <p className="text-sm text-slate-500">Generate E-Way bills for transport</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProAccountingSettings;
