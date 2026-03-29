import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Shield,
  FileText,
  MapPin,
  Clock
} from "lucide-react";

const GlobalComplianceCenter = () => {
  const regions = [
    { 
      id: "india", 
      name: "India (DPDP Act)", 
      flag: "🇮🇳",
      score: 94, 
      status: "compliant",
      certifications: ["ISO 27001", "DPDP"],
      lastAudit: "Dec 15, 2024",
      riskLevel: "low"
    },
    { 
      id: "eu", 
      name: "European Union (GDPR)", 
      flag: "🇪🇺",
      score: 91, 
      status: "compliant",
      certifications: ["GDPR", "ISO 27001"],
      lastAudit: "Dec 10, 2024",
      riskLevel: "low"
    },
    { 
      id: "us", 
      name: "United States (CCPA)", 
      flag: "🇺🇸",
      score: 96, 
      status: "compliant",
      certifications: ["SOC 2", "CCPA"],
      lastAudit: "Dec 18, 2024",
      riskLevel: "low"
    },
    { 
      id: "me", 
      name: "Middle East (PDPL)", 
      flag: "🇦🇪",
      score: 85, 
      status: "action-needed",
      certifications: ["PDPL"],
      lastAudit: "Dec 5, 2024",
      riskLevel: "medium"
    },
    { 
      id: "africa", 
      name: "Africa (POPIA)", 
      flag: "🌍",
      score: 78, 
      status: "action-needed",
      certifications: ["POPIA"],
      lastAudit: "Nov 28, 2024",
      riskLevel: "high"
    },
    { 
      id: "apac", 
      name: "Asia Pacific (PDPA)", 
      flag: "🌏",
      score: 89, 
      status: "compliant",
      certifications: ["PDPA", "ISO 27001"],
      lastAudit: "Dec 12, 2024",
      riskLevel: "low"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40"><CheckCircle2 className="w-3 h-3 mr-1" />Compliant</Badge>;
      case "action-needed":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40"><AlertTriangle className="w-3 h-3 mr-1" />Action Needed</Badge>;
      default:
        return null;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-emerald-400";
      case "medium": return "text-amber-400";
      case "high": return "text-red-400";
      default: return "text-stone-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Global Compliance Center</h2>
          <p className="text-stone-500">Region-wise SaaS legal rules & auto-risk scoring</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate Global Report
        </Button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Global Score", value: "89%", icon: Globe, color: "text-emerald-400" },
          { label: "Regions Compliant", value: "4/6", icon: CheckCircle2, color: "text-blue-400" },
          { label: "Active Certs", value: "12", icon: Shield, color: "text-amber-400" },
          { label: "Risk Alerts", value: "3", icon: AlertTriangle, color: "text-red-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Region Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region, index) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-stone-900/80 border-stone-800/50 ${
              region.riskLevel === "high" ? "border-l-4 border-l-red-500" :
              region.riskLevel === "medium" ? "border-l-4 border-l-amber-500" : ""
            } hover:border-amber-600/30 transition-colors`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{region.flag}</span>
                    <div>
                      <h3 className="text-white font-medium">{region.name}</h3>
                      <p className="text-xs text-stone-500">Last Audit: {region.lastAudit}</p>
                    </div>
                  </div>
                  {getStatusBadge(region.status)}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-stone-400">Compliance Score</span>
                    <span className={`text-lg font-bold ${
                      region.score >= 90 ? "text-emerald-400" :
                      region.score >= 80 ? "text-amber-400" :
                      "text-red-400"
                    }`}>{region.score}%</span>
                  </div>
                  <Progress value={region.score} className="h-2 bg-stone-700" />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-500" />
                    <span className={`text-sm font-medium ${getRiskColor(region.riskLevel)}`}>
                      {region.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span className="text-xs text-stone-500">Auto-scoring active</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {region.certifications.map((cert) => (
                    <Badge key={cert} className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-4 border-stone-700 text-stone-300 hover:bg-stone-800"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GlobalComplianceCenter;
