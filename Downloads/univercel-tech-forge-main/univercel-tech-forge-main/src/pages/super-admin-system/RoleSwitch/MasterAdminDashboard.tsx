import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Crown, Shield, Globe2, Users, Lock, Key, AlertTriangle, FileText,
  Eye, Plus, Trash2, Settings, Activity, Download, Database, Cpu,
  CheckCircle2, XCircle, Clock, Map, BarChart3, Gavel, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data for Super Admins
const mockSuperAdmins = [
  { 
    id: "SA-001", 
    name: "James Wilson", 
    email: "james.w@system.com",
    status: "active",
    assignedContinents: ["Europe", "Asia"],
    lastActive: "2 min ago",
    createdAt: "2024-01-15"
  },
  { 
    id: "SA-002", 
    name: "Maria Santos", 
    email: "maria.s@system.com",
    status: "active",
    assignedContinents: ["Americas"],
    lastActive: "15 min ago",
    createdAt: "2024-02-20"
  },
  { 
    id: "SA-003", 
    name: "Chen Wei", 
    email: "chen.w@system.com",
    status: "hold",
    assignedContinents: ["Asia-Pacific"],
    lastActive: "1 hour ago",
    createdAt: "2024-03-10"
  },
];

// Mock audit logs
const mockAuditLogs = [
  { id: 1, action: "Role Created", target: "New Super Admin", actor: "Master Admin", timestamp: "2 min ago", severity: "info" },
  { id: 2, action: "System Lock Activated", target: "Finance Module", actor: "Master Admin", timestamp: "15 min ago", severity: "critical" },
  { id: 3, action: "Permission Override", target: "SA-002", actor: "Master Admin", timestamp: "1 hour ago", severity: "warning" },
  { id: 4, action: "Global Policy Updated", target: "Security Settings", actor: "Master Admin", timestamp: "2 hours ago", severity: "info" },
  { id: 5, action: "Super Admin Suspended", target: "SA-004", actor: "Master Admin", timestamp: "1 day ago", severity: "critical" },
];

// System modules
const systemModules = [
  { id: "auth", name: "Authentication", status: "active", health: 98 },
  { id: "finance", name: "Finance", status: "active", health: 95 },
  { id: "support", name: "Support", status: "active", health: 100 },
  { id: "legal", name: "Legal", status: "maintenance", health: 75 },
  { id: "marketing", name: "Marketing", status: "active", health: 92 },
  { id: "developer", name: "Developer", status: "active", health: 88 },
];

