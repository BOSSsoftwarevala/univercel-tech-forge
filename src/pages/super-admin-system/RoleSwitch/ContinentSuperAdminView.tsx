import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Globe2, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, Key, ChevronRight, X,
  CheckCircle, AlertTriangle, Search, Filter, RefreshCw,
  ThumbsUp, ThumbsDown, FileText, Users, Zap, 
  TrendingUp, Bell, CircleDot
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// All 7 Continents with their Super Admins
const continentsData = [
  {
    id: "africa",
    name: "Africa",
    code: "AF",
    flag: "🌍",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/50",
    textColor: "text-amber-400",
    countries: 54,
    activeManagers: 12,
    pendingApprovals: 8,
    superAdmin: {
      id: "csa-001",
      name: "Victoria Mensah",
      email: "v.mensah@system.com",
      avatar: "",
      status: "active",
      assignedSince: "2023-01-15",
      lastAction: "2 minutes ago",
      actionsToday: 24,
      countries: ["Nigeria", "Kenya", "South Africa", "Ghana", "Egypt", "Morocco", "Ethiopia"],
    }
  },
  {
    id: "asia",
    name: "Asia",
    code: "AS",
    flag: "🌏",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/50",
    textColor: "text-red-400",
    countries: 48,
    activeManagers: 18,
    pendingApprovals: 15,
    superAdmin: {
      id: "csa-002",
      name: "Chen Wei",
      email: "c.wei@system.com",
      avatar: "",
      status: "active",
      assignedSince: "2022-08-20",
      lastAction: "5 minutes ago",
      actionsToday: 32,
      countries: ["China", "India", "Japan", "South Korea", "Singapore", "Indonesia", "Malaysia"],
    }
  },
  {
    id: "europe",
    name: "Europe",
    code: "EU",
    flag: "🇪🇺",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
    countries: 44,
    activeManagers: 22,
    pendingApprovals: 5,
    superAdmin: {
      id: "csa-003",
      name: "Hans Mueller",
      email: "h.mueller@system.com",
      avatar: "",
      status: "active",
      assignedSince: "2022-06-10",
      lastAction: "15 minutes ago",
      actionsToday: 18,
      countries: ["Germany", "France", "UK", "Spain", "Italy", "Netherlands", "Poland"],
    }
  },
  {
    id: "north-america",
    name: "North America",
    code: "NA",
    flag: "🌎",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/50",
    textColor: "text-emerald-400",
    countries: 23,
    activeManagers: 8,
    pendingApprovals: 3,
    superAdmin: {
      id: "csa-004",
      name: "James Wilson",
      email: "j.wilson@system.com",
      avatar: "",
      status: "active",
      assignedSince: "2022-04-15",
      lastAction: "30 minutes ago",
      actionsToday: 15,
      countries: ["USA", "Canada", "Mexico", "Cuba", "Jamaica"],
    }
  },
  {
    id: "south-america",
    name: "South America",
    code: "SA",
    flag: "🌎",
    color: "from-lime-500 to-green-600",
    bgColor: "bg-lime-500/10",
    borderColor: "border-lime-500/50",
    textColor: "text-lime-400",
    countries: 12,
    activeManagers: 6,
    pendingApprovals: 4,
    superAdmin: {
      id: "csa-005",
      name: "Carlos Rodriguez",
      email: "c.rodriguez@system.com",
      avatar: "",
      status: "suspended",
      assignedSince: "2023-03-01",
      lastAction: "3 days ago",
      actionsToday: 0,
      countries: ["Brazil", "Argentina", "Chile", "Colombia", "Peru"],
    }
  },
  {
    id: "australia",
    name: "Australia/Oceania",
    code: "OC",
    flag: "🌏",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-400",
    countries: 14,
    activeManagers: 4,
    pendingApprovals: 2,
    superAdmin: {
      id: "csa-006",
      name: "Sarah Mitchell",
      email: "s.mitchell@system.com",
      avatar: "",
      status: "active",
      assignedSince: "2023-02-20",
      lastAction: "1 hour ago",
      actionsToday: 8,
      countries: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"],
    }
  },
  {
    id: "antarctica",
    name: "Antarctica",
    code: "AN",
    flag: "🏔️",
    color: "from-cyan-400 to-sky-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/50",
    textColor: "text-cyan-400",
    countries: 0,
    activeManagers: 1,
    pendingApprovals: 0,
    superAdmin: {
      id: "csa-007",
      name: "Dr. Erik Larsen",
      email: "e.larsen@system.com",
      avatar: "",
      status: "active",
      assignedSince: "2023-06-01",
      lastAction: "2 hours ago",
      actionsToday: 3,
      countries: ["Research Stations"],
    }
  },
];

