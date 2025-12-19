import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Search,
  Filter,
  Download
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WalletFinanceConsole = () => {
  const [activeTab, setActiveTab] = useState("payouts");

  const pendingPayouts = [
    { id: "PAY001", user: "Franchise - Maharashtra", amount: "₹45,000", type: "Commission", date: "2024-01-15", status: "pending" },
    { id: "PAY002", user: "Reseller - Amit K.", amount: "₹12,500", type: "Sales Bonus", date: "2024-01-15", status: "pending" },
    { id: "PAY003", user: "Developer - Rahul S.", amount: "₹35,000", type: "Task Payment", date: "2024-01-14", status: "pending" },
    { id: "PAY004", user: "Influencer - Priya M.", amount: "₹8,200", type: "Referral", date: "2024-01-14", status: "pending" },
    { id: "PAY005", user: "Franchise - Karnataka", amount: "₹67,500", type: "Commission", date: "2024-01-13", status: "review" },
  ];

  const commissionRules = [
    { role: "Franchise", baseRate: "15%", bonus: "5% on target", maxCap: "₹2,00,000/mo" },
    { role: "Reseller", baseRate: "8%", bonus: "3% on 10+ sales", maxCap: "₹75,000/mo" },
    { role: "Influencer", baseRate: "₹50/click", bonus: "₹500/conversion", maxCap: "₹50,000/mo" },
    { role: "Developer", baseRate: "Fixed/task", bonus: "10% early delivery", maxCap: "No cap" },
  ];

  const fraudAlerts = [
    { id: "FRD001", type: "Duplicate Payout", user: "Reseller - Unknown", amount: "₹15,000", risk: "high", date: "2024-01-15" },
    { id: "FRD002", type: "Velocity Spike", user: "Influencer - Bot123", amount: "₹8,500", risk: "high", date: "2024-01-15" },
    { id: "FRD003", type: "IP Mismatch", user: "Franchise - Delhi", amount: "₹25,000", risk: "medium", date: "2024-01-14" },
  ];

  const invoices = [
    { id: "INV001", client: "ABC Corp", amount: "₹1,25,000", status: "paid", date: "2024-01-10" },
    { id: "INV002", client: "XYZ Ltd", amount: "₹85,000", status: "pending", date: "2024-01-12" },
    { id: "INV003", client: "PQR Industries", amount: "₹2,45,000", status: "overdue", date: "2024-01-01" },
    { id: "INV004", client: "LMN Services", amount: "₹56,000", status: "paid", date: "2024-01-08" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "review":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30"><AlertTriangle className="w-3 h-3 mr-1" />Under Review</Badge>;
      case "paid":
        return <Badge className="bg-green-500/20 text-green-400">Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-500/20 text-red-400">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Low</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-primary bg-clip-text text-transparent">
            Wallet & Finance Console
          </h1>
          <p className="text-muted-foreground mt-1">Manage payouts, commissions, and financial operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <DollarSign className="w-4 h-4 mr-2" />
            Process Payouts
          </Button>
        </div>
      </div>

      {/* Finance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Balance", value: "₹24,56,800", icon: Wallet, color: "text-primary", change: "+12.5%" },
          { label: "Pending Payouts", value: "₹1,68,200", icon: Clock, color: "text-yellow-400", change: "8 requests" },
          { label: "This Month Revenue", value: "₹8,45,000", icon: TrendingUp, color: "text-green-400", change: "+18.2%" },
          { label: "Fraud Blocked", value: "₹48,500", icon: AlertTriangle, color: "text-red-400", change: "3 attempts" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">{stat.change}</Badge>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-background/50 border border-white/10">
          <TabsTrigger value="payouts">Payout Approvals</TabsTrigger>
          <TabsTrigger value="commission">Commission Engine</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Center</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="payouts" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Pending Payout Approvals
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search payouts..." className="pl-9 w-64 bg-background/50" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
                      <SelectItem value="bonus">Bonus</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayouts.map((payout) => (
                    <TableRow key={payout.id} className="border-white/5">
                      <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                      <TableCell>{payout.user}</TableCell>
                      <TableCell>{payout.type}</TableCell>
                      <TableCell className="font-semibold">{payout.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{payout.date}</TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Commission Rules Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commissionRules.map((rule, index) => (
                  <motion.div
                    key={rule.role}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-background/50 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{rule.role}</h3>
                      <Button size="sm" variant="outline" className="border-white/10">Edit</Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Rate:</span>
                        <span className="text-primary font-medium">{rule.baseRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bonus:</span>
                        <span className="text-green-400">{rule.bonus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Cap:</span>
                        <span className="text-yellow-400">{rule.maxCap}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Invoice & Ledger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="border-white/5">
                      <TableCell className="font-mono">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell className="font-semibold">{invoice.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="border-white/10">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Fraud Detection Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-red-500/5 border border-red-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div>
                          <div className="font-medium">{alert.type}</div>
                          <div className="text-sm text-muted-foreground">{alert.user} • {alert.amount}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getRiskBadge(alert.risk)}
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                            Block
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/10">
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletFinanceConsole;
