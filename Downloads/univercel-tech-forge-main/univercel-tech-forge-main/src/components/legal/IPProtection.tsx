import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Code, 
  Globe,
  Shield,
  AlertTriangle,
  Eye,
  Key,
  Fingerprint,
  Camera
} from "lucide-react";

const IPProtection = () => {
  const protectedAssets = [
    { id: 1, name: "Core Platform Source", type: "source", protection: "Full", status: "secure", accessCount: 12, lastAccess: "2 hours ago" },
    { id: 2, name: "API Libraries", type: "library", protection: "Encrypted", status: "secure", accessCount: 45, lastAccess: "30 min ago" },
    { id: 3, name: "Mobile App Source", type: "source", protection: "Full", status: "alert", accessCount: 8, lastAccess: "1 hour ago" },
    { id: 4, name: "Database Schemas", type: "schema", protection: "Encrypted", status: "secure", accessCount: 5, lastAccess: "3 hours ago" },
  ];

  const domainLocks = [
    { domain: "app.softwarevala.com", status: "locked", verified: true },
    { domain: "api.softwarevala.com", status: "locked", verified: true },
    { domain: "demo.softwarevala.com", status: "locked", verified: true },
    { domain: "staging.softwarevala.com", status: "pending", verified: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">IP & Source Code Protection</h2>
          <p className="text-stone-500">Secure intellectual property and prevent unauthorized access</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Shield className="w-4 h-4 mr-2" />
          Security Scan
        </Button>
      </div>

      {/* Protection Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Protected Assets", value: "156", icon: Lock, color: "text-emerald-400" },
          { label: "Active Keys", value: "89", icon: Key, color: "text-amber-400" },
          { label: "Domain Locks", value: "12", icon: Globe, color: "text-blue-400" },
          { label: "Alerts", value: "2", icon: AlertTriangle, color: "text-red-400" },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protected Assets */}
        <Card className="bg-stone-900/80 border-stone-800/50">
          <CardHeader className="border-b border-stone-800/50">
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-amber-500" />
              Protected Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {protectedAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl bg-stone-800/30 border ${
                  asset.status === "alert" ? "border-red-500/30" : "border-stone-700/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      asset.status === "alert" ? "bg-red-500/20" : "bg-stone-800/50"
                    }`}>
                      <Lock className={`w-5 h-5 ${asset.status === "alert" ? "text-red-400" : "text-amber-400"}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{asset.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs">
                          {asset.type}
                        </Badge>
                        <span className="text-xs text-stone-500">{asset.accessCount} accesses</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      asset.status === "secure" 
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                        : "bg-red-500/20 text-red-400 border-red-500/40"
                    }>
                      {asset.status}
                    </Badge>
                    <p className="text-xs text-stone-500 mt-1">{asset.lastAccess}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Domain Locks */}
        <Card className="bg-stone-900/80 border-stone-800/50">
          <CardHeader className="border-b border-stone-800/50">
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500" />
              Domain Lock Enforcement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {domainLocks.map((domain, index) => (
              <motion.div
                key={domain.domain}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-stone-800/30 border border-stone-700/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    domain.verified ? "bg-emerald-500/20" : "bg-amber-500/20"
                  }`}>
                    {domain.verified ? (
                      <Lock className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Key className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-mono text-sm">{domain.domain}</p>
                    <p className="text-xs text-stone-500 capitalize">{domain.status}</p>
                  </div>
                </div>
                <Badge className={
                  domain.verified 
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                    : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                }>
                  {domain.verified ? "Verified" : "Pending"}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Active Security Measures
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: "Anti-Piracy Hash", icon: Fingerprint, status: "active" },
              { name: "Screenshot Detection", icon: Camera, status: "active" },
              { name: "Watermarking", icon: Eye, status: "active" },
              { name: "Access Masking", icon: Lock, status: "active" },
            ].map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 text-center"
              >
                <feature.icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-stone-300 font-medium text-sm">{feature.name}</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs">
                  {feature.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IPProtection;
