import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface RegionalMarketingProps { activeView: string; }

const RegionalMarketing = ({ activeView }: RegionalMarketingProps) => {
  const queryClient = useQueryClient();
  const campaignsQuery = useQuery({
    queryKey: ["marketing-manager", "regional-campaigns", activeView],
    queryFn: marketingManagerApi.getCampaigns,
    staleTime: 20_000,
  });

  const focus = {
    continent: {
      title: "Continent Expansion",
      values: ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"],
    },
    country: {
      title: "Country Growth Grid",
      values: ["India", "United States", "United Arab Emirates", "United Kingdom", "Singapore"],
    },
    city: {
      title: "City Launch Grid",
      values: ["Bengaluru", "Dubai", "London", "Mumbai", "New York"],
    },
    language: {
      title: "Language Personalization",
      values: ["English", "Hindi", "Arabic", "Spanish", "French"],
    },
    festival: {
      title: "Festival Activation",
      values: ["Diwali", "Ramadan", "Black Friday", "Christmas", "Eid"],
    },
  }[activeView as "continent" | "country" | "city" | "language" | "festival"] || {
    title: "Regional Marketing",
    values: ["Global", "India", "United States"],
  };

  const normalizedKey = activeView === "country" ? "country" : activeView === "city" ? "city" : activeView === "language" ? "language" : activeView === "festival" ? "festival" : "region";

  const cards = useMemo(() => {
    const campaigns = campaignsQuery.data || [];

    return focus.values.map((value) => {
      const matching = campaigns.filter((campaign) => {
        const metadata = campaign.metadata || {};
        const regionValue = String(metadata[normalizedKey] || metadata.region || metadata.country || metadata.city || metadata.language || metadata.festival || "");
        return regionValue.toLowerCase() === value.toLowerCase();
      });

      return {
        name: value,
        campaigns: matching.length,
        spend: matching.reduce((sum, campaign) => sum + campaign.spent, 0),
        leads: matching.reduce((sum, campaign) => sum + campaign.leads_generated, 0),
      };
    });
  }, [campaignsQuery.data, focus.values, normalizedKey]);

  const createRegionalMutation = useMutation({
    mutationFn: (regionValue: string) => marketingManagerApi.createRegionalCampaign(
      (activeView as "continent" | "country" | "city" | "language" | "festival") || "country",
      {
        region_value: regionValue,
        budget_override: 25000,
        language_code: activeView === "language" ? regionValue.slice(0, 2).toLowerCase() : undefined,
        metadata: {
          generated_from: "marketing-control-center",
          scope: activeView,
        },
      },
    ),
    onSuccess: async (result) => {
      toast.success(`Regional campaign launched for ${result.regionalCampaign.region_value}`);
      await queryClient.invalidateQueries({ queryKey: ["marketing-manager", "regional-campaigns"] });
    },
    onError: () => {
      toast.error("Failed to launch regional campaign");
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{focus.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((region) => (
          <Card key={region.name} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-8 h-8 text-teal-400" />
                <div>
                  <h4 className="font-medium text-white">{region.name}</h4>
                  <Badge className="mt-1 bg-slate-700/60 text-slate-200">{activeView || "regional"}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Campaigns</span><p className="text-white font-semibold">{region.campaigns}</p></div>
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Spend</span><p className="text-white font-semibold">₹{region.spend.toLocaleString()}</p></div>
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Leads</span><p className="text-emerald-400 font-semibold">{region.leads}</p></div>
              </div>
              <Button className="mt-3 w-full bg-teal-600 hover:bg-teal-700" onClick={() => createRegionalMutation.mutate(region.name)}>
                Launch {region.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegionalMarketing;
