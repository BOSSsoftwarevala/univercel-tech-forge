import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, DollarSign, TrendingUp, Play, Pause, Settings, MousePointer, Users } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface PaidAdsManagerProps {
  activeView: string;
}

const PaidAdsManager = ({ activeView }: PaidAdsManagerProps) => {
  const queryClient = useQueryClient();
  const platform = activeView === "ads-meta" ? "meta" : activeView === "ads-youtube" ? "youtube" : activeView === "ads-display" ? "display" : "google";

  const adsQuery = useQuery({
    queryKey: ["marketing-manager", "ads-platform", platform],
    queryFn: () => marketingManagerApi.getAdsPlatform(platform),
    staleTime: 20_000,
    enabled: ["ads-google", "ads-meta", "ads-youtube", "ads-display"].includes(activeView),
  });

  const performanceQuery = useQuery({
    queryKey: ["marketing-manager", "campaign-performance", "ads"],
    queryFn: () => marketingManagerApi.getCampaignPerformance(),
    staleTime: 20_000,
  });

  const costQuery = useQuery({
    queryKey: ["marketing-manager", "ads-cost-result"],
    queryFn: marketingManagerApi.getCostResult,
    staleTime: 20_000,
    enabled: activeView === "ads-roi",
  });

  const createMutation = useMutation({
    mutationFn: () => marketingManagerApi.createCampaign({
      name: `${platform.toUpperCase()} Demand ${new Date().toLocaleDateString()}`,
      channel: `${platform}_ads`,
      platform: `${platform}_ads`,
      budget: 18000,
      objective: "lead_generation",
      channels: [`${platform}_ads`],
      targetAudience: { source: "paid_ads", market: "high intent" },
      niche: "growth",
      cta: "Start campaign",
    }),
    onSuccess: () => {
      toast.success(`${platform.toUpperCase()} campaign created`);
      void queryClient.invalidateQueries({ queryKey: ["marketing-manager"] });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to create campaign");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ campaignId, status }: { campaignId: string; status: string }) => marketingManagerApi.updateCampaignStatus(campaignId, status),
    onSuccess: (campaign) => {
      toast.success(`${campaign.name} is now ${campaign.status}`);
      void queryClient.invalidateQueries({ queryKey: ["marketing-manager"] });
    },
  });

  const budgetMutation = useMutation({
    mutationFn: (campaignId: string) => marketingManagerApi.budgetControl(campaignId),
    onSuccess: (result) => {
      toast.success(`Budget updated to ₹${Math.round(result.nextBudget).toLocaleString()} (${result.direction})`);
      void queryClient.invalidateQueries({ queryKey: ["marketing-manager"] });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to adjust budget");
    },
  });

  const campaigns = adsQuery.data?.campaigns || [];
  const summary = adsQuery.data?.summary;
  const allCampaigns = performanceQuery.data?.campaigns || [];

  const renderPlatformAds = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white capitalize">{platform} Ads</h3>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => createMutation.mutate()}>
          <Target className="w-4 h-4 mr-1" />
          New Campaign
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">₹{Math.round(summary?.spend || 0).toLocaleString()}</p>
            <p className="text-xs text-slate-400">Total Spend</p>
          </CardContent>
        </Card>
        <Card className="bg-teal-500/10 border-teal-500/30">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-6 h-6 text-teal-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{summary?.clicks || 0}</p>
            <p className="text-xs text-slate-400">Total Clicks</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{summary?.conversions || 0}</p>
            <p className="text-xs text-slate-400">Conversions</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4">
        {campaigns.map((ad) => (
          <Card key={ad.id} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{ad.name}</h4>
                    <p className="text-xs text-slate-400">₹{Math.round(ad.spent)} / ₹{Math.round(ad.budget)} spent</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={ad.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}>
                    {ad.status.toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toggleMutation.mutate({ campaignId: ad.id, status: ad.status === 'active' ? 'paused' : 'active' })}>
                    {ad.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => budgetMutation.mutate(ad.id)}>
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <Progress value={(ad.spent / ad.budget) * 100} className="h-1.5 mb-3" />
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Clicks</span>
                  <p className="text-white font-semibold">{ad.clicks.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Conversions</span>
                  <p className="text-emerald-400 font-semibold">{ad.conversions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBudgetControl = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Budget Control</h3>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Campaign Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allCampaigns.map((campaign) => (
            <div key={campaign.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-white">{campaign.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">₹{Math.round(campaign.spent)} / ₹{Math.round(campaign.budget)}</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600" onClick={() => budgetMutation.mutate(campaign.id)}>Auto Adjust</Button>
                </div>
              </div>
              <Progress value={campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderROITracking = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">ROI Tracking</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-green-600/10 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white">{costQuery.data?.roi || 0}%</p>
            <p className="text-sm text-slate-400">Overall ROI</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-white">ROI by Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(costQuery.data?.points || []).map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-sm text-white">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-400">{item.roi}%</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">LIVE</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  switch (activeView) {
    case "ads-google":
      return renderPlatformAds();
    case "ads-meta":
      return renderPlatformAds();
    case "ads-youtube":
      return renderPlatformAds();
    case "ads-display":
      return renderPlatformAds();
    case "ads-budget":
      return renderBudgetControl();
    case "ads-roi":
      return renderROITracking();
    default:
      return renderPlatformAds();
  }
};

export default PaidAdsManager;
