import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Megaphone, 
  Play, 
  Pause, 
  Eye,
  Target,
  Calendar,
  TrendingUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { MarketingCampaign } from "@/lib/api/marketing-manager";
import type { MarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";

interface MMActiveCampaignsProps {
  system: MarketingManagerSystem;
}

const MMActiveCampaigns = ({ system }: MMActiveCampaignsProps) => {
  const campaigns = system.dashboard?.campaigns ?? [];

  const getCampaignStatus = (campaign: MarketingCampaign) => {
    if (campaign.approval_status === "pending") return "pending_approval";
    return campaign.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "pending_approval": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getObjectiveColor = (objective: string) => {
    switch (objective) {
      case "lead":
      case "lead_generation": return "bg-purple-500/20 text-purple-400";
      case "demo": return "bg-cyan-500/20 text-cyan-400";
      case "brand":
      case "brand_awareness": return "bg-pink-500/20 text-pink-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handlePause = (campaign: MarketingCampaign) => {
    system.updateCampaignStatusMutation.mutate({ campaignId: campaign.id, status: "paused" }, {
      onSuccess: () => {
        toast({
          title: "Campaign Paused",
          description: `${campaign.name} has been paused and logged.`,
        });
      },
      onError: (error) => {
        toast({ title: "Unable to Pause Campaign", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleResume = (campaign: MarketingCampaign) => {
    system.updateCampaignStatusMutation.mutate({ campaignId: campaign.id, status: "active" }, {
      onSuccess: () => {
        toast({
          title: "Campaign Resumed",
          description: `${campaign.name} is live again and back under automation.`,
        });
      },
      onError: (error) => {
        toast({ title: "Unable to Resume Campaign", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleView = (campaign: MarketingCampaign) => {
    const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : "0.00";
    toast({
      title: "Viewing Campaign",
      description: `${campaign.name}: ${campaign.leads_generated} leads, ${ctr}% CTR, ROI ${campaign.roi_value}%.`,
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <Megaphone className="h-5 w-5 text-teal-400" />
          Active Campaigns
          <Badge variant="outline" className="ml-auto bg-teal-500/20 text-teal-400 border-teal-500/30">
            {campaigns.filter(c => c.status === "active").length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-slate-100">{campaign.name}</h4>
                  <Badge className={getObjectiveColor(String(campaign.objective || "growth").toLowerCase())}>
                    <Target className="h-3 w-3 mr-1" />
                    {campaign.objective || "Growth"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {campaign.channel} • {String(campaign.metadata?.targetingMode || campaign.approval_status || "live optimization")}
                </p>
              </div>
              <Badge className={getStatusColor(getCampaignStatus(campaign))}>
                {getCampaignStatus(campaign).replace("_", " ")}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded bg-slate-900/50">
                <p className="text-xs text-slate-400">Leads</p>
                <p className="text-lg font-bold text-slate-100">{campaign.leads_generated}</p>
              </div>
              <div className="p-2 rounded bg-slate-900/50">
                <p className="text-xs text-slate-400">CTR</p>
                <p className="text-lg font-bold text-slate-100">
                  {campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : "0.00"}%
                </p>
              </div>
              <div className="p-2 rounded bg-slate-900/50">
                <p className="text-xs text-slate-400">Impressions</p>
                <p className="text-lg font-bold text-slate-100">
                  {(campaign.impressions / 1000).toFixed(0)}K
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Budget Used</span>
                <span className="text-slate-300">
                  {campaign.budget > 0 ? ((campaign.spent / campaign.budget) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <Progress value={campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0} className="h-1.5" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3 w-3" />
                {campaign.duration.start} - {campaign.duration.end}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => handleView(campaign)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                {campaign.status === "active" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-amber-400 hover:text-amber-300"
                    onClick={() => handlePause(campaign)}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                ) : campaign.status === "paused" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-emerald-400 hover:text-emerald-300"
                    onClick={() => handleResume(campaign)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <TrendingUp className="h-3 w-3" />
              ROI: {campaign.roi_value}%
            </div>
          </motion.div>
        ))}

        {/* Security Notice */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            ⚠️ Auto-publish is BLOCKED. All campaigns require approval flow.
            Pricing edits are BLOCKED.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMActiveCampaigns;
