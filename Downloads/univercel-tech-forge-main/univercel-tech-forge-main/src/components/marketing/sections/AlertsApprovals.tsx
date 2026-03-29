import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";
import { useMarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";

interface AlertsApprovalsProps { activeView: string; }

const AlertsApprovals = ({ activeView }: AlertsApprovalsProps) => {
  const system = useMarketingManagerSystem();
  const dashboard = system.dashboard;

  const alerts = useMemo(() => {
    const items = dashboard?.alerts || [];
    if (activeView === "budget") {
      return items.filter((alert) => String(alert.type || "").includes("budget"));
    }
    if (activeView === "performance") {
      return items.filter((alert) => String(alert.type || "").includes("performance"));
    }
    return items;
  }, [activeView, dashboard?.alerts]);

  const approvals = useMemo(() => {
    const items = dashboard?.approvals || [];
    if (activeView === "ai") {
      return items.filter((approval) => String(approval.approval_type || "") === "ai_change");
    }
    return items;
  }, [activeView, dashboard?.approvals]);

  const budgetAlertMutation = useMutation({
    mutationFn: () => marketingManagerApi.createBudgetAlert({ campaign_id: dashboard?.campaigns[0]?.id, threshold_percent: 90 }),
    onSuccess: async () => {
      toast.success("Budget alert created");
      await system.dashboardQuery.refetch();
    },
    onError: () => toast.error("Failed to create budget alert"),
  });

  const performanceAlertMutation = useMutation({
    mutationFn: () => marketingManagerApi.createPerformanceAlert({ campaign_id: dashboard?.campaigns[0]?.id, metric: "ctr", threshold_value: 1.5 }),
    onSuccess: async () => {
      toast.success("Performance alert created");
      await system.dashboardQuery.refetch();
    },
    onError: () => toast.error("Failed to create performance alert"),
  });

  const aiReviewMutation = useMutation({
    mutationFn: () => marketingManagerApi.createPerformanceAlert({ campaign_id: dashboard?.campaigns[0]?.id, metric: "ai_health_score", threshold_value: 60 }),
    onSuccess: async () => {
      toast.success("AI review alert created");
      await system.dashboardQuery.refetch();
    },
    onError: () => toast.error("Failed to create AI review alert"),
  });

  const approvalMutation = useMutation({
    mutationFn: (campaignId: string) => marketingManagerApi.updateCampaign({ campaign_id: campaignId, approval_status: "approved" }),
    onSuccess: async (campaign) => {
      toast.success(`Approved ${campaign.name}`);
      await system.dashboardQuery.refetch();
    },
    onError: () => toast.error("Failed to approve campaign"),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Alerts & Approvals</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-200" onClick={() => budgetAlertMutation.mutate()}>
            Budget Alert
          </Button>
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-200" onClick={() => performanceAlertMutation.mutate()}>
            Performance Alert
          </Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => aiReviewMutation.mutate()}>
            AI Review
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {alerts.map((alert, index) => (
          <Card key={String(alert.id || index)} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-8 h-8 ${String(alert.severity) === "high" ? "text-red-400" : String(alert.severity) === "medium" ? "text-orange-400" : "text-blue-400"}`} />
                  <div>
                    <h4 className="font-medium text-white">{String(alert.type || "Alert")}</h4>
                    <p className="text-xs text-slate-400">{String(alert.message || "No details")}</p>
                  </div>
                </div>
                <Badge className={String(alert.severity) === "high" ? "bg-red-500/20 text-red-400" : String(alert.severity) === "medium" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}>
                  {String(alert.severity || "low").toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {approvals.map((approval, index) => (
          <Card key={String(approval.id || index)} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{String(approval.approval_type || "approval").toUpperCase()} approval</h4>
                  <p className="text-xs text-slate-400">Status: {String(approval.status || "pending")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={String(approval.status) === "approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-300"}>
                    {String(approval.status || "pending").toUpperCase()}
                  </Badge>
                  {String(approval.status || "pending") !== "approved" && approval.campaign_id ? (
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => approvalMutation.mutate(String(approval.campaign_id))}>
                      Approve
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertsApprovals;
