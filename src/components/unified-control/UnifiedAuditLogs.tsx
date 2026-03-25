import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Search, Filter, Download, Eye, 
  User, Clock, Activity, Shield, AlertTriangle, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const AUDIT_LOGS = [
  { id: 1, action: "API Stopped", module: "API", user: "System (Auto)", type: "auto", severity: "warning", time: "2 mins ago", details: "Stripe API stopped - unpaid" },
  { id: 2, action: "Demo Deployed", module: "Demo", user: "Dev Team", type: "manual", severity: "info", time: "15 mins ago", details: "CRM Demo v2.1 deployed to production" },
  { id: 3, action: "Approval Given", module: "Approval", user: "Boss", type: "manual", severity: "success", time: "1 hour ago", details: "New product approved" },
  { id: 4, action: "AI Model Added", module: "AI", user: "Admin", type: "manual", severity: "info", time: "2 hours ago", details: "GPT-4 Vision added" },
  { id: 5, action: "Security Alert", module: "Security", user: "System", type: "auto", severity: "error", time: "3 hours ago", details: "Unusual login attempt detected" },
  { id: 6, action: "Server Scaled", module: "Server", user: "System (Auto)", type: "auto", severity: "info", time: "4 hours ago", details: "Asia server auto-scaled to 8GB" },
  { id: 7, action: "Lead Converted", module: "Lead", user: "Sales Team", type: "manual", severity: "success", time: "5 hours ago", details: "ABC Corp converted to client" },
  { id: 8, action: "Payment Processed", module: "Billing", user: "System", type: "auto", severity: "success", time: "6 hours ago", details: "$5,000 payment received" },
];

const MODULES = ["All", "AI", "API", "Demo", "Lead", "Server", "Billing", "Security", "Approval"];

export const UnifiedAuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedType, setSelectedType] = useState("all");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "red";
      case "warning": return "amber";
      case "success": return "green";
      default: return "blue";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Logs & Audit Trail</h2>
          <p className="text-muted-foreground">Complete activity history with immutable records</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total Logs", value: "12,456", icon: FileText, color: "blue" },
          { label: "Today", value: 234, icon: Clock, color: "green" },
          { label: "Auto Actions", value: 89, icon: Activity, color: "violet" },
          { label: "Manual Actions", value: 145, icon: User, color: "orange" },
          { label: "Alerts", value: 12, icon: AlertTriangle, color: "red" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/30`}
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/20"
          />
        </div>
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-[150px] bg-muted/20">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            {MODULES.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 p-1 rounded-lg bg-muted/20">
          {["all", "auto", "manual"].map((t) => (
            <Button
              key={t}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType(t)}
              className={cn("capitalize", selectedType === t && "bg-background")}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">TIME</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">ACTION</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">MODULE</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">USER</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">TYPE</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">SEVERITY</th>
              <th className="text-right p-3 text-xs font-medium text-muted-foreground">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOGS.map((log) => {
              const severityColor = getSeverityColor(log.severity);
              return (
                <tr key={log.id} className="border-t border-border/30 hover:bg-muted/10">
                  <td className="p-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.time}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-white font-medium">{log.action}</span>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">
                      {log.module}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{log.user}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        log.type === "auto" && "border-violet-500/50 text-violet-400",
                        log.type === "manual" && "border-blue-500/50 text-blue-400"
                      )}
                    >
                      {log.type}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize border-${severityColor}-500/50 text-${severityColor}-400`}
                    >
                      {log.severity}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {log.details}
                      </span>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Immutable Notice */}
      <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/30">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-white">Immutable Audit Trail</p>
            <p className="text-xs text-muted-foreground">
              All logs are cryptographically sealed and cannot be modified or deleted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
