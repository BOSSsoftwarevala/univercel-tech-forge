import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Shield,
  FileText,
  Globe,
  Map,
  AlertTriangle,
  Lock,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Plus,
  Settings
} from "lucide-react";

interface AAMSecurityAccessProps {
  activeSubSection: string;
}

const AAMSecurityAccess = ({ activeSubSection }: AAMSecurityAccessProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const securityStats = [
    { label: "Blocked IPs", value: "23", icon: <Ban className="w-5 h-5" />, color: "from-red-500 to-pink-500" },
    { label: "Restricted Regions", value: "5", icon: <Map className="w-5 h-5" />, color: "from-yellow-500 to-orange-500" },
    { label: "Abuse Detected", value: "3", icon: <AlertTriangle className="w-5 h-5" />, color: "from-purple-500 to-indigo-500" },
    { label: "Active Blocks", value: "12", icon: <Lock className="w-5 h-5" />, color: "from-slate-500 to-slate-600" },
  ];

  const recentAccessLogs = [
    { ip: "192.168.1.45", user: "admin@example.com", action: "API Key Access", status: "allowed", time: "2 min ago", location: "Mumbai, IN" },
    { ip: "45.33.22.11", user: "unknown", action: "Rate Limit Exceeded", status: "blocked", time: "5 min ago", location: "Unknown" },
    { ip: "172.16.0.100", user: "dev@example.com", action: "OpenAI Request", status: "allowed", time: "8 min ago", location: "Delhi, IN" },
    { ip: "203.0.113.50", user: "unknown", action: "Brute Force Attempt", status: "blocked", time: "15 min ago", location: "China" },
    { ip: "192.168.1.120", user: "sales@example.com", action: "WhatsApp API", status: "allowed", time: "20 min ago", location: "Bangalore, IN" },
  ];

  const ipRestrictions = [
    { ip: "45.33.22.11", reason: "Rate limit abuse", blockedAt: "2 hours ago", status: "permanent" },
    { ip: "203.0.113.50", reason: "Brute force attempt", blockedAt: "15 min ago", status: "temporary" },
    { ip: "198.51.100.0/24", reason: "Known malicious range", blockedAt: "5 days ago", status: "permanent" },
  ];

  const regionRestrictions = [
    { region: "China", status: "blocked", reason: "Policy compliance" },
    { region: "Russia", status: "blocked", reason: "Policy compliance" },
    { region: "North Korea", status: "blocked", reason: "Policy compliance" },
    { region: "Iran", status: "blocked", reason: "Sanctions" },
    { region: "Cuba", status: "blocked", reason: "Sanctions" },
  ];

  const abuseDetections = [
    { type: "Rate Limit Abuse", user: "user123@example.com", count: 15, severity: "high", action: "Auto-blocked" },
    { type: "Suspicious Pattern", user: "test@example.com", count: 8, severity: "medium", action: "Flagged" },
    { type: "Token Harvesting", user: "unknown", count: 45, severity: "critical", action: "Blocked + Reported" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security & Access</h1>
          <p className="text-slate-400 text-sm mt-1">API access control and security monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Security Settings")}
            className="border-white/20 text-slate-300 hover:bg-white/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction("Add Block Rule")}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Block
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} w-fit mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IP Restrictions */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              IP Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ipRestrictions.map((ip) => (
                <div
                  key={ip.ip}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                  <div>
                    <p className="text-sm font-mono font-medium text-white">{ip.ip}</p>
                    <p className="text-xs text-slate-400">{ip.reason}</p>
                    <p className="text-xs text-slate-500">Blocked: {ip.blockedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        ip.status === 'permanent'
                          ? 'text-red-400 border-red-400/30'
                          : 'text-yellow-400 border-yellow-400/30'
                      }
                    >
                      {ip.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleAction(`Unblock ${ip.ip}`)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={() => handleAction("View All IP Blocks")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardContent>
        </Card>

        {/* Region Restrictions */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-yellow-400" />
              Region Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionRestrictions.map((region) => (
                <div
                  key={region.region}
                  className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="flex items-center gap-3">
                    <Map className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{region.region}</p>
                      <p className="text-xs text-slate-400">{region.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={region.status === 'blocked'}
                      onCheckedChange={() => handleAction(`Toggle ${region.region}`)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={() => handleAction("Manage Regions")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Regions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Access Logs */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Recent API Access Logs
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
              onClick={() => handleAction("View All Logs")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentAccessLogs.map((log, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  log.status === 'blocked'
                    ? 'bg-red-500/10 border border-red-500/20'
                    : 'bg-slate-800/50 border border-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  {log.status === 'allowed' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-white">{log.ip}</p>
                      <Badge
                        variant="outline"
                        className={
                          log.status === 'allowed'
                            ? 'text-green-400 border-green-400/30'
                            : 'text-red-400 border-red-400/30'
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{log.user} • {log.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{log.time}</p>
                  <p className="text-xs text-slate-500">{log.location}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AAMSecurityAccess;
