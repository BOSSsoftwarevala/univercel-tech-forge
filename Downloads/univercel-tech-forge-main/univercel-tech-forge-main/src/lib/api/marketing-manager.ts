import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string) {
  const response = await callEdgeRoute<T>('api-marketing-manager', path);
  return response.data;
}

async function mutateRoute<T>(path: string, body: Record<string, unknown>, method: 'POST' | 'PUT' = 'POST') {
  const response = await callEdgeRoute<T>('api-marketing-manager', path, {
    method,
    body,
  });
  return response.data;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: string;
  budget: number;
  spent: number;
  revenue: number;
  leads_generated: number;
  conversion_rate: number;
  clicks: number;
  impressions: number;
  conversions: number;
  status: string;
  approval_status: string;
  automation_status: string;
  ai_health_score: number;
  created_at: string;
  start_date?: string | null;
  end_date?: string | null;
  metadata?: Record<string, unknown>;
}

export interface MarketingChannelMetric {
  channel: string;
  activeCampaigns: number;
  spend: number;
  revenue: number;
  leads: number;
  conversions: number;
  ctr: number;
  roi: number;
}

export interface MarketingLeadBreakdown {
  source: string;
  total: number;
  hot: number;
  warm: number;
  cold: number;
}

export interface MarketingLeadAttributionEntry {
  id: string;
  lead_id: string;
  source_channel: string;
  source_platform?: string | null;
  score_label: 'hot' | 'warm' | 'cold';
  score_value: number;
  country_code?: string | null;
  region?: string | null;
  created_at: string;
  lead?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    status: string;
    priority: string;
    country?: string | null;
    city?: string | null;
    ai_score?: number | null;
    conversion_probability?: number | null;
    created_at: string;
  } | null;
}

export interface MarketingCostResultPoint {
  label: string;
  spend: number;
  revenue: number;
  roi: number;
}

export interface MarketingSocialPost {
  id: string;
  platform: string;
  title: string | null;
  content: string;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
}

export interface MarketingRegionalCampaign {
  id: string;
  campaign_id: string | null;
  region_type: 'continent' | 'country' | 'city' | 'language' | 'festival';
  region_value: string;
  language_code?: string | null;
  budget_override: number;
  status: string;
  starts_at?: string | null;
  ends_at?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface MarketingInfluencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  niche?: string | null;
  category?: string | null;
  country?: string | null;
  fake_follower_score: number;
  influencer_score: number;
  payout_status: string;
  verified?: boolean;
  fraud_notes?: string | null;
}

