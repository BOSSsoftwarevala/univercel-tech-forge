/**
 * AI CEO — Spy / Surveillance Module
 * Real-time cross-module monitoring: anomaly detection, activity tracking,
 * security flags, and threat assessment across the entire platform.
 */

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Radio,
  RefreshCw,
  SearchCode,
  ShieldAlert,
  ShieldCheck,
  Siren,
  XCircle,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  type AnomalyRecord,
  type SecurityFlag,
  type SpySurveillanceReport,
  useSystemIntegration,
} from '@/hooks/useSystemIntegration';

// ─── Threat level config ─────────────────────────────────────────────────────

const threatConfig: Record<SpySurveillanceReport['overallThreatLevel'], { color: string; bg: string; icon: typeof ShieldCheck; label: string }> = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: ShieldCheck, label: 'LOW THREAT' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: ShieldAlert, label: 'MEDIUM THREAT' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: AlertTriangle, label: 'HIGH THREAT' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: Siren, label: 'CRITICAL THREAT' },
};

// ─── Severity colors ─────────────────────────────────────────────────────────

const severityBadge: Record<AnomalyRecord['severity'], string> = {
  low: 'border-slate-600/30 bg-slate-700/20 text-slate-400',
  medium: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
  high: 'border-orange-500/30 bg-orange-500/15 text-orange-300',
  critical: 'border-red-500/30 bg-red-500/15 text-red-300',
};

// ─── Anomaly type labels ─────────────────────────────────────────────────────

const anomalyTypeLabel: Record<AnomalyRecord['type'], string> = {
  unusual_traffic: '📡 Unusual Traffic',
  auth_failure: '🔐 Auth Failure',
  data_mismatch: '⚠️ Data Mismatch',
  latency_spike: '🐢 Latency Spike',
  error_surge: '🔥 Error Surge',
  suspicious_action: '👁️ Suspicious Action',
};

// ─── Live feed ticker ─────────────────────────────────────────────────────────