// Powers list for Continent Super Admin
const csaPowers = [
  { icon: Users, text: "Can manage countries in continent" },
  { icon: User, text: "Can create Area Managers" },
  { icon: Ban, text: "Can suspend Area Managers" },
  { icon: CheckCircle, text: "Can approve continent-level requests" },
  { icon: Shield, text: "Can view continent security logs" },
  { icon: Zap, text: "Can control continent modules" },
  { icon: FileText, text: "Can access audit trails" },
  { icon: TrendingUp, text: "Can generate continent reports" },
];

// Pending Approvals Data
const pendingApprovals = [
  { id: "apr-001", type: "Area Manager Creation", target: "Nigeria Region", requestedBy: "Victoria Mensah", continent: "Africa", priority: "high", time: "5 min ago" },
  { id: "apr-002", type: "Module Access", target: "Payments Module", requestedBy: "Chen Wei", continent: "Asia", priority: "medium", time: "15 min ago" },
  { id: "apr-003", type: "User Suspension", target: "User ID: USR-445", requestedBy: "Hans Mueller", continent: "Europe", priority: "high", time: "30 min ago" },
  { id: "apr-004", type: "Budget Increase", target: "Marketing Budget", requestedBy: "James Wilson", continent: "North America", priority: "low", time: "1 hr ago" },
  { id: "apr-005", type: "Data Export", target: "Q4 Analytics", requestedBy: "Sarah Mitchell", continent: "Australia", priority: "medium", time: "2 hrs ago" },
];

// Live Activity Feed
const liveActivityFeed = [
  { id: "act-001", admin: "Victoria Mensah", action: "Approved Area Manager", target: "Lagos Office", continent: "Africa", time: "Just now", type: "approval" },
  { id: "act-002", admin: "Chen Wei", action: "Updated Module Access", target: "Shanghai Region", continent: "Asia", time: "2 min ago", type: "update" },
  { id: "act-003", admin: "Hans Mueller", action: "Reviewed Security Alert", target: "Berlin Office", continent: "Europe", time: "5 min ago", type: "security" },
  { id: "act-004", admin: "James Wilson", action: "Created New Task", target: "US Operations", continent: "North America", time: "10 min ago", type: "task" },
  { id: "act-005", admin: "Victoria Mensah", action: "Suspended User", target: "User ID: USR-889", continent: "Africa", time: "15 min ago", type: "suspension" },
  { id: "act-006", admin: "Sarah Mitchell", action: "Generated Report", target: "Monthly Analytics", continent: "Australia", time: "20 min ago", type: "report" },
  { id: "act-007", admin: "Chen Wei", action: "Approved Budget Request", target: "Tokyo Marketing", continent: "Asia", time: "25 min ago", type: "approval" },
  { id: "act-008", admin: "Hans Mueller", action: "Locked Account", target: "Suspicious Activity", continent: "Europe", time: "30 min ago", type: "security" },
];

