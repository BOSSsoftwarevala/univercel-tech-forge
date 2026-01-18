/**
 * VALA AI DASHBOARD
 * =================
 * PURE AI ENGINE MONITORING - NO DEVELOPER CONTENT
 * Separate from Developer Manager Dashboard
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, Cpu, Activity, Zap, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Server, Database, Shield, Eye,
  Play, Pause, RefreshCw, Settings, BarChart3, Layers,
  Bot, Workflow, Bell, FileText, Lock, Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// AI Status Data
const aiSystemStatus = {
  status: "running",
  uptime: "99.97%",
  lastHealthCheck: "2 min ago",
  activeModels: 4,
  totalRequests: "2.4M",
  avgResponseTime: "145ms",
};

// AI Tasks Executed
const aiTasksExecuted = [
  { id: "AI-001", task: "Auto-fix syntax errors", status: "completed", time: "3 min ago", confidence: 98 },
  { id: "AI-002", task: "Security vulnerability scan", status: "completed", time: "8 min ago", confidence: 95 },
  { id: "AI-003", task: "Code review automation", status: "running", time: "In progress", confidence: 92 },
  { id: "AI-004", task: "Performance optimization", status: "queued", time: "Pending", confidence: 88 },
  { id: "AI-005", task: "Documentation generation", status: "completed", time: "15 min ago", confidence: 94 },
  { id: "AI-006", task: "Test case generation", status: "completed", time: "22 min ago", confidence: 91 },
];

// AI Decisions Log
const aiDecisionsLog = [
  { id: "DEC-001", decision: "Approved PR #542 - Low risk changes", category: "approval", time: "5 min ago", riskLevel: "low" },
  { id: "DEC-002", decision: "Flagged suspicious login pattern", category: "security", time: "12 min ago", riskLevel: "high" },
  { id: "DEC-003", decision: "Auto-scaled compute resources", category: "infrastructure", time: "18 min ago", riskLevel: "low" },
  { id: "DEC-004", decision: "Blocked malicious request pattern", category: "security", time: "25 min ago", riskLevel: "critical" },
  { id: "DEC-005", decision: "Optimized database query", category: "performance", time: "32 min ago", riskLevel: "low" },
  { id: "DEC-006", decision: "Sent alert to Admin", category: "notification", time: "45 min ago", riskLevel: "medium" },
];

// AI Alerts
const aiAlerts = [
  { id: "ALT-001", message: "Unusual traffic spike detected", severity: "warning", time: "10 min ago", acknowledged: false },
  { id: "ALT-002", message: "Model accuracy dropped below threshold", severity: "critical", time: "1 hour ago", acknowledged: true },
  { id: "ALT-003", message: "Rate limit approaching for API calls", severity: "info", time: "2 hours ago", acknowledged: true },
  { id: "ALT-004", message: "New security pattern detected", severity: "warning", time: "3 hours ago", acknowledged: false },
];

// AI Automation Queue
const aiAutomationQueue = [
  { id: "AQ-001", name: "Nightly backup verification", schedule: "Daily 02:00", status: "active", nextRun: "In 6 hours" },
  { id: "AQ-002", name: "Log analysis & cleanup", schedule: "Every 4 hours", status: "active", nextRun: "In 2 hours" },
  { id: "AQ-003", name: "Security scan", schedule: "Hourly", status: "active", nextRun: "In 45 min" },
  { id: "AQ-004", name: "Performance metrics collection", schedule: "Every 15 min", status: "active", nextRun: "In 8 min" },
  { id: "AQ-005", name: "Auto-scaling evaluation", schedule: "Every 5 min", status: "paused", nextRun: "Paused" },
];

// AI Models Active
const aiModels = [
  { id: "MOD-001", name: "GPT-4 Turbo", purpose: "Code Analysis", status: "active", accuracy: 96, requests: "45K/day" },
  { id: "MOD-002", name: "Claude 3 Opus", purpose: "Documentation", status: "active", accuracy: 94, requests: "28K/day" },
  { id: "MOD-003", name: "Gemini Pro", purpose: "Security Scan", status: "active", accuracy: 92, requests: "18K/day" },
  { id: "MOD-004", name: "Custom Vision", purpose: "UI Analysis", status: "standby", accuracy: 89, requests: "5K/day" },
];

const ValaAIDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<"tasks" | "decisions" | "alerts" | "queue">("tasks");

  const handleAcknowledgeAlert = (alertId: string) => {
    toast.success(`Alert ${alertId} acknowledged`);
  };

  const handlePauseAutomation = (queueId: string) => {
    toast.info(`Automation ${queueId} paused`);
  };

  const handleResumeAutomation = (queueId: string) => {
    toast.success(`Automation ${queueId} resumed`);
  };

  const handleRefreshStatus = () => {
    toast.info("Refreshing AI system status...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "running": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "queued": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "paused": return "bg-slate-500/20 text-slate-400 border-slate-500/50";
      case "standby": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-emerald-500/20 text-emerald-400";
      case "medium": return "bg-amber-500/20 text-amber-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "critical": return "bg-red-500/20 text-red-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info": return "bg-blue-500/20 text-blue-400";
      case "warning": return "bg-amber-500/20 text-amber-400";
      case "critical": return "bg-red-500/20 text-red-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">VALA AI Engine</h1>
                <p className="text-muted-foreground">AI Monitoring & Automation Control</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn(
                "gap-1 px-3 py-1",
                aiSystemStatus.status === "running" 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" 
                  : "bg-amber-500/20 text-amber-400 border-amber-500/50"
              )}>
                <Radio className="w-3 h-3 animate-pulse" />
                {aiSystemStatus.status === "running" ? "AI Active" : "AI Standby"}
              </Badge>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleRefreshStatus}>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* AI System Stats */}
          <div className="grid grid-cols-6 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-xl font-bold text-emerald-400">Running</p>
                  </div>
                  <Activity className="w-8 h-8 text-emerald-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="text-xl font-bold text-violet-400">{aiSystemStatus.uptime}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-violet-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active Models</p>
                    <p className="text-xl font-bold text-blue-400">{aiSystemStatus.activeModels}</p>
                  </div>
                  <Cpu className="w-8 h-8 text-blue-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Requests</p>
                    <p className="text-xl font-bold text-cyan-400">{aiSystemStatus.totalRequests}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-cyan-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Response</p>
                    <p className="text-xl font-bold text-amber-400">{aiSystemStatus.avgResponseTime}</p>
                  </div>
                  <Clock className="w-8 h-8 text-amber-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border-rose-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending Alerts</p>
                    <p className="text-xl font-bold text-rose-400">{aiAlerts.filter(a => !a.acknowledged).length}</p>
                  </div>
                  <Bell className="w-8 h-8 text-rose-400/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Models Section */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="w-5 h-5 text-violet-400" />
                Active AI Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {aiModels.map((model) => (
                  <div key={model.id} className="p-4 rounded-xl bg-background/50 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground">{model.name}</span>
                      <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{model.purpose}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="text-emerald-400">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-1.5" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Requests</span>
                        <span className="text-foreground">{model.requests}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-border/50 pb-2">
            {[
              { id: "tasks", label: "AI Tasks", icon: Zap },
              { id: "decisions", label: "Decisions Log", icon: FileText },
              { id: "alerts", label: "Alerts", icon: AlertTriangle, badge: aiAlerts.filter(a => !a.acknowledged).length },
              { id: "queue", label: "Automation Queue", icon: Workflow },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={selectedTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={cn(
                  "gap-2",
                  selectedTab === tab.id && "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge ? (
                  <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs">{tab.badge}</Badge>
                ) : null}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              {selectedTab === "tasks" && (
                <div className="space-y-3">
                  {aiTasksExecuted.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{task.task}</p>
                          <p className="text-xs text-muted-foreground">{task.id} • {task.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="font-semibold text-emerald-400">{task.confidence}%</p>
                        </div>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === "decisions" && (
                <div className="space-y-3">
                  {aiDecisionsLog.map((decision) => (
                    <div key={decision.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{decision.decision}</p>
                          <p className="text-xs text-muted-foreground">{decision.id} • {decision.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">{decision.category}</Badge>
                        <Badge className={getRiskColor(decision.riskLevel)}>{decision.riskLevel}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === "alerts" && (
                <div className="space-y-3">
                  {aiAlerts.map((alert) => (
                    <div key={alert.id} className={cn(
                      "flex items-center justify-between p-4 rounded-xl border",
                      alert.acknowledged 
                        ? "bg-background/30 border-border/30 opacity-60" 
                        : "bg-background/50 border-border/50"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          getSeverityColor(alert.severity)
                        )}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.id} • {alert.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        {!alert.acknowledged && (
                          <Button size="sm" variant="outline" onClick={() => handleAcknowledgeAlert(alert.id)}>
                            Acknowledge
                          </Button>
                        )}
                        {alert.acknowledged && (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === "queue" && (
                <div className="space-y-3">
                  {aiAutomationQueue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Workflow className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Next Run</p>
                          <p className="text-sm text-foreground">{item.nextRun}</p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        {item.status === "active" ? (
                          <Button size="sm" variant="outline" onClick={() => handlePauseAutomation(item.id)}>
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleResumeAutomation(item.id)}>
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Approvals Section - Read-Only / Boss Controlled */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-amber-400" />
                AI Approvals
                <Badge variant="outline" className="ml-2 text-xs">Boss Controlled</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium text-foreground">Auto-Approved</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-400">156</p>
                  <p className="text-xs text-muted-foreground mt-1">This week</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span className="font-medium text-foreground">Pending Review</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-400">12</p>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting Boss approval</p>
                </div>
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    <span className="font-medium text-foreground">Blocked</span>
                  </div>
                  <p className="text-3xl font-bold text-red-400">3</p>
                  <p className="text-xs text-muted-foreground mt-1">High-risk actions blocked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ValaAIDashboard;
