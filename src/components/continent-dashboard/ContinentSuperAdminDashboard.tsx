// Reusable Continent Super Admin Dashboard Template
// Works for all 6 continents with dynamic data binding

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import {
  MapPin, TrendingUp, Activity, AlertTriangle,
  Clock, CheckCircle2, X, Eye, RotateCcw, Send, Pause, RefreshCw,
  FileWarning, Calendar, Zap, Server, Lock, Shield,
  Target, DollarSign, ChevronLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ContinentConfig, CountryData, MapMarker, ActionKPI, MARKER_COLORS, generateMarkers } from "./types";
import ContinentSidebar, { ContinentSidebarSection } from "./ContinentSidebar";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface ContinentSuperAdminDashboardProps {
  config: ContinentConfig;
  onBack?: () => void;
}

const ContinentSuperAdminDashboard = ({ config, onBack }: ContinentSuperAdminDashboardProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<ContinentSidebarSection>("dashboard");
  
  const markers = useMemo(() => generateMarkers(config.countries), [config.countries]);
  
  // Calculate totals from config countries
  const totals = useMemo(() => ({
    countries: config.countries.length,
    franchises: config.countries.reduce((sum, c) => sum + c.franchises, 0),
    resellers: config.countries.reduce((sum, c) => sum + c.resellers, 0),
    leads: config.countries.reduce((sum, c) => sum + c.leads, 0),
    revenue: config.countries.reduce((sum, c) => sum + c.revenue, 0),
    pendingApprovals: config.countries.reduce((sum, c) => sum + c.pendingApprovals, 0),
    issues: config.countries.reduce((sum, c) => sum + c.issues, 0),
  }), [config.countries]);
  
  // 12 Action KPI Boxes - Continent-scoped only (matching required specs)
  const actionKPIs: ActionKPI[] = useMemo(() => [
    { id: "system_health", title: "System Health", count: 94, icon: Server, color: "from-emerald-500 to-green-500", trend: "stable", source: "System", lastUpdate: "1 min ago", actions: ["details", "restart"] },
    { id: "active_countries", title: "Active Countries", count: totals.countries, icon: Target, color: "from-blue-500 to-cyan-500", trend: "stable", source: "System", lastUpdate: "5 min ago", actions: ["view"] },
    { id: "active_franchises", title: "Active Franchise", count: totals.franchises, icon: Clock, color: "from-purple-500 to-violet-500", trend: "up", source: "Human", lastUpdate: "2 min ago", actions: ["approve", "review"] },
    { id: "active_resellers", title: "Active Reseller", count: totals.resellers, icon: Clock, color: "from-orange-500 to-amber-500", trend: "up", source: "Human", lastUpdate: "3 min ago", actions: ["approve", "review"] },
    { id: "pending_approvals", title: "Pending Approvals", count: totals.pendingApprovals, icon: Clock, color: "from-amber-500 to-orange-500", trend: "up", source: "Human", lastUpdate: "2 min ago", actions: ["approve", "reject", "review"] },
    { id: "open_issues", title: "Open Issues", count: totals.issues, icon: AlertTriangle, color: "from-red-500 to-rose-500", trend: "up", source: "System", lastUpdate: "5 min ago", actions: ["review", "escalate", "resolve"] },
    { id: "lead_volume", title: "Lead Volume", count: totals.leads, icon: Target, color: "from-pink-500 to-rose-500", trend: "up", source: "System", lastUpdate: "10 min ago", actions: ["view"] },
    { id: "conversion_rate", title: "Conversion Rate", count: 42, icon: Zap, color: "from-indigo-500 to-purple-500", trend: "up", source: "AI", lastUpdate: "15 min ago", actions: ["view"] },
    { id: "revenue_today", title: "Revenue Today", count: Math.round(totals.revenue / 1000), icon: DollarSign, color: "from-emerald-500 to-teal-500", trend: "up", source: "System", lastUpdate: "1 min ago", actions: ["view", "export"] },
    { id: "wallet_risk", title: "Wallet Risk", count: 3, icon: Lock, color: "from-yellow-500 to-amber-500", trend: "down", source: "AI", lastUpdate: "30 min ago", actions: ["review", "alert"] },
    { id: "compliance_alerts", title: "Compliance Alerts", count: 2, icon: Shield, color: "from-red-600 to-red-500", trend: "stable", source: "System", lastUpdate: "45 min ago", actions: ["review", "resolve"] },
    { id: "ai_recommendation", title: "AI Recommendation", count: 5, icon: Zap, color: "from-cyan-500 to-blue-500", trend: "stable", source: "AI", lastUpdate: "10 min ago", actions: ["view", "apply"] },
  ], [totals, config.name]);

  const approvalsQueue = useMemo(() => {
    return [...config.countries]
      .filter((c) => c.pendingApprovals > 0)
      .sort((a, b) => b.pendingApprovals - a.pendingApprovals);
  }, [config.countries]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success(`${config.name} dashboard refreshed`);
  }, [config.name]);

  const handleAction = useCallback(async (action: string, targetId: string, targetType: string) => {
    try {
      await supabase.from('audit_logs').insert([{
        action: `${config.id}_admin_${action}`,
        module: 'continent_super_admin',
        meta_json: { 
          target_id: targetId,
          target_type: targetType,
          continent: config.name,
          action,
          timestamp: new Date().toISOString()
        }
      }]);
      
      toast.success(`Action "${action}" executed successfully`);
      setDrawerOpen(false);
      setSelectedCountry(null);
    } catch (error) {
      toast.error("Failed to execute action");
    }
  }, [config.id, config.name]);

  const handleCountryClick = useCallback((country: CountryData) => {
    setSelectedCountry(country);
    setDrawerOpen(true);
  }, []);

  const handleKpiClick = useCallback((kpi: ActionKPI) => {
    // Map ALL 12 KPIs to sidebar sections
    const idToSection: Record<string, ContinentSidebarSection> = {
      system_health: "dashboard",
      active_countries: "countries",
      active_franchises: "franchises",
      active_resellers: "resellers",
      pending_approvals: "approvals",
      open_issues: "issues",
      lead_volume: "leads",
      conversion_rate: "reports",
      revenue_today: "revenue",
      wallet_risk: "revenue",
      compliance_alerts: "compliance",
      ai_recommendation: "reports",
    };

    const targetSection = idToSection[kpi.id];
    if (!targetSection) {
      toast.info(kpi.title, {
        description: `${kpi.count} items • ${kpi.source} source`,
        duration: 2000,
      });
      return;
    }

    // Reset any drill-down UI when switching sections
    setSelectedCountry(null);
    setSelectedMarker(null);
    setDrawerOpen(false);

    setActiveSection(targetSection);
    toast.success(kpi.title, {
      description: `Opening ${targetSection.replace(/_/g, " ")}`,
      duration: 1500,
    });
  }, []);

  useEffect(() => {
    const supportsCountryDrawer =
      activeSection === "dashboard" ||
      activeSection === "live_map" ||
      activeSection === "approvals" ||
      activeSection === "issues" ||
      activeSection === "countries";

    if (!supportsCountryDrawer) {
      setDrawerOpen(false);
      setSelectedCountry(null);
      setSelectedMarker(null);
    }
  }, [activeSection]);

  const getMarkerColor = (type: string): string => {
    return MARKER_COLORS[type as keyof typeof MARKER_COLORS] || "#6b7280";
  };

  // Dynamic accent color based on continent
  const accentClasses = useMemo(() => ({
    bg: `bg-${config.accentColor}-500/20`,
    text: `text-${config.accentColor}-400`,
    border: `border-${config.accentColor}-500/50`,
    hover: `hover:bg-${config.accentColor}-500/30`,
  }), [config.accentColor]);

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950">
      {/* Left Sidebar - Continent Scoped */}
      <ContinentSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        continentName={config.name}
        continentIcon={config.icon}
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
          <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl", config.themeGradient)}>
            {config.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{config.name} Super Admin Dashboard</h1>
            <p className="text-sm text-slate-400">{totals.countries} Countries • {totals.franchises} Franchises • Live Data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            LIVE
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* 12 KPI Action Boxes */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
          {actionKPIs.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => handleKpiClick(kpi)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleKpiClick(kpi);
                }
              }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 transition-all h-full">
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
                      {kpi.id === "system_health" ? `${kpi.count}%` : kpi.count}
                    </p>
                    {kpi.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                    {kpi.trend === "down" && <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{kpi.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[8px] text-slate-500">{kpi.lastUpdate}</p>
                    <Badge variant="outline" className="text-[8px] px-1 py-0 h-4">
                      {kpi.source}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content: Map + Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {(activeSection === "dashboard" || activeSection === "live_map") ? (
          // Live map / overview
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: config.mapScale,
                  center: config.mapCenter
                }}
                className="w-full h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50"
              >
                <ZoomableGroup zoom={1} center={config.mapCenter}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const country = config.countries.find(c => 
                          geo.properties.name?.includes(c.name) || 
                          c.name.includes(geo.properties.name || "")
                        );
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={country ? (
                              country.status === "healthy" ? "#22c55e20" :
                              country.status === "warning" ? "#eab30820" :
                              "#ef444420"
                            ) : "#1e293b"}
                            stroke="#334155"
                            strokeWidth={0.5}
                            onClick={() => country && handleCountryClick(country)}
                            style={{
                              default: { outline: "none", cursor: country ? "pointer" : "default" },
                              hover: { fill: country ? "#3b82f630" : "#334155", outline: "none" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                  
                  {/* Country Markers with pulse animation */}
                  {config.countries.map((country) => (
                    <Marker 
                      key={country.id} 
                      coordinates={[country.lng, country.lat]}
                      onClick={() => handleCountryClick(country)}
                    >
                      <motion.g className="cursor-pointer">
                        {/* Pulse animation */}
                        <motion.circle
                          r={12}
                          fill={
                            country.status === "healthy" ? "#22c55e" :
                            country.status === "warning" ? "#eab308" :
                            "#ef4444"
                          }
                          opacity={0.3}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        {/* Main marker */}
                        <circle
                          r={8}
                          fill={
                            country.status === "healthy" ? "#22c55e" :
                            country.status === "warning" ? "#eab308" :
                            "#ef4444"
                          }
                          stroke="#fff"
                          strokeWidth={2}
                        />
                        {/* Issue indicator */}
                        {country.issues > 0 && (
                          <circle
                            r={4}
                            cx={6}
                            cy={-6}
                            fill="#ef4444"
                            stroke="#fff"
                            strokeWidth={1}
                          />
                        )}
                        {/* Pending indicator */}
                        {country.pendingApprovals > 0 && (
                          <circle
                            r={4}
                            cx={-6}
                            cy={-6}
                            fill="#f97316"
                            stroke="#fff"
                            strokeWidth={1}
                          />
                        )}
                      </motion.g>
                    </Marker>
                  ))}
                  
                  {/* Entity Markers */}
                  {markers.slice(0, 30).map((marker) => (
                    <Marker 
                      key={marker.id} 
                      coordinates={[marker.lng, marker.lat]}
                      onClick={() => setSelectedMarker(marker)}
                    >
                      <circle
                        r={4}
                        fill={getMarkerColor(marker.type)}
                        stroke="#fff"
                        strokeWidth={1}
                        opacity={0.8}
                        className="cursor-pointer"
                      />
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
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-300">Franchise</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-300">Reseller</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs text-slate-300">Influencer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs text-slate-300">Pending Approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs text-slate-300">Issue / Alert</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Overlay */}
            <div className="absolute top-4 right-4 bg-slate-900/90 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs font-medium text-white mb-2">{config.name} Quick Stats</p>
              <div className="space-y-1">
                <p className="text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">{totals.franchises}</span> Franchises
                </p>
                <p className="text-xs text-slate-300">
                  <span className="text-blue-400 font-bold">{totals.resellers}</span> Resellers
                </p>
                <p className="text-xs text-slate-300">
                  <span className="text-purple-400 font-bold">{totals.leads}</span> Active Leads
                </p>
                <p className="text-xs text-slate-300">
                  <span className="text-amber-400 font-bold">${(totals.revenue / 1000000).toFixed(1)}M</span> Revenue
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Non-map sections
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">
                {activeSection === "approvals" ? "Approvals Center" : "Section"}
              </h2>
              <p className="text-sm text-slate-400">
                {activeSection === "approvals"
                  ? "Pending approvals across all countries in this continent."
                  : "This panel will be available in the next iteration."}
              </p>
            </div>

            {activeSection === "approvals" ? (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {approvalsQueue.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      No pending approvals right now.
                    </div>
                  ) : (
                    approvalsQueue.map((country) => (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setDrawerOpen(true);
                        }}
                        className="w-full text-left"
                      >
                        <Card className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 transition-colors">
                          <CardContent className="p-4 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-white truncate">{country.name}</p>
                              <p className="text-xs text-slate-400 truncate">Admin: {country.admin}</p>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                                {country.pendingApprovals} pending
                              </Badge>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction("approve_all", country.id, "country");
                                }}
                              >
                                Approve All
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                Select a section from the sidebar.
              </div>
            )}
          </div>
        )}

        {/* Country Drill-Down Drawer */}
        <AnimatePresence>
          {drawerOpen && selectedCountry && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-slate-700/50 bg-slate-900/95 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {selectedCountry.name}
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => { setDrawerOpen(false); setSelectedCountry(null); }}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="p-4 space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Status</span>
                    <Badge className={cn(
                      selectedCountry.status === "healthy" ? "bg-emerald-500/20 text-emerald-400" :
                      selectedCountry.status === "warning" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    )}>
                      {selectedCountry.status}
                    </Badge>
                  </div>
                  
                  {/* Admin */}
                  <div>
                    <p className="text-xs text-slate-400">Country Admin</p>
                    <p className="font-medium text-white">{selectedCountry.admin}</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Franchises</p>
                      <p className="text-lg font-bold text-blue-400">{selectedCountry.franchises}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Resellers</p>
                      <p className="text-lg font-bold text-emerald-400">{selectedCountry.resellers}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Pending Approvals</p>
                      <p className="text-lg font-bold text-amber-400">{selectedCountry.pendingApprovals}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">Open Issues</p>
                      <p className="text-lg font-bold text-red-400">{selectedCountry.issues}</p>
                    </div>
                  </div>
                  
                  {/* Revenue */}
                  <div className="p-3 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-xs text-slate-400">Revenue</p>
                    <p className="text-xl font-bold text-purple-400">${selectedCountry.revenue.toLocaleString()}</p>
                  </div>
                  
                  {/* Compliance */}
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-sm text-slate-400">Compliance Status</span>
                    <Badge className={cn(
                      selectedCountry.compliance === "compliant" ? "bg-emerald-500/20 text-emerald-400" :
                      selectedCountry.compliance === "review" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    )}>
                      {selectedCountry.compliance}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-700/50 space-y-2">
                    <p className="text-xs font-medium text-slate-400 mb-3">Country Actions</p>
                    
                    {selectedCountry.pendingApprovals > 0 && (
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                        onClick={() => handleAction("approve_all", selectedCountry.id, "country")}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve All ({selectedCountry.pendingApprovals})
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => handleAction("review", selectedCountry.id, "country")}
                    >
                      <Eye className="w-4 h-4" />
                      Review Country Ops
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                      onClick={() => handleAction("suspend", selectedCountry.id, "country")}
                    >
                      <Pause className="w-4 h-4" />
                      Suspend Country Ops
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => handleAction("escalate_to_boss", selectedCountry.id, "country")}
                    >
                      <Send className="w-4 h-4" />
                      Send to Boss
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-slate-500/50 text-slate-400 hover:bg-slate-500/10"
                      onClick={() => handleAction("request_clarification", selectedCountry.id, "country")}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Request Clarification
                    </Button>
                  </div>
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

export default ContinentSuperAdminDashboard;
