import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Eye, TrendingUp, Globe2, BarChart3, PieChart, AlertTriangle,
  Lightbulb, ThumbsUp, ThumbsDown, MessageSquare, Shield, Clock,
  Target, DollarSign, Users, Activity, Brain, Zap, CheckCircle2,
  XCircle, ChevronRight, FileText, Bell, Star, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock KPI data
const kpiData = {
  revenue: { value: "$4.2M", change: "+12.5%", trend: "up" },
  users: { value: "156K", change: "+8.2%", trend: "up" },
  retention: { value: "94.2%", change: "+2.1%", trend: "up" },
  satisfaction: { value: "4.8/5", change: "+0.3", trend: "up" },
};

// Regional performance
const regionalPerformance = [
  { region: "Asia Pacific", revenue: 1250000, growth: 18.5, status: "excellent" },
  { region: "Europe", revenue: 980000, growth: 12.3, status: "good" },
  { region: "Americas", revenue: 1450000, growth: 8.7, status: "good" },
  { region: "Middle East", revenue: 320000, growth: -2.1, status: "attention" },
  { region: "Africa", revenue: 180000, growth: 25.4, status: "excellent" },
];

// AI suggestions
const aiSuggestions = [
  {
    id: 1,
    type: "growth",
    title: "Expand to Southeast Asia",
    description: "Based on market analysis, Vietnam and Indonesia show 40% YoY growth potential in our sector.",
    confidence: 92,
    impact: "high",
    status: "pending"
  },
  {
    id: 2,
    type: "risk",
    title: "Middle East Revenue Decline",
    description: "Revenue dropped 2.1% this quarter. Recommend reviewing local franchise operations and market conditions.",
    confidence: 87,
    impact: "medium",
    status: "pending"
  },
  {
    id: 3,
    type: "product",
    title: "New Product Category Gap",
    description: "Competitors are gaining traction with enterprise solutions. Consider expanding product portfolio.",
    confidence: 78,
    impact: "high",
    status: "pending"
  },
  {
    id: 4,
    type: "efficiency",
    title: "Support Cost Optimization",
    description: "AI chatbot implementation could reduce support costs by 35% while maintaining satisfaction scores.",
    confidence: 94,
    impact: "medium",
    status: "approved"
  },
];

// Strategic approval queue
const approvalQueue = [
  { id: 1, title: "New Franchise Agreement - Dubai", submittedBy: "Super Admin", amount: "$500K", priority: "high", daysAgo: 2 },
  { id: 2, title: "Marketing Campaign Budget", submittedBy: "Marketing Head", amount: "$120K", priority: "medium", daysAgo: 1 },
  { id: 3, title: "Technology Infrastructure Upgrade", submittedBy: "Server Manager", amount: "$350K", priority: "high", daysAgo: 3 },
  { id: 4, title: "Legal Compliance Update", submittedBy: "Legal Manager", amount: "$45K", priority: "low", daysAgo: 5 },
];

// Risk alerts
const riskAlerts = [
  { id: 1, level: "high", title: "Regulatory Change in EU", description: "New data protection requirements effective Q2", deadline: "45 days" },
  { id: 2, level: "medium", title: "Competitor Product Launch", description: "Major competitor announcing new features", deadline: "30 days" },
  { id: 3, level: "low", title: "Currency Fluctuation", description: "USD/EUR volatility may impact projections", deadline: "Ongoing" },
];

interface CEODashboardProps {
  activeNav?: string;
}

