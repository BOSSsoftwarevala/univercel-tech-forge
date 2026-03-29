import { z } from 'https://esm.sh/zod@3.25.76';
import { corsHeaders, errorResponse, getSupabaseAdmin, getSupabaseClient, getUserFromToken, jsonResponse } from '../_shared/utils.ts';
import { withAuth } from '../_shared/middleware.ts';

const adminRoles = ['boss_owner', 'admin', 'ai_manager', 'ceo'];
const authenticatedRoles = ['client', 'prime', 'reseller', 'franchise', 'developer', 'support', 'admin', 'ai_manager', 'boss_owner', 'ceo'];

const apiSchema = z.object({
  name: z.string().min(2),
  provider: z.string().min(2),
  type: z.enum(['auth', 'payment', 'messaging', 'crm', 'seo', 'ai', 'server', 'analytics', 'storage', 'other']),
  endpoint: z.string().min(1),
  price_per_request: z.coerce.number().min(0),
  price_per_token: z.coerce.number().min(0),
  max_limit: z.coerce.number().int().min(1),
  speed_mode: z.enum(['economy', 'standard', 'priority']),
  status: z.enum(['running', 'stopped', 'error', 'pending']).optional(),
  notes: z.string().max(1000).optional().nullable(),
});

const apiUpdateSchema = apiSchema.partial().extend({
  is_enabled: z.boolean().optional(),
  billing_status: z.enum(['paid', 'unpaid', 'trial', 'overdue']).optional(),
});

const limitSchema = z.object({
  max_limit: z.coerce.number().int().min(1),
});

const buySchema = z.object({
  api_id: z.string().uuid(),
  plan_type: z.enum(['daily', 'monthly', 'per_use']),
  usage_limit: z.coerce.number().int().min(1).optional(),
});

const addMoneySchema = z.object({
  amount: z.coerce.number().positive(),
});

const usageSchema = z.object({
  request_count: z.coerce.number().int().min(1).default(1),
  tokens_used: z.coerce.number().int().min(0).default(0),
  source: z.string().min(2).max(50).optional(),
});

function normalizePath(pathname: string) {
  return pathname
    .replace(/^.*\/functions\/v1\/api-ai-marketplace/, '')
    .replace(/^.*\/api-ai-marketplace/, '') || '/';
}

function parseJson<T>(value: unknown, schema: z.ZodSchema<T>): T {
  return schema.parse(value);
}

function cents(amount: number) {
  return Number(amount.toFixed(6));
}

