import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Settings,
  Gauge,
  AlertTriangle,
  Bell,
  LogOut,
  Save,
  Shield,
  User,
  Mail,
  Smartphone
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AAMSettingsProps {
  activeSubSection: string;
}

const AAMSettings = ({ activeSubSection }: AAMSettingsProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const defaultLimits = [
    { name: "Default Daily API Limit", value: "10,000", unit: "requests" },
    { name: "Default Monthly API Limit", value: "300,000", unit: "requests" },
    { name: "Default Cost Cap (Daily)", value: "₹5,000", unit: "" },
    { name: "Default Cost Cap (Monthly)", value: "₹100,000", unit: "" },
    { name: "Max Concurrent Requests", value: "500", unit: "requests" },
    { name: "Request Timeout", value: "30", unit: "seconds" },
  ];

  const alertThresholds = [
    { name: "Low Wallet Balance", value: "5,000", unit: "₹", enabled: true },
    { name: "API Usage Warning", value: "85", unit: "%", enabled: true },
    { name: "Cost Spike Detection", value: "50", unit: "%", enabled: true },
    { name: "Error Rate Threshold", value: "5", unit: "%", enabled: true },
    { name: "Latency Warning", value: "500", unit: "ms", enabled: false },
  ];

  const notificationPrefs = [
    { name: "Email Notifications", enabled: true, description: "Receive alerts via email" },
    { name: "SMS Notifications", enabled: false, description: "Receive critical alerts via SMS" },
    { name: "Push Notifications", enabled: true, description: "Browser push notifications" },
    { name: "Daily Summary", enabled: true, description: "Daily usage summary email" },
    { name: "Weekly Report", enabled: true, description: "Weekly cost and usage report" },
    { name: "Real-time Alerts", enabled: true, description: "Instant alerts for critical issues" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure API & AI Manager preferences</p>
        </div>
        <Button
          onClick={() => handleAction("Save All Settings")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Default Limits */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Gauge className="w-5 h-5 text-purple-400" />
              Default Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {defaultLimits.map((limit) => (
              <div key={limit.name} className="flex items-center justify-between">
                <Label className="text-sm text-slate-300">{limit.name}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    defaultValue={limit.value}
                    className="w-32 bg-slate-800 border-white/10 text-white text-right"
                  />
                  {limit.unit && (
                    <span className="text-xs text-slate-400 w-16">{limit.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Alert Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertThresholds.map((threshold) => (
              <div key={threshold.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={threshold.enabled}
                    onCheckedChange={() => handleAction(`Toggle ${threshold.name}`)}
                  />
                  <Label className="text-sm text-slate-300">{threshold.name}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    defaultValue={threshold.value}
                    className="w-24 bg-slate-800 border-white/10 text-white text-right"
                    disabled={!threshold.enabled}
                  />
                  <span className="text-xs text-slate-400 w-8">{threshold.unit}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Notification Preferences */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notificationPrefs.map((pref) => (
              <div
                key={pref.name}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{pref.name}</p>
                  <p className="text-xs text-slate-400">{pref.description}</p>
                </div>
                <Switch
                  checked={pref.enabled}
                  onCheckedChange={() => handleAction(`Toggle ${pref.name}`)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-green-400" />
              Manager Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-white/5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">API Admin</p>
                <p className="text-sm text-slate-400">api.admin@softwarevala.com</p>
                <Badge variant="outline" className="text-purple-400 border-purple-400/30 mt-1">
                  Full Access
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Email</span>
                </div>
                <span className="text-sm text-white">api.admin@softwarevala.com</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Phone</span>
                </div>
                <span className="text-sm text-white">+91 98765 43210</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-white/10 text-slate-300 hover:bg-white/5"
              onClick={() => handleAction("Edit Profile")}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-slate-300 hover:bg-white/5"
                onClick={() => handleAction("Change Password")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-slate-300 hover:bg-white/5"
                onClick={() => handleAction("Enable 2FA")}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Two-Factor Authentication
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-slate-300 hover:bg-white/5"
                onClick={() => handleAction("View Sessions")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Active Sessions
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 text-slate-300 hover:bg-white/5"
                onClick={() => handleAction("API Keys")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Manage API Keys
              </Button>
            </div>
            <div className="pt-4 border-t border-white/10">
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => handleAction("Logout")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AAMSettings;
