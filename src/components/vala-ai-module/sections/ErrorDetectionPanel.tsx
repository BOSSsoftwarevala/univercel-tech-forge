/**
 * VALA AI - Error Detection Panel
 * Production-line diagnostics + tool checks
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bug, CheckCircle2, RefreshCw, Wrench, Activity, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type FindingLevel = 'info' | 'warning' | 'error';

interface Finding {
  id: string;
  level: FindingLevel;
  title: string;
  detail: string;
  module: string;
  time: string;
}

const MOCK_FINDINGS: Finding[] = [
  { id: 'f1', level: 'warning', title: 'Preview not updated', detail: 'AI output contains code but preview renderer not detected.', module: 'Builder UI', time: 'now' },
  { id: 'f2', level: 'info', title: 'Pipeline idle', detail: 'No queued builds in auto builder.', module: 'Auto Builder', time: '2 min ago' },
  { id: 'f3', level: 'error', title: 'TTS test recommended', detail: 'Voice service should be tested after deploy.', module: 'Voice', time: '5 min ago' },
];

const levelMeta: Record<FindingLevel, { label: string; icon: React.ElementType; className: string }> = {
  info: { label: 'INFO', icon: Activity, className: 'bg-muted/40 text-muted-foreground' },
  warning: { label: 'WARN', icon: AlertTriangle, className: 'bg-primary/10 text-primary' },
  error: { label: 'ERROR', icon: Bug, className: 'bg-destructive/10 text-destructive' },
};

async function quickToolCheck() {
  // Minimal, safe checks: builder SSE endpoint should return 200 and some data
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vala-ai-builder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'healthcheck: reply only OK' }] }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const t = await resp.text();
      return { ok: false, message: `vala-ai-builder: ${resp.status} ${t.slice(0, 120)}` };
    }

    // Consume a small chunk to ensure stream is alive
    const reader = resp.body?.getReader();
    if (!reader) return { ok: false, message: 'vala-ai-builder: no stream body' };
    await reader.read();

    return { ok: true, message: 'vala-ai-builder: OK' };
  } catch (e: any) {
    return { ok: false, message: `vala-ai-builder: ${e?.message || 'failed'}` };
  } finally {
    clearTimeout(timeout);
  }
}

const ErrorDetectionPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<{ ok: boolean; message: string } | null>(null);

  const counts = useMemo(() => {
    return {
      total: MOCK_FINDINGS.length,
      errors: MOCK_FINDINGS.filter(f => f.level === 'error').length,
      warnings: MOCK_FINDINGS.filter(f => f.level === 'warning').length,
    };
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const res = await quickToolCheck();
    setLastCheck(res);
    setIsRunning(false);

    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-destructive/10">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Error Detection</h1>
            <p className="text-xs text-muted-foreground">
              {counts.total} findings • {counts.errors} errors • {counts.warnings} warnings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="h-8 px-3 text-xs gap-1.5" onClick={runDiagnostics} disabled={isRunning}>
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            Run Diagnostics
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {lastCheck && (
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                {lastCheck.ok ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Bug className="w-4 h-4 text-destructive" />}
                <div>
                  <p className="text-sm font-semibold text-foreground">Tool Check</p>
                  <p className="text-xs text-muted-foreground">{lastCheck.message}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Production Line</p>
                  <p className="text-[11px] text-muted-foreground">Diagnostics + tool health</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <Wrench className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Auto Fix</p>
                  <p className="text-[11px] text-muted-foreground">Safe fixes only</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <Activity className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Live Monitor</p>
                  <p className="text-[11px] text-muted-foreground">Realtime checks</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/60 border-border/50">
            <CardContent className="p-2">
              {MOCK_FINDINGS.map((f, i) => {
                const meta = levelMeta[f.level];
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <Icon className="w-4 h-4 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${meta.className}`}>{meta.label}</span>
                        <span className="text-xs font-semibold text-foreground truncate">{f.title}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground shrink-0">{f.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{f.detail}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Module: {f.module}</p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ErrorDetectionPanel;
