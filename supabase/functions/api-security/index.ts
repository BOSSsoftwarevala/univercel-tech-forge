import { withEnhancedMiddleware } from '../_shared/enhanced-middleware.ts';
import { errorResponse, jsonResponse } from '../_shared/utils.ts';

const SECURITY_MANAGER_ROLES = ['boss_owner', 'master', 'super_admin', 'ceo', 'admin', 'api_security', 'finance_manager'];
const SESSION_TIMEOUT_MINUTES = 30;

function getRequestMeta(req: Request) {
  const url = new URL(req.url);
  return {
    url,
    method: req.method,
    path: url.pathname.replace(/^.*\/api-security/, '') || '/',
  };
}

function matchesPath(path: string, ...candidates: string[]) {
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return candidates.includes(normalizedPath);
}

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function roundMetric(value: unknown) {
  return Number(toNumber(value).toFixed(2));
}

function normalizeLower(value: unknown, fallback = '') {
  return String(value || fallback).trim().toLowerCase();
}

function maskIpAddress(ipAddress: string | null | undefined) {
  if (!ipAddress) return 'unknown';
  const parts = String(ipAddress).split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return `${String(ipAddress).slice(0, 6)}***`;
}

function parseDeviceInfo(value: string | null | undefined) {
  if (!value) return {} as Record<string, unknown>;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return { raw: value } as Record<string, unknown>;
  }
}

function inferBrowser(userAgent: string | null | undefined) {
  const agent = String(userAgent || '').toLowerCase();
  if (agent.includes('edg')) return 'Edge';
  if (agent.includes('chrome')) return 'Chrome';
  if (agent.includes('safari')) return 'Safari';
  if (agent.includes('firefox')) return 'Firefox';
  return 'Unknown';
}

function inferOs(userAgent: string | null | undefined) {
  const agent = String(userAgent || '').toLowerCase();
  if (agent.includes('windows')) return 'Windows';
  if (agent.includes('mac os')) return 'macOS';
  if (agent.includes('android')) return 'Android';
  if (agent.includes('iphone') || agent.includes('ipad') || agent.includes('ios')) return 'iOS';
  if (agent.includes('linux')) return 'Linux';
  return 'Unknown';
}

function requiresManager(role: string) {
  return SECURITY_MANAGER_ROLES.includes(role);
}

async function writeImmutableSecurityLog(
  supabaseAdmin: any,
  eventType: string,
  userId: string | null,
  clientIP: string,
  deviceId: string,
  details: Record<string, unknown>,
) {
  await supabaseAdmin.rpc('log_security_event', {
    p_event_type: eventType,
    p_user_id: userId,
    p_ip_address: clientIP,
    p_device_fingerprint: deviceId,
    p_action_details: details,
  });
}

