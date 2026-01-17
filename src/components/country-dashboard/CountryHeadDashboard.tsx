import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import {
  MapPin, Users, Building2, TrendingUp, TrendingDown, Activity, AlertTriangle,
  Clock, CheckCircle2, X, Eye, RotateCcw, Send, Pause, RefreshCw, Minus,
  FileWarning, Calendar, Zap, Server, Lock, Shield, Store, Target, DollarSign,
  ChevronLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  CountryConfig, RegionData, CountryEntity, CountryActionKPI, 
  MARKER_COLORS, generateCountryEntities, countryConfigs 
} from "./types";
import CountryHeadSidebar, { CountryHeadSection } from "./CountryHeadSidebar";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryHeadDashboardProps {
  countryCode: string;
  onBack?: () => void;
}

const CountryHeadDashboard = ({ countryCode, onBack }: CountryHeadDashboardProps) => {
  const config = countryConfigs[countryCode] || countryConfigs.IN;
  
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<CountryEntity | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<CountryHeadSection>("dashboard");
  
  const entities = useMemo(() => generateCountryEntities(config.regions), [config.regions]);
  
  // 12 Action KPI Boxes for Country Head
  const actionKPIs: CountryActionKPI[] = useMemo(() => [
    { 
      id: "pending_approvals", 
      title: "Pending Approvals", 
      count: config.regions.reduce((sum, r) => sum + r.pendingApprovals, 0), 
      icon: Clock, 
      color: "from-amber-500 to-orange-500", 
      trend: "up",
      source: "system",
      lastUpdate: "2 min ago" 
    },
    { 
      id: "active_franchises", 
      title: "Active Franchises", 
      count: config.regions.reduce((sum, r) => sum + r.franchises, 0), 
      icon: Building2, 
      color: "from-emerald-500 to-green-500", 
      trend: "up",
      source: "system",
      lastUpdate: "Just now" 
    },
    { 
      id: "active_resellers", 
      title: "Active Resellers", 
      count: config.regions.reduce((sum, r) => sum + r.resellers, 0), 
      icon: Store, 
      color: "from-blue-500 to-cyan-500", 
      trend: "stable",
      source: "system",
      lastUpdate: "5 min ago" 
    },
    { 
      id: "influencers", 
      title: "Influencers", 
      count: config.regions.reduce((sum, r) => sum + r.influencers, 0), 
      icon: Target, 
      color: "from-purple-500 to-violet-500", 
      trend: "up",
      source: "system",
      lastUpdate: "10 min ago" 
    },
    { 
      id: "open_issues", 
      title: "Open Issues", 
      count: config.regions.reduce((sum, r) => sum + r.openIssues, 0), 
      icon: AlertTriangle, 
      color: "from-red-500 to-rose-500", 
      trend: "down",
      source: "ai",
      lastUpdate: "3 min ago" 
    },
    { 
      id: "escalations", 
      title: "Escalations", 
      count: Math.floor(Math.random() * 5) + 1, 
      icon: FileWarning, 
      color: "from-orange-600 to-red-500", 
      trend: "stable",
      source: "human",
      lastUpdate: "15 min ago" 
    },
    { 
      id: "payment_pending", 
      title: "Payment Pending", 
      count: Math.floor(Math.random() * 10) + 3, 
      icon: DollarSign, 
      color: "from-yellow-500 to-amber-500", 
      trend: "up",
      source: "system",
      lastUpdate: "30 min ago" 
    },
    { 
      id: "renewals_due", 
      title: "Renewals Due", 
      count: Math.floor(Math.random() * 8) + 2, 
      icon: Calendar, 
      color: "from-teal-500 to-cyan-500", 
      trend: "stable",
      source: "system",
      lastUpdate: "1 hour ago" 
    },
    { 
      id: "performance_score", 
      title: "Performance Score", 
      count: Math.round(config.regions.reduce((sum, r) => sum + r.performance, 0) / config.regions.length), 
      icon: TrendingUp, 
      color: "from-emerald-600 to-green-500", 
      trend: "up",
      source: "ai",
      lastUpdate: "5 min ago" 
    },
    { 
      id: "user_activity", 
      title: "User Activity", 
      count: Math.floor(Math.random() * 500) + 200, 
      icon: Activity, 
      color: "from-indigo-500 to-blue-500", 
      trend: "up",
      source: "system",
      lastUpdate: "1 min ago" 
    },
    { 
      id: "security_alerts", 
      title: "Security Alerts", 
      count: Math.floor(Math.random() * 3), 
      icon: Lock, 
      color: "from-rose-600 to-red-500", 
      trend: "down",
      source: "ai",
      lastUpdate: "2 hours ago" 
    },
    { 
      id: "compliance_status", 
      title: "Compliance Status", 
      count: 95, 
      icon: Shield, 
      color: "from-green-500 to-emerald-500", 
      trend: "stable",
      source: "system",
      lastUpdate: "Today" 
    },
  ], [config.regions]);

  const getMarkerColor = (entity: CountryEntity): string => {
    if (entity.type === "issue") return MARKER_COLORS.issue;
    if (entity.type === "influencer") return MARKER_COLORS.influencer;
    if (entity.type === "reseller") return MARKER_COLORS.reseller_active;
    if (entity.status === "pending") return MARKER_COLORS.franchise_pending;
    return MARKER_COLORS.franchise_active;
  };

  const getRegionColor = (region: RegionData): string => {
    if (region.status === "critical" || region.openIssues > 2) return MARKER_COLORS.region_critical;
    if (region.status === "warning" || region.status === "maintenance") return MARKER_COLORS.region_warning;
    return MARKER_COLORS.region_healthy;
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Dashboard data refreshed");
  }, []);

  const handleAction = useCallback(async (actionType: string, targetId: string, targetType: string, reason?: string) => {
    try {
      await supabase.from('audit_logs').insert([{
        action: `country_${targetType}_${actionType}`,
        module: 'country_head_dashboard',
        meta_json: { 
          target_id: targetId,
          target_type: targetType,
          country: config.name,
          action: actionType,
          reason: reason || null,
          timestamp: new Date().toISOString()
        }
      }]);
      
      toast.success(`Action "${actionType}" executed successfully`);
      setSelectedRegion(null);
      setSelectedEntity(null);
    } catch (error) {
      toast.error("Failed to execute action");
    }
  }, [config.name]);

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-slate-400" />;
  };

  const getSourceBadge = (source: "human" | "ai" | "system") => {
    const colors = {
      human: "bg-blue-500/20 text-blue-400",
      ai: "bg-purple-500/20 text-purple-400",
      system: "bg-slate-500/20 text-slate-400"
    };
    return <span className={cn("text-[8px] px-1 py-0.5 rounded", colors[source])}>{source.toUpperCase()}</span>;
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-950 via-cyan-950/10 to-slate-950">
      {/* Left Sidebar - Country Scoped */}
      <CountryHeadSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        countryName={config.name}
        countryFlag={config.flag}
        themeGradient={config.themeGradient}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl",
              config.themeGradient
            )}>
              {config.flag}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{config.name} Live Map</h1>
              <p className="text-sm text-slate-400">{config.continent} • Country Head Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
              COUNTRY SCOPE
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 border-slate-600"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* 12 KPI Action Boxes */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {actionKPIs.map((kpi) => (
              <motion.div
                key={kpi.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => toast.info(`Viewing ${kpi.title}`)}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/30 transition-all h-full">
                  <CardContent className="p-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mb-1 bg-gradient-to-br",
                      kpi.color
                    )}>
                      <kpi.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <p className={cn(
                        "text-lg font-bold",
                        kpi.count > 0 ? "text-white" : "text-slate-500"
                      )}>
                        {kpi.id === "performance_score" || kpi.id === "compliance_status" 
                          ? `${kpi.count}%` 
                          : kpi.count}
                      </p>
                      {getTrendIcon(kpi.trend)}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{kpi.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[8px] text-slate-500">{kpi.lastUpdate}</p>
                      {getSourceBadge(kpi.source)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content: Map + Detail Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center: Live Country Map */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: config.mapZoom * 150,
                  center: config.mapCenter
                }}
                className="w-full h-full"
              >
                <ZoomableGroup zoom={1} center={config.mapCenter}>
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
                            default: { outline: "none" },
                            hover: { fill: "#334155", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  
                  {/* Region Markers */}
                  {config.regions.map((region) => (
                    <Marker 
                      key={region.id} 
                      coordinates={[region.lng, region.lat]}
                      onClick={() => setSelectedRegion(region)}
                    >
                      <motion.g
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.3 }}
                        className="cursor-pointer"
                      >
                        <circle
                          r={12}
                          fill={getRegionColor(region)}
                          stroke="#fff"
                          strokeWidth={2}
                          opacity={0.8}
                        />
                        <text
                          textAnchor="middle"
                          y={4}
                          style={{ fontSize: 8, fill: "#fff", fontWeight: "bold" }}
                        >
                          {region.franchises}
                        </text>
                        {/* Pulse animation for active regions */}
                        <motion.circle
                          r={12}
                          fill="transparent"
                          stroke={getRegionColor(region)}
                          strokeWidth={2}
                          animate={{ r: [12, 20, 12], opacity: [0.8, 0, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.g>
                    </Marker>
                  ))}
                  
                  {/* Entity Markers */}
                  {entities.map((entity) => (
                    <Marker 
                      key={entity.id} 
                      coordinates={[entity.lng, entity.lat]}
                      onClick={() => setSelectedEntity(entity)}
                    >
                      <motion.g
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.3 }}
                        className="cursor-pointer"
                      >
                        <circle
                          r={entity.type === "issue" ? 6 : 4}
                          fill={getMarkerColor(entity)}
                          stroke="#fff"
                          strokeWidth={1}
                          opacity={0.9}
                        />
                        {entity.openIssues > 0 && entity.type !== "issue" && (
                          <circle
                            r={3}
                            cx={4}
                            cy={-4}
                            fill="#ef4444"
                            stroke="#fff"
                            strokeWidth={0.5}
                          />
                        )}
                      </motion.g>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs font-medium text-white mb-2">Legend</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MARKER_COLORS.region_healthy }} />
                  <span className="text-xs text-slate-300">Region (Healthy)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.franchise_active }} />
                  <span className="text-xs text-slate-300">Franchise</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.reseller_active }} />
                  <span className="text-xs text-slate-300">Reseller</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.influencer }} />
                  <span className="text-xs text-slate-300">Influencer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.issue }} />
                  <span className="text-xs text-slate-300">Issue / Alert</span>
                </div>
              </div>
            </div>

            {/* Country Stats Overlay */}
            <div className="absolute top-4 right-4 bg-slate-900/90 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs font-medium text-white mb-2">{config.name} Overview</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Regions</p>
                  <p className="font-bold text-white">{config.regions.length}</p>
                </div>
                <div>
                  <p className="text-slate-400">Franchises</p>
                  <p className="font-bold text-emerald-400">{config.regions.reduce((s, r) => s + r.franchises, 0)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Resellers</p>
                  <p className="font-bold text-blue-400">{config.regions.reduce((s, r) => s + r.resellers, 0)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Influencers</p>
                  <p className="font-bold text-orange-400">{config.regions.reduce((s, r) => s + r.influencers, 0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Region/Entity Detail Panel */}
          <AnimatePresence>
            {(selectedRegion || selectedEntity) && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-80 border-l border-slate-700/50 bg-slate-900/95 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                  <h3 className="font-semibold text-white">
                    {selectedRegion ? "Region Details" : "Entity Details"}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setSelectedRegion(null);
                      setSelectedEntity(null);
                    }}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <ScrollArea className="h-[calc(100%-60px)]">
                  <div className="p-4 space-y-4">
                    {selectedRegion && (
                      <>
                        {/* Region Info */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              selectedRegion.status === "active" ? "bg-emerald-500/20" : "bg-amber-500/20"
                            )}>
                              <MapPin className={cn(
                                "w-5 h-5",
                                selectedRegion.status === "active" ? "text-emerald-400" : "text-amber-400"
                              )} />
                            </div>
                            <div>
                              <p className="font-medium text-white">{selectedRegion.name}</p>
                              <Badge className={cn(
                                "capitalize text-xs",
                                selectedRegion.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                              )}>
                                {selectedRegion.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2 rounded-lg bg-slate-800/50">
                              <p className="text-xs text-slate-400">Cities</p>
                              <p className="text-lg font-bold text-white">{selectedRegion.cities}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-800/50">
                              <p className="text-xs text-slate-400">Managers</p>
                              <p className="text-lg font-bold text-white">{selectedRegion.managers}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-800/50">
                              <p className="text-xs text-slate-400">Franchises</p>
                              <p className="text-lg font-bold text-emerald-400">{selectedRegion.franchises}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-800/50">
                              <p className="text-xs text-slate-400">Resellers</p>
                              <p className="text-lg font-bold text-blue-400">{selectedRegion.resellers}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-800/50">
                              <p className="text-xs text-slate-400">Performance</p>
                              <p className="text-lg font-bold text-white">{selectedRegion.performance}%</p>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-800/50">
                              <p className="text-xs text-slate-400">Revenue</p>
                              <p className="text-lg font-bold text-green-400">${(selectedRegion.revenue / 1000000).toFixed(1)}M</p>
                            </div>
                          </div>
                          
                          {selectedRegion.pendingApprovals > 0 && (
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                              <p className="text-sm text-amber-400">
                                {selectedRegion.pendingApprovals} pending approvals
                              </p>
                            </div>
                          )}
                          
                          {selectedRegion.openIssues > 0 && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                              <p className="text-sm text-red-400">
                                {selectedRegion.openIssues} open issues
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Region Actions */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-400 uppercase">Actions</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                              onClick={() => handleAction("approve", selectedRegion.id, "region")}
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve All
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-cyan-500/50 text-cyan-400 gap-1"
                              onClick={() => handleAction("view", selectedRegion.id, "region")}
                            >
                              <Eye className="w-3 h-3" /> View Details
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-amber-500/50 text-amber-400 gap-1"
                              onClick={() => handleAction("suspend", selectedRegion.id, "region")}
                            >
                              <Pause className="w-3 h-3" /> Suspend
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-orange-500/50 text-orange-400 gap-1"
                              onClick={() => handleAction("escalate", selectedRegion.id, "region")}
                            >
                              <Send className="w-3 h-3" /> Escalate
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedEntity && (
                      <>
                        {/* Entity Info */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-400">Name</p>
                            <p className="font-medium text-white">{selectedEntity.name}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-slate-400">Type</p>
                              <Badge className={cn(
                                "capitalize",
                                selectedEntity.type === "franchise" ? "bg-emerald-500/20 text-emerald-400" :
                                selectedEntity.type === "reseller" ? "bg-blue-500/20 text-blue-400" :
                                selectedEntity.type === "influencer" ? "bg-orange-500/20 text-orange-400" :
                                "bg-red-500/20 text-red-400"
                              )}>
                                {selectedEntity.type}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Status</p>
                              <Badge className={cn(
                                "capitalize",
                                selectedEntity.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                                selectedEntity.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                                selectedEntity.status === "warning" ? "bg-orange-500/20 text-orange-400" :
                                "bg-red-500/20 text-red-400"
                              )}>
                                {selectedEntity.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-slate-400">City</p>
                              <p className="text-sm text-white">{selectedEntity.city}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Region</p>
                              <p className="text-sm text-white">{selectedEntity.region}</p>
                            </div>
                          </div>
                          {selectedEntity.type !== "issue" && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-slate-400">Revenue</p>
                                <p className="text-sm font-bold text-emerald-400">
                                  ${(selectedEntity.revenue / 1000).toFixed(0)}K
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Last Activity</p>
                                <p className="text-sm text-white">{selectedEntity.lastActivity}</p>
                              </div>
                            </div>
                          )}
                          {selectedEntity.openIssues > 0 && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                              <p className="text-sm text-red-400">
                                {selectedEntity.openIssues} open issue{selectedEntity.openIssues > 1 ? "s" : ""}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Entity Actions */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-400 uppercase">Actions</p>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedEntity.status === "pending" && (
                              <Button 
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                                onClick={() => handleAction("approve", selectedEntity.id, "entity")}
                              >
                                <CheckCircle2 className="w-3 h-3" /> Approve
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-cyan-500/50 text-cyan-400 gap-1"
                              onClick={() => handleAction("review", selectedEntity.id, "entity")}
                            >
                              <Eye className="w-3 h-3" /> Review
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-amber-500/50 text-amber-400 gap-1"
                              onClick={() => handleAction("suspend", selectedEntity.id, "entity")}
                            >
                              <Pause className="w-3 h-3" /> Suspend
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-rose-500/50 text-rose-400 gap-1"
                              onClick={() => handleAction("reject", selectedEntity.id, "entity")}
                            >
                              <X className="w-3 h-3" /> Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-slate-500/50 text-slate-400 gap-1"
                              onClick={() => handleAction("sendback", selectedEntity.id, "entity")}
                            >
                              <RotateCcw className="w-3 h-3" /> Send Back
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-orange-500/50 text-orange-400 gap-1"
                              onClick={() => handleAction("escalate", selectedEntity.id, "entity")}
                            >
                              <Send className="w-3 h-3" /> Escalate
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CountryHeadDashboard;
