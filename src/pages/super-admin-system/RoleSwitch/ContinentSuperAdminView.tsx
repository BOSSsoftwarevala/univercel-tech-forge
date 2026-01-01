import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Globe2, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, ChevronRight, X,
  CheckCircle, AlertTriangle, Search, Filter, RefreshCw,
  FileText, Users, Zap, TrendingUp, Bell, BarChart3,
  ArrowUpRight, ArrowDownRight, Download, MoreHorizontal,
  Play, Pause, Flag, Hash, Mail, UserCheck, Building,
  AlertCircle, Timer, Award, Target, ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Country data for each continent
const continentCountries: Record<string, { name: string; admin: string; status: string }[]> = {
  "Asia": [
    { name: "China", admin: "Li Wei", status: "active" },
    { name: "India", admin: "Raj Patel", status: "active" },
    { name: "Japan", admin: "Yuki Tanaka", status: "active" },
    { name: "South Korea", admin: "Kim Min-jun", status: "active" },
    { name: "Indonesia", admin: "Budi Santoso", status: "suspended" },
    { name: "Thailand", admin: "Somchai Prasert", status: "active" },
    { name: "Vietnam", admin: "Nguyen Van", status: "active" },
    { name: "Philippines", admin: "Jose Santos", status: "active" },
    { name: "Malaysia", admin: "Ahmad Hassan", status: "active" },
    { name: "Singapore", admin: "David Tan", status: "active" },
  ],
  "Africa": [
    { name: "Nigeria", admin: "Chukwu Emeka", status: "active" },
    { name: "Egypt", admin: "Ahmed Hassan", status: "active" },
    { name: "South Africa", admin: "Johan Van Der Berg", status: "active" },
    { name: "Kenya", admin: "James Ochieng", status: "suspended" },
    { name: "Ghana", admin: "Kwame Asante", status: "active" },
    { name: "Morocco", admin: "Youssef Benali", status: "active" },
  ],
  "Europe": [
    { name: "Germany", admin: "Klaus Schmidt", status: "active" },
    { name: "France", admin: "Pierre Dubois", status: "active" },
    { name: "United Kingdom", admin: "James Wilson", status: "active" },
    { name: "Italy", admin: "Marco Rossi", status: "active" },
    { name: "Spain", admin: "Carlos Garcia", status: "suspended" },
    { name: "Netherlands", admin: "Jan De Vries", status: "active" },
  ],
  "North America": [
    { name: "United States", admin: "John Smith", status: "active" },
    { name: "Canada", admin: "Michael Brown", status: "active" },
    { name: "Mexico", admin: "Roberto Martinez", status: "active" },
    { name: "Cuba", admin: "Luis Hernandez", status: "suspended" },
  ],
  "South America": [
    { name: "Brazil", admin: "João Silva", status: "active" },
    { name: "Argentina", admin: "Diego Fernandez", status: "suspended" },
    { name: "Colombia", admin: "Carlos Mendez", status: "active" },
    { name: "Chile", admin: "Pablo Gonzalez", status: "active" },
  ],
  "Australia/Oceania": [
    { name: "Australia", admin: "Jack Thompson", status: "active" },
    { name: "New Zealand", admin: "William Clarke", status: "active" },
    { name: "Fiji", admin: "Ratu Meli", status: "active" },
  ],
  "Antarctica": []
};

