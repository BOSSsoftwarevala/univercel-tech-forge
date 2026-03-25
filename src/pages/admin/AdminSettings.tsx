import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Settings, Save, Users, DollarSign, Shield } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    defaultCommissionRate: 10,
    allowResellerRegistration: true,
    requireApproval: true,
    autoProcessPayouts: false,
    minPayoutAmount: 50
  });
  const [saving, setSaving] = useState(false);

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to database
      localStorage.setItem('admin-reseller-settings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Load settings from localStorage (in real app, load from database)
    const saved = localStorage.getItem('admin-reseller-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reseller Settings</h1>
        <p className="text-gray-600">Configure reseller program settings and policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Commission Settings
            </CardTitle>
            <CardDescription>
              Configure default commission rates and payout policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="commission">Default Commission Rate (%)</Label>
              <Input
                id="commission"
                type="number"
                value={settings.defaultCommissionRate}
                onChange={(e) => setSettings({...settings, defaultCommissionRate: parseFloat(e.target.value)})}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="minPayout">Minimum Payout Amount ($)</Label>
              <Input
                id="minPayout"
                type="number"
                value={settings.minPayoutAmount}
                onChange={(e) => setSettings({...settings, minPayoutAmount: parseFloat(e.target.value)})}
                min="0"
                step="0.01"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Registration Settings
            </CardTitle>
            <CardDescription>
              Control reseller registration and approval process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowRegistration">Allow Reseller Registration</Label>
                <p className="text-sm text-gray-600">Let users apply to become resellers</p>
              </div>
              <Switch
                id="allowRegistration"
                checked={settings.allowResellerRegistration}
                onCheckedChange={(checked) => setSettings({...settings, allowResellerRegistration: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireApproval">Require Admin Approval</Label>
                <p className="text-sm text-gray-600">Applications need admin approval</p>
              </div>
              <Switch
                id="requireApproval"
                checked={settings.requireApproval}
                onCheckedChange={(checked) => setSettings({...settings, requireApproval: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoPayouts">Auto-Process Payouts</Label>
                <p className="text-sm text-gray-600">Automatically process approved payouts</p>
              </div>
              <Switch
                id="autoPayouts"
                checked={settings.autoProcessPayouts}
                onCheckedChange={(checked) => setSettings({...settings, autoProcessPayouts: checked})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Policies
          </CardTitle>
          <CardDescription>
            Security settings and program policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Current Policies</h4>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• All reseller applications require admin approval</li>
                <li>• Commission rates are set per reseller by administrators</li>
                <li>• Payouts are processed manually by administrators</li>
                <li>• Resellers can only access their own data</li>
                <li>• All transactions are logged and auditable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
