import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BadgeDollarSign,
  BrainCircuit,
  CheckSquare,
  PlayCircle,
  Radio,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCEOMissionControl } from '@/hooks/useCEOMissionControl';

const summaryCards = [
  { key: 'health_score', label: 'Health Score', icon: ShieldAlert, accent: 'text-emerald-400' },
  { key: 'critical_alerts', label: 'Critical Alerts', icon: AlertTriangle, accent: 'text-red-400' },
  { key: 'ai_actions_today', label: 'AI Actions Today', icon: BrainCircuit, accent: 'text-cyan-400' },
  { key: 'open_tasks', label: 'Open Tasks', icon: CheckSquare, accent: 'text-amber-400' },
  { key: 'revenue_today', label: 'Revenue Today', icon: BadgeDollarSign, accent: 'text-violet-400' },
] as const;

const AICEODashboardMain = () => {
  const { dashboard, loading, executing, reload, executeCommand } = useCEOMissionControl();
  const [commandText, setCommandText] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!commandText.trim()) return;
    await executeCommand(commandText.trim());
    setCommandText('');
  };

  const summary = dashboard?.summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-400 shadow-xl shadow-cyan-500/20">
            <BrainCircuit className="h-7 w-7 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CEO Mission Control</h1>
            <p className="text-sm text-cyan-300/80">Live command routing, policy enforcement, approvals, and system telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-emerald-300">
            <Radio className="mr-2 h-3.5 w-3.5" />
            LIVE CONTROL LOOP
          </Badge>
          <Button variant="outline" className="border-cyan-500/30 bg-slate-900/60 text-cyan-200 hover:bg-cyan-500/10" onClick={() => void reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-cyan-500/20 bg-slate-950/70 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <PlayCircle className="h-5 w-5 text-cyan-400" />
            Command Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 lg:flex-row" onSubmit={handleSubmit}>
            <Input
              value={commandText}
              onChange={(event) => setCommandText(event.target.value)}
              placeholder="approve reseller <uuid> | credit wallet <uuid> 5000 | restart server <uuid>"
              className="border-cyan-500/20 bg-slate-900/80 text-white placeholder:text-slate-500"
            />
            <Button type="submit" disabled={executing || !commandText.trim()} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
              {executing ? 'Executing...' : 'Execute'}
            </Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
            <span>Supported:</span>
            <Badge variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300">approve reseller</Badge>
            <Badge variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300">approve payout</Badge>
            <Badge variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300">restart server</Badge>
            <Badge variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300">close deal</Badge>
            <Badge variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300">create task</Badge>
            <Badge variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300">credit wallet</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          const value = summary ? summary[card.key] : loading ? '...' : 0;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-slate-800 bg-slate-950/70">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <Icon className={`h-5 w-5 ${card.accent}`} />
                    <Sparkles className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className={`text-2xl font-bold ${card.accent}`}>
                    {card.key === 'revenue_today' && typeof value === 'number' ? `INR ${value.toLocaleString()}` : value}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-white">Top Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[360px] pr-3">
              <div className="space-y-3">
                {(dashboard?.top_risks || []).map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-red-500/15 bg-slate-900/70 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{alert.title}</p>
                        <p className="text-xs text-slate-500">{new Date(alert.created_at).toLocaleString()}</p>
                      </div>
                      <Badge className="border-red-500/20 bg-red-500/15 text-red-300">{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-slate-300">{alert.message || 'No detail provided.'}</p>
                  </div>
                ))}
                {!loading && (dashboard?.top_risks || []).length === 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">No active risks detected.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-white">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[360px] pr-3">
              <div className="space-y-3">
                {(dashboard?.pending_approvals || []).map((approval) => (
                  <div key={approval.id} className="rounded-xl border border-amber-500/20 bg-slate-900/70 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium text-white">{approval.intent}</p>
                      <Badge className="border-amber-500/20 bg-amber-500/15 text-amber-300">{approval.risk}</Badge>
                    </div>
                    <p className="text-sm text-slate-300">
                      {String(approval.payload?.source_text || approval.result?.message || 'Awaiting explicit approval')}
                    </p>
                  </div>
                ))}
                {!loading && (dashboard?.pending_approvals || []).length === 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">No approval gates waiting.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-white">Task Engine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(dashboard?.active_tasks || []).map((task) => (
                <div key={task.task_id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div>
                    <p className="font-medium text-white">{task.title || 'Untitled task'}</p>
                    <p className="text-xs text-slate-500">{task.description || 'No description'}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-slate-700 bg-slate-900/40 text-slate-300">{task.status || 'open'}</Badge>
                    <p className="mt-2 text-xs text-slate-500">{task.priority || 'normal'}</p>
                  </div>
                </div>
              ))}
              {!loading && (dashboard?.active_tasks || []).length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">No open tasks.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-white">Deal Engine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(dashboard?.active_deals || []).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div>
                    <p className="font-medium text-white">{deal.summary || `Deal ${deal.id.slice(0, 8)}`}</p>
                    <p className="text-xs text-slate-500">Stage: {deal.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-violet-300">INR {Number(deal.value || 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{deal.status}</p>
                  </div>
                </div>
              ))}
              {!loading && (dashboard?.active_deals || []).length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">No active deals.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICEODashboardMain;