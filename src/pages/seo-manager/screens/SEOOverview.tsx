import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, FileText, TrendingUp, TrendingDown, BarChart3, Globe, Search, 
  Link2, Zap, AlertTriangle, CheckCircle, Clock, RefreshCw, Eye, MousePointer,
  Target, ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";

const trafficData = [
  { date: "Jan", organic: 32400, paid: 8200, direct: 12100, referral: 4300 },
  { date: "Feb", organic: 34800, paid: 7900, direct: 11800, referral: 4800 },
  { date: "Mar", organic: 38200, paid: 9100, direct: 13200, referral: 5100 },
  { date: "Apr", organic: 41500, paid: 8800, direct: 12900, referral: 5600 },
  { date: "May", organic: 43200, paid: 9400, direct: 14100, referral: 6200 },
  { date: "Jun", organic: 45200, paid: 10200, direct: 14800, referral: 6800 },
];

const positionData = [
  { range: "Top 3", count: 42, color: "#10b981" },
  { range: "4-10", count: 89, color: "#3b82f6" },
  { range: "11-20", count: 156, color: "#f59e0b" },
  { range: "21-50", count: 234, color: "#f97316" },
  { range: "51-100", count: 127, color: "#ef4444" },
];

const rankingChanges = [
  { keyword: "software development services", from: 8, to: 3, volume: 12400, url: "/products/software" },
  { keyword: "best crm platform", from: 15, to: 7, volume: 8900, url: "/products/crm" },
  { keyword: "cloud hosting solutions", from: 22, to: 9, volume: 6700, url: "/services/cloud" },
  { keyword: "enterprise automation", from: 5, to: 4, volume: 4200, url: "/enterprise" },
  { keyword: "mobile app development", from: 11, to: 18, volume: 15200, url: "/services/mobile" },
];

const crawlHealthData = [
  { label: "Healthy Pages", count: 1624, total: 1847, color: "text-emerald-400", bg: "bg-emerald-500" },
  { label: "Pages with Warnings", count: 156, total: 1847, color: "text-amber-400", bg: "bg-amber-500" },
  { label: "Pages with Errors", count: 67, total: 1847, color: "text-red-400", bg: "bg-red-500" },
];

const SEOOverview = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      toast.success("SEO data refreshed successfully");
    }, 2000);
  };

  const stats = [
    { label: "Site Health Score", value: "92", suffix: "/100", icon: Activity, trend: "+3", positive: true, color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-400" },
    { label: "Organic Traffic", value: "45.2K", suffix: "", icon: TrendingUp, trend: "+12.3%", positive: true, color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-400" },
    { label: "Total Keywords", value: "648", suffix: "", icon: Search, trend: "+24 new", positive: true, color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-400" },
    { label: "Backlinks", value: "12.4K", suffix: "", icon: Link2, trend: "+342", positive: true, color: "from-cyan-500/20 to-cyan-600/10", iconColor: "text-cyan-400" },
    { label: "Indexed Pages", value: "1,847", suffix: "", icon: FileText, trend: "+24", positive: true, color: "from-indigo-500/20 to-indigo-600/10", iconColor: "text-indigo-400" },
    { label: "Avg. Position", value: "8.4", suffix: "", icon: Target, trend: "-1.2", positive: true, color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-400" },
    { label: "CTR", value: "3.8%", suffix: "", icon: MousePointer, trend: "+0.4%", positive: true, color: "from-pink-500/20 to-pink-600/10", iconColor: "text-pink-400" },
    { label: "Domain Authority", value: "54", suffix: "/100", icon: Globe, trend: "+2", positive: true, color: "from-teal-500/20 to-teal-600/10", iconColor: "text-teal-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">SEO Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="bg-cyan-600 hover:bg-cyan-700">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className={`bg-gradient-to-br ${stat.color} border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-default`}>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}<span className="text-sm text-slate-400">{stat.suffix}</span></p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Traffic Trend & Position Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base">Organic Traffic Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="organic" stroke="#06b6d4" fill="url(#orgGrad)" strokeWidth={2} name="Organic" />
                <Area type="monotone" dataKey="paid" stroke="#a855f7" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Paid" />
                <Area type="monotone" dataKey="referral" stroke="#f59e0b" fill="none" strokeWidth={1.5} name="Referral" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base">Position Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positionData.map((pos) => (
                <div key={pos.range} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-14">{pos.range}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(pos.count / 648) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ backgroundColor: pos.color }}
                    >
                      <span className="text-[10px] font-bold text-white">{pos.count}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-400">Total Tracked Keywords</p>
              <p className="text-2xl font-bold text-white">648</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Ranking Changes & Crawl Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-cyan-400 text-base">Top Ranking Changes</CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {rankingChanges.map((kw, i) => {
              const change = kw.from - kw.to;
              const isPositive = change > 0;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{kw.keyword}</p>
                    <p className="text-xs text-slate-500 font-mono">{kw.url}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-xs text-slate-500">{kw.volume.toLocaleString()}/mo</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 text-sm">#{kw.from}</span>
                      <span className="text-slate-600">→</span>
                      <span className="text-white font-bold text-sm">#{kw.to}</span>
                    </div>
                    <Badge className={isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {isPositive ? `+${change}` : change}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base">Crawl Health Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {crawlHealthData.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${item.color}`}>{item.label}</span>
                  <span className="text-sm text-white font-bold">{item.count} <span className="text-slate-500 font-normal">/ {item.total}</span></span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / item.total) * 100}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${item.bg}`}
                  />
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                <p className="text-xs text-slate-400">Core Web Vitals</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">Pass</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                <p className="text-xs text-slate-400">Mobile Score</p>
                <p className="text-lg font-bold text-amber-400 mt-1">78</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                <p className="text-xs text-slate-400">SSL Status</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">Valid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 whitespace-nowrap" onClick={() => toast.info("Starting full site audit...")}>
              <Zap className="h-3.5 w-3.5 mr-1.5" /> Run Site Audit
            </Button>
            <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 whitespace-nowrap" onClick={() => toast.info("Discovering new keywords...")}>
              <Search className="h-3.5 w-3.5 mr-1.5" /> Discover Keywords
            </Button>
            <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 whitespace-nowrap" onClick={() => toast.info("Checking backlink profile...")}>
              <Link2 className="h-3.5 w-3.5 mr-1.5" /> Check Backlinks
            </Button>
            <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 whitespace-nowrap" onClick={() => toast.info("Analyzing competitors...")}>
              <Eye className="h-3.5 w-3.5 mr-1.5" /> Competitor Analysis
            </Button>
            <Button size="sm" variant="outline" className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10 whitespace-nowrap" onClick={() => toast.info("Generating SEO report...")}>
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" /> Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SEOOverview;
