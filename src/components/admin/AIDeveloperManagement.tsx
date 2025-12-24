import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Users, Activity, TrendingUp, Award, Eye, Shield,
  Zap, Target, Clock, AlertTriangle, CheckCircle2, Star,
  Code2, Cpu, BarChart3, Flame, Sparkles, UserCheck,
  UserX, RefreshCw, MessageSquare, DollarSign, Calendar,
  Filter, Search, ChevronDown, ArrowUpRight, ArrowDownRight,
  Bell, XCircle, CheckCheck, FileText, Gavel, Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface PendingApproval {
  id: string;
  type: 'task_assign' | 'task_redistribute' | 'performance_review' | 'mentorship' | 'suspension' | 'bonus' | 'promotion';
  title: string;
  description: string;
  developer: string;
  requestedBy: string;
  requestedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  aiRecommendation?: string;
  impact?: string;
}

const AIDeveloperManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [approvalNote, setApprovalNote] = useState("");

  // Pending approvals queue
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([
    {
      id: "APR001",
      type: "task_redistribute",
      title: "Redistribute Tasks from Amit Kumar",
      description: "AI detected burnout risk. Recommend moving 2 tasks to available developers.",
      developer: "Amit Kumar",
      requestedBy: "AI System",
      requestedAt: new Date(Date.now() - 300000),
      priority: "high",
      status: "pending",
      aiRecommendation: "Strongly Recommended - Developer working 12% above average",
      impact: "Will improve developer wellness and task quality",
    },
    {
      id: "APR002",
      type: "task_assign",
      title: "Assign Priority Task to Rahul Sharma",
      description: "High-value e-commerce integration task. Developer has 98% on-time rate.",
      developer: "Rahul Sharma",
      requestedBy: "Lead Manager",
      requestedAt: new Date(Date.now() - 600000),
      priority: "medium",
      status: "pending",
      aiRecommendation: "Recommended - Developer has capacity and matching skills",
      impact: "Estimated completion: 4 hours",
    },
    {
      id: "APR003",
      type: "performance_review",
      title: "Schedule Performance Review for Vikram Singh",
      description: "Quality score dropped 15% this week. Mentorship recommended.",
      developer: "Vikram Singh",
      requestedBy: "AI System",
      requestedAt: new Date(Date.now() - 1800000),
      priority: "critical",
      status: "pending",
      aiRecommendation: "Urgent - Performance decline needs immediate attention",
      impact: "May prevent further quality issues",
    },
    {
      id: "APR004",
      type: "bonus",
      title: "Approve Performance Bonus for Priya Menon",
      description: "Completed ML certification. Top performer for 3 consecutive weeks.",
      developer: "Priya Menon",
      requestedBy: "HR System",
      requestedAt: new Date(Date.now() - 3600000),
      priority: "low",
      status: "pending",
      aiRecommendation: "Recommended - High retention value",
      impact: "₹15,000 bonus from HR budget",
    },
    {
      id: "APR005",
      type: "suspension",
      title: "Review Account Suspension for Dev#892",
      description: "Multiple SLA breaches detected. 3 client complaints this month.",
      developer: "Anonymous Dev",
      requestedBy: "Compliance System",
      requestedAt: new Date(Date.now() - 7200000),
      priority: "critical",
      status: "pending",
      aiRecommendation: "Requires human judgment - Complex case",
      impact: "Temporary suspension pending investigation",
    },
  ]);

  // Real-time metrics simulation
  const [liveMetrics, setLiveMetrics] = useState({
    onlineDevelopers: 38,
    activeTasksNow: 47,
    avgProductivity: 87,
    systemLoad: 62,
    pendingApprovals: 5,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        onlineDevelopers: Math.max(30, Math.min(50, prev.onlineDevelopers + Math.floor((Math.random() - 0.5) * 3))),
        activeTasksNow: Math.max(40, Math.min(60, prev.activeTasksNow + Math.floor((Math.random() - 0.5) * 4))),
        avgProductivity: Math.max(80, Math.min(95, prev.avgProductivity + (Math.random() - 0.5) * 2)),
        systemLoad: Math.max(50, Math.min(80, prev.systemLoad + (Math.random() - 0.5) * 5)),
        pendingApprovals: pendingApprovals.filter(a => a.status === 'pending').length,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [pendingApprovals]);

  const developers = [
    {
      id: "DEV001",
      name: "Rahul Sharma",
      avatar: "RS",
      status: "online",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      rating: 4.9,
      tasksCompleted: 156,
      currentTasks: 3,
      maxTasks: 5,
      earnings: 245000,
      productivity: 94,
      onTimeRate: 98,
      qualityScore: 96,
      aiScore: 92,
      trend: "up",
      riskLevel: "low",
      workHours: "8h 24m",
      joinDate: "2024-03-15",
    },
    {
      id: "DEV002",
      name: "Priya Menon",
      avatar: "PM",
      status: "online",
      skills: ["Python", "Django", "ML", "PostgreSQL"],
      rating: 4.8,
      tasksCompleted: 142,
      currentTasks: 4,
      maxTasks: 5,
      earnings: 218000,
      productivity: 91,
      onTimeRate: 95,
      qualityScore: 94,
      aiScore: 89,
      trend: "up",
      riskLevel: "low",
      workHours: "7h 45m",
      joinDate: "2024-02-20",
    },
    {
      id: "DEV003",
      name: "Amit Kumar",
      avatar: "AK",
      status: "busy",
      skills: ["Java", "Spring", "Microservices", "Kafka"],
      rating: 4.7,
      tasksCompleted: 128,
      currentTasks: 5,
      maxTasks: 5,
      earnings: 198000,
      productivity: 85,
      onTimeRate: 88,
      qualityScore: 90,
      aiScore: 78,
      trend: "down",
      riskLevel: "medium",
      workHours: "9h 12m",
      joinDate: "2024-01-10",
    },
    {
      id: "DEV004",
      name: "Sneha Reddy",
      avatar: "SR",
      status: "offline",
      skills: ["Flutter", "Dart", "Firebase", "iOS"],
      rating: 4.6,
      tasksCompleted: 98,
      currentTasks: 0,
      maxTasks: 5,
      earnings: 156000,
      productivity: 88,
      onTimeRate: 92,
      qualityScore: 91,
      aiScore: 84,
      trend: "stable",
      riskLevel: "low",
      workHours: "0h 0m",
      joinDate: "2024-04-05",
    },
    {
      id: "DEV005",
      name: "Vikram Singh",
      avatar: "VS",
      status: "online",
      skills: ["Vue.js", "Laravel", "PHP", "MySQL"],
      rating: 4.4,
      tasksCompleted: 67,
      currentTasks: 2,
      maxTasks: 5,
      earnings: 89000,
      productivity: 72,
      onTimeRate: 78,
      qualityScore: 75,
      aiScore: 65,
      trend: "down",
      riskLevel: "high",
      workHours: "5h 30m",
      joinDate: "2024-05-20",
    },
  ];

  const handleApprove = (approval: PendingApproval) => {
    setPendingApprovals(prev => 
      prev.map(a => a.id === approval.id ? { ...a, status: 'approved' as const } : a)
    );
    setShowApprovalModal(false);
    setSelectedApproval(null);
    setApprovalNote("");
    toast.success(`Approved: ${approval.title}`);
  };

  const handleReject = (approval: PendingApproval) => {
    setPendingApprovals(prev => 
      prev.map(a => a.id === approval.id ? { ...a, status: 'rejected' as const } : a)
    );
    setShowApprovalModal(false);
    setSelectedApproval(null);
    setApprovalNote("");
    toast.error(`Rejected: ${approval.title}`);
  };

  const handleRequestAction = (actionType: string, developer: string) => {
    const newApproval: PendingApproval = {
      id: `APR${Date.now()}`,
      type: actionType as any,
      title: `${actionType.replace('_', ' ')} for ${developer}`,
      description: `Action requested by current user`,
      developer,
      requestedBy: "Current Admin",
      requestedAt: new Date(),
      priority: "medium",
      status: "pending",
    };
    setPendingApprovals(prev => [newApproval, ...prev]);
    toast.info("Action sent for Super Admin approval");
  };

  const getApprovalTypeBadge = (type: string) => {
    const types: Record<string, { color: string; label: string }> = {
      task_assign: { color: "cyan", label: "Task Assignment" },
      task_redistribute: { color: "amber", label: "Task Redistribution" },
      performance_review: { color: "purple", label: "Performance Review" },
      mentorship: { color: "blue", label: "Mentorship" },
      suspension: { color: "red", label: "Suspension" },
      bonus: { color: "emerald", label: "Bonus" },
      promotion: { color: "pink", label: "Promotion" },
    };
    const t = types[type] || { color: "slate", label: type };
    return <Badge className={`bg-${t.color}-500/20 text-${t.color}-400 border-${t.color}-500/30`}>{t.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500 text-white animate-pulse">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500/20 text-orange-400">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400">Medium</Badge>;
      case "low":
        return <Badge className="bg-slate-500/20 text-slate-400">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Online</Badge>;
      case "busy":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Busy</Badge>;
      case "offline":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Offline</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400">Pending</Badge>;
      case "approved":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-500/20 text-red-400">High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const pendingCount = pendingApprovals.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            AI Developer Management
          </h1>
          <p className="text-slate-400 mt-1">Intelligent workforce monitoring & approval workflow</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className={`border-slate-700 relative ${pendingCount > 0 ? 'border-amber-500/50' : ''}`}
            onClick={() => setActiveTab("approvals")}
          >
            <Gavel className="w-4 h-4 mr-2" />
            Pending Approvals
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Optimize
          </Button>
        </div>
      </div>

      {/* Live Metrics Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-purple-400 font-medium">Live System Status</span>
          </div>
          <div className="flex gap-8">
            {[
              { label: "Developers Online", value: liveMetrics.onlineDevelopers, icon: Users, color: "emerald" },
              { label: "Active Tasks", value: liveMetrics.activeTasksNow, icon: Code2, color: "cyan" },
              { label: "Avg Productivity", value: `${liveMetrics.avgProductivity.toFixed(0)}%`, icon: TrendingUp, color: "amber" },
              { label: "Pending Approvals", value: pendingCount, icon: Gavel, color: pendingCount > 0 ? "red" : "slate" },
            ].map((metric, i) => (
              <div key={i} className="flex items-center gap-2">
                <metric.icon className={`w-4 h-4 text-${metric.color}-400`} />
                <span className="text-sm text-slate-400">{metric.label}:</span>
                <span className={`font-bold text-${metric.color}-400`}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals" className="relative">
            Approvals
            {pendingCount > 0 && (
              <span className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="developers">All Developers</TabsTrigger>
          <TabsTrigger value="performance">Performance AI</TabsTrigger>
          <TabsTrigger value="history">Approval History</TabsTrigger>
        </TabsList>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                Pending Super Admin Approvals ({pendingCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.filter(a => a.status === 'pending').length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                  <p className="text-slate-400">No pending approvals at the moment.</p>
                </div>
              ) : (
                pendingApprovals.filter(a => a.status === 'pending').map((approval, i) => (
                  <motion.div
                    key={approval.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-xl border ${
                      approval.priority === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                      approval.priority === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-slate-700/30 border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getApprovalTypeBadge(approval.type)}
                          {getPriorityBadge(approval.priority)}
                          <span className="text-xs text-slate-500">
                            {Math.floor((Date.now() - approval.requestedAt.getTime()) / 60000)}m ago
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-1">{approval.title}</h4>
                        <p className="text-sm text-slate-400 mb-3">{approval.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-slate-800/50">
                            <p className="text-xs text-slate-500 mb-1">Developer</p>
                            <p className="text-sm text-white font-medium">{approval.developer}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-800/50">
                            <p className="text-xs text-slate-500 mb-1">Requested By</p>
                            <p className="text-sm text-white font-medium">{approval.requestedBy}</p>
                          </div>
                        </div>

                        {approval.aiRecommendation && (
                          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Brain className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-purple-400 font-medium">AI Recommendation</span>
                            </div>
                            <p className="text-sm text-slate-300">{approval.aiRecommendation}</p>
                          </div>
                        )}

                        {approval.impact && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Target className="w-4 h-4" />
                            <span>Impact: {approval.impact}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button
                          onClick={() => {
                            setSelectedApproval(approval);
                            setShowApprovalModal(true);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(approval)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          className="border-slate-600"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Approval History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApprovals.filter(a => a.status !== 'pending').map((approval, i) => (
                <div
                  key={approval.id}
                  className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {approval.status === 'approved' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">{approval.title}</p>
                      <p className="text-sm text-slate-400">{approval.developer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(approval.status)}
                    <span className="text-xs text-slate-500">
                      {approval.requestedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {pendingApprovals.filter(a => a.status !== 'pending').length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No approval history yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Pending Approvals Alert */}
          {pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
                  <div>
                    <p className="text-amber-400 font-medium">{pendingCount} Actions Pending Your Approval</p>
                    <p className="text-sm text-slate-400">Review and approve/reject pending requests</p>
                  </div>
                </div>
                <Button onClick={() => setActiveTab("approvals")} className="bg-amber-500 hover:bg-amber-600 text-black">
                  Review Now
                </Button>
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Developers", value: "38", icon: Users, trend: "+5", color: "cyan" },
              { label: "Avg Rating", value: "4.7", icon: Star, trend: "+0.2", color: "amber" },
              { label: "Tasks Today", value: "156", icon: CheckCircle2, trend: "+23", color: "emerald" },
              { label: "Pending Actions", value: pendingCount.toString(), icon: Gavel, trend: "", color: pendingCount > 0 ? "red" : "slate" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-3`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">{stat.label}</span>
                  {stat.trend && <span className="text-xs text-emerald-400">{stat.trend}</span>}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Top Performers */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Top Performers This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {developers.slice(0, 3).map((dev, i) => (
                  <motion.div
                    key={dev.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-xl border ${
                      i === 0 ? "bg-amber-500/10 border-amber-500/30" :
                      i === 1 ? "bg-slate-500/10 border-slate-400/30" :
                      "bg-orange-900/20 border-orange-700/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600" :
                        i === 1 ? "bg-gradient-to-br from-slate-400 to-slate-600" :
                        "bg-gradient-to-br from-orange-700 to-orange-900"
                      }`}>
                        {dev.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{dev.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-sm text-amber-400">{dev.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleRequestAction('bonus', dev.name)}
                    >
                      <Send className="w-3 h-3 mr-2" />
                      Request Bonus
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Developers Tab */}
        <TabsContent value="developers" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Developer Roster
                </CardTitle>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {developers.filter(d => 
                d.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((dev, i) => (
                <motion.div
                  key={dev.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-slate-700/30 border border-slate-600/50"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg">
                          {dev.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                          dev.status === "online" ? "bg-emerald-500" :
                          dev.status === "busy" ? "bg-amber-500" : "bg-slate-500"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{dev.name}</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(dev.status)}
                          {getRiskBadge(dev.riskLevel)}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-wrap gap-1">
                      {dev.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs border-slate-600">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-400">Rating</p>
                        <p className="text-lg font-bold text-amber-400">{dev.rating}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Tasks</p>
                        <p className="text-lg font-bold text-white">{dev.currentTasks}/{dev.maxTasks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">AI Score</p>
                        <p className="text-lg font-bold text-purple-400">{dev.aiScore}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRequestAction('task_assign', dev.name)}
                      >
                        Assign Task
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-amber-500/50 text-amber-400"
                        onClick={() => handleRequestAction('performance_review', dev.name)}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-400" />
                  AI Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {developers.slice(0, 4).map((dev, i) => (
                  <div key={dev.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                      {dev.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white">{dev.name}</span>
                        <span className="text-sm text-purple-400">{dev.aiScore}%</span>
                      </div>
                      <Progress value={dev.aiScore} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Risk Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {developers.filter(d => d.riskLevel !== "low").map(dev => (
                  <div key={dev.id} className={`p-3 rounded-lg border ${
                    dev.riskLevel === "high" ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-4 h-4 ${dev.riskLevel === "high" ? "text-red-400" : "text-amber-400"}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{dev.name}</p>
                          <p className="text-xs text-slate-400">
                            {dev.riskLevel === "high" ? "Performance declining" : "Workload warning"}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRequestAction('mentorship', dev.name)}
                      >
                        Request Action
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedApproval && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApprovalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-lg p-6 bg-slate-900 border border-emerald-500/30 rounded-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Confirm Approval</h3>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-800/50 mb-4">
                <p className="text-white font-medium mb-1">{selectedApproval.title}</p>
                <p className="text-sm text-slate-400">{selectedApproval.description}</p>
              </div>

              <Textarea
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                placeholder="Add approval note (optional)..."
                className="mb-4 bg-slate-800 border-slate-700"
              />

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => handleApprove(selectedApproval)}
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Confirm Approval
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIDeveloperManagement;
