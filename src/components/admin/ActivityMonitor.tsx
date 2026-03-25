import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  User, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Settings,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  actionType: "login" | "logout" | "create" | "update" | "delete" | "view" | "settings";
  module: string;
  timestamp: string;
  ip: string;
  status: "success" | "warning" | "failed";
  details?: string;
}

const activityLogs: ActivityLog[] = [
  { id: "1", user: "Rajesh Kumar", role: "Super Admin", action: "Updated system settings", actionType: "settings", module: "Settings", timestamp: "2 min ago", ip: "192.168.1.101", status: "success", details: "Changed email notification preferences" },
  { id: "2", user: "Priya Sharma", role: "Finance Manager", action: "Approved payout request", actionType: "update", module: "Finance", timestamp: "5 min ago", ip: "192.168.1.102", status: "success", details: "Payout #PAY-2024-1234 - $2,450" },
  { id: "3", user: "Amit Patel", role: "Developer", action: "Completed task #DEV-789", actionType: "update", module: "Tasks", timestamp: "12 min ago", ip: "192.168.1.103", status: "success" },
  { id: "4", user: "Sneha Reddy", role: "Support Agent", action: "Resolved ticket #TKT-456", actionType: "update", module: "Support", timestamp: "18 min ago", ip: "192.168.1.104", status: "success" },
  { id: "5", user: "Unknown", role: "N/A", action: "Failed login attempt", actionType: "login", module: "Auth", timestamp: "25 min ago", ip: "203.45.67.89", status: "failed", details: "Invalid credentials - 3 attempts" },
  { id: "6", user: "Vikram Singh", role: "Sales Manager", action: "Created new lead", actionType: "create", module: "Leads", timestamp: "32 min ago", ip: "192.168.1.105", status: "success" },
  { id: "7", user: "Rahul Mehta", role: "Franchise Owner", action: "Viewed revenue report", actionType: "view", module: "Finance", timestamp: "45 min ago", ip: "192.168.1.106", status: "success" },
  { id: "8", user: "Maya Pillai", role: "Influencer", action: "Generated promo link", actionType: "create", module: "Influencer", timestamp: "1 hour ago", ip: "192.168.1.107", status: "success" },
  { id: "9", user: "Deepak Joshi", role: "Developer", action: "Logged in", actionType: "login", module: "Auth", timestamp: "1.5 hours ago", ip: "192.168.1.108", status: "success" },
  { id: "10", user: "Kavitha Nair", role: "Reseller", action: "Updated profile", actionType: "update", module: "Profile", timestamp: "2 hours ago", ip: "192.168.1.109", status: "success" },
];

const ActivityMonitor = () => {
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const getActionIcon = (type: string) => {
    switch (type) {
      case "login": return <LogIn className="w-4 h-4" />;
      case "logout": return <LogOut className="w-4 h-4" />;
      case "create": return <Database className="w-4 h-4" />;
      case "update": return <Edit className="w-4 h-4" />;
      case "delete": return <Trash2 className="w-4 h-4" />;
      case "view": return <Eye className="w-4 h-4" />;
      case "settings": return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-neon-green bg-neon-green/20 border-neon-green/50";
      case "warning": return "text-neon-orange bg-neon-orange/20 border-neon-orange/50";
      case "failed": return "text-neon-red bg-neon-red/20 border-neon-red/50";
      default: return "";
    }
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesStatus = filter === "all" || log.status === filter;
    const matchesType = typeFilter === "all" || log.actionType === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Activity Monitor</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time system activity and audit logs</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-green/10 border border-neon-green/30">
            <Activity className="w-4 h-4 text-neon-green animate-pulse" />
            <span className="text-xs font-mono text-neon-green">LIVE MONITORING</span>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Actions Today", value: "2,847", icon: Activity, color: "text-primary" },
          { label: "Active Sessions", value: "89", icon: User, color: "text-neon-green" },
          { label: "Failed Attempts", value: "3", icon: AlertTriangle, color: "text-neon-red" },
          { label: "Avg Response", value: "45ms", icon: Clock, color: "text-neon-cyan" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-4"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-secondary/50 border-border/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 bg-secondary/50 border-border/50">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel"
      >
        <div className="divide-y divide-border/30">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  log.status === "failed" ? "bg-neon-red/20" : "bg-primary/20"
                }`}>
                  {getActionIcon(log.actionType)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{log.user}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5">
                      {log.role}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{log.action}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {log.module}
                    </span>
                    <span className="font-mono">{log.ip}</span>
                  </div>
                  {log.details && (
                    <div className="mt-2 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                      {log.details}
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <Badge className={`${getStatusColor(log.status)}`}>
                  {log.status === "success" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {log.status === "warning" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {log.status === "failed" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {log.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityMonitor;
