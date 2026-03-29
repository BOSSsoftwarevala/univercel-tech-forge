import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import {
  MapPin, Users, Building2, TrendingUp, Activity, AlertTriangle,
  Clock, CheckCircle2, ChevronRight, Store, DollarSign, Shield,
  X, Eye, Ban, RotateCcw, Send, Pause, Play, RefreshCw,
  FileWarning, Calendar, Zap, Server, Lock, Bell, Globe2,
  Target, UserCheck, ChevronLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const asiaGeoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Asia-specific country data with real coordinates
const asiaCountries = [
  { id: "IN", name: "India", admin: "Raj Patel", status: "healthy" as const, franchises: 45, resellers: 120, leads: 340, revenue: 2400000, lat: 20.5937, lng: 78.9629, pendingApprovals: 3, issues: 2, compliance: "compliant" },
  { id: "CN", name: "China", admin: "Li Wei", status: "healthy" as const, franchises: 62, resellers: 200, leads: 520, revenue: 4500000, lat: 35.8617, lng: 104.1954, pendingApprovals: 5, issues: 1, compliance: "compliant" },
  { id: "JP", name: "Japan", admin: "Yuki Tanaka", status: "healthy" as const, franchises: 28, resellers: 85, leads: 180, revenue: 1800000, lat: 36.2048, lng: 138.2529, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "KR", name: "South Korea", admin: "Kim Min-jun", status: "healthy" as const, franchises: 22, resellers: 65, leads: 145, revenue: 1200000, lat: 35.9078, lng: 127.7669, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "ID", name: "Indonesia", admin: "Budi Santoso", status: "warning" as const, franchises: 18, resellers: 45, leads: 95, revenue: 650000, lat: -0.7893, lng: 113.9213, pendingApprovals: 4, issues: 3, compliance: "review" },
  { id: "TH", name: "Thailand", admin: "Somchai Prasert", status: "healthy" as const, franchises: 15, resellers: 40, leads: 88, revenue: 520000, lat: 15.8700, lng: 100.9925, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "VN", name: "Vietnam", admin: "Nguyen Van", status: "healthy" as const, franchises: 12, resellers: 35, leads: 72, revenue: 380000, lat: 14.0583, lng: 108.2772, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "PH", name: "Philippines", admin: "Jose Santos", status: "warning" as const, franchises: 10, resellers: 28, leads: 65, revenue: 290000, lat: 12.8797, lng: 121.7740, pendingApprovals: 3, issues: 2, compliance: "review" },
  { id: "MY", name: "Malaysia", admin: "Ahmad Hassan", status: "healthy" as const, franchises: 14, resellers: 38, leads: 82, revenue: 450000, lat: 4.2105, lng: 101.9758, pendingApprovals: 0, issues: 0, compliance: "compliant" },
  { id: "SG", name: "Singapore", admin: "David Tan", status: "healthy" as const, franchises: 8, resellers: 22, leads: 55, revenue: 380000, lat: 1.3521, lng: 103.8198, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "AE", name: "UAE", admin: "Ahmed Al-Rashid", status: "healthy" as const, franchises: 12, resellers: 32, leads: 78, revenue: 620000, lat: 23.4241, lng: 53.8478, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "SA", name: "Saudi Arabia", admin: "Mohammed Al-Saud", status: "critical" as const, franchises: 8, resellers: 18, leads: 42, revenue: 350000, lat: 23.8859, lng: 45.0792, pendingApprovals: 6, issues: 5, compliance: "breach" },
];

// Entity markers for the map
interface MapMarker {
  id: string;
  type: "franchise" | "reseller" | "influencer" | "issue" | "pending";
  name: string;
  country: string;
  lat: number;
  lng: number;
  status: string;
  details: string;
}

const generateAsiaMarkers = (): MapMarker[] => {
  const markers: MapMarker[] = [];
  
  asiaCountries.forEach(country => {
    // Add franchise markers
    for (let i = 0; i < Math.min(country.franchises, 3); i++) {
      markers.push({
        id: `${country.id}-fr-${i}`,
        type: "franchise",
        name: `${country.name} Franchise ${i + 1}`,
        country: country.name,
        lat: country.lat + (Math.random() - 0.5) * 5,
        lng: country.lng + (Math.random() - 0.5) * 5,
        status: country.status,
        details: `Revenue: $${Math.floor(country.revenue / country.franchises).toLocaleString()}`
      });
    }
    
    // Add reseller markers
    for (let i = 0; i < Math.min(country.resellers, 2); i++) {
      markers.push({
        id: `${country.id}-rs-${i}`,
        type: "reseller",
        name: `${country.name} Reseller ${i + 1}`,
        country: country.name,
        lat: country.lat + (Math.random() - 0.5) * 6,
        lng: country.lng + (Math.random() - 0.5) * 6,
        status: "active",
        details: `Leads: ${Math.floor(country.leads / 3)}`
      });
    }
    
    // Add issue markers if any
    if (country.issues > 0) {
      markers.push({
        id: `${country.id}-issue`,
        type: "issue",
        name: `Issue in ${country.name}`,
        country: country.name,
        lat: country.lat + 1,
        lng: country.lng + 1,
        status: "critical",
        details: `${country.issues} open issues`
      });
    }
    
    // Add pending approval markers
    if (country.pendingApprovals > 0) {
      markers.push({
        id: `${country.id}-pending`,
        type: "pending",
        name: `Pending: ${country.name}`,
        country: country.name,
        lat: country.lat - 1,
        lng: country.lng - 1,
        status: "pending",
        details: `${country.pendingApprovals} pending approvals`
      });
    }
  });
  
  return markers;
};

const MARKER_COLORS = {
  franchise: "#3b82f6",    // Blue
  reseller: "#22c55e",     // Green
  influencer: "#eab308",   // Yellow
  issue: "#ef4444",        // Red
  pending: "#f97316",      // Orange
};

interface ActionKPI {
  id: string;
  title: string;
  count: number;
  icon: any;
  color: string;
  trend: "up" | "down" | "stable";
  source: "Human" | "AI" | "System";
  lastUpdate: string;
  actions: string[];
}

interface AsiaSuperAdminDashboardProps {
  onBack?: () => void;
}

const AsiaSuperAdminDashboard = ({ onBack }: AsiaSuperAdminDashboardProps) => {
  const [selectedCountry, setSelectedCountry] = useState<typeof asiaCountries[0] | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const markers = useMemo(() => generateAsiaMarkers(), []);
  
  // Calculate totals
  const totals = useMemo(() => ({
    countries: asiaCountries.length,
    franchises: asiaCountries.reduce((sum, c) => sum + c.franchises, 0),
    resellers: asiaCountries.reduce((sum, c) => sum + c.resellers, 0),
    leads: asiaCountries.reduce((sum, c) => sum + c.leads, 0),
    revenue: asiaCountries.reduce((sum, c) => sum + c.revenue, 0),
    pendingApprovals: asiaCountries.reduce((sum, c) => sum + c.pendingApprovals, 0),
    issues: asiaCountries.reduce((sum, c) => sum + c.issues, 0),
  }), []);
  
  // 12 Action KPI Boxes - Asia-scoped only
  const actionKPIs: ActionKPI[] = [
    { id: "pending_approvals", title: "Pending Approvals", count: totals.pendingApprovals, icon: Clock, color: "from-amber-500 to-orange-500", trend: "up", source: "Human", lastUpdate: "2 min ago", actions: ["approve", "reject", "review"] },
    { id: "critical_issues", title: "Critical Issues", count: totals.issues, icon: AlertTriangle, color: "from-red-500 to-rose-500", trend: "up", source: "System", lastUpdate: "5 min ago", actions: ["review", "escalate", "resolve"] },
    { id: "system_health", title: "System Health (Asia)", count: 94, icon: Server, color: "from-emerald-500 to-green-500", trend: "stable", source: "System", lastUpdate: "1 min ago", actions: ["details", "restart"] },
    { id: "server_risk", title: "Server Load / Risk", count: 2, icon: Zap, color: "from-yellow-500 to-amber-500", trend: "down", source: "AI", lastUpdate: "3 min ago", actions: ["review", "scale"] },
    { id: "failed_builds", title: "Failed Builds", count: 0, icon: FileWarning, color: "from-slate-500 to-gray-500", trend: "stable", source: "System", lastUpdate: "Just now", actions: ["retry", "review"] },
    { id: "deployment", title: "Deployment Waiting", count: 3, icon: Clock, color: "from-blue-500 to-cyan-500", trend: "up", source: "Human", lastUpdate: "10 min ago", actions: ["approve", "reject"] },
    { id: "payment_pending", title: "Payment Pending", count: 8, icon: DollarSign, color: "from-purple-500 to-violet-500", trend: "up", source: "System", lastUpdate: "15 min ago", actions: ["approve", "hold", "review"] },
    { id: "expiry_renewal", title: "Expiry / Renewal Due", count: 12, icon: Calendar, color: "from-orange-500 to-red-500", trend: "up", source: "System", lastUpdate: "1 hour ago", actions: ["renew", "notify", "suspend"] },
    { id: "ai_cost", title: "AI / API Cost Spike", count: 1, icon: Zap, color: "from-pink-500 to-rose-500", trend: "up", source: "AI", lastUpdate: "30 min ago", actions: ["review", "limit", "optimize"] },
    { id: "open_issues", title: "Open Issues (Unresolved)", count: 15, icon: Target, color: "from-indigo-500 to-purple-500", trend: "down", source: "Human", lastUpdate: "5 min ago", actions: ["assign", "escalate", "close"] },
    { id: "security", title: "Security Warnings", count: 2, icon: Lock, color: "from-red-600 to-red-500", trend: "stable", source: "AI", lastUpdate: "2 hours ago", actions: ["investigate", "block", "whitelist"] },
    { id: "compliance", title: "Compliance / SLA Breach", count: 1, icon: Shield, color: "from-rose-500 to-red-500", trend: "down", source: "System", lastUpdate: "45 min ago", actions: ["review", "notify", "resolve"] },
  ];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Asia dashboard refreshed");
  }, []);

  const handleAction = useCallback(async (action: string, targetId: string, targetType: string) => {
    try {
      await supabase.from('audit_logs').insert([{
        action: `asia_admin_${action}`,
        module: 'continent_super_admin',
        meta_json: { 
          target_id: targetId,
          target_type: targetType,
          continent: 'Asia',
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
  }, []);

  const handleCountryClick = useCallback((country: typeof asiaCountries[0]) => {
    setSelectedCountry(country);
    setDrawerOpen(true);
  }, []);

  const handleKpiClick = useCallback((kpi: ActionKPI) => {
    toast.info(kpi.title, {
      description: "Opening panel…",
      duration: 2000,
    });
  }, []);

  const getMarkerColor = (type: string): string => {
    return MARKER_COLORS[type as keyof typeof MARKER_COLORS] || "#6b7280";
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-red-950/10 to-slate-950">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-2xl">
            🌏
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Asia Super Admin Dashboard</h1>
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
              <Card className="bg-slate-900/50 border-slate-700/50 hover:border-red-500/30 transition-all h-full">
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
        {/* Live Asia Map */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 400,
                center: [100, 25] // Centered on Asia
              }}
              className="w-full h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50"
            >
              <ZoomableGroup zoom={1} center={[100, 25]}>
                <Geographies geography={asiaGeoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const asiaCountry = asiaCountries.find(c => 
                        geo.properties.name?.includes(c.name) || 
                        c.name.includes(geo.properties.name || "")
                      );
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={asiaCountry ? (
                            asiaCountry.status === "healthy" ? "#22c55e20" :
                            asiaCountry.status === "warning" ? "#eab30820" :
                            "#ef444420"
                          ) : "#1e293b"}
                          stroke="#334155"
                          strokeWidth={0.5}
                          onClick={() => asiaCountry && handleCountryClick(asiaCountry)}
                          style={{
                            default: { outline: "none", cursor: asiaCountry ? "pointer" : "default" },
                            hover: { fill: asiaCountry ? "#3b82f630" : "#334155", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
                
                {/* Country Markers with pulse animation */}
                {asiaCountries.map((country) => (
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
            <p className="text-xs font-medium text-white mb-2">Asia Quick Stats</p>
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
                  <MapPin className="w-4 h-4 text-red-400" />
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
  );
};

export default AsiaSuperAdminDashboard;
