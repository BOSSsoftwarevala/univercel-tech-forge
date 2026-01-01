import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Globe2, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, Key, ChevronRight, X,
  CheckCircle, AlertTriangle, Search, Filter, RefreshCw,
  ThumbsUp, ThumbsDown, FileText, Users, Zap, 
  TrendingUp, Bell, CircleDot, Wifi, Server, BarChart3,
  ArrowUpRight, ArrowDownRight, Radio, Satellite, Signal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from "react-simple-maps";

// World map topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// All 7 Continent Admins with enhanced data
const continentAdmins = [
  {
    id: "csa-001",
    continent: "Africa",
    code: "AF",
    adminName: "Victoria Mensah",
    email: "v.mensah@system.com",
    status: "active" as const,
    statusColor: "bg-emerald-500",
    countries: 54,
    managers: 12,
    traffic: 24500,
    trafficChange: 12.5,
    coordinates: [20, 0] as [number, number],
    color: "#f59e0b",
    lastActive: "2 min ago",
    uptime: 99.8,
  },
  {
    id: "csa-002",
    continent: "Asia",
    code: "AS",
    adminName: "Chen Wei",
    email: "c.wei@system.com",
    status: "active" as const,
    statusColor: "bg-emerald-500",
    countries: 48,
    managers: 18,
    traffic: 89200,
    trafficChange: 8.2,
    coordinates: [100, 35] as [number, number],
    color: "#ef4444",
    lastActive: "5 min ago",
    uptime: 99.9,
  },
  {
    id: "csa-003",
    continent: "Europe",
    code: "EU",
    adminName: "Hans Mueller",
    email: "h.mueller@system.com",
    status: "active" as const,
    statusColor: "bg-emerald-500",
    countries: 44,
    managers: 22,
    traffic: 67800,
    trafficChange: -2.1,
    coordinates: [15, 50] as [number, number],
    color: "#3b82f6",
    lastActive: "15 min ago",
    uptime: 99.7,
  },
  {
    id: "csa-004",
    continent: "North America",
    code: "NA",
    adminName: "James Wilson",
    email: "j.wilson@system.com",
    status: "active" as const,
    statusColor: "bg-emerald-500",
    countries: 23,
    managers: 8,
    traffic: 45300,
    trafficChange: 5.8,
    coordinates: [-100, 40] as [number, number],
    color: "#10b981",
    lastActive: "30 min ago",
    uptime: 99.5,
  },
  {
    id: "csa-005",
    continent: "South America",
    code: "SA",
    adminName: "Carlos Rodriguez",
    email: "c.rodriguez@system.com",
    status: "suspended" as const,
    statusColor: "bg-yellow-500",
    countries: 12,
    managers: 6,
    traffic: 18900,
    trafficChange: -5.2,
    coordinates: [-60, -15] as [number, number],
    color: "#84cc16",
    lastActive: "3 days ago",
    uptime: 0,
  },
  {
    id: "csa-006",
    continent: "Australia/Oceania",
    code: "OC",
    adminName: "Sarah Mitchell",
    email: "s.mitchell@system.com",
    status: "active" as const,
    statusColor: "bg-emerald-500",
    countries: 14,
    managers: 4,
    traffic: 12400,
    trafficChange: 3.4,
    coordinates: [135, -25] as [number, number],
    color: "#8b5cf6",
    lastActive: "1 hour ago",
    uptime: 99.6,
  },
  {
    id: "csa-007",
    continent: "Antarctica",
    code: "AN",
    adminName: "Dr. Erik Larsen",
    email: "e.larsen@system.com",
    status: "inactive" as const,
    statusColor: "bg-red-500",
    countries: 0,
    managers: 1,
    traffic: 450,
    trafficChange: 0,
    coordinates: [0, -80] as [number, number],
    color: "#06b6d4",
    lastActive: "Offline",
    uptime: 0,
  },
];

