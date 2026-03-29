import { motion } from "framer-motion";
import { MousePointer, Globe, Smartphone, Monitor, TrendingUp, MapPin, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LiveClickTracker = () => {
  const recentClicks = [
    { id: 1, country: "USA", city: "New York", device: "Mobile", source: "Instagram", time: "2s ago" },
    { id: 2, country: "UK", city: "London", device: "Desktop", source: "YouTube", time: "5s ago" },
    { id: 3, country: "India", city: "Mumbai", device: "Mobile", source: "WhatsApp", time: "8s ago" },
    { id: 4, country: "Germany", city: "Berlin", device: "Tablet", source: "Facebook", time: "12s ago" },
    { id: 5, country: "Brazil", city: "São Paulo", device: "Mobile", source: "TikTok", time: "15s ago" },
  ];

  const deviceStats = [
    { device: "Mobile", percentage: 68, icon: Smartphone, color: "violet" },
    { device: "Desktop", percentage: 24, icon: Monitor, color: "cyan" },
    { device: "Tablet", percentage: 8, icon: Monitor, color: "emerald" },
  ];

  const topRegions = [
    { region: "North America", clicks: 12450, percentage: 35 },
    { region: "Europe", clicks: 8920, percentage: 25 },
    { region: "Asia Pacific", clicks: 7840, percentage: 22 },
    { region: "Latin America", clicks: 4280, percentage: 12 },
    { region: "Others", clicks: 2140, percentage: 6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-100">Live Click Tracker</h2>
          <p className="text-slate-400">Real-time click analytics and geographic data</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
          <Activity className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-violet-100">35,630</div>
            <div className="text-xs text-slate-400">Total Clicks</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">42</div>
            <div className="text-xs text-slate-400">Countries</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">+24%</div>
            <div className="text-xs text-slate-400">vs Last Week</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">127</div>
            <div className="text-xs text-slate-400">Clicks/Hour</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" />
              Real-Time Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentClicks.map((click, index) => (
                <motion.div
                  key={click.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-violet-100 font-medium">{click.city}, {click.country}</p>
                      <p className="text-xs text-slate-400">{click.device} • {click.source}</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400">{click.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 text-lg">Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deviceStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.device} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 text-${stat.color}-400`} />
                        <span className="text-slate-300 text-sm">{stat.device}</span>
                      </div>
                      <span className="text-violet-300 font-medium">{stat.percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentage}%` }}
                        className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400`}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 text-lg">Top Regions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topRegions.map((region, index) => (
                <div key={region.region} className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-4">{index + 1}</span>
                    <span className="text-slate-300 text-sm">{region.region}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-violet-300 text-sm font-medium">{region.clicks.toLocaleString()}</span>
                    <span className="text-slate-500 text-xs ml-2">({region.percentage}%)</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveClickTracker;
