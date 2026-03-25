import { motion } from "framer-motion";
import { Activity, Server, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const UptimeMonitor = () => {
  const services = [
    { name: "API Gateway", status: "operational", uptime: 99.99, responseTime: 45, lastIncident: "30 days ago" },
    { name: "Database Cluster", status: "operational", uptime: 99.98, responseTime: 12, lastIncident: "15 days ago" },
    { name: "CDN Network", status: "operational", uptime: 100, responseTime: 8, lastIncident: "Never" },
    { name: "Authentication", status: "degraded", uptime: 99.95, responseTime: 89, lastIncident: "2 hours ago" },
    { name: "Storage System", status: "operational", uptime: 99.97, responseTime: 23, lastIncident: "7 days ago" },
  ];

  const slaMetrics = [
    { metric: "Overall Uptime", value: 99.98, target: 99.95, unit: "%" },
    { metric: "Response Time", value: 35, target: 100, unit: "ms" },
    { metric: "Error Rate", value: 0.02, target: 0.1, unit: "%" },
    { metric: "Throughput", value: 10500, target: 10000, unit: "req/s" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return { bg: "bg-emerald-500", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" };
      case "degraded": return { bg: "bg-amber-500", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-300" };
      case "outage": return { bg: "bg-red-500", text: "text-red-400", badge: "bg-red-500/20 text-red-300" };
      default: return { bg: "bg-stone-500", text: "text-stone-400", badge: "bg-stone-500/20 text-stone-300" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Uptime Guarantee Monitor</h2>
          <p className="text-stone-400">Real-time system performance and SLA tracking</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          All Systems Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {slaMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/50 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-stone-400">{metric.metric}</span>
                  {metric.value >= metric.target ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="text-2xl font-bold text-amber-100">
                  {metric.value}{metric.unit}
                </div>
                <div className="text-xs text-stone-500">
                  Target: {metric.target}{metric.unit}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-400" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => {
              const statusColors = getStatusColor(service.status);
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-stone-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${statusColors.bg}`} />
                    <div>
                      <h4 className="font-medium text-amber-100">{service.name}</h4>
                      <p className="text-xs text-stone-400">Last incident: {service.lastIncident}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-amber-100">{service.uptime}%</div>
                      <div className="text-xs text-stone-400">Uptime</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-emerald-300">{service.responseTime}ms</div>
                      <div className="text-xs text-stone-400">Response</div>
                    </div>
                    <Badge className={statusColors.badge}>
                      {service.status.toUpperCase()}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              SLA Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-400">Uptime SLA (99.95%)</span>
                  <span className="text-emerald-400">99.98% ✓</span>
                </div>
                <Progress value={99.98} className="h-2 bg-stone-800" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-400">Response Time SLA (&lt;100ms)</span>
                  <span className="text-emerald-400">35ms ✓</span>
                </div>
                <Progress value={65} className="h-2 bg-stone-800" />
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-emerald-300 text-sm">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  All SLA targets met this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                98.5
              </div>
              <p className="text-stone-400 mt-2">Overall Performance Score</p>
              <div className="flex justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">A+</div>
                  <div className="text-xs text-stone-500">Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">A</div>
                  <div className="text-xs text-stone-500">Reliability</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-400">A</div>
                  <div className="text-xs text-stone-500">Security</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UptimeMonitor;
