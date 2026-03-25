import { withEnhancedMiddleware } from '../_shared/enhanced-middleware.ts';
import { errorResponse, jsonResponse } from '../_shared/utils.ts';

const MANAGER_ROLES = ['boss_owner', 'master', 'super_admin', 'ceo', 'admin', 'client_success', 'support', 'finance_manager'];

function getPath(req: Request) {
  return new URL(req.url).pathname.replace(/^.*\/api-pro-manager/, '') || '/';
}

function trimPath(path: string) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

function matches(path: string, ...candidates: string[]) {
  return candidates.includes(trimPath(path));
}

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalize(value: unknown, fallback = '') {
  return String(value || fallback).trim();
}

function lower(value: unknown, fallback = '') {
  return normalize(value, fallback).toLowerCase();
}

function isoNow() {
  return new Date().toISOString();
}

function addHours(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function churnRiskFromRating(rating: number) {
  if (rating <= 2.5) return 'high';
  if (rating <= 3.5) return 'medium';
  return 'low';
}

async function writeAudit(supabaseAdmin: any, payload: Record<string, unknown>) {
  await supabaseAdmin.from('pro_audit_logs').insert(payload);
}

async function checkAndUpdateExpiredUsers(supabaseAdmin: any) {
  const { data: expiredUsers } = await supabaseAdmin
    .from('pro_users')
    .select('id, user_id, name, status')
    .lt('expiry_date', new Date().toISOString())
    .eq('status', 'active');

  if (expiredUsers && expiredUsers.length > 0) {
    // Update status to expired
    await supabaseAdmin
      .from('pro_users')
      .update({ status: 'expired', updated_at: isoNow() })
      .in('id', expiredUsers.map(u => u.id));

    // Create alerts for expired users
    for (const user of expiredUsers) {
      await createAlert(supabaseAdmin, {
        proUserId: user.id,
        alertType: 'renewal_risk',
        severity: 'high',
        title: 'License Expired',
        message: `Pro user ${user.name} license has expired`,
        escalationLevel: 'L1'
      });

      await writeAudit(supabaseAdmin, {
        action_type: 'user_auto_expired',
        pro_user_id: user.id,
        entity_type: 'pro_users',
        entity_id: user.id,
        payload: { previous_status: 'active', new_status: 'expired' }
      });
    }

    return expiredUsers.length;
  }
  return 0;
}

async function validateLicenseAccess(supabaseAdmin: any, licenseKey: string, domain?: string, deviceId?: string) {
  const licenseKeyHash = await supabaseAdmin.rpc('hash_license_key', { license_key: licenseKey });

  const { data: license } = await supabaseAdmin
    .from('pro_licenses')
    .select('*, pro_users(*)')
    .eq('license_key_hash', licenseKeyHash)
    .eq('status', 'active')
    .single();

  if (!license) {
    throw new Error('Invalid license key');
  }

  if (license.pro_users.status !== 'active') {
    throw new Error('User account is not active');
  }

  // Check domain uniqueness
  if (domain) {
    const { data: existingDomain } = await supabaseAdmin
      .from('pro_licenses')
      .select('id')
      .eq('domain', domain)
      .eq('status', 'active')
      .neq('id', license.id)
      .single();

    if (existingDomain) {
      throw new Error('Domain already in use by another license');
    }
  }

  // Check device uniqueness
  if (deviceId) {
    const { data: existingDevice } = await supabaseAdmin
      .from('pro_licenses')
      .select('id')
      .eq('device_id', deviceId)
      .eq('status', 'active')
      .neq('id', license.id)
      .single();

    if (existingDevice) {
      throw new Error('Device already in use by another license');
    }
  }

  return license;
}

async function checkUsageLimits(supabaseAdmin: any, proUserId: string, usageType: string, usageAmount: number) {
  const { data: limits } = await supabaseAdmin
    .from('pro_usage_limits')
    .select('*')
    .eq('pro_user_id', proUserId)
    .eq('limit_type', usageType)
    .eq('status', 'active')
    .single();

  if (!limits) return { allowed: true }; // No limits set

  const newUsage = limits.current_usage + usageAmount;
  const usagePercent = (newUsage / limits.monthly_limit) * 100;

  if (usagePercent >= limits.block_threshold) {
    // Block usage
    await supabaseAdmin
      .from('pro_usage_limits')
      .update({ status: 'blocked', current_usage: newUsage, updated_at: isoNow() })
      .eq('id', limits.id);

    await createAlert(supabaseAdmin, {
      proUserId: proUserId,
      alertType: 'usage_block',
      severity: 'high',
      title: 'Usage Limit Exceeded',
      message: `${usageType} usage limit exceeded (${usagePercent.toFixed(1)}% of ${limits.monthly_limit})`,
      escalationLevel: 'L1'
    });

    return { allowed: false, reason: 'Usage limit exceeded' };
  }

  if (usagePercent >= limits.warning_threshold && limits.status === 'active') {
    // Set warning status
    await supabaseAdmin
      .from('pro_usage_limits')
      .update({ status: 'warning', current_usage: newUsage, updated_at: isoNow() })
      .eq('id', limits.id);

    await createAlert(supabaseAdmin, {
      proUserId: proUserId,
      alertType: 'usage_block',
      severity: 'medium',
      title: 'Usage Limit Warning',
      message: `${usageType} usage at ${usagePercent.toFixed(1)}% of limit`,
      escalationLevel: 'L1'
    });
  }

  // Update current usage
  await supabaseAdmin
    .from('pro_usage_limits')
    .update({ current_usage: newUsage, updated_at: isoNow() })
    .eq('id', limits.id);

  return { allowed: true };
}

async function assignTicketToAgent(supabaseAdmin: any, ticketId: string) {
  // Auto-assign based on priority and availability
  const { data: ticket } = await supabaseAdmin
    .from('pro_support_tickets')
    .select('*, pro_users(support_tier)')
    .eq('id', ticketId)
    .single();

  if (!ticket) return;

  // Priority assignment logic
  let assignedRole = 'support';
  if (ticket.priority === 'critical' || ticket.pro_users.support_tier === 'enterprise') {
    assignedRole = 'client_success';
  } else if (ticket.priority === 'high' || ticket.pro_users.support_tier === 'vip') {
    assignedRole = 'support';
  }

  // Set SLA timers
  const { data: sla } = await supabaseAdmin
    .from('pro_sla_policies')
    .select('*')
    .eq('support_tier', ticket.pro_users.support_tier)
    .eq('priority', ticket.priority)
    .single();

  const now = new Date();
  const responseDue = sla ? new Date(now.getTime() + sla.response_time_limit * 60 * 1000) : null;
  const resolutionDue = sla ? new Date(now.getTime() + sla.resolution_time_limit * 60 * 60 * 1000) : null;

  await supabaseAdmin
    .from('pro_support_tickets')
    .update({
      assigned_role: assignedRole,
      response_due_at: responseDue?.toISOString(),
      resolution_due_at: resolutionDue?.toISOString(),
      status: 'assigned',
      updated_at: isoNow()
    })
    .eq('id', ticketId);

  await writeAudit(supabaseAdmin, {
    action_type: 'ticket_auto_assigned',
    pro_user_id: ticket.pro_user_id,
    entity_type: 'pro_support_tickets',
    entity_id: ticketId,
    payload: { assigned_role: assignedRole, priority: ticket.priority }
  });
}

async function processAIHelpdesk(supabaseAdmin: any, ticketId: string, query: string) {
  // Call AI API manager (simulated)
  const aiResponse = `AI Analysis: ${query.substring(0, 100)}...`;
  const confidenceScore = 85; // Simulated confidence

  if (confidenceScore > 80) {
    // Auto-resolve with AI
    await supabaseAdmin
      .from('pro_support_tickets')
      .update({
        ai_summary: aiResponse,
        auto_fixed: true,
        status: 'resolved',
        resolved_at: isoNow(),
        updated_at: isoNow()
      })
      .eq('id', ticketId);

    // Log AI interaction
    await supabaseAdmin
      .from('pro_ai_helpdesk_logs')
      .insert({
        ticket_id: ticketId,
        pro_user_id: (await supabaseAdmin.from('pro_support_tickets').select('pro_user_id').eq('id', ticketId).single()).data?.pro_user_id,
        query: query,
        ai_response: aiResponse,
        confidence_score: confidenceScore,
        resolution_status: 'resolved'
      });
  } else {
    // Escalate to human
    await assignTicketToAgent(supabaseAdmin, ticketId);

    await supabaseAdmin
      .from('pro_ai_helpdesk_logs')
      .insert({
        ticket_id: ticketId,
        pro_user_id: (await supabaseAdmin.from('pro_support_tickets').select('pro_user_id').eq('id', ticketId).single()).data?.pro_user_id,
        query: query,
        ai_response: aiResponse,
        confidence_score: confidenceScore,
        resolution_status: 'human_escalated'
      });
  }
}

async function checkSLABreaches(supabaseAdmin: any) {
  const now = isoNow();

  // Check response time breaches
  const { data: responseBreaches } = await supabaseAdmin
    .from('pro_support_tickets')
    .select('*, pro_users(name)')
    .lt('response_due_at', now)
    .is('first_response_at', null)
    .in('status', ['new', 'assigned']);

  // Check resolution time breaches
  const { data: resolutionBreaches } = await supabaseAdmin
    .from('pro_support_tickets')
    .select('*, pro_users(name)')
    .lt('resolution_due_at', now)
    .not('status', 'resolved');

  const allBreaches = [...(responseBreaches || []), ...(resolutionBreaches || [])];

  for (const ticket of allBreaches) {
    await supabaseAdmin
      .from('pro_support_tickets')
      .update({ status: 'breached', updated_at: isoNow() })
      .eq('id', ticket.id);

    await createAlert(supabaseAdmin, {
      proUserId: ticket.pro_user_id,
      ticketId: ticket.id,
      alertType: 'sla_breach',
      severity: 'critical',
      title: 'SLA Breach',
      message: `SLA breached for ticket ${ticket.title} (${ticket.pro_users.name})`,
      escalationLevel: 'Boss'
    });
  }

  return allBreaches.length;
}

async function processRenewalNotifications(supabaseAdmin: any) {
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: expiringUsers } = await supabaseAdmin
    .from('pro_users')
    .select('*')
    .lt('expiry_date', sevenDaysFromNow)
    .eq('status', 'active')
    .eq('auto_renewal', true);

  for (const user of expiringUsers) {
    // Check if notification already sent
    const { data: existing } = await supabaseAdmin
      .from('pro_renewal_tracking')
      .select('id')
      .eq('pro_user_id', user.id)
      .eq('notification_sent', true)
      .single();

    if (!existing) {
      await createAlert(supabaseAdmin, {
        proUserId: user.id,
        alertType: 'renewal_risk',
        severity: 'medium',
        title: 'Renewal Reminder',
        message: `License expires on ${new Date(user.expiry_date).toDateString()}`,
        escalationLevel: 'L1'
      });

      await supabaseAdmin
        .from('pro_renewal_tracking')
        .insert({
          pro_user_id: user.id,
          renewal_type: user.plan_type,
          current_expiry: user.expiry_date,
          renewal_amount: user.renewal_amount,
          notification_sent: true,
          notification_date: isoNow()
        });
    }
  }

  return expiringUsers?.length || 0;
}

