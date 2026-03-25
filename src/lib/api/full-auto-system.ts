import { supabase } from '@/integrations/supabase/client';

export type FullAutoStatus =
  | 'scanning'
  | 'fixing'
  | 'awaiting_approval'
  | 'deployed'
  | 'rejected'
  | 'failed';

export type FullAutoSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FullAutoIssueStatus = 'open' | 'fixed' | 'queued' | 'failed';
export type FullAutoCheckStatus = 'pass' | 'fail' | 'warning';

export interface FullAutoIssue {
  id: string;
  category: string;
  issueType: string;
  severity: FullAutoSeverity;
  status: FullAutoIssueStatus;
  title: string;
  description: string;
  rootCause: string;
  impact: string;
  source: string;
  details?: Record<string, unknown>;
}

export interface FullAutoFix {
  issueId: string;
  action: string;
  status: 'applied' | 'queued' | 'failed';
  outcome: string;
  timestamp: string;
}

export interface FullAutoCheck {
  name: string;
  status: FullAutoCheckStatus;
  details: string;
}

export interface FullAutoRun {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  status: FullAutoStatus;
  project_scope: string;
  environment: string;
  issues: FullAutoIssue[];
  fixes: FullAutoFix[];
  tests: FullAutoCheck[];
  verification: FullAutoCheck[];
  summary: Record<string, unknown>;
  learning: Record<string, unknown>;
  deployment: Record<string, unknown>;
  approval_id: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  deployed_at: string | null;
  boss_notes: string | null;
  last_error: string | null;
}

export interface VerificationResultInput {
  category: string;
  check: string;
  status: FullAutoCheckStatus;
  message: string;
  details?: Record<string, unknown>;
}

export interface VerificationReportInput {
  timestamp: string;
  overallStatus: 'pass' | 'fail' | 'partial';
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  readyForLock: boolean;
  results: VerificationResultInput[];
}

async function invokeFullAuto<T>(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('api-full-auto-system', { body });

  if (error) {
    throw error;
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Full Auto System request failed.');
  }

  return data.data as T;
}

export const fullAutoSystemApi = {
  async listRuns() {
    return invokeFullAuto<{ runs: FullAutoRun[] }>({ action: 'list_runs' });
  },
  async startCycle(payload: { scope?: string; environment?: string; verificationReport?: VerificationReportInput }) {
    return invokeFullAuto<{ run: FullAutoRun }>({
      action: 'start_cycle',
      scope: payload.scope || 'global',
      environment: payload.environment || 'production',
      verificationReport: payload.verificationReport,
    });
  },
  async approveRun(runId: string, notes?: string) {
    return invokeFullAuto<{ run: FullAutoRun }>({ action: 'approve_run', runId, notes });
  },
  async rejectRun(runId: string, reason: string) {
    return invokeFullAuto<{ run: FullAutoRun }>({ action: 'reject_run', runId, reason });
  },
};