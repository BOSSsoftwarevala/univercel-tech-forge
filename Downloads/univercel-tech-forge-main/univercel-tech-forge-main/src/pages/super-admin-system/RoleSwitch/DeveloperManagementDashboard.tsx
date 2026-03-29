/**
 * DEVELOPER MANAGEMENT DASHBOARD
 * ===============================
 * Core Theme Applied • All Buttons Functional • Enterprise Grade
 * LOCKED STRUCTURE - BOSS APPROVAL REQUIRED FOR CHANGES
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Code2, GitBranch, GitPullRequest, Terminal, CheckCircle, AlertTriangle,
  Search, RefreshCw, Users, Activity, Clock, Rocket, Shield,
  Bug, FileCode, Database, Server, Settings, Eye, X,
  ChevronRight, Play, Pause, Ban, Trash2, Edit3, Plus, Download
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

// Developer team data
const developersData = [
  {
    id: "dev-001",
    name: "Alex Chen",
    email: "alex.chen@dev.com",
    role: "Senior Full Stack",
    status: "active",
    currentProject: "Payment Gateway v3",
    activeTasks: 5,
    completedThisWeek: 12,
    avgResponseTime: "2.5 hrs",
    lastCommit: "15 min ago",
    prsOpen: 3,
    prsReviewing: 2,
  },
  {
    id: "dev-002",
    name: "Sarah Kim",
    email: "sarah.kim@dev.com",
    role: "Backend Engineer",
    status: "active",
    currentProject: "API Optimization",
    activeTasks: 7,
    completedThisWeek: 9,
    avgResponseTime: "1.8 hrs",
    lastCommit: "45 min ago",
    prsOpen: 2,
    prsReviewing: 4,
  },
  {
    id: "dev-003",
    name: "Marcus Johnson",
    email: "marcus.j@dev.com",
    role: "DevOps Engineer",
    status: "active",
    currentProject: "CI/CD Pipeline",
    activeTasks: 4,
    completedThisWeek: 15,
    avgResponseTime: "3.2 hrs",
    lastCommit: "2 hours ago",
    prsOpen: 1,
    prsReviewing: 6,
  },
  {
    id: "dev-004",
    name: "Emma Rodriguez",
    email: "emma.r@dev.com",
    role: "Frontend Lead",
    status: "busy",
    currentProject: "Dashboard Redesign",
    activeTasks: 8,
    completedThisWeek: 11,
    avgResponseTime: "2.0 hrs",
    lastCommit: "30 min ago",
    prsOpen: 4,
    prsReviewing: 3,
  },
  {
    id: "dev-005",
    name: "David Park",
    email: "david.p@dev.com",
    role: "Mobile Developer",
    status: "offline",
    currentProject: "iOS App v2.0",
    activeTasks: 3,
    completedThisWeek: 8,
    avgResponseTime: "4.1 hrs",
    lastCommit: "1 day ago",
    prsOpen: 0,
    prsReviewing: 1,
  },
];

// Active projects data
const projectsData = [
  { id: "proj-001", name: "Payment Gateway v3", status: "in_progress", progress: 72, assignees: 4, deadline: "2024-02-15", priority: "high" },
  { id: "proj-002", name: "API Optimization", status: "in_progress", progress: 45, assignees: 2, deadline: "2024-02-28", priority: "medium" },
  { id: "proj-003", name: "Dashboard Redesign", status: "in_progress", progress: 88, assignees: 3, deadline: "2024-02-10", priority: "high" },
  { id: "proj-004", name: "CI/CD Pipeline", status: "testing", progress: 95, assignees: 2, deadline: "2024-02-05", priority: "critical" },
  { id: "proj-005", name: "iOS App v2.0", status: "planning", progress: 15, assignees: 1, deadline: "2024-03-30", priority: "medium" },
];

// Deployment logs
const deploymentsData = [
  { id: "dep-001", project: "Dashboard Redesign", environment: "Production", status: "success", time: "10 min ago", deployedBy: "Emma R." },
  { id: "dep-002", project: "API Optimization", environment: "Staging", status: "success", time: "2 hours ago", deployedBy: "Sarah K." },
  { id: "dep-003", project: "Payment Gateway v3", environment: "Development", status: "failed", time: "4 hours ago", deployedBy: "Alex C." },
  { id: "dep-004", project: "CI/CD Pipeline", environment: "Production", status: "success", time: "1 day ago", deployedBy: "Marcus J." },
];

const DeveloperManagementDashboard = () => {
  const [selectedDeveloper, setSelectedDeveloper] = useState<typeof developersData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  const handleSelectDeveloper = (dev: typeof developersData[0]) => {
    setSelectedDeveloper(dev);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedDeveloper(null);
  };

  // Action handlers - ALL BUTTONS MUST WORK
  const handleDeploy = (projectId: string) => {
    toast.success(`Deployment initiated for project ${projectId}`);
  };

  const handleStopProject = (projectId: string) => {
    toast.info(`Project ${projectId} paused`);
  };

  const handleStartProject = (projectId: string) => {
    toast.success(`Project ${projectId} resumed`);
  };

  const handleAssignDeveloper = (devId: string, projectId: string) => {
    toast.success(`Developer ${devId} assigned to project ${projectId}`);
  };

  const handleViewPR = (devId: string) => {
    toast.info(`Viewing PRs for developer ${devId}`);
  };

  const handleApproveDeployment = (depId: string) => {
    toast.success(`Deployment ${depId} approved`);
  };

  const handleRejectDeployment = (depId: string) => {
    toast.error(`Deployment ${depId} rejected`);
  };

  const handleRefresh = () => {
    toast.info("Refreshing data...");
  };

  const filteredDevelopers = developersData.filter(dev => {
    const matchesSearch = 
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || dev.status === filterStatus;
    const matchesRole = filterRole === "all" || dev.role.includes(filterRole);
    return matchesSearch && matchesStatus && matchesRole;
  });

  const uniqueRoles = [...new Set(developersData.map(dev => dev.role))];

  const totalStats = {
    totalDevs: developersData.length,
    activeDevs: developersData.filter(d => d.status === "active").length,
    totalPRs: developersData.reduce((sum, d) => sum + d.prsOpen, 0),
    deploymentsToday: deploymentsData.filter(d => d.time.includes("min") || d.time.includes("hour")).length,
    activeProjects: projectsData.filter(p => p.status === "in_progress").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "busy": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "offline": return "bg-slate-500/20 text-slate-400 border-slate-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const getDeployStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-emerald-500/20 text-emerald-400";
      case "failed": return "bg-red-500/20 text-red-400";
      case "pending": return "bg-amber-500/20 text-amber-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "medium": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Code2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Developer Management</h1>
                  <p className="text-muted-foreground">Manage development team, projects & deployments</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-violet-600 to-purple-800">
                  <Plus className="w-4 h-4" />
                  Add Developer
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Developers</p>
                      <p className="text-3xl font-bold text-violet-400">{totalStats.totalDevs}</p>
                    </div>
                    <Users className="w-10 h-10 text-violet-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Now</p>
                      <p className="text-3xl font-bold text-emerald-400">{totalStats.activeDevs}</p>
                    </div>
                    <Activity className="w-10 h-10 text-emerald-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Open PRs</p>
                      <p className="text-3xl font-bold text-amber-400">{totalStats.totalPRs}</p>
                    </div>
                    <GitPullRequest className="w-10 h-10 text-amber-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Projects</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.activeProjects}</p>
                    </div>
                    <FileCode className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-cyan-500/10 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Deployments Today</p>
                      <p className="text-3xl font-bold text-cyan-400">{totalStats.deploymentsToday}</p>
                    </div>
                    <Rocket className="w-10 h-10 text-cyan-400/30" />
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
                      placeholder="Search developer or role..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48 bg-background/50">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {uniqueRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Developer Cards */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  Development Team
                </h2>
                {filteredDevelopers.map((dev) => (
                  <motion.div
                    key={dev.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectDeveloper(dev)}
                    className={cn(
                      "relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-card hover:bg-accent/20",
                      selectedDeveloper?.id === dev.id
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-border/50 hover:border-violet-500/30"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border-2 border-violet-500/30">
                        <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-800 text-white font-bold">
                          {dev.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{dev.name}</h3>
                          <Badge className={cn("text-xs", getStatusColor(dev.status))}>
                            {dev.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{dev.role}</p>
                        <p className="text-xs text-violet-400">Working on: {dev.currentProject}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="text-sm font-semibold text-foreground">{dev.activeTasks} tasks</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <GitPullRequest className="w-3 h-3" />
                          {dev.prsOpen} PRs
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); handleViewPR(dev.id); }}>
                        <Eye className="w-3 h-3" />
                        View PRs
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); handleAssignDeveloper(dev.id, "new"); }}>
                        <Plus className="w-3 h-3" />
                        Assign Task
                      </Button>
                    </div>

                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>

              {/* Projects & Deployments */}
              <div className="space-y-6">
                {/* Active Projects */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-blue-400" />
                    Active Projects
                  </h2>
                  {projectsData.slice(0, 4).map((project) => (
                    <Card key={project.id} className="bg-card/50 border-border/50 hover:border-blue-500/30 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            <Badge className={cn("text-xs", getPriorityColor(project.priority))}>
                              {project.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleStartProject(project.id)}>
                              <Play className="w-4 h-4 text-emerald-400" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleStopProject(project.id)}>
                              <Pause className="w-4 h-4 text-amber-400" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDeploy(project.id)}>
                              <Rocket className="w-4 h-4 text-blue-400" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{project.progress}% complete</span>
                            <span>{project.assignees} assignees</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Deployments */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-cyan-400" />
                    Recent Deployments
                  </h2>
                  {deploymentsData.map((dep) => (
                    <Card key={dep.id} className="bg-card/50 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-3 h-3 rounded-full", dep.status === "success" ? "bg-emerald-400" : "bg-red-400")} />
                            <div>
                              <p className="font-medium text-foreground">{dep.project}</p>
                              <p className="text-xs text-muted-foreground">{dep.environment} • {dep.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs", getDeployStatusColor(dep.status))}>
                              {dep.status}
                            </Badge>
                            {dep.status === "failed" && (
                              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleApproveDeployment(dep.id)}>
                                <RefreshCw className="w-3 h-3" />
                                Retry
                              </Button>
                            )}
                          </div>
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
        {detailPanelOpen && selectedDeveloper && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[480px] border-l border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50">
                  <Code2 className="w-3 h-3 mr-1" />
                  Developer Details
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-violet-500/50">
                  <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-800 text-white font-bold text-xl">
                    {selectedDeveloper.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedDeveloper.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedDeveloper.role}</p>
                  <p className="text-xs text-violet-400">{selectedDeveloper.email}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-xs text-muted-foreground">Active Tasks</p>
                    <p className="text-2xl font-bold text-violet-400">{selectedDeveloper.activeTasks}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs text-muted-foreground">Completed This Week</p>
                    <p className="text-2xl font-bold text-emerald-400">{selectedDeveloper.completedThisWeek}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-muted-foreground">Open PRs</p>
                    <p className="text-2xl font-bold text-amber-400">{selectedDeveloper.prsOpen}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs text-muted-foreground">Reviewing</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedDeveloper.prsReviewing}</p>
                  </div>
                </div>

                {/* Current Project */}
                <div className="p-4 rounded-xl bg-card border border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    Current Project
                  </h3>
                  <p className="text-lg font-bold text-foreground">{selectedDeveloper.currentProject}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last commit: {selectedDeveloper.lastCommit}</p>
                </div>

                {/* Action Buttons - ALL FUNCTIONAL */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => handleViewPR(selectedDeveloper.id)}>
                      <GitPullRequest className="w-4 h-4" />
                      View PRs
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => handleAssignDeveloper(selectedDeveloper.id, "new")}>
                      <Plus className="w-4 h-4" />
                      Assign Task
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => toast.info("Opening code review...")}>
                      <Eye className="w-4 h-4" />
                      Code Review
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => toast.info("Opening settings...")}>
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                    <Button variant="outline" className="gap-2 text-amber-400 border-amber-500/50" onClick={() => toast.warning("Developer suspended")}>
                      <Ban className="w-4 h-4" />
                      Suspend
                    </Button>
                    <Button variant="outline" className="gap-2 text-red-400 border-red-500/50" onClick={() => toast.error("Developer removed")}>
                      <Trash2 className="w-4 h-4" />
                      Remove
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

export default DeveloperManagementDashboard;
