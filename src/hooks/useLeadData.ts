/**
 * LEAD DATA HOOK - Enterprise Lead Manager
 * Connects to leads, lead_assignments, lead_conversions, lead_alerts tables
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type LeadStatusType = 'new' | 'assigned' | 'contacted' | 'follow_up' | 'qualified' | 'negotiation' | 'closed_won' | 'closed_lost';
export type LeadSourceType = 'website' | 'demo' | 'influencer' | 'reseller' | 'referral' | 'social' | 'direct' | 'other';
export type LeadPriority = 'hot' | 'warm' | 'cold';
export type LeadIndustry = 'retail' | 'healthcare' | 'finance' | 'education' | 'real_estate' | 'manufacturing' | 'hospitality' | 'logistics' | 'technology' | 'other';

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  masked_email: string | null;
  masked_phone: string | null;
  company: string | null;
  source: LeadSourceType;
  status: LeadStatusType;
  priority: LeadPriority | null;
  industry: LeadIndustry | null;
  ai_score: number | null;
  conversion_probability: number | null;
  assigned_to: string | null;
  assigned_role: string | null;
  assigned_at: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  budget_range: string | null;
  requirements: string | null;
  is_duplicate: boolean | null;
  duplicate_of: string | null;
  last_contact_at: string | null;
  next_follow_up: string | null;
  closed_at: string | null;
  closed_reason: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  source_reference_id: string | null;
}

// ─── Leads CRUD ───
export const useLeads = (filters?: { status?: LeadStatusType; source?: LeadSourceType; priority?: LeadPriority }) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.source) query = query.eq('source', filters.source);
      if (filters?.priority) query = query.eq('priority', filters.priority);
      const { data, error } = await query;
      if (error) throw error;
      return data as LeadRow[];
    },
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: ['lead-stats'],
    queryFn: async () => {
      const { data: leads, error } = await supabase.from('leads').select('status, source, priority, ai_score, conversion_probability, country, created_at');
      if (error) throw error;

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const total = leads?.length || 0;
      const byStatus: Record<string, number> = {};
      const bySource: Record<string, number> = {};
      const byPriority: Record<string, number> = {};
      const byCountry: Record<string, number> = {};
      let todayCount = 0;

      leads?.forEach((l: any) => {
        byStatus[l.status] = (byStatus[l.status] || 0) + 1;
        bySource[l.source] = (bySource[l.source] || 0) + 1;
        if (l.priority) byPriority[l.priority] = (byPriority[l.priority] || 0) + 1;
        if (l.country) byCountry[l.country] = (byCountry[l.country] || 0) + 1;
        if (l.created_at >= todayStart) todayCount++;
      });

      const won = byStatus['closed_won'] || 0;
      const lost = byStatus['closed_lost'] || 0;
      const conversionRate = total > 0 ? ((won / total) * 100).toFixed(1) : '0';

      return { total, todayCount, byStatus, bySource, byPriority, byCountry, conversionRate, won, lost };
    },
  });
};

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lead: { name: string; email: string; phone: string; source?: LeadSourceType; priority?: LeadPriority; company?: string; country?: string; city?: string; requirements?: string }) => {
      const { data, error } = await supabase.from('leads').insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source || 'direct',
        priority: lead.priority || 'warm',
        company: lead.company,
        country: lead.country,
        city: lead.city,
        requirements: lead.requirements,
        masked_email: lead.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
        masked_phone: lead.phone.replace(/(.{3})(.*)(.{2})/, '$1****$3'),
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead created successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create lead'),
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { data, error } = await supabase.from('leads').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead updated');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update lead'),
  });
};

// ─── Lead Assignments ───
export const useLeadAssignments = () => {
  return useQuery({
    queryKey: ['lead-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('lead_assignments').select('*').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });
};

// ─── Lead Conversions ───
export const useLeadConversions = () => {
  return useQuery({
    queryKey: ['lead-conversions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('lead_conversions').select('*').order('timestamp', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });
};

// ─── Lead Alerts ───
export const useLeadAlerts = () => {
  return useQuery({
    queryKey: ['lead-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('lead_alerts').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });
};

// ─── Pipeline Data ───
export const useLeadPipeline = () => {
  return useQuery({
    queryKey: ['lead-pipeline'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leads').select('id, name, company, status, priority, ai_score, conversion_probability, source, created_at, budget_range').order('created_at', { ascending: false });
      if (error) throw error;

      const stages: Record<LeadStatusType, any[]> = {
        new: [], assigned: [], contacted: [], follow_up: [],
        qualified: [], negotiation: [], closed_won: [], closed_lost: [],
      };

      (data || []).forEach((lead: any) => {
        if (stages[lead.status as LeadStatusType]) {
          stages[lead.status as LeadStatusType].push(lead);
        }
      });

      return stages;
    },
  });
};

// ─── AI Scoring via Edge Function ───
export const useAILeadAction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ action, leadId, data }: { action: 'score' | 'qualify' | 'suggest_followup'; leadId?: string; data?: any }) => {
      const { data: result, error } = await supabase.functions.invoke('ai-lead-automation', {
        body: { action, lead_id: leadId, data },
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead-stats'] });
    },
    onError: (err: any) => toast.error(err.message || 'AI action failed'),
  });
};
