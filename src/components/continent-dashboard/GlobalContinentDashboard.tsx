/**
 * Global Continent Admin Dashboard
 * Default view with world map, sidebar, and dashboard boxes
 * Shows when no specific continent is selected
 */

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import {
  Globe2, Map, Users, Building2, Store, Clock, DollarSign,
  FileText, ChevronLeft, ChevronRight, LayoutDashboard, AlertTriangle,
  Target, Shield, TrendingUp, Eye, CheckCircle, XCircle, Pause,
  Activity, Zap, Server
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

interface GlobalContinentDashboardProps {
  onBack?: () => void;
  onContinentClick?: (continentId: string) => void;
}

type SidebarSection = 
  | "overview"
  | "world_map"
  | "countries"
  | "country_admins"
  | "franchise_control"
  | "reseller_control"
  | "leads"
  | "payments"
  | "approvals"
  | "activity_log";

const sidebarItems: { id: SidebarSection; label: string; icon: any; readOnly?: boolean }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "world_map", label: "World Map", icon: Map },
  { id: "countries", label: "Countries", icon: Globe2 },
  { id: "country_admins", label: "Country Admins", icon: Users },
  { id: "franchise_control", label: "Franchise Control", icon: Building2 },
  { id: "reseller_control", label: "Reseller Control", icon: Store },
  { id: "leads", label: "Leads (View Only)", icon: Target, readOnly: true },
  { id: "payments", label: "Payments (Read-Only)", icon: DollarSign, readOnly: true },
  { id: "approvals", label: "Approvals", icon: Clock },
  { id: "activity_log", label: "Activity Log", icon: FileText },
];

// Continent data with markers
const continentMarkers = [
  { id: "asia", name: "Asia", coordinates: [100, 35] as [number, number], color: "#ef4444", countries: 48, admins: 45, franchises: 1250, resellers: 3400, icon: "🌏" },
  { id: "africa", name: "Africa", coordinates: [20, 0] as [number, number], color: "#f59e0b", countries: 54, admins: 48, franchises: 890, resellers: 2100, icon: "🌍" },
  { id: "europe", name: "Europe", coordinates: [15, 50] as [number, number], color: "#3b82f6", countries: 44, admins: 42, franchises: 1100, resellers: 2800, icon: "🌍" },
  { id: "north_america", name: "North America", coordinates: [-100, 45] as [number, number], color: "#10b981", countries: 23, admins: 21, franchises: 950, resellers: 2200, icon: "🌎" },
  { id: "south_america", name: "South America", coordinates: [-60, -15] as [number, number], color: "#84cc16", countries: 12, admins: 10, franchises: 420, resellers: 980, icon: "🌎" },
  { id: "oceania", name: "Oceania", coordinates: [135, -25] as [number, number], color: "#8b5cf6", countries: 14, admins: 12, franchises: 280, resellers: 650, icon: "🌏" },
];

// Dashboard box data
const dashboardBoxes = [
  { id: "countries", title: "Countries", total: 195, active: 178, inactive: 17, icon: Globe2, color: "from-blue-500 to-cyan-500", actions: ["View"] },
  { id: "country_admins", title: "Country Admins", total: 178, pending: 12, icon: Users, color: "from-purple-500 to-violet-500", actions: ["Approve", "Reject"] },
  { id: "franchises", title: "Franchises", active: 4890, revenue: "$2.4M", icon: Building2, color: "from-emerald-500 to-green-500", actions: ["View"] },
  { id: "resellers", title: "Resellers", active: 12130, pending: 45, icon: Store, color: "from-orange-500 to-amber-500", actions: ["Approve", "Suspend"] },
  { id: "leads", title: "Leads (Read-Only)", newLeads: 2340, converted: 1890, icon: Target, color: "from-pink-500 to-rose-500", actions: ["View"], readOnly: true },
  { id: "payments", title: "Payments", revenue: "$8.7M", pending: "$420K", icon: DollarSign, color: "from-indigo-500 to-blue-500", actions: [], readOnly: true },
];

