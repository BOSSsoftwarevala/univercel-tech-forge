import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Plus, 
  User,
  Calendar,
  Clock,
  ArrowUp,
  MessageSquare,
  FileText
} from "lucide-react";

const DisputeTracker = () => {
  const disputes = [
    { 
      id: "DIS-001", 
      title: "Payment Dispute - Franchise Partner", 
      party: "Mumbai Metro Franchise",
      type: "Payment",
      severity: "high",
      status: "escalated",
      handler: "Legal Team A",
      filed: "Dec 15, 2024",
      deadline: "Dec 25, 2024"
    },
    { 
      id: "DIS-002", 
      title: "IP Violation Claim", 
      party: "External Party",
      type: "IP",
      severity: "critical",
      status: "investigating",
      handler: "Legal Team B",
      filed: "Dec 18, 2024",
      deadline: "Jan 5, 2025"
    },
    { 
      id: "DIS-003", 
      title: "Service Level Agreement Breach", 
      party: "Enterprise Corp",
      type: "SLA",
      severity: "medium",
      status: "negotiation",
      handler: "Legal Team A",
      filed: "Dec 10, 2024",
      deadline: "Dec 20, 2024"
    },
    { 
      id: "DIS-004", 
      title: "Refund Request - Prime User", 
      party: "TechStart Inc",
      type: "Refund",
      severity: "low",
      status: "resolved",
      handler: "Support Team",
      filed: "Dec 5, 2024",
      deadline: "Resolved"
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40">Critical</Badge>;
      case "high":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">High</Badge>;
      case "medium":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">Medium</Badge>;
      case "low":
        return <Badge className="bg-stone-500/20 text-stone-400 border-stone-500/40">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "escalated":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40"><ArrowUp className="w-3 h-3 mr-1" />Escalated</Badge>;
      case "investigating":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40"><Clock className="w-3 h-3 mr-1" />Investigating</Badge>;
      case "negotiation":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40"><MessageSquare className="w-3 h-3 mr-1" />Negotiation</Badge>;
      case "resolved":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Legal Case & Dispute Tracker</h2>
          <p className="text-stone-500">Track and manage all legal disputes and cases</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Log New Dispute
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Disputes", value: "8", color: "text-amber-400" },
          { label: "Critical Cases", value: "2", color: "text-red-400" },
          { label: "In Negotiation", value: "3", color: "text-blue-400" },
          { label: "Resolved (30d)", value: "15", color: "text-emerald-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-stone-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map((dispute, index) => (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-stone-900/80 border-stone-800/50 ${
              dispute.severity === "critical" ? "border-l-4 border-l-red-500" :
              dispute.severity === "high" ? "border-l-4 border-l-amber-500" :
              ""
            } hover:border-amber-600/30 transition-colors`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-800/50 flex items-center justify-center">
                      <AlertTriangle className={`w-6 h-6 ${
                        dispute.severity === "critical" ? "text-red-400" :
                        dispute.severity === "high" ? "text-amber-400" :
                        "text-blue-400"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-mono">{dispute.id}</span>
                        {getSeverityBadge(dispute.severity)}
                        <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs">
                          {dispute.type}
                        </Badge>
                      </div>
                      <h3 className="text-white font-medium mt-2">{dispute.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {dispute.party}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Filed: {dispute.filed}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-stone-500">Handler</p>
                      <p className="text-sm text-stone-300">{dispute.handler}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-500">Deadline</p>
                      <p className={`text-sm font-medium ${
                        dispute.status === "resolved" ? "text-emerald-400" : "text-amber-400"
                      }`}>{dispute.deadline}</p>
                    </div>
                    {getStatusBadge(dispute.status)}
                    <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                      <FileText className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DisputeTracker;
