import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  FileText,
  Lock,
  Clock,
  User,
  Filter,
  Eye,
  Shield
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AuditLogs = () => {
  const [actionFilter, setActionFilter] = useState("all");

  const auditStats = [
    { label: "Total Logs", value: "48,293", period: "All time" },
    { label: "Today's Actions", value: "156", period: "Last 24 hours" },
    { label: "Admin Actions", value: "23", period: "Last 24 hours" },
    { label: "System Events", value: "89", period: "Last 24 hours" },
  ];

  const auditLogs = [
    {
      id: "AUD-2035-48293",
      timestamp: "2035-12-18 15:42:31",
      action: "PAYOUT_APPROVED",
      category: "Finance",
      user: "Finance Admin",
      role: "Super Admin",
      description: "Approved payout PAY-2035-0890 for Mumbai Franchise ($4,820.00)",
      ip: "192.168.1.100",
      details: { payoutId: "PAY-2035-0890", amount: 4820, recipient: "Mumbai Franchise" },
    },
    {
      id: "AUD-2035-48292",
      timestamp: "2035-12-18 15:38:15",
      action: "INVOICE_GENERATED",
      category: "Invoice",
      user: "System",
      role: "Automated",
      description: "Auto-generated invoice INV-2035-001247 for ABC Corporation",
      ip: "System",
      details: { invoiceId: "INV-2035-001247", amount: 293.82 },
    },
    {
      id: "AUD-2035-48291",
      timestamp: "2035-12-18 15:25:44",
      action: "FRAUD_FLAGGED",
      category: "Security",
      user: "AI Scanner",
      role: "Automated",
      description: "Flagged transaction TXN-2035-F001 for duplicate payment pattern",
      ip: "System",
      details: { transactionId: "TXN-2035-F001", reason: "Duplicate Detection" },
    },
    {
      id: "AUD-2035-48290",
      timestamp: "2035-12-18 15:12:08",
      action: "COMMISSION_RELEASED",
      category: "Finance",
      user: "System",
      role: "Automated",
      description: "Released commission $37.35 to John Smith (Reseller)",
      ip: "System",
      details: { commissionId: "COM-2035-1247", amount: 37.35 },
    },
    {
      id: "AUD-2035-48289",
      timestamp: "2035-12-18 14:58:22",
      action: "TRANSACTION_FROZEN",
      category: "Security",
      user: "Finance Admin",
      role: "Super Admin",
      description: "Manually froze transaction TXN-2035-F002 pending investigation",
      ip: "192.168.1.100",
      details: { transactionId: "TXN-2035-F002", reason: "Manual Review" },
    },
    {
      id: "AUD-2035-48288",
      timestamp: "2035-12-18 14:45:11",
      action: "WALLET_UPDATED",
      category: "Finance",
      user: "System",
      role: "Automated",
      description: "Updated Reseller Pool wallet balance (+$37.35)",
      ip: "System",
      details: { wallet: "Reseller Pool", change: 37.35 },
    },
    {
      id: "AUD-2035-48287",
      timestamp: "2035-12-18 14:30:05",
      action: "LOGIN",
      category: "Access",
      user: "Finance Admin",
      role: "Super Admin",
      description: "User logged in to Finance Manager module",
      ip: "192.168.1.100",
      details: { module: "Finance Manager" },
    },
    {
      id: "AUD-2035-48286",
      timestamp: "2035-12-18 14:15:33",
      action: "PAYOUT_REJECTED",
      category: "Finance",
      user: "Finance Admin",
      role: "Super Admin",
      description: "Rejected payout request PAY-2035-0885 - Verification failed",
      ip: "192.168.1.100",
      details: { payoutId: "PAY-2035-0885", reason: "Verification Failed" },
    },
  ];

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      Finance: "bg-cyan-100 text-cyan-700",
      Invoice: "bg-blue-100 text-blue-700",
      Security: "bg-red-100 text-red-700",
      Access: "bg-purple-100 text-purple-700",
    };
    return styles[category] || "bg-slate-100 text-slate-700";
  };

  const getActionIcon = (action: string) => {
    if (action.includes("APPROVED") || action.includes("RELEASED")) {
      return <div className="w-2 h-2 rounded-full bg-cyan-500" />;
    }
    if (action.includes("REJECTED") || action.includes("FROZEN") || action.includes("FLAGGED")) {
      return <div className="w-2 h-2 rounded-full bg-red-500" />;
    }
    return <div className="w-2 h-2 rounded-full bg-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
          <p className="text-slate-500 text-sm">Immutable, timestamped record of all financial actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Compliance Banner */}
      <Card className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <Shield className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Legal Compliance Mode Active</p>
                <p className="text-sm text-slate-500">All logs are immutable, encrypted, and retained for 7 years</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-slate-500">
                <Lock className="w-4 h-4" />
                Tamper-proof
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-4 h-4" />
                UTC Timestamps
              </div>
              <Badge variant="outline" className="text-cyan-600 border-cyan-300">GST/VAT Compliant</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {auditStats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by ID, action, user..." className="pl-9" />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="invoice">Invoice</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="access">Access</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Audit Log Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-l-4 border-l-transparent hover:border-l-cyan-500"
              >
                <div className="flex items-center gap-2 min-w-[180px]">
                  {getActionIcon(log.action)}
                  <div>
                    <p className="text-xs font-mono text-slate-500">{log.timestamp}</p>
                    <p className="text-xs text-slate-400">{log.id}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${getCategoryBadge(log.category)} text-xs`}>
                      {log.category}
                    </Badge>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{log.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{log.user}</span>
                    <Badge variant="outline" className="text-[10px] px-1">{log.role}</Badge>
                  </div>
                  <span className="font-mono">{log.ip}</span>
                </div>

                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Pagination hint */}
          <div className="flex items-center justify-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500">
              Showing 8 of 48,293 entries • 
              <Button variant="link" className="text-cyan-600 px-1">Load more</Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
