import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Globe, Users, Brain, Target } from "lucide-react";

interface LeadRoutingScoringProps { activeView: string; }

const LeadRoutingScoring = ({ activeView }: LeadRoutingScoringProps) => {
  const routes = [
    { type: "Country-based", active: 24, processed: 1245 },
    { type: "Franchise", active: 12, processed: 567 },
    { type: "Reseller", active: 8, processed: 234 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Lead Routing & Scoring</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((r, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="w-6 h-6 text-teal-400" />
                <h4 className="font-medium text-white">{r.type} Routing</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Active Rules</span>
                  <p className="text-white font-semibold">{r.active}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Processed</span>
                  <p className="text-emerald-400 font-semibold">{r.processed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-sm text-white flex items-center gap-2"><Brain className="w-4 h-4 text-teal-400" />AI Lead Scoring</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-emerald-500/10 rounded p-3"><p className="text-xl font-bold text-emerald-400">456</p><p className="text-xs text-slate-400">Hot Leads</p></div>
            <div className="bg-orange-500/10 rounded p-3"><p className="text-xl font-bold text-orange-400">234</p><p className="text-xs text-slate-400">Warm Leads</p></div>
            <div className="bg-slate-500/10 rounded p-3"><p className="text-xl font-bold text-slate-400">189</p><p className="text-xs text-slate-400">Cold Leads</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadRoutingScoring;
