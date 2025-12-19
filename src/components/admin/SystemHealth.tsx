import { motion } from "framer-motion";
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive,
  Wifi,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Globe
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  icon: any;
}

interface ServiceStatus {
  name: string;
  status: "online" | "degraded" | "offline";
  uptime: string;
  responseTime: string;
  region: string;
}

const systemMetrics: SystemMetric[] = [
  { name: "CPU Usage", value: 34, unit: "%", status: "healthy", icon: Cpu },
  { name: "Memory", value: 67, unit: "%", status: "healthy", icon: HardDrive },
  { name: "Database Load", value: 42, unit: "%", status: "healthy", icon: Database },
  { name: "Network I/O", value: 28, unit: "MB/s", status: "healthy", icon: Wifi },
  { name: "API Latency", value: 45, unit: "ms", status: "healthy", icon: Zap },
  { name: "Request Queue", value: 12, unit: "pending", status: "healthy", icon: Activity },
];

const services: ServiceStatus[] = [
  { name: "Main API Server", status: "online", uptime: "99.99%", responseTime: "42ms", region: "US-East" },
  { name: "Database Cluster", status: "online", uptime: "99.97%", responseTime: "12ms", region: "US-East" },
  { name: "Auth Service", status: "online", uptime: "100%", responseTime: "28ms", region: "Global" },
  { name: "File Storage", status: "online", uptime: "99.95%", responseTime: "85ms", region: "Multi-Region" },
  { name: "Email Service", status: "online", uptime: "99.90%", responseTime: "120ms", region: "EU-West" },
  { name: "Payment Gateway", status: "online", uptime: "99.99%", responseTime: "95ms", region: "Global" },
  { name: "CDN", status: "online", uptime: "100%", responseTime: "15ms", region: "Global" },
  { name: "Analytics Engine", status: "degraded", uptime: "98.50%", responseTime: "250ms", region: "US-West" },
];

const SystemHealth = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return "text-neon-green";
      case "warning":
      case "degraded":
        return "text-neon-orange";
      case "critical":
      case "offline":
        return "text-neon-red";
      default:
        return "text-foreground";
    }
  };

  const getProgressColor = (value: number) => {
    if (value < 50) return "bg-neon-green";
    if (value < 80) return "bg-neon-orange";
    return "bg-neon-red";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">System Health</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time infrastructure monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30">
            <CheckCircle className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-mono text-neon-green">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "System Uptime", value: "99.97%", subtext: "30 day average", color: "text-neon-green" },
          { label: "Active Connections", value: "1,247", subtext: "Real-time users", color: "text-primary" },
          { label: "Requests/min", value: "8.4K", subtext: "+12% from avg", color: "text-neon-cyan" },
          { label: "Error Rate", value: "0.02%", subtext: "Last 24 hours", color: "text-neon-green" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-4"
          >
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className={`text-2xl font-mono font-bold mt-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.subtext}</div>
          </motion.div>
        ))}
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${getStatusColor(metric.status)}`} />
                  <span className="font-mono text-sm text-foreground">{metric.name}</span>
                </div>
                <span className={`font-mono font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}{metric.unit}
                </span>
              </div>
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(metric.value, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${getProgressColor(metric.value)}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Services Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel"
      >
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-primary" />
            <h2 className="font-mono font-semibold text-foreground">Service Status</h2>
          </div>
        </div>
        
        <div className="divide-y divide-border/30">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  service.status === "online" ? "bg-neon-green animate-pulse" :
                  service.status === "degraded" ? "bg-neon-orange animate-pulse" :
                  "bg-neon-red"
                }`} />
                <div>
                  <div className="font-medium text-foreground">{service.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="w-3 h-3" />
                    {service.region}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Uptime</div>
                  <div className={`font-mono text-sm ${getStatusColor(service.status)}`}>{service.uptime}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Response</div>
                  <div className="font-mono text-sm text-primary">{service.responseTime}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-mono uppercase ${
                  service.status === "online" ? "bg-neon-green/20 text-neon-green" :
                  service.status === "degraded" ? "bg-neon-orange/20 text-neon-orange" :
                  "bg-neon-red/20 text-neon-red"
                }`}>
                  {service.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SystemHealth;
