import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface InfluencerMarketingProps { activeView: string; }

const InfluencerMarketing = ({ activeView }: InfluencerMarketingProps) => {
  const queryClient = useQueryClient();
  const influencersQuery = useQuery({
    queryKey: ["marketing-manager", "influencers", activeView],
    queryFn: marketingManagerApi.getInfluencers,
    staleTime: 20_000,
  });

  const campaignsQuery = useQuery({
    queryKey: ["marketing-manager", "campaigns", "influencer-assignment"],
    queryFn: marketingManagerApi.getCampaigns,
    staleTime: 20_000,
  });

  const performanceQuery = useQuery({
    queryKey: ["marketing-manager", "influencer-performance"],
    queryFn: marketingManagerApi.getInfluencerPerformance,
    staleTime: 20_000,
  });

  const performanceMap = useMemo(() => {
    const campaigns = performanceQuery.data?.influencerCampaigns || [];
    return new Map(
      campaigns.map((item) => [
        String(item.influencer_id),
        {
          roi: Number(item.roi || 0),
          revenue: Number(item.revenue_generated || 0),
        },
      ]),
    );
  }, [performanceQuery.data]);

  const visibleInfluencers = useMemo(() => {
    const influencers = influencersQuery.data?.influencers || [];
    if (activeView === "fake") {
      return influencers.filter((item) => !!item.fraud_notes || !item.verified);
    }

    return influencers;
  }, [activeView, influencersQuery.data]);

  const primaryCampaignId = campaignsQuery.data?.[0]?.id;

  const syncMutation = useMutation({
    mutationFn: () => marketingManagerApi.syncInfluencers({ source: activeView || "manual" }),
    onSuccess: async (result) => {
      toast.success(`Synced ${result.influencers.length} influencers`);
      await queryClient.invalidateQueries({ queryKey: ["marketing-manager", "influencers"] });
    },
    onError: () => {
      toast.error("Failed to sync influencers");
    },
  });

  const assignMutation = useMutation({
    mutationFn: (influencerId: string) => marketingManagerApi.assignInfluencer({ influencer_id: influencerId, campaign_id: primaryCampaignId }),
    onSuccess: async () => {
      toast.success("Influencer assigned to campaign");
      await queryClient.invalidateQueries({ queryKey: ["marketing-manager", "influencer-performance"] });
    },
    onError: () => {
      toast.error("Failed to assign influencer");
    },
  });

  const fraudMutation = useMutation({
    mutationFn: (influencerId: string) => marketingManagerApi.fraudCheckInfluencer({ influencer_id: influencerId }),
    onSuccess: (result) => {
      toast.success(result.flagged ? `Suspicious score ${result.suspicious_score}` : "Influencer looks clean");
    },
    onError: () => {
      toast.error("Fraud check failed");
    },
  });

  const payoutMutation = useMutation({
    mutationFn: (influencerId: string) => marketingManagerApi.influencerPayout({ influencer_id: influencerId, base_amount: 25000 }),
    onSuccess: (result) => {
      toast.success(`Payout released: ₹${result.payout_amount.toLocaleString()}`);
    },
    onError: () => {
      toast.error("Payout failed");
    },
  });

  const formatFollowers = (followers: number) => {
    if (followers >= 1_000_000) return `${(followers / 1_000_000).toFixed(1)}M`;
    if (followers >= 1_000) return `${(followers / 1_000).toFixed(0)}K`;
    return String(followers);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Influencer Marketing</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => syncMutation.mutate()}>
          Sync Influencers
        </Button>
      </div>
      <div className="grid gap-4">
        {visibleInfluencers.map((influencer) => {
          const performance = performanceMap.get(influencer.id);

          return (
          <Card key={influencer.id} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-teal-400" />
                  <div>
                    <h4 className="font-medium text-white">{influencer.name}</h4>
                    <p className="text-xs text-slate-400">{influencer.platform} • {formatFollowers(influencer.followers)} • {influencer.country || "Global"}</p>
                    <p className="text-xs text-slate-500">{influencer.niche || "General"} • {influencer.verified ? "Verified" : "Unverified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={influencer.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}>{influencer.status.toUpperCase()}</Badge>
                  {influencer.fraud_notes ? <Badge className="bg-red-500/20 text-red-300">FLAGGED</Badge> : null}
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">{performance?.roi?.toFixed(0) || 0}%</p>
                    <p className="text-xs text-slate-400">ROI</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600" onClick={() => assignMutation.mutate(influencer.id)} disabled={!primaryCampaignId}>Assign</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600" onClick={() => fraudMutation.mutate(influencer.id)}>Fraud</Button>
                  <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => payoutMutation.mutate(influencer.id)}>Payout</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )})}
      </div>
    </div>
  );
};

export default InfluencerMarketing;
