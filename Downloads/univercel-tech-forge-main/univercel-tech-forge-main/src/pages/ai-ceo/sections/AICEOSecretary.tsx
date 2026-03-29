/**
 * AI CEO — Secretary Module
 * Manages briefings, correspondence, schedules, and module-wide
 * task assignments on behalf of the AI CEO.
 */

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock4,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  type BriefingItem,
  type ModuleUpdate,
  type SecretaryBriefing,
  useSystemIntegration,
} from '@/hooks/useSystemIntegration';

// ─── Priority badge ──────────────────────────────────────────────────────────

const priorityConfig: Record<BriefingItem['priority'], { cls: string; label: string }> = {
  critical: { cls: 'border-red-500/30 bg-red-500/15 text-red-300', label: 'CRITICAL' },
  high: { cls: 'border-amber-500/30 bg-amber-500/15 text-amber-300', label: 'HIGH' },
  medium: { cls: 'border-blue-500/30 bg-blue-500/15 text-blue-300', label: 'MEDIUM' },
  low: { cls: 'border-slate-600/30 bg-slate-700/20 text-slate-400', label: 'LOW' },
};

// ─── Module status dot ───────────────────────────────────────────────────────

const moduleStatusDot: Record<ModuleUpdate['status'], string> = {
  active: 'bg-emerald-400',
  idle: 'bg-slate-500',
  error: 'bg-red-400',
  maintenance: 'bg-amber-400',
};

// ─── Period chip ─────────────────────────────────────────────────────────────

const periodLabel: Record<SecretaryBriefing['period'], string> = {
  morning: '🌅 Morning Briefing',
  afternoon: '☀️ Afternoon Update',
  evening: '🌆 Evening Report',
  overnight: '🌙 Overnight Summary',
};

// ─── Briefing Item card ──────────────────────────────────────────────────────

