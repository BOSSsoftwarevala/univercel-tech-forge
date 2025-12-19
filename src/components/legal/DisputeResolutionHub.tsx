import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gavel, 
  Plus, 
  MessageSquare,
  ArrowUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  FileText,
  Shield
} from "lucide-react";

const DisputeResolutionHub = () => {
  const disputes = [
    { 
      id: "DIS-001", 
      title: "Payment Dispute - Franchise Partner", 
      party: "Mumbai Metro Franchise",
      type: "Payment",
      severity: "high",
      status: "mediation",
      handler: "Legal Team A",
      progress: 65,
      filed: "Dec 15, 2024",
      sla: "2 days remaining"
    },
    { 
      id: "DIS-002", 
      title: "IP Infringement Claim", 
      party: "External Vendor",
      type: "IP",
      severity: "critical",
      status: "investigation",
      handler: "Legal Team B",
      progress: 30,
      filed: "Dec 18, 2024",
      sla: "5 days remaining"
    },
    { 
      id: "DIS-003", 
      title: "Service Level Agreement Breach", 
      party: "Enterprise Corp",
      type: "SLA",
      severity: "medium",
      status: "negotiation",
      handler: "Legal Team A",
      progress: 80,
      filed: "Dec 10, 2024",
      sla: "1 day remaining"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "mediation":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40"><MessageSquare className="w-3 h-3 mr-1" />Mediation</Badge>;
      case "investigation":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40"><Shield className="w-3 h-3 mr-1" />Investigation</Badge>;
      case "negotiation":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40"><MessageSquare className="w-3 h-3 mr-1" />Negotiation</Badge>;
      case "resolved":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40"><CheckCircle2 className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dispute Resolution Hub</h2>
          <p className="text-stone-500">Ticket-based dispute intake with auto mediation workflow</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Log New Dispute
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Disputes", value: "8", icon: Gavel, color: "text-amber-400" },
          { label: "In Mediation", value: "3", icon: MessageSquare, color: "text-blue-400" },
          { label: "Escalated", value: "2", icon: ArrowUp, color: "text-red-400" },
          { label: "Resolved (30d)", value: "15", icon: CheckCircle2, color: "text-emerald-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Workflow Visualization */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white">Auto Mediation Workflow</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {["Intake", "Investigation", "Mediation", "Negotiation", "Resolution", "Closure"].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  i <= 3 ? "bg-amber-500 text-stone-900" : "bg-stone-700 text-stone-400"
                }`}>
                  {i + 1}
                </div>
                <div className="ml-2 mr-4">
                  <p className={`text-sm font-medium ${i <= 3 ? "text-amber-300" : "text-stone-500"}`}>{step}</p>
                </div>
                {i < 5 && <div className={`w-16 h-0.5 ${i < 3 ? "bg-amber-500" : "bg-stone-700"}`} />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dispute Cards */}
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
              dispute.severity === "high" ? "border-l-4 border-l-amber-500" : ""
            }`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      dispute.severity === "critical" ? "bg-red-500/20" :
                      dispute.severity === "high" ? "bg-amber-500/20" :
                      "bg-blue-500/20"
                    }`}>
                      <Gavel className={`w-6 h-6 ${
                        dispute.severity === "critical" ? "text-red-400" :
                        dispute.severity === "high" ? "text-amber-400" :
                        "text-blue-400"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-mono">{dispute.id}</span>
                        <Badge className={
                          dispute.severity === "critical" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                          dispute.severity === "high" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                          "bg-blue-500/20 text-blue-400 border-blue-500/40"
                        }>
                          {dispute.severity}
                        </Badge>
                      </div>
                      <h3 className="text-white font-medium mt-2">{dispute.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {dispute.party}
                        </span>
                        <span>Filed: {dispute.filed}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-stone-500 mb-1">Progress</p>
                      <div className="w-32">
                        <Progress value={dispute.progress} className="h-2 bg-stone-700" />
                        <p className="text-xs text-amber-400 mt-1">{dispute.progress}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-500">SLA</p>
                      <p className="text-sm text-amber-400 font-medium">{dispute.sla}</p>
                    </div>
                    {getStatusBadge(dispute.status)}
                    <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                      <FileText className="w-4 h-4 mr-1" />
                      Evidence Locker
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

export default DisputeResolutionHub;
