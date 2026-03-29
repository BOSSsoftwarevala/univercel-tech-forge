import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Key,
  Fingerprint,
  Globe,
  Clock,
  Ban,
  Activity,
  FileWarning
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface SecurityAlert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: any;
}

const securityAlerts: SecurityAlert[] = [
  { id: "1", type: "warning", title: "Multiple failed login attempts", description: "IP 203.45.67.89 - 5 failed attempts in last hour", timestamp: "25 min ago", resolved: false },
  { id: "2", type: "info", title: "New device login", description: "User 'Vikram Singh' logged in from new device", timestamp: "1 hour ago", resolved: true },
  { id: "3", type: "critical", title: "Suspicious API activity detected", description: "Unusual request pattern from Analytics Engine", timestamp: "2 hours ago", resolved: false },
  { id: "4", type: "warning", title: "Password policy violation", description: "3 users have passwords older than 90 days", timestamp: "5 hours ago", resolved: false },
  { id: "5", type: "info", title: "Security scan completed", description: "Weekly vulnerability scan completed - no issues found", timestamp: "1 day ago", resolved: true },
];

const securitySettings: SecuritySetting[] = [
  { id: "2fa", name: "Two-Factor Authentication", description: "Require 2FA for all admin users", enabled: true, icon: Fingerprint },
  { id: "session", name: "Session Timeout", description: "Auto logout after 30 minutes of inactivity", enabled: true, icon: Clock },
  { id: "ip-whitelist", name: "IP Whitelisting", description: "Restrict access to whitelisted IPs only", enabled: false, icon: Globe },
  { id: "brute-force", name: "Brute Force Protection", description: "Lock account after 5 failed attempts", enabled: true, icon: Ban },
  { id: "audit-log", name: "Enhanced Audit Logging", description: "Log all sensitive operations", enabled: true, icon: Activity },
  { id: "encryption", name: "Data Encryption", description: "Encrypt sensitive data at rest", enabled: true, icon: Lock },
];

const SecurityCenter = () => {
  const [settings, setSettings] = useState(securitySettings);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical": return "border-neon-red/50 bg-neon-red/10";
      case "warning": return "border-neon-orange/50 bg-neon-orange/10";
      case "info": return "border-neon-cyan/50 bg-neon-cyan/10";
      default: return "";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertTriangle className="w-5 h-5 text-neon-red" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-neon-orange" />;
      case "info": return <Shield className="w-5 h-5 text-neon-cyan" />;
      default: return null;
    }
  };

  const unresolvedCount = securityAlerts.filter(a => !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Security Center</h1>
          <p className="text-muted-foreground text-sm mt-1">System security monitoring and configuration</p>
        </div>
        <div className="flex items-center gap-3">
          {unresolvedCount > 0 ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-orange/10 border border-neon-orange/30">
              <AlertTriangle className="w-4 h-4 text-neon-orange" />
              <span className="text-sm font-mono text-neon-orange">{unresolvedCount} UNRESOLVED ALERTS</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30">
              <CheckCircle className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-mono text-neon-green">ALL CLEAR</span>
            </div>
          )}
        </div>
      </div>

      {/* Security Score */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Security Score", value: "94/100", color: "text-neon-green", subtext: "Excellent" },
          { label: "Active Sessions", value: "89", color: "text-primary", subtext: "All verified" },
          { label: "Blocked IPs", value: "127", color: "text-neon-red", subtext: "Last 30 days" },
          { label: "Last Scan", value: "2h ago", color: "text-neon-cyan", subtext: "No issues" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-4"
          >
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className={`text-2xl font-mono font-bold mt-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.subtext}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Security Alerts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel"
        >
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileWarning className="w-5 h-5 text-primary" />
                <h2 className="font-mono font-semibold text-foreground">Security Alerts</h2>
              </div>
              <Badge variant="outline">{securityAlerts.length} total</Badge>
            </div>
          </div>
          
          <div className="divide-y divide-border/30 max-h-[400px] overflow-auto">
            {securityAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{alert.title}</span>
                      {alert.resolved && (
                        <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50 text-[10px]">
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button size="sm" variant="outline" className="text-xs">
                      Resolve
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel"
        >
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="font-mono font-semibold text-foreground">Security Settings</h2>
            </div>
          </div>
          
          <div className="divide-y divide-border/30">
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <motion.div
                  key={setting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      setting.enabled ? "bg-primary/20" : "bg-secondary"
                    }`}>
                      <Icon className={`w-5 h-5 ${setting.enabled ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{setting.name}</div>
                      <div className="text-xs text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleSetting(setting.id)}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Access Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="font-mono font-semibold text-foreground">Access Control Overview</h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {[
            { role: "Super Admin", count: 2, access: "Full", color: "bg-primary" },
            { role: "Finance", count: 3, access: "Finance + View All", color: "bg-neon-teal" },
            { role: "Developer", count: 28, access: "Dev + Tasks", color: "bg-neon-purple" },
            { role: "Support", count: 12, access: "Support Only", color: "bg-neon-orange" },
            { role: "Reseller", count: 156, access: "Sales Only", color: "bg-neon-green" },
          ].map((item) => (
            <div key={item.role} className="text-center p-3 rounded-lg bg-secondary/50">
              <div className={`w-4 h-4 rounded-full ${item.color} mx-auto mb-2`} />
              <div className="font-mono font-semibold text-foreground">{item.role}</div>
              <div className="text-2xl font-mono text-primary mt-1">{item.count}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{item.access}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityCenter;
