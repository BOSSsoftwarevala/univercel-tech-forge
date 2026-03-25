import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Crown, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, ChevronRight, X,
  CheckCircle, AlertTriangle, Search, RefreshCw,
  Users, TrendingUp, Phone, Mail, Star,
  ArrowUpRight, ArrowDownRight, DollarSign,
  Zap, Gift, Settings, ToggleLeft, Gauge
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

// Mock data for pro managers
const proManagersData = [
  {
    id: "pm-001",
    name: "Victoria Sterling",
    email: "victoria@pro.com",
    phone: "+1 212 555 0199",
    region: "North America",
    country: "USA",
    flag: "🇺🇸",
    status: "active",
    totalProUsers: 2450,
    activeProUsers: 2180,
    expiringProUsers: 89,
    revenueManaged: "$1.2M",
    roleLevel: "Senior Pro Manager",
    lastActive: "5 minutes ago",
    renewalRate: 92,
  },
  {
    id: "pm-002",
    name: "Sebastian Koch",
    email: "s.koch@pro.de",
    phone: "+49 30 1234 5678",
    region: "Europe",
    country: "Germany",
    flag: "🇩🇪",
    status: "active",
    totalProUsers: 1890,
    activeProUsers: 1720,
    expiringProUsers: 45,
    revenueManaged: "$980K",
    roleLevel: "Pro Manager",
    lastActive: "20 minutes ago",
    renewalRate: 88,
  },
  {
    id: "pm-003",
    name: "Aisha Patel",
    email: "aisha@pro.in",
    phone: "+91 98765 43210",
    region: "South Asia",
    country: "India",
    flag: "🇮🇳",
    status: "active",
    totalProUsers: 3200,
    activeProUsers: 2890,
    expiringProUsers: 156,
    revenueManaged: "$750K",
    roleLevel: "Senior Pro Manager",
    lastActive: "10 minutes ago",
    renewalRate: 85,
  },
  {
    id: "pm-004",
    name: "Omar Al-Rashid",
    email: "omar@pro.ae",
    phone: "+971 50 987 6543",
    region: "Middle East",
    country: "UAE",
    flag: "🇦🇪",
    status: "active",
    totalProUsers: 890,
    activeProUsers: 820,
    expiringProUsers: 28,
    revenueManaged: "$1.5M",
    roleLevel: "Pro Manager",
    lastActive: "1 hour ago",
    renewalRate: 94,
  },
  {
    id: "pm-005",
    name: "Yuki Tanaka",
    email: "yuki@pro.jp",
    phone: "+81 3 1234 5678",
    region: "Asia Pacific",
    country: "Japan",
    flag: "🇯🇵",
    status: "hold",
    totalProUsers: 1560,
    activeProUsers: 1200,
    expiringProUsers: 210,
    revenueManaged: "$890K",
    roleLevel: "Pro Manager",
    lastActive: "2 days ago",
    renewalRate: 77,
  },
];

// Powers list for Pro Manager
const proManagerPowers = [
  { icon: Users, text: "Can manage Pro / Prime users" },
  { icon: ArrowUpRight, text: "Can upgrade normal users to Pro" },
  { icon: ArrowDownRight, text: "Can downgrade Pro users" },
  { icon: Calendar, text: "Can extend Pro subscriptions" },
  { icon: Zap, text: "Can assign Pro-only features" },
  { icon: DollarSign, text: "Can manage Pro pricing (if allowed)" },
  { icon: TrendingUp, text: "Can view Pro revenue analytics" },
  { icon: Settings, text: "Can handle Pro user issues" },
];

// Pro features data
const proFeatures = [
  { id: "f1", name: "Priority Support", enabled: true, usage: 85 },
  { id: "f2", name: "Advanced Analytics", enabled: true, usage: 72 },
  { id: "f3", name: "Custom Integrations", enabled: true, usage: 45 },
  { id: "f4", name: "White Label Options", enabled: false, usage: 0 },
  { id: "f5", name: "API Access", enabled: true, usage: 68 },
];

// Activity log data
const activityLogs = [
  { id: "log-001", action: "User Upgraded", target: "TechCorp → Pro Plan", time: "5 min ago", type: "upgrade" },
  { id: "log-002", action: "Subscription Renewed", target: "12-month renewal", time: "30 min ago", type: "renewal" },
  { id: "log-003", action: "Pro Expiry Alert", target: "15 users expiring", time: "2 hours ago", type: "expiry" },
  { id: "log-004", action: "Feature Assigned", target: "API Access enabled", time: "4 hours ago", type: "feature" },
  { id: "log-005", action: "Revenue Update", target: "+$45K this month", time: "1 day ago", type: "revenue" },
  { id: "log-006", action: "Support Escalation", target: "Billing dispute", time: "2 days ago", type: "support" },
];

