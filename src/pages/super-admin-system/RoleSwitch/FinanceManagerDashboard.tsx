import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, Users, TrendingUp, DollarSign, CreditCard, FileText, 
  Shield, Activity, Eye, CheckCircle, XCircle, Download, Send,
  Lock, AlertTriangle, Globe, Building2, ArrowUpRight, ArrowDownRight,
  Receipt, PieChart, BarChart3, Calculator, Clock, Filter, Search,
  ChevronRight, X, Flag, Banknote, Percent, FileCheck, Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock Finance Manager Data
const financeManagers = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@company.com",
    region: "Asia Pacific",
    country: "India",
    countryFlag: "🇮🇳",
    totalRevenue: "₹45,50,00,000",
    pendingPayments: "₹2,30,00,000",
    status: "active",
    avatar: "👨‍💼",
    currency: "INR",
    lastActive: "2 mins ago"
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@company.com",
    region: "North America",
    country: "United States",
    countryFlag: "🇺🇸",
    totalRevenue: "$12,500,000",
    pendingPayments: "$450,000",
    status: "active",
    avatar: "👩‍💼",
    currency: "USD",
    lastActive: "5 mins ago"
  },
  {
    id: "3",
    name: "Hans Weber",
    email: "hans.weber@company.com",
    region: "Europe",
    country: "Germany",
    countryFlag: "🇩🇪",
    totalRevenue: "€8,200,000",
    pendingPayments: "€320,000",
    status: "hold",
    avatar: "👨‍💼",
    currency: "EUR",
    lastActive: "1 hour ago"
  },
  {
    id: "4",
    name: "Yuki Tanaka",
    email: "yuki.tanaka@company.com",
    region: "Asia Pacific",
    country: "Japan",
    countryFlag: "🇯🇵",
    totalRevenue: "¥950,000,000",
    pendingPayments: "¥45,000,000",
    status: "active",
    avatar: "👩‍💼",
    currency: "JPY",
    lastActive: "15 mins ago"
  },
  {
    id: "5",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@company.com",
    region: "Middle East",
    country: "UAE",
    countryFlag: "🇦🇪",
    totalRevenue: "AED 18,500,000",
    pendingPayments: "AED 850,000",
    status: "active",
    avatar: "👨‍💼",
    currency: "AED",
    lastActive: "30 mins ago"
  }
];

// Powers list
const financeManagerPowers = [
  { power: "View all financial records", scope: "Organization-wide", enabled: true },
  { power: "Approve payouts", scope: "Up to $50,000", enabled: true },
  { power: "Manage commissions", scope: "All channels", enabled: true },
  { power: "Generate invoices", scope: "Unlimited", enabled: true },
  { power: "Verify payments", scope: "All methods", enabled: true },
  { power: "Freeze transactions", scope: "Regional", enabled: true },
  { power: "Export financial reports", scope: "Full access", enabled: true },
];

// Actions list
const financeManagerActions = [
  { action: "View Transactions", icon: Eye, color: "text-blue-400" },
  { action: "Approve Payout", icon: CheckCircle, color: "text-emerald-400" },
  { action: "Reject Payout", icon: XCircle, color: "text-rose-400" },
  { action: "Generate Invoice", icon: FileText, color: "text-amber-400" },
  { action: "Verify Payment", icon: Shield, color: "text-purple-400" },
  { action: "Freeze Account", icon: Lock, color: "text-red-400" },
  { action: "Suspend Access", icon: AlertTriangle, color: "text-orange-400" },
];

// Transactions mock data
const transactions = [
  { id: "TXN001", type: "Payout", amount: "₹5,00,000", status: "completed", date: "2024-01-15", recipient: "Vikram Singh" },
  { id: "TXN002", type: "Commission", amount: "₹1,25,000", status: "pending", date: "2024-01-14", recipient: "Reseller Network" },
  { id: "TXN003", type: "Invoice", amount: "₹8,50,000", status: "completed", date: "2024-01-13", recipient: "Tech Solutions Ltd" },
  { id: "TXN004", type: "Refund", amount: "₹75,000", status: "processing", date: "2024-01-12", recipient: "Customer #4521" },
  { id: "TXN005", type: "Payout", amount: "₹3,20,000", status: "completed", date: "2024-01-11", recipient: "Priya Sharma" },
];

// Activity log
const activityLog = [
  { action: "Approved payout request #4521", time: "2 mins ago", type: "approval" },
  { action: "Generated invoice INV-2024-0892", time: "15 mins ago", type: "invoice" },
  { action: "Verified payment from TechCorp", time: "1 hour ago", type: "verification" },
  { action: "Updated commission slab for Gold tier", time: "2 hours ago", type: "commission" },
  { action: "Froze suspicious account ACC-7823", time: "3 hours ago", type: "freeze" },
];

interface FinanceManagerDetailProps {
  manager: typeof financeManagers[0];
  onClose: () => void;
}

