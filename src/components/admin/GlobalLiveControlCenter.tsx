import { motion } from "framer-motion";
import { 
  Globe, 
  Users, 
  Timer, 
  Activity, 
  Wallet, 
  Brain,
  Monitor,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const GlobalLiveControlCenter = () => {
  const liveStats = [
    { label: "Active Users", value: "2,847", icon: Users, change: "+12%", color: "text-primary" },
    { label: "Dev Timers Running", value: "34", icon: Timer, change: "8 paused", color: "text-neon-teal" },
    { label: "Active Leads", value: "156", icon: Activity, change: "+23 today", color: "text-neon-purple" },
    { label: "Demo Uptime", value: "99.8%", icon: Monitor, change: "2 alerts", color: "text-green-400" },
    { label: "Wallet Movement", value: "₹4.2L", icon: Wallet, change: "today", color: "text-yellow-400" },
    { label: "AI Status", value: "Active", icon: Brain, change: "12 tasks", color: "text-primary" },
  ];

  const regionActivity = [
    { region: "Maharashtra", users: 847, leads: 45, devs: 12, status: "high" },
    { region: "Karnataka", users: 623, leads: 32, devs: 8, status: "high" },
    { region: "Delhi NCR", users: 534, leads: 28, devs: 6, status: "medium" },
    { region: "Tamil Nadu", users: 412, leads: 22, devs: 5, status: "medium" },
    { region: "Gujarat", users: 289, leads: 18, devs: 4, status: "low" },
    { region: "Rajasthan", users: 142, leads: 11, devs: 2, status: "low" },
  ];

  const developerTimers = [
    { name: "Rahul S.", task: "E-commerce Module", time: "02:34:12", status: "active", progress: 68 },
    { name: "Priya M.", task: "CRM Integration", time: "01:45:33", status: "active", progress: 45 },
    { name: "Amit K.", task: "Payment Gateway", time: "00:23:45", status: "paused", progress: 12 },
    { name: "Sneha R.", task: "Mobile App API", time: "03:12:08", status: "active", progress: 82 },
  ];

  const demoAlerts = [
    { demo: "Restaurant POS", status: "online", uptime: "99.9%", users: 23 },
    { demo: "Hotel Management", status: "online", uptime: "99.7%", users: 18 },
    { demo: "Clinic Software", status: "degraded", uptime: "97.2%", users: 12 },
    { demo: "School ERP", status: "online", uptime: "99.8%", users: 31 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "online": return "bg-green-500/20 text-green-400";
      case "degraded": return "bg-yellow-500/20 text-yellow-400";
      case "active": return "bg-green-500/20 text-green-400";
      case "paused": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
            Global Live Control Center
          </h1>
          <p className="text-muted-foreground mt-1">Real-time ecosystem monitoring & control</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Live Feed Active</span>
        </div>
      </div>

      {/* Live Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {liveStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10 hover:border-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Activity Map */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Region Activity Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionActivity.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{region.region}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{region.users} users</span>
                    <span className="text-primary">{region.leads} leads</span>
                    <span className="text-neon-teal">{region.devs} devs</span>
                    <Badge className={getStatusColor(region.status)}>
                      {region.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Developer Timers */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-neon-teal" />
              Active Developer Timers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {developerTimers.map((dev, index) => (
                <motion.div
                  key={dev.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-background/50 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{dev.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">• {dev.task}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(dev.status)}>
                        {dev.status}
                      </Badge>
                      <span className="font-mono text-primary">{dev.time}</span>
                    </div>
                  </div>
                  <Progress value={dev.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">{dev.progress}% complete</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Uptime Monitor */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-green-400" />
              Demo Uptime Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoAlerts.map((demo, index) => (
                <motion.div
                  key={demo.demo}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    {demo.status === "online" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="font-medium">{demo.demo}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{demo.users} active</span>
                    <Badge className={getStatusColor(demo.status)}>
                      {demo.uptime}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wallet Movement */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-yellow-400" />
              Today's Wallet Movement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-muted-foreground">Inflow</span>
                </div>
                <div className="text-2xl font-bold text-green-400">₹2,84,500</div>
                <div className="text-xs text-muted-foreground mt-1">47 transactions</div>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                  <span className="text-sm text-muted-foreground">Outflow</span>
                </div>
                <div className="text-2xl font-bold text-red-400">₹1,35,200</div>
                <div className="text-xs text-muted-foreground mt-1">23 payouts</div>
              </div>
              <div className="col-span-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Net Movement</div>
                    <div className="text-2xl font-bold text-primary">+₹1,49,300</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Pending Approvals</div>
                    <div className="text-xl font-bold text-yellow-400">8</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalLiveControlCenter;
