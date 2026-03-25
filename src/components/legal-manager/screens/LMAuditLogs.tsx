import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Users, GitBranch, FileText, Shield, Download, Eye, Filter, Search } from "lucide-react";
import { toast } from "sonner";

interface LMAuditLogsProps {
  activeSubSection: string;
}

const auditLogs = [
  { id: "1", action: "User Accepted Agreement", user: "john.doe@email.com", type: "Acceptance", timestamp: "2 mins ago", status: "success" },
  { id: "2", action: "Agreement Version Updated", user: "legal.admin", type: "Version", timestamp: "15 mins ago", status: "info" },
  { id: "3", action: "Policy Change Published", user: "legal.manager", type: "Policy", timestamp: "1 hour ago", status: "success" },
  { id: "4", action: "Compliance Check Passed", user: "system", type: "Compliance", timestamp: "2 hours ago", status: "success" },
  { id: "5", action: "Agreement Rejected", user: "user123", type: "Rejection", timestamp: "3 hours ago", status: "warning" },
  { id: "6", action: "Export for Audit Generated", user: "legal.admin", type: "Export", timestamp: "1 day ago", status: "info" },
];

const LMAuditLogs = ({ activeSubSection }: LMAuditLogsProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      export: () => toast.success(`Exported: ${item}`),
      filter: () => toast.info(`Filtering: ${item}`),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg">
          <History className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit & Logs</h1>
          <p className="text-muted-foreground">Complete audit trail for legal compliance</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Users, label: "Acceptance Logs", onClick: () => handleAction("view", "User Acceptance Logs") },
          { icon: GitBranch, label: "Version History", onClick: () => handleAction("view", "Agreement Version History") },
          { icon: FileText, label: "Legal Changes", onClick: () => handleAction("view", "Legal Changes Log") },
          { icon: Shield, label: "Compliance Logs", onClick: () => handleAction("view", "Compliance Logs") },
          { icon: Download, label: "Export Audit", onClick: () => handleAction("export", "Audit Data") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-slate-500/10 border-slate-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Audit Log Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Recent Activity
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleAction("filter", "Logs")}>
                <Filter className="w-4 h-4 mr-1" /> Filter
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAction("export", "All Logs")}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <motion.div
                key={log.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-600/20 flex items-center justify-center">
                    <History className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">by {log.user}</span>
                      <Badge variant="outline" className="text-xs">{log.type}</Badge>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={log.status === "success" ? "bg-emerald-500/20 text-emerald-400" : log.status === "warning" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}>
                    {log.status}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", log.action)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMAuditLogs;