function LiveFeedTicker({ events }: { events: Array<{ id: string; title: string; severity: string; sourceModule: string }> }) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-cyan-500/20 bg-slate-950/70 px-4 py-2 overflow-hidden">
      <div className="flex items-center gap-2 shrink-0">
        <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Live</span>
      </div>
      <div className="flex-1 overflow-hidden">
        {events.length === 0 ? (
          <span className="text-xs text-slate-500">No events streaming — system quiet.</span>
        ) : (
          <AnimatePresence mode="wait">
            {visible && (
              <motion.span
                key={events[0].id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-xs text-slate-300"
              >
                [{events[0].severity.toUpperCase()}] {events[0].sourceModule.replace(/_/g, ' ')} — {events[0].title}
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </div>
      <button
        className="text-slate-600 hover:text-slate-400 shrink-0"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Pause feed' : 'Resume feed'}
      >
        {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const AICEOSpy = () => {
  const {
    surveillance,
    loadingSurveillance,
    runSurveillance,
    events,
    scanResult,
    scanning,
    runFullScan,
  } = useSystemIntegration();

  const [expandAnomalies, setExpandAnomalies] = useState(true);
  const [expandFlags, setExpandFlags] = useState(true);
  const [expandActivity, setExpandActivity] = useState(false);

  useEffect(() => {
    void runSurveillance();
    void runFullScan();
  }, [runSurveillance, runFullScan]);

  const handleRefresh = useCallback(() => {
    void runSurveillance();
    void runFullScan();
  }, [runSurveillance, runFullScan]);

  const threatLevel = surveillance?.overallThreatLevel ?? 'low';
  const { color: threatColor, bg: threatBg, icon: ThreatIcon, label: threatLabel } = threatConfig[threatLevel];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 shadow-xl shadow-red-500/20">
            <SearchCode className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Spy — Surveillance</h1>
            <p className="text-sm text-red-300/80">Real-time anomaly detection, activity monitoring & security flagging across all modules</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`px-3 py-1.5 border ${threatBg} ${threatColor}`}>
            <ThreatIcon className="mr-2 h-3.5 w-3.5" />
            {threatLabel}
          </Badge>
          <Button
            variant="outline"
            className="border-red-500/30 bg-slate-900/60 text-red-200 hover:bg-red-500/10"
            disabled={loadingSurveillance || scanning}
            onClick={handleRefresh}
          >
            {(loadingSurveillance || scanning) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Rescan
          </Button>
        </div>
      </div>

      {/* Live event ticker */}
      <LiveFeedTicker events={events.slice(0, 1).map((e) => ({ id: e.id, title: e.title, severity: e.severity, sourceModule: e.sourceModule }))} />

      {/* Summary stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Anomalies Detected',
            value: surveillance?.anomaliesDetected.length ?? (scanning ? '…' : 0),
            icon: AlertTriangle,
            color: 'text-red-400',
          },
          {
            label: 'Security Flags',
            value: surveillance?.securityFlags.length ?? (scanning ? '…' : 0),
            icon: Lock,
            color: 'text-orange-400',
          },
          {
            label: 'Modules Scanned',
            value: scanResult?.totalModules ?? (scanning ? '…' : 0),
            icon: Activity,
            color: 'text-cyan-400',
          },
          {
            label: 'Critical Modules',
            value: scanResult?.criticalModules ?? (scanning ? '…' : 0),
            icon: XCircle,
            color: 'text-red-400',
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

      {/* Module health grid */}
      {scanResult && (
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-cyan-400" />
              Module Surveillance Grid
              <Badge className="border-cyan-500/30 bg-cyan-500/15 text-cyan-300 text-xs">
                {scanResult.healthyModules} healthy · {scanResult.warningModules} warning · {scanResult.criticalModules} critical
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1">
                <Progress
                  value={scanResult.overallHealth}
                  className="h-2 bg-slate-800"
                />
              </div>
              <span className="text-sm font-semibold text-cyan-300">{scanResult.overallHealth}% healthy</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {scanResult.modules.map((mod) => {
                const dot =
                  mod.status === 'healthy'
                    ? 'bg-emerald-400'
                    : mod.status === 'warning'
                      ? 'bg-amber-400'
                      : mod.status === 'critical'
                        ? 'bg-red-400'
                        : 'bg-slate-500';

                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <span className="truncate text-xs text-slate-300">{mod.label}</span>
                    </div>
                    <span className="ml-2 text-xs font-semibold text-slate-400">{mod.healthScore}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Anomalies */}
      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setExpandAnomalies((v) => !v)}
        >
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Siren className="h-5 w-5 text-red-400" />
              Detected Anomalies
              {(surveillance?.anomaliesDetected.length ?? 0) > 0 && (
                <Badge className="border-red-500/30 bg-red-500/15 text-red-300 text-xs">
                  {surveillance!.anomaliesDetected.length}
                </Badge>
              )}
            </span>
            {expandAnomalies ? (
              <Eye className="h-4 w-4 text-slate-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-slate-400" />
            )}
          </CardTitle>
        </CardHeader>
        {expandAnomalies && (
          <CardContent>
            {loadingSurveillance ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-red-400" />
              </div>
            ) : (surveillance?.anomaliesDetected ?? []).length > 0 ? (
              <ScrollArea className="h-72 pr-3">
                <div className="space-y-3">
                  {surveillance!.anomaliesDetected.map((anomaly: AnomalyRecord, i) => (
                    <motion.div
                      key={anomaly.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="rounded-xl border border-red-500/15 bg-slate-900/70 p-4"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{anomalyTypeLabel[anomaly.type]}</span>
                          <Badge className={`text-xs ${severityBadge[anomaly.severity]}`}>{anomaly.severity}</Badge>
                        </div>
                        {anomaly.resolved ? (
                          <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs">
                            <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                            Resolved
                          </Badge>
                        ) : (
                          <Badge className="border-red-500/30 bg-red-500/10 text-red-300 text-xs">
                            <Zap className="mr-1 h-2.5 w-2.5" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{anomaly.description}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {anomaly.module.replace(/_/g, ' ')} · {new Date(anomaly.detectedAt).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="py-4 text-center text-sm text-slate-400">No anomalies detected — system clean.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Security flags */}
      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setExpandFlags((v) => !v)}
        >
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-orange-400" />
              Security Flags
              {(surveillance?.securityFlags.length ?? 0) > 0 && (
                <Badge className="border-orange-500/30 bg-orange-500/15 text-orange-300 text-xs">
                  {surveillance!.securityFlags.length}
                </Badge>
              )}
            </span>
            {expandFlags ? (
              <Eye className="h-4 w-4 text-slate-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-slate-400" />
            )}
          </CardTitle>
        </CardHeader>
        {expandFlags && (
          <CardContent>
            {loadingSurveillance ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
              </div>
            ) : (surveillance?.securityFlags ?? []).length > 0 ? (
              <ScrollArea className="h-56 pr-3">
                <div className="space-y-3">
                  {surveillance!.securityFlags.map((flag: SecurityFlag, i) => (
                    <motion.div
                      key={flag.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="rounded-xl border border-orange-500/15 bg-slate-900/70 p-4"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="font-medium text-white text-sm">{flag.flag}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${severityBadge[flag.severity as AnomalyRecord['severity']]}`}>
                            {flag.severity}
                          </Badge>
                          {flag.requiresBossApproval && (
                            <Badge className="border-violet-500/30 bg-violet-500/15 text-violet-300 text-xs">
                              Boss Approval
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300">{flag.details}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {flag.module.replace(/_/g, ' ')} · {new Date(flag.flaggedAt).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="py-4 text-center text-sm text-slate-400">No security flags raised.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Activity summary */}
      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setExpandActivity((v) => !v)}
        >
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              Module Activity Summary
            </span>
            {expandActivity ? (
              <Eye className="h-4 w-4 text-slate-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-slate-400" />
            )}
          </CardTitle>
        </CardHeader>
        {expandActivity && (
          <CardContent>
            {loadingSurveillance ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              </div>
            ) : (surveillance?.activitySummary ?? []).length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {surveillance!.activitySummary.map((activity, i) => (
                  <motion.div
                    key={activity.module}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                  >
                    <p className="mb-2 font-medium capitalize text-white text-sm">
                      {activity.module.replace(/_/g, ' ')}
                    </p>
                    <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-400">
                      <span>Actions (1h):</span>
                      <span className="text-right text-slate-200">{activity.actionsLast1h}</span>
                      <span>Actions (24h):</span>
                      <span className="text-right text-slate-200">{activity.actionsLast24h}</span>
                      <span>Failure rate:</span>
                      <span className={`text-right ${activity.failureRate > 0.1 ? 'text-red-300' : 'text-emerald-300'}`}>
                        {(activity.failureRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    {activity.topActions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {activity.topActions.slice(0, 3).map((a) => (
                          <Badge key={a} variant="outline" className="border-slate-700 text-slate-400 text-xs">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-slate-400">No activity data available.</p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AICEOSpy;
