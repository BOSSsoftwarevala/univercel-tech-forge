import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, Target, Users, DollarSign, Eye, MousePointer, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";
import { useMarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";

interface MarketingOverviewProps {
  activeView: string;
}

const MarketingOverview = ({ activeView }: MarketingOverviewProps) => {
  const system = useMarketingManagerSystem();
  const queryClient = useQueryClient();

  const leadsTodayQuery = useQuery({
    queryKey: ["marketing-manager", "leads-today"],
    queryFn: marketingManagerApi.getLeadsToday,
    staleTime: 20_000,
  });

  const costResultQuery = useQuery({
    queryKey: ["marketing-manager", "cost-result"],
    queryFn: marketingManagerApi.getCostResult,
    staleTime: 20_000,
  });

  const conversionQuery = useQuery({
    queryKey: ["marketing-manager", "conversion-analytics"],
    queryFn: marketingManagerApi.getConversionAnalytics,
    staleTime: 20_000,
  });

  const reportMutation = useMutation({
    mutationFn: (campaignId: string) => marketingManagerApi.getCampaignPerformance(campaignId),
    onSuccess: (result) => {
      const campaign = result.campaigns[0];
      if (campaign) {
        toast.success(`${campaign.name}: ROI ${campaign.roi.toFixed(2)}%, pacing ${campaign.pacing.toFixed(2)}%`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Unable to load campaign report");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ campaignId, status }: { campaignId: string; status: string }) => marketingManagerApi.updateCampaignStatus(campaignId, status),
    onSuccess: (campaign) => {
      toast.success(`${campaign.name} moved to ${campaign.status}`);
      void queryClient.invalidateQueries({ queryKey: ["marketing-manager"] });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to change campaign status");
    },
  });

  const campaigns = useMemo(() => {
    return (system.dashboard?.campaigns || []).map((campaign) => ({
      ...campaign,
      roi: campaign.spent > 0 ? Number((((campaign.revenue - campaign.spent) / campaign.spent) * 100).toFixed(2)) : 0,
    }));
  }, [system.dashboard?.campaigns]);

  const channels = system.dashboard?.channels || [];
  const summary = system.dashboard?.summary;
  const leadsToday = leadsTodayQuery.data;
  const costResult = costResultQuery.data;
  const conversion = conversionQuery.data;

  const renderCampaignStatus = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live Campaign Status</h3>
        <Button size="sm" variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10" onClick={() => void system.dashboardQuery.refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {campaigns.slice(0, 6).map((campaign) => (
          <Card key={campaign.id} className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm text-white">{campaign.name}</CardTitle>
                <Badge className={`text-[10px] ${campaign.status === "active" ? "bg-emerald-500/20 text-emerald-400" : campaign.status === "completed" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"}`}>
                  {campaign.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Budget Usage</span>
                  <span className="text-white">₹{Math.round(campaign.spent)} / ₹{Math.round(campaign.budget)}</span>
                </div>
                <Progress value={campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0} className="h-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Leads</span>
                  <p className="text-white font-semibold">{campaign.leads_generated}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">ROI</span>
                  <p className="text-emerald-400 font-semibold">{campaign.roi}%</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-slate-600" onClick={() => reportMutation.mutate(campaign.id)}>
                  View
                </Button>
                <Button size="sm" className="flex-1 h-7 text-xs bg-teal-600 hover:bg-teal-700" onClick={() => toggleMutation.mutate({ campaignId: campaign.id, status: campaign.status === "active" ? "paused" : "active" })}>
                  {campaign.status === "active" ? "Pause" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderActiveChannels = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Active Channels</h3>
      <div className="grid gap-4">
        {channels.map((channel) => (
          <Card key={channel.channel} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white capitalize">{channel.channel.replace(/_/g, " ")}</h4>
                    <p className="text-xs text-slate-400">{channel.leads} leads • {channel.conversions} conversions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">₹{Math.round(channel.spend)}</p>
                  <p className="text-xs text-emerald-400">{channel.roi}% ROI</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">
                  {channel.activeCampaigns > 0 ? "ACTIVE" : "TRACKING"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLeadsToday = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Leads Today</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-teal-500/20 to-cyan-600/10 border-teal-500/30">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{leadsToday?.total_leads ?? summary?.leadsToday ?? 0}</p>
            <p className="text-xs text-slate-400">Total Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/20 to-green-600/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{leadsToday?.breakdown.reduce((sum, item) => sum + item.hot, 0) ?? 0}</p>
            <p className="text-xs text-slate-400">Hot Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-600/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{leadsToday?.breakdown.reduce((sum, item) => sum + item.warm, 0) ?? 0}</p>
            <p className="text-xs text-slate-400">Warm Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{conversion?.conversion ?? summary?.conversionRate ?? 0}%</p>
            <p className="text-xs text-slate-400">Conversion</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Lead Sources Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(leadsToday?.breakdown || []).map((item, idx) => (
              <div key={item.source} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${idx % 2 === 0 ? "bg-blue-500" : "bg-emerald-500"}`} />
                <span className="text-sm text-slate-300 flex-1 capitalize">{item.source}</span>
                <span className="text-sm font-medium text-white">{item.total}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCostVsResult = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Cost vs Result Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-8 h-8 text-teal-400" />
              <div>
                <p className="text-2xl font-bold text-white">₹{Math.round(costResult?.spend || summary?.adSpend || 0).toLocaleString()}</p>
                <p className="text-xs text-slate-400">Total Spend</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">ROI {costResult?.roi ?? summary?.roi ?? 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">₹{Math.round(costResult?.revenue || summary?.revenue || 0).toLocaleString()}</p>
                <p className="text-xs text-slate-400">Revenue</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Revenue linked to campaigns</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">₹{summary?.leadsToday ? ((costResult?.spend || summary.adSpend) / Math.max(summary.leadsToday, 1)).toFixed(2) : "0.00"}</p>
                <p className="text-xs text-slate-400">Cost Per Lead</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Computed from live spend / leads</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Campaign Spend vs Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(costResult?.points || []).map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-white">₹{Math.round(item.spend)} spent / ₹{Math.round(item.revenue)} revenue</span>
                </div>
                <Progress value={Math.min(100, Math.max(5, item.roi))} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConversionRate = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Conversion Rate Analysis</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{summary?.reach || 0}</p>
            <p className="text-xs text-slate-400">Impressions</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{conversion?.clicks || 0}</p>
            <p className="text-xs text-slate-400">Clicks</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{conversion?.leads || 0}</p>
            <p className="text-xs text-slate-400">Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{conversion?.conversions || 0}</p>
            <p className="text-xs text-slate-400">Conversions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Funnel Conversion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: "Click → Lead", rate: conversion?.clicks ? Number(((conversion.leads / Math.max(conversion.clicks, 1)) * 100).toFixed(2)) : 0 },
              { stage: "Lead → Customer", rate: conversion?.leads ? Number(((conversion.conversions / Math.max(conversion.leads, 1)) * 100).toFixed(2)) : 0 },
              { stage: "Click → Customer", rate: conversion?.conversion || 0 },
            ].map((item) => (
              <div key={item.stage} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm text-slate-300">{item.stage}</span>
                <span className="text-lg font-bold text-white">{item.rate}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  switch (activeView) {
    case "overview-channels":
      return renderActiveChannels();
    case "overview-leads":
      return renderLeadsToday();
    case "overview-cost":
      return renderCostVsResult();
    case "overview-conversion":
      return renderConversionRate();
    case "overview-campaigns":
    default:
      return renderCampaignStatus();
  }
};

export default MarketingOverview;
