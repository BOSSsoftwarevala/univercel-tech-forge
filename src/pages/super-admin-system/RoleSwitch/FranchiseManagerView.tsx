import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Building2, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, Key, ChevronRight, X,
  CheckCircle, AlertTriangle, Search, Filter, RefreshCw,
  Store, DollarSign, Users, Briefcase, FileText,
  TrendingUp, Phone, Mail, Globe, Flag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSystemActions } from "@/hooks/useSystemActions";
import { toast } from "sonner";

// Mock data for franchise managers
const franchiseManagersData = [
  {
    id: "fm-001",
    franchiseName: "TechZone Mumbai",
    managerName: "Rajesh Sharma",
    email: "rajesh@techzone.com",
    phone: "+91 98765 43210",
    country: "India",
    city: "Mumbai",
    flag: "🇮🇳",
    status: "active",
    totalOutlets: 12,
    revenue: "$1.2M",
    revenueGrowth: 15,
    joinedDate: "2023-01-15",
    lastActive: "5 minutes ago",
    staff: 45,
  },
  {
    id: "fm-002",
    franchiseName: "Digital Hub Lagos",
    managerName: "Oluwaseun Adeyemi",
    email: "olu@digitalhub.ng",
    phone: "+234 801 234 5678",
    country: "Nigeria",
    city: "Lagos",
    flag: "🇳🇬",
    status: "active",
    totalOutlets: 8,
    revenue: "$890K",
    revenueGrowth: 22,
    joinedDate: "2023-03-20",
    lastActive: "15 minutes ago",
    staff: 32,
  },
  {
    id: "fm-003",
    franchiseName: "SmartBiz London",
    managerName: "James Thompson",
    email: "james@smartbiz.uk",
    phone: "+44 20 7123 4567",
    country: "United Kingdom",
    city: "London",
    flag: "🇬🇧",
    status: "hold",
    totalOutlets: 5,
    revenue: "$650K",
    revenueGrowth: -3,
    joinedDate: "2022-11-10",
    lastActive: "2 days ago",
    staff: 18,
  },
  {
    id: "fm-004",
    franchiseName: "CloudServe Sydney",
    managerName: "Sarah Mitchell",
    email: "sarah@cloudserve.au",
    phone: "+61 2 9876 5432",
    country: "Australia",
    city: "Sydney",
    flag: "🇦🇺",
    status: "active",
    totalOutlets: 6,
    revenue: "$780K",
    revenueGrowth: 18,
    joinedDate: "2023-02-28",
    lastActive: "1 hour ago",
    staff: 24,
  },
  {
    id: "fm-005",
    franchiseName: "NetWorks Dubai",
    managerName: "Ahmed Al-Hassan",
    email: "ahmed@networks.ae",
    phone: "+971 4 567 8901",
    country: "UAE",
    city: "Dubai",
    flag: "🇦🇪",
    status: "active",
    totalOutlets: 15,
    revenue: "$2.1M",
    revenueGrowth: 35,
    joinedDate: "2022-09-15",
    lastActive: "30 minutes ago",
    staff: 58,
  },
  {
    id: "fm-006",
    franchiseName: "TechPro Berlin",
    managerName: "Hans Mueller",
    email: "hans@techpro.de",
    phone: "+49 30 1234 5678",
    country: "Germany",
    city: "Berlin",
    flag: "🇩🇪",
    status: "active",
    totalOutlets: 9,
    revenue: "$1.5M",
    revenueGrowth: 12,
    joinedDate: "2022-07-01",
    lastActive: "2 hours ago",
    staff: 36,
  },
];

// Powers list for Franchise Manager
const franchisePowers = [
  { icon: Store, text: "Can manage franchise outlets" },
  { icon: Users, text: "Can assign local staff" },
  { icon: DollarSign, text: "Can view franchise revenue" },
  { icon: Briefcase, text: "Can manage franchise services" },
  { icon: FileText, text: "Can raise support tickets" },
  { icon: CheckCircle, text: "Can request approvals" },
];

// Activity log data
const activityLogs = [
  { id: "log-001", action: "Staff Assigned", target: "Mumbai Outlet #3", time: "5 min ago", type: "staff" },
  { id: "log-002", action: "Revenue Report Generated", target: "Q4 2024", time: "1 hour ago", type: "finance" },
  { id: "log-003", action: "Outlet Created", target: "Pune Branch", time: "3 hours ago", type: "outlet" },
  { id: "log-004", action: "Support Ticket Raised", target: "Billing Issue", time: "1 day ago", type: "support" },
  { id: "log-005", action: "Approval Requested", target: "New Equipment", time: "2 days ago", type: "approval" },
];

