import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, Shield, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  is_resolved: boolean;
  created_at: string;
  message?: string;
}

const severityStyle = (severity: string) => {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400' };
    case 'high': return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400' };
    case 'medium': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400' };
    default: return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400' };
  }
};

const CEOAlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const db = supabase as any;
      const { data } = await db
        .from("system_alerts")
        .select("id, alert_type, severity, is_resolved, created_at, message")
        .order("created_at", { ascending: false })
        .limit(50);
      setAlerts(data || []);
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  const unresolvedAlerts = alerts.filter((a) => !a.is_resolved);
  const criticalCount = unresolvedAlerts.filter((a) => a.severity === 'critical').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-slate-900/60 border-slate-700/40">
          <CardContent className="p-4 text-center">
            <Bell className="w-5 h-5 text-violet-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{alerts.length}</p>
            <p className="text-[10px] text-slate-500">TOTAL ALERTS</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 border-slate-700/40">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
            <p className="text-[10px] text-slate-500">CRITICAL</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 border-slate-700/40">
          <CardContent className="p-4 text-center">
            <Shield className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-400">{unresolvedAlerts.length}</p>
            <p className="text-[10px] text-slate-500">UNRESOLVED</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 border-slate-700/40">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-400">{alerts.length - unresolvedAlerts.length}</p>
            <p className="text-[10px] text-slate-500">RESOLVED</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Active Alerts
            <Badge className="text-[9px] bg-red-500/20 text-red-400">{unresolvedAlerts.length} active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {(unresolvedAlerts.length > 0 ? unresolvedAlerts : alerts.slice(0, 10)).map((alert) => {
                const style = severityStyle(alert.severity || 'low');
                return (
                  <div key={alert.id} className={`p-3 rounded-lg ${style.bg} border ${style.border}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[9px] ${style.badge}`}>{(alert.severity || 'info').toUpperCase()}</Badge>
                        <span className="text-sm font-medium text-white">{alert.alert_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.is_resolved && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {alert.message && <p className="text-xs text-slate-400 mt-1">{alert.message}</p>}
                  </div>
                );
              })}
              {alerts.length === 0 && !loading && (
                <div className="text-center py-8 text-slate-500 text-sm">No alerts detected — system healthy</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CEOAlertsPanel;
