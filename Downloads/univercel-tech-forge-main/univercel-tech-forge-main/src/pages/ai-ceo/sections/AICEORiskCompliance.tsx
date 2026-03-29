import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Shield, 
  Lock,
  FileWarning,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";

// Mock risk data
const riskCategories = [
  { 
    id: 1, 
    category: "Security Risk", 
    level: "medium",
    score: 45,
    issues: 3,
    trend: "stable",
    icon: Shield
  },
  { 
    id: 2, 
    category: "Legal Risk", 
    level: "low",
    score: 18,
    issues: 1,
    trend: "improving",
    icon: FileWarning
  },
  { 
    id: 3, 
    category: "Financial Exposure", 
    level: "high",
    score: 72,
    issues: 5,
    trend: "worsening",
    icon: DollarSign
  },
  { 
    id: 4, 
    category: "SLA Breach", 
    level: "low",
    score: 12,
    issues: 0,
    trend: "stable",
    icon: Clock
  },
  { 
    id: 5, 
    category: "Policy Violation", 
    level: "medium",
    score: 38,
    issues: 2,
    trend: "improving",
    icon: Lock
  },
];

const complianceItems = [
  { id: 1, policy: "Data Protection (GDPR)", status: "compliant", lastAudit: "2 days ago" },
  { id: 2, policy: "Financial Regulations", status: "warning", lastAudit: "1 week ago" },
  { id: 3, policy: "User Privacy Policy", status: "compliant", lastAudit: "3 days ago" },
  { id: 4, policy: "Access Control Policy", status: "compliant", lastAudit: "Today" },
  { id: 5, policy: "Incident Response Plan", status: "review", lastAudit: "2 weeks ago" },
];

const preventiveSuggestions = [
  "Implement additional MFA for high-value transactions",
  "Review franchise payment thresholds - potential over-limit patterns detected",
  "Schedule security audit for APAC region servers",
];

const getLevelStyle = (level: string) => {
  switch (level) {
    case 'high': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
    case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    case 'critical': return { bg: 'bg-red-600/30', text: 'text-red-300', border: 'border-red-500/50' };
    default: return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'compliant': return 'bg-emerald-500/20 text-emerald-400';
    case 'warning': return 'bg-yellow-500/20 text-yellow-400';
    case 'review': return 'bg-blue-500/20 text-blue-400';
    default: return 'bg-red-500/20 text-red-400';
  }
};

const AICEORiskCompliance = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center shadow-xl shadow-orange-500/20">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Risk & Compliance</h1>
            <p className="text-cyan-400/80">System-wide risk monitoring and compliance tracking</p>
          </div>
        </div>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
          <AlertTriangle className="w-3 h-3 mr-1" />
          11 Active Issues
        </Badge>
      </div>

      {/* Risk Categories Grid */}
      <div className="grid grid-cols-5 gap-4">
        {riskCategories.map((risk, i) => {
          const style = getLevelStyle(risk.level);
          return (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`bg-slate-900/50 ${style.border} backdrop-blur-xl`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <risk.icon className={`w-5 h-5 ${style.text}`} />
                    <Badge className={`${style.bg} ${style.text} text-xs`}>
                      {risk.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-white font-medium mb-2">{risk.category}</p>
                  <div className="space-y-2">
                    <Progress value={risk.score} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{risk.issues} issues</span>
                      <span className={style.text}>{risk.score}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Compliance Status */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {complianceItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{item.policy}</p>
                      <p className="text-xs text-slate-500">Last audit: {item.lastAudit}</p>
                    </div>
                    <Badge className={getStatusStyle(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Preventive Suggestions */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
              AI Preventive Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {preventiveSuggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white">{suggestion}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-orange-400" />
          <p className="text-sm text-orange-400/80">
            <strong>Risk Monitoring:</strong> AI continuously monitors all risk vectors. Critical issues are escalated to Boss immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEORiskCompliance;
