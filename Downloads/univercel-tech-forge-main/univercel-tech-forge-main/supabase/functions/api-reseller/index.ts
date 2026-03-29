import { z } from 'https://esm.sh/zod@3.25.76';
import { errorResponse, jsonResponse } from '../_shared/utils.ts';
import { withAuth } from '../_shared/middleware.ts';
import { getDashboardData, listResellers, createReseller, updateResellerStatus, assignProduct, listProducts, listClients, updateProfile } from './services/resellerService.ts';
import { listOrders, createOrder } from './services/orderService.ts';
import { applyCommission } from './services/commissionService.ts';
import { getWallet, listPayouts, processPayout, requestPayout, updateWallet } from './services/walletService.ts';
import { listNotifications, markNotificationRead } from './services/notificationService.ts';

const createResellerSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  business_name: z.string().min(2),
  owner_name: z.string().min(2).optional().nullable(),
  email: z.string().email(),
  phone: z.string().min(7),
  city: z.string().min(2).optional().nullable(),
  state: z.string().min(2).optional().nullable(),
  country: z.string().min(2).optional().nullable(),
  franchise_id: z.string().uuid().optional().nullable(),
  commission_rate: z.coerce.number().min(0).max(100).optional(),
  tenant_id: z.string().uuid().optional().nullable(),
});

const resellerStatusSchema = z.object({
  reseller_id: z.string().uuid(),
  status: z.enum(['pending', 'active', 'suspended', 'inactive', 'rejected']),
  reason: z.string().max(500).optional().nullable(),
});

const assignProductSchema = z.object({
  reseller_id: z.string().uuid(),
  product_id: z.string().uuid(),
  commission_override: z.coerce.number().min(0).max(100).optional().nullable(),
  pricing_override: z.coerce.number().min(0).optional().nullable(),
});

const createOrderSchema = z.object({
  reseller_id: z.string().uuid().optional().nullable(),
  product_id: z.string().uuid(),
  client_id: z.string().uuid().optional().nullable(),
  payment_method: z.string().min(2),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  sale_amount: z.coerce.number().positive().optional().nullable(),
  client_name: z.string().min(2).optional().nullable(),
  client_email: z.string().email().optional().nullable().or(z.literal('')),
  client_phone: z.string().min(7).optional().nullable().or(z.literal('')),
  company_name: z.string().min(2).optional().nullable().or(z.literal('')),
  requirements: z.string().max(1000).optional().nullable(),
});

const applyCommissionSchema = z.object({
  order_id: z.string().uuid(),
});

const walletUpdateSchema = z.object({
  reseller_id: z.string().uuid(),
  entry_type: z.enum(['credit', 'debit', 'adjustment']),
  amount: z.coerce.number().positive(),
  reason: z.string().min(3),
  reference_type: z.string().optional().nullable(),
  reference_id: z.string().uuid().optional().nullable(),
});

const payoutRequestSchema = z.object({
  amount: z.coerce.number().positive(),
  payout_method: z.string().min(2),
  bank_details: z.record(z.any()).optional(),
  note: z.string().max(500).optional().nullable(),
});

const payoutProcessSchema = z.object({
  payout_id: z.string().uuid(),
  action: z.enum(['approved', 'completed', 'rejected']),
  note: z.string().max(500).optional().nullable(),
  transaction_reference: z.string().max(255).optional().nullable(),
});

const profileUpdateSchema = z.object({
  business_name: z.string().min(2),
  owner_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  company_name: z.string().min(2).optional().nullable().or(z.literal('')),
  city: z.string().min(2).optional().nullable().or(z.literal('')),
  state: z.string().min(2).optional().nullable().or(z.literal('')),
  country: z.string().min(2).optional().nullable().or(z.literal('')),
  address_line_1: z.string().max(255).optional().nullable().or(z.literal('')),
  postal_code: z.string().max(20).optional().nullable().or(z.literal('')),
});

const notificationReadSchema = z.object({
  notification_id: z.string().uuid(),
  reseller_id: z.string().uuid().optional().nullable(),
});

const resellerApplicationReviewSchema = z.object({
  application_id: z.string().uuid(),
  status: z.enum(['approved', 'rejected', 'info_requested']),
  reviewer_notes: z.string().max(1000).optional().nullable(),
  rejection_reason: z.string().max(1000).optional().nullable(),
});

const roleAssignSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  role: z.enum(['reseller', 'reseller_manager']),
  reseller_id: z.string().uuid().optional().nullable(),
});

const territoryAssignSchema = z.object({
  reseller_id: z.string().uuid().optional().nullable(),
  country: z.string().min(2),
  state: z.string().min(2).optional().nullable(),
  city: z.string().min(2).optional().nullable(),
  territory_type: z.enum(['country', 'state', 'city', 'region']).optional(),
});

const leadAssignSchema = z.object({
  lead_id: z.string().uuid().optional().nullable(),
  lead_name: z.string().min(2),
  country: z.string().min(2),
  state: z.string().min(2).optional().nullable(),
  city: z.string().min(2).optional().nullable(),
  industry: z.string().min(2).optional().nullable(),
  business_type: z.string().min(2).optional().nullable(),
  phone: z.string().min(7).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  requirements: z.string().max(1000).optional().nullable(),
});

const resellerRevenueSchema = z.object({
  reseller_id: z.string().uuid().optional().nullable(),
  product_id: z.string().uuid(),
  marketplace_order_id: z.string().uuid().optional().nullable(),
  sale_amount: z.coerce.number().positive(),
  payment_method: z.string().min(2).default('wallet'),
  client_name: z.string().min(2).optional().nullable(),
  client_email: z.string().email().optional().nullable().or(z.literal('')),
  client_phone: z.string().min(7).optional().nullable().or(z.literal('')),
  company_name: z.string().min(2).optional().nullable().or(z.literal('')),
  requirements: z.string().max(1000).optional().nullable(),
});

const resellerContractSchema = z.object({
  reseller_id: z.string().uuid().optional().nullable(),
  agreement_type: z.enum(['reseller_master', 'commission', 'nda', 'territory']).default('reseller_master'),
  version: z.string().min(1).default('1.0'),
  status: z.enum(['pending', 'signed', 'expired', 'revoked']).default('signed'),
  commission_rate: z.coerce.number().min(0).max(100).optional().nullable(),
  territory_terms: z.record(z.any()).optional().nullable(),
});

