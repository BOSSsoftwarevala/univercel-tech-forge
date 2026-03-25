import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Edit, Ban, Eye, Clock, CheckCircle, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  shift: string;
  status: "online" | "busy" | "offline" | "break";
  activeTickets: number;
  resolvedToday: number;
  avgResponseTime: string;
}

const SupportTeamModule = () => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: "AGT-001", name: "Sarah Chen", email: "sarah@support.com", role: "Senior Agent", shift: "Morning", status: "online", activeTickets: 5, resolvedToday: 12, avgResponseTime: "4 min" },
    { id: "AGT-002", name: "Mike Johnson", email: "mike@support.com", role: "Agent", shift: "Afternoon", status: "busy", activeTickets: 8, resolvedToday: 8, avgResponseTime: "6 min" },
    { id: "AGT-003", name: "Lisa Park", email: "lisa@support.com", role: "Agent", shift: "Morning", status: "online", activeTickets: 3, resolvedToday: 15, avgResponseTime: "3 min" },
    { id: "AGT-004", name: "James Wilson", email: "james@support.com", role: "Junior Agent", shift: "Night", status: "offline", activeTickets: 0, resolvedToday: 6, avgResponseTime: "8 min" },
    { id: "AGT-005", name: "Emma Davis", email: "emma@support.com", role: "Team Lead", shift: "Morning", status: "break", activeTickets: 2, resolvedToday: 10, avgResponseTime: "5 min" },
  ]);

  const handleAddAgent = () => {
    toast.loading("Adding new agent...", { id: "add-agent" });
    setTimeout(() => {
      const newAgent: Agent = {
        id: `AGT-${String(agents.length + 1).padStart(3, '0')}`,
        name: "New Agent",
        email: "new@support.com",
        role: "Agent",
        shift: "Morning",
        status: "offline",
        activeTickets: 0,
        resolvedToday: 0,
        avgResponseTime: "-",
      };
      setAgents([...agents, newAgent]);
      toast.success("Agent added successfully", { id: "add-agent" });
    }, 800);
  };

  const handleAssignRole = (agentId: string, newRole: string) => {
    toast.loading("Updating role...", { id: `role-${agentId}` });
    setTimeout(() => {
      setAgents(agents.map(a => a.id === agentId ? { ...a, role: newRole } : a));
      toast.success(`Role updated to ${newRole}`, { id: `role-${agentId}` });
    }, 500);
  };

  const handleChangeShift = (agentId: string, newShift: string) => {
    toast.loading("Updating shift...", { id: `shift-${agentId}` });
    setTimeout(() => {
      setAgents(agents.map(a => a.id === agentId ? { ...a, shift: newShift } : a));
      toast.success(`Shift updated to ${newShift}`, { id: `shift-${agentId}` });
    }, 500);
  };

  const handleSuspend = (agentId: string) => {
    toast.loading("Suspending agent...", { id: `suspend-${agentId}` });
    setTimeout(() => {
      setAgents(agents.map(a => a.id === agentId ? { ...a, status: "offline" } : a));
      toast.success("Agent suspended", { id: `suspend-${agentId}` });
    }, 600);
  };

  const handleViewActivity = (agentId: string) => {
    toast.info(`Viewing activity for ${agentId}`, { description: "Activity log opened" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500/20 text-emerald-300";
      case "busy": return "bg-amber-500/20 text-amber-300";
      case "break": return "bg-blue-500/20 text-blue-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Support Team Management</h2>
          <p className="text-slate-400">Manage agents, roles, shifts and workload distribution</p>
        </div>
        <Button onClick={handleAddAgent} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">{agents.filter(a => a.status === "online").length}</div>
            <div className="text-xs text-slate-400">Online Agents</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{agents.reduce((sum, a) => sum + a.activeTickets, 0)}</div>
            <div className="text-xs text-slate-400">Active Tickets</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{agents.reduce((sum, a) => sum + a.resolvedToday, 0)}</div>
            <div className="text-xs text-slate-400">Resolved Today</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <UserCog className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">{agents.length}</div>
            <div className="text-xs text-slate-400">Total Agents</div>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Agent Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-cyan-500/20 text-cyan-300">{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 text-sm">{agent.id}</span>
                      <span className="font-medium text-slate-100">{agent.name}</span>
                      <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                    </div>
                    <div className="text-sm text-slate-400">{agent.email} • {agent.role} • {agent.shift} Shift</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <div className="text-sm text-slate-300">{agent.activeTickets} active • {agent.resolvedToday} resolved</div>
                    <div className="text-xs text-slate-500">Avg: {agent.avgResponseTime}</div>
                  </div>

                  <Select defaultValue={agent.role} onValueChange={(v) => handleAssignRole(agent.id, v)}>
                    <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior Agent">Junior Agent</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                      <SelectItem value="Senior Agent">Senior Agent</SelectItem>
                      <SelectItem value="Team Lead">Team Lead</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue={agent.shift} onValueChange={(v) => handleChangeShift(agent.id, v)}>
                    <SelectTrigger className="w-28 bg-slate-700/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button size="sm" variant="ghost" onClick={() => handleViewActivity(agent.id)} className="text-cyan-400">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleSuspend(agent.id)} className="text-red-400 hover:text-red-300">
                    <Ban className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTeamModule;
