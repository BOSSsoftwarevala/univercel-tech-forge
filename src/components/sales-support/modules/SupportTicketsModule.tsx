import { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Plus, UserPlus, ArrowUp, CheckCircle, RotateCcw, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

type TicketStatus = "new" | "assigned" | "in_progress" | "waiting" | "resolved" | "closed";

interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  priority: "low" | "medium" | "high" | "critical";
  status: TicketStatus;
  assignedTo: string | null;
  slaTime: number; // minutes remaining
  createdAt: string;
  category: string;
}

const SupportTicketsModule = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "TKT-001", subject: "Payment gateway not working", customer: "Tech Solutions Ltd", priority: "critical", status: "in_progress", assignedTo: "Sarah Chen", slaTime: 12, createdAt: "10 min ago", category: "Technical" },
    { id: "TKT-002", subject: "Cannot login to dashboard", customer: "Healthcare Plus", priority: "high", status: "assigned", assignedTo: "Mike Johnson", slaTime: 45, createdAt: "25 min ago", category: "Access" },
    { id: "TKT-003", subject: "Invoice discrepancy", customer: "Retail Mart", priority: "medium", status: "new", assignedTo: null, slaTime: 120, createdAt: "1 hour ago", category: "Billing" },
    { id: "TKT-004", subject: "Feature request - reporting", customer: "EduLearn Academy", priority: "low", status: "waiting", assignedTo: "Lisa Park", slaTime: 240, createdAt: "2 hours ago", category: "Feature" },
    { id: "TKT-005", subject: "Integration failing", customer: "Global Logistics", priority: "high", status: "resolved", assignedTo: "Emma Davis", slaTime: 0, createdAt: "3 hours ago", category: "Technical" },
  ]);

  const agents = ["Sarah Chen", "Mike Johnson", "Lisa Park", "Emma Davis", "James Wilson"];

  const handleCreateTicket = () => {
    toast.loading("Creating ticket...", { id: "create-ticket" });
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: "New Support Request",
        customer: "New Customer",
        priority: "medium",
        status: "new",
        assignedTo: null,
        slaTime: 120,
        createdAt: "Just now",
        category: "General",
      };
      setTickets([newTicket, ...tickets]);
      toast.success("Ticket created", { id: "create-ticket" });
    }, 600);
  };

  const handleAssign = (ticketId: string, agent: string) => {
    toast.loading("Assigning ticket...", { id: `assign-${ticketId}` });
    setTimeout(() => {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, assignedTo: agent, status: "assigned" } : t));
      toast.success(`Assigned to ${agent}`, { id: `assign-${ticketId}` });
    }, 500);
  };

  const handleReassign = (ticketId: string, agent: string) => {
    toast.loading("Reassigning ticket...", { id: `reassign-${ticketId}` });
    setTimeout(() => {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, assignedTo: agent } : t));
      toast.success(`Reassigned to ${agent}`, { id: `reassign-${ticketId}` });
    }, 500);
  };

  const handleEscalate = (ticketId: string) => {
    toast.loading("Escalating ticket...", { id: `escalate-${ticketId}` });
    setTimeout(() => {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, priority: "critical" } : t));
      toast.warning("Ticket escalated to critical", { id: `escalate-${ticketId}` });
    }, 600);
  };

  const handleResolve = (ticketId: string) => {
    toast.loading("Resolving ticket...", { id: `resolve-${ticketId}` });
    setTimeout(() => {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: "resolved", slaTime: 0 } : t));
      toast.success("Ticket resolved", { id: `resolve-${ticketId}` });
    }, 600);
  };

  const handleReopen = (ticketId: string) => {
    toast.loading("Reopening ticket...", { id: `reopen-${ticketId}` });
    setTimeout(() => {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: "in_progress", slaTime: 60 } : t));
      toast.info("Ticket reopened", { id: `reopen-${ticketId}` });
    }, 500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "medium": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "new": return "bg-purple-500/20 text-purple-300";
      case "assigned": return "bg-blue-500/20 text-blue-300";
      case "in_progress": return "bg-amber-500/20 text-amber-300";
      case "waiting": return "bg-slate-500/20 text-slate-300";
      case "resolved": return "bg-emerald-500/20 text-emerald-300";
      case "closed": return "bg-slate-500/20 text-slate-400";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const openTickets = tickets.filter(t => !["resolved", "closed"].includes(t.status));
  const criticalCount = tickets.filter(t => t.priority === "critical" && t.status !== "resolved").length;
  const slaBreach = tickets.filter(t => t.slaTime < 30 && t.status !== "resolved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Support Tickets</h2>
          <p className="text-slate-400">Manage ticket lifecycle with SLA tracking</p>
        </div>
        <Button onClick={handleCreateTicket} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Ticket className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{openTickets.length}</div>
            <div className="text-xs text-slate-400">Open Tickets</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{criticalCount}</div>
            <div className="text-xs text-slate-400">Critical</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{slaBreach}</div>
            <div className="text-xs text-slate-400">SLA Risk</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">{tickets.filter(t => t.status === "resolved").length}</div>
            <div className="text-xs text-slate-400">Resolved Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Ticket Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 text-sm">{ticket.id}</span>
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                    <Badge variant="outline" className="text-slate-400">{ticket.category}</Badge>
                  </div>
                  {ticket.status !== "resolved" && ticket.status !== "closed" && (
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${ticket.slaTime < 30 ? "text-red-400" : "text-amber-400"}`} />
                      <span className={ticket.slaTime < 30 ? "text-red-300" : "text-amber-300"}>{ticket.slaTime} min</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-100">{ticket.subject}</h4>
                    <p className="text-sm text-slate-400">{ticket.customer} • {ticket.createdAt} • {ticket.assignedTo || "Unassigned"}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {ticket.status === "new" && (
                      <Select onValueChange={(agent) => handleAssign(ticket.id, agent)}>
                        <SelectTrigger className="w-36 bg-slate-700/50 border-slate-600">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map(agent => (
                            <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {ticket.assignedTo && ticket.status !== "resolved" && (
                      <Select onValueChange={(agent) => handleReassign(ticket.id, agent)}>
                        <SelectTrigger className="w-36 bg-slate-700/50 border-slate-600">
                          <SelectValue placeholder="Reassign..." />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.filter(a => a !== ticket.assignedTo).map(agent => (
                            <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {ticket.status !== "resolved" && ticket.priority !== "critical" && (
                      <Button size="sm" variant="outline" onClick={() => handleEscalate(ticket.id)} className="border-amber-500/30 text-amber-300">
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Escalate
                      </Button>
                    )}

                    {ticket.status !== "resolved" && ticket.status !== "closed" && (
                      <Button size="sm" onClick={() => handleResolve(ticket.id)} className="bg-emerald-500 hover:bg-emerald-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    )}

                    {ticket.status === "resolved" && (
                      <Button size="sm" variant="outline" onClick={() => handleReopen(ticket.id)} className="border-cyan-500/30 text-cyan-300">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>

                {ticket.status !== "resolved" && ticket.status !== "closed" && (
                  <div className="mt-3">
                    <Progress value={Math.max(0, 100 - (ticket.slaTime / 120) * 100)} className="h-1" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketsModule;
