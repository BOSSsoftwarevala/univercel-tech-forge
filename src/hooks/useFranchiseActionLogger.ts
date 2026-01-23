/**
 * FRANCHISE OWNER ACTION LOGGER
 * Ensures ALL franchise owner actions are logged to audit_logs
 * and visible on Boss Panel via system_activity_log sync trigger
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type FOActionType = 
  | 'place_order' 
  | 'view_product' 
  | 'submit_requirement'
  | 'add_employee' 
  | 'update_employee' 
  | 'remove_employee'
  | 'create_lead' 
  | 'update_lead' 
  | 'assign_lead'
  | 'raise_support' 
  | 'update_support'
  | 'add_promise' 
  | 'fulfill_promise'
  | 'wallet_recharge' 
  | 'wallet_deduct'
  | 'upload_document'
  | 'update_seo'
  | 'update_settings'
  | 'accept_legal'
  | 'download_invoice'
  | 'email_invoice';

export type FOModule = 
  | 'fo_marketplace' 
  | 'fo_orders' 
  | 'fo_leads' 
  | 'fo_employees' 
  | 'fo_invoices' 
  | 'fo_wallet' 
  | 'fo_support' 
  | 'fo_legal' 
  | 'fo_settings';

interface LogActionParams {
  action: FOActionType;
  module: FOModule;
  targetId?: string;
  targetName?: string;
  details?: Record<string, unknown>;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export function useFranchiseActionLogger() {
  const logAction = useCallback(async (params: LogActionParams): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;

      const deviceInfo = {
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // Insert into audit_logs - trigger will sync to system_activity_log
      const { error: auditError } = await supabase.from('audit_logs').insert([{
        user_id: userId,
        action: params.action,
        module: params.module,
        role: 'franchise',
        meta_json: JSON.parse(JSON.stringify({
          target_id: params.targetId,
          target_name: params.targetName,
          risk_level: params.riskLevel || 'low',
          details: params.details,
          device_info: deviceInfo,
        }))
      }]);

      if (auditError) {
        console.error('[FO_AUDIT] Failed to log action:', auditError);
        return false;
      }

      // For high/critical actions, also log to blackbox_events
      if (params.riskLevel === 'high' || params.riskLevel === 'critical') {
        const riskScore = params.riskLevel === 'critical' ? 90 : 70;
        
        await supabase.from('blackbox_events').insert([{
          event_type: params.action,
          module_name: params.module,
          user_id: userId,
          entity_id: params.targetId || null,
          entity_type: 'franchise_action',
          is_sealed: true,
          risk_score: riskScore,
          role_name: 'franchise_owner',
          metadata: JSON.parse(JSON.stringify({
            target_name: params.targetName,
            details: params.details,
            device_info: deviceInfo,
          }))
        }]);
      }

      console.log(`[FO_AUDIT] Action logged: ${params.action} in ${params.module}`);
      return true;
    } catch (err) {
      console.error('[FO_AUDIT] Logging failed:', err);
      return false;
    }
  }, []);

  // Pre-built action loggers for common operations
  const logPlaceOrder = useCallback(async (productName: string, productId: string, amount: number) => {
    return logAction({
      action: 'place_order',
      module: 'fo_marketplace',
      targetId: productId,
      targetName: productName,
      riskLevel: 'medium',
      details: { amount, status: 'pending_approval' }
    });
  }, [logAction]);

  const logAddEmployee = useCallback(async (employeeName: string, role: string) => {
    return logAction({
      action: 'add_employee',
      module: 'fo_employees',
      targetName: employeeName,
      riskLevel: 'medium',
      details: { role }
    });
  }, [logAction]);

  const logRaiseSupport = useCallback(async (subject: string, requestId?: string) => {
    return logAction({
      action: 'raise_support',
      module: 'fo_support',
      targetId: requestId,
      targetName: subject,
      riskLevel: 'low',
      details: { status: 'open' }
    });
  }, [logAction]);

  const logWalletAction = useCallback(async (type: 'recharge' | 'deduct', amount: number) => {
    return logAction({
      action: type === 'recharge' ? 'wallet_recharge' : 'wallet_deduct',
      module: 'fo_wallet',
      riskLevel: type === 'recharge' ? 'high' : 'medium',
      details: { amount }
    });
  }, [logAction]);

  const logUpdateSEO = useCallback(async (field: string, value: string) => {
    return logAction({
      action: 'update_seo',
      module: 'fo_leads',
      riskLevel: 'low',
      details: { field, value }
    });
  }, [logAction]);

  const logInvoiceAction = useCallback(async (type: 'download' | 'email', invoiceId: string) => {
    return logAction({
      action: type === 'download' ? 'download_invoice' : 'email_invoice',
      module: 'fo_invoices',
      targetId: invoiceId,
      riskLevel: 'low',
      details: { action_type: type }
    });
  }, [logAction]);

  const logLegalAcceptance = useCallback(async (documentType: string) => {
    return logAction({
      action: 'accept_legal',
      module: 'fo_legal',
      targetName: documentType,
      riskLevel: 'high',
      details: { accepted: true, timestamp: new Date().toISOString() }
    });
  }, [logAction]);

  return {
    logAction,
    logPlaceOrder,
    logAddEmployee,
    logRaiseSupport,
    logWalletAction,
    logUpdateSEO,
    logInvoiceAction,
    logLegalAcceptance,
  };
}
