import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

interface InfluencerMarketingProps { activeView: string; }

const InfluencerMarketing = ({ activeView }: InfluencerMarketingProps) => {
  const influencers = [
    { name: "John Smith", platform: "YouTube", followers: "1.2M", roi: 340, status: "active" },
    { name: "Sarah Jones", platform: "Instagram", followers: "890K", roi: 280, status: "active" },
    { name: "Mike Chen", platform: "TikTok", followers: "2.1M", roi: 420, status: "pending" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Influencer Marketing</h3>
      <div className="grid gap-4">
        {influencers.map((i, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-teal-400" />
                  <div>
                    <h4 className="font-medium text-white">{i.name}</h4>
                    <p className="text-xs text-slate-400">{i.platform} • {i.followers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={i.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}>{i.status.toUpperCase()}</Badge>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">{i.roi}%</p>
                    <p className="text-xs text-slate-400">ROI</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InfluencerMarketing;
