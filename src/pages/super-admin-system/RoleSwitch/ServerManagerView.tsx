import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Server, User, Shield, Activity, Eye, AlertTriangle, ChevronRight, X,
  CheckCircle, Database, Cpu, HardDrive, RefreshCw, FileText, 
  Terminal, Clock, Zap, Wifi, WifiOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Sample data for Server Managers
const serverManagers = [
  {
    id: "sm-001",
    name: "Alex Thompson",
    email: "a.thompson@system.com",
    avatar: "",
    assignedServer: "Primary Cluster",
    serverRegion: "US-East",
    dataCenter: "AWS Virginia",
    status: "online",
    serverStatus: "healthy",
    cpuUsage: 45,
    memoryUsage: 62,
    lastCheck: "2 min ago",
  },
  {
    id: "sm-002",
    name: "Yuki Tanaka",
    email: "y.tanaka@system.com",
    avatar: "",
    assignedServer: "Asia Pacific Node",
    serverRegion: "AP-Tokyo",
    dataCenter: "AWS Tokyo",
    status: "online",
    serverStatus: "healthy",
    cpuUsage: 38,
    memoryUsage: 55,
    lastCheck: "1 min ago",
  },
  {
    id: "sm-003",
    name: "Marcus Weber",
    email: "m.weber@system.com",
    avatar: "",
    assignedServer: "EU Central",
    serverRegion: "EU-Frankfurt",
    dataCenter: "GCP Frankfurt",
    status: "online",
    serverStatus: "warning",
    cpuUsage: 78,
    memoryUsage: 85,
    lastCheck: "30 sec ago",
  },
  {
    id: "sm-004",
    name: "Sarah Mitchell",
    email: "s.mitchell@system.com",
    avatar: "",
    assignedServer: "Backup Cluster",
    serverRegion: "US-West",
    dataCenter: "Azure California",
    status: "offline",
    serverStatus: "down",
    cpuUsage: 0,
    memoryUsage: 0,
    lastCheck: "15 min ago",
  },
  {
    id: "sm-005",
    name: "Raj Patel",
    email: "r.patel@system.com",
    avatar: "",
    assignedServer: "India Node",
    serverRegion: "AP-Mumbai",
    dataCenter: "AWS Mumbai",
    status: "online",
    serverStatus: "healthy",
    cpuUsage: 52,
    memoryUsage: 48,
    lastCheck: "1 min ago",
  },
];

// Powers list for Server Manager
const smPowers = [
  "Can monitor server health",
  "Can restart services",
  "Can view system logs",
  "Can manage backups",
  "Can raise critical alerts",
  "Can access infrastructure metrics",
  "Can perform maintenance tasks",
  "Cannot access user PII data",
];

// Tech activity log sample
const techActivityLog = [
  { time: "2 min ago", action: "Health check completed", target: "Primary Cluster", type: "info" },
  { time: "10 min ago", action: "Service restarted", target: "API Gateway", type: "warning" },
  { time: "30 min ago", action: "Backup completed", target: "Database", type: "success" },
  { time: "1 hr ago", action: "Alert resolved", target: "Memory threshold", type: "success" },
  { time: "2 hrs ago", action: "Error detected", target: "Auth Service", type: "error" },
];

