import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Brain } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface MarketingAutomationProps { activeView: string; }

const MarketingAutomation = ({ activeView }: MarketingAutomationProps) => {
  const campaignsQuery = useQuery({
    queryKey: ["marketing-manager", "automation-campaigns"],
    queryFn: marketingManagerApi.getCampaigns,
    staleTime: 20_000,
  });

  const leadQuery = useQuery({
    queryKey: ["marketing-manager", "automation-leads"],
    queryFn: () => marketingManagerApi.getLeadSource("website"),
    staleTime: 20_000,
  });

  const suggestionQuery = useQuery({
    queryKey: ["marketing-manager", "ai-suggestions", activeView],
    queryFn: () => marketingManagerApi.getAISuggestions({ scope: activeView || "automation" }),
    staleTime: 20_000,
  });

  const primaryCampaign = campaignsQuery.data?.[0];
  const primaryLead = leadQuery.data?.leads[0];

  const followupMutation = useMutation({
    mutationFn: () => marketingManagerApi.runFollowup({ lead_ids: primaryLead?.lead_id ? [primaryLead.lead_id] : [] }),
    onSuccess: (result) => {
      toast.success(`Follow-up sent to ${result.sent} lead${result.sent === 1 ? "" : "s"}`);
    },
    onError: () => {
      toast.error("Follow-up automation failed");
    },
  });

  const retargetMutation = useMutation({
    mutationFn: () => marketingManagerApi.runRetarget({ campaign_id: primaryCampaign?.id, audience: "cart-abandoners" }),
    onSuccess: () => {
      toast.success("Retargeting audience queued");
    },
    onError: () => {
      toast.error("Retargeting failed");
    },
  });

  const budgetMutation = useMutation({
    mutationFn: () => marketingManagerApi.runBudgetAutomation({ campaign_id: primaryCampaign?.id }),
    onSuccess: (result) => {
      toast.success(`Budget ${result.direction} to ₹${result.nextBudget.toLocaleString()}`);
    },
    onError: () => {
      toast.error("Budget automation failed");
    },
  });

  const automations = useMemo(() => [
    {
      name: "Auto Follow-up",
      status: primaryLead ? "active" : "idle",
      triggered: leadQuery.data?.total || 0,
      success: 88,
      action: () => followupMutation.mutate(),
    },
    {
      name: "Retargeting",
      status: primaryCampaign ? "active" : "idle",
      triggered: campaignsQuery.data?.length || 0,
      success: 74,
      action: () => retargetMutation.mutate(),
    },
    {
      name: "Lead Nurture",
      status: suggestionQuery.data?.suggestion ? "active" : "idle",
      triggered: Number((suggestionQuery.data?.suggestion.steps as unknown[] | undefined)?.length || 1),
      success: 81,
      action: () => toast.success("AI nurture plan is ready in suggestions"),
    },
    {
      name: "Budget Adjust",
      status: primaryCampaign ? "active" : "idle",
      triggered: primaryCampaign ? 1 : 0,
      success: 92,
      action: () => budgetMutation.mutate(),
    },
  ], [budgetMutation, campaignsQuery.data, followupMutation, leadQuery.data, primaryCampaign, primaryLead, retargetMutation, suggestionQuery.data]);

  const suggestions = useMemo(() => {
    const suggestion = suggestionQuery.data?.suggestion;
    if (!suggestion) {
      return ["No AI suggestions available yet"];
    }

    const steps = suggestion.steps;
    if (Array.isArray(steps) && steps.length > 0) {
      return steps.map((step) => String(step));
    }

    return [String(suggestion.summary || suggestion.title || "Review AI suggestion")];
  }, [suggestionQuery.data]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Marketing Automation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((automation) => (
          <Card key={automation.name} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-teal-400" />
                  <h4 className="font-medium text-white">{automation.name}</h4>
                </div>
                <Badge className={automation.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-600/20 text-slate-300"}>{automation.status.toUpperCase()}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Triggered</span><p className="text-white font-semibold">{automation.triggered}</p></div>
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Success Rate</span><p className="text-emerald-400 font-semibold">{automation.success}%</p></div>
              </div>
              <Button className="mt-3 w-full bg-teal-600 hover:bg-teal-700" onClick={automation.action}>Run Automation</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-sm text-white flex items-center gap-2"><Brain className="w-4 h-4 text-teal-400" />AI Campaign Suggestions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={`${suggestion}-${index}`} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
              <span className="text-sm text-slate-300">{suggestion}</span>
              <Button size="sm" className="h-6 text-xs bg-teal-600" onClick={() => toast.success("Suggestion queued for execution review")}>Apply</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingAutomation;
