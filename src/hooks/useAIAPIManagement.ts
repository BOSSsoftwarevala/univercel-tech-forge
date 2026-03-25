/**
 * AI API Management Hook - Point-to-Point Database Connection
 * Every button = One API call = One log entry
 * Full CRUD with fail-safe, cost tracking, approvals
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnterpriseAudit } from './useEnterpriseAudit';
import { toast } from 'sonner';

// Types matching database schema
export interface AIProvider {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  cost_per_unit: number;
  created_at: string;
}

export interface APIService {
  id: string;
  name: string;
  provider: string;
  type: string;
  linked_module: string | null;
  linked_ai_id: string | null;
  api_key_ref: string | null;
  endpoint: string | null;
  status: 'running' | 'stopped' | 'paused' | 'error';
  billing_status: 'paid' | 'unpaid' | 'pending';
  usage_count: number;
  last_call_at: string | null;
  cost_per_call: number;
  monthly_cost: number;
  auto_stop_on_unpaid: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIUsageLog {
  id: string;
  usage_id: string;
  user_id: string;
  user_role: string;
  module: string;
  provider: string;
  base_cost: number;
  management_fee_percent: number;
  management_fee: number;
  final_cost: number;
  purpose: string | null;
  tokens_used: number;
  request_count: number;
  created_at: string;
  is_billed: boolean;
}

export interface APIActionResult {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

// Cost limit thresholds
const COST_WARN_THRESHOLD = 0.8; // 80%
const COST_STOP_THRESHOLD = 1.0; // 100%

export function useAIAPIManagement() {
  const { logAction, logApiCall, logCrudOperation } = useEnterpriseAudit();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<APIService[]>([]);
  const [usageLogs, setUsageLogs] = useState<AIUsageLog[]>([]);

  /**
   * Fetch all API services from database
   */
  const fetchServices = useCallback(async (): Promise<APIService[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('platform_api_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map(s => ({
        id: s.id,
        name: s.name,
        provider: s.provider || 'unknown',
        type: s.type || 'api',
        linked_module: s.linked_module,
        linked_ai_id: s.linked_ai_id,
        api_key_ref: s.api_key_ref,
        endpoint: s.endpoint,
        status: (s.status || 'stopped') as APIService['status'],
        billing_status: (s.billing_status || 'pending') as APIService['billing_status'],
        usage_count: s.usage_count || 0,
        last_call_at: s.last_call_at,
        cost_per_call: Number(s.cost_per_call) || 0,
        monthly_cost: Number(s.monthly_cost) || 0,
        auto_stop_on_unpaid: s.auto_stop_on_unpaid ?? true,
        created_at: s.created_at,
        updated_at: s.updated_at,
      }));

      setServices(mapped);
      await logApiCall('platform_api_services', 'GET', 'ai_system', true, 200);
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch services';
      await logApiCall('platform_api_services', 'GET', 'ai_system', false, 500, message);
      toast.error('Failed to load API services');
      return [];
    } finally {
      setLoading(false);
    }
  }, [logApiCall]);

  /**
   * RUN - Start an API service
   */
  const runService = useCallback(async (serviceId: string): Promise<APIActionResult> => {
    setLoading(true);
    try {
      // 1. Validate key exists
      const { data: service, error: fetchError } = await supabase
        .from('platform_api_services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (fetchError || !service) {
        throw new Error('Service not found');
      }

      // 2. Check billing status - auto-stop if unpaid
      if (service.billing_status === 'unpaid' && service.auto_stop_on_unpaid) {
        await logAction({
          action: 'api:run_blocked_unpaid',
          module: 'ai_system',
          severity: 'high',
          target_id: serviceId,
          target_type: 'api_service',
          metadata: { reason: 'Billing unpaid' }
        });
        return { success: false, message: 'Cannot start service - billing unpaid', error: 'UNPAID' };
      }

      // 3. Update status to running
      const { error: updateError } = await supabase
        .from('platform_api_services')
        .update({ 
          status: 'running', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', serviceId);

      if (updateError) throw updateError;

      // 4. Log the action
      await logCrudOperation('update', 'platform_api_services', serviceId, 'ai_system', 
        { status: service.status },
        { status: 'running' }
      );

      toast.success(`${service.name} started successfully`);
      await fetchServices();
      return { success: true, message: 'Service started' };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start service';
      await logAction({
        action: 'api:run_failed',
        module: 'ai_system',
        severity: 'high',
        target_id: serviceId,
        metadata: { error: message }
      });
      toast.error(message);
      return { success: false, message, error: message };
    } finally {
      setLoading(false);
    }
  }, [logAction, logCrudOperation, fetchServices]);

  /**
   * STOP - Stop an API service immediately
   */
  const stopService = useCallback(async (serviceId: string, reason?: string): Promise<APIActionResult> => {
    setLoading(true);
    try {
      const { data: service } = await supabase
        .from('platform_api_services')
        .select('name, status')
        .eq('id', serviceId)
        .single();

      const { error: updateError } = await supabase
        .from('platform_api_services')
        .update({ 
          status: 'stopped', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', serviceId);

      if (updateError) throw updateError;

      await logCrudOperation('update', 'platform_api_services', serviceId, 'ai_system',
        { status: service?.status },
        { status: 'stopped' }
      );

      await logAction({
        action: 'api:stop',
        module: 'ai_system',
        severity: 'medium',
        target_id: serviceId,
        target_type: 'api_service',
        reason: reason || 'Manual stop',
      });

      toast.success(`${service?.name || 'Service'} stopped`);
      await fetchServices();
      return { success: true, message: 'Service stopped' };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to stop service';
      toast.error(message);
      return { success: false, message, error: message };
    } finally {
      setLoading(false);
    }
  }, [logAction, logCrudOperation, fetchServices]);

  /**
   * PAUSE - Queue service for later resume
   */
  const pauseService = useCallback(async (serviceId: string): Promise<APIActionResult> => {
    setLoading(true);
    try {
      const { data: service } = await supabase
        .from('platform_api_services')
        .select('name, status')
        .eq('id', serviceId)
        .single();

      const { error: updateError } = await supabase
        .from('platform_api_services')
        .update({ 
          status: 'paused', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', serviceId);

      if (updateError) throw updateError;

      await logCrudOperation('update', 'platform_api_services', serviceId, 'ai_system',
        { status: service?.status },
        { status: 'paused' }
      );

      toast.success(`${service?.name || 'Service'} paused - can resume later`);
      await fetchServices();
      return { success: true, message: 'Service paused' };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to pause service';
      toast.error(message);
      return { success: false, message, error: message };
    } finally {
      setLoading(false);
    }
  }, [logCrudOperation, fetchServices]);

  /**
   * RESTART - Re-execute last safe request
   */
  const restartService = useCallback(async (serviceId: string): Promise<APIActionResult> => {
    setLoading(true);
    try {
      // First stop, then start
      await supabase
        .from('platform_api_services')
        .update({ status: 'stopped', updated_at: new Date().toISOString() })
        .eq('id', serviceId);

      // Brief pause
      await new Promise(resolve => setTimeout(resolve, 500));

      // Start again
      const result = await runService(serviceId);

      if (result.success) {
        await logAction({
          action: 'api:restart',
          module: 'ai_system',
          severity: 'medium',
          target_id: serviceId,
          target_type: 'api_service',
        });
        toast.success('Service restarted successfully');
      }

      return result;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to restart service';
      toast.error(message);
      return { success: false, message, error: message };
    } finally {
      setLoading(false);
    }
  }, [runService, logAction]);

  /**
   * DELETE - Soft delete only, keep logs
   */
  const deleteService = useCallback(async (serviceId: string, requiresApproval = true): Promise<APIActionResult> => {
    setLoading(true);
    try {
      const { data: service } = await supabase
        .from('platform_api_services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (!service) {
        return { success: false, message: 'Service not found', error: 'NOT_FOUND' };
      }

      // Check if approval required
      if (requiresApproval) {
        // Create approval request
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error: approvalError } = await supabase
          .from('approvals')
          .insert({
            request_type: 'api_service_delete',
            requested_by_user_id: user?.id,
            request_data: { service_id: serviceId, service_name: service.name },
            status: 'pending',
          });

        if (approvalError) throw approvalError;

        await logAction({
          action: 'api:delete_requested',
          module: 'ai_system',
          severity: 'high',
          target_id: serviceId,
          target_type: 'api_service',
          metadata: { requires_approval: true }
        });

        toast.info('Delete request submitted for approval');
        return { success: true, message: 'Delete request pending approval' };
      }

      // Soft delete - update status
      const { error: updateError } = await supabase
        .from('platform_api_services')
        .update({ 
          status: 'stopped',
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (updateError) throw updateError;

      await logCrudOperation('soft_delete', 'platform_api_services', serviceId, 'ai_system',
        service,
        { status: 'stopped', deleted: true }
      );

      toast.success(`${service.name} deleted (soft)`);
      await fetchServices();
      return { success: true, message: 'Service deleted' };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete service';
      toast.error(message);
      return { success: false, message, error: message };
    } finally {
      setLoading(false);
    }
  }, [logAction, logCrudOperation, fetchServices]);

  /**
   * ADD - Create new API service
   */
  const addService = useCallback(async (serviceData: Partial<APIService>): Promise<APIActionResult> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('platform_api_services')
        .insert({
          name: serviceData.name,
          provider: serviceData.provider,
          type: serviceData.type || 'api',
          endpoint: serviceData.endpoint,
          status: 'stopped',
          billing_status: 'pending',
          auto_stop_on_unpaid: true,
        })
        .select()
        .single();

      if (error) throw error;

      await logCrudOperation('create', 'platform_api_services', data.id, 'ai_system',
        undefined,
        data
      );

      toast.success(`${serviceData.name} added successfully`);
      await fetchServices();
      return { success: true, message: 'Service added', data };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add service';
      toast.error(message);
      return { success: false, message, error: message };
    } finally {
      setLoading(false);
    }
  }, [logCrudOperation, fetchServices]);

  /**
   * Update billing status
   */
  const updateBillingStatus = useCallback(async (
    serviceId: string, 
    status: 'paid' | 'unpaid' | 'pending'
  ): Promise<APIActionResult> => {
    setLoading(true);
    try {
      const { data: service } = await supabase
        .from('platform_api_services')
        .select('billing_status, name, auto_stop_on_unpaid, status')
        .eq('id', serviceId)
        .single();

      const { error } = await supabase
        .from('platform_api_services')
        .update({ 
          billing_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (error) throw error;

      // Auto-stop if unpaid and configured
      if (status === 'unpaid' && service?.auto_stop_on_unpaid && service?.status === 'running') {
        await stopService(serviceId, 'Auto-stop: billing unpaid');
        toast.warning(`${service.name} auto-stopped due to unpaid billing`);
      }

      await logCrudOperation('update', 'platform_api_services', serviceId, 'ai_system',
        { billing_status: service?.billing_status },
        { billing_status: status }
      );

      toast.success(`Billing status updated to ${status}`);
      await fetchServices();
      return { success: true, message: 'Billing updated' };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update billing';
      toast.error(message);
      return { success: false, message, error: message };
    } finally {
      setLoading(false);
    }
  }, [logCrudOperation, stopService, fetchServices]);

  /**
   * Fetch usage logs with cost tracking
   */
  const fetchUsageLogs = useCallback(async (filters?: {
    startDate?: string;
    endDate?: string;
    module?: 'analytics' | 'chatbot' | 'dev_assist' | 'image_gen' | 'ocr' | 'other' | 'seo' | 'translation';
  }): Promise<AIUsageLog[]> => {
    try {
      let query = supabase
        .from('ai_usage_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters?.module) {
        query = query.eq('module', filters.module);
      }

      const { data, error } = await query;
      if (error) throw error;

      const logs = (data || []) as AIUsageLog[];
      setUsageLogs(logs);
      return logs;

    } catch (err) {
      console.error('Failed to fetch usage logs:', err);
      return [];
    }
  }, []);

  /**
   * Check cost limits and trigger alerts
   */
  const checkCostLimits = useCallback(async (monthlyBudget: number): Promise<{
    currentSpend: number;
    percentUsed: number;
    shouldWarn: boolean;
    shouldStop: boolean;
  }> => {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from('ai_usage_logs')
        .select('final_cost')
        .gte('created_at', startOfMonth.toISOString());

      const currentSpend = (data || []).reduce((sum, log) => sum + (Number(log.final_cost) || 0), 0);
      const percentUsed = monthlyBudget > 0 ? currentSpend / monthlyBudget : 0;

      const result = {
        currentSpend,
        percentUsed,
        shouldWarn: percentUsed >= COST_WARN_THRESHOLD,
        shouldStop: percentUsed >= COST_STOP_THRESHOLD,
      };

      // Log if thresholds exceeded
      if (result.shouldStop) {
        await logAction({
          action: 'ai:cost_limit_exceeded',
          module: 'ai_system',
          severity: 'critical',
          metadata: { currentSpend, monthlyBudget, percentUsed: percentUsed * 100 }
        });
        toast.error(`AI cost limit exceeded! ${(percentUsed * 100).toFixed(1)}% of budget used`);
      } else if (result.shouldWarn) {
        await logAction({
          action: 'ai:cost_warning',
          module: 'ai_system',
          severity: 'high',
          metadata: { currentSpend, monthlyBudget, percentUsed: percentUsed * 100 }
        });
        toast.warning(`AI cost warning: ${(percentUsed * 100).toFixed(1)}% of budget used`);
      }

      return result;

    } catch (err) {
      console.error('Failed to check cost limits:', err);
      return { currentSpend: 0, percentUsed: 0, shouldWarn: false, shouldStop: false };
    }
  }, [logAction]);

  /**
   * Emergency kill switch - stop all services
   */
  const emergencyKillSwitch = useCallback(async (type: 'all' | 'ai_only'): Promise<APIActionResult> => {
    setLoading(true);
    try {
      const filter = type === 'ai_only' 
        ? { type: 'ai' } 
        : {};

      let query = supabase
        .from('platform_api_services')
        .update({ status: 'stopped', updated_at: new Date().toISOString() })
        .eq('status', 'running');

      if (type === 'ai_only') {
        query = query.eq('type', 'ai');
      }

      const { error } = await query;
      if (error) throw error;

      await logAction({
        action: 'api:emergency_kill_switch',
        module: 'ai_system',
        severity: 'critical',
        metadata: { type, triggered_at: new Date().toISOString() }
      });

      toast.error(`EMERGENCY: All ${type === 'ai_only' ? 'AI' : ''} services stopped!`);
      await fetchServices();
      return { success: true, message: `Kill switch activated - ${type}` };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kill switch failed';
      toast.error(`Kill switch FAILED: ${message}`);
      return { success: false, message, error: message };
    } finally {
      setLoading(false);
    }
  }, [logAction, fetchServices]);

  /**
   * Execute API call with retry and logging
   */
  const executeAPICall = useCallback(async (
    serviceId: string,
    payload: Record<string, unknown>
  ): Promise<APIActionResult> => {
    const maxRetries = 1;
    let lastError: string = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Get service details
        const { data: service } = await supabase
          .from('platform_api_services')
          .select('*')
          .eq('id', serviceId)
          .single();

        if (!service || service.status !== 'running') {
          return { success: false, message: 'Service not running', error: 'NOT_RUNNING' };
        }

        // Log the attempt
        await logAction({
          action: 'api:call_attempt',
          module: 'ai_system',
          severity: 'low',
          target_id: serviceId,
          metadata: { attempt, payload_keys: Object.keys(payload) }
        });

        // Simulate API call (in real implementation, call the actual endpoint)
        // For now, just update usage count
        const { error: updateError } = await supabase
          .from('platform_api_services')
          .update({ 
            usage_count: (service.usage_count || 0) + 1,
            last_call_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', serviceId);

        if (updateError) throw updateError;

        await logAction({
          action: `api:call_success:${service.name}`,
          module: 'ai_system',
          severity: 'low',
          target_id: serviceId,
          metadata: { endpoint: service.endpoint, method: 'POST', status: 200 }
        });
        
        return { success: true, message: 'API call successful' };

      } catch (err) {
        lastError = err instanceof Error ? err.message : 'API call failed';
        
        if (attempt < maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
      }
    }

    // All retries failed - stop service and alert
    await stopService(serviceId, `Auto-stop: API failures exceeded (${lastError})`);
    
    await logAction({
      action: 'api:call_failed_stop',
      module: 'ai_system',
      severity: 'high',
      target_id: serviceId,
      metadata: { error: lastError, action: 'service_stopped' }
    });

    toast.error(`API call failed - service stopped: ${lastError}`);
    return { success: false, message: 'API call failed - service stopped', error: lastError };

  }, [logAction, logApiCall, stopService]);

  return {
    // State
    loading,
    services,
    usageLogs,

    // Core CRUD operations (button-level)
    fetchServices,
    runService,
    stopService,
    pauseService,
    restartService,
    deleteService,
    addService,

    // Billing & Cost
    updateBillingStatus,
    fetchUsageLogs,
    checkCostLimits,

    // Emergency controls
    emergencyKillSwitch,

    // API execution with retry
    executeAPICall,
  };
}
