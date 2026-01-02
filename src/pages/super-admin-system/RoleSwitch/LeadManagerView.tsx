import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Target, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, ChevronRight, X, ChevronDown,
  CheckCircle, AlertTriangle, Search, RefreshCw,
  Users, TrendingUp, Phone, Mail, Flag, Layers,
  ArrowUpRight, ArrowDownRight, Flame, Snowflake,
  UserPlus, GitMerge, BarChart3, Zap, Inbox, Filter, Share2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Category Hierarchy for Lead Manager
interface NanoCategory {
  name: string;
  count?: number;
}

interface MicroCategory {
  name: string;
  nanos: NanoCategory[];
}

interface SubCategory {
  name: string;
  micros: MicroCategory[];
}

const leadManagerCategories: SubCategory[] = [
  {
    name: "Lead Flow",
    micros: [
      { name: "Capture", nanos: [{ name: "Web Form", count: 45 }, { name: "API Import", count: 23 }, { name: "Manual Entry", count: 12 }] },
      { name: "Distribute", nanos: [{ name: "Auto-Assign", count: 34 }, { name: "Round Robin", count: 18 }, { name: "Territory", count: 27 }] },
    ]
  },
  {
    name: "Quality Control",
    micros: [
      { name: "Scoring", nanos: [{ name: "AI Score", count: 156 }, { name: "Manual Score", count: 42 }] },
      { name: "Filtering", nanos: [{ name: "Spam Filter", count: 89 }, { name: "Duplicate Check", count: 34 }, { name: "Validation", count: 67 }] },
    ]
  },
  {
    name: "Pipeline",
    micros: [
      { name: "Stages", nanos: [{ name: "New", count: 24 }, { name: "Contacted", count: 18 }, { name: "Demo", count: 12 }, { name: "Negotiation", count: 8 }] },
      { name: "Actions", nanos: [{ name: "Follow-up", count: 45 }, { name: "Escalate", count: 7 }, { name: "Close", count: 89 }] },
    ]
  },
];

// Mock data for lead managers
const leadManagersData = [
  {
    id: "lm-001",
    name: "Priya Patel",
    email: "priya@leads.com",
    phone: "+91 98123 45678",
    region: "South Asia",
    country: "India",
    flag: "🇮🇳",
    status: "active",
    totalLeads: 1250,
    openLeads: 320,
    convertedLeads: 780,
    reportingTo: "Sales Head",
    lastActive: "2 minutes ago",
    conversionRate: 62,
  },
  {
    id: "lm-002",
    name: "Michael Chen",
    email: "m.chen@leads.com",
    phone: "+1 415 555 0123",
    region: "North America",
    country: "USA",
    flag: "🇺🇸",
    status: "active",
    totalLeads: 980,
    openLeads: 245,
    convertedLeads: 612,
    reportingTo: "Super Admin",
    lastActive: "15 minutes ago",
    conversionRate: 62,
  },
  {
    id: "lm-003",
    name: "Emma Wilson",
    email: "emma@leads.uk",
    phone: "+44 20 7946 0958",
    region: "Europe",
    country: "United Kingdom",
    flag: "🇬🇧",
    status: "active",
    totalLeads: 756,
    openLeads: 180,
    convertedLeads: 489,
    reportingTo: "Sales Head",
    lastActive: "1 hour ago",
    conversionRate: 65,
  },
  {
    id: "lm-004",
    name: "Ahmed Hassan",
    email: "ahmed@leads.ae",
    phone: "+971 50 123 4567",
    region: "Middle East",
    country: "UAE",
    flag: "🇦🇪",
    status: "hold",
    totalLeads: 520,
    openLeads: 95,
    convertedLeads: 380,
    reportingTo: "Super Admin",
    lastActive: "3 days ago",
    conversionRate: 73,
  },
  {
    id: "lm-005",
    name: "Sofia Rodriguez",
    email: "sofia@leads.mx",
    phone: "+52 55 1234 5678",
    region: "Latin America",
    country: "Mexico",
    flag: "🇲🇽",
    status: "active",
    totalLeads: 645,
    openLeads: 210,
    convertedLeads: 356,
    reportingTo: "Sales Head",
    lastActive: "30 minutes ago",
    conversionRate: 55,
  },
];

// Powers list for Lead Manager
const leadManagerPowers = [
  { icon: Eye, text: "Can view all leads in scope" },
  { icon: UserPlus, text: "Can assign leads to sales/support" },
  { icon: Activity, text: "Can change lead status" },
  { icon: GitMerge, text: "Can merge duplicate leads" },
  { icon: Flag, text: "Can mark lead priority" },
  { icon: Zap, text: "Can escalate hot leads" },
  { icon: BarChart3, text: "Can view conversion analytics" },
];

