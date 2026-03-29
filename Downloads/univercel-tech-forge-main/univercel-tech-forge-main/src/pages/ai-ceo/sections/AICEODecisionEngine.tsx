import { BrainCircuit, CheckCircle2, Clock4, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCEOMissionControl } from '@/hooks/useCEOMissionControl';

const AICEODecisionEngine = () => {
  const { dashboard, approvingIds, approveAction, loading } = useCEOMissionControl();

  const approvals = dashboard?.pending_approvals || [];
  const completed = (dashboard?.recent_actions || []).filter((action) => action.status === 'completed').slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Decision Engine</h1>
          <p className="text-sm text-cyan-300/80">Policy-gated actions awaiting approval, with live execution state</p>
        </div>
        <Badge className="border-violet-500/30 bg-violet-500/15 text-violet-300">
          <BrainCircuit className="mr-2 h-3.5 w-3.5" />
          POLICY ACTIVE
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Approvals Waiting', value: approvals.length, icon: Clock4, color: 'text-amber-400' },
          { label: 'Completed Decisions', value: completed.length, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'High-Risk Actions', value: approvals.filter((item) => ['high', 'critical'].includes(item.risk)).length, icon: ShieldAlert, color: 'text-red-400' },
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-white">Approval Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[520px] pr-3">
              <div className="space-y-4">
                {approvals.map((approval) => (
                  <div key={approval.id} className="rounded-xl border border-amber-500/20 bg-slate-900/70 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{approval.intent}</p>
                        <p className="text-xs text-slate-500">{new Date(approval.created_at).toLocaleString()}</p>
                      </div>
                      <Badge className="border-amber-500/20 bg-amber-500/15 text-amber-300">{approval.risk}</Badge>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-400">{JSON.stringify(approval.payload?.parsed_intent || approval.payload, null, 2)}</pre>
                    <div className="mt-4 flex justify-end">
                      <Button
                        className="bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        disabled={approvingIds.has(approval.id)}
                        onClick={() => void approveAction(approval.id)}
                      >
                        {approvingIds.has(approval.id) ? 'Executing...' : 'Approve & Execute'}
                      </Button>
                    </div>
                  </div>
                ))}
                {!loading && approvals.length === 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">No actions are waiting for approval.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-white">Recent Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completed.map((action) => (
                <div key={action.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{action.action}</p>
                    <Badge className="border-emerald-500/20 bg-emerald-500/15 text-emerald-300">completed</Badge>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-slate-400">{JSON.stringify(action.result, null, 2)}</pre>
                </div>
              ))}
              {!loading && completed.length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">No completed decision records yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICEODecisionEngine;