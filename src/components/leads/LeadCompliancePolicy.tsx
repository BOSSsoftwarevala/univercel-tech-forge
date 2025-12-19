import { motion } from "framer-motion";
import { 
  Shield, AlertTriangle, FileText, CheckCircle,
  X, MessageSquare, DollarSign, Eye, Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LeadCompliancePolicy = () => {
  const complianceViolations = [
    {
      id: "1",
      handler: "vala(reseller)5678",
      violation: "Unauthorized discount offered",
      lead: "Sarah Chen",
      severity: "high",
      timestamp: "2 hours ago",
      status: "pending",
    },
    {
      id: "2",
      handler: "vala(sales)4771",
      violation: "Script deviation detected",
      lead: "Ahmed Hassan",
      severity: "medium",
      timestamp: "5 hours ago",
      status: "reviewed",
    },
    {
      id: "3",
      handler: "vala(reseller)9012",
      violation: "Contact data export attempt",
      lead: "Multiple leads",
      severity: "critical",
      timestamp: "1 day ago",
      status: "blocked",
    },
  ];

  const mandatoryScripts = [
    { name: "Initial Contact Script", category: "Reseller", usage: 89, required: true },
    { name: "Demo Introduction", category: "All Roles", usage: 94, required: true },
    { name: "Pricing Discussion", category: "Sales", usage: 78, required: true },
    { name: "Closing Script", category: "Sales", usage: 82, required: true },
  ];

  const integrityPolicies = [
    { 
      policy: "Full Contact Masking", 
      status: "active",
      description: "All contact details masked until conversion",
      icon: Eye,
    },
    { 
      policy: "No Export Policy", 
      status: "active",
      description: "Data export completely disabled",
      icon: Lock,
    },
    { 
      policy: "No Copy/Screenshot Alert", 
      status: "active",
      description: "Alerts triggered on copy attempts",
      icon: AlertTriangle,
    },
    { 
      policy: "Internal Only Access", 
      status: "active",
      description: "Lead data restricted to platform",
      icon: Shield,
    },
  ];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "blocked": return "bg-red-500/20 text-red-400";
      case "pending": return "bg-orange-500/20 text-orange-400";
      case "reviewed": return "bg-green-500/20 text-green-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-400" />
            Compliance & Policy Enforcement
          </h2>
          <p className="text-slate-400">Ensure brand integrity and policy adherence</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <FileText className="w-4 h-4 mr-2" />
          View All Policies
        </Button>
      </div>

      {/* Compliance Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
        >
          <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-green-400">94%</p>
          <p className="text-xs text-slate-400">Compliance Rate</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
          <p className="text-2xl font-bold text-red-400">3</p>
          <p className="text-xs text-slate-400">Active Violations</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl"
        >
          <MessageSquare className="w-5 h-5 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">86%</p>
          <p className="text-xs text-slate-400">Script Adherence</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl"
        >
          <DollarSign className="w-5 h-5 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-slate-400">Pricing Misuse</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Violations */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Recent Violations
          </h3>
          <div className="space-y-3">
            {complianceViolations.map((violation, index) => (
              <motion.div
                key={violation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${getSeverityStyle(violation.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-white">{violation.violation}</p>
                    <p className="text-xs text-slate-400">
                      {violation.handler} • {violation.lead}
                    </p>
                  </div>
                  <Badge className={getStatusStyle(violation.status)}>
                    {violation.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{violation.timestamp}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      Review
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-red-400">
                      Action
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mandatory Scripts */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Mandatory Script Compliance
          </h3>
          <div className="space-y-3">
            {mandatoryScripts.map((script, index) => (
              <motion.div
                key={script.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white">{script.name}</p>
                    <p className="text-xs text-slate-400">{script.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      script.usage >= 90 ? "text-green-400" :
                      script.usage >= 80 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {script.usage}%
                    </p>
                    <p className="text-xs text-slate-500">Usage</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${script.usage}%` }}
                    className={`h-full rounded-full ${
                      script.usage >= 90 ? "bg-green-500" :
                      script.usage >= 80 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Integrity Policies */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400" />
          Lead Integrity Protections
        </h4>
        <div className="grid grid-cols-4 gap-4">
          {integrityPolicies.map((policy, index) => (
            <motion.div
              key={policy.policy}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <policy.icon className="w-5 h-5 text-green-400" />
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <p className="font-medium text-white mb-1">{policy.policy}</p>
              <p className="text-xs text-slate-400">{policy.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Policy Warnings */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <h4 className="font-semibold text-orange-400">Policy Reminders for Handlers</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <p className="text-white font-medium">No Unauthorized Discounts</p>
            <p className="text-xs text-slate-400">All pricing changes require approval</p>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <p className="text-white font-medium">Mandatory Script Usage</p>
            <p className="text-xs text-slate-400">Follow approved scripts for all interactions</p>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <p className="text-white font-medium">No Data Export</p>
            <p className="text-xs text-slate-400">Lead data must stay within platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCompliancePolicy;
