import { getPagination, isManagerRole, resolveResellerId, ServiceUser, toNumber } from './common.ts';

export async function getWallet(supabaseAdmin: any, user: ServiceUser, url: URL) {
  let resellerId = url.searchParams.get('reseller_id');
  if (!isManagerRole(user.role)) {
    resellerId = await resolveResellerId(supabaseAdmin, user.userId);
  }

  if (!resellerId) {
    throw new Error('Reseller wallet not found');
  }

  const { data: wallet, error: walletError } = await supabaseAdmin
    .from('reseller_wallets')
    .select('*')
    .eq('reseller_id', resellerId)
    .maybeSingle();

  if (walletError) {
    throw new Error(walletError.message);
  }

  const { page, limit, offset } = getPagination(url, 12, 100);
  const { data: ledger, error: ledgerError, count } = await supabaseAdmin
    .from('reseller_wallet_ledger')
    .select('*', { count: 'exact' })
    .eq('reseller_id', resellerId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (ledgerError) {
    throw new Error(ledgerError.message);
  }

  const { data: payouts, error: payoutsError } = await supabaseAdmin
    .from('reseller_payouts')
    .select('id, payout_number, amount, net_amount, payout_method, payout_status, requested_at, processed_at')
    .eq('reseller_id', resellerId)
    .is('deleted_at', null)
    .order('requested_at', { ascending: false })
    .limit(10);

  if (payoutsError) {
    throw new Error(payoutsError.message);
  }

  return {
    wallet: wallet ? {
      id: wallet.id,
      reseller_id: wallet.reseller_id,
      available_balance: toNumber(wallet.available_balance),
      pending_balance: toNumber(wallet.pending_balance),
      total_credited: toNumber(wallet.total_credited),
      total_debited: toNumber(wallet.total_debited),
      total_commission: toNumber(wallet.total_commission),
      total_payout: toNumber(wallet.total_payout),
    } : null,
    ledger: ledger || [],
    payouts: payouts || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages: Math.max(Math.ceil((count || 0) / limit), 1),
    },
  };
}

export async function updateWallet(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.rpc('update_reseller_wallet', {
    p_actor_user_id: user.userId,
    p_reseller_id: body.reseller_id,
    p_entry_type: body.entry_type,
    p_amount: body.amount,
    p_reason: body.reason,
    p_reference_type: body.reference_type || 'manual_adjustment',
    p_reference_id: body.reference_id || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function requestPayout(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.rpc('request_reseller_payout', {
    p_actor_user_id: user.userId,
    p_amount: body.amount,
    p_payout_method: body.payout_method,
    p_bank_details: body.bank_details || {},
    p_note: body.note || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function processPayout(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.rpc('process_reseller_payout', {
    p_actor_user_id: user.userId,
    p_payout_id: body.payout_id,
    p_action: body.action,
    p_note: body.note || null,
    p_transaction_reference: body.transaction_reference || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listPayouts(supabaseAdmin: any, user: ServiceUser, url: URL) {
  const { page, limit, offset } = getPagination(url, 10, 100);
  let resellerId = url.searchParams.get('reseller_id');

  if (!isManagerRole(user.role)) {
    resellerId = await resolveResellerId(supabaseAdmin, user.userId);
  }

  let query = supabaseAdmin
    .from('reseller_payouts')
    .select(`
      id,
      payout_number,
      amount,
      net_amount,
      payout_method,
      payout_status,
      requested_at,
      processed_at,
      transaction_reference,
      resellers(reseller_code),
      reseller_profiles!inner(business_name)
    `, { count: 'exact' })
    .is('deleted_at', null)
    .order('requested_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (resellerId) {
    query = query.eq('reseller_id', resellerId);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data || []).map((row: any) => ({
      id: row.id,
      payout_number: row.payout_number,
      amount: toNumber(row.amount),
      net_amount: toNumber(row.net_amount),
      payout_method: row.payout_method,
      payout_status: row.payout_status,
      requested_at: row.requested_at,
      processed_at: row.processed_at,
      transaction_reference: row.transaction_reference,
      reseller_code: row.resellers?.reseller_code || null,
      business_name: row.reseller_profiles?.business_name || null,
    })),
    page,
    limit,
    total: count || 0,
    total_pages: Math.max(Math.ceil((count || 0) / limit), 1),
  };
}