const resellerApprovalSchema = z.object({
  reseller_id: z.string().uuid().optional().nullable(),
  request_type: z.enum(['territory', 'contract', 'pricing', 'discount', 'payout']),
  request_title: z.string().min(3),
  request_description: z.string().max(1000).optional().nullable(),
  status: z.enum(['pending', 'approved', 'rejected', 'executed']).default('pending'),
  payload: z.record(z.any()).optional().nullable(),
});

function validate<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || 'Validation failed');
  }
  return result.data;
}

const MANAGER_ROLES = ['reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager', 'franchise'];

function toNumberSafe(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function maskEmail(value: string | null | undefined) {
  const email = String(value || '');
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;
  const safeLocal = localPart.length <= 2 ? `${localPart[0] || '*'}*` : `${localPart.slice(0, 2)}***`;
  return `${safeLocal}@${domain}`;
}

function maskPhone(value: string | null | undefined) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length < 4) return '***';
  return `${digits.slice(0, 2)}******${digits.slice(-2)}`;
}

function territoryKey(input: { country?: string | null; state?: string | null; city?: string | null; territoryType?: string | null }) {
  const city = String(input.city || '').trim().toLowerCase();
  const state = String(input.state || '').trim().toLowerCase();
  const country = String(input.country || 'india').trim().toLowerCase();
  const type = input.territoryType || (city ? 'city' : state ? 'state' : 'country');
  const name = city || state || country;
  return `${type}:${country}:${state || '-'}:${city || '-'}:${name}`;
}

async function logResellerActivity(supabaseAdmin: any, resellerId: string | null, actorUserId: string, action: string, entityType: string, entityId: string | null, metaJson: Record<string, unknown> = {}) {
  if (resellerId) {
    const { data: reseller } = await supabaseAdmin.from('resellers').select('tenant_id').eq('id', resellerId).maybeSingle();
    await supabaseAdmin.from('reseller_activity_logs').insert({
      tenant_id: reseller?.tenant_id || null,
      reseller_id: resellerId,
      actor_user_id: actorUserId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      meta_json: metaJson,
    });
  }

  await supabaseAdmin.from('audit_logs').insert({
    user_id: actorUserId,
    action,
    module: 'reseller_system',
    role: 'reseller_manager',
    meta_json: {
      reseller_id: resellerId,
      entity_type: entityType,
      entity_id: entityId,
      ...metaJson,
    },
  });
}

async function emitResellerSyncEvent(supabaseAdmin: any, resellerId: string, eventType: string, payload: Record<string, unknown>, linkId: string | null = null) {
  await supabaseAdmin.from('reseller_sync_events').insert({
    reseller_id: resellerId,
    link_id: linkId,
    event_type: eventType,
    source_module: payload.source_module || 'reseller',
    target_module: payload.target_module || 'reseller',
    sync_status: 'completed',
    payload,
  });
}

async function resolveScopedResellerId(supabaseAdmin: any, user: { userId: string; role: string }, explicitResellerId?: string | null) {
  if (explicitResellerId) {
    return explicitResellerId;
  }

  if (user.role === 'reseller') {
    const { data } = await supabaseAdmin.from('resellers').select('id').eq('user_id', user.userId).is('deleted_at', null).maybeSingle();
    return data?.id || null;
  }

  return null;
}

async function ensureResellerContract(supabaseAdmin: any, resellerId: string, actorUserId: string, territoryMeta: Record<string, unknown> = {}) {
  const { data: agreement } = await supabaseAdmin
    .from('agreements')
    .select('*')
    .eq('reseller_id', resellerId)
    .eq('agreement_type', 'reseller_master')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (agreement) {
    if (agreement.status !== 'signed') {
      await supabaseAdmin.from('agreements').update({
        status: 'signed',
        signed_at: new Date().toISOString(),
        metadata: {
          ...(agreement.metadata || {}),
          auto_generated: true,
          territory: territoryMeta,
        },
      }).eq('id', agreement.id);
    }

    return agreement.id;
  }

  const { data: created } = await supabaseAdmin.from('agreements').insert({
    reseller_id: resellerId,
    agreement_type: 'reseller_master',
    version: '1.0',
    status: 'signed',
    signed_at: new Date().toISOString(),
    terms_json: {
      auto_generated: true,
      territory: territoryMeta,
    },
    metadata: {
      auto_generated: true,
      signed_by: actorUserId,
    },
  }).select('id').single();

  return created?.id || null;
}

async function assignTerritoryInternal(supabaseAdmin: any, actorUserId: string, resellerId: string, payload: { country: string; state?: string | null; city?: string | null; territoryType?: string | null }) {
  const key = territoryKey(payload);
  const territoryType = payload.territoryType || (payload.city ? 'city' : payload.state ? 'state' : 'country');
  const territoryName = payload.city || payload.state || payload.country;

  const { data: conflict } = await supabaseAdmin
    .from('territory_mapping')
    .select('id,reseller_id,territory_name')
    .eq('territory_key', key)
    .eq('assignment_status', 'assigned')
    .is('deleted_at', null)
    .neq('reseller_id', resellerId)
    .maybeSingle();

  if (conflict) {
    await supabaseAdmin.from('territory_mapping').insert({
      reseller_id: resellerId,
      territory_type: territoryType,
      territory_name: territoryName,
      territory_key: key,
      territory_code: territoryName,
      region_country: payload.country,
      region_state: payload.state || null,
      region_city: payload.city || null,
      is_primary: true,
      assignment_status: 'pending',
      metadata: {
        blocked_by_reseller_id: conflict.reseller_id,
        auto_blocked: true,
      },
    });

    await emitResellerSyncEvent(supabaseAdmin, resellerId, 'territory_conflict', {
      source_module: 'territory_engine',
      target_module: 'reseller_manager',
      territory_key: key,
      blocked_by_reseller_id: conflict.reseller_id,
    });

    return { assigned: false, status: 'pending', reason: 'region_conflict', territory_key: key };
  }

  await supabaseAdmin
    .from('territory_mapping')
    .update({ assignment_status: 'released', effective_to: new Date().toISOString(), is_primary: false, updated_at: new Date().toISOString() })
    .eq('reseller_id', resellerId)
    .eq('is_primary', true)
    .is('deleted_at', null);

  const { data: assigned, error } = await supabaseAdmin.from('territory_mapping').insert({
    reseller_id: resellerId,
    territory_type: territoryType,
    territory_name: territoryName,
    territory_key: key,
    territory_code: territoryName,
    region_country: payload.country,
    region_state: payload.state || null,
    region_city: payload.city || null,
    is_primary: true,
    assignment_status: 'assigned',
    metadata: {
      assigned_by: actorUserId,
      no_overlap: true,
    },
  }).select('*').single();

  if (error) throw new Error(error.message);

  await emitResellerSyncEvent(supabaseAdmin, resellerId, 'territory_assigned', {
    source_module: 'territory_engine',
    target_module: 'reseller_dashboard',
    territory_key: key,
    country: payload.country,
    state: payload.state || null,
    city: payload.city || null,
  });
  await logResellerActivity(supabaseAdmin, resellerId, actorUserId, 'territory_assigned', 'territory', assigned.id, { territory_key: key });

  return { assigned: true, status: 'assigned', territory: assigned, territory_key: key };
}