const FranchiseManagerView = () => {
  const [selectedManager, setSelectedManager] = useState<typeof franchiseManagersData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // System actions hook for audit logging and API connections
  const { executeAction, actions } = useSystemActions();

  const handleSelectManager = (manager: typeof franchiseManagersData[0]) => {
    setSelectedManager(manager);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedManager(null);
  };

  // Action handlers with audit logging
  const handleViewActivity = useCallback(async () => {
    if (!selectedManager) return;
    await executeAction({
      module: 'franchise',
      action: 'read',
      entityType: 'Activity Log',
      entityId: selectedManager.id,
      entityName: selectedManager.franchiseName,
      successMessage: `Viewing activity for ${selectedManager.franchiseName}`
    });
  }, [selectedManager, executeAction]);

  const handleViewOutlets = useCallback(async () => {
    if (!selectedManager) return;
    await executeAction({
      module: 'franchise',
      action: 'read',
      entityType: 'Outlets',
      entityId: selectedManager.id,
      entityName: selectedManager.franchiseName,
      successMessage: `${selectedManager.totalOutlets} outlets for ${selectedManager.franchiseName}`
    });
  }, [selectedManager, executeAction]);

  const handleViewRevenue = useCallback(async () => {
    if (!selectedManager) return;
    await executeAction({
      module: 'franchise',
      action: 'read',
      entityType: 'Revenue Report',
      entityId: selectedManager.id,
      entityName: selectedManager.franchiseName,
      successMessage: `Revenue: ${selectedManager.revenue}`
    });
  }, [selectedManager, executeAction]);

  const handleAssignStaff = useCallback(async () => {
    if (!selectedManager) return;
    await actions.assign('franchise', 'Staff', selectedManager.id, 'unassigned', selectedManager.franchiseName);
  }, [selectedManager, actions]);

  const handleSuspend = useCallback(async () => {
    if (!selectedManager) return;
    actions.suspend('franchise', 'Franchise', selectedManager.id, selectedManager.franchiseName);
  }, [selectedManager, actions]);

  const handleLockAccess = useCallback(async () => {
    if (!selectedManager) return;
    await actions.lock('franchise', 'Franchise Access', selectedManager.id, selectedManager.franchiseName);
  }, [selectedManager, actions]);

  const filteredManagers = franchiseManagersData.filter(fm => {
    const matchesSearch = 
      fm.franchiseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fm.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fm.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || fm.country === filterCountry;
    const matchesStatus = filterStatus === "all" || fm.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const uniqueCountries = [...new Set(franchiseManagersData.map(fm => fm.country))];

  const totalStats = {
    total: franchiseManagersData.length,
    active: franchiseManagersData.filter(fm => fm.status === "active").length,
    onHold: franchiseManagersData.filter(fm => fm.status === "hold").length,
    totalOutlets: franchiseManagersData.reduce((sum, fm) => sum + fm.totalOutlets, 0),
    totalStaff: franchiseManagersData.reduce((sum, fm) => sum + fm.staff, 0),
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Franchise Manager Dashboard</h1>
                  <p className="text-muted-foreground">Manage all Franchise Managers worldwide</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Activity className="w-4 h-4" />
                  Live Mode
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Franchises</p>
                      <p className="text-3xl font-bold text-indigo-400">{totalStats.total}</p>
                    </div>
                    <Building2 className="w-10 h-10 text-indigo-400/30" />
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
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">On Hold</p>
                      <p className="text-3xl font-bold text-orange-400">{totalStats.onHold}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-orange-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Outlets</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.totalOutlets}</p>
                    </div>
                    <Store className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-500/10 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Staff</p>
                      <p className="text-3xl font-bold text-purple-400">{totalStats.totalStaff}</p>
                    </div>
                    <Users className="w-10 h-10 text-purple-400/30" />
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
                      placeholder="Search franchise or manager..."
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

            {/* Franchise Managers List */}
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
                      ? "border-indigo-500/50 bg-indigo-500/10"
                      : "border-border/50 hover:border-indigo-500/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="w-14 h-14 border-2 border-indigo-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                        {manager.managerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{manager.franchiseName}</h3>
                        <Badge 
                          variant={manager.status === "active" ? "default" : "secondary"}
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
                      <p className="text-sm text-muted-foreground mb-2">{manager.managerName}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{manager.flag}</span>
                          {manager.city}, {manager.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          {manager.totalOutlets} outlets
                        </span>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{manager.revenue}</p>
                      <p className={cn(
                        "text-xs flex items-center justify-end gap-1",
                        manager.revenueGrowth >= 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        <TrendingUp className={cn("w-3 h-3", manager.revenueGrowth < 0 && "rotate-180")} />
                        {manager.revenueGrowth >= 0 ? "+" : ""}{manager.revenueGrowth}%
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {manager.staff} staff
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {manager.lastActive}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Joined {manager.joinedDate}
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
            className="w-[480px] border-l border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/50">
                  Franchise Details
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-indigo-500">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold">
                    {selectedManager.managerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedManager.franchiseName}</h2>
                  <p className="text-muted-foreground">{selectedManager.managerName}</p>
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
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{selectedManager.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Phone className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{selectedManager.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <span className="text-lg">{selectedManager.flag}</span>
                          {selectedManager.city}, {selectedManager.country}
                        </p>
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
                    {franchisePowers.map((power, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-indigo-500/5">
                        <power.icon className="w-4 h-4 text-indigo-400" />
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
                    <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={handleViewActivity}>
                      <Eye className="w-4 h-4" />
                      View Activity
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={handleViewOutlets}>
                      <Store className="w-4 h-4" />
                      View Outlets
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={handleViewRevenue}>
                      <DollarSign className="w-4 h-4" />
                      View Revenue
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={handleAssignStaff}>
                      <Users className="w-4 h-4" />
                      Assign Staff
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-orange-400 hover:text-orange-400" onClick={handleSuspend}>
                      <Ban className="w-4 h-4" />
                      Suspend
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-red-400 hover:text-red-400" onClick={handleLockAccess}>
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
                          log.type === "staff" && "bg-blue-500/20 text-blue-400",
                          log.type === "finance" && "bg-emerald-500/20 text-emerald-400",
                          log.type === "outlet" && "bg-purple-500/20 text-purple-400",
                          log.type === "support" && "bg-orange-500/20 text-orange-400",
                          log.type === "approval" && "bg-cyan-500/20 text-cyan-400",
                        )}>
                          {log.type === "staff" && <Users className="w-4 h-4" />}
                          {log.type === "finance" && <DollarSign className="w-4 h-4" />}
                          {log.type === "outlet" && <Store className="w-4 h-4" />}
                          {log.type === "support" && <FileText className="w-4 h-4" />}
                          {log.type === "approval" && <CheckCircle className="w-4 h-4" />}
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

export default FranchiseManagerView;
