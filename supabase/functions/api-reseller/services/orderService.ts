import { getPagination, isManagerRole, resolveResellerId, ServiceUser, toNumber } from './common.ts';

export async function listOrders(supabaseAdmin: any, user: ServiceUser, url: URL) {
  const search = (url.searchParams.get('search') || '').trim();
  const status = url.searchParams.get('status');
  const { page, limit, offset } = getPagination(url, 10, 100);
  let resellerId = url.searchParams.get('reseller_id');

  if (!isManagerRole(user.role)) {
    resellerId = await resolveResellerId(supabaseAdmin, user.userId);
  }

  let query = supabaseAdmin
    .from('reseller_orders')
    .select(`
      id,
      order_number,
      gross_amount,
      net_amount,
      commission_amount,
      payment_method,
      payment_status,
      order_status,
      requirements,
      created_at,
      reseller_clients(full_name, email, company_name),
      products(product_name, category),
      resellers(reseller_code),
      reseller_commissions(status)
    `, { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (resellerId) {
    query = query.eq('reseller_id', resellerId);
  }

  if (status) {
    query = query.eq('order_status', status);
  }

  if (search) {
    query = query.or(`order_number.ilike.%${search}%,requirements.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data || []).map((row: any) => ({
      id: row.id,
      order_number: row.order_number,
      reseller_code: row.resellers?.reseller_code || null,
      client_name: row.reseller_clients?.full_name || 'Unknown client',
      client_email: row.reseller_clients?.email || '',
      company_name: row.reseller_clients?.company_name || '',
      product_name: row.products?.product_name || 'Unknown product',
      category: row.products?.category || '',
      gross_amount: toNumber(row.gross_amount),
      net_amount: toNumber(row.net_amount),
      commission_amount: toNumber(row.commission_amount),
      payment_method: row.payment_method,
      payment_status: row.payment_status,
      order_status: row.order_status,
      commission_status: row.reseller_commissions?.status || 'pending',
      requirements: row.requirements,
      created_at: row.created_at,
    })),
    page,
    limit,
    total: count || 0,
    total_pages: Math.max(Math.ceil((count || 0) / limit), 1),
  };
}

export async function createOrder(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  let resellerId = body.reseller_id as string | undefined;
  if (!resellerId) {
    resellerId = await resolveResellerId(supabaseAdmin, user.userId) || undefined;
  }

  if (!resellerId) {
    throw new Error('Reseller context is missing');
  }

  const { data, error } = await supabaseAdmin.rpc('create_reseller_order', {
    p_actor_user_id: user.userId,
    p_actor_role: user.role,
    p_reseller_id: resellerId,
    p_product_id: body.product_id,
    p_client_id: body.client_id || null,
    p_payment_method: body.payment_method,
    p_payment_status: body.payment_status || 'paid',
    p_sale_amount: body.sale_amount || null,
    p_client_name: body.client_name || null,
    p_client_email: body.client_email || null,
    p_client_phone: body.client_phone || null,
    p_company_name: body.company_name || null,
    p_requirements: body.requirements || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}