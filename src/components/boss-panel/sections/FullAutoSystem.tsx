import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  CheckCircle2,
  Clock3,
  Loader2,
  Rocket,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSystemVerification } from '@/hooks/useSystemVerification';
import { aiObservation } from '@/services/AIObservationService';
import {
  type FullAutoIssue,
  type FullAutoRun,
  fullAutoSystemApi,
} from '@/lib/api/full-auto-system';

const statusTone: Record<string, string> = {
  deployed: 'bg-emerald-500/15 text-emerald-700 border-emerald-300',
  awaiting_approval: 'bg-amber-500/15 text-amber-700 border-amber-300',
  failed: 'bg-rose-500/15 text-rose-700 border-rose-300',
  rejected: 'bg-rose-500/15 text-rose-700 border-rose-300',
  fixing: 'bg-blue-500/15 text-blue-700 border-blue-300',
  scanning: 'bg-blue-500/15 text-blue-700 border-blue-300',
};

const severityTone: Record<string, string> = {
  critical: 'bg-rose-500/15 text-rose-700 border-rose-300',
  high: 'bg-orange-500/15 text-orange-700 border-orange-300',
  medium: 'bg-amber-500/15 text-amber-700 border-amber-300',
  low: 'bg-slate-500/15 text-slate-700 border-slate-300',
};

const checkTone: Record<string, string> = {
  pass: 'text-emerald-600',
  warning: 'text-amber-600',
  fail: 'text-rose-600',
};

function formatRelative(timestamp?: string | null) {
  if (!timestamp) return 'Never';
  return new Date(timestamp).toLocaleString();
}

function getSummaryNumber(run: FullAutoRun | undefined, key: string) {
  const value = run?.summary?.[key];
  return typeof value === 'number' ? value : 0;
}

function getStatusLabel(run: FullAutoRun | undefined) {
  const label = run?.summary?.statusLabel;
  return typeof label === 'string' ? label : 'IN PROGRESS';
}

