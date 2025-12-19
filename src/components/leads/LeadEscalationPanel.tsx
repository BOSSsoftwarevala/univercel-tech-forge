import { motion } from "framer-motion";
import { 
  AlertTriangle, ArrowUp, Clock, Lock, User,
  Shield, Bell, CheckCircle, X, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LeadEscalationPanel = () => {
  const escalatedLeads = [
    {
      id: "1",
      leadName: "Mohammed Al-Rashid",
      software: "Hospital ERP",
      value: "$15,000",
      escalationLevel: 3,
      reason: "Ignored for 48+ hours",
      originalHandler: "vala(sales)1234",
      escalatedTo: "Super Admin",
      timeInEscalation: "4 hours",
      locked: true,
    },
    {
      id: "2",
      leadName: "Priya Sharma",
      software: "School Management",
      value: "$10,000",
      escalationLevel: 2,
      reason: "High-value lead unassigned",
      originalHandler: null,
      escalatedTo: "Senior Sales",
      timeInEscalation: "2 hours",
      locked: true,
    },
    {
      id: "3",
      leadName: "James Okonkwo",
      software: "Real Estate CRM",
      value: "$5,000",
      escalationLevel: 1,
      reason: "Repeated ignore (3x)",
      originalHandler: "vala(sales)4771",
      escalatedTo: "Team Lead",
      timeInEscalation: "45 min",
      locked: false,
    },
  ];

  const escalationStats = {
    active: 8,
    resolvedToday: 15,
    avgResolutionTime: "1.5h",
    repeatOffenders: 3,
  };

  const escalationRules = [
    { trigger: "Ignored > 30 min", level: 1, action: "Notify Team Lead" },
    { trigger: "Ignored > 1 hour", level: 2, action: "Assign to Senior + Lock" },
    { trigger: "Ignored > 2 hours", level: 3, action: "Super Admin Alert + Priority Lock" },
    { trigger: "High Value Unassigned", level: 2, action: "Auto-lock until claimed" },
    { trigger: "Repeated Ignore (3x)", level: 2, action: "Handler review triggered" },
  ];

  const getEscalationStyle = (level: number) => {
    switch (level) {
      case 3: return "border-red-500 bg-red-500/10";
      case 2: return "border-orange-500 bg-orange-500/10";
      case 1: return "border-yellow-500 bg-yellow-500/10";
      default: return "border-slate-700/50 bg-slate-900/50";
    }
  };

  const getEscalationBadge = (level: number) => {
    switch (level) {
      case 3: return "bg-red-500/20 text-red-400";
      case 2: return "bg-orange-500/20 text-orange-400";
      case 1: return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Escalation Control Center
          </h2>
          <p className="text-slate-400">Manage escalated leads and prevent missed opportunities</p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 px-4 py-2 text-lg">
          {escalationStats.active} Active Escalations
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
          <p className="text-2xl font-bold text-red-400">{escalationStats.active}</p>
          <p className="text-xs text-slate-400">Active Escalations</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
        >
          <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-green-400">{escalationStats.resolvedToday}</p>
          <p className="text-xs text-slate-400">Resolved Today</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl"
        >
          <Clock className="w-5 h-5 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">{escalationStats.avgResolutionTime}</p>
          <p className="text-xs text-slate-400">Avg Resolution</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl"
        >
          <User className="w-5 h-5 text-orange-400 mb-2" />
          <p className="text-2xl font-bold text-orange-400">{escalationStats.repeatOffenders}</p>
          <p className="text-xs text-slate-400">Repeat Offenders</p>
        </motion.div>
      </div>

      {/* Escalated Leads */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Currently Escalated</h3>
        
        {escalatedLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl border-2 p-4 ${getEscalationStyle(lead.escalationLevel)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Level Indicator */}
                <div className={`p-3 rounded-xl ${
                  lead.escalationLevel === 3 ? "bg-red-500/20" :
                  lead.escalationLevel === 2 ? "bg-orange-500/20" : "bg-yellow-500/20"
                }`}>
                  <ArrowUp className={`w-6 h-6 ${
                    lead.escalationLevel === 3 ? "text-red-400" :
                    lead.escalationLevel === 2 ? "text-orange-400" : "text-yellow-400"
                  }`} />
                </div>

                {/* Lead Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{lead.leadName}</h4>
                    <Badge className={getEscalationBadge(lead.escalationLevel)}>
                      Level {lead.escalationLevel}
                    </Badge>
                    {lead.locked && (
                      <Badge className="bg-red-500/20 text-red-400">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{lead.software} • {lead.value}</p>
                  
                  <div className="mt-2 p-2 bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-500">Reason:</p>
                    <p className="text-sm text-white">{lead.reason}</p>
                  </div>
                </div>
              </div>

              {/* Escalation Info */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-white">{lead.escalatedTo}</span>
                </div>
                {lead.originalHandler && (
                  <p className="text-xs text-slate-500">
                    From: {lead.originalHandler}
                  </p>
                )}
                <p className="text-sm text-slate-400 mt-2">
                  In escalation: {lead.timeInEscalation}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Claim & Resolve
                </Button>
                <Button size="sm" variant="outline" className="border-slate-600">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  Escalate Higher
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Escalation Rules */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          Escalation Rules
        </h4>
        <div className="overflow-hidden rounded-lg border border-slate-700/50">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-3 text-xs text-slate-400 font-medium">Trigger</th>
                <th className="text-center p-3 text-xs text-slate-400 font-medium">Level</th>
                <th className="text-left p-3 text-xs text-slate-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {escalationRules.map((rule, index) => (
                <tr key={index}>
                  <td className="p-3 text-sm text-white">{rule.trigger}</td>
                  <td className="p-3 text-center">
                    <Badge className={getEscalationBadge(rule.level)}>
                      Level {rule.level}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-slate-400">{rule.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadEscalationPanel;
