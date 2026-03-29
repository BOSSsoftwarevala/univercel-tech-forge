import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const response = await callEdgeRoute<T>('api-influencer', path, { query });
  return response.data;
}

async function postRoute<T>(path: string, body: Record<string, unknown>) {
  const response = await callEdgeRoute<T>('api-influencer', path, { method: 'POST', body });
  return response.data;
}

export interface InfluencerOverviewSummary {
  total_clicks: number;
  unique_clicks: number;
  real_reach: number;
  total_conversions: number;
  approved_conversions: number;
  qualified_leads: number;
  total_sales: number;
  total_commission: number;
  campaign_earnings: number;
  referral_earnings: number;
  active_campaigns: number;
  active_links: number;
  active_referrals: number;
  indirect_referrals: number;
  open_fraud_flags: number;
  conversion_rate: number;
  ai_trust_score: number;
  available_balance: number;
}

export interface InfluencerTopLink {
  id: string;
  short_code: string;
  tracking_url: string;
  campaign_id: string | null;
  campaign_name: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

export interface InfluencerPlatformRate {
  platform: string;
  niche?: string | null;
  currency: string;
  rate_per_real_reach: number;
  rate_per_engagement: number;
  cpc_rate: number;
  cpl_rate: number;
  cpa_rate: number;
  metadata?: Record<string, unknown>;
}

export interface InfluencerOverviewResponse {
  influencer: Record<string, unknown>;
  wallet: {
    available_balance: number;
    pending_balance: number;
    total_earned: number;
    total_withdrawn: number;
    total_penalties: number;
    last_payout_at?: string | null;
  } | null;
  summary: InfluencerOverviewSummary;
  top_links: InfluencerTopLink[];
  platform_rate: InfluencerPlatformRate;
  commission_journal: Array<Record<string, unknown>>;
  ai_assets: Array<Record<string, unknown>>;
  ai_contracts: Array<Record<string, unknown>>;
}

export interface InfluencerWalletLedgerItem {
  id: string;
  transaction_type: string;
  amount: number;
  balance_after: number;
  reference_type?: string | null;
  reference_id?: string | null;
  description?: string | null;
  status: string;
  created_at: string;
}

export interface InfluencerWalletResponse {
  influencer_id: string;
  wallet: {
    available_balance: number;
    pending_balance: number;
    total_earned: number;
    total_withdrawn: number;
    total_penalties: number;
    last_payout_at?: string | null;
  } | null;
  ledger: InfluencerWalletLedgerItem[];
  payouts: Array<Record<string, unknown>>;
  commission_journal: Array<Record<string, unknown>>;
  breakdown: {
    referral_earnings: number;
    campaign_earnings: number;
    bonus_earnings: number;
    pending_payout_total: number;
    last_payout_at?: string | null;
  };
  platform_rate: InfluencerPlatformRate;
}

export const influencerApi = {
  async getOverview() {
    return getRoute<InfluencerOverviewResponse>('overview');
  },

  async getWallet() {
    return getRoute<InfluencerWalletResponse>('wallet/influencer');
  },

  async getSuggestions() {
    return postRoute<{
      influencer_id: string;
      recommendations: string[];
      current_rate: InfluencerPlatformRate;
      machine_state: string;
    }>('ai/suggest', {});
  },

  async requestPayout(body: {
    amount: number;
    payment_method?: string;
    bank_details?: Record<string, unknown>;
  }) {
    return postRoute<{ success: boolean; payout: Record<string, unknown> }>('payout', body);
  },
};