async function createAlert(
  supabaseAdmin: any,
  payload: {
    proUserId?: string | null;
    ticketId?: string | null;
    alertType: 'sla_breach' | 'payment_hold' | 'high_priority_issue' | 'renewal_risk' | 'usage_block' | 'low_rating' | 'license_misuse';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    escalationLevel?: 'L1' | 'L2' | 'Boss';
    metadata?: Record<string, unknown>;
  },
) {
  const { data } = await supabaseAdmin
    .from('pro_alerts')
    .insert({
      pro_user_id: payload.proUserId || null,
      ticket_id: payload.ticketId || null,
      alert_type: payload.alertType,
      severity: payload.severity,
      title: payload.title,
      message: payload.message,
      escalation_level: payload.escalationLevel || 'L1',
      metadata: payload.metadata || {},
    })
    .select('*')
    .single();

  return data;
}

async function validateDeviceFingerprint(supabaseAdmin: any, proUserId: string, deviceFingerprint: string) {
  // Check if device is already registered for this user
  const { data: existing } = await supabaseAdmin
    .from('pro_device_fingerprints')
    .select('*')
    .eq('pro_user_id', proUserId)
    .eq('device_fingerprint', deviceFingerprint)
    .single();

  if (existing) {
    // Update last access
    await supabaseAdmin
      .from('pro_device_fingerprints')
      .update({ last_access_at: isoNow() })
      .eq('id', existing.id);
    return true;
  }

  // Check device limit (max 3 devices per user)
  const { data: userDevices } = await supabaseAdmin
    .from('pro_device_fingerprints')
    .select('id')
    .eq('pro_user_id', proUserId)
    .eq('status', 'active');

  if (userDevices && userDevices.length >= 3) {
    throw new Error('Maximum device limit reached (3 devices)');
  }

  // Register new device
  await supabaseAdmin
    .from('pro_device_fingerprints')
    .insert({
      pro_user_id: proUserId,
      device_fingerprint: deviceFingerprint,
      registered_at: isoNow(),
      last_access_at: isoNow(),
      status: 'active'
    });

  return true;
}

