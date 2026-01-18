import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Users, Code2, Bug, Rocket, Monitor, Key, Activity,
  CheckCircle, XCircle, Eye, Play, RotateCcw, Lock, AlertTriangle,
  GitBranch, Server, Database, Cpu, HardDrive, Zap, Clock,
  ChevronRight, X, Filter, Search, Radio, Shield, Settings,
  RefreshCw, Pause, Power, FileCode, Box, Layers, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Developer Manager Data
const developerManagers = [
  {
    id: "1",
    name: "Alex Kumar",
    email: "alex.kumar@company.com",
    assignedProduct: "Core Platform",
    assignedSystem: "Backend Services",
    region: "Asia Pacific",
    status: "active",
    avatar: "👨‍💻",
    openBugs: 12,
    activeReleases: 3,
    lastActive: "2 mins ago"
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    assignedProduct: "Mobile App",
    assignedSystem: "iOS & Android",
    region: "North America",
    status: "active",
    avatar: "👩‍💻",
    openBugs: 8,
    activeReleases: 2,
    lastActive: "5 mins ago"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    assignedProduct: "API Gateway",
    assignedSystem: "Microservices",
    region: "Europe",
    status: "hold",
    avatar: "🧑‍💻",
    openBugs: 24,
    activeReleases: 1,
    lastActive: "1 hour ago"
  },
  {
    id: "4",
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    assignedProduct: "Admin Dashboard",
    assignedSystem: "Frontend",
    region: "Asia Pacific",
    status: "active",
    avatar: "👩‍💻",
    openBugs: 5,
    activeReleases: 4,
    lastActive: "10 mins ago"
  },
  {
    id: "5",
    name: "David Lee",
    email: "david.lee@company.com",
    assignedProduct: "Data Pipeline",
    assignedSystem: "ETL & Analytics",
    region: "Global",
    status: "active",
    avatar: "👨‍💻",
    openBugs: 15,
    activeReleases: 2,
    lastActive: "30 mins ago"
  }
];

// Powers list
const devManagerPowers = [
  { power: "Manage developers", scope: "Assigned teams", enabled: true },
  { power: "Assign development tasks", scope: "All projects", enabled: true },
  { power: "Manage source repositories", scope: "Read/Write", enabled: true },
  { power: "Manage APIs", scope: "Full access", enabled: true },
  { power: "Approve releases", scope: "Production", enabled: true },
  { power: "Control deployments", scope: "Staging + Prod", enabled: true },
  { power: "View system logs", scope: "All environments", enabled: true },
  { power: "Escalate critical incidents", scope: "L1-L3", enabled: true },
];

// Actions list
const devManagerActions = [
  { action: "View Developers", icon: Users, color: "text-cyan-400" },
  { action: "Assign Task", icon: FileCode, color: "text-blue-400" },
  { action: "Approve Release", icon: Rocket, color: "text-emerald-400" },
  { action: "Rollback Release", icon: RotateCcw, color: "text-amber-400" },
  { action: "Restart Service", icon: RefreshCw, color: "text-purple-400" },
  { action: "Lock System", icon: Lock, color: "text-rose-400" },
  { action: "Suspend Manager", icon: Pause, color: "text-red-400" },
];

// Developers mock data
const developers = [
  { id: "DEV001", name: "John Doe", role: "Frontend", tasks: 8, status: "active", avatar: "👨‍💻" },
  { id: "DEV002", name: "Jane Smith", role: "Backend", tasks: 12, status: "active", avatar: "👩‍💻" },
  { id: "DEV003", name: "Bob Wilson", role: "DevOps", tasks: 5, status: "busy", avatar: "🧑‍💻" },
  { id: "DEV004", name: "Lisa Wang", role: "Mobile", tasks: 6, status: "active", avatar: "👩‍💻" },
  { id: "DEV005", name: "Chris Brown", role: "Backend", tasks: 10, status: "away", avatar: "👨‍💻" },
];

