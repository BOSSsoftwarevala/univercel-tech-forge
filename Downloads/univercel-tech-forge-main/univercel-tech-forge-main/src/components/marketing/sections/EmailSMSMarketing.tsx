import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Send, Plus } from "lucide-react";
import { toast } from "sonner";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface EmailSMSMarketingProps { activeView: string; }

const EmailSMSMarketing = ({ activeView }: EmailSMSMarketingProps) => {
  const queryClient = useQueryClient();
  const analyticsQuery = useQuery({
    queryKey: ["marketing-manager", "delivery-analytics", activeView],
    queryFn: marketingManagerApi.getMarketingDeliveryAnalytics,
    staleTime: 20_000,
  });

  const channelFilter = activeView === "sms-campaigns" ? "sms" : activeView === "whatsapp-broadcast" ? "whatsapp" : "email";

  const campaigns = useMemo(() => {
    const rows = analyticsQuery.data?.analytics || [];
    return rows
      .filter((row) => activeView === "delivery-reports" || activeView === "template-manager" ? true : String(row.channel || row.type || "email") === channelFilter)
      .map((row, index) => ({
        id: String(row.id || index),
        name: String(row.template_name || row.subject || row.channel || "Campaign"),
        type: String(row.channel || row.type || channelFilter),
        sent: Number(row.sent_count || row.sent || 0),
        opened: Number(row.open_rate || row.opened || 0),
        clicked: Number(row.ctr || row.clicked || 0),
      }));
  }, [activeView, analyticsQuery.data, channelFilter]);

  const templateMutation = useMutation({
    mutationFn: () => marketingManagerApi.createTemplate({
      channel: channelFilter,
      name: `${channelFilter.toUpperCase()} Growth Template`,
      subject: `${channelFilter.toUpperCase()} campaign`,
      body: `Automated ${channelFilter} outreach from marketing control center`,
    }),
    onSuccess: async () => {
      toast.success("Template created");
      await queryClient.invalidateQueries({ queryKey: ["marketing-manager", "delivery-analytics"] });
    },
    onError: () => {
      toast.error("Failed to create template");
    },
  });

  const sendMutation = useMutation({
    mutationFn: () => marketingManagerApi.sendMarketingMessage({
      channel: channelFilter,
      recipients: ["marketing@example.com"],
      subject: `${channelFilter.toUpperCase()} launch`,
      body: `Automated ${channelFilter} message triggered from marketing manager`,
    }),
    onSuccess: async () => {
      toast.success(`${channelFilter.toUpperCase()} campaign queued`);
      await queryClient.invalidateQueries({ queryKey: ["marketing-manager", "delivery-analytics"] });
    },
    onError: () => {
      toast.error("Failed to send campaign");
    },
  });

  const handlePrimaryAction = () => {
    if (activeView === "template-manager") {
      templateMutation.mutate();
      return;
    }

    sendMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Email & SMS Marketing</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={handlePrimaryAction}><Plus className="w-4 h-4 mr-1" />{activeView === "template-manager" ? "Create Template" : "New Campaign"}</Button>
      </div>
      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {campaign.type === 'email' ? <Mail className="w-8 h-8 text-teal-400" /> : campaign.type === 'sms' ? <MessageSquare className="w-8 h-8 text-blue-400" /> : <Send className="w-8 h-8 text-emerald-400" />}
                  <div>
                    <h4 className="font-medium text-white">{campaign.name}</h4>
                    <p className="text-xs text-slate-400">{campaign.sent.toLocaleString()} sent</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-teal-500/20 text-teal-400">{campaign.type.toUpperCase()}</Badge>
                  {campaign.opened > 0 && <div className="text-center"><p className="text-sm font-bold text-white">{campaign.opened.toFixed(1)}%</p><p className="text-xs text-slate-400">Opened</p></div>}
                  <div className="text-center"><p className="text-sm font-bold text-emerald-400">{campaign.clicked.toFixed(1)}%</p><p className="text-xs text-slate-400">CTR</p></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailSMSMarketing;