function maskedKey(key: string) {
  if (key.length <= 8) return key;
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function generateApiKey(serviceName: string) {
  const normalized = serviceName.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase() || 'SVAPI';
  const random = crypto.randomUUID().replace(/-/g, '').toUpperCase();
  return `sv_${normalized}_${random}`;
}

async function ensureWallet(supabaseAdmin: any, userId: string, role = 'client') {
  const { data: existing } = await supabaseAdmin
    .from('unified_wallets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const { data, error } = await supabaseAdmin
    .from('unified_wallets')
    .insert({
      user_id: userId,
      user_role: role,
      currency: 'INR',
      available_balance: 0,
      pending_balance: 0,
      total_earned: 0,
      total_withdrawn: 0,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getProfile(supabaseAdmin: any, userId: string) {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('full_name, display_name, email')
    .eq('user_id', userId)
    .maybeSingle();
  return data;
}

async function createAlert(
  supabaseAdmin: any,
  clientUserId: string,
  payload: {
    subscription_id?: string | null;
    api_service_id?: string | null;
    api_key_id?: string | null;
    alert_type: 'usage_80' | 'wallet_low' | 'api_error' | 'limit_exceeded' | 'billing_blocked';
    title: string;
    message: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    metadata?: Record<string, unknown>;
  }
) {
  await supabaseAdmin.from('ai_api_alerts').insert({
    client_user_id: clientUserId,
    subscription_id: payload.subscription_id || null,
    api_service_id: payload.api_service_id || null,
    api_key_id: payload.api_key_id || null,
    alert_type: payload.alert_type,
    title: payload.title,
    message: payload.message,
    severity: payload.severity || 'medium',
    metadata: payload.metadata || {},
  });
}

async function recordWalletTransaction(supabaseAdmin: any, wallet: any, userId: string, amount: number, type: string, description: string, referenceId?: string) {
  const nextBalance = cents(Number(wallet.available_balance || 0) + amount);

  const { error: walletError } = await supabaseAdmin
    .from('unified_wallets')
    .update({
      available_balance: nextBalance,
      total_earned: amount > 0 ? cents(Number(wallet.total_earned || 0) + amount) : wallet.total_earned,
      updated_at: new Date().toISOString(),
    })
    .eq('id', wallet.id);

  if (walletError) {
    throw new Error(walletError.message);
  }

  await supabaseAdmin.from('unified_wallet_transactions').insert({
    wallet_id: wallet.id,
    user_id: userId,
    transaction_type: type,
    amount,
    balance_after: nextBalance,
    description,
    reference_id: referenceId || null,
    reference_type: 'ai_api_marketplace',
    status: 'completed',
    currency: 'INR',
  });

  await supabaseAdmin.from('transactions').insert({
    wallet_id: wallet.id,
    amount: Math.abs(amount),
    type,
    status: 'completed',
    reference: referenceId || description,
    related_user: userId,
    related_role: 'client',
  });

  return nextBalance;
}

async function logAudit(supabaseAdmin: any, actorId: string, role: string, action: string, meta: Record<string, unknown>) {
  await supabaseAdmin.from('audit_logs').insert({
    user_id: actorId,
    role,
    module: 'ai_api_marketplace',
    action,
    meta_json: meta,
  });
}

async function processUsage(supabaseAdmin: any, apiKeyValue: string, payload: z.infer<typeof usageSchema>) {
  const { data: key, error: keyError } = await supabaseAdmin
    .from('ai_api_client_keys')
    .select('*, ai_api_client_subscriptions(*), platform_api_services(*)')
    .eq('api_key', apiKeyValue)
    .maybeSingle();

  if (keyError) {
    throw new Error(keyError.message);
  }

  if (!key) {
    return errorResponse('Invalid API key', 401);
  }

  const subscription = key.ai_api_client_subscriptions;
  const service = key.platform_api_services;

  if (!subscription || !service) {
    return errorResponse('Subscription not found for API key', 404);
  }

  if (key.status !== 'active' || subscription.status !== 'active' || !service.is_enabled) {
    await createAlert(supabaseAdmin, key.client_user_id, {
      subscription_id: subscription.id,
      api_service_id: service.id,
      api_key_id: key.id,
      alert_type: 'billing_blocked',
      title: 'API access blocked',
      message: `${service.name} request rejected because the key or subscription is inactive.`,
      severity: 'high',
      metadata: { key_status: key.status, subscription_status: subscription.status, service_enabled: service.is_enabled },
    });
    return errorResponse('API access blocked', 403);
  }

  if (subscription.expiry_at && new Date(subscription.expiry_at).getTime() < Date.now()) {
    await supabaseAdmin.from('ai_api_client_subscriptions').update({ status: 'expired', updated_at: new Date().toISOString() }).eq('id', subscription.id);
    await supabaseAdmin.from('ai_api_client_keys').update({ status: 'expired', updated_at: new Date().toISOString() }).eq('id', key.id);
    return errorResponse('Subscription expired', 403);
  }

  const nextUsage = Number(subscription.usage_count || 0) + Number(payload.request_count || 1);
  const hardLimit = Math.min(Number(subscription.usage_limit || 0) || Number(service.max_limit || 0), Number(service.max_limit || 0));
  if (hardLimit > 0 && nextUsage > hardLimit) {
    await supabaseAdmin.from('ai_api_client_keys').update({ status: 'blocked', updated_at: new Date().toISOString() }).eq('id', key.id);
    await supabaseAdmin.from('ai_api_client_subscriptions').update({ status: 'blocked', updated_at: new Date().toISOString() }).eq('id', subscription.id);
    await supabaseAdmin.from('ai_api_usage_events').insert({
      subscription_id: subscription.id,
      api_key_id: key.id,
      client_user_id: key.client_user_id,
      api_service_id: service.id,
      request_count: payload.request_count,
      tokens_used: payload.tokens_used,
      cost: 0,
      status: 'blocked',
      error_message: 'Limit exceeded',
      source: payload.source || 'gateway',
    });
    await createAlert(supabaseAdmin, key.client_user_id, {
      subscription_id: subscription.id,
      api_service_id: service.id,
      api_key_id: key.id,
      alert_type: 'limit_exceeded',
      title: 'Usage limit exceeded',
      message: `${service.name} has been blocked because the usage limit was exceeded.`,
      severity: 'critical',
      metadata: { limit: hardLimit, attempted_usage: nextUsage },
    });
    return errorResponse('Usage limit exceeded', 403);
  }

  const cost = cents((Number(payload.request_count || 1) * Number(service.price_per_request || 0)) + (Number(payload.tokens_used || 0) * Number(service.price_per_token || 0)));
  const wallet = await ensureWallet(supabaseAdmin, key.client_user_id);
  const availableBalance = Number(wallet.available_balance || 0);

  if (availableBalance < cost) {
    await createAlert(supabaseAdmin, key.client_user_id, {
      subscription_id: subscription.id,
      api_service_id: service.id,
      api_key_id: key.id,
      alert_type: availableBalance <= 0 ? 'billing_blocked' : 'wallet_low',
      title: availableBalance <= 0 ? 'Wallet depleted' : 'Wallet low',
      message: `${service.name} call rejected because wallet balance is insufficient.`,
      severity: availableBalance <= 0 ? 'critical' : 'high',
      metadata: { balance: availableBalance, required: cost },
    });

    if (availableBalance <= 0) {
      await supabaseAdmin.from('ai_api_client_subscriptions').update({ status: 'blocked', updated_at: new Date().toISOString() }).eq('id', subscription.id);
      await supabaseAdmin.from('ai_api_client_keys').update({ status: 'blocked', updated_at: new Date().toISOString() }).eq('id', key.id);
    }

    await supabaseAdmin.from('ai_api_usage_events').insert({
      subscription_id: subscription.id,
      api_key_id: key.id,
      client_user_id: key.client_user_id,
      api_service_id: service.id,
      request_count: payload.request_count,
      tokens_used: payload.tokens_used,
      cost,
      status: 'blocked',
      error_message: 'Insufficient wallet balance',
      source: payload.source || 'gateway',
    });

    return errorResponse('Insufficient wallet balance', 402);
  }

  const nextBalance = await recordWalletTransaction(
    supabaseAdmin,
    wallet,
    key.client_user_id,
    -cost,
    'api_usage',
    `Usage charge for ${service.name}`,
    subscription.id,
  );

  const now = new Date().toISOString();
  await supabaseAdmin.from('ai_api_usage_events').insert({
    subscription_id: subscription.id,
    api_key_id: key.id,
    client_user_id: key.client_user_id,
    api_service_id: service.id,
    request_count: payload.request_count,
    tokens_used: payload.tokens_used,
    cost,
    status: 'success',
    source: payload.source || 'gateway',
  });

  await supabaseAdmin.from('ai_api_client_subscriptions').update({
    usage_count: nextUsage,
    last_used_at: now,
    last_billed_at: now,
    updated_at: now,
  }).eq('id', subscription.id);

  await supabaseAdmin.from('ai_api_client_keys').update({
    usage_count: Number(key.usage_count || 0) + Number(payload.request_count || 1),
    last_used_at: now,
    updated_at: now,
  }).eq('id', key.id);

  await supabaseAdmin.from('platform_api_services').update({
    usage_count: Number(service.usage_count || 0) + Number(payload.request_count || 1),
    last_call_at: now,
    updated_at: now,
  }).eq('id', service.id);

  const percentUsed = hardLimit > 0 ? (nextUsage / hardLimit) * 100 : 0;
  if (percentUsed >= 80) {
    await createAlert(supabaseAdmin, key.client_user_id, {
      subscription_id: subscription.id,
      api_service_id: service.id,
      api_key_id: key.id,
      alert_type: 'usage_80',
      title: 'Usage crossed 80%',
      message: `${service.name} has reached ${percentUsed.toFixed(1)}% of its limit.`,
      severity: percentUsed >= 95 ? 'high' : 'medium',
      metadata: { percent_used: percentUsed, usage_count: nextUsage, limit: hardLimit },
    });
  }

  if (nextBalance <= Math.max(cost * 2, 20)) {
    await createAlert(supabaseAdmin, key.client_user_id, {
      subscription_id: subscription.id,
      api_service_id: service.id,
      api_key_id: key.id,
      alert_type: 'wallet_low',
      title: 'Wallet running low',
      message: `Balance is ₹${nextBalance.toFixed(2)} after billing ${service.name}.`,
      severity: nextBalance <= 0 ? 'critical' : 'medium',
      metadata: { remaining_balance: nextBalance, charged_cost: cost },
    });
  }

  return jsonResponse({
    key_id: key.id,
    subscription_id: subscription.id,
    api_id: service.id,
    service_name: service.name,
    usage_count: nextUsage,
    usage_limit: hardLimit,
    cost,
    remaining_balance: nextBalance,
    blocked: false,
  });
}

async function handlePublicGateway(req: Request, path: string) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST' || path !== '/gateway/use') {
    return null;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const authHeader = req.headers.get('Authorization') || '';
  const client = authHeader ? getSupabaseClient(authHeader) : null;
  const user = client ? await getUserFromToken(client) : null;
  const body = await req.json().catch(() => ({}));
  const payload = parseJson(body, usageSchema);
  const headerKey = req.headers.get('x-api-key');
  const apiKeyValue = headerKey || body?.api_key;

  if (!apiKeyValue) {
    return errorResponse('Missing API key', 401);
  }

  const response = await processUsage(supabaseAdmin, apiKeyValue, payload);

  if (user) {
    await logAudit(supabaseAdmin, user.userId, user.role, 'gateway_use', {
      path,
      source: payload.source || 'gateway',
      status: response.status,
    });
  }

  return response;
}

async function listAdminDashboard(supabaseAdmin: any) {
  const [
    servicesSummary,
    subscriptionSummary,
    usageSummary,
    alertSummary,
  ] = await Promise.all([
    supabaseAdmin.from('platform_api_services').select('id, status, is_enabled, usage_count', { count: 'exact' }),
    supabaseAdmin.from('ai_api_client_subscriptions').select('id, status', { count: 'exact' }),
    supabaseAdmin.from('ai_api_usage_events').select('cost, request_count, created_at').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabaseAdmin.from('ai_api_alerts').select('id, severity, is_read', { count: 'exact' }).eq('is_read', false),
  ]);

  const services = servicesSummary.data || [];
  const subscriptions = subscriptionSummary.data || [];
  const usage = usageSummary.data || [];
  const alerts = alertSummary.data || [];

  return {
    totals: {
      apis: servicesSummary.count || 0,
      running: services.filter((service: any) => service.status === 'running' && service.is_enabled).length,
      subscriptions: subscriptionSummary.count || 0,
      activeSubscriptions: subscriptions.filter((subscription: any) => subscription.status === 'active').length,
      monthlyRevenue: cents(usage.reduce((sum: number, item: any) => sum + Number(item.cost || 0), 0)),
      requests: usage.reduce((sum: number, item: any) => sum + Number(item.request_count || 0), 0),
      unreadAlerts: alertSummary.count || 0,
      criticalAlerts: alerts.filter((alert: any) => alert.severity === 'critical').length,
    },
  };
}

async function listAdminApis(supabaseAdmin: any) {
  const { data, error } = await supabaseAdmin
    .from('platform_api_services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    items: data || [],
  };
}

async function listAdminAlerts(supabaseAdmin: any) {
  const { data, error } = await supabaseAdmin
    .from('ai_api_alerts')
    .select('*, platform_api_services(name)')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  const userIds = Array.from(new Set((data || []).map((item: any) => item.client_user_id).filter(Boolean)));
  const { data: profiles } = userIds.length > 0
    ? await supabaseAdmin
        .from('profiles')
        .select('user_id, full_name, display_name, email')
        .in('user_id', userIds)
    : { data: [] };

  const profileMap = new Map((profiles || []).map((profile: any) => [profile.user_id, profile]));

  return {
    items: (data || []).map((item: any) => ({
      ...item,
      api_name: item.platform_api_services?.name || 'Unknown API',
      client_name: profileMap.get(item.client_user_id)?.display_name
        || profileMap.get(item.client_user_id)?.full_name
        || profileMap.get(item.client_user_id)?.email
        || 'Unknown client',
    })),
  };
}

async function listApiHistory(supabaseAdmin: any, apiId: string) {
  const [{ data: service }, { data: logs }, { data: subscriptions }] = await Promise.all([
    supabaseAdmin.from('platform_api_services').select('*').eq('id', apiId).maybeSingle(),
    supabaseAdmin.from('ai_api_usage_events').select('*').eq('api_service_id', apiId).order('created_at', { ascending: false }).limit(100),
    supabaseAdmin.from('ai_api_client_subscriptions').select('id, client_user_id, status, usage_count, usage_limit, expiry_at').eq('api_service_id', apiId).order('created_at', { ascending: false }),
  ]);

  return {
    service,
    usage_logs: logs || [],
    subscriptions: subscriptions || [],
  };
}

async function listClientCatalog(supabaseAdmin: any, userId: string) {
  const wallet = await ensureWallet(supabaseAdmin, userId);
  const profile = await getProfile(supabaseAdmin, userId);

  const { data, error } = await supabaseAdmin
    .from('platform_api_services')
    .select('*')
    .eq('is_enabled', true)
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return {
    wallet,
    client: {
      id: userId,
      name: profile?.display_name || profile?.full_name || profile?.email || 'Client',
      email: profile?.email || '',
    },
    items: data || [],
  };
}

async function listClientSubscriptions(supabaseAdmin: any, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('ai_api_client_subscriptions')
    .select('*, platform_api_services(*), ai_api_client_keys(*)')
    .eq('client_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data || []).map((item: any) => ({
      ...item,
      service: item.platform_api_services,
      api_key: item.ai_api_client_keys?.[0]
        ? {
            id: item.ai_api_client_keys[0].id,
            masked_key: maskedKey(item.ai_api_client_keys[0].api_key),
            status: item.ai_api_client_keys[0].status,
            usage_count: item.ai_api_client_keys[0].usage_count,
            usage_limit: item.ai_api_client_keys[0].usage_limit,
            expiry_at: item.ai_api_client_keys[0].expiry_at,
          }
        : null,
    })),
  };
}

async function listClientAlerts(supabaseAdmin: any, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('ai_api_alerts')
    .select('*, platform_api_services(name)')
    .eq('client_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data || []).map((item: any) => ({
      ...item,
      api_name: item.platform_api_services?.name || 'Unknown API',
    })),
  };
}

