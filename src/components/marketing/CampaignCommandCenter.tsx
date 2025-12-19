import { motion } from "framer-motion";
import { Rocket, Play, Pause, Copy, TrendingUp, TrendingDown, Eye, MousePointer, DollarSign, Target, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CampaignCommandCenterProps {
  fullView?: boolean;
}

const CampaignCommandCenter = ({ fullView = false }: CampaignCommandCenterProps) => {
  const campaigns = [
    {
      id: 1,
      name: "Summer Product Launch",
      status: "active",
      budget: 50000,
      spent: 32400,
      leads: 428,
      ctr: 5.2,
      roi: 380,
      region: "India",
      channel: "Social",
    },
    {
      id: 2,
      name: "Enterprise Demo Push",
      status: "active",
      budget: 75000,
      spent: 45600,
      leads: 156,
      ctr: 3.8,
      roi: 290,
      region: "Middle East",
      channel: "Google Ads",
    },
    {
      id: 3,
      name: "Franchise Recruitment",
      status: "paused",
      budget: 30000,
      spent: 18200,
      leads: 89,
      ctr: 4.1,
      roi: 210,
      region: "Pan India",
      channel: "LinkedIn",
    },
    {
      id: 4,
      name: "Influencer Collab Q4",
      status: "active",
      budget: 100000,
      spent: 67800,
      leads: 892,
      ctr: 6.4,
      roi: 520,
      region: "Global",
      channel: "Instagram",
    },
  ];

  const aiRecommendations = [
    { type: "budget", message: "Increase 'Summer Launch' budget by 20% - high conversion potential", impact: "+45 leads" },
    { type: "audience", message: "Expand 'Enterprise Demo' to Dubai & Abu Dhabi", impact: "+38% reach" },
    { type: "timing", message: "Schedule social posts at 7-9 PM IST for 2x engagement", impact: "+2.1% CTR" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "ended": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <Card className={`bg-slate-900/50 border-teal-500/20 backdrop-blur-xl ${fullView ? "min-h-[700px]" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-teal-100 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-teal-400" />
            Campaign Command Center
          </CardTitle>
          <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40">
            {campaigns.filter(c => c.status === "active").length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campaigns List */}
        <div className="space-y-3">
          {campaigns.slice(0, fullView ? 4 : 3).map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-slate-200">{campaign.name}</h4>
                  <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-teal-400">
                    {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-teal-400">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Budget: ₹{(campaign.spent / 1000).toFixed(1)}K / ₹{(campaign.budget / 1000).toFixed(0)}K</span>
                  <span className="text-teal-400">{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1.5 bg-slate-700" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-2 rounded-lg bg-slate-900/50">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                    <Target className="w-3 h-3" />
                    <span>Leads</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-400">{campaign.leads}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900/50">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                    <MousePointer className="w-3 h-3" />
                    <span>CTR</span>
                  </div>
                  <p className="text-lg font-bold text-cyan-400">{campaign.ctr}%</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900/50">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                    <TrendingUp className="w-3 h-3" />
                    <span>ROI</span>
                  </div>
                  <p className="text-lg font-bold text-teal-400">{campaign.roi}%</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900/50">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                    <Eye className="w-3 h-3" />
                    <span>Channel</span>
                  </div>
                  <p className="text-sm font-medium text-slate-300">{campaign.channel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Recommendations */}
        {fullView && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-3"
          >
            <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              AI Campaign Recommendations
            </h4>
            {aiRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-3 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/5 border border-teal-500/20"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-teal-200">{rec.message}</p>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{rec.impact}</Badge>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignCommandCenter;
