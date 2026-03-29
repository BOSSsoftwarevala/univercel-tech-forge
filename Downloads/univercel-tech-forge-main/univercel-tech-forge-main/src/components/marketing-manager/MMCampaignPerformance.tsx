import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  MousePointerClick, 
  Users, 
  TrendingUp,
  Eye,
  Lock
} from "lucide-react";
import type { MarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";

interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

interface MMCampaignPerformanceProps {
  system: MarketingManagerSystem;
}

const formatCompact = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
};

const MMCampaignPerformance = ({ system }: MMCampaignPerformanceProps) => {
  const summary = system.dashboard?.summary;
  const campaigns = system.dashboard?.campaigns || [];
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const metrics: PerformanceMetric[] = [
    {
      label: "Total Impressions",
      value: formatCompact(summary?.reach || 0),
      change: `${summary?.activeCampaigns || 0} active`,
      positive: true,
      icon: <Eye className="h-4 w-4" />,
    },
    {
      label: "Total Clicks",
      value: formatCompact(totalClicks),
      change: `${summary?.activeChannels || 0} channels`,
      positive: true,
      icon: <MousePointerClick className="h-4 w-4" />,
    },
    {
      label: "Total Leads",
      value: formatCompact(summary?.leadsToday || 0),
      change: `${summary?.pendingApprovals || 0} approvals pending`,
      positive: true,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Avg. CTR",
      value: `${campaigns.length > 0 ? ((campaigns.reduce((sum, campaign) => sum + (campaign.impressions > 0 ? campaign.clicks / campaign.impressions : 0), 0) / campaigns.length) * 100).toFixed(2) : "0.00"}%`,
      change: `${summary?.conversionRate || 0}% CVR`,
      positive: (summary?.conversionRate || 0) >= 2,
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Campaign Performance
          </CardTitle>
          <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
            <Lock className="h-3 w-3 mr-1" />
            Read-Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                {metric.icon}
                <span className="text-xs">{metric.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-xl font-bold text-slate-100">{metric.value}</p>
                <span className={`text-xs ${metric.positive ? "text-emerald-400" : "text-red-400"}`}>
                  {metric.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 font-medium">Campaign</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium">Impressions</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium">Clicks</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium">Leads</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium">CTR</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice(0, 6).map((campaign, index) => {
                const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
                const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;

                return (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-slate-800 hover:bg-slate-800/30"
                >
                  <td className="py-3 px-3 text-slate-100">{campaign.name}</td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {formatCompact(campaign.impressions)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {formatCompact(campaign.clicks)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">{campaign.leads_generated}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={ctr >= 3 ? "text-emerald-400" : "text-slate-300"}>
                      {ctr.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={conversionRate >= 2 ? "text-emerald-400" : "text-amber-400"}>
                      {conversionRate.toFixed(2)}%
                    </span>
                  </td>
                </motion.tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Attribution Notice */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-400">
            📊 Attribution data is read-only. Leads are auto-tagged by campaign
            and sent to Lead Manager.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMCampaignPerformance;
