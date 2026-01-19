import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Eye, Lock, Download, Clock } from "lucide-react";

interface LogsComplianceProps { activeView: string; }

const LogsCompliance = ({ activeView }: LogsComplianceProps) => {
  const logs = [
    { action: "Campaign Created", user: "MKT-A1B2", time: "2 hours ago", ip: "192.168.1.***" },
    { action: "Budget Updated", user: "MKT-C3D4", time: "5 hours ago", ip: "192.168.2.***" },
    { action: "Report Exported", user: "MKT-E5F6", time: "1 day ago", ip: "192.168.3.***" },
    { action: "Lead Data Accessed", user: "MKT-G7H8", time: "2 days ago", ip: "192.168.4.***" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Logs & Compliance</h3>
        <Button size="sm" variant="outline" className="border-teal-500/30 text-teal-400"><Download className="w-4 h-4 mr-1" />Export Logs</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30"><CardContent className="p-4 text-center"><Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">100%</p><p className="text-xs text-slate-400">Compliance Score</p></CardContent></Card>
        <Card className="bg-blue-500/10 border-blue-500/30"><CardContent className="p-4 text-center"><FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">1,245</p><p className="text-xs text-slate-400">Audit Logs</p></CardContent></Card>
        <Card className="bg-purple-500/10 border-purple-500/30"><CardContent className="p-4 text-center"><Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" /><p className="text-xl font-bold text-white">Active</p><p className="text-xs text-slate-400">Data Masking</p></CardContent></Card>
      </div>
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader><CardTitle className="text-sm text-white">Recent Activity</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {logs.map((l, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded text-xs">
              <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-slate-500" /><span className="text-white">{l.action}</span></div>
              <div className="flex items-center gap-3"><Badge className="bg-slate-500/20 text-slate-400">{l.user}</Badge><span className="text-slate-500">{l.ip}</span><span className="text-slate-500">{l.time}</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsCompliance;