const ServerManagerView = () => {
  const [selectedManager, setSelectedManager] = useState<typeof serverManagers[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  const handleSelectManager = (manager: typeof serverManagers[0]) => {
    setSelectedManager(manager);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedManager(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/50";
      case "warning":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
      case "down":
      case "offline":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return <Wifi className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "down":
      case "offline":
        return <WifiOff className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-zinc-950">
      {/* Main List Panel - Dark Tech Theme */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-zinc-700 flex items-center justify-center border border-emerald-500/30">
              <Server className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Server Manager Dashboard</h1>
              <p className="text-emerald-400/70 font-mono text-sm">Infrastructure & Technical Operations</p>
            </div>
          </div>

          {/* Stats Row - Tech Style */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Card className="bg-zinc-900 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 font-mono">MANAGERS</p>
                    <p className="text-2xl font-bold text-emerald-400 font-mono">{serverManagers.length}</p>
                  </div>
                  <User className="w-8 h-8 text-emerald-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 font-mono">ONLINE</p>
                    <p className="text-2xl font-bold text-emerald-400 font-mono">
                      {serverManagers.filter(s => s.status === "online").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 font-mono">WARNINGS</p>
                    <p className="text-2xl font-bold text-yellow-400 font-mono">
                      {serverManagers.filter(s => s.serverStatus === "warning").length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 font-mono">DOWN</p>
                    <p className="text-2xl font-bold text-red-400 font-mono">
                      {serverManagers.filter(s => s.serverStatus === "down").length}
                    </p>
                  </div>
                  <WifiOff className="w-8 h-8 text-red-400/30" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* List View - Tech Theme */}
        <Card className="bg-zinc-900/50 backdrop-blur border-zinc-700">
          <CardHeader className="pb-3 border-b border-zinc-700">
            <CardTitle className="text-lg flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400">&gt;</span> Server Manager Registry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800">
              {serverManagers.map((manager) => (
                <motion.div
                  key={manager.id}
                  whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectManager(manager)}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-200",
                    selectedManager?.id === manager.id
                      ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                      : ""
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="w-12 h-12 border-2 border-zinc-700">
                      <AvatarImage src={manager.avatar} />
                      <AvatarFallback className="bg-zinc-800 text-emerald-400 font-mono">
                        {manager.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{manager.name}</h3>
                        <Badge className={cn("text-xs font-mono", getStatusColor(manager.status))}>
                          {getStatusIcon(manager.status)}
                          <span className="ml-1">{manager.status.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500 font-mono">{manager.assignedServer}</p>
                    </div>

                    {/* Server Status */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <Badge className={cn("font-mono", getStatusColor(manager.serverStatus))}>
                          {manager.serverStatus.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-zinc-500 mt-1 font-mono">{manager.serverRegion}</p>
                      </div>

                      {/* Resource Usage */}
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-500 font-mono">CPU</span>
                          <span className={cn("font-mono", manager.cpuUsage > 70 ? "text-yellow-400" : "text-emerald-400")}>
                            {manager.cpuUsage}%
                          </span>
                        </div>
                        <Progress 
                          value={manager.cpuUsage} 
                          className="h-1.5 bg-zinc-800"
                        />
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-zinc-500 font-mono">Last Check</p>
                        <p className="text-sm font-mono text-foreground">{manager.lastCheck}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Panel - Dark Tech Theme */}
      <AnimatePresence>
        {detailPanelOpen && selectedManager && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[420px] bg-zinc-900 border-l border-zinc-700 flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-zinc-700 flex items-center justify-between bg-gradient-to-r from-zinc-900 to-zinc-800">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center border",
                  selectedManager.serverStatus === "healthy" ? "bg-emerald-500/20 border-emerald-500/50" :
                  selectedManager.serverStatus === "warning" ? "bg-yellow-500/20 border-yellow-500/50" :
                  "bg-red-500/20 border-red-500/50"
                )}>
                  <Server className={cn(
                    "w-5 h-5",
                    selectedManager.serverStatus === "healthy" ? "text-emerald-400" :
                    selectedManager.serverStatus === "warning" ? "text-yellow-400" :
                    "text-red-400"
                  )} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{selectedManager.name}</h3>
                  <p className="text-sm text-zinc-500 font-mono">{selectedManager.assignedServer}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClosePanel} className="text-zinc-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Section 1: Identity */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 font-mono">
                    // IDENTITY
                  </h4>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4 space-y-3 font-mono text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">name:</span>
                        <span className="text-emerald-400">"{selectedManager.name}"</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">role:</span>
                        <span className="text-emerald-400">"server_manager"</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">server:</span>
                        <span className="text-emerald-400">"{selectedManager.assignedServer}"</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">datacenter:</span>
                        <span className="text-emerald-400">"{selectedManager.dataCenter}"</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="bg-zinc-700" />

                {/* Section 2: Powers */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 font-mono">
                    // PERMISSIONS
                  </h4>
                  <Card className="bg-zinc-800/50 border-emerald-500/20">
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {smPowers.map((power, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 font-mono">{power}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="bg-zinc-700" />

                {/* Section 3: Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 font-mono">
                    // ACTIONS
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-emerald-400 font-mono text-xs">
                      <Eye className="w-4 h-4" />
                      server.status()
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-cyan-400 font-mono text-xs">
                      <RefreshCw className="w-4 h-4" />
                      service.restart()
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-purple-400 font-mono text-xs">
                      <FileText className="w-4 h-4" />
                      logs.view()
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-blue-400 font-mono text-xs">
                      <Database className="w-4 h-4" />
                      backup.trigger()
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 bg-zinc-800 border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-400 font-mono text-xs col-span-2">
                      <AlertTriangle className="w-4 h-4" />
                      alert.raise()
                    </Button>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                {/* Section 4: Tech Activity Log */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 font-mono flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                    // ACTIVITY_LOG
                  </h4>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4">
                      <div className="space-y-3 font-mono text-xs">
                        {techActivityLog.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="text-zinc-600 min-w-[70px]">
                              {action.time}
                            </span>
                            <div className="flex-1">
                              <span className={cn(
                                action.type === "error" ? "text-red-400" :
                                action.type === "warning" ? "text-yellow-400" :
                                action.type === "success" ? "text-emerald-400" :
                                "text-zinc-400"
                              )}>
                                [{action.type.toUpperCase()}]
                              </span>
                              <span className="text-zinc-300 ml-2">{action.action}</span>
                              <span className="text-cyan-400 ml-1">@{action.target}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Resource Usage */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 font-mono">
                    // RESOURCES
                  </h4>
                  <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-2 font-mono">
                          <span className="text-zinc-500 flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU</span>
                          <span className={cn(selectedManager.cpuUsage > 70 ? "text-yellow-400" : "text-emerald-400")}>
                            {selectedManager.cpuUsage}%
                          </span>
                        </div>
                        <Progress value={selectedManager.cpuUsage} className="h-2 bg-zinc-700" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-2 font-mono">
                          <span className="text-zinc-500 flex items-center gap-1"><HardDrive className="w-3 h-3" /> Memory</span>
                          <span className={cn(selectedManager.memoryUsage > 80 ? "text-red-400" : selectedManager.memoryUsage > 60 ? "text-yellow-400" : "text-emerald-400")}>
                            {selectedManager.memoryUsage}%
                          </span>
                        </div>
                        <Progress value={selectedManager.memoryUsage} className="h-2 bg-zinc-700" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServerManagerView;
