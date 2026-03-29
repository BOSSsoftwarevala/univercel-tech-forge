import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Code2,
  HeadphonesIcon,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 125000, target: 100000 },
  { month: "Feb", revenue: 148000, target: 120000 },
  { month: "Mar", revenue: 167000, target: 140000 },
  { month: "Apr", revenue: 189000, target: 160000 },
  { month: "May", revenue: 212000, target: 180000 },
  { month: "Jun", revenue: 234000, target: 200000 },
];

const performanceData = [
  { role: "Developers", score: 87, tasks: 127 },
  { role: "Sales", score: 92, tasks: 45 },
  { role: "Support", score: 95, tasks: 67 },
  { role: "SEO", score: 78, tasks: 34 },
  { role: "Franchise", score: 89, tasks: 18 },
  { role: "Resellers", score: 84, tasks: 89 },
];

const conversionData = [
  { name: "Leads", value: 1200, color: "hsl(187, 100%, 50%)" },
  { name: "Demos", value: 480, color: "hsl(174, 100%, 45%)" },
  { name: "Trials", value: 192, color: "hsl(142, 76%, 50%)" },
  { name: "Conversions", value: 96, color: "hsl(280, 100%, 65%)" },
];

const GlobalMetrics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Global Metrics</h1>
          <p className="text-muted-foreground text-sm mt-1">Comprehensive business intelligence dashboard</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$1.69M", change: "+15.2%", trend: "up", icon: DollarSign, color: "text-neon-green" },
          { label: "Active Users", value: "416", change: "+8.4%", trend: "up", icon: Users, color: "text-primary" },
          { label: "Conversion Rate", value: "24.8%", change: "+3.2%", trend: "up", icon: Target, color: "text-neon-cyan" },
          { label: "Avg Resolution", value: "2.4h", change: "-18%", trend: "up", icon: Clock, color: "text-neon-teal" },
        ].map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{kpi.label}</div>
                  <div className={`text-2xl font-mono font-bold mt-1 ${kpi.color}`}>{kpi.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-neon-green" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-neon-red" />
                    )}
                    <span className="text-xs text-neon-green">{kpi.change}</span>
                  </div>
                </div>
                <Icon className={`w-8 h-8 ${kpi.color} opacity-50`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-4"
        >
          <h3 className="font-mono font-semibold text-foreground mb-4">Revenue vs Target</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(210, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(210, 20%, 55%)" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(222, 47%, 8%)", 
                  border: "1px solid hsl(222, 30%, 18%)",
                  borderRadius: "8px"
                }}
                formatter={(value: number) => [`$${(value/1000).toFixed(0)}k`, ""]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(187, 100%, 50%)" fill="url(#revenueGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="hsl(210, 20%, 55%)" strokeDasharray="5 5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-4"
        >
          <h3 className="font-mono font-semibold text-foreground mb-4">Conversion Funnel</h3>
          <div className="flex items-center justify-center h-[250px]">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(222, 47%, 8%)", 
                    border: "1px solid hsl(222, 30%, 18%)",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {conversionData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="font-mono text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance by Role */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-4"
      >
        <h3 className="font-mono font-semibold text-foreground mb-4">Performance by Role</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis type="number" stroke="hsl(210, 20%, 55%)" fontSize={12} domain={[0, 100]} />
            <YAxis type="category" dataKey="role" stroke="hsl(210, 20%, 55%)" fontSize={12} width={80} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(222, 47%, 8%)", 
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="score" fill="hsl(187, 100%, 50%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Module Activity Grid */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { name: "Franchise", icon: Building2, users: 42, tasks: 18, color: "from-neon-cyan to-neon-teal" },
          { name: "Developers", icon: Code2, users: 28, tasks: 127, color: "from-neon-purple to-neon-blue" },
          { name: "Support", icon: HeadphonesIcon, users: 12, tasks: 67, color: "from-neon-red to-neon-orange" },
          { name: "Sales", icon: TrendingUp, users: 15, tasks: 45, color: "from-neon-orange to-neon-red" },
          { name: "Resellers", icon: Users, users: 156, tasks: 89, color: "from-neon-green to-neon-teal" },
          { name: "SEO", icon: BarChart3, users: 8, tasks: 34, color: "from-neon-blue to-neon-cyan" },
        ].map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-4 text-center"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="font-mono font-semibold text-foreground text-sm">{module.name}</div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Users</div>
                  <div className="font-mono text-primary">{module.users}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Tasks</div>
                  <div className="font-mono text-neon-teal">{module.tasks}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GlobalMetrics;
