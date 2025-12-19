import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  AlertTriangle, 
  User,
  Code,
  MousePointer,
  CreditCard,
  Eye,
  Shield,
  Brain,
  Activity
} from "lucide-react";

const AuditInvestigationLab = () => {
  const anomalies = [
    { 
      id: "ANM-001", 
      type: "Developer Leakage", 
      subject: "Dev-Q4T",
      description: "Unusual code download pattern detected - 15GB in 2 hours",
      severity: "critical",
      aiConfidence: 94,
      detected: "2 hours ago",
      status: "investigating"
    },
    { 
      id: "ANM-002", 
      type: "Influencer Fraud", 
      subject: "INF-2847",
      description: "Suspicious click pattern - 500 clicks from same IP range",
      severity: "high",
      aiConfidence: 87,
      detected: "4 hours ago",
      status: "confirmed"
    },
    { 
      id: "ANM-003", 
      type: "Client Fraud", 
      subject: "Enterprise Corp",
      description: "Multiple failed payment attempts with different cards",
      severity: "medium",
      aiConfidence: 72,
      detected: "1 day ago",
      status: "cleared"
    },
    { 
      id: "ANM-004", 
      type: "Access Anomaly", 
      subject: "Support Team",
      description: "Off-hours access to sensitive customer data",
      severity: "medium",
      aiConfidence: 65,
      detected: "6 hours ago",
      status: "investigating"
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Developer Leakage": return <Code className="w-5 h-5 text-red-400" />;
      case "Influencer Fraud": return <MousePointer className="w-5 h-5 text-amber-400" />;
      case "Client Fraud": return <CreditCard className="w-5 h-5 text-purple-400" />;
      case "Access Anomaly": return <Eye className="w-5 h-5 text-blue-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-stone-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "investigating":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">Investigating</Badge>;
      case "confirmed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40">Confirmed</Badge>;
      case "cleared":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">Cleared</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit & Investigation Lab</h2>
          <p className="text-stone-500">AI behaviour anomaly detection & fraud investigation</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Search className="w-4 h-4 mr-2" />
          Run Deep Scan
        </Button>
      </div>

      {/* AI Detection Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Investigations", value: "12", icon: Search, color: "text-amber-400" },
          { label: "AI Detected (24h)", value: "8", icon: Brain, color: "text-purple-400" },
          { label: "Confirmed Fraud", value: "3", icon: AlertTriangle, color: "text-red-400" },
          { label: "False Positives", value: "2", icon: Shield, color: "text-emerald-400" },
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

      {/* AI Fraud Detection Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-purple-300 font-medium">AI Fraud Detection Active</p>
            <p className="text-sm text-stone-400">Monitoring 15,234 transactions and 2,847 user sessions in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Live</span>
          </div>
        </div>
      </motion.div>

      {/* Anomaly Cards */}
      <div className="space-y-4">
        {anomalies.map((anomaly, index) => (
          <motion.div
            key={anomaly.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-stone-900/80 border-stone-800/50 ${
              anomaly.severity === "critical" ? "border-l-4 border-l-red-500" :
              anomaly.severity === "high" ? "border-l-4 border-l-amber-500" : ""
            }`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      anomaly.severity === "critical" ? "bg-red-500/20" :
                      anomaly.severity === "high" ? "bg-amber-500/20" :
                      "bg-blue-500/20"
                    }`}>
                      {getTypeIcon(anomaly.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-mono">{anomaly.id}</span>
                        <Badge className={
                          anomaly.severity === "critical" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                          anomaly.severity === "high" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                          "bg-blue-500/20 text-blue-400 border-blue-500/40"
                        }>
                          {anomaly.severity}
                        </Badge>
                        <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50">
                          {anomaly.type}
                        </Badge>
                      </div>
                      <h3 className="text-white font-medium mt-2">{anomaly.description}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {anomaly.subject}
                        </span>
                        <span>Detected: {anomaly.detected}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-stone-500">AI Confidence</p>
                      <p className={`text-lg font-bold ${
                        anomaly.aiConfidence >= 80 ? "text-red-400" :
                        anomaly.aiConfidence >= 60 ? "text-amber-400" :
                        "text-blue-400"
                      }`}>{anomaly.aiConfidence}%</p>
                    </div>
                    {getStatusBadge(anomaly.status)}
                    <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                      Investigate
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

export default AuditInvestigationLab;