const GlobalContinentDashboard = ({ onBack, onContinentClick }: GlobalContinentDashboardProps) => {
  const [activeSection, setActiveSection] = useState<SidebarSection>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<typeof continentMarkers[0] | null>(null);

  // Total stats
  const totals = useMemo(() => ({
    countries: continentMarkers.reduce((sum, c) => sum + c.countries, 0),
    admins: continentMarkers.reduce((sum, c) => sum + c.admins, 0),
    franchises: continentMarkers.reduce((sum, c) => sum + c.franchises, 0),
    resellers: continentMarkers.reduce((sum, c) => sum + c.resellers, 0),
  }), []);

  const handleContinentClick = (continent: typeof continentMarkers[0]) => {
    setSelectedContinent(continent);
    if (onContinentClick) {
      onContinentClick(continent.id);
    }
  };

  // Button action handlers
  const handleBoxAction = useCallback((action: string, boxId: string, boxTitle: string) => {
    switch (action) {
      case "View":
        toast.info(`Viewing ${boxTitle}`, {
          description: `Opening ${boxTitle.toLowerCase()} management panel...`,
          duration: 2000
        });
        break;
      case "Approve":
        toast.success(`Approve ${boxTitle}`, {
          description: `Opening approval queue for ${boxTitle.toLowerCase()}...`,
          duration: 2000
        });
        break;
      case "Reject":
        toast.warning(`Reject ${boxTitle}`, {
          description: `Opening rejection panel for ${boxTitle.toLowerCase()}...`,
          duration: 2000
        });
        break;
      case "Suspend":
        toast.warning(`Suspend ${boxTitle}`, {
          description: `Opening suspension controls for ${boxTitle.toLowerCase()}...`,
          duration: 2000
        });
        break;
      default:
        toast.info(`${action} ${boxTitle}`, { duration: 2000 });
    }
  }, []);

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Left Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 256 }}
        className="h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">Continent Admin</p>
                <p className="text-[10px] text-slate-400">Scope: Global</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 text-slate-400 hover:text-white"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.id;
              
              const button = (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    sidebarCollapsed && "justify-center px-2",
                    isActive
                      ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-blue-400" : "text-slate-400"
                  )} />
                  {!sidebarCollapsed && (
                    <span className="truncate text-sm flex items-center gap-2">
                      {item.label}
                      {item.readOnly && (
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-4 border-slate-600">
                          Read
                        </Badge>
                      )}
                    </span>
                  )}
                </Button>
              );

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.id} delayDuration={0}>
                    <TooltipTrigger asChild>
                      {button}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return button;
            })}
          </nav>
        </ScrollArea>

        {/* Back Button */}
        {onBack && !sidebarCollapsed && (
          <div className="p-3 border-t border-slate-700/50">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full gap-2 border-slate-700 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Control Panel
            </Button>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Continent Admin Dashboard</h1>
              <p className="text-sm text-slate-400">Global Monitoring & Control</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 gap-1">
                <Activity className="w-3 h-3" /> RUNNING
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 gap-1">
                <Zap className="w-3 h-3" /> AI ACTIVE
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 gap-1">
                <Server className="w-3 h-3" /> HEALTHY
              </Badge>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* World Map Section */}
            <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-400" />
                  Global Operations Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] relative">
                  <ComposableMap
                    projectionConfig={{
                      scale: 140,
                      center: [0, 20]
                    }}
                    className="w-full h-full"
                  >
                    <ZoomableGroup zoom={1}>
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#334155"
                              stroke="#475569"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none" },
                                hover: { fill: "#475569", outline: "none" },
                                pressed: { fill: "#334155", outline: "none" },
                              }}
                            />
                          ))
                        }
                      </Geographies>

                      {/* Continent Markers */}
                      {continentMarkers.map((continent) => (
                        <Marker
                          key={continent.id}
                          coordinates={continent.coordinates}
                          onClick={() => handleContinentClick(continent)}
                        >
                          <motion.g
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer"
                          >
                            <circle
                              r={18}
                              fill={continent.color}
                              fillOpacity={0.3}
                              stroke={continent.color}
                              strokeWidth={2}
                            />
                            <circle
                              r={10}
                              fill={continent.color}
                              className="animate-pulse"
                            />
                            <text
                              textAnchor="middle"
                              y={-25}
                              style={{
                                fontFamily: "system-ui",
                                fill: "#fff",
                                fontSize: "10px",
                                fontWeight: "bold"
                              }}
                            >
                              {continent.name}
                            </text>
                          </motion.g>
                        </Marker>
                      ))}
                    </ZoomableGroup>
                  </ComposableMap>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-slate-900/90 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2">Click continent to view details</p>
                    <div className="grid grid-cols-2 gap-2">
                      {continentMarkers.map((c) => (
                        <div key={c.id} className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="text-slate-300">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute top-4 right-4 bg-slate-900/90 p-3 rounded-lg border border-slate-700/50">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">{totals.countries}</p>
                        <p className="text-[10px] text-slate-400">Countries</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-400">{totals.admins}</p>
                        <p className="text-[10px] text-slate-400">Admins</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-400">{totals.franchises.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">Franchises</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-400">{totals.resellers.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">Resellers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Boxes Grid */}
            <div className="grid grid-cols-2 gap-4">
              {dashboardBoxes.map((box) => (
                <Card 
                  key={box.id} 
                  className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                        box.color
                      )}>
                        <box.icon className="w-6 h-6 text-white" />
                      </div>
                      {box.readOnly && (
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          Read-Only
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-3">{box.title}</h3>

                    <div className="space-y-2 mb-4">
                      {box.total !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Total</span>
                          <span className="text-white font-medium">{box.total}</span>
                        </div>
                      )}
                      {box.active !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Active</span>
                          <span className="text-emerald-400 font-medium">{box.active}</span>
                        </div>
                      )}
                      {box.inactive !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Inactive</span>
                          <span className="text-red-400 font-medium">{box.inactive}</span>
                        </div>
                      )}
                      {box.pending !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Pending</span>
                          <span className="text-amber-400 font-medium">{box.pending}</span>
                        </div>
                      )}
                      {box.revenue !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Revenue</span>
                          <span className="text-emerald-400 font-medium">{box.revenue}</span>
                        </div>
                      )}
                      {box.newLeads !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">New Leads</span>
                          <span className="text-blue-400 font-medium">{box.newLeads.toLocaleString()}</span>
                        </div>
                      )}
                      {box.converted !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Converted</span>
                          <span className="text-green-400 font-medium">{box.converted.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {box.actions.length > 0 && (
                      <div className="flex gap-2">
                        {box.actions.map((action) => (
                          <Button
                            key={action}
                            variant="outline"
                            size="sm"
                            onClick={() => handleBoxAction(action, box.id, box.title)}
                            className={cn(
                              "flex-1 text-xs",
                              action === "View" && "border-blue-500/50 text-blue-400 hover:bg-blue-500/10",
                              action === "Approve" && "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10",
                              action === "Reject" && "border-red-500/50 text-red-400 hover:bg-red-500/10",
                              action === "Suspend" && "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                            )}
                          >
                            {action === "View" && <Eye className="w-3 h-3 mr-1" />}
                            {action === "Approve" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {action === "Reject" && <XCircle className="w-3 h-3 mr-1" />}
                            {action === "Suspend" && <Pause className="w-3 h-3 mr-1" />}
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default GlobalContinentDashboard;
