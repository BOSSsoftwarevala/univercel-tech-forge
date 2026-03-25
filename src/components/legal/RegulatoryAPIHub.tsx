import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  Plug,
  Shield,
  FileText,
  Key,
  Activity,
  RefreshCw
} from "lucide-react";

const RegulatoryAPIHub = () => {
  const apis = [
    { 
      id: "kyc", 
      name: "KYC Verification API", 
      provider: "Gov/Aadhaar",
      status: "connected",
      lastSync: "2 min ago",
      requests: "12,456",
      description: "Identity verification and eKYC"
    },
    { 
      id: "tax", 
      name: "Tax Compliance API", 
      provider: "GST Network",
      status: "connected",
      lastSync: "5 min ago",
      requests: "8,234",
      description: "GST validation and invoice compliance"
    },
    { 
      id: "domain", 
      name: "Domain Verification API", 
      provider: "ICANN",
      status: "connected",
      lastSync: "1 hour ago",
      requests: "3,456",
      description: "Domain ownership and license validation"
    },
    { 
      id: "fraud", 
      name: "AI Fraud Detection API", 
      provider: "Internal",
      status: "connected",
      lastSync: "Real-time",
      requests: "45,678",
      description: "ML-based fraud pattern detection"
    },
    { 
      id: "mask", 
      name: "Data Masking Engine", 
      provider: "Internal",
      status: "connected",
      lastSync: "Real-time",
      requests: "156,234",
      description: "PII masking and anonymization"
    },
    { 
      id: "ip", 
      name: "IP Seal & Token API", 
      provider: "Internal",
      status: "maintenance",
      lastSync: "30 min ago",
      requests: "2,345",
      description: "License key encryption and validation"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Regulatory API Integration</h2>
          <p className="text-stone-500">Gov/KYC verification, tax compliance, and domain validation</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync All APIs
        </Button>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Connected APIs", value: "5/6", icon: Plug, color: "text-emerald-400" },
          { label: "Total Requests (24h)", value: "228K", icon: Activity, color: "text-blue-400" },
          { label: "Verifications", value: "12,456", icon: CheckCircle2, color: "text-amber-400" },
          { label: "Failed Checks", value: "23", icon: AlertTriangle, color: "text-red-400" },
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

      {/* API Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apis.map((api, index) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/80 border-stone-800/50 hover:border-amber-600/30 transition-colors h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      api.status === "connected" ? "bg-emerald-500/20" : "bg-amber-500/20"
                    }`}>
                      {api.id === "kyc" ? <Shield className="w-5 h-5 text-emerald-400" /> :
                       api.id === "tax" ? <FileText className="w-5 h-5 text-blue-400" /> :
                       api.id === "domain" ? <Globe className="w-5 h-5 text-purple-400" /> :
                       api.id === "fraud" ? <Activity className="w-5 h-5 text-red-400" /> :
                       api.id === "mask" ? <Shield className="w-5 h-5 text-amber-400" /> :
                       <Key className="w-5 h-5 text-cyan-400" />}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{api.name}</h3>
                      <p className="text-xs text-stone-500">{api.provider}</p>
                    </div>
                  </div>
                  <Badge className={
                    api.status === "connected" 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                      : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  }>
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      api.status === "connected" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`} />
                    {api.status}
                  </Badge>
                </div>

                <p className="text-sm text-stone-400 mb-4">{api.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-stone-500">Last Sync</p>
                    <p className="text-stone-300">{api.lastSync}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-stone-500">Requests (24h)</p>
                    <p className="text-amber-400 font-medium">{api.requests}</p>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-4 border-stone-700 text-stone-300 hover:bg-stone-800"
                >
                  Configure
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RegulatoryAPIHub;
