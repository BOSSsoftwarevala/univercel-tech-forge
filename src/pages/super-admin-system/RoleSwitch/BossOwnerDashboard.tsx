import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Crown, Shield, Lock, Archive, AlertTriangle, Users, Globe2,
  Key, Activity, FileText, Settings, Gavel, Eye, Trash2, Power,
  CheckCircle2, XCircle, Clock, RotateCcw, Database, Server,
  Fingerprint, ShieldCheck, Ban, History, Download, Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

// Mock Super Admins
const mockSuperAdmins = [
  { id: "SA-001", name: "James Wilson", status: "active", continents: ["Europe", "Asia"], created: "2024-01-15", lastActive: "2 min ago" },
  { id: "SA-002", name: "Maria Santos", status: "active", continents: ["Americas"], created: "2024-02-20", lastActive: "15 min ago" },
  { id: "SA-003", name: "Chen Wei", status: "locked", continents: ["Asia-Pacific"], created: "2024-03-10", lastActive: "2 hours ago" },
  { id: "SA-004", name: "Ahmed Hassan", status: "archived", continents: ["Middle East"], created: "2024-04-05", lastActive: "30 days ago" },
];

// System modules
const systemModules = [
  { id: "auth", name: "Authentication", status: "active", locked: false, lastModified: "2 hours ago" },
  { id: "finance", name: "Finance & Wallet", status: "active", locked: true, lastModified: "1 day ago" },
  { id: "support", name: "Support System", status: "active", locked: false, lastModified: "3 hours ago" },
  { id: "legal", name: "Legal & Compliance", status: "maintenance", locked: true, lastModified: "5 days ago" },
  { id: "marketing", name: "Marketing", status: "active", locked: false, lastModified: "12 hours ago" },
  { id: "developer", name: "Developer Portal", status: "active", locked: false, lastModified: "1 hour ago" },
];

// Blackbox entries (immutable audit)
const blackboxEntries = [
  { id: 1, action: "SYSTEM_LOCK", actor: "Boss", target: "Finance Module", timestamp: "2024-01-15 14:32:00", severity: "critical", hash: "0x7f8a..." },
  { id: 2, action: "ROLE_ARCHIVE", actor: "Boss", target: "SA-004", timestamp: "2024-01-14 09:15:00", severity: "high", hash: "0x3b2c..." },
  { id: 3, action: "PERMISSION_OVERRIDE", actor: "Boss", target: "Global Policies", timestamp: "2024-01-13 16:45:00", severity: "critical", hash: "0x9d4e..." },
  { id: 4, action: "EMERGENCY_SHUTDOWN", actor: "Boss", target: "API Gateway", timestamp: "2024-01-10 02:30:00", severity: "critical", hash: "0x1a5f..." },
];

// Pending final overrides
const pendingOverrides = [
  { id: 1, type: "Role Escalation", requestedBy: "Super Admin", target: "Country Admin Brazil", reason: "Emergency access needed", daysAgo: 1 },
  { id: 2, type: "Module Unlock", requestedBy: "Finance Manager", target: "Wallet System", reason: "Critical bug fix", daysAgo: 2 },
  { id: 3, type: "Archive Request", requestedBy: "Legal Manager", target: "User Data - ID#45678", reason: "GDPR compliance", daysAgo: 3 },
];

