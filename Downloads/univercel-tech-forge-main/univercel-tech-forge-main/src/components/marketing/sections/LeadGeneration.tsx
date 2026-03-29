import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, MessageSquare, Share2, ShoppingCart, TrendingUp } from "lucide-react";
import { marketingManagerApi } from "@/lib/api/marketing-manager";

interface LeadGenerationProps { activeView: string; }

const LeadGeneration = ({ activeView }: LeadGenerationProps) => {
  const source = activeView === "leads-facebook"
    ? "facebook"
    : activeView === "leads-google"
    ? "google"
    : activeView === "leads-whatsapp"
    ? "whatsapp"
    : activeView === "leads-referral"
    ? "referral"
    : activeView === "leads-marketplace"
    ? "marketplace"
    : "website";

  const leadSourceQuery = useQuery({
    queryKey: ["marketing-manager", "lead-source", source],
    queryFn: () => marketingManagerApi.getLeadSource(source),
    staleTime: 20_000,
  });

  const sources = [
    { key: "website", name: "Website Leads", icon: Globe },
    { key: "facebook", name: "Facebook Leads", icon: Share2 },
    { key: "google", name: "Google Leads", icon: TrendingUp },
    { key: "whatsapp", name: "WhatsApp Leads", icon: MessageSquare },
    { key: "referral", name: "Referral Leads", icon: Users },
    { key: "marketplace", name: "Marketplace Leads", icon: ShoppingCart },
  ];

  const activeLeads = leadSourceQuery.data?.leads || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Lead Generation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sources.map((s) => (
          <Card key={s.key} className={`bg-slate-800/50 border-slate-700/50 ${s.key === source ? "ring-1 ring-teal-500/40" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <s.icon className="w-8 h-8 text-teal-400" />
                  <h4 className="font-medium text-white">{s.name}</h4>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">{s.key === source ? "LIVE" : "TRACKED"}</Badge>
              </div>
              <p className="text-2xl font-bold text-white">{s.key === source ? leadSourceQuery.data?.total || 0 : "--"}</p>
              <p className="text-xs text-slate-400">Attributed source volume</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white capitalize">{source} lead feed</h4>
            <Badge className="bg-blue-500/20 text-blue-400">{activeLeads.length} records</Badge>
          </div>
          {activeLeads.slice(0, 6).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3 text-sm">
              <div>
                <p className="text-white">{entry.lead?.name || entry.lead_id}</p>
                <p className="text-xs text-slate-400">{entry.lead?.city || "Unknown city"}, {entry.lead?.country || "Unknown country"}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-semibold uppercase">{entry.score_label}</p>
                <p className="text-xs text-slate-400">Score {entry.score_value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadGeneration;
