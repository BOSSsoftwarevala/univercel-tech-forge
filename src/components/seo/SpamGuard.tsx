import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, AlertTriangle, CheckCircle, RefreshCw,
  Link2, FileText, Hash, Zap, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SpamGuard = () => {
  const [isScanning, setIsScanning] = useState(false);

  const shieldStatus = {
    overall: "healthy",
    score: 94,
    lastScan: "2 hours ago"
  };

  const checks = [
    { 
      name: "Duplicate Content", 
      status: "pass", 
      score: 98, 
      description: "No duplicate content detected",
      icon: FileText
    },
    { 
      name: "Toxic Backlinks", 
      status: "warning", 
      score: 85, 
      description: "3 potentially toxic links found",
      icon: Link2
    },
    { 
      name: "Anchor Text Ratio", 
      status: "pass", 
      score: 92, 
      description: "Healthy anchor distribution",
      icon: Hash
    },
    { 
      name: "Keyword Stuffing", 
      status: "pass", 
      score: 96, 
      description: "No keyword stuffing detected",
      icon: AlertTriangle
    },
  ];

  const toxicLinks = [
    { domain: "spamsite.xyz", da: 8, reason: "Known spam domain", risk: "high" },
    { domain: "linkfarm.net", da: 12, reason: "Excessive outbound links", risk: "high" },
    { domain: "cheaplinks.biz", da: 5, reason: "Link scheme patterns", risk: "medium" },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Spam & Penalty Guard</h2>
          <p className="text-slate-400">AI-powered protection — no manual expertise needed</p>
        </div>
        <Button 
          onClick={handleScan}
          disabled={isScanning}
          className="bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          {isScanning ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Shield className="w-4 h-4 mr-2" />
          )}
          {isScanning ? "Scanning..." : "Run Full Scan"}
        </Button>
      </div>

      {/* Shield Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl border ${
          shieldStatus.overall === "healthy" 
            ? "bg-green-500/10 border-green-500/30" 
            : "bg-yellow-500/10 border-yellow-500/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${
              shieldStatus.overall === "healthy" ? "bg-green-500/20" : "bg-yellow-500/20"
            }`}>
              <Shield className={`w-8 h-8 ${
                shieldStatus.overall === "healthy" ? "text-green-400" : "text-yellow-400"
              }`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Shield Status</h3>
              <p className="text-slate-400">Last scan: {shieldStatus.lastScan}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-green-400">{shieldStatus.score}%</p>
            <p className="text-sm text-slate-400">Health Score</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Check Results */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Security Checks</h3>
          <div className="space-y-4">
            {checks.map((check, index) => (
              <motion.div
                key={check.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <check.icon className={`w-5 h-5 ${
                      check.status === "pass" ? "text-green-400" : "text-yellow-400"
                    }`} />
                    <span className="font-medium text-white">{check.name}</span>
                  </div>
                  <Badge className={`${
                    check.status === "pass" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {check.status === "pass" ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Pass</>
                    ) : (
                      <><AlertTriangle className="w-3 h-3 mr-1" /> Warning</>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={check.score} className="flex-1 h-2" />
                  <span className="text-sm text-slate-400">{check.score}%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{check.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Toxic Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Toxic Backlinks Detected
          </h3>
          <div className="space-y-3">
            {toxicLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{link.domain}</span>
                  <Badge className={`${
                    link.risk === "high" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {link.risk} risk
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">DA: {link.da}</p>
                    <p className="text-xs text-red-300">{link.reason}</p>
                  </div>
                  <Button size="sm" variant="destructive" className="text-xs">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Disavow
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500">
            <Zap className="w-4 h-4 mr-2" />
            Spam Cleanup — Disavow All
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SpamGuard;
