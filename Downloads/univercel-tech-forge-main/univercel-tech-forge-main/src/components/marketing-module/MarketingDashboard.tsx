import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Plus,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const liveMetrics = [
  { 
    label: "Active Campaigns", 
    value: "12", 
    change: "+3", 
    trend: "up",
    icon: Megaphone,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    label: "SEO Rank Change", 
    value: "+28", 
    change: "positions", 
    trend: "up",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500"
  },
  { 
    label: "Leads Generated", 
    value: "1,847", 
    change: "+156 today", 
    trend: "up",
    icon: Users,
    color: "from-violet-500 to-purple-500"
  },
  { 
    label: "Cost Spent Today", 
    value: "$2,340", 
    change: "within budget", 
    trend: "neutral",
    icon: DollarSign,
    color: "from-amber-500 to-orange-500"
  },
  { 
    label: "ROI Score", 
    value: "4.2x", 
    change: "+0.8x", 
    trend: "up",
    icon: Target,
    color: "from-pink-500 to-rose-500"
  },
];

const activeCampaigns = [
  { name: "Africa Expansion Q1", platform: "Google Ads", status: "running", spend: "$1,200", leads: 234, roi: "3.8x" },
  { name: "Franchise Recruitment", platform: "Meta Ads", status: "running", spend: "$890", leads: 156, roi: "4.1x" },
  { name: "Product Launch SEO", platform: "SEO", status: "optimizing", spend: "$450", leads: 89, roi: "5.2x" },
  { name: "Reseller Program ME", platform: "LinkedIn", status: "running", spend: "$670", leads: 78, roi: "2.9x" },
];

export const MarketingDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing Dashboard</h1>
          <p className="text-muted-foreground">AI-powered marketing across all channels</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => toast.info('Opening marketing reports')}>
            <BarChart3 className="w-4 h-4" />
            View Reports
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => toast.success('Auto-optimization started')}>
            <Zap className="w-4 h-4" />
            Auto Optimize
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500" onClick={() => toast.info('Opening campaign creator')}>
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {liveMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50 hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {metric.trend === "up" && (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    )}
                    {metric.trend === "down" && (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                  <div className="text-xs text-emerald-400 mt-1">{metric.change}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Active Campaigns */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-400" />
            Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">{campaign.platform}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge variant={campaign.status === "running" ? "default" : "secondary"} className="capitalize">
                    {campaign.status}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{campaign.spend}</div>
                    <div className="text-xs text-muted-foreground">spent</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{campaign.leads}</div>
                    <div className="text-xs text-muted-foreground">leads</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-emerald-400">{campaign.roi}</div>
                    <div className="text-xs text-muted-foreground">ROI</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => toast.info(`Managing ${campaign.name}`)}>Manage</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Google Ads</span>
                <span className="text-foreground">$4,200 / $5,000</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Meta Ads</span>
                <span className="text-foreground">$2,800 / $4,000</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">SEO Tools</span>
                <span className="text-foreground">$450 / $1,000</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Countries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { country: "Nigeria", leads: 456, roi: "4.8x" },
              { country: "Kenya", leads: 312, roi: "4.2x" },
              { country: "UAE", leads: 287, roi: "3.9x" },
              { country: "India", leads: 234, roi: "3.6x" },
            ].map((item, index) => (
              <div key={item.country} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/30">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  <span className="text-foreground">{item.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{item.leads} leads</span>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                    {item.roi}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