export function FullAutoSystem() {
  const { runFullVerification, isVerifying } = useSystemVerification();
  const [runs, setRuns] = useState<FullAutoRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('Needs another autonomous recovery pass.');
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const loadRuns = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fullAutoSystemApi.listRuns();
      setRuns(response.runs);
      setSelectedRunId((current) => current || response.runs[0]?.id || null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load automation runs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  const selectedRun = useMemo(
    () => runs.find((run) => run.id === selectedRunId) || runs[0] || null,
    [runs, selectedRunId],
  );

  const verificationScore = useMemo(() => {
    if (!selectedRun?.verification.length) return 0;
    const passed = selectedRun.verification.filter((entry) => entry.status === 'pass').length;
    return Math.round((passed / selectedRun.verification.length) * 100);
  }, [selectedRun]);

  const handleRunCycle = useCallback(async () => {
    setIsStarting(true);
    try {
      const verificationReport = await runFullVerification();
      const response = await fullAutoSystemApi.startCycle({
        scope: 'global',
        environment: 'production',
        verificationReport: {
          timestamp: verificationReport.timestamp,
          overallStatus: verificationReport.overallStatus,
          totalChecks: verificationReport.totalChecks,
          passedChecks: verificationReport.passedChecks,
          failedChecks: verificationReport.failedChecks,
          warningChecks: verificationReport.warningChecks,
          readyForLock: verificationReport.readyForLock,
          results: verificationReport.results.map((result) => ({
            category: result.category,
            check: result.check,
            status: result.status,
            message: result.message,
            details: result.details,
          })),
        },
      });

      await aiObservation.logUsage('full_auto_system', {
        runId: response.run.id,
        issues: response.run.issues.length,
        status: response.run.status,
      });

      for (const fix of response.run.fixes) {
        await aiObservation.logAutoFix('full_auto_system', fix.issueId, fix.action, fix.status === 'applied');
      }

      toast.success(`Automation cycle completed with ${response.run.issues.length} findings.`);
      await loadRuns();
      setSelectedRunId(response.run.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start automation cycle.');
    } finally {
      setIsStarting(false);
    }
  }, [loadRuns, runFullVerification]);

  const handleApprove = useCallback(async () => {
    if (!selectedRun) return;
    setIsApproving(true);
    try {
      const response = await fullAutoSystemApi.approveRun(selectedRun.id, approvalNotes.trim() || undefined);
      await aiObservation.logOptimization('full_auto_system', 'boss_approval', 'deployment_authorized');
      toast.success(`Run ${response.run.id.slice(0, 8)} deployed.`);
      setApprovalNotes('');
      await loadRuns();
      setSelectedRunId(response.run.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve automation run.');
    } finally {
      setIsApproving(false);
    }
  }, [approvalNotes, loadRuns, selectedRun]);

  const handleReject = useCallback(async () => {
    if (!selectedRun) return;
    setIsRejecting(true);
    try {
      const response = await fullAutoSystemApi.rejectRun(selectedRun.id, rejectReason.trim());
      await aiObservation.logBlock('full_auto_system', rejectReason.trim(), 'boss_rejected_deploy');
      toast.success(`Run ${response.run.id.slice(0, 8)} rolled back and re-queued.`);
      await loadRuns();
      setSelectedRunId(response.run.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject automation run.');
    } finally {
      setIsRejecting(false);
    }
  }, [loadRuns, rejectReason, selectedRun]);

  const renderIssueRow = (issue: FullAutoIssue) => (
    <div
      key={issue.id}
      className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200/40"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{issue.title}</h3>
            <Badge variant="outline" className={severityTone[issue.severity]}>
              {issue.severity}
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
              {issue.status}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-slate-600">{issue.description}</p>
        </div>
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
          {issue.category}
        </Badge>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Root Cause</div>
          <div className="mt-1 text-sm text-slate-700">{issue.rootCause}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Impact</div>
          <div className="mt-1 text-sm text-slate-700">{issue.impact}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_28%),linear-gradient(135deg,#0f172a_0%,#163047_45%,#f8fafc_45%,#f8fafc_100%)] p-6 shadow-2xl shadow-slate-300/30"
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Full Auto System</h1>
                <p className="text-sm text-slate-200">
                  Scan, analyze, auto-fix, test, verify, then freeze for Boss approval only.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <Card className="border-white/10 bg-white/10 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-200">Latest Status</div>
                  <div className="mt-2 text-2xl font-bold text-white">{getStatusLabel(selectedRun || undefined)}</div>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/10 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-200">Issues</div>
                  <div className="mt-2 text-2xl font-bold text-white">{getSummaryNumber(selectedRun || undefined, 'totalIssues')}</div>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/10 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-200">Auto Fixed</div>
                  <div className="mt-2 text-2xl font-bold text-white">{getSummaryNumber(selectedRun || undefined, 'fixedIssues')}</div>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/10 backdrop-blur">
                <CardContent className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-200">Verification</div>
                  <div className="mt-2 text-2xl font-bold text-white">{verificationScore}%</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-slate-200 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-900">
                <span>Command Window</span>
                <Badge variant="outline" className={statusTone[selectedRun?.status || 'scanning']}>
                  {selectedRun?.status || 'idle'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-600">
                Last cycle: <span className="font-medium text-slate-900">{formatRelative(selectedRun?.created_at)}</span>
              </div>
              <Progress value={verificationScore} className="h-2" />
              <Button
                onClick={handleRunCycle}
                disabled={isStarting || isVerifying}
                className="w-full bg-slate-950 text-white hover:bg-slate-800"
              >
                {isStarting || isVerifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Run Autonomous Cycle
              </Button>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                The system runs scan, analysis, fix routing, test replay, and double verification first.
                Boss is only interrupted when the release window is ready for a final approve or reject decision.
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
        <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/30">
          <CardHeader>
            <CardTitle className="text-slate-900">Cycle History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading automation history...
              </div>
            ) : runs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                No automation run exists yet. Start the first cycle to build the approval queue.
              </div>
            ) : (
              runs.map((run) => (
                <button
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedRun?.id === run.id
                      ? 'border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-300/30'
                      : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Run {run.id.slice(0, 8)}</div>
                      <div className={`text-xs ${selectedRun?.id === run.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {formatRelative(run.created_at)}
                      </div>
                    </div>
                    <Badge variant="outline" className={statusTone[run.status] || 'border-slate-300'}>
                      {run.status}
                    </Badge>
                  </div>
                  <div className={`mt-3 text-xs ${selectedRun?.id === run.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {getSummaryNumber(run, 'totalIssues')} issues, {getSummaryNumber(run, 'fixedIssues')} fixed
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-900">
              <span>Boss Approval Surface</span>
              {selectedRun ? (
                <Badge variant="outline" className={statusTone[selectedRun.status]}>
                  {selectedRun.status}
                </Badge>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedRun ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                Select a run from the left to inspect issues, fixes, tests, and approval state.
              </div>
            ) : (
              <Tabs defaultValue="overview" className="space-y-5">
                <TabsList className="bg-slate-100">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-slate-200 bg-slate-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <ShieldAlert className="h-4 w-4" /> Critical / High
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">
                          {getSummaryNumber(selectedRun, 'criticalIssues')} / {getSummaryNumber(selectedRun, 'highIssues')}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 bg-slate-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <CheckCircle2 className="h-4 w-4" /> Auto Fixed
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">
                          {getSummaryNumber(selectedRun, 'fixedIssues')}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 bg-slate-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Clock3 className="h-4 w-4" /> Queued Follow-up
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">
                          {getSummaryNumber(selectedRun, 'queuedIssues')}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Approval Decision</div>
                        <div className="text-sm text-slate-600">
                          Summary status: {getStatusLabel(selectedRun)}. Deployment is released only after Boss decision.
                        </div>
                      </div>
                      <Badge variant="outline" className={statusTone[selectedRun.status]}>
                        {selectedRun.status}
                      </Badge>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <Textarea
                        value={approvalNotes}
                        onChange={(event) => setApprovalNotes(event.target.value)}
                        placeholder="Optional approval note for immutable audit trail"
                        className="min-h-28 border-slate-200 bg-white"
                      />
                      <Textarea
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.target.value)}
                        placeholder="Rollback reason if the cycle is rejected"
                        className="min-h-28 border-slate-200 bg-white"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        onClick={handleApprove}
                        disabled={selectedRun.status !== 'awaiting_approval' || isApproving}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                        Approve and Deploy
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={selectedRun.status !== 'awaiting_approval' || isRejecting}
                        variant="outline"
                        className="border-rose-300 text-rose-700 hover:bg-rose-50"
                      >
                        {isRejecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                        Reject, Rollback, Retry
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-slate-200 bg-white">
                      <CardHeader>
                        <CardTitle className="text-base text-slate-900">Applied Fixes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedRun.fixes.length === 0 ? (
                          <div className="text-sm text-slate-500">No fixes recorded for this run.</div>
                        ) : (
                          selectedRun.fixes.map((fix) => (
                            <div key={`${fix.issueId}-${fix.timestamp}`} className="rounded-2xl border border-slate-200 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-medium text-slate-900">{fix.action}</div>
                                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                                  {fix.status}
                                </Badge>
                              </div>
                              <div className="mt-2 text-sm text-slate-600">{fix.outcome}</div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white">
                      <CardHeader>
                        <CardTitle className="text-base text-slate-900">Learning Memory</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-slate-600">
                        <div>
                          Learned at: <span className="font-medium text-slate-900">{formatRelative(String(selectedRun.learning?.learnedAt || ''))}</span>
                        </div>
                        <div>
                          Auto-fix coverage: <span className="font-medium text-slate-900">{String(selectedRun.learning?.autoFixCoverage || 0)}</span>
                        </div>
                        <div>
                          Queued follow-up coverage: <span className="font-medium text-slate-900">{String(selectedRun.learning?.queueCoverage || 0)}</span>
                        </div>
                        <div>
                          Repeated patterns: <span className="font-medium text-slate-900">{Array.isArray(selectedRun.learning?.repeatedIssueTypes) ? selectedRun.learning?.repeatedIssueTypes.join(', ') : 'None'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="issues" className="space-y-4">
                  {selectedRun.issues.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                      This run produced no issues. The system is clean and ready for Boss approval.
                    </div>
                  ) : (
                    selectedRun.issues.map(renderIssueRow)
                  )}
                </TabsContent>

                <TabsContent value="verification" className="space-y-4">
                  {selectedRun.verification.map((entry) => (
                    <div key={`${entry.name}-${entry.details}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-900">{entry.name}</div>
                        <div className={`text-sm font-semibold uppercase ${checkTone[entry.status]}`}>
                          {entry.status}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">{entry.details}</div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}