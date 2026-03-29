/**
 * Hardened Buzzer Engine - Enterprise Security
 * - Blocking popup until accepted (urgent/high priority)
 * - Proper assignment workflow
 * - Auto-escalation
 * - Audit logging
 */

import { supabase } from '@/integrations/supabase/client';
import { AppRole, ROLE_HIERARCHY } from './rbac';

// Buzzer priority levels
export type BuzzerPriority = 'low' | 'normal' | 'high' | 'urgent';

// Buzzer trigger types
export type BuzzerTriggerType = 
  | 'new_lead'
  | 'task_assignment'
  | 'sla_violation'
  | 'demo_request'
  | 'escalation'
  | 'payment_alert'
  | 'fraud_detected'
  | 'system_critical';

export interface BuzzerItem {
  id: string;
  triggerType: BuzzerTriggerType;
  roleTarget?: AppRole;
  region?: string;
  taskId?: string;
  leadId?: string;
  priority: BuzzerPriority;
  status: 'pending' | 'accepted' | 'escalated' | 'dismissed';
  createdAt: string;
  escalationLevel: number;
  autoEscalateAfter: number; // seconds
  message?: string;
  acceptedBy?: string;
  acceptedAt?: string;
}

// Priority configuration
export const BUZZER_PRIORITY_CONFIG = {
  low: {
    color: 'slate',
    canDismiss: true,
    autoEscalateAfter: 600, // 10 minutes
    soundEnabled: false,
    blockingUI: false,
  },
  normal: {
    color: 'cyan',
    canDismiss: true,
    autoEscalateAfter: 300, // 5 minutes
    soundEnabled: false,
    blockingUI: false,
  },
  high: {
    color: 'amber',
    canDismiss: false, // Must be accepted
    autoEscalateAfter: 180, // 3 minutes
    soundEnabled: true,
    blockingUI: true,
  },
  urgent: {
    color: 'red',
    canDismiss: false, // Must be accepted
    autoEscalateAfter: 60, // 1 minute
    soundEnabled: true,
    blockingUI: true,
  },
} as const;

// Escalation path based on role hierarchy (partial - uses super_admin as default)
const getEscalationPath = (role: AppRole): AppRole[] => {
  const paths: Partial<Record<AppRole, AppRole[]>> = {
    super_admin: [],
    admin: ['super_admin'],
    franchise: ['admin', 'super_admin'],
    reseller: ['franchise', 'admin', 'super_admin'],
    developer: ['demo_manager', 'admin', 'super_admin'],
    demo_manager: ['admin', 'super_admin'],
    seo_manager: ['marketing_manager', 'admin', 'super_admin'],
    marketing_manager: ['admin', 'super_admin'],
    lead_manager: ['admin', 'super_admin'],
    client_success: ['admin', 'super_admin'],
    finance_manager: ['admin', 'super_admin'],
    performance_manager: ['admin', 'super_admin'],
    rnd_manager: ['admin', 'super_admin'],
    hr_manager: ['admin', 'super_admin'],
    legal_compliance: ['admin', 'super_admin'],
    ai_manager: ['admin', 'super_admin'],
    influencer: ['marketing_manager', 'admin', 'super_admin'],
    prime: ['client_success', 'admin', 'super_admin'],
    client: ['client_success', 'admin', 'super_admin'],
    r_and_d: ['admin', 'super_admin'],
    api_security: ['admin', 'super_admin'],
    support: ['admin', 'super_admin'],
    task_manager: ['admin', 'super_admin'],
  };
  return paths[role] || ['super_admin'];
};

// Create a new buzzer alert
export const createBuzzerAlert = async (
  triggerType: BuzzerTriggerType,
  priority: BuzzerPriority,
  options: {
    roleTarget?: AppRole;
    region?: string;
    taskId?: string;
    leadId?: string;
    message?: string;
  } = {}
): Promise<{ success: boolean; buzzerId?: string; error?: string }> => {
  try {
    const config = BUZZER_PRIORITY_CONFIG[priority];
    
    const { data, error } = await supabase.from('buzzer_queue').insert({
      trigger_type: triggerType,
      priority,
      role_target: options.roleTarget,
      region: options.region,
      task_id: options.taskId,
      lead_id: options.leadId,
      status: 'pending',
      escalation_level: 1,
      auto_escalate_after: config.autoEscalateAfter,
    }).select().single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Log audit trail
    await logBuzzerEvent('created', data.id, priority, triggerType);

    return { success: true, buzzerId: data.id };
  } catch (err) {
    return { success: false, error: 'Failed to create buzzer alert' };
  }
};

