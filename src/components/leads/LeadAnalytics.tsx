import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Sparkles,
  Globe,
  Award,
  BarChart3,
  Activity
} from "lucide-react";

const LeadAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const sourceConversion = [
    { source: "Website", leads: 420, converted: 76, rate: 18 },
    { source: "Demo", leads: 312, converted: 100, rate: 32 },
    { source: "Influencer", leads: 245, converted: 59, rate: 24 },
    { source: "Reseller", leads: 189, converted: 53, rate: 28 },
    { source: "Referral", leads: 81, converted: 36, rate: 45 },
  ];

  const rolePerformance = [
    { name: "Sales Team", leads: 456, converted: 137, rate: 30, color: "#00D9FF" },
    { name: "Franchise", leads: 389, converted: 132, rate: 34, color: "#39FF14" },
    { name: "Reseller", leads: 312, converted: 84, rate: 27, color: "#FF6B35" },
  ];

  const regionData = [
    { region: "Mumbai", leads: 245, converted: 68, score: 87 },
    { region: "Delhi", leads: 198, converted: 52, score: 82 },
    { region: "Bangalore", leads: 176, converted: 49, score: 79 },
    { region: "Ahmedabad", leads: 134, converted: 41, score: 75 },
    { region: "Pune", leads: 98, converted: 28, score: 71 },
  ];

  const trendData = [
    { month: "Jan", leads: 320, converted: 58 },
    { month: "Feb", leads: 380, converted: 72 },
    { month: "Mar", leads: 420, converted: 84 },
    { month: "Apr", leads: 390, converted: 78 },
    { month: "May", leads: 480, converted: 98 },
    { month: "Jun", leads: 520, converted: 112 },
  ];

  const abandonedReasons = [
    { reason: "Budget constraints", count: 45, percentage: 32 },
    { reason: "Competitor selected", count: 28, percentage: 20 },
    { reason: "No response", count: 38, percentage: 27 },
    { reason: "Requirements changed", count: 18, percentage: 13 },
    { reason: "Timing issues", count: 12, percentage: 8 },
  ];

  const aiScoreDistribution = [
    { score: "90-100", count: 45, color: "#39FF14" },
    { score: "70-89", count: 128, color: "#00D9FF" },
    { score: "50-69", count: 234, color: "#FF6B35" },
    { score: "30-49", count: 156, color: "#FFD700" },
    { score: "0-29", count: 89, color: "#FF4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Analytics</h1>
          <p className="text-muted-foreground">AI scores, conversion insights, and performance metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px] bg-background/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-primary" />
              <Badge className="bg-neon-green/20 text-neon-green text-xs">+12%</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">24.8%</p>
            <p className="text-xs text-muted-foreground">Overall Conversion</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-5 h-5 text-neon-teal" />
              <Badge className="bg-neon-green/20 text-neon-green text-xs">+8%</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">76.4</p>
            <p className="text-xs text-muted-foreground">Avg AI Score</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-orange-400" />
              <Badge className="bg-orange-500/20 text-orange-400 text-xs">-5%</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">141</p>
            <p className="text-xs text-muted-foreground">Abandoned Leads</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-neon-green" />
              <Badge className="bg-neon-green/20 text-neon-green text-xs">Top</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">Demo</p>
            <p className="text-xs text-muted-foreground">Best Source (32%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Trends */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Lead & Conversion Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="convertGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#00D9FF" fill="url(#leadGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="converted" stroke="#39FF14" fill="url(#convertGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Source-wise Conversion */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Source-wise Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceConversion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="source" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="leads" fill="#00D9FF" radius={[0, 4, 4, 0]} name="Total Leads" />
                  <Bar dataKey="converted" fill="#39FF14" radius={[0, 4, 4, 0]} name="Converted" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Performance */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Role Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rolePerformance.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{role.name}</span>
                  <Badge className="bg-neon-green/20 text-neon-green">{role.rate}%</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${role.rate}%`, backgroundColor: role.color }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{role.converted}/{role.leads}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* AI Score Distribution */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-teal" />
              AI Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiScoreDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {aiScoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {aiScoreDistribution.map((item) => (
                <div key={item.score} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.score}: {item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Abandoned Leads Report */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" />
              Abandoned Lead Reasons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {abandonedReasons.map((reason, index) => (
              <motion.div
                key={reason.reason}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{reason.reason}</span>
                  <span className="text-muted-foreground">{reason.count} ({reason.percentage}%)</span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-400 rounded-full" 
                    style={{ width: `${reason.percentage}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Region Heatmap */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Regional Performance Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {regionData.map((region, index) => (
              <motion.div
                key={region.region}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg text-center ${
                  region.score >= 80 ? 'bg-neon-green/20 border border-neon-green/30' :
                  region.score >= 70 ? 'bg-primary/20 border border-primary/30' :
                  'bg-orange-500/20 border border-orange-500/30'
                }`}
              >
                <p className="font-medium text-foreground mb-1">{region.region}</p>
                <p className="text-2xl font-bold text-foreground">{region.score}</p>
                <p className="text-xs text-muted-foreground">{region.leads} leads • {region.converted} conv.</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadAnalytics;
