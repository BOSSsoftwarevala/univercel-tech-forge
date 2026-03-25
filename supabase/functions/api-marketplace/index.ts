import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { errorResponse, jsonResponse, validateRequired } from '../_shared/utils.ts';
import { withAuth } from '../_shared/middleware.ts';

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function generateFranchiseCode(seed?: string | null) {
  const normalized = String(seed || 'FRA').replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() || 'FRA';
  return `${normalized}-${Date.now().toString(36).toUpperCase()}`;
}

function generateResellerCode() {
  return `RS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function generateInfluencerCode(seed?: string | null) {
  const normalized = String(seed || 'INF').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'INF';
  return `${normalized}-${Date.now().toString(36).toUpperCase()}`;
}

function inferOwnerName(email: string, fallback?: string | null) {
  if (fallback && String(fallback).trim()) return String(fallback).trim();
  const localPart = email.split('@')[0] || 'Franchise Owner';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Franchise Owner';
}

function normalizeSelectedPlan(plan: unknown) {
  const normalized = String(plan || 'starter').trim().toLowerCase();
  if (['starter', 'growth', 'enterprise', 'elite', 'premium'].includes(normalized)) {
    return normalized;
  }
  return 'starter';
}

function maskEmail(value: string) {
  const [localPart, domain] = value.split('@');
  if (!localPart || !domain) return value;
  const safeLocal = localPart.length <= 2 ? `${localPart[0] || '*'}*` : `${localPart.slice(0, 2)}***`;
  return `${safeLocal}@${domain}`;
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 4) return '***';
  return `${digits.slice(0, 2)}******${digits.slice(-2)}`;
}

function chooseBestStore(stores: any[], lead: Record<string, unknown>) {
  const city = String(lead.city || '').toLowerCase();
  const country = String(lead.country || 'India').toLowerCase();
  return stores
    .filter((store) => store.status !== 'frozen' && store.status !== 'dead')
    .map((store) => {
      const cityMatch = String(store.city || '').toLowerCase() === city ? 30 : 0;
      const countryMatch = String(store.country || '').toLowerCase() === country ? 15 : 0;
      const capacityRoom = Math.max(0, toNumber(store.capacity) - toNumber(store.current_load));
      return {
        store,
        score: cityMatch + countryMatch + capacityRoom / 5 + toNumber(store.performance_score) - Math.min(toNumber(store.live_leads), 50),
      };
    })
    .sort((left, right) => right.score - left.score)[0]?.store || null;
}

function territoryKey(input: { country?: string | null; state?: string | null; city?: string | null; territoryType?: string | null }) {
  const city = String(input.city || '').trim().toLowerCase();
  const state = String(input.state || '').trim().toLowerCase();
  const country = String(input.country || 'india').trim().toLowerCase();
  const type = input.territoryType || (city ? 'city' : state ? 'state' : 'country');
  const name = city || state || country;
  return `${type}:${country}:${state || '-'}:${city || '-'}:${name}`;
}

async function ensureWalletAccount(supabaseAdmin: any, userId: string) {
  const { data: wallet } = await supabaseAdmin
    .from('wallets')
    .select('wallet_id,user_id,balance,currency')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (wallet) return wallet;

  const { data: createdWallet } = await supabaseAdmin
    .from('wallets')
    .insert({ user_id: userId, balance: 0, currency: 'INR' })
    .select('wallet_id,user_id,balance,currency')
    .single();

  return createdWallet;
}

async function ensureResellerWallet(supabaseAdmin: any, resellerId: string) {
  const { data: wallet } = await supabaseAdmin.from('reseller_wallets').select('*').eq('reseller_id', resellerId).maybeSingle();
  if (wallet) return wallet;
  const { data: createdWallet } = await supabaseAdmin.from('reseller_wallets').insert({ reseller_id: resellerId }).select('*').single();
  return createdWallet;
}

async function ensureInfluencerWallet(supabaseAdmin: any, influencerId: string) {
  const { data: wallet } = await supabaseAdmin.from('influencer_wallet').select('*').eq('influencer_id', influencerId).maybeSingle();
  if (wallet) return wallet;
  const { data: createdWallet } = await supabaseAdmin.from('influencer_wallet').insert({ influencer_id: influencerId }).select('*').single();
  return createdWallet;
}

async function emitSyncEvent(supabaseAdmin: any, franchiseId: string, linkId: string | null, eventType: string, payload: Record<string, unknown>) {
  await supabaseAdmin.from('franchise_sync_events').insert({
    franchise_id: franchiseId,
    link_id: linkId,
    event_type: eventType,
    source_module: payload.source_module || 'marketplace',
    target_module: payload.target_module || 'franchise',
    sync_status: 'completed',
    payload,
  });
}

async function emitInfluencerSyncEvent(supabaseAdmin: any, influencerId: string, linkId: string | null, eventType: string, payload: Record<string, unknown>) {
  await supabaseAdmin.from('influencer_sync_events').insert({
    influencer_id: influencerId,
    link_id: linkId,
    event_type: eventType,
    source_module: payload.source_module || 'marketplace',
    target_module: payload.target_module || 'influencer',
    sync_status: 'completed',
    payload,
  });
}

async function ensureFranchiseBootstrap(supabaseAdmin: any, user: { userId: string; role: string; email: string }, body: Record<string, unknown>) {
  const selectedPlan = normalizeSelectedPlan(body.selected_plan);
  const city = String(body.city || 'Digital City').trim() || 'Digital City';
  const businessType = String(body.business_type || 'Franchise').trim() || 'Franchise';
  const ownerName = inferOwnerName(user.email, typeof body.owner_name === 'string' ? body.owner_name : null);
  const businessName = String(body.business_name || `${businessType} ${city} Hub`).trim();
  const phone = String(body.phone || '0000000000').trim() || '0000000000';

  let { data: franchise } = await supabaseAdmin
    .from('franchise_accounts')
    .select('*')
    .eq('user_id', user.userId)
    .limit(1)
    .maybeSingle();

  if (!franchise) {
    const { data, error } = await supabaseAdmin
      .from('franchise_accounts')
      .insert({
        user_id: user.userId,
        owner_id: user.userId,
        franchise_code: generateFranchiseCode(city),
        business_name: businessName,
        owner_name: ownerName,
        email: String(body.email || user.email),
        phone,
        masked_email: maskEmail(String(body.email || user.email)),
        masked_phone: maskPhone(phone),
        address: body.address || null,
        city,
        state: body.state || 'Remote',
        country: body.country || 'India',
        pincode: body.pincode || null,
        status: 'active',
        kyc_status: 'pending',
        role_alias: 'franchise_owner',
        display_role_label: 'Franchise Manager',
        marketplace_connected: true,
        dashboard_ready: true,
        manager_panel_ready: true,
        joined_from_marketplace: true,
        metadata: {
          source: 'marketplace_join',
          selected_plan: selectedPlan,
          business_type: businessType,
        },
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Unable to create franchise');
    }

    franchise = data;
  }

  await supabaseAdmin.from('user_roles').upsert({
    user_id: user.userId,
    role: 'franchise',
    approval_status: 'approved',
    approved_at: new Date().toISOString(),
    approved_by: user.userId,
  }, { onConflict: 'user_id,role' as never });

  await ensureWalletAccount(supabaseAdmin, user.userId);

  const { data: existingStore } = await supabaseAdmin
    .from('franchise_stores')
    .select('*')
    .eq('franchise_id', franchise.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const store = existingStore || (await supabaseAdmin
    .from('franchise_stores')
    .insert({
      franchise_id: franchise.id,
      store_code: `STR-${city.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() || 'DIG'}-${Date.now().toString().slice(-4)}`,
      store_name: `${businessName} Central`,
      city,
      state: franchise.state || body.state || 'Remote',
      country: franchise.country || body.country || 'India',
      manager_user_id: user.userId,
      capacity: 100,
      current_load: 0,
      performance_score: 78,
      metadata: {
        source: 'marketplace_join',
        selected_plan: selectedPlan,
        business_type: businessType,
      },
    })
    .select('*')
    .single()).data;

  const { data: metrics } = await supabaseAdmin
    .from('franchise_live_metrics')
    .select('id')
    .eq('franchise_id', franchise.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!metrics) {
    await supabaseAdmin.from('franchise_live_metrics').insert({
      franchise_id: franchise.id,
      live_users: 24,
      live_leads: 3,
      live_conversions: 1,
      revenue_per_second: 0,
      active_stores: 1,
      queue_depth: 0,
      metadata: {
        bootstrap: true,
        source: 'marketplace_join',
      },
    });
  }

  await supabaseAdmin.from('franchise_manager_staff').upsert({
    franchise_id: franchise.id,
    store_id: store?.id || null,
    full_name: ownerName,
    role: 'manager',
    performance_score: 82,
    activity_status: 'active',
    last_activity_at: new Date().toISOString(),
    metadata: {
      owner_user_id: user.userId,
      source: 'marketplace_join',
    },
  }, { onConflict: 'franchise_id,full_name,role' as never });

  const { count: leadCount } = await supabaseAdmin
    .from('franchise_leads')
    .select('id', { head: true, count: 'exact' })
    .eq('franchise_id', franchise.id);

  if (!leadCount) {
    await supabaseAdmin.from('franchise_leads').insert({
      franchise_id: franchise.id,
      lead_name: `${city} Marketplace Expansion`,
      masked_contact: maskPhone(phone),
      industry: businessType,
      region: franchise.state || body.state || 'Remote',
      city,
      language_preference: 'en',
      lead_score: 76,
      status: 'assigned',
      demo_requested: true,
      sale_value: 0,
      commission_earned: 0,
    });
  }

  const productOrdersResult = await supabaseAdmin
    .from('marketplace_orders')
    .select('id,product_id,order_number,final_amount,payment_status,order_status,created_at')
    .eq('buyer_user_id', user.userId)
    .order('created_at', { ascending: false });

  const productOrders = productOrdersResult.data || [];
  const { data: link } = await supabaseAdmin
    .from('marketplace_franchise_links')
    .upsert({
      user_id: user.userId,
      franchise_id: franchise.id,
      selected_plan: selectedPlan,
      city,
      business_type: businessType,
      status: 'connected',
      marketplace_connected: true,
      dashboard_route: '/franchise-dashboard',
      manager_route: '/franchise-manager',
      metadata: {
        product_order_count: productOrders.length,
        product_ids: productOrders.map((item: any) => item.product_id),
        source: 'marketplace_join',
      },
    }, { onConflict: 'user_id' as never })
    .select('*')
    .single();

  await supabaseAdmin.from('franchise_accounts').update({
    owner_id: user.userId,
    marketplace_connected: true,
    dashboard_ready: true,
    manager_panel_ready: true,
    joined_from_marketplace: true,
    role_alias: 'franchise_owner',
    display_role_label: 'Franchise Manager',
    metadata: {
      ...(franchise.metadata || {}),
      selected_plan: selectedPlan,
      business_type: businessType,
      dashboard_route: '/franchise-dashboard',
      manager_route: '/franchise-manager',
      product_order_count: productOrders.length,
    },
  }).eq('id', franchise.id);

  await emitSyncEvent(supabaseAdmin, franchise.id, link?.id || null, 'join_franchise', {
    source_module: 'marketplace',
    target_module: 'franchise',
    selected_plan: selectedPlan,
    city,
    business_type: businessType,
  });
  await emitSyncEvent(supabaseAdmin, franchise.id, link?.id || null, 'marketplace_connect', {
    source_module: 'marketplace',
    target_module: 'franchise_dashboard',
    connected_products: productOrders.length,
  });
  await emitSyncEvent(supabaseAdmin, franchise.id, link?.id || null, 'dashboard_ready', {
    source_module: 'marketplace',
    target_module: 'franchise_dashboard',
    route: '/franchise-dashboard',
  });
  await emitSyncEvent(supabaseAdmin, franchise.id, link?.id || null, 'manager_ready', {
    source_module: 'marketplace',
    target_module: 'franchise_manager',
    route: '/franchise-manager',
  });

  return { franchise, link, store, selectedPlan, city, businessType, productOrders };
}

async function syncRevenueLinks(supabaseAdmin: any, franchise: any, linkId: string | null, orders: any[]) {
  const existingLinksResult = await supabaseAdmin
    .from('marketplace_franchise_revenue_links')
    .select('marketplace_order_id')
    .eq('franchise_id', franchise.id);

  const existingOrderIds = new Set((existingLinksResult.data || []).map((item: any) => item.marketplace_order_id));
  let lastBalance = 0;
  const ledgerResult = await supabaseAdmin
    .from('franchise_wallet_ledger')
    .select('balance_after')
    .eq('franchise_id', franchise.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  lastBalance = toNumber(ledgerResult.data?.balance_after);

  let linkedCount = 0;
  for (const order of orders) {
    if (existingOrderIds.has(order.id)) {
      continue;
    }

    const paymentStatus = String(order.payment_status || '').toLowerCase();
    if (!['verified', 'completed', 'paid'].includes(paymentStatus)) {
      continue;
    }

    const saleAmount = toNumber(order.final_amount);
    const commissionRate = toNumber(franchise.commission_rate, 15);
    const commissionAmount = Number(((saleAmount * commissionRate) / 100).toFixed(2));
    lastBalance = Number((lastBalance + commissionAmount).toFixed(2));

    const { data: commission } = await supabaseAdmin
      .from('franchise_commissions')
      .insert({
        franchise_id: franchise.id,
        sale_amount: saleAmount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        bonus_amount: 0,
        type: 'sale',
        status: 'credited',
        approved_by: franchise.owner_id || franchise.user_id,
        approved_at: new Date().toISOString(),
        credited_at: new Date().toISOString(),
        description: `Marketplace sale ${order.order_number || order.id}`,
        metadata: {
          marketplace_order_id: order.id,
          source: 'marketplace_auto_link',
        },
      })
      .select('id')
      .single();

    const { data: ledgerEntry } = await supabaseAdmin
      .from('franchise_wallet_ledger')
      .insert({
        franchise_id: franchise.id,
        transaction_type: 'credit',
        category: 'commission',
        amount: commissionAmount,
        balance_after: lastBalance,
        reference_id: order.id,
        reference_type: 'marketplace_orders',
        description: `Commission credited for marketplace order ${order.order_number || order.id}`,
      })
      .select('id')
      .single();

    await supabaseAdmin.from('marketplace_franchise_revenue_links').insert({
      franchise_id: franchise.id,
      link_id: linkId,
      marketplace_order_id: order.id,
      franchise_commission_id: commission?.id || null,
      ledger_entry_id: ledgerEntry?.id || null,
      sale_amount: saleAmount,
      commission_amount: commissionAmount,
      wallet_amount: commissionAmount,
      status: 'linked',
      payload: {
        order_number: order.order_number,
        payment_status: order.payment_status,
        order_status: order.order_status,
      },
    });

    linkedCount += 1;
  }

  if (linkedCount > 0) {
    await emitSyncEvent(supabaseAdmin, franchise.id, linkId, 'marketplace_revenue_linked', {
      source_module: 'marketplace',
      target_module: 'franchise_wallet',
      linked_orders: linkedCount,
    });
  }

  return linkedCount;
}

async function emitResellerSyncEvent(supabaseAdmin: any, resellerId: string, linkId: string | null, eventType: string, payload: Record<string, unknown>) {
  await supabaseAdmin.from('reseller_sync_events').insert({
    reseller_id: resellerId,
    link_id: linkId,
    event_type: eventType,
    source_module: payload.source_module || 'marketplace',
    target_module: payload.target_module || 'reseller',
    sync_status: 'completed',
    payload,
  });
}

async function assignResellerTerritory(supabaseAdmin: any, resellerId: string, userId: string, country: string, state?: string | null, city?: string | null) {
  const key = territoryKey({ country, state, city, territoryType: city ? 'city' : state ? 'state' : 'country' });
  const territoryType = city ? 'city' : state ? 'state' : 'country';
  const territoryName = city || state || country;

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
      territory_code: territoryName,
      territory_key: key,
      region_country: country,
      region_state: state || null,
      region_city: city || null,
      is_primary: true,
      assignment_status: 'pending',
      metadata: {
        blocked_by_reseller_id: conflict.reseller_id,
        auto_blocked: true,
      },
    });

    return { assigned: false, territory_key: key, status: 'pending', conflict_reseller_id: conflict.reseller_id };
  }

  await supabaseAdmin.from('territory_mapping').update({ assignment_status: 'released', effective_to: new Date().toISOString(), is_primary: false, updated_at: new Date().toISOString() }).eq('reseller_id', resellerId).eq('is_primary', true).is('deleted_at', null);
  const { data: territory } = await supabaseAdmin.from('territory_mapping').insert({
    reseller_id: resellerId,
    territory_type: territoryType,
    territory_name: territoryName,
    territory_code: territoryName,
    territory_key: key,
    region_country: country,
    region_state: state || null,
    region_city: city || null,
    is_primary: true,
    assignment_status: 'assigned',
    metadata: { assigned_by: userId, auto_assigned: true },
  }).select('*').single();

  return { assigned: true, territory_key: key, status: 'assigned', territory };
}

async function ensureResellerBootstrap(supabaseAdmin: any, user: { userId: string; role: string; email: string }, body: Record<string, unknown>) {
  const country = String(body.country || 'India').trim() || 'India';
  const state = String(body.state || '').trim() || null;
  const city = String(body.city || '').trim() || null;
  const businessType = String(body.business_type || 'Reseller').trim() || 'Reseller';
  const ownerName = inferOwnerName(user.email, typeof body.owner_name === 'string' ? body.owner_name : null);
  const businessName = String(body.business_name || `${businessType} ${city || state || country} Hub`).trim();
  const phone = String(body.phone || '0000000000').trim() || '0000000000';

  let { data: reseller } = await supabaseAdmin.from('resellers').select('*').eq('user_id', user.userId).is('deleted_at', null).maybeSingle();

  if (!reseller) {
    const { data, error } = await supabaseAdmin.from('resellers').insert({
      user_id: user.userId,
      owner_id: user.userId,
      reseller_code: generateResellerCode(),
      status: 'active',
      onboarding_stage: 'live',
      default_commission_rate: 15,
      kyc_status: 'pending',
      source: 'marketplace_join',
      created_by: user.userId,
      approved_by: user.userId,
      approved_at: new Date().toISOString(),
      marketplace_connected: true,
      dashboard_ready: true,
      manager_panel_ready: true,
      joined_from_marketplace: true,
      last_activity_at: new Date().toISOString(),
      metadata: {
        country,
        state,
        city,
        business_type: businessType,
      },
    }).select('*').single();

    if (error || !data) throw new Error(error?.message || 'Unable to create reseller');
    reseller = data;

    await supabaseAdmin.from('reseller_profiles').insert({
      reseller_id: reseller.id,
      business_name: businessName,
      legal_name: businessName,
      owner_name: ownerName,
      email: String(body.email || user.email),
      phone,
      masked_email: maskEmail(String(body.email || user.email)),
      masked_phone: maskPhone(phone),
      company_name: businessName,
      city,
      state,
      country,
      metadata: {
        source: 'marketplace_join',
        business_type: businessType,
      },
    });
  }

  await supabaseAdmin.from('user_roles').upsert([
    {
      user_id: user.userId,
      role: 'reseller',
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: user.userId,
    },
    {
      user_id: user.userId,
      role: 'reseller_manager',
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: user.userId,
    },
  ], { onConflict: 'user_id,role' as never });

  await ensureResellerWallet(supabaseAdmin, reseller.id);

  const territory = await assignResellerTerritory(supabaseAdmin, reseller.id, user.userId, country, state, city);

  const { data: existingAgreement } = await supabaseAdmin
    .from('agreements')
    .select('*')
    .eq('reseller_id', reseller.id)
    .eq('agreement_type', 'reseller_master')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const agreementPayload = {
    reseller_id: reseller.id,
    agreement_type: 'reseller_master',
    version: '1.0',
    status: 'signed',
    signed_at: new Date().toISOString(),
    terms_json: {
      territory,
      commission_rate: reseller.default_commission_rate || 15,
    },
    metadata: { auto_generated: true, source: 'marketplace_join' },
  };

  const agreementResult = existingAgreement
    ? await supabaseAdmin.from('agreements').update(agreementPayload).eq('id', existingAgreement.id).select('*').single()
    : await supabaseAdmin.from('agreements').insert(agreementPayload).select('*').single();
  const agreement = agreementResult.data;

  const activeProductsResult = await supabaseAdmin.from('products').select('product_id,lifetime_price,monthly_price').eq('is_active', true).neq('status', 'inactive');
  const activeProducts = activeProductsResult.data || [];

  for (const product of activeProducts) {
    const basePrice = toNumber(product.lifetime_price || product.monthly_price);
    await supabaseAdmin.from('reseller_products_map').upsert({
      reseller_id: reseller.id,
      product_id: product.product_id,
      assignment_status: 'active',
      commission_override: reseller.default_commission_rate || 15,
      pricing_override: basePrice,
      assigned_by: user.userId,
      metadata: { source: 'marketplace_join' },
    }, { onConflict: 'reseller_id,product_id' as never });

    await supabaseAdmin.from('reseller_pricing_controls').upsert({
      reseller_id: reseller.id,
      product_id: product.product_id,
      price_floor: Math.round(basePrice * 0.8),
      custom_price: basePrice,
      margin_percent: 0,
      discount_limit_percent: 20,
      metadata: { source: 'marketplace_join' },
    }, { onConflict: 'reseller_id,product_id' as never });
  }

  const marketplaceOrdersResult = await supabaseAdmin
    .from('marketplace_orders')
    .select('id,product_id,order_number,final_amount,payment_method,payment_status,order_status,requirements,created_at')
    .eq('buyer_user_id', user.userId)
    .order('created_at', { ascending: false });
  const marketplaceOrders = marketplaceOrdersResult.data || [];

  const territoryKeyValue = territory.territory_key || territoryKey({ country, state, city });
  const { data: link } = await supabaseAdmin.from('marketplace_reseller_links').upsert({
    user_id: user.userId,
    reseller_id: reseller.id,
    country,
    state,
    city,
    business_type: businessType,
    territory_key: territoryKeyValue,
    status: territory.assigned ? 'connected' : 'pending',
    dashboard_route: '/reseller-dashboard',
    manager_route: '/reseller-manager',
    metadata: {
      marketplace_order_count: marketplaceOrders.length,
      product_ids: marketplaceOrders.map((item: any) => item.product_id),
      agreement_id: agreement?.id || null,
    },
  }, { onConflict: 'user_id' as never }).select('*').single();

  await supabaseAdmin.from('resellers').update({
    owner_id: user.userId,
    status: agreement?.status === 'signed' ? 'active' : 'pending',
    onboarding_stage: agreement?.status === 'signed' ? 'live' : 'agreement',
    marketplace_connected: true,
    dashboard_ready: true,
    manager_panel_ready: true,
    joined_from_marketplace: true,
    last_activity_at: new Date().toISOString(),
    metadata: {
      ...(reseller.metadata || {}),
      dashboard_route: '/reseller-dashboard',
      manager_route: '/reseller-manager',
      territory_key: territoryKeyValue,
      business_type: businessType,
      agreement_id: agreement?.id || null,
    },
  }).eq('id', reseller.id);

  await emitResellerSyncEvent(supabaseAdmin, reseller.id, link?.id || null, 'join_reseller', {
    source_module: 'marketplace',
    target_module: 'reseller',
    country,
    state,
    city,
    business_type: businessType,
  });
  await emitResellerSyncEvent(supabaseAdmin, reseller.id, link?.id || null, 'marketplace_connect', {
    source_module: 'marketplace',
    target_module: 'reseller_dashboard',
    connected_products: activeProducts.length,
  });
  await emitResellerSyncEvent(supabaseAdmin, reseller.id, link?.id || null, 'dashboard_ready', {
    source_module: 'marketplace',
    target_module: 'reseller_dashboard',
    route: '/reseller-dashboard',
  });
  await emitResellerSyncEvent(supabaseAdmin, reseller.id, link?.id || null, 'manager_ready', {
    source_module: 'marketplace',
    target_module: 'reseller_manager',
    route: '/reseller-manager',
  });
  await emitResellerSyncEvent(supabaseAdmin, reseller.id, link?.id || null, territory.assigned ? 'territory_assigned' : 'territory_conflict', {
    source_module: 'marketplace',
    target_module: 'territory_engine',
    territory_key: territoryKeyValue,
    status: territory.status,
  });
  await emitResellerSyncEvent(supabaseAdmin, reseller.id, link?.id || null, 'contract_ready', {
    source_module: 'marketplace',
    target_module: 'contract_engine',
    agreement_id: agreement?.id || null,
    status: agreement?.status || 'pending',
  });

  return { reseller, link, territory, agreement, activeProducts, marketplaceOrders, country, state, city, businessType };
}

async function syncResellerRevenueLinks(supabaseAdmin: any, reseller: any, linkId: string | null, orders: any[]) {
  const existingLinksResult = await supabaseAdmin.from('marketplace_reseller_revenue_links').select('marketplace_order_id').eq('reseller_id', reseller.id);
  const existingOrderIds = new Set((existingLinksResult.data || []).map((item: any) => item.marketplace_order_id));
  let linkedCount = 0;

  for (const order of orders) {
    if (existingOrderIds.has(order.id)) continue;
    const paymentStatus = String(order.payment_status || '').toLowerCase();
    if (!['verified', 'completed', 'paid'].includes(paymentStatus)) continue;

    const saleAmount = toNumber(order.final_amount);
    const commissionRate = toNumber(reseller.default_commission_rate, 15);
    const commissionAmount = Number(((saleAmount * commissionRate) / 100).toFixed(2));

    const { data: resellerOrder } = await supabaseAdmin.from('reseller_orders').insert({
      reseller_id: reseller.id,
      product_id: order.product_id,
      marketplace_order_id: order.id,
      order_number: order.order_number || `RSO-${Date.now()}`,
      source: 'marketplace_auto_link',
      gross_amount: saleAmount,
      discount_percent: 0,
      net_amount: saleAmount,
      commission_amount: commissionAmount,
      payment_method: order.payment_method || 'wallet',
      payment_status: 'paid',
      order_status: 'fulfilled',
      requirements: typeof order.requirements === 'string' ? order.requirements : null,
      fulfilled_at: new Date().toISOString(),
      metadata: { marketplace_order_id: order.id },
    }).select('*').single();

    const commissionResult = await supabaseAdmin.rpc('apply_reseller_commission', {
      p_actor_user_id: reseller.owner_id || reseller.user_id,
      p_order_id: resellerOrder?.id,
    });

    const commissionRow = await supabaseAdmin.from('reseller_commissions').select('id,ledger_entry_id,commission_amount').eq('order_id', resellerOrder?.id).maybeSingle();
    await supabaseAdmin.from('marketplace_reseller_revenue_links').insert({
      reseller_id: reseller.id,
      link_id: linkId,
      marketplace_order_id: order.id,
      reseller_order_id: resellerOrder?.id || null,
      commission_id: commissionRow.data?.id || null,
      ledger_entry_id: commissionRow.data?.ledger_entry_id || null,
      sale_amount: saleAmount,
      commission_amount: commissionRow.data?.commission_amount || commissionAmount,
      wallet_amount: commissionRow.data?.commission_amount || commissionAmount,
      status: 'linked',
      payload: {
        order_number: order.order_number,
        payment_status: order.payment_status,
        rpc_success: !commissionResult.error,
      },
    });

    linkedCount += 1;
  }

  if (linkedCount > 0) {
    await emitResellerSyncEvent(supabaseAdmin, reseller.id, linkId, 'revenue_linked', {
      source_module: 'marketplace',
      target_module: 'wallet_engine',
      linked_orders: linkedCount,
    });
  }

  return linkedCount;
}

async function ensureInfluencerBootstrap(supabaseAdmin: any, user: { userId: string; role: string; email: string }, body: Record<string, unknown>) {
  const platform = String(body.platform || 'instagram').trim().toLowerCase() || 'instagram';
  const niche = String(body.niche || 'software').trim() || 'software';
  const followers = toNumber(body.followers_count || body.followers || 0);
  const fullName = inferOwnerName(user.email, typeof body.full_name === 'string' ? body.full_name : typeof body.name === 'string' ? body.name : null);
  const socialHandle = String(body.social_handle || '').trim() || null;

  let { data: influencer } = await supabaseAdmin
    .from('influencer_accounts')
    .select('*')
    .eq('user_id', user.userId)
    .limit(1)
    .maybeSingle();

  if (!influencer) {
    const { data, error } = await supabaseAdmin
      .from('influencer_accounts')
      .insert({
        user_id: user.userId,
        owner_id: user.userId,
        influencer_code: generateInfluencerCode(fullName),
        full_name: fullName,
        email: String(body.email || user.email),
        phone: String(body.phone || '0000000000'),
        masked_email: maskEmail(String(body.email || user.email)),
        masked_phone: maskPhone(String(body.phone || '0000000000')),
        platform,
        social_handle: socialHandle,
        followers_count: followers,
        niche,
        social_platforms: [{ platform, handle: socialHandle }],
        city: body.city || null,
        region: body.state || null,
        country: body.country || 'India',
        status: 'pending',
        kyc_status: 'pending',
        marketplace_connected: true,
        dashboard_ready: true,
        manager_panel_ready: true,
        joined_from_marketplace: true,
        metadata: {
          source: 'marketplace_join',
          bio: body.bio || null,
        },
      })
      .select('*')
      .single();

    if (error || !data) throw new Error(error?.message || 'Unable to create influencer');
    influencer = data;
  } else {
    const { data } = await supabaseAdmin
      .from('influencer_accounts')
      .update({
        owner_id: user.userId,
        full_name: fullName,
        email: String(body.email || influencer.email || user.email),
        phone: String(body.phone || influencer.phone || '0000000000'),
        masked_email: maskEmail(String(body.email || influencer.email || user.email)),
        masked_phone: maskPhone(String(body.phone || influencer.phone || '0000000000')),
        platform,
        social_handle: socialHandle || influencer.social_handle,
        followers_count: followers || influencer.followers_count || 0,
        niche,
        city: body.city || influencer.city,
        region: body.state || influencer.region,
        country: body.country || influencer.country || 'India',
        marketplace_connected: true,
        dashboard_ready: true,
        manager_panel_ready: true,
        joined_from_marketplace: true,
        last_activity_at: new Date().toISOString(),
        metadata: {
          ...(influencer.metadata || {}),
          source: 'marketplace_join',
          bio: body.bio || influencer.metadata?.bio || null,
        },
      })
      .eq('id', influencer.id)
      .select('*')
      .single();

    influencer = data || influencer;
  }

  await supabaseAdmin.from('user_roles').upsert({
    user_id: user.userId,
    role: 'influencer',
    approval_status: influencer.status === 'active' ? 'approved' : 'pending',
  }, { onConflict: 'user_id,role' as never });

  await ensureInfluencerWallet(supabaseAdmin, influencer.id);

  const activeProductsResult = await supabaseAdmin
    .from('products')
    .select('product_id,product_name,category')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  const activeProducts = activeProductsResult.data || [];

  const marketplaceOrdersResult = await supabaseAdmin
    .from('marketplace_orders')
    .select('id,product_id,order_number,final_amount,payment_status,order_status,created_at')
    .eq('buyer_user_id', user.userId)
    .order('created_at', { ascending: false });
  const marketplaceOrders = marketplaceOrdersResult.data || [];

  const { data: link } = await supabaseAdmin.from('marketplace_influencer_links').upsert({
    user_id: user.userId,
    influencer_id: influencer.id,
    platform,
    followers,
    niche,
    status: influencer.status === 'active' && influencer.kyc_status === 'verified' ? 'connected' : 'pending',
    dashboard_route: '/influencer-dashboard',
    manager_route: '/influencer-manager',
    metadata: {
      marketplace_order_count: marketplaceOrders.length,
      active_product_count: activeProducts.length,
      social_handle: socialHandle,
    },
  }, { onConflict: 'user_id' as never }).select('*').single();

  for (const product of activeProducts) {
    await supabaseAdmin.from('marketplace_influencer_products').upsert({
      influencer_id: influencer.id,
      link_id: link?.id || null,
      product_id: product.product_id,
      assignment_status: 'active',
      metadata: {
        source: 'marketplace_join',
        category: product.category,
      },
    }, { onConflict: 'influencer_id,product_id' as never });
  }

  await supabaseAdmin.from('influencer_accounts').update({
    marketplace_connected: true,
    dashboard_ready: true,
    manager_panel_ready: true,
    joined_from_marketplace: true,
    last_activity_at: new Date().toISOString(),
    metadata: {
      ...(influencer.metadata || {}),
      dashboard_route: '/influencer-dashboard',
      manager_route: '/influencer-manager',
      active_product_count: activeProducts.length,
    },
  }).eq('id', influencer.id);

  await emitInfluencerSyncEvent(supabaseAdmin, influencer.id, link?.id || null, 'join_influencer', {
    source_module: 'marketplace',
    target_module: 'influencer',
    platform,
    niche,
    followers,
  });
  await emitInfluencerSyncEvent(supabaseAdmin, influencer.id, link?.id || null, 'marketplace_connect', {
    source_module: 'marketplace',
    target_module: 'influencer_dashboard',
    connected_products: activeProducts.length,
  });
  await emitInfluencerSyncEvent(supabaseAdmin, influencer.id, link?.id || null, 'dashboard_ready', {
    source_module: 'marketplace',
    target_module: 'influencer_dashboard',
    route: '/influencer-dashboard',
  });
  await emitInfluencerSyncEvent(supabaseAdmin, influencer.id, link?.id || null, 'manager_ready', {
    source_module: 'marketplace',
    target_module: 'influencer_manager',
    route: '/influencer-manager',
  });

  return { influencer, link, activeProducts, marketplaceOrders, platform, niche, followers };
}

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry) => typeof entry === 'string') as string[];
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
    } catch {
      return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
  }

  return [];
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api-marketplace', '');

  if (path === '/favourite/list' && req.method === 'GET') {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { data, error } = await supabaseAdmin
        .from('favourites')
        .select('product_id')
        .eq('user_id', user.userId);

      if (error) {
        return errorResponse(error.message, 400);
      }

      return jsonResponse({ items: (data || []).map((row: any) => ({ product_id: row.product_id })) });
    }, { module: 'marketplace', action: 'list_favourites' });
  }

  if (path === '/favourite/toggle' && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ['product_id']);
      if (validation) return validation;

      const productId = String(body.product_id || '').trim();
      if (!productId) return errorResponse('product_id is required', 400);

      // Validate product exists
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('product_id')
        .eq('product_id', productId)
        .maybeSingle();

      if (!product) return errorResponse('Product not found', 404);

      // Check if already favourited
      const { data: existing } = await supabaseAdmin
        .from('favourites')
        .select('id')
        .eq('user_id', user.userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        // Remove favourite
        const { error: deleteError } = await supabaseAdmin
          .from('favourites')
          .delete()
          .eq('user_id', user.userId)
          .eq('product_id', productId);
        if (deleteError) return errorResponse(deleteError.message, 400);
        return jsonResponse({ action: 'removed', product_id: productId });
      } else {
        // Add favourite
        const { error: insertError } = await supabaseAdmin
          .from('favourites')
          .insert({ user_id: user.userId, product_id: productId });
        if (insertError) return errorResponse(insertError.message, 400);
        return jsonResponse({ action: 'added', product_id: productId });
      }
    }, { module: 'marketplace', action: 'toggle_favourite' });
  }

  if (path === '/catalog' && req.method === 'GET') {
    return withAuth(req, [], async ({ supabaseAdmin }) => {
      const page = Math.max(Number(url.searchParams.get('page') || '1'), 1);
      const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '18'), 1), 50);
      const offset = (page - 1) * limit;
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');

      let query = supabaseAdmin
        .from('products')
        .select(`
          product_id,
          product_name,
          category,
          description,
          pricing_model,
          lifetime_price,
          monthly_price,
          features_json,
          tech_stack,
          has_broken_demo,
          product_demo_mappings(demo_id)
        `, { count: 'exact' })
        .eq('is_active', true)
        .neq('status', 'inactive')
        .neq('status', 'parked')
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        const safeSearch = search.replace(/,/g, ' ');
        query = query.or(`product_name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%,category.ilike.%${safeSearch}%`);
      }

      const { data, error, count } = await query;
      if (error) {
        return errorResponse(error.message, 400);
      }

      const { data: categoryRows } = await supabaseAdmin
        .from('products')
        .select('category')
        .eq('is_active', true)
        .neq('status', 'inactive');

      const categoryCounts = new Map<string, number>();
      (categoryRows || []).forEach((row: { category: string | null }) => {
        if (!row.category) {
          return;
        }
        categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
      });

      const items = (data || []).map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        category: item.category,
        description: item.description,
        pricing_model: item.pricing_model,
        lifetime_price: item.lifetime_price,
        monthly_price: item.monthly_price,
        features: normalizeArray(item.features_json),
        tech_stack: normalizeArray(item.tech_stack),
        demo_id: item.product_demo_mappings?.[0]?.demo_id || null,
        has_broken_demo: Boolean(item.has_broken_demo),
      }));

      return jsonResponse({
        items,
        page,
        limit,
        total: count || 0,
        total_pages: Math.max(Math.ceil((count || 0) / limit), 1),
        categories: Array.from(categoryCounts.entries())
          .map(([id, total]) => ({ id, label: id, count: total }))
          .sort((left, right) => right.count - left.count),
      });
    }, { module: 'marketplace', action: 'catalog' });
  }

  if (path === '/orders' && req.method === 'GET') {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { data, error } = await supabaseAdmin
        .from('marketplace_orders')
        .select(`
          id,
          order_number,
          product_id,
          gross_amount,
          discount_percent,
          final_amount,
          payment_method,
          payment_status,
          order_status,
          client_domain,
          requirements,
          created_at,
          updated_at,
          products!marketplace_orders_product_id_fkey(product_name, category),
          marketplace_licenses!marketplace_licenses_order_id_fkey(license_key)
        `)
        .eq('buyer_user_id', user.userId)
        .order('created_at', { ascending: false });

      if (error) {
        return errorResponse(error.message, 400);
      }

      return jsonResponse({
        items: (data || []).map((item: any) => ({
          id: item.id,
          order_number: item.order_number,
          product_id: item.product_id,
          product_name: item.products?.product_name || 'Unknown Product',
          category: item.products?.category || null,
          gross_amount: Number(item.gross_amount) || 0,
          discount_percent: Number(item.discount_percent) || 0,
          final_amount: Number(item.final_amount) || 0,
          payment_method: item.payment_method,
          payment_status: item.payment_status,
          order_status: item.order_status,
          client_domain: item.client_domain,
          requirements: item.requirements,
          license_key: item.marketplace_licenses?.[0]?.license_key || null,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
      });
    }, { module: 'marketplace', action: 'list_orders' });
  }

  if (path === '/orders' && req.method === 'POST') {
    return withAuth(req, ['franchise', 'reseller', 'prime', 'client', 'boss_owner', 'super_admin', 'admin'], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ['product_id', 'payment_method']);
      if (validation) {
        return errorResponse(validation, 400);
      }

      const { data, error } = await supabaseAdmin.rpc('create_marketplace_order', {
        p_user_id: user.userId,
        p_user_role: user.role,
        p_product_id: body.product_id,
        p_payment_method: body.payment_method,
        p_client_domain: body.client_domain || null,
        p_requirements: body.requirements || null,
        p_external_reference: body.external_reference || null,
      });

      if (error) {
        return errorResponse(error.message, 400);
      }

      if (!data?.success) {
        return errorResponse(data?.error || 'Marketplace order failed', 400);
      }

      return jsonResponse(data, 201);
    }, { module: 'marketplace', action: 'create_order', rateLimitType: 'payment' });
  }

  if ((path === '/join-franchise' || path === '/marketplace/join-franchise') && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ['selected_plan', 'city', 'business_type']);
      if (validation) {
        return errorResponse(validation, 400);
      }

      const { franchise, link, selectedPlan, city, businessType, productOrders } = await ensureFranchiseBootstrap(supabaseAdmin, user, body as Record<string, unknown>);
      const linkedRevenueCount = await syncRevenueLinks(supabaseAdmin, franchise, link?.id || null, productOrders);

      return jsonResponse({
        success: true,
        message: 'Marketplace join completed. Franchise dashboard and manager are live.',
        selected_plan: selectedPlan,
        city,
        business_type: businessType,
        franchise_id: franchise.id,
        link_id: link?.id || null,
        dashboard_route: '/franchise-dashboard',
        manager_route: '/franchise-manager',
        redirect_to: '/franchise-dashboard',
        linked_products: productOrders.length,
        linked_revenue_orders: linkedRevenueCount,
        status: 'connected',
      }, 201);
    }, { module: 'marketplace', action: 'join_franchise' });
  }

  if ((path === '/connect' || path === '/marketplace/connect') && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const { franchise, link, productOrders } = await ensureFranchiseBootstrap(supabaseAdmin, user, body as Record<string, unknown>);
      const linkedRevenueCount = await syncRevenueLinks(supabaseAdmin, franchise, link?.id || null, productOrders);

      return jsonResponse({
        connected: true,
        franchise_id: franchise.id,
        link_id: link?.id || null,
        product_orders: productOrders.length,
        linked_revenue_orders: linkedRevenueCount,
        dashboard_route: '/franchise-dashboard',
        manager_route: '/franchise-manager',
      });
    }, { module: 'marketplace', action: 'connect_franchise' });
  }

  if ((path === '/lead/marketplace-route' || path === '/marketplace/lead-route') && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ['lead_name', 'city', 'business_type']);
      if (validation) {
        return errorResponse(validation, 400);
      }

      const { franchise, link } = await ensureFranchiseBootstrap(supabaseAdmin, user, body as Record<string, unknown>);
      const storesResult = await supabaseAdmin
        .from('franchise_stores')
        .select('*')
        .eq('franchise_id', franchise.id)
        .order('performance_score', { ascending: false });

      const selectedStore = chooseBestStore(storesResult.data || [], body as Record<string, unknown>);
      const { data: franchiseLead, error: franchiseLeadError } = await supabaseAdmin
        .from('franchise_leads')
        .insert({
          franchise_id: franchise.id,
          lead_name: body.lead_name,
          masked_contact: maskPhone(String(body.phone || '0000000000')),
          industry: body.business_type,
          region: body.state || franchise.state || 'Remote',
          city: body.city,
          language_preference: body.language_preference || 'en',
          lead_score: toNumber(body.lead_score, 72),
          status: selectedStore ? 'assigned' : 'new',
          demo_requested: Boolean(body.demo_requested ?? true),
          assigned_to_reseller: selectedStore?.manager_user_id || null,
        })
        .select('*')
        .single();

      if (franchiseLeadError || !franchiseLead) {
        return errorResponse(franchiseLeadError?.message || 'Unable to create franchise lead.', 400);
      }

      if (selectedStore) {
        await supabaseAdmin
          .from('franchise_stores')
          .update({
            current_load: toNumber(selectedStore.current_load) + 1,
            live_leads: toNumber(selectedStore.live_leads) + 1,
          })
          .eq('id', selectedStore.id);
      }

      await supabaseAdmin.from('marketplace_franchise_leads').insert({
        franchise_id: franchise.id,
        link_id: link?.id || null,
        franchise_lead_id: franchiseLead.id,
        store_id: selectedStore?.id || null,
        assigned_agent_user_id: selectedStore?.manager_user_id || null,
        lead_name: String(body.lead_name),
        city: String(body.city),
        business_type: String(body.business_type),
        selected_plan: typeof body.selected_plan === 'string' ? body.selected_plan : null,
        source: 'marketplace',
        status: selectedStore ? 'assigned' : 'new',
        payload: {
          requirements: body.requirements || null,
          source_page: body.source_page || 'marketplace',
        },
      });

      await emitSyncEvent(supabaseAdmin, franchise.id, link?.id || null, 'marketplace_lead_routed', {
        source_module: 'marketplace',
        target_module: 'franchise_leads',
        lead_id: franchiseLead.id,
        store_id: selectedStore?.id || null,
      });

      return jsonResponse({
        routed: true,
        franchise_id: franchise.id,
        lead: franchiseLead,
        selected_store: selectedStore,
      }, 201);
    }, { module: 'marketplace', action: 'lead_marketplace_route' });
  }

  if ((path === '/revenue/link' || path === '/marketplace/revenue-link') && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ['marketplace_order_id']);
      if (validation) {
        return errorResponse(validation, 400);
      }

      const { franchise, link } = await ensureFranchiseBootstrap(supabaseAdmin, user, body as Record<string, unknown>);
      const { data: order, error } = await supabaseAdmin
        .from('marketplace_orders')
        .select('id,order_number,final_amount,payment_status,order_status')
        .eq('id', body.marketplace_order_id)
        .eq('buyer_user_id', user.userId)
        .single();

      if (error || !order) {
        return errorResponse(error?.message || 'Marketplace order not found.', 404);
      }

      const linkedCount = await syncRevenueLinks(supabaseAdmin, franchise, link?.id || null, [order]);
      return jsonResponse({
        linked: linkedCount > 0,
        marketplace_order_id: order.id,
        franchise_id: franchise.id,
        linked_count: linkedCount,
      });
    }, { module: 'marketplace', action: 'revenue_link' });
  }

  if ((path === '/join-reseller' || path === '/marketplace/join-reseller') && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ['country', 'business_type']);
      if (validation) return errorResponse(validation, 400);

      const { reseller, link, territory, marketplaceOrders, country, state, city, businessType } = await ensureResellerBootstrap(supabaseAdmin, user, body as Record<string, unknown>);
      const linkedRevenueCount = await syncResellerRevenueLinks(supabaseAdmin, reseller, link?.id || null, marketplaceOrders);

      return jsonResponse({
        success: true,
        message: 'Marketplace join completed. Reseller dashboard and manager are live.',
        reseller_id: reseller.id,
        role: 'reseller',
        territory_status: territory.status,
        country,
        state,
        city,
        business_type: businessType,
        dashboard_route: '/reseller-dashboard',
        manager_route: '/reseller-manager',
        redirect_to: '/reseller-dashboard',
        linked_products: marketplaceOrders.length,
        linked_revenue_orders: linkedRevenueCount,
        status: territory.assigned ? 'connected' : 'pending',
      }, 201);
    }, { module: 'marketplace', action: 'join_reseller' });
  }

  if ((path === '/join-influencer' || path === '/marketplace/join-influencer') && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ['platform', 'niche']);
      if (validation) return errorResponse(validation, 400);

      const { influencer, link, activeProducts, platform, niche, followers } = await ensureInfluencerBootstrap(supabaseAdmin, user, body as Record<string, unknown>);

      return jsonResponse({
        success: true,
        message: 'Marketplace join completed. Influencer dashboard is live and the manager pipeline is connected.',
        influencer_id: influencer.id,
        role: 'influencer',
        platform,
        niche,
        followers,
        dashboard_route: '/influencer-dashboard',
        manager_route: '/influencer-manager',
        redirect_to: '/influencer-dashboard',
        linked_products: activeProducts.length,
        link_id: link?.id || null,
        status: influencer.status === 'active' && influencer.kyc_status === 'verified' ? 'connected' : 'pending',
      }, 201);
    }, { module: 'marketplace', action: 'join_influencer' });
  }

  if ((path === '/influencer-connect' || path === '/marketplace/influencer-connect') && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const { influencer, link, activeProducts, marketplaceOrders } = await ensureInfluencerBootstrap(supabaseAdmin, user, body as Record<string, unknown>);

      return jsonResponse({
        connected: true,
        influencer_id: influencer.id,
        link_id: link?.id || null,
        linked_products: activeProducts.length,
        marketplace_orders: marketplaceOrders.length,
        dashboard_route: '/influencer-dashboard',
        manager_route: '/influencer-manager',
      });
    }, { module: 'marketplace', action: 'influencer_connect' });
  }

  if ((path === '/reseller-connect' || path === '/marketplace/reseller-connect') && req.method === 'POST') {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const { reseller, link, marketplaceOrders } = await ensureResellerBootstrap(supabaseAdmin, user, body as Record<string, unknown>);
      const linkedRevenueCount = await syncResellerRevenueLinks(supabaseAdmin, reseller, link?.id || null, marketplaceOrders);

      return jsonResponse({
        connected: true,
        reseller_id: reseller.id,
        link_id: link?.id || null,
        product_orders: marketplaceOrders.length,
        linked_revenue_orders: linkedRevenueCount,
        dashboard_route: '/reseller-dashboard',
        manager_route: '/reseller-manager',
      });
    }, { module: 'marketplace', action: 'reseller_connect' });
  }

  if (path === '/health' && req.method === 'GET') {
    return withAuth(req, [], async ({ supabaseAdmin }) => {
      const [{ count: productCount }, { count: orderCount }, { count: licenseCount }] = await Promise.all([
        supabaseAdmin.from('products').select('product_id', { count: 'exact', head: true }).eq('is_active', true),
        supabaseAdmin.from('marketplace_orders').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('marketplace_licenses').select('id', { count: 'exact', head: true }),
      ]);

      return jsonResponse({
        status: 'ok',
        products: productCount || 0,
        orders: orderCount || 0,
        licenses: licenseCount || 0,
      });
    }, { module: 'marketplace', action: 'health' });
  }

  return errorResponse('Not found', 404);
});
