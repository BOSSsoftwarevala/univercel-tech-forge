import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Globe, MessageSquare, Share2, ShoppingCart, TrendingUp } from "lucide-react";

interface LeadGenerationProps { activeView: string; }

const LeadGeneration = ({ activeView }: LeadGenerationProps) => {
  const sources = [
    { name: "Website Leads", icon: Globe, count: 567, trend: "+12%" },
    { name: "Facebook Leads", icon: Share2, count: 345, trend: "+8%" },
    { name: "Google Leads", icon: TrendingUp, count: 234, trend: "+15%" },
    { name: "WhatsApp Leads", icon: MessageSquare, count: 189, trend: "+22%" },
    { name: "Referral Leads", icon: Users, count: 145, trend: "+5%" },
    { name: "Marketplace Leads", icon: ShoppingCart, count: 98, trend: "+18%" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Lead Generation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sources.map((s, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <s.icon className="w-8 h-8 text-teal-400" />
                  <h4 className="font-medium text-white">{s.name}</h4>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">{s.trend}</Badge>
              </div>
              <p className="text-2xl font-bold text-white">{s.count}</p>
              <p className="text-xs text-slate-400">This month</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadGeneration;