const FinanceManagerDetail = ({ manager, onClose }: FinanceManagerDetailProps) => {
  const [activeTab, setActiveTab] = useState("transactions");

  const handleAction = (actionName: string) => {
    toast.success(`${actionName} initiated for ${manager.name}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-[600px] bg-emerald-950/95 border-l border-emerald-700/50 shadow-2xl z-50 overflow-hidden"
    >
      <ScrollArea className="h-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-3xl shadow-lg">
                {manager.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{manager.name}</h2>
                <p className="text-sm text-emerald-300">{manager.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{manager.countryFlag}</span>
                  <span className="text-xs text-emerald-400">{manager.region}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-emerald-400 hover:bg-emerald-800/50">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Section 1: Identity */}
          <div className="mb-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Identity
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-emerald-400/70 text-xs">Name</p>
                <p className="text-white font-medium">{manager.name}</p>
              </div>
              <div>
                <p className="text-emerald-400/70 text-xs">Email</p>
                <p className="text-white font-medium">{manager.email}</p>
              </div>
              <div>
                <p className="text-emerald-400/70 text-xs">Assigned Region</p>
                <p className="text-white font-medium">{manager.region}</p>
              </div>
              <div>
                <p className="text-emerald-400/70 text-xs">Role Level</p>
                <Badge className="bg-emerald-600/30 text-emerald-300 border-emerald-500/50">
                  Finance Manager
                </Badge>
              </div>
            </div>
          </div>

          {/* Section 2: Powers */}
          <div className="mb-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Powers
            </h3>
            <div className="space-y-2">
              {financeManagerPowers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-emerald-800/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-white">{item.power}</span>
                  </div>
                  <span className="text-xs text-emerald-400/70">{item.scope}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Actions */}
          <div className="mb-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {financeManagerActions.map((item, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  onClick={() => handleAction(item.action)}
                  className={cn(
                    "justify-start gap-2 h-10 bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-700/30",
                    item.color
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs">{item.action}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Section 4: Finance Modules Tabs */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Finance Modules
            </h3>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-emerald-900/50 border border-emerald-700/30 grid grid-cols-4 h-auto p-1">
                <TabsTrigger value="transactions" className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="revenue" className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="commissions" className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Commissions
                </TabsTrigger>
                <TabsTrigger value="payouts" className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Payouts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="mt-3">
                <div className="space-y-2">
                  {transactions.map((txn) => (
                    <div key={txn.id} className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{txn.id}</p>
                        <p className="text-xs text-emerald-400/70">{txn.type} • {txn.recipient}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-300">{txn.amount}</p>
                        <Badge className={cn(
                          "text-xs",
                          txn.status === "completed" && "bg-emerald-500/20 text-emerald-400",
                          txn.status === "pending" && "bg-amber-500/20 text-amber-400",
                          txn.status === "processing" && "bg-blue-500/20 text-blue-400"
                        )}>
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="mt-3">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-700/40 to-green-800/30 border border-emerald-600/30">
                    <p className="text-xs text-emerald-400 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">{manager.totalRevenue}</p>
                    <div className="flex items-center gap-1 mt-1 text-emerald-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs">+12.5% from last month</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20">
                      <p className="text-xs text-emerald-400/70">By Product</p>
                      <p className="text-lg font-bold text-white">₹28.5Cr</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20">
                      <p className="text-xs text-emerald-400/70">By Services</p>
                      <p className="text-lg font-bold text-white">₹17Cr</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="commissions" className="mt-3">
                <div className="space-y-2">
                  {[
                    { name: "Reseller Tier 1", rate: "15%", paid: "₹45L", pending: "₹8L" },
                    { name: "Franchise Network", rate: "12%", paid: "₹32L", pending: "₹5L" },
                    { name: "Influencer Program", rate: "8%", paid: "₹12L", pending: "₹2L" },
                  ].map((comm, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{comm.name}</span>
                        <Badge className="bg-emerald-600/30 text-emerald-300">{comm.rate}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400">Paid: {comm.paid}</span>
                        <span className="text-amber-400">Pending: {comm.pending}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="payouts" className="mt-3">
                <div className="space-y-2">
                  {[
                    { id: "PAY-001", to: "Vikram Singh", amount: "₹5,00,000", status: "approved", bank: "HDFC Bank" },
                    { id: "PAY-002", to: "Priya Sharma", amount: "₹3,20,000", status: "pending", bank: "ICICI Bank" },
                    { id: "PAY-003", to: "Rohan Mehta", amount: "₹2,80,000", status: "processing", bank: "SBI" },
                  ].map((payout, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{payout.to}</p>
                          <p className="text-xs text-emerald-400/70">{payout.id} • {payout.bank}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-300">{payout.amount}</p>
                          <Badge className={cn(
                            "text-xs",
                            payout.status === "approved" && "bg-emerald-500/20 text-emerald-400",
                            payout.status === "pending" && "bg-amber-500/20 text-amber-400",
                            payout.status === "processing" && "bg-blue-500/20 text-blue-400"
                          )}>
                            {payout.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Additional Tabs Row */}
            <Tabs defaultValue="expenses" className="w-full mt-4">
              <TabsList className="w-full bg-emerald-900/50 border border-emerald-700/30 grid grid-cols-3 h-auto p-1">
                <TabsTrigger value="expenses" className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="invoices" className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="tax" className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Tax & Compliance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="expenses" className="mt-3">
                <div className="space-y-2">
                  {[
                    { category: "Operations", amount: "₹12,50,000", status: "approved" },
                    { category: "Marketing", amount: "₹8,00,000", status: "pending" },
                    { category: "Infrastructure", amount: "₹5,50,000", status: "approved" },
                  ].map((exp, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20 flex items-center justify-between">
                      <span className="text-sm text-white">{exp.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-rose-400">{exp.amount}</span>
                        <Badge className={exp.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}>
                          {exp.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="invoices" className="mt-3">
                <div className="space-y-2">
                  {[
                    { id: "INV-2024-0892", to: "TechCorp Ltd", amount: "₹8,50,000", status: "paid" },
                    { id: "INV-2024-0891", to: "Digital Solutions", amount: "₹4,20,000", status: "sent" },
                    { id: "INV-2024-0890", to: "StartupHub Inc", amount: "₹2,80,000", status: "draft" },
                  ].map((inv, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{inv.id}</p>
                          <p className="text-xs text-emerald-400/70">{inv.to}</p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="text-sm font-bold text-emerald-300">{inv.amount}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-400">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tax" className="mt-3">
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-white">GST Filings</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Up to date</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-white">TDS Compliance</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Compliant</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white">Annual Tax</span>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400">Due Mar 31</Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Section 5: Activity Log */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Finance Activity Log
            </h3>
            <div className="space-y-2">
              {activityLog.map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-emerald-800/20">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    log.type === "approval" && "bg-emerald-400",
                    log.type === "invoice" && "bg-amber-400",
                    log.type === "verification" && "bg-blue-400",
                    log.type === "commission" && "bg-purple-400",
                    log.type === "freeze" && "bg-rose-400"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{log.action}</p>
                  </div>
                  <span className="text-xs text-emerald-400/60">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

const FinanceManagerDashboard = () => {
  const [selectedManager, setSelectedManager] = useState<typeof financeManagers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredManagers = financeManagers.filter((manager) => {
    const matchesSearch = manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || manager.country === filterCountry;
    const matchesStatus = filterStatus === "all" || manager.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-green-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' }}>
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Finance Manager Dashboard</h1>
            <p className="text-sm text-emerald-400">Organization-wide financial control & accounting</p>
          </div>
        </div>
        <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">
          <Activity className="w-3 h-3 mr-1.5 animate-pulse" />
          FINANCE THEME ACTIVE
        </Badge>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: "Total Revenue", value: "₹125.5 Cr", icon: TrendingUp, trend: "+15.2%", color: "from-emerald-600 to-green-700" },
          { label: "Pending Payments", value: "₹8.3 Cr", icon: Clock, trend: "-5.1%", color: "from-amber-600 to-orange-700" },
          { label: "Active Managers", value: "5", icon: Users, trend: "+2", color: "from-blue-600 to-cyan-700" },
          { label: "Transactions Today", value: "248", icon: Receipt, trend: "+42", color: "from-purple-600 to-pink-700" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="p-4 rounded-xl bg-slate-800/60 border border-emerald-700/30 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-emerald-400/70 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">{stat.trend}</span>
                </div>
              </div>
              <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50" />
          <Input
            placeholder="Search managers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-emerald-900/30 border-emerald-700/30 text-white placeholder:text-emerald-400/50"
          />
        </div>
        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger className="w-40 bg-emerald-900/30 border-emerald-700/30 text-white">
            <Globe className="w-4 h-4 mr-2 text-emerald-400" />
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="Japan">Japan</SelectItem>
            <SelectItem value="UAE">UAE</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 bg-emerald-900/30 border-emerald-700/30 text-white">
            <Filter className="w-4 h-4 mr-2 text-emerald-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Finance Manager List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-green-500" />
          <h2 className="text-lg font-bold text-white">All Finance Managers</h2>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/50">
            {filteredManagers.length} Total
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredManagers.map((manager, idx) => (
            <motion.div
              key={manager.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              onClick={() => setSelectedManager(manager)}
              className="p-4 rounded-xl bg-slate-800/60 border border-emerald-700/30 hover:border-emerald-500/50 cursor-pointer transition-all group hover:scale-[1.01]"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-2xl shadow-lg">
                  {manager.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-white truncate">{manager.name}</h3>
                    <span className="text-lg">{manager.countryFlag}</span>
                    <Badge className={cn(
                      "text-xs ml-auto",
                      manager.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    )}>
                      {manager.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-emerald-400/70 mb-2">{manager.region} • {manager.country}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="text-emerald-400/50 text-xs">Revenue Managed</p>
                      <p className="font-bold text-emerald-300">{manager.totalRevenue}</p>
                    </div>
                    <div>
                      <p className="text-emerald-400/50 text-xs">Pending</p>
                      <p className="font-bold text-amber-400">{manager.pendingPayments}</p>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-400/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedManager && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedManager(null)}
            />
            <FinanceManagerDetail manager={selectedManager} onClose={() => setSelectedManager(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinanceManagerDashboard;
