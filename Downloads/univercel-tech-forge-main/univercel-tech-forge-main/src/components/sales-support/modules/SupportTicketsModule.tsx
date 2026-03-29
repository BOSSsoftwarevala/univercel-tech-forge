import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Plus, UserPlus, ArrowUp, CheckCircle, RotateCcw, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SupportTicketsModule = () => {
  const { tickets, loading, fetchTickets, createTicket, assignTicket, resolveTicket } = useSupportTickets();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium"
  });

  // Load tickets on mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async () => {
    if (!newTicketForm.subject || !newTicketForm.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createTicket(
        newTicketForm.subject,
        newTicketForm.description,
        newTicketForm.category,
        newTicketForm.priority
      );
      setNewTicketForm({ subject: "", description: "", category: "general", priority: "medium" });
      setIsCreateDialogOpen(false);
      await fetchTickets();
    } catch (err) {
      // Error already shown in hook
    }
  };

  const handleAssign = async (ticketId: string, agent: string) => {
    try {
      await assignTicket(ticketId, agent);
      await fetchTickets();
    } catch (err) {
      // Error already shown in hook
    }
  };

  const handleResolve = async (ticketId: string) => {
    try {
      await resolveTicket(ticketId);
      await fetchTickets();
    } catch (err) {
      // Error already shown in hook
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "medium": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusColor = (status: string) => {
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

  const calculateSLAMinutes = (deadline: string) => {
    if (!deadline) return 0;
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    return Math.max(0, Math.ceil((deadlineTime - now) / (1000 * 60)));
  };

  const openTickets = tickets.filter(t => !["resolved", "closed"].includes(t.status));
  const criticalCount = tickets.filter(t => t.priority === "critical" && t.status !== "resolved").length;
  const slaBreach = tickets.filter(t => calculateSLAMinutes(t.sla_deadline) < 30 && t.status !== "resolved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Support Tickets</h2>
          <p className="text-slate-400">Real-time ticket management with SLA tracking</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300">Subject</label>
                <Input 
                  placeholder="Ticket subject"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({...newTicketForm, subject: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Description</label>
                <Textarea 
                  placeholder="Detailed description"
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({...newTicketForm, description: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Category</label>
                <Select value={newTicketForm.category} onValueChange={(cat) => setNewTicketForm({...newTicketForm, category: cat})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-300">Priority</label>
                <Select value={newTicketForm.priority} onValueChange={(pri) => setNewTicketForm({...newTicketForm, priority: pri})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-cyan-500 hover:bg-cyan-600"
                onClick={handleCreateTicket}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Ticket"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            <div className="text-xs text-slate-400">Resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Ticket Queue ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !tickets.length ? (
            <div className="text-center text-slate-400">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center text-slate-400">No tickets found</div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket, index) => {
                const slaMinutes = calculateSLAMinutes(ticket.sla_deadline);
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-cyan-400 text-sm">{ticket.ticket_id}</span>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                        <Badge variant="outline" className="text-slate-400">{ticket.category}</Badge>
                      </div>
                      {ticket.status !== "resolved" && ticket.status !== "closed" && (
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${slaMinutes < 30 ? "text-red-400" : "text-amber-400"}`} />
                          <span className={slaMinutes < 30 ? "text-red-300 font-semibold" : "text-amber-300"}>{slaMinutes} min</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-100">{ticket.subject}</h4>
                        <p className="text-sm text-slate-400">
                          {new Date(ticket.created_at).toLocaleDateString()} • 
                          {ticket.assigned_to ? " Assigned" : " Unassigned"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {ticket.status === "new" && (
                          <Select onValueChange={(agent) => handleAssign(ticket.ticket_id, agent)}>
                            <SelectTrigger className="w-36 bg-slate-700/50 border-slate-600">
                              <SelectValue placeholder="Assign..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SA-001">Agent 1</SelectItem>
                              <SelectItem value="SA-002">Agent 2</SelectItem>
                              <SelectItem value="SA-003">Agent 3</SelectItem>
                            </SelectContent>
                          </Select>
                        )}

                        {ticket.status !== "resolved" && ticket.status !== "closed" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleResolve(ticket.ticket_id)} 
                            className="bg-emerald-500 hover:bg-emerald-600"
                            disabled={loading}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>

                    {ticket.status !== "resolved" && ticket.status !== "closed" && (
                      <div className="mt-3">
                        <Progress value={Math.max(0, 100 - (slaMinutes / calculateSLAMinutes(ticket.sla_deadline || new Date(Date.now() + 48*60*60*1000).toISOString())) * 100)} className="h-1" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketsModule;