// Bugs mock data
const bugs = [
  { id: "BUG-001", title: "Login timeout issue", severity: "critical", assignee: "John Doe", status: "in_progress" },
  { id: "BUG-002", title: "Payment gateway error", severity: "high", assignee: "Jane Smith", status: "open" },
  { id: "BUG-003", title: "UI alignment issue", severity: "low", assignee: "Lisa Wang", status: "resolved" },
  { id: "BUG-004", title: "API rate limiting bug", severity: "medium", assignee: "Bob Wilson", status: "in_progress" },
  { id: "BUG-005", title: "Memory leak in worker", severity: "critical", assignee: "Chris Brown", status: "open" },
];

// Releases mock data
const releases = [
  { version: "v3.2.1", status: "deployed", date: "2024-01-15", env: "Production" },
  { version: "v3.2.0", status: "deployed", date: "2024-01-10", env: "Production" },
  { version: "v3.3.0-beta", status: "staging", date: "2024-01-14", env: "Staging" },
  { version: "v3.1.9", status: "rolled_back", date: "2024-01-08", env: "Production" },
];

// Activity log
const activityLog = [
  { action: "Deployed v3.2.1 to production", time: "2 mins ago", type: "deploy" },
  { action: "Merged PR #542 - Auth fix", time: "15 mins ago", type: "code" },
  { action: "Resolved BUG-003", time: "1 hour ago", type: "bug" },
  { action: "Rolled back v3.1.9", time: "2 hours ago", type: "rollback" },
  { action: "Restarted API Gateway", time: "3 hours ago", type: "restart" },
];

interface DeveloperManagerDetailProps {
  manager: typeof developerManagers[0];
  onClose: () => void;
}

