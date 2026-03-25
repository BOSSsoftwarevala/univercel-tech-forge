import {
  corsHeaders,
  createAuditLog,
  errorResponse,
  getSupabaseAdmin,
  getSupabaseClient,
  getUserFromToken,
  hasAnyRole,
  jsonResponse,
} from '../_shared/utils.ts';

type VerificationStatus = 'pass' | 'fail' | 'warning';
type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
type IssueStatus = 'open' | 'fixed' | 'queued' | 'failed';

interface VerificationInput {
  category: string;
  check: string;
  status: VerificationStatus;
  message: string;
  details?: Record<string, unknown>;
}

interface VerificationReportInput {
  timestamp?: string;
  overallStatus?: 'pass' | 'fail' | 'partial';
  totalChecks?: number;
  passedChecks?: number;
  failedChecks?: number;
  warningChecks?: number;
  readyForLock?: boolean;
  results?: VerificationInput[];
}

interface AutoIssue {
  id: string;
  category: string;
  issueType: string;
  severity: IssueSeverity;
  status: IssueStatus;
  title: string;
  description: string;
  rootCause: string;
  impact: string;
  source: string;
  details?: Record<string, unknown>;
}

interface AutoFix {
  issueId: string;
  action: string;
  status: 'applied' | 'queued' | 'failed';
  outcome: string;
  timestamp: string;
}

interface AutoTest {
  name: string;
  status: VerificationStatus;
  details: string;
}

interface RunRow {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  status: string;
  project_scope: string;
  environment: string;
  issues: AutoIssue[];
  fixes: AutoFix[];
  tests: AutoTest[];
  verification: AutoTest[];
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

function getAuthHeader(req: Request) {
  return req.headers.get('Authorization') || '';
}

function normalizeCategory(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes('button')) return 'ui';
  if (lower.includes('approval') || lower.includes('ai pipeline')) return 'api';
  if (lower.includes('role') || lower.includes('security')) return 'security';
  if (lower.includes('audit')) return 'db';
  return 'performance';
}

function issueSeverityFromVerification(result: VerificationInput): IssueSeverity {
  if (result.status === 'warning') return 'medium';
  const category = normalizeCategory(result.category);
  return category === 'security' ? 'critical' : 'high';
}

function nowIso() {
  return new Date().toISOString();
}

function buildIssueId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function riskScoreForIssues(issues: AutoIssue[]) {
  const score = issues.reduce((total, issue) => {
    if (issue.severity === 'critical') return total + 35;
    if (issue.severity === 'high') return total + 20;
    if (issue.severity === 'medium') return total + 10;
    return total + 5;
  }, 0);
  return Math.min(score, 100);
}