// Accept a buzzer alert
export const acceptBuzzerAlert = async (
  buzzerId: string,
  acceptedBy: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: buzzer, error: fetchError } = await supabase
      .from('buzzer_queue')
      .select('*')
      .eq('id', buzzerId)
      .single();

    if (fetchError || !buzzer) {
      return { success: false, error: 'Buzzer not found' };
    }

    if (buzzer.status !== 'pending') {
      return { success: false, error: 'Buzzer already processed' };
    }

    const { error: updateError } = await supabase
      .from('buzzer_queue')
      .update({
        status: 'accepted',
        accepted_by: acceptedBy,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', buzzerId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Log audit trail
    await logBuzzerEvent('accepted', buzzerId, buzzer.priority, buzzer.trigger_type, acceptedBy);

    // Remove UI blocking if this was a blocking buzzer
    document.body.classList.remove('buzzer-blocking');

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to accept buzzer' };
  }
};

// Escalate a buzzer to next level
export const escalateBuzzer = async (
  buzzerId: string,
  currentRole: AppRole
): Promise<{ success: boolean; escalatedTo?: AppRole; error?: string }> => {
  try {
    const { data: buzzer, error: fetchError } = await supabase
      .from('buzzer_queue')
      .select('*')
      .eq('id', buzzerId)
      .single();

    if (fetchError || !buzzer) {
      return { success: false, error: 'Buzzer not found' };
    }

    const escalationPath = getEscalationPath(currentRole);
    const nextEscalationIndex = Math.min(buzzer.escalation_level, escalationPath.length - 1);
    const nextRole = escalationPath[nextEscalationIndex];

    const { error: updateError } = await supabase
      .from('buzzer_queue')
      .update({
        status: 'escalated',
        escalation_level: buzzer.escalation_level + 1,
        role_target: nextRole,
      })
      .eq('id', buzzerId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Create new buzzer for escalated role
    await createBuzzerAlert('escalation', (buzzer.priority || 'normal') as BuzzerPriority, {
      roleTarget: nextRole,
      taskId: buzzer.task_id,
      leadId: buzzer.lead_id,
      message: `Escalated from ${currentRole}: ${buzzer.trigger_type}`,
    });

    // Log audit trail
    await logBuzzerEvent('escalated', buzzerId, buzzer.priority, buzzer.trigger_type, undefined, nextRole);

    return { success: true, escalatedTo: nextRole };
  } catch {
    return { success: false, error: 'Failed to escalate buzzer' };
  }
};

// Check if buzzer priority blocks UI
export const isBuzzerBlocking = (priority: BuzzerPriority): boolean => {
  return BUZZER_PRIORITY_CONFIG[priority].blockingUI;
};

// Can buzzer be dismissed (low/normal only)
export const canDismissBuzzer = (priority: BuzzerPriority): boolean => {
  return BUZZER_PRIORITY_CONFIG[priority].canDismiss;
};

// Apply UI blocking for urgent/high priority buzzers
export const applyBuzzerBlocking = (hasBlockingBuzzers: boolean): void => {
  if (hasBlockingBuzzers) {
    document.body.classList.add('buzzer-blocking');
  } else {
    document.body.classList.remove('buzzer-blocking');
  }
};

// Fetch pending buzzers for a role
export const fetchPendingBuzzers = async (
  role: AppRole,
  region?: string
): Promise<BuzzerItem[]> => {
  try {
    let query = supabase
      .from('buzzer_queue')
      .select('*')
      .eq('status', 'pending')
      .or(`role_target.eq.${role},role_target.is.null`)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (region) {
      query = query.or(`region.eq.${region},region.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch buzzers:', error);
      return [];
    }

    return (data || []).map((b: any) => ({
      id: b.id,
      triggerType: b.trigger_type as BuzzerTriggerType,
      roleTarget: b.role_target as AppRole,
      region: b.region,
      taskId: b.task_id,
      leadId: b.lead_id,
      priority: (b.priority || 'normal') as BuzzerPriority,
      status: b.status as BuzzerItem['status'],
      createdAt: b.created_at,
      escalationLevel: b.escalation_level || 1,
      autoEscalateAfter: b.auto_escalate_after || 300,
      message: `${b.trigger_type} - ${b.priority || 'normal'} priority`,
      acceptedBy: b.accepted_by,
      acceptedAt: b.accepted_at,
    }));
  } catch {
    return [];
  }
};

// Log buzzer event for audit
const logBuzzerEvent = async (
  action: 'created' | 'accepted' | 'escalated' | 'dismissed',
  buzzerId: string,
  priority: string,
  triggerType: string,
  acceptedBy?: string,
  escalatedTo?: string
): Promise<void> => {
  try {
    await supabase.from('audit_logs').insert({
      action: `buzzer_${action}`,
      module: 'buzzer_engine',
      meta_json: {
        buzzer_id: buzzerId,
        priority,
        trigger_type: triggerType,
        accepted_by: acceptedBy,
        escalated_to: escalatedTo,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to log buzzer event:', error);
  }
};
