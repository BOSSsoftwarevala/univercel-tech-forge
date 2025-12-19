import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, MousePointer, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PerformanceAnalyticsHubProps {
  fullView?: boolean;
}

const PerformanceAnalyticsHub = ({ fullView = false }: PerformanceAnalyticsHubProps) => {
  const kpis = [
    { label: "Cost Per Click", value: "₹12.40", change: -8.2, trend: "down", good: true },
    { label: "Cost Per Lead", value: "₹245", change: -12.5, trend: "down", good: true },
    { label: "Conversion Rate", value: "4.8%", change: 15.3, trend: "up", good: true },
    { label: "ROI", value: "342%", change: 28.7, trend: "up", good: true },
  ];

  const channelROI = [
    { channel: "Google Ads", spend: 180000, revenue: 720000, roi: 300 },
    { channel: "Facebook", spend: 120000, revenue: 480000, roi: 300 },
    { channel: "Instagram", spend: 80000, revenue: 420000, roi: 425 },
    { channel: "LinkedIn", spend: 60000, revenue: 180000, roi: 200 },
    { channel: "Influencers", spend: 100000, revenue: 520000, roi: 420 },
  ];

  const topCampaigns = [
    { name: "Summer Launch", quality: 94, leads: 428, roi: 380 },
    { name: "Influencer Q4", quality: 91, leads: 892, roi: 520 },
    { name: "Enterprise Push", quality: 87, leads: 156, roi: 290 },
  ];

  return (
    <Card className={`bg-slate-900/50 border-teal-500/20 backdrop-blur-xl ${fullView ? "min-h-[700px]" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-teal-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            Performance Analytics
          </CardTitle>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
            <TrendingUp className="w-3 h-3 mr-1" />
            +28.7% ROI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className={`grid ${fullView ? "grid-cols-4" : "grid-cols-2"} gap-3`}>
          {kpis.slice(0, fullView ? 4 : 2).map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <p className="text-xs text-slate-500">{kpi.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white">{kpi.value}</span>
                <span className={`text-xs flex items-center gap-0.5 ${
                  kpi.good ? "text-emerald-400" : "text-red-400"
                }`}>
                  {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change > 0 ? "+" : ""}{kpi.change}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Channel ROI */}
        {fullView && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-400 mb-4">Channel ROI Breakdown</h4>
            <div className="space-y-3">
              {channelROI.map((channel, index) => (
                <motion.div
                  key={channel.channel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-24 text-sm text-slate-300">{channel.channel}</div>
                  <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(channel.roi / 5, 100)}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${
                        channel.roi >= 400 ? "bg-emerald-500" :
                        channel.roi >= 300 ? "bg-teal-500" :
                        "bg-amber-500"
                      }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-3">
                      <span className="text-xs font-semibold text-white">{channel.roi}%</span>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <p className="text-sm text-emerald-400">₹{(channel.revenue / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-slate-500">₹{(channel.spend / 100000).toFixed(1)}L spent</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Top Campaigns */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Top Performing Campaigns
          </h4>
          <div className="space-y-2">
            {topCampaigns.slice(0, fullView ? 3 : 2).map((campaign, index) => (
              <motion.div
                key={campaign.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === 0 ? "bg-amber-500/20" : "bg-slate-700/50"
                  }`}>
                    <span className={`font-bold ${index === 0 ? "text-amber-400" : "text-slate-400"}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{campaign.name}</p>
                    <p className="text-xs text-slate-500">Quality: {campaign.quality}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-cyan-400">{campaign.leads}</p>
                    <p className="text-xs text-slate-500">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-emerald-400">{campaign.roi}%</p>
                    <p className="text-xs text-slate-500">ROI</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceAnalyticsHub;