// Activity log data
const activityLogs = [
  { id: "log-001", action: "Lead Created", target: "TechCorp India", time: "2 min ago", type: "create" },
  { id: "log-002", action: "Lead Assigned", target: "Sales Team A", time: "15 min ago", type: "assign" },
  { id: "log-003", action: "Status Changed", target: "Qualified → Closed", time: "1 hour ago", type: "status" },
  { id: "log-004", action: "Lead Converted", target: "CloudMax Solutions", time: "3 hours ago", type: "convert" },
  { id: "log-005", action: "Lead Lost", target: "Budget constraints", time: "1 day ago", type: "lost" },
];

const LeadManagerView = () => {
  const [selectedManager, setSelectedManager] = useState<typeof leadManagersData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Category hierarchy state (default open so sub/micro/nano are visible immediately)
  const [expandedSubs, setExpandedSubs] = useState<string[]>(() => [leadManagerCategories[0]?.name].filter(Boolean) as string[]);
  const [expandedMicros, setExpandedMicros] = useState<string[]>(() => {
    const sub = leadManagerCategories[0];
    const micro = sub?.micros?.[0];
    return sub && micro ? [`${sub.name}-${micro.name}`] : [];
  });

  const toggleSub = (subName: string) => {
    setExpandedSubs(prev => 
      prev.includes(subName) 
        ? prev.filter(s => s !== subName) 
        : [...prev, subName]
    );
  };

  const toggleMicro = (microKey: string) => {
    setExpandedMicros(prev => 
      prev.includes(microKey) 
        ? prev.filter(m => m !== microKey) 
        : [...prev, microKey]
    );
  };

  const handleSelectManager = (manager: typeof leadManagersData[0]) => {
    setSelectedManager(manager);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedManager(null);
  };

  const filteredManagers = leadManagersData.filter(lm => {
    const matchesSearch = 
      lm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lm.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || lm.country === filterCountry;
    const matchesStatus = filterStatus === "all" || lm.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const uniqueCountries = [...new Set(leadManagersData.map(lm => lm.country))];

  const totalStats = {
    total: leadManagersData.length,
    active: leadManagersData.filter(lm => lm.status === "active").length,
    totalLeads: leadManagersData.reduce((sum, lm) => sum + lm.totalLeads, 0),
    openLeads: leadManagersData.reduce((sum, lm) => sum + lm.openLeads, 0),
    converted: leadManagersData.reduce((sum, lm) => sum + lm.convertedLeads, 0),
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Lead Manager Dashboard</h1>
                  <p className="text-muted-foreground">Manage all Lead Managers worldwide</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600">
                  <Activity className="w-4 h-4" />
                  Live Mode
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Lead Managers</p>
                      <p className="text-3xl font-bold text-violet-400">{totalStats.total}</p>
                    </div>
                    <Users className="w-10 h-10 text-violet-400/30" />
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
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Leads</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.totalLeads.toLocaleString()}</p>
                    </div>
                    <Target className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Open Leads</p>
                      <p className="text-3xl font-bold text-orange-400">{totalStats.openLeads.toLocaleString()}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-orange-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-500/10 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Converted</p>
                      <p className="text-3xl font-bold text-purple-400">{totalStats.converted.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-purple-400/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SubCategory & Nano Category Hierarchy */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="w-5 h-5 text-violet-400" />
                  Lead Categories Hierarchy
                  <Badge variant="outline" className="ml-2 text-xs">Sub → Micro → Nano</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leadManagerCategories.map((sub) => (
                  <div key={sub.name} className="border border-border/50 rounded-lg overflow-hidden">
                    {/* SubCategory Level */}
                    <motion.button
                      onClick={() => toggleSub(sub.name)}
                      className="w-full flex items-center justify-between p-3 bg-violet-500/10 hover:bg-violet-500/15 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                          <Layers className="w-4 h-4 text-violet-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground">{sub.name}</p>
                          <p className="text-xs text-muted-foreground">{sub.micros.length} micro categories</p>
                        </div>
                      </div>
                      <ChevronDown className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform",
                        expandedSubs.includes(sub.name) && "rotate-180"
                      )} />
                    </motion.button>

                    {/* MicroCategory Level */}
                    <AnimatePresence>
                      {expandedSubs.includes(sub.name) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 space-y-2 bg-background/30">
                            {sub.micros.map((micro) => (
                              <div key={micro.name} className="border border-border/30 rounded-lg overflow-hidden">
                                <motion.button
                                  onClick={() => toggleMicro(`${sub.name}-${micro.name}`)}
                                  className="w-full flex items-center justify-between p-2 bg-purple-500/5 hover:bg-purple-500/10 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                                      <Filter className="w-3 h-3 text-purple-400" />
                                    </div>
                                    <span className="text-sm font-medium">{micro.name}</span>
                                    <Badge variant="outline" className="text-xs">{micro.nanos.length} nanos</Badge>
                                  </div>
                                  <ChevronDown className={cn(
                                    "w-4 h-4 text-muted-foreground transition-transform",
                                    expandedMicros.includes(`${sub.name}-${micro.name}`) && "rotate-180"
                                  )} />
                                </motion.button>

                                {/* NanoCategory Level */}
                                <AnimatePresence>
                                  {expandedMicros.includes(`${sub.name}-${micro.name}`) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-2 space-y-1 bg-background/50">
                                        {micro.nanos.map((nano) => (
                                          <motion.div
                                            key={nano.name}
                                            whileHover={{ x: 4 }}
                                            className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 group-hover:bg-teal-300" />
                                              <span className="text-xs text-muted-foreground group-hover:text-teal-400 transition-colors">
                                                {nano.name}
                                              </span>
                                            </div>
                                            {nano.count && (
                                              <Badge variant="secondary" className="text-xs h-5">
                                                {nano.count}
                                              </Badge>
                                            )}
                                          </motion.div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search lead manager or region..."
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

            {/* Lead Managers List */}
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
                      ? "border-violet-500/50 bg-violet-500/10"
                      : "border-border/50 hover:border-violet-500/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 border-2 border-violet-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold">
                        {manager.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{manager.name}</h3>
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
                      <p className="text-sm text-muted-foreground mb-2">{manager.region}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{manager.flag}</span>
                          {manager.country}
                        </span>
                      </div>
                    </div>

                    {/* Lead Stats */}
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <Target className="w-3 h-3 text-violet-400" />
                        <span className="text-sm font-medium">{manager.totalLeads} leads</span>
                      </div>
                      <p className={cn(
                        "text-xs flex items-center justify-end gap-1",
                        manager.conversionRate >= 60 ? "text-emerald-400" : "text-orange-400"
                      )}>
                        <TrendingUp className="w-3 h-3" />
                        {manager.conversionRate}% conversion
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <AlertTriangle className="w-3 h-3" />
                      {manager.openLeads} open
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      {manager.convertedLeads} converted
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {manager.lastActive}
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
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50">
                  Lead Manager Details
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-violet-500">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl font-bold">
                    {selectedManager.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedManager.name}</h2>
                  <p className="text-muted-foreground">{selectedManager.region}</p>
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
                      <Mail className="w-4 h-4 text-violet-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{selectedManager.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Phone className="w-4 h-4 text-violet-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{selectedManager.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <MapPin className="w-4 h-4 text-violet-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Region</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <span className="text-lg">{selectedManager.flag}</span>
                          {selectedManager.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Shield className="w-4 h-4 text-violet-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Reporting To</p>
                        <p className="text-sm font-medium">{selectedManager.reportingTo}</p>
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
                    {leadManagerPowers.map((power, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-violet-500/5">
                        <power.icon className="w-4 h-4 text-violet-400" />
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
                      View All Leads
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <UserPlus className="w-4 h-4" />
                      Assign Lead
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <ArrowUpRight className="w-4 h-4" />
                      Reassign Lead
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <Activity className="w-4 h-4" />
                      Update Status
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-orange-400">
                      <Flame className="w-4 h-4" />
                      Mark Hot
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-blue-400">
                      <Snowflake className="w-4 h-4" />
                      Mark Cold
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      Close Lead
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-red-400">
                      <Ban className="w-4 h-4" />
                      Suspend
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Section 4: Activity Log */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Lead Activity Log
                  </h3>
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          log.type === "create" && "bg-blue-500/20 text-blue-400",
                          log.type === "assign" && "bg-violet-500/20 text-violet-400",
                          log.type === "status" && "bg-orange-500/20 text-orange-400",
                          log.type === "convert" && "bg-emerald-500/20 text-emerald-400",
                          log.type === "lost" && "bg-red-500/20 text-red-400",
                        )}>
                          {log.type === "create" && <Target className="w-4 h-4" />}
                          {log.type === "assign" && <UserPlus className="w-4 h-4" />}
                          {log.type === "status" && <Activity className="w-4 h-4" />}
                          {log.type === "convert" && <CheckCircle className="w-4 h-4" />}
                          {log.type === "lost" && <ArrowDownRight className="w-4 h-4" />}
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

export default LeadManagerView;