async function createSecurityAlert(
  supabaseAdmin: any,
  alert: {
    alertType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    userId?: string | null;
    sessionId?: string | null;
    relatedIp?: string | null;
    relatedCountry?: string | null;
    riskScore?: number;
    sourceTable?: string | null;
    sourceId?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { data } = await supabaseAdmin
    .from('security_live_alerts')
    .insert({
      alert_type: alert.alertType,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      user_id: alert.userId || null,
      session_id: alert.sessionId || null,
      related_ip: alert.relatedIp || null,
      related_country: alert.relatedCountry || null,
      risk_score: roundMetric(alert.riskScore || 0),
      source_table: alert.sourceTable || null,
      source_id: alert.sourceId || null,
      metadata: alert.metadata || {},
    })
    .select('*')
    .single();

  return data;
}

async function recordIncidentResponse(
  supabaseAdmin: any,
  response: {
    responseType: string;
    actorUserId?: string | null;
    actorRole?: string | null;
    targetUserId?: string | null;
    targetSessionId?: string | null;
    relatedAlertId?: string | null;
    responseNotes?: string | null;
    payload?: Record<string, unknown>;
  },
) {
  await supabaseAdmin.from('security_incident_responses').insert({
    response_type: response.responseType,
    actor_user_id: response.actorUserId || null,
    actor_role: response.actorRole || null,
    target_user_id: response.targetUserId || null,
    target_session_id: response.targetSessionId || null,
    related_alert_id: response.relatedAlertId || null,
    response_notes: response.responseNotes || null,
    payload: response.payload || {},
  });
}

function buildRolePermissionMatrix() {
  return {
    boss: ['all', 'security', 'finance', 'alerts', 'response', 'audit'],
    admin: ['security', 'alerts', 'session_control', 'audit'],
    finance: ['finance_guard', 'payout_security', 'security_logs'],
    influencer: ['self_session', 'self_logs', 'self_2fa'],
    reseller: ['self_session', 'self_logs', 'self_2fa'],
    franchise: ['self_session', 'self_logs', 'self_2fa'],
  };
}

async function getGlobalSettings(supabaseAdmin: any) {
  const { data } = await supabaseAdmin
    .from('security_control_settings')
    .select('*')
    .eq('settings_key', 'global')
    .maybeSingle();

  return data;
}

async function syncRiskProfile(
  supabaseAdmin: any,
  userId: string,
  payload: Record<string, unknown>,
) {
  const { data } = await supabaseAdmin
    .from('security_user_risk_profiles')
    .upsert({
      user_id: userId,
      ...payload,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select('*')
    .single();

  return data;
}

async function buildOverview(supabaseAdmin: any) {
  const [
    settings,
    activeSessionsResult,
    alertResult,
    breachResult,
    twoFactorResult,
    allUsersResult,
    riskResult,
    payoutResult,
    logsResult,
  ] = await Promise.all([
    getGlobalSettings(supabaseAdmin),
    supabaseAdmin.from('user_sessions').select('*').eq('is_active', true).order('last_activity_at', { ascending: false }).limit(8),
    supabaseAdmin.from('security_live_alerts').select('*').order('created_at', { ascending: false }).limit(8),
    supabaseAdmin.from('security_breach_attempts').select('*').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('user_2fa_settings').select('user_id,is_2fa_enabled,preferred_method,authenticator_verified,require_otp_for_login,require_otp_for_actions').limit(1000),
    supabaseAdmin.from('user_roles').select('user_id').limit(5000),
    supabaseAdmin.from('security_user_risk_profiles').select('*').order('threat_score', { ascending: false }).limit(20),
    supabaseAdmin.from('finance_payouts').select('id,amount,risk_score,payout_status,approval_status,target_type,created_at').gte('risk_score', 70).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('immutable_security_log').select('*').order('created_at', { ascending: false }).limit(12),
  ]);

  const activeSessions = activeSessionsResult.data || [];
  const alerts = alertResult.data || [];
  const breachAttempts = breachResult.data || [];
  const twoFactorRows = twoFactorResult.data || [];
  const totalUsers = new Set((allUsersResult.data || []).map((row: any) => row.user_id)).size;
  const riskProfiles = riskResult.data || [];
  const financePayouts = payoutResult.data || [];
  const recentLogs = logsResult.data || [];

  const openAlerts = alerts.filter((alert: any) => ['open', 'acknowledged', 'investigating', 'blocked'].includes(alert.status));
  const suspiciousSessions = activeSessions.filter((session: any) => toNumber(session.risk_score) >= 70 || session.forced_reauth);
  const enabled2fa = twoFactorRows.filter((row: any) => row.is_2fa_enabled).length;
  const adoptionRate = totalUsers > 0 ? roundMetric((enabled2fa / totalUsers) * 100) : 0;
  const recentBreaches = breachAttempts.filter((attempt: any) => {
    const createdAt = new Date(attempt.created_at).getTime();
    return Date.now() - createdAt <= 24 * 60 * 60 * 1000;
  });

  const hotspots = Object.values(
    breachAttempts.reduce((acc: Record<string, any>, attempt: any) => {
      const key = attempt.attempt_type || 'unknown';
      if (!acc[key]) {
        acc[key] = { type: key, count: 0, maxSeverity: attempt.severity || 'medium' };
      }
      acc[key].count += 1;
      if (attempt.severity === 'critical') acc[key].maxSeverity = 'critical';
      else if (attempt.severity === 'high' && acc[key].maxSeverity !== 'critical') acc[key].maxSeverity = 'high';
      return acc;
    }, {})
  ).sort((left: any, right: any) => right.count - left.count).slice(0, 6);

  return {
    summary: {
      active_sessions: activeSessions.length,
      suspicious_sessions: suspiciousSessions.length,
      open_alerts: openAlerts.length,
      blocked_attempts_24h: recentBreaches.filter((attempt: any) => attempt.blocked !== false).length,
      2fa_adoption_rate: adoptionRate,
      locked_accounts: riskProfiles.filter((profile: any) => ['locked', 'disabled'].includes(profile.account_status)).length,
      finance_high_risk_payouts: financePayouts.length,
      zero_trust_enabled: Boolean(settings?.zero_trust_enabled),
    },
    controls: settings,
    recent_alerts: alerts,
    recent_logs: recentLogs,
    high_risk_sessions: suspiciousSessions,
    threat_hotspots: hotspots,
    finance_watch: financePayouts,
    risk_profiles: riskProfiles.slice(0, 8),
    permission_matrix: buildRolePermissionMatrix(),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok');
  }

  const { url, method, path } = getRequestMeta(req);

  if (method === 'GET' && matchesPath(path, '/overview')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const overview = await buildOverview(ctx.supabaseAdmin);
      return jsonResponse(overview);
    }, {
      module: 'security',
      action: 'overview',
      allowedRoles: SECURITY_MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (method === 'GET' && matchesPath(path, '/sessions')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const manager = requiresManager(ctx.user!.role);
      const targetUserId = url.searchParams.get('user_id') || (manager ? null : ctx.user!.userId);
      const limit = Math.min(200, Math.max(1, toNumber(url.searchParams.get('limit'), 50)));

      let query = ctx.supabaseAdmin
        .from('user_sessions')
        .select('*')
        .order('last_activity_at', { ascending: false })
        .limit(limit);

      if (targetUserId) {
        query = query.eq('user_id', targetUserId);
      }

      const { data: rows, error } = await query;
      if (error) return errorResponse(error.message, 400);

      const sessions = (rows || []).map((row: any) => {
        const deviceInfo = parseDeviceInfo(row.device_info);
        const userAgent = String(deviceInfo.userAgent || '');
        return {
          ...row,
          active_role: row.active_role || deviceInfo.activeRole || null,
          browser: row.browser || inferBrowser(userAgent),
          os: row.os || inferOs(userAgent),
          masked_ip: maskIpAddress(row.ip_address),
          device_label: deviceInfo.label || `${inferBrowser(userAgent)} on ${inferOs(userAgent)}`,
        };
      });

      return jsonResponse({
        sessions,
        summary: {
          active_count: sessions.filter((session: any) => session.is_active).length,
          forced_reauth_count: sessions.filter((session: any) => session.forced_reauth).length,
          high_risk_count: sessions.filter((session: any) => toNumber(session.risk_score) >= 70).length,
        },
      });
    }, {
      module: 'security',
      action: 'sessions',
      detectFraud: true,
    });
  }

  if (method === 'POST' && matchesPath(path, '/sessions/logout')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const sessionId = String(ctx.body.session_id || '');
      if (!sessionId) return errorResponse('session_id is required.', 400);

      const { data: session } = await ctx.supabaseAdmin
        .from('user_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (!session) return errorResponse('Session not found.', 404);
      if (session.user_id !== ctx.user!.userId && !requiresManager(ctx.user!.role)) {
        return errorResponse('You can only revoke your own session.', 403);
      }

      await ctx.supabaseAdmin
        .from('user_sessions')
        .update({
          is_active: false,
          force_logout_flag: true,
          logout_at: new Date().toISOString(),
          revoked_reason: String(ctx.body.reason || 'revoked_from_security_center'),
        })
        .eq('id', sessionId);

      await recordIncidentResponse(ctx.supabaseAdmin, {
        responseType: 'session_revoked',
        actorUserId: ctx.user!.userId,
        actorRole: ctx.user!.role,
        targetUserId: session.user_id,
        targetSessionId: sessionId,
        responseNotes: ctx.body.reason ? String(ctx.body.reason) : null,
        payload: { source: 'security.sessions.logout' },
      });

      await writeImmutableSecurityLog(ctx.supabaseAdmin, 'session_revoked', ctx.user!.userId, ctx.clientIP, ctx.deviceId, {
        target_user_id: session.user_id,
        session_id: sessionId,
      });

      return jsonResponse({ success: true, session_id: sessionId, revoked: true });
    }, {
      module: 'security',
      action: 'session_logout',
      detectFraud: true,
    });
  }

  if (method === 'GET' && matchesPath(path, '/alerts')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const limit = Math.min(200, Math.max(1, toNumber(url.searchParams.get('limit'), 50)));
      const { data: alerts, error } = await ctx.supabaseAdmin
        .from('security_live_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return errorResponse(error.message, 400);

      const items = alerts || [];
      return jsonResponse({
        alerts: items,
        counts: {
          total: items.length,
          active: items.filter((item: any) => ['open', 'acknowledged', 'investigating'].includes(item.status)).length,
          blocked: items.filter((item: any) => item.status === 'blocked').length,
          resolved: items.filter((item: any) => item.status === 'resolved').length,
        },
      });
    }, {
      module: 'security',
      action: 'alerts',
      allowedRoles: SECURITY_MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (method === 'POST' && matchesPath(path, '/alerts/respond')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const alertId = String(ctx.body.alert_id || '');
      const status = normalizeLower(ctx.body.status);
      if (!alertId || !['acknowledged', 'investigating', 'blocked', 'resolved'].includes(status)) {
        return errorResponse('alert_id and a valid status are required.', 400);
      }

      const updatePayload: Record<string, unknown> = { status };
      if (status === 'acknowledged') {
        updatePayload.acknowledged_by = ctx.user!.userId;
        updatePayload.acknowledged_at = new Date().toISOString();
      }
      if (status === 'resolved') {
        updatePayload.resolved_by = ctx.user!.userId;
        updatePayload.resolved_at = new Date().toISOString();
      }

      const { data: alert, error } = await ctx.supabaseAdmin
        .from('security_live_alerts')
        .update(updatePayload)
        .eq('id', alertId)
        .select('*')
        .single();

      if (error || !alert) return errorResponse(error?.message || 'Alert not found.', 404);

      await recordIncidentResponse(ctx.supabaseAdmin, {
        responseType: status === 'resolved' ? 'alert_resolved' : 'alert_acknowledged',
        actorUserId: ctx.user!.userId,
        actorRole: ctx.user!.role,
        targetUserId: alert.user_id,
        relatedAlertId: alert.id,
        responseNotes: ctx.body.notes ? String(ctx.body.notes) : null,
        payload: { next_status: status },
      });

      await writeImmutableSecurityLog(ctx.supabaseAdmin, 'alert_response', ctx.user!.userId, ctx.clientIP, ctx.deviceId, {
        alert_id: alertId,
        status,
      });

      return jsonResponse({ success: true, alert });
    }, {
      module: 'security',
      action: 'alert_response',
      allowedRoles: SECURITY_MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (method === 'GET' && matchesPath(path, '/logs', '/audit')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const limit = Math.min(200, Math.max(1, toNumber(url.searchParams.get('limit'), 100)));
      const manager = requiresManager(ctx.user!.role);

      let logQuery = ctx.supabaseAdmin
        .from('immutable_security_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!manager) {
        logQuery = logQuery.eq('user_id', ctx.user!.userId);
      }

      const { data: logs, error } = await logQuery;
      if (error) return errorResponse(error.message, 400);

      const normalizedLogs = (logs || []).map((row: any) => ({
        ...row,
        masked_ip: maskIpAddress(row.ip_address),
      }));

      return jsonResponse({ logs: normalizedLogs, immutable: true, editable: false, deletable: false });
    }, {
      module: 'security',
      action: 'logs',
      detectFraud: true,
    });
  }

  if (method === 'GET' && matchesPath(path, '/permission')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      return jsonResponse({
        user_role: ctx.user!.role,
        manager_access: requiresManager(ctx.user!.role),
        permission_matrix: buildRolePermissionMatrix(),
      });
    }, {
      module: 'security',
      action: 'permission',
      detectFraud: true,
    });
  }

  if (method === 'POST' && matchesPath(path, '/2fa/enable')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const targetUserId = String(ctx.body.user_id || ctx.user!.userId);
      if (targetUserId !== ctx.user!.userId && !requiresManager(ctx.user!.role)) {
        return errorResponse('You can only manage your own 2FA settings.', 403);
      }

      const preferredMethod = normalizeLower(ctx.body.preferred_method, 'email');
      if (!['email', 'sms', 'authenticator'].includes(preferredMethod)) {
        return errorResponse('preferred_method must be email, sms, or authenticator.', 400);
      }

      const backupCodes = ctx.body.generate_backup_codes
        ? ((await ctx.supabaseAdmin.rpc('generate_backup_codes', { p_user_id: targetUserId })).data || [])
        : [];

      const authenticatorSecret = preferredMethod === 'authenticator'
        ? String(ctx.body.authenticator_secret || Array.from(crypto.getRandomValues(new Uint8Array(20))).map((item) => item.toString(16).padStart(2, '0')).join('').toUpperCase())
        : null;

      const { data: settings, error } = await ctx.supabaseAdmin
        .from('user_2fa_settings')
        .upsert({
          user_id: targetUserId,
          is_2fa_enabled: true,
          preferred_method: preferredMethod,
          phone_number: ctx.body.phone_number || null,
          require_otp_for_login: ctx.body.require_otp_for_login ?? true,
          require_otp_for_actions: ctx.body.require_otp_for_actions ?? true,
          authenticator_secret: authenticatorSecret,
          backup_codes: backupCodes.length > 0 ? backupCodes : undefined,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select('*')
        .single();

      if (error || !settings) return errorResponse(error?.message || 'Unable to enable 2FA.', 400);

      await writeImmutableSecurityLog(ctx.supabaseAdmin, '2fa_enabled', ctx.user!.userId, ctx.clientIP, ctx.deviceId, {
        target_user_id: targetUserId,
        preferred_method: preferredMethod,
      });

      await recordIncidentResponse(ctx.supabaseAdmin, {
        responseType: '2fa_enabled',
        actorUserId: ctx.user!.userId,
        actorRole: ctx.user!.role,
        targetUserId,
        payload: { preferred_method: preferredMethod },
      });

      return jsonResponse({
        settings,
        backup_codes: backupCodes,
        authenticator_secret: authenticatorSecret,
      }, 201);
    }, {
      module: 'security',
      action: '2fa_enable',
      detectFraud: true,
    });
  }

  if (method === 'POST' && matchesPath(path, '/scan')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = normalizeLower(ctx.body.scope, 'global');
      const targetUserId = ctx.body.user_id ? String(ctx.body.user_id) : null;

      const [recentFailures, recentBreaches, recentSessions, financePayouts] = await Promise.all([
        ctx.supabaseAdmin.from('login_history').select('*').eq('attempt_status', 'failed').order('created_at', { ascending: false }).limit(50),
        ctx.supabaseAdmin.from('security_breach_attempts').select('*').order('created_at', { ascending: false }).limit(100),
        ctx.supabaseAdmin.from('user_sessions').select('*').eq('is_active', true).order('last_activity_at', { ascending: false }).limit(100),
        ctx.supabaseAdmin.from('finance_payouts').select('*').gte('risk_score', 70).order('created_at', { ascending: false }).limit(20),
      ]);

      const findings: Array<{ type: string; severity: string; count: number; detail: string }> = [];
      let riskScore = 0;

      const bruteForceCount = (recentFailures.data || []).length;
      if (bruteForceCount >= 5) {
        findings.push({ type: 'brute_force', severity: bruteForceCount >= 15 ? 'critical' : 'high', count: bruteForceCount, detail: 'Repeated failed logins detected.' });
        riskScore += bruteForceCount >= 15 ? 40 : 25;
      }

      const breachMap = (recentBreaches.data || []).reduce((acc: Record<string, number>, row: any) => {
        const key = row.attempt_type || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      Object.entries(breachMap).forEach(([type, count]) => {
        if (count >= 3) {
          findings.push({ type, severity: count >= 10 ? 'critical' : 'medium', count, detail: `${type.replace(/_/g, ' ')} repeated ${count} times.` });
          riskScore += count >= 10 ? 20 : 10;
        }
      });

      const anomalousSessions = (recentSessions.data || []).filter((row: any) => toNumber(row.risk_score) >= 70 || row.forced_reauth);
      if (anomalousSessions.length > 0) {
        findings.push({ type: 'session_anomaly', severity: 'high', count: anomalousSessions.length, detail: 'Active sessions have elevated risk scores or forced reauth state.' });
        riskScore += 20;
      }

      if ((financePayouts.data || []).length > 0) {
        findings.push({ type: 'finance_risk', severity: 'high', count: financePayouts.data.length, detail: 'High-risk payout attempts are pending or blocked.' });
        riskScore += 15;
      }

      const clampedRiskScore = Math.min(100, riskScore);
      const blocked = clampedRiskScore >= 80;

      if (blocked) {
        await createSecurityAlert(ctx.supabaseAdmin, {
          alertType: 'breach_attempt',
          severity: clampedRiskScore >= 90 ? 'critical' : 'high',
          title: 'Threat scan elevated system risk',
          message: 'Security scan detected a combination of login, session, or finance signals that require response.',
          userId: targetUserId,
          riskScore: clampedRiskScore,
          sourceTable: 'security_breach_attempts',
          metadata: { scope, findings },
        });
      }

      if (targetUserId) {
        await syncRiskProfile(ctx.supabaseAdmin, targetUserId, {
          threat_score: clampedRiskScore,
          failed_logins_24h: bruteForceCount,
          requires_step_up: clampedRiskScore >= 50,
          finance_guard_enabled: (financePayouts.data || []).length > 0,
          last_login_at: new Date().toISOString(),
        });
      }

      await writeImmutableSecurityLog(ctx.supabaseAdmin, 'security_scan', ctx.user!.userId, ctx.clientIP, ctx.deviceId, {
        scope,
        target_user_id: targetUserId,
        risk_score: clampedRiskScore,
        findings,
      });

      await recordIncidentResponse(ctx.supabaseAdmin, {
        responseType: 'scan_executed',
        actorUserId: ctx.user!.userId,
        actorRole: ctx.user!.role,
        targetUserId,
        payload: { scope, risk_score: clampedRiskScore, blocked },
      });

      return jsonResponse({ success: true, blocked, risk_score: clampedRiskScore, findings });
    }, {
      module: 'security',
      action: 'scan',
      allowedRoles: SECURITY_MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (method === 'POST' && matchesPath(path, '/emergency/signout-everywhere')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const targetUserId = String(ctx.body.user_id || ctx.user!.userId);
      if (targetUserId !== ctx.user!.userId && !requiresManager(ctx.user!.role)) {
        return errorResponse('You can only sign out your own account everywhere.', 403);
      }

      await ctx.supabaseAdmin
        .from('user_sessions')
        .update({
          is_active: false,
          force_logout_flag: true,
          logout_at: new Date().toISOString(),
          revoked_reason: 'signout_everywhere',
        })
        .eq('user_id', targetUserId)
        .eq('is_active', true);

      await ctx.supabaseAdmin
        .from('user_roles')
        .update({
          force_logged_out_at: new Date().toISOString(),
          force_logged_out_by: ctx.user!.userId,
        })
        .eq('user_id', targetUserId);

      await recordIncidentResponse(ctx.supabaseAdmin, {
        responseType: 'signout_everywhere',
        actorUserId: ctx.user!.userId,
        actorRole: ctx.user!.role,
        targetUserId,
      });

      await writeImmutableSecurityLog(ctx.supabaseAdmin, 'signout_everywhere', ctx.user!.userId, ctx.clientIP, ctx.deviceId, {
        target_user_id: targetUserId,
      });

      return jsonResponse({ success: true, target_user_id: targetUserId, signed_out_everywhere: true });
    }, {
      module: 'security',
      action: 'signout_everywhere',
      detectFraud: true,
    });
  }

  if (method === 'POST' && matchesPath(path, '/emergency/disable-account')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const targetUserId = String(ctx.body.user_id || '');
      if (!targetUserId) return errorResponse('user_id is required.', 400);
      if (!requiresManager(ctx.user!.role)) return errorResponse('Security manager access required.', 403);

      const { data: targetRoles } = await ctx.supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', targetUserId);

      const targetRoleList = (targetRoles || []).map((row: any) => row.role);
      if (targetRoleList.includes('boss_owner') || targetRoleList.includes('master') || targetRoleList.includes('super_admin')) {
        return errorResponse('Break-glass roles cannot be disabled from this route.', 403);
      }

      await ctx.supabaseAdmin
        .from('login_whitelist')
        .upsert({
          user_id: targetUserId,
          email: String(ctx.body.email || `${targetUserId}@disabled.local`),
          is_active: false,
          added_by: ctx.user!.userId,
          added_by_role: ctx.user!.role,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      await syncRiskProfile(ctx.supabaseAdmin, targetUserId, {
        account_status: 'disabled',
        requires_step_up: true,
        threat_score: 100,
        notes: String(ctx.body.reason || 'Disabled by security manager'),
      });

      await ctx.supabaseAdmin
        .from('user_roles')
        .update({
          force_logged_out_at: new Date().toISOString(),
          force_logged_out_by: ctx.user!.userId,
        })
        .eq('user_id', targetUserId);

      const alert = await createSecurityAlert(ctx.supabaseAdmin, {
        alertType: 'account_locked',
        severity: 'critical',
        title: 'Account disabled by security manager',
        message: String(ctx.body.reason || 'Account disabled because of a suspected breach or zero-trust policy violation.'),
        userId: targetUserId,
        riskScore: 100,
        sourceTable: 'security_user_risk_profiles',
      });

      await recordIncidentResponse(ctx.supabaseAdmin, {
        responseType: 'user_disabled',
        actorUserId: ctx.user!.userId,
        actorRole: ctx.user!.role,
        targetUserId,
        relatedAlertId: alert?.id || null,
        responseNotes: ctx.body.reason ? String(ctx.body.reason) : null,
      });

      await writeImmutableSecurityLog(ctx.supabaseAdmin, 'account_disabled', ctx.user!.userId, ctx.clientIP, ctx.deviceId, {
        target_user_id: targetUserId,
        reason: ctx.body.reason || null,
      });

      return jsonResponse({ success: true, target_user_id: targetUserId, account_disabled: true, alert_id: alert?.id || null });
    }, {
      module: 'security',
      action: 'disable_account',
      allowedRoles: SECURITY_MANAGER_ROLES,
      detectFraud: true,
    });
  }

  return errorResponse('Security route not found', 404);
});
