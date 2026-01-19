import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

interface AlertsApprovalsProps { activeView: string; }

const AlertsApprovals = ({ activeView }: AlertsApprovalsProps) => {
  const alerts = [
    { type: "Budget Exceed", message: "Google Ads campaign exceeded 90% budget", severity: "high", time: "2 hours ago" },
    { type: "Low Performance", message: "Meta Ads CTR dropped below threshold", severity: "medium", time: "5 hours ago" },
    { type: "Campaign Approval", message: "New campaign pending approval", severity: "low", time: "1 day ago" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Alerts & Approvals</h3>
      <div className="grid gap-4">
        {alerts.map((a, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-8 h-8 ${a.severity === 'high' ? 'text-red-400' : a.severity === 'medium' ? 'text-orange-400' : 'text-blue-400'}`} />
                  <div>
                    <h4 className="font-medium text-white">{a.type}</h4>
                    <p className="text-xs text-slate-400">{a.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{a.time}</span>
                  <Badge className={a.severity === 'high' ? 'bg-red-500/20 text-red-400' : a.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}>{a.severity.toUpperCase()}</Badge>
                  <Button size="sm" className="h-7 text-xs bg-teal-600">Resolve</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertsApprovals;
