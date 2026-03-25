import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Settings,
  Save,
  Bell,
  Shield,
  Database,
  Zap,
  Globe,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';

const PMSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    lowStockAlerts: true,
    orderNotifications: true,
    demoExpiryAlerts: true,
    
    // Security
    requireApprovalForDelete: true,
    enableSoftDeleteOnly: true,
    auditAllActions: true,
    
    // Automation
    autoDisableOnZeroStock: true,
    autoDemoCleanup: false,
    aiPricingSuggestions: true,
    aiInventoryForecast: true,
    
    // General
    defaultProductStatus: 'draft',
    lowStockThreshold: 10,
    demoExpiryDays: 14,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully');
    setSaving(false);
  };

  const handleExportData = () => {
    toast.success('Exporting product data...');
  };

  const handleImportData = () => {
    toast.info('Import feature coming soon');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-500" />
            Product Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure product manager behavior and automation
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </CardTitle>
          <CardDescription>Configure when and how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive email for important events</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Low Stock Alerts</Label>
              <p className="text-xs text-muted-foreground">Get notified when inventory is low</p>
            </div>
            <Switch
              checked={settings.lowStockAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, lowStockAlerts: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Order Notifications</Label>
              <p className="text-xs text-muted-foreground">Alerts for new orders and status changes</p>
            </div>
            <Switch
              checked={settings.orderNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, orderNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Demo Expiry Alerts</Label>
              <p className="text-xs text-muted-foreground">Notify before demos expire</p>
            </div>
            <Switch
              checked={settings.demoExpiryAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, demoExpiryAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security & Compliance
          </CardTitle>
          <CardDescription>Control access and data protection settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Approval for Delete</Label>
              <p className="text-xs text-muted-foreground">Admin approval required before deleting products</p>
            </div>
            <Switch
              checked={settings.requireApprovalForDelete}
              onCheckedChange={(checked) => setSettings({ ...settings, requireApprovalForDelete: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Soft Delete Only</Label>
              <p className="text-xs text-muted-foreground">Products are marked inactive instead of permanently deleted</p>
            </div>
            <Switch
              checked={settings.enableSoftDeleteOnly}
              onCheckedChange={(checked) => setSettings({ ...settings, enableSoftDeleteOnly: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Audit All Actions</Label>
              <p className="text-xs text-muted-foreground">Log all product-related actions for compliance</p>
            </div>
            <Switch
              checked={settings.auditAllActions}
              onCheckedChange={(checked) => setSettings({ ...settings, auditAllActions: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI & Automation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI & Automation
          </CardTitle>
          <CardDescription>Configure automated features and AI assistance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Disable on Zero Stock</Label>
              <p className="text-xs text-muted-foreground">Automatically disable products when out of stock</p>
            </div>
            <Switch
              checked={settings.autoDisableOnZeroStock}
              onCheckedChange={(checked) => setSettings({ ...settings, autoDisableOnZeroStock: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Demo Cleanup</Label>
              <p className="text-xs text-muted-foreground">Automatically remove expired demos</p>
            </div>
            <Switch
              checked={settings.autoDemoCleanup}
              onCheckedChange={(checked) => setSettings({ ...settings, autoDemoCleanup: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>AI Pricing Suggestions</Label>
              <p className="text-xs text-muted-foreground">Get AI-powered pricing recommendations</p>
            </div>
            <Switch
              checked={settings.aiPricingSuggestions}
              onCheckedChange={(checked) => setSettings({ ...settings, aiPricingSuggestions: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>AI Inventory Forecast</Label>
              <p className="text-xs text-muted-foreground">Enable demand prediction for inventory</p>
            </div>
            <Switch
              checked={settings.aiInventoryForecast}
              onCheckedChange={(checked) => setSettings({ ...settings, aiInventoryForecast: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4" />
            General Settings
          </CardTitle>
          <CardDescription>Configure default values and thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Low Stock Threshold</Label>
              <Input
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Alert when stock falls below this number</p>
            </div>
            <div>
              <Label>Demo Expiry Days</Label>
              <Input
                type="number"
                value={settings.demoExpiryDays}
                onChange={(e) => setSettings({ ...settings, demoExpiryDays: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Default demo duration in days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Data Management
          </CardTitle>
          <CardDescription>Import, export, and manage product data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export All Products
            </Button>
            <Button variant="outline" onClick={handleImportData}>
              <Upload className="w-4 h-4 mr-2" />
              Import Products
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that require caution</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Inactive Products
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This action is disabled for safety. Contact admin to enable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMSettings;
