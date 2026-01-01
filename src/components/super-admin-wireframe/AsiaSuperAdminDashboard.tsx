import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Globe2, Users, Building, TrendingUp, Activity, MapPin,
  ChevronRight, AlertCircle, CheckCircle, Clock, Eye,
  Target, DollarSign, UserCheck, Store, Filter, Download,
  BarChart3, PieChart, Zap, Bell, Shield, X, ArrowUpRight,
  ArrowDownRight, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Asian countries with franchise data
const asianCountries = [
  { id: "IN", name: "India", admin: "Raj Patel", status: "healthy", franchises: 45, resellers: 120, leads: 340, revenue: 2400000, lat: 20.5937, lng: 78.9629, hasFranchise: true },
  { id: "CN", name: "China", admin: "Li Wei", status: "healthy", franchises: 62, resellers: 200, leads: 520, revenue: 4500000, lat: 35.8617, lng: 104.1954, hasFranchise: true },
  { id: "JP", name: "Japan", admin: "Yuki Tanaka", status: "healthy", franchises: 28, resellers: 80, leads: 180, revenue: 3200000, lat: 36.2048, lng: 138.2529, hasFranchise: true },
  { id: "KR", name: "South Korea", admin: "Kim Min-jun", status: "healthy", franchises: 22, resellers: 55, leads: 145, revenue: 1800000, lat: 35.9078, lng: 127.7669, hasFranchise: true },
  { id: "ID", name: "Indonesia", admin: "Budi Santoso", status: "warning", franchises: 18, resellers: 45, leads: 95, revenue: 950000, lat: -0.7893, lng: 113.9213, hasFranchise: true },
  { id: "TH", name: "Thailand", admin: "Somchai Prasert", status: "healthy", franchises: 15, resellers: 40, leads: 110, revenue: 780000, lat: 15.87, lng: 100.9925, hasFranchise: true },
  { id: "VN", name: "Vietnam", admin: "Nguyen Van", status: "healthy", franchises: 12, resellers: 35, leads: 88, revenue: 620000, lat: 14.0583, lng: 108.2772, hasFranchise: true },
  { id: "PH", name: "Philippines", admin: "Jose Santos", status: "healthy", franchises: 14, resellers: 38, leads: 92, revenue: 540000, lat: 12.8797, lng: 121.774, hasFranchise: true },
  { id: "MY", name: "Malaysia", admin: "Ahmad Hassan", status: "healthy", franchises: 10, resellers: 28, leads: 75, revenue: 480000, lat: 4.2105, lng: 101.9758, hasFranchise: true },
  { id: "SG", name: "Singapore", admin: "David Tan", status: "healthy", franchises: 8, resellers: 22, leads: 60, revenue: 920000, lat: 1.3521, lng: 103.8198, hasFranchise: true },
  { id: "PK", name: "Pakistan", admin: "Ahmed Khan", status: "warning", franchises: 6, resellers: 18, leads: 45, revenue: 280000, lat: 30.3753, lng: 69.3451, hasFranchise: true },
  { id: "BD", name: "Bangladesh", admin: "Karim Rahman", status: "healthy", franchises: 5, resellers: 15, leads: 38, revenue: 180000, lat: 23.685, lng: 90.3563, hasFranchise: true },
  { id: "AE", name: "UAE", admin: "Mohammed Ali", status: "healthy", franchises: 12, resellers: 30, leads: 85, revenue: 1200000, lat: 23.4241, lng: 53.8478, hasFranchise: true },
  { id: "SA", name: "Saudi Arabia", admin: "Abdullah Saleh", status: "healthy", franchises: 9, resellers: 24, leads: 68, revenue: 980000, lat: 23.8859, lng: 45.0792, hasFranchise: true },
  { id: "MM", name: "Myanmar", admin: "Not Assigned", status: "critical", franchises: 0, resellers: 0, leads: 12, revenue: 0, lat: 21.9162, lng: 95.956, hasFranchise: false },
  { id: "NP", name: "Nepal", admin: "Not Assigned", status: "critical", franchises: 0, resellers: 2, leads: 8, revenue: 5000, lat: 28.3949, lng: 84.124, hasFranchise: false },
  { id: "LK", name: "Sri Lanka", admin: "Perera Silva", status: "warning", franchises: 3, resellers: 8, leads: 22, revenue: 85000, lat: 7.8731, lng: 80.7718, hasFranchise: true },
  { id: "KH", name: "Cambodia", admin: "Not Assigned", status: "critical", franchises: 0, resellers: 0, leads: 5, revenue: 0, lat: 12.5657, lng: 104.991, hasFranchise: false },
];