const BossOwnerDashboard = () => {
  const [selectedModule, setSelectedModule] = useState<typeof systemModules[0] | null>(null);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [archiveTarget, setArchiveTarget] = useState("");
  const [twoFactorConfirmed, setTwoFactorConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleEmergencyLockdown = () => {
    if (!twoFactorConfirmed) {
      toast.error("2FA verification required for emergency lockdown");
      return;
    }
    if (lockReason.length < 20) {
      toast.error("Reason must be at least 20 characters");
      return;
    }
    toast.success("🔒 EMERGENCY LOCKDOWN ACTIVATED", {
      description: "All operations suspended. Only Boss can unlock.",
    });
    setShowLockDialog(false);
    setLockReason("");
    setTwoFactorConfirmed(false);
  };

  const handleArchive = () => {
    if (!twoFactorConfirmed) {
      toast.error("2FA verification required for archive operation");
      return;
    }
    toast.success("📦 Archived successfully", {
      description: "Action logged to immutable blackbox",
    });
    setShowArchiveDialog(false);
    setArchiveTarget("");
    setTwoFactorConfirmed(false);
  };

  const handleModuleLock = (moduleId: string) => {
    toast.success(`Module ${moduleId} lock toggled`);
  };

  const handleFreezeSystem = () => {
    toast.error("⛔ SYSTEM FROZEN", {
      description: "All operations halted. Emergency protocol activated.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "medium": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900 p-6">
      {/* Premium Boss Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Boss / Owner</h1>
              <p className="text-amber-400/80">Final Authority • Approve / Lock / Archive</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              SUPREME AUTHORITY
            </Badge>
            
            {/* Emergency Lockdown */}
            <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Emergency Lockdown
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-red-500/30">
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Activate Emergency Lockdown
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    This will suspend ALL system operations immediately.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">
                      ⚠️ CRITICAL: Only Boss/Owner can unlock the system after activation.
                    </p>
                  </div>
                  <Textarea
                    placeholder="Enter detailed reason for lockdown (min 20 characters)..."
                    value={lockReason}
                    onChange={(e) => setLockReason(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    rows={4}
                  />
                  <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                    <Fingerprint className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-zinc-300">2FA Verification Required</span>
                    <Switch
                      checked={twoFactorConfirmed}
                      onCheckedChange={setTwoFactorConfirmed}
                    />
                  </div>
                  <Button 
                    onClick={handleEmergencyLockdown}
                    variant="destructive" 
                    className="w-full"
                    disabled={lockReason.length < 20 || !twoFactorConfirmed}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Confirm Emergency Lockdown
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Freeze System */}
            <Button 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-2"
              onClick={handleFreezeSystem}
            >
              <Power className="w-4 h-4" />
              Freeze System
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Authority Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Super Admins</p>
                <p className="text-2xl font-bold text-white mt-1">{mockSuperAdmins.length}</p>
                <p className="text-xs text-emerald-400">3 Active</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Locked Modules</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">2</p>
                <p className="text-xs text-zinc-500">of 6 total</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Pending Overrides</p>
                <p className="text-2xl font-bold text-red-400 mt-1">3</p>
                <p className="text-xs text-zinc-500">Requires approval</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Gavel className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Blackbox Events</p>
                <p className="text-2xl font-bold text-white mt-1">{blackboxEntries.length}</p>
                <p className="text-xs text-zinc-500">Immutable logs</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="super-admins" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Super Admins
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Roles & Permission Lock
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            System Modules
          </TabsTrigger>
          <TabsTrigger value="blackbox" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Audit & Blackbox
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Security & Legal
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Overrides */}
            <Card className="bg-zinc-900/50 border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-amber-400" />
                  Final Override Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {pendingOverrides.map((override) => (
                      <div key={override.id} className="p-3 rounded-lg bg-zinc-800/50 border border-amber-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-amber-500/20 text-amber-400">{override.type}</Badge>
                          <span className="text-xs text-zinc-500">{override.daysAgo} days ago</span>
                        </div>
                        <p className="text-sm text-white mb-1">Target: {override.target}</p>
                        <p className="text-xs text-zinc-400">By: {override.requestedBy}</p>
                        <p className="text-xs text-zinc-500 mt-2">{override.reason}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Boss Powers */}
            <Card className="bg-zinc-900/50 border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Boss Authority Powers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Users, label: "Super Admin Registry", desc: "Full control" },
                    { icon: Lock, label: "Role & Permission Lock", desc: "Final authority" },
                    { icon: Settings, label: "System Modules", desc: "Enable/disable" },
                    { icon: Database, label: "Audit & Blackbox", desc: "Full access" },
                    { icon: Shield, label: "Security Control", desc: "Emergency actions" },
                    { icon: Gavel, label: "Legal Control", desc: "Compliance" },
                    { icon: Power, label: "Emergency Lockdown", desc: "System freeze" },
                    { icon: RotateCcw, label: "Final Override", desc: "Logged + 2FA" },
                  ].map((power, i) => (
                    <div key={i} className="p-3 rounded-lg bg-zinc-800/50 border border-amber-500/20">
                      <power.icon className="w-5 h-5 text-amber-400 mb-2" />
                      <p className="text-sm font-medium text-white">{power.label}</p>
                      <p className="text-xs text-zinc-400">{power.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Super Admins Tab */}
        <TabsContent value="super-admins" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Super Admin Registry</CardTitle>
              <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                <Users className="w-4 h-4 mr-2" />
                Create Super Admin
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {mockSuperAdmins.map((admin) => (
                    <div key={admin.id} className={`p-4 rounded-lg border ${
                      admin.status === "active" ? "bg-zinc-800/50 border-zinc-700/30" :
                      admin.status === "locked" ? "bg-amber-500/5 border-amber-500/30" :
                      "bg-zinc-900/50 border-zinc-800/50 opacity-60"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold">{admin.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white">{admin.name}</h4>
                              <Badge className={
                                admin.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                                admin.status === "locked" ? "bg-amber-500/20 text-amber-400" :
                                "bg-zinc-500/20 text-zinc-400"
                              }>
                                {admin.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-400">{admin.id}</p>
                            <div className="flex gap-1 mt-1">
                              {admin.continents.map((c, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {admin.status !== "archived" && (
                            <>
                              <Button size="sm" variant="ghost" className="text-amber-400 hover:bg-amber-500/10">
                                <Lock className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-zinc-400 hover:bg-zinc-500/10">
                                <Archive className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/10">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-amber-400" />
                System Modules Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemModules.map((module) => (
                  <div key={module.id} className={`p-4 rounded-lg border ${
                    module.locked ? "bg-amber-500/5 border-amber-500/30" : "bg-zinc-800/50 border-zinc-700/30"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">{module.name}</h4>
                      {module.locked && <Lock className="w-4 h-4 text-amber-400" />}
                    </div>
                    <Badge className={
                      module.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-amber-500/20 text-amber-400"
                    }>
                      {module.status}
                    </Badge>
                    <p className="text-xs text-zinc-500 mt-2">Modified: {module.lastModified}</p>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant={module.locked ? "default" : "outline"}
                        className={module.locked ? "bg-amber-600 hover:bg-amber-700" : ""}
                        onClick={() => handleModuleLock(module.id)}
                      >
                        {module.locked ? "Unlock" : "Lock"}
                      </Button>
                      <Button size="sm" variant="destructive" disabled={!module.locked}>
                        Disable
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blackbox Tab */}
        <TabsContent value="blackbox" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                Immutable Blackbox Audit Log
              </CardTitle>
              <Button variant="outline" className="border-purple-500/50 text-purple-400">
                <Download className="w-4 h-4 mr-2" />
                Export Full Log
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {blackboxEntries.map((entry) => (
                    <div key={entry.id} className="p-4 rounded-lg bg-zinc-800/50 border border-purple-500/20 font-mono">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getSeverityColor(entry.severity)}>
                          {entry.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-zinc-500">{entry.timestamp}</span>
                      </div>
                      <p className="text-white text-sm mb-1">{entry.action}</p>
                      <p className="text-xs text-zinc-400">Actor: {entry.actor} | Target: {entry.target}</p>
                      <p className="text-xs text-purple-400 mt-2">Hash: {entry.hash}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Role & Permission Lock Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 text-center">
                <Lock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Permission Lock System</h3>
                <p className="text-zinc-400 mb-6">
                  Lock specific roles and permissions to prevent changes by Super Admins.
                  Only Boss/Owner can modify locked permissions.
                </p>
                <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                  <Lock className="w-4 h-4 mr-2" />
                  Open Permission Matrix
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-900/50 border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Security Control Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Two-Factor Authentication", status: true },
                  { label: "Biometric Login Required", status: true },
                  { label: "IP Whitelist Active", status: true },
                  { label: "Session Timeout (15 min)", status: true },
                  { label: "Audit Trail Encryption", status: true },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                    <span className="text-white">{setting.label}</span>
                    <Badge className={setting.status ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                      {setting.status ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-rose-400" />
                  Legal Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service Management
                </Button>
                <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Privacy Policy Control
                </Button>
                <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Compliance Documents
                </Button>
                <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                  <Ban className="w-4 h-4 mr-2" />
                  GDPR Data Requests
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Boss Authority Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Crown className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Boss / Owner Authority</h3>
                <p className="text-sm text-amber-400">Final Authority Level</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">Approve Everything</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">Lock Any Module</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">Archive Anything</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">Emergency Lockdown</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">Full Blackbox Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">Override with 2FA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">Freeze System</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-300">All Actions Logged</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BossOwnerDashboard;
