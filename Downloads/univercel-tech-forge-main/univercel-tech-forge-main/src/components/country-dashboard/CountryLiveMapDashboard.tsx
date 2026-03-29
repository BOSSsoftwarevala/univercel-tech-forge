import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import {
  MapPin, Users, Building2, TrendingUp, Activity, AlertTriangle,
  Clock, CheckCircle2, ChevronRight, Store, DollarSign, Shield,
  X, Eye, Ban, RotateCcw, Send, Pause, Play, RefreshCw,
  FileWarning, Calendar, Zap, Server, Lock, Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Entity types with their marker colors
const MARKER_COLORS = {
  franchise_active: "#22c55e",    // Green
  franchise_pending: "#eab308",   // Yellow
  reseller_active: "#3b82f6",     // Blue
  influencer: "#f97316",          // Orange
  issue: "#ef4444",               // Red
};

interface CountryEntity {
  id: string;
  name: string;
  type: "franchise" | "reseller" | "influencer" | "issue";
  status: "active" | "pending" | "warning" | "critical";
  city: string;
  region: string;
  lat: number;
  lng: number;
  revenue: number;
  openIssues: number;
  lastActivity: string;
}

interface ActionKPI {
  id: string;
  title: string;
  count: number;
  icon: any;
  color: string;
  lastUpdate: string;
}

interface CountryLiveMapDashboardProps {
  countryCode: string;
  countryName: string;
  continent: string;
  onBack: () => void;
}


import { useEffect, useState, useCallback } from "react";
import { countryControlApi } from "@/lib/api/country-control";

const CountryLiveMapDashboard = ({ countryCode, countryName, continent, onBack }: CountryLiveMapDashboardProps) => {
  const [selectedEntity, setSelectedEntity] = useState<CountryEntity | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([78, 22]);
  const [zoom, setZoom] = useState(4);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [entities, setEntities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const mapRes = await countryControlApi.getMap(countryCode);
    setEntities(mapRes?.entities || []);
    setRegions(mapRes?.regions || []);
    setLoading(false);
  }, [countryCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // 12 Action KPI Boxes
  const actionKPIs: ActionKPI[] = [
    { id: "pending_approvals", title: "Pending Approvals", count: 8, icon: Clock, color: "from-amber-500 to-orange-500", lastUpdate: "2 min ago" },
    { id: "open_issues", title: "Open Issues", count: 12, icon: AlertTriangle, color: "from-red-500 to-rose-500", lastUpdate: "5 min ago" },
    { id: "payment_pending", title: "Payment Pending", count: 5, icon: DollarSign, color: "from-yellow-500 to-amber-500", lastUpdate: "15 min ago" },
    { id: "compliance_warnings", title: "Compliance Warnings", count: 3, icon: Shield, color: "from-purple-500 to-violet-500", lastUpdate: "1 hour ago" },
    { id: "expiry_renewal", title: "Expiry / Renewal Due", count: 7, icon: Calendar, color: "from-blue-500 to-cyan-500", lastUpdate: "30 min ago" },
    { id: "high_risk", title: "High-Risk Entities", count: 2, icon: FileWarning, color: "from-red-600 to-red-500", lastUpdate: "45 min ago" },
    { id: "lead_drop", title: "Lead Drop Alerts", count: 4, icon: TrendingUp, color: "from-pink-500 to-rose-500", lastUpdate: "10 min ago" },
    { id: "revenue_anomaly", title: "Revenue Anomaly", count: 1, icon: Zap, color: "from-orange-500 to-yellow-500", lastUpdate: "2 hours ago" },
    { id: "sla_breach", title: "SLA Breach", count: 2, icon: Clock, color: "from-rose-500 to-red-500", lastUpdate: "20 min ago" },
    { id: "api_errors", title: "API / System Errors", count: 0, icon: Server, color: "from-slate-500 to-gray-500", lastUpdate: "Just now" },
    { id: "security_flags", title: "Security Flags", count: 1, icon: Lock, color: "from-indigo-500 to-purple-500", lastUpdate: "3 hours ago" },
    { id: "emergency", title: "Emergency Requests", count: 0, icon: Bell, color: "from-red-700 to-red-600", lastUpdate: "Never" },
  ];

  const getMarkerColor = (entity: CountryEntity): string => {
    if (entity.type === "issue") return MARKER_COLORS.issue;
    if (entity.type === "influencer") return MARKER_COLORS.influencer;
    if (entity.type === "reseller") return MARKER_COLORS.reseller_active;
    if (entity.status === "pending") return MARKER_COLORS.franchise_pending;
    return MARKER_COLORS.franchise_active;
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Map data refreshed");
  }, []);

  const handleAction = useCallback(async (actionType: string, entityId: string, reason?: string) => {
    try {
      // Log action to audit
      await supabase.from('audit_logs').insert([{
        action: `country_entity_${actionType}`,
        module: 'country_dashboard',
        meta_json: { 
          entity_id: entityId, 
          country: countryName,
          action: actionType,
          reason: reason || null,
          timestamp: new Date().toISOString()
        }
      }]);
      
      toast.success(`Action "${actionType}" executed for entity ${entityId}`);
      setSelectedEntity(null);
    } catch (error) {
      toast.error("Failed to execute action");
    }
  }, [countryName]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-orange-950/10 to-slate-950">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{countryName} Live Map</h1>
            <p className="text-sm text-slate-400">{continent} • Country Operations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Top KPI Action Boxes */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {actionKPIs.map((kpi) => (
            <motion.div
              key={kpi.id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="bg-slate-900/50 border-slate-700/50 hover:border-orange-500/30 transition-all h-full">
                <CardContent className="p-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mb-1 bg-gradient-to-br",
                    kpi.color
                  )}>
                    <kpi.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className={cn(
                    "text-lg font-bold",
                    kpi.count > 0 ? "text-white" : "text-slate-500"
                  )}>
                    {kpi.count}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{kpi.title}</p>
                  <p className="text-[8px] text-slate-500">{kpi.lastUpdate}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content: Map + Detail Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center: Live Map */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: zoom * 150,
                center: mapCenter as [number, number]
              }}
              className="w-full h-full"
            >
              <ZoomableGroup zoom={1} center={mapCenter as [number, number]}>
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
                        r={entity.type === "issue" ? 8 : 6}
                        fill={getMarkerColor(entity)}
                        stroke="#fff"
                        strokeWidth={2}
                        opacity={0.9}
                      />
                      {entity.openIssues > 0 && entity.type !== "issue" && (
                        <circle
                          r={4}
                          cx={5}
                          cy={-5}
                          fill="#ef4444"
                          stroke="#fff"
                          strokeWidth={1}
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
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.franchise_active }} />
                <span className="text-xs text-slate-300">Franchise (Active)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.franchise_pending }} />
                <span className="text-xs text-slate-300">Franchise (Pending)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.reseller_active }} />
                <span className="text-xs text-slate-300">Reseller (Active)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.influencer }} />
                <span className="text-xs text-slate-300">Influencer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.issue }} />
                <span className="text-xs text-slate-300">Issue / Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detail Panel */}
        <AnimatePresence>
          {selectedEntity && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 border-l border-slate-700/50 bg-slate-900/95 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="font-semibold text-white">Entity Details</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedEntity(null)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="p-4 space-y-4">
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
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Revenue</p>
                        <p className="text-sm font-medium text-emerald-400">
                          ${selectedEntity.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Open Issues</p>
                        <p className={cn(
                          "text-sm font-medium",
                          selectedEntity.openIssues > 0 ? "text-red-400" : "text-slate-400"
                        )}>
                          {selectedEntity.openIssues}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Last Activity</p>
                      <p className="text-sm text-slate-300">{selectedEntity.lastActivity}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-700/50 space-y-2">
                    <p className="text-xs font-medium text-slate-400 mb-3">Actions</p>
                    
                    {selectedEntity.status === "pending" && (
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                        onClick={() => handleAction("approve", selectedEntity.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => handleAction("review", selectedEntity.id)}
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </Button>
                    
                    {selectedEntity.status !== "pending" && (
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                        onClick={() => handleAction("suspend", selectedEntity.id)}
                      >
                        <Pause className="w-4 h-4" />
                        Suspend
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                      onClick={() => handleAction("send_back", selectedEntity.id, "Requires revision")}
                    >
                      <Send className="w-4 h-4" />
                      Send Back
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleAction("reject", selectedEntity.id, "Does not meet criteria")}
                    >
                      <Ban className="w-4 h-4" />
                      Reject
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

export default CountryLiveMapDashboard;
