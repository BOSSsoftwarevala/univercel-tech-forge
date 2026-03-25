import { z } from 'https://esm.sh/zod@3.25.76';
import { withAuth } from '../_shared/middleware.ts';
import { createAuditLog, errorResponse, jsonResponse } from '../_shared/utils.ts';

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

type ParsedIntent = {
  action: string;
  params: Record<string, unknown>;
  risk: RiskLevel;
  approvalRequired: boolean;
};

const commandSchema = z.object({
  text: z.string().min(3),
  approval: z.boolean().optional(),
  idempotency_key: z.string().min(8).optional(),
});

const approvalSchema = z.object({
  ai_action_id: z.string().uuid(),
});

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().max(2000).optional().nullable(),
  assignee_id: z.string().uuid().optional().nullable(),
  priority: z.enum(['low', 'normal', 'high', 'critical']).optional(),
  due_at: z.string().optional().nullable(),
  entity_type: z.string().max(100).optional().nullable(),
  entity_id: z.string().uuid().optional().nullable(),
});

const dealCloseSchema = z.object({
  deal_id: z.string().uuid(),
  status: z.enum(['won', 'lost']).default('won'),
});

const resellerApproveSchema = z.object({
  reseller_id: z.string().uuid(),
});

const walletCreditSchema = z.object({
  wallet_id: z.string().uuid(),
  amount: z.coerce.number().positive(),
  note: z.string().max(500).optional().nullable(),
  approval: z.boolean().optional(),
  idempotency_key: z.string().min(8).optional(),
});

const payoutApproveSchema = z.object({
  payout_id: z.string().uuid(),
  approval: z.boolean().optional(),
  idempotency_key: z.string().min(8).optional(),
});

const serverRestartSchema = z.object({
  server_id: z.string().uuid(),
  approval: z.boolean().optional(),
  idempotency_key: z.string().min(8).optional(),
});

function parseUuidFromText(text: string): string | null {
  const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  return match ? match[0] : null;
}

function parseAmountFromText(text: string): number | null {
  const match = text.match(/(?:amount|credit|wallet)\s+(?:of\s+)?(?:rs\.?|inr|\$)?\s*([0-9]+(?:\.[0-9]{1,2})?)/i);
  return match ? Number(match[1]) : null;
}

function buildIdempotencyKey(action: string, payload: Record<string, unknown>, provided?: string) {
  return provided || `${action}:${JSON.stringify(payload)}`;
}

