import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, BellOff, AlertTriangle, CheckCircle2, Info, 
  XCircle, Clock, Filter, Trash2, CheckCheck, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  { id: 1, type: "error", title: "Payment API Failed", message: "Stripe API returned error 502", module: "API", time: "2 mins ago", read: false },
  { id: 2, type: "warning", title: "Server Load High", message: "Asia server at 85% CPU", module: "Server", time: "15 mins ago", read: false },
  { id: 3, type: "success", title: "Demo Deployed", message: "CRM Demo v2.1 live", module: "Demo", time: "1 hour ago", read: false },
  { id: 4, type: "info", title: "New Lead Received", message: "5 new leads from Facebook", module: "Lead", time: "2 hours ago", read: true },
  { id: 5, type: "error", title: "SEO Score Dropped", message: "Homepage SEO down to 72", module: "SEO", time: "3 hours ago", read: true },
  { id: 6, type: "success", title: "APK Generated", message: "HR App APK ready for download", module: "APK", time: "4 hours ago", read: true },
  { id: 7, type: "warning", title: "Unpaid Service", message: "Image AI unpaid - stopping in 24h", module: "AI", time: "5 hours ago", read: true },
  { id: 8, type: "info", title: "Approval Required", message: "New product awaiting approval", module: "Approval", time: "6 hours ago", read: true },
];

const NOTIFICATION_SETTINGS = [
  { id: "errors", label: "Error Alerts", enabled: true },
  { id: "warnings", label: "Warning Alerts", enabled: true },
  { id: "success", label: "Success Notifications", enabled: true },
  { id: "info", label: "Info Updates", enabled: false },
  { id: "email", label: "Email Notifications", enabled: true },
  { id: "sound", label: "Sound Alerts", enabled: false },
];

export const UnifiedNotifications = () => {
  const [filter, setFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error": return XCircle;
      case "warning": return AlertTriangle;
      case "success": return CheckCircle2;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error": return "red";
      case "warning": return "amber";
      case "success": return "green";
      default: return "blue";
    }
  };

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Notification Center</h2>
          <p className="text-muted-foreground">All system alerts and updates in one place</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline">
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Unread", value: unreadCount, color: "orange" },
          { label: "Errors", value: 2, color: "red" },
          { label: "Warnings", value: 2, color: "amber" },
          { label: "Today", value: 8, color: "blue" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/30`}
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-xl bg-muted/20 border border-border/50"
        >
          <h3 className="text-sm font-medium text-white mb-4">Notification Settings</h3>
          <div className="grid grid-cols-3 gap-4">
            {NOTIFICATION_SETTINGS.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                <span className="text-sm text-white">{setting.label}</span>
                <Switch defaultChecked={setting.enabled} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "unread", "error", "warning", "success", "info"].map((f) => (
          <Button
            key={f}
            variant="outline"
            size="sm"
            onClick={() => setFilter(f)}
            className={cn(
              "capitalize",
              filter === f && "bg-orange-500/20 border-orange-500/50"
            )}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {NOTIFICATIONS.filter(n => {
          if (filter === "all") return true;
          if (filter === "unread") return !n.read;
          return n.type === filter;
        }).map((notification) => {
          const Icon = getTypeIcon(notification.type);
          const color = getTypeColor(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "p-4 rounded-xl border transition-all hover:bg-muted/10",
                notification.read ? "bg-muted/10 border-border/30" : "bg-muted/20 border-border/50"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.module}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <CheckCheck className="w-4 h-4 text-green-400" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