// Live activity data
const liveActivities = [
  { id: 1, continent: "Asia", action: "New franchise approved", time: "Just now", type: "success" },
  { id: 2, continent: "Europe", action: "Withdrawal processed", time: "2 min ago", type: "info" },
  { id: 3, continent: "Africa", action: "User suspended", time: "5 min ago", type: "warning" },
  { id: 4, continent: "North America", action: "Server scaling triggered", time: "8 min ago", type: "info" },
  { id: 5, continent: "Asia", action: "KYC verification completed", time: "12 min ago", type: "success" },
  { id: 6, continent: "Europe", action: "High traffic alert", time: "15 min ago", type: "warning" },
  { id: 7, continent: "Australia/Oceania", action: "New country added", time: "20 min ago", type: "success" },
  { id: 8, continent: "South America", action: "Admin suspended", time: "3 days ago", type: "error" },
];

// Traffic data points for visualization
const trafficData = [
  { time: "00:00", value: 45000 },
  { time: "04:00", value: 32000 },
  { time: "08:00", value: 78000 },
  { time: "12:00", value: 125000 },
  { time: "16:00", value: 98000 },
  { time: "20:00", value: 156000 },
  { time: "Now", value: 189000 },
];

const ContinentSuperAdminView = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<typeof continentAdmins[0] | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Animate pulse effect on markers
  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        setPulseIndex((prev) => (prev + 1) % continentAdmins.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const totalTraffic = continentAdmins.reduce((sum, a) => sum + a.traffic, 0);
  const activeAdmins = continentAdmins.filter(a => a.status === "active").length;
  const totalCountries = continentAdmins.reduce((sum, a) => sum + a.countries, 0);
  const totalManagers = continentAdmins.reduce((sum, a) => sum + a.managers, 0);

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500 shadow-emerald-500/50";
      case "suspended":
        return "bg-yellow-500 shadow-yellow-500/50";
      case "inactive":
        return "bg-red-500 shadow-red-500/50";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Main Dashboard */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/30 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                <Globe2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Continent Boss Dashboard</h1>
                <p className="text-blue-400/80 text-sm">Global Operations • 7 Continents</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isLiveMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={cn(
                  "gap-2",
                  isLiveMode && "bg-emerald-500 hover:bg-emerald-600"
                )}
              >
                <Radio className={cn("w-4 h-4", isLiveMode && "animate-pulse")} />
                Live Mode
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Sync All
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-400/80 uppercase tracking-wider">Total Continents</p>
                      <p className="text-3xl font-bold text-blue-400 mt-1">7</p>
                    </div>
                    <Globe2 className="w-10 h-10 text-blue-400/20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-400/80 uppercase tracking-wider">Active Admins</p>
                      <p className="text-3xl font-bold text-emerald-400 mt-1">{activeAdmins}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-emerald-400/20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-400/80 uppercase tracking-wider">Countries</p>
                      <p className="text-3xl font-bold text-purple-400 mt-1">{totalCountries}</p>
                    </div>
                    <MapPin className="w-10 h-10 text-purple-400/20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border-cyan-500/30 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-cyan-400/80 uppercase tracking-wider">Total Managers</p>
                      <p className="text-3xl font-bold text-cyan-400 mt-1">{totalManagers}</p>
                    </div>
                    <Users className="w-10 h-10 text-cyan-400/20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-amber-400/80 uppercase tracking-wider">Global Traffic</p>
                      <p className="text-3xl font-bold text-amber-400 mt-1">{(totalTraffic / 1000).toFixed(1)}K</p>
                    </div>
                    <Activity className="w-10 h-10 text-amber-400/20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* World Map & Admin Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* World Map */}
              <Card className="col-span-2 bg-slate-900/80 border-slate-700/50 backdrop-blur overflow-hidden">
                <CardHeader className="pb-2 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <Satellite className="w-5 h-5 text-blue-400" />
                      Global Network Map
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Suspended
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Inactive
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative">
                  <div className="relative h-[400px] bg-gradient-to-b from-slate-900 to-slate-950">
                    {/* Grid overlay effect */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
                      backgroundSize: '50px 50px'
                    }} />
                    
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{
                        scale: 140,
                        center: [0, 20]
                      }}
                      className="w-full h-full"
                    >
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#1e293b"
                              stroke="#334155"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: 'none' },
                                hover: { fill: '#334155', outline: 'none' },
                                pressed: { outline: 'none' }
                              }}
                            />
                          ))
                        }
                      </Geographies>
                      
                      {/* Connection lines between continents */}
                      {continentAdmins.slice(0, -1).map((admin, i) => {
                        const next = continentAdmins[(i + 1) % (continentAdmins.length - 1)];
                        return (
                          <Line
                            key={`line-${i}`}
                            from={admin.coordinates}
                            to={next.coordinates}
                            stroke="rgba(59, 130, 246, 0.2)"
                            strokeWidth={1}
                            strokeLinecap="round"
                          />
                        );
                      })}
                      
                      {/* Continent markers */}
                      {continentAdmins.map((admin, index) => (
                        <Marker
                          key={admin.id}
                          coordinates={admin.coordinates}
                          onClick={() => setSelectedAdmin(admin)}
                        >
                          <g className="cursor-pointer">
                            {/* Pulse ring for active */}
                            {admin.status === "active" && isLiveMode && (
                              <circle
                                r={pulseIndex === index ? 20 : 15}
                                fill="none"
                                stroke={admin.color}
                                strokeWidth={1}
                                opacity={pulseIndex === index ? 0.8 : 0.3}
                                className="transition-all duration-1000"
                              />
                            )}
                            {/* Main circle */}
                            <circle
                              r={12}
                              fill={admin.status === "active" ? admin.color : admin.status === "suspended" ? "#eab308" : "#ef4444"}
                              stroke="#0f172a"
                              strokeWidth={3}
                              className="drop-shadow-lg"
                            />
                            {/* Status indicator */}
                            <circle
                              r={4}
                              cy={-8}
                              cx={8}
                              fill={admin.status === "active" ? "#22c55e" : admin.status === "suspended" ? "#eab308" : "#ef4444"}
                              stroke="#0f172a"
                              strokeWidth={2}
                            />
                            {/* Label */}
                            <text
                              textAnchor="middle"
                              y={30}
                              className="fill-slate-300 text-[10px] font-medium"
                            >
                              {admin.code}
                            </text>
                          </g>
                        </Marker>
                      ))}
                    </ComposableMap>

                    {/* Traffic indicators */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      {trafficData.map((data, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t opacity-60"
                            style={{ height: `${(data.value / 200000) * 60}px` }}
                          />
                          <span className="text-[9px] text-slate-500 mt-1">{data.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 7 Continent Admins List */}
              <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur">
                <CardHeader className="pb-3 border-b border-slate-700/50">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-purple-400" />
                    Continent Admins
                    <Badge variant="outline" className="ml-auto text-xs">
                      7 Total
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[370px]">
                    <div className="p-3 space-y-2">
                      {continentAdmins.map((admin) => (
                        <motion.div
                          key={admin.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAdmin(admin)}
                          className={cn(
                            "p-3 rounded-xl border cursor-pointer transition-all duration-200",
                            selectedAdmin?.id === admin.id
                              ? "bg-blue-500/20 border-blue-500/50"
                              : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {/* Status Dot */}
                            <div className="relative">
                              <div 
                                className={cn(
                                  "w-3 h-3 rounded-full shadow-lg",
                                  getStatusDot(admin.status)
                                )}
                              />
                              {admin.status === "active" && isLiveMode && (
                                <div className={cn(
                                  "absolute inset-0 w-3 h-3 rounded-full animate-ping",
                                  admin.statusColor
                                )} />
                              )}
                            </div>
                            
                            {/* Admin Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {admin.continent}
                                </h4>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-[10px] capitalize",
                                    admin.status === "active" && "text-emerald-400 border-emerald-500/50",
                                    admin.status === "suspended" && "text-yellow-400 border-yellow-500/50",
                                    admin.status === "inactive" && "text-red-400 border-red-500/50"
                                  )}
                                >
                                  {admin.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-400 truncate">{admin.adminName}</p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                                <span>{admin.countries} countries</span>
                                <span>{admin.managers} managers</span>
                              </div>
                            </div>
                            
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Live Activity & Traffic */}
            <div className="grid grid-cols-2 gap-6">
              {/* Live Activity Feed */}
              <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur">
                <CardHeader className="pb-3 border-b border-slate-700/50">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                    Live Activity
                    {isLiveMode && (
                      <span className="ml-2 flex items-center gap-1 text-xs text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[220px]">
                    <div className="p-4 space-y-3">
                      {liveActivities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/30"
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-2",
                            activity.type === "success" && "bg-emerald-500",
                            activity.type === "info" && "bg-blue-500",
                            activity.type === "warning" && "bg-yellow-500",
                            activity.type === "error" && "bg-red-500"
                          )} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white">{activity.action}</span>
                              <span className="text-[10px] text-slate-500">{activity.time}</span>
                            </div>
                            <span className="text-xs text-slate-400">{activity.continent}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Global Traffic Stats */}
              <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur">
                <CardHeader className="pb-3 border-b border-slate-700/50">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Traffic by Continent
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {continentAdmins.slice(0, 6).map((admin) => (
                      <div key={admin.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{admin.continent}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{(admin.traffic / 1000).toFixed(1)}K</span>
                            <span className={cn(
                              "text-xs flex items-center",
                              admin.trafficChange >= 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                              {admin.trafficChange >= 0 ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {Math.abs(admin.trafficChange)}%
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={(admin.traffic / 100000) * 100} 
                          className="h-2 bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedAdmin && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[380px] bg-slate-900 border-l border-slate-700/50 flex flex-col shadow-2xl"
          >
            {/* Panel Header */}
            <div 
              className="p-5 border-b border-slate-700/50"
              style={{ background: `linear-gradient(135deg, ${selectedAdmin.color}20, transparent)` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedAdmin.color}30` }}
                  >
                    <Globe2 className="w-6 h-6" style={{ color: selectedAdmin.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedAdmin.continent}</h3>
                    <p className="text-sm text-slate-400">{selectedAdmin.adminName}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAdmin(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-5 space-y-6">
                {/* Status Card */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-400">Status</span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-3 h-3 rounded-full",
                          getStatusDot(selectedAdmin.status)
                        )} />
                        <span className={cn(
                          "text-sm font-medium capitalize",
                          selectedAdmin.status === "active" && "text-emerald-400",
                          selectedAdmin.status === "suspended" && "text-yellow-400",
                          selectedAdmin.status === "inactive" && "text-red-400"
                        )}>
                          {selectedAdmin.status}
                        </span>
                      </div>
                    </div>
                    <Separator className="bg-slate-700/50 mb-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Countries</p>
                        <p className="text-xl font-bold text-white">{selectedAdmin.countries}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Managers</p>
                        <p className="text-xl font-bold text-white">{selectedAdmin.managers}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Traffic</p>
                        <p className="text-xl font-bold text-white">{(selectedAdmin.traffic / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Uptime</p>
                        <p className="text-xl font-bold text-white">{selectedAdmin.uptime}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Contact
                  </h4>
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Email</span>
                        <span className="text-slate-300">{selectedAdmin.email}</span>
                      </div>
                      <Separator className="bg-slate-700/50" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Last Active</span>
                        <span className="text-slate-300">{selectedAdmin.lastActive}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2 border-slate-700 bg-slate-800/50">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 border-slate-700 bg-slate-800/50">
                      <Activity className="w-4 h-4" />
                      Activity Log
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start gap-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Suspend
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Lock className="w-4 h-4" />
                      Lock Access
                    </Button>
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
