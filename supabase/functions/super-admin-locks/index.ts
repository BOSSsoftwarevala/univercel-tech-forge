import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================
// SUPER ADMIN LOCKS API
// System Lock Operations
// CRITICAL API - Scope Limited
// ============================================

async function validateSession(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) throw new Error('Authorization required');

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) throw new Error('Invalid session');

  const { data: sessionData } = await supabase
    .from('super_admin_sessions')
    .select('id, assigned_scope')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('login_at', { ascending: false })
    .limit(1)
    .single();

  if (!sessionData) throw new Error('No active session');
  return { user, session: sessionData };
}

async function logLockAction(supabase: any, userId: string, sessionId: string, actionType: string, lockId: string | null, actionData: any, req: Request) {
  const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
  const deviceFingerprint = req.headers.get('x-device-fingerprint') || 'unknown';

  await supabase.from('super_admin_actions').insert({
    user_id: userId,
    session_id: sessionId,
    action_type: actionType,
    action_category: 'system_lock',
    target_entity: 'lock',
    target_id: lockId,
    action_data: actionData,
    ip_address: ipAddress,
    device_fingerprint: deviceFingerprint,
    is_sensitive: true,
    result_status: 'success'
  });

  // All lock actions go to blackbox (CRITICAL)
  await supabase.from('blackbox_events').insert({
    event_type: actionType,
    module_name: 'system_lock',
    user_id: userId,
    entity_id: lockId,
    entity_type: 'lock',
    role_name: 'super_admin',
    ip_address: ipAddress,
    device_fingerprint: deviceFingerprint,
    is_sealed: true,
    risk_score: 90,
    metadata: actionData
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { user, session } = await validateSession(req, supabase);
    
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();
    const body = req.method !== 'GET' ? await req.json() : {};

    console.log(`[SUPER-ADMIN-LOCKS] User: ${user.id}, Action: ${action}`);

    switch (action) {
      case 'list': {
        const { 
          limit = 50, 
          offset = 0, 
          lock_type,
          is_active 
        } = body;

        let query = supabase
          .from('super_admin_locks')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (lock_type) query = query.eq('lock_type', lock_type);
        if (is_active !== undefined) query = query.eq('is_active', is_active);

        const { data, error, count } = await query;

        if (error) {
          console.error('[SUPER-ADMIN-LOCKS] List error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch locks' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logLockAction(supabase, user.id, session.id, 'view_locks', null, { filters: { lock_type, is_active } }, req);

        return new Response(JSON.stringify({
          success: true,
          data: { locks: data, total: count }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'lock-user': {
        const { user_id, reason } = body;

        if (!user_id || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'user_id and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data: lockData, error: lockError } = await supabase
          .from('super_admin_locks')
          .insert({
            lock_type: 'user',
            lock_target: 'user',
            lock_target_id: user_id,
            scope_context: session.assigned_scope,
            locked_by: user.id,
            lock_reason: reason,
            is_active: true,
            force_logout_triggered: true,
            affected_users: 1
          })
          .select()
          .single();

        if (lockError) {
          console.error('[SUPER-ADMIN-LOCKS] Lock user error:', lockError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to lock user' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Force logout
        await supabase
          .from('user_roles')
          .update({ force_logged_out_at: new Date().toISOString() })
          .eq('user_id', user_id);

        await logLockAction(supabase, user.id, session.id, 'lock_user', lockData.id, { user_id, reason }, req);

        console.log(`[SUPER-ADMIN-LOCKS] User locked: ${user_id}`);

        return new Response(JSON.stringify({
          success: true,
          data: { lock: lockData }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'lock-region': {
        const { region, reason } = body;

        if (!region || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'region and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Validate scope - can only lock regions within assigned scope
        const scope = session.assigned_scope || [];
        // TODO: Add proper scope validation logic

        const { data: lockData, error: lockError } = await supabase
          .from('super_admin_locks')
          .insert({
            lock_type: 'region',
            lock_target: region,
            scope_context: session.assigned_scope,
            locked_by: user.id,
            lock_reason: reason,
            is_active: true,
            force_logout_triggered: true
          })
          .select()
          .single();

        if (lockError) {
          console.error('[SUPER-ADMIN-LOCKS] Lock region error:', lockError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to lock region' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logLockAction(supabase, user.id, session.id, 'lock_region', lockData.id, { region, reason }, req);

        console.log(`[SUPER-ADMIN-LOCKS] Region locked: ${region}`);

        return new Response(JSON.stringify({
          success: true,
          data: { lock: lockData }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'lock-module': {
        const { module_id, reason } = body;

        if (!module_id || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'module_id and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data: lockData, error: lockError } = await supabase
          .from('super_admin_locks')
          .insert({
            lock_type: 'module',
            lock_target: module_id,
            scope_context: session.assigned_scope,
            locked_by: user.id,
            lock_reason: reason,
            is_active: true
          })
          .select()
          .single();

        if (lockError) {
          console.error('[SUPER-ADMIN-LOCKS] Lock module error:', lockError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to lock module' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Update module control
        await supabase
          .from('super_admin_module_controls')
          .update({
            is_enabled: false,
            disabled_by: user.id,
            disabled_at: new Date().toISOString()
          })
          .eq('module_name', module_id);

        await logLockAction(supabase, user.id, session.id, 'lock_module', lockData.id, { module_id, reason }, req);

        console.log(`[SUPER-ADMIN-LOCKS] Module locked: ${module_id}`);

        return new Response(JSON.stringify({
          success: true,
          data: { lock: lockData }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'emergency-suspend': {
        const { scope_type, scope_value, reason } = body;

        if (!scope_type || !scope_value || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'scope_type, scope_value, and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // This is a high-risk operation - Super Admin can only do this within their scope
        const { data: lockData, error: lockError } = await supabase
          .from('super_admin_locks')
          .insert({
            lock_type: 'emergency',
            lock_target: `${scope_type}:${scope_value}`,
            scope_context: session.assigned_scope,
            locked_by: user.id,
            lock_reason: reason,
            is_active: true,
            force_logout_triggered: true
          })
          .select()
          .single();

        if (lockError) {
          console.error('[SUPER-ADMIN-LOCKS] Emergency suspend error:', lockError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to create emergency suspension' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Log critical security event
        await supabase.from('super_admin_security_events').insert({
          event_type: 'emergency_suspension',
          severity: 'critical',
          action_taken: 'emergency_suspend',
          action_taken_by: user.id,
          action_taken_at: new Date().toISOString(),
          event_data: { scope_type, scope_value, reason, lock_id: lockData.id }
        });

        await logLockAction(supabase, user.id, session.id, 'emergency_suspend', lockData.id, { scope_type, scope_value, reason }, req);

        console.log(`[SUPER-ADMIN-LOCKS] Emergency suspension: ${scope_type}:${scope_value}`);

        return new Response(JSON.stringify({
          success: true,
          data: { lock: lockData }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'request-global-lock': {
        const { reason, affected_scope } = body;

        if (!reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Super Admin cannot trigger global lock, only REQUEST it
        const { data: requestData, error: requestError } = await supabase
          .from('super_admin_locks')
          .insert({
            lock_type: 'emergency',
            lock_target: 'GLOBAL_LOCK_REQUEST',
            scope_context: session.assigned_scope,
            locked_by: user.id,
            lock_reason: reason,
            is_active: false, // Not active until approved
            is_global_request: true,
            global_request_status: 'pending'
          })
          .select()
          .single();

        if (requestError) {
          console.error('[SUPER-ADMIN-LOCKS] Global lock request error:', requestError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to submit global lock request' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Log security event for escalation
        await supabase.from('super_admin_security_events').insert({
          event_type: 'global_lock_request',
          severity: 'critical',
          action_taken: 'global_lock_requested',
          action_taken_by: user.id,
          action_taken_at: new Date().toISOString(),
          event_data: { reason, affected_scope, request_id: requestData.id }
        });

        await logLockAction(supabase, user.id, session.id, 'request_global_lock', requestData.id, { reason, affected_scope }, req);

        console.log(`[SUPER-ADMIN-LOCKS] Global lock requested by: ${user.id}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'Global lock request submitted for review',
          data: { request: requestData }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'unlock': {
        const { lock_id, reason } = body;

        if (!lock_id || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'lock_id and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Get lock details first
        const { data: lockDetails } = await supabase
          .from('super_admin_locks')
          .select('*')
          .eq('id', lock_id)
          .single();

        if (!lockDetails) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Lock not found' 
          }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { error } = await supabase
          .from('super_admin_locks')
          .update({
            is_active: false,
            unlocked_by: user.id,
            unlocked_at: new Date().toISOString(),
            unlock_reason: reason
          })
          .eq('id', lock_id);

        if (error) {
          console.error('[SUPER-ADMIN-LOCKS] Unlock error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to unlock' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // If module lock, re-enable module
        if (lockDetails.lock_type === 'module') {
          await supabase
            .from('super_admin_module_controls')
            .update({
              is_enabled: true,
              enabled_by: user.id,
              enabled_at: new Date().toISOString()
            })
            .eq('module_name', lockDetails.lock_target);
        }

        await logLockAction(supabase, user.id, session.id, 'unlock', lock_id, { reason, lock_type: lockDetails.lock_type }, req);

        console.log(`[SUPER-ADMIN-LOCKS] Unlocked: ${lock_id}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'Unlocked successfully'
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Unknown action' 
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SUPER-ADMIN-LOCKS] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), { status: errorMessage.includes('Authorization') ? 401 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
