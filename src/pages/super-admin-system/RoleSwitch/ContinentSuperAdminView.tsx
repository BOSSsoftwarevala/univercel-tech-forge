import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import ContinentDashboard from "@/components/super-admin-wireframe/ContinentDashboard";
import { ContinentSuperAdminDashboard, getContinentConfig, CONTINENT_CONFIGS } from "@/components/continent-dashboard";
import GlobalContinentDashboard from "@/components/continent-dashboard/GlobalContinentDashboard";
import MetaContinentDashboard from "@/pages/continent-super-admin/ContinentSuperAdminDashboard";
import GlobalCommandCenter from "@/pages/continent-super-admin/views/GlobalCommandCenter";

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
  "Middle East": [
    { name: "UAE", admin: "Ahmed Al-Rashid", status: "active" },
    { name: "Saudi Arabia", admin: "Mohammed Al-Saud", status: "active" },
    { name: "Qatar", admin: "Khalid Al-Thani", status: "active" },
    { name: "Kuwait", admin: "Fahad Al-Sabah", status: "active" },
    { name: "Bahrain", admin: "Ali Al-Khalifa", status: "active" },
    { name: "Oman", admin: "Said Al-Busaidi", status: "active" },
    { name: "Jordan", admin: "Omar Hassan", status: "active" },
    { name: "Israel", admin: "David Cohen", status: "active" },
  ],
  "Australia/Oceania": [
    { name: "Australia", admin: "Jack Thompson", status: "active" },
    { name: "New Zealand", admin: "William Clarke", status: "active" },
    { name: "Fiji", admin: "Ratu Meli", status: "active" },
  ],
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
    id: "CSA-ME-001",
    continent: "Middle East",
    continentCode: "ME",
    name: "Middle East Super Admin",
    email: "middleeast.csa@system.com",
    username: "me_superadmin",
    status: "active" as const,
    countriesAssigned: "UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, Jordan, Israel",
    roleLevel: "Continent Super Admin",
    countriesCount: 15,
    activeCountryAdmins: 14,
    createdDate: "2023-06-01",
    lastActivity: "10 min ago",
    lastLogin: "Today, 10:30 AM",
    actionsToday: 14,
    healthScore: 92,
    complianceScore: 96,
    pendingApprovals: 4,
    issuesResolved: 52,
    icon: "🕌",
    color: "#f59e0b",
    permissions: {
      countriesCreate: true,
      countriesEdit: true,
      countryAdminAssign: true,
      regionalReports: true,
      liveMonitoring: true,
    },
    recentActions: [
      { action: "Approved franchise application for Qatar", time: "10 min ago", type: "approval" },
      { action: "Updated UAE compliance settings", time: "1 hour ago", type: "config" },
    ]
  },
];

interface ContinentSuperAdminViewProps {
  activeNav?: string;
  selectedSubItem?: string;
}

