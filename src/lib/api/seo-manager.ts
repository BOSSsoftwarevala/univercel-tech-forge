import { callEdgeRoute } from '@/lib/api/edge-client';

export interface SEOKeyword {
  id: string;
  keyword: string;
  current_rank: number | null;
  search_volume: number;
  cpc: number;
  difficulty_score: number;
  intent: string;
  country_code: string | null;
  language_code: string;
  cluster_name: string | null;
  status: string;
  created_at: string;
}

export interface SEOBlog {
  id: string;
  keyword_id: string | null;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  content_markdown: string;
  seo_score: number;
  readability_score: number;
  publish_status: string;
  published_url: string | null;
  language_code: string;
  country_code: string | null;
  indexed_at: string | null;
  created_at: string;
}

export interface SEOLandingPage {
  id: string;
  keyword_id: string | null;
  page_slug: string;
  title: string;
  hero_title: string;
  hero_subtitle: string | null;
  seo_score: number;
  conversion_score: number;
  publish_status: string;
  published_url: string | null;
  preview_token: string | null;
  created_at: string;
}

export interface SEOTechnicalIssue {
  id: string;
  issue_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affected_url: string | null;
  auto_fixable: boolean;
  status: string;
  created_at: string;
}

export interface SEOAISuggestion {
  id: string;
  keyword_id: string | null;
  blog_id: string | null;
  landing_page_id: string | null;
  suggestion_type: string;
  title: string;
  suggestion: string;
  reasoning: string | null;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  status: 'new' | 'reviewed' | 'applied' | 'dismissed';
  auto_executed: boolean;
  created_at: string;
}

export interface SEOBacklink {
  id: string;
  source_url: string;
  source_domain: string;
  target_url: string;
  anchor_text: string;
  domain_authority: number;
  spam_score: number;
  status: string;
  outreach_status: string;
  disavow_suggested: boolean;
  created_at: string;
}

export interface SEOAuditLog {
  id: string;
  actor_user_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface SEODashboardData {
  settings: Record<string, unknown> | null;
  summary: {
    overallSeoScore: number;
    technicalScore: number;
    backlinkHealth: number;
    totalTraffic: number;
    avgPosition: number;
    indexedPages: number;
    crawlErrors: number;
    organicLeads: number;
    publishedBlogs: number;
    publishedLandingPages: number;
  };
  keywords: SEOKeyword[];
  blogs: SEOBlog[];
  landingPages: SEOLandingPage[];
  technicalIssues: SEOTechnicalIssue[];
  backlinks: SEOBacklink[];
  aiSuggestions: SEOAISuggestion[];
  audits: Array<Record<string, unknown>>;
  auditLogs: SEOAuditLog[];
  rankHistory: Array<Record<string, unknown>>;
}

export interface AIContentRequest {
  type: 'blog' | 'landing' | 'email' | 'social' | 'ad';
  keywords: string[];
  instructions?: string;
  language: string;
  country: string;
}

export const seoManagerApi = {
  async getDashboard() {
    const response = await callEdgeRoute<SEODashboardData>('api-seo-manager', 'dashboard');
    return response.data;
  },

  async generateKeywords(input: { niche: string; country: string; language: string }) {
    const response = await callEdgeRoute<{ keywords: SEOKeyword[] }>('api-seo-manager', 'seo/keyword/research', {
      method: 'POST',
      body: input,
    });
    return response.data.keywords;
  },

  async createBlog(input: { keyword_id?: string; keyword?: string; country?: string; language?: string; instructions?: string }) {
    const response = await callEdgeRoute<{ blog: SEOBlog }>('api-seo-manager', 'seo/blog/create', {
      method: 'POST',
      body: input,
    });
    return response.data.blog;
  },

  async createLandingPage(input: { keyword_id?: string; keyword?: string; country?: string; language?: string; instructions?: string }) {
    const response = await callEdgeRoute<{ page: SEOLandingPage }>('api-seo-manager', 'seo/page/create', {
      method: 'POST',
      body: input,
    });
    return response.data.page;
  },

  async updateMeta(input: { page_path: string; title?: string; description?: string; og_title?: string; og_description?: string; schema_type?: string }) {
    const response = await callEdgeRoute<{ meta: Record<string, unknown> }>('api-seo-manager', 'seo/meta/update', {
      method: 'POST',
      body: input,
    });
    return response.data.meta;
  },

  async updateSuggestionStatus(suggestion_id: string, status: SEOAISuggestion['status']) {
    const response = await callEdgeRoute<{ suggestion: SEOAISuggestion }>('api-seo-manager', 'seo/ai/suggestion/status', {
      method: 'POST',
      body: { suggestion_id, status },
    });
    return response.data.suggestion;
  },

  async runTechnicalAudit(url: string) {
    const response = await callEdgeRoute<{ issues: SEOTechnicalIssue[] }>('api-seo-manager', 'seo/technical/audit', {
      method: 'POST',
      body: { url },
    });
    return response.data.issues;
  },

  async createBacklink(input: { target_url: string; anchor_text: string; source_domain?: string; source_url?: string; blog_id?: string; landing_page_id?: string }) {
    const response = await callEdgeRoute<{ backlink: SEOBacklink }>('api-seo-manager', 'seo/backlink/create', {
      method: 'POST',
      body: input,
    });
    return response.data.backlink;
  },

  async generateContent(input: AIContentRequest) {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'ai/content/generate', {
      method: 'POST',
      body: input,
    });
    return response.data;
  },

  async optimizeContent(input: AIContentRequest) {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'seo/optimize', {
      method: 'POST',
      body: input,
    });
    return response.data;
  },

  async translateContent(input: AIContentRequest & { content: string; content_type?: string; content_id?: string; title?: string }) {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'ai/translate/seo', {
      method: 'POST',
      body: input,
    });
    return response.data;
  },

  async publishContent(input: { content_type: 'blog' | 'landing'; content_id: string; url?: string }) {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'content/publish', {
      method: 'POST',
      body: input,
    });
    return response.data;
  },

  async distributeSocial(input: { content: string; title?: string; platform?: string; hashtags?: string[]; publish_now?: boolean }) {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'social/post', {
      method: 'POST',
      body: input,
    });
    return response.data;
  },

  async sendEmail(input: { recipient: string; subject?: string; message?: string }) {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'email/send', {
      method: 'POST',
      body: input,
    });
    return response.data;
  },

  async createAd(input: { name: string; keyword: string; platform?: string; budget?: number; daily_budget?: number }) {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'ads/create', {
      method: 'POST',
      body: input,
    });
    return response.data;
  },

  async getContentAnalytics() {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'content/analytics');
    return response.data;
  },

  async improveContent(input: { content_type: string; content_id: string }) {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'ai/content/optimize', {
      method: 'POST',
      body: input,
    });
    return response.data;
  },

  async runDailyAutomation() {
    const response = await callEdgeRoute<Record<string, unknown>>('api-seo-manager', 'automation/run-daily', {
      method: 'POST',
      body: {},
    });
    return response.data;
  },
};