import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  FileCheck,
  Ban
} from "lucide-react";
import type { MarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";

interface MMComplianceStatusProps {
  system: MarketingManagerSystem;
}

const MMComplianceStatus = ({ system }: MMComplianceStatusProps) => {
  const complianceChecks = system.dashboard?.compliance.checks || [];
  const restrictedWords = system.dashboard?.compliance.restrictedWords || [];
  const passedCount = complianceChecks.filter(c => c.status === "passed").length;
  const totalChecks = complianceChecks.length || 1;
  const complianceScore = system.dashboard?.compliance.score || Math.round((passedCount / totalChecks) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "warning": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "failed": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "";
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <Shield className="h-5 w-5 text-emerald-400" />
          Compliance Status
          <Badge 
            variant="outline" 
            className={`ml-auto ${complianceScore >= 90 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
          >
            {complianceScore}% Compliant
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compliance Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Overall Compliance</span>
            <span className="text-slate-200">{passedCount}/{totalChecks} checks passed</span>
          </div>
          <Progress value={complianceScore} className="h-2" />
        </div>

        {/* Compliance Checks */}
        <div className="space-y-2">
          {complianceChecks.map((check, index) => (
            <motion.div
              key={check.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="text-sm font-medium text-slate-100">{check.policy_name}</p>
                  <p className="text-xs text-slate-400">{check.details}</p>
                </div>
              </div>
              <Badge className={getStatusColor(check.status)}>
                {check.status}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Restricted Words Block */}
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Ban className="h-4 w-4 text-red-400" />
            <h4 className="text-sm font-medium text-red-400">Restricted Words (Auto-Blocked)</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {restrictedWords.map((word) => (
              <Badge 
                key={word} 
                variant="outline"
                className="bg-red-500/10 text-red-400 border-red-500/30 text-xs"
              >
                {word}
              </Badge>
            ))}
          </div>
        </div>

        {/* Policy Notice */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2">
          <FileCheck className="h-4 w-4 text-blue-400 mt-0.5" />
          <div>
            <p className="text-xs text-blue-400 font-medium">Policy Checks Active</p>
            <p className="text-xs text-blue-400/70">
              All campaigns are automatically scanned for policy violations.
              Trademark safety is enforced system-wide.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMComplianceStatus;