function BriefingCard({ item, index }: { item: BriefingItem; index: number }) {
  const { cls, label } = priorityConfig[item.priority];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
    >
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="font-medium text-white">{item.title}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">{item.module}</Badge>
          <Badge className={`text-xs ${cls}`}>{label}</Badge>
        </div>
      </div>
      <p className="text-sm text-slate-300">{item.detail}</p>
      {item.dueAt && (
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <Clock4 className="h-3 w-3" />
          Due: {new Date(item.dueAt).toLocaleString()}
        </div>
      )}
      {item.actionRequired && (
        <Badge className="mt-2 border-violet-500/30 bg-violet-500/15 text-violet-300 text-xs">
          <Zap className="mr-1 h-2.5 w-2.5" />
          Action Required
        </Badge>
      )}
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const AICEOSecretary = () => {
  const { briefing, loadingBriefing, generateBriefing, events } = useSystemIntegration();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['urgent', 'decisions']));

  const toggle = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }, []);

  useEffect(() => {
    void generateBriefing();
  }, [generateBriefing]);

  const pendingEvents = events.filter((e) => e.requiresAction && !e.processedAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-500 shadow-xl shadow-violet-500/20">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Secretary</h1>
            <p className="text-sm text-violet-300/80">Briefings, correspondence, schedules & cross-module task assignments</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {briefing && (
            <Badge className="border-violet-500/30 bg-violet-500/15 text-violet-300 px-3 py-1.5">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {periodLabel[briefing.period]}
            </Badge>
          )}
          <Button
            variant="outline"
            className="border-violet-500/30 bg-slate-900/60 text-violet-200 hover:bg-violet-500/10"
            disabled={loadingBriefing}
            onClick={() => void generateBriefing()}
          >
            {loadingBriefing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Regenerate Briefing
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: 'Urgent Items',
            value: briefing?.urgentItems.length ?? '—',
            icon: TriangleAlert,
            color: 'text-red-400',
          },
          {
            label: 'Pending Decisions',
            value: briefing?.pendingDecisions.length ?? '—',
            icon: BrainCircuit,
            color: 'text-amber-400',
          },
          {
            label: 'Module Updates',
            value: briefing?.moduleUpdates.length ?? '—',
            icon: FileText,
            color: 'text-cyan-400',
          },
          {
            label: 'Events Needing Action',
            value: pendingEvents.length,
            icon: CalendarClock,
            color: 'text-violet-400',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-slate-800 bg-slate-950/70">
              <CardContent className="flex items-center gap-3 p-4">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Briefing summary */}
      {briefing?.summary && (
        <Card className="border-violet-500/20 bg-slate-950/70 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-violet-400" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">{briefing.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Urgent items */}
      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => toggle('urgent')}
        >
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-red-400" />
              Urgent Items
              {(briefing?.urgentItems.length ?? 0) > 0 && (
                <Badge className="border-red-500/30 bg-red-500/15 text-red-300 text-xs">
                  {briefing!.urgentItems.length}
                </Badge>
              )}
            </span>
            {expandedSections.has('urgent') ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.has('urgent') && (
          <CardContent>
            {loadingBriefing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
              </div>
            ) : (briefing?.urgentItems ?? []).length > 0 ? (
              <ScrollArea className="h-64 pr-3">
                <div className="space-y-3">
                  {briefing!.urgentItems.map((item, i) => (
                    <BriefingCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="py-4 text-center text-sm text-slate-400">No urgent items at this time.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Pending decisions */}
      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => toggle('decisions')}
        >
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-amber-400" />
              Pending Decisions
              {(briefing?.pendingDecisions.length ?? 0) > 0 && (
                <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-300 text-xs">
                  {briefing!.pendingDecisions.length}
                </Badge>
              )}
            </span>
            {expandedSections.has('decisions') ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.has('decisions') && (
          <CardContent>
            {loadingBriefing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
              </div>
            ) : (briefing?.pendingDecisions ?? []).length > 0 ? (
              <ScrollArea className="h-64 pr-3">
                <div className="space-y-3">
                  {briefing!.pendingDecisions.map((item, i) => (
                    <BriefingCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="py-4 text-center text-sm text-slate-400">No pending decisions queued.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Module updates */}
      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => toggle('modules')}
        >
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              Module Status Updates
            </span>
            {expandedSections.has('modules') ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.has('modules') && (
          <CardContent>
            {loadingBriefing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              </div>
            ) : (briefing?.moduleUpdates ?? []).length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {briefing!.moduleUpdates.map((mod, i) => (
                  <motion.div
                    key={mod.module}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                  >
                    <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${moduleStatusDot[mod.status]}`} />
                    <div>
                      <p className="font-medium text-white capitalize">{mod.module.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-slate-400">{mod.summary}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Last activity: {new Date(mod.lastActivity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-slate-400">No module updates in this briefing.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Scheduled actions */}
      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => toggle('scheduled')}
        >
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-violet-400" />
              Scheduled Actions
            </span>
            {expandedSections.has('scheduled') ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.has('scheduled') && (
          <CardContent>
            {loadingBriefing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
              </div>
            ) : (briefing?.scheduledActions ?? []).length > 0 ? (
              <ScrollArea className="h-48 pr-3">
                <div className="space-y-2">
                  {briefing!.scheduledActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{action.title}</p>
                        <p className="text-xs text-slate-400">
                          {action.module} · {new Date(action.scheduledFor).toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          action.status === 'done'
                            ? 'border-emerald-500/30 text-emerald-300'
                            : action.status === 'failed'
                              ? 'border-red-500/30 text-red-300'
                              : action.status === 'executing'
                                ? 'border-cyan-500/30 text-cyan-300'
                                : 'border-slate-600 text-slate-400'
                        }
                      >
                        {action.status === 'done' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {action.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="py-4 text-center text-sm text-slate-400">No scheduled actions pending.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Pending cross-module events */}
      {pendingEvents.length > 0 && (
        <Card className="border-amber-500/20 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-amber-400" />
              Cross-Module Events Requiring Action
              <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-300 text-xs">
                {pendingEvents.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 pr-3">
              <div className="space-y-2">
                {pendingEvents.slice(0, 15).map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-amber-500/15 bg-slate-900/70 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{ev.title}</p>
                      <p className="text-xs text-slate-400">{ev.description}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {ev.sourceModule.replace(/_/g, ' ')}
                        {ev.targetModule ? ` → ${ev.targetModule.replace(/_/g, ' ')}` : ''}
                      </p>
                    </div>
                    <Badge
                      className={
                        ev.severity === 'critical' || ev.severity === 'emergency'
                          ? 'border-red-500/30 bg-red-500/15 text-red-300'
                          : 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                      }
                    >
                      {ev.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AICEOSecretary;
