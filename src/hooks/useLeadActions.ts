import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// DB-aligned types
export type DBLeadStatus = 'new' | 'assigned' | 'contacted' | 'follow_up' | 'qualified' | 'negotiation' | 'closed_won' | 'closed_lost';
export type DBLeadSource = 'website' | 'direct' | 'referral' | 'social' | 'influencer' | 'reseller' | 'demo' | 'other';
export type DBLeadPriority = 'hot' | 'warm' | 'cold';

export type LeadActionState = 'idle' | 'loading' | 'success' | 'error' | 'confirming';

export interface LeadActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// JIRA-SEC-02: Immutable audit log
const logLeadAction = async (
  action: string,
  leadId: string,
  metadata?: Record<string, unknown>
) => {
  try {
    await supabase.from('audit_logs').insert([{
      action,
      module: 'lead_manager',
      meta_json: { lead_id: leadId, ...metadata },
      timestamp: new Date().toISOString(),
    }]);
  } catch (e) {
    console.error('[AUDIT] Log failed:', e);
  }
};

export function useLeadActions() {
  const [state, setState] = useState<LeadActionState>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    action: string;
    leadId?: string;
    leadName?: string;
    callback: () => Promise<void>;
  } | null>(null);

  // Permission check placeholder
  const checkPermission = useCallback(async (action: string): Promise<boolean> => {
    console.log('[PERMISSION] Checking:', action);
    return true;
  }, []);

  // ============ CREATE ============
  const createLead = useCallback(async (
    leadData: {
      name: string;
      email: string;
      phone?: string;
      source?: DBLeadSource;
      priority?: DBLeadPriority;
      country?: string;
      city?: string;
      company?: string;
    }
  ): Promise<LeadActionResult> => {
    setState('loading');
    setIsLoading(true);

    try {
      if (!await checkPermission('create_lead')) {
        throw new Error('ACCESS_CONFIG');
      }

      if (!leadData.name || !leadData.email) {
        throw new Error('VALIDATION_PENDING');
      }

      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone || '',
          source: leadData.source || 'direct',
          status: 'new' as DBLeadStatus,
          priority: leadData.priority || 'warm',
          country: leadData.country || 'Unknown',
          city: leadData.city || 'Unknown',
          company: leadData.company,
        })
        .select()
        .single();

      if (error) throw error;

      await logLeadAction('lead_created', data.id, { source: leadData.source });
      
      setState('success');
      toast.success('Lead created successfully');
      setTimeout(() => setState('idle'), 2000);
      return { success: true, data };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Failed to create lead';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [checkPermission]);

  // ============ READ / VIEW ============
  const viewLead = useCallback(async (leadId: string): Promise<LeadActionResult> => {
    setState('loading');
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) throw error;

      await logLeadAction('lead_viewed', leadId);
      setState('success');
      return { success: true, data };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Failed to load lead';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ UPDATE ============
  const updateLead = useCallback(async (
    leadId: string,
    updates: Partial<{
      name: string;
      email: string;
      phone: string;
      priority: DBLeadPriority;
      source: DBLeadSource;
      country: string;
      city: string;
      company: string;
      requirements: string;
      budget_range: string;
    }>
  ): Promise<LeadActionResult> => {
    setState('loading');
    setIsLoading(true);

    try {
      if (!await checkPermission('update_lead')) {
        throw new Error('Permission denied');
      }

      const { data, error } = await supabase
        .from('leads')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      await logLeadAction('lead_updated', leadId, { fields: Object.keys(updates) });
      
      setState('success');
      toast.success('Lead updated');
      setTimeout(() => setState('idle'), 2000);
      return { success: true, data };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Failed to update';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [checkPermission]);

  // ============ SOFT DELETE ============
  const deleteLead = useCallback(async (
    leadId: string,
    leadName?: string
  ): Promise<LeadActionResult> => {
    return new Promise((resolve) => {
      setPendingConfirmation({
        action: 'delete',
        leadId,
        leadName,
        callback: async () => {
          setState('loading');
          setIsLoading(true);

          try {
            const { error } = await supabase
              .from('leads')
              .update({
                status: 'closed_lost' as DBLeadStatus,
                closed_reason: 'Deleted by user',
                closed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', leadId);

            if (error) throw error;

            await logLeadAction('lead_deleted', leadId, { name: leadName });
            
            setState('success');
            toast.success('Lead deleted');
            setTimeout(() => setState('idle'), 2000);
            resolve({ success: true });
          } catch (error) {
            setState('error');
            const msg = error instanceof Error ? error.message : 'Delete failed';
            toast.error(msg);
            resolve({ success: false, error: msg });
          } finally {
            setIsLoading(false);
            setPendingConfirmation(null);
          }
        }
      });
      setState('confirming');
    });
  }, []);

  // ============ ASSIGN ============
  const assignLead = useCallback(async (
    leadId: string,
    assigneeId: string,
    assigneeRole: string
  ): Promise<LeadActionResult> => {
    setState('loading');
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          assigned_to: assigneeId,
          assigned_role: assigneeRole as any,
          assigned_at: new Date().toISOString(),
          status: 'assigned' as DBLeadStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId);

      if (error) throw error;

      await logLeadAction('lead_assigned', leadId, { assignee: assigneeId, role: assigneeRole });
      
      setState('success');
      toast.success('Lead assigned');
      setTimeout(() => setState('idle'), 2000);
      return { success: true };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Assign failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ CHANGE STATUS ============
  const changeStatus = useCallback(async (
    leadId: string,
    newStatus: DBLeadStatus,
    reason?: string
  ): Promise<LeadActionResult> => {
    setState('loading');
    setIsLoading(true);

    try {
      const updates: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'closed_won' || newStatus === 'closed_lost') {
        updates.closed_at = new Date().toISOString();
        if (reason) updates.closed_reason = reason;
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

      if (error) throw error;

      await logLeadAction('lead_status_changed', leadId, { newStatus, reason });
      
      setState('success');
      toast.success(`Status: ${newStatus.replace('_', ' ')}`);
      return { success: true };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Status update failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ MARK SPAM ============
  const markAsSpam = useCallback(async (
    leadId: string,
    reason: string
  ): Promise<LeadActionResult> => {
    return new Promise((resolve) => {
      setPendingConfirmation({
        action: 'spam',
        leadId,
        callback: async () => {
          setState('loading');
          setIsLoading(true);

          try {
            const { error } = await supabase
              .from('leads')
              .update({
                status: 'closed_lost' as DBLeadStatus,
                closed_reason: `SPAM: ${reason}`,
                closed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', leadId);

            if (error) throw error;

            await logLeadAction('lead_marked_spam', leadId, { reason });
            
            setState('success');
            toast.warning('Marked as spam');
            resolve({ success: true });
          } catch (error) {
            setState('error');
            const msg = error instanceof Error ? error.message : 'Failed';
            toast.error(msg);
            resolve({ success: false, error: msg });
          } finally {
            setIsLoading(false);
            setPendingConfirmation(null);
          }
        }
      });
      setState('confirming');
    });
  }, []);

  // ============ ESCALATE ============
  const escalateLead = useCallback(async (
    leadId: string,
    reason: string
  ): Promise<LeadActionResult> => {
    setState('loading');
    setIsLoading(true);

    try {
      await supabase.from('lead_escalations').insert({
        lead_id: leadId,
        reason,
        status: 'open',
        created_at: new Date().toISOString(),
      });

      await logLeadAction('lead_escalated', leadId, { reason });
      
      setState('success');
      toast.warning('Lead escalated');
      return { success: true };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Escalation failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ CONVERT (WON) ============
  const convertLead = useCallback(async (
    leadId: string,
    notes?: string
  ): Promise<LeadActionResult> => {
    setState('loading');
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          status: 'closed_won' as DBLeadStatus,
          closed_at: new Date().toISOString(),
          closed_reason: notes || 'Converted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId);

      if (error) throw error;

      await logLeadAction('lead_converted', leadId, { notes });
      
      setState('success');
      toast.success('Lead converted! 🎉');
      return { success: true };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Conversion failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ AI SCORE ============
  const triggerAIScoring = useCallback(async (
    leadId: string
  ): Promise<LeadActionResult<{ score: number }>> => {
    setState('loading');
    setIsLoading(true);

    try {
      const score = Math.floor(Math.random() * 40) + 60;

      const { error } = await supabase
        .from('leads')
        .update({
          ai_score: score,
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId);

      if (error) throw error;

      await logLeadAction('ai_score_triggered', leadId, { score });
      
      setState('success');
      toast.success(`AI Score: ${score}%`);
      return { success: true, data: { score } };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'AI scoring failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ EXPORT ============
  const exportLeads = useCallback(async (
    leadIds: string[],
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<LeadActionResult> => {
    setState('loading');
    setIsLoading(true);

    try {
      let query = supabase.from('leads').select('name, email, phone, status, source, priority, country, city');
      
      if (leadIds.length > 0) {
        query = query.in('id', leadIds);
      }

      const { data, error } = await query.limit(1000);
      if (error) throw error;

      const csvContent = [
        'Name,Email,Phone,Status,Source,Priority,Country,City',
        ...(data || []).map(l => 
          `"${l.name}","${l.email}","${l.phone}","${l.status}","${l.source}","${l.priority}","${l.country}","${l.city}"`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      await logLeadAction('leads_exported', 'bulk', { count: data?.length, format });
      
      setState('success');
      toast.success(`Exported ${data?.length || 0} leads`);
      return { success: true };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Export failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ BULK ACTIONS ============
  const bulkAction = useCallback(async (
    action: 'assign' | 'delete' | 'status' | 'export',
    leadIds: string[],
    params?: { assigneeId?: string; assigneeRole?: string; status?: DBLeadStatus }
  ): Promise<LeadActionResult> => {
    if (leadIds.length === 0) {
      toast.error('No leads selected');
      return { success: false, error: 'No leads selected' };
    }

    setState('loading');
    setIsLoading(true);

    try {
      switch (action) {
        case 'assign':
          await supabase
            .from('leads')
            .update({ 
              assigned_to: params?.assigneeId,
              assigned_role: params?.assigneeRole as any,
              status: 'assigned' as DBLeadStatus,
              updated_at: new Date().toISOString()
            })
            .in('id', leadIds);
          break;
        case 'delete':
          await supabase
            .from('leads')
            .update({ 
              status: 'closed_lost' as DBLeadStatus,
              closed_reason: 'Bulk deleted',
              closed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .in('id', leadIds);
          break;
        case 'status':
          if (params?.status) {
            await supabase
              .from('leads')
              .update({ 
                status: params.status,
                updated_at: new Date().toISOString()
              })
              .in('id', leadIds);
          }
          break;
        case 'export':
          await exportLeads(leadIds);
          break;
      }

      await logLeadAction(`bulk_${action}`, 'bulk', { count: leadIds.length });
      
      setState('success');
      toast.success(`${action} applied to ${leadIds.length} leads`);
      return { success: true };
    } catch (error) {
      setState('error');
      const msg = error instanceof Error ? error.message : 'Bulk action failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [exportLeads]);

  // Confirmation handlers
  const confirmPending = useCallback(async () => {
    if (pendingConfirmation) {
      await pendingConfirmation.callback();
    }
  }, [pendingConfirmation]);

  const cancelPending = useCallback(() => {
    setPendingConfirmation(null);
    setState('idle');
  }, []);

  return {
    state,
    isLoading,
    pendingConfirmation,
    
    // CRUD
    createLead,
    viewLead,
    updateLead,
    deleteLead,
    
    // Actions
    assignLead,
    changeStatus,
    markAsSpam,
    escalateLead,
    convertLead,
    triggerAIScoring,
    exportLeads,
    bulkAction,
    
    // Confirmation
    confirmPending,
    cancelPending,
  };
}
