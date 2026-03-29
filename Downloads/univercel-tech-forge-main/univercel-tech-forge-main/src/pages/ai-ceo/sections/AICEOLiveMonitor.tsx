import { motion } from 'framer-motion';
import { Activity, AlertTriangle, BrainCircuit, CheckCircle2, Clock4 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCEOMissionControl } from '@/hooks/useCEOMissionControl';

const AICEOLiveMonitor = () => {
  const { actions, events, alerts, loading } = useCEOMissionControl();

  const completedCount = actions.filter((action) => action.status === 'completed').length;
  const riskCount = actions.filter((action) => ['high', 'critical'].includes(action.risk)).length;
  const approvalCount = actions.filter((action) => action.status === 'approval_required').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Action Monitor</h1>
          <p className="text-sm text-cyan-300/80">Realtime feed across commands, actions, events, and alerts</p>
        </div>
        <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
          <Activity className="mr-2 h-3.5 w-3.5" />
          STREAM OPEN
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'High Risk', value: riskCount, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Awaiting Approval', value: approvalCount, icon: Clock4, color: 'text-amber-400' },
          { label: 'Events Captured', value: events.length, icon: BrainCircuit, color: 'text-cyan-400' },
        ].map((item) => (
          <Card key={item.label} className="border-slate-800 bg-slate-950/70">
            <CardContent className="flex items-center gap-3 p-4">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <div>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-slate-400">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-white">Action Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[520px] pr-3">
              <div className="space-y-3">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{action.action}</p>
                        <p className="text-xs text-slate-500">{new Date(action.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-slate-700 bg-slate-900/40 text-slate-300">{action.status}</Badge>
                        <Badge className={action.risk === 'high' || action.risk === 'critical' ? 'border-red-500/20 bg-red-500/15 text-red-300' : 'border-cyan-500/20 bg-cyan-500/15 text-cyan-300'}>{action.risk}</Badge>
                      </div>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-slate-400">{JSON.stringify(action.result, null, 2)}</pre>
                  </motion.div>
                ))}
                {!loading && actions.length === 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">No actions captured yet.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-white">Alert Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[520px] pr-3">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium text-white">{alert.title}</p>
                      <Badge className={['critical', 'emergency'].includes(alert.severity) ? 'border-red-500/20 bg-red-500/15 text-red-300' : 'border-amber-500/20 bg-amber-500/15 text-amber-300'}>{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-slate-300">{alert.message || 'No message provided.'}</p>
                    <p className="mt-2 text-xs text-slate-500">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                ))}
                {!loading && alerts.length === 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">No live alerts.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICEOLiveMonitor;