import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Plus, 
  User, 
  Calendar, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  Eye,
  FileWarning
} from "lucide-react";

const DeveloperNDA = () => {
  const ndas = [
    { id: "NDA-001", developer: "Dev-A7X", team: "Core Platform", status: "active", signedDate: "Jan 15, 2024", expiry: "Jan 15, 2026", accessLevel: "Full", violations: 0 },
    { id: "NDA-002", developer: "Dev-K2M", team: "Mobile App", status: "active", signedDate: "Mar 1, 2024", expiry: "Mar 1, 2026", accessLevel: "Limited", violations: 0 },
    { id: "NDA-003", developer: "Dev-P9R", team: "API Integration", status: "expiring", signedDate: "Dec 20, 2023", expiry: "Dec 20, 2024", accessLevel: "Full", violations: 1 },
    { id: "NDA-004", developer: "Dev-Q4T", team: "Frontend", status: "breach", signedDate: "Jun 1, 2024", expiry: "Suspended", accessLevel: "Revoked", violations: 3 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case "expiring":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40"><Clock className="w-3 h-3 mr-1" />Expiring Soon</Badge>;
      case "breach":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40"><AlertTriangle className="w-3 h-3 mr-1" />Breach Detected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Developer NDA & IP Protection</h2>
          <p className="text-stone-500">Manage non-disclosure agreements and access controls</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
            <Eye className="w-4 h-4 mr-2" />
            Access Audit
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Assign New NDA
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-4"
      >
        <FileWarning className="w-6 h-6 text-red-400" />
        <div className="flex-1">
          <p className="text-red-300 font-medium">NDA Breach Detected</p>
          <p className="text-sm text-stone-400">Developer Dev-Q4T has violated confidentiality terms. Access has been suspended.</p>
        </div>
        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
          Review Case
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active NDAs", value: "156", icon: Shield, color: "text-emerald-400" },
          { label: "Expiring (30d)", value: "12", icon: Clock, color: "text-amber-400" },
          { label: "Breach Cases", value: "2", icon: AlertTriangle, color: "text-red-400" },
          { label: "Full Access", value: "45", icon: Lock, color: "text-blue-400" },
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

      {/* NDA List */}
      <div className="space-y-4">
        {ndas.map((nda, index) => (
          <motion.div
            key={nda.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-stone-900/80 border-stone-800/50 ${
              nda.status === "breach" ? "border-red-500/30" : "hover:border-amber-600/30"
            } transition-colors`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      nda.status === "breach" ? "bg-red-500/20" : "bg-stone-800/50"
                    }`}>
                      <User className={`w-6 h-6 ${nda.status === "breach" ? "text-red-400" : "text-stone-400"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{nda.developer}</h3>
                        <span className="text-xs text-stone-500 font-mono">{nda.id}</span>
                      </div>
                      <p className="text-sm text-stone-500">{nda.team}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-stone-500">Access Level</p>
                      <Badge className={
                        nda.accessLevel === "Full" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                        nda.accessLevel === "Limited" ? "bg-blue-500/20 text-blue-400 border-blue-500/40" :
                        "bg-red-500/20 text-red-400 border-red-500/40"
                      }>
                        {nda.accessLevel}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-stone-500">Violations</p>
                      <p className={`font-bold ${nda.violations > 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {nda.violations}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-stone-500">Expiry</p>
                      <p className="text-sm text-stone-300">{nda.expiry}</p>
                    </div>

                    {getStatusBadge(nda.status)}

                    <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                      Manage
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

export default DeveloperNDA;
