import React, { useState } from 'react';
import { 
  Building2,
  Save,
  Upload,
  Receipt,
  Bell,
  Shield,
  Palette
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function BusinessSettings() {
  const [businessProfile, setBusinessProfile] = useState({
    name: 'BizManager Electronics',
    email: 'contact@bizmanager.com',
    phone: '+91 98765 43210',
    address: '123, MG Road, Sector 5, Delhi - 110001',
    gstin: '07AAACC1234A1Z5',
    pan: 'AAACC1234A',
    website: 'www.bizmanager.com',
  });

  const [taxSettings, setTaxSettings] = useState({
    enableGST: true,
    defaultGSTRate: '18',
    enableCGSTSGST: true,
    enableIGST: false,
    includeInPrice: false,
    showTaxBreakdown: true,
  });

  const [notifications, setNotifications] = useState({
    emailInvoice: true,
    smsReminder: false,
    paymentReminder: true,
    lowStock: true,
    dailyReport: false,
    weeklyReport: true,
  });

  const handleSaveProfile = () => {
    toast.success('Business profile updated successfully');
  };

  const handleSaveTax = () => {
    toast.success('Tax settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white">
            <Building2 className="w-4 h-4 mr-2" />
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="tax" className="data-[state=active]:bg-white">
            <Receipt className="w-4 h-4 mr-2" />
            Tax Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Business Profile */}
        <TabsContent value="profile">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Business Profile</CardTitle>
              <CardDescription>Update your business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  BM
                </div>
                <div>
                  <Button variant="outline" className="border-slate-200">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-700">Business Name</Label>
                  <Input
                    value={businessProfile.name}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, name: e.target.value })}
                    className="mt-1.5 bg-white border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">Email Address</Label>
                  <Input
                    type="email"
                    value={businessProfile.email}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, email: e.target.value })}
                    className="mt-1.5 bg-white border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">Phone Number</Label>
                  <Input
                    value={businessProfile.phone}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, phone: e.target.value })}
                    className="mt-1.5 bg-white border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">Website</Label>
                  <Input
                    value={businessProfile.website}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, website: e.target.value })}
                    className="mt-1.5 bg-white border-slate-200"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-700">Business Address</Label>
                <Textarea
                  value={businessProfile.address}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, address: e.target.value })}
                  className="mt-1.5 bg-white border-slate-200"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-700">GSTIN</Label>
                  <Input
                    value={businessProfile.gstin}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, gstin: e.target.value })}
                    className="mt-1.5 bg-white border-slate-200"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">PAN Number</Label>
                  <Input
                    value={businessProfile.pan}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, pan: e.target.value })}
                    className="mt-1.5 bg-white border-slate-200"
                    placeholder="AAAAA0000A"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Tax Settings</CardTitle>
              <CardDescription>Configure GST and other tax options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">Enable GST</p>
                  <p className="text-sm text-slate-500">Apply GST to all invoices</p>
                </div>
                <Switch 
                  checked={taxSettings.enableGST} 
                  onCheckedChange={(v) => setTaxSettings({ ...taxSettings, enableGST: v })} 
                />
              </div>

              {taxSettings.enableGST && (
                <>
                  <div>
                    <Label className="text-slate-700">Default GST Rate</Label>
                    <Select 
                      value={taxSettings.defaultGSTRate} 
                      onValueChange={(v) => setTaxSettings({ ...taxSettings, defaultGSTRate: v })}
                    >
                      <SelectTrigger className="mt-1.5 w-48 bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="0">0% (Exempt)</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="28">28%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-800">Split into CGST + SGST</p>
                        <p className="text-sm text-slate-500">For intra-state transactions</p>
                      </div>
                      <Switch 
                        checked={taxSettings.enableCGSTSGST} 
                        onCheckedChange={(v) => setTaxSettings({ ...taxSettings, enableCGSTSGST: v })} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-800">Enable IGST</p>
                        <p className="text-sm text-slate-500">For inter-state transactions</p>
                      </div>
                      <Switch 
                        checked={taxSettings.enableIGST} 
                        onCheckedChange={(v) => setTaxSettings({ ...taxSettings, enableIGST: v })} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-800">Tax Inclusive Pricing</p>
                        <p className="text-sm text-slate-500">Prices already include tax</p>
                      </div>
                      <Switch 
                        checked={taxSettings.includeInPrice} 
                        onCheckedChange={(v) => setTaxSettings({ ...taxSettings, includeInPrice: v })} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-800">Show Tax Breakdown</p>
                        <p className="text-sm text-slate-500">Display detailed tax in invoices</p>
                      </div>
                      <Switch 
                        checked={taxSettings.showTaxBreakdown} 
                        onCheckedChange={(v) => setTaxSettings({ ...taxSettings, showTaxBreakdown: v })} 
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveTax}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Tax Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">Email Invoice to Customers</p>
                  <p className="text-sm text-slate-500">Auto-send invoice via email</p>
                </div>
                <Switch 
                  checked={notifications.emailInvoice} 
                  onCheckedChange={(v) => setNotifications({ ...notifications, emailInvoice: v })} 
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">SMS Payment Reminders</p>
                  <p className="text-sm text-slate-500">Send SMS for pending payments</p>
                </div>
                <Switch 
                  checked={notifications.smsReminder} 
                  onCheckedChange={(v) => setNotifications({ ...notifications, smsReminder: v })} 
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">Payment Due Alerts</p>
                  <p className="text-sm text-slate-500">Get notified when payments are overdue</p>
                </div>
                <Switch 
                  checked={notifications.paymentReminder} 
                  onCheckedChange={(v) => setNotifications({ ...notifications, paymentReminder: v })} 
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">Low Stock Alerts</p>
                  <p className="text-sm text-slate-500">Alert when inventory is low</p>
                </div>
                <Switch 
                  checked={notifications.lowStock} 
                  onCheckedChange={(v) => setNotifications({ ...notifications, lowStock: v })} 
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">Daily Summary Report</p>
                  <p className="text-sm text-slate-500">Receive daily business summary</p>
                </div>
                <Switch 
                  checked={notifications.dailyReport} 
                  onCheckedChange={(v) => setNotifications({ ...notifications, dailyReport: v })} 
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800">Weekly Summary Report</p>
                  <p className="text-sm text-slate-500">Receive weekly business summary</p>
                </div>
                <Switch 
                  checked={notifications.weeklyReport} 
                  onCheckedChange={(v) => setNotifications({ ...notifications, weeklyReport: v })} 
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
