import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, BarChart3, TrendingUp, TrendingDown, FileText, Calendar, ArrowUpRight, Minus } from "lucide-react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";

const weeklyData = [
  { day: "Mon", impressions: 42150, clicks: 1589, position: 8.2 },
  { day: "Tue", impressions: 44800, clicks: 1720, position: 7.9 },
  { day: "Wed", impressions: 39200, clicks: 1480, position: 8.4 },
  { day: "Thu", impressions: 48100, clicks: 1890, position: 7.6 },
  { day: "Fri", impressions: 45600, clicks: 1750, position: 8.0 },
  { day: "Sat", impressions: 32400, clicks: 1120, position: 8.8 },
  { day: "Sun", impressions: 28900, clicks: 980, position: 9.1 },
];

const monthlyData = [
  { month: "Oct", traffic: 32000, keywords: 520, backlinks: 10800 },
  { month: "Nov", traffic: 36000, keywords: 548, backlinks: 11200 },
  { month: "Dec", traffic: 38500, keywords: 572, backlinks: 11600 },
  { month: "Jan", traffic: 41200, keywords: 598, backlinks: 11900 },
  { month: "Feb", traffic: 43800, keywords: 624, backlinks: 12100 },
  { month: "Mar", traffic: 45200, keywords: 648, backlinks: 12400 },
];

const pageChanges = [
  { page: "/products/software", keyword: "software development services", from: 8, to: 3, traffic: "+42%" },
  { page: "/products/crm", keyword: "best crm platform", from: 15, to: 7, traffic: "+68%" },
  { page: "/services/cloud", keyword: "cloud hosting solutions", from: 22, to: 9, traffic: "+120%" },
  { page: "/blog/tech-trends", keyword: "tech trends 2026", from: 14, to: 11, traffic: "+18%" },
  { page: "/services/mobile", keyword: "mobile app development", from: 11, to: 18, traffic: "-24%" },
];

const SEOReports = () => {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">SEO Reports</h2>
        <div className="flex items-center gap-3">
          <Badge className="bg-amber-500/20 text-amber-400"><AlertTriangle className="h-3 w-3 mr-1" /> No Export / No Copy</Badge>
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-400" onClick={() => toast.info("Report snapshot saved to audit log")}>
            <FileText className="h-3.5 w-3.5 mr-1.5" /> Save Snapshot
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="daily" className="data-[state=active]:bg-cyan-600">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-cyan-600">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-cyan-600">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Impressions", value: "42,150", change: "+8.2%", positive: true },
              { label: "Clicks", value: "1,589", change: "+5.4%", positive: true },
              { label: "Avg CTR", value: "3.77%", change: "+0.12%", positive: true },
              { label: "Avg Position", value: "8.2", change: "-0.3", positive: true },
            ].map((m, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="pt-4 pb-3">
                  <p className="text-xs text-slate-400">{m.label}</p>
                  <p className="text-xl font-bold text-white mt-1">{m.value}</p>
                  <span className={`text-xs ${m.positive ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-0.5 mt-1`}>
                    <ArrowUpRight className="h-3 w-3" />{m.change} vs yesterday
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Page Ranking Changes */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-2"><CardTitle className="text-cyan-400 text-base">Today's Ranking Changes</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {pageChanges.map((p, i) => {
                const change = p.from - p.to;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{p.keyword}</p>
                      <p className="text-xs text-slate-500 font-mono">{p.page}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-slate-500">#{p.from}</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-white font-bold">#{p.to}</span>
                      </div>
                      <Badge className={change > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                        {change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {p.traffic}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-cyan-400 text-base">Weekly Impressions & Clicks</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="impressions" fill="#3b82f6" radius={[4,4,0,0]} name="Impressions" />
                    <Bar dataKey="clicks" fill="#10b981" radius={[4,4,0,0]} name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-cyan-400 text-base">Avg Position Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} reversed domain={[7, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="position" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} name="Avg Position" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4 space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-2"><CardTitle className="text-cyan-400 text-base">6-Month Growth Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="trafGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="traffic" stroke="#06b6d4" fill="url(#trafGrad)" strokeWidth={2} name="Organic Traffic" />
                  <Line type="monotone" dataKey="keywords" stroke="#a855f7" strokeWidth={1.5} dot={false} name="Keywords" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SEOReports;
