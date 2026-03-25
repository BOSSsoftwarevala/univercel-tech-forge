import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, MousePointer, Users, Target } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface AnalyticsReportsProps { activeView: string; }

const AnalyticsReports = ({ activeView }: AnalyticsReportsProps) => {
  const trafficQuery = useQuery({
    queryKey: ["marketing-manager", "analytics", "traffic"],
    queryFn: marketingManagerApi.getTrafficAnalytics,
    staleTime: 20_000,
  });

  const funnelQuery = useQuery({
    queryKey: ["marketing-manager", "analytics", "funnel"],
    queryFn: marketingManagerApi.getFunnelAnalytics,
    staleTime: 20_000,
  });

  const channelQuery = useQuery({
    queryKey: ["marketing-manager", "analytics", "channel"],
    queryFn: marketingManagerApi.getChannelComparison,
    staleTime: 20_000,
  });

  const exportMutation = useMutation({
    mutationFn: () => marketingManagerApi.exportAnalytics({ format: activeView === "export" ? "csv" : "json" }),
    onSuccess: (result) => {
      toast.success(`Analytics export ready with ${result.rows} rows`);
    },
    onError: () => {
      toast.error("Failed to export analytics");
    },
  });

  const trafficEvents = trafficQuery.data?.events || [];
  const funnel = funnelQuery.data?.funnel || {};
  const channels = channelQuery.data?.channels || [];

  const totalTraffic = trafficEvents.reduce((sum, event) => sum + Number(event.sessions || event.visitors || 0), 0);
  const totalClicks = trafficEvents.reduce((sum, event) => sum + Number(event.clicks || 0), 0);
  const totalLeads = channels.reduce((sum, channel) => sum + Number(channel.leads || 0), 0);
  const conversionRate = totalTraffic > 0 ? (totalLeads / totalTraffic) * 100 : Number(funnel.conversion_rate || 0);

  const visibleChannels = useMemo(() => {
    if (activeView === "channel") {
      return channels;
    }

    return channels.slice(0, 5);
  }, [activeView, channels]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Analytics & Reports</h3>
        <Button size="sm" variant="outline" className="border-teal-500/30 text-teal-400" onClick={() => exportMutation.mutate()}><Download className="w-4 h-4 mr-1" />Export</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><Eye className="w-6 h-6 text-blue-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">{totalTraffic.toLocaleString()}</p><p className="text-xs text-slate-400">Traffic</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><MousePointer className="w-6 h-6 text-teal-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">{totalClicks.toLocaleString()}</p><p className="text-xs text-slate-400">Clicks</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><Users className="w-6 h-6 text-emerald-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">{totalLeads.toLocaleString()}</p><p className="text-xs text-slate-400">Leads</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><Target className="w-6 h-6 text-purple-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">{conversionRate.toFixed(2)}%</p><p className="text-xs text-slate-400">Conv. Rate</p></CardContent></Card>
      </div>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-sm text-white">Channel Comparison</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {visibleChannels.map((channel, index) => {
            const leads = Number(channel.leads || 0);
            const spend = Number(channel.spend || 0);
            const cpl = leads > 0 ? spend / leads : 0;

            return (
            <div key={`${channel.channel || index}`} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
              <span className="text-sm text-white">{String(channel.channel || "Unknown")}</span>
              <div className="flex gap-4"><span className="text-sm text-slate-400">{leads} leads</span><span className="text-sm text-emerald-400">₹{cpl.toFixed(2)} CPL</span></div>
            </div>
          )})}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsReports;
