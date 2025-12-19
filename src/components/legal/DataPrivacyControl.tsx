import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Eye, 
  EyeOff,
  Clock,
  Database,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Globe
} from "lucide-react";

const DataPrivacyControl = () => {
  const maskingRules = [
    { id: 1, field: "Email Address", type: "PII", status: "active", masking: "partial", example: "j***@email.com" },
    { id: 2, field: "Phone Number", type: "PII", status: "active", masking: "full", example: "***-***-****" },
    { id: 3, field: "Credit Card", type: "Financial", status: "active", masking: "last4", example: "**** **** **** 1234" },
    { id: 4, field: "Address", type: "PII", status: "active", masking: "partial", example: "*** Street, City" },
    { id: 5, field: "SSN/Aadhaar", type: "Identity", status: "active", masking: "full", example: "***-**-****" },
  ];

  const retentionPolicies = [
    { category: "User Data", retention: "3 years", autoDelete: true, compliance: ["GDPR", "DPDP"] },
    { category: "Transaction Logs", retention: "7 years", autoDelete: true, compliance: ["Tax", "Audit"] },
    { category: "Chat History", retention: "1 year", autoDelete: true, compliance: ["GDPR"] },
    { category: "Analytics Data", retention: "2 years", autoDelete: true, compliance: ["Internal"] },
  ];

  const complianceStatus = [
    { regulation: "GDPR", region: "EU", status: "compliant", score: 94 },
    { regulation: "CCPA", region: "US", status: "compliant", score: 96 },
    { regulation: "DPDP", region: "India", status: "compliant", score: 92 },
    { regulation: "PDPL", region: "UAE", status: "action-needed", score: 85 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Data Protection & Privacy Control</h2>
          <p className="text-stone-500">Masking rules engine, retention timers & compliant logging</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Settings className="w-4 h-4 mr-2" />
          Privacy Settings
        </Button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-4 gap-4">
        {complianceStatus.map((item, index) => (
          <motion.div
            key={item.regulation}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-stone-900/80 border-stone-800/50 ${
              item.status === "action-needed" ? "border-l-4 border-l-amber-500" : ""
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-stone-500" />
                    <span className="text-sm text-stone-400">{item.region}</span>
                  </div>
                  <Badge className={
                    item.status === "compliant" 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                      : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  }>
                    {item.status === "compliant" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                    {item.status}
                  </Badge>
                </div>
                <p className="text-lg font-bold text-white">{item.regulation}</p>
                <div className="mt-2">
                  <Progress value={item.score} className="h-1.5 bg-stone-700" />
                  <p className="text-xs text-stone-500 mt-1">{item.score}% compliant</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Masking Rules */}
        <Card className="bg-stone-900/80 border-stone-800/50">
          <CardHeader className="border-b border-stone-800/50">
            <CardTitle className="text-white flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-amber-500" />
              Data Masking Rules Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-stone-800/30">
              {maskingRules.map((rule) => (
                <div key={rule.id} className="p-4 flex items-center justify-between hover:bg-stone-800/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-stone-800/50 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{rule.field}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs">
                          {rule.type}
                        </Badge>
                        <code className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {rule.example}
                        </code>
                      </div>
                    </div>
                  </div>
                  <Switch checked={rule.status === "active"} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Retention Policies */}
        <Card className="bg-stone-900/80 border-stone-800/50">
          <CardHeader className="border-b border-stone-800/50">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Data Retention Timers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-stone-800/30">
              {retentionPolicies.map((policy, index) => (
                <motion.div
                  key={policy.category}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 flex items-center justify-between hover:bg-stone-800/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-stone-800/50 flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{policy.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-amber-400">{policy.retention}</span>
                        <span className="text-stone-500">•</span>
                        <span className="text-xs text-stone-500">
                          {policy.autoDelete ? "Auto-delete enabled" : "Manual deletion"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {policy.compliance.map((c) => (
                      <Badge key={c} className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GDPR Compliant Logging */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            GDPR/CCPA Compliant Logging
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Data Access Logs", value: "12,456", status: "active" },
              { label: "Consent Records", value: "89,234", status: "active" },
              { label: "Deletion Requests", value: "156", status: "pending" },
              { label: "Export Requests", value: "23", status: "completed" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 text-center"
              >
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-sm text-stone-500 mt-1">{item.label}</p>
                <Badge className={
                  item.status === "active" ? "mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                  item.status === "pending" ? "mt-2 bg-amber-500/20 text-amber-400 border-amber-500/40" :
                  "mt-2 bg-blue-500/20 text-blue-400 border-blue-500/40"
                }>
                  {item.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPrivacyControl;
