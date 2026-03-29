/**
 * Master Admin Control Center - Core Services
 * End-to-End Flow: Blackbox, Live Activity, Access Control, Session Management
 */

import { supabase } from '@/integrations/supabase/client';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

export interface BlackboxEvent {
  event_type: string;
  module_name: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
}

export interface AccessCheckResult {
  allowed: boolean;
  checks: {
    system_lock: boolean;
    user_status: boolean;
    role_scope: boolean;
    permission: boolean;
    rental: boolean;
    risk_score: boolean;
  };
  denial_reason?: string;
  risk_score: number;
  user_role: string;
}

export interface LoginSecurityCheck {
  allowed: boolean;
  require_captcha: boolean;
  is_anomaly: boolean;
  anomaly_reasons: string[];
  risk_score: number;
  failed_attempts: number;
  reason?: string;
}

export interface DeviceInfo {
  fingerprint_hash: string;
  device_name: string;
  browser: string;
  os: string;
  geo_location?: string;
}

// ═══════════════════════════════════════════
// DEVICE FINGERPRINT GENERATION
// ═══════════════════════════════════════════

export async function generateDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency,
    navigator.platform,
  ];
  
  const fingerprint = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getDeviceInfo(): Omit<DeviceInfo, 'fingerprint_hash'> {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  return {
    device_name: `${browser} on ${os}`,
    browser,
    os
  };
}

// ═══════════════════════════════════════════
// BLACKBOX LOGGING SERVICE
// ═══════════════════════════════════════════

export async function logToBlackbox(event: BlackboxEvent): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const fingerprint = await generateDeviceFingerprint();
    
    await supabase.from('blackbox_events').insert({
      event_type: event.event_type,
      module_name: event.module_name,
      entity_type: event.entity_type || null,
      entity_id: event.entity_id || null,
      user_id: user?.id || null,
      device_fingerprint: fingerprint,
      metadata: event.metadata || {}
    });
  } catch (error) {
    console.error('Blackbox logging failed:', error);
  }
}

// Convenience logging functions
export const blackbox = {
  view: (module: string, entity?: string, entityId?: string) => 
    logToBlackbox({ event_type: 'view', module_name: module, entity_type: entity, entity_id: entityId }),
  
  click: (module: string, action: string, metadata?: Record<string, any>) =>
    logToBlackbox({ event_type: 'click', module_name: module, metadata: { action, ...metadata } }),
  
  create: (module: string, entity: string, entityId: string, metadata?: Record<string, any>) =>
    logToBlackbox({ event_type: 'create', module_name: module, entity_type: entity, entity_id: entityId, metadata }),
  
  update: (module: string, entity: string, entityId: string, metadata?: Record<string, any>) =>
    logToBlackbox({ event_type: 'update', module_name: module, entity_type: entity, entity_id: entityId, metadata }),
  
  delete: (module: string, entity: string, entityId: string, metadata?: Record<string, any>) =>
    logToBlackbox({ event_type: 'delete', module_name: module, entity_type: entity, entity_id: entityId, metadata }),
  
  approve: (module: string, entity: string, entityId: string, metadata?: Record<string, any>) =>
    logToBlackbox({ event_type: 'approve', module_name: module, entity_type: entity, entity_id: entityId, metadata }),
  
  reject: (module: string, entity: string, entityId: string, metadata?: Record<string, any>) =>
    logToBlackbox({ event_type: 'reject', module_name: module, entity_type: entity, entity_id: entityId, metadata }),
  
  lock: (module: string, entity: string, entityId: string, metadata?: Record<string, any>) =>
    logToBlackbox({ event_type: 'lock', module_name: module, entity_type: entity, entity_id: entityId, metadata }),
  
  login: (success: boolean, metadata?: Record<string, any>) =>
    logToBlackbox({ event_type: success ? 'login_success' : 'login_failed', module_name: 'auth', metadata }),
  
  logout: () =>
    logToBlackbox({ event_type: 'logout', module_name: 'auth' }),
};

// ═══════════════════════════════════════════
// ACCESS CONTROL SERVICE
// ═══════════════════════════════════════════