const ContinentSuperAdminView = () => {
  const [selectedContinent, setSelectedContinent] = useState<typeof continentsData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleSelectContinent = (continent: typeof continentsData[0]) => {
    setSelectedContinent(continent);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedContinent(null);
  };

  const filteredContinents = continentsData.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.superAdmin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStats = {
    continents: 7,
    activeAdmins: continentsData.filter(c => c.superAdmin.status === "active").length,
    suspendedAdmins: continentsData.filter(c => c.superAdmin.status === "suspended").length,
    totalCountries: continentsData.reduce((sum, c) => sum + c.countries, 0),
    pendingApprovals: continentsData.reduce((sum, c) => sum + c.pendingApprovals, 0),
    totalManagers: continentsData.reduce((sum, c) => sum + c.activeManagers, 0),
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden flex flex-col", detailPanelOpen ? "mr-0" : "")}>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Globe2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Continent Super Admin Dashboard</h1>
                  <p className="text-muted-foreground">Manage all 7 continents and their Super Admins globally</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-emerald-500">
                  <Activity className="w-4 h-4" />
                  Live Mode
                </Button>
              </div>
            </div>

            {/* Stats Cards - All 7 Continents Overview */}
            <div className="grid grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Continents</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.continents}</p>
                    </div>
                    <Globe2 className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active CSAs</p>
                      <p className="text-3xl font-bold text-emerald-400">{totalStats.activeAdmins}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-emerald-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Suspended</p>
                      <p className="text-3xl font-bold text-orange-400">{totalStats.suspendedAdmins}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-orange-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-500/10 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Countries</p>
                      <p className="text-3xl font-bold text-purple-400">{totalStats.totalCountries}</p>
                    </div>
                    <MapPin className="w-10 h-10 text-purple-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-rose-500/10 border-rose-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Pending Approvals</p>
                      <p className="text-3xl font-bold text-rose-400">{totalStats.pendingApprovals}</p>
                    </div>
                    <Bell className="w-10 h-10 text-rose-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-cyan-500/10 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Area Managers</p>
                      <p className="text-3xl font-bold text-cyan-400">{totalStats.totalManagers}</p>
                    </div>
                    <Users className="w-10 h-10 text-cyan-400/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* World Map Visual - 7 Continents Grid */}
            <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-blue-400" />
                  World Map - 7 Continents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-7 gap-3">
                  {continentsData.map((continent) => (
                    <motion.div
                      key={continent.id}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectContinent(continent)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                        selectedContinent?.id === continent.id
                          ? cn(continent.bgColor, continent.borderColor)
                          : "bg-card hover:bg-accent/30 border-border/50 hover:border-border"
                      )}
                    >
                      {/* Continent Flag */}
                      <div className="text-center mb-3">
                        <span className="text-4xl">{continent.flag}</span>
                      </div>
                      
                      {/* Continent Name */}
                      <h3 className="text-sm font-bold text-center text-foreground mb-2">{continent.name}</h3>
                      
                      {/* Super Admin Status */}
                      <div className="flex justify-center mb-2">
                        <Badge 
                          variant={continent.superAdmin.status === "active" ? "default" : "destructive"}
                          className={cn(
                            "text-[10px]",
                            continent.superAdmin.status === "active" 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                              : ""
                          )}
                        >
                          {continent.superAdmin.status}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="space-y-1 text-center">
                        <p className="text-xs text-muted-foreground">
                          {continent.countries} countries
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {continent.activeManagers} managers
                        </p>
                      </div>

                      {/* Pending indicator */}
                      {continent.pendingApprovals > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold shadow-lg">
                          {continent.pendingApprovals}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="overview" className="gap-2">
                  <Users className="w-4 h-4" />
                  All Super Admins
                </TabsTrigger>
                <TabsTrigger value="approvals" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Pending Approvals
                  <Badge className="ml-1 bg-rose-500 text-white text-xs">{pendingApprovals.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Live Activity
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* All Super Admins Tab */}
              <TabsContent value="overview">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-400" />
                        All Continent Super Admins ({continentsData.length})
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            placeholder="Search admins..." 
                            className="pl-9 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="icon">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredContinents.map((continent) => (
                        <motion.div
                          key={continent.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectContinent(continent)}
                          className={cn(
                            "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                            selectedContinent?.id === continent.id
                              ? cn(continent.bgColor, continent.borderColor)
                              : "bg-card hover:bg-accent/50 border-border/50 hover:border-border"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            {/* Avatar with gradient */}
                            <Avatar className="w-14 h-14 ring-2 ring-offset-2 ring-offset-background" style={{
                              ["--tw-ring-color" as string]: continent.textColor.replace("text-", "rgb(var(--")
                            }}>
                              <AvatarImage src={continent.superAdmin.avatar} />
                              <AvatarFallback className={cn("text-white bg-gradient-to-br", continent.color)}>
                                {continent.superAdmin.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{continent.superAdmin.name}</h3>
                                <Badge 
                                  variant={continent.superAdmin.status === "active" ? "default" : "destructive"}
                                  className={cn(
                                    "text-xs",
                                    continent.superAdmin.status === "active" 
                                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                                      : ""
                                  )}
                                >
                                  {continent.superAdmin.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{continent.superAdmin.email}</p>
                            </div>

                            {/* Continent Info */}
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <span className="text-3xl">{continent.flag}</span>
                                <p className="text-xs text-muted-foreground mt-1">{continent.name}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-foreground">{continent.countries}</p>
                                <p className="text-xs text-muted-foreground">Countries</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-foreground">{continent.superAdmin.actionsToday}</p>
                                <p className="text-xs text-muted-foreground">Actions Today</p>
                              </div>
                              <div className="text-right min-w-[100px]">
                                <p className="text-xs text-muted-foreground">Last Action</p>
                                <p className="text-sm font-mono text-foreground">{continent.superAdmin.lastAction}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pending Approvals Tab */}
              <TabsContent value="approvals">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-rose-400" />
                      Pending Approvals ({pendingApprovals.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingApprovals.map((approval) => (
                        <div
                          key={approval.id}
                          className="p-4 rounded-xl border bg-card hover:bg-accent/30 border-border/50 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                approval.priority === "high" ? "bg-rose-500/20" :
                                approval.priority === "medium" ? "bg-yellow-500/20" : "bg-emerald-500/20"
                              )}>
                                <FileText className={cn(
                                  "w-5 h-5",
                                  approval.priority === "high" ? "text-rose-400" :
                                  approval.priority === "medium" ? "text-yellow-400" : "text-emerald-400"
                                )} />
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">{approval.type}</h4>
                                <p className="text-sm text-muted-foreground">{approval.target}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-foreground">{approval.requestedBy}</p>
                                <p className="text-xs text-muted-foreground">{approval.continent}</p>
                              </div>
                              <Badge className={cn(
                                "uppercase text-xs",
                                approval.priority === "high" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" :
                                approval.priority === "medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                                "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                              )}>
                                {approval.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground font-mono">{approval.time}</span>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 gap-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive" className="gap-1">
                                  <ThumbsDown className="w-3 h-3" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Live Activity Tab */}
              <TabsContent value="activity">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                      Live Activity Feed
                      <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">LIVE</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {liveActivityFeed.map((activity, idx) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            activity.type === "approval" ? "bg-emerald-400" :
                            activity.type === "security" ? "bg-rose-400" :
                            activity.type === "suspension" ? "bg-orange-400" :
                            "bg-blue-400"
                          )} />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium text-foreground">{activity.admin}</span>
                              <span className="text-muted-foreground"> {activity.action} → </span>
                              <span className="text-blue-400">{activity.target}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.continent}</p>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{activity.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      Security Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {continentsData.map((continent) => (
                        <div key={continent.id} className="p-4 rounded-xl border bg-card border-border/50">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{continent.flag}</span>
                            <div>
                              <h4 className="font-medium text-foreground">{continent.name}</h4>
                              <p className="text-xs text-muted-foreground">Security Status</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Threat Level</span>
                              <Badge className="bg-emerald-500/20 text-emerald-400">Low</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Active Sessions</span>
                              <span className="font-mono">{Math.floor(Math.random() * 50) + 10}</span>
                            </div>
                            <Progress value={Math.random() * 30 + 70} className="h-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detailPanelOpen && selectedContinent && (
          <motion.div
            initial={{ x: 450, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 450, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[450px] bg-card border-l border-border flex flex-col shadow-2xl"
          >
            {/* Panel Header */}
            <div className={cn(
              "p-5 border-b border-border flex items-center justify-between bg-gradient-to-r",
              selectedContinent.color.replace("from-", "from-").replace("to-", "to-") + "/10"
            )}>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedContinent.flag}</span>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedContinent.superAdmin.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedContinent.name} Super Admin</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-5 space-y-6">
                {/* Section 1: Identity */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Identity
                  </h4>
                  <Card className={cn("border", selectedContinent.borderColor, selectedContinent.bgColor)}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Name</span>
                        <span className="text-sm font-medium">{selectedContinent.superAdmin.name}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm font-medium">{selectedContinent.superAdmin.email}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Continent</span>
                        <span className="text-sm font-medium flex items-center gap-2">
                          {selectedContinent.flag} {selectedContinent.name}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge 
                          variant={selectedContinent.superAdmin.status === "active" ? "default" : "destructive"}
                          className={cn(
                            selectedContinent.superAdmin.status === "active" 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                              : ""
                          )}
                        >
                          {selectedContinent.superAdmin.status}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Assigned Since</span>
                        <span className="text-sm font-mono">{selectedContinent.superAdmin.assignedSince}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Section 2: Powers */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Powers
                  </h4>
                  <Card className={cn("border", selectedContinent.borderColor, selectedContinent.bgColor)}>
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {csaPowers.map((power, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <power.icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", selectedContinent.textColor)} />
                            <span className="text-foreground">{power.text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Section 3: Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Eye className="w-4 h-4" />
                      View Activity
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <MapPin className="w-4 h-4" />
                      Assign Country
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 text-orange-400 border-orange-500/50 hover:bg-orange-500/10">
                      <Ban className="w-4 h-4" />
                      Remove Country
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/10">
                      <AlertTriangle className="w-4 h-4" />
                      Suspend
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 text-red-400 border-red-500/50 hover:bg-red-500/10">
                      <Lock className="w-4 h-4" />
                      Lock
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Key className="w-4 h-4" />
                      Reset Access
                    </Button>
                  </div>
                </div>

                {/* Section 4: Live Actions Log */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Live Actions Log
                  </h4>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {liveActivityFeed
                          .filter(a => a.continent === selectedContinent.name)
                          .slice(0, 5)
                          .map((action, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <CircleDot className={cn("w-3 h-3 mt-1.5 flex-shrink-0", selectedContinent.textColor)} />
                            <div className="flex-1">
                              <span className="text-foreground">{action.action}</span>
                              <span className={cn("ml-1", selectedContinent.textColor)}>→ {action.target}</span>
                              <p className="text-xs text-muted-foreground font-mono mt-0.5">{action.time}</p>
                            </div>
                          </div>
                        ))}
                        {liveActivityFeed.filter(a => a.continent === selectedContinent.name).length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Countries List */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Assigned Countries ({selectedContinent.superAdmin.countries.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedContinent.superAdmin.countries.map((country) => (
                      <Badge 
                        key={country} 
                        variant="outline" 
                        className={cn("bg-muted/50", selectedContinent.borderColor)}
                      >
                        {country}
                      </Badge>
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

export default ContinentSuperAdminView;
