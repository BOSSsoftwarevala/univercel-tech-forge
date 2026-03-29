import { clearCacheByPrefix, getCache, getPagination, isManagerRole, resolveResellerId, ServiceUser, setCache, toNumber } from './common.ts';

export async function getDashboardData(supabaseAdmin: any, user: ServiceUser) {
  const resellerId = user.role === 'reseller' ? await resolveResellerId(supabaseAdmin, user.userId) : null;
  const cacheKey = `reseller-dashboard:${user.role}:${resellerId ?? user.userId}`;
  const cached = getCache<any>(cacheKey);
  if (cached) {
    return cached;
  }

  const [
    resellerSummary,
    payoutSummary,
    orderSummary,
    notificationSummary,
  ] = await Promise.all([
    user.role === 'reseller'
      ? supabaseAdmin
          .from('resellers')
          .select(`
            id,
            reseller_code,
            status,
            default_commission_rate,
            kyc_status,
            reseller_profiles(business_name, owner_name, email, phone, city, state),
            reseller_wallets(available_balance, pending_balance, total_commission, total_payout)
          `)
          .eq('user_id', user.userId)
          .is('deleted_at', null)
          .maybeSingle()
      : supabaseAdmin
          .from('resellers')
          .select('id, status', { count: 'exact' })
          .is('deleted_at', null),
    user.role === 'reseller'
      ? supabaseAdmin
          .from('reseller_payouts')
          .select('id, payout_status, amount', { count: 'exact' })
          .eq('reseller_id', resellerId)
          .is('deleted_at', null)
      : supabaseAdmin
          .from('reseller_payouts')
          .select('id, payout_status, amount', { count: 'exact' })
          .is('deleted_at', null),
    user.role === 'reseller'
      ? supabaseAdmin
          .from('reseller_orders')
          .select('id, net_amount, payment_status, order_status', { count: 'exact' })
          .eq('reseller_id', resellerId)
          .is('deleted_at', null)
      : supabaseAdmin
          .from('reseller_orders')
          .select('id, net_amount, payment_status, order_status', { count: 'exact' })
          .is('deleted_at', null),
    user.role === 'reseller'
      ? supabaseAdmin
          .from('reseller_notifications')
          .select('id', { count: 'exact' })
          .eq('reseller_id', resellerId)
          .eq('is_read', false)
          .is('deleted_at', null)
      : supabaseAdmin
          .from('reseller_notifications')
          .select('id', { count: 'exact' })
          .eq('is_read', false)
          .is('deleted_at', null),
  ]);

  const payoutRows = payoutSummary.data || [];
  const orderRows = orderSummary.data || [];

  const result = user.role === 'reseller'
    ? {
        scope: 'reseller',
        reseller: resellerSummary.data,
        metrics: {
          orders: orderSummary.count || 0,
          revenue: orderRows.reduce((sum: number, row: any) => sum + toNumber(row.net_amount), 0),
          pendingPayouts: payoutRows.filter((row: any) => ['requested', 'approved', 'processing'].includes(row.payout_status)).length,
          unreadNotifications: notificationSummary.count || 0,
        },
      }
    : {
        scope: 'manager',
        metrics: {
          totalResellers: resellerSummary.count || 0,
          activeResellers: (resellerSummary.data || []).filter((row: any) => row.status === 'active').length,
          pendingApprovals: (resellerSummary.data || []).filter((row: any) => row.status === 'pending').length,
          totalRevenue: orderRows.reduce((sum: number, row: any) => sum + toNumber(row.net_amount), 0),
          payoutRequests: payoutRows.filter((row: any) => row.payout_status === 'requested').length,
          unreadNotifications: notificationSummary.count || 0,
        },
      };

  setCache(cacheKey, result, 20_000);
  return result;
}

