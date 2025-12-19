import { motion } from "framer-motion";
import { Ticket, Clock, AlertTriangle, ArrowUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const PriorityTicketPanel = () => {
  const tickets = [
    { id: "VIP-001", title: "Custom API Integration", priority: "ultra", slaRemaining: 45, status: "in-progress", assignee: "Senior Dev Team" },
    { id: "VIP-002", title: "Performance Optimization", priority: "high", slaRemaining: 120, status: "pending", assignee: "Expert Queue" },
    { id: "VIP-003", title: "Security Audit Request", priority: "ultra", slaRemaining: 30, status: "escalated", assignee: "Security Team" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "ultra": return "bg-gradient-to-r from-amber-500 to-red-500 text-white";
      case "high": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default: return "bg-stone-700 text-stone-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress": return "text-emerald-400";
      case "escalated": return "text-red-400";
      default: return "text-amber-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">VIP Ticket Panel</h2>
          <p className="text-stone-400">Ultra-priority queue with SLA guarantees</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500">
          <Plus className="w-4 h-4 mr-2" />
          Create VIP Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Ticket className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">3</div>
            <div className="text-sm text-stone-400">Active Tickets</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">98%</div>
            <div className="text-sm text-stone-400">SLA Compliance</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">1</div>
            <div className="text-sm text-stone-400">Escalated</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/50 border-amber-500/20 hover:border-amber-500/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority === "ultra" && <ArrowUp className="w-3 h-3 mr-1" />}
                      {ticket.priority.toUpperCase()}
                    </Badge>
                    <span className="text-amber-400 font-mono text-sm">{ticket.id}</span>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-amber-100 mb-2">{ticket.title}</h3>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Assigned: {ticket.assignee}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300">{ticket.slaRemaining}m remaining</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Progress value={(ticket.slaRemaining / 180) * 100} className="h-2 bg-stone-800" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PriorityTicketPanel;
