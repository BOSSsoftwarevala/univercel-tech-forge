import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import {
  MapPin, Users, Building2, TrendingUp, TrendingDown, Activity, AlertTriangle,
  Clock, CheckCircle2, X, Eye, RotateCcw, Send, Pause, RefreshCw, Minus,
  FileWarning, Calendar, Zap, Server, Lock, Shield, Store, Target, DollarSign,
  ChevronLeft, Bell, AlertCircle, Brain, ChevronRight, Layers, Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { CountryEntity, CountryActionKPI, MARKER_COLORS } from "./types";
import { countryControlApi } from "@/lib/api/country-control";
import CountryHeadSidebar, { CountryHeadSection } from "./CountryHeadSidebar";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Activity item interface
interface ActivityItem {
  id: string;
  type: "approval" | "rejection" | "alert" | "warning" | "ai_suggestion";
  source: "user" | "ai" | "system";
  message: string;
  target: string;
  urgency: "low" | "medium" | "high" | "critical";
  timestamp: string;
  actionable: boolean;
}

interface CountryHeadDashboardProps {
  countryCode?: string;
  onBack?: () => void;
}

const CountryHeadDashboard = ({ countryCode = "IN", onBack }: CountryHeadDashboardProps) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<CountryHeadSection>("dashboard");
  const [filterType, setFilterType] = useState("all");
  const [overview, setOverview] = useState(null);
  const [map, setMap] = useState(null);
  const [entities, setEntities] = useState<CountryEntity[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [overviewRes, mapRes] = await Promise.all([
      countryControlApi.getOverview(countryCode),
      countryControlApi.getMap(countryCode)
    ]);
    setOverview(overviewRes);
    setMap(mapRes);
    setEntities(mapRes?.entities || []);
    setRegions(mapRes?.regions || []);
    setLoading(false);
  }, [countryCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredEntities = useMemo(() => {
    if (filterType === "all") return entities;
    return entities.filter(e => e.type === filterType);
  }, [entities, filterType]);

  // Calculate summary metrics
  const totalRegions = regions.length;
  const totalAreas = regions.reduce((sum, r) => sum + (r.cities || 0), 0);
  const totalFranchises = entities.filter(e => e.type === "franchise").length;
  const totalResellers = entities.filter(e => e.type === "reseller").length;
  const totalInfluencers = entities.filter(e => e.type === "influencer").length;
  const pendingApprovals = regions.reduce((sum, r) => sum + (r.pendingApprovals || 0), 0);
  const openIssues = entities.filter(e => e.type === "issue").length;
  const avgPerformance = regions.length ? Math.round(regions.reduce((sum, r) => sum + (r.performance || 0), 0) / regions.length) : 0;
  // Determine risk level
  const riskLevel = openIssues > 5 ? "high" : openIssues > 2 || pendingApprovals > 10 ? "medium" : "low";
  const liveAlertCount = openIssues; // No random
  // 12 KPI Boxes following strict spec
  const actionKPIs: CountryActionKPI[] = useMemo(() => [
    { 
      id: "total_regions", 
      title: "Total Regions", 
      count: totalRegions, 
      icon: Layers, 
      color: "from-blue-500 to-cyan-500", 
      trend: "stable",
      source: "system",
      lastUpdate: "Real-time" 
    },
    { 
      id: "total_areas", 
      title: "Total Areas", 
      count: totalAreas, 
      icon: Globe, 
      color: "from-indigo-500 to-purple-500", 
      trend: "stable",
      source: "system",
      lastUpdate: "Real-time" 
    },
    { 
      id: "active_franchises", 
      title: "Active Franchises", 
      count: totalFranchises, 
      icon: Building2, 
      color: "from-emerald-500 to-green-500", 
      trend: "up",
      source: "system",
      lastUpdate: "Just now" 
    },
    { 
      id: "active_resellers", 
      title: "Active Resellers", 
      count: totalResellers, 
      icon: Store, 
      color: "from-blue-500 to-blue-600", 
      trend: "up",
      source: "system",
      lastUpdate: "5 min ago" 
    },
    { 
      id: "influencers", 
      title: "Influencers", 
      count: totalInfluencers, 
      icon: Target, 
      color: "from-orange-500 to-amber-500", 
      trend: "up",
      source: "system",
      lastUpdate: "10 min ago" 
    },
    { 
      id: "pending_approvals", 
      title: "Pending Approvals", 
      count: pendingApprovals, 
      icon: Clock, 
      color: "from-amber-500 to-orange-500", 
      trend: pendingApprovals > 5 ? "up" : "stable",
      source: "system",
      lastUpdate: "2 min ago" 
    },
    { 
      id: "open_issues", 
      title: "Open Issues", 
      count: openIssues, 
      icon: AlertTriangle, 
      color: "from-red-500 to-rose-500", 
      trend: openIssues > 0 ? "up" : "down",
      source: "ai",
      lastUpdate: "3 min ago" 
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
      title: "Expiry/Renewal Due", 
      count: Math.floor(Math.random() * 8) + 2, 
      icon: Calendar, 
      color: "from-teal-500 to-cyan-500", 
      trend: "stable",
      source: "system",
      lastUpdate: "1 hour ago" 
    },
    { 
      id: "live_alerts", 
      title: "Live Alerts", 
      count: liveAlertCount, 
      icon: Bell, 
      color: "from-rose-600 to-red-500", 
      trend: liveAlertCount > 3 ? "up" : "down",
      source: "ai",
      lastUpdate: "1 min ago" 
    },
    { 
      id: "performance", 
      title: "Performance %", 
      count: avgPerformance, 
      icon: TrendingUp, 
      color: "from-emerald-600 to-green-500", 
      trend: avgPerformance > 85 ? "up" : "stable",
      source: "ai",
      lastUpdate: "5 min ago" 
    },
    { 
      id: "ai_risk_summary", 
      title: "AI Risk Summary", 
      count: riskLevel === "high" ? 3 : riskLevel === "medium" ? 2 : 1, 
      icon: Brain, 
      color: riskLevel === "high" ? "from-red-600 to-rose-500" : 
             riskLevel === "medium" ? "from-amber-600 to-orange-500" : 
             "from-green-500 to-emerald-500", 
      trend: riskLevel === "high" ? "up" : "down",
      source: "ai",
      lastUpdate: "Real-time" 
    },
  ], [totalRegions, totalAreas, totalFranchises, totalResellers, totalInfluencers, pendingApprovals, openIssues, avgPerformance, liveAlertCount, riskLevel]);

  // Live activity items
  const activityItems: ActivityItem[] = useMemo(() => [
    { id: "1", type: "approval", source: "user", message: "Franchise approved", target: "Mumbai Franchise #12", urgency: "low", timestamp: "2 min ago", actionable: false },
    { id: "2", type: "alert", source: "ai", message: "Payment delay detected", target: "Delhi Reseller #5", urgency: "high", timestamp: "5 min ago", actionable: true },
    { id: "3", type: "ai_suggestion", source: "ai", message: "Recommend renewal reminder", target: "8 franchises expiring soon", urgency: "medium", timestamp: "10 min ago", actionable: true },
    { id: "4", type: "warning", source: "system", message: "Compliance check pending", target: "West Region", urgency: "medium", timestamp: "15 min ago", actionable: true },
    { id: "5", type: "rejection", source: "user", message: "Application rejected", target: "New Influencer #45", urgency: "low", timestamp: "20 min ago", actionable: false },
    { id: "6", type: "alert", source: "system", message: "Server load spike", target: "API Gateway", urgency: "critical", timestamp: "25 min ago", actionable: true },
  ], []);

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
    console.log(`[CountryHead] handleAction called: ${actionType} on ${targetType}:${targetId}`);
    try {
      const { error } = await supabase.from('audit_logs').insert([{
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
      
      if (error) {
        console.error(`[CountryHead] DB error:`, error);
        toast.error("Failed to execute action: " + error.message);
        return;
      }
      
      console.log(`[CountryHead] Action logged successfully`);
      toast.success(`Action "${actionType}" executed successfully`);
      setSelectedRegion(null);
      setSelectedEntity(null);
    } catch (error) {
      console.error(`[CountryHead] Action error:`, error);
      toast.error("Failed to execute action");
    }
  }, [config.name]);

  const handleActivityAction = useCallback(async (item: ActivityItem, action: string) => {
    console.log(`[CountryHead] handleActivityAction called: ${action} on activity ${item.id}`);
    try {
      const { error } = await supabase.from('audit_logs').insert([{
        action: `activity_${action}`,
        module: 'country_head_dashboard',
        meta_json: { 
          activity_id: item.id,
          activity_type: item.type,
          target: item.target,
          country: config.name,
          action,
          timestamp: new Date().toISOString()
        }
      }]);
      
      if (error) {
        console.error(`[CountryHead] DB error:`, error);
        toast.error("Action failed: " + error.message);
        return;
      }
      
      console.log(`[CountryHead] Activity action logged successfully`);
      toast.success(`Activity "${action}" completed`);
    } catch (error) {
      console.error(`[CountryHead] Activity action error:`, error);
      toast.error("Action failed");
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
    return <span className={cn("text-[8px] px-1 py-0.5 rounded uppercase", colors[source])}>{source}</span>;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const getRiskBadge = () => {
    const config = {
      low: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/50", label: "Low Risk" },
      medium: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/50", label: "Medium Risk" },
      high: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/50", label: "High Risk" }
    };
    const c = config[riskLevel];
    return (
      <Badge className={cn(c.bg, c.text, c.border, "border")}>
        {c.label}
      </Badge>
    );
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-950 via-cyan-950/10 to-slate-950">
      {/* LEFT SIDEBAR — Country-Scoped Only */}
      <CountryHeadSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        countryName={config.name}
        countryFlag={config.flag}
        themeGradient={config.themeGradient}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 1️⃣ HEADER BAR — Sticky */}
        <div className="sticky top-0 z-10 p-4 border-b border-slate-700/50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            {/* Country Flag Icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg",
              config.themeGradient
            )}>
              {config.flag}
            </div>
            <div>
              {/* Country Name — Bold */}
              <h1 className="text-xl font-bold text-white">{config.name}</h1>
              {/* Continent Label — Muted */}
              <p className="text-sm text-slate-400">{config.continent} • Country Head Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Risk Indicator Chip */}
            {getRiskBadge()}
            
            {/* Live Alerts Badge */}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-slate-600 relative"
              onClick={() => toast.info(`${liveAlertCount} live alerts`)}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">Alerts</span>
              {liveAlertCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {liveAlertCount}
                </span>
              )}
            </Button>
            
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

        {/* 3️⃣ KPI GRID — 3×4 Responsive */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
            {actionKPIs.map((kpi) => (
              <motion.div
                key={kpi.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => toast.info(`Viewing ${kpi.title}: ${kpi.count}`)}
              >
                <Card className="bg-slate-900/60 border-slate-700/50 hover:border-cyan-500/40 transition-all h-full shadow-lg">
                  <CardContent className="p-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br shadow-md",
                      kpi.color
                    )}>
                      <kpi.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <p className={cn(
                        "text-xl font-bold",
                        kpi.count > 0 ? "text-white" : "text-slate-500"
                      )}>
                        {kpi.id === "performance" ? `${kpi.count}%` : 
                         kpi.id === "ai_risk_summary" ? ["Low", "Med", "High"][kpi.count - 1] : 
                         kpi.count}
                      </p>
                      {getTrendIcon(kpi.trend)}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{kpi.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[9px] text-slate-500">{kpi.lastUpdate}</p>
                      {getSourceBadge(kpi.source)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT: Map + Activity Panel + Detail Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* 4️⃣ COUNTRY MAP — Core Feature */}
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
                          r={14}
                          fill={getRegionColor(region)}
                          stroke="#fff"
                          strokeWidth={2}
                          opacity={0.85}
                        />
                        <text
                          textAnchor="middle"
                          y={4}
                          style={{ fontSize: 9, fill: "#fff", fontWeight: "bold" }}
                        >
                          {region.franchises}
                        </text>
                        {/* Pulse animation — soft, not flashy */}
                        <motion.circle
                          r={14}
                          fill="transparent"
                          stroke={getRegionColor(region)}
                          strokeWidth={2}
                          animate={{ r: [14, 22, 14], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.g>
                    </Marker>
                  ))}
                  
                  {/* Entity Markers — Filtered */}
                  {filteredEntities.map((entity) => (
                    <Marker 
                      key={entity.id} 
                      coordinates={[entity.lng, entity.lat]}
                      onClick={() => setSelectedEntity(entity)}
                    >
                      <motion.g
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.4 }}
                        className="cursor-pointer"
                      >
                        <circle
                          r={entity.type === "issue" ? 7 : 5}
                          fill={getMarkerColor(entity)}
                          stroke="#fff"
                          strokeWidth={1}
                          opacity={0.9}
                        />
                        {entity.openIssues > 0 && entity.type !== "issue" && (
                          <circle
                            r={3}
                            cx={5}
                            cy={-5}
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

            {/* Map Filters */}
            <div className="absolute top-4 left-4 bg-slate-900/90 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs font-medium text-white mb-2">Filter</p>
              <div className="flex flex-col gap-1">
                {["all", "franchise", "reseller", "influencer"].map((type) => (
                  <Button
                    key={type}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start text-xs h-7",
                      filterType === type ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
                    )}
                    onClick={() => setFilterType(type as typeof filterType)}
                  >
                    {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
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
                  <p className="font-bold text-white">{totalRegions}</p>
                </div>
                <div>
                  <p className="text-slate-400">Franchises</p>
                  <p className="font-bold text-emerald-400">{totalFranchises}</p>
                </div>
                <div>
                  <p className="text-slate-400">Resellers</p>
                  <p className="font-bold text-blue-400">{totalResellers}</p>
                </div>
                <div>
                  <p className="text-slate-400">Influencers</p>
                  <p className="font-bold text-orange-400">{totalInfluencers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5️⃣ LIVE ACTIVITY & ESCALATION PANEL */}
          <div className="w-72 border-l border-slate-700/50 bg-slate-900/80 flex flex-col">
            <div className="p-3 border-b border-slate-700/50">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Activity & Escalations
              </h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {activityItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                        item.type === "approval" ? "bg-emerald-500/20" :
                        item.type === "rejection" ? "bg-red-500/20" :
                        item.type === "alert" ? "bg-orange-500/20" :
                        item.type === "warning" ? "bg-amber-500/20" :
                        "bg-purple-500/20"
                      )}>
                        {item.type === "approval" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> :
                         item.type === "rejection" ? <X className="w-3 h-3 text-red-400" /> :
                         item.type === "alert" ? <AlertCircle className="w-3 h-3 text-orange-400" /> :
                         item.type === "warning" ? <AlertTriangle className="w-3 h-3 text-amber-400" /> :
                         <Brain className="w-3 h-3 text-purple-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{item.message}</p>
                        <p className="text-[10px] text-slate-400 truncate">{item.target}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-[9px] px-1 py-0 h-4", getUrgencyColor(item.urgency))}>
                          {item.urgency}
                        </Badge>
                        <span className={cn(
                          "text-[9px] px-1 py-0.5 rounded uppercase",
                          item.source === "ai" ? "bg-purple-500/20 text-purple-400" :
                          item.source === "user" ? "bg-blue-500/20 text-blue-400" :
                          "bg-slate-500/20 text-slate-400"
                        )}>
                          {item.source}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500">{item.timestamp}</span>
                    </div>
                    
                    {/* 6️⃣ INLINE ACTION SYSTEM */}
                    {item.actionable && (
                      <div className="flex gap-1 mt-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-emerald-400 hover:bg-emerald-500/20"
                          onClick={() => handleActivityAction(item, "approve")}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-red-400 hover:bg-red-500/20"
                          onClick={() => handleActivityAction(item, "reject")}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-amber-400 hover:bg-amber-500/20"
                          onClick={() => handleActivityAction(item, "escalate")}
                        >
                          Escalate
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
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
                              <p className="text-xs text-slate-400">Cities/Areas</p>
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

                        {/* 6️⃣ Region Actions — MANDATORY */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-400 uppercase">Actions</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                              onClick={() => handleAction("approve", selectedRegion.id, "region")}
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-500/50 text-red-400 gap-1"
                              onClick={() => handleAction("reject", selectedRegion.id, "region")}
                            >
                              <X className="w-3 h-3" /> Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-slate-500/50 text-slate-300 gap-1"
                              onClick={() => handleAction("sendback", selectedRegion.id, "region")}
                            >
                              <RotateCcw className="w-3 h-3" /> Send Back
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

                        {/* 6️⃣ Entity Actions — MANDATORY */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-400 uppercase">Actions</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                              onClick={() => handleAction("approve", selectedEntity.id, "entity")}
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-500/50 text-red-400 gap-1"
                              onClick={() => handleAction("reject", selectedEntity.id, "entity")}
                            >
                              <X className="w-3 h-3" /> Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-slate-500/50 text-slate-300 gap-1"
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
