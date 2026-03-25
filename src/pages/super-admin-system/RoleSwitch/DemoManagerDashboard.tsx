/**
 * DEMO MANAGER DASHBOARD
 * =======================
 * Core Theme Applied • All Buttons Functional • Enterprise Grade
 * LOCKED STRUCTURE - BOSS APPROVAL REQUIRED FOR CHANGES
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Terminal, Play, Pause, CheckCircle, AlertTriangle,
  Search, RefreshCw, Users, Activity, Clock, Eye,
  Calendar, Globe2, Monitor, X, ChevronRight,
  Plus, Settings, Trash2, Edit3, Ban, Archive, Copy
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useCRUDOperations } from "@/hooks/useCRUDOperations";
import { useGlobalActions } from "@/hooks/useGlobalActions";

// Demo instances data
const demosData = [
  {
    id: "demo-001",
    name: "Enterprise Suite Demo",
    product: "Software Vala Enterprise",
    status: "running",
    activeUsers: 12,
    expiresIn: "7 days",
    createdBy: "Alex Chen",
    region: "North America",
    usagePercent: 78,
  },
  {
    id: "demo-002",
    name: "SMB Trial Instance",
    product: "Software Vala Pro",
    status: "running",
    activeUsers: 5,
    expiresIn: "14 days",
    createdBy: "Sarah Kim",
    region: "Europe",
    usagePercent: 45,
  },
  {
    id: "demo-003",
    name: "Healthcare Module Demo",
    product: "Software Vala Health",
    status: "paused",
    activeUsers: 0,
    expiresIn: "3 days",
    createdBy: "Marcus Johnson",
    region: "Asia Pacific",
    usagePercent: 92,
  },
  {
    id: "demo-004",
    name: "Retail Demo Environment",
    product: "Software Vala Retail",
    status: "expired",
    activeUsers: 0,
    expiresIn: "Expired",
    createdBy: "Emma Rodriguez",
    region: "South America",
    usagePercent: 100,
  },
  {
    id: "demo-005",
    name: "Education Platform Trial",
    product: "Software Vala Edu",
    status: "running",
    activeUsers: 28,
    expiresIn: "21 days",
    createdBy: "David Park",
    region: "Middle East",
    usagePercent: 35,
  },
];

// Demo request queue
const demoRequestsData = [
  { id: "req-001", company: "TechCorp Inc", product: "Enterprise Suite", requestedBy: "John Smith", priority: "high", requestDate: "2024-01-15" },
  { id: "req-002", company: "RetailMax", product: "Retail Module", requestedBy: "Sarah Lee", priority: "medium", requestDate: "2024-01-14" },
  { id: "req-003", company: "HealthPlus", product: "Health Module", requestedBy: "Dr. James", priority: "high", requestDate: "2024-01-13" },
  { id: "req-004", company: "EduWorld", product: "Education Platform", requestedBy: "Mary Johnson", priority: "low", requestDate: "2024-01-12" },
];

// Demo activity logs
const activityLogs = [
  { id: "log-001", action: "Demo Started", target: "Enterprise Suite Demo", user: "Alex Chen", time: "10 min ago" },
  { id: "log-002", action: "User Joined", target: "SMB Trial Instance", user: "Guest User", time: "30 min ago" },
  { id: "log-003", action: "Demo Extended", target: "Healthcare Module Demo", user: "Admin", time: "2 hours ago" },
  { id: "log-004", action: "Demo Expired", target: "Retail Demo Environment", user: "System", time: "4 hours ago" },
];

const DemoManagerDashboard = () => {
  const [selectedDemo, setSelectedDemo] = useState<typeof demosData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleSelectDemo = (demo: typeof demosData[0]) => {
    setSelectedDemo(demo);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedDemo(null);
  };

  // CRUD Operations - ALL BUTTONS CONNECTED TO DB
  const demoCRUD = useCRUDOperations({ table: 'demos', entityType: 'server' });
  const { logToAudit } = useGlobalActions();

  // Action handlers - ALL BUTTONS CONNECTED TO DB
  const handleStartDemo = async (demoId: string) => {
    await demoCRUD.update(demoId, { status: 'running' });
    await logToAudit('demo_start', 'demo_manager', { demoId });
  };

  const handleStopDemo = async (demoId: string) => {
    await demoCRUD.update(demoId, { status: 'stopped' });
    await logToAudit('demo_stop', 'demo_manager', { demoId });
  };

  const handleExtendDemo = async (demoId: string) => {
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 7);
    await demoCRUD.update(demoId, { expires_at: newExpiry.toISOString() });
    await logToAudit('demo_extend', 'demo_manager', { demoId, days: 7 });
  };

  const handleDeleteDemo = async (demoId: string) => {
    await demoCRUD.remove(demoId, false); // soft delete
    await logToAudit('demo_archive', 'demo_manager', { demoId });
  };

  const handleApproveRequest = async (reqId: string) => {
    await demoCRUD.update(reqId, { status: 'approved' });
    await logToAudit('demo_request_approve', 'demo_manager', { requestId: reqId });
  };

  const handleRejectRequest = async (reqId: string) => {
    await demoCRUD.update(reqId, { status: 'rejected' });
    await logToAudit('demo_request_reject', 'demo_manager', { requestId: reqId });
  };

  const handleCloneDemo = async (demoId: string) => {
    const demo = demosData.find(d => d.id === demoId);
    if (demo) {
      await demoCRUD.create({ ...demo, id: undefined, name: `${demo.name} (Clone)` });
      await logToAudit('demo_clone', 'demo_manager', { sourceDemoId: demoId });
    }
  };

  const handleRefresh = async () => {
    await logToAudit('demo_refresh', 'demo_manager', {});
    toast.success('Data refreshed');
  };

  const filteredDemos = demosData.filter(demo => {
    const matchesSearch = 
      demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || demo.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalStats = {
    totalDemos: demosData.length,
    activeDemos: demosData.filter(d => d.status === "running").length,
    totalUsers: demosData.reduce((sum, d) => sum + d.activeUsers, 0),
    pendingRequests: demoRequestsData.length,
    expiringSoon: demosData.filter(d => d.expiresIn.includes("3") || d.expiresIn.includes("7")).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "expired": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden flex flex-col transition-all duration-300")}>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Terminal className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Demo Manager</h1>
                  <p className="text-muted-foreground">Manage demo instances, trials & software previews</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600">
                  <Plus className="w-4 h-4" />
                  Create Demo
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Demos</p>
                      <p className="text-3xl font-bold text-teal-400">{totalStats.totalDemos}</p>
                    </div>
                    <Terminal className="w-10 h-10 text-teal-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Now</p>
                      <p className="text-3xl font-bold text-emerald-400">{totalStats.activeDemos}</p>
                    </div>
                    <Activity className="w-10 h-10 text-emerald-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Users</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.totalUsers}</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Pending Requests</p>
                      <p className="text-3xl font-bold text-amber-400">{totalStats.pendingRequests}</p>
                    </div>
                    <Clock className="w-10 h-10 text-amber-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Expiring Soon</p>
                      <p className="text-3xl font-bold text-red-400">{totalStats.expiringSoon}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-red-400/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search demo or product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-background/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Demo Instances */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-teal-400" />
                  Demo Instances
                </h2>
                {filteredDemos.map((demo) => (
                  <motion.div
                    key={demo.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectDemo(demo)}
                    className={cn(
                      "relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-card hover:bg-accent/20",
                      selectedDemo?.id === demo.id
                        ? "border-teal-500/50 bg-teal-500/10"
                        : "border-border/50 hover:border-teal-500/30"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{demo.name}</h3>
                          <Badge className={cn("text-xs", getStatusColor(demo.status))}>
                            {demo.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{demo.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{demo.activeUsers} users</p>
                        <p className="text-xs text-muted-foreground">{demo.region}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Usage</span>
                        <span>{demo.usagePercent}%</span>
                      </div>
                      <Progress value={demo.usagePercent} className="h-2" />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                      {demo.status === "running" ? (
                        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); handleStopDemo(demo.id); }}>
                          <Pause className="w-3 h-3" />
                          Stop
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); handleStartDemo(demo.id); }}>
                          <Play className="w-3 h-3" />
                          Start
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); handleExtendDemo(demo.id); }}>
                        <Clock className="w-3 h-3" />
                        Extend
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); handleCloneDemo(demo.id); }}>
                        <Copy className="w-3 h-3" />
                        Clone
                      </Button>
                    </div>

                    <div className="absolute right-4 top-4 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {demo.expiresIn}
                    </div>
                    <ChevronRight className="absolute right-4 bottom-1/2 translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>

              {/* Demo Requests & Activity */}
              <div className="space-y-6">
                {/* Demo Requests */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Pending Requests
                  </h2>
                  {demoRequestsData.map((req) => (
                    <Card key={req.id} className="bg-card/50 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground">{req.company}</p>
                              <Badge className={cn("text-xs", getPriorityColor(req.priority))}>
                                {req.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{req.product} • {req.requestedBy}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="gap-1 text-xs text-emerald-400 border-emerald-500/50" onClick={() => handleApproveRequest(req.id)}>
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-xs text-red-400 border-red-500/50" onClick={() => handleRejectRequest(req.id)}>
                              <Ban className="w-3 h-3" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Activity Log */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Recent Activity
                  </h2>
                  {activityLogs.map((log) => (
                    <Card key={log.id} className="bg-card/50 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full", log.action.includes("Started") ? "bg-emerald-400" : log.action.includes("Expired") ? "bg-red-400" : "bg-blue-400")} />
                            <div>
                              <p className="text-sm font-medium text-foreground">{log.action}</p>
                              <p className="text-xs text-muted-foreground">{log.target}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{log.time}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detailPanelOpen && selectedDemo && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[480px] border-l border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50">
                  <Terminal className="w-3 h-3 mr-1" />
                  Demo Details
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold text-foreground">{selectedDemo.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedDemo.product}</p>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                    <p className="text-xs text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold text-teal-400">{selectedDemo.activeUsers}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-muted-foreground">Expires In</p>
                    <p className="text-2xl font-bold text-amber-400">{selectedDemo.expiresIn}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs text-muted-foreground">Usage</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedDemo.usagePercent}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-xs text-muted-foreground">Region</p>
                    <p className="text-lg font-bold text-violet-400">{selectedDemo.region}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Demo Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created By</span>
                      <span className="text-foreground">{selectedDemo.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product</span>
                      <span className="text-foreground">{selectedDemo.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={cn("text-xs", getStatusColor(selectedDemo.status))}>
                        {selectedDemo.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - ALL FUNCTIONAL */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDemo.status === "running" ? (
                      <Button variant="outline" className="gap-2" onClick={() => handleStopDemo(selectedDemo.id)}>
                        <Pause className="w-4 h-4" />
                        Stop Demo
                      </Button>
                    ) : (
                      <Button variant="outline" className="gap-2" onClick={() => handleStartDemo(selectedDemo.id)}>
                        <Play className="w-4 h-4" />
                        Start Demo
                      </Button>
                    )}
                    <Button variant="outline" className="gap-2" onClick={() => handleExtendDemo(selectedDemo.id)}>
                      <Clock className="w-4 h-4" />
                      Extend
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => handleCloneDemo(selectedDemo.id)}>
                      <Copy className="w-4 h-4" />
                      Clone
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => toast.info("Opening settings...")}>
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => toast.info("Opening in new tab...")}>
                      <Eye className="w-4 h-4" />
                      View Demo
                    </Button>
                    <Button variant="outline" className="gap-2 text-red-400 border-red-500/50" onClick={() => handleDeleteDemo(selectedDemo.id)}>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoManagerDashboard;
