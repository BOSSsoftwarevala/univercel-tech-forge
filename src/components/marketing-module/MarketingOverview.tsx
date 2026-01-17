import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Users, DollarSign, Globe2, 
  Target, ArrowUpRight, ArrowDownRight,
  Zap, BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const metrics = [
  { 
    label: "Traffic Today", 
    value: "24,567", 
    change: "+12.5%", 
    trend: "up",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    label: "Leads Generated", 
    value: "342", 
    change: "+8.3%", 
    trend: "up",
    icon: Users,
    color: "from-emerald-500 to-green-500"
  },
  { 
    label: "Cost per Lead", 
    value: "$4.25", 
    change: "-15.2%", 
    trend: "down",
    icon: DollarSign,
    color: "from-amber-500 to-orange-500"
  },
  { 
    label: "ROI Status", 
    value: "284%", 
    change: "+22.1%", 
    trend: "up",
    icon: Target,
    color: "from-purple-500 to-pink-500"
  },
];

const topCountries = [
  { country: "India", leads: 145, traffic: 8234, conversion: 1.76 },
  { country: "UAE", leads: 67, traffic: 3456, conversion: 1.94 },
  { country: "Nigeria", leads: 45, traffic: 2890, conversion: 1.56 },
  { country: "Kenya", leads: 38, traffic: 2123, conversion: 1.79 },
  { country: "South Africa", leads: 32, traffic: 1987, conversion: 1.61 },
];

const channelPerformance = [
  { channel: "Organic SEO", leads: 156, percentage: 45, color: "bg-emerald-500" },
  { channel: "Google Ads", leads: 89, percentage: 26, color: "bg-blue-500" },
  { channel: "Meta Ads", leads: 54, percentage: 16, color: "bg-purple-500" },
  { channel: "Influencer", leads: 28, percentage: 8, color: "bg-amber-500" },
  { channel: "Direct", leads: 15, percentage: 5, color: "bg-rose-500" },
];

export const MarketingOverview = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing Overview</h1>
          <p className="text-muted-foreground">AI-driven marketing performance dashboard</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Zap className="w-3 h-3 mr-1" />
          AI Active
        </Badge>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      metric.trend === "up" ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCountries.map((country, index) => (
                <div 
                  key={country.country}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{country.leads}</p>
                      <p className="text-xs text-muted-foreground">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{country.traffic.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Traffic</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                      {country.conversion}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelPerformance.map((channel) => (
                <div key={channel.channel} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">{channel.channel}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{channel.leads} leads</span>
                      <span className="text-foreground font-semibold">{channel.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={channel.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