export async function listResellers(supabaseAdmin: any, user: ServiceUser, url: URL) {
  const search = (url.searchParams.get('search') || '').trim();
  const status = url.searchParams.get('status');
  const { page, limit, offset } = getPagination(url, 12, 100);

  let query = supabaseAdmin
    .from('resellers')
    .select(`
      id,
      reseller_code,
      status,
      default_commission_rate,
      kyc_status,
      onboarding_stage,
      created_at,
      updated_at,
      reseller_profiles(business_name, owner_name, email, phone, city, state),
      reseller_wallets(available_balance, pending_balance, total_commission, total_payout)
    `, { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (user.role === 'reseller') {
    query = query.eq('user_id', user.userId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.or(`reseller_code.ilike.%${search}%,reseller_profiles.business_name.ilike.%${search}%,reseller_profiles.owner_name.ilike.%${search}%,reseller_profiles.email.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data || []).map((row: any) => ({
      id: row.id,
      reseller_code: row.reseller_code,
      status: row.status,
      commission_rate: toNumber(row.default_commission_rate),
      kyc_status: row.kyc_status,
      onboarding_stage: row.onboarding_stage,
      business_name: row.reseller_profiles?.business_name || 'Unknown',
      owner_name: row.reseller_profiles?.owner_name || 'Unknown',
      email: row.reseller_profiles?.email || '',
      phone: row.reseller_profiles?.phone || '',
      city: row.reseller_profiles?.city || '',
      state: row.reseller_profiles?.state || '',
      wallet_available: toNumber(row.reseller_wallets?.available_balance),
      wallet_pending: toNumber(row.reseller_wallets?.pending_balance),
      total_commission: toNumber(row.reseller_wallets?.total_commission),
      total_payout: toNumber(row.reseller_wallets?.total_payout),
      created_at: row.created_at,
      updated_at: row.updated_at,
    })),
    page,
    limit,
    total: count || 0,
    total_pages: Math.max(Math.ceil((count || 0) / limit), 1),
  };
}

export async function createReseller(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.rpc('create_reseller_record', {
    p_actor_user_id: user.userId,
    p_reseller_user_id: body.user_id || null,
    p_business_name: body.business_name,
    p_owner_name: body.owner_name || null,
    p_email: body.email,
    p_phone: body.phone,
    p_city: body.city || null,
    p_state: body.state || null,
    p_country: body.country || 'India',
    p_franchise_id: body.franchise_id || null,
    p_commission_rate: body.commission_rate || 15,
    p_tenant_id: body.tenant_id || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  clearCacheByPrefix('reseller-dashboard:');
  return data;
}

export async function updateResellerStatus(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.rpc('set_reseller_status', {
    p_actor_user_id: user.userId,
    p_reseller_id: body.reseller_id,
    p_status: body.status,
    p_reason: body.reason || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  clearCacheByPrefix('reseller-dashboard:');
  return data;
}

export async function assignProduct(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.rpc('assign_reseller_product', {
    p_actor_user_id: user.userId,
    p_reseller_id: body.reseller_id,
    p_product_id: body.product_id,
    p_commission_override: body.commission_override || null,
    p_pricing_override: body.pricing_override || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  clearCacheByPrefix('reseller-products:');
  return data;
}

export async function listProducts(supabaseAdmin: any, user: ServiceUser, url: URL) {
  const search = (url.searchParams.get('search') || '').trim();
  const cacheKey = `reseller-products:${user.role}:${search}`;
  const cached = getCache<any>(cacheKey);
  if (cached) {
    return cached;
  }

  let resellerId = url.searchParams.get('reseller_id');
  if (user.role === 'reseller' || !resellerId) {
    resellerId = (await resolveResellerId(supabaseAdmin, user.userId)) || resellerId;
  }

  let query = supabaseAdmin
    .from('products')
    .select(`
      product_id,
      product_name,
      category,
      pricing_model,
      lifetime_price,
      monthly_price,
      description,
      reseller_products_map!left(reseller_id, assignment_status, commission_override, pricing_override)
    `)
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  if (search) {
    query = query.or(`product_name.ilike.%${search}%,category.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const items = (data || [])
    .map((row: any) => {
      const assignment = (row.reseller_products_map || []).find((entry: any) => !resellerId || entry.reseller_id === resellerId);
      return {
        product_id: row.product_id,
        product_name: row.product_name,
        category: row.category,
        pricing_model: row.pricing_model,
        lifetime_price: toNumber(row.lifetime_price),
        monthly_price: toNumber(row.monthly_price),
        description: row.description,
        is_assigned: Boolean(assignment && assignment.assignment_status === 'active'),
        assignment_status: assignment?.assignment_status || 'unassigned',
        commission_override: assignment?.commission_override,
        pricing_override: assignment?.pricing_override,
      };
    });

  setCache(cacheKey, { items }, 30_000);
  return { items };
}

export async function listClients(supabaseAdmin: any, user: ServiceUser, url: URL) {
  const search = (url.searchParams.get('search') || '').trim();
  const { page, limit, offset } = getPagination(url, 10, 100);
  let resellerId = url.searchParams.get('reseller_id');

  if (!isManagerRole(user.role)) {
    resellerId = await resolveResellerId(supabaseAdmin, user.userId);
  }

  let query = supabaseAdmin
    .from('reseller_clients')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (resellerId) {
    query = query.eq('reseller_id', resellerId);
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return {
    items: data || [],
    page,
    limit,
    total: count || 0,
    total_pages: Math.max(Math.ceil((count || 0) / limit), 1),
  };
}

export async function updateProfile(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  const resellerId = await resolveResellerId(supabaseAdmin, user.userId);
  if (!resellerId) {
    throw new Error('Reseller profile not found');
  }

  const { error } = await supabaseAdmin
    .from('reseller_profiles')
    .update({
      business_name: body.business_name,
      owner_name: body.owner_name,
      email: body.email,
      phone: body.phone,
      company_name: body.company_name,
      city: body.city,
      state: body.state,
      country: body.country,
      address_line_1: body.address_line_1,
      postal_code: body.postal_code,
      updated_at: new Date().toISOString(),
    })
    .eq('reseller_id', resellerId);

  if (error) {
    throw new Error(error.message);
  }

  clearCacheByPrefix('reseller-dashboard:');
  return { success: true };
}