import { motion } from "framer-motion";
import { 
  TrendingUp, Clock, Globe, Users, Target,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart as RechartsPie, Pie, Cell 
} from "recharts";

const LeadReports = () => {
  const conversionData = [
    { month: "Jan", leads: 120, converted: 45 },
    { month: "Feb", leads: 145, converted: 58 },
    { month: "Mar", leads: 180, converted: 72 },
    { month: "Apr", leads: 210, converted: 89 },
    { month: "May", leads: 195, converted: 82 },
    { month: "Jun", leads: 240, converted: 108 },
  ];

  const sourceData = [
    { name: "Website", value: 35, color: "#6366f1" },
    { name: "Referral", value: 25, color: "#8b5cf6" },
    { name: "Google Ads", value: 20, color: "#06b6d4" },
    { name: "LinkedIn", value: 12, color: "#10b981" },
    { name: "Partner", value: 8, color: "#f59e0b" },
  ];

  const regionPerformance = [
    { region: "Nigeria", leads: 450, conversion: 42, revenue: "$125K" },
    { region: "Kenya", leads: 320, conversion: 38, revenue: "$89K" },
    { region: "UAE", leads: 280, conversion: 52, revenue: "$156K" },
    { region: "India", leads: 520, conversion: 35, revenue: "$98K" },
    { region: "Saudi Arabia", leads: 190, conversion: 48, revenue: "$112K" },
  ];

  const teamPerformance = [
    { name: "Franchise Team", leads: 420, converted: 168, rate: 40 },
    { name: "Reseller Network", leads: 380, converted: 133, rate: 35 },
    { name: "Direct Sales", leads: 290, converted: 130, rate: 45 },
    { name: "Support Upsell", leads: 110, converted: 44, rate: 40 },
  ];

  const kpis = [
    { label: "Conversion Rate", value: "38.2%", change: "+5.4%", trend: "up", icon: Target },
    { label: "Avg. Handling Time", value: "4.2 days", change: "-0.8d", trend: "up", icon: Clock },
    { label: "Lead Quality Score", value: "72/100", change: "+8", trend: "up", icon: BarChart3 },
    { label: "Revenue/Lead", value: "$342", change: "+$28", trend: "up", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Lead Reports & Analytics</h2>
        <p className="text-slate-400">Comprehensive performance insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <kpi.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                kpi.trend === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {kpi.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-sm text-slate-400">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Conversion Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Conversion Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={conversionData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}
              />
              <Area type="monotone" dataKey="leads" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" name="Total Leads" />
              <Area type="monotone" dataKey="converted" stroke="#10b981" fillOpacity={1} fill="url(#colorConverted)" name="Converted" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Source Effectiveness */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            Lead Sources
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={200}>
              <RechartsPie>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="space-y-2">
              {sourceData.map((source) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-sm text-slate-300">{source.name}</span>
                  <span className="text-sm font-medium text-white">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Regional Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          Regional Performance Map
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {regionPerformance.map((region, index) => (
            <motion.div
              key={region.region}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-800/50 rounded-xl text-center"
            >
              <p className="text-sm font-medium text-white mb-2">{region.region}</p>
              <p className="text-2xl font-bold text-indigo-400">{region.leads}</p>
              <p className="text-xs text-slate-400">leads</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Badge className="bg-green-500/20 text-green-400">{region.conversion}%</Badge>
              </div>
              <p className="text-sm font-semibold text-emerald-400 mt-2">{region.revenue}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Reseller vs Franchise Performance
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={teamPerformance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#64748b" />
            <YAxis type="category" dataKey="name" stroke="#64748b" width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#1e293b", 
                border: "1px solid #334155",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="leads" fill="#6366f1" name="Total Leads" radius={[0, 4, 4, 0]} />
            <Bar dataKey="converted" fill="#10b981" name="Converted" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default LeadReports;