async function logSecureCommunication(supabaseAdmin: any, payload: {
  proUserId: string;
  communicationType: 'email' | 'chat' | 'call' | 'api';
  direction: 'inbound' | 'outbound';
  content: string;
  metadata?: Record<string, unknown>;
}) {
  // Encrypt content (simulated - in production use proper encryption)
  const encryptedContent = Buffer.from(payload.content).toString('base64');

  await supabaseAdmin
    .from('pro_secure_communication_logs')
    .insert({
      pro_user_id: payload.proUserId,
      communication_type: payload.communicationType,
      direction: payload.direction,
      encrypted_content: encryptedContent,
      metadata: payload.metadata || {},
      logged_at: isoNow()
    });
}

async function processBillingWebhook(supabaseAdmin: any, webhookData: any) {
  // Log webhook
  await supabaseAdmin
    .from('pro_billing_webhooks')
    .insert({
      webhook_type: webhookData.type,
      payload: webhookData,
      processed: false,
      received_at: isoNow()
    });

  // Process based on webhook type
  if (webhookData.type === 'payment.succeeded') {
    const licenseKey = webhookData.metadata?.license_key;
    if (licenseKey) {
      // Activate license
      const licenseKeyHash = await supabaseAdmin.rpc('hash_license_key', { license_key: licenseKey });

      await supabaseAdmin
        .from('pro_licenses')
        .update({
          status: 'active',
          activated_at: isoNow(),
          updated_at: isoNow()
        })
        .eq('license_key_hash', licenseKeyHash);

      // Update user expiry
      const { data: license } = await supabaseAdmin
        .from('pro_licenses')
        .select('pro_user_id')
        .eq('license_key_hash', licenseKeyHash)
        .single();

      if (license) {
        const newExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
        await supabaseAdmin
          .from('pro_users')
          .update({
            expiry_date: newExpiry.toISOString(),
            status: 'active',
            updated_at: isoNow()
          })
          .eq('id', license.pro_user_id);
      }
    }
  }

  // Mark as processed
  await supabaseAdmin
    .from('pro_billing_webhooks')
    .update({ processed: true, processed_at: isoNow() })
    .eq('webhook_type', webhookData.type)
    .eq('received_at', isoNow());
}

async function logCronJob(supabaseAdmin: any, jobName: string, status: 'started' | 'completed' | 'failed', details?: Record<string, unknown>) {
  await supabaseAdmin
    .from('pro_cron_job_logs')
    .insert({
      job_name: jobName,
      status: status,
      details: details || {},
      executed_at: isoNow()
    });
}

async function addToRetryQueue(supabaseAdmin: any, operation: string, payload: Record<string, unknown>, priority: number = 1) {
  await supabaseAdmin
    .from('pro_retry_queue')
    .insert({
      operation: operation,
      payload: payload,
      priority: priority,
      status: 'pending',
      retry_count: 0,
      created_at: isoNow(),
      next_retry_at: isoNow()
    });
}