const CEODashboard = ({ activeNav }: CEODashboardProps) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<typeof aiSuggestions[0] | null>(null);
  const [noteText, setNoteText] = useState("");
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  
  // Map sidebar navigation to internal tabs
  const getTabFromNav = (nav?: string): string => {
    const navToTabMap: Record<string, string> = {
      'dashboard': 'overview',
      'overview': 'overview',
      'revenue': 'regions',
      'analytics': 'insights',
      'reports': 'approvals',
      'settings': 'overview',
    };
    return navToTabMap[nav || 'dashboard'] || 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromNav(activeNav));
  
  // Sync internal tab with sidebar navigation
  useEffect(() => {
    if (activeNav) {
      const mappedTab = getTabFromNav(activeNav);
      setActiveTab(mappedTab);
    }
  }, [activeNav]);

  const handleApprove = (id: number) => {
    toast.success("Suggestion approved and sent to Super Admin for implementation");
  };

  const handleReject = (id: number, reason: string) => {
    toast.info("Suggestion rejected with feedback");
  };

  const handleAddNote = () => {
    if (noteText.length < 10) {
      toast.error("Note must be at least 10 characters");
      return;
    }
    toast.success("Strategic note added to CEO board");
    setNoteText("");
    setShowNoteDialog(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-emerald-400";
      case "good": return "text-blue-400";
      case "attention": return "text-amber-400";
      default: return "text-zinc-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950 p-6">
      {/* Premium CEO Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CEO Dashboard</h1>
              <p className="text-violet-400/80">Vision & Strategic Oversight • Read-Only Access</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50 px-4 py-2">
              <Eye className="w-4 h-4 mr-2" />
              VISION MODE
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
              <Shield className="w-3 h-3 mr-1" />
              Read + Suggest + Approve
            </Badge>
            <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
              <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Add Strategic Note
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-violet-500/30">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Strategic Note</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="Share your vision, concerns, or strategic direction..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
                <DialogFooter>
                  <Button onClick={handleAddNote} className="bg-violet-600 hover:bg-violet-700">
                    Submit Note
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", ...kpiData.revenue, icon: DollarSign, color: "emerald" },
          { label: "Active Users", ...kpiData.users, icon: Users, color: "blue" },
          { label: "Retention Rate", ...kpiData.retention, icon: Target, color: "violet" },
          { label: "Satisfaction", ...kpiData.satisfaction, icon: Star, color: "amber" },
        ].map((kpi, i) => (
          <Card key={i} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                  <p className={`text-sm mt-1 ${kpi.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    {kpi.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${kpi.color}-500/20 flex items-center justify-center`}>
                  <kpi.icon className={`w-6 h-6 text-${kpi.color}-400`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            Global Overview
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <Sparkles className="w-4 h-4 mr-1" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="approvals" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            Strategic Approvals
          </TabsTrigger>
          <TabsTrigger value="risks" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            Risk & Compliance
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            CEO Notes
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  Revenue Trends (Read-Only)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700/50">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-violet-400/50 mx-auto mb-2" />
                    <p className="text-slate-400">Revenue Chart</p>
                    <p className="text-2xl font-bold text-white mt-2">$4.2M MTD</p>
                    <p className="text-sm text-emerald-400">+12.5% vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-violet-400" />
                  System Health Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Server Uptime", value: 99.9, color: "emerald" },
                    { label: "API Response", value: 95, color: "blue" },
                    { label: "User Satisfaction", value: 96, color: "violet" },
                    { label: "Security Score", value: 98, color: "amber" },
                  ].map((metric, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{metric.label}</span>
                        <span className="text-white font-medium">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-violet-400" />
                Regional Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {regionalPerformance.map((region, i) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <h4 className="text-sm font-medium text-white">{region.region}</h4>
                    <p className="text-2xl font-bold text-white mt-2">
                      ${(region.revenue / 1000000).toFixed(2)}M
                    </p>
                    <p className={`text-sm mt-1 ${region.growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {region.growth >= 0 ? "+" : ""}{region.growth}%
                    </p>
                    <Badge className={`mt-2 ${getStatusColor(region.status)}`}>
                      {region.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-400" />
                AI-Powered Strategic Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-violet-500/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-violet-400" />
                            <h4 className="font-medium text-white">{suggestion.title}</h4>
                            <Badge className={getImpactColor(suggestion.impact)}>
                              {suggestion.impact} impact
                            </Badge>
                            {suggestion.status === "approved" && (
                              <Badge className="bg-emerald-500/20 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{suggestion.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500">
                              AI Confidence: <span className="text-violet-400">{suggestion.confidence}%</span>
                            </span>
                            <Progress value={suggestion.confidence} className="w-24 h-1" />
                          </div>
                        </div>
                        {suggestion.status === "pending" && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApprove(suggestion.id)}
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(suggestion.id, "Not aligned with current strategy")}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                Strategic Approval Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {approvalQueue.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{item.title}</h4>
                          <Badge className={getImpactColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">
                          By {item.submittedBy} • {item.daysAgo} days ago
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-lg font-bold text-white">{item.amount}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => toast.success("Approved!")}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => toast.info("Rejected")}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Tab */}
        <TabsContent value="risks" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Risk & Compliance Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${
                    alert.level === "high" ? "bg-red-500/10 border-red-500/30" :
                    alert.level === "medium" ? "bg-amber-500/10 border-amber-500/30" :
                    "bg-blue-500/10 border-blue-500/30"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getImpactColor(alert.level)}>
                            {alert.level.toUpperCase()}
                          </Badge>
                          <h4 className="font-medium text-white">{alert.title}</h4>
                        </div>
                        <p className="text-sm text-slate-400">{alert.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Deadline</p>
                        <p className="text-sm font-medium text-white">{alert.deadline}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                CEO Notes & Strategic Direction
              </CardTitle>
              <Button onClick={() => setShowNoteDialog(true)} className="bg-violet-600 hover:bg-violet-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-violet-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-violet-500/20 text-violet-400">Strategic</Badge>
                    <span className="text-xs text-slate-500">Today</span>
                  </div>
                  <p className="text-slate-300">
                    Focus on expanding our presence in Southeast Asia. The growth potential there aligns with our 5-year vision.
                    Prioritize quality partnerships over rapid expansion.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-500/20 text-blue-400">Direction</Badge>
                    <span className="text-xs text-slate-500">2 days ago</span>
                  </div>
                  <p className="text-slate-300">
                    Review our pricing strategy for enterprise clients. We're leaving money on the table.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CEO Powers Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-violet-900/30 to-indigo-900/30 border-violet-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Eye className="w-8 h-8 text-violet-400" />
              <div>
                <h3 className="text-lg font-bold text-white">CEO Access Level</h3>
                <p className="text-sm text-violet-400">Vision + Oversight Role</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Read All Data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Strategic Approvals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Add Suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">View AI Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-slate-400">No Create</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-slate-400">No Edit</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-slate-400">No Delete</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-slate-400">No Operations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CEODashboard;