export async function checkAccess(
  action: string,
  module?: string,
  entityType?: string,
  entityId?: string
): Promise<AccessCheckResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        allowed: false,
        checks: {
          system_lock: true,
          user_status: false,
          role_scope: false,
          permission: false,
          rental: false,
          risk_score: false
        },
        denial_reason: 'Not authenticated',
        risk_score: 0,
        user_role: ''
      };
    }
    
    const fingerprint = await generateDeviceFingerprint();
    
    const { data, error } = await supabase.rpc('master_check_access', {
      p_user_id: user.id,
      p_action: action,
      p_module: module || null,
      p_entity_type: entityType || null,
      p_entity_id: entityId || null,
      p_ip_address: null,
      p_device_fingerprint: fingerprint
    });
    
    if (error) throw error;
    
    return data as unknown as AccessCheckResult;
  } catch (error) {
    console.error('Access check failed:', error);
    return {
      allowed: false,
      checks: {
        system_lock: false,
        user_status: false,
        role_scope: false,
        permission: false,
        rental: false,
        risk_score: false
      },
      denial_reason: 'Access check failed',
      risk_score: 0,
      user_role: ''
    };
  }
}

// ═══════════════════════════════════════════
// SYSTEM LOCK SERVICE
// ═══════════════════════════════════════════

export async function checkSystemLock(): Promise<{ locked: boolean; scope?: string; reason?: string }> {
  try {
    const { data, error } = await supabase
      .from('master_system_locks')
      .select('*')
      .is('released_at', null)
      .order('activated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    if (data) {
      return {
        locked: true,
        scope: data.lock_scope,
        reason: data.reason
      };
    }
    
    return { locked: false };
  } catch (error) {
    console.error('System lock check failed:', error);
    return { locked: false };
  }
}

export async function activateSystemLock(
  scope: 'global' | 'continent' | 'user' | 'feature',
  targetId: string | null,
  reason: string
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check permission first
    const access = await checkAccess('system_lock_activate', 'system');
    if (!access.allowed) return false;
    
    const { error } = await supabase.from('master_system_locks').insert({
      lock_scope: scope,
      target_id: targetId,
      reason,
      activated_by: user.id
    });
    
    if (error) throw error;
    
    await blackbox.lock('system', 'system_lock', 'global', { scope, reason });
    
    return true;
  } catch (error) {
    console.error('System lock activation failed:', error);
    return false;
  }
}

export async function releaseSystemLock(lockId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const access = await checkAccess('system_lock_release', 'system');
    if (!access.allowed) return false;
    
    const { error } = await supabase
      .from('master_system_locks')
      .update({ released_at: new Date().toISOString() })
      .eq('id', lockId);
    
    if (error) throw error;
    
    await logToBlackbox({
      event_type: 'unlock',
      module_name: 'system',
      entity_type: 'system_lock',
      entity_id: lockId
    });
    
    return true;
  } catch (error) {
    console.error('System lock release failed:', error);
    return false;
  }
}

// ═══════════════════════════════════════════
// RENTAL SERVICE
// ═══════════════════════════════════════════

export async function checkRentalActive(featureCode: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase.rpc('check_rental_active', {
      p_user_id: user.id,
      p_feature_code: featureCode
    });
    
    if (error) throw error;
    return data as boolean;
  } catch (error) {
    console.error('Rental check failed:', error);
    return false;
  }
}

