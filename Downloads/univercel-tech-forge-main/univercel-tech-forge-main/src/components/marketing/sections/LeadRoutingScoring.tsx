import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Brain } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface LeadRoutingScoringProps { activeView: string; }

const LeadRoutingScoring = ({ activeView }: LeadRoutingScoringProps) => {
  const queryClient = useQueryClient();
  const websiteLeadQuery = useQuery({
    queryKey: ["marketing-manager", "routing-candidate"],
    queryFn: () => marketingManagerApi.getLeadSource("website"),
    staleTime: 20_000,
  });

  const leadStatsQuery = useQuery({
    queryKey: ["marketing-manager", "leads-today", "routing"],
    queryFn: marketingManagerApi.getLeadsToday,
    staleTime: 20_000,
  });

  const candidate = websiteLeadQuery.data?.leads[0];

  const withRefresh = {
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["marketing-manager"] });
      void websiteLeadQuery.refetch();
    },
  };

  const countryMutation = useMutation({
    mutationFn: () => marketingManagerApi.routeByCountry({ lead_id: candidate?.lead_id, country_code: candidate?.lead?.country || "IN" }),
    ...withRefresh,
    onSuccess: () => {
      toast.success("Country routing applied");
      withRefresh.onSuccess?.();
    },
  });

  const franchiseMutation = useMutation({
    mutationFn: () => marketingManagerApi.routeToFranchise({ lead_id: candidate?.lead_id, city: candidate?.lead?.city, country: candidate?.lead?.country }),
    ...withRefresh,
    onSuccess: () => {
      toast.success("Franchise routing applied");
      withRefresh.onSuccess?.();
    },
  });

  const resellerMutation = useMutation({
    mutationFn: () => marketingManagerApi.routeToReseller({ lead_id: candidate?.lead_id, city: candidate?.lead?.city, country: candidate?.lead?.country }),
    ...withRefresh,
    onSuccess: () => {
      toast.success("Reseller routing applied");
      withRefresh.onSuccess?.();
    },
  });

  const scoreMutation = useMutation({
    mutationFn: () => marketingManagerApi.scoreLead({ lead_id: candidate?.lead_id, source: candidate?.source_channel, behavior_score: 72 }),
    ...withRefresh,
    onSuccess: (result) => {
      toast.success(`Lead scored ${result.label.toUpperCase()} (${result.score})`);
      withRefresh.onSuccess?.();
    },
  });

  const priorityMutation = useMutation({
    mutationFn: () => marketingManagerApi.assignLeadPriority({ lead_id: candidate?.lead_id }),
    ...withRefresh,
    onSuccess: (result) => {
      toast.success(`Priority queue: ${result.queue}`);
      withRefresh.onSuccess?.();
    },
  });

  const routes = [
    { type: "Country-based", processed: leadStatsQuery.data?.total_leads || 0, action: () => countryMutation.mutate() },
    { type: "Franchise", processed: websiteLeadQuery.data?.total || 0, action: () => franchiseMutation.mutate() },
    { type: "Reseller", processed: websiteLeadQuery.data?.total || 0, action: () => resellerMutation.mutate() },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Lead Routing & Scoring</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((r) => (
          <Card key={r.type} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="w-6 h-6 text-teal-400" />
                <h4 className="font-medium text-white">{r.type} Routing</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Candidate</span>
                  <p className="text-white font-semibold">{candidate?.lead?.name || "No lead"}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Processed</span>
                  <p className="text-emerald-400 font-semibold">{r.processed}</p>
                </div>
              </div>
              <Button size="sm" className="mt-3 w-full bg-teal-600 hover:bg-teal-700" onClick={r.action} disabled={!candidate?.lead_id}>
                Run {r.type}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-sm text-white flex items-center gap-2"><Brain className="w-4 h-4 text-teal-400" />AI Lead Scoring</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-emerald-500/10 rounded p-3"><p className="text-xl font-bold text-emerald-400">{leadStatsQuery.data?.breakdown.reduce((sum, item) => sum + item.hot, 0) || 0}</p><p className="text-xs text-slate-400">Hot Leads</p></div>
            <div className="bg-orange-500/10 rounded p-3"><p className="text-xl font-bold text-orange-400">{leadStatsQuery.data?.breakdown.reduce((sum, item) => sum + item.warm, 0) || 0}</p><p className="text-xs text-slate-400">Warm Leads</p></div>
            <div className="bg-slate-500/10 rounded p-3"><p className="text-xl font-bold text-slate-400">{leadStatsQuery.data?.breakdown.reduce((sum, item) => sum + item.cold, 0) || 0}</p><p className="text-xs text-slate-400">Cold Leads</p></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => scoreMutation.mutate()} disabled={!candidate?.lead_id}>Score Lead</Button>
            <Button variant="outline" className="border-slate-600 text-slate-200" onClick={() => priorityMutation.mutate()} disabled={!candidate?.lead_id}>Assign Priority</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadRoutingScoring;