const MasterAdminDashboard = () => {
  const [selectedSuperAdmin, setSelectedSuperAdmin] = useState<typeof mockSuperAdmins[0] | null>(null);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleGlobalLock = () => {
    if (lockReason.length < 20) {
      toast.error("Reason must be at least 20 characters");
      return;
    }
    toast.success("Global system lock activated");
    setShowLockDialog(false);
    setLockReason("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900 p-6">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/20">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Boss Dashboard</h1>
              <p className="text-amber-400/80">Top Authority • Full Control</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              TOP-LEVEL ACCESS
            </Badge>
            <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Global Lock
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Activate Global System Lock</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">
                      ⚠️ This will lock ALL system operations. Only Master Admin can unlock.
                    </p>
                  </div>
                  <Textarea
                    placeholder="Enter reason for global lock (min 20 characters)..."
                    value={lockReason}
                    onChange={(e) => setLockReason(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    rows={4}
                  />
                  <Button 
                    onClick={handleGlobalLock}
                    variant="destructive" 
                    className="w-full"
                    disabled={lockReason.length < 20}
                  >
                    Confirm Global Lock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Super Admins</p>
                <p className="text-2xl font-bold text-white mt-1">12</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Active Continents</p>
                <p className="text-2xl font-bold text-white mt-1">7</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Active Roles</p>
                <p className="text-2xl font-bold text-white mt-1">48</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Pending Approvals</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">5</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="super-admins" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Super Admins
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            System Modules
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Audit & Blackbox
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Security & Legal
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Map Placeholder */}
            <Card className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-amber-400" />
                  Global Operations Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-700/50">
                  <div className="text-center">
                    <Globe2 className="w-16 h-16 text-amber-400/50 mx-auto mb-4" />
                    <p className="text-zinc-400">Interactive World Map</p>
                    <p className="text-xs text-zinc-500">7 Continents • 195 Countries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  Recent Critical Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {mockAuditLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
                        <div className={`w-2 h-2 rounded-full ${
                          log.severity === "critical" ? "bg-red-500" :
                          log.severity === "warning" ? "bg-amber-500" : "bg-blue-500"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-white">{log.action}</p>
                          <p className="text-xs text-zinc-400">Target: {log.target}</p>
                        </div>
                        <span className="text-xs text-zinc-500">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Powers Summary */}
          <Card className="bg-zinc-900/50 border-zinc-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Master Admin Powers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Manage Super Admins", desc: "Create, edit, delete" },
                  { icon: Key, label: "Full Permission Control", desc: "All matrices" },
                  { icon: Lock, label: "Global System Lock", desc: "Emergency control" },
                  { icon: FileText, label: "Full Audit Access", desc: "View & export" },
                  { icon: Settings, label: "System Modules", desc: "Enable/disable" },
                  { icon: Gavel, label: "Override Authority", desc: "With reason + log" },
                  { icon: Shield, label: "Security Control", desc: "Final authority" },
                  { icon: Globe2, label: "Global Policies", desc: "Assign worldwide" },
                ].map((power, i) => (
                  <div key={i} className="p-4 rounded-lg bg-zinc-800/50 border border-amber-500/20">
                    <power.icon className="w-6 h-6 text-amber-400 mb-2" />
                    <p className="text-sm font-medium text-white">{power.label}</p>
                    <p className="text-xs text-zinc-400">{power.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Super Admins Tab */}
        <TabsContent value="super-admins" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Input 
              placeholder="Search Super Admins..." 
              className="max-w-sm bg-zinc-800 border-zinc-700 text-white"
            />
            <Button className="bg-amber-500 hover:bg-amber-600 text-black gap-2">
              <Plus className="w-4 h-4" />
              Create Super Admin
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Super Admin List */}
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900/50 border-zinc-700/50">
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-zinc-700/50">
                      {mockSuperAdmins.map((admin) => (
                        <div 
                          key={admin.id}
                          onClick={() => setSelectedSuperAdmin(admin)}
                          className={`p-4 cursor-pointer transition-colors ${
                            selectedSuperAdmin?.id === admin.id 
                              ? "bg-amber-500/10 border-l-2 border-amber-500" 
                              : "hover:bg-zinc-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white font-bold">{admin.name.split(" ").map(n => n[0]).join("")}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white">{admin.name}</h3>
                                <Badge className={admin.status === "active" 
                                  ? "bg-emerald-500/20 text-emerald-400" 
                                  : "bg-amber-500/20 text-amber-400"
                                }>
                                  {admin.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-zinc-400">{admin.email}</p>
                              <div className="flex gap-2 mt-1">
                                {admin.assignedContinents.map((c, i) => (
                                  <Badge key={i} variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                                    {c}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-zinc-400">Last active</p>
                              <p className="text-sm text-zinc-300">{admin.lastActive}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Detail Panel */}
            <Card className="bg-zinc-900/50 border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Super Admin Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSuperAdmin ? (
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-zinc-700/50">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-white">
                          {selectedSuperAdmin.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{selectedSuperAdmin.name}</h3>
                      <p className="text-sm text-zinc-400">{selectedSuperAdmin.email}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">ID</span>
                        <span className="text-sm font-mono text-white">{selectedSuperAdmin.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">Status</span>
                        <Badge className={selectedSuperAdmin.status === "active" 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : "bg-amber-500/20 text-amber-400"
                        }>
                          {selectedSuperAdmin.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">Created</span>
                        <span className="text-sm text-white">{selectedSuperAdmin.createdAt}</span>
                      </div>
                    </div>

                    <Separator className="bg-zinc-700/50" />

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-zinc-300">Actions</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                          <Settings className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-500/10">
                          <Lock className="w-3 h-3 mr-1" /> Suspend
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400">Select a Super Admin to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Full Permission Matrix Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Create Roles</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-zinc-400">Full authority to create new roles</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Approve Roles</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-zinc-400">Final approval on all role requests</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Delete Roles</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-zinc-400">Remove roles (if no active users)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemModules.map((module) => (
              <Card key={module.id} className="bg-zinc-900/50 border-zinc-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{module.name}</h3>
                        <Badge className={module.status === "active" 
                          ? "bg-emerald-500/20 text-emerald-400 text-xs" 
                          : "bg-amber-500/20 text-amber-400 text-xs"
                        }>
                          {module.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Health</span>
                      <span className="text-white">{module.health}%</span>
                    </div>
                    <Progress value={module.health} className="h-2" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-zinc-600 text-zinc-300">
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                      <Lock className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit & Blackbox Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                Full Audit Logs
              </CardTitle>
              <Button variant="outline" className="border-zinc-600 text-zinc-300 gap-2">
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {mockAuditLogs.concat(mockAuditLogs).map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
                      <div className={`w-3 h-3 rounded-full ${
                        log.severity === "critical" ? "bg-red-500 animate-pulse" :
                        log.severity === "warning" ? "bg-amber-500" : "bg-blue-500"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{log.action}</span>
                          <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                            {log.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-400">Target: {log.target} • By: {log.actor}</p>
                      </div>
                      <span className="text-xs text-zinc-500">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Legal Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900/50 border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive" className="w-full gap-2">
                  <Lock className="w-4 h-4" />
                  Activate Global System Lock
                </Button>
                <Button variant="outline" className="w-full border-amber-600 text-amber-400 gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Emergency Override Mode
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-amber-400" />
                  Legal Authority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-sm text-zinc-300">Final Security Authority</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-sm text-zinc-300">Legal Compliance Override</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-sm text-zinc-300">High-Risk Action Approval</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterAdminDashboard;
