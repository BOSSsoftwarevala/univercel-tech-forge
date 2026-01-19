import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Download, Eye, MousePointer, Users, Target } from "lucide-react";

interface AnalyticsReportsProps { activeView: string; }

const AnalyticsReports = ({ activeView }: AnalyticsReportsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Analytics & Reports</h3>
        <Button size="sm" variant="outline" className="border-teal-500/30 text-teal-400"><Download className="w-4 h-4 mr-1" />Export</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><Eye className="w-6 h-6 text-blue-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">2.4M</p><p className="text-xs text-slate-400">Traffic</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><MousePointer className="w-6 h-6 text-teal-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">89K</p><p className="text-xs text-slate-400">Clicks</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><Users className="w-6 h-6 text-emerald-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">4.5K</p><p className="text-xs text-slate-400">Leads</p></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700/50"><CardContent className="p-4 text-center"><Target className="w-6 h-6 text-purple-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">3.2%</p><p className="text-xs text-slate-400">Conv. Rate</p></CardContent></Card>
      </div>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-sm text-white">Channel Comparison</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[{ ch: "Google Ads", leads: 1245, cost: 8500 }, { ch: "Meta Ads", leads: 890, cost: 5200 }, { ch: "SEO", leads: 1567, cost: 0 }, { ch: "Email", leads: 456, cost: 200 }].map((c, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
              <span className="text-sm text-white">{c.ch}</span>
              <div className="flex gap-4"><span className="text-sm text-slate-400">{c.leads} leads</span><span className="text-sm text-emerald-400">${c.cost > 0 ? (c.cost / c.leads).toFixed(2) : '0'} CPL</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsReports;
