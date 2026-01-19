import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin } from "lucide-react";

interface RegionalMarketingProps { activeView: string; }

const RegionalMarketing = ({ activeView }: RegionalMarketingProps) => {
  const regions = [
    { name: "North America", campaigns: 12, spend: 45000, leads: 2340 },
    { name: "Europe", campaigns: 8, spend: 32000, leads: 1890 },
    { name: "Asia Pacific", campaigns: 15, spend: 28000, leads: 3450 },
    { name: "Latin America", campaigns: 5, spend: 12000, leads: 890 },
    { name: "Middle East", campaigns: 4, spend: 8000, leads: 456 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Regional Marketing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {regions.map((r, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-8 h-8 text-teal-400" />
                <h4 className="font-medium text-white">{r.name}</h4>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Campaigns</span><p className="text-white font-semibold">{r.campaigns}</p></div>
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Spend</span><p className="text-white font-semibold">${(r.spend/1000).toFixed(0)}K</p></div>
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Leads</span><p className="text-emerald-400 font-semibold">{r.leads}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegionalMarketing;
