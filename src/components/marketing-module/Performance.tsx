import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Globe,
  Megaphone,
  FileSearch,
  Download,
  Calendar
} from "lucide-react";

const countryPerformance = [
  { country: "Nigeria", spend: "$12,400", leads: 1245, conversions: 89, roi: "4.8x", trend: "up" },
  { country: "Kenya", spend: "$8,900", leads: 890, conversions: 67, roi: "4.2x", trend: "up" },
  { country: "UAE", spend: "$15,600", leads: 1567, conversions: 112, roi: "3.9x", trend: "stable" },
  { country: "South Africa", spend: "$7,800", leads: 678, conversions: 45, roi: "3.5x", trend: "up" },
  { country: "India", spend: "$10,200", leads: 1023, conversions: 78, roi: "3.2x", trend: "down" },
];

const platformPerformance = [
  { platform: "Google Ads", spend: "$24,500", clicks: 45678, leads: 3456, cpl: "$7.09", roi: "4.1x" },
  { platform: "Meta Ads", spend: "$18,900", clicks: 89123, leads: 4567, cpl: "$4.14", roi: "3.8x" },
  { platform: "LinkedIn", spend: "$8,400", clicks: 12345, leads: 890, cpl: "$9.44", roi: "2.9x" },
  { platform: "YouTube", spend: "$5,200", clicks: 34567, leads: 567, cpl: "$9.17", roi: "2.5x" },
];

const keywordPerformance = [
  { keyword: "franchise business Africa", clicks: 4567, leads: 234, cost: "$890", cpl: "$3.80", roi: "5.2x" },
  { keyword: "software reseller program", clicks: 3456, leads: 189, cost: "$720", cpl: "$3.81", roi: "4.8x" },
  { keyword: "best POS system Nigeria", clicks: 2890, leads: 156, cost: "$520", cpl: "$3.33", roi: "4.5x" },
  { keyword: "business management Kenya", clicks: 2345, leads: 123, cost: "$480", cpl: "$3.90", roi: "4.2x" },
];

export const Performance = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance</h1>
          <p className="text-muted-foreground">Comprehensive ROI analysis</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-[150px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Spend", value: "$54,900", change: "+12%", icon: DollarSign, color: "from-blue-500 to-cyan-500" },
          { label: "Total Leads", value: "9,480", change: "+23%", icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
          { label: "Avg. ROI", value: "3.7x", change: "+0.4x", icon: BarChart3, color: "from-violet-500 to-purple-500" },
          { label: "Cost per Lead", value: "$5.79", change: "-8%", icon: Megaphone, color: "from-amber-500 to-orange-500" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Country-wise ROI */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            Country-wise ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {countryPerformance.map((item, index) => (
              <motion.div
                key={item.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="font-medium text-foreground">{item.country}</div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.spend}</div>
                    <div className="text-xs text-muted-foreground">Spend</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.leads}</div>
                    <div className="text-xs text-muted-foreground">Leads</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.conversions}</div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 min-w-[60px] justify-center">
                    {item.roi}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform-wise ROI */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-400" />
            Platform-wise ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {platformPerformance.map((item, index) => (
              <motion.div
                key={item.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="font-medium text-foreground">{item.platform}</div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.spend}</div>
                    <div className="text-xs text-muted-foreground">Spend</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.clicks.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.leads.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Leads</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.cpl}</div>
                    <div className="text-xs text-muted-foreground">CPL</div>
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 min-w-[60px] justify-center">
                    {item.roi}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyword ROI */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-violet-400" />
            Keyword ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keywordPerformance.map((item, index) => (
              <motion.div
                key={item.keyword}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.keyword}</div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.clicks.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.leads}</div>
                    <div className="text-xs text-muted-foreground">Leads</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.cost}</div>
                    <div className="text-xs text-muted-foreground">Cost</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.cpl}</div>
                    <div className="text-xs text-muted-foreground">CPL</div>
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 min-w-[60px] justify-center">
                    {item.roi}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
