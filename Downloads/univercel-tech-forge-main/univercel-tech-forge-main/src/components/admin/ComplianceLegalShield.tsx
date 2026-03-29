import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  AlertTriangle,
  Lock,
  Eye,
  Clock,
  Search,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Scale,
  Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ComplianceLegalShield = () => {
  const [activeTab, setActiveTab] = useState("audit");

  const auditLogs = [
    { id: "AUD001", action: "Lead Assignment", user: "Admin", target: "Franchise MH", timestamp: "2024-01-15 14:32:45", status: "success" },
    { id: "AUD002", action: "Payout Approval", user: "Finance", target: "₹45,000", timestamp: "2024-01-15 14:28:12", status: "success" },
    { id: "AUD003", action: "Role Change", user: "Admin", target: "User promoted to Reseller", timestamp: "2024-01-15 14:15:33", status: "success" },
    { id: "AUD004", action: "Demo Access Revoked", user: "System", target: "Demo #245", timestamp: "2024-01-15 13:45:22", status: "warning" },
    { id: "AUD005", action: "Failed Login Attempt", user: "Unknown", target: "admin@company.com", timestamp: "2024-01-15 13:22:11", status: "failed" },
  ];

  const disputes = [
    { id: "DSP001", type: "Commission Dispute", parties: "Reseller vs Franchise", amount: "₹15,000", status: "pending", date: "2024-01-14" },
    { id: "DSP002", type: "Lead Attribution", parties: "Influencer vs Reseller", amount: "₹8,500", status: "under_review", date: "2024-01-13" },
    { id: "DSP003", type: "Service Quality", parties: "Client vs Developer", amount: "₹25,000", status: "resolved", date: "2024-01-10" },
  ];

  const policies = [
    { name: "Pricing Lock Policy", status: "enforced", violations: 0, lastUpdated: "2024-01-01" },
    { name: "Identity Masking", status: "enforced", violations: 2, lastUpdated: "2024-01-05" },
    { name: "Data Retention (90 days)", status: "enforced", violations: 0, lastUpdated: "2023-12-15" },
    { name: "NDA Compliance", status: "enforced", violations: 1, lastUpdated: "2024-01-10" },
    { name: "Anti-Bypass Rules", status: "enforced", violations: 3, lastUpdated: "2024-01-12" },
  ];

  const maskedChats = [
    { id: "CHT001", participants: "Franchise MH ↔ Client ABC", messages: 45, date: "2024-01-15", flagged: false },
    { id: "CHT002", participants: "Reseller Delhi ↔ Lead XYZ", messages: 23, date: "2024-01-15", flagged: true },
    { id: "CHT003", participants: "Support ↔ Client PQR", messages: 67, date: "2024-01-14", flagged: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
      case "resolved":
      case "enforced":
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "under_review":
        return <Badge className="bg-purple-500/20 text-purple-400"><Eye className="w-3 h-3 mr-1" />Under Review</Badge>;
      case "failed":
      case "warning":
        return <Badge className="bg-red-500/20 text-red-400"><AlertTriangle className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
            Compliance & Legal Shield
          </h1>
          <p className="text-muted-foreground mt-1">Audit logs, dispute resolution & policy enforcement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Shield className="w-4 h-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Audit Events Today", value: "1,247", icon: FileText, color: "text-primary" },
          { label: "Active Disputes", value: "3", icon: Scale, color: "text-yellow-400" },
          { label: "Policy Violations", value: "6", icon: AlertTriangle, color: "text-red-400" },
          { label: "Masked Chats", value: "156", icon: MessageSquare, color: "text-neon-teal" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-background/50 border border-white/10">
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="disputes">Dispute Center</TabsTrigger>
          <TabsTrigger value="policies">Policy Enforcement</TabsTrigger>
          <TabsTrigger value="chats">Masked Chat Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  System Audit Logs
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-9 w-64 bg-background/50" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="border-white/5">
                      <TableCell className="font-mono text-sm">{log.id}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="text-muted-foreground">{log.target}</TableCell>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-yellow-400" />
                Dispute Resolution Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disputes.map((dispute, index) => (
                  <motion.div
                    key={dispute.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-background/50 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{dispute.type}</span>
                          <span className="text-muted-foreground">• {dispute.id}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{dispute.parties}</div>
                        <div className="text-sm">Amount: <span className="text-primary font-medium">{dispute.amount}</span></div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(dispute.status)}
                        <Button size="sm" variant="outline" className="border-white/10">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-400" />
                Policy Enforcement Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy, index) => (
                  <motion.div
                    key={policy.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-background/50 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">{policy.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Last updated: {policy.lastUpdated}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {policy.violations > 0 ? (
                          <Badge className="bg-red-500/20 text-red-400">
                            {policy.violations} violations
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400">
                            No violations
                          </Badge>
                        )}
                        {getStatusBadge(policy.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neon-teal" />
                Masked Chat Archive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>ID</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maskedChats.map((chat) => (
                    <TableRow key={chat.id} className="border-white/5">
                      <TableCell className="font-mono text-sm">{chat.id}</TableCell>
                      <TableCell>{chat.participants}</TableCell>
                      <TableCell>{chat.messages}</TableCell>
                      <TableCell className="text-muted-foreground">{chat.date}</TableCell>
                      <TableCell>
                        {chat.flagged ? (
                          <Badge className="bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="border-white/10">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceLegalShield;
