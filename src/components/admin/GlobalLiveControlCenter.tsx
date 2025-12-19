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
  MapPin,
  Zap,
  Target,
  ListTodo,
  Bell,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const GlobalLiveControlCenter = () => {
  const liveStats = [
    { label: "Active Users", value: "2,847", icon: Users, change: "+12%", color: "text-primary", up: true },
    { label: "Dev Timers Running", value: "34", icon: Timer, change: "8 paused", color: "text-neon-teal", up: true },
    { label: "Active Leads", value: "156", icon: Activity, change: "+23 today", color: "text-neon-purple", up: true },
    { label: "Demo Uptime", value: "99.8%", icon: Monitor, change: "2 alerts", color: "text-green-400", up: true },
    { label: "Wallet Movement", value: "₹4.2L", icon: Wallet, change: "today", color: "text-yellow-400", up: true },
    { label: "AI Status", value: "Active", icon: Brain, change: "12 tasks", color: "text-primary", up: true },
  ];

  const regionActivity = [
    { region: "Maharashtra", users: 847, leads: 45, devs: 12, status: "high" },
    { region: "Karnataka", users: 623, leads: 32, devs: 8, status: "high" },
    { region: "Delhi NCR", users: 534, leads: 28, devs: 6, status: "medium" },
    { region: "Tamil Nadu", users: 412, leads: 22, devs: 5, status: "medium" },
    { region: "Gujarat", users: 289, leads: 18, devs: 4, status: "low" },
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

  const activeTasks = [
    { id: 1, title: "Review franchise application - Mumbai", priority: "high", assignee: "Admin", time: "2h ago" },
    { id: 2, title: "Approve developer payout - ₹45,000", priority: "urgent", assignee: "Finance", time: "1h ago" },
    { id: 3, title: "Escalated lead - Enterprise client", priority: "high", assignee: "Sales", time: "30m ago" },
    { id: 4, title: "Demo server maintenance", priority: "medium", assignee: "DevOps", time: "4h ago" },
    { id: 5, title: "New reseller onboarding", priority: "low", assignee: "Support", time: "5h ago" },
  ];

  const alerts = [
    { id: 1, type: "warning", message: "Demo 'Clinic Software' response time degraded", time: "5m ago" },
    { id: 2, type: "error", message: "Developer timer paused for 2+ hours - Amit K.", time: "15m ago" },
    { id: 3, type: "info", message: "New franchise application received - Pune", time: "30m ago" },
    { id: 4, type: "success", message: "Lead converted - Enterprise deal ₹2.5L", time: "1h ago" },
  ];

  const aiRecommendations = [
    { id: 1, suggestion: "Assign 3 idle developers to pending e-commerce tasks", impact: "High", action: "Auto-assign" },
    { id: 2, suggestion: "Follow up with 12 leads showing high intent signals", impact: "Medium", action: "Send reminders" },
    { id: 3, suggestion: "Scale Maharashtra region - 40% growth potential", impact: "High", action: "View analysis" },
    { id: 4, suggestion: "Optimize demo server in South region", impact: "Low", action: "Schedule" },
  ];

  const performanceData = [
    { time: "00:00", leads: 12, conversions: 3, tasks: 8 },
    { time: "04:00", leads: 8, conversions: 2, tasks: 5 },
    { time: "08:00", leads: 25, conversions: 6, tasks: 18 },
    { time: "12:00", leads: 45, conversions: 12, tasks: 32 },
    { time: "16:00", leads: 38, conversions: 9, tasks: 28 },
    { time: "20:00", leads: 28, conversions: 7, tasks: 15 },
    { time: "Now", leads: 32, conversions: 8, tasks: 20 },
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
      case "urgent": return "bg-red-500/20 text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "error": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
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
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    {stat.up ? <ArrowUpRight className="w-3 h-3 text-green-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
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

      {/* Live Lead Counter - Highlighted */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <Card className="glass-card border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-neon-purple/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center"
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <p className="text-sm text-muted-foreground">Live Lead Counter</p>
                  <motion.div
                    key="lead-count"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold text-primary"
                  >
                    156
                  </motion.div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">42</div>
                  <div className="text-xs text-muted-foreground">Hot Leads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">78</div>
                  <div className="text-xs text-muted-foreground">Warm Leads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">36</div>
                  <div className="text-xs text-muted-foreground">New Today</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks List */}
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListTodo className="w-5 h-5 text-primary" />
              Active Tasks
              <Badge variant="outline" className="ml-auto">{activeTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-background/50 border border-white/5 hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getStatusColor(task.priority)}`}>{task.priority}</Badge>
                      <span className="text-xs text-muted-foreground">{task.assignee}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{task.time}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-5 h-5 text-yellow-400" />
              Alerts
              <Badge variant="destructive" className="ml-auto">{alerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-background/50 border border-white/5"
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5 text-neon-purple" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiRecommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-neon-purple/5 border border-primary/10"
              >
                <p className="text-sm mb-2">{rec.suggestion}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">Impact: {rec.impact}</Badge>
                  <button className="text-xs text-primary hover:underline">{rec.action}</button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Graph */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Performance Overview (Today)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="leads" stroke="hsl(var(--primary))" fill="url(#leadGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="conversions" stroke="#22c55e" fill="url(#conversionGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="tasks" stroke="#a855f7" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Conversions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm text-muted-foreground">Tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Activity Heatmap */}
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

        {/* Demo Status Grid */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-green-400" />
              Demo Status
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

        {/* Wallet Summary */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-yellow-400" />
              Wallet Summary
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
