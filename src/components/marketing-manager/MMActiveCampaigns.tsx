import { useState } from "react";
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

interface Campaign {
  id: string;
  name: string;
  objective: "Lead" | "Demo" | "Brand";
  channel: string;
  targetAudience: string;
  duration: { start: string; end: string };
  kpi: string;
  status: "active" | "paused" | "pending_approval" | "completed";
  performance: { leads: number; ctr: number; impressions: number };
  budgetUsed: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: "camp-001",
    name: "Q1 Lead Generation",
    objective: "Lead",
    channel: "Google Ads",
    targetAudience: "SMB Decision Makers",
    duration: { start: "2024-01-01", end: "2024-03-31" },
    kpi: "500 MQLs",
    status: "active",
    performance: { leads: 324, ctr: 3.2, impressions: 45000 },
    budgetUsed: 68,
  },
  {
    id: "camp-002",
    name: "Brand Awareness Social",
    objective: "Brand",
    channel: "Meta Ads",
    targetAudience: "Tech Professionals 25-45",
    duration: { start: "2024-02-01", end: "2024-04-30" },
    kpi: "1M Impressions",
    status: "active",
    performance: { leads: 89, ctr: 1.8, impressions: 680000 },
    budgetUsed: 52,
  },
  {
    id: "camp-003",
    name: "Demo Request Campaign",
    objective: "Demo",
    channel: "Email",
    targetAudience: "Enterprise Prospects",
    duration: { start: "2024-03-01", end: "2024-03-31" },
    kpi: "100 Demos",
    status: "pending_approval",
    performance: { leads: 0, ctr: 0, impressions: 0 },
    budgetUsed: 0,
  },
];

const MMActiveCampaigns = () => {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "pending_approval": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getObjectiveColor = (objective: Campaign["objective"]) => {
    switch (objective) {
      case "Lead": return "bg-purple-500/20 text-purple-400";
      case "Demo": return "bg-cyan-500/20 text-cyan-400";
      case "Brand": return "bg-pink-500/20 text-pink-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handlePause = (id: string) => {
    toast({
      title: "Campaign Paused",
      description: `Campaign ${id} has been paused. Action logged.`,
    });
  };

  const handleResume = (id: string) => {
    toast({
      title: "Campaign Resumed",
      description: `Campaign ${id} has been resumed. Action logged.`,
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "Viewing Campaign",
      description: `Opening detailed view for campaign ${id}.`,
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
                  <Badge className={getObjectiveColor(campaign.objective)}>
                    <Target className="h-3 w-3 mr-1" />
                    {campaign.objective}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {campaign.channel} • {campaign.targetAudience}
                </p>
              </div>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status.replace("_", " ")}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded bg-slate-900/50">
                <p className="text-xs text-slate-400">Leads</p>
                <p className="text-lg font-bold text-slate-100">{campaign.performance.leads}</p>
              </div>
              <div className="p-2 rounded bg-slate-900/50">
                <p className="text-xs text-slate-400">CTR</p>
                <p className="text-lg font-bold text-slate-100">{campaign.performance.ctr}%</p>
              </div>
              <div className="p-2 rounded bg-slate-900/50">
                <p className="text-xs text-slate-400">Impressions</p>
                <p className="text-lg font-bold text-slate-100">
                  {(campaign.performance.impressions / 1000).toFixed(0)}K
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Budget Used</span>
                <span className="text-slate-300">{campaign.budgetUsed}%</span>
              </div>
              <Progress value={campaign.budgetUsed} className="h-1.5" />
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
                  onClick={() => handleView(campaign.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                {campaign.status === "active" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-amber-400 hover:text-amber-300"
                    onClick={() => handlePause(campaign.id)}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                ) : campaign.status === "paused" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-emerald-400 hover:text-emerald-300"
                    onClick={() => handleResume(campaign.id)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <TrendingUp className="h-3 w-3" />
              KPI: {campaign.kpi}
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