function parseCommand(text: string): ParsedIntent {
  const normalized = text.trim().toLowerCase();
  const entityId = parseUuidFromText(text);

  if (normalized.startsWith('approve reseller')) {
    if (!entityId) throw new Error('Reseller ID is required');
    return {
      action: 'reseller.approve',
      params: { reseller_id: entityId },
      risk: 'medium',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('approve payout')) {
    if (!entityId) throw new Error('Payout ID is required');
    return {
      action: 'payout.approve',
      params: { payout_id: entityId },
      risk: 'high',
      approvalRequired: true,
    };
  }

  if (normalized.startsWith('restart server')) {
    if (!entityId) throw new Error('Server ID is required');
    return {
      action: 'server.restart',
      params: { server_id: entityId },
      risk: 'high',
      approvalRequired: true,
    };
  }

  if (normalized.startsWith('close deal')) {
    if (!entityId) throw new Error('Deal ID is required');
    return {
      action: 'deal.close',
      params: {
        deal_id: entityId,
        status: normalized.includes('lost') ? 'lost' : 'won',
      },
      risk: 'medium',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('create task')) {
    const title = text.replace(/create task/i, '').trim();
    if (!title) throw new Error('Task title is required');
    return {
      action: 'task.create',
      params: { title },
      risk: 'low',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('credit wallet')) {
    if (!entityId) throw new Error('Wallet ID is required');
    const amount = parseAmountFromText(text);
    if (!amount) throw new Error('Wallet credit amount is required');
    return {
      action: 'wallet.credit',
      params: { wallet_id: entityId, amount },
      risk: amount >= 25000 ? 'high' : 'medium',
      approvalRequired: amount >= 25000,
    };
  }

  // EXTENDED MODULE INTEGRATIONS - ADD ONLY

  if (normalized.startsWith('fix bug') || normalized.startsWith('assign bug')) {
    if (!entityId) throw new Error('Bug/Task ID is required');
    return {
      action: 'dev.fix_bug',
      params: { task_id: entityId },
      risk: 'medium',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('update product')) {
    if (!entityId) throw new Error('Product ID is required');
    return {
      action: 'product.update',
      params: { product_id: entityId },
      risk: 'low',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('create demo')) {
    const title = text.replace(/create demo/i, '').trim();
    if (!title) throw new Error('Demo title is required');
    return {
      action: 'demo.create',
      params: { title },
      risk: 'low',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('track promise')) {
    if (!entityId) throw new Error('Promise ID is required');
    return {
      action: 'promise.track',
      params: { promise_id: entityId },
      risk: 'low',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('manage asset')) {
    if (!entityId) throw new Error('Asset ID is required');
    return {
      action: 'asset.manage',
      params: { asset_id: entityId },
      risk: 'medium',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('launch campaign')) {
    const campaign = text.replace(/launch campaign/i, '').trim();
    if (!campaign) throw new Error('Campaign name is required');
    return {
      action: 'marketing.campaign',
      params: { campaign_name: campaign },
      risk: 'medium',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('support ticket')) {
    if (!entityId) throw new Error('Ticket ID is required');
    return {
      action: 'support.resolve',
      params: { ticket_id: entityId },
      risk: 'low',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('franchise approve')) {
    if (!entityId) throw new Error('Franchise ID is required');
    return {
      action: 'franchise.approve',
      params: { franchise_id: entityId },
      risk: 'high',
      approvalRequired: true,
    };
  }

  if (normalized.startsWith('user ban') || normalized.startsWith('ban user')) {
    if (!entityId) throw new Error('User ID is required');
    return {
      action: 'user.ban',
      params: { user_id: entityId },
      risk: 'high',
      approvalRequired: true,
    };
  }

  if (normalized.startsWith('send notification')) {
    const message = text.replace(/send notification/i, '').trim();
    if (!message) throw new Error('Notification message is required');
    return {
      action: 'notification.send',
      params: { message },
      risk: 'low',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('audit log')) {
    const query = text.replace(/audit log/i, '').trim();
    return {
      action: 'audit.query',
      params: { query: query || 'recent' },
      risk: 'low',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('security scan')) {
    return {
      action: 'security.scan',
      params: {},
      risk: 'medium',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('db optimize')) {
    return {
      action: 'db.optimize',
      params: {},
      risk: 'high',
      approvalRequired: true,
    };
  }

  if (normalized.startsWith('api monitor')) {
    return {
      action: 'api.monitor',
      params: {},
      risk: 'low',
      approvalRequired: false,
    };
  }

  if (normalized.startsWith('vala ai')) {
    const command = text.replace(/vala ai/i, '').trim();
    return {
      action: 'vala.command',
      params: { command },
      risk: 'medium',
      approvalRequired: false,
    };
  }

  throw new Error('Unsupported command. Supported commands: approve reseller, approve payout, restart server, close deal, create task, credit wallet, fix bug, update product, create demo, track promise, manage asset, launch campaign, support ticket, franchise approve, user ban, send notification, audit log, security scan, db optimize, api monitor, vala ai');
}

async function insertEvent(
  supabaseAdmin: any,
  type: string,
  payload: Record<string, unknown>,
  entityType?: string,
  entityId?: string,
  actorId?: string,
) {
  await supabaseAdmin.from('events_log').insert({
    type,
    payload,
    entity_type: entityType || null,
    entity_id: entityId || null,
    actor_id: actorId || null,
  });
}

async function insertAlert(
  supabaseAdmin: any,
  payload: {
    severity: RiskLevel | 'warning' | 'info' | 'emergency';
    type: string;
    title: string;
    message?: string;
    sourceTable?: string;
    sourceId?: string;
    actorId?: string;
    approvalRequired?: boolean;
    payload?: Record<string, unknown>;
  },
) {
  await supabaseAdmin.from('alerts').insert({
    severity: payload.severity === 'critical' ? 'critical' : payload.severity,
    type: payload.type,
    title: payload.title,
    message: payload.message || null,
    source_table: payload.sourceTable || null,
    source_id: payload.sourceId || null,
    actor_id: payload.actorId || null,
    approval_required: payload.approvalRequired || false,
    payload: payload.payload || {},
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 250) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await sleep(delayMs * attempt);
    }
  }
  throw lastError;
}


async function upsertActionLog(
  supabaseAdmin: any,
  input: {
    action: string;
    payload: Record<string, unknown>;
    risk: RiskLevel;
    actor: string;
    idempotencyKey: string;
    status?: string;
    result?: Record<string, unknown>;
  },
) {
  const { data, error } = await supabaseAdmin
    .from('actions_log')
    .insert({
      action: input.action,
      payload: input.payload,
      result: input.result || {},
      risk: input.risk,
      actor: input.actor,
      status: input.status || 'pending',
      idempotency_key: input.idempotencyKey,
    })
    .select('*')
    .single();

  if (!error) {
    return { row: data, reused: false };
  }

  if (!String(error.message || '').toLowerCase().includes('unique')) {
    throw error;
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('actions_log')
    .select('*')
    .eq('idempotency_key', input.idempotencyKey)
    .single();

  if (existingError) throw existingError;

  return { row: existing, reused: true };
}

async function updateActionLog(supabaseAdmin: any, actionLogId: string, status: string, result: Record<string, unknown>) {
  await supabaseAdmin
    .from('actions_log')
    .update({ status, result, updated_at: new Date().toISOString() })
    .eq('id', actionLogId);
}

async function createAIAction(
  supabaseAdmin: any,
  input: {
    intent: string;
    payload: Record<string, unknown>;
    risk: RiskLevel;
    status: string;
    actorId: string;
    actionLogId?: string;
    approvalRequired?: boolean;
    result?: Record<string, unknown>;
  },
) {
  const { data, error } = await supabaseAdmin
    .from('ai_actions')
    .insert({
      intent: input.intent,
      payload: input.payload,
      risk: input.risk,
      status: input.status,
      actor_id: input.actorId,
      action_log_id: input.actionLogId || null,
      approval_required: input.approvalRequired || false,
      result: input.result || {},
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function updateAIAction(supabaseAdmin: any, aiActionId: string, status: string, result: Record<string, unknown>) {
  await supabaseAdmin
    .from('ai_actions')
    .update({ status, result, updated_at: new Date().toISOString() })
    .eq('id', aiActionId);
}

async function createTaskAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const payload = taskSchema.parse(params);
  const { data, error } = await supabaseAdmin
    .from('tasks')
    .insert({
      title: payload.title,
      description: payload.description || null,
      assignee_id: payload.assignee_id || null,
      assigned_to_dev: payload.assignee_id || null,
      created_by: user.userId,
      status: 'open',
      priority: payload.priority || 'normal',
      due_at: payload.due_at || null,
      entity_type: payload.entity_type || null,
      entity_id: payload.entity_id || null,
      source: 'ceo_command',
      remarks: payload.description || payload.title,
    })
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'task_created', { task_id: data.task_id, title: data.title }, 'task', data.task_id, user.userId);
  return {
    task: data,
    event: 'task_created',
  };
}

async function closeDealAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const payload = dealCloseSchema.parse(params);
  const { data, error } = await supabaseAdmin
    .from('deals')
    .update({
      stage: payload.status,
      status: payload.status,
      closed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.deal_id)
    .is('deleted_at', null)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'deal_closed', { deal_id: data.id, status: data.status, value: data.value }, 'deal', data.id, user.userId);
  return {
    deal: data,
    event: 'deal_closed',
  };
}

async function approveResellerAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const payload = resellerApproveSchema.parse(params);
  const { data, error } = await supabaseAdmin
    .from('resellers')
    .update({
      status: 'active',
      onboarding_stage: 'live',
      approved_by: user.userId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.reseller_id)
    .is('deleted_at', null)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'reseller_approved', { reseller_id: data.id, status: data.status }, 'reseller', data.id, user.userId);
  return {
    reseller: data,
    event: 'reseller_approved',
  };
}

async function creditWalletAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const payload = walletCreditSchema.parse(params);
  const { data, error } = await supabaseAdmin.rpc('ceo_credit_wallet', {
    p_actor_id: user.userId,
    p_wallet_id: payload.wallet_id,
    p_amount: payload.amount,
    p_ref_type: 'ceo_wallet_credit',
  });

  if (error) throw error;

  await supabaseAdmin.from('wallet_audit_log').insert({
    user_id: data?.user_id || null,
    operation_type: 'ceo_wallet_credit',
    status: 'completed',
    amount: payload.amount,
    new_balance: data?.new_balance || null,
    wallet_id: payload.wallet_id,
    metadata: {
      actor_id: user.userId,
      note: payload.note || null,
      ledger_entry_id: data?.ledger_entry_id || null,
    },
  });

  await insertEvent(supabaseAdmin, 'wallet_credited', { wallet_id: payload.wallet_id, amount: payload.amount, new_balance: data?.new_balance || 0 }, 'wallet', payload.wallet_id, user.userId);
  return {
    wallet: data,
    event: 'wallet_credited',
  };
}

async function approvePayoutAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const payload = payoutApproveSchema.parse(params);

  const { data: resellerPayout, error: resellerError } = await supabaseAdmin
    .from('reseller_payouts')
    .update({
      payout_status: 'approved',
      status: 'approved',
      approved_by: user.userId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.payout_id)
    .select('*')
    .maybeSingle();

  if (resellerPayout) {
    await insertEvent(supabaseAdmin, 'payout_requested', { payout_id: resellerPayout.id, status: resellerPayout.payout_status || resellerPayout.status || 'approved' }, 'payout', resellerPayout.id, user.userId);
    return { payout: resellerPayout, event: 'payout_requested' };
  }

  if (resellerError && String(resellerError.message || '').toLowerCase().includes('permission')) {
    throw resellerError;
  }

  const { data, error } = await supabaseAdmin
    .from('payouts')
    .update({
      status: 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.payout_id)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'payout_requested', { payout_id: data.id, status: data.status }, 'payout', data.id, user.userId);
  return {
    payout: data,
    event: 'payout_requested',
  };
}

async function restartServerAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const payload = serverRestartSchema.parse(params);
  const now = new Date().toISOString();

  const { data: job, error: jobError } = await supabaseAdmin
    .from('job_queue')
    .insert({
      job_type: 'server_restart',
      status: 'processing',
      payload: {
        server_id: payload.server_id,
        requested_by: user.userId,
      },
      attempts: 1,
      run_at: now,
    })
    .select('*')
    .single();

  if (jobError) throw jobError;

  const { data: server, error: serverError } = await supabaseAdmin
    .from('server_instances')
    .update({
      status: 'warning',
      updated_at: now,
    })
    .eq('id', payload.server_id)
    .select('*')
    .single();

  if (serverError) {
    await supabaseAdmin
      .from('job_queue')
      .update({ status: 'failed', last_error: serverError.message, updated_at: new Date().toISOString() })
      .eq('id', job.id);
    throw serverError;
  }

  await supabaseAdmin.from('server_audit_logs').insert({
    server_id: payload.server_id,
    action: 'CEO restart initiated',
    action_type: 'restart',
    performed_by: user.userId,
    performed_by_role: 'ceo',
    details: { job_id: job.id },
  });

  await supabaseAdmin
    .from('job_queue')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', job.id);

  await insertEvent(supabaseAdmin, 'server_down', { server_id: payload.server_id, requested_restart: true, job_id: job.id }, 'server', payload.server_id, user.userId);
  return {
    server,
    job,
    event: 'server_down',
  };
}

// EXTENDED MODULE ACTION FUNCTIONS - ADD ONLY

async function fixBugAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { task_id } = params as { task_id: string };

  // Assign to development team
  const { data: task, error } = await supabaseAdmin
    .from('tasks')
    .update({
      status: 'in_progress',
      assigned_to_dev: true,
      updated_at: new Date().toISOString(),
    })
    .eq('task_id', task_id)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'bug_assigned', { task_id, assigned_to: 'development' }, 'task', task_id, user.userId);
  return { task, event: 'bug_assigned' };
}

async function updateProductAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { product_id } = params as { product_id: string };

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .update({
      updated_at: new Date().toISOString(),
      last_reviewed_by: user.userId,
    })
    .eq('id', product_id)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'product_updated', { product_id }, 'product', product_id, user.userId);
  return { product, event: 'product_updated' };
}

async function createDemoAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { title } = params as { title: string };

  const { data: demo, error } = await supabaseAdmin
    .from('product_demos')
    .insert({
      title,
      status: 'draft',
      created_by: user.userId,
    })
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'demo_created', { demo_id: demo.id, title }, 'demo', demo.id, user.userId);
  return { demo, event: 'demo_created' };
}

async function trackPromiseAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { promise_id } = params as { promise_id: string };

  const { data: promise, error } = await supabaseAdmin
    .from('promises')
    .update({
      last_checked: new Date().toISOString(),
      checked_by: user.userId,
    })
    .eq('id', promise_id)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'promise_tracked', { promise_id }, 'promise', promise_id, user.userId);
  return { promise, event: 'promise_tracked' };
}

async function manageAssetAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { asset_id } = params as { asset_id: string };

  const { data: asset, error } = await supabaseAdmin
    .from('assets')
    .update({
      last_maintained: new Date().toISOString(),
      maintained_by: user.userId,
    })
    .eq('id', asset_id)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'asset_managed', { asset_id }, 'asset', asset_id, user.userId);
  return { asset, event: 'asset_managed' };
}

