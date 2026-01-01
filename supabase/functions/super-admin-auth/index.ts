import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================
// SUPER ADMIN AUTH API
// Login, Logout, Session Validation, JWT Management
// ============================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();
    const body = req.method !== 'GET' ? await req.json() : {};
    
    // Get device info from headers
    const deviceFingerprint = req.headers.get('x-device-fingerprint') || 'unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const geoLocation = req.headers.get('cf-ipcountry') || 'unknown';

    console.log(`[SUPER-ADMIN-AUTH] Action: ${action}, IP: ${ipAddress}`);

    switch (action) {
      case 'login': {
        const { email, password } = body;
        
        if (!email || !password) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Email and password required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Authenticate user
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError || !authData.user) {
          console.error('[SUPER-ADMIN-AUTH] Login failed:', authError?.message);
          
          // Log failed attempt
          await supabase.from('super_admin_security_events').insert({
            event_type: 'login_failed',
            severity: 'medium',
            source_ip: ipAddress,
            event_data: { email, reason: authError?.message, user_agent: userAgent }
          });

          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Invalid credentials' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const userId = authData.user.id;

        // Check if user has super_admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'super_admin')
          .single();

        if (roleError || !roleData) {
          console.error('[SUPER-ADMIN-AUTH] Not a super admin:', userId);
          await supabase.auth.signOut();
          
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Access denied: Not a Super Admin' 
          }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Get assigned scope
        const { data: scopeData } = await supabase
          .from('super_admin_scope_assignments')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true);

        // Create session record
        const sessionToken = crypto.randomUUID();
        const { data: sessionData, error: sessionError } = await supabase
          .from('super_admin_sessions')
          .insert({
            user_id: userId,
            session_token: sessionToken,
            device_fingerprint: deviceFingerprint,
            ip_address: ipAddress,
            geo_location: geoLocation,
            user_agent: userAgent,
            assigned_scope: scopeData || [],
            is_active: true,
            login_at: new Date().toISOString()
          })
          .select()
          .single();

        if (sessionError) {
          console.error('[SUPER-ADMIN-AUTH] Session creation failed:', sessionError);
        }

        // Log successful login to blackbox
        await supabase.from('blackbox_events').insert({
          event_type: 'super_admin_login',
          module_name: 'authentication',
          user_id: userId,
          role_name: 'super_admin',
          ip_address: ipAddress,
          device_fingerprint: deviceFingerprint,
          geo_location: geoLocation,
          user_agent: userAgent,
          is_sealed: true,
          metadata: { session_id: sessionData?.id }
        });

        // Log to actions
        await supabase.from('super_admin_actions').insert({
          user_id: userId,
          session_id: sessionData?.id,
          action_type: 'login',
          action_category: 'authentication',
          ip_address: ipAddress,
          device_fingerprint: deviceFingerprint,
          result_status: 'success'
        });

        console.log('[SUPER-ADMIN-AUTH] Login successful:', userId);

        return new Response(JSON.stringify({
          success: true,
          data: {
            user: authData.user,
            session: authData.session,
            super_admin_session: sessionData,
            scope: scopeData
          }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'logout': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Authorization required' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Invalid session' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { reason } = body;

        // Update session record
        await supabase
          .from('super_admin_sessions')
          .update({
            is_active: false,
            logout_at: new Date().toISOString(),
            logout_reason: reason || 'manual_logout'
          })
          .eq('user_id', user.id)
          .eq('is_active', true);

        // Log to blackbox
        await supabase.from('blackbox_events').insert({
          event_type: 'super_admin_logout',
          module_name: 'authentication',
          user_id: user.id,
          role_name: 'super_admin',
          ip_address: ipAddress,
          is_sealed: true,
          metadata: { reason: reason || 'manual_logout' }
        });

        // Log action
        await supabase.from('super_admin_actions').insert({
          user_id: user.id,
          action_type: 'logout',
          action_category: 'authentication',
          ip_address: ipAddress,
          result_status: 'success',
          action_data: { reason }
        });

        console.log('[SUPER-ADMIN-AUTH] Logout successful:', user.id);

        return new Response(JSON.stringify({
          success: true,
          message: 'Logged out successfully'
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'validate': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Authorization required' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
          return new Response(JSON.stringify({ 
            success: false, 
            valid: false,
            error: 'Invalid token' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Check active session
        const { data: sessionData } = await supabase
          .from('super_admin_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('login_at', { ascending: false })
          .limit(1)
          .single();

        if (!sessionData) {
          return new Response(JSON.stringify({ 
            success: false, 
            valid: false,
            error: 'No active session' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Update last activity
        await supabase
          .from('super_admin_sessions')
          .update({ last_activity_at: new Date().toISOString() })
          .eq('id', sessionData.id);

        return new Response(JSON.stringify({
          success: true,
          valid: true,
          data: {
            user_id: user.id,
            session: sessionData,
            scope: sessionData.assigned_scope
          }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'refresh': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Authorization required' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { refresh_token } = body;
        if (!refresh_token) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Refresh token required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token
        });

        if (refreshError || !refreshData.session) {
          console.error('[SUPER-ADMIN-AUTH] Token refresh failed:', refreshError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Token refresh failed' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        console.log('[SUPER-ADMIN-AUTH] Token refreshed:', refreshData.user?.id);

        return new Response(JSON.stringify({
          success: true,
          data: {
            session: refreshData.session
          }
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'force-logout': {
        // Force logout a specific user (admin action)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Authorization required' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user: adminUser }, error: adminError } = await supabase.auth.getUser(token);

        if (adminError || !adminUser) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Invalid session' 
          }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { target_user_id, reason } = body;

        if (!target_user_id || !reason) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Target user ID and reason required' 
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Force logout target user
        await supabase
          .from('super_admin_sessions')
          .update({
            is_active: false,
            logout_at: new Date().toISOString(),
            logout_reason: 'force_logout',
            force_logged_out: true
          })
          .eq('user_id', target_user_id)
          .eq('is_active', true);

        // Log to blackbox
        await supabase.from('blackbox_events').insert({
          event_type: 'force_logout',
          module_name: 'security',
          user_id: adminUser.id,
          entity_id: target_user_id,
          entity_type: 'user',
          role_name: 'super_admin',
          ip_address: ipAddress,
          is_sealed: true,
          risk_score: 70,
          metadata: { target_user_id, reason }
        });

        // Log security event
        await supabase.from('super_admin_security_events').insert({
          event_type: 'force_logout',
          severity: 'high',
          source_ip: ipAddress,
          target_user_id: target_user_id,
          action_taken: 'force_logout_executed',
          action_taken_by: adminUser.id,
          action_taken_at: new Date().toISOString(),
          event_data: { reason }
        });

        console.log('[SUPER-ADMIN-AUTH] Force logout executed:', target_user_id);

        return new Response(JSON.stringify({
          success: true,
          message: 'User force logged out'
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
    console.error('[SUPER-ADMIN-AUTH] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