// Summary stats
const summaryStats = [
  { label: "Total Countries", value: "48", change: "+2", icon: Globe2, color: "from-blue-500 to-cyan-500" },
  { label: "Active Admins", value: "45", change: "+3", icon: UserCheck, color: "from-emerald-500 to-green-500" },
  { label: "Total Franchises", value: "269", change: "+12", icon: Building, color: "from-purple-500 to-violet-500" },
  { label: "Total Resellers", value: "760", change: "+45", icon: Store, color: "from-orange-500 to-amber-500" },
  { label: "Active Leads", value: "2,088", change: "+156", icon: Target, color: "from-pink-500 to-rose-500" },
  { label: "Revenue (Asia)", value: "₹18.9M", change: "+8.2%", icon: DollarSign, color: "from-yellow-500 to-orange-500" },
];

// Live activity feed
const liveActivities = [
  { id: 1, type: "lead", message: "New lead created in India", time: "2 min ago", country: "India" },
  { id: 2, type: "franchise", message: "Franchise onboarded in Thailand", time: "5 min ago", country: "Thailand" },
  { id: 3, type: "demo", message: "Demo activated in Japan", time: "8 min ago", country: "Japan" },
  { id: 4, type: "conversion", message: "Reseller converted in Singapore", time: "12 min ago", country: "Singapore" },
  { id: 5, type: "alert", message: "Compliance alert in Indonesia", time: "15 min ago", country: "Indonesia" },
];

interface AsiaSuperAdminDashboardProps {
  onBack?: () => void;
}