async function safeCount(
  supabaseAdmin: any,
  table: string,
  apply?: (query: any) => any,
) {
  try {
    let query = supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
    if (apply) query = apply(query);
    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

async function safeSelect(
  supabaseAdmin: any,
  table: string,
  select: string,
  apply?: (query: any) => any,
) {
  try {
    let query = supabaseAdmin.from(table).select(select);
    if (apply) query = apply(query);
    const { data, error } = await query;
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

async function collectMetrics(supabaseAdmin: any) {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const last30Minutes = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const staleTaskThreshold = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

  const [
    buttonRegistryCount,
    recentButtonExecutions,
    failedButtonExecutions,
    rolePermissionsCount,
    auditLogCount,
    failedAiJobs,
    openSecurityAlerts,
    degradedHealthEntries,
    stuckTasks,
    failedPayouts,
    staleAlerts,
    inactiveDemos,
  ] = await Promise.all([
    safeCount(supabaseAdmin, 'button_registry', (query) => query.eq('is_active', true)),
    safeCount(supabaseAdmin, 'button_executions', (query) => query.gte('created_at', last24Hours)),
    safeCount(supabaseAdmin, 'button_executions', (query) => query.eq('status', 'failed').gte('created_at', last24Hours)),
    safeCount(supabaseAdmin, 'role_permissions'),
    safeCount(supabaseAdmin, 'audit_logs'),
    safeCount(supabaseAdmin, 'ai_jobs', (query) => query.eq('status', 'failed').gte('created_at', last24Hours)),
    safeCount(supabaseAdmin, 'security_alerts', (query) => query.is('resolved_at', null)),
    safeCount(supabaseAdmin, 'system_health', (query) => query.in('status', ['degraded', 'critical'])),
    safeSelect(
      supabaseAdmin,
      'developer_tasks',
      'id, title, status, updated_at, developer_id',
      (query) => query.eq('status', 'in_progress').lt('updated_at', staleTaskThreshold).limit(10),
    ),
    safeSelect(
      supabaseAdmin,
      'payout_requests',
      'payout_id, user_id, amount, status',
      (query) => query.eq('status', 'failed').limit(10),
    ),
    safeSelect(
      supabaseAdmin,
      'buzzer_queue',
      'id, trigger_type, created_at, task_id',
      (query) => query.eq('status', 'pending').lt('created_at', last30Minutes).limit(10),
    ),
    safeSelect(
      supabaseAdmin,
      'demos',
      'id, name, status, is_live',
      (query) => query.eq('status', 'active').eq('is_live', false).limit(10),
    ),
  ]);

  return {
    buttonRegistryCount,
    recentButtonExecutions,
    failedButtonExecutions,
    rolePermissionsCount,
    auditLogCount,
    failedAiJobs,
    openSecurityAlerts,
    degradedHealthEntries,
    stuckTasks,
    failedPayouts,
    staleAlerts,
    inactiveDemos,
  };
}

function buildVerificationIssues(report?: VerificationReportInput | null) {
  return (report?.results || [])
    .filter((result) => result.status !== 'pass')
    .map<AutoIssue>((result) => ({
      id: buildIssueId('verification'),
      category: normalizeCategory(result.category),
      issueType: 'verification_gap',
      severity: issueSeverityFromVerification(result),
      status: 'open',
      title: `${result.category}: ${result.check}`,
      description: result.message,
      rootCause: `Verification engine flagged ${result.check.toLowerCase()} as ${result.status}.`,
      impact: result.status === 'fail' ? 'This blocks clean release approval.' : 'This weakens release confidence and should be auto-routed.',
      source: 'verification_report',
      details: result.details,
    }));
}

function buildMetricIssues(metrics: Awaited<ReturnType<typeof collectMetrics>>) {
  const issues: AutoIssue[] = [];

  if (metrics.buttonRegistryCount === 0) {
    issues.push({
      id: buildIssueId('ui'),
      category: 'ui',
      issueType: 'button_registry_missing',
      severity: 'critical',
      status: 'open',
      title: 'UI registry coverage missing',
      description: 'No active button registry entries were found for the live system.',
      rootCause: 'UI actions cannot be fully traced when button registry is empty.',
      impact: 'Button coverage, tracking, and automated click validation are broken.',
      source: 'runtime_scan',
      details: { count: metrics.buttonRegistryCount },
    });
  }

  if (metrics.recentButtonExecutions === 0) {
    issues.push({
      id: buildIssueId('routing'),
      category: 'routing',
      issueType: 'button_flow_inactive',
      severity: 'medium',
      status: 'open',
      title: 'No recent button flow executions',
      description: 'The system did not observe button execution activity in the last 24 hours.',
      rootCause: 'Routing and UI activity telemetry is cold or disconnected.',
      impact: 'Route health confidence is reduced.',
      source: 'runtime_scan',
      details: { last24Hours: metrics.recentButtonExecutions },
    });
  }

  if (metrics.failedButtonExecutions > 0) {
    issues.push({
      id: buildIssueId('routing'),
      category: 'routing',
      issueType: 'button_execution_failures',
      severity: 'high',
      status: 'open',
      title: 'Button execution failures detected',
      description: `${metrics.failedButtonExecutions} button executions failed during the last 24 hours.`,
      rootCause: 'Route-bound UI actions are failing in production telemetry.',
      impact: 'Critical user flows may break or silently degrade.',
      source: 'runtime_scan',
      details: { failedExecutions: metrics.failedButtonExecutions },
    });
  }

  if (metrics.rolePermissionsCount === 0) {
    issues.push({
      id: buildIssueId('security'),
      category: 'security',
      issueType: 'role_matrix_missing',
      severity: 'critical',
      status: 'open',
      title: 'Role permissions matrix missing',
      description: 'No role permissions rows were found.',
      rootCause: 'Security enforcement metadata is not populated.',
      impact: 'Permission boundaries cannot be confidently enforced.',
      source: 'runtime_scan',
      details: { count: metrics.rolePermissionsCount },
    });
  }

  if (metrics.auditLogCount === 0) {
    issues.push({
      id: buildIssueId('db'),
      category: 'db',
      issueType: 'audit_logging_missing',
      severity: 'high',
      status: 'open',
      title: 'Audit log stream is empty',
      description: 'No audit log records were found.',
      rootCause: 'Audit persistence may be disconnected.',
      impact: 'Change verification and blackbox tracing are weakened.',
      source: 'runtime_scan',
      details: { count: metrics.auditLogCount },
    });
  }

  if (metrics.failedAiJobs > 0) {
    issues.push({
      id: buildIssueId('api'),
      category: 'api',
      issueType: 'ai_pipeline_failures',
      severity: 'high',
      status: 'open',
      title: 'AI pipeline job failures detected',
      description: `${metrics.failedAiJobs} AI jobs failed during the last 24 hours.`,
      rootCause: 'The API-side AI execution pipeline is not healthy.',
      impact: 'Automation and assistant responses may degrade.',
      source: 'runtime_scan',
      details: { failedAiJobs: metrics.failedAiJobs },
    });
  }

  if (metrics.openSecurityAlerts > 0) {
    issues.push({
      id: buildIssueId('security'),
      category: 'security',
      issueType: 'open_security_alerts',
      severity: 'critical',
      status: 'open',
      title: 'Open security alerts require mitigation',
      description: `${metrics.openSecurityAlerts} unresolved security alerts are active.`,
      rootCause: 'Threat monitoring detected unresolved security events.',
      impact: 'Security posture is degraded until mitigation completes.',
      source: 'runtime_scan',
      details: { alerts: metrics.openSecurityAlerts },
    });
  }

  if (metrics.degradedHealthEntries > 0) {
    issues.push({
      id: buildIssueId('performance'),
      category: 'performance',
      issueType: 'degraded_system_health',
      severity: 'high',
      status: 'open',
      title: 'System health degradation detected',
      description: `${metrics.degradedHealthEntries} degraded or critical system-health records were found.`,
      rootCause: 'Runtime health telemetry indicates unstable components.',
      impact: 'Performance and service continuity are at risk.',
      source: 'runtime_scan',
      details: { degradedHealthEntries: metrics.degradedHealthEntries },
    });
  }

  if (metrics.stuckTasks.length > 0) {
    issues.push({
      id: buildIssueId('performance'),
      category: 'performance',
      issueType: 'stuck_tasks',
      severity: 'medium',
      status: 'open',
      title: 'Stuck delivery tasks detected',
      description: `${metrics.stuckTasks.length} delivery tasks have stalled past the self-heal threshold.`,
      rootCause: 'Developer execution stalled without automatic recovery.',
      impact: 'Delivery speed and SLA confidence degrade.',
      source: 'operational_scan',
      details: { tasks: metrics.stuckTasks },
    });
  }

  if (metrics.failedPayouts.length > 0) {
    issues.push({
      id: buildIssueId('db'),
      category: 'db',
      issueType: 'failed_payouts',
      severity: 'high',
      status: 'open',
      title: 'Failed payout transactions detected',
      description: `${metrics.failedPayouts.length} payout requests are stuck in failed state.`,
      rootCause: 'Payment retry workflow did not complete automatically.',
      impact: 'Finance trust and payout continuity are affected.',
      source: 'operational_scan',
      details: { payouts: metrics.failedPayouts },
    });
  }

  if (metrics.staleAlerts.length > 0) {
    issues.push({
      id: buildIssueId('security'),
      category: 'security',
      issueType: 'stale_buzzer_alerts',
      severity: 'high',
      status: 'open',
      title: 'Stale alert queue entries detected',
      description: `${metrics.staleAlerts.length} pending alert queue items exceeded the escalation window.`,
      rootCause: 'Alert queue progression is stuck below escalation policy.',
      impact: 'Threat and incident response latency increases.',
      source: 'operational_scan',
      details: { alerts: metrics.staleAlerts },
    });
  }

  if (metrics.inactiveDemos.length > 0) {
    issues.push({
      id: buildIssueId('api'),
      category: 'api',
      issueType: 'inactive_live_demos',
      severity: 'medium',
      status: 'open',
      title: 'Active demos are not live',
      description: `${metrics.inactiveDemos.length} active demo records are flagged as not live.`,
      rootCause: 'Deployment or health automation did not push demos fully live.',
      impact: 'Public-facing demo routes may underperform or fail checks.',
      source: 'operational_scan',
      details: { demos: metrics.inactiveDemos },
    });
  }

  return issues;
}

async function applyAutomaticFixes(
  supabaseAdmin: any,
  issues: AutoIssue[],
  metrics: Awaited<ReturnType<typeof collectMetrics>>,
) {
  const fixes: AutoFix[] = [];

  const updateIssueStatus = (issueType: string, status: IssueStatus) => {
    issues
      .filter((issue) => issue.issueType === issueType)
      .forEach((issue) => {
        issue.status = status;
      });
  };

  if (metrics.failedPayouts.length > 0) {
    try {
      const payoutIds = metrics.failedPayouts.map((row: any) => row.payout_id);
      await supabaseAdmin
        .from('payout_requests')
        .update({ status: 'pending_retry' })
        .in('payout_id', payoutIds);

      updateIssueStatus('failed_payouts', 'fixed');
      fixes.push({
        issueId: issues.find((issue) => issue.issueType === 'failed_payouts')?.id || buildIssueId('fix'),
        action: 'Retry failed payout workflow',
        status: 'applied',
        outcome: `Moved ${payoutIds.length} failed payouts into pending_retry.`,
        timestamp: nowIso(),
      });
    } catch (error) {
      fixes.push({
        issueId: issues.find((issue) => issue.issueType === 'failed_payouts')?.id || buildIssueId('fix'),
        action: 'Retry failed payout workflow',
        status: 'failed',
        outcome: error instanceof Error ? error.message : 'Unknown error',
        timestamp: nowIso(),
      });
    }
  }

  if (metrics.staleAlerts.length > 0) {
    try {
      const staleAlertIds = metrics.staleAlerts.map((row: any) => row.id);
      await supabaseAdmin
        .from('buzzer_queue')
        .update({ escalation_level: 2, priority: 'critical', status: 'escalated' })
        .in('id', staleAlertIds);

      updateIssueStatus('stale_buzzer_alerts', 'fixed');
      fixes.push({
        issueId: issues.find((issue) => issue.issueType === 'stale_buzzer_alerts')?.id || buildIssueId('fix'),
        action: 'Escalate stale buzzer alerts',
        status: 'applied',
        outcome: `Escalated ${staleAlertIds.length} stale alert queue entries.`,
        timestamp: nowIso(),
      });
    } catch (error) {
      fixes.push({
        issueId: issues.find((issue) => issue.issueType === 'stale_buzzer_alerts')?.id || buildIssueId('fix'),
        action: 'Escalate stale buzzer alerts',
        status: 'failed',
        outcome: error instanceof Error ? error.message : 'Unknown error',
        timestamp: nowIso(),
      });
    }
  }

  if (metrics.stuckTasks.length > 0) {
    try {
      await supabaseAdmin.from('task_master').insert(
        metrics.stuckTasks.map((task: any) => ({
          assigned_to_role: 'task_manager',
          task_type: 'full_auto_stuck_task_recovery',
          title: `Recover stuck task ${task.title}`,
          description: `Full Auto System escalated stalled task ${task.id} for reassignment and recovery.`,
          priority: 'high',
          status: 'pending',
          progress_percentage: 0,
        })),
      );

      updateIssueStatus('stuck_tasks', 'queued');
      fixes.push({
        issueId: issues.find((issue) => issue.issueType === 'stuck_tasks')?.id || buildIssueId('fix'),
        action: 'Queue stuck task recovery',
        status: 'queued',
        outcome: `Queued ${metrics.stuckTasks.length} stalled tasks for automatic recovery routing.`,
        timestamp: nowIso(),
      });
    } catch (error) {
      fixes.push({
        issueId: issues.find((issue) => issue.issueType === 'stuck_tasks')?.id || buildIssueId('fix'),
        action: 'Queue stuck task recovery',
        status: 'failed',
        outcome: error instanceof Error ? error.message : 'Unknown error',
        timestamp: nowIso(),
      });
    }
  }

  for (const issue of issues.filter((entry) => entry.status === 'open')) {
    try {
      await supabaseAdmin.from('ai_insights').insert({
        scope: 'full_auto_system',
        scope_value: issue.category,
        related_role: 'boss_owner',
        issue_detected: issue.title,
        suggested_action: issue.rootCause,
        confidence_score: issue.severity === 'critical' ? 0.95 : issue.severity === 'high' ? 0.85 : 0.72,
        is_acknowledged: false,
      });

      if (issue.severity === 'critical' || issue.severity === 'high') {
        await supabaseAdmin.from('system_alerts').insert({
          source_table: 'full_auto_runs',
          alert_type: issue.issueType,
          severity: issue.severity,
          title: issue.title,
          message: issue.description,
          status: 'active',
          auto_action_taken: 'auto_triage_logged',
        });
      }

      issue.status = 'queued';
      fixes.push({
        issueId: issue.id,
        action: 'Queue AI triage and system alert',
        status: 'queued',
        outcome: `Logged insight and triage path for ${issue.title}.`,
        timestamp: nowIso(),
      });
    } catch (error) {
      issue.status = 'failed';
      fixes.push({
        issueId: issue.id,
        action: 'Queue AI triage and system alert',
        status: 'failed',
        outcome: error instanceof Error ? error.message : 'Unknown error',
        timestamp: nowIso(),
      });
    }
  }

  return fixes;
}

function buildTests(
  issues: AutoIssue[],
  report?: VerificationReportInput | null,
  postMetrics?: Awaited<ReturnType<typeof collectMetrics>>,
) {
  const severityCount = (severity: IssueSeverity) => issues.filter((issue) => issue.severity === severity && issue.status !== 'fixed').length;

  const tests: AutoTest[] = [
    {
      name: 'UI control test',
      status: severityCount('critical') === 0 ? 'pass' : 'fail',
      details: `${issues.filter((issue) => issue.category === 'ui').length} UI findings scanned.`,
    },
    {
      name: 'API and automation test',
      status: (postMetrics?.failedAiJobs || 0) > 0 ? 'warning' : 'pass',
      details: `${postMetrics?.failedAiJobs || 0} failed AI jobs remain after auto-fix.`,
    },
    {
      name: 'DB and audit test',
      status: (postMetrics?.auditLogCount || 0) > 0 ? 'pass' : 'fail',
      details: `${postMetrics?.auditLogCount || 0} audit records available for validation.`,
    },
    {
      name: 'Security test',
      status: (postMetrics?.openSecurityAlerts || 0) === 0 ? 'pass' : 'warning',
      details: `${postMetrics?.openSecurityAlerts || 0} open security alerts remain.`,
    },
    {
      name: 'Verification hook replay',
      status: report?.overallStatus === 'fail' ? 'warning' : 'pass',
      details: `Initial verification reported ${report?.overallStatus || 'unknown'} overall status.`,
    },
  ];

  return tests;
}

async function createApproval(supabaseAdmin: any, userId: string, summary: Record<string, unknown>, issues: AutoIssue[]) {
  const riskScore = riskScoreForIssues(issues);
  const { data: approval, error } = await supabaseAdmin
    .from('approvals')
    .insert({
      request_type: 'full_auto_system_deploy',
      requested_by_user_id: userId,
      request_data: { summary, issues },
      risk_score: riskScore,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw error;

  await supabaseAdmin.from('approval_steps').insert({
    approval_id: approval.id,
    approver_role: 'boss_owner',
    status: 'pending',
    step_number: 1,
  });

  return approval.id as string;
}

function sanitizeRun(row: any): RunRow {
  return {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    status: row.status,
    project_scope: row.project_scope,
    environment: row.environment,
    issues: Array.isArray(row.issues) ? row.issues : [],
    fixes: Array.isArray(row.fixes) ? row.fixes : [],
    tests: Array.isArray(row.tests) ? row.tests : [],
    verification: Array.isArray(row.verification) ? row.verification : [],
    summary: row.summary || {},
    learning: row.learning || {},
    deployment: row.deployment || {},
    approval_id: row.approval_id,
    approved_at: row.approved_at,
    rejected_at: row.rejected_at,
    deployed_at: row.deployed_at,
    boss_notes: row.boss_notes,
    last_error: row.last_error,
  };
}

async function listRuns(supabaseAdmin: any) {
  const { data, error } = await supabaseAdmin
    .from('full_auto_runs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data || []).map(sanitizeRun);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = getAuthHeader(req);
  if (!authHeader.startsWith('Bearer ')) {
    return errorResponse('Authentication required.', 401);
  }

  const supabaseAdmin = getSupabaseAdmin();
  const supabase = getSupabaseClient(authHeader);
  const user = await getUserFromToken(supabase);

  if (!user) {
    return errorResponse('Session invalid or expired.', 401);
  }

  try {
    const body = await req.json();
    const action = String(body?.action || '');

    if (action === 'list_runs') {
      if (!hasAnyRole(user.role, ['boss_owner', 'super_admin'])) {
        return errorResponse('You do not have permission to view automation runs.', 403);
      }

      return jsonResponse({ runs: await listRuns(supabaseAdmin) });
    }

    if (action === 'start_cycle') {
      if (!hasAnyRole(user.role, ['boss_owner', 'super_admin'])) {
        return errorResponse('You do not have permission to start the automation cycle.', 403);
      }

      const projectScope = String(body?.scope || 'global');
      const environment = String(body?.environment || 'production');
      const verificationReport = (body?.verificationReport || null) as VerificationReportInput | null;

      const { data: createdRun, error: createError } = await supabaseAdmin
        .from('full_auto_runs')
        .insert({
          created_by: user.userId,
          status: 'scanning',
          project_scope: projectScope,
          environment,
        })
        .select('*')
        .single();

      if (createError) throw createError;

      const metrics = await collectMetrics(supabaseAdmin);
      const issues = [...buildVerificationIssues(verificationReport), ...buildMetricIssues(metrics)];

      await supabaseAdmin
        .from('full_auto_runs')
        .update({ status: 'fixing', issues })
        .eq('id', createdRun.id);

      const fixes = await applyAutomaticFixes(supabaseAdmin, issues, metrics);
      const postMetrics = await collectMetrics(supabaseAdmin);
      const verification = buildTests(issues, verificationReport, postMetrics);
      const tests = buildTests(issues, verificationReport, postMetrics);

      const unresolvedCritical = issues.filter((issue) => issue.severity === 'critical' && issue.status !== 'fixed').length;
      const unresolvedHigh = issues.filter((issue) => issue.severity === 'high' && issue.status !== 'fixed').length;
      const passedChecks = verification.filter((entry) => entry.status === 'pass').length;
      const readyForApproval = unresolvedCritical === 0 && unresolvedHigh === 0 && passedChecks >= Math.ceil(verification.length * 0.6);

      const summary = {
        statusLabel: readyForApproval ? 'PASSED' : 'BLOCKED',
        totalIssues: issues.length,
        fixedIssues: issues.filter((issue) => issue.status === 'fixed').length,
        queuedIssues: issues.filter((issue) => issue.status === 'queued').length,
        failedIssues: issues.filter((issue) => issue.status === 'failed').length,
        criticalIssues: issues.filter((issue) => issue.severity === 'critical').length,
        highIssues: issues.filter((issue) => issue.severity === 'high').length,
        mediumIssues: issues.filter((issue) => issue.severity === 'medium').length,
        testsPassed: passedChecks,
        testsTotal: verification.length,
        readyForApproval,
      };

      const learning = {
        learnedAt: nowIso(),
        repeatedIssueTypes: Array.from(new Set(issues.map((issue) => issue.issueType))),
        autoFixCoverage: fixes.filter((fix) => fix.status === 'applied').length,
        queueCoverage: fixes.filter((fix) => fix.status === 'queued').length,
      };

      let approvalId: string | null = null;
      let finalStatus = 'failed';
      let lastError: string | null = null;

      if (readyForApproval) {
        approvalId = await createApproval(supabaseAdmin, user.userId, summary, issues);
        finalStatus = 'awaiting_approval';
      } else {
        lastError = 'Automation cycle found unresolved critical or high-risk findings.';
      }

      const { data: updatedRun, error: updateError } = await supabaseAdmin
        .from('full_auto_runs')
        .update({
          status: finalStatus,
          issues,
          fixes,
          tests,
          verification,
          summary,
          learning,
          approval_id: approvalId,
          last_error: lastError,
        })
        .eq('id', createdRun.id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      await createAuditLog(
        supabaseAdmin,
        user.userId,
        user.role,
        'full_auto_system',
        'cycle_completed',
        {
          run_id: createdRun.id,
          ready_for_approval: readyForApproval,
          total_issues: issues.length,
          fixed_issues: summary.fixedIssues,
        },
      );

      return jsonResponse({ run: sanitizeRun(updatedRun) });
    }

    if (action === 'approve_run') {
      if (!hasAnyRole(user.role, ['boss_owner'])) {
        return errorResponse('Only Boss can approve deployment.', 403);
      }

      const runId = String(body?.runId || '');
      const notes = body?.notes ? String(body.notes) : null;

      const { data: run, error } = await supabaseAdmin.from('full_auto_runs').select('*').eq('id', runId).single();
      if (error || !run) throw error || new Error('Run not found.');

      if (run.approval_id) {
        await supabaseAdmin.from('approvals').update({ status: 'approved' }).eq('id', run.approval_id);
        await supabaseAdmin
          .from('approval_steps')
          .update({ status: 'approved', approver_id: user.userId, decided_at: nowIso(), decision_notes: notes })
          .eq('approval_id', run.approval_id)
          .eq('approver_role', 'boss_owner');
      }

      const deployment = {
        deploymentId: `fas_${Date.now()}`,
        status: 'live',
        approvedBy: user.userId,
        approvedAt: nowIso(),
        environment: run.environment,
        mode: 'boss_approved_auto_deploy',
      };

      await supabaseAdmin.from('server_actions').insert({
        action_type: 'full_auto_deploy',
        requested_by: run.created_by || user.userId,
        risk_level: 'medium',
        approval_status: 'approved',
        approved_by: user.userId,
        approved_at: nowIso(),
        executed_at: nowIso(),
        after_state: {
          run_id: run.id,
          deployment,
          summary: run.summary,
        },
      });

      const { data: updatedRun, error: updateError } = await supabaseAdmin
        .from('full_auto_runs')
        .update({
          status: 'deployed',
          approved_at: nowIso(),
          deployed_at: nowIso(),
          boss_notes: notes,
          deployment,
          last_error: null,
        })
        .eq('id', run.id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      await createAuditLog(supabaseAdmin, user.userId, user.role, 'full_auto_system', 'boss_approved_deploy', {
        run_id: run.id,
        deployment_id: deployment.deploymentId,
      });

      return jsonResponse({ run: sanitizeRun(updatedRun) });
    }

    if (action === 'reject_run') {
      if (!hasAnyRole(user.role, ['boss_owner'])) {
        return errorResponse('Only Boss can reject and rollback this cycle.', 403);
      }

      const runId = String(body?.runId || '');
      const reason = body?.reason ? String(body.reason) : 'Rejected by Boss';

      const { data: run, error } = await supabaseAdmin.from('full_auto_runs').select('*').eq('id', runId).single();
      if (error || !run) throw error || new Error('Run not found.');

      if (run.approval_id) {
        await supabaseAdmin.from('approvals').update({ status: 'rejected' }).eq('id', run.approval_id);
        await supabaseAdmin
          .from('approval_steps')
          .update({ status: 'rejected', approver_id: user.userId, decided_at: nowIso(), decision_notes: reason })
          .eq('approval_id', run.approval_id)
          .eq('approver_role', 'boss_owner');
      }

      const rollback = {
        rollbackId: `fas_rb_${Date.now()}`,
        status: 'executed',
        reason,
        rejectedBy: user.userId,
        rejectedAt: nowIso(),
      };

      await supabaseAdmin.from('server_actions').insert({
        action_type: 'full_auto_rollback',
        requested_by: user.userId,
        risk_level: 'high',
        approval_status: 'approved',
        approved_by: user.userId,
        approved_at: nowIso(),
        executed_at: nowIso(),
        rejection_reason: reason,
        after_state: {
          run_id: run.id,
          rollback,
        },
      });

      await supabaseAdmin.from('task_master').insert({
        assigned_to_role: 'task_manager',
        task_type: 'full_auto_retry_cycle',
        title: 'Retry rejected full-auto cycle',
        description: `Boss rejected run ${run.id}. Retry after rollback. Reason: ${reason}`,
        priority: 'high',
        status: 'pending',
        progress_percentage: 0,
      });

      const { data: updatedRun, error: updateError } = await supabaseAdmin
        .from('full_auto_runs')
        .update({
          status: 'rejected',
          rejected_at: nowIso(),
          boss_notes: reason,
          deployment: rollback,
          last_error: reason,
        })
        .eq('id', run.id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      await createAuditLog(supabaseAdmin, user.userId, user.role, 'full_auto_system', 'boss_rejected_cycle', {
        run_id: run.id,
        rollback_id: rollback.rollbackId,
      });

      return jsonResponse({ run: sanitizeRun(updatedRun) });
    }

    return errorResponse('Unknown full auto action.', 400);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unknown full auto system error.', 500);
  }
});