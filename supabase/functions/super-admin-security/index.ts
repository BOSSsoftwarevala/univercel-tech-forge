import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================
// SUPER ADMIN SECURITY API
// Security Monitor, IP Control, Alerts
// CRITICAL API - All actions logged
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

async function logSecurityAction(supabase: any, userId: string, sessionId: string, actionType: string, targetId: string | null, actionData: any, req: Request) {
  const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
  const deviceFingerprint = req.headers.get('x-device-fingerprint') || 'unknown';

  // Log to actions
  await supabase.from('super_admin_actions').insert({
    user_id: userId,
    session_id: sessionId,
    action_type: actionType,
    action_category: 'security',
    target_entity: 'security_event',
    target_id: targetId,
    action_data: actionData,
    ip_address: ipAddress,
    device_fingerprint: deviceFingerprint,
    is_sensitive: true,
    result_status: 'success'
  });

  // Log to blackbox (CRITICAL)
  await supabase.from('blackbox_events').insert({
    event_type: actionType,
    module_name: 'security',
    user_id: userId,
    entity_id: targetId,
    entity_type: 'security',
    role_name: 'super_admin',
    ip_address: ipAddress,
    device_fingerprint: deviceFingerprint,
    is_sealed: true,
    risk_score: 80,
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

    console.log(`[SUPER-ADMIN-SECURITY] User: ${user.id}, Action: ${action}`);

    switch (action) {
      case 'events': {
        const { 
          limit = 50, 
          offset = 0, 
          severity,
          event_type,
          is_resolved,
          start_date,
          end_date 
        } = body;

        let query = supabase
          .from('super_admin_security_events')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (severity) query = query.eq('severity', severity);
        if (event_type) query = query.eq('event_type', event_type);
        if (is_resolved !== undefined) query = query.eq('is_resolved', is_resolved);
        if (start_date) query = query.gte('created_at', start_date);
        if (end_date) query = query.lte('created_at', end_date);

        const { data, error, count } = await query;

        if (error) {
          console.error('[SUPER-ADMIN-SECURITY] Events error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch events' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logSecurityAction(supabase, user.id, session.id, 'view_security_events', null, { filters: { severity, event_type, is_resolved } }, req);

        return new Response(JSON.stringify({
          success: true,
          data: { events: data, total: count }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'login-failures': {
        const { limit = 50, user_id } = body;

        let query = supabase
          .from('super_admin_security_events')
          .select('*')
          .eq('event_type', 'login_failed')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (user_id) query = query.eq('target_user_id', user_id);

        const { data, error } = await query;

        if (error) {
          console.error('[SUPER-ADMIN-SECURITY] Login failures error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch login failures' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logSecurityAction(supabase, user.id, session.id, 'view_login_failures', null, { limit, user_id }, req);

        return new Response(JSON.stringify({
          success: true,
          data: { failures: data }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'ip-activity': {
        const { ip_address, limit = 50 } = body;

        if (!ip_address) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'ip_address required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data, error } = await supabase
          .from('super_admin_security_events')
          .select('*')
          .eq('source_ip', ip_address)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('[SUPER-ADMIN-SECURITY] IP activity error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch IP activity' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logSecurityAction(supabase, user.id, session.id, 'view_ip_activity', null, { ip_address }, req);

        return new Response(JSON.stringify({
          success: true,
          data: { activity: data }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'block-ip': {
        const { ip_address, reason, expires_in_hours } = body;

        if (!ip_address || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'ip_address and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const expiresAt = expires_in_hours 
          ? new Date(Date.now() + expires_in_hours * 60 * 60 * 1000).toISOString()
          : null;

        const { data, error } = await supabase
          .from('access_lists')
          .insert({
            list_type: 'blacklist',
            entry_type: 'ip',
            entry_value: ip_address,
            reason,
            added_by: user.id,
            is_active: true,
            expires_at: expiresAt
          })
          .select()
          .single();

        if (error) {
          console.error('[SUPER-ADMIN-SECURITY] Block IP error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to block IP' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Log security event
        await supabase.from('super_admin_security_events').insert({
          event_type: 'ip_blocked',
          severity: 'high',
          source_ip: ip_address,
          action_taken: 'ip_blocked',
          action_taken_by: user.id,
          action_taken_at: new Date().toISOString(),
          event_data: { reason, expires_in_hours }
        });

        await logSecurityAction(supabase, user.id, session.id, 'block_ip', data.id, { ip_address, reason, expires_in_hours }, req);

        console.log(`[SUPER-ADMIN-SECURITY] IP blocked: ${ip_address}`);

        return new Response(JSON.stringify({
          success: true,
          data: { block: data }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'unblock-ip': {
        const { ip_address, reason } = body;

        if (!ip_address || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'ip_address and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { error } = await supabase
          .from('access_lists')
          .update({ is_active: false })
          .eq('entry_type', 'ip')
          .eq('entry_value', ip_address)
          .eq('is_active', true);

        if (error) {
          console.error('[SUPER-ADMIN-SECURITY] Unblock IP error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to unblock IP' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Log security event
        await supabase.from('super_admin_security_events').insert({
          event_type: 'ip_unblocked',
          severity: 'medium',
          source_ip: ip_address,
          action_taken: 'ip_unblocked',
          action_taken_by: user.id,
          action_taken_at: new Date().toISOString(),
          event_data: { reason }
        });

        await logSecurityAction(supabase, user.id, session.id, 'unblock_ip', null, { ip_address, reason }, req);

        console.log(`[SUPER-ADMIN-SECURITY] IP unblocked: ${ip_address}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'IP unblocked successfully'
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'lock-user-security': {
        const { user_id, reason, severity = 'high' } = body;

        if (!user_id || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'user_id and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Create security lock
        const { data: lockData, error: lockError } = await supabase
          .from('super_admin_locks')
          .insert({
            lock_type: 'user',
            lock_target: 'user_security',
            lock_target_id: user_id,
            locked_by: user.id,
            lock_reason: reason,
            is_active: true,
            force_logout_triggered: true
          })
          .select()
          .single();

        if (lockError) {
          console.error('[SUPER-ADMIN-SECURITY] Lock user error:', lockError);
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

        // Log security event
        await supabase.from('super_admin_security_events').insert({
          event_type: 'user_security_lock',
          severity,
          target_user_id: user_id,
          action_taken: 'user_locked_for_security',
          action_taken_by: user.id,
          action_taken_at: new Date().toISOString(),
          event_data: { reason, lock_id: lockData.id }
        });

        await logSecurityAction(supabase, user.id, session.id, 'security_lock_user', user_id, { reason, severity, lock_id: lockData.id }, req);

        console.log(`[SUPER-ADMIN-SECURITY] User security locked: ${user_id}`);

        return new Response(JSON.stringify({
          success: true,
          data: { lock: lockData }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'resolve-event': {
        const { event_id, resolution_notes } = body;

        if (!event_id || !resolution_notes) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'event_id and resolution_notes required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { error } = await supabase
          .from('super_admin_security_events')
          .update({
            is_resolved: true,
            resolution_notes,
            action_taken_by: user.id,
            action_taken_at: new Date().toISOString()
          })
          .eq('id', event_id);

        if (error) {
          console.error('[SUPER-ADMIN-SECURITY] Resolve event error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to resolve event' 
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        await logSecurityAction(supabase, user.id, session.id, 'resolve_security_event', event_id, { resolution_notes }, req);

        return new Response(JSON.stringify({
          success: true,
          message: 'Event resolved successfully'
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'alerts-summary': {
        // Get summary of unresolved security alerts
        const { data: criticalData } = await supabase
          .from('super_admin_security_events')
          .select('id', { count: 'exact' })
          .eq('severity', 'critical')
          .eq('is_resolved', false);

        const { data: highData } = await supabase
          .from('super_admin_security_events')
          .select('id', { count: 'exact' })
          .eq('severity', 'high')
          .eq('is_resolved', false);

        const { data: recentData } = await supabase
          .from('super_admin_security_events')
          .select('*')
          .eq('is_resolved', false)
          .order('created_at', { ascending: false })
          .limit(10);

        await logSecurityAction(supabase, user.id, session.id, 'view_alerts_summary', null, {}, req);

        return new Response(JSON.stringify({
          success: true,
          data: {
            critical_count: criticalData?.length || 0,
            high_count: highData?.length || 0,
            recent_alerts: recentData || []
          }
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
    console.error('[SUPER-ADMIN-SECURITY] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), { status: errorMessage.includes('Authorization') ? 401 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