export interface MarketingPrivacyLog {
  id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  masked_fields: string[];
  privacy_status: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MarketingAIInsight {
  id: string;
  campaign_id: string | null;
  insight_type: string;
  title: string;
  suggestion: string;
  reasoning?: string | null;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  status: 'new' | 'reviewed' | 'applied' | 'dismissed';
  auto_executed: boolean;
  created_at: string;
}

export interface MarketingContentQueueItem {
  id: string;
  campaign_id: string | null;
  content_type: string;
  title: string;
  body: string;
  version: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'scheduled';
  ai_generated: boolean;
  created_at: string;
}

export interface MarketingAuditLog {
  id: string;
  campaign_id: string | null;
  actor_user_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface MarketingComplianceCheck {
  id: string;
  campaign_id: string | null;
  policy_name: string;
  status: 'passed' | 'warning' | 'failed';
  details: string | null;
  created_at: string;
}

export interface MarketingDashboardData {
  settings: Record<string, unknown> | null;
  summary: {
    activeCampaigns: number;
    totalCampaigns: number;
    adSpend: number;
    revenue: number;
    roi: number;
    reach: number;
    leadsToday: number;
    conversionRate: number;
    activeChannels: number;
    pendingApprovals: number;
    automationRunsHealthy: boolean;
  };
  campaigns: MarketingCampaign[];
  channels: MarketingChannelMetric[];
  aiInsights: MarketingAIInsight[];
  contentQueue: MarketingContentQueueItem[];
  alerts: Array<Record<string, unknown>>;
  approvals: Array<Record<string, unknown>>;
  auditLogs: MarketingAuditLog[];
  reports: Array<Record<string, unknown>>;
  latestReport: Record<string, unknown> | null;
  compliance: {
    score: number;
    checks: MarketingComplianceCheck[];
    restrictedWords: string[];
    warnings: number;
    failures: number;
  };
}

export interface CreateMarketingCampaignInput {
  name: string;
  channel: string;
  budget: number;
  objective: string;
  platform?: string;
  channels?: string[];
  targetAudience?: Record<string, unknown>;
  niche?: string;
  cta?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateMarketingCampaignInput extends Partial<CreateMarketingCampaignInput> {
  campaign_id: string;
  status?: string;
  approval_status?: string;
  creatives?: unknown[];
}

export const marketingManagerApi = {
  async getDashboard() {
    return getRoute<MarketingDashboardData>('dashboard');
  },

  async getCampaigns() {
    const data = await getRoute<{ campaigns: MarketingCampaign[] }>('campaigns');
    return data.campaigns;
  },

  async createCampaign(input: CreateMarketingCampaignInput) {
    const data = await mutateRoute<{ campaign: MarketingCampaign }>('campaign/create', input);
    return data.campaign;
  },

  async updateCampaignStatus(campaign_id: string, status: string) {
    const data = await mutateRoute<{ campaign: MarketingCampaign }>('ads/campaign/status', { campaign_id, status });
    return data.campaign;
  },

  async updateCampaign(input: UpdateMarketingCampaignInput) {
    const data = await mutateRoute<{ campaign: MarketingCampaign }>('campaign/update', input, 'PUT');
    return data.campaign;
  },

  async toggleCampaign(campaign_id: string) {
    const data = await mutateRoute<{ campaign: MarketingCampaign }>('campaign/toggle', { campaign_id });
    return data.campaign;
  },

  async getCampaignPerformance(campaign_id?: string) {
    const path = campaign_id ? `campaign/performance?campaign_id=${encodeURIComponent(campaign_id)}` : 'campaign/performance';
    return getRoute<{ campaigns: Array<MarketingCampaign & { roi: number; pacing: number }> }>(path);
  },

  async updateInsightStatus(insight_id: string, status: MarketingAIInsight['status']) {
    const data = await mutateRoute<{ insight: MarketingAIInsight }>('ai/insight/status', { insight_id, status });
    return data.insight;
  },

  async updateContentStatus(content_id: string, status: MarketingContentQueueItem['status']) {
    const data = await mutateRoute<{ content: MarketingContentQueueItem }>('content/status', { content_id, status });
    return data.content;
  },

  async runAutomation() {
    return mutateRoute<{
      adjustedCampaigns: string[];
      alertsCreated: number;
      insightsCreated: number;
    }>('automation/run-hourly', {});
  },

  async analyzeMarketing() {
    return mutateRoute<{ created: number }>('ai/marketing/analyze', {});
  },

  async getLiveCampaignStatus() {
    return getRoute<{ campaigns: Array<MarketingCampaign & { roi: number }> }>('campaigns/live-status');
  },

  async getActiveChannels() {
    return getRoute<{ channels: MarketingChannelMetric[] }>('channels/active');
  },

  async getLeadsToday() {
    return getRoute<{ total_leads: number; breakdown: MarketingLeadBreakdown[] }>('leads/today');
  },

  async getCostResult() {
    return getRoute<{ spend: number; revenue: number; roi: number; points: MarketingCostResultPoint[] }>('analytics/cost-result');
  },

  async getConversionAnalytics() {
    return getRoute<{ clicks: number; conversions: number; leads: number; conversion: number }>('analytics/conversion');
  },

  async getAdsPlatform(platform: 'google' | 'meta' | 'youtube' | 'display') {
    return getRoute<{
      platform: string;
      campaigns: MarketingCampaign[];
      summary: { spend: number; revenue: number; clicks: number; conversions: number; leads: number; roi: number };
    }>(`ads/${platform}`);
  },

  async budgetControl(campaign_id: string, direction?: 'increase' | 'decrease') {
    return mutateRoute<{
      campaign: MarketingCampaign;
      roi: number;
      previousBudget: number;
      nextBudget: number;
      direction: string;
    }>('ads/budget-control', { campaign_id, direction });
  },

  async getSocialPlatform(platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok') {
    return getRoute<{ platform: string; posts: MarketingSocialPost[]; summary: { total: number; published: number; scheduled: number } }>(`social/${platform}`);
  },

  async scheduleSocialPost(input: Record<string, unknown>) {
    return mutateRoute<{ post: MarketingSocialPost }>('social/schedule', input);
  },

  async getLeadSource(source: 'website' | 'facebook' | 'google' | 'whatsapp' | 'referral' | 'marketplace') {
    return getRoute<{ source: string; leads: MarketingLeadAttributionEntry[]; total: number }>(`leads/${source}`);
  },

  async routeByCountry(body: Record<string, unknown>) {
    return mutateRoute<{ lead: Record<string, unknown>; routing: Record<string, unknown> }>('routing/country', body);
  },

  async routeToFranchise(body: Record<string, unknown>) {
    return mutateRoute<{ lead: Record<string, unknown>; routing: Record<string, unknown> }>('routing/franchise', body);
  },

  async routeToReseller(body: Record<string, unknown>) {
    return mutateRoute<{ lead: Record<string, unknown>; routing: Record<string, unknown> }>('routing/reseller', body);
  },

  async scoreLead(body: Record<string, unknown>) {
    return mutateRoute<{ lead: Record<string, unknown>; score: number; label: string; probability: number }>('ai/lead-score', body);
  },

  async assignLeadPriority(body: Record<string, unknown>) {
    return mutateRoute<{ lead: Record<string, unknown>; queue: string; scheduled_at: string }>('routing/priority', body);
  },

  async createRegionalCampaign(regionType: 'continent' | 'country' | 'city' | 'language' | 'festival', body: Record<string, unknown>) {
    return mutateRoute<{ regionalCampaign: MarketingRegionalCampaign }>(`region/${regionType}`, body);
  },

  async getInfluencers() {
    return getRoute<{ influencers: MarketingInfluencer[] }>('influencers/list');
  },

  async syncInfluencers(body: Record<string, unknown>) {
    return mutateRoute<{ influencers: MarketingInfluencer[] }>('influencers/sync', body);
  },

  async assignInfluencer(body: Record<string, unknown>) {
    return mutateRoute<{ assignment: Record<string, unknown> }>('influencers/assign', body);
  },

  async getInfluencerPerformance() {
    return getRoute<{ influencerCampaigns: Array<Record<string, unknown>> }>('influencers/performance');
  },

  async fraudCheckInfluencer(body: Record<string, unknown>) {
    return mutateRoute<{ influencer: MarketingInfluencer; suspicious_score: number; flagged: boolean }>('influencers/fraud-check', body);
  },

  async influencerPayout(body: Record<string, unknown>) {
    return mutateRoute<{ payout: Record<string, unknown>; influencer: MarketingInfluencer; base_amount: number; payout_amount: number }>('influencers/payout', body);
  },

  async createTemplate(body: Record<string, unknown>) {
    return mutateRoute<{ template: Record<string, unknown> }>('template/create', body);
  },

  async sendMarketingMessage(body: Record<string, unknown>) {
    return mutateRoute<{ delivery: Record<string, unknown> }>('marketing/send', body);
  },

  async getMarketingDeliveryAnalytics() {
    return mutateRoute<{ analytics: Array<Record<string, unknown>> }>('marketing/analytics', {});
  },

  async runFollowup(body: Record<string, unknown>) {
    return mutateRoute<{ sent: number; logs: Array<Record<string, unknown>> }>('automation/followup', body);
  },

  async runRetarget(body: Record<string, unknown>) {
    return mutateRoute<{ queued: boolean }>('automation/retarget', body);
  },

  async runBudgetAutomation(body: Record<string, unknown>) {
    return mutateRoute<{ campaign: MarketingCampaign; roi: number; previousBudget: number; nextBudget: number; direction: string }>('automation/budget', body);
  },

  async getAISuggestions(body: Record<string, unknown>) {
    return mutateRoute<{ suggestion: Record<string, unknown> }>('ai/suggestions', body);
  },

  async getTrafficAnalytics() {
    return getRoute<{ events: Array<Record<string, unknown>> }>('analytics/traffic');
  },

  async getFunnelAnalytics() {
    return getRoute<{ funnel: Record<string, number> }>('analytics/funnel');
  },

  async getChannelComparison() {
    return getRoute<{ channels: MarketingChannelMetric[] }>('analytics/channel');
  },

  async exportAnalytics() {
    return getRoute<{ format: string; csv: string; rows: Array<Record<string, unknown>> }>('analytics/export');
  },

  async createBudgetAlert(body: Record<string, unknown>) {
    return mutateRoute<{ alert: Record<string, unknown> }>('alerts/budget', body);
  },

  async createPerformanceAlert(body: Record<string, unknown>) {
    return mutateRoute<{ alert: Record<string, unknown> }>('alerts/performance', body);
  },

  async getMarketingLogs() {
    return getRoute<{ auditLogs: MarketingAuditLog[] }>('logs/marketing');
  },

  async getComplianceCheck() {
    return getRoute<{ checks: MarketingComplianceCheck[]; templates: Array<Record<string, unknown>>; campaigns: Array<Record<string, unknown>>; restrictedWords: string[] }>('compliance/check');
  },

  async getPrivacyLogs() {
    return getRoute<{ privacyLogs: MarketingPrivacyLog[] }>('logs/privacy');
  },
};