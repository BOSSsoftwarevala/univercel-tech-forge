import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Users, Activity, TrendingUp, Award, Eye, Shield,
  Zap, Target, Clock, AlertTriangle, CheckCircle2, Star,
  Code2, Cpu, BarChart3, Flame, Sparkles, UserCheck,
  UserX, RefreshCw, MessageSquare, DollarSign, Calendar,
  Filter, Search, ChevronDown, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AIDeveloperManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);

  // Real-time metrics simulation
  const [liveMetrics, setLiveMetrics] = useState({
    onlineDevelopers: 38,
    activeTasksNow: 47,
    avgProductivity: 87,
    systemLoad: 62,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        onlineDevelopers: Math.max(30, Math.min(50, prev.onlineDevelopers + Math.floor((Math.random() - 0.5) * 3))),
        activeTasksNow: Math.max(40, Math.min(60, prev.activeTasksNow + Math.floor((Math.random() - 0.5) * 4))),
        avgProductivity: Math.max(80, Math.min(95, prev.avgProductivity + (Math.random() - 0.5) * 2)),
        systemLoad: Math.max(50, Math.min(80, prev.systemLoad + (Math.random() - 0.5) * 5)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const aiInsights = [
    {
      type: "warning",
      title: "Burnout Risk Detected",
      developer: "Amit Kumar",
      message: "Working 12% above average hours. Recommend task redistribution.",
      action: "Redistribute Tasks",
    },
    {
      type: "opportunity",
      title: "High Performer Available",
      developer: "Rahul Sharma",
      message: "Has capacity for 2 more tasks. 98% on-time delivery rate.",
      action: "Assign Priority Task",
    },
    {
      type: "alert",
      title: "Performance Decline",
      developer: "Vikram Singh",
      message: "Quality score dropped 15% this week. Recommend mentorship.",
      action: "Schedule Review",
    },
    {
      type: "success",
      title: "Skill Gap Filled",
      developer: "Priya Menon",
      message: "Completed ML certification. Now eligible for AI tasks.",
      action: "Update Profile",
    },
  ];

  const performanceDistribution = [
    { level: "Elite (90+)", count: 8, percentage: 21 },
    { level: "High (80-89)", count: 15, percentage: 39 },
    { level: "Medium (70-79)", count: 10, percentage: 26 },
    { level: "Needs Improvement (<70)", count: 5, percentage: 14 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Online</Badge>;
      case "busy":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Busy</Badge>;
      case "offline":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Offline</Badge>;
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
          <p className="text-slate-400 mt-1">Intelligent workforce monitoring & optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700">
            <Filter className="w-4 h-4 mr-2" />
            Filters
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
              { label: "System Load", value: `${liveMetrics.systemLoad.toFixed(0)}%`, icon: Cpu, color: "purple" },
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

      {/* AI Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {aiInsights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl border ${
              insight.type === "warning" ? "bg-amber-500/10 border-amber-500/30" :
              insight.type === "alert" ? "bg-red-500/10 border-red-500/30" :
              insight.type === "success" ? "bg-emerald-500/10 border-emerald-500/30" :
              "bg-cyan-500/10 border-cyan-500/30"
            }`}
          >
            <div className="flex items-start gap-3">
              {insight.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />}
              {insight.type === "alert" && <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />}
              {insight.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />}
              {insight.type === "opportunity" && <Zap className="w-5 h-5 text-cyan-400 mt-0.5" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{insight.title}</p>
                <p className="text-xs text-slate-400 mt-1">{insight.developer}</p>
                <p className="text-xs text-slate-500 mt-2">{insight.message}</p>
                <Button size="sm" variant="outline" className="mt-3 text-xs h-7">
                  {insight.action}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="developers">All Developers</TabsTrigger>
          <TabsTrigger value="performance">Performance AI</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Performance Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceDistribution.map((level, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-300">{level.level}</span>
                      <span className="text-sm text-cyan-400">{level.count} devs ({level.percentage}%)</span>
                    </div>
                    <Progress value={level.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Developers", value: "38", icon: Users, trend: "+5" },
                    { label: "Avg Rating", value: "4.7", icon: Star, trend: "+0.2" },
                    { label: "Tasks Today", value: "156", icon: CheckCircle2, trend: "+23" },
                    { label: "Total Earnings", value: "₹12.4L", icon: DollarSign, trend: "+₹1.2L" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-700/50">
                      <stat.icon className="w-5 h-5 text-purple-400 mb-2" />
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{stat.label}</span>
                        <span className="text-xs text-emerald-400">{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      <div className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center ${
                        i === 0 ? "bg-amber-500 text-black" :
                        i === 1 ? "bg-slate-400 text-black" :
                        "bg-orange-700 text-white"
                      }`}>
                        #{i + 1}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-slate-400">Tasks</p>
                        <p className="text-white font-medium">{dev.tasksCompleted}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">AI Score</p>
                        <p className="text-cyan-400 font-medium">{dev.aiScore}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Developers Tab */}
        <TabsContent value="developers" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Developer Roster ({developers.length})
                </CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search developers..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-slate-900 border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {developers.filter(d => 
                  d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((dev, i) => (
                  <motion.div
                    key={dev.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-xl bg-slate-700/30 border border-slate-600/50 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      {/* Avatar & Basic Info */}
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

                      {/* Skills */}
                      <div className="flex-1 flex flex-wrap gap-1">
                        {dev.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs border-slate-600">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-5 gap-6 text-center">
                        <div>
                          <p className="text-xs text-slate-400">Rating</p>
                          <p className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400" />
                            {dev.rating}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Tasks</p>
                          <p className="text-lg font-bold text-white">{dev.currentTasks}/{dev.maxTasks}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Productivity</p>
                          <p className={`text-lg font-bold flex items-center justify-center gap-1 ${
                            dev.productivity >= 90 ? "text-emerald-400" :
                            dev.productivity >= 75 ? "text-amber-400" : "text-red-400"
                          }`}>
                            {dev.productivity}%
                            {dev.trend === "up" && <ArrowUpRight className="w-4 h-4" />}
                            {dev.trend === "down" && <ArrowDownRight className="w-4 h-4" />}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">AI Score</p>
                          <p className="text-lg font-bold text-purple-400">{dev.aiScore}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Earnings</p>
                          <p className="text-lg font-bold text-emerald-400">₹{(dev.earnings / 1000).toFixed(0)}K</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-slate-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance AI Tab */}
        <TabsContent value="performance" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/30 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-400" />
                  AI Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
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
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              dev.aiScore >= 90 ? "bg-emerald-500" :
                              dev.aiScore >= 75 ? "bg-cyan-500" :
                              dev.aiScore >= 60 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${dev.aiScore}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Risk Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {developers.filter(d => d.riskLevel !== "low").map(dev => (
                  <div key={dev.id} className={`p-3 rounded-lg border ${
                    dev.riskLevel === "high" ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"
                  }`}>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-4 h-4 ${dev.riskLevel === "high" ? "text-red-400" : "text-amber-400"}`} />
                      <div>
                        <p className="text-sm font-medium text-white">{dev.name}</p>
                        <p className="text-xs text-slate-400">
                          {dev.riskLevel === "high" ? "Performance declining" : "Workload warning"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Predictions Tab */}
        <TabsContent value="predictions" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Next Week Capacity",
                value: "42 developers",
                prediction: "85% utilization expected",
                trend: "up",
                icon: Users,
              },
              {
                title: "Expected Earnings",
                value: "₹18.5L",
                prediction: "+12% from this week",
                trend: "up",
                icon: DollarSign,
              },
              {
                title: "SLA Risk Tasks",
                value: "3 tasks",
                prediction: "Recommend reassignment",
                trend: "down",
                icon: AlertTriangle,
              },
            ].map((prediction, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                  <CardContent className="p-6">
                    <prediction.icon className="w-8 h-8 text-purple-400 mb-4" />
                    <p className="text-slate-400 text-sm">{prediction.title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{prediction.value}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {prediction.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm text-slate-400">{prediction.prediction}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDeveloperManagement;
