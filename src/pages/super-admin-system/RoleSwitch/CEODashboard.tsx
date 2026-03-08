import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Eye, TrendingUp, Globe2, BarChart3, AlertTriangle,
  Lightbulb, ThumbsUp, ThumbsDown, MessageSquare, Shield, Clock,
  Target, DollarSign, Users, Activity, Brain, Zap, CheckCircle2,
  XCircle, FileText, Sparkles, RefreshCw, Server, Package,
  ShoppingCart, AlertCircle, Layers, ScanLine, Bot
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAIRAMetrics } from "@/hooks/useAIRAMetrics";
import {
  RevenueAreaChart,
  ModuleBarChart,
  RoleDistributionPie,
  SystemHealthRadar,
  ActivityTimeline,
  KPISparkline,
  CategoryTreemap,
} from "@/components/aira/AIRACharts";
import { AIRASystemScanner, ScanReport } from "@/components/aira/AIRASystemScanner";
import AIRAChatInterface from "@/components/aira/AIRAChatInterface";

interface CEODashboardProps {
  activeNav?: string;
}

const NAV_MAP: Record<string, string> = {
  dashboard: "scanner",
  overview: "scanner",
  "global-overview": "scanner",
  revenue: "analytics",
  "active-users": "scanner",
  retention: "scanner",
  "ai-insights": "insights",
  approvals: "approvals",
  risks: "risks",
  notes: "notes",
};

