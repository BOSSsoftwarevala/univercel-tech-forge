import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, TrendingUp, Download, Calendar, Filter,
  PieChart, LineChart, ArrowUpRight, ArrowDownRight,
  FileText, Mail, Clock, RefreshCw, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState("30d");

  const overviewStats = [
    { label: "Total Traffic", value: "2.4M", change: "+28%", trend: "up", icon: Eye },
    { label: "Conversions", value: "12,847", change: "+24%", trend: "up", icon: TrendingUp },
    { label: "Revenue", value: "₹28.4L", change: "+32%", trend: "up", icon: BarChart3 },
    { label: "Avg Session", value: "4:32", change: "+18%", trend: "up", icon: Clock },
  ];

  const channelPerformance = [
    { channel: "Organic Search", traffic: 845000, conversions: 4521, revenue: 1245000, trend: "+18%" },
    { channel: "Paid Search", traffic: 425000, conversions: 2841, revenue: 892000, trend: "+24%" },
    { channel: "Social Media", traffic: 320000, conversions: 1842, revenue: 542000, trend: "+12%" },
    { channel: "Email", traffic: 185000, conversions: 1524, revenue: 485000, trend: "+28%" },
    { channel: "Direct", traffic: 420000, conversions: 1892, revenue: 624000, trend: "+8%" },
    { channel: "Referral", traffic: 205000, conversions: 227, revenue: 52000, trend: "-5%" },
  ];

  const topPages = [
    { page: "/software-solutions", views: 124521, bounceRate: "32%", avgTime: "5:42", conversions: 842 },
    { page: "/pricing", views: 89421, bounceRate: "28%", avgTime: "3:24", conversions: 621 },
    { page: "/demo", views: 78542, bounceRate: "18%", avgTime: "6:15", conversions: 1842 },
    { page: "/features", views: 65421, bounceRate: "35%", avgTime: "4:12", conversions: 421 },
    { page: "/blog", views: 142521, bounceRate: "45%", avgTime: "2:48", conversions: 124 },
  ];

  const scheduledReports = [
    { id: 1, name: "Weekly SEO Performance", schedule: "Every Monday, 9 AM", recipients: 5, lastSent: "Dec 18, 2024", status: "active" },
    { id: 2, name: "Monthly Traffic Overview", schedule: "1st of month, 10 AM", recipients: 8, lastSent: "Dec 1, 2024", status: "active" },
    { id: 3, name: "Campaign ROI Report", schedule: "Every Friday, 5 PM", recipients: 3, lastSent: "Dec 20, 2024", status: "active" },
    { id: 4, name: "Lead Quality Analysis", schedule: "Bi-weekly", recipients: 4, lastSent: "Dec 15, 2024", status: "paused" },
  ];

  const keywordRankings = [
    { keyword: "software development india", position: 3, change: "+2", volume: 12400 },
    { keyword: "crm software", position: 5, change: "+1", volume: 8900 },
    { keyword: "project management tool", position: 8, change: "-1", volume: 15200 },
    { keyword: "enterprise software", position: 4, change: "+3", volume: 6800 },
    { keyword: "saas platform", position: 6, change: "0", volume: 9400 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Comprehensive performance insights & reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-blue-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-blue-500/30 text-blue-400">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-blue-500/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="channels" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Channels
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            SEO Rankings
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Scheduled Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-300">Top Performing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <motion.div
                    key={page.page}
                    className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{page.page}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Avg Time: {page.avgTime}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-8 text-center">
                        <div>
                          <p className="text-lg font-bold text-white">{(page.views / 1000).toFixed(1)}K</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-cyan-400">{page.bounceRate}</p>
                          <p className="text-xs text-muted-foreground">Bounce</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-400">{page.conversions}</p>
                          <p className="text-xs text-muted-foreground">Conv</p>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm" className="text-blue-400">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-300">Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelPerformance.map((channel) => (
                  <div key={channel.channel} className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{channel.channel}</h4>
                      <Badge className={channel.trend.startsWith("+") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {channel.trend}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-lg font-bold text-white">{(channel.traffic / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-muted-foreground">Traffic</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-cyan-400">{channel.conversions.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-400">₹{(channel.revenue / 100000).toFixed(1)}L</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-300">Keyword Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywordRankings.map((kw) => (
                  <div key={kw.keyword} className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{kw.keyword}</h4>
                      <p className="text-xs text-muted-foreground">Volume: {kw.volume.toLocaleString()}/mo</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">#{kw.position}</p>
                        <p className="text-xs text-muted-foreground">Position</p>
                      </div>
                      <Badge className={kw.change.startsWith("+") ? "bg-green-500/20 text-green-400" : kw.change === "0" ? "bg-slate-500/20 text-slate-400" : "bg-red-500/20 text-red-400"}>
                        {kw.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-blue-300">Scheduled Reports</CardTitle>
              <Button variant="outline" className="border-blue-500/30 text-blue-400">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{report.name}</h4>
                        <p className="text-xs text-muted-foreground">{report.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {report.recipients} recipients
                      </div>
                      <span className="text-xs text-muted-foreground">Last: {report.lastSent}</span>
                      <Badge className={report.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;