async function launchCampaignAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { campaign_name } = params as { campaign_name: string };

  const { data: campaign, error } = await supabaseAdmin
    .from('marketing_campaigns')
    .insert({
      name: campaign_name,
      status: 'active',
      created_by: user.userId,
    })
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'campaign_launched', { campaign_id: campaign.id, name: campaign_name }, 'campaign', campaign.id, user.userId);
  return { campaign, event: 'campaign_launched' };
}

async function resolveSupportTicketAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { ticket_id } = params as { ticket_id: string };

  const { data: ticket, error } = await supabaseAdmin
    .from('support_tickets')
    .update({
      status: 'resolved',
      resolved_by: user.userId,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', ticket_id)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'ticket_resolved', { ticket_id }, 'ticket', ticket_id, user.userId);
  return { ticket, event: 'ticket_resolved' };
}

async function approveFranchiseAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { franchise_id } = params as { franchise_id: string };

  const { data: franchise, error } = await supabaseAdmin
    .from('franchises')
    .update({
      status: 'approved',
      approved_by: user.userId,
      approved_at: new Date().toISOString(),
    })
    .eq('id', franchise_id)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'franchise_approved', { franchise_id }, 'franchise', franchise_id, user.userId);
  return { franchise, event: 'franchise_approved' };
}

async function banUserAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { user_id } = params as { user_id: string };

  const { data: bannedUser, error } = await supabaseAdmin
    .from('profiles')
    .update({
      status: 'banned',
      banned_by: user.userId,
      banned_at: new Date().toISOString(),
    })
    .eq('id', user_id)
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'user_banned', { user_id }, 'user', user_id, user.userId);
  return { user: bannedUser, event: 'user_banned' };
}

async function sendNotificationAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { message } = params as { message: string };

  const { data: notification, error } = await supabaseAdmin
    .from('notifications')
    .insert({
      message,
      type: 'system',
      priority: 'normal',
      created_by: user.userId,
    })
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'notification_sent', { notification_id: notification.id }, 'notification', notification.id, user.userId);
  return { notification, event: 'notification_sent' };
}

async function queryAuditAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { query } = params as { query: string };

  const { data: logs, error } = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .ilike('action', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return { logs, count: logs.length, event: 'audit_queried' };
}

async function securityScanAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  // Trigger security scan job
  const { data: job, error } = await supabaseAdmin
    .from('job_queue')
    .insert({
      job_type: 'security_scan',
      status: 'queued',
      payload: { requested_by: user.userId },
      run_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'security_scan_started', { job_id: job.id }, 'job', job.id, user.userId);
  return { job, event: 'security_scan_started' };
}

async function optimizeDatabaseAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  // Trigger DB optimization job
  const { data: job, error } = await supabaseAdmin
    .from('job_queue')
    .insert({
      job_type: 'db_optimize',
      status: 'queued',
      payload: { requested_by: user.userId },
      run_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'db_optimization_started', { job_id: job.id }, 'job', job.id, user.userId);
  return { job, event: 'db_optimization_started' };
}

async function monitorAPIsAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { data: health, error } = await supabaseAdmin
    .from('api_health')
    .select('*')
    .order('checked_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  return { health, event: 'api_monitoring_checked' };
}

async function valaAICommandAction(supabaseAdmin: any, user: { userId: string }, params: Record<string, unknown>) {
  const { command } = params as { command: string };

  // Forward command to Vala AI system
  const { data: response, error } = await supabaseAdmin
    .from('vala_ai_commands')
    .insert({
      command,
      requested_by: user.userId,
      status: 'processing',
    })
    .select('*')
    .single();

  if (error) throw error;

  await insertEvent(supabaseAdmin, 'vala_command_executed', { command_id: response.id, command }, 'vala_command', response.id, user.userId);
  return { response, event: 'vala_command_executed' };
}