const CEODashboard = ({ activeNav }: CEODashboardProps) => {
  const [activeSection, setActiveSection] = useState("scanner");
  const [noteText, setNoteText] = useState("");
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const { user } = useAuth();
  const { metrics, loading, lastRefresh, refresh } = useAIRAMetrics();

  useEffect(() => {
    if (activeNav) setActiveSection(NAV_MAP[activeNav] || "scanner");
  }, [activeNav]);

  const logAction = useCallback(
    async (action: string, target: string, meta?: Record<string, any>) => {
      try {
        await (supabase as any).from("audit_logs").insert({
          user_id: user?.id,
          role: "ceo",
          module: "aira-dashboard",
          action,
          meta_json: { target, timestamp: new Date().toISOString(), ...meta },
        });
      } catch {}
    },
    [user?.id]
  );

  const handleAddNote = async () => {
    if (noteText.length < 10) {
      toast.error("Note must be at least 10 characters");
      return;
    }
    await logAction("strategic_note_add", "ceo_notes", {
      notePreview: noteText.substring(0, 50),
    });
    toast.success("Strategic note added");
    setNoteText("");
    setShowNoteDialog(false);
  };

  // ─── Sections ────────────────────────────────────────────────
  const sections = [
    { id: "scanner", label: "System Scanner", icon: ScanLine },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "chat", label: "AIRA Chat", icon: Bot },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "approvals", label: "Approvals", icon: FileText },
    { id: "risks", label: "Risk Radar", icon: AlertTriangle },
    { id: "notes", label: "CEO Notes", icon: MessageSquare },
  ];

  const severityColor = (s: string) => {
    if (s === "critical" || s === "emergency") return "text-red-400 bg-red-500/20";
    if (s === "warning") return "text-amber-400 bg-amber-500/20";
    return "text-slate-400 bg-slate-700/50";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <ScanLine className="w-12 h-12 text-violet-400 animate-pulse mx-auto" />
          <p className="text-slate-400 text-sm">AIRA Scanning Systems...</p>
        </div>
      </div>
    );
  }

  const m = metrics!;

  return (
    <div className="min-h-screen">
      {/* ─── Tableau-style Header ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-violet-500/20 px-6 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">AIRA</h1>
              <p className="text-[10px] text-violet-400/80 uppercase tracking-widest">
                CEO System Scanner • Tableau View
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Section tabs - Tableau style */}
            <div className="flex bg-slate-800/60 rounded-lg p-0.5 border border-slate-700/50">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeSection === s.id
                      ? "bg-violet-500/20 text-violet-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              ))}
            </div>

            <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50 text-[10px]">
              <Eye className="w-3 h-3 mr-1" />
              VISION
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={refresh}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <span className="text-[10px] text-slate-600">
              {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">
        {/* ─── SCANNER ──────────────────────────────────────── */}
        {activeSection === "scanner" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
              {[
                { label: "Users", value: m.totalUsers.toLocaleString(), icon: Users, color: "violet", spark: m.kpiSparklines.users },
                { label: "Revenue", value: `₹${(m.totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: "emerald", spark: m.kpiSparklines.revenue },
                { label: "Orders", value: m.totalOrders.toLocaleString(), icon: ShoppingCart, color: "blue", spark: m.kpiSparklines.orders },
                { label: "Products", value: m.totalProducts.toLocaleString(), icon: Package, color: "amber" },
                { label: "Servers", value: m.activeServers.toLocaleString(), icon: Server, color: "cyan", spark: m.kpiSparklines.servers },
                { label: "Approvals", value: m.pendingApprovals.toLocaleString(), icon: Clock, color: "orange" },
                { label: "Alerts", value: m.criticalAlerts.toLocaleString(), icon: AlertCircle, color: "red" },
                { label: "Audit/24h", value: m.auditEvents24h.toLocaleString(), icon: Layers, color: "purple" },
              ].map((kpi, i) => (
                <Card
                  key={i}
                  className="bg-slate-900/60 border-slate-700/40 backdrop-blur hover:border-violet-500/30 transition-all"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {kpi.label}
                      </span>
                      <kpi.icon className={`w-3.5 h-3.5 text-${kpi.color}-400`} />
                    </div>
                    <p className="text-lg font-bold text-white">{kpi.value}</p>
                    {kpi.spark && (
                      <div className="mt-1">
                        <KPISparkline
                          data={kpi.spark}
                          color={`hsl(${kpi.color === 'violet' ? '270' : kpi.color === 'emerald' ? '160' : kpi.color === 'blue' ? '200' : kpi.color === 'cyan' ? '180' : '270'}, 70%, 55%)`}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ─── AIRA 37-Module System Scanner ──────────────── */}
            <AIRASystemScanner />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    Revenue vs Target
                    <Badge className="text-[9px] bg-slate-700/50 text-slate-400">LIVE</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueAreaChart data={m.revenueByMonth} />
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    Module Activity Scanner
                    <Badge className="text-[9px] bg-slate-700/50 text-slate-400">LIVE</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ModuleBarChart data={m.moduleActivity} />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ─── ANALYTICS ────────────────────────────────────── */}
        {activeSection === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    Revenue Trend (Full Year)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueAreaChart data={m.revenueByMonth} />
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-emerald-400" />
                    Category Revenue Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryTreemap data={m.categoryBreakdown} />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Full Module Scan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ModuleBarChart data={m.moduleActivity} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    User Role Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RoleDistributionPie data={m.roleDistribution} />
                </CardContent>
              </Card>
              <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Platform Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SystemHealthRadar data={m.systemHealth} />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ─── AIRA CHAT ──────────────────────────────────── */}
        {activeSection === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AIRAChatInterface />
          </motion.div>
        )}

        {/* ─── AI INSIGHTS ──────────────────────────────────── */}
        {activeSection === "insights" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-violet-400" />
                  AI-Powered Strategic Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {[
                      { id: 1, type: "growth", title: "Expand to Southeast Asia", desc: "Vietnam and Indonesia show 40% YoY growth potential.", confidence: 92, impact: "high" },
                      { id: 2, type: "risk", title: "Middle East Revenue Decline", desc: "Revenue dropped 2.1%. Review local franchise ops.", confidence: 87, impact: "medium" },
                      { id: 3, type: "product", title: "Enterprise Product Gap", desc: "Competitors gaining with enterprise solutions.", confidence: 78, impact: "high" },
                      { id: 4, type: "efficiency", title: "Support Cost Optimization", desc: "AI chatbot could reduce costs by 35%.", confidence: 94, impact: "medium" },
                    ].map((s) => (
                      <div
                        key={s.id}
                        className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-violet-500/30 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="w-4 h-4 text-violet-400" />
                              <h4 className="font-medium text-white text-sm">{s.title}</h4>
                              <Badge
                                className={
                                  s.impact === "high"
                                    ? "bg-red-500/20 text-red-400 border-red-500/50 text-[10px]"
                                    : "bg-amber-500/20 text-amber-400 border-amber-500/50 text-[10px]"
                                }
                              >
                                {s.impact}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{s.desc}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500">
                                Confidence: <span className="text-violet-400">{s.confidence}%</span>
                              </span>
                              <Progress value={s.confidence} className="w-20 h-1" />
                            </div>
                          </div>
                          <div className="flex gap-1 ml-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                await logAction("suggestion_approve", s.title);
                                toast.success("Approved & sent to Super Admin");
                              }}
                              className="text-emerald-400 hover:bg-emerald-500/10 h-8 w-8 p-0"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                await logAction("suggestion_reject", s.title);
                                toast.info("Rejected");
                              }}
                              className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── APPROVALS ────────────────────────────────────── */}
        {activeSection === "approvals" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  Strategic Approval Queue
                  <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">
                    {m.pendingApprovals} Pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {[
                      { id: 1, title: "New Franchise Agreement - Dubai", by: "Super Admin", amount: "$500K", priority: "high", days: 2 },
                      { id: 2, title: "Marketing Campaign Budget", by: "Marketing Head", amount: "$120K", priority: "medium", days: 1 },
                      { id: 3, title: "Infrastructure Upgrade", by: "Server Manager", amount: "$350K", priority: "high", days: 3 },
                      { id: 4, title: "Legal Compliance Update", by: "Legal Manager", amount: "$45K", priority: "low", days: 5 },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-sm font-medium text-white">{item.title}</h4>
                            <Badge
                              className={`text-[9px] ${
                                item.priority === "high"
                                  ? "bg-red-500/20 text-red-400"
                                  : item.priority === "medium"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            By {item.by} • {item.days}d ago
                          </p>
                        </div>
                        <p className="text-sm font-bold text-white mr-4">{item.amount}</p>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 h-7 w-7 p-0"
                            onClick={async () => {
                              await logAction("approval_approve", item.title, { amount: item.amount });
                              toast.success("Approved!");
                            }}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 w-7 p-0"
                            onClick={async () => {
                              await logAction("approval_reject", item.title);
                              toast.info("Rejected");
                            }}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── RISKS ────────────────────────────────────────── */}
        {activeSection === "risks" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    System Health Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SystemHealthRadar data={m.systemHealth} />
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Active Risk Alerts ({m.criticalAlerts})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { level: "high", title: "EU Regulatory Change", desc: "New data protection requirements Q2", deadline: "45 days" },
                      { level: "medium", title: "Competitor Launch", desc: "Major features announced", deadline: "30 days" },
                      { level: "low", title: "Currency Fluctuation", desc: "USD/EUR volatility", deadline: "Ongoing" },
                    ].map((alert, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          alert.level === "high"
                            ? "bg-red-500/10 border-red-500/30"
                            : alert.level === "medium"
                            ? "bg-amber-500/10 border-amber-500/30"
                            : "bg-blue-500/10 border-blue-500/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <Badge
                                className={`text-[9px] ${
                                  alert.level === "high"
                                    ? "bg-red-500/20 text-red-400"
                                    : alert.level === "medium"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {alert.level.toUpperCase()}
                              </Badge>
                              <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                            </div>
                            <p className="text-[11px] text-slate-400">{alert.desc}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-500">Deadline</p>
                            <p className="text-xs font-medium text-white">{alert.deadline}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ─── NOTES ────────────────────────────────────────── */}
        {activeSection === "notes" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  CEO Strategic Notes
                </CardTitle>
                <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-violet-500/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Strategic Note</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      placeholder="Vision, concerns, or strategic direction..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                    />
                    <DialogFooter>
                      <Button onClick={handleAddNote} className="bg-violet-600 hover:bg-violet-700">
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-violet-500/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge className="bg-violet-500/20 text-violet-400 text-[10px]">Strategic</Badge>
                      <span className="text-[10px] text-slate-500">Today</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Focus on Southeast Asia expansion. Prioritize quality partnerships over rapid scale.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">Direction</Badge>
                      <span className="text-[10px] text-slate-500">2 days ago</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Review enterprise pricing strategy. We're leaving money on the table.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── CEO Access Footer ────────────────────────────── */}
        <Card className="bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border-violet-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-5 h-5 text-violet-400" />
              <div>
                <h3 className="text-sm font-bold text-white">CEO Access Level</h3>
                <p className="text-[10px] text-violet-400">Vision + Oversight</p>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {[
                { ok: true, label: "Read All" },
                { ok: true, label: "Approvals" },
                { ok: true, label: "Suggestions" },
                { ok: true, label: "AI Insights" },
                { ok: false, label: "Create" },
                { ok: false, label: "Edit" },
                { ok: false, label: "Delete" },
                { ok: false, label: "Operations" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-1">
                  {p.ok ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-400/60" />
                  )}
                  <span className={`text-[10px] ${p.ok ? "text-slate-300" : "text-slate-500"}`}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CEODashboard;
