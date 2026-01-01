import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Handshake, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, ChevronRight, X,
  CheckCircle, AlertTriangle, Search, RefreshCw,
  DollarSign, Users, Wallet, TrendingUp, Phone, Mail,
  CreditCard, Package, Store, Percent
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Mock data for resellers
const resellersData = [
  {
    id: "rs-001",
    resellerName: "TechDistro India",
    ownerName: "Vikram Singh",
    email: "vikram@techdistro.in",
    phone: "+91 98765 00001",
    country: "India",
    flag: "🇮🇳",
    status: "active",
    activeClients: 45,
    commissionLevel: "Gold",
    commissionPercent: 15,
    totalSales: "$125,000",
    pendingPayout: "$4,500",
    joinedDate: "2022-06-15",
    lastActive: "10 minutes ago",
  },
  {
    id: "rs-002",
    resellerName: "Digital Partners UK",
    ownerName: "Charlotte Brown",
    email: "charlotte@digitaluk.com",
    phone: "+44 20 7890 5678",
    country: "United Kingdom",
    flag: "🇬🇧",
    status: "active",
    activeClients: 32,
    commissionLevel: "Platinum",
    commissionPercent: 20,
    totalSales: "$210,000",
    pendingPayout: "$8,200",
    joinedDate: "2021-11-20",
    lastActive: "5 minutes ago",
  },
  {
    id: "rs-003",
    resellerName: "CloudNet Nigeria",
    ownerName: "Chinedu Okafor",
    email: "chinedu@cloudnet.ng",
    phone: "+234 803 456 7890",
    country: "Nigeria",
    flag: "🇳🇬",
    status: "active",
    activeClients: 28,
    commissionLevel: "Silver",
    commissionPercent: 10,
    totalSales: "$67,000",
    pendingPayout: "$2,100",
    joinedDate: "2023-02-10",
    lastActive: "1 hour ago",
  },
  {
    id: "rs-004",
    resellerName: "TechBridge UAE",
    ownerName: "Omar Al-Rashid",
    email: "omar@techbridge.ae",
    phone: "+971 4 234 5678",
    country: "UAE",
    flag: "🇦🇪",
    status: "pending",
    activeClients: 18,
    commissionLevel: "Gold",
    commissionPercent: 15,
    totalSales: "$95,000",
    pendingPayout: "$12,500",
    joinedDate: "2023-05-01",
    lastActive: "3 hours ago",
  },
  {
    id: "rs-005",
    resellerName: "Pacific Solutions",
    ownerName: "David Wong",
    email: "david@pacificsolutions.au",
    phone: "+61 2 9876 1234",
    country: "Australia",
    flag: "🇦🇺",
    status: "active",
    activeClients: 52,
    commissionLevel: "Platinum",
    commissionPercent: 20,
    totalSales: "$285,000",
    pendingPayout: "$15,600",
    joinedDate: "2021-08-15",
    lastActive: "30 minutes ago",
  },
  {
    id: "rs-006",
    resellerName: "Euro Tech Partners",
    ownerName: "Marie Dubois",
    email: "marie@eurotech.fr",
    phone: "+33 1 2345 6789",
    country: "France",
    flag: "🇫🇷",
    status: "suspended",
    activeClients: 15,
    commissionLevel: "Silver",
    commissionPercent: 10,
    totalSales: "$42,000",
    pendingPayout: "$0",
    joinedDate: "2023-01-05",
    lastActive: "5 days ago",
  },
];

// Powers list for Reseller
const resellerPowers = [
  { icon: Users, text: "Can onboard clients" },
  { icon: Package, text: "Can sell products" },
  { icon: Percent, text: "Can view commission" },
  { icon: Store, text: "Can manage reseller clients" },
  { icon: CreditCard, text: "Can request payouts" },
  { icon: Shield, text: "Can raise support tickets" },
];

// Activity log data
const activityLogs = [
  { id: "log-001", action: "Client Onboarded", target: "TechCorp Ltd.", time: "15 min ago", type: "client" },
  { id: "log-002", action: "Product Sold", target: "Enterprise Plan x3", time: "1 hour ago", type: "sale" },
  { id: "log-003", action: "Payout Requested", target: "$4,500", time: "3 hours ago", type: "payout" },
  { id: "log-004", action: "Commission Updated", target: "Gold → Platinum", time: "1 day ago", type: "commission" },
  { id: "log-005", action: "Support Ticket", target: "Payment Issue", time: "2 days ago", type: "support" },
];

const commissionColors = {
  Platinum: "from-slate-400 to-slate-600 text-white",
  Gold: "from-amber-400 to-amber-600 text-white",
  Silver: "from-gray-300 to-gray-500 text-white",
};

