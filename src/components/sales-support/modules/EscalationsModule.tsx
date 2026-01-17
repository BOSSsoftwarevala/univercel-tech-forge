import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowUp, Clock, CheckCircle, User, Shield, AlertTriangle, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface Escalation {
  id: string;
  issue: string;
  source: "ticket" | "call" | "email" | "chat";
  sourceId: string;
  level: 1 | 2 | 3;
  priority: "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "resolved";
  assignedTo: string | null;
  slaRemaining: number;
  reason: string;
  customer: string;
  createdAt: string;
  autoEscalated: boolean;
}

const EscalationsModule = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([
    { id: "ESC-001", issue: "Service outage complaint", source: "call", sourceId: "CALL-003", level: 3, priority: "critical", status: "in_progress", assignedTo: "Manager: David Lee", slaRemaining: 15, reason: "Customer threatening legal action", customer: "Global Logistics", createdAt: "15 min ago", autoEscalated: false },
    { id: "ESC-002", issue: "Invoice discrepancy - $50,000", source: "email", sourceId: "EM-001", level: 2, priority: "high", status: "pending", assignedTo: null, slaRemaining: 45, reason: "High value dispute", customer: "Tech Solutions Ltd", createdAt: "30 min ago", autoEscalated: true },
    { id: "ESC-003", issue: "Integration failure", source: "ticket", sourceId: "TKT-001", level: 2, priority: "high", status: "in_progress", assignedTo: "Senior: Emma Davis", slaRemaining: 60, reason: "SLA breach risk", customer: "Healthcare Plus", createdAt: "1 hour ago", autoEscalated: true },
    { id: "ESC-004", issue: "Feature urgency", source: "chat", sourceId: "CHAT-002", level: 1, priority: "medium", status: "resolved", assignedTo: "Sarah Chen", slaRemaining: 0, reason: "VIP customer request", customer: "Retail Mart", createdAt: "2 hours ago", autoEscalated: false },
  ]);

  const handlers = {
    1: ["Sarah Chen", "Mike Johnson", "Lisa Park"],
    2: ["Senior: Emma Davis", "Senior: James Wilson"],
    3: ["Manager: David Lee", "Director: Anna Smith"],
  };

  const handleAssign = (escalationId: string, handler: string) => {
    toast.loading("Assigning escalation...", { id: `assign-${escalationId}` });
    setTimeout(() => {
      setEscalations(escalations.map(e => e.id === escalationId ? { ...e, assignedTo: handler, status: "in_progress" } : e));
      toast.success(`Assigned to ${handler}`, { id: `assign-${escalationId}` });
    }, 500);
  };

  const handleEscalateUp = (escalationId: string) => {
    const esc = escalations.find(e => e.id === escalationId);
    if (!esc || esc.level >= 3) return;
    
    toast.loading("Escalating to next level...", { id: `escalate-${escalationId}` });
    setTimeout(() => {
      setEscalations(escalations.map(e => e.id === escalationId ? { 
        ...e, 
        level: (e.level + 1) as 1 | 2 | 3, 
        priority: "critical",
        assignedTo: null 
      } : e));
      toast.warning(`Escalated to Level ${(esc.level + 1)}`, { id: `escalate-${escalationId}` });
    }, 600);
  };

  const handleResolve = (escalationId: string) => {
    toast.loading("Resolving escalation...", { id: `resolve-${escalationId}` });
    setTimeout(() => {
      setEscalations(escalations.map(e => e.id === escalationId ? { ...e, status: "resolved", slaRemaining: 0 } : e));
      toast.success("Escalation resolved", { id: `resolve-${escalationId}` });
    }, 600);
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case 2: return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case 3: return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-300";
      case "high": return "bg-amber-500/20 text-amber-300";
      default: return "bg-blue-500/20 text-blue-300";
    }
  };

  const pendingCount = escalations.filter(e => e.status === "pending").length;
  const criticalCount = escalations.filter(e => e.priority === "critical" && e.status !== "resolved").length;
  const level3Count = escalations.filter(e => e.level === 3 && e.status !== "resolved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Escalation Management</h2>
          <p className="text-slate-400">Track and manage escalated issues with SLA enforcement</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{escalations.filter(e => e.status !== "resolved").length}</div>
            <div className="text-xs text-slate-400">Active Escalations</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{pendingCount}</div>
            <div className="text-xs text-slate-400">Pending Assignment</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{criticalCount}</div>
            <div className="text-xs text-slate-400">Critical</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">{level3Count}</div>
            <div className="text-xs text-slate-400">Level 3 (Management)</div>
          </CardContent>
        </Card>
      </div>

      {/* Escalations List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Escalation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {escalations.map((esc, index) => (
              <motion.div
                key={esc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors ${esc.priority === "critical" ? "border-l-4 border-red-500" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 text-sm">{esc.id}</span>
                    <Badge className={getLevelColor(esc.level)}>Level {esc.level}</Badge>
                    <Badge className={getPriorityColor(esc.priority)}>{esc.priority}</Badge>
                    <Badge variant="outline" className="text-slate-400">{esc.source.toUpperCase()}: {esc.sourceId}</Badge>
                    {esc.autoEscalated && <Badge className="bg-purple-500/20 text-purple-300">Auto-Escalated</Badge>}
                  </div>
                  {esc.status !== "resolved" && (
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${esc.slaRemaining < 30 ? "text-red-400" : "text-amber-400"}`} />
                      <span className={esc.slaRemaining < 30 ? "text-red-300" : "text-amber-300"}>{esc.slaRemaining} min SLA</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <h4 className="font-medium text-slate-100">{esc.issue}</h4>
                  <p className="text-sm text-slate-400">{esc.customer} • {esc.createdAt} • {esc.assignedTo || "Unassigned"}</p>
                  <p className="text-sm text-amber-400/80 mt-1">Reason: {esc.reason}</p>
                </div>

                {esc.status !== "resolved" && (
                  <div className="mb-3">
                    <Progress value={Math.max(0, 100 - (esc.slaRemaining / 120) * 100)} className="h-1" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge className={esc.status === "resolved" ? "bg-emerald-500/20 text-emerald-300" : "bg-blue-500/20 text-blue-300"}>
                    {esc.status.replace('_', ' ')}
                  </Badge>

                  <div className="flex items-center gap-2">
                    {esc.status !== "resolved" && !esc.assignedTo && (
                      <Select onValueChange={(handler) => handleAssign(esc.id, handler)}>
                        <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600">
                          <SelectValue placeholder="Assign handler" />
                        </SelectTrigger>
                        <SelectContent>
                          {handlers[esc.level].map(handler => (
                            <SelectItem key={handler} value={handler}>{handler}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {esc.status !== "resolved" && esc.level < 3 && (
                      <Button size="sm" variant="outline" onClick={() => handleEscalateUp(esc.id)} className="border-red-500/30 text-red-300">
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Level {esc.level + 1}
                      </Button>
                    )}

                    {esc.status !== "resolved" && (
                      <Button size="sm" onClick={() => handleResolve(esc.id)} className="bg-emerald-500 hover:bg-emerald-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Escalation Info */}
      <Card className="bg-gradient-to-r from-amber-900/30 to-red-900/30 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-medium text-amber-100">Auto-Escalation Rules Active</h3>
              <p className="text-sm text-slate-400">Issues unresolved past SLA automatically escalate. Level 3 notifies management.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscalationsModule;
