import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Lock, Download, Clock } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface LogsComplianceProps { activeView: string; }

const LogsCompliance = ({ activeView }: LogsComplianceProps) => {
  const logsQuery = useQuery({
    queryKey: ["marketing-manager", "logs", activeView],
    queryFn: marketingManagerApi.getMarketingLogs,
    staleTime: 20_000,
  });

  const complianceQuery = useQuery({
    queryKey: ["marketing-manager", "compliance", activeView],
    queryFn: marketingManagerApi.getComplianceCheck,
    staleTime: 20_000,
  });

  const privacyQuery = useQuery({
    queryKey: ["marketing-manager", "privacy-logs", activeView],
    queryFn: marketingManagerApi.getPrivacyLogs,
    staleTime: 20_000,
  });

  const exportMutation = useMutation({
    mutationFn: () => marketingManagerApi.exportAnalytics({ format: "csv", scope: "logs" }),
    onSuccess: (result) => {
      toast.success(`Log export ready with ${result.rows} rows`);
    },
    onError: () => {
      toast.error("Failed to export logs");
    },
  });

  const compliance = complianceQuery.data || { status: "unknown", checks: [] };
  const privacyLogs = privacyQuery.data?.privacy_logs || [];
  const activityLogs = logsQuery.data?.logs || [];

  const visibleLogs = useMemo(() => {
    if (activeView === "privacy") {
      return privacyLogs.map((entry) => ({
        id: String(entry.id),
        action: String(entry.action || "Privacy event"),
        user: String(entry.masked_actor || "masked"),
        time: String(entry.created_at || ""),
        ip: String(entry.masked_target || "hidden"),
      }));
    }

    return activityLogs.map((entry, index) => ({
      id: String(entry.id || index),
      action: String(entry.action || "Marketing activity"),
      user: activeView === "masked" ? `MKT-${String(entry.actor_id || "USER").slice(0, 4)}` : String(entry.actor_id || "system"),
      time: String(entry.created_at || ""),
      ip: activeView === "masked" ? "masked" : String(entry.metadata?.ip || "internal"),
    }));
  }, [activeView, activityLogs, privacyLogs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Logs & Compliance</h3>
        <Button size="sm" variant="outline" className="border-teal-500/30 text-teal-400" onClick={() => exportMutation.mutate()}><Download className="w-4 h-4 mr-1" />Export Logs</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30"><CardContent className="p-4 text-center"><Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">{compliance.status === "pass" ? "100%" : "At Risk"}</p><p className="text-xs text-slate-400">Compliance Score</p></CardContent></Card>
        <Card className="bg-blue-500/10 border-blue-500/30"><CardContent className="p-4 text-center"><FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">{visibleLogs.length}</p><p className="text-xs text-slate-400">Audit Logs</p></CardContent></Card>
        <Card className="bg-purple-500/10 border-purple-500/30"><CardContent className="p-4 text-center"><Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">{activeView === "masked" ? "Masked" : "Active"}</p><p className="text-xs text-slate-400">Data Masking</p></CardContent></Card>
      </div>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-sm text-white">Recent Activity</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {visibleLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded text-xs">
              <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-slate-500" /><span className="text-white">{log.action}</span></div>
              <div className="flex items-center gap-3"><Badge className="bg-slate-500/20 text-slate-400">{log.user}</Badge><span className="text-slate-500">{log.ip}</span><span className="text-slate-500">{log.time}</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsCompliance;
