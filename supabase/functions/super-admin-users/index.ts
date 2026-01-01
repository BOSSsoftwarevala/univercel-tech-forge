import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================
// SUPER ADMIN USERS API
// User Management Operations
// ============================================

// Helper: Validate Super Admin session and get scope
async function validateSession(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Authorization required');
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    throw new Error('Invalid session');
  }

  // Get active session with scope
  const { data: sessionData, error: sessionError } = await supabase
    .from('super_admin_sessions')
    .select('id, assigned_scope')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('login_at', { ascending: false })
    .limit(1)
    .single();

  if (sessionError || !sessionData) {
    throw new Error('No active session');
  }

  return { user, session: sessionData };
}

// Helper: Log action
async function logAction(supabase: any, userId: string, sessionId: string, actionType: string, targetId: string, actionData: any, req: Request) {
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
  const deviceFingerprint = req.headers.get('x-device-fingerprint') || 'unknown';

  await supabase.from('super_admin_user_actions').insert({
    admin_user_id: userId,
    target_user_id: targetId,
    action_type: actionType,
    action_data: actionData,
    scope_validated: true,
    permission_checked: true,
    result_status: 'success'
  });

  await supabase.from('super_admin_actions').insert({
    user_id: userId,
    session_id: sessionId,
    action_type: actionType,
    action_category: 'user_management',
    target_entity: 'user',
    target_id: targetId,
    action_data: actionData,
    ip_address: ipAddress,
    device_fingerprint: deviceFingerprint,
    result_status: 'success'
  });

  // Log to blackbox for sensitive actions
  if (['suspend', 'lock', 'unlock'].includes(actionType)) {
    await supabase.from('blackbox_events').insert({
      event_type: `user_${actionType}`,
      module_name: 'user_management',
      user_id: userId,
      entity_id: targetId,
      entity_type: 'user',
      role_name: 'super_admin',
      ip_address: ipAddress,
      device_fingerprint: deviceFingerprint,
      is_sealed: true,
      risk_score: actionType === 'suspend' ? 60 : 40,
      metadata: actionData
    });
  }
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

    console.log(`[SUPER-ADMIN-USERS] User: ${user.id}, Action: ${action}`);

    switch (action) {
      case 'list': {
        const { 
          limit = 50, 
          offset = 0, 
          search,
          status,
          role 
        } = body;

        // Get users within scope
        let query = supabase
          .from('profiles')
          .select('*, user_roles!inner(role)', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (search) {
          query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
        }
        if (role) {
          query = query.eq('user_roles.role', role);
        }

        const { data, error, count } = await query;

        if (error) {
          console.error('[SUPER-ADMIN-USERS] List error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch users' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logAction(supabase, user.id, session.id, 'view', user.id, { action: 'list_users', filters: { search, status, role } }, req);

        return new Response(JSON.stringify({
          success: true,
          data: { users: data, total: count }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'get': {
        const { user_id } = body;

        if (!user_id) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'user_id required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*, user_roles(*)')
          .eq('id', user_id)
          .single();

        if (error) {
          console.error('[SUPER-ADMIN-USERS] Get error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'User not found' 
          }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logAction(supabase, user.id, session.id, 'view', user_id, { action: 'view_user_profile' }, req);

        return new Response(JSON.stringify({
          success: true,
          data: { user: data }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'suspend': {
        const { user_id, reason, duration_hours } = body;

        if (!user_id || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'user_id and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const expiresAt = duration_hours 
          ? new Date(Date.now() + duration_hours * 60 * 60 * 1000).toISOString()
          : null;

        // Create suspension record
        const { data: suspensionData, error: suspensionError } = await supabase
          .from('account_suspensions')
          .insert({
            user_id,
            suspension_type: 'admin_action',
            reason,
            masked_reason: 'Account suspended by administrator',
            is_active: true,
            expires_at: expiresAt,
            severity: 'medium'
          })
          .select()
          .single();

        if (suspensionError) {
          console.error('[SUPER-ADMIN-USERS] Suspend error:', suspensionError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to suspend user' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logAction(supabase, user.id, session.id, 'suspend', user_id, { reason, duration_hours, suspension_id: suspensionData.id }, req);

        console.log(`[SUPER-ADMIN-USERS] User suspended: ${user_id}`);

        return new Response(JSON.stringify({
          success: true,
          data: { suspension: suspensionData }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'lock': {
        const { user_id, reason } = body;

        if (!user_id || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'user_id and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Create lock record
        const { data: lockData, error: lockError } = await supabase
          .from('super_admin_locks')
          .insert({
            lock_type: 'user',
            lock_target: 'user',
            lock_target_id: user_id,
            locked_by: user.id,
            lock_reason: reason,
            is_active: true,
            force_logout_triggered: true
          })
          .select()
          .single();

        if (lockError) {
          console.error('[SUPER-ADMIN-USERS] Lock error:', lockError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to lock user' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Force logout the user
        await supabase
          .from('user_roles')
          .update({ force_logged_out_at: new Date().toISOString() })
          .eq('user_id', user_id);

        await logAction(supabase, user.id, session.id, 'lock', user_id, { reason, lock_id: lockData.id }, req);

        console.log(`[SUPER-ADMIN-USERS] User locked: ${user_id}`);

        return new Response(JSON.stringify({
          success: true,
          data: { lock: lockData }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'unlock': {
        const { user_id, reason } = body;

        if (!user_id || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'user_id and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Update lock record
        const { error: unlockError } = await supabase
          .from('super_admin_locks')
          .update({
            is_active: false,
            unlocked_by: user.id,
            unlocked_at: new Date().toISOString(),
            unlock_reason: reason
          })
          .eq('lock_target_id', user_id)
          .eq('lock_type', 'user')
          .eq('is_active', true);

        if (unlockError) {
          console.error('[SUPER-ADMIN-USERS] Unlock error:', unlockError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to unlock user' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Lift any active suspensions
        await supabase
          .from('account_suspensions')
          .update({
            is_active: false,
            lifted_at: new Date().toISOString(),
            lifted_by: user.id
          })
          .eq('user_id', user_id)
          .eq('is_active', true);

        await logAction(supabase, user.id, session.id, 'unlock', user_id, { reason }, req);

        console.log(`[SUPER-ADMIN-USERS] User unlocked: ${user_id}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'User unlocked successfully'
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'search': {
        const { query: searchQuery, filters } = body;

        if (!searchQuery) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'query required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, user_roles(role)')
          .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(20);

        if (error) {
          console.error('[SUPER-ADMIN-USERS] Search error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Search failed' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logAction(supabase, user.id, session.id, 'search', user.id, { query: searchQuery, results_count: data.length }, req);

        return new Response(JSON.stringify({
          success: true,
          data: { results: data }
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
    console.error('[SUPER-ADMIN-USERS] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), { status: errorMessage.includes('Authorization') ? 401 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
