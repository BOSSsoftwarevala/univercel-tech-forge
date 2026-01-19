import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Play, Pause, Plus, Edit, BarChart3 } from "lucide-react";

interface CampaignManagementProps { activeView: string; }

const CampaignManagement = ({ activeView }: CampaignManagementProps) => {
  const campaigns = [
    { name: "Summer Sale 2024", status: "active", budget: 5000, leads: 245 },
    { name: "Product Launch", status: "active", budget: 8000, leads: 189 },
    { name: "Black Friday", status: "scheduled", budget: 15000, leads: 0 },
    { name: "Retargeting Q4", status: "paused", budget: 2500, leads: 89 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Campaign Management</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700"><Plus className="w-4 h-4 mr-1" />Create Campaign</Button>
      </div>
      <div className="grid gap-4">
        {campaigns.map((c, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="w-8 h-8 text-teal-400" />
                  <div>
                    <h4 className="font-medium text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400">Budget: ${c.budget.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : c.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}>{c.status.toUpperCase()}</Badge>
                  <span className="text-sm text-white">{c.leads} leads</span>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">{c.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}</Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="w-3 h-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignManagement;
