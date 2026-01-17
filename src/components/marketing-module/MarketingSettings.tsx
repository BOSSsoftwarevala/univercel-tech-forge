import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Settings, Shield, Lock, Bell, 
  Globe2, Zap, Eye, FileText, Users
} from "lucide-react";
import { toast } from "sonner";

const securitySettings = [
  { id: "role-access", label: "Role-Based Access", description: "Only assigned roles can view data", enabled: true, locked: true },
  { id: "no-delete", label: "No Delete (Pause Only)", description: "Campaigns can only be paused, not deleted", enabled: true, locked: true },
  { id: "audit-log", label: "Full Audit Logging", description: "All actions logged immutably", enabled: true, locked: true },
  { id: "mask-data", label: "Mask Sensitive Data", description: "Hide lead contact details by default", enabled: true, locked: false },
];

const automationSettings = [
  { id: "ai-optimize", label: "AI Auto-Optimization", description: "Let AI optimize campaigns daily", enabled: true },
  { id: "auto-rebalance", label: "Budget Auto-Rebalance", description: "AI redistributes budget based on ROI", enabled: true },
  { id: "auto-translate", label: "Auto Language Translation", description: "Translate content to local languages", enabled: true },
  { id: "smart-bidding", label: "Smart Bidding", description: "AI adjusts bids in real-time", enabled: false },
];

const notificationSettings = [
  { id: "budget-alert", label: "Budget Alerts", description: "Notify when budget threshold reached", enabled: true },
  { id: "lead-alert", label: "Hot Lead Alerts", description: "Instant notification for high-value leads", enabled: true },
  { id: "performance-alert", label: "Performance Drops", description: "Alert on significant ROI drops", enabled: true },
  { id: "daily-summary", label: "Daily Email Summary", description: "Morning report via email", enabled: false },
];

export const MarketingSettings = () => {
  const [settings, setSettings] = useState({
    security: securitySettings,
    automation: automationSettings,
    notifications: notificationSettings,
  });

  const handleToggle = (category: string, settingId: string, newValue: boolean) => {
    toast.success(`${settingId} ${newValue ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing Settings</h1>
          <p className="text-muted-foreground">Configure security, automation & notifications</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Shield className="w-3 h-3 mr-1" />
          Secured
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Security & Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securitySettings.map((setting) => (
                <div 
                  key={setting.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
                >
                  <div className="flex items-center gap-3">
                    {setting.locked && (
                      <Lock className="w-4 h-4 text-amber-400" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    disabled={setting.locked}
                    onCheckedChange={(val) => handleToggle("security", setting.id, val)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              AI Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automationSettings.map((setting) => (
                <div 
                  key={setting.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
                >
                  <div>
                    <p className="font-medium text-foreground">{setting.label}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={(val) => handleToggle("automation", setting.id, val)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificationSettings.map((setting) => (
                <div 
                  key={setting.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
                >
                  <div>
                    <p className="font-medium text-foreground">{setting.label}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={(val) => handleToggle("notifications", setting.id, val)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <p className="font-medium text-amber-400">Locked Settings</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Some security settings are locked and cannot be modified to ensure data integrity and compliance.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Authorized Users</span>
                  </div>
                  <Badge variant="outline">5</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Active Regions</span>
                  </div>
                  <Badge variant="outline">8</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Audit Logs</span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    12,456
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
