import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building2, 
  Upload, 
  Bell, 
  Shield,
  Globe,
  CreditCard,
  FileText,
  CheckCircle
} from 'lucide-react';

export function MMSettingsScreen() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-purple-400" />
          Settings
        </h1>
        <p className="text-slate-400 mt-1">Manage your marketplace preferences</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Franchise Branding */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-400" />
              Franchise Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">
              Your branding will appear on invoices, proposals, and client-facing screens.
            </p>

            {/* Logo Upload */}
            <div>
              <Label className="text-sm">Franchise Logo</Label>
              <div className="mt-2 border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-400">Click to upload logo</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>

            {/* Business Name */}
            <div>
              <Label className="text-sm">Business Name</Label>
              <Input 
                placeholder="Enter your business name"
                className="mt-2 bg-slate-900 border-slate-600"
                defaultValue="ABC Tech Solutions"
              />
            </div>

            {/* Business Address */}
            <div>
              <Label className="text-sm">Business Address</Label>
              <Input 
                placeholder="Enter your business address"
                className="mt-2 bg-slate-900 border-slate-600"
                defaultValue="123 Tech Park, Mumbai"
              />
            </div>

            <Button className="w-full bg-purple-500 hover:bg-purple-600">
              Save Branding
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-xs text-slate-400">Get notified on order status changes</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="font-medium">Development Progress</p>
                <p className="text-xs text-slate-400">Updates on your software development</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="font-medium">Wallet Alerts</p>
                <p className="text-xs text-slate-400">Low balance and transaction alerts</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="font-medium">New Products</p>
                <p className="text-xs text-slate-400">Be notified when new products launch</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="font-medium">Promotional Offers</p>
                <p className="text-xs text-slate-400">Special discounts and offers</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-400">Franchise ID</p>
                <p className="font-medium">FRN-2024-0042</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-400">Region</p>
                <p className="font-medium">Mumbai, India</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-400">Plan</p>
                <p className="font-medium text-purple-400">Premium</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-400">Discount Rate</p>
                <p className="font-medium text-emerald-400">30%</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-emerald-400">Account Verified</p>
                  <p className="text-xs text-slate-400">All documents approved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-400" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="font-medium">Auto-Recharge</p>
                <p className="text-xs text-slate-400">Automatically add funds when balance is low</p>
              </div>
              <Switch />
            </div>

            <div>
              <Label className="text-sm">Minimum Balance Alert</Label>
              <Input 
                type="number"
                placeholder="10000"
                className="mt-2 bg-slate-900 border-slate-600"
                defaultValue="10000"
              />
              <p className="text-xs text-slate-400 mt-1">Get alerted when balance falls below this amount</p>
            </div>

            <div>
              <Label className="text-sm">Saved Payment Methods</Label>
              <div className="mt-2 p-3 rounded-lg bg-slate-900/50 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                  <span>UPI - test@upi</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Default</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full border-slate-600">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            Documents & Agreements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <FileText className="h-6 w-6 text-purple-400 mb-2" />
              <p className="font-medium">Franchise Agreement</p>
              <p className="text-xs text-slate-400 mb-3">Signed on Jan 1, 2024</p>
              <Button variant="outline" size="sm" className="w-full border-slate-600">
                View
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <FileText className="h-6 w-6 text-purple-400 mb-2" />
              <p className="font-medium">Terms of Service</p>
              <p className="text-xs text-slate-400 mb-3">Last updated Dec 15, 2023</p>
              <Button variant="outline" size="sm" className="w-full border-slate-600">
                View
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <FileText className="h-6 w-6 text-purple-400 mb-2" />
              <p className="font-medium">Privacy Policy</p>
              <p className="text-xs text-slate-400 mb-3">Last updated Dec 15, 2023</p>
              <Button variant="outline" size="sm" className="w-full border-slate-600">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