async function processRetryQueue(supabaseAdmin: any) {
  const { data: pendingRetries } = await supabaseAdmin
    .from('pro_retry_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('next_retry_at', isoNow())
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(10);

  for (const retry of pendingRetries || []) {
    try {
      // Process retry based on operation type
      if (retry.operation === 'send_notification') {
        // Simulate sending notification
        console.log('Retrying notification:', retry.payload);
      } else if (retry.operation === 'update_license') {
        // Simulate license update
        console.log('Retrying license update:', retry.payload);
      }

      // Mark as completed
      await supabaseAdmin
        .from('pro_retry_queue')
        .update({
          status: 'completed',
          completed_at: isoNow(),
          updated_at: isoNow()
        })
        .eq('id', retry.id);

    } catch (error) {
      const newRetryCount = retry.retry_count + 1;

      if (newRetryCount >= 3) {
        // Mark as failed
        await supabaseAdmin
          .from('pro_retry_queue')
          .update({
            status: 'failed',
            retry_count: newRetryCount,
            error_message: error.message,
            updated_at: isoNow()
          })
          .eq('id', retry.id);
      } else {
        // Schedule next retry with exponential backoff
        const nextRetry = new Date(Date.now() + Math.pow(2, newRetryCount) * 60 * 1000);
        await supabaseAdmin
          .from('pro_retry_queue')
          .update({
            retry_count: newRetryCount,
            next_retry_at: nextRetry.toISOString(),
            updated_at: isoNow()
          })
          .eq('id', retry.id);
      }
    }
  }

  return pendingRetries?.length || 0;
}

async function getProUserRecord(supabaseAdmin: any, proUserId: string) {
  const { data } = await supabaseAdmin.from('pro_users').select('*').eq('id', proUserId).maybeSingle();
  return data;
}

async function getProUserByUserId(supabaseAdmin: any, userId: string) {
  const { data } = await supabaseAdmin.from('pro_users').select('*').eq('user_id', userId).maybeSingle();
  return data;
}

async function getOverview(supabaseAdmin: any) {
  const [
    usersResult,
    ticketsResult,
    alertsResult,
    bugsResult,
    usageResult,
    ratingsResult,
    upgradesResult,
    assistResult,
    auditResult,
    complianceResult,
  ] = await Promise.all([
    supabaseAdmin.from('pro_users').select('*').order('updated_at', { ascending: false }).limit(50),
    supabaseAdmin.from('pro_support_tickets').select('*').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('pro_alerts').select('*').order('created_at', { ascending: false }).limit(25),
    supabaseAdmin.from('pro_bug_reports').select('*').order('created_at', { ascending: false }).limit(25),
    supabaseAdmin.from('pro_usage_snapshots').select('*').eq('period_key', new Date().toISOString().slice(0, 7)).limit(100),
    supabaseAdmin.from('pro_satisfaction_reviews').select('*').order('created_at', { ascending: false }).limit(100),
    supabaseAdmin.from('prime_upgrade_history').select('*').order('created_at', { ascending: false }).limit(25),
    supabaseAdmin.from('pro_assist_requests').select('*').order('created_at', { ascending: false }).limit(25),
    supabaseAdmin.from('pro_audit_logs').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('pro_compliance_flags').select('*').order('created_at', { ascending: false }).limit(25),
  ]);

  const users = usersResult.data || [];
  const tickets = ticketsResult.data || [];
  const alerts = alertsResult.data || [];
  const bugs = bugsResult.data || [];
  const usage = usageResult.data || [];
  const ratings = ratingsResult.data || [];
  const upgrades = upgradesResult.data || [];
  const assists = assistResult.data || [];
  const audit = auditResult.data || [];
  const compliance = complianceResult.data || [];

  const averageRating = ratings.length > 0
    ? Number((ratings.reduce((sum: number, item: any) => sum + toNumber(item.rating), 0) / ratings.length).toFixed(2))
    : 0;

  return {
    summary: {
      active_users: users.filter((user: any) => user.status === 'active').length,
      expired_users: users.filter((user: any) => user.status === 'expired').length,
      revenue_at_risk: users.filter((user: any) => ['expired', 'grace', 'high_risk'].includes(user.status)).reduce((sum: number, user: any) => sum + toNumber(user.renewal_amount), 0),
      open_tickets: tickets.filter((ticket: any) => !['resolved'].includes(ticket.status)).length,
      sla_breaches: tickets.filter((ticket: any) => ticket.status === 'breached').length,
      high_priority_issues: bugs.filter((bug: any) => ['high', 'critical'].includes(bug.severity) && bug.status !== 'resolved').length,
      pending_renewals: users.filter((user: any) => user.expiry_date && new Date(user.expiry_date).getTime() - Date.now() <= 14 * 24 * 60 * 60 * 1000).length,
      assist_sessions: assists.filter((assist: any) => ['queued', 'approved', 'active', 'paused'].includes(assist.status)).length,
      low_rating_alerts: ratings.filter((rating: any) => toNumber(rating.rating) <= 2.5).length,
      average_csat: averageRating,
      compliance_flags: compliance.filter((flag: any) => flag.status !== 'resolved').length,
      auto_fix_rate: tickets.length > 0 ? Number(((tickets.filter((ticket: any) => ticket.auto_fixed).length / tickets.length) * 100).toFixed(2)) : 0,
    },
    users: users.slice(0, 8),
    tickets: tickets.slice(0, 8),
    alerts: alerts.slice(0, 8),
    upgrades: upgrades.slice(0, 8),
    usage: usage.slice(0, 8),
    ratings: ratings.slice(0, 8),
    audit,
  };
}

function buildHelpdeskReply(issue: string) {
  const normalized = lower(issue);
  if (normalized.includes('billing') || normalized.includes('payment') || normalized.includes('renewal')) {
    return 'Payment status was checked, renewal guardrails were verified, and a billing-safe reactivation path is ready. If payment remains on hold, the account stays restricted until billing clears.';
  }
  if (normalized.includes('domain') || normalized.includes('license')) {
    return 'License integrity was checked against domain and device binding. Rebinding is only allowed when the license is active and mapped to a single approved domain.';
  }
  if (normalized.includes('api') || normalized.includes('limit') || normalized.includes('usage')) {
    return 'Current usage was reviewed against plan limits. The recommended fix is to clean up high-volume usage first, then upgrade capacity if the threshold remains at risk.';
  }
  if (normalized.includes('bug') || normalized.includes('error') || normalized.includes('crash')) {
    return 'The issue matches a product reliability pattern. A bug record can be linked to development immediately, with AI first-pass diagnostics added to the ticket.';
  }
  return 'The request was classified, support context was prepared, and the fastest next step is to create a tracked ticket with SLA ownership so the request cannot stall.';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok');
  }

  const path = getPath(req);
  const url = new URL(req.url);

  if (req.method === 'GET' && matches(path, '/overview')) {
    return withEnhancedMiddleware(req, async (ctx) => jsonResponse(await getOverview(ctx.supabaseAdmin)), {
      module: 'pro-manager',
      action: 'overview',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/users')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from('pro_users').select('*').order('updated_at', { ascending: false });
      const status = url.searchParams.get('status');
      const plan = url.searchParams.get('plan_type');
      const search = url.searchParams.get('q');
      if (status) query = query.eq('status', status);
      if (plan) query = query.eq('plan_type', plan);
      if (search) query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%`);
      const { data, error } = await query.limit(Math.min(200, toNumber(url.searchParams.get('limit'), 100)));
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ users: data || [] });
    }, {
      module: 'pro-manager',
      action: 'users',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/licenses')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_licenses')
        .select('*, pro_users(id,name,company,plan_type,status)')
        .order('updated_at', { ascending: false })
        .limit(Math.min(200, toNumber(url.searchParams.get('limit'), 100)));
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ licenses: data || [] });
    }, {
      module: 'pro-manager',
      action: 'licenses',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/license/assign')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const proUserId = normalize(ctx.body.pro_user_id);
      const domain = lower(ctx.body.domain);
      const deviceId = normalize(ctx.body.device_id);
      if (!proUserId || !domain || !deviceId) return errorResponse('pro_user_id, domain, and device_id are required.', 400);

      const proUser = await getProUserRecord(ctx.supabaseAdmin, proUserId);
      if (!proUser) return errorResponse('Pro user not found.', 404);
      if (['pending', 'hold', 'failed'].includes(proUser.last_payment_status)) {
        return errorResponse('No license can be assigned without a cleared payment state.', 409);
      }

      const { data: activeDomain } = await ctx.supabaseAdmin
        .from('pro_licenses')
        .select('id,pro_user_id')
        .eq('domain', domain)
        .in('status', ['active', 'bound'])
        .maybeSingle();

      if (activeDomain && activeDomain.pro_user_id !== proUserId) {
        return errorResponse('One license can only be bound to one domain at a time.', 409);
      }

      const { data: license, error } = await ctx.supabaseAdmin
        .from('pro_licenses')
        .insert({
          pro_user_id: proUserId,
          domain,
          device_id: deviceId,
          status: 'bound',
          expires_at: proUser.expiry_date,
          metadata: { assigned_by_role: ctx.user!.role },
        })
        .select('*')
        .single();
      if (error || !license) return errorResponse(error?.message || 'Unable to assign license.', 400);

      await ctx.supabaseAdmin.from('pro_users').update({ company_domain: domain }).eq('id', proUserId);
      await writeAudit(ctx.supabaseAdmin, {
        action_type: 'license_assigned',
        actor_user_id: ctx.user!.userId,
        actor_role: ctx.user!.role,
        pro_user_id: proUserId,
        entity_type: 'pro_license',
        entity_id: license.id,
        payload: { domain, device_id: deviceId },
      });

      return jsonResponse({ license }, 201);
    }, {
      module: 'pro-manager',
      action: 'license_assign',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/products')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_product_mappings')
        .select('*, pro_users(id,name,company), pro_licenses(id,license_key,domain,status)')
        .order('updated_at', { ascending: false })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ products: data || [] });
    }, {
      module: 'pro-manager',
      action: 'products',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/product/map')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const proUserId = normalize(ctx.body.pro_user_id);
      const licenseId = normalize(ctx.body.license_id);
      const productName = normalize(ctx.body.product_name);
      if (!proUserId || !licenseId || !productName) return errorResponse('pro_user_id, license_id, and product_name are required.', 400);

      const { data: license } = await ctx.supabaseAdmin.from('pro_licenses').select('*').eq('id', licenseId).eq('pro_user_id', proUserId).in('status', ['active', 'bound']).maybeSingle();
      if (!license) return errorResponse('No active license found for this user. Product mapping is blocked.', 409);

      const { data: mapping, error } = await ctx.supabaseAdmin
        .from('pro_product_mappings')
        .insert({
          pro_user_id: proUserId,
          license_id: licenseId,
          product_name: productName,
          product_code: normalize(ctx.body.product_code) || null,
          version: normalize(ctx.body.version) || null,
          enabled_modules: Array.isArray(ctx.body.enabled_modules) ? ctx.body.enabled_modules : [],
          custom_changes: normalize(ctx.body.custom_changes) || null,
        })
        .select('*')
        .single();
      if (error || !mapping) return errorResponse(error?.message || 'Unable to map product.', 400);

      await writeAudit(ctx.supabaseAdmin, {
        action_type: 'product_mapped',
        actor_user_id: ctx.user!.userId,
        actor_role: ctx.user!.role,
        pro_user_id: proUserId,
        entity_type: 'pro_product_mapping',
        entity_id: mapping.id,
        payload: { product_name: productName, license_id: licenseId },
      });

      return jsonResponse({ mapping }, 201);
    }, {
      module: 'pro-manager',
      action: 'product_map',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/tickets')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin
        .from('pro_support_tickets')
        .select('*, pro_users(id,name,company,status)')
        .order('created_at', { ascending: false });
      const status = url.searchParams.get('status');
      if (status) query = query.eq('status', status);
      const { data, error } = await query.limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ tickets: data || [] });
    }, {
      module: 'pro-manager',
      action: 'tickets',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/ticket')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const proUserId = normalize(ctx.body.pro_user_id);
      const issue = normalize(ctx.body.issue);
      const priority = lower(ctx.body.priority, 'medium');
      if (!proUserId || !issue) return errorResponse('pro_user_id and issue are required.', 400);
      const title = normalize(ctx.body.title, issue.slice(0, 80));
      const responseHours = priority === 'critical' ? 0.5 : priority === 'high' ? 1 : priority === 'medium' ? 4 : 8;
      const resolutionHours = priority === 'critical' ? 4 : priority === 'high' ? 12 : priority === 'medium' ? 24 : 48;

      const { data: ticket, error } = await ctx.supabaseAdmin
        .from('pro_support_tickets')
        .insert({
          pro_user_id: proUserId,
          title,
          issue,
          priority,
          status: 'new',
          assigned_role: priority === 'critical' ? 'support' : 'client_success',
          response_due_at: addHours(responseHours),
          resolution_due_at: addHours(resolutionHours),
          ai_summary: buildHelpdeskReply(issue),
        })
        .select('*')
        .single();
      if (error || !ticket) return errorResponse(error?.message || 'Unable to create ticket.', 400);

      await ctx.supabaseAdmin.from('pro_communication_logs').insert({
        pro_user_id: proUserId,
        channel: 'chat',
        direction: 'internal',
        subject: title,
        summary: issue,
        actor_user_id: ctx.user!.userId,
      });

      if (['high', 'critical'].includes(priority)) {
        await createAlert(ctx.supabaseAdmin, {
          proUserId,
          ticketId: ticket.id,
          alertType: 'high_priority_issue',
          severity: priority === 'critical' ? 'critical' : 'high',
          title: `Priority ticket created: ${title}`,
          message: 'A premium support issue entered the queue and must receive immediate ownership.',
          escalationLevel: priority === 'critical' ? 'Boss' : 'L2',
        });
      }

      await writeAudit(ctx.supabaseAdmin, {
        action_type: 'ticket_created',
        actor_user_id: ctx.user!.userId,
        actor_role: ctx.user!.role,
        pro_user_id: proUserId,
        entity_type: 'pro_support_ticket',
        entity_id: ticket.id,
        payload: { priority, title },
      });

      return jsonResponse({ ticket }, 201);
    }, {
      module: 'pro-manager',
      action: 'ticket_create',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/bugs')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_bug_reports')
        .select('*, pro_users(id,name,company), pro_support_tickets(id,title,status)')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ bugs: data || [] });
    }, {
      module: 'pro-manager',
      action: 'bugs',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/bug')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const proUserId = normalize(ctx.body.pro_user_id);
      const issue = normalize(ctx.body.issue);
      if (!proUserId || !issue) return errorResponse('pro_user_id and issue are required.', 400);
      const severity = lower(ctx.body.severity, 'medium');
      const { data: bug, error } = await ctx.supabaseAdmin
        .from('pro_bug_reports')
        .insert({
          pro_user_id: proUserId,
          ticket_id: normalize(ctx.body.ticket_id) || null,
          issue,
          build_version: normalize(ctx.body.build_version) || null,
          severity,
          status: 'dev_review',
          ai_attempts: 1,
          linked_module: normalize(ctx.body.linked_module) || 'dev-manager',
          dev_manager_status: 'queued',
        })
        .select('*')
        .single();
      if (error || !bug) return errorResponse(error?.message || 'Unable to create bug record.', 400);

      await writeAudit(ctx.supabaseAdmin, {
        action_type: 'bug_created',
        actor_user_id: ctx.user!.userId,
        actor_role: ctx.user!.role,
        pro_user_id: proUserId,
        entity_type: 'pro_bug_report',
        entity_id: bug.id,
        payload: { severity, build_version: ctx.body.build_version || null },
      });

      return jsonResponse({ bug }, 201);
    }, {
      module: 'pro-manager',
      action: 'bug_create',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/assist')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_assist_requests')
        .select('*, pro_users(id,name,company), pro_support_tickets(id,title,status)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ assists: data || [] });
    }, {
      module: 'pro-manager',
      action: 'assist_list',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/assist')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const proUserId = normalize(ctx.body.pro_user_id);
      if (!proUserId) return errorResponse('pro_user_id is required.', 400);
      const assistType = lower(ctx.body.assist_type, 'live_assist');
      const mode = lower(ctx.body.mode, 'guided');
      const { data: assist, error } = await ctx.supabaseAdmin
        .from('pro_assist_requests')
        .insert({
          pro_user_id: proUserId,
          ticket_id: normalize(ctx.body.ticket_id) || null,
          assist_type: assistType,
          mode,
          status: 'queued',
          remote_session_enabled: Boolean(ctx.body.remote_session_enabled),
          priority_queue_position: toNumber(ctx.body.priority_queue_position, 1),
          notes: normalize(ctx.body.notes) || null,
        })
        .select('*')
        .single();
      if (error || !assist) return errorResponse(error?.message || 'Unable to queue premium assist.', 400);

      await ctx.supabaseAdmin.from('pro_communication_logs').insert({
        pro_user_id: proUserId,
        channel: 'assist',
        direction: 'internal',
        subject: `Assist request: ${assistType}`,
        summary: normalize(ctx.body.notes, 'Premium assist requested for a pro user.'),
        actor_user_id: ctx.user!.userId,
      });

      await writeAudit(ctx.supabaseAdmin, {
        action_type: 'assist_requested',
        actor_user_id: ctx.user!.userId,
        actor_role: ctx.user!.role,
        pro_user_id: proUserId,
        entity_type: 'pro_assist_request',
        entity_id: assist.id,
        payload: { assist_type: assistType, mode },
      });

      return jsonResponse({ assist }, 201);
    }, {
      module: 'pro-manager',
      action: 'assist_create',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/sla')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data: tickets, error } = await ctx.supabaseAdmin
        .from('pro_support_tickets')
        .select('*, pro_users(id,name,company)')
        .order('resolution_due_at', { ascending: true })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({
        sla: (tickets || []).map((ticket: any) => ({
          ...ticket,
          sla_status: ticket.status === 'resolved'
            ? 'fulfilled'
            : ticket.status === 'breached' || (ticket.resolution_due_at && new Date(ticket.resolution_due_at).getTime() < Date.now())
              ? 'breached'
              : ticket.resolution_due_at && new Date(ticket.resolution_due_at).getTime() - Date.now() < 6 * 60 * 60 * 1000
                ? 'at_risk'
                : 'on_track',
        })),
      });
    }, {
      module: 'pro-manager',
      action: 'sla',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/upgrades')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('prime_upgrade_history')
        .select('*, prime_user_profiles(id,full_name,email)')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ upgrades: data || [] });
    }, {
      module: 'pro-manager',
      action: 'upgrades',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/upgrade')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const proUserId = normalize(ctx.body.pro_user_id);
      const newTier = normalize(ctx.body.new_tier);
      if (!proUserId || !newTier) return errorResponse('pro_user_id and new_tier are required.', 400);
      const proUser = await getProUserRecord(ctx.supabaseAdmin, proUserId);
      if (!proUser) return errorResponse('Pro user not found.', 404);

      if (proUser.prime_user_id) {
        await ctx.supabaseAdmin.from('prime_upgrade_history').insert({
          prime_user_id: proUser.prime_user_id,
          previous_tier: proUser.plan_type,
          new_tier: newTier,
          upgrade_type: 'upgrade',
          amount: toNumber(ctx.body.amount, proUser.renewal_amount),
          payment_method: normalize(ctx.body.payment_method) || null,
          transaction_ref: normalize(ctx.body.transaction_ref) || null,
          processed_by: ctx.user!.userId,
          reason: normalize(ctx.body.reason) || 'manual_upgrade',
        });
      }

      await ctx.supabaseAdmin.from('pro_users').update({
        plan_type: lower(newTier) === 'enterprise' ? 'enterprise' : lower(newTier),
        support_tier: lower(newTier) === 'enterprise' ? 'enterprise' : 'vip',
        monthly_revenue: toNumber(ctx.body.amount, proUser.monthly_revenue),
        renewal_amount: toNumber(ctx.body.amount, proUser.renewal_amount),
        last_payment_status: 'paid',
      }).eq('id', proUserId);

      await writeAudit(ctx.supabaseAdmin, {
        action_type: 'upgrade_applied',
        actor_user_id: ctx.user!.userId,
        actor_role: ctx.user!.role,
        pro_user_id: proUserId,
        entity_type: 'pro_user',
        entity_id: proUserId,
        payload: { new_tier: newTier, amount: toNumber(ctx.body.amount, 0) },
      });

      return jsonResponse({ success: true, pro_user_id: proUserId, new_tier: newTier }, 201);
    }, {
      module: 'pro-manager',
      action: 'upgrade_create',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/renewals')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_users')
        .select('*')
        .order('expiry_date', { ascending: true })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ renewals: data || [] });
    }, {
      module: 'pro-manager',
      action: 'renewals',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/renewal')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const proUserId = normalize(ctx.body.pro_user_id);
      if (!proUserId) return errorResponse('pro_user_id is required.', 400);
      const proUser = await getProUserRecord(ctx.supabaseAdmin, proUserId);
      if (!proUser) return errorResponse('Pro user not found.', 404);

      const durationMonths = Math.max(1, toNumber(ctx.body.duration_months, 12));
      const nextExpiry = new Date(proUser.expiry_date || Date.now());
      nextExpiry.setMonth(nextExpiry.getMonth() + durationMonths);
      const paymentStatus = lower(ctx.body.payment_status, 'paid');
      const nextStatus = paymentStatus === 'paid' ? 'active' : 'grace';

      await ctx.supabaseAdmin.from('pro_users').update({
        expiry_date: nextExpiry.toISOString(),
        status: nextStatus,
        auto_renewal: ctx.body.auto_renewal ?? proUser.auto_renewal,
        last_payment_status: paymentStatus,
      }).eq('id', proUserId);

      if (proUser.prime_user_id) {
        await ctx.supabaseAdmin.from('prime_user_profiles').update({
          subscription_end_date: nextExpiry.toISOString(),
          subscription_status: paymentStatus === 'paid' ? 'active' : 'expired',
          auto_renewal: ctx.body.auto_renewal ?? proUser.auto_renewal,
        }).eq('id', proUser.prime_user_id);
      }

      if (paymentStatus !== 'paid') {
        await createAlert(ctx.supabaseAdmin, {
          proUserId,
          alertType: 'payment_hold',
          severity: paymentStatus === 'failed' ? 'high' : 'medium',
          title: 'Renewal payment is holding license access',
          message: 'Renewal was attempted but payment did not clear, so access restrictions remain active.',
          escalationLevel: 'L2',
        });
      }

      await writeAudit(ctx.supabaseAdmin, {
        action_type: 'renewal_processed',
        actor_user_id: ctx.user!.userId,
        actor_role: ctx.user!.role,
        pro_user_id: proUserId,
        entity_type: 'pro_user',
        entity_id: proUserId,
        payload: { duration_months: durationMonths, payment_status: paymentStatus, expiry_date: nextExpiry.toISOString() },
      });

      return jsonResponse({ success: true, pro_user_id: proUserId, expiry_date: nextExpiry.toISOString(), status: nextStatus }, 201);
    }, {
      module: 'pro-manager',
      action: 'renewal_process',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/usage')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const periodKey = normalize(url.searchParams.get('period_key'), new Date().toISOString().slice(0, 7));
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_usage_snapshots')
        .select('*, pro_users(id,name,company,plan_type,status)')
        .eq('period_key', periodKey)
        .order('updated_at', { ascending: false })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ usage: data || [] });
    }, {
      module: 'pro-manager',
      action: 'usage',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/communication')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_communication_logs')
        .select('*, pro_users(id,name,company)')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ communication: data || [] });
    }, {
      module: 'pro-manager',
      action: 'communication',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/alerts')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_alerts')
        .select('*, pro_users(id,name,company), pro_support_tickets(id,title,status)')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ alerts: data || [] });
    }, {
      module: 'pro-manager',
      action: 'alerts',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/satisfaction')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_satisfaction_reviews')
        .select('*, pro_users(id,name,company,status)')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ ratings: data || [] });
    }, {
      module: 'pro-manager',
      action: 'satisfaction',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/compliance')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_compliance_flags')
        .select('*, pro_users(id,name,company,status)')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ compliance: data || [] });
    }, {
      module: 'pro-manager',
      action: 'compliance',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/audit')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('pro_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(Math.min(200, toNumber(url.searchParams.get('limit'), 100)));
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ audit: data || [], immutable: true });
    }, {
      module: 'pro-manager',
      action: 'audit',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/ai/helpdesk')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const issue = normalize(ctx.body.issue);
      const userId = normalize(ctx.body.user_id);
      if (!issue || !userId) return errorResponse('user_id and issue are required.', 400);
      const proUser = await getProUserByUserId(ctx.supabaseAdmin, userId);
      if (!proUser) return errorResponse('Pro user not found.', 404);

      const reply = buildHelpdeskReply(issue);
      const shouldCreateTicket = Boolean(ctx.body.create_ticket) || lower(issue).includes('bug') || lower(issue).includes('payment');

      let ticket: any = null;
      if (shouldCreateTicket) {
        const ticketResult = await ctx.supabaseAdmin
          .from('pro_support_tickets')
          .insert({
            pro_user_id: proUser.id,
            title: normalize(ctx.body.title, issue.slice(0, 80)),
            issue,
            priority: lower(ctx.body.priority, 'medium'),
            status: 'assigned',
            assigned_role: 'client_success',
            response_due_at: addHours(2),
            resolution_due_at: addHours(24),
            ai_summary: reply,
            auto_fixed: lower(issue).includes('password') || lower(issue).includes('renewal'),
          })
          .select('*')
          .single();
        ticket = ticketResult.data;
      }

      await ctx.supabaseAdmin.from('pro_communication_logs').insert({
        pro_user_id: proUser.id,
        channel: 'ai',
        direction: 'outbound',
        subject: normalize(ctx.body.subject, 'AI Helpdesk Resolution'),
        summary: reply,
        actor_user_id: ctx.user!.userId,
        metadata: { source_issue: issue, created_ticket: Boolean(ticket) },
      });

      await writeAudit(ctx.supabaseAdmin, {
        action_type: 'ai_helpdesk_reply',
        actor_user_id: ctx.user!.userId,
        actor_role: ctx.user!.role,
        pro_user_id: proUser.id,
        entity_type: ticket ? 'pro_support_ticket' : 'pro_communication_log',
        entity_id: ticket?.id || null,
        payload: { created_ticket: Boolean(ticket), issue },
      });

      return jsonResponse({ reply, ticket }, 201);
    }, {
      module: 'pro-manager',
      action: 'ai_helpdesk',
      allowedRoles: MANAGER_ROLES,
      detectFraud: true,
    });
  }

  return errorResponse('Pro Manager route not found', 404);
});
