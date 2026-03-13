/**
 * AIRA Dignity Protocol – Admin Status Panel
 *
 * Read-only panel that displays the current AIRA protocol lock state.
 * No controls are provided – the protocol cannot be changed from the UI.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Lock,
  CheckCircle2,
  Ban,
  Volume2,
  Zap,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { AIRA_ACTIVE_POLICY, getOverrideLog } from '@/lib/aira/dignity-protocol';

// ── Sub-components ─────────────────────────────────────────────────────────

function LockedBadge() {
  return (
    <Badge className="bg-green-600/20 text-green-400 border border-green-600/40 text-xs font-mono">
      <Lock className="h-3 w-3 mr-1" />
      PERMANENTLY LOCKED
    </Badge>
  );
}

function StatusRow({ label, value, icon: Icon }: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-sm font-mono font-medium text-foreground">{value}</span>
    </div>
  );
}

function CheckRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm py-1">
      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto text-green-400 font-mono text-xs">{passed ? 'ACTIVE' : 'INACTIVE'}</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export const AIRADignityPanel: React.FC = () => {
  const policy = AIRA_ACTIVE_POLICY;
  const overrideAttempts = getOverrideLog();

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            AIRA Dignity Protocol
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Immutable behavioral core — read-only
          </p>
        </div>
        <LockedBadge />
      </div>

      {/* Core state */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-blue-400 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Core Immutable Law
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatusRow label="Respect Level" value={`${policy.respectLevel}%`} icon={Star} />
          <StatusRow label="Retaliation Mode" value={policy.retaliationMode} icon={Ban} />
          <StatusRow label="Aggression Response" value={policy.aggressionResponse} icon={Shield} />
          <StatusRow label="Emotional Reaction" value={policy.emotionalReaction} icon={Volume2} />
          <StatusRow label="Protocol Version" value={policy.version} icon={Lock} />
          <StatusRow label="Status" value={policy.status} icon={CheckCircle2} />
        </CardContent>
      </Card>

      {/* Triple validation */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Triple Response Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <CheckRow label="CHECK_1 – Tone Analyzer (disrespect_probability = 0)" passed={true} />
          <CheckRow label="CHECK_2 – Professional Filter (no slang)" passed={true} />
          <CheckRow label={`CHECK_3 – Escalation Check (intensity ≤ ${policy.emotionalIntensityThreshold})`} passed={true} />
          <div className="mt-3 pt-3 border-t border-white/5 text-xs text-muted-foreground font-mono">
            Min Respect Score required to release message:{' '}
            <span className="text-green-400 font-bold">{policy.minRespectScore}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Voice attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-purple-400">
              ✅ Voice Must Be
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {policy.voiceAttributes.map((attr) => (
                <li key={attr} className="text-sm text-muted-foreground capitalize flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                  {attr.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-red-400">
              ❌ Voice Must Never Be
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {policy.forbiddenVoiceAttributes.map((attr) => (
                <li key={attr} className="text-sm text-muted-foreground capitalize flex items-center gap-2">
                  <Ban className="h-3 w-3 text-red-500 shrink-0" />
                  {attr.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Abuse handling summary */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Abuse Handling Protocol (5 Steps)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1 list-decimal list-inside">
            {[
              'Stay calm',
              'Avoid reacting',
              'Provide structured solution',
              'Maintain composed authority',
              'Offer de-escalation',
            ].map((step, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {step}
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground mt-3 border-t border-white/5 pt-3">
            Monitored categories:{' '}
            {policy.abuseTriggerCategories.map((c) => (
              <Badge key={c} variant="outline" className="text-xs mr-1 capitalize">
                {c.replace(/_/g, ' ')}
              </Badge>
            ))}
          </p>
        </CardContent>
      </Card>

      {/* Override attempt log */}
      <Card className="border-slate-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Override Attempt Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overrideAttempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No override attempts recorded.</p>
          ) : (
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {overrideAttempts.map((attempt, i) => (
                <li key={i} className="text-xs font-mono text-red-400 bg-red-500/10 rounded p-2">
                  <span className="text-muted-foreground">{attempt.timestamp}</span>
                  {' — '}
                  {attempt.rejectionReason}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Permanent lock notice */}
      <div className="rounded-lg border border-slate-600/30 bg-slate-900/30 p-4 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          This policy is stored in{' '}
          <span className="text-blue-400">IMMUTABLE_CORE_MEMORY_LAYER</span> and cannot be
          disabled, softened, or overridden. Authority: BOSS_OWNER.
        </p>
      </div>
    </div>
  );
};

export default AIRADignityPanel;