const DeveloperManagerDetail = ({ manager, onClose }: DeveloperManagerDetailProps) => {
  const [activeTab, setActiveTab] = useState("developers");
  const { toast } = useToast();

  const handleAction = (actionName: string) => {
    toast({
      title: `Action: ${actionName}`,
      description: `${actionName} for ${manager.name} initiated successfully.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-[650px] bg-zinc-950/98 border-l border-cyan-500/30 shadow-2xl z-50 overflow-hidden font-mono"
    >
      <ScrollArea className="h-full">
        <div className="p-6">
          {/* Header - Terminal style */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-700 to-zinc-900 flex items-center justify-center text-3xl shadow-lg border border-cyan-500/30">
                {manager.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 text-xs">$</span>
                  <h2 className="text-xl font-bold text-white">{manager.name}</h2>
                </div>
                <p className="text-sm text-cyan-400/70">{manager.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                    {manager.assignedProduct}
                  </Badge>
                  <Badge className="bg-zinc-700/50 text-zinc-300 border-zinc-600/50 text-xs">
                    {manager.assignedSystem}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-cyan-400 hover:bg-zinc-800">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Section 1: Identity - Terminal card */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/80 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Identity</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-mono">
              <div>
                <p className="text-zinc-500 text-xs">name:</p>
                <p className="text-white">{manager.name}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">email:</p>
                <p className="text-cyan-300">{manager.email}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">product:</p>
                <p className="text-emerald-400">{manager.assignedProduct}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">role_level:</p>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                  Developer Manager
                </Badge>
              </div>
            </div>
          </div>

          {/* Section 2: Powers */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/80 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Powers</span>
            </div>
            <div className="space-y-2">
              {devManagerPowers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-sm text-white font-mono">{item.power}</span>
                  </div>
                  <span className="text-xs text-cyan-400/70 font-mono">{item.scope}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Actions */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/80 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Quick Actions</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {devManagerActions.map((item, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(item.action);
                  }}
                  className={cn(
                    "justify-start gap-2 h-10 bg-zinc-800/50 hover:bg-zinc-700/60 border border-zinc-700/50 font-mono text-xs",
                    item.color
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.action}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Section 4: Developer Modules Tabs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Box className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Developer Modules</span>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-zinc-900 border border-cyan-500/20 grid grid-cols-4 h-auto p-1">
                <TabsTrigger value="developers" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono">
                  Devs
                </TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="bugs" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono">
                  Bugs
                </TabsTrigger>
                <TabsTrigger value="apis" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono">
                  APIs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="developers" className="mt-3">
                <div className="space-y-2">
                  {developers.map((dev) => (
                    <div key={dev.id} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-between font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{dev.avatar}</span>
                        <div>
                          <p className="text-sm text-white">{dev.name}</p>
                          <p className="text-xs text-cyan-400/70">{dev.role} • {dev.tasks} tasks</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        dev.status === "active" && "bg-emerald-500/20 text-emerald-400",
                        dev.status === "busy" && "bg-amber-500/20 text-amber-400",
                        dev.status === "away" && "bg-zinc-500/20 text-zinc-400"
                      )}>
                        {dev.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="mt-3">
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white font-mono">Sprint #24</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400">In Progress</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Backlog</span>
                      <span className="text-white">12 items</span>
                    </div>
                    <Progress value={65} className="h-2 bg-zinc-700" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Completed</span>
                      <span className="text-emerald-400">24/37 tasks</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bugs" className="mt-3">
                <div className="space-y-2">
                  {bugs.slice(0, 4).map((bug) => (
                    <div key={bug.id} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 font-mono">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">{bug.id}</p>
                          <p className="text-xs text-zinc-400">{bug.title}</p>
                        </div>
                        <Badge className={cn(
                          "text-xs",
                          bug.severity === "critical" && "bg-red-500/20 text-red-400",
                          bug.severity === "high" && "bg-orange-500/20 text-orange-400",
                          bug.severity === "medium" && "bg-amber-500/20 text-amber-400",
                          bug.severity === "low" && "bg-zinc-500/20 text-zinc-400"
                        )}>
                          {bug.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="apis" className="mt-3">
                <div className="space-y-2">
                  {[
                    { name: "/api/v1/users", status: "online", calls: "2.5k/min" },
                    { name: "/api/v1/orders", status: "online", calls: "1.8k/min" },
                    { name: "/api/v1/payments", status: "degraded", calls: "950/min" },
                    { name: "/api/v1/webhooks", status: "online", calls: "3.2k/min" },
                  ].map((api, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-between font-mono">
                      <code className="text-sm text-cyan-400">{api.name}</code>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400">{api.calls}</span>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          api.status === "online" && "bg-emerald-400",
                          api.status === "degraded" && "bg-amber-400"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Second row of tabs */}
            <Tabs defaultValue="releases" className="w-full mt-4">
              <TabsList className="w-full bg-zinc-900 border border-cyan-500/20 grid grid-cols-3 h-auto p-1">
                <TabsTrigger value="releases" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono">
                  Releases
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono">
                  Monitoring
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono">
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="releases" className="mt-3">
                <div className="space-y-2">
                  {releases.map((rel, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-between font-mono">
                      <div>
                        <code className="text-sm text-cyan-400">{rel.version}</code>
                        <p className="text-xs text-zinc-500">{rel.date} • {rel.env}</p>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        rel.status === "deployed" && "bg-emerald-500/20 text-emerald-400",
                        rel.status === "staging" && "bg-blue-500/20 text-blue-400",
                        rel.status === "rolled_back" && "bg-rose-500/20 text-rose-400"
                      )}>
                        {rel.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="monitoring" className="mt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-zinc-800/50 border border-emerald-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-zinc-400">Server Health</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-400">98.5%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/50 border border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-zinc-400">CPU Usage</span>
                    </div>
                    <p className="text-lg font-bold text-cyan-400">42%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/50 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-zinc-400">DB Latency</span>
                    </div>
                    <p className="text-lg font-bold text-amber-400">45ms</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/50 border border-emerald-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-zinc-400">Uptime</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-400">99.99%</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-3">
                <div className="space-y-2">
                  {[
                    { name: "API Keys", status: "active", count: 12 },
                    { name: "Env Permissions", status: "configured", count: 8 },
                    { name: "Config Changes", status: "logged", count: 156 },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-white">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">{item.count}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">{item.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Section 5: Tech Activity Log */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Tech Activity Log</span>
            </div>
            <div className="space-y-2 font-mono">
              {activityLog.map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    log.type === "deploy" && "bg-emerald-400",
                    log.type === "code" && "bg-cyan-400",
                    log.type === "bug" && "bg-amber-400",
                    log.type === "rollback" && "bg-rose-400",
                    log.type === "restart" && "bg-purple-400"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{log.action}</p>
                  </div>
                  <span className="text-xs text-zinc-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

const DeveloperManagementDashboard = () => {
  const [selectedManager, setSelectedManager] = useState<typeof developerManagers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredManagers = developerManagers.filter((manager) => {
    const matchesSearch = manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.assignedProduct.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = filterProduct === "all" || manager.assignedProduct === filterProduct;
    const matchesStatus = filterStatus === "all" || manager.status === filterStatus;
    return matchesSearch && matchesProduct && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 p-6 font-mono">
      {/* Header - Terminal style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-zinc-900 flex items-center justify-center shadow-lg border border-cyan-500/30" style={{ boxShadow: '0 8px 24px rgba(6, 182, 212, 0.2)' }}>
            <Terminal className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 text-sm">$</span>
              <h1 className="text-2xl font-bold text-white">Developer Manager Dashboard</h1>
            </div>
            <p className="text-sm text-cyan-400/70">Tech & Engineering Operations • System Control</p>
          </div>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          <Terminal className="w-3 h-3 mr-1.5" />
          TECH THEME ACTIVE
        </Badge>
      </motion.div>

      {/* Stats Overview - Terminal metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: "Active Developers", value: "47", icon: Code2, trend: "+5", color: "border-cyan-500/50", textColor: "text-cyan-400" },
          { label: "Open Bugs", value: "64", icon: Bug, trend: "-12", color: "border-amber-500/50", textColor: "text-amber-400" },
          { label: "Active Releases", value: "12", icon: Rocket, trend: "+3", color: "border-emerald-500/50", textColor: "text-emerald-400" },
          { label: "System Uptime", value: "99.9%", icon: Server, trend: "stable", color: "border-emerald-500/50", textColor: "text-emerald-400" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className={cn("p-4 rounded-xl bg-zinc-900/80 border backdrop-blur-xl", stat.color)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-zinc-500 mb-1 uppercase">{stat.label}</p>
                <p className={cn("text-2xl font-bold", stat.textColor)}>{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">{stat.trend}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <stat.icon className={cn("w-5 h-5", stat.textColor)} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/50" />
          <Input
            placeholder="grep -i manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 font-mono"
          />
        </div>
        <Select value={filterProduct} onValueChange={setFilterProduct}>
          <SelectTrigger className="w-44 bg-zinc-900 border-zinc-700 text-white font-mono">
            <Layers className="w-4 h-4 mr-2 text-cyan-400" />
            <SelectValue placeholder="Product" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="Core Platform">Core Platform</SelectItem>
            <SelectItem value="Mobile App">Mobile App</SelectItem>
            <SelectItem value="API Gateway">API Gateway</SelectItem>
            <SelectItem value="Admin Dashboard">Admin Dashboard</SelectItem>
            <SelectItem value="Data Pipeline">Data Pipeline</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700 text-white font-mono">
            <Filter className="w-4 h-4 mr-2 text-cyan-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Developer Manager List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
          <h2 className="text-lg font-bold text-white">All Developer Managers</h2>
          <Badge variant="outline" className="text-cyan-400 border-cyan-500/50 font-mono">
            {filteredManagers.length} found
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredManagers.map((manager, idx) => (
            <motion.div
              key={manager.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              onClick={() => setSelectedManager(manager)}
              className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/50 hover:border-cyan-500/50 cursor-pointer transition-all group hover:scale-[1.01]"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-zinc-800 flex items-center justify-center text-2xl shadow-lg border border-cyan-500/20">
                  {manager.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-white truncate">{manager.name}</h3>
                    <Badge className={cn(
                      "text-xs",
                      manager.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    )}>
                      {manager.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-cyan-400/70 mb-2">{manager.assignedProduct} • {manager.assignedSystem}</p>
                  <div className="flex items-center gap-4 text-sm font-mono">
                    <div className="flex items-center gap-1">
                      <Bug className="w-3 h-3 text-amber-400" />
                      <span className="text-amber-400">{manager.openBugs} bugs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Rocket className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">{manager.activeReleases} releases</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedManager && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelectedManager(null)}
            />
            <DeveloperManagerDetail manager={selectedManager} onClose={() => setSelectedManager(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeveloperManagementDashboard;
