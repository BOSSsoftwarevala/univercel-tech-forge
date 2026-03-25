import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ClipboardList, 
  Search, 
  Download,
  User,
  Clock,
  FileText,
  Shield,
  Eye,
  Lock,
  Filter
} from "lucide-react";

const AuditLogs = () => {
  const logs = [
    { id: "LOG-001", action: "Contract Signed", user: "Legal Admin", target: "Franchise Agreement - Mumbai", timestamp: "Dec 19, 2024 14:32:15", ip: "192.168.1.***", type: "signature" },
    { id: "LOG-002", action: "Document Viewed", user: "Dev-A7X", target: "Source Code Repository", timestamp: "Dec 19, 2024 14:28:45", ip: "192.168.2.***", type: "access" },
    { id: "LOG-003", action: "Policy Updated", user: "Compliance Officer", target: "Data Retention Policy v2.4", timestamp: "Dec 19, 2024 13:15:22", ip: "192.168.1.***", type: "edit" },
    { id: "LOG-004", action: "Access Revoked", user: "System", target: "Dev-Q4T - Source Code Access", timestamp: "Dec 19, 2024 12:00:00", ip: "System", type: "security" },
    { id: "LOG-005", action: "NDA Assigned", user: "HR Manager", target: "New Developer - Team Alpha", timestamp: "Dec 19, 2024 11:45:30", ip: "192.168.3.***", type: "assignment" },
    { id: "LOG-006", action: "Dispute Logged", user: "Support Team", target: "Payment Dispute - Franchise Partner", timestamp: "Dec 19, 2024 10:22:18", ip: "192.168.1.***", type: "dispute" },
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "signature":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40"><FileText className="w-3 h-3 mr-1" />Signature</Badge>;
      case "access":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40"><Eye className="w-3 h-3 mr-1" />Access</Badge>;
      case "edit":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40"><FileText className="w-3 h-3 mr-1" />Edit</Badge>;
      case "security":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40"><Shield className="w-3 h-3 mr-1" />Security</Badge>;
      case "assignment":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40"><User className="w-3 h-3 mr-1" />Assignment</Badge>;
      case "dispute":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40"><ClipboardList className="w-3 h-3 mr-1" />Dispute</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit Logs & Access Trails</h2>
          <p className="text-stone-500">Immutable record of all system activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50">
            <Lock className="w-3 h-3 mr-1" />
            Append-Only
          </Badge>
          <Button variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-stone-800/30 border border-stone-700/30 flex items-center gap-4"
      >
        <Shield className="w-6 h-6 text-amber-400" />
        <div>
          <p className="text-amber-300 font-medium">Tamper-Proof Audit Trail</p>
          <p className="text-sm text-stone-400">All logs are immutable. No delete or edit operations allowed. Full view restricted to Super Admin.</p>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <Input
            placeholder="Search logs by action, user, or target..."
            className="pl-10 bg-stone-800/50 border-stone-700/50 text-stone-200"
          />
        </div>
        <Button variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Logs (24h)", value: "2,847", icon: ClipboardList },
          { label: "Access Events", value: "1,234", icon: Eye },
          { label: "Security Events", value: "56", icon: Shield },
          { label: "Signature Events", value: "89", icon: FileText },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50 flex items-center gap-3"
          >
            <stat.icon className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-stone-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Logs Table */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800/50">
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Log ID</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Action</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">User</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Target</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Type</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Timestamp</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-stone-800/30 hover:bg-stone-800/30 transition-colors"
                >
                  <td className="p-4 text-stone-400 font-mono text-sm">{log.id}</td>
                  <td className="p-4 text-white font-medium">{log.action}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-stone-500" />
                      <span className="text-stone-300">{log.user}</span>
                    </div>
                  </td>
                  <td className="p-4 text-stone-400 max-w-[200px] truncate">{log.target}</td>
                  <td className="p-4">{getTypeBadge(log.type)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-stone-400 text-sm">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="p-4 text-stone-500 font-mono text-sm">{log.ip}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
