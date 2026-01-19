import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, RefreshCw, Brain, DollarSign, CheckCircle } from "lucide-react";

interface MarketingAutomationProps { activeView: string; }

const MarketingAutomation = ({ activeView }: MarketingAutomationProps) => {
  const automations = [
    { name: "Auto Follow-up", status: "active", triggered: 1245, success: 89 },
    { name: "Retargeting", status: "active", triggered: 567, success: 72 },
    { name: "Lead Nurture", status: "active", triggered: 890, success: 85 },
    { name: "Budget Adjust", status: "active", triggered: 23, success: 95 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Marketing Automation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((a, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-teal-400" />
                  <h4 className="font-medium text-white">{a.name}</h4>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">ACTIVE</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Triggered</span><p className="text-white font-semibold">{a.triggered}</p></div>
                <div className="bg-slate-900/50 rounded p-2"><span className="text-slate-400">Success Rate</span><p className="text-emerald-400 font-semibold">{a.success}%</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-sm text-white flex items-center gap-2"><Brain className="w-4 h-4 text-teal-400" />AI Campaign Suggestions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {["Increase Google Ads budget by 15% for high-performing keywords", "Create retargeting campaign for cart abandoners", "A/B test new landing page design"].map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
              <span className="text-sm text-slate-300">{s}</span>
              <Button size="sm" className="h-6 text-xs bg-teal-600">Apply</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingAutomation;
