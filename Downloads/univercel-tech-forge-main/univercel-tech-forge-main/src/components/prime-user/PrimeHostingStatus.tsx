import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Server, Shield, Globe, Zap, Activity, HardDrive, 
  Cpu, MemoryStick, Cloud, Lock, RefreshCw, CheckCircle 
} from "lucide-react";

const PrimeHostingStatus = () => {
  const hostingData = {
    tier: "Premium",
    status: "healthy",
    uptime: 99.99,
    lastCheck: "2 minutes ago",
    customDomain: "app.yourcompany.com",
    sslEnabled: true,
    cdnEnabled: true,
    resources: {
      cpu: { used: 35, allocated: "High Priority" },
      memory: { used: 42, allocated: "8 GB" },
      storage: { used: 65, allocated: "Unlimited" },
      bandwidth: { used: 28, allocated: "Unlimited" }
    },
    recentEvents: [
      { time: "10:45 AM", event: "SSL Certificate Auto-Renewed", status: "success" },
      { time: "09:30 AM", event: "CDN Cache Purged", status: "success" },
      { time: "08:15 AM", event: "Automated Backup Completed", status: "success" },
      { time: "Yesterday", event: "Security Scan Passed", status: "success" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return { bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/30" };
      case "degraded": return { bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/30" };
      case "down": return { bg: "bg-red-500", text: "text-red-400", border: "border-red-500/30" };
      default: return { bg: "bg-stone-500", text: "text-stone-400", border: "border-stone-500/30" };
    }
  };

  const statusConfig = getStatusColor(hostingData.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Hosting & Uptime</h2>
          <p className="text-stone-400">Premium hosting with priority resource allocation</p>
        </div>
        <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
          <RefreshCw className="w-4 h-4 mr-2" />
          Force Health Check
        </Button>
      </div>

      {/* Main Status Card */}
      <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-16 h-16 rounded-2xl ${statusConfig.bg}/20 flex items-center justify-center`}
              >
                <Server className={`w-8 h-8 ${statusConfig.text}`} />
              </motion.div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-amber-100">System Status</h3>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`w-3 h-3 rounded-full ${statusConfig.bg}`}
                  />
                  <Badge className={`${statusConfig.bg}/20 ${statusConfig.text} border ${statusConfig.border}`}>
                    {hostingData.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-stone-400">Last checked: {hostingData.lastCheck}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-emerald-400">{hostingData.uptime}%</div>
              <p className="text-sm text-stone-500">Uptime (30 days)</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-stone-400">Domain</span>
              </div>
              <p className="text-amber-200 font-medium truncate">{hostingData.customDomain}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-stone-400">SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Active</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-stone-400">CDN</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300">Enabled</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-stone-400">Tier</span>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                {hostingData.tier}
              </Badge>
            </div>
          </div>

          {/* Resource Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-stone-400 uppercase tracking-wide">Resource Allocation</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-stone-300">CPU</span>
                    </div>
                    <span className="text-sm text-stone-500">{hostingData.resources.cpu.used}% ({hostingData.resources.cpu.allocated})</span>
                  </div>
                  <Progress value={hostingData.resources.cpu.used} className="h-2 bg-stone-800 [&>div]:bg-blue-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-stone-300">Memory</span>
                    </div>
                    <span className="text-sm text-stone-500">{hostingData.resources.memory.used}% ({hostingData.resources.memory.allocated})</span>
                  </div>
                  <Progress value={hostingData.resources.memory.used} className="h-2 bg-stone-800 [&>div]:bg-purple-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-stone-300">Storage</span>
                    </div>
                    <span className="text-sm text-stone-500">{hostingData.resources.storage.used}% ({hostingData.resources.storage.allocated})</span>
                  </div>
                  <Progress value={hostingData.resources.storage.used} className="h-2 bg-stone-800 [&>div]:bg-emerald-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-stone-300">Bandwidth</span>
                    </div>
                    <span className="text-sm text-stone-500">{hostingData.resources.bandwidth.used}% ({hostingData.resources.bandwidth.allocated})</span>
                  </div>
                  <Progress value={hostingData.resources.bandwidth.used} className="h-2 bg-stone-800 [&>div]:bg-amber-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-stone-400 uppercase tracking-wide">Recent Events</h4>
              <div className="space-y-2">
                {hostingData.recentEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-stone-800/30 border border-stone-700/30"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-300 truncate">{event.event}</p>
                      <p className="text-xs text-stone-500">{event.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Benefits */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <div>
              <h4 className="text-amber-200 font-medium">Prime Hosting Benefits Active</h4>
              <p className="text-sm text-stone-400">Priority servers • Auto-scaling • 24/7 monitoring • Instant failover</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrimeHostingStatus;