// All 7 Continent Super Admins data
const continentSuperAdmins = [
  {
    id: "CSA-ASIA-001",
    continent: "Asia",
    continentCode: "AS",
    name: "Asia Super Admin",
    email: "asia.csa@system.com",
    username: "asia_superadmin",
    status: "active" as const,
    countriesAssigned: "All Asian Countries",
    roleLevel: "Continent Super Admin",
    countriesCount: 48,
    activeCountryAdmins: 45,
    createdDate: "2023-01-15",
    lastActivity: "2 min ago",
    lastLogin: "Today, 09:32 AM",
    actionsToday: 24,
    healthScore: 94,
    complianceScore: 98,
    pendingApprovals: 3,
    issuesResolved: 156,
    icon: "🌏",
    color: "#ef4444",
    permissions: {
      countriesCreate: true,
      countriesEdit: true,
      countryAdminAssign: true,
      regionalReports: true,
      liveMonitoring: true,
    },
    recentActions: [
      { action: "Approved Country Admin for Vietnam", time: "2 min ago", type: "approval" },
      { action: "Updated regional compliance settings", time: "15 min ago", type: "config" },
      { action: "Reviewed Thailand performance report", time: "1 hour ago", type: "review" },
    ]
  },
  {
    id: "CSA-AFRICA-001",
    continent: "Africa",
    continentCode: "AF",
    name: "Africa Super Admin",
    email: "africa.csa@system.com",
    username: "africa_superadmin",
    status: "active" as const,
    countriesAssigned: "All African Countries",
    roleLevel: "Continent Super Admin",
    countriesCount: 54,
    activeCountryAdmins: 48,
    createdDate: "2023-02-20",
    lastActivity: "5 min ago",
    lastLogin: "Today, 08:45 AM",
    actionsToday: 18,
    healthScore: 89,
    complianceScore: 95,
    pendingApprovals: 7,
    issuesResolved: 203,
    icon: "🌍",
    color: "#f59e0b",
    permissions: {
      countriesCreate: true,
      countriesEdit: true,
      countryAdminAssign: true,
      regionalReports: true,
      liveMonitoring: true,
    },
    recentActions: [
      { action: "Created new country entry: Senegal", time: "5 min ago", type: "create" },
      { action: "Suspended Country Admin for Kenya", time: "2 hours ago", type: "suspension" },
    ]
  },
  {
    id: "CSA-EUROPE-001",
    continent: "Europe",
    continentCode: "EU",
    name: "Europe Super Admin",
    email: "europe.csa@system.com",
    username: "europe_superadmin",
    status: "active" as const,
    countriesAssigned: "All European Countries",
    roleLevel: "Continent Super Admin",
    countriesCount: 44,
    activeCountryAdmins: 42,
    createdDate: "2023-01-10",
    lastActivity: "15 min ago",
    lastLogin: "Today, 10:15 AM",
    actionsToday: 12,
    healthScore: 96,
    complianceScore: 99,
    pendingApprovals: 2,
    issuesResolved: 89,
    icon: "🌍",
    color: "#3b82f6",
    permissions: {
      countriesCreate: true,
      countriesEdit: true,
      countryAdminAssign: true,
      regionalReports: true,
      liveMonitoring: true,
    },
    recentActions: [
      { action: "Approved withdrawal for Germany", time: "15 min ago", type: "approval" },
      { action: "Updated UK compliance settings", time: "1 hour ago", type: "config" },
    ]
  },
  {
    id: "CSA-NA-001",
    continent: "North America",
    continentCode: "NA",
    name: "North America Super Admin",
    email: "northamerica.csa@system.com",
    username: "na_superadmin",
    status: "active" as const,
    countriesAssigned: "USA, Canada, Mexico, Caribbean",
    roleLevel: "Continent Super Admin",
    countriesCount: 23,
    activeCountryAdmins: 21,
    createdDate: "2023-03-01",
    lastActivity: "30 min ago",
    lastLogin: "Today, 07:00 AM",
    actionsToday: 8,
    healthScore: 91,
    complianceScore: 97,
    pendingApprovals: 4,
    issuesResolved: 67,
    icon: "🌎",
    color: "#10b981",
    permissions: {
      countriesCreate: true,
      countriesEdit: true,
      countryAdminAssign: true,
      regionalReports: true,
      liveMonitoring: true,
    },
    recentActions: [
      { action: "Resolved escalation from Mexico", time: "30 min ago", type: "resolution" },
    ]
  },
  {
    id: "CSA-SA-001",
    continent: "South America",
    continentCode: "SA",
    name: "South America Super Admin",
    email: "southamerica.csa@system.com",
    username: "sa_superadmin",
    status: "active" as const,
    countriesAssigned: "All South American Countries",
    roleLevel: "Continent Super Admin",
    countriesCount: 12,
    activeCountryAdmins: 10,
    createdDate: "2023-04-15",
    lastActivity: "1 hour ago",
    lastLogin: "Today, 06:30 AM",
    actionsToday: 5,
    healthScore: 87,
    complianceScore: 92,
    pendingApprovals: 3,
    issuesResolved: 45,
    icon: "🌎",
    color: "#84cc16",
    permissions: {
      countriesCreate: true,
      countriesEdit: true,
      countryAdminAssign: true,
      regionalReports: true,
      liveMonitoring: true,
    },
    recentActions: [
      { action: "Updated Brazil compliance settings", time: "1 hour ago", type: "config" },
    ]
  },
  {
    id: "CSA-OCEANIA-001",
    continent: "Australia/Oceania",
    continentCode: "OC",
    name: "Oceania Super Admin",
    email: "oceania.csa@system.com",
    username: "oceania_superadmin",
    status: "active" as const,
    countriesAssigned: "Australia, New Zealand, Pacific Islands",
    roleLevel: "Continent Super Admin",
    countriesCount: 14,
    activeCountryAdmins: 12,
    createdDate: "2023-05-01",
    lastActivity: "45 min ago",
    lastLogin: "Today, 06:00 AM",
    actionsToday: 6,
    healthScore: 88,
    complianceScore: 94,
    pendingApprovals: 1,
    issuesResolved: 38,
    icon: "🌏",
    color: "#8b5cf6",
    permissions: {
      countriesCreate: true,
      countriesEdit: true,
      countryAdminAssign: true,
      regionalReports: true,
      liveMonitoring: true,
    },
    recentActions: [
      { action: "Updated New Zealand settings", time: "45 min ago", type: "config" },
    ]
  },
  {
    id: "CSA-ANT-000",
    continent: "Antarctica",
    continentCode: "AN",
    name: "System Reserved",
    email: "system@reserved.com",
    username: "system_reserved",
    status: "locked" as const,
    countriesAssigned: "None",
    roleLevel: "Read-only / Monitoring",
    countriesCount: 0,
    activeCountryAdmins: 0,
    createdDate: "2023-01-01",
    lastActivity: "System Locked",
    lastLogin: "N/A",
    actionsToday: 0,
    healthScore: 0,
    complianceScore: 0,
    pendingApprovals: 0,
    issuesResolved: 0,
    icon: "🧊",
    color: "#06b6d4",
    permissions: {
      countriesCreate: false,
      countriesEdit: false,
      countryAdminAssign: false,
      regionalReports: true,
      liveMonitoring: true,
    },
    recentActions: []
  },
];

