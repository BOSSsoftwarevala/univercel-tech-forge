import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Lock, 
  Download,
  Calendar,
  User,
  Activity
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  target: string;
  details: string;
  category: "campaign" | "content" | "ai" | "publish";
}

const mockAuditLogs: AuditEntry[] = [
  {
    id: "log-001",
    timestamp: "2024-01-20 14:32:15",
    action: "Campaign Created",
    actor: "MM-7842",
    target: "Demo Request Campaign",
    details: "New campaign created with objective: Demo",
    category: "campaign",
  },
  {
    id: "log-002",
    timestamp: "2024-01-20 13:15:42",
    action: "Content Approved",
    actor: "System",
    target: "Q1 Lead Gen - Primary Headline",
    details: "Approval workflow completed",
    category: "content",
  },
  {
    id: "log-003",
    timestamp: "2024-01-20 11:08:33",
    action: "AI Suggestion Reviewed",
    actor: "MM-7842",
    target: "Headline Optimization",
    details: "Marked as reviewed, pending implementation",
    category: "ai",
  },
  {
    id: "log-004",
    timestamp: "2024-01-19 16:45:21",
    action: "Campaign Paused",
    actor: "MM-7842",
    target: "Brand Awareness Social",
    details: "Paused for creative refresh",
    category: "publish",
  },
  {
    id: "log-005",
    timestamp: "2024-01-19 10:22:18",
    action: "Content Edited",
    actor: "MM-7842",
    target: "Welcome Sequence - Email 1",
    details: "Version 5 created",
    category: "content",
  },
];

const MMReportsAudit = () => {
  const [logs] = useState<AuditEntry[]>(mockAuditLogs);

  const getCategoryColor = (category: AuditEntry["category"]) => {
    switch (category) {
      case "campaign": return "bg-cyan-500/20 text-cyan-400";
      case "content": return "bg-purple-500/20 text-purple-400";
      case "ai": return "bg-pink-500/20 text-pink-400";
      case "publish": return "bg-emerald-500/20 text-emerald-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Generating read-only PDF report. Action logged.",
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <FileText className="h-5 w-5 text-slate-400" />
            Reports & Audit Log
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
              <Lock className="h-3 w-3 mr-1" />
              Read-Only
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleExportPDF}
            >
              <Download className="h-3 w-3 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audit Log Table */}
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Timestamp
                </th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">
                  <Activity className="h-3 w-3 inline mr-1" />
                  Action
                </th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">
                  <User className="h-3 w-3 inline mr-1" />
                  Actor
                </th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">Target</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-slate-700/50 hover:bg-slate-800/30"
                >
                  <td className="py-2 px-3 text-slate-400 text-xs font-mono">
                    {log.timestamp}
                  </td>
                  <td className="py-2 px-3 text-slate-100">{log.action}</td>
                  <td className="py-2 px-3 text-slate-300 font-mono text-xs">
                    {log.actor}
                  </td>
                  <td className="py-2 px-3 text-slate-300">{log.target}</td>
                  <td className="py-2 px-3">
                    <Badge className={getCategoryColor(log.category)}>
                      {log.category}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Immutable Notice */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            📋 Audit logs are IMMUTABLE. All actions (campaign create/edit, approvals,
            AI suggestions, publish/pause) are permanently recorded.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMReportsAudit;