async function executeAction(
  supabaseAdmin: any,
  user: { userId: string; role: string },
  parsedIntent: ParsedIntent,
  options: {
    approval?: boolean;
    idempotencyKey?: string;
    sourceText?: string;
    aiActionId?: string;
  } = {},
) {
  const idempotencyKey = buildIdempotencyKey(parsedIntent.action, parsedIntent.params, options.idempotencyKey);

  const { row: actionLog, reused } = await upsertActionLog(supabaseAdmin, {
    action: parsedIntent.action,
    payload: {
      ...parsedIntent.params,
      source_text: options.sourceText || null,
    },
    risk: parsedIntent.risk,
    actor: user.userId,
    idempotencyKey,
    status: parsedIntent.approvalRequired && !options.approval ? 'approval_required' : 'pending',
  });

  if (reused && actionLog.status !== 'pending') {
    return {
      success: true,
      data: {
        action_log_id: actionLog.id,
        status: actionLog.status,
        reused: true,
        result: actionLog.result,
      },
    };
  }

  if (parsedIntent.approvalRequired && !options.approval) {
    const aiAction = await createAIAction(supabaseAdmin, {
      intent: parsedIntent.action,
      payload: {
        parsed_intent: parsedIntent,
        source_text: options.sourceText || null,
      },
      risk: parsedIntent.risk,
      status: 'approval_required',
      actorId: user.userId,
      actionLogId: actionLog.id,
      approvalRequired: true,
      result: {
        message: 'Approval required before execution',
      },
    });

    await updateActionLog(supabaseAdmin, actionLog.id, 'approval_required', {
      approval_required: true,
      ai_action_id: aiAction.id,
      message: 'Approval required before execution',
    });

    await insertAlert(supabaseAdmin, {
      severity: parsedIntent.risk,
      type: 'approval_required',
      title: `Approval required for ${parsedIntent.action}`,
      message: options.sourceText || parsedIntent.action,
      sourceTable: 'ai_actions',
      sourceId: aiAction.id,
      actorId: user.userId,
      approvalRequired: true,
      payload: { parsed_intent: parsedIntent },
    });

    return {
      success: true,
      data: {
        action_log_id: actionLog.id,
        ai_action_id: aiAction.id,
        status: 'approval_required',
        risk: parsedIntent.risk,
      },
    };
  }

  let result: Record<string, unknown>;

  result = await withRetry(async () => {
    switch (parsedIntent.action) {
      case 'task.create':
        return await createTaskAction(supabaseAdmin, user, parsedIntent.params);
      case 'deal.close':
        return await closeDealAction(supabaseAdmin, user, parsedIntent.params);
      case 'reseller.approve':
        return await approveResellerAction(supabaseAdmin, user, parsedIntent.params);
      case 'wallet.credit':
        return await creditWalletAction(supabaseAdmin, user, parsedIntent.params);
      case 'payout.approve':
        return await approvePayoutAction(supabaseAdmin, user, parsedIntent.params);
      case 'server.restart':
        return await restartServerAction(supabaseAdmin, user, parsedIntent.params);
      case 'dev.fix_bug':
        return await fixBugAction(supabaseAdmin, user, parsedIntent.params);
      case 'product.update':
        return await updateProductAction(supabaseAdmin, user, parsedIntent.params);
      case 'demo.create':
        return await createDemoAction(supabaseAdmin, user, parsedIntent.params);
      case 'promise.track':
        return await trackPromiseAction(supabaseAdmin, user, parsedIntent.params);
      case 'asset.manage':
        return await manageAssetAction(supabaseAdmin, user, parsedIntent.params);
      case 'marketing.campaign':
        return await launchCampaignAction(supabaseAdmin, user, parsedIntent.params);
      case 'support.resolve':
        return await resolveSupportTicketAction(supabaseAdmin, user, parsedIntent.params);
      case 'franchise.approve':
        return await approveFranchiseAction(supabaseAdmin, user, parsedIntent.params);
      case 'user.ban':
        return await banUserAction(supabaseAdmin, user, parsedIntent.params);
      case 'notification.send':
        return await sendNotificationAction(supabaseAdmin, user, parsedIntent.params);
      case 'audit.query':
        return await queryAuditAction(supabaseAdmin, user, parsedIntent.params);
      case 'security.scan':
        return await securityScanAction(supabaseAdmin, user, parsedIntent.params);
      case 'db.optimize':
        return await optimizeDatabaseAction(supabaseAdmin, user, parsedIntent.params);
      case 'api.monitor':
        return await monitorAPIsAction(supabaseAdmin, user, parsedIntent.params);
      case 'vala.command':
        return await valaAICommandAction(supabaseAdmin, user, parsedIntent.params);
      default:
        throw new Error(`Unsupported action: ${parsedIntent.action}`);
    }
  });

  await updateActionLog(supabaseAdmin, actionLog.id, 'completed', result);

  if (options.aiActionId) {
    await updateAIAction(supabaseAdmin, options.aiActionId, 'completed', result);
  } else {
    await createAIAction(supabaseAdmin, {
      intent: parsedIntent.action,
      payload: {
        parsed_intent: parsedIntent,
        source_text: options.sourceText || null,
      },
      risk: parsedIntent.risk,
      status: 'completed',
      actorId: user.userId,
      actionLogId: actionLog.id,
      approvalRequired: false,
      result,
    });
  }

  return {
    success: true,
    data: {
      action_log_id: actionLog.id,
      status: 'completed',
      result,
    },
  };
}

async function collectDashboardData(supabaseAdmin: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [
    alertsResult,
    aiActionsResult,
    actionsResult,
    tasksResult,
    dealsResult,
    healthResult,
    ordersResult,
    resellerOrdersResult,
    paymentsResult,
    promisesResult,
    assetsResult,
    campaignsResult,
    ticketsResult,
    franchisesResult,
    usersResult,
    leadsResult,
  ] = await Promise.all([
    supabaseAdmin.from('alerts').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('ai_actions').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('actions_log').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('tasks').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('deals').select('*').is('deleted_at', null).order('updated_at', { ascending: false }).limit(10),
    supabaseAdmin.from('system_health').select('*').order('timestamp', { ascending: false }).limit(20),
    supabaseAdmin.from('orders').select('total, status, created_at').gte('created_at', todayIso),
    supabaseAdmin.from('reseller_orders').select('net_amount, payment_status, created_at').gte('created_at', todayIso),
    supabaseAdmin.from('payments').select('status').gte('created_at', todayIso),
    supabaseAdmin.from('promises').select('status').order('updated_at', { ascending: false }).limit(20),
    supabaseAdmin.from('assets').select('status').order('updated_at', { ascending: false }).limit(20),
    supabaseAdmin.from('marketing_campaigns').select('status').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('support_tickets').select('status').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('franchises').select('status').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('profiles').select('status').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('leads').select('status').order('created_at', { ascending: false }).limit(20),
  ]);

  const alerts = alertsResult.data || [];
  const aiActions = aiActionsResult.data || [];
  const recentActions = actionsResult.data || [];
  const tasks = tasksResult.data || [];
  const deals = dealsResult.data || [];
  const health = healthResult.data || [];
  const orders = ordersResult.data || [];
  const resellerOrders = resellerOrdersResult.data || [];
  const payments = paymentsResult.data || [];
  const promises = promisesResult.data || [];
  const assets = assetsResult.data || [];
  const campaigns = campaignsResult.data || [];
  const tickets = ticketsResult.data || [];
  const franchises = franchisesResult.data || [];
  const users = usersResult.data || [];
  const leads = leadsResult.data || [];

  const orderRevenue = orders
    .filter((order: any) => ['paid', 'fulfilled'].includes(order.status))
    .reduce((sum: number, order: any) => sum + Number(order.total || 0), 0);
  const resellerRevenue = resellerOrders
    .filter((order: any) => order.payment_status === 'paid')
    .reduce((sum: number, order: any) => sum + Number(order.net_amount || 0), 0);

  const criticalAlerts = alerts.filter((alert: any) => ['critical', 'emergency'].includes(alert.severity) && ['open', 'acknowledged'].includes(alert.status));
  const pendingApprovals = aiActions.filter((action: any) => action.status === 'approval_required');
  const openTasks = tasks.filter((task: any) => !['done', 'completed', 'cancelled'].includes(task.status || 'open'));
  const openDeals = deals.filter((deal: any) => !['won', 'lost', 'archived'].includes(deal.status || 'open'));
  const completedAiActionsToday = aiActions.filter((action: any) => action.status === 'completed' && action.created_at >= todayIso).length;
  const failedPaymentsToday = payments.filter((payment: any) => payment.status === 'failed').length;

  const latestHealth = health.slice(0, 5);
  const averageErrorRate = latestHealth.length
    ? latestHealth.reduce((sum: number, item: any) => sum + Number(item.error_rate || 0), 0) / latestHealth.length
    : 0;
  const averageUptime = latestHealth.length
    ? latestHealth.reduce((sum: number, item: any) => sum + Number(item.uptime || 100), 0) / latestHealth.length
    : 100;

  const healthScore = Math.max(0, Math.min(100, Math.round((averageUptime || 100) - averageErrorRate * 10 - criticalAlerts.length * 8 - failedPaymentsToday * 2)));

  return {
    summary: {
      health_score: healthScore,
      critical_alerts: criticalAlerts.length,
      ai_actions_today: completedAiActionsToday,
      open_tasks: openTasks.length,
      open_deals: openDeals.length,
      open_promises: promises.filter((p: any) => p.status !== 'completed').length,
      active_assets: assets.filter((a: any) => !['archived', 'decommissioned'].includes(a.status || '')).length,
      active_campaigns: campaigns.filter((c: any) => c.status === 'active').length,
      open_tickets: tickets.filter((t: any) => t.status !== 'resolved').length,
      pending_franchises: franchises.filter((f: any) => f.status === 'pending').length,
      active_users: users.filter((u: any) => u.status === 'active').length,
      open_leads: leads.filter((l: any) => (l.status || '').toLowerCase() !== 'converted').length,
      pending_approvals: pendingApprovals.length,
      revenue_today: orderRevenue + resellerRevenue,
    },
    revenue_summary: {
      order_revenue: orderRevenue,
      reseller_revenue: resellerRevenue,
      total_revenue: orderRevenue + resellerRevenue,
    },
    top_risks: criticalAlerts.slice(0, 5),
    critical_alerts: alerts.slice(0, 10),
    pending_approvals: pendingApprovals.slice(0, 10),
    recent_actions: recentActions,
    active_tasks: openTasks.slice(0, 10),
    active_deals: openDeals.slice(0, 10),
    active_promises: promises.slice(0, 10),
    active_assets: assets.slice(0, 10),
    active_campaigns: campaigns.slice(0, 10),
    active_tickets: tickets.slice(0, 10),
    active_franchises: franchises.slice(0, 10),
    health,
  };
}