async function buyApiSubscription(supabaseAdmin: any, user: { userId: string; role: string }, body: z.infer<typeof buySchema>) {
  const { data: service, error: serviceError } = await supabaseAdmin
    .from('platform_api_services')
    .select('*')
    .eq('id', body.api_id)
    .eq('is_enabled', true)
    .maybeSingle();

  if (serviceError) {
    throw new Error(serviceError.message);
  }

  if (!service) {
    return errorResponse('API product not found', 404);
  }

  const wallet = await ensureWallet(supabaseAdmin, user.userId, user.role);
  const usageLimit = body.usage_limit || Number(service.max_limit || 0) || 100;
  const multiplier = body.plan_type === 'monthly' ? 30 : 1;
  const purchaseAmount = cents(Number(service.price_per_request || 0) * usageLimit * multiplier);

  if (Number(wallet.available_balance || 0) < purchaseAmount) {
    return errorResponse(`Insufficient wallet balance. Required ₹${purchaseAmount.toFixed(2)}`, 402);
  }

  const expiryAt = body.plan_type === 'per_use'
    ? null
    : new Date(Date.now() + (body.plan_type === 'daily' ? 24 : 30 * 24) * 60 * 60 * 1000).toISOString();

  const now = new Date().toISOString();
  const { data: subscription, error: subscriptionError } = await supabaseAdmin
    .from('ai_api_client_subscriptions')
    .insert({
      client_user_id: user.userId,
      api_service_id: service.id,
      wallet_id: wallet.id,
      plan_type: body.plan_type,
      usage_limit: usageLimit,
      usage_count: 0,
      expiry_at: expiryAt,
      status: 'active',
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single();

  if (subscriptionError) {
    throw new Error(subscriptionError.message);
  }

  const apiKeyValue = generateApiKey(service.name);
  const apiKeyHash = await sha256(apiKeyValue);
  const { data: apiKey, error: keyError } = await supabaseAdmin
    .from('ai_api_client_keys')
    .insert({
      subscription_id: subscription.id,
      client_user_id: user.userId,
      api_service_id: service.id,
      api_key: apiKeyValue,
      api_key_hash: apiKeyHash,
      key_prefix: apiKeyValue.slice(0, 12),
      usage_limit: usageLimit,
      expiry_at: expiryAt,
      status: 'active',
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single();

  if (keyError) {
    throw new Error(keyError.message);
  }

  await recordWalletTransaction(
    supabaseAdmin,
    wallet,
    user.userId,
    -purchaseAmount,
    'api_buy',
    `Purchased ${service.name} (${body.plan_type})`,
    subscription.id,
  );

  await logAudit(supabaseAdmin, user.userId, user.role, 'buy_api', {
    api_id: service.id,
    plan_type: body.plan_type,
    usage_limit: usageLimit,
    purchase_amount: purchaseAmount,
  });

  return jsonResponse({
    subscription,
    api_key: apiKeyValue,
    masked_key: maskedKey(apiKeyValue),
    purchase_amount: purchaseAmount,
  }, 201);
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = normalizePath(url.pathname);

  const publicGateway = await handlePublicGateway(req, path);
  if (publicGateway) {
    return publicGateway;
  }

  if (req.method === 'GET' && path === '/health') {
    return jsonResponse({ ok: true, path });
  }

  if (req.method === 'GET' && path === '/admin/dashboard') {
    return withAuth(req, adminRoles, async ({ supabaseAdmin }) => jsonResponse(await listAdminDashboard(supabaseAdmin)), {
      module: 'ai_api_marketplace',
      action: 'admin_dashboard',
      skipKYC: true,
      skipSubscription: true,
    });
  }

  if (req.method === 'GET' && path === '/admin/apis') {
    return withAuth(req, adminRoles, async ({ supabaseAdmin }) => jsonResponse(await listAdminApis(supabaseAdmin)), {
      module: 'ai_api_marketplace',
      action: 'list_admin_apis',
      skipKYC: true,
      skipSubscription: true,
    });
  }

  if (req.method === 'POST' && path === '/admin/apis') {
    return withAuth(req, adminRoles, async ({ supabaseAdmin, user, body }) => {
      const payload = parseJson(body, apiSchema);
      const { data, error } = await supabaseAdmin
        .from('platform_api_services')
        .insert({
          ...payload,
          status: payload.status || 'stopped',
          billing_status: 'paid',
          is_enabled: true,
        })
        .select('*')
        .single();

      if (error) {
        return errorResponse(error.message, 400);
      }

      await logAudit(supabaseAdmin, user.userId, user.role, 'add_api', { api_id: data.id, name: data.name });
      return jsonResponse({ item: data }, 201);
    }, { module: 'ai_api_marketplace', action: 'add_api', rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  const apiIdMatch = path.match(/^\/admin\/apis\/([0-9a-f-]+)$/i);
  if (req.method === 'POST' && apiIdMatch) {
    return withAuth(req, adminRoles, async ({ supabaseAdmin, user, body }) => {
      const payload = parseJson(body, apiUpdateSchema);
      const { data, error } = await supabaseAdmin
        .from('platform_api_services')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', apiIdMatch[1])
        .select('*')
        .single();

      if (error) {
        return errorResponse(error.message, 400);
      }

      await logAudit(supabaseAdmin, user.userId, user.role, 'edit_api', { api_id: data.id, fields: Object.keys(payload) });
      return jsonResponse({ item: data });
    }, { module: 'ai_api_marketplace', action: 'edit_api', rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  const apiToggleMatch = path.match(/^\/admin\/apis\/([0-9a-f-]+)\/toggle$/i);
  if (req.method === 'POST' && apiToggleMatch) {
    return withAuth(req, adminRoles, async ({ supabaseAdmin, user }) => {
      const { data: service, error: fetchError } = await supabaseAdmin.from('platform_api_services').select('*').eq('id', apiToggleMatch[1]).single();
      if (fetchError || !service) {
        return errorResponse('API not found', 404);
      }

      const nextEnabled = !service.is_enabled;
      const nextStatus = nextEnabled ? (service.status === 'stopped' ? 'running' : service.status) : 'stopped';
      const { data, error } = await supabaseAdmin
        .from('platform_api_services')
        .update({ is_enabled: nextEnabled, status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', apiToggleMatch[1])
        .select('*')
        .single();

      if (error) {
        return errorResponse(error.message, 400);
      }

      await logAudit(supabaseAdmin, user.userId, user.role, 'toggle_api', { api_id: data.id, is_enabled: nextEnabled });
      return jsonResponse({ item: data });
    }, { module: 'ai_api_marketplace', action: 'toggle_api', rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  const apiLimitMatch = path.match(/^\/admin\/apis\/([0-9a-f-]+)\/limit$/i);
  if (req.method === 'POST' && apiLimitMatch) {
    return withAuth(req, adminRoles, async ({ supabaseAdmin, user, body }) => {
      const payload = parseJson(body, limitSchema);
      const { data, error } = await supabaseAdmin
        .from('platform_api_services')
        .update({ max_limit: payload.max_limit, updated_at: new Date().toISOString() })
        .eq('id', apiLimitMatch[1])
        .select('*')
        .single();

      if (error) {
        return errorResponse(error.message, 400);
      }

      await logAudit(supabaseAdmin, user.userId, user.role, 'limit_api', { api_id: data.id, max_limit: payload.max_limit });
      return jsonResponse({ item: data });
    }, { module: 'ai_api_marketplace', action: 'limit_api', rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  const apiHistoryMatch = path.match(/^\/admin\/apis\/([0-9a-f-]+)\/history$/i);
  if (req.method === 'GET' && apiHistoryMatch) {
    return withAuth(req, adminRoles, async ({ supabaseAdmin }) => jsonResponse(await listApiHistory(supabaseAdmin, apiHistoryMatch[1])), {
      module: 'ai_api_marketplace',
      action: 'api_history',
      skipKYC: true,
      skipSubscription: true,
    });
  }

  if (req.method === 'GET' && path === '/admin/alerts') {
    return withAuth(req, adminRoles, async ({ supabaseAdmin }) => jsonResponse(await listAdminAlerts(supabaseAdmin)), {
      module: 'ai_api_marketplace',
      action: 'admin_alerts',
      skipKYC: true,
      skipSubscription: true,
    });
  }

  if (req.method === 'GET' && path === '/client/catalog') {
    return withAuth(req, authenticatedRoles, async ({ supabaseAdmin, user }) => jsonResponse(await listClientCatalog(supabaseAdmin, user.userId)), {
      module: 'ai_api_marketplace',
      action: 'client_catalog',
      skipKYC: true,
      skipSubscription: true,
      skipIPLock: true,
    });
  }

  if (req.method === 'GET' && path === '/client/subscriptions') {
    return withAuth(req, authenticatedRoles, async ({ supabaseAdmin, user }) => jsonResponse(await listClientSubscriptions(supabaseAdmin, user.userId)), {
      module: 'ai_api_marketplace',
      action: 'client_subscriptions',
      skipKYC: true,
      skipSubscription: true,
      skipIPLock: true,
    });
  }

  if (req.method === 'POST' && path === '/client/buy') {
    return withAuth(req, authenticatedRoles, async ({ supabaseAdmin, user, body }) => {
      const payload = parseJson(body, buySchema);
      return await buyApiSubscription(supabaseAdmin, user, payload);
    }, { module: 'ai_api_marketplace', action: 'buy_api', rateLimitType: 'payment', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (req.method === 'POST' && path === '/client/add-money') {
    return withAuth(req, authenticatedRoles, async ({ supabaseAdmin, user, body }) => {
      const payload = parseJson(body, addMoneySchema);
      const wallet = await ensureWallet(supabaseAdmin, user.userId, user.role);
      const balance = await recordWalletTransaction(supabaseAdmin, wallet, user.userId, payload.amount, 'api_recharge', 'AI API wallet top-up');
      await logAudit(supabaseAdmin, user.userId, user.role, 'add_money', { amount: payload.amount, balance_after: balance });
      return jsonResponse({ balance_after: balance });
    }, { module: 'ai_api_marketplace', action: 'add_money', rateLimitType: 'payment', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  if (req.method === 'GET' && path === '/client/alerts') {
    return withAuth(req, authenticatedRoles, async ({ supabaseAdmin, user }) => jsonResponse(await listClientAlerts(supabaseAdmin, user.userId)), {
      module: 'ai_api_marketplace',
      action: 'client_alerts',
      skipKYC: true,
      skipSubscription: true,
      skipIPLock: true,
    });
  }

  const alertMatch = path.match(/^\/client\/alerts\/([0-9a-f-]+)$/i);
  if (req.method === 'GET' && alertMatch) {
    return withAuth(req, authenticatedRoles, async ({ supabaseAdmin, user }) => {
      const { data, error } = await supabaseAdmin
        .from('ai_api_alerts')
        .select('*, platform_api_services(name)')
        .eq('id', alertMatch[1])
        .eq('client_user_id', user.userId)
        .maybeSingle();

      if (error) {
        return errorResponse(error.message, 400);
      }

      if (!data) {
        return errorResponse('Alert not found', 404);
      }

      return jsonResponse({ item: { ...data, api_name: data.platform_api_services?.name || 'Unknown API' } });
    }, { module: 'ai_api_marketplace', action: 'alert_detail', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  const alertReadMatch = path.match(/^\/client\/alerts\/([0-9a-f-]+)\/read$/i);
  if (req.method === 'POST' && alertReadMatch) {
    return withAuth(req, authenticatedRoles, async ({ supabaseAdmin, user }) => {
      const { data, error } = await supabaseAdmin
        .from('ai_api_alerts')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', alertReadMatch[1])
        .eq('client_user_id', user.userId)
        .select('*')
        .maybeSingle();

      if (error) {
        return errorResponse(error.message, 400);
      }

      return jsonResponse({ item: data });
    }, { module: 'ai_api_marketplace', action: 'alert_read', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  const testMatch = path.match(/^\/client\/subscriptions\/([0-9a-f-]+)\/test$/i);
  if (req.method === 'POST' && testMatch) {
    return withAuth(req, authenticatedRoles, async ({ supabaseAdmin, user, body }) => {
      const payload = parseJson(body, usageSchema);
      const { data: key, error } = await supabaseAdmin
        .from('ai_api_client_keys')
        .select('api_key, subscription_id')
        .eq('subscription_id', testMatch[1])
        .eq('client_user_id', user.userId)
        .maybeSingle();

      if (error) {
        return errorResponse(error.message, 400);
      }

      if (!key) {
        return errorResponse('Subscription key not found', 404);
      }

      return await processUsage(supabaseAdmin, key.api_key, { ...payload, source: payload.source || 'client-test' });
    }, { module: 'ai_api_marketplace', action: 'test_subscription', rateLimitType: 'api_default', skipKYC: true, skipSubscription: true, skipIPLock: true });
  }

  return errorResponse('Not found', 404);
});