const ProManagerView = () => {
  const [selectedManager, setSelectedManager] = useState<typeof proManagersData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleSelectManager = (manager: typeof proManagersData[0]) => {
    setSelectedManager(manager);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedManager(null);
  };

  const filteredManagers = proManagersData.filter(pm => {
    const matchesSearch = 
      pm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pm.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = filterRegion === "all" || pm.region === filterRegion;
    const matchesStatus = filterStatus === "all" || pm.status === filterStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const uniqueRegions = [...new Set(proManagersData.map(pm => pm.region))];

  const totalStats = {
    total: proManagersData.length,
    active: proManagersData.filter(pm => pm.status === "active").length,
    totalProUsers: proManagersData.reduce((sum, pm) => sum + pm.totalProUsers, 0),
    activeProUsers: proManagersData.reduce((sum, pm) => sum + pm.activeProUsers, 0),
    expiring: proManagersData.reduce((sum, pm) => sum + pm.expiringProUsers, 0),
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden flex flex-col transition-all duration-300")}>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Pro Manager Dashboard</h1>
                  <p className="text-muted-foreground">Manage all Pro / Prime User Managers worldwide</p>
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
                      <p className="text-xs text-muted-foreground">Pro Managers</p>
                      <p className="text-3xl font-bold text-amber-400">{totalStats.total}</p>
                    </div>
                    <Crown className="w-10 h-10 text-amber-400/30" />
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
              <Card className="bg-purple-500/10 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Pro Users</p>
                      <p className="text-3xl font-bold text-purple-400">{totalStats.totalProUsers.toLocaleString()}</p>
                    </div>
                    <Star className="w-10 h-10 text-purple-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Pro</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.activeProUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Expiring Soon</p>
                      <p className="text-3xl font-bold text-red-400">{totalStats.expiring}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-red-400/30" />
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
                      placeholder="Search pro manager or region..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger className="w-48 bg-background/50">
                      <SelectValue placeholder="Filter by Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {uniqueRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-background/50">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pro Managers List */}
            <div className="grid grid-cols-2 gap-4">
              {filteredManagers.map((manager) => (
                <motion.div
                  key={manager.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectManager(manager)}
                  className={cn(
                    "relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-card hover:bg-accent/20",
                    selectedManager?.id === manager.id
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-border/50 hover:border-amber-500/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 border-2 border-amber-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                        {manager.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{manager.name}</h3>
                        <Crown className="w-4 h-4 text-amber-400" />
                        <Badge 
                          className={cn(
                            "text-xs",
                            manager.status === "active" 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                          )}
                        >
                          {manager.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{manager.roleLevel}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{manager.flag}</span>
                          {manager.region}
                        </span>
                      </div>
                    </div>

                    {/* Revenue & Stats */}
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-amber-400">{manager.revenueManaged}</p>
                      <p className={cn(
                        "text-xs flex items-center justify-end gap-1",
                        manager.renewalRate >= 85 ? "text-emerald-400" : "text-orange-400"
                      )}>
                        <TrendingUp className="w-3 h-3" />
                        {manager.renewalRate}% renewal
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span className="text-foreground">{manager.totalProUsers.toLocaleString()}</span>
                      <span className="text-muted-foreground">pro users</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      {manager.activeProUsers.toLocaleString()} active
                    </div>
                    <div className="flex items-center gap-1 text-xs text-red-400">
                      <AlertTriangle className="w-3 h-3" />
                      {manager.expiringProUsers} expiring
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
        {detailPanelOpen && selectedManager && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[520px] border-l border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Manager Details
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-amber-500">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xl font-bold">
                    {selectedManager.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    {selectedManager.name}
                    <Crown className="w-5 h-5 text-amber-400" />
                  </h2>
                  <p className="text-muted-foreground">{selectedManager.roleLevel}</p>
                  <Badge 
                    className={cn(
                      "mt-1",
                      selectedManager.status === "active" 
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-orange-500/20 text-orange-400"
                    )}
                  >
                    {selectedManager.status}
                  </Badge>
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
                        <p className="text-sm font-medium">{selectedManager.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Phone className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{selectedManager.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Region</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <span className="text-lg">{selectedManager.flag}</span>
                          {selectedManager.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Role Level</p>
                        <p className="text-sm font-medium">{selectedManager.roleLevel}</p>
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
                    {proManagerPowers.map((power, idx) => (
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
                      <Eye className="w-4 h-4" />
                      View Pro Users
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-amber-400">
                      <ArrowUpRight className="w-4 h-4" />
                      Upgrade User
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <ArrowDownRight className="w-4 h-4" />
                      Downgrade Pro
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-emerald-400">
                      <Calendar className="w-4 h-4" />
                      Extend Sub
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-purple-400">
                      <Gift className="w-4 h-4" />
                      Assign Features
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-blue-400">
                      <Lock className="w-4 h-4" />
                      Lock Pro User
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-red-400 col-span-2">
                      <Ban className="w-4 h-4" />
                      Suspend Pro Manager
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Section 4: Activity Log */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Pro User Activity Log
                  </h3>
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          log.type === "upgrade" && "bg-amber-500/20 text-amber-400",
                          log.type === "renewal" && "bg-emerald-500/20 text-emerald-400",
                          log.type === "expiry" && "bg-red-500/20 text-red-400",
                          log.type === "feature" && "bg-purple-500/20 text-purple-400",
                          log.type === "revenue" && "bg-blue-500/20 text-blue-400",
                          log.type === "support" && "bg-orange-500/20 text-orange-400",
                        )}>
                          {log.type === "upgrade" && <ArrowUpRight className="w-4 h-4" />}
                          {log.type === "renewal" && <RefreshCw className="w-4 h-4" />}
                          {log.type === "expiry" && <AlertTriangle className="w-4 h-4" />}
                          {log.type === "feature" && <Zap className="w-4 h-4" />}
                          {log.type === "revenue" && <DollarSign className="w-4 h-4" />}
                          {log.type === "support" && <Settings className="w-4 h-4" />}
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

                <Separator />

                {/* Section 5: Pro Features Management */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Pro Features Management
                  </h3>
                  <div className="space-y-3">
                    {proFeatures.map((feature) => (
                      <div key={feature.id} className="p-3 rounded-lg bg-background/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className={cn("w-4 h-4", feature.enabled ? "text-amber-400" : "text-muted-foreground")} />
                            <span className="text-sm font-medium">{feature.name}</span>
                          </div>
                          <Switch checked={feature.enabled} />
                        </div>
                        {feature.enabled && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Usage</span>
                              <span className="text-foreground">{feature.usage}%</span>
                            </div>
                            <Progress value={feature.usage} className="h-1.5" />
                          </div>
                        )}
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

export default ProManagerView;