interface ContinentSuperAdminViewProps {
  activeNav?: string;
}

const ContinentSuperAdminView = ({ activeNav = "dashboard" }: ContinentSuperAdminViewProps) => {
  const [selectedCSA, setSelectedCSA] = useState<typeof continentSuperAdmins[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [continentFilter, setContinentFilter] = useState("all");
  const [detailTab, setDetailTab] = useState("profile");

  // Stats calculations
  const totalCSAs = continentSuperAdmins.length;
  const activeCSAs = continentSuperAdmins.filter(c => c.status === "active").length;
  const lockedCSAs = continentSuperAdmins.filter(c => c.status === "locked").length;
  const liveActionsToday = continentSuperAdmins.reduce((sum, c) => sum + c.actionsToday, 0);

  // Filtered CSAs
  const filteredCSAs = continentSuperAdmins.filter(csa => {
    const matchesSearch = csa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          csa.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          csa.continent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || csa.status === statusFilter;
    const matchesContinent = continentFilter === "all" || csa.continent === continentFilter;
    return matchesSearch && matchesStatus && matchesContinent;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Active</Badge>;
      case "locked":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">System Locked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  // Main Registry View
  const renderRegistryView = () => (
    <div className="h-full flex overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                <Globe2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Continent Super Admin Registry</h1>
                <p className="text-slate-400 text-sm">Manage all 7 Continent Super Administrators</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-slate-700">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-slate-700">
                <RefreshCw className="w-4 h-4" />
                Sync
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Total Continents</p>
                    <p className="text-3xl font-bold text-white mt-1">7</p>
                  </div>
                  <Globe2 className="w-10 h-10 text-blue-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Total CSAs</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalCSAs}</p>
                  </div>
                  <Users className="w-10 h-10 text-purple-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/10 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-400/80 uppercase tracking-wider">Active CSAs</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">{activeCSAs}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-emerald-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-500/10 border-slate-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400/80 uppercase tracking-wider">System Locked</p>
                    <p className="text-3xl font-bold text-slate-400 mt-1">{lockedCSAs}</p>
                  </div>
                  <Lock className="w-10 h-10 text-slate-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-400/80 uppercase tracking-wider">Live Actions Today</p>
                    <p className="text-3xl font-bold text-amber-400 mt-1">{liveActionsToday}</p>
                  </div>
                  <Zap className="w-10 h-10 text-amber-400/30" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by Name / ID / Continent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <Select value={continentFilter} onValueChange={setContinentFilter}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="By Continent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Continents</SelectItem>
                {continentSuperAdmins.map(c => (
                  <SelectItem key={c.continent} value={c.continent}>{c.continent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="By Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2 border-slate-700">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Main Table */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700/50 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold">Continent</TableHead>
                    <TableHead className="text-slate-400 font-semibold">CSA Name</TableHead>
                    <TableHead className="text-slate-400 font-semibold">CSA ID</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Email</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Status</TableHead>
                    <TableHead className="text-slate-400 font-semibold text-center">Countries</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Created</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Last Activity</TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCSAs.map((csa) => (
                    <TableRow 
                      key={csa.id} 
                      className="border-slate-700/30 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedCSA(csa)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${csa.color}20` }}
                          >
                            {csa.icon}
                          </div>
                          <span className="text-white font-medium">{csa.continent}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-slate-700 text-white text-xs">
                              {csa.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white">{csa.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                          {csa.id}
                        </code>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">{csa.email}</TableCell>
                      <TableCell>{getStatusBadge(csa.status)}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-white font-medium">{csa.countriesCount}</span>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">{csa.createdDate}</TableCell>
                      <TableCell className="text-slate-400 text-sm">{csa.lastActivity}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedCSA(csa); setDetailTab("profile"); }}>
                              <Eye className="w-4 h-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedCSA(csa); setDetailTab("activity"); }}>
                              <Activity className="w-4 h-4 mr-2" /> View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedCSA(csa); setDetailTab("countries"); }}>
                              <MapPin className="w-4 h-4 mr-2" /> View Countries
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-yellow-400">
                              {csa.status === "active" ? (
                                <><Pause className="w-4 h-4 mr-2" /> Suspend</>
                              ) : (
                                <><Play className="w-4 h-4 mr-2" /> Activate</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <FileText className="w-4 h-4 mr-2" /> Audit Logs
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel - Slide Out */}
      <AnimatePresence>
        {selectedCSA && (
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[500px] bg-slate-900 border-l border-slate-700/50 flex flex-col shadow-2xl"
          >
            {/* Panel Header */}
            <div 
              className="p-5 border-b border-slate-700/50"
              style={{ background: `linear-gradient(135deg, ${selectedCSA.color}15, transparent)` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${selectedCSA.color}25` }}
                  >
                    {selectedCSA.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedCSA.name}</h3>
                    <p className="text-sm text-slate-400">{selectedCSA.continent} Super Admin</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedCSA(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {getStatusBadge(selectedCSA.status)}
            </div>

            {/* Tabs */}
            <Tabs value={detailTab} onValueChange={setDetailTab} className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4 bg-slate-800/50">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="countries">Countries</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  {/* Profile Tab */}
                  <TabsContent value="profile" className="mt-0 space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400">Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">CSA ID</span>
                          <code className="text-blue-400 text-sm">{selectedCSA.id}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Email</span>
                          <span className="text-white">{selectedCSA.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Username</span>
                          <span className="text-white">{selectedCSA.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Continent</span>
                          <span className="text-white">{selectedCSA.continent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Created</span>
                          <span className="text-white">{selectedCSA.createdDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last Login</span>
                          <span className="text-white">{selectedCSA.lastLogin}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-500 text-sm">Health Score</span>
                            <span className={cn("font-bold", getHealthScoreColor(selectedCSA.healthScore))}>
                              {selectedCSA.healthScore}%
                            </span>
                          </div>
                          <Progress value={selectedCSA.healthScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-500 text-sm">Compliance Score</span>
                            <span className={cn("font-bold", getHealthScoreColor(selectedCSA.complianceScore))}>
                              {selectedCSA.complianceScore}%
                            </span>
                          </div>
                          <Progress value={selectedCSA.complianceScore} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                            <p className="text-2xl font-bold text-white">{selectedCSA.activeCountryAdmins}</p>
                            <p className="text-xs text-slate-500">Active Country Admins</p>
                          </div>
                          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                            <p className="text-2xl font-bold text-white">{selectedCSA.issuesResolved}</p>
                            <p className="text-xs text-slate-500">Issues Resolved</p>
                          </div>
                          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                            <p className="text-2xl font-bold text-amber-400">{selectedCSA.pendingApprovals}</p>
                            <p className="text-xs text-slate-500">Pending Approvals</p>
                          </div>
                          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                            <p className="text-2xl font-bold text-blue-400">{selectedCSA.actionsToday}</p>
                            <p className="text-xs text-slate-500">Actions Today</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Permissions Tab */}
                  <TabsContent value="permissions" className="mt-0">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400">Power & Permissions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(selectedCSA.permissions).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                            <span className="text-white text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            {value ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                                <CheckCircle className="w-3 h-3 mr-1" /> Enabled
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                                <X className="w-3 h-3 mr-1" /> Disabled
                              </Badge>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Countries Tab */}
                  <TabsContent value="countries" className="mt-0">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400 flex items-center justify-between">
                          <span>Assigned Countries</span>
                          <Badge variant="outline" className="text-blue-400 border-blue-500/50">
                            {selectedCSA.countriesCount} Total
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {(continentCountries[selectedCSA.continent] || []).map((country, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: selectedCSA.color }}
                                />
                                <div>
                                  <p className="text-white font-medium">{country.name}</p>
                                  <p className="text-xs text-slate-500">Admin: {country.admin}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(country.status)}
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {(continentCountries[selectedCSA.continent] || []).length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                              No countries assigned
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="mt-0">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm text-slate-400">Recent Activity</CardTitle>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <Download className="w-3 h-3" /> Export
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedCSA.recentActions.map((action, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                action.type === "approval" && "bg-emerald-500/20",
                                action.type === "config" && "bg-blue-500/20",
                                action.type === "review" && "bg-purple-500/20",
                                action.type === "create" && "bg-green-500/20",
                                action.type === "suspension" && "bg-red-500/20",
                                action.type === "resolution" && "bg-cyan-500/20"
                              )}>
                                <Activity className={cn(
                                  "w-4 h-4",
                                  action.type === "approval" && "text-emerald-400",
                                  action.type === "config" && "text-blue-400",
                                  action.type === "review" && "text-purple-400",
                                  action.type === "create" && "text-green-400",
                                  action.type === "suspension" && "text-red-400",
                                  action.type === "resolution" && "text-cyan-400"
                                )} />
                              </div>
                              <div className="flex-1">
                                <p className="text-white text-sm">{action.action}</p>
                                <p className="text-xs text-slate-500 mt-1">{action.time}</p>
                              </div>
                            </div>
                          ))}
                          {selectedCSA.recentActions.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                              No recent activity
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </ScrollArea>

              {/* Panel Actions */}
              <div className="p-4 border-t border-slate-700/50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2 border-slate-700">
                    <FileText className="w-4 h-4" /> Audit Logs
                  </Button>
                  <Button variant="outline" className="gap-2 border-slate-700">
                    <BarChart3 className="w-4 h-4" /> Full Report
                  </Button>
                </div>
                {selectedCSA.status === "active" ? (
                  <Button variant="outline" className="w-full gap-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                    <Pause className="w-4 h-4" /> Suspend CSA
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                    <Play className="w-4 h-4" /> Activate CSA
                  </Button>
                )}
              </div>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // If activeNav is "admins", show the registry view
  if (activeNav === "admins") {
    return renderRegistryView();
  }

  // Default dashboard view - show the same registry for now
  return renderRegistryView();
};

export default ContinentSuperAdminView;