const AsiaSuperAdminDashboard = ({ onBack }: AsiaSuperAdminDashboardProps) => {
  const [selectedCountry, setSelectedCountry] = useState<typeof asianCountries[0] | null>(null);
  const [mapView, setMapView] = useState<"franchise" | "reseller" | "leads">("franchise");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCountries = useMemo(() => {
    if (statusFilter === "all") return asianCountries;
    return asianCountries.filter(c => c.status === statusFilter);
  }, [statusFilter]);

  const countriesWithFranchise = asianCountries.filter(c => c.hasFranchise).length;
  const totalFranchises = asianCountries.reduce((sum, c) => sum + c.franchises, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-emerald-500";
      case "warning": return "bg-amber-500";
      case "critical": return "bg-red-500";
      default: return "bg-slate-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy": return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Healthy</Badge>;
      case "warning": return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">Warning</Badge>;
      case "critical": return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Critical</Badge>;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
            )}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-red-500/30">
              🌏
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Asia Super Admin</h1>
              <p className="text-slate-400">CSA-ASIA-001 • Continent Scope: Asia Only</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Live Monitoring
            </Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {summaryStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br", stat.color)}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content - Map + Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asia Map */}
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe2 className="w-5 h-5 text-cyan-400" />
                    Asia Map Overview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={mapView} onValueChange={(v: any) => setMapView(v)}>
                      <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="franchise">Franchise</SelectItem>
                        <SelectItem value="reseller">Reseller</SelectItem>
                        <SelectItem value="leads">Leads</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-28 h-8 bg-slate-800 border-slate-600">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="healthy">Healthy</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Interactive Asia Map Visualization */}
                <div className="relative w-full h-[400px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50">
                  {/* Map Background Grid */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                      backgroundSize: '40px 40px'
                    }} />
                  </div>

                  {/* Asia Outline - SVG simplified representation */}
                  <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
                    {/* Asia continent simplified shape */}
                    <path
                      d="M100,50 L200,30 L350,40 L480,80 L550,150 L580,250 L550,320 L450,350 L350,340 L250,360 L150,320 L80,250 L50,150 L100,50 Z"
                      fill="rgba(59, 130, 246, 0.1)"
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Country Markers */}
                  {filteredCountries.map((country, index) => {
                    // Calculate position on map (simplified projection)
                    const x = ((country.lng - 60) / 90) * 500 + 50;
                    const y = ((45 - country.lat) / 60) * 350 + 25;
                    
                    const size = mapView === "franchise" 
                      ? Math.max(12, Math.min(40, country.franchises * 0.6))
                      : mapView === "reseller"
                      ? Math.max(12, Math.min(40, country.resellers * 0.2))
                      : Math.max(12, Math.min(40, country.leads * 0.08));

                    return (
                      <Tooltip key={country.id} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => setSelectedCountry(country)}
                            className={cn(
                              "absolute cursor-pointer rounded-full flex items-center justify-center transition-all",
                              selectedCountry?.id === country.id && "ring-4 ring-cyan-400/50"
                            )}
                            style={{
                              left: `${x}px`,
                              top: `${y}px`,
                              width: `${size}px`,
                              height: `${size}px`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <div 
                              className={cn(
                                "w-full h-full rounded-full flex items-center justify-center shadow-lg",
                                country.hasFranchise 
                                  ? country.status === "healthy" 
                                    ? "bg-emerald-500 shadow-emerald-500/50" 
                                    : country.status === "warning"
                                    ? "bg-amber-500 shadow-amber-500/50"
                                    : "bg-red-500 shadow-red-500/50"
                                  : "bg-slate-600 shadow-slate-500/30"
                              )}
                            >
                              {country.hasFranchise && (
                                <Building className="w-3 h-3 text-white" />
                              )}
                            </div>
                            {country.hasFranchise && country.status === "healthy" && (
                              <motion.div
                                className="absolute inset-0 rounded-full bg-emerald-500/30"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-800 border-slate-600">
                          <div className="p-2 space-y-1">
                            <p className="font-bold text-white">{country.name}</p>
                            <p className="text-xs text-slate-400">Admin: {country.admin}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-emerald-400">{country.franchises} Franchises</span>
                              <span className="text-blue-400">{country.resellers} Resellers</span>
                            </div>
                            <p className="text-xs text-amber-400">{country.leads} Active Leads</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                    <p className="text-xs font-medium text-white mb-2">Legend</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs text-slate-300">Healthy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-xs text-slate-300">Warning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-slate-300">Critical</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-600" />
                        <span className="text-xs text-slate-300">No Franchise</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                    <p className="text-xs font-medium text-white mb-2">Quick Stats</p>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-300">
                        <span className="text-emerald-400 font-bold">{countriesWithFranchise}</span> Countries with Franchise
                      </p>
                      <p className="text-xs text-slate-300">
                        <span className="text-cyan-400 font-bold">{totalFranchises}</span> Total Franchises
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Country Detail / Live Activity */}
            <div className="space-y-6">
              {/* Selected Country Detail */}
              <AnimatePresence mode="wait">
                {selectedCountry ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-cyan-400" />
                            {selectedCountry.name}
                          </CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedCountry(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Status</span>
                          {getStatusBadge(selectedCountry.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Country Admin</span>
                          <span className="text-sm font-medium text-white">{selectedCountry.admin}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-emerald-400">{selectedCountry.franchises}</p>
                            <p className="text-xs text-slate-400">Franchises</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-blue-400">{selectedCountry.resellers}</p>
                            <p className="text-xs text-slate-400">Resellers</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-amber-400">{selectedCountry.leads}</p>
                            <p className="text-xs text-slate-400">Active Leads</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-purple-400">₹{(selectedCountry.revenue / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-slate-400">Revenue</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">View Admin</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-700/50">
                      <CardContent className="p-6 text-center">
                        <Globe2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">Click on a country marker to view details</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Live Activity Feed */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white text-sm">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Live Activity
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {liveActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                            activity.type === "lead" && "bg-blue-500",
                            activity.type === "franchise" && "bg-emerald-500",
                            activity.type === "demo" && "bg-purple-500",
                            activity.type === "conversion" && "bg-amber-500",
                            activity.type === "alert" && "bg-red-500"
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{activity.message}</p>
                            <p className="text-[10px] text-slate-500">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Countries Table */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Building className="w-5 h-5 text-purple-400" />
                Countries Overview (Asia)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">Country</th>
                      <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">Admin</th>
                      <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">Status</th>
                      <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Franchises</th>
                      <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Resellers</th>
                      <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Leads</th>
                      <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Revenue</th>
                      <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCountries.slice(0, 10).map((country, index) => (
                      <motion.tr
                        key={country.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedCountry(country)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", getStatusColor(country.status))} />
                            <span className="text-sm font-medium text-white">{country.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">{country.admin}</td>
                        <td className="py-3 px-4">{getStatusBadge(country.status)}</td>
                        <td className="py-3 px-4 text-right text-sm text-emerald-400 font-medium">{country.franchises}</td>
                        <td className="py-3 px-4 text-right text-sm text-blue-400 font-medium">{country.resellers}</td>
                        <td className="py-3 px-4 text-right text-sm text-amber-400 font-medium">{country.leads}</td>
                        <td className="py-3 px-4 text-right text-sm text-purple-400 font-medium">₹{(country.revenue / 1000).toFixed(0)}K</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AsiaSuperAdminDashboard;
