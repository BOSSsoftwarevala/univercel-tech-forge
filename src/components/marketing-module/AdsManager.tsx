import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Megaphone, Play, Pause, Square, RefreshCw,
  DollarSign, Target, Users, TrendingUp,
  PlusCircle, Zap, Globe2, ImageIcon
} from "lucide-react";
import { toast } from "sonner";

const campaigns = [
  { 
    id: 1,
    name: "ERP Software - India",
    platform: "Google",
    status: "active",
    budget: 500,
    spent: 342,
    leads: 45,
    cpl: 7.60,
    roi: 285
  },
  { 
    id: 2,
    name: "Franchise - Africa",
    platform: "Meta",
    status: "active",
    budget: 300,
    spent: 189,
    leads: 28,
    cpl: 6.75,
    roi: 312
  },
  { 
    id: 3,
    name: "POS Demo - Middle East",
    platform: "Google",
    status: "paused",
    budget: 200,
    spent: 78,
    leads: 12,
    cpl: 6.50,
    roi: 198
  },
  { 
    id: 4,
    name: "School ERP - Kenya",
    platform: "Meta",
    status: "active",
    budget: 150,
    spent: 112,
    leads: 18,
    cpl: 6.22,
    roi: 245
  },
];

const platformStats = [
  { platform: "Google Ads", spend: 420, leads: 57, avgCpl: 7.37, color: "from-blue-500 to-cyan-500" },
  { platform: "Meta Ads", spend: 301, leads: 46, avgCpl: 6.54, color: "from-purple-500 to-pink-500" },
];

export const AdsManager = () => {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const handleCampaignAction = (campaignId: number, action: string) => {
    const actionMessages: Record<string, string> = {
      start: "Campaign started",
      pause: "Campaign paused",
      stop: "Campaign stopped",
      optimize: "AI optimization triggered"
    };
    toast.success(actionMessages[action] || "Action completed");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "stopped": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ads Manager</h1>
          <p className="text-muted-foreground">Google & Meta campaigns with AI optimization</p>
        </div>
        <Button 
          onClick={() => setShowCreateWizard(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platformStats.map((platform) => (
          <motion.div
            key={platform.platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                      <Megaphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{platform.platform}</p>
                      <p className="text-xs text-muted-foreground">Active campaigns</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <Zap className="w-3 h-3 mr-1" />
                    AI Active
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-foreground">${platform.spend}</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{platform.leads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-400">${platform.avgCpl}</p>
                    <p className="text-xs text-muted-foreground">Avg CPL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Campaign List */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    campaign.platform === "Google" 
                      ? "bg-blue-500/20 text-blue-400" 
                      : "bg-purple-500/20 text-purple-400"
                  }`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{campaign.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {campaign.platform}
                      </Badge>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">${campaign.spent}/${campaign.budget}</p>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1.5 w-20 mt-1" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{campaign.leads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-emerald-400">${campaign.cpl}</p>
                    <p className="text-xs text-muted-foreground">CPL</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-emerald-400">{campaign.roi}%</p>
                    <p className="text-xs text-muted-foreground">ROI</p>
                  </div>

                  <div className="flex items-center gap-1">
                    {campaign.status === "active" ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCampaignAction(campaign.id, "pause")}
                      >
                        <Pause className="w-4 h-4 text-amber-400" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCampaignAction(campaign.id, "start")}
                      >
                        <Play className="w-4 h-4 text-emerald-400" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCampaignAction(campaign.id, "optimize")}
                    >
                      <Zap className="w-4 h-4 text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCampaignAction(campaign.id, "stop")}
                    >
                      <Square className="w-4 h-4 text-rose-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Create Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-emerald-500/50 transition-colors"
          onClick={() => toast.info("Creative Generator - Coming soon!")}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">AI Creative Generator</p>
              <p className="text-xs text-muted-foreground">Auto-generate ad visuals</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-emerald-500/50 transition-colors"
          onClick={() => toast.info("Copy Generator - Coming soon!")}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">AI Ad Copy</p>
              <p className="text-xs text-muted-foreground">Generate compelling text</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-emerald-500/50 transition-colors"
          onClick={() => toast.info("A/B Testing - Coming soon!")}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">A/B Testing</p>
              <p className="text-xs text-muted-foreground">Auto-optimize variants</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
