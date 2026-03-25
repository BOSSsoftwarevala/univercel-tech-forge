import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Shield, 
  Gavel,
  Calendar,
  Users,
  Building2,
  Lock
} from "lucide-react";

const LegalDashboard = () => {
  const expiringAgreements = [
    { name: "Franchise Agreement - Mumbai", days: 3, type: "franchise" },
    { name: "Reseller Contract - Delhi", days: 7, type: "reseller" },
    { name: "Developer NDA - Team Alpha", days: 14, type: "nda" },
    { name: "Client Contract - Enterprise Corp", days: 21, type: "client" },
  ];

  const highRiskCases = [
    { id: "CASE-001", title: "IP Violation - Source Code Leak", severity: "critical", status: "investigating" },
    { id: "CASE-002", title: "Payment Dispute - Franchise Partner", severity: "high", status: "escalated" },
    { id: "CASE-003", title: "NDA Breach Suspicion", severity: "medium", status: "review" },
  ];

  const complianceScores = [
    { region: "India", score: 94, status: "excellent" },
    { region: "EU (GDPR)", score: 91, status: "good" },
    { region: "Middle East", score: 88, status: "good" },
    { region: "US", score: 96, status: "excellent" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Contracts", value: "1,247", change: "+12%", icon: FileCheck, color: "text-cyan-400" },
          { label: "Active Disputes", value: "8", change: "-3", icon: Gavel, color: "text-emerald-400" },
          { label: "Compliance Score", value: "92%", change: "+2%", icon: Shield, color: "text-blue-400" },
          { label: "Pending Reviews", value: "34", change: "5 urgent", icon: Clock, color: "text-purple-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/80 border-slate-800/50 hover:border-cyan-600/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-xs text-emerald-400 mt-1">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agreement Expiry Timeline */}
        <Card className="bg-slate-900/80 border-slate-800/50">
          <CardHeader className="border-b border-slate-800/50">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-500" />
              Agreement Expiry Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {expiringAgreements.map((agreement, index) => (
              <motion.div
                key={agreement.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    agreement.type === "franchise" ? "bg-purple-500/20" :
                    agreement.type === "reseller" ? "bg-blue-500/20" :
                    agreement.type === "nda" ? "bg-red-500/20" :
                    "bg-emerald-500/20"
                  }`}>
                    {agreement.type === "franchise" ? <Building2 className="w-5 h-5 text-purple-400" /> :
                     agreement.type === "reseller" ? <Users className="w-5 h-5 text-blue-400" /> :
                     agreement.type === "nda" ? <Lock className="w-5 h-5 text-red-400" /> :
                     <FileCheck className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium text-sm">{agreement.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{agreement.type}</p>
                  </div>
                </div>
                <Badge className={
                  agreement.days <= 7 
                    ? "bg-red-500/20 text-red-400 border-red-500/40" 
                    : "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                }>
                  {agreement.days} days
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* High-Risk Case List */}
        <Card className="bg-slate-900/80 border-slate-800/50">
          <CardHeader className="border-b border-slate-800/50">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              High-Risk Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {highRiskCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">{caseItem.id}</span>
                      <Badge className={
                        caseItem.severity === "critical" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                        caseItem.severity === "high" ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40" :
                        "bg-blue-500/20 text-blue-400 border-blue-500/40"
                      }>
                        {caseItem.severity}
                      </Badge>
                    </div>
                    <p className="text-slate-200 font-medium mt-2">{caseItem.title}</p>
                  </div>
                  <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/40 capitalize">
                    {caseItem.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Score Heatmap */}
      <Card className="bg-slate-900/80 border-slate-800/50">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Regional Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {complianceScores.map((region, index) => (
              <motion.div
                key={region.region}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-300 font-medium">{region.region}</p>
                  <Badge className={
                    region.status === "excellent" 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                      : "bg-blue-500/20 text-blue-400 border-blue-500/40"
                  }>
                    {region.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">{region.score}%</span>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <Progress value={region.score} className="h-2 bg-slate-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalDashboard;