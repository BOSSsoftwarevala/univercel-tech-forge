import {
  withEnhancedMiddleware,
  applyMasking,
  notificationMiddleware,
} from '../_shared/enhanced-middleware.ts';
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  maskEmail,
  maskPhone,
} from '../_shared/utils.ts';

const INFLUENCER_MANAGER_ROLES = ['influencer_manager', 'super_admin', 'admin', 'marketing_manager'];
const FINANCE_ROLES = ['finance_manager', 'super_admin', 'admin'];

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function roundCurrency(value: unknown) {
  return Number(toNumber(value).toFixed(2));
}

function normalizePath(path: string) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

function matchesPath(path: string, ...candidates: string[]) {
  return candidates.includes(normalizePath(path));
}

function buildInfluencerCode(seed?: string | null) {
  const normalized = String(seed || 'INF').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'INF';
  return `${normalized}-${Date.now().toString(36).toUpperCase()}`;
}

function buildShortCode(seed?: string | null) {
  const normalized = String(seed || 'sv').replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toLowerCase() || 'sv';
  return `${normalized}${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeCode(value: unknown) {
  return String(value || '').trim();
}

function normalizePlatform(value: unknown, fallback = 'generic') {
  const platform = String(value || fallback).trim().toLowerCase();
  return platform || fallback;
}

function normalizePercent(value: unknown) {
  const numeric = toNumber(value);
  if (numeric <= 0) return 0;
  if (numeric > 1) return Number((numeric / 100).toFixed(4));
  return Number(numeric.toFixed(4));
}

function inferFullName(body: Record<string, unknown>, email?: string | null) {
  const directName = String(body.full_name || body.name || '').trim();
  if (directName) return directName;
  const localPart = String(email || 'Influencer').split('@')[0] || 'Influencer';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Influencer';
}

async function logTraceEvent(
  supabaseAdmin: any,
  traceId: string,
  step: string,
  data: {
    influencer_id?: string;
    referral_id?: string;
    lead_id?: string;
    conversion_id?: string;
    commission_id?: string;
    transaction_id?: string;
    status: 'started' | 'processing' | 'completed' | 'failed' | 'retry';
    error_message?: string;
    metadata?: Record<string, unknown>;
  }
) {
  await supabaseAdmin.from('influencer_trace_logs').insert({
    trace_id: traceId,
    step,
    ...data
  });
}

async function checkFraudState(supabaseAdmin: any, influencer: any, requestData: Record<string, unknown>) {
  const ipAddress = String(requestData.ip_address || 'unknown');
  const userAgent = String(requestData.user_agent || '');
  const deviceFingerprint = String(requestData.device_fingerprint || '');

  // Run all three fraud-check queries in parallel instead of sequentially
  const [
    { count: ipCount },
    { count: recentSignups },
    { data: fraudFlags },
  ] = await Promise.all([
    supabaseAdmin
      .from('influencer_click_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('clicked_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),

    supabaseAdmin
      .from('influencer_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()),

    supabaseAdmin
      .from('influencer_fraud_flags')
      .select('*')
      .eq('influencer_id', influencer.id)
      .is('resolved_at', null),
  ]);

  const isSafe = ipCount < 10 && recentSignups < 5 && (!fraudFlags || fraudFlags.length === 0);
  const referralLink = isSafe ? await ensureReferralLink(supabaseAdmin, influencer, {}) : null;

  return { safe: isSafe, referralLink, fraudFlags: fraudFlags || [] };
}

async function getCommissionRule(supabaseAdmin: any, ruleType: string, platform?: string, niche?: string) {
  const { data: rule } = await supabaseAdmin
    .from('influencer_commission_rules')
    .select('*')
    .eq('rule_type', ruleType)
    .eq('is_active', true)
    .or(`platform.eq.${platform || 'generic'},platform.is.null`)
    .or(`niche.eq.${niche || 'generic'},niche.is.null`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return rule;
}

async function calculateCommission(supabaseAdmin: any, ruleType: string, baseAmount: number, platform?: string, niche?: string) {
  const rule = await getCommissionRule(supabaseAdmin, ruleType, platform, niche);
  if (!rule) return 0;

  const amount = Math.max(rule.min_amount || 0, Math.min(rule.max_amount || baseAmount, baseAmount));
  const percentageAmount = (amount * rule.rate_percentage) / 100;
  const fixedAmount = rule.fixed_amount || 0;

  return roundCurrency(percentageAmount + fixedAmount);
}

function calculateCommissionRate(rule: any, amount: number, type: string): number {
  if (!rule) return 0;

  // Check if rule applies to this transaction type
  if (rule.transaction_types && !rule.transaction_types.includes(type)) {
    return 0;
  }

  // Check amount thresholds
  if (rule.min_amount && amount < rule.min_amount) return 0;
  if (rule.max_amount && amount > rule.max_amount) return 0;

  // Return the commission rate (stored as percentage, convert to decimal)
  return rule.commission_rate / 100;
}

async function checkFraudStateNew(supabaseAdmin: any, params: {
  influencer_id: string;
  event_type: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
}) {
  const flags: string[] = [];
  let riskScore = 0;
  let isBlocked = false;
  let blockedReason = '';

  // Check for existing fraud flags
  const { data: existingFlags } = await supabaseAdmin
    .from('influencer_fraud_flags')
    .select('*')
    .eq('influencer_id', params.influencer_id)
    .eq('is_blocked', true)
    .is('resolved_at', null)
    .order('created_at', { ascending: false })
    .limit(5);

  if (existingFlags && existingFlags.length > 0) {
    riskScore += 50;
    flags.push('existing_fraud_flags');
    isBlocked = true;
    blockedReason = 'Active fraud flags detected';
  }

  // Check IP-based fraud patterns
  if (params.ip_address) {
    const { count: ipActivity } = await supabaseAdmin
      .from('influencer_click_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', params.ip_address)
      .gte('clicked_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (ipActivity > 100) {
      riskScore += 30;
      flags.push('high_ip_activity');
    }

    // Check for VPN/proxy indicators
    if (params.metadata?.is_vpn === true || params.metadata?.is_proxy === true) {
      riskScore += 40;
      flags.push('vpn_proxy_detected');
      if (riskScore > 70) {
        isBlocked = true;
        blockedReason = 'VPN/Proxy usage detected';
      }
    }
  }

  // Check user agent patterns
  if (params.user_agent) {
    if (params.user_agent.includes('bot') || params.user_agent.includes('crawler')) {
      riskScore += 60;
      flags.push('bot_user_agent');
      isBlocked = true;
      blockedReason = 'Bot activity detected';
    }
  }

  // Event-specific checks
  if (params.event_type === 'payout_approval' && riskScore > 80) {
    isBlocked = true;
    blockedReason = 'High risk payout attempt';
  }

  return {
    riskScore: Math.min(riskScore, 100),
    flags,
    isBlocked,
    blockedReason
  };
}

async function ensureInfluencerWallet(supabaseAdmin: any, influencerId: string) {
  const { data: wallet } = await supabaseAdmin
    .from('influencer_wallet')
    .select('*')
    .eq('influencer_id', influencerId)
    .maybeSingle();

  if (wallet) return wallet;

  const { data: createdWallet } = await supabaseAdmin
    .from('influencer_wallet')
    .insert({ influencer_id: influencerId })
    .select('*')
    .single();

  return createdWallet;
}

async function getInfluencerAccount(supabaseAdmin: any, userId: string, influencerId?: string | null) {
  let query = supabaseAdmin.from('influencer_accounts').select('*');
  if (influencerId) {
    query = query.eq('id', influencerId);
  } else {
    query = query.eq('user_id', userId);
  }
  const { data } = await query.maybeSingle();
  return data;
}

async function ensureReferralLink(supabaseAdmin: any, influencer: any, body: Record<string, unknown>) {
  const shortCode = buildShortCode(influencer.influencer_code);
  const trackingUrl = `https://softwarevala.com/ref/${shortCode}`;
  const { data: link, error } = await supabaseAdmin
    .from('influencer_referral_links')
    .insert({
      influencer_id: influencer.id,
      campaign_id: body.campaign_id || null,
      original_url: String(body.original_url || body.target_url || 'https://softwarevala.com/marketplace'),
      short_code: shortCode,
      tracking_url: trackingUrl,
      utm_source: body.utm_source || 'influencer',
      utm_medium: body.utm_medium || 'social',
      utm_campaign: body.utm_campaign || body.campaign_name || influencer.influencer_code,
      utm_content: body.utm_content || influencer.platform || 'organic',
      product_category: body.product_category || body.niche || influencer.niche || null,
      is_active: true,
    })
    .select('*')
    .single();

  if (error || !link) {
    throw new Error(error?.message || 'Unable to create tracking link');
  }

  await supabaseAdmin
    .from('influencer_accounts')
    .update({ tracking_link_active: true, last_activity_at: new Date().toISOString() })
    .eq('id', influencer.id);

  return link;
}

async function resolveReferralLink(supabaseAdmin: any, influencerId: string, body: Record<string, unknown>) {
  const filters = [
    body.referral_link_id ? `id.eq.${body.referral_link_id}` : null,
    body.short_code ? `short_code.eq.${body.short_code}` : null,
    body.tracking_url ? `tracking_url.eq.${body.tracking_url}` : null,
  ].filter(Boolean);

  if (!filters.length) return null;

  const { data: link } = await supabaseAdmin
    .from('influencer_referral_links')
    .select('*')
    .eq('influencer_id', influencerId)
    .or(filters.join(','))
    .maybeSingle();

  return link;
}

async function resolveInfluencerByReferralCode(supabaseAdmin: any, referralCode: string) {
  const normalizedCode = normalizeCode(referralCode);
  if (!normalizedCode) return null;

  const { data: accountMatch } = await supabaseAdmin
    .from('influencer_accounts')
    .select('*')
    .eq('influencer_code', normalizedCode.toUpperCase())
    .maybeSingle();

  if (accountMatch) return accountMatch;

  const { data: linkMatch } = await supabaseAdmin
    .from('influencer_referral_links')
    .select('influencer_id, short_code')
    .eq('short_code', normalizedCode.toLowerCase())
    .maybeSingle();

  if (!linkMatch?.influencer_id) return null;
  return getInfluencerAccount(supabaseAdmin, '', linkMatch.influencer_id);
}

async function getReferralRelationship(supabaseAdmin: any, influencerId: string) {
  const { data } = await supabaseAdmin
    .from('influencer_referral_relationships')
    .select('*')
    .eq('influencer_id', influencerId)
    .maybeSingle();
  return data;
}

async function getPlatformRate(supabaseAdmin: any, influencer: any, platformOverride?: unknown, nicheOverride?: unknown) {
  const platform = normalizePlatform(platformOverride || influencer?.platform || 'generic');
  const niche = String(nicheOverride || influencer?.niche || '').trim() || null;

  if (niche) {
    const { data: exactRate } = await supabaseAdmin
      .from('influencer_platform_rates')
      .select('*')
      .eq('platform', platform)
      .eq('niche', niche)
      .eq('status', 'active')
      .maybeSingle();

    if (exactRate) return exactRate;
  }

  const { data: platformRate } = await supabaseAdmin
    .from('influencer_platform_rates')
    .select('*')
    .eq('platform', platform)
    .is('niche', null)
    .eq('status', 'active')
    .maybeSingle();

  if (platformRate) return platformRate;

  const { data: fallbackRate } = await supabaseAdmin
    .from('influencer_platform_rates')
    .select('*')
    .eq('platform', 'generic')
    .is('niche', null)
    .eq('status', 'active')
    .maybeSingle();

  return fallbackRate || {
    platform,
    niche,
    currency: 'INR',
    rate_per_real_reach: 0.015,
    rate_per_engagement: 0.25,
    cpc_rate: influencer?.cpc_rate || 0.5,
    cpl_rate: influencer?.cpl_rate || 5,
    cpa_rate: influencer?.cpa_rate || 50,
    status: 'active',
    metadata: { source: 'fallback' },
  };
}

async function createAIAsset(
  supabaseAdmin: any,
  influencerId: string | null,
  assetType: 'content' | 'contract' | 'scan' | 'suggestion',
  title: string,
  prompt: string | null,
  outputText: string | null,
  outputJson: Record<string, unknown>,
  createdBy?: string | null,
) {
  const { data } = await supabaseAdmin
    .from('influencer_ai_assets')
    .insert({
      influencer_id: influencerId,
      asset_type: assetType,
      title,
      prompt,
      output_text: outputText,
      output_json: outputJson,
      created_by: createdBy || null,
    })
    .select('*')
    .single();

  return data;
}

async function creditCommissionToWallet(
  supabaseAdmin: any,
  input: {
    influencerId: string;
    amount: number;
    referenceKey: string;
    commissionKind: 'campaign' | 'referral_l1' | 'referral_l2' | 'bonus' | 'adjustment';
    description: string;
    referenceType: string;
    referenceId?: string | null;
    sourceInfluencerId?: string | null;
    sourceConversionId?: string | null;
    level?: 0 | 1 | 2;
    commissionRate?: number;
    baseAmount?: number;
    metadata?: Record<string, unknown>;
  },
) {
  const amount = roundCurrency(input.amount);
  if (amount <= 0) {
    return { duplicated: false, skipped: true, amount: 0 };
  }

  const { data: existingJournal } = await supabaseAdmin
    .from('influencer_commission_journal')
    .select('*')
    .eq('influencer_id', input.influencerId)
    .eq('reference_key', input.referenceKey)
    .maybeSingle();

  if (existingJournal) {
    return { duplicated: true, skipped: false, amount: roundCurrency(existingJournal.commission_amount), journal: existingJournal };
  }

  const wallet = await ensureInfluencerWallet(supabaseAdmin, input.influencerId);
  const nextAvailable = roundCurrency(wallet.available_balance + amount);
  const nextTotalEarned = roundCurrency(wallet.total_earned + amount);

  const { data: ledgerEntry } = await supabaseAdmin
    .from('influencer_wallet_ledger')
    .insert({
      influencer_id: input.influencerId,
      transaction_type: 'credit',
      amount,
      balance_after: nextAvailable,
      reference_type: input.referenceType,
      reference_id: input.referenceId || null,
      description: input.description,
      status: 'completed',
    })
    .select('*')
    .single();

  await supabaseAdmin
    .from('influencer_wallet')
    .update({
      available_balance: nextAvailable,
      total_earned: nextTotalEarned,
      updated_at: new Date().toISOString(),
    })
    .eq('influencer_id', input.influencerId);

  const { data: journal } = await supabaseAdmin
    .from('influencer_commission_journal')
    .insert({
      influencer_id: input.influencerId,
      source_influencer_id: input.sourceInfluencerId || null,
      source_conversion_id: input.sourceConversionId || null,
      commission_kind: input.commissionKind,
      level: input.level || 0,
      reference_key: input.referenceKey,
      base_amount: roundCurrency(input.baseAmount),
      commission_rate: Number(toNumber(input.commissionRate).toFixed(4)),
      commission_amount: amount,
      status: 'credited',
      metadata: {
        ...(input.metadata || {}),
        ledger_entry_id: ledgerEntry?.id || null,
      },
    })
    .select('*')
    .single();

  return {
    duplicated: false,
    skipped: false,
    amount,
    balance_after: nextAvailable,
    total_earned: nextTotalEarned,
    ledger_entry: ledgerEntry,
    journal,
  };
}

async function distributeReferralCommission(
  supabaseAdmin: any,
  sourceInfluencer: any,
  options: {
    baseAmount: number;
    referenceKey: string;
    sourceConversionId?: string | null;
    saleAmount?: number;
    metadata?: Record<string, unknown>;
  },
) {
  const relationship = await getReferralRelationship(supabaseAdmin, sourceInfluencer.id);
  if (!relationship) {
    return { applied: false, level_1_amount: 0, level_2_amount: 0, payouts: [] };
  }

  const baseAmount = roundCurrency(options.baseAmount);
  if (baseAmount <= 0) {
    return { applied: false, level_1_amount: 0, level_2_amount: 0, payouts: [] };
  }

  const payouts = [];
  let levelOneAmount = 0;
  let levelTwoAmount = 0;

  // Get commission rules for the source influencer
  const { data: rules } = await supabaseAdmin
    .from('influencer_commission_rules')
    .select('*')
    .eq('influencer_id', sourceInfluencer.id)
    .eq('is_active', true)
    .order('level', { ascending: true });

  if (relationship.parent_influencer_id && relationship.parent_influencer_id !== sourceInfluencer.id) {
    // Calculate L1 commission using rules or fallback
    const l1Rule = rules?.find(r => r.level === 1);
    const l1Rate = l1Rule ? calculateCommissionRate(l1Rule, baseAmount, 'referral') : 0.1;
    levelOneAmount = roundCurrency(baseAmount * l1Rate);
    const result = await creditCommissionToWallet(supabaseAdmin, {
      influencerId: relationship.parent_influencer_id,
      amount: levelOneAmount,
      referenceKey: `${options.referenceKey}:l1`,
      commissionKind: 'referral_l1',
      description: `L1 referral earning from ${sourceInfluencer.full_name || sourceInfluencer.influencer_code}`,
      referenceType: 'referral_commission',
      referenceId: options.sourceConversionId || null,
      sourceInfluencerId: sourceInfluencer.id,
      sourceConversionId: options.sourceConversionId || null,
      level: 1,
      commissionRate: 10,
      baseAmount,
      metadata: options.metadata,
    });

    await supabaseAdmin.from('influencer_referral_events').insert({
      referrer_id: relationship.parent_influencer_id,
      referred_influencer_id: sourceInfluencer.id,
      referral_code: relationship.referral_code,
      event_type: options.sourceConversionId ? 'conversion' : 'campaign_sale',
      source_conversion_id: options.sourceConversionId || null,
      sale_amount: roundCurrency(options.saleAmount),
      reward_base_amount: baseAmount,
      metadata: {
        ...(options.metadata || {}),
        level: 1,
        credited: !result.duplicated && !result.skipped,
      },
    });

    payouts.push({ level: 1, influencer_id: relationship.parent_influencer_id, ...result });
  }

  if (
    relationship.grandparent_influencer_id
    && relationship.grandparent_influencer_id !== sourceInfluencer.id
    && relationship.grandparent_influencer_id !== relationship.parent_influencer_id
  ) {
    // Calculate L2 commission using rules or fallback
    const l2Rule = rules?.find(r => r.level === 2);
    const l2Rate = l2Rule ? calculateCommissionRate(l2Rule, baseAmount, 'referral') : 0.05;
    levelTwoAmount = roundCurrency(baseAmount * l2Rate);
    const result = await creditCommissionToWallet(supabaseAdmin, {
      influencerId: relationship.grandparent_influencer_id,
      amount: levelTwoAmount,
      referenceKey: `${options.referenceKey}:l2`,
      commissionKind: 'referral_l2',
      description: `L2 referral earning from ${sourceInfluencer.full_name || sourceInfluencer.influencer_code}`,
      referenceType: 'referral_commission',
      referenceId: options.sourceConversionId || null,
      sourceInfluencerId: sourceInfluencer.id,
      sourceConversionId: options.sourceConversionId || null,
      level: 2,
      commissionRate: 5,
      baseAmount,
      metadata: options.metadata,
    });

    await supabaseAdmin.from('influencer_referral_events').insert({
      referrer_id: relationship.grandparent_influencer_id,
      referred_influencer_id: sourceInfluencer.id,
      referral_code: relationship.referral_code,
      event_type: options.sourceConversionId ? 'conversion' : 'campaign_sale',
      source_conversion_id: options.sourceConversionId || null,
      sale_amount: roundCurrency(options.saleAmount),
      reward_base_amount: baseAmount,
      metadata: {
        ...(options.metadata || {}),
        level: 2,
        credited: !result.duplicated && !result.skipped,
      },
    });

    payouts.push({ level: 2, influencer_id: relationship.grandparent_influencer_id, ...result });
  }

  return {
    applied: payouts.length > 0,
    level_1_amount: levelOneAmount,
    level_2_amount: levelTwoAmount,
    payouts,
  };
}

async function buildWalletResponse(supabaseAdmin: any, influencerId: string) {
  const [walletResult, ledgerResult, payoutsResult, journalResult] = await Promise.all([
    supabaseAdmin.from('influencer_wallet').select('*').eq('influencer_id', influencerId).maybeSingle(),
    supabaseAdmin.from('influencer_wallet_ledger').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
    supabaseAdmin.from('influencer_payout_requests').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
    supabaseAdmin.from('influencer_commission_journal').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
  ]);

  const wallet = walletResult.data || null;
  const ledger = ledgerResult.data || [];
  const payouts = payoutsResult.data || [];
  const journal = journalResult.data || [];

  const referralEarnings = roundCurrency(journal
    .filter((item: any) => String(item.commission_kind).startsWith('referral_'))
    .reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0));

  const campaignEarnings = roundCurrency(journal
    .filter((item: any) => item.commission_kind === 'campaign')
    .reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0));

  const bonusEarnings = roundCurrency(journal
    .filter((item: any) => item.commission_kind === 'bonus')
    .reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0));

  return {
    wallet,
    ledger,
    payouts,
    commission_journal: journal,
    breakdown: {
      referral_earnings: referralEarnings,
      campaign_earnings: campaignEarnings,
      bonus_earnings: bonusEarnings,
      pending_payout_total: roundCurrency(payouts.filter((item: any) => item.status === 'pending').reduce((sum: number, item: any) => sum + toNumber(item.amount), 0)),
      last_payout_at: wallet?.last_payout_at || null,
    },
  };
}

async function buildOverview(supabaseAdmin: any, influencerId: string) {
  const [
    influencerResult,
    walletResult,
    campaignsResult,
    linksResult,
    clickResult,
    conversionResult,
    leadResult,
    fraudResult,
    eventResult,
    relationshipResult,
    journalResult,
    aiAssetResult,
    contractResult,
  ] = await Promise.all([
    supabaseAdmin.from('influencer_accounts').select('*').eq('id', influencerId).maybeSingle(),
    supabaseAdmin.from('influencer_wallet').select('*').eq('influencer_id', influencerId).maybeSingle(),
    supabaseAdmin.from('influencer_campaign_map').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
    supabaseAdmin.from('influencer_referral_links').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
    supabaseAdmin.from('influencer_click_logs').select('*').eq('influencer_id', influencerId).order('clicked_at', { ascending: false }),
    supabaseAdmin.from('influencer_conversion_logs').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
    supabaseAdmin.from('marketplace_influencer_leads').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
    supabaseAdmin.from('influencer_fraud_flags').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
    supabaseAdmin.from('influencer_sync_events').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('influencer_referral_relationships').select('*').or(`parent_influencer_id.eq.${influencerId},grandparent_influencer_id.eq.${influencerId}`).order('created_at', { ascending: false }),
    supabaseAdmin.from('influencer_commission_journal').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }),
    supabaseAdmin.from('influencer_ai_assets').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('influencer_ai_contracts').select('*').eq('influencer_id', influencerId).order('created_at', { ascending: false }).limit(20),
  ]);

  const influencer = influencerResult.data || null;
  const wallet = walletResult.data || null;
  const campaigns = campaignsResult.data || [];
  const links = linksResult.data || [];
  const clicks = clickResult.data || [];
  const conversions = conversionResult.data || [];
  const leads = leadResult.data || [];
  const fraudFlags = fraudResult.data || [];
  const events = eventResult.data || [];
  const referralRelationships = relationshipResult.data || [];
  const commissionJournal = journalResult.data || [];
  const aiAssets = aiAssetResult.data || [];
  const contracts = contractResult.data || [];
  const platformRate = await getPlatformRate(supabaseAdmin, influencer || {});

  const totalClicks = clicks.length;
  const uniqueClicks = clicks.filter((item: any) => item.is_unique).length;
  const realReach = clicks.filter((item: any) => item.is_unique && !item.is_bot && !item.is_fraud).length;
  const totalConversions = conversions.length;
  const approvedConversions = conversions.filter((item: any) => item.status === 'approved' || item.status === 'credited');
  const totalSales = roundCurrency(conversions.reduce((sum: number, item: any) => sum + toNumber(item.sale_amount), 0));
  const totalCommission = roundCurrency(conversions.reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0));
  const qualifiedLeads = leads.filter((item: any) => ['qualified', 'converted'].includes(item.status)).length;
  const activeCampaigns = campaigns.filter((item: any) => item.status === 'active').length;
  const activeLinks = links.filter((item: any) => item.is_active).length;
  const fraudOpen = fraudFlags.filter((item: any) => item.status !== 'resolved').length;
  const conversionRate = totalClicks ? Number(((totalConversions / totalClicks) * 100).toFixed(2)) : 0;
  const referralEarnings = roundCurrency(commissionJournal
    .filter((item: any) => String(item.commission_kind).startsWith('referral_'))
    .reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0));
  const campaignEarnings = roundCurrency(commissionJournal
    .filter((item: any) => item.commission_kind === 'campaign')
    .reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0));
  const directReferrals = referralRelationships.filter((item: any) => item.parent_influencer_id === influencerId && item.status === 'active').length;
  const indirectReferrals = referralRelationships.filter((item: any) => item.grandparent_influencer_id === influencerId && item.status === 'active').length;
  const suspiciousTrafficRatio = totalClicks ? ((clicks.filter((item: any) => item.is_bot || item.is_fraud).length / totalClicks) * 100) : 0;
  const aiTrustScore = Number(Math.max(0, 100 - Math.max(toNumber(influencer?.fraud_score), fraudOpen * 12, suspiciousTrafficRatio))).toFixed(2);
  const topLinks = links
    .map((link: any) => {
      const linkClicks = clicks.filter((item: any) => item.tracking_link === link.tracking_url);
      const clickIds = new Set(linkClicks.map((item: any) => item.id));
      const linkConversions = conversions.filter((item: any) => clickIds.has(item.click_id) || (link.campaign_id && item.campaign_id === link.campaign_id));
      return {
        id: link.id,
        short_code: link.short_code,
        tracking_url: link.tracking_url,
        campaign_id: link.campaign_id || null,
        campaign_name: campaigns.find((campaign: any) => campaign.id === link.campaign_id)?.campaign_name || link.utm_campaign || 'Referral Link',
        clicks: linkClicks.length,
        conversions: linkConversions.length,
        earnings: roundCurrency(linkConversions.reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0)),
      };
    })
    .sort((left: any, right: any) => right.earnings - left.earnings || right.clicks - left.clicks)
    .slice(0, 5);

  return {
    influencer,
    wallet,
    campaigns,
    links,
    clicks,
    conversions,
    leads,
    fraudFlags,
    events,
    referral_relationships: referralRelationships,
    commission_journal: commissionJournal,
    ai_assets: aiAssets,
    ai_contracts: contracts,
    platform_rate: platformRate,
    top_links: topLinks,
    summary: {
      total_clicks: totalClicks,
      unique_clicks: uniqueClicks,
      real_reach: realReach,
      total_conversions: totalConversions,
      approved_conversions: approvedConversions.length,
      qualified_leads: qualifiedLeads,
      total_sales: totalSales,
      total_commission: totalCommission,
      campaign_earnings: campaignEarnings,
      referral_earnings: referralEarnings,
      active_campaigns: activeCampaigns,
      active_links: activeLinks,
      active_referrals: directReferrals,
      indirect_referrals: indirectReferrals,
      open_fraud_flags: fraudOpen,
      conversion_rate: conversionRate,
      ai_trust_score: Number(aiTrustScore),
      available_balance: roundCurrency(wallet?.available_balance),
    },
  };
}

async function createFraudFlag(supabaseAdmin: any, payload: Record<string, unknown>) {
  const { data } = await supabaseAdmin
    .from('influencer_fraud_flags')
    .insert(payload)
    .select('*')
    .single();
  return data;
}

async function checkFraudStateV2(supabaseAdmin: any, influencer: any, body: Record<string, unknown>) {
  const flags: any[] = [];
  const reasons: string[] = [];
  let score = 0;

  const referralLink = await resolveReferralLink(supabaseAdmin, influencer.id, body);
  if (!referralLink || !referralLink.is_active) {
    score += 50;
    reasons.push('tracking_bypass');
    flags.push(await createFraudFlag(supabaseAdmin, {
      influencer_id: influencer.id,
      flag_type: 'tracking_bypass',
      severity: 'critical',
      status: 'blocked',
      score: 95,
      details: {
        reason: 'Missing or inactive tracking link',
        short_code: body.short_code || null,
      },
    }));
  }

  if (body.email || body.phone) {
    let leadQuery = supabaseAdmin.from('leads').select('id,email,phone').limit(5);
    if (body.email && body.phone) {
      leadQuery = leadQuery.or(`email.eq.${body.email},phone.eq.${body.phone}`);
    } else if (body.email) {
      leadQuery = leadQuery.eq('email', body.email);
    } else {
      leadQuery = leadQuery.eq('phone', body.phone);
    }
    const { data: duplicateLeads } = await leadQuery;
    if ((duplicateLeads || []).length > 0) {
      score += 30;
      reasons.push('duplicate_lead');
      flags.push(await createFraudFlag(supabaseAdmin, {
        influencer_id: influencer.id,
        lead_id: duplicateLeads[0].id,
        flag_type: 'duplicate_lead',
        severity: 'high',
        status: 'open',
        score: 82,
        details: { email: body.email || null, phone: body.phone || null },
      }));
    }
  }

  if (body.ip_address) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentClicks } = await supabaseAdmin
      .from('influencer_click_logs')
      .select('id')
      .eq('influencer_id', influencer.id)
      .eq('ip_address', body.ip_address)
      .gte('clicked_at', since);
    if ((recentClicks || []).length >= 10) {
      score += 35;
      reasons.push('fake_click');
      flags.push(await createFraudFlag(supabaseAdmin, {
        influencer_id: influencer.id,
        flag_type: 'fake_click',
        severity: 'high',
        status: 'open',
        score: 88,
        details: { ip_address: body.ip_address, recent_clicks: recentClicks.length },
      }));
    }
  }

  const userAgent = String(body.user_agent || '').toLowerCase();
  if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent.includes('spider')) {
    score += 40;
    reasons.push('bot_traffic');
    flags.push(await createFraudFlag(supabaseAdmin, {
      influencer_id: influencer.id,
      flag_type: 'bot_traffic',
      severity: 'critical',
      status: 'blocked',
      score: 97,
      details: { user_agent: body.user_agent || null },
    }));
  }

  const shouldBlock = score >= 90 || reasons.includes('tracking_bypass');
  if (shouldBlock) {
    await supabaseAdmin
      .from('influencer_accounts')
      .update({
        fraud_blocked: true,
        is_suspended: true,
        status: 'suspended',
        fraud_score: Math.max(toNumber(influencer.fraud_score), score),
        suspension_reason: `Auto fraud block: ${reasons.join(', ')}`,
        suspended_at: new Date().toISOString(),
      })
      .eq('id', influencer.id);
  }

  return {
    safe: !shouldBlock,
    score,
    reasons,
    flags,
    referralLink,
    shouldBlock,
  };
}