async function listCollection(supabaseAdmin: any, table: string, url: URL, orderColumn = 'created_at') {
  const page = Number(url.searchParams.get('page') || '1');
  const pageSize = Math.min(Number(url.searchParams.get('pageSize') || '20'), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabaseAdmin
    .from(table)
    .select('*', { count: 'exact' })
    .order(orderColumn, { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    items: data || [],
    page,
    pageSize,
    total: count || 0,
  };
}

type BriefingPriority = 'critical' | 'high' | 'medium' | 'low';

function riskToBriefingPriority(risk: string): BriefingPriority {
  switch (risk) {
    case 'critical': return 'critical';
    case 'high': return 'high';
    case 'medium': return 'medium';
    default: return 'low';
  }
}

// ── Secretary: build briefing ─────────────────────────────────────────────────
  const now = new Date();
  const hourUtc = now.getUTCHours();
  const period: 'morning' | 'afternoon' | 'evening' | 'overnight' =
    hourUtc < 6 ? 'overnight' : hourUtc < 12 ? 'morning' : hourUtc < 18 ? 'afternoon' : 'evening';

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const [alertsResult, tasksResult, aiActionsResult, eventsResult, dealsResult] = await Promise.all([
    supabaseAdmin
      .from('alerts')
      .select('id, severity, type, title, message, approval_required, created_at, source_module')
      .is('deleted_at', null)
      .in('status', ['open', 'acknowledged'])
      .order('created_at', { ascending: false })
      .limit(30),
    supabaseAdmin
      .from('tasks')
      .select('task_id, title, description, status, priority, due_at, entity_type, created_at')
      .is('deleted_at', null)
      .not('status', 'in', '("done","completed","cancelled")')
      .order('created_at', { ascending: false })
      .limit(20),
    supabaseAdmin
      .from('ai_actions')
      .select('id, intent, risk, status, approval_required, created_at')
      .in('status', ['approval_required', 'pending'])
      .order('created_at', { ascending: false })
      .limit(15),
    supabaseAdmin
      .from('system_events')
      .select('id, event_type, source_module, target_module, severity, title, description, requires_action, created_at')
      .gte('created_at', yesterday)
      .order('created_at', { ascending: false })
      .limit(50),
    supabaseAdmin
      .from('deals')
      .select('id, stage, status, summary, updated_at')
      .is('deleted_at', null)
      .not('status', 'in', '("won","lost","archived")')
      .limit(10),
  ]);

  const alerts: any[] = alertsResult.data || [];
  const tasks: any[] = tasksResult.data || [];
  const aiActions: any[] = aiActionsResult.data || [];
  const events: any[] = eventsResult.data || [];
  const deals: any[] = dealsResult.data || [];

  // Build urgent items from critical alerts + high-priority tasks
  const urgentItems = [
    ...alerts
      .filter((a: any) => ['critical', 'emergency'].includes(a.severity))
      .slice(0, 5)
      .map((a: any) => ({
        id: a.id,
        priority: a.severity === 'emergency' ? 'critical' : 'high' as const,
        module: a.source_module || 'system',
        title: a.title || a.type,
        detail: a.message || 'No detail available.',
        actionRequired: Boolean(a.approval_required),
      })),
    ...tasks
      .filter((t: any) => t.priority === 'critical')
      .slice(0, 3)
      .map((t: any) => ({
        id: t.task_id,
        priority: 'critical' as const,
        module: t.entity_type || 'task_manager',
        title: t.title || 'Untitled task',
        detail: t.description || 'No description.',
        actionRequired: true,
        dueAt: t.due_at || undefined,
      })),
  ].slice(0, 8);

  // Pending decisions from AI actions requiring approval
  const pendingDecisions = aiActions.map((a: any) => ({
    id: a.id,
    priority: riskToBriefingPriority(a.risk),
    module: 'ceo_dashboard',
    title: a.intent || 'Pending AI Action',
    detail: `Risk level: ${a.risk}. Status: ${a.status}.`,
    actionRequired: Boolean(a.approval_required),
  }));

  // Module updates from events
  const modulesSeen = new Set<string>();
  const moduleUpdates: any[] = [];
  for (const ev of events) {
    const mod = ev.source_module || 'api_layer';
    if (!modulesSeen.has(mod)) {
      modulesSeen.add(mod);
      moduleUpdates.push({
        module: mod,
        status: ev.severity === 'critical' ? 'error' : 'active',
        lastActivity: ev.created_at,
        summary: ev.title || ev.event_type || 'Recent activity recorded',
      });
    }
    if (moduleUpdates.length >= 12) break;
  }

  // Scheduled actions from pending tasks with due dates
  const scheduledActions = tasks
    .filter((t: any) => t.due_at)
    .slice(0, 8)
    .map((t: any) => ({
      id: t.task_id,
      title: t.title || 'Scheduled task',
      module: t.entity_type || 'task_manager',
      scheduledFor: t.due_at,
      status: t.status === 'in_progress' ? 'executing' : t.status === 'done' ? 'done' : 'pending',
    }));

  // Summary text
  const criticalCount = urgentItems.filter((i: any) => i.priority === 'critical').length;
  const summary = [
    `System briefing for ${period}.`,
    criticalCount > 0 ? `There are ${criticalCount} critical items requiring immediate attention.` : 'No critical items at this time.',
    pendingDecisions.length > 0 ? `${pendingDecisions.length} AI action(s) are waiting for approval.` : '',
    deals.length > 0 ? `${deals.length} active deal(s) in progress.` : '',
    `${moduleUpdates.length} module(s) reported activity in the last 24 hours.`,
  ].filter(Boolean).join(' ');

  return {
    id: `briefing-${Date.now()}`,
    generatedAt: now.toISOString(),
    period,
    summary,
    urgentItems,
    pendingDecisions,
    moduleUpdates,
    scheduledActions,
  };
}

// ── Spy: build surveillance report ────────────────────────────────────────────
async function buildSurveillanceReport(supabaseAdmin: any) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const [healthResult, alertsResult, actionsResult, eventsResult] = await Promise.all([
    supabaseAdmin
      .from('system_health')
      .select('service, status, error_rate, latency, uptime, timestamp')
      .order('timestamp', { ascending: false })
      .limit(200),
    supabaseAdmin
      .from('alerts')
      .select('id, severity, type, title, message, source_module, status, created_at')
      .is('deleted_at', null)
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(100),
    supabaseAdmin
      .from('actions_log')
      .select('id, action, status, module, created_at')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(500),
    supabaseAdmin
      .from('system_events')
      .select('id, event_type, source_module, severity, title, description, created_at')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(200),
  ]);

  const healthRows: any[] = healthResult.data || [];
  const alertRows: any[] = alertsResult.data || [];
  const actionRows: any[] = actionsResult.data || [];
  const eventRows: any[] = eventsResult.data || [];

  // Detect anomalies from health metrics and alerts
  const anomaliesDetected: any[] = [];

  // Error surge: high error rate in health metrics
  const recentHealth = healthRows.filter((h: any) => h.timestamp >= oneHourAgo);
  const serviceErrorRates: Record<string, number[]> = {};
  for (const row of recentHealth) {
    const svc = row.service || 'unknown';
    if (!serviceErrorRates[svc]) serviceErrorRates[svc] = [];
    serviceErrorRates[svc].push(Number(row.error_rate || 0));
  }
  for (const [svc, rates] of Object.entries(serviceErrorRates)) {
    const avg = rates.reduce((s, r) => s + r, 0) / rates.length;
    if (avg > 0.05) {
      anomaliesDetected.push({
        id: `anomaly-error-${svc}`,
        module: svc,
        type: 'error_surge',
        severity: avg > 0.2 ? 'critical' : avg > 0.1 ? 'high' : 'medium',
        description: `Average error rate of ${(avg * 100).toFixed(1)}% detected over the last hour.`,
        detectedAt: now.toISOString(),
        resolved: false,
      });
    }
  }

  // Latency spikes
  const serviceLatencies: Record<string, number[]> = {};
  for (const row of recentHealth) {
    const svc = row.service || 'unknown';
    if (!serviceLatencies[svc]) serviceLatencies[svc] = [];
    if (row.latency != null) serviceLatencies[svc].push(Number(row.latency));
  }
  for (const [svc, latencies] of Object.entries(serviceLatencies)) {
    if (latencies.length === 0) continue;
    const avg = latencies.reduce((s, l) => s + l, 0) / latencies.length;
    if (avg > 2000) {
      anomaliesDetected.push({
        id: `anomaly-latency-${svc}`,
        module: svc,
        type: 'latency_spike',
        severity: avg > 5000 ? 'high' : 'medium',
        description: `Average latency of ${Math.round(avg)}ms detected.`,
        detectedAt: now.toISOString(),
        resolved: false,
      });
    }
  }

  // Auth failures from alerts
  const authAlerts = alertRows.filter((a: any) => a.type === 'auth_failure' || String(a.title || '').toLowerCase().includes('auth'));
  for (const alert of authAlerts.slice(0, 3)) {
    anomaliesDetected.push({
      id: `anomaly-auth-${alert.id}`,
      module: alert.source_module || 'security_layer',
      type: 'auth_failure',
      severity: alert.severity || 'medium',
      description: alert.message || alert.title || 'Authentication failure detected.',
      detectedAt: alert.created_at,
      resolved: ['resolved', 'dismissed'].includes(alert.status),
    });
  }

  // Activity summary per module from actions
  const moduleActivity: Record<string, { last1h: number; last24h: number; failed: number; total: number; actions: Set<string> }> = {};
  for (const action of actionRows) {
    const mod = action.module || 'api_layer';
    if (!moduleActivity[mod]) moduleActivity[mod] = { last1h: 0, last24h: 0, failed: 0, total: 0, actions: new Set() };
    moduleActivity[mod].total++;
    moduleActivity[mod].last24h++;
    if (action.created_at >= oneHourAgo) moduleActivity[mod].last1h++;
    if (action.status === 'failed') moduleActivity[mod].failed++;
    if (action.action) moduleActivity[mod].actions.add(String(action.action).split('.').pop() || action.action);
  }

  const activitySummary = Object.entries(moduleActivity).map(([mod, stats]) => ({
    module: mod,
    actionsLast1h: stats.last1h,
    actionsLast24h: stats.last24h,
    failureRate: stats.total > 0 ? stats.failed / stats.total : 0,
    topActions: Array.from(stats.actions).slice(0, 5),
  }));

  // Security flags from critical / emergency alerts
  const securityFlags = alertRows
    .filter((a: any) => ['critical', 'emergency'].includes(a.severity) && !['resolved', 'dismissed'].includes(a.status))
    .slice(0, 10)
    .map((a: any) => ({
      id: `flag-${a.id}`,
      module: a.source_module || 'security_layer',
      flag: a.title || a.type || 'Security alert',
      severity: a.severity,
      details: a.message || 'No additional details.',
      flaggedAt: a.created_at,
      requiresBossApproval: a.severity === 'emergency',
    }));

  // Determine top anomaly modules
  const moduleCounts: Record<string, number> = {};
  for (const a of anomaliesDetected) {
    moduleCounts[a.module] = (moduleCounts[a.module] || 0) + 1;
  }
  const topAnomalyModules = Object.entries(moduleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([mod]) => mod);

  // Overall threat level
  const criticalAnomalies = anomaliesDetected.filter((a: any) => a.severity === 'critical').length;
  const highAnomalies = anomaliesDetected.filter((a: any) => a.severity === 'high').length;
  const overallThreatLevel: 'low' | 'medium' | 'high' | 'critical' =
    criticalAnomalies > 0 ? 'critical' : highAnomalies > 2 ? 'high' : anomaliesDetected.length > 5 ? 'medium' : 'low';

  return {
    generatedAt: now.toISOString(),
    anomaliesDetected: anomaliesDetected.slice(0, 20),
    activitySummary: activitySummary.slice(0, 20),
    topAnomalyModules,
    overallThreatLevel,
    securityFlags,
  };
}


Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api-ceo', '');
  const method = req.method;

  if (method === 'GET' && (path === '' || path === '/dashboard')) {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const data = await collectDashboardData(supabaseAdmin);
      return jsonResponse(data);
    }, { module: 'ceo_mission_control', action: 'dashboard', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (method === 'GET' && path === '/actions') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const data = await listCollection(supabaseAdmin, 'actions_log', url, 'created_at');
      return jsonResponse(data);
    }, { module: 'ceo_mission_control', action: 'list_actions', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (method === 'GET' && path === '/events') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const data = await listCollection(supabaseAdmin, 'events_log', url, 'created_at');
      return jsonResponse(data);
    }, { module: 'ceo_mission_control', action: 'list_events', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (method === 'GET' && path === '/tasks') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const data = await listCollection(supabaseAdmin, 'tasks', url, 'created_at');
      return jsonResponse(data);
    }, { module: 'ceo_mission_control', action: 'list_tasks', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (method === 'GET' && path === '/deals') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const data = await listCollection(supabaseAdmin, 'deals', url, 'updated_at');
      return jsonResponse(data);
    }, { module: 'ceo_mission_control', action: 'list_deals', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (method === 'GET' && path === '/alerts') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const data = await listCollection(supabaseAdmin, 'alerts', url, 'created_at');
      return jsonResponse(data);
    }, { module: 'ceo_mission_control', action: 'list_alerts', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (method === 'GET' && path === '/health') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const data = await listCollection(supabaseAdmin, 'system_health', url, 'timestamp');
      return jsonResponse(data);
    }, { module: 'ceo_mission_control', action: 'list_health', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  const allMissionRoles = [
    'boss_owner',
    'ceo',
    'admin',
    'finance_manager',
    'legal_compliance',
    'hr_manager',
    'performance_manager',
    'rnd_manager',
    'demo_manager',
    'task_manager',
    'lead_manager',
    'marketing_manager',
    'seo_manager',
    'support',
    'sales_support_manager',
    'franchise',
    'influencer_manager',
    'api_security',
    'security_manager',
    'settings_manager',
    'country_admin',
    'continent_admin',
  ];

  if (method === 'POST' && path === '/command') {
    return withAuth(req, allMissionRoles, async ({ supabaseAdmin, user, body }) => {
      const payload = commandSchema.parse(body);
      const parsedIntent = parseCommand(payload.text);
      const response = await executeAction(supabaseAdmin, user, parsedIntent, {
        approval: payload.approval,
        idempotencyKey: payload.idempotency_key,
        sourceText: payload.text,
      });

      await createAuditLog(supabaseAdmin, user.userId, user.role, 'ceo_mission_control', 'command_executed', {
        text: payload.text,
        parsed_action: parsedIntent.action,
        status: response.data.status,
      });

      return jsonResponse(response.data);
    }, { module: 'ceo_mission_control', action: 'command', skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'admin_action' });
  }

  if (method === 'POST' && path === '/approve') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin, user, body }) => {
      const payload = approvalSchema.parse(body);
      const { data: aiAction, error } = await supabaseAdmin
        .from('ai_actions')
        .select('*')
        .eq('id', payload.ai_action_id)
        .single();

      if (error) throw error;
      if (aiAction.status !== 'approval_required') {
        return errorResponse('AI action is not awaiting approval', 400);
      }

      const parsedIntent = aiAction.payload?.parsed_intent as ParsedIntent | undefined;
      if (!parsedIntent) {
        return errorResponse('Stored intent payload is invalid', 400);
      }

      const response = await executeAction(supabaseAdmin, user, parsedIntent, {
        approval: true,
        idempotencyKey: aiAction.action_log_id || aiAction.id,
        sourceText: String(aiAction.payload?.source_text || parsedIntent.action),
        aiActionId: aiAction.id,
      });

      await createAuditLog(supabaseAdmin, user.userId, user.role, 'ceo_mission_control', 'approved_ai_action', {
        ai_action_id: aiAction.id,
        parsed_action: parsedIntent.action,
      });

      return jsonResponse(response.data);
    }, { module: 'ceo_mission_control', action: 'approve_action', skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'admin_action' });
  }

  const allMissionRolesPost = [
    'boss_owner',
    'ceo',
    'admin',
    'demo_manager',
    'task_manager',
    'lead_manager',
    'marketing_manager',
    'seo_manager',
    'support',
    'sales_support_manager',
    'franchise',
    'influencer_manager',
    'api_security',
    'security_manager',
    'settings_manager',
    'country_admin',
    'continent_admin',
  ];

  const routeSetup = [
    {
      path: '/dev/fix-bug',
      action: 'dev.fix_bug',
      schema: z.object({ task_id: z.string().uuid() }),
      roles: ['boss_owner', 'ceo', 'admin', 'task_manager', 'developer'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ task_id: z.string().uuid() }).parse(body);
        const intent: ParsedIntent = { action: 'dev.fix_bug', params: payload, risk: 'medium', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.task_id });
      },
    },
    {
      path: '/product/update',
      action: 'product.update',
      schema: z.object({ product_id: z.string().uuid() }),
      roles: ['boss_owner', 'ceo', 'admin', 'product_manager'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ product_id: z.string().uuid() }).parse(body);
        const intent: ParsedIntent = { action: 'product.update', params: payload, risk: 'low', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.product_id });
      },
    },
    {
      path: '/demo/create',
      action: 'demo.create',
      schema: z.object({ title: z.string().min(3) }),
      roles: ['boss_owner', 'ceo', 'admin', 'demo_manager'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ title: z.string().min(3) }).parse(body);
        const intent: ParsedIntent = { action: 'demo.create', params: payload, risk: 'low', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.title });
      },
    },
    {
      path: '/promise/track',
      action: 'promise.track',
      schema: z.object({ promise_id: z.string().uuid() }),
      roles: ['boss_owner', 'ceo', 'admin', 'task_manager', 'promise_tracker'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ promise_id: z.string().uuid() }).parse(body);
        const intent: ParsedIntent = { action: 'promise.track', params: payload, risk: 'low', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.promise_id });
      },
    },
    {
      path: '/asset/manage',
      action: 'asset.manage',
      schema: z.object({ asset_id: z.string().uuid() }),
      roles: ['boss_owner', 'ceo', 'admin', 'asset_manager'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ asset_id: z.string().uuid() }).parse(body);
        const intent: ParsedIntent = { action: 'asset.manage', params: payload, risk: 'medium', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.asset_id });
      },
    },
    {
      path: '/marketing/campaign',
      action: 'marketing.campaign',
      schema: z.object({ campaign_name: z.string().min(3) }),
      roles: ['boss_owner', 'ceo', 'admin', 'marketing_manager', 'influencer_manager'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ campaign_name: z.string().min(3) }).parse(body);
        const intent: ParsedIntent = { action: 'marketing.campaign', params: payload, risk: 'medium', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.campaign_name });
      },
    },
    {
      path: '/support/resolve',
      action: 'support.resolve',
      schema: z.object({ ticket_id: z.string().uuid() }),
      roles: ['boss_owner', 'ceo', 'admin', 'support', 'sales_support_manager'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ ticket_id: z.string().uuid() }).parse(body);
        const intent: ParsedIntent = { action: 'support.resolve', params: payload, risk: 'low', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.ticket_id });
      },
    },
    {
      path: '/franchise/approve',
      action: 'franchise.approve',
      schema: z.object({ franchise_id: z.string().uuid() }),
      roles: ['boss_owner', 'ceo', 'admin', 'franchise'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ franchise_id: z.string().uuid() }).parse(body);
        const intent: ParsedIntent = { action: 'franchise.approve', params: payload, risk: 'high', approvalRequired: true };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.franchise_id });
      },
    },
    {
      path: '/user/ban',
      action: 'user.ban',
      schema: z.object({ user_id: z.string().uuid() }),
      roles: ['boss_owner', 'ceo', 'admin', 'security_manager'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ user_id: z.string().uuid() }).parse(body);
        const intent: ParsedIntent = { action: 'user.ban', params: payload, risk: 'high', approvalRequired: true };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.user_id });
      },
    },
    {
      path: '/notification/send',
      action: 'notification.send',
      schema: z.object({ message: z.string().min(1) }),
      roles: ['boss_owner', 'ceo', 'admin'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ message: z.string().min(1) }).parse(body);
        const intent: ParsedIntent = { action: 'notification.send', params: payload, risk: 'low', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.message });
      },
    },
    {
      path: '/security/scan',
      action: 'security.scan',
      schema: z.object({}),
      roles: ['boss_owner', 'ceo', 'admin', 'api_security', 'security_manager'],
      apply: async ({ supabaseAdmin, user }: any) => {
        const intent: ParsedIntent = { action: 'security.scan', params: {}, risk: 'medium', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: `security_scan:${new Date().toISOString()}` });
      },
    },
    {
      path: '/db/optimize',
      action: 'db.optimize',
      schema: z.object({}),
      roles: ['boss_owner', 'ceo', 'admin', 'database_manager'],
      apply: async ({ supabaseAdmin, user }: any) => {
        const intent: ParsedIntent = { action: 'db.optimize', params: {}, risk: 'high', approvalRequired: true };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: `db_optimize:${new Date().toISOString()}` });
      },
    },
    {
      path: '/api/monitor',
      action: 'api.monitor',
      schema: z.object({}),
      roles: allMissionRolesPost,
      apply: async ({ supabaseAdmin, user }: any) => {
        const intent: ParsedIntent = { action: 'api.monitor', params: {}, risk: 'low', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: `api_monitor:${new Date().toISOString()}` });
      },
    },
    {
      path: '/vala/command',
      action: 'vala.command',
      schema: z.object({ command: z.string().min(3) }),
      roles: ['boss_owner', 'ceo', 'admin', 'ai_manager'],
      apply: async ({ supabaseAdmin, user, body }: any) => {
        const payload = z.object({ command: z.string().min(3) }).parse(body);
        const intent: ParsedIntent = { action: 'vala.command', params: payload, risk: 'medium', approvalRequired: false };
        return executeAction(supabaseAdmin, user, intent, { idempotencyKey: payload.command });
      },
    },
  ];

  for (const route of routeSetup) {
    if (method === 'POST' && path === route.path) {
      return withAuth(req, route.roles, async ({ supabaseAdmin, user, body }) => {
        const response = await route.apply({ supabaseAdmin, user, body });
        await createAuditLog(supabaseAdmin, user.userId, user.role, 'ceo_mission_control', `execute_${route.action.replace('.', '_')}`, {
          action: route.action,
          params: body,
          result: response.data,
        });
        return jsonResponse(response.data, 200);
      }, { module: 'ceo_mission_control', action: route.action, skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'admin_action' });
    }
  }

  if (method === 'POST' && path === '/events/queue/process') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin', 'api_security', 'security_manager'], async ({ supabaseAdmin }) => {
      const { data: pendingJobs, error: jobError } = await supabaseAdmin
        .from('job_queue')
        .select('*')
        .eq('status', 'queued')
        .order('run_at', { ascending: true })
        .limit(20);

      if (jobError) throw jobError;

      const results: any[] = [];
      for (const job of pendingJobs || []) {
        try {
          // process known job types
          if (job.job_type === 'security_scan') {
            await securityScanAction(supabaseAdmin, { userId: 'system', role: 'system' }, {});
          } else if (job.job_type === 'db_optimize') {
            await optimizeDatabaseAction(supabaseAdmin, { userId: 'system', role: 'system' }, {});
          } else if (job.job_type === 'server_restart' && job.payload?.server_id) {
            await restartServerAction(supabaseAdmin, { userId: 'system', role: 'system' }, { server_id: job.payload.server_id });
          }
          await supabaseAdmin.from('job_queue').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('id', job.id);
          results.push({ job_id: job.id, status: 'processed' });
        } catch (processError) {
          const attempts = (job.attempts || 0) + 1;
          const nextStatus = attempts >= 3 ? 'failed' : 'queued';
          await supabaseAdmin
            .from('job_queue')
            .update({ status: nextStatus, attempts, last_error: String(processError), updated_at: new Date().toISOString() })
            .eq('id', job.id);
          if (nextStatus === 'failed') {
            await insertAlert(supabaseAdmin, {
              severity: 'critical',
              type: 'job_processing_failure',
              title: `Job processing failed: ${job.job_type}`,
              message: String(processError),
              sourceTable: 'job_queue',
              sourceId: job.id,
            });
          }
          results.push({ job_id: job.id, status: nextStatus, error: String(processError) });
        }
      }

      return jsonResponse({ processed: results });
    }, { module: 'ceo_mission_control', action: 'process_job_queue', skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'admin_action' });
  }

  if (method === 'POST' && path === '/task/create') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin, user, body }) => {
      const parsedIntent: ParsedIntent = {
        action: 'task.create',
        params: taskSchema.parse(body),
        risk: 'low',
        approvalRequired: false,
      };
      const response = await executeAction(supabaseAdmin, user, parsedIntent, { idempotencyKey: body?.idempotency_key });
      return jsonResponse(response.data, 201);
    }, { module: 'ceo_mission_control', action: 'task_create', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (method === 'POST' && path === '/deal/close') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin, user, body }) => {
      const parsedIntent: ParsedIntent = {
        action: 'deal.close',
        params: dealCloseSchema.parse(body),
        risk: 'medium',
        approvalRequired: false,
      };
      const response = await executeAction(supabaseAdmin, user, parsedIntent, { idempotencyKey: body?.idempotency_key });
      return jsonResponse(response.data);
    }, { module: 'ceo_mission_control', action: 'deal_close', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (method === 'POST' && path === '/reseller/approve') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin, user, body }) => {
      const parsedIntent: ParsedIntent = {
        action: 'reseller.approve',
        params: resellerApproveSchema.parse(body),
        risk: 'medium',
        approvalRequired: false,
      };
      const response = await executeAction(supabaseAdmin, user, parsedIntent, { idempotencyKey: body?.idempotency_key });
      return jsonResponse(response.data);
    }, { module: 'ceo_mission_control', action: 'reseller_approve', skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'admin_action' });
  }

  if (method === 'POST' && path === '/wallet/credit') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin', 'finance_manager'], async ({ supabaseAdmin, user, body }) => {
      const parsedBody = walletCreditSchema.parse(body);
      const parsedIntent: ParsedIntent = {
        action: 'wallet.credit',
        params: parsedBody,
        risk: parsedBody.amount >= 25000 ? 'high' : 'medium',
        approvalRequired: parsedBody.amount >= 25000,
      };
      const response = await executeAction(supabaseAdmin, user, parsedIntent, {
        idempotencyKey: parsedBody.idempotency_key,
        approval: parsedBody.approval,
      });
      return jsonResponse(response.data);
    }, { module: 'ceo_mission_control', action: 'wallet_credit', skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'payment' });
  }

  if (method === 'POST' && path === '/payout/approve') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin', 'finance_manager'], async ({ supabaseAdmin, user, body }) => {
      const parsedBody = payoutApproveSchema.parse(body);
      const parsedIntent: ParsedIntent = {
        action: 'payout.approve',
        params: parsedBody,
        risk: 'high',
        approvalRequired: true,
      };
      const response = await executeAction(supabaseAdmin, user, parsedIntent, {
        idempotencyKey: parsedBody.idempotency_key,
        approval: parsedBody.approval,
      });
      return jsonResponse(response.data);
    }, { module: 'ceo_mission_control', action: 'payout_approve', skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'withdrawal' });
  }

  if (method === 'POST' && path === '/server/restart') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin, user, body }) => {
      const parsedBody = serverRestartSchema.parse(body);
      const parsedIntent: ParsedIntent = {
        action: 'server.restart',
        params: parsedBody,
        risk: 'high',
        approvalRequired: true,
      };
      const response = await executeAction(supabaseAdmin, user, parsedIntent, {
        idempotencyKey: parsedBody.idempotency_key,
        approval: parsedBody.approval,
      });
      return jsonResponse(response.data);
    }, { module: 'ceo_mission_control', action: 'server_restart', skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'admin_action' });
  }

  // ── Secretary: generate briefing ─────────────────────────────────────────
  if (method === 'GET' && path === '/secretary/briefing') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const briefing = await buildSecretaryBriefing(supabaseAdmin);
      return jsonResponse({ briefing });
    }, { module: 'ceo_secretary', action: 'generate_briefing', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  // ── Spy: run surveillance ─────────────────────────────────────────────────
  if (method === 'GET' && path === '/spy/surveillance') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin }) => {
      const report = await buildSurveillanceReport(supabaseAdmin);
      return jsonResponse({ report });
    }, { module: 'ceo_spy', action: 'surveillance_scan', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  // ── Module action trigger ─────────────────────────────────────────────────
  if (method === 'POST' && path === '/module/action') {
    return withAuth(req, ['boss_owner', 'ceo', 'admin'], async ({ supabaseAdmin, user, body }) => {
      const moduleId = String(body?.module ?? '');
      const action = String(body?.action ?? '');
      const payload = (body?.payload ?? {}) as Record<string, unknown>;

      if (!moduleId || !action) {
        return errorResponse('module and action are required', 400);
      }

      await insertEvent(
        supabaseAdmin,
        'module_action_triggered',
        { module: moduleId, action, payload, triggered_by: user.userId },
        moduleId,
        null,
        user.userId,
      );

      await createAuditLog(supabaseAdmin, {
        userId: user.userId,
        action: `module_action:${moduleId}:${action}`,
        module: 'ceo_mission_control',
        details: { module: moduleId, action, payload },
      });

      return jsonResponse({ status: 'triggered', module: moduleId, action });
    }, { module: 'ceo_mission_control', action: 'module_action', skipKYC: true, skipSubscription: true, skipIPLock: true, rateLimitType: 'admin_action' });
  }

  return errorResponse('Not found', 404);
});