import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gavel, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Shield,
  Clock
} from "lucide-react";

const ComplianceRulebook = () => {
  const regions = [
    { 
      id: "india", 
      name: "India (DPDP)", 
      compliance: 94, 
      rules: 45, 
      violations: 2,
      lastAudit: "Dec 15, 2024"
    },
    { 
      id: "eu", 
      name: "EU (GDPR)", 
      compliance: 91, 
      rules: 78, 
      violations: 3,
      lastAudit: "Dec 10, 2024"
    },
    { 
      id: "us", 
      name: "United States", 
      compliance: 96, 
      rules: 52, 
      violations: 1,
      lastAudit: "Dec 18, 2024"
    },
    { 
      id: "me", 
      name: "Middle East", 
      compliance: 88, 
      rules: 34, 
      violations: 4,
      lastAudit: "Dec 5, 2024"
    },
    { 
      id: "africa", 
      name: "Africa", 
      compliance: 85, 
      rules: 28, 
      violations: 5,
      lastAudit: "Nov 28, 2024"
    },
  ];

  const rules = [
    { id: 1, title: "Data Encryption at Rest", status: "compliant", priority: "critical" },
    { id: 2, title: "User Consent Collection", status: "compliant", priority: "critical" },
    { id: 3, title: "Data Retention Policy", status: "partial", priority: "high" },
    { id: 4, title: "Cross-border Transfer", status: "compliant", priority: "high" },
    { id: 5, title: "Breach Notification", status: "compliant", priority: "critical" },
    { id: 6, title: "Right to Erasure", status: "review", priority: "medium" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Compliance Rulebook</h2>
          <p className="text-stone-500">Regional compliance tracking and rule management</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Regional Compliance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {regions.map((region, index) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/80 border-stone-800/50 hover:border-amber-600/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <h3 className="text-white font-medium text-sm">{region.name}</h3>
                </div>
                
                <div className="text-center mb-3">
                  <p className={`text-3xl font-bold ${
                    region.compliance >= 90 ? "text-emerald-400" :
                    region.compliance >= 80 ? "text-amber-400" :
                    "text-red-400"
                  }`}>{region.compliance}%</p>
                  <p className="text-xs text-stone-500">Compliance</p>
                </div>

                <Progress 
                  value={region.compliance} 
                  className="h-1.5 bg-stone-700 mb-3"
                />

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-stone-800/50">
                    <p className="text-stone-300 font-medium">{region.rules}</p>
                    <p className="text-stone-500">Rules</p>
                  </div>
                  <div className="p-2 rounded bg-stone-800/50">
                    <p className={region.violations > 3 ? "text-red-400" : "text-amber-400"}>{region.violations}</p>
                    <p className="text-stone-500">Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Rules Table */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Gavel className="w-5 h-5 text-amber-500" />
            Compliance Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800/50">
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Rule</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Priority</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Status</th>
                <th className="text-right p-4 text-stone-500 font-medium text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, index) => (
                <motion.tr
                  key={rule.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-stone-800/30 hover:bg-stone-800/30 transition-colors"
                >
                  <td className="p-4 text-stone-200">{rule.title}</td>
                  <td className="p-4">
                    <Badge className={
                      rule.priority === "critical" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                      rule.priority === "high" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                      "bg-blue-500/20 text-blue-400 border-blue-500/40"
                    }>
                      {rule.priority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={
                      rule.status === "compliant" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                      rule.status === "partial" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                      "bg-blue-500/20 text-blue-400 border-blue-500/40"
                    }>
                      {rule.status === "compliant" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {rule.status === "partial" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {rule.status === "review" && <Clock className="w-3 h-3 mr-1" />}
                      {rule.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="ghost" className="text-stone-400 hover:text-amber-400">
                      Review
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceRulebook;