export async function getUserRentals(): Promise<any[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('master_rentals')
      .select(`
        *,
        feature:master_rentable_features(*),
        plan:master_rental_plans(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('end_time', new Date().toISOString());
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get rentals failed:', error);
    return [];
  }
}

// ═══════════════════════════════════════════
// LIVE ACTIVITY SERVICE
// ═══════════════════════════════════════════

export async function getLiveActivity(limit = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('master_live_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get live activity failed:', error);
    return [];
  }
}

export function subscribeLiveActivity(callback: (payload: any) => void) {
  const channel = supabase
    .channel('live-activity')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'master_live_activity'
      },
      callback
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════
// SESSION MANAGEMENT SERVICE
// ═══════════════════════════════════════════

export async function registerDevice(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const fingerprint = await generateDeviceFingerprint();
    const deviceInfo = getDeviceInfo();
    
    const { error } = await supabase.from('master_device_fingerprints').upsert({
      user_id: user.id,
      fingerprint_hash: fingerprint,
      device_name: deviceInfo.device_name,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      last_seen_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,fingerprint_hash'
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Device registration failed:', error);
    return false;
  }
}

export async function revokeAllSessions(reason: string): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    
    const { data, error } = await supabase.rpc('master_revoke_user_tokens', {
      p_user_id: user.id,
      p_reason: reason,
      p_revoked_by: user.id
    });
    
    if (error) throw error;
    return data as number;
  } catch (error) {
    console.error('Session revocation failed:', error);
    return 0;
  }
}

// ═══════════════════════════════════════════
// AUDIT SERVICE
// ═══════════════════════════════════════════

export async function getBlackboxEvents(
  filters: {
    module?: string;
    eventType?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  } = {},
  limit = 100
): Promise<any[]> {
  try {
    let query = supabase
      .from('blackbox_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (filters.module) query = query.eq('module_name', filters.module);
    if (filters.eventType) query = query.eq('event_type', filters.eventType);
    if (filters.userId) query = query.eq('user_id', filters.userId);
    if (filters.startDate) query = query.gte('created_at', filters.startDate);
    if (filters.endDate) query = query.lte('created_at', filters.endDate);
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get blackbox events failed:', error);
    return [];
  }
}

export async function verifyBlackboxIntegrity(
  startSequence = 1,
  endSequence?: number
): Promise<{ verified_count: number; tampered_count: number; integrity: string }> {
  try {
    const { data, error } = await supabase.rpc('master_verify_hash_chain', {
      p_start_sequence: startSequence,
      p_end_sequence: endSequence || null
    });
    
    if (error) throw error;
    return data as unknown as { verified_count: number; tampered_count: number; integrity: string };
  } catch (error) {
    console.error('Hash chain verification failed:', error);
    return { verified_count: 0, tampered_count: 0, integrity: 'unknown' };
  }
}

// ═══════════════════════════════════════════
// PERMISSION HELPERS
// ═══════════════════════════════════════════

export async function getUserPermissions(): Promise<string[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Get direct permissions
    const { data: grantData } = await supabase
      .from('master_permission_grants')
      .select('permission_id')
      .eq('user_id', user.id);
    
    let directPerms: string[] = [];
    
    if (grantData && grantData.length > 0) {
      const permissionIds = grantData.map((d) => d.permission_id);
      
      const { data: permsData } = await supabase
        .from('master_permissions')
        .select('permission_code')
        .in('id', permissionIds);
      
      directPerms = permsData?.map((p) => p.permission_code) || [];
    }
    
    // Get role-based permissions
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (roleData) {
      // Get role ID by name (column is 'name' not 'role_name')
      const { data: roleRecords } = await supabase
        .from('master_roles')
        .select('id')
        .eq('name', roleData.role);
      
      if (roleRecords && roleRecords.length > 0) {
        const roleId = roleRecords[0].id;
        
        const { data: rolePermLinks } = await supabase
          .from('master_role_permissions')
          .select('permission_id')
          .eq('role_id', roleId);
        
        if (rolePermLinks && rolePermLinks.length > 0) {
          const rolePermIds = rolePermLinks.map((rp) => rp.permission_id);
          
          const { data: rolePermsData } = await supabase
            .from('master_permissions')
            .select('permission_code')
            .in('id', rolePermIds);
          
          const rolePermCodes = rolePermsData?.map((p) => p.permission_code) || [];
          return [...new Set([...directPerms, ...rolePermCodes])];
        }
      }
    }
    
    return directPerms;
  } catch (error) {
    console.error('Get permissions failed:', error);
    return [];
  }
}

export async function hasPermission(permissionCode: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase.rpc('master_user_has_permission', {
      p_user_id: user.id,
      p_permission_code: permissionCode
    });
    
    if (error) throw error;
    return data as boolean;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}
