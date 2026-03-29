import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server, Layers, Database, HardDrive, Cpu, Activity, Shield, AlertTriangle,
  RefreshCw, Play, Pause, Power, Search, Eye, Terminal, Zap, Brain,
  CheckCircle2, X, Clock, Network, Gauge, Lock, Upload, Download, 
  AlertCircle, TrendingUp, TrendingDown, Minus, ChevronRight, RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ServerManagerSidebar, { ServerSection } from "./ServerManagerSidebar";
import {
  ServerInstance, ServerKPI, AIAutomationAction, SecurityThreat,
  generateSampleServers, generateClusters, generateAIActions, generateSecurityThreats
} from "./types";

const ServerManagementDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<ServerSection>("dashboard");
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "offline" | "degraded">("all");

  const servers = useMemo(() => generateSampleServers(), []);
  const clusters = useMemo(() => generateClusters(), []);
  const aiActions = useMemo(() => generateAIActions(), []);
  const securityThreats = useMemo(() => generateSecurityThreats(), []);

  // Calculate metrics
  const totalServers = servers.length;
  const activeServers = servers.filter(s => s.status === "online").length;
  const offlineServers = servers.filter(s => s.status === "offline" || s.status === "degraded").length;
  const avgCpu = Math.round(servers.reduce((sum, s) => sum + s.cpu.usage, 0) / servers.length);
  const avgRam = Math.round(servers.reduce((sum, s) => sum + (s.ram.used / s.ram.total) * 100, 0) / servers.length);
  const securityThreatsCount = securityThreats.filter(t => t.status !== "mitigated").length;
  const pendingPatches = 3;
  const backupStatus = 98;
  const clusterHealth = clusters.filter(c => c.status === "healthy").length;

  // Risk level calculation
  const riskLevel: "low" | "medium" | "high" = 
    offlineServers > 2 || securityThreatsCount > 3 ? "high" :
    offlineServers > 0 || securityThreatsCount > 1 ? "medium" : "low";

  const liveAlertsCount = offlineServers + securityThreatsCount + aiActions.filter(a => a.status === "pending" && a.requiresApproval).length;

  // 12 KPI Boxes
  const kpis: ServerKPI[] = useMemo(() => [
    { id: "total_servers", title: "Total Servers", value: totalServers, icon: Server, color: "from-blue-500 to-cyan-500", trend: "stable", source: "system", lastUpdate: "Real-time" },
    { id: "active_servers", title: "Active Servers", value: activeServers, icon: CheckCircle2, color: "from-emerald-500 to-green-500", trend: "stable", source: "system", lastUpdate: "Real-time" },
    { id: "offline_degraded", title: "Offline/Degraded", value: offlineServers, icon: AlertTriangle, color: offlineServers > 0 ? "from-red-500 to-rose-500" : "from-slate-500 to-zinc-500", trend: offlineServers > 0 ? "up" : "down", source: "system", lastUpdate: "1m ago" },
    { id: "cluster_health", title: "Cluster Health", value: `${clusterHealth}/${clusters.length}`, icon: Layers, color: "from-violet-500 to-purple-500", trend: "stable", source: "system", lastUpdate: "Real-time" },
    { id: "cpu_load", title: "CPU Load Avg", value: avgCpu, unit: "%", icon: Cpu, color: avgCpu > 80 ? "from-red-500 to-orange-500" : avgCpu > 60 ? "from-amber-500 to-yellow-500" : "from-emerald-500 to-green-500", trend: avgCpu > 70 ? "up" : "stable", source: "system", lastUpdate: "10s ago" },
    { id: "memory_pressure", title: "Memory Pressure", value: avgRam, unit: "%", icon: Database, color: avgRam > 85 ? "from-red-500 to-orange-500" : avgRam > 70 ? "from-amber-500 to-yellow-500" : "from-blue-500 to-cyan-500", trend: avgRam > 75 ? "up" : "stable", source: "system", lastUpdate: "10s ago" },
    { id: "storage_io", title: "Storage I/O Risk", value: 12, unit: "%", icon: HardDrive, color: "from-teal-500 to-cyan-500", trend: "down", source: "ai", lastUpdate: "1m ago" },
    { id: "network_latency", title: "Network Latency", value: 24, unit: "ms", icon: Network, color: "from-indigo-500 to-blue-500", trend: "stable", source: "system", lastUpdate: "5s ago" },
    { id: "security_threats", title: "Security Threats", value: securityThreatsCount, icon: Shield, color: securityThreatsCount > 0 ? "from-red-600 to-rose-500" : "from-emerald-500 to-green-500", trend: securityThreatsCount > 0 ? "up" : "down", source: "ai", lastUpdate: "Real-time" },
    { id: "patch_pending", title: "Patch/Update Pending", value: pendingPatches, icon: Upload, color: pendingPatches > 0 ? "from-amber-500 to-orange-500" : "from-slate-500 to-zinc-500", trend: "stable", source: "system", lastUpdate: "1h ago" },
    { id: "backup_status", title: "Backup Status", value: backupStatus, unit: "%", icon: Download, color: "from-green-500 to-emerald-500", trend: "stable", source: "system", lastUpdate: "2h ago" },
    { id: "ai_risk", title: "AI Risk Prediction", value: riskLevel === "high" ? "High" : riskLevel === "medium" ? "Medium" : "Low", icon: Brain, color: riskLevel === "high" ? "from-red-600 to-rose-500" : riskLevel === "medium" ? "from-amber-600 to-orange-500" : "from-emerald-500 to-green-500", trend: riskLevel === "low" ? "down" : "up", source: "ai", lastUpdate: "Real-time" },
  ], [totalServers, activeServers, offlineServers, clusterHealth, clusters.length, avgCpu, avgRam, securityThreatsCount, pendingPatches, backupStatus, riskLevel]);

  // Filter servers
  const filteredServers = useMemo(() => {
    return servers.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [servers, searchQuery, filterStatus]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Infrastructure data refreshed");
  }, []);

  const handleServerAction = useCallback(async (action: string, server: ServerInstance) => {
    try {
      await supabase.from('audit_logs').insert([{
        action: `server_${action}`,
        module: 'server_management',
        meta_json: {
          server_id: server.id,
          server_name: server.name,
          action,
          timestamp: new Date().toISOString()
        }
      }]);
      toast.success(`Action "${action}" executed on ${server.name}`);
    } catch (error) {
      toast.error("Action failed");
    }
  }, []);

  const handleAIAction = useCallback(async (action: AIAutomationAction, decision: "approve" | "reject") => {
    try {
      await supabase.from('audit_logs').insert([{
        action: `ai_action_${decision}`,
        module: 'server_management',
        meta_json: {
          ai_action_id: action.id,
          action_type: action.type,
          target: action.target,
          decision,
          timestamp: new Date().toISOString()
        }
      }]);
      toast.success(`AI action ${decision}ed: ${action.description}`);
    } catch (error) {
      toast.error("Failed to process AI action");
    }
  }, []);

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-zinc-500" />;
  };

  const getSourceBadge = (source: "system" | "ai" | "human") => {
    const colors = {
      system: "bg-zinc-500/20 text-zinc-400",
      ai: "bg-purple-500/20 text-purple-400",
      human: "bg-blue-500/20 text-blue-400"
    };
    return <span className={cn("text-[8px] px-1 py-0.5 rounded uppercase font-mono", colors[source])}>{source}</span>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "degraded": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "offline": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "maintenance": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50";
    }
  };

  const getSecurityColor = (state: string) => {
    switch (state) {
      case "secure": return "text-emerald-400";
      case "warning": return "text-amber-400";
      case "critical": return "text-red-400";
      default: return "text-zinc-400";
    }
  };

  const getRiskBadge = () => {
    const config = {
      low: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Low Risk" },
      medium: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Medium Risk" },
      high: { bg: "bg-red-500/20", text: "text-red-400", label: "High Risk" }
    };
    const c = config[riskLevel];
    return <Badge className={cn(c.bg, c.text, "border-0 font-mono")}>{c.label}</Badge>;
  };

  return (
    <div className="h-full flex bg-zinc-950">
      {/* LEFT SIDEBAR */}
      <ServerManagerSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP STATUS BAR */}
        <div className="sticky top-0 z-10 px-4 py-3 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-mono text-zinc-400">GLOBAL SCOPE</span>
            </div>
            <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 font-mono">
              {totalServers} Servers
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Alerts */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <AlertCircle className={cn("w-4 h-4", liveAlertsCount > 0 ? "text-amber-400" : "text-zinc-500")} />
              <span className="text-sm font-mono text-zinc-300">{liveAlertsCount} Alerts</span>
            </div>

            {/* Risk Level */}
            {getRiskBadge()}

            {/* AI Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono text-purple-400">AI Online</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 font-mono"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* 12 KPI GRID */}
        <div className="p-4 border-b border-zinc-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
            {kpis.map((kpi) => (
              <motion.div
                key={kpi.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => toast.info(`${kpi.title}: ${kpi.value}${kpi.unit || ""}`)}
              >
                <Card className="bg-zinc-900/80 border-zinc-800 hover:border-emerald-500/40 transition-all h-full">
                  <CardContent className="p-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br",
                      kpi.color
                    )}>
                      <kpi.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-bold text-white font-mono">
                        {kpi.value}{kpi.unit || ""}
                      </p>
                      {getTrendIcon(kpi.trend)}
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-1 font-mono">{kpi.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[9px] text-zinc-600 font-mono">{kpi.lastUpdate}</p>
                      {getSourceBadge(kpi.source)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT: Server Registry + AI Panel + Detail Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* SERVER REGISTRY */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Filters */}
            <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search servers..."
                  className="pl-9 bg-zinc-900 border-zinc-700 font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                {["all", "online", "offline", "degraded"].map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "font-mono text-xs",
                      filterStatus === status ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500"
                    )}
                    onClick={() => setFilterStatus(status as typeof filterStatus)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Server List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredServers.map((server) => (
                  <motion.div
                    key={server.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                    className={cn(
                      "p-4 rounded-lg border bg-zinc-900/50 cursor-pointer transition-all",
                      selectedServer?.id === server.id ? "border-emerald-500/50 bg-emerald-500/5" : "border-zinc-800"
                    )}
                    onClick={() => setSelectedServer(server)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Status Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        server.status === "online" ? "bg-emerald-500/20" :
                        server.status === "degraded" ? "bg-amber-500/20" : "bg-red-500/20"
                      )}>
                        <Server className={cn(
                          "w-5 h-5",
                          server.status === "online" ? "text-emerald-400" :
                          server.status === "degraded" ? "text-amber-400" : "text-red-400"
                        )} />
                      </div>

                      {/* Server Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white font-mono text-sm">{server.name}</h3>
                          <Badge className={cn("text-[10px] font-mono", getStatusColor(server.status))}>
                            {server.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-mono">
                          {server.region} • {server.dataCenter} • {server.type.toUpperCase()}
                        </p>
                      </div>

                      {/* Resource Bars */}
                      <div className="flex items-center gap-4">
                        <div className="w-20">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-zinc-500 font-mono">CPU</span>
                            <span className={cn("font-mono", server.cpu.usage > 80 ? "text-red-400" : server.cpu.usage > 60 ? "text-amber-400" : "text-emerald-400")}>
                              {server.cpu.usage}%
                            </span>
                          </div>
                          <Progress value={server.cpu.usage} className="h-1.5 bg-zinc-800" />
                        </div>
                        <div className="w-20">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-zinc-500 font-mono">RAM</span>
                            <span className={cn("font-mono", (server.ram.used / server.ram.total) > 0.85 ? "text-red-400" : "text-emerald-400")}>
                              {Math.round((server.ram.used / server.ram.total) * 100)}%
                            </span>
                          </div>
                          <Progress value={(server.ram.used / server.ram.total) * 100} className="h-1.5 bg-zinc-800" />
                        </div>
                        <div className="w-20">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-zinc-500 font-mono">DISK</span>
                            <span className="font-mono text-zinc-400">
                              {Math.round((server.disk.used / server.disk.total) * 100)}%
                            </span>
                          </div>
                          <Progress value={(server.disk.used / server.disk.total) * 100} className="h-1.5 bg-zinc-800" />
                        </div>
                      </div>

                      {/* Uptime & Security */}
                      <div className="text-right">
                        <p className="text-xs font-mono text-zinc-400">{server.uptime}</p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Shield className={cn("w-3 h-3", getSecurityColor(server.securityState))} />
                          <span className={cn("text-[10px] font-mono capitalize", getSecurityColor(server.securityState))}>
                            {server.securityState}
                          </span>
                        </div>
                      </div>

                      {/* Inline Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-emerald-400"
                          onClick={(e) => { e.stopPropagation(); handleServerAction("restart", server); }}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-amber-400"
                          onClick={(e) => { e.stopPropagation(); handleServerAction("pause", server); }}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-red-400"
                          onClick={(e) => { e.stopPropagation(); handleServerAction("shutdown", server); }}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-purple-400"
                          onClick={(e) => { e.stopPropagation(); handleServerAction("scan", server); }}
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>

                      <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* AI AUTOMATION PANEL */}
          <div className="w-80 border-l border-zinc-800 bg-zinc-900/50 flex flex-col">
            <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white font-mono">AI Automation</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {aiActions.map((action) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                        action.status === "executed" ? "bg-emerald-500/20" :
                        action.status === "pending" ? "bg-amber-500/20" :
                        action.status === "failed" ? "bg-red-500/20" : "bg-zinc-500/20"
                      )}>
                        {action.type === "threat-detected" ? <Shield className="w-3 h-3 text-red-400" /> :
                         action.type === "auto-restart" ? <RotateCcw className="w-3 h-3 text-cyan-400" /> :
                         action.type === "auto-scale" ? <Layers className="w-3 h-3 text-purple-400" /> :
                         action.type === "auto-patch" ? <Upload className="w-3 h-3 text-blue-400" /> :
                         action.type === "auto-backup" ? <Download className="w-3 h-3 text-emerald-400" /> :
                         <Zap className="w-3 h-3 text-amber-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white font-mono">{action.type.replace(/-/g, " ").toUpperCase()}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{action.target}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mb-2">{action.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={cn(
                        "text-[9px] font-mono",
                        action.status === "executed" ? "bg-emerald-500/20 text-emerald-400" :
                        action.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                        "bg-red-500/20 text-red-400"
                      )}>
                        {action.status.toUpperCase()}
                      </Badge>
                      <span className="text-[9px] text-zinc-500 font-mono">{action.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-zinc-500 mb-2">
                      <span className="font-mono">Confidence: {action.confidence}%</span>
                    </div>
                    {action.requiresApproval && action.status === "pending" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="flex-1 h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 font-mono"
                          onClick={() => handleAIAction(action, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-6 text-[10px] border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono"
                          onClick={() => handleAIAction(action, "reject")}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Security Threats Section */}
                <div className="mt-4 pt-4 border-t border-zinc-700">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-white font-mono">Security Threats</span>
                  </div>
                  {securityThreats.map((threat) => (
                    <div key={threat.id} className="p-2 rounded-lg bg-red-500/5 border border-red-500/20 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-red-400 uppercase">{threat.type}</span>
                        <Badge className={cn(
                          "text-[8px]",
                          threat.severity === "critical" ? "bg-red-500/20 text-red-400" :
                          threat.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                          "bg-amber-500/20 text-amber-400"
                        )}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-zinc-400">{threat.source} → {threat.target}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={cn(
                          "text-[9px] font-mono",
                          threat.status === "mitigated" ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {threat.status.toUpperCase()}
                        </span>
                        {threat.autoBlocked && (
                          <span className="text-[8px] text-purple-400 font-mono">AI BLOCKED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* SERVER DETAIL PANEL */}
          <AnimatePresence>
            {selectedServer && (
              <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col"
              >
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="font-semibold text-white font-mono text-sm">Server Details</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedServer(null)} className="h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {/* Server Identity */}
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 uppercase mb-2">// IDENTITY</h4>
                      <Card className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-3 space-y-2 font-mono text-xs">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">name:</span>
                            <span className="text-emerald-400">"{selectedServer.name}"</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">region:</span>
                            <span className="text-emerald-400">"{selectedServer.region}"</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">datacenter:</span>
                            <span className="text-emerald-400">"{selectedServer.dataCenter}"</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">provider:</span>
                            <span className="text-emerald-400">"{selectedServer.provider}"</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">os:</span>
                            <span className="text-emerald-400">"{selectedServer.os}"</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">ip:</span>
                            <span className="text-cyan-400">{selectedServer.ipAddress}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 uppercase mb-2">// RESOURCES</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-400 font-mono">CPU ({selectedServer.cpu.cores} cores)</span>
                            <span className="text-emerald-400 font-mono">{selectedServer.cpu.usage}%</span>
                          </div>
                          <Progress value={selectedServer.cpu.usage} className="h-2 bg-zinc-800" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-400 font-mono">RAM ({selectedServer.ram.total}GB)</span>
                            <span className="text-emerald-400 font-mono">{selectedServer.ram.used}GB</span>
                          </div>
                          <Progress value={(selectedServer.ram.used / selectedServer.ram.total) * 100} className="h-2 bg-zinc-800" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-400 font-mono">Disk ({selectedServer.disk.total}GB)</span>
                            <span className="text-zinc-400 font-mono">{selectedServer.disk.used}GB</span>
                          </div>
                          <Progress value={(selectedServer.disk.used / selectedServer.disk.total) * 100} className="h-2 bg-zinc-800" />
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 uppercase mb-2">// SERVICES</h4>
                      <div className="space-y-1">
                        {selectedServer.services.map((service, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded bg-zinc-800/50">
                            <span className="text-xs font-mono text-zinc-300">{service.name}</span>
                            <div className="flex items-center gap-2">
                              {service.port && <span className="text-[10px] text-zinc-500 font-mono">:{service.port}</span>}
                              <Badge className={cn(
                                "text-[9px] font-mono",
                                service.status === "running" ? "bg-emerald-500/20 text-emerald-400" :
                                service.status === "error" ? "bg-red-500/20 text-red-400" :
                                "bg-zinc-500/20 text-zinc-400"
                              )}>
                                {service.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 uppercase mb-2">// ACTIONS</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1 font-mono text-xs" onClick={() => handleServerAction("restart", selectedServer)}>
                          <RotateCcw className="w-3 h-3" /> Restart
                        </Button>
                        <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400 gap-1 font-mono text-xs" onClick={() => handleServerAction("pause", selectedServer)}>
                          <Pause className="w-3 h-3" /> Pause
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 gap-1 font-mono text-xs" onClick={() => handleServerAction("shutdown", selectedServer)}>
                          <Power className="w-3 h-3" /> Shutdown
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400 gap-1 font-mono text-xs" onClick={() => handleServerAction("isolate", selectedServer)}>
                          <Lock className="w-3 h-3" /> Isolate
                        </Button>
                        <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 gap-1 font-mono text-xs col-span-2" onClick={() => handleServerAction("scan", selectedServer)}>
                          <Search className="w-3 h-3" /> Force Scan
                        </Button>
                      </div>
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

export default ServerManagementDashboard;