const ContinentSuperAdminView = ({ activeNav = "dashboard", selectedSubItem }: ContinentSuperAdminViewProps) => {
  const navigate = useNavigate();

  const [selectedCSA, setSelectedCSA] = useState<typeof continentSuperAdmins[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [continentFilter, setContinentFilter] = useState("all");
  const [detailTab, setDetailTab] = useState("profile");
  const [showContinentDashboard, setShowContinentDashboard] = useState<string | null>(null);

  // Map sub-item id to continent config key
  const continentIdMap: Record<string, string> = {
    "csa-asia": "asia",
    "csa-africa": "africa",
    "csa-europe": "europe",
    "csa-north-america": "north_america",
    "csa-south-america": "south_america",
    "csa-australia": "oceania",
    "csa-middle-east": "middle_east"
  };

  const continentNameMap: Record<string, string> = {
    "asia": "Asia",
    "africa": "Africa",
    "europe": "Europe",
    "north_america": "North America",
    "south_america": "South America",
    "oceania": "Australia / Oceania",
    "middle_east": "Middle East"
  };

  // Handle sub-item selection from sidebar - always update when selectedSubItem changes
  useEffect(() => {
    if (selectedSubItem) {
      const continentId = continentIdMap[selectedSubItem];
      if (continentId) {
        setShowContinentDashboard(continentId);
      }
    }
  }, [selectedSubItem]);

  // Directly compute continent from selectedSubItem for immediate response
  const currentContinentId = selectedSubItem ? continentIdMap[selectedSubItem] : showContinentDashboard;

  // If any continent is selected, render the Meta Business Manager dashboard
  if (currentContinentId && CONTINENT_CONFIGS[currentContinentId]) {
    return (
      <MetaContinentDashboard 
        continentId={currentContinentId}
        continentName={continentNameMap[currentContinentId] || currentContinentId}
        onBack={() => {
          setShowContinentDashboard(null);
        }} 
      />
    );
  }

  // Stats calculations
  const totalCSAs = continentSuperAdmins.length;
  const activeCSAs = continentSuperAdmins.filter(c => c.status === "active").length;
  const lockedCSAs = 0;
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

  // Main Registry View - Left side: Only 7 CSA list
  const renderRegistryView = () => (
    <div className="h-full flex overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Left Side - ONLY the 7 Continent Super Admins List */}
      <div className="w-[380px] border-r border-slate-700/50 flex flex-col bg-slate-900/50">
        {/* Header */}
        <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Continent Super Admins</h2>
              <p className="text-sm text-slate-400">7 Global Administrators</p>
            </div>
          </div>
        </div>

        {/* The 7 CSA List - Simple & Clean */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {continentSuperAdmins.map((csa, index) => (
              <motion.div
                key={csa.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCSA(csa)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                  selectedCSA?.id === csa.id
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50"
                    : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Number Badge */}
                    <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-sm font-bold text-slate-300">
                      {index + 1}
                    </div>
                    
                    {/* Continent Icon */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${csa.color}20` }}
                    >
                      {csa.icon}
                    </div>
                    
                    {/* Name & Details */}
                    <div>
                      <h3 className="text-white font-semibold text-base">
                        {csa.continent} <span className="text-blue-400">Super Admin</span>
                      </h3>
                      <p className="text-xs text-slate-500">ID: {csa.id}</p>
                    </div>
                  </div>

                  {/* Status Dot */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className={cn(
                        "w-4 h-4 rounded-full shadow-lg",
                        csa.status === "active" && "bg-emerald-500 shadow-emerald-500/50",
                        csa.status !== "active" && "bg-slate-500 shadow-slate-500/50"
                      )} />
                      {csa.status === "active" && (
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-emerald-500 animate-ping opacity-40" />
                      )}
                    </div>
                    <ChevronRight className={cn(
                      "w-5 h-5 transition-colors",
                      selectedCSA?.id === csa.id ? "text-blue-400" : "text-slate-600"
                    )} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Summary Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/80">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Active: <span className="text-emerald-400 font-bold">{activeCSAs}</span></span>
            <span className="text-slate-500">Locked: <span className="text-slate-400 font-bold">{lockedCSAs}</span></span>
            <span className="text-slate-500">Total: <span className="text-white font-bold">{totalCSAs}</span></span>
          </div>
        </div>
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
                  <Button
                    variant="outline"
                    className="gap-2 border-slate-700"
                    onClick={() => navigate("/super-admin-system/audit")}
                  >
                    <FileText className="w-4 h-4" /> Audit Logs
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 border-slate-700"
                    onClick={() => toast.info("Full report", { description: "Generating full report...", duration: 2000 })}
                  >
                    <BarChart3 className="w-4 h-4" /> Full Report
                  </Button>
                </div>
                {selectedCSA.status === "active" ? (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                    onClick={() => toast.warning("Suspend CSA", { description: "Suspension flow not wired to backend yet.", duration: 2500 })}
                  >
                    <Pause className="w-4 h-4" /> Suspend CSA
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() => toast.success("Activate CSA", { description: "Activation flow not wired to backend yet.", duration: 2500 })}
                  >
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

  // If a continent dashboard is selected from sidebar - use Meta BM dashboard
  if (currentContinentId && CONTINENT_CONFIGS[currentContinentId]) {
    return (
      <MetaContinentDashboard 
        continentId={currentContinentId}
        continentName={continentNameMap[currentContinentId] || currentContinentId}
        onBack={() => setShowContinentDashboard(null)} 
      />
    );
  }

  // If activeNav is "admins", show the registry view with the list
  if (activeNav === "admins") {
    return renderRegistryView();
  }

  // Default: Show the Global Command Center with 7D World Map
  return (
    <GlobalCommandCenter
      onSelectContinent={(continentId) => {
        setShowContinentDashboard(continentId);
      }}
    />
  );
};

export default ContinentSuperAdminView;