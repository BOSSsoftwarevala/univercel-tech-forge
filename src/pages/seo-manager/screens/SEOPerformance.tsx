import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MousePointer, BarChart3, Target, TrendingUp, Globe, Calendar, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";

const impressionData = [
  { date: "Mon", impressions: 185000, clicks: 7200, ctr: 3.89 },
  { date: "Tue", impressions: 192000, clicks: 7800, ctr: 4.06 },
  { date: "Wed", impressions: 178000, clicks: 6900, ctr: 3.88 },
  { date: "Thu", impressions: 205000, clicks: 8400, ctr: 4.10 },
  { date: "Fri", impressions: 198000, clicks: 7600, ctr: 3.84 },
  { date: "Sat", impressions: 145000, clicks: 5200, ctr: 3.59 },
  { date: "Sun", impressions: 132000, clicks: 4800, ctr: 3.64 },
];

const countryData = [
  { country: "United States", sessions: 18400, bounce: "42%", pages: "3.8", duration: "4:12" },
  { country: "United Kingdom", sessions: 8200, bounce: "45%", pages: "3.2", duration: "3:45" },
  { country: "India", sessions: 6800, bounce: "51%", pages: "2.9", duration: "3:18" },
  { country: "Germany", sessions: 4100, bounce: "38%", pages: "4.1", duration: "4:32" },
  { country: "Canada", sessions: 3900, bounce: "40%", pages: "3.5", duration: "3:58" },
  { country: "Australia", sessions: 2800, bounce: "44%", pages: "3.3", duration: "3:42" },
];

const topPages = [
  { page: "/products/software-development", impressions: 245000, clicks: 12400, ctr: 5.06, position: 3.2, change: +1.2 },
  { page: "/services/web-design", impressions: 189000, clicks: 8900, ctr: 4.71, position: 5.8, change: +0.8 },
  { page: "/blog/tech-trends-2025", impressions: 156000, clicks: 7200, ctr: 4.62, position: 7.1, change: -0.3 },
  { page: "/products/crm", impressions: 134000, clicks: 6100, ctr: 4.55, position: 8.4, change: +2.1 },
  { page: "/about-us", impressions: 98000, clicks: 4100, ctr: 4.18, position: 9.4, change: 0 },
  { page: "/pricing", impressions: 87000, clicks: 3800, ctr: 4.37, position: 11.2, change: -1.4 },
];

const deviceData = [
  { device: "Desktop", sessions: 24800, percentage: 55 },
  { device: "Mobile", sessions: 16200, percentage: 36 },
  { device: "Tablet", sessions: 4000, percentage: 9 },
];

const SEOPerformance = () => {
  const [dateRange, setDateRange] = useState("7d");

  const metrics = [
    { label: "Impressions", value: "1.24M", icon: Eye, change: "+18.4%", positive: true, color: "text-blue-400" },
    { label: "Clicks", value: "45.2K", icon: MousePointer, change: "+12.1%", positive: true, color: "text-emerald-400" },
    { label: "Avg CTR", value: "3.8%", icon: BarChart3, change: "+0.4%", positive: true, color: "text-purple-400" },
    { label: "Avg Position", value: "8.4", icon: Target, change: "-1.2", positive: true, color: "text-cyan-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d"].map(range => (
            <Button key={range} size="sm" variant={dateRange === range ? "default" : "outline"}
              className={dateRange === range ? "bg-cyan-600" : "border-slate-700 text-slate-400"}
              onClick={() => { setDateRange(range); toast.info(`Showing ${range} data`); }}>
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                  <span className={`text-xs ${m.positive ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-0.5`}>
                    <ArrowUpRight className="h-3 w-3" />{m.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{m.value}</p>
                <p className="text-xs text-slate-500">{m.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base">Impressions & Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={impressionData}>
                <defs>
                  <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="clkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="impressions" stroke="#3b82f6" fill="url(#impGrad)" strokeWidth={2} name="Impressions" />
                <Area type="monotone" dataKey="clicks" stroke="#10b981" fill="url(#clkGrad)" strokeWidth={2} name="Clicks" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base">CTR Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={impressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[3, 4.5]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="ctr" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4 }} name="CTR %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-cyan-400 text-base">Top Performing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topPages.map((page, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-mono truncate">{page.page}</p>
                </div>
                <div className="flex gap-6 text-sm ml-4">
                  <div className="text-center w-20">
                    <p className="text-[10px] text-slate-500">Impressions</p>
                    <p className="text-white font-medium">{(page.impressions / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center w-16">
                    <p className="text-[10px] text-slate-500">Clicks</p>
                    <p className="text-white font-medium">{(page.clicks / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="text-center w-14">
                    <p className="text-[10px] text-slate-500">CTR</p>
                    <p className="text-purple-400 font-medium">{page.ctr}%</p>
                  </div>
                  <div className="text-center w-14">
                    <p className="text-[10px] text-slate-500">Pos</p>
                    <p className="text-cyan-400 font-medium">{page.position}</p>
                  </div>
                  <div className="w-14 text-center">
                    <Badge className={page.change > 0 ? "bg-emerald-500/20 text-emerald-400" : page.change < 0 ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"}>
                      {page.change > 0 ? `+${page.change}` : page.change || '—'}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geo & Device */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><Globe className="h-4 w-4" /> Top Countries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {countryData.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-white">{c.country}</span>
                <div className="flex gap-4 text-xs">
                  <span className="text-slate-300">{c.sessions.toLocaleString()} sessions</span>
                  <span className="text-slate-500">Bounce: {c.bounce}</span>
                  <span className="text-slate-500">Avg {c.duration}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map(d => (
                <div key={d.device} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{d.device}</span>
                    <span className="text-slate-400">{d.sessions.toLocaleString()} ({d.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${d.percentage}%` }} transition={{ duration: 1 }}
                      className="h-full rounded-full bg-cyan-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SEOPerformance;
