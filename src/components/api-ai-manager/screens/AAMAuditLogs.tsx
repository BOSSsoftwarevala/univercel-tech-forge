import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Power,
  Wallet,
  Receipt,
  Activity,
  Shield,
  Download,
  Filter,
  Search,
  Eye,
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface AAMAuditLogsProps {
  activeSubSection: string;
}

const AAMAuditLogs = ({ activeSubSection }: AAMAuditLogsProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const logCategories = [
    { label: "API On/Off", value: "156", icon: <Power className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
    { label: "Wallet Transactions", value: "423", icon: <Wallet className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
    { label: "Billing Logs", value: "892", icon: <Receipt className="w-5 h-5" />, color: "from-purple-500 to-indigo-500" },
    { label: "Usage Logs", value: "12,450", icon: <Activity className="w-5 h-5" />, color: "from-orange-500 to-amber-500" },
    { label: "Admin Actions", value: "78", icon: <Shield className="w-5 h-5" />, color: "from-red-500 to-pink-500" },
  ];

  const recentLogs = [
    {
      id: "LOG001",
      type: "api_toggle",
      action: "OpenAI API disabled",
      user: "admin@example.com",
      role: "Admin",
      time: "2 min ago",
      ip: "192.168.1.45",
      details: "Disabled due to cost spike alert"
    },
    {
      id: "LOG002",
      type: "wallet",
      action: "UPI payment received",
      user: "finance@example.com",
      role: "Finance",
      time: "15 min ago",
      ip: "192.168.1.100",
      details: "+₹10,000 via UPI"
    },
    {
      id: "LOG003",
      type: "billing",
      action: "Invoice generated",
      user: "system",
      role: "System",
      time: "1 hour ago",
      ip: "localhost",
      details: "Monthly invoice #INV-2024-001"
    },
    {
      id: "LOG004",
      type: "usage",
      action: "Rate limit exceeded",
      user: "user123@example.com",
      role: "User",
      time: "2 hours ago",
      ip: "45.33.22.11",
      details: "SMS API rate limit exceeded by 150%"
    },
    {
      id: "LOG005",
      type: "admin",
      action: "Role API limit changed",
      user: "superadmin@example.com",
      role: "Super Admin",
      time: "3 hours ago",
      ip: "192.168.1.1",
      details: "Developer role limit increased to 75,000"
    },
    {
      id: "LOG006",
      type: "api_toggle",
      action: "Vision AI enabled",
      user: "admin@example.com",
      role: "Admin",
      time: "5 hours ago",
      ip: "192.168.1.45",
      details: "Re-enabled after cost optimization"
    },
    {
      id: "LOG007",
      type: "wallet",
      action: "API cost deducted",
      user: "system",
      role: "System",
      time: "6 hours ago",
      ip: "localhost",
      details: "-₹1,250 for OpenAI usage"
    },
  ];

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case "api_toggle": return "text-blue-400 border-blue-400/30 bg-blue-500/10";
      case "wallet": return "text-green-400 border-green-400/30 bg-green-500/10";
      case "billing": return "text-purple-400 border-purple-400/30 bg-purple-500/10";
      case "usage": return "text-orange-400 border-orange-400/30 bg-orange-500/10";
      case "admin": return "text-red-400 border-red-400/30 bg-red-500/10";
      default: return "text-slate-400 border-slate-400/30 bg-slate-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit & Logs</h1>
          <p className="text-slate-400 text-sm mt-1">Complete audit trail for all API operations</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Export CSV")}
            className="border-white/20 text-slate-300 hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Export PDF")}
            className="border-white/20 text-slate-300 hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Log Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {logCategories.map((category, index) => (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="bg-slate-900/50 border-white/10 cursor-pointer hover:border-purple-500/30 transition-all"
              onClick={() => handleAction(`Filter by ${category.label}`)}
            >
              <CardContent className="p-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} w-fit mb-3`}>
                  {category.icon}
                </div>
                <p className="text-xl font-bold text-white">{category.value}</p>
                <p className="text-xs text-slate-400 mt-1">{category.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10 bg-slate-800 border-white/10 text-white"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="border-white/10 text-slate-300 hover:bg-white/5"
              onClick={() => handleAction("Filter")}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-slate-300 hover:bg-white/5"
              onClick={() => handleAction("Date Range")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            Recent Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-purple-500/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={getLogTypeColor(log.type)}>
                    {log.type.replace('_', ' ')}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium text-white">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>{log.role}</span>
                      <span>•</span>
                      <span className="font-mono">{log.ip}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{log.time}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                    onClick={() => handleAction(`View ${log.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={() => handleAction("Load More Logs")}
            >
              Load More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AAMAuditLogs;
