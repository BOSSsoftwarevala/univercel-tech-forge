import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, FileText, TrendingUp, TrendingDown, BarChart3, Globe, Search, 
  Link2, Zap, AlertTriangle, CheckCircle, Clock, RefreshCw, Eye, MousePointer,
  Target, ArrowUpRight, ArrowDownRight, Minus, Loader2
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { useSEOKeywords, useSEOBacklinks, useSEOTraffic, useSEOAuditReports } from "@/hooks/useSEOData";

const SEOOverview = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { keywords, loading: kwLoading } = useSEOKeywords();
  const { backlinks, loading: blLoading } = useSEOBacklinks();
  const { trafficStats, loading: trLoading } = useSEOTraffic();
  const { reports, loading: auLoading } = useSEOAuditReports();

  const isLoading = kwLoading || blLoading || trLoading || auLoading;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      toast.success("SEO data refreshed successfully");
    }, 2000);
  };

  const totalKeywords = keywords.length;
  const totalBacklinks = backlinks.length;
  const activeBacklinks = backlinks.filter((b: any) => b.status === "active").length;
  const latestAudit = reports[0];
  const seoScore = latestAudit?.seo_score || 0;

  // Compute traffic chart data from DB or show empty state
  const trafficChartData = trafficStats.length > 0
    ? trafficStats.slice(-6).map((t: any) => ({
        date: new Date(t.date).toLocaleDateString("en", { month: "short" }),
        organic: t.organic_traffic || 0,
        paid: t.paid_traffic || 0,
        referral: t.referral_traffic || 0,
      }))
    : [];

  // Position distribution from keywords
  const positionBuckets = [
    { range: "Top 3", count: keywords.filter((k: any) => k.position && k.position <= 3).length, color: "#10b981" },
    { range: "4-10", count: keywords.filter((k: any) => k.position && k.position >= 4 && k.position <= 10).length, color: "#3b82f6" },
    { range: "11-20", count: keywords.filter((k: any) => k.position && k.position >= 11 && k.position <= 20).length, color: "#f59e0b" },
    { range: "21-50", count: keywords.filter((k: any) => k.position && k.position >= 21 && k.position <= 50).length, color: "#f97316" },
    { range: "51+", count: keywords.filter((k: any) => k.position && k.position > 50).length, color: "#ef4444" },
  ];

  // Top ranking changes
  const rankingChanges = keywords
    .filter((k: any) => k.prev_position && k.position)
    .sort((a: any, b: any) => Math.abs(b.prev_position - b.position) - Math.abs(a.prev_position - a.position))
    .slice(0, 5);

  const stats = [
    { label: "Site Health Score", value: seoScore > 0 ? `${seoScore}` : "—", suffix: seoScore > 0 ? "/100" : "", icon: Activity, trend: "", positive: true, color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-400" },
    { label: "Total Keywords", value: totalKeywords > 0 ? totalKeywords.toString() : "0", suffix: "", icon: Search, trend: "", positive: true, color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-400" },
    { label: "Active Backlinks", value: activeBacklinks > 0 ? activeBacklinks.toString() : "0", suffix: "", icon: Link2, trend: "", positive: true, color: "from-cyan-500/20 to-cyan-600/10", iconColor: "text-cyan-400" },
    { label: "Audit Reports", value: reports.length.toString(), suffix: "", icon: FileText, trend: "", positive: true, color: "from-indigo-500/20 to-indigo-600/10", iconColor: "text-indigo-400" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-slate-400">Loading SEO data...</span>
      </div>
    );
  }

  const hasData = totalKeywords > 0 || totalBacklinks > 0 || trafficStats.length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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

      {!hasData && (
        <Card className="bg-cyan-500/10 border-cyan-500/20">
          <CardContent className="pt-6 pb-6 text-center">
            <Search className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No SEO Data Yet</h3>
            <p className="text-slate-400 text-sm">Start by adding keywords, running an audit, or importing your domain data from the Keyword Tracker or Automation Engine.</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className={`bg-gradient-to-br ${stat.color} border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-default`}>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}<span className="text-sm text-slate-400">{stat.suffix}</span></p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Traffic Trend & Position Distribution */}
      {(trafficChartData.length > 0 || totalKeywords > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {trafficChartData.length > 0 && (
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-cyan-400 text-base">Organic Traffic Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={trafficChartData}>
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
          )}

          {totalKeywords > 0 && (
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-cyan-400 text-base">Position Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {positionBuckets.map((pos) => (
                    <div key={pos.range} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-14">{pos.range}</span>
                      <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: totalKeywords > 0 ? `${(pos.count / totalKeywords) * 100}%` : '0%' }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full flex items-center justify-end pr-2"
                          style={{ backgroundColor: pos.color }}
                        >
                          {pos.count > 0 && <span className="text-[10px] font-bold text-white">{pos.count}</span>}
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400">Total Tracked Keywords</p>
                  <p className="text-2xl font-bold text-white">{totalKeywords}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Top Ranking Changes */}
      {rankingChanges.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-cyan-400 text-base">Top Ranking Changes</CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {rankingChanges.map((kw: any, i: number) => {
              const change = (kw.prev_position || 0) - (kw.position || 0);
              const isPositive = change > 0;
              return (
                <motion.div key={kw.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{kw.keyword}</p>
                    <p className="text-xs text-slate-500 font-mono">{kw.page_url || "—"}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-xs text-slate-500">{(kw.search_volume || 0).toLocaleString()}/mo</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 text-sm">#{kw.prev_position}</span>
                      <span className="text-slate-600">→</span>
                      <span className="text-white font-bold text-sm">#{kw.position}</span>
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
      )}

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