async function autoSuspendInactiveResellers(supabaseAdmin: any, actorUserId: string) {
  const threshold = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
  const { data: staleResellers } = await supabaseAdmin
    .from('resellers')
    .select('id,status,last_activity_at')
    .in('status', ['active', 'pending'])
    .lt('last_activity_at', threshold)
    .is('deleted_at', null)
    .limit(50);

  for (const reseller of staleResellers || []) {
    await supabaseAdmin.from('resellers').update({
      status: 'suspended',
      suspended_at: new Date().toISOString(),
      auto_suspend_reason: 'No reseller activity detected for 45 days',
      updated_at: new Date().toISOString(),
    }).eq('id', reseller.id);
    await logResellerActivity(supabaseAdmin, reseller.id, actorUserId, 'reseller_auto_suspended', 'reseller', reseller.id, { reason: 'no_activity' });
  }
}

async function handle(
  req: Request,
  allowedRoles: string[],
  action: string,
  callback: Parameters<typeof withAuth>[2],
  options: Parameters<typeof withAuth>[3] = {},
) {
  try {
    return await withAuth(req, allowedRoles, callback, {
      module: 'reseller_system',
      action,
      ...options,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unexpected reseller error', 500);
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname
    .replace(/^.*\/functions\/v1\/api-reseller/, '')
    .replace(/^.*\/api-reseller/, '') || '/';
  const method = req.method;

  if (method === 'GET' && (path === '' || path === '/resellers')) {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager', 'franchise'], 'list_resellers', async ({ supabaseAdmin, user }) => {
      const data = await listResellers(supabaseAdmin, user, url);
      return jsonResponse(data);
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/reseller/overview') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'overview', async ({ supabaseAdmin, user }) => {
      await autoSuspendInactiveResellers(supabaseAdmin, user.userId);
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));

      const [resellersResult, ordersResult, contractsResult, syncResult] = await Promise.all([
        user.role === 'reseller'
          ? supabaseAdmin.from('resellers').select('id,status,last_activity_at').eq('id', resellerId).is('deleted_at', null)
          : supabaseAdmin.from('resellers').select('id,status,last_activity_at').is('deleted_at', null),
        user.role === 'reseller'
          ? supabaseAdmin.from('reseller_orders').select('id,net_amount,created_at,payment_status,product_id').eq('reseller_id', resellerId).is('deleted_at', null)
          : supabaseAdmin.from('reseller_orders').select('id,net_amount,created_at,payment_status,product_id').is('deleted_at', null),
        user.role === 'reseller'
          ? supabaseAdmin.from('agreements').select('id,status').eq('reseller_id', resellerId).is('deleted_at', null)
          : supabaseAdmin.from('agreements').select('id,status,reseller_id').is('deleted_at', null),
        user.role === 'reseller'
          ? supabaseAdmin.from('reseller_sync_events').select('*').eq('reseller_id', resellerId).order('created_at', { ascending: false }).limit(10)
          : supabaseAdmin.from('reseller_sync_events').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      const resellers = resellersResult.data || [];
      const orders = ordersResult.data || [];
      const totalRevenue = orders.reduce((sum: number, item: any) => sum + toNumberSafe(item.net_amount), 0);
      const suspendedCount = resellers.filter((item: any) => item.status === 'suspended').length;

      return jsonResponse({
        cards: {
          total_resellers: resellers.length,
          active: resellers.filter((item: any) => item.status === 'active').length,
          pending: resellers.filter((item: any) => item.status === 'pending').length,
          suspended: suspendedCount,
          total_revenue: totalRevenue,
        },
        alerts: suspendedCount > 0 ? [{ type: 'warning', message: `${suspendedCount} reseller accounts are suspended` }] : [],
        signed_contracts: (contractsResult.data || []).filter((item: any) => item.status === 'signed').length,
        live_sync: syncResult.data || [],
        zero_conflict: true,
      });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && (path === '/dashboard' || path === '/reseller/dashboard')) {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager', 'franchise'], 'dashboard', async ({ supabaseAdmin, user }) => {
      const data = await getDashboardData(supabaseAdmin, user);
      return jsonResponse(data);
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/reseller/manager') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'manager_view', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const [territories, approvals, contracts, syncEvents] = await Promise.all([
        resellerId
          ? supabaseAdmin.from('territory_mapping').select('*').eq('reseller_id', resellerId).is('deleted_at', null).order('created_at', { ascending: false })
          : supabaseAdmin.from('territory_mapping').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(50),
        resellerId
          ? supabaseAdmin.from('reseller_approval_requests').select('*').eq('reseller_id', resellerId).order('created_at', { ascending: false }).limit(20)
          : supabaseAdmin.from('reseller_approval_requests').select('*').order('created_at', { ascending: false }).limit(50),
        resellerId
          ? supabaseAdmin.from('agreements').select('*').eq('reseller_id', resellerId).is('deleted_at', null).order('created_at', { ascending: false })
          : supabaseAdmin.from('agreements').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(50),
        resellerId
          ? supabaseAdmin.from('reseller_sync_events').select('*').eq('reseller_id', resellerId).order('created_at', { ascending: false }).limit(20)
          : supabaseAdmin.from('reseller_sync_events').select('*').order('created_at', { ascending: false }).limit(50),
      ]);

      return jsonResponse({
        same_data_source: true,
        control_level: 'manager',
        territory: territories.data || [],
        approvals: approvals.data || [],
        contracts: contracts.data || [],
        sync_events: syncEvents.data || [],
      });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/reseller/territory') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'territory', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const [territoriesResult, ordersResult, profileResult] = await Promise.all([
        resellerId
          ? supabaseAdmin.from('territory_mapping').select('*').eq('reseller_id', resellerId).is('deleted_at', null).order('created_at', { ascending: false })
          : supabaseAdmin.from('territory_mapping').select('*').is('deleted_at', null).order('created_at', { ascending: false }),
        resellerId
          ? supabaseAdmin.from('reseller_orders').select('reseller_id,net_amount').eq('reseller_id', resellerId).is('deleted_at', null)
          : supabaseAdmin.from('reseller_orders').select('reseller_id,net_amount').is('deleted_at', null),
        resellerId
          ? supabaseAdmin.from('reseller_profiles').select('reseller_id,business_name,owner_name,country,state').eq('reseller_id', resellerId)
          : supabaseAdmin.from('reseller_profiles').select('reseller_id,business_name,owner_name,country,state'),
      ]);

      const revenueByReseller = new Map<string, number>();
      for (const order of ordersResult.data || []) {
        revenueByReseller.set(order.reseller_id, (revenueByReseller.get(order.reseller_id) || 0) + toNumberSafe(order.net_amount));
      }
      const profileByReseller = new Map((profileResult.data || []).map((item: any) => [item.reseller_id, item]));

      return jsonResponse({
        items: (territoriesResult.data || []).map((item: any) => {
          const profile = profileByReseller.get(item.reseller_id);
          return {
            id: item.id,
            reseller_id: item.reseller_id,
            reseller_name: profile?.business_name || 'Reseller',
            owner: profile?.owner_name || 'Owner',
            country: item.region_country || profile?.country || 'India',
            state: item.region_state || profile?.state || null,
            assigned_region: item.territory_name,
            territory_key: item.territory_key,
            revenue: revenueByReseller.get(item.reseller_id) || 0,
            status: item.assignment_status,
            actions: ['view', 'edit', 'activate', 'suspend', 'remove'],
          };
        }),
        rules: {
          one_region_one_reseller: true,
          no_overlap: true,
        },
      });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/reseller/list') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'reseller_list', async ({ supabaseAdmin, user }) => {
      await autoSuspendInactiveResellers(supabaseAdmin, user.userId);
      const list = await listResellers(supabaseAdmin, user, url);
      const ids = list.items.map((item: any) => item.id);
      const ordersResult = ids.length
        ? await supabaseAdmin.from('reseller_orders').select('reseller_id,net_amount,created_at').in('reseller_id', ids).is('deleted_at', null)
        : { data: [] };

      const revenueByReseller = new Map<string, number>();
      const lastActivityByReseller = new Map<string, string>();
      for (const order of ordersResult.data || []) {
        revenueByReseller.set(order.reseller_id, (revenueByReseller.get(order.reseller_id) || 0) + toNumberSafe(order.net_amount));
        const current = lastActivityByReseller.get(order.reseller_id);
        if (!current || current < order.created_at) lastActivityByReseller.set(order.reseller_id, order.created_at);
      }

      return jsonResponse({
        ...list,
        items: list.items.map((item: any) => ({
          ...item,
          region: [item.city, item.state].filter(Boolean).join(', '),
          performance: revenueByReseller.get(item.id) || 0,
          revenue: revenueByReseller.get(item.id) || 0,
          warnings: [
            ...(revenueByReseller.get(item.id) || 0) < 10000 ? ['low_performance'] : [],
            ...(item.status === 'suspended' ? ['no_activity_suspended'] : []),
          ],
        })),
      });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/orders') {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager', 'franchise'], 'list_orders', async ({ supabaseAdmin, user }) => {
      const data = await listOrders(supabaseAdmin, user, url);
      return jsonResponse(data);
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && (path === '/products' || path === '/reseller/products')) {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'franchise'], 'list_products', async ({ supabaseAdmin, user }) => {
      const data = await listProducts(supabaseAdmin, user, url);
      return jsonResponse(data);
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/products/pricing') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'pricing_controls', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const products = await listProducts(supabaseAdmin, { ...user, role: resellerId ? user.role : user.role }, url);
      const controlsResult = resellerId
        ? await supabaseAdmin.from('reseller_pricing_controls').select('*').eq('reseller_id', resellerId)
        : { data: [] };
      const controlsByProduct = new Map((controlsResult.data || []).map((item: any) => [item.product_id, item]));

      return jsonResponse({
        items: products.items.map((item: any) => {
          const basePrice = toNumberSafe(item.pricing_override || item.lifetime_price || item.monthly_price);
          const control = controlsByProduct.get(item.product_id);
          const priceFloor = toNumberSafe(control?.price_floor, Math.round(basePrice * 0.8));
          return {
            product_id: item.product_id,
            product_name: item.product_name,
            reseller_pricing: toNumberSafe(control?.custom_price, basePrice),
            margin_control: toNumberSafe(control?.margin_percent, 0),
            discount_limit: toNumberSafe(control?.discount_limit_percent, 20),
            min_price: priceFloor,
            below_floor_blocked: true,
          };
        }),
      });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/clients') {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'franchise'], 'list_clients', async ({ supabaseAdmin, user }) => {
      const data = await listClients(supabaseAdmin, user, url);
      return jsonResponse(data);
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && (path === '/wallet' || path === '/wallet/reseller')) {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager'], 'wallet', async ({ supabaseAdmin, user }) => {
      const data = await getWallet(supabaseAdmin, user, url);
      return jsonResponse(data);
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/payouts') {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager'], 'list_payouts', async ({ supabaseAdmin, user }) => {
      const data = await listPayouts(supabaseAdmin, user, url);
      return jsonResponse(data);
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && (path === '/notifications' || path === '/reseller/notifications')) {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager', 'franchise'], 'list_notifications', async ({ supabaseAdmin, user }) => {
      const data = await listNotifications(supabaseAdmin, user, url);
      return jsonResponse(data);
    }, { skipIPLock: true, skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/reseller/revenue') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'revenue', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const ordersResult = resellerId
        ? await supabaseAdmin.from('reseller_orders').select('reseller_id,product_id,net_amount,created_at').eq('reseller_id', resellerId).is('deleted_at', null)
        : await supabaseAdmin.from('reseller_orders').select('reseller_id,product_id,net_amount,created_at').is('deleted_at', null);
      const territoriesResult = resellerId
        ? await supabaseAdmin.from('territory_mapping').select('reseller_id,territory_name,region_country,region_state,region_city').eq('reseller_id', resellerId).eq('assignment_status', 'assigned').is('deleted_at', null)
        : await supabaseAdmin.from('territory_mapping').select('reseller_id,territory_name,region_country,region_state,region_city').eq('assignment_status', 'assigned').is('deleted_at', null);
      const productsResult = await supabaseAdmin.from('products').select('product_id,product_name');

      const productNames = new Map((productsResult.data || []).map((item: any) => [item.product_id, item.product_name]));
      const resellerWise = new Map<string, number>();
      const regionWise = new Map<string, number>();
      const productWise = new Map<string, number>();
      const territoryByReseller = new Map((territoriesResult.data || []).map((item: any) => [item.reseller_id, item]));

      for (const order of ordersResult.data || []) {
        resellerWise.set(order.reseller_id, (resellerWise.get(order.reseller_id) || 0) + toNumberSafe(order.net_amount));
        const territory = territoryByReseller.get(order.reseller_id);
        const regionKey = territory?.territory_name || territory?.region_city || territory?.region_state || territory?.region_country || 'Unassigned';
        regionWise.set(regionKey, (regionWise.get(regionKey) || 0) + toNumberSafe(order.net_amount));
        const productKey = productNames.get(order.product_id) || order.product_id;
        productWise.set(productKey, (productWise.get(productKey) || 0) + toNumberSafe(order.net_amount));
      }

      const orderedDates = (ordersResult.data || []).map((item: any) => item.created_at).sort();
      const latestDay = orderedDates[orderedDates.length - 1]?.slice(0, 10);
      const previousDay = orderedDates[orderedDates.length - 2]?.slice(0, 10);
      const latestRevenue = (ordersResult.data || []).filter((item: any) => item.created_at?.slice(0, 10) === latestDay).reduce((sum: number, item: any) => sum + toNumberSafe(item.net_amount), 0);
      const previousRevenue = (ordersResult.data || []).filter((item: any) => item.created_at?.slice(0, 10) === previousDay).reduce((sum: number, item: any) => sum + toNumberSafe(item.net_amount), 0);

      return jsonResponse({
        reseller_wise_revenue: Array.from(resellerWise.entries()).map(([reseller_id, revenue]) => ({ reseller_id, revenue })),
        region_wise_revenue: Array.from(regionWise.entries()).map(([region, revenue]) => ({ region, revenue })),
        product_wise_revenue: Array.from(productWise.entries()).map(([product, revenue]) => ({ product, revenue })),
        alerts: latestRevenue < previousRevenue ? [{ type: 'warning', message: 'Revenue drop detected' }] : [],
      });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/applications') {
    return handle(req, ['reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'franchise'], 'list_applications', async ({ supabaseAdmin }) => {
      const { data, error } = await supabaseAdmin
        .from('reseller_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return errorResponse(error.message, 500);
      }

      return jsonResponse({ items: data || [] });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/health') {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager'], 'health', async ({ supabaseAdmin }) => {
      const [{ count: resellerCount }, { count: orderCount }, { count: payoutCount }] = await Promise.all([
        supabaseAdmin.from('resellers').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabaseAdmin.from('reseller_orders').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabaseAdmin.from('reseller_payouts').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      ]);

      return jsonResponse({
        status: 'ok',
        resellers: resellerCount || 0,
        orders: orderCount || 0,
        payouts: payoutCount || 0,
      });
    }, { skipIPLock: true, skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && (path === '/reseller/create' || path === '/register')) {
    return handle(req, ['reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'franchise'], 'create_reseller', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(createResellerSchema, body);
      const data = await createReseller(supabaseAdmin, user, payload as Record<string, unknown>);
      if (!data?.success) {
        return errorResponse(data?.error || 'Unable to create reseller', 400);
      }
      return jsonResponse(data, 201);
    }, { rateLimitType: 'admin_action' });
  }

  if (method === 'POST' && path === '/role/assign') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'role_assign', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(roleAssignSchema, body);
      const targetUserId = payload.user_id || user.userId;

      if (targetUserId !== user.userId && !MANAGER_ROLES.includes(user.role)) {
        return errorResponse('Only managers can assign roles to another user', 403);
      }

      await supabaseAdmin.from('user_roles').upsert({
        user_id: targetUserId,
        role: payload.role,
        approval_status: 'approved',
        approved_by: user.userId,
        approved_at: new Date().toISOString(),
      }, { onConflict: 'user_id,role' as never });

      const resellerId = await resolveScopedResellerId(supabaseAdmin, { userId: targetUserId, role: 'reseller' }, payload.reseller_id || null);
      if (resellerId) {
        await emitResellerSyncEvent(supabaseAdmin, resellerId, 'approval_synced', {
          source_module: 'role_engine',
          target_module: 'route_guard',
          role: payload.role,
          user_id: targetUserId,
        });
      }

      return jsonResponse({ assigned: true, role: payload.role, user_id: targetUserId, reseller_id: resellerId });
    }, { rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/reseller/territory/assign') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'territory_assign', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(territoryAssignSchema, body);
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, payload.reseller_id || null);
      if (!resellerId) return errorResponse('Reseller not found', 404);

      const result = await assignTerritoryInternal(supabaseAdmin, user.userId, resellerId, {
        country: payload.country,
        state: payload.state || null,
        city: payload.city || null,
        territoryType: payload.territory_type || null,
      });

      await ensureResellerContract(supabaseAdmin, resellerId, user.userId, {
        country: payload.country,
        state: payload.state || null,
        city: payload.city || null,
      });

      return jsonResponse(result, result.assigned ? 200 : 202);
    }, { rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && (path === '/reseller/lead-assign' || path === '/lead/reseller-route')) {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'lead_assign', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(leadAssignSchema, body);
      const key = territoryKey({ country: payload.country, state: payload.state, city: payload.city, territoryType: payload.city ? 'city' : payload.state ? 'state' : 'country' });
      const { data: territory } = await supabaseAdmin
        .from('territory_mapping')
        .select('id,reseller_id,territory_key,territory_name')
        .eq('territory_key', key)
        .eq('assignment_status', 'assigned')
        .is('deleted_at', null)
        .maybeSingle();

      if (!territory) {
        const { data: pool } = await supabaseAdmin.from('reseller_admin_pool').insert({
          original_lead_id: payload.lead_id || null,
          lead_name: payload.lead_name,
          country: payload.country,
          state: payload.state || null,
          city: payload.city || null,
          reason: 'No reseller mapped to territory',
          payload: { industry: payload.industry || payload.business_type || null, requirements: payload.requirements || null },
        }).select('*').single();

        if (payload.lead_id) {
          await supabaseAdmin.from('leads').update({ assigned_to_reseller: null }).eq('id', payload.lead_id);
        }

        return jsonResponse({ routed: false, admin_pool: true, pool_entry: pool }, 202);
      }

      const { data: reseller } = await supabaseAdmin.from('resellers').select('id,user_id,franchise_id').eq('id', territory.reseller_id).maybeSingle();
      if (!reseller) return errorResponse('Matched reseller not found', 404);

      if (payload.lead_id) {
        await supabaseAdmin.from('leads').update({ assigned_to_reseller: reseller.id }).eq('id', payload.lead_id);
      }

      const { data: routedLead } = await supabaseAdmin.from('marketplace_reseller_leads').insert({
        reseller_id: reseller.id,
        reseller_lead_id: null,
        lead_name: payload.lead_name,
        country: payload.country,
        state: payload.state || null,
        city: payload.city || null,
        business_type: payload.business_type || payload.industry || 'general',
        territory_key: key,
        source: 'routing_engine',
        status: 'assigned',
        payload: {
          lead_id: payload.lead_id || null,
          industry: payload.industry || null,
          requirements: payload.requirements || null,
          phone_masked: maskPhone(payload.phone),
          email_masked: maskEmail(payload.email),
        },
      }).select('*').single();

      await supabaseAdmin.from('resellers').update({ last_activity_at: new Date().toISOString() }).eq('id', reseller.id);
      await emitResellerSyncEvent(supabaseAdmin, reseller.id, 'lead_routed', {
        source_module: 'lead_distribution_engine',
        target_module: 'reseller_dashboard',
        lead_name: payload.lead_name,
        territory_key: key,
      });
      await logResellerActivity(supabaseAdmin, reseller.id, user.userId, 'lead_assigned', 'lead', payload.lead_id || routedLead?.id || null, { territory_key: key });

      return jsonResponse({ routed: true, reseller_id: reseller.id, route: routedLead }, 201);
    }, { rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/reseller/status') {
    return handle(req, ['reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'franchise'], 'update_reseller_status', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(resellerStatusSchema, body);
      const data = await updateResellerStatus(supabaseAdmin, user, payload as Record<string, unknown>);
      if (!data?.success) {
        return errorResponse(data?.error || 'Unable to update reseller status', 400);
      }
      return jsonResponse(data);
    }, { rateLimitType: 'admin_action' });
  }

  if (method === 'POST' && path === '/reseller/product-assign') {
    return handle(req, ['reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'franchise'], 'assign_product', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(assignProductSchema, body);
      const data = await assignProduct(supabaseAdmin, user, payload as Record<string, unknown>);
      if (!data?.success) {
        return errorResponse(data?.error || 'Unable to assign product', 400);
      }
      return jsonResponse(data);
    }, { rateLimitType: 'admin_action' });
  }

  if (method === 'POST' && path === '/order/create') {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'franchise'], 'create_order', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(createOrderSchema, body);
      const data = await createOrder(supabaseAdmin, user, payload as Record<string, unknown>);
      if (!data?.success) {
        return errorResponse(data?.error || 'Unable to create order', 400);
      }
      return jsonResponse(data, 201);
    }, { rateLimitType: 'payment' });
  }

  if (method === 'POST' && (path === '/commission/apply' || path === '/commission' || path === '/commission/calc')) {
    return handle(req, ['reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager'], 'apply_commission', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(applyCommissionSchema, body);
      const data = await applyCommission(supabaseAdmin, user, payload as Record<string, unknown>);
      if (!data?.success) {
        return errorResponse(data?.error || 'Unable to apply commission', 400);
      }
      return jsonResponse(data);
    }, { rateLimitType: 'payment' });
  }

  if (method === 'POST' && path === '/revenue/reseller') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'revenue_create', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(resellerRevenueSchema, body);
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, payload.reseller_id || null);
      if (!resellerId) return errorResponse('Reseller not found', 404);

      const priceControl = await supabaseAdmin.from('reseller_pricing_controls').select('*').eq('reseller_id', resellerId).eq('product_id', payload.product_id).maybeSingle();
      const product = await supabaseAdmin.from('products').select('product_id,product_name,lifetime_price,monthly_price').eq('product_id', payload.product_id).single();
      const basePrice = toNumberSafe(priceControl.data?.custom_price, toNumberSafe(product.data?.lifetime_price || product.data?.monthly_price));
      const minPrice = toNumberSafe(priceControl.data?.price_floor, Math.round(basePrice * 0.8));

      if (payload.sale_amount < minPrice) {
        return errorResponse('Sale blocked. Reseller cannot sell below min price.', 400);
      }

      const commissionRate = await supabaseAdmin.from('resellers').select('default_commission_rate').eq('id', resellerId).single();
      const orderNumber = `RSO-${Date.now()}`;
      const commissionAmount = Number(((payload.sale_amount * toNumberSafe(commissionRate.data?.default_commission_rate, 15)) / 100).toFixed(2));

      const { data: order, error } = await supabaseAdmin.from('reseller_orders').insert({
        reseller_id: resellerId,
        product_id: payload.product_id,
        marketplace_order_id: payload.marketplace_order_id || null,
        order_number: orderNumber,
        source: payload.marketplace_order_id ? 'marketplace_auto_link' : 'reseller_portal',
        gross_amount: payload.sale_amount,
        discount_percent: 0,
        net_amount: payload.sale_amount,
        commission_amount: commissionAmount,
        payment_method: payload.payment_method,
        payment_status: 'paid',
        order_status: 'fulfilled',
        requirements: payload.requirements || null,
        fulfilled_at: new Date().toISOString(),
        metadata: {
          client_name: payload.client_name || null,
          client_email: payload.client_email || null,
          client_phone: payload.client_phone || null,
          company_name: payload.company_name || null,
        },
      }).select('*').single();

      if (error || !order) return errorResponse(error?.message || 'Unable to create reseller revenue order', 400);

      const commissionResult = await applyCommission(supabaseAdmin, user, { order_id: order.id });
      await supabaseAdmin.from('resellers').update({ last_activity_at: new Date().toISOString() }).eq('id', resellerId);
      await emitResellerSyncEvent(supabaseAdmin, resellerId, 'revenue_linked', {
        source_module: 'revenue_engine',
        target_module: 'wallet_engine',
        order_id: order.id,
        commission_amount: commissionAmount,
      });

      return jsonResponse({ success: true, order, commission: commissionResult }, 201);
    }, { rateLimitType: 'payment', skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/reseller/contract') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'contract_create', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(resellerContractSchema, body);
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, payload.reseller_id || null);
      if (!resellerId) return errorResponse('Reseller not found', 404);

      const { data: agreement, error } = await supabaseAdmin.from('agreements').insert({
        reseller_id: resellerId,
        agreement_type: payload.agreement_type,
        version: payload.version,
        status: payload.status,
        signed_at: payload.status === 'signed' ? new Date().toISOString() : null,
        terms_json: {
          commission_rate: payload.commission_rate || null,
          territory_terms: payload.territory_terms || {},
        },
        metadata: {
          auto_generated: true,
          created_by: user.userId,
        },
      }).select('*').single();

      if (error || !agreement) return errorResponse(error?.message || 'Unable to create contract', 400);
      await emitResellerSyncEvent(supabaseAdmin, resellerId, 'contract_ready', {
        source_module: 'contract_engine',
        target_module: 'reseller_manager',
        agreement_id: agreement.id,
        status: agreement.status,
      });

      return jsonResponse({ agreement }, 201);
    }, { rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/reseller/approval') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'approval_create', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(resellerApprovalSchema, body);
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, payload.reseller_id || null);
      if (!resellerId) return errorResponse('Reseller not found', 404);

      const { data: approval, error } = await supabaseAdmin.from('reseller_approval_requests').insert({
        reseller_id: resellerId,
        request_type: payload.request_type,
        request_title: payload.request_title,
        request_description: payload.request_description || null,
        status: payload.status,
        requested_by: user.userId,
        approved_by: ['approved', 'executed'].includes(payload.status) ? user.userId : null,
        approved_at: ['approved', 'executed'].includes(payload.status) ? new Date().toISOString() : null,
        execution_blocked: payload.status !== 'approved' && payload.status !== 'executed',
        payload: payload.payload || {},
      }).select('*').single();

      if (error || !approval) return errorResponse(error?.message || 'Unable to create approval request', 400);
      await emitResellerSyncEvent(supabaseAdmin, resellerId, 'approval_synced', {
        source_module: 'approval_engine',
        target_module: 'reseller_manager',
        approval_id: approval.id,
        status: approval.status,
      });

      return jsonResponse({ approval }, 201);
    }, { rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/contracts/reseller') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'contracts_list', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const query = resellerId
        ? supabaseAdmin.from('agreements').select('*').eq('reseller_id', resellerId).is('deleted_at', null).order('created_at', { ascending: false })
        : supabaseAdmin.from('agreements').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(50);
      const { data, error } = await query;
      if (error) return errorResponse(error.message, 500);
      return jsonResponse({ items: data || [] });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/reseller/support') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'support_cases', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const query = resellerId
        ? supabaseAdmin.from('reseller_support_cases').select('*').eq('reseller_id', resellerId).order('created_at', { ascending: false })
        : supabaseAdmin.from('reseller_support_cases').select('*').order('created_at', { ascending: false }).limit(50);
      const { data, error } = await query;
      if (error) return errorResponse(error.message, 500);
      return jsonResponse({
        items: data || [],
        escalations: (data || []).filter((item: any) => item.priority === 'critical' || item.status === 'escalated'),
      });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/reseller/audit') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'audit', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const query = resellerId
        ? supabaseAdmin.from('reseller_activity_logs').select('*').eq('reseller_id', resellerId).order('created_at', { ascending: false }).limit(100)
        : supabaseAdmin.from('reseller_activity_logs').select('*').order('created_at', { ascending: false }).limit(150);
      const { data, error } = await query;
      if (error) return errorResponse(error.message, 500);
      return jsonResponse({ items: data || [], immutable: true });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'GET' && path === '/reseller/reports') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'reports', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const [orders, territories, resellers] = await Promise.all([
        resellerId
          ? supabaseAdmin.from('reseller_orders').select('reseller_id,net_amount,created_at').eq('reseller_id', resellerId).is('deleted_at', null)
          : supabaseAdmin.from('reseller_orders').select('reseller_id,net_amount,created_at').is('deleted_at', null),
        resellerId
          ? supabaseAdmin.from('territory_mapping').select('reseller_id,territory_name,assignment_status').eq('reseller_id', resellerId).is('deleted_at', null)
          : supabaseAdmin.from('territory_mapping').select('reseller_id,territory_name,assignment_status').is('deleted_at', null),
        resellerId
          ? supabaseAdmin.from('resellers').select('id,status,last_activity_at').eq('id', resellerId).is('deleted_at', null)
          : supabaseAdmin.from('resellers').select('id,status,last_activity_at').is('deleted_at', null),
      ]);

      return jsonResponse({
        performance: (resellers.data || []).map((item: any) => ({ reseller_id: item.id, status: item.status, last_activity_at: item.last_activity_at })),
        revenue: (orders.data || []).reduce((sum: number, item: any) => sum + toNumberSafe(item.net_amount), 0),
        region_analysis: territories.data || [],
      });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/ai/reseller') {
    return handle(req, ['reseller', ...MANAGER_ROLES], 'ai_reseller', async ({ supabaseAdmin, user }) => {
      const resellerId = await resolveScopedResellerId(supabaseAdmin, user, url.searchParams.get('reseller_id'));
      const [orders, territories, notifications] = await Promise.all([
        resellerId
          ? supabaseAdmin.from('reseller_orders').select('net_amount,created_at').eq('reseller_id', resellerId).is('deleted_at', null)
          : supabaseAdmin.from('reseller_orders').select('reseller_id,net_amount,created_at').is('deleted_at', null).limit(100),
        resellerId
          ? supabaseAdmin.from('territory_mapping').select('territory_name,region_country,region_state,region_city').eq('reseller_id', resellerId).eq('assignment_status', 'assigned').is('deleted_at', null)
          : supabaseAdmin.from('territory_mapping').select('territory_name,region_country,region_state,region_city').eq('assignment_status', 'assigned').is('deleted_at', null).limit(100),
        resellerId
          ? supabaseAdmin.from('reseller_notifications').select('type,title').eq('reseller_id', resellerId).eq('is_read', false).is('deleted_at', null)
          : supabaseAdmin.from('reseller_notifications').select('type,title').eq('is_read', false).is('deleted_at', null).limit(20),
      ]);

      const suggestions = [
        {
          suggestion_type: 'best_reseller_selection',
          title: 'Best reseller selection',
          summary: 'Use territory assignment and recent revenue density to pick the strongest reseller for new leads.',
          payload: { active_territories: (territories.data || []).length },
        },
        {
          suggestion_type: 'region_expansion',
          title: 'Region expansion suggestion',
          summary: (territories.data || []).length < 2 ? 'Open a new adjacent region to increase coverage without overlap.' : 'Territory spread is healthy. Monitor conflict queue before expansion.',
          payload: { territories: territories.data || [] },
        },
        {
          suggestion_type: 'pricing_optimization',
          title: 'Pricing optimization',
          summary: 'Keep reseller pricing above the product floor and tighten discount limits where margin compression is rising.',
          payload: { unread_pricing_alerts: (notifications.data || []).filter((item: any) => item.type === 'warning').length },
        },
        {
          suggestion_type: 'performance_prediction',
          title: 'Performance prediction',
          summary: (orders.data || []).length < 5 ? 'Revenue is still thin. Expect volatile performance until more paid orders arrive.' : 'Order volume is stable enough for short-term forecasting.',
          payload: { orders: (orders.data || []).length },
        },
      ];

      return jsonResponse({ suggestions, suggestion_only: true });
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/wallet/update') {
    return handle(req, ['boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager'], 'update_wallet', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(walletUpdateSchema, body);
      const data = await updateWallet(supabaseAdmin, user, payload as Record<string, unknown>);
      if (!data?.success) {
        return errorResponse(data?.error || 'Unable to update wallet', 400);
      }
      return jsonResponse(data);
    }, { rateLimitType: 'payment' });
  }

  if (method === 'POST' && path === '/payout/request') {
    return handle(req, ['reseller'], 'request_payout', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(payoutRequestSchema, body);
      const data = await requestPayout(supabaseAdmin, user, payload as Record<string, unknown>);
      if (!data?.success) {
        return errorResponse(data?.error || 'Unable to request payout', 400);
      }
      return jsonResponse(data, 201);
    }, { rateLimitType: 'withdrawal' });
  }

  if (method === 'POST' && path === '/payout/process') {
    return handle(req, ['boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager'], 'process_payout', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(payoutProcessSchema, body);
      const data = await processPayout(supabaseAdmin, user, payload as Record<string, unknown>);
      if (!data?.success) {
        return errorResponse(data?.error || 'Unable to process payout', 400);
      }
      return jsonResponse(data);
    }, { rateLimitType: 'withdrawal' });
  }

  if (method === 'POST' && path === '/profile/update') {
    return handle(req, ['reseller'], 'update_profile', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(profileUpdateSchema, body);
      const data = await updateProfile(supabaseAdmin, user, payload as Record<string, unknown>);
      return jsonResponse(data);
    }, { skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/notification/read') {
    return handle(req, ['reseller', 'reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager', 'franchise'], 'mark_notification_read', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(notificationReadSchema, body);
      const data = await markNotificationRead(supabaseAdmin, user, payload as Record<string, unknown>);
      return jsonResponse(data);
    }, { skipIPLock: true, skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/application/review') {
    return handle(req, ['reseller_manager', 'boss_owner', 'super_admin', 'ceo', 'admin', 'franchise'], 'review_application', async ({ supabaseAdmin, user, body }) => {
      const payload = validate(resellerApplicationReviewSchema, body);

      const updatePayload = {
        status: payload.status,
        reviewer_id: user.userId,
        reviewer_notes: payload.status === 'approved'
          ? (payload.reviewer_notes || 'Application approved')
          : payload.status === 'info_requested'
            ? (payload.reviewer_notes || null)
            : null,
        rejection_reason: payload.status === 'rejected' ? (payload.rejection_reason || 'Rejected by reviewer') : null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('reseller_applications')
        .update(updatePayload)
        .eq('id', payload.application_id)
        .select('*')
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return jsonResponse({ application: data });
    }, { rateLimitType: 'admin_action', skipKYC: true, skipSubscription: true });
  }

  return errorResponse('Not found', 404);
});
