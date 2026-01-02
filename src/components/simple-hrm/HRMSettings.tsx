import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Building, Clock, Calendar, Bell, Shield, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function HRMSettings() {
  const { toast } = useToast();
  
  const [companySettings, setCompanySettings] = useState({
    companyName: 'My Company Pvt Ltd',
    email: 'hr@mycompany.com',
    phone: '+91 98765 43210',
    address: '123 Business Park, Mumbai',
  });

  const [workSettings, setWorkSettings] = useState({
    workStartTime: '09:00',
    workEndTime: '18:00',
    lateThreshold: '15',
    weekends: 'sat_sun',
  });

  const [leaveSettings, setLeaveSettings] = useState({
    casualLeave: '12',
    sickLeave: '8',
    earnedLeave: '15',
    carryForward: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    leaveApproval: true,
    payrollReminder: true,
    attendanceAlert: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="company" className="text-base gap-2">
            <Building className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="work" className="text-base gap-2">
            <Clock className="w-4 h-4" />
            Work Hours
          </TabsTrigger>
          <TabsTrigger value="leave" className="text-base gap-2">
            <Calendar className="w-4 h-4" />
            Leave Policy
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-base gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Company Information
              </CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base">Company Name</Label>
                  <Input
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Email</Label>
                  <Input
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Phone</Label>
                  <Input
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Address</Label>
                  <Input
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
              </div>
              <Button onClick={handleSave} size="lg" className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Hours Settings */}
        <TabsContent value="work" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Work Hours Configuration
              </CardTitle>
              <CardDescription>Set work timings and attendance rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base">Work Start Time</Label>
                  <Input
                    type="time"
                    value={workSettings.workStartTime}
                    onChange={(e) => setWorkSettings({ ...workSettings, workStartTime: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Work End Time</Label>
                  <Input
                    type="time"
                    value={workSettings.workEndTime}
                    onChange={(e) => setWorkSettings({ ...workSettings, workEndTime: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Late Threshold (minutes)</Label>
                  <Input
                    type="number"
                    value={workSettings.lateThreshold}
                    onChange={(e) => setWorkSettings({ ...workSettings, lateThreshold: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Weekly Off</Label>
                  <Select
                    value={workSettings.weekends}
                    onValueChange={(value) => setWorkSettings({ ...workSettings, weekends: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sun_only">Sunday Only</SelectItem>
                      <SelectItem value="sat_sun">Saturday & Sunday</SelectItem>
                      <SelectItem value="fri_sat">Friday & Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSave} size="lg" className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Policy Settings */}
        <TabsContent value="leave" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Leave Policy
              </CardTitle>
              <CardDescription>Configure annual leave allowances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-base">Casual Leave (per year)</Label>
                  <Input
                    type="number"
                    value={leaveSettings.casualLeave}
                    onChange={(e) => setLeaveSettings({ ...leaveSettings, casualLeave: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Sick Leave (per year)</Label>
                  <Input
                    type="number"
                    value={leaveSettings.sickLeave}
                    onChange={(e) => setLeaveSettings({ ...leaveSettings, sickLeave: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Earned Leave (per year)</Label>
                  <Input
                    type="number"
                    value={leaveSettings.earnedLeave}
                    onChange={(e) => setLeaveSettings({ ...leaveSettings, earnedLeave: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground text-lg">Allow Leave Carry Forward</p>
                  <p className="text-muted-foreground">Unused leaves will be carried to next year</p>
                </div>
                <Switch
                  checked={leaveSettings.carryForward}
                  onCheckedChange={(checked) => setLeaveSettings({ ...leaveSettings, carryForward: checked })}
                />
              </div>
              <Button onClick={handleSave} size="lg" className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                { key: 'leaveApproval', label: 'Leave Approval Alerts', description: 'Notify when leave requests need approval' },
                { key: 'payrollReminder', label: 'Payroll Reminders', description: 'Remind about pending payroll processing' },
                { key: 'attendanceAlert', label: 'Attendance Alerts', description: 'Alert for absent employees' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-lg">{setting.label}</p>
                    <p className="text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, [setting.key]: checked })
                    }
                  />
                </div>
              ))}
              <Button onClick={handleSave} size="lg" className="gap-2 mt-4">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