const ResellerManagerView = () => {
  const [selectedReseller, setSelectedReseller] = useState<typeof resellersData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterCommission, setFilterCommission] = useState("all");

  const handleSelectReseller = (reseller: typeof resellersData[0]) => {
    setSelectedReseller(reseller);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedReseller(null);
  };

  const filteredResellers = resellersData.filter(rs => {
    const matchesSearch = 
      rs.resellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rs.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || rs.country === filterCountry;
    const matchesCommission = filterCommission === "all" || rs.commissionLevel === filterCommission;
    return matchesSearch && matchesCountry && matchesCommission;
  });

  const uniqueCountries = [...new Set(resellersData.map(rs => rs.country))];

  const totalStats = {
    total: resellersData.length,
    active: resellersData.filter(rs => rs.status === "active").length,
    pending: resellersData.filter(rs => rs.status === "pending").length,
    suspended: resellersData.filter(rs => rs.status === "suspended").length,
    totalClients: resellersData.reduce((sum, rs) => sum + rs.activeClients, 0),
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden flex flex-col transition-all duration-300", detailPanelOpen ? "mr-0" : "")}>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Handshake className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Reseller Manager Dashboard</h1>
                  <p className="text-muted-foreground">Manage all Resellers worldwide</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600">
                  <Activity className="w-4 h-4" />
                  Live Mode
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Resellers</p>
                      <p className="text-3xl font-bold text-amber-400">{totalStats.total}</p>
                    </div>
                    <Handshake className="w-10 h-10 text-amber-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active</p>
                      <p className="text-3xl font-bold text-emerald-400">{totalStats.active}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-emerald-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold text-yellow-400">{totalStats.pending}</p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Suspended</p>
                      <p className="text-3xl font-bold text-red-400">{totalStats.suspended}</p>
                    </div>
                    <Ban className="w-10 h-10 text-red-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Clients</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.totalClients}</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reseller or owner..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <Select value={filterCountry} onValueChange={setFilterCountry}>
                    <SelectTrigger className="w-48 bg-background/50">
                      <SelectValue placeholder="Filter by Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {uniqueCountries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterCommission} onValueChange={setFilterCommission}>
                    <SelectTrigger className="w-48 bg-background/50">
                      <SelectValue placeholder="Commission Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resellers Grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredResellers.map((reseller) => (
                <motion.div
                  key={reseller.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectReseller(reseller)}
                  className={cn(
                    "relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-card hover:bg-accent/20",
                    selectedReseller?.id === reseller.id
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-border/50 hover:border-amber-500/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="w-14 h-14 border-2 border-amber-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                        {reseller.ownerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{reseller.resellerName}</h3>
                        <Badge 
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            reseller.status === "active" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
                            reseller.status === "pending" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
                            reseller.status === "suspended" && "bg-red-500/20 text-red-400 border-red-500/50"
                          )}
                        >
                          {reseller.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{reseller.ownerName}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{reseller.flag}</span>
                          {reseller.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {reseller.activeClients} clients
                        </span>
                      </div>
                    </div>

                    {/* Commission Badge */}
                    <div className="text-right">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r",
                        commissionColors[reseller.commissionLevel as keyof typeof commissionColors]
                      )}>
                        <Percent className="w-3 h-3" />
                        {reseller.commissionLevel}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{reseller.commissionPercent}% rate</p>
                    </div>
                  </div>

                  {/* Revenue Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Sales</p>
                      <p className="text-lg font-bold text-foreground flex items-center gap-1">
                        {reseller.totalSales}
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pending Payout</p>
                      <p className="text-lg font-bold text-amber-400">{reseller.pendingPayout}</p>
                    </div>
                  </div>

                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detailPanelOpen && selectedReseller && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[480px] border-l border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                  Reseller Details
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-amber-500">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xl font-bold">
                    {selectedReseller.ownerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedReseller.resellerName}</h2>
                  <p className="text-muted-foreground">{selectedReseller.ownerName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      className={cn(
                        selectedReseller.status === "active" && "bg-emerald-500/20 text-emerald-400",
                        selectedReseller.status === "pending" && "bg-yellow-500/20 text-yellow-400",
                        selectedReseller.status === "suspended" && "bg-red-500/20 text-red-400"
                      )}
                    >
                      {selectedReseller.status}
                    </Badge>
                    <Badge className={cn(
                      "bg-gradient-to-r",
                      commissionColors[selectedReseller.commissionLevel as keyof typeof commissionColors]
                    )}>
                      {selectedReseller.commissionLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Section 1: Identity */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Identity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{selectedReseller.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Phone className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{selectedReseller.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Country</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <span className="text-lg">{selectedReseller.flag}</span>
                          {selectedReseller.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Joined Date</p>
                        <p className="text-sm font-medium">{selectedReseller.joinedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Section 2: Powers */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Powers
                  </h3>
                  <div className="space-y-2">
                    {resellerPowers.map((power, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-amber-500/5">
                        <power.icon className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-foreground">{power.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Section 3: Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <Users className="w-4 h-4" />
                      View Clients
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <DollarSign className="w-4 h-4" />
                      View Sales
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <Percent className="w-4 h-4" />
                      View Commission
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-emerald-400 hover:text-emerald-400">
                      <Wallet className="w-4 h-4" />
                      Approve Payout
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-orange-400 hover:text-orange-400">
                      <Ban className="w-4 h-4" />
                      Suspend
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-red-400 hover:text-red-400">
                      <Lock className="w-4 h-4" />
                      Lock Access
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Section 4: Activity Log */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Activity Log
                  </h3>
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          log.type === "client" && "bg-blue-500/20 text-blue-400",
                          log.type === "sale" && "bg-emerald-500/20 text-emerald-400",
                          log.type === "payout" && "bg-amber-500/20 text-amber-400",
                          log.type === "commission" && "bg-purple-500/20 text-purple-400",
                          log.type === "support" && "bg-orange-500/20 text-orange-400",
                        )}>
                          {log.type === "client" && <Users className="w-4 h-4" />}
                          {log.type === "sale" && <Package className="w-4 h-4" />}
                          {log.type === "payout" && <Wallet className="w-4 h-4" />}
                          {log.type === "commission" && <Percent className="w-4 h-4" />}
                          {log.type === "support" && <Shield className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.target}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResellerManagerView;