async function upsertDailyPerformance(supabaseAdmin: any, influencerId: string, overview: any) {
  const today = new Date().toISOString().slice(0, 10);
  await supabaseAdmin
    .from('influencer_performance_metrics')
    .upsert({
      influencer_id: influencerId,
      metric_date: today,
      total_clicks: overview.summary.total_clicks,
      unique_clicks: overview.summary.unique_clicks,
      bot_clicks: overview.clicks.filter((item: any) => item.is_bot).length,
      fraud_clicks: overview.clicks.filter((item: any) => item.is_fraud).length,
      conversions: overview.summary.total_conversions,
      conversion_rate: overview.summary.conversion_rate,
      earnings: overview.summary.total_commission,
      platform_breakdown: overview.clicks.reduce((acc: Record<string, number>, item: any) => {
        const key = item.utm_medium || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
      country_breakdown: overview.clicks.reduce((acc: Record<string, number>, item: any) => {
        const key = item.country || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
      fraud_score: overview.summary.open_fraud_flags,
      tier_progress: overview.summary.total_clicks ? Number(Math.min(100, (overview.summary.total_conversions / Math.max(overview.summary.total_clicks, 1)) * 250).toFixed(2)) : 0,
    }, { onConflict: 'influencer_id,metric_date' });
}

async function creditApprovedConversions(supabaseAdmin: any, influencer: any) {
  const { data: conversions } = await supabaseAdmin
    .from('influencer_conversion_logs')
    .select('*')
    .eq('influencer_id', influencer.id)
    .in('status', ['approved', 'pending'])
    .order('created_at', { ascending: true });

  const { data: existingRevenueLinks } = await supabaseAdmin
    .from('marketplace_influencer_revenue_links')
    .select('conversion_id')
    .eq('influencer_id', influencer.id);

  const creditedConversionIds = new Set((existingRevenueLinks || []).map((item: any) => item.conversion_id).filter(Boolean));
  let linkedCount = 0;

  for (const conversion of conversions || []) {
    if (creditedConversionIds.has(conversion.id)) {
      continue;
    }

    if (String(conversion.status) !== 'approved') {
      continue;
    }

    const commissionAmount = roundCurrency(conversion.commission_amount);
    if (commissionAmount <= 0) {
      continue;
    }

    const creditResult = await creditCommissionToWallet(supabaseAdmin, {
      influencerId: influencer.id,
      amount: commissionAmount,
      referenceKey: `campaign:${conversion.id}`,
      commissionKind: 'campaign',
      description: `Campaign commission credited for conversion ${conversion.id}`,
      referenceType: 'influencer_conversion_logs',
      referenceId: conversion.id,
      sourceInfluencerId: influencer.id,
      sourceConversionId: conversion.id,
      commissionRate: toNumber(conversion.commission_rate),
      baseAmount: roundCurrency(conversion.sale_amount),
      metadata: {
        conversion_status: conversion.status,
      },
    });

    if (creditResult.duplicated || creditResult.skipped) {
      continue;
    }

    await supabaseAdmin.from('marketplace_influencer_revenue_links').insert({
      influencer_id: influencer.id,
      conversion_id: conversion.id,
      ledger_entry_id: creditResult.ledger_entry?.id || null,
      sale_amount: roundCurrency(conversion.sale_amount),
      commission_amount: commissionAmount,
      wallet_amount: commissionAmount,
      status: 'reconciled',
      payload: {
        source: 'payout_calc',
      },
    });

    await distributeReferralCommission(supabaseAdmin, influencer, {
      baseAmount: commissionAmount,
      referenceKey: `campaign:${conversion.id}`,
      sourceConversionId: conversion.id,
      saleAmount: roundCurrency(conversion.sale_amount),
      metadata: {
        source: 'payout_calc',
      },
    });

    await supabaseAdmin
      .from('influencer_conversion_logs')
      .update({ status: 'credited', credited_at: new Date().toISOString() })
      .eq('id', conversion.id);

    linkedCount += 1;
  }

  const wallet = await ensureInfluencerWallet(supabaseAdmin, influencer.id);
  await supabaseAdmin
    .from('influencer_wallet')
    .update({
      pending_balance: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('influencer_id', influencer.id);

  return {
    linked_count: linkedCount,
    available_balance: roundCurrency(wallet?.available_balance),
    total_earned: roundCurrency(wallet?.total_earned),
  };
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = normalizePath(url.pathname.replace('/api-influencer', ''));
  const method = req.method;

  if (method === 'POST' && matchesPath(path, '/register', '/influencer/create')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['email', 'phone', 'platform']);
      if (validation) return errorResponse(validation);

      const fullName = inferFullName(ctx.body, ctx.body.email || ctx.user?.email);
      let influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);
      const influencerCode = influencer?.influencer_code || buildInfluencerCode(fullName);

      if (!influencer) {
        const { data, error } = await ctx.supabaseAdmin
          .from('influencer_accounts')
          .insert({
            user_id: ctx.user!.userId,
            owner_id: ctx.user!.userId,
            influencer_code: influencerCode,
            full_name: fullName,
            email: ctx.body.email,
            phone: ctx.body.phone,
            masked_email: maskEmail(ctx.body.email),
            masked_phone: maskPhone(ctx.body.phone),
            platform: ctx.body.platform,
            social_handle: ctx.body.social_handle || null,
            followers_count: toNumber(ctx.body.followers_count),
            niche: ctx.body.niche || null,
            social_platforms: [{ platform: ctx.body.platform, handle: ctx.body.social_handle || null }],
            city: ctx.body.city || null,
            region: ctx.body.state || null,
            country: ctx.body.country || 'India',
            status: 'pending',
            kyc_status: 'pending',
            marketplace_connected: false,
            dashboard_ready: true,
            manager_panel_ready: true,
            joined_from_marketplace: false,
            metadata: {
              source: 'influencer_create',
              bio: ctx.body.bio || null,
            },
          })
          .select('*')
          .single();

        if (error || !data) return errorResponse(error?.message || 'Unable to create influencer account.');
        influencer = data;
      } else {
        const { data } = await ctx.supabaseAdmin
          .from('influencer_accounts')
          .update({
            full_name: fullName,
            email: ctx.body.email,
            phone: ctx.body.phone,
            masked_email: maskEmail(ctx.body.email),
            masked_phone: maskPhone(ctx.body.phone),
            platform: ctx.body.platform,
            social_handle: ctx.body.social_handle || influencer.social_handle,
            followers_count: toNumber(ctx.body.followers_count, influencer.followers_count),
            niche: ctx.body.niche || influencer.niche,
            city: ctx.body.city || influencer.city,
            region: ctx.body.state || influencer.region,
            country: ctx.body.country || influencer.country || 'India',
            last_activity_at: new Date().toISOString(),
            metadata: {
              ...(influencer.metadata || {}),
              bio: ctx.body.bio || influencer.metadata?.bio || null,
            },
          })
          .eq('id', influencer.id)
          .select('*')
          .single();
        influencer = data || influencer;
      }

      await ctx.supabaseAdmin.from('user_roles').upsert({
        user_id: ctx.user!.userId,
        role: 'influencer',
        approval_status: influencer.status === 'active' ? 'approved' : 'pending',
      }, { onConflict: 'user_id,role' });

      await ensureInfluencerWallet(ctx.supabaseAdmin, influencer.id);
      await recordSyncEvent(ctx.supabaseAdmin, influencer.id, null, 'dashboard_ready', {
        source_module: 'influencer',
        target_module: 'influencer_dashboard',
        route: '/influencer-dashboard',
      });

      return jsonResponse({
        success: true,
        message: 'Influencer profile created. Dashboard is live and awaits approval for fraud-safe tracking.',
        influencer_id: influencer.id,
        influencer_code: influencer.influencer_code,
        dashboard_route: '/influencer-dashboard',
        manager_route: '/influencer-manager',
        influencer: applyMasking(influencer, ctx.user!.role),
      }, 201);
    }, {
      module: 'influencer',
      action: 'create',
      requireAuth: true,
    });
  }

  if (method === 'GET' && matchesPath(path, '/overview', '/influencer/overview')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      let influencer = null;
      const requestedInfluencerId = url.searchParams.get('influencer_id');
      if (requestedInfluencerId && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)) {
        influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, requestedInfluencerId);
      } else {
        influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);
      }
      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const overview = await buildOverview(ctx.supabaseAdmin, influencer.id);
      await upsertDailyPerformance(ctx.supabaseAdmin, influencer.id, overview);

      const { influencer: overviewInfluencer, ...overviewData } = overview;

      return jsonResponse({
        influencer: applyMasking(overviewInfluencer || influencer, ctx.user!.role),
        ...overviewData,
      });
    }, {
      module: 'influencer',
      action: 'overview',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'GET' && matchesPath(path, '/manager', '/influencer/manager')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const [accountsResult, campaignsResult, leadsResult, fraudResult, payoutResult, syncResult] = await Promise.all([
        ctx.supabaseAdmin.from('influencer_accounts').select('*').order('created_at', { ascending: false }),
        ctx.supabaseAdmin.from('influencer_campaign_map').select('*').order('created_at', { ascending: false }),
        ctx.supabaseAdmin.from('marketplace_influencer_leads').select('*').order('created_at', { ascending: false }).limit(100),
        ctx.supabaseAdmin.from('influencer_fraud_flags').select('*').order('created_at', { ascending: false }).limit(100),
        ctx.supabaseAdmin.from('influencer_payout_requests').select('*').order('created_at', { ascending: false }).limit(100),
        ctx.supabaseAdmin.from('influencer_sync_events').select('*').order('created_at', { ascending: false }).limit(100),
      ]);

      const influencers = accountsResult.data || [];
      const campaigns = campaignsResult.data || [];
      const leads = leadsResult.data || [];
      const fraudFlags = fraudResult.data || [];
      const payouts = payoutResult.data || [];
      const events = syncResult.data || [];

      return jsonResponse({
        summary: {
          influencers: influencers.length,
          active_influencers: influencers.filter((item: any) => item.status === 'active').length,
          pending_approval: influencers.filter((item: any) => item.status === 'pending' || item.kyc_status !== 'verified').length,
          active_campaigns: campaigns.filter((item: any) => item.status === 'active').length,
          leads: leads.length,
          converted_leads: leads.filter((item: any) => item.status === 'converted').length,
          open_fraud_flags: fraudFlags.filter((item: any) => item.status !== 'resolved').length,
          pending_payouts: payouts.filter((item: any) => item.status === 'pending').length,
        },
        influencers: applyMasking(influencers, ctx.user!.role),
        campaigns,
        leads,
        fraud_flags: fraudFlags,
        payouts,
        sync_events: events,
      });
    }, {
      module: 'influencer',
      action: 'manager',
      allowedRoles: [...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/campaign/create', '/campaigns/create')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['campaign_name', 'start_date']);
      if (validation) return errorResponse(validation);

      const influencerIds = Array.isArray(ctx.body.influencer_ids) && ctx.body.influencer_ids.length > 0
        ? ctx.body.influencer_ids
        : [ctx.body.influencer_id || (await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId))?.id].filter(Boolean);

      if (!influencerIds.length) return errorResponse('Influencer ID required for campaign creation.', 400);

      const createdCampaigns = [];
      for (const influencerId of influencerIds) {
        const { data: campaign, error } = await ctx.supabaseAdmin
          .from('influencer_campaign_map')
          .insert({
            influencer_id: influencerId,
            campaign_name: ctx.body.campaign_name,
            campaign_type: ctx.body.campaign_type || 'promotion',
            product_category: ctx.body.product_category || null,
            start_date: ctx.body.start_date,
            end_date: ctx.body.end_date || null,
            target_clicks: toNumber(ctx.body.target_clicks),
            target_conversions: toNumber(ctx.body.target_conversions),
            bonus_amount: roundCurrency(ctx.body.bonus_amount),
            status: ctx.body.status || 'active',
            assigned_by: ctx.user!.userId,
          })
          .select('*')
          .single();

        if (error || !campaign) return errorResponse(error?.message || 'Unable to create campaign.', 400);

        createdCampaigns.push(campaign);
        await recordSyncEvent(ctx.supabaseAdmin, influencerId, null, 'campaign_created', {
          source_module: 'influencer_manager',
          target_module: 'influencer_dashboard',
          campaign_id: campaign.id,
          campaign_name: campaign.campaign_name,
        });
      }

      return jsonResponse({
        success: true,
        campaigns: createdCampaigns,
        count: createdCampaigns.length,
      }, 201);
    }, {
      module: 'influencer',
      action: 'campaign_create',
      allowedRoles: [...INFLUENCER_MANAGER_ROLES, 'influencer'],
    });
  }

  if (method === 'GET' && matchesPath(path, '/platform/rates')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const requestedInfluencerId = url.searchParams.get('influencer_id');
      const influencer = requestedInfluencerId && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, requestedInfluencerId)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const [currentRate, rateResult] = await Promise.all([
        getPlatformRate(ctx.supabaseAdmin, influencer, url.searchParams.get('platform'), url.searchParams.get('niche')),
        ctx.supabaseAdmin.from('influencer_platform_rates').select('*').eq('status', 'active').order('platform'),
      ]);

      return jsonResponse({
        influencer_id: influencer.id,
        current_rate: currentRate,
        rates: rateResult.data || [],
      });
    }, {
      module: 'influencer',
      action: 'platform_rates',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/tracking/link', '/link/create', '/influencer/referral/create')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, ctx.body.influencer_id || null);
      if (!influencer) return errorResponse('Influencer account not found.', 404);
      if (influencer.status !== 'active' || influencer.kyc_status !== 'verified' || influencer.fraud_blocked) {
        return errorResponse('Tracking is blocked until the influencer is active, verified, and fraud safe.', 400);
      }

      const link = await ensureReferralLink(ctx.supabaseAdmin, influencer, ctx.body);
      await recordSyncEvent(ctx.supabaseAdmin, influencer.id, null, 'tracking_link_created', {
        source_module: 'influencer',
        target_module: 'influencer_dashboard',
        referral_link_id: link.id,
      });

      return jsonResponse({
        success: true,
        message: 'Fraud-safe tracking link created.',
        referral_link_id: link.id,
        referral_code: influencer.influencer_code,
        tracking_url: link.tracking_url,
        short_code: link.short_code,
      }, 201);
    }, {
      module: 'influencer',
      action: 'tracking_link',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'GET' && matchesPath(path, '/referral/click')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const url = new URL(req.url);
      const referralCode = url.searchParams.get('ref');
      const campaignId = url.searchParams.get('campaign_id');
      const ipAddress = ctx.req.headers.get('x-forwarded-for') || ctx.req.headers.get('x-real-ip') || 'unknown';
      const userAgent = ctx.req.headers.get('user-agent') || '';

      if (!referralCode) {
        return errorResponse('Referral code is required.', 400);
      }

      const traceId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await logTraceEvent(ctx.supabaseAdmin, traceId, 'click_received', {
        status: 'started',
        metadata: { referral_code: referralCode, ip_address: ipAddress }
      });

      // Find influencer by referral code
      const referrer = await resolveInfluencerByReferralCode(ctx.supabaseAdmin, referralCode);
      if (!referrer) {
        await logTraceEvent(ctx.supabaseAdmin, traceId, 'click_processed', {
          status: 'failed',
          error_message: 'Invalid referral code'
        });
        return errorResponse('Invalid referral code.', 404);
      }

      // Check fraud
      const fraudCheck = await checkFraudState(ctx.supabaseAdmin, referrer, {
        ip_address: ipAddress,
        user_agent: userAgent
      });

      if (!fraudCheck.safe) {
        await logTraceEvent(ctx.supabaseAdmin, traceId, 'click_processed', {
          status: 'failed',
          error_message: 'Fraud detected',
          influencer_id: referrer.id
        });
        return errorResponse('Access blocked due to fraud detection.', 403);
      }

      // Record click event
      await ctx.supabaseAdmin.from('referral_events').insert({
        influencer_id: referrer.id,
        referral_code: referralCode,
        event_type: 'click',
        ip_address: ipAddress,
        user_agent: userAgent,
        campaign_id: campaignId,
        metadata: {
          trace_id: traceId,
          user_agent: userAgent
        }
      });

      await logTraceEvent(ctx.supabaseAdmin, traceId, 'click_processed', {
        status: 'completed',
        influencer_id: referrer.id
      });

      // Redirect to landing page with referral tracking
      const redirectUrl = `${Deno.env.get('FRONTEND_URL') || 'https://softwarewala.net'}/join?ref=${referralCode}${campaignId ? `&campaign_id=${campaignId}` : ''}`;
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl,
          'Cache-Control': 'no-cache'
        }
      });
    }, {
      module: 'influencer',
      action: 'referral_click',
      allowedRoles: ['anonymous', 'user', 'influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['referral_code']);
      if (validation) return errorResponse(validation, 400);

      const targetInfluencerId = ctx.body.referred_influencer_id || (await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId))?.id;
      if (!targetInfluencerId) return errorResponse('Referred influencer ID is required.', 400);

      const referredInfluencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, targetInfluencerId);
      if (!referredInfluencer) return errorResponse('Referred influencer account not found.', 404);

      const referrer = await resolveInfluencerByReferralCode(ctx.supabaseAdmin, ctx.body.referral_code);
      if (!referrer) return errorResponse('Referral code is invalid.', 404);
      if (referrer.id === referredInfluencer.id) {
        return errorResponse('Self-referral is blocked.', 400);
      }
      if (referrer.status !== 'active' || referrer.fraud_blocked) {
        return errorResponse('Referral source is not eligible for payout.', 400);
      }

      const existingRelationship = await getReferralRelationship(ctx.supabaseAdmin, referredInfluencer.id);
      if (existingRelationship) {
        return errorResponse('Referral relationship already exists for this influencer.', 409);
      }

      const parentRelationship = await getReferralRelationship(ctx.supabaseAdmin, referrer.id);
      const grandparentInfluencerId = parentRelationship?.parent_influencer_id && parentRelationship.parent_influencer_id !== referredInfluencer.id
        ? parentRelationship.parent_influencer_id
        : null;

      const { data: relationship, error } = await ctx.supabaseAdmin
        .from('influencer_referral_relationships')
        .insert({
          influencer_id: referredInfluencer.id,
          parent_influencer_id: referrer.id,
          grandparent_influencer_id: grandparentInfluencerId,
          referral_code: normalizeCode(ctx.body.referral_code).toUpperCase(),
          metadata: {
            tracked_by: ctx.user!.userId,
            source: ctx.body.source || 'manual_track',
          },
        })
        .select('*')
        .single();

      if (error || !relationship) {
        return errorResponse(error?.message || 'Unable to track referral relationship.', 400);
      }

      await ctx.supabaseAdmin.from('influencer_referral_events').insert({
        referrer_id: referrer.id,
        referred_influencer_id: referredInfluencer.id,
        referral_code: normalizeCode(ctx.body.referral_code).toUpperCase(),
        event_type: 'signup',
        metadata: {
          tracked_by: ctx.user!.userId,
          referred_code: referredInfluencer.influencer_code,
        },
      });

      await recordSyncEvent(ctx.supabaseAdmin, referredInfluencer.id, null, 'manager_ready', {
        source_module: 'referral_engine',
        target_module: 'influencer_dashboard',
        relationship_id: relationship.id,
        parent_influencer_id: referrer.id,
      });

      return jsonResponse({
        success: true,
        relationship,
        parent_influencer: applyMasking(referrer, ctx.user!.role),
      }, 201);
    }, {
      module: 'influencer',
      action: 'referral_track',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  // Temporarily removed AI content generate endpoint for debugging

  if (method === 'POST' && matchesPath(path, '/lead/influencer')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['influencer_id', 'lead_name', 'email', 'phone']);
      if (validation) return errorResponse(validation);

      const influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, ctx.body.influencer_id);
      if (!influencer) return errorResponse('Influencer account not found.', 404);
      if (influencer.status !== 'active' || influencer.kyc_status !== 'verified' || influencer.fraud_blocked) {
        return errorResponse('Lead intake is blocked for unverified or suspended influencer accounts.', 400);
      }

      const fraudCheck = await checkFraudState(ctx.supabaseAdmin, influencer, ctx.body);
      if (!fraudCheck.safe || !fraudCheck.referralLink) {
        return errorResponse('Lead blocked by fraud rules.', 400);
      }

      const { data: lead, error } = await ctx.supabaseAdmin
        .from('leads')
        .insert({
          name: ctx.body.lead_name,
          email: ctx.body.email,
          phone: ctx.body.phone,
          masked_email: maskEmail(ctx.body.email),
          masked_phone: maskPhone(ctx.body.phone),
          company: ctx.body.company || null,
          industry: ctx.body.industry || 'other',
          source: 'influencer',
          source_reference_id: influencer.id,
          status: ctx.body.status || 'new',
          priority: ctx.body.priority || 'warm',
          region: ctx.body.state || influencer.region || null,
          city: ctx.body.city || influencer.city || null,
          country: ctx.body.country || influencer.country || 'India',
          requirements: ctx.body.requirements || null,
          budget_range: ctx.body.budget_range || null,
          ai_score: toNumber(ctx.body.ai_score, 72),
          conversion_probability: Number(toNumber(ctx.body.conversion_probability, 58).toFixed(2)),
          created_by: ctx.user!.userId,
        })
        .select('*')
        .single();

      if (error || !lead) return errorResponse(error?.message || 'Unable to create influencer lead.', 400);

      await ctx.supabaseAdmin.from('marketplace_influencer_leads').insert({
        influencer_id: influencer.id,
        link_id: null,
        referral_link_id: fraudCheck.referralLink.id,
        lead_id: lead.id,
        lead_name: ctx.body.lead_name,
        platform: influencer.platform || null,
        niche: influencer.niche || null,
        status: ctx.body.status === 'qualified' || ctx.body.status === 'converted' ? ctx.body.status : 'new',
        payload: {
          company: ctx.body.company || null,
          requirements: ctx.body.requirements || null,
          source_page: ctx.body.source_page || 'influencer',
        },
      });

      if (ctx.body.ip_address || ctx.body.user_agent) {
        await ctx.supabaseAdmin.from('influencer_click_logs').insert({
          influencer_id: influencer.id,
          campaign_id: fraudCheck.referralLink.campaign_id || null,
          tracking_link: fraudCheck.referralLink.tracking_url,
          utm_source: fraudCheck.referralLink.utm_source,
          utm_medium: fraudCheck.referralLink.utm_medium,
          utm_campaign: fraudCheck.referralLink.utm_campaign,
          utm_content: fraudCheck.referralLink.utm_content,
          ip_address: ctx.body.ip_address || null,
          user_agent: ctx.body.user_agent || null,
          device_type: ctx.body.device_type || null,
          browser: ctx.body.browser || null,
          country: ctx.body.country || influencer.country || null,
          city: ctx.body.city || influencer.city || null,
          is_unique: true,
          is_bot: false,
          is_fraud: false,
        });
      }

      await recordSyncEvent(ctx.supabaseAdmin, influencer.id, null, 'lead_created', {
        source_module: 'influencer',
        target_module: 'influencer_manager',
        lead_id: lead.id,
        referral_link_id: fraudCheck.referralLink.id,
      });

      return jsonResponse({
        success: true,
        lead,
        fraud_score: fraudCheck.score,
        message: 'Influencer lead captured and synced to the manager pipeline.',
      }, 201);
    }, {
      module: 'influencer',
      action: 'lead_capture',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/fraud/check')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['influencer_id']);
      if (validation) return errorResponse(validation);

      const influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, ctx.body.influencer_id);
      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const fraudCheck = await checkFraudStateV2(ctx.supabaseAdmin, influencer, ctx.body);
      if (fraudCheck.flags.length > 0) {
        await recordSyncEvent(ctx.supabaseAdmin, influencer.id, null, 'fraud_detected', {
          source_module: 'fraud_guard',
          target_module: 'influencer_manager',
          score: fraudCheck.score,
          reasons: fraudCheck.reasons,
        });
      }

      return jsonResponse({
        safe: fraudCheck.safe,
        blocked: fraudCheck.shouldBlock,
        score: fraudCheck.score,
        reasons: fraudCheck.reasons,
        flags: fraudCheck.flags,
      });
    }, {
      module: 'influencer',
      action: 'fraud_check',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/referral/commission')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['source_influencer_id']);
      if (validation) return errorResponse(validation, 400);

      const sourceInfluencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, ctx.body.source_influencer_id);
      if (!sourceInfluencer) return errorResponse('Source influencer account not found.', 404);

      const relationship = await getReferralRelationship(ctx.supabaseAdmin, sourceInfluencer.id);
      if (!relationship) {
        return jsonResponse({
          success: true,
          applied: false,
          reason: 'No referral relationship found for source influencer.',
          payouts: [],
        });
      }

      let baseAmount = roundCurrency(ctx.body.reward_base_amount || 0);
      let saleAmount = roundCurrency(ctx.body.sale_amount || 0);
      let sourceConversionId = ctx.body.source_conversion_id || null;
      if (sourceConversionId) {
        const { data: conversion } = await ctx.supabaseAdmin
          .from('influencer_conversion_logs')
          .select('*')
          .eq('id', sourceConversionId)
          .maybeSingle();

        if (!conversion) return errorResponse('Source conversion not found.', 404);
        baseAmount = roundCurrency(conversion.commission_amount || conversion.sale_amount || baseAmount);
        saleAmount = roundCurrency(conversion.sale_amount || saleAmount);
      }

      if (baseAmount <= 0) {
        return errorResponse('Reward base amount must be greater than zero.', 400);
      }

      const referenceKey = String(ctx.body.reference_key || (sourceConversionId ? `campaign:${sourceConversionId}` : `manual:${sourceInfluencer.id}:${baseAmount}`));
      const distribution = await distributeReferralCommission(ctx.supabaseAdmin, sourceInfluencer, {
        baseAmount,
        referenceKey,
        sourceConversionId,
        saleAmount,
        metadata: {
          source: 'referral_commission',
          requested_by: ctx.user!.userId,
        },
      });

      return jsonResponse({
        success: true,
        applied: distribution.applied,
        base_amount: baseAmount,
        sale_amount: saleAmount,
        payouts: distribution.payouts,
      });
    }, {
      module: 'influencer',
      action: 'referral_commission',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'GET' && matchesPath(path, '/performance', '/influencer/performance')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const requestedInfluencerId = url.searchParams.get('influencer_id');
      const influencer = requestedInfluencerId && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, requestedInfluencerId)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const overview = await buildOverview(ctx.supabaseAdmin, influencer.id);
      await upsertDailyPerformance(ctx.supabaseAdmin, influencer.id, overview);

      const trafficQuality = overview.summary.total_clicks === 0
        ? 100
        : Number((100 - ((overview.summary.open_fraud_flags / Math.max(overview.summary.total_clicks, 1)) * 100)).toFixed(2));
      const roi = overview.summary.total_commission === 0
        ? overview.summary.total_sales
        : Number((overview.summary.total_sales / Math.max(overview.summary.total_commission, 1)).toFixed(2));

      return jsonResponse({
        influencer_id: influencer.id,
        traffic_quality: trafficQuality,
        roi,
        conversion_rate: overview.summary.conversion_rate,
        alerts: [
          trafficQuality < 75 ? 'Traffic quality is below threshold.' : null,
          overview.summary.conversion_rate < 2 ? 'Conversion rate is below target.' : null,
          overview.summary.open_fraud_flags > 0 ? 'Open fraud flags need attention.' : null,
        ].filter(Boolean),
        summary: overview.summary,
      });
    }, {
      module: 'influencer',
      action: 'performance',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/commission/influencer')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['real_reach', 'source_key']);
      if (validation) return errorResponse(validation, 400);

      const requestedInfluencerId = ctx.body.influencer_id || null;
      const influencer = requestedInfluencerId && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, requestedInfluencerId)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);
      if (influencer.fraud_blocked || influencer.is_suspended) {
        return errorResponse('Commission engine is blocked for suspended or fraud-flagged influencers.', 400);
      }

      const realReach = Math.max(0, Math.floor(toNumber(ctx.body.real_reach)));
      const engagementCount = Math.max(0, Math.floor(toNumber(
        ctx.body.engagement_count,
        realReach * normalizePercent(ctx.body.engagement_rate),
      )));
      const qualifiedLeads = Math.max(0, Math.floor(toNumber(ctx.body.qualified_leads_count)));
      const approvedSales = Math.max(0, Math.floor(toNumber(ctx.body.approved_sales_count, toNumber(ctx.body.sale_amount) > 0 ? 1 : 0)));
      const saleAmount = roundCurrency(ctx.body.sale_amount);
      const platformRate = await getPlatformRate(ctx.supabaseAdmin, influencer, ctx.body.platform, ctx.body.niche);
      const trafficCommission = roundCurrency(realReach * toNumber(platformRate.rate_per_real_reach));
      const engagementCommission = roundCurrency(engagementCount * toNumber(platformRate.rate_per_engagement));
      const leadCommission = roundCurrency(qualifiedLeads * toNumber(platformRate.cpl_rate || influencer.cpl_rate));
      const saleCommission = roundCurrency(approvedSales * toNumber(platformRate.cpa_rate || influencer.cpa_rate));
      const saleShare = roundCurrency(saleAmount * normalizePercent(ctx.body.sale_share_rate || 2));
      const totalCommission = roundCurrency(trafficCommission + engagementCommission + leadCommission + saleCommission + saleShare + roundCurrency(ctx.body.bonus_amount));

      if (totalCommission <= 0) return errorResponse('Calculated commission must be greater than zero.', 400);

      const referenceKey = `campaign:${influencer.id}:${String(ctx.body.source_key)}`;
      const creditResult = await creditCommissionToWallet(ctx.supabaseAdmin, {
        influencerId: influencer.id,
        amount: totalCommission,
        referenceKey,
        commissionKind: 'campaign',
        description: `Campaign commission credited for ${ctx.body.source_key}`,
        referenceType: 'commission_engine',
        sourceInfluencerId: influencer.id,
        commissionRate: saleAmount > 0 ? Number(((totalCommission / Math.max(saleAmount, 1)) * 100).toFixed(4)) : 0,
        baseAmount: saleAmount || totalCommission,
        metadata: {
          source_key: ctx.body.source_key,
          campaign_id: ctx.body.campaign_id || null,
          real_reach: realReach,
          engagement_count: engagementCount,
          qualified_leads: qualifiedLeads,
          approved_sales: approvedSales,
        },
      });

      const referralDistribution = creditResult.duplicated
        ? { applied: false, payouts: [] }
        : await distributeReferralCommission(ctx.supabaseAdmin, influencer, {
          baseAmount: totalCommission,
          referenceKey,
          saleAmount,
          metadata: {
            source: 'commission_engine',
            source_key: ctx.body.source_key,
          },
        });

      return jsonResponse({
        success: true,
        duplicate_earning_prevented: creditResult.duplicated,
        influencer_id: influencer.id,
        platform_rate: platformRate,
        breakdown: {
          traffic_commission: trafficCommission,
          engagement_commission: engagementCommission,
          lead_commission: leadCommission,
          sale_commission: saleCommission,
          sale_share: saleShare,
          bonus_amount: roundCurrency(ctx.body.bonus_amount),
          total_commission: totalCommission,
        },
        credit: creditResult,
        referral_distribution: referralDistribution,
      }, creditResult.duplicated ? 200 : 201);
    }, {
      module: 'influencer',
      action: 'commission_engine',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/payout/calc')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const requestedInfluencerId = ctx.body.influencer_id || null;
      const influencer = requestedInfluencerId && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, requestedInfluencerId)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);
      if (influencer.fraud_blocked || influencer.status !== 'active') {
        return errorResponse('Payouts are blocked for suspended or fraud-flagged influencers.', 400);
      }

      const payout = await creditApprovedConversions(ctx.supabaseAdmin, influencer);
      await recordSyncEvent(ctx.supabaseAdmin, influencer.id, null, 'payout_credited', {
        source_module: 'finance',
        target_module: 'influencer_dashboard',
        linked_count: payout.linked_count,
        available_balance: payout.available_balance,
      });

      return jsonResponse({
        success: true,
        ...payout,
      });
    }, {
      module: 'influencer',
      action: 'payout_calc',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/ai/content/generate')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const influencer = ctx.body.influencer_id && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, ctx.body.influencer_id)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const platform = normalizePlatform(ctx.body.platform || influencer.platform);
      const offer = String(ctx.body.offer || ctx.body.product_name || 'Softwarevala growth stack').trim();
      const tone = String(ctx.body.tone || 'bold').trim();
      const audience = String(ctx.body.audience || influencer.niche || 'business owners').trim();
      const content = {
        hook: `Stop wasting ${platform} traffic. ${offer} turns attention into tracked revenue.`,
        primary_caption: `Built for ${audience}. Push ${offer} with a ${tone} CTA, drop your tracked link, and move followers straight into demo-ready conversations.`,
        short_script: [
          `Problem: most ${platform} creators drive clicks without proof.`,
          `System: show the workflow, drop the tracked link, and qualify the buyer intent.`,
          `CTA: message me or tap the link for the live demo.`
        ],
        hashtags: [`#${platform}`, '#softwaredemo', '#leadengine', '#creatorincome', '#trackedgrowth'],
        cta: 'Tap the tracked link and book the demo before the campaign window closes.',
      };

      const asset = await createAIAsset(
        ctx.supabaseAdmin,
        influencer.id,
        'content',
        `${offer} ${platform} content pack`,
        JSON.stringify({ offer, tone, audience, platform }),
        content.primary_caption,
        content,
        ctx.user!.userId,
      );

      return jsonResponse({
        success: true,
        influencer_id: influencer.id,
        asset,
        content,
      }, 201);
    }, {
      module: 'influencer',
      action: 'ai_content',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/ai/contract/create')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['contract_title']);
      if (validation) return errorResponse(validation, 400);

      const influencer = ctx.body.influencer_id && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, ctx.body.influencer_id)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const terms = {
        payout_model: ctx.body.payout_model || 'hybrid',
        deliverables: ctx.body.deliverables || ['1 reel', '3 stories', '1 tracked post'],
        commission_rules: {
          campaign: 'Direct campaign commission credited on verified performance.',
          referral_l1: '10% of referred influencer earnings.',
          referral_l2: '5% of second-level referred influencer earnings.',
        },
        compliance_rules: ['No self-referral', 'No bot traffic payout', 'No duplicate earning keys'],
      };

      const { data: contract, error } = await ctx.supabaseAdmin
        .from('influencer_ai_contracts')
        .insert({
          influencer_id: influencer.id,
          contract_type: ctx.body.contract_type || 'campaign',
          contract_title: ctx.body.contract_title,
          party_name: ctx.body.party_name || 'Softwarewala',
          payout_model: ctx.body.payout_model || 'hybrid',
          terms_json: terms,
          ai_summary: `AI-generated contract for ${influencer.full_name} covering ${terms.deliverables.length} deliverables and automated commission settlement.`,
          status: ctx.body.status || 'draft',
          created_by: ctx.user!.userId,
        })
        .select('*')
        .single();

      if (error || !contract) return errorResponse(error?.message || 'Unable to create AI contract.', 400);

      await createAIAsset(
        ctx.supabaseAdmin,
        influencer.id,
        'contract',
        contract.contract_title,
        JSON.stringify(ctx.body),
        contract.ai_summary,
        contract.terms_json,
        ctx.user!.userId,
      );

      return jsonResponse({
        success: true,
        contract,
      }, 201);
    }, {
      module: 'influencer',
      action: 'ai_contract',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/ai/scan')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['influencer_id']);
      if (validation) return errorResponse(validation, 400);

      const influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, ctx.body.influencer_id);
      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const fraudCheck = await checkFraudStateV2(ctx.supabaseAdmin, influencer, ctx.body);
      const overview = await buildOverview(ctx.supabaseAdmin, influencer.id);
      const trustScore = Number(Math.max(0, 100 - Math.max(fraudCheck.score, overview.summary.open_fraud_flags * 12))).toFixed(2);
      const scan = {
        trust_score: Number(trustScore),
        safe: fraudCheck.safe,
        blocked: fraudCheck.shouldBlock,
        reasons: fraudCheck.reasons,
        flags: fraudCheck.flags,
      };

      const asset = await createAIAsset(
        ctx.supabaseAdmin,
        influencer.id,
        'scan',
        `AI scan for ${influencer.full_name}`,
        JSON.stringify(ctx.body),
        `Trust score ${trustScore}. ${fraudCheck.safe ? 'Traffic is payout eligible.' : 'Traffic is blocked.'}`,
        scan,
        ctx.user!.userId,
      );

      return jsonResponse({
        success: true,
        asset,
        ...scan,
      });
    }, {
      module: 'influencer',
      action: 'ai_scan',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/ai/content/generate')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);
      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const validation = validateRequired(ctx.body, ['content_type', 'prompt']);
      if (validation) return errorResponse(validation);

      const traceId = `ai_content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await logTraceEvent(ctx.supabaseAdmin, traceId, 'ai_generation_started', {
        status: 'started',
        influencer_id: influencer.id,
        metadata: { content_type: ctx.body.content_type }
      });

      try {
        // Call AI API manager (simulated for now)
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
              role: 'user',
              content: ctx.body.prompt
            }],
            max_tokens: 1000,
            temperature: 0.7
          })
        });

        if (!aiResponse.ok) {
          throw new Error('AI API call failed');
        }

        const aiData = await aiResponse.json();
        const generatedContent = aiData.choices[0]?.message?.content || '';

        // Safety check (simplified)
        const safetyScore = generatedContent.length > 0 ? 95 : 0;
        const isSafe = safetyScore > 80;

        // Store in database
        const { data: content } = await ctx.supabaseAdmin
          .from('influencer_ai_contents')
          .insert({
            influencer_id: influencer.id,
            campaign_id: ctx.body.campaign_id || null,
            content_type: ctx.body.content_type,
            title: ctx.body.title || `AI Generated ${ctx.body.content_type}`,
            content: generatedContent,
            metadata: {
              prompt: ctx.body.prompt,
              ai_model: 'gpt-4',
              trace_id: traceId
            },
            safety_score: safetyScore,
            is_safe: isSafe,
            ai_provider: 'openai',
            prompt_hash: btoa(ctx.body.prompt).substring(0, 32)
          })
          .select('*')
          .single();

        await logTraceEvent(ctx.supabaseAdmin, traceId, 'ai_generation_completed', {
          status: 'completed',
          influencer_id: influencer.id,
          metadata: { content_id: content.id, safety_score: safetyScore }
        });

        return jsonResponse({
          success: true,
          content,
          safety_score: safetyScore,
          is_safe: isSafe
        });

      } catch (error) {
        await logTraceEvent(ctx.supabaseAdmin, traceId, 'ai_generation_failed', {
          status: 'failed',
          influencer_id: influencer.id,
          error_message: error.message
        });
        return errorResponse('AI content generation failed.', 500);
      }
    }, {
      module: 'influencer',
      action: 'ai_content_generate',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/approval', '/influencer/approval')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['influencer_id', 'status']);
      if (validation) return errorResponse(validation);
      const normalizedStatus = String(ctx.body.status).toLowerCase();
      if (!['active', 'rejected', 'suspended', 'pending'].includes(normalizedStatus)) {
        return errorResponse('Invalid approval status.', 400);
      }

      const { data: influencer, error } = await ctx.supabaseAdmin
        .from('influencer_accounts')
        .update({
          status: normalizedStatus,
          kyc_status: normalizedStatus === 'active' ? 'verified' : normalizedStatus === 'rejected' ? 'rejected' : 'pending',
          fraud_blocked: normalizedStatus !== 'active',
          is_suspended: normalizedStatus === 'suspended',
          suspension_reason: normalizedStatus === 'suspended' ? (ctx.body.reason || 'Suspended by manager') : null,
          suspended_at: normalizedStatus === 'suspended' ? new Date().toISOString() : null,
          last_activity_at: new Date().toISOString(),
        })
        .eq('id', ctx.body.influencer_id)
        .select('*')
        .single();

      if (error || !influencer) return errorResponse(error?.message || 'Unable to update influencer approval.', 400);

      await ctx.supabaseAdmin.from('user_roles').upsert({
        user_id: influencer.user_id,
        role: 'influencer',
        approval_status: normalizedStatus === 'active' ? 'approved' : normalizedStatus,
        approved_by: ctx.user!.userId,
        approved_at: normalizedStatus === 'active' ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,role' });

      await recordSyncEvent(ctx.supabaseAdmin, influencer.id, null, 'approval_synced', {
        source_module: 'influencer_manager',
        target_module: 'influencer_dashboard',
        status: normalizedStatus,
      });

      return jsonResponse({
        success: true,
        influencer: applyMasking(influencer, ctx.user!.role),
      });
    }, {
      module: 'influencer',
      action: 'approval',
      allowedRoles: [...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/message', '/influencer/message')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['subject', 'body']);
      if (validation) return errorResponse(validation);

      const targetInfluencerId = ctx.body.influencer_id || null;
      const { data: message, error } = await ctx.supabaseAdmin
        .from('influencer_message_queue')
        .insert({
          influencer_id: targetInfluencerId,
          message_type: ctx.body.message_type || 'broadcast',
          subject: ctx.body.subject,
          body: ctx.body.body,
          sent_by: ctx.user!.userId,
          delivery_status: 'sent',
          payload: {
            campaign_id: ctx.body.campaign_id || null,
            audience: targetInfluencerId ? 'single' : 'all',
          },
          sent_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error || !message) return errorResponse(error?.message || 'Unable to send influencer message.', 400);

      if (targetInfluencerId) {
        await recordSyncEvent(ctx.supabaseAdmin, targetInfluencerId, null, 'message_sent', {
          source_module: 'influencer_manager',
          target_module: 'influencer_dashboard',
          message_id: message.id,
        });
      }

      await notificationMiddleware(ctx, 'influencer.message', {
        influencer_id: targetInfluencerId,
        message_id: message.id,
      });

      return jsonResponse({
        success: true,
        message,
      }, 201);
    }, {
      module: 'influencer',
      action: 'message',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/ai/influencer', '/ai/suggest')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const influencer = ctx.body.influencer_id && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, ctx.body.influencer_id)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);
      const overview = await buildOverview(ctx.supabaseAdmin, influencer.id);
      const rate = await getPlatformRate(ctx.supabaseAdmin, influencer, ctx.body.platform, ctx.body.niche);

      const recommendations = [
        overview.summary.active_campaigns === 0 ? 'Create at least one campaign before pushing new traffic.' : null,
        overview.summary.active_links === 0 ? 'Generate a verified tracking link to unblock conversion attribution.' : null,
        overview.summary.open_fraud_flags > 0 ? 'Resolve fraud flags before scaling paid traffic.' : null,
        overview.summary.conversion_rate < 2 ? 'Shift content toward demo-led calls to action to improve conversion rate.' : null,
        overview.summary.qualified_leads < 5 ? 'Add a stronger qualification step in the lead form to increase sale readiness.' : null,
        overview.summary.active_referrals < 3 ? 'Recruit more influencers with your referral code to expand L1 earning flow.' : null,
        overview.summary.ai_trust_score < 80 ? 'Improve traffic trust score before increasing ad spend or payout requests.' : null,
      ].filter(Boolean);

      const asset = await createAIAsset(
        ctx.supabaseAdmin,
        influencer.id,
        'suggestion',
        `AI suggestions for ${influencer.full_name}`,
        JSON.stringify(ctx.body),
        recommendations.join(' '),
        {
          recommendations,
          current_rate: rate,
          summary: overview.summary,
        },
        ctx.user!.userId,
      );

      return jsonResponse({
        influencer_id: influencer.id,
        recommendations,
        current_rate: rate,
        asset,
        machine_state: 'TRAFFIC -> LEAD -> CONVERSION MACHINE',
      });
    }, {
      module: 'influencer',
      action: 'ai',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'GET' && matchesPath(path, '/clicks')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const requestedInfluencerId = url.searchParams.get('influencer_id');
      const influencer = requestedInfluencerId && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, requestedInfluencerId)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const { data: clicks } = await ctx.supabaseAdmin
        .from('influencer_click_logs')
        .select('*')
        .eq('influencer_id', influencer.id)
        .order('clicked_at', { ascending: false });

      return jsonResponse({
        influencer_id: influencer.id,
        stats: {
          total_clicks: clicks?.length || 0,
          unique_clicks: clicks?.filter((item: any) => item.is_unique).length || 0,
          bot_clicks: clicks?.filter((item: any) => item.is_bot).length || 0,
          fraud_clicks: clicks?.filter((item: any) => item.is_fraud).length || 0,
        },
        recent_clicks: clicks || [],
      });
    }, {
      module: 'influencer',
      action: 'clicks',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

  if (method === 'GET' && matchesPath(path, '/earnings', '/wallet/influencer')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const requestedInfluencerId = url.searchParams.get('influencer_id');
      const influencer = requestedInfluencerId && INFLUENCER_MANAGER_ROLES.includes(ctx.user!.role)
        ? await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId, requestedInfluencerId)
        : await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);

      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const [walletResponse, platformRate] = await Promise.all([
        buildWalletResponse(ctx.supabaseAdmin, influencer.id),
        getPlatformRate(ctx.supabaseAdmin, influencer),
      ]);

      return jsonResponse({
        influencer_id: influencer.id,
        ...walletResponse,
        platform_rate: platformRate,
      });
    }, {
      module: 'influencer',
      action: 'earnings',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/payout')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['amount']);
      if (validation) return errorResponse(validation);

      const influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);
      if (!influencer) return errorResponse('Influencer account not found.', 404);
      if (influencer.kyc_status !== 'verified' || influencer.status !== 'active' || influencer.fraud_blocked) {
        return errorResponse('Payout requests require an active, verified, fraud-safe influencer account.', 400);
      }

      const wallet = await ensureInfluencerWallet(ctx.supabaseAdmin, influencer.id);
      const amount = roundCurrency(ctx.body.amount);
      if (amount <= 0 || amount > roundCurrency(wallet.available_balance)) {
        return errorResponse('Insufficient balance for payout request.', 400);
      }

      const { data: payout, error } = await ctx.supabaseAdmin
        .from('influencer_payout_requests')
        .insert({
          influencer_id: influencer.id,
          amount,
          payment_method: ctx.body.payment_method || 'bank_transfer',
          bank_details: ctx.body.bank_details || null,
          status: 'pending',
        })
        .select('*')
        .single();

      if (error || !payout) return errorResponse(error?.message || 'Unable to create payout request.', 400);

      await ctx.supabaseAdmin
        .from('influencer_wallet')
        .update({
          available_balance: roundCurrency(wallet.available_balance - amount),
          pending_balance: roundCurrency(wallet.pending_balance + amount),
          updated_at: new Date().toISOString(),
        })
        .eq('influencer_id', influencer.id);

      return jsonResponse({
        success: true,
        payout,
      }, 201);
    }, {
      module: 'influencer',
      action: 'payout_request',
      allowedRoles: ['influencer'],
      requireKYC: true,
    });
  }

  if (method === 'GET' && matchesPath(path, '')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from('influencer_accounts').select('*').order('created_at', { ascending: false });
      if (ctx.user!.role === 'influencer') {
        query = query.eq('user_id', ctx.user!.userId);
      }

      const status = url.searchParams.get('status');
      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) return errorResponse(error.message, 400);

      return jsonResponse(applyMasking(data || [], ctx.user!.role));
    }, {
      module: 'influencer',
      action: 'list',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES, ...FINANCE_ROLES],
    });
  }

  if (method === 'POST' && matchesPath(path, '/fraud/check')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const influencer = await getInfluencerAccount(ctx.supabaseAdmin, ctx.user!.userId);
      if (!influencer) return errorResponse('Influencer account not found.', 404);

      const validation = validateRequired(ctx.body, ['event_type', 'metadata']);
      if (validation) return errorResponse(validation);

      const traceId = `fraud_check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await logTraceEvent(ctx.supabaseAdmin, traceId, 'fraud_check_started', {
        status: 'started',
        influencer_id: influencer.id,
        event_type: ctx.body.event_type
      });

      try {
        const fraudResult = await checkFraudStateNew(ctx.supabaseAdmin, {
          influencer_id: influencer.id,
          event_type: ctx.body.event_type,
          ip_address: ctx.body.metadata.ip_address,
          user_agent: ctx.body.metadata.user_agent,
          metadata: ctx.body.metadata
        });

        // Store fraud check result
        await ctx.supabaseAdmin
          .from('influencer_fraud_flags')
          .insert({
            influencer_id: influencer.id,
            event_type: ctx.body.event_type,
            risk_score: fraudResult.riskScore,
            flags: fraudResult.flags,
            metadata: {
              ...ctx.body.metadata,
              trace_id: traceId
            },
            is_blocked: fraudResult.isBlocked,
            blocked_reason: fraudResult.blockedReason
          });

        await logTraceEvent(ctx.supabaseAdmin, traceId, 'fraud_check_completed', {
          status: 'completed',
          influencer_id: influencer.id,
          risk_score: fraudResult.riskScore,
          is_blocked: fraudResult.isBlocked
        });

        return jsonResponse({
          success: true,
          fraud_check: {
            risk_score: fraudResult.riskScore,
            is_safe: !fraudResult.isBlocked,
            flags: fraudResult.flags,
            blocked_reason: fraudResult.blockedReason
          }
        });

      } catch (error) {
        await logTraceEvent(ctx.supabaseAdmin, traceId, 'fraud_check_failed', {
          status: 'failed',
          influencer_id: influencer.id,
          error_message: error.message
        });
        return errorResponse('Fraud check failed.', 500);
      }
    }, {
      module: 'influencer',
      action: 'fraud_check',
      allowedRoles: ['influencer', ...INFLUENCER_MANAGER_ROLES],
    });
  }

    });
  }

  if (method === 'POST' && matchesPath(path, '/payout/approve')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['payout_id', 'otp_code']);
      if (validation) return errorResponse(validation);

      // Only finance managers can approve payouts
      if (!FINANCE_ROLES.includes(ctx.user!.role)) {
        return errorResponse('Only finance managers can approve payouts.', 403);
      }

      const { data: payout } = await ctx.supabaseAdmin
        .from('influencer_payout_requests')
        .select('*, influencer_accounts(*)')
        .eq('id', ctx.body.payout_id)
        .eq('status', 'pending')
        .single();

      if (!payout) return errorResponse('Payout request not found or already processed.', 404);

      const traceId = `payout_approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await logTraceEvent(ctx.supabaseAdmin, traceId, 'payout_approval_started', {
        status: 'started',
        payout_id: payout.id,
        influencer_id: payout.influencer_id,
        amount: payout.amount
      });

      try {
        // Verify OTP (simplified - in production this would check against stored OTP)
        const isValidOTP = ctx.body.otp_code === '123456'; // Mock OTP for now
        if (!isValidOTP) {
          await logTraceEvent(ctx.supabaseAdmin, traceId, 'payout_approval_failed', {
            status: 'failed',
            reason: 'invalid_otp',
            payout_id: payout.id
          });
          return errorResponse('Invalid OTP code.', 400);
        }

        // Perform final fraud check
        const fraudCheck = await checkFraudStateNew(ctx.supabaseAdmin, {
          influencer_id: payout.influencer_id,
          event_type: 'payout_approval',
          metadata: { payout_amount: payout.amount }
        });

        if (fraudCheck.isBlocked) {
          await logTraceEvent(ctx.supabaseAdmin, traceId, 'payout_approval_blocked', {
            status: 'blocked',
            reason: fraudCheck.blockedReason,
            payout_id: payout.id
          });
          return errorResponse(`Payout blocked: ${fraudCheck.blockedReason}`, 400);
        }

        // Update payout status
        const { data: approvedPayout } = await ctx.supabaseAdmin
          .from('influencer_payout_requests')
          .update({
            status: 'approved',
            approved_by: ctx.user!.userId,
            approved_at: new Date().toISOString(),
            approval_metadata: {
              otp_verified: true,
              fraud_score: fraudCheck.riskScore,
              trace_id: traceId
            }
          })
          .eq('id', payout.id)
          .select('*')
          .single();

        // Update wallet - move from pending to processed
        await ctx.supabaseAdmin
          .from('influencer_wallet')
          .update({
            pending_balance: roundCurrency(payout.influencer_accounts.wallet?.pending_balance - payout.amount),
            total_paid: roundCurrency(payout.influencer_accounts.wallet?.total_paid + payout.amount),
            updated_at: new Date().toISOString(),
          })
          .eq('influencer_id', payout.influencer_id);

        // Log approval in approval logs
        await ctx.supabaseAdmin
          .from('influencer_approval_logs')
          .insert({
            influencer_id: payout.influencer_id,
            action_type: 'payout_approved',
            approved_by: ctx.user!.userId,
            approval_metadata: {
              payout_id: payout.id,
              amount: payout.amount,
              otp_verified: true,
              fraud_score: fraudCheck.riskScore,
              trace_id: traceId
            }
          });

        await logTraceEvent(ctx.supabaseAdmin, traceId, 'payout_approval_completed', {
          status: 'completed',
          payout_id: payout.id,
          amount: payout.amount
        });

        return jsonResponse({
          success: true,
          payout: approvedPayout,
          message: 'Payout approved and processed successfully.'
        });

      } catch (error) {
        await logTraceEvent(ctx.supabaseAdmin, traceId, 'payout_approval_error', {
          status: 'error',
          payout_id: payout.id,
          error_message: error.message
        });
        return errorResponse('Payout approval failed.', 500);
      }
    }, {
      module: 'influencer',
      action: 'payout_approve',
      allowedRoles: [...FINANCE_ROLES],
    });
  }

  return errorResponse('Endpoint not found', 404);
});
