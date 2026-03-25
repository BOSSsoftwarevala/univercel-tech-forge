import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface BlackboxEvent {
  event_type: string;
  module_name: string;
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  role_name?: string;
  ip_address?: string;
  geo_location?: string;
  device_fingerprint?: string;
  risk_score?: number;
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// BLACKBOX LOGGING - MANDATORY FOR ALL ACTIONS
// ═══════════════════════════════════════════════════════════════
async function logToBlackbox(supabase: any, event: BlackboxEvent): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('log_to_blackbox', {
      p_event_type: event.event_type,
      p_module_name: event.module_name,
      p_entity_type: event.entity_type || null,
      p_entity_id: event.entity_id || null,
      p_user_id: event.user_id || null,
      p_role_name: event.role_name || null,
      p_ip_address: event.ip_address || null,
      p_geo_location: event.geo_location || null,
      p_device_fingerprint: event.device_fingerprint || null,
      p_risk_score: event.risk_score || 0,
      p_metadata: event.metadata || {}
    });
    
    if (error) {
      console.error('Blackbox logging error:', error);
      return null;
    }
    
    console.log('Blackbox event logged:', data);
    return data;
  } catch (err) {
    console.error('Blackbox logging exception:', err);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM LOCK CHECK - OVERRIDES ALL APIs
// ═══════════════════════════════════════════════════════════════
async function isSystemLocked(supabase: any, scope: string = 'global', targetId?: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_system_locked', {
      p_scope: scope,
      p_target_id: targetId || null
    });
    
    if (error) {
      console.error('System lock check error:', error);
      return false;
    }
    
    return data === true;
  } catch (err) {
    console.error('System lock check exception:', err);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// RENTAL CHECK - AUTO-BLOCKS IF EXPIRED
// ═══════════════════════════════════════════════════════════════
async function checkRentalActive(supabase: any, userId: string, featureCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_rental_active', {
      p_user_id: userId,
      p_feature_code: featureCode
    });
    
    if (error) {
      console.error('Rental check error:', error);
      return false;
    }
    
    return data === true;
  } catch (err) {
    console.error('Rental check exception:', err);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// PERMISSION CHECK
// ═══════════════════════════════════════════════════════════════
async function checkPermission(supabase: any, userId: string, permissionCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('master_user_has_permission', {
      p_user_id: userId,
      p_permission_code: permissionCode
    });
    
    if (error) {
      console.error('Permission check error:', error);
      return false;
    }
    
    return data === true;
  } catch (err) {
    console.error('Permission check exception:', err);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// GET USER FROM JWT
// ═══════════════════════════════════════════════════════════════
async function getUserFromToken(supabase: any, authHeader: string): Promise<any> {
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  // Get master user profile
  const { data: masterUser } = await supabase
    .from('master_users')
    .select('*, master_roles(*)')
    .eq('auth_user_id', user.id)
    .single();
  
  return masterUser || { id: user.id, auth_user_id: user.id };
}

// ═══════════════════════════════════════════════════════════════
// API ROUTER
// ═══════════════════════════════════════════════════════════════
serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/master-admin-api', '');
  const method = req.method;
  
  console.log(`[Master Admin API] ${method} ${path}`);
  
  // Get client IP
  const clientIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  const deviceFingerprint = req.headers.get('x-device-fingerprint') || null;
  const userAgent = req.headers.get('user-agent') || null;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // ─────────────────────────────────────────────────────────────
    // SYSTEM LOCK CHECK (except unlock endpoint)
    // ─────────────────────────────────────────────────────────────
    if (!path.includes('/system/unlock') && !path.includes('/auth/login')) {
      const locked = await isSystemLocked(supabase);
      if (locked) {
        await logToBlackbox(supabase, {
          event_type: 'error',
          module_name: 'api_gateway',
          metadata: { reason: 'system_locked', path, method },
          ip_address: clientIP,
          risk_score: 50
        });
        
        return new Response(JSON.stringify({
          success: false,
          error: 'SYSTEM_LOCKED',
          message: 'System is currently locked. Contact Master Admin.'
        }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    // ─────────────────────────────────────────────────────────────
    // AUTH ENDPOINTS (No token required)
    // ─────────────────────────────────────────────────────────────
    if (path === '/auth/login' && method === 'POST') {
      return await handleLogin(req, supabase, clientIP, deviceFingerprint);
    }
    
    if (path === '/auth/refresh' && method === 'POST') {
      return await handleRefresh(req, supabase, clientIP);
    }
    
    // ─────────────────────────────────────────────────────────────
    // PROTECTED ENDPOINTS (Token required)
    // ─────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authorization header required'
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    const user = await getUserFromToken(supabase, authHeader);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    const roleName = user.master_roles?.name || 'unknown';
    
    // ─────────────────────────────────────────────────────────────
    // ROUTE HANDLERS
    // ─────────────────────────────────────────────────────────────
    
    // AUTH: Logout
    if (path === '/auth/logout' && method === 'POST') {
      return await handleLogout(req, supabase, user, clientIP, roleName);
    }
    
    // USERS
    if (path === '/users' && method === 'GET') {
      return await handleGetUsers(supabase, user, clientIP, roleName);
    }
    if (path === '/users' && method === 'POST') {
      return await handleCreateUser(req, supabase, user, clientIP, roleName);
    }
    if (path.match(/^\/users\/[\w-]+$/) && method === 'PUT') {
      const userId = path.split('/')[2];
      return await handleUpdateUser(req, supabase, user, userId, clientIP, roleName);
    }
    
    // ROLES
    if (path === '/roles' && method === 'GET') {
      return await handleGetRoles(supabase, user, clientIP, roleName);
    }
    if (path === '/roles' && method === 'POST') {
      return await handleCreateRole(req, supabase, user, clientIP, roleName);
    }
    if (path.match(/^\/roles\/[\w-]+\/permissions$/) && method === 'POST') {
      const roleId = path.split('/')[2];
      return await handleAssignPermissions(req, supabase, user, roleId, clientIP, roleName);
    }
    
    // CONTINENTS & COUNTRIES
    if (path === '/continents' && method === 'GET') {
      return await handleGetContinents(supabase, user, clientIP, roleName);
    }
    if (path === '/continents' && method === 'POST') {
      return await handleCreateContinent(req, supabase, user, clientIP, roleName);
    }
    if (path === '/countries' && method === 'GET') {
      const continentId = url.searchParams.get('continent_id');
      return await handleGetCountries(supabase, user, continentId, clientIP, roleName);
    }
    
    // BLACKBOX (Read-only for super_admin/auditor)
    if (path === '/blackbox/events' && method === 'GET') {
      return await handleGetBlackboxEvents(supabase, user, url.searchParams, clientIP, roleName);
    }
    
    // SUPER ADMINS
    if (path === '/super-admins' && method === 'GET') {
      return await handleGetSuperAdmins(supabase, user, clientIP, roleName);
    }
    if (path === '/super-admins/assign' && method === 'POST') {
      return await handleAssignSuperAdmin(req, supabase, user, clientIP, roleName);
    }
    if (path === '/super-admins/revoke' && method === 'POST') {
      return await handleRevokeSuperAdmin(req, supabase, user, clientIP, roleName);
    }
    
    // GLOBAL RULES
    if (path === '/rules' && method === 'GET') {
      return await handleGetRules(supabase, user, clientIP, roleName);
    }
    if (path === '/rules' && method === 'POST') {
      return await handleCreateRule(req, supabase, user, clientIP, roleName);
    }
    if (path.match(/^\/rules\/[\w-]+$/) && method === 'PUT') {
      const ruleId = path.split('/')[2];
      return await handleUpdateRule(req, supabase, user, ruleId, clientIP, roleName);
    }
    if (path.match(/^\/rules\/[\w-]+\/execute$/) && method === 'POST') {
      const ruleId = path.split('/')[2];
      return await handleExecuteRule(req, supabase, user, ruleId, clientIP, roleName);
    }
    
    // APPROVALS
    if (path === '/approvals' && method === 'POST') {
      return await handleCreateApproval(req, supabase, user, clientIP, roleName);
    }
    if (path === '/approvals/pending' && method === 'GET') {
      return await handleGetPendingApprovals(supabase, user, clientIP, roleName);
    }
    if (path.match(/^\/approvals\/[\w-]+\/decision$/) && method === 'POST') {
      const approvalId = path.split('/')[2];
      return await handleApprovalDecision(req, supabase, user, approvalId, clientIP, roleName);
    }
    
    // SECURITY
    if (path === '/security/events' && method === 'GET') {
      return await handleGetSecurityEvents(supabase, user, url.searchParams, clientIP, roleName);
    }
    if (path === '/security/block-ip' && method === 'POST') {
      return await handleBlockIP(req, supabase, user, clientIP, roleName);
    }
    if (path === '/security/unblock-ip' && method === 'POST') {
      return await handleUnblockIP(req, supabase, user, clientIP, roleName);
    }
    
    // SYSTEM LOCK
    if (path === '/system/lock' && method === 'POST') {
      return await handleSystemLock(req, supabase, user, clientIP, roleName);
    }
    if (path === '/system/unlock' && method === 'POST') {
      return await handleSystemUnlock(req, supabase, user, clientIP, roleName);
    }
    
    // AUDIT (Read-only)
    if (path === '/audit/logs' && method === 'GET') {
      return await handleGetAuditLogs(supabase, user, url.searchParams, clientIP, roleName);
    }
    if (path === '/audit/export' && method === 'POST') {
      return await handleAuditExport(req, supabase, user, clientIP, roleName);
    }
    
    // RENTALS
    if (path === '/rentals/plans' && method === 'GET') {
      return await handleGetRentalPlans(supabase, user, clientIP, roleName);
    }
    if (path === '/rentals/activate' && method === 'POST') {
      return await handleActivateRental(req, supabase, user, clientIP, roleName);
    }
    if (path === '/rentals/revoke' && method === 'POST') {
      return await handleRevokeRental(req, supabase, user, clientIP, roleName);
    }
    
    // AI WATCHER
    if (path === '/ai/alerts' && method === 'GET') {
      return await handleGetAIAlerts(supabase, user, clientIP, roleName);
    }
    if (path === '/ai/analyze' && method === 'POST') {
      return await handleAIAnalyze(req, supabase, user, clientIP, roleName);
    }
    
    // 404 - Not Found
    await logToBlackbox(supabase, {
      event_type: 'error',
      module_name: 'api_gateway',
      user_id: user.id,
      role_name: roleName,
      ip_address: clientIP,
      metadata: { reason: 'not_found', path, method },
      risk_score: 10
    });
    
    return new Response(JSON.stringify({
      success: false,
      error: 'NOT_FOUND',
      message: `Endpoint ${method} ${path} not found`
    }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    await logToBlackbox(supabase, {
      event_type: 'error',
      module_name: 'api_gateway',
      ip_address: clientIP,
      metadata: { error: error instanceof Error ? error.message : 'Unknown error', path, method },
      risk_score: 70
    });
    
    return new Response(JSON.stringify({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An internal error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// HANDLER IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════

// AUTH: Login
async function handleLogin(req: Request, supabase: any, clientIP: string, deviceFingerprint: string | null) {
  const { email, password } = await req.json();
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    await logToBlackbox(supabase, {
      event_type: 'error',
      module_name: 'auth',
      ip_address: clientIP,
      device_fingerprint: deviceFingerprint || undefined,
      metadata: { reason: 'login_failed', email },
      risk_score: 40
    });
    
    return new Response(JSON.stringify({
      success: false,
      error: 'LOGIN_FAILED',
      message: error.message
    }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  // Get master user with permissions
  const { data: masterUser } = await supabase
    .from('master_users')
    .select('*, master_roles(*, master_role_permissions(master_permissions(*)))')
    .eq('auth_user_id', data.user.id)
    .single();
  
  // Update login stats
  if (masterUser) {
    await supabase
      .from('master_users')
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: clientIP,
        login_count: (masterUser.login_count || 0) + 1,
        failed_login_count: 0
      })
      .eq('id', masterUser.id);
  }
  
  await logToBlackbox(supabase, {
    event_type: 'login',
    module_name: 'auth',
    user_id: data.user.id,
    role_name: masterUser?.master_roles?.name || 'unknown',
    ip_address: clientIP,
    device_fingerprint: deviceFingerprint || undefined,
    metadata: { email },
    risk_score: 0
  });
  
  return new Response(JSON.stringify({
    success: true,
    data: {
      session: data.session,
      user: masterUser || data.user,
      permissions: masterUser?.master_roles?.master_role_permissions?.map(
        (rp: any) => rp.master_permissions?.permission_code
      ) || []
    }
  }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// AUTH: Refresh
async function handleRefresh(req: Request, supabase: any, clientIP: string) {
  const { refresh_token } = await req.json();
  
  const { data, error } = await supabase.auth.refreshSession({ refresh_token });
  
  if (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'REFRESH_FAILED',
      message: error.message
    }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'update',
    module_name: 'auth',
    user_id: data.user?.id,
    ip_address: clientIP,
    metadata: { action: 'token_refresh' },
    risk_score: 0
  });
  
  return new Response(JSON.stringify({
    success: true,
    data: { session: data.session }
  }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// AUTH: Logout
async function handleLogout(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  await supabase.auth.signOut();
  
  await logToBlackbox(supabase, {
    event_type: 'logout',
    module_name: 'auth',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// USERS: Get
async function handleGetUsers(supabase: any, user: any, clientIP: string, roleName: string) {
  const { data, error } = await supabase
    .from('master_users')
    .select('*, master_roles(name, display_name)')
    .order('created_at', { ascending: false });
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'users',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// USERS: Create
async function handleCreateUser(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const body = await req.json();
  
  const { data, error } = await supabase
    .from('master_users')
    .insert(body)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'create',
    module_name: 'users',
    entity_type: 'master_user',
    entity_id: data.id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { created_user_email: body.email },
    risk_score: 20
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// USERS: Update
async function handleUpdateUser(req: Request, supabase: any, user: any, targetUserId: string, clientIP: string, roleName: string) {
  const body = await req.json();
  
  const { data, error } = await supabase
    .from('master_users')
    .update(body)
    .eq('id', targetUserId)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'update',
    module_name: 'users',
    entity_type: 'master_user',
    entity_id: targetUserId,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { updated_fields: Object.keys(body) },
    risk_score: 30
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// ROLES: Get
async function handleGetRoles(supabase: any, user: any, clientIP: string, roleName: string) {
  const { data } = await supabase
    .from('master_roles')
    .select('*, master_role_permissions(master_permissions(*))')
    .order('hierarchy_level', { ascending: false });
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'roles',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// ROLES: Create
async function handleCreateRole(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const body = await req.json();
  
  const { data, error } = await supabase
    .from('master_roles')
    .insert(body)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'create',
    module_name: 'roles',
    entity_type: 'master_role',
    entity_id: data.id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { role_name: body.name },
    risk_score: 50
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// ROLES: Assign Permissions
async function handleAssignPermissions(req: Request, supabase: any, user: any, roleId: string, clientIP: string, roleName: string) {
  const { permission_ids } = await req.json();
  
  const inserts = permission_ids.map((permId: string) => ({
    role_id: roleId,
    permission_id: permId,
    granted_by: user.id
  }));
  
  const { error } = await supabase
    .from('master_role_permissions')
    .upsert(inserts, { onConflict: 'role_id,permission_id' });
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'update',
    module_name: 'roles',
    entity_type: 'master_role',
    entity_id: roleId,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { permissions_assigned: permission_ids.length },
    risk_score: 60
  });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// CONTINENTS: Get
async function handleGetContinents(supabase: any, user: any, clientIP: string, roleName: string) {
  const { data } = await supabase
    .from('master_continents')
    .select('*, master_countries(count)')
    .order('name');
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'continents',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// CONTINENTS: Create
async function handleCreateContinent(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const body = await req.json();
  
  const { data, error } = await supabase
    .from('master_continents')
    .insert(body)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'create',
    module_name: 'continents',
    entity_type: 'master_continent',
    entity_id: data.id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 30
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// COUNTRIES: Get
async function handleGetCountries(supabase: any, user: any, continentId: string | null, clientIP: string, roleName: string) {
  let query = supabase.from('master_countries').select('*, master_continents(name)');
  
  if (continentId) {
    query = query.eq('continent_id', continentId);
  }
  
  const { data } = await query.order('name');
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'countries',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { filter_continent: continentId },
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// BLACKBOX: Get Events
async function handleGetBlackboxEvents(supabase: any, user: any, params: URLSearchParams, clientIP: string, roleName: string) {
  const limit = parseInt(params.get('limit') || '100');
  const module = params.get('module');
  const eventType = params.get('event_type');
  
  let query = supabase
    .from('blackbox_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (module) query = query.eq('module_name', module);
  if (eventType) query = query.eq('event_type', eventType);
  
  const { data } = await query;
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'blackbox',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { filters: { module, eventType, limit } },
    risk_score: 10
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// SUPER ADMINS: Get
async function handleGetSuperAdmins(supabase: any, user: any, clientIP: string, roleName: string) {
  const { data } = await supabase
    .from('master_super_admin_profiles')
    .select('*, master_continents(name)')
    .order('created_at', { ascending: false });
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'super_admins',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 10
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// SUPER ADMINS: Assign
async function handleAssignSuperAdmin(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const body = await req.json();
  
  const { data, error } = await supabase
    .from('master_super_admin_profiles')
    .insert(body)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'create',
    module_name: 'super_admins',
    entity_type: 'super_admin_profile',
    entity_id: data.id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { assigned_user: body.user_id },
    risk_score: 70
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// SUPER ADMINS: Revoke
async function handleRevokeSuperAdmin(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { profile_id, reason } = await req.json();
  
  const { error } = await supabase
    .from('master_super_admin_profiles')
    .update({ status: 'suspended' })
    .eq('id', profile_id);
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'update',
    module_name: 'super_admins',
    entity_type: 'super_admin_profile',
    entity_id: profile_id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { action: 'revoke', reason },
    risk_score: 80
  });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// RULES: Get
async function handleGetRules(supabase: any, user: any, clientIP: string, roleName: string) {
  const { data } = await supabase
    .from('master_global_rules')
    .select('*')
    .order('created_at', { ascending: false });
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'global_rules',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// RULES: Create
async function handleCreateRule(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const body = await req.json();
  body.created_by = user.id;
  
  const { data, error } = await supabase
    .from('master_global_rules')
    .insert(body)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'create',
    module_name: 'global_rules',
    entity_type: 'master_rule',
    entity_id: data.id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { rule_name: body.rule_name, rule_type: body.rule_type },
    risk_score: 50
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// RULES: Update
async function handleUpdateRule(req: Request, supabase: any, user: any, ruleId: string, clientIP: string, roleName: string) {
  const body = await req.json();
  
  // Increment version
  const { data: current } = await supabase
    .from('master_global_rules')
    .select('version')
    .eq('id', ruleId)
    .single();
  
  body.version = (current?.version || 0) + 1;
  
  const { data, error } = await supabase
    .from('master_global_rules')
    .update(body)
    .eq('id', ruleId)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'update',
    module_name: 'global_rules',
    entity_type: 'master_rule',
    entity_id: ruleId,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { new_version: body.version },
    risk_score: 60
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// RULES: Execute
async function handleExecuteRule(req: Request, supabase: any, user: any, ruleId: string, clientIP: string, roleName: string) {
  const body = await req.json();
  
  // Log execution
  const blackboxId = await logToBlackbox(supabase, {
    event_type: 'update',
    module_name: 'global_rules',
    entity_type: 'rule_execution',
    entity_id: ruleId,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { execution_params: body },
    risk_score: 70
  });
  
  const { data, error } = await supabase
    .from('master_rule_execution_logs')
    .insert({
      rule_id: ruleId,
      executed_by: user.id,
      execution_result: 'success',
      impact_summary: body.impact || {},
      affected_entities: body.affected_count || 0,
      blackbox_event_id: blackboxId
    })
    .select()
    .single();
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// APPROVALS: Create
async function handleCreateApproval(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const body = await req.json();
  body.requested_by = user.id;
  body.requested_by_role = roleName;
  
  const { data, error } = await supabase
    .from('master_approvals')
    .insert(body)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'create',
    module_name: 'approvals',
    entity_type: 'master_approval',
    entity_id: data.id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { request_type: body.request_type, risk_score: body.risk_score },
    risk_score: body.risk_score || 50
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// APPROVALS: Get Pending
async function handleGetPendingApprovals(supabase: any, user: any, clientIP: string, roleName: string) {
  const { data } = await supabase
    .from('master_approvals')
    .select('*, master_approval_steps(*)')
    .in('status', ['pending', 'in_review'])
    .order('risk_score', { ascending: false });
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'approvals',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// APPROVALS: Decision
async function handleApprovalDecision(req: Request, supabase: any, user: any, approvalId: string, clientIP: string, roleName: string) {
  const { decision, notes } = await req.json();
  
  const blackboxId = await logToBlackbox(supabase, {
    event_type: decision === 'approved' ? 'approve' : 'reject',
    module_name: 'approvals',
    entity_type: 'master_approval',
    entity_id: approvalId,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { decision, notes },
    risk_score: 60
  });
  
  // Update approval
  await supabase
    .from('master_approvals')
    .update({ status: decision })
    .eq('id', approvalId);
  
  // Add approval step
  await supabase
    .from('master_approval_steps')
    .insert({
      approval_id: approvalId,
      step_number: 1,
      approver_role: roleName,
      approver_user_id: user.id,
      status: decision,
      decision_notes: notes,
      decision_at: new Date().toISOString(),
      blackbox_event_id: blackboxId
    });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// SECURITY: Get Events
async function handleGetSecurityEvents(supabase: any, user: any, params: URLSearchParams, clientIP: string, roleName: string) {
  const severity = params.get('severity');
  const resolved = params.get('resolved');
  
  let query = supabase
    .from('master_security_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (severity) query = query.eq('severity', severity);
  if (resolved !== null) query = query.eq('is_resolved', resolved === 'true');
  
  const { data } = await query;
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'security',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 10
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// SECURITY: Block IP
async function handleBlockIP(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { ip_address, reason, risk_level } = await req.json();
  
  const { data, error } = await supabase
    .from('master_ip_watchlist')
    .upsert({
      ip_address,
      is_blocked: true,
      block_reason: reason,
      blocked_by: user.id,
      blocked_at: new Date().toISOString(),
      risk_level: risk_level || 'high'
    }, { onConflict: 'ip_address' })
    .select()
    .single();
  
  await logToBlackbox(supabase, {
    event_type: 'lock',
    module_name: 'security',
    entity_type: 'ip_address',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { blocked_ip: ip_address, reason },
    risk_score: 70
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// SECURITY: Unblock IP
async function handleUnblockIP(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { ip_address } = await req.json();
  
  await supabase
    .from('master_ip_watchlist')
    .update({ is_blocked: false })
    .eq('ip_address', ip_address);
  
  await logToBlackbox(supabase, {
    event_type: 'unlock',
    module_name: 'security',
    entity_type: 'ip_address',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { unblocked_ip: ip_address },
    risk_score: 40
  });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// SYSTEM: Lock
async function handleSystemLock(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { scope, target_id, reason, severity } = await req.json();
  
  const blackboxId = await logToBlackbox(supabase, {
    event_type: 'lock',
    module_name: 'system_lock',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { scope, target_id, reason, severity },
    risk_score: 100
  });
  
  const { data, error } = await supabase
    .from('master_system_locks')
    .insert({
      lock_scope: scope || 'global',
      target_id,
      target_name: null,
      reason,
      severity: severity || 'emergency',
      activated_by: user.id,
      blackbox_event_id: blackboxId
    })
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  return new Response(JSON.stringify({ success: true, data, message: 'SYSTEM LOCKED' }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// SYSTEM: Unlock
async function handleSystemUnlock(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { lock_id, release_notes } = await req.json();
  
  const { error } = await supabase
    .from('master_system_locks')
    .update({
      is_active: false,
      released_by: user.id,
      released_at: new Date().toISOString(),
      release_notes
    })
    .eq('id', lock_id);
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'unlock',
    module_name: 'system_lock',
    entity_id: lock_id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { release_notes },
    risk_score: 90
  });
  
  return new Response(JSON.stringify({ success: true, message: 'SYSTEM UNLOCKED' }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// AUDIT: Get Logs (Read-only mirror of blackbox)
async function handleGetAuditLogs(supabase: any, user: any, params: URLSearchParams, clientIP: string, roleName: string) {
  const startDate = params.get('start_date');
  const endDate = params.get('end_date');
  const module = params.get('module');
  
  let query = supabase
    .from('blackbox_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);
  if (module) query = query.eq('module_name', module);
  
  const { data } = await query;
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'audit',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { filters: { startDate, endDate, module } },
    risk_score: 10
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// AUDIT: Export
async function handleAuditExport(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { export_type, scope, date_range_start, date_range_end } = await req.json();
  
  const watermarkHash = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('master_audit_exports')
    .insert({
      requested_by: user.id,
      export_type,
      export_scope: scope || {},
      date_range_start,
      date_range_end,
      watermark_hash: watermarkHash,
      status: 'processing'
    })
    .select()
    .single();
  
  await logToBlackbox(supabase, {
    event_type: 'create',
    module_name: 'audit',
    entity_type: 'audit_export',
    entity_id: data?.id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { export_type, watermark: watermarkHash },
    risk_score: 50
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// RENTALS: Get Plans
async function handleGetRentalPlans(supabase: any, user: any, clientIP: string, roleName: string) {
  const { data } = await supabase
    .from('master_rental_plans')
    .select('*')
    .eq('is_active', true)
    .order('price');
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'rental',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// RENTALS: Activate
async function handleActivateRental(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { user_id, feature_id, plan_id } = await req.json();
  
  // Get plan duration
  const { data: plan } = await supabase
    .from('master_rental_plans')
    .select('*')
    .eq('id', plan_id)
    .single();
  
  if (!plan) {
    return new Response(JSON.stringify({ success: false, error: 'Plan not found' }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  // Calculate end time
  const startTime = new Date();
  let endTime = new Date();
  
  switch (plan.duration_type) {
    case 'hour':
      endTime.setHours(endTime.getHours() + plan.duration_value);
      break;
    case 'day':
      endTime.setDate(endTime.getDate() + plan.duration_value);
      break;
    case 'week':
      endTime.setDate(endTime.getDate() + (plan.duration_value * 7));
      break;
    case 'month':
      endTime.setMonth(endTime.getMonth() + plan.duration_value);
      break;
    case 'year':
      endTime.setFullYear(endTime.getFullYear() + plan.duration_value);
      break;
    case 'unlimited':
      endTime.setFullYear(endTime.getFullYear() + 100);
      break;
  }
  
  const { data, error } = await supabase
    .from('master_rentals')
    .insert({
      user_id,
      feature_id,
      plan_id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'active'
    })
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'create',
    module_name: 'rental',
    entity_type: 'master_rental',
    entity_id: data.id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { rented_to: user_id, feature_id, plan_id, end_time: endTime.toISOString() },
    risk_score: 30
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// RENTALS: Revoke
async function handleRevokeRental(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { rental_id, reason } = await req.json();
  
  const { error } = await supabase
    .from('master_rentals')
    .update({
      status: 'revoked',
      revoked_by: user.id,
      revoked_at: new Date().toISOString(),
      revoke_reason: reason
    })
    .eq('id', rental_id);
  
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  await logToBlackbox(supabase, {
    event_type: 'update',
    module_name: 'rental',
    entity_type: 'master_rental',
    entity_id: rental_id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { action: 'revoke', reason },
    risk_score: 60
  });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// AI: Get Alerts
async function handleGetAIAlerts(supabase: any, user: any, clientIP: string, roleName: string) {
  const { data } = await supabase
    .from('master_ai_alerts')
    .select('*')
    .eq('is_resolved', false)
    .order('created_at', { ascending: false });
  
  await logToBlackbox(supabase, {
    event_type: 'view',
    module_name: 'ai_watcher',
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    risk_score: 0
  });
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// AI: Analyze
async function handleAIAnalyze(req: Request, supabase: any, user: any, clientIP: string, roleName: string) {
  const { target_user_id, analysis_type } = await req.json();
  
  // Get user behavior data
  const { data: behaviorData } = await supabase
    .from('blackbox_events')
    .select('*')
    .eq('user_id', target_user_id)
    .order('created_at', { ascending: false })
    .limit(100);
  
  // Simple risk analysis
  const highRiskEvents = behaviorData?.filter((e: any) => e.risk_score > 50) || [];
  const anomalyLevel = highRiskEvents.length > 10 ? 'high' : 
                       highRiskEvents.length > 5 ? 'medium' : 
                       highRiskEvents.length > 0 ? 'low' : 'none';
  
  const behaviorScore = Math.max(0, 100 - (highRiskEvents.length * 5));
  
  // Update behavior score
  await supabase
    .from('master_ai_behavior_scores')
    .upsert({
      user_id: target_user_id,
      behavior_score: behaviorScore,
      anomaly_level: anomalyLevel,
      anomaly_factors: highRiskEvents.map((e: any) => e.event_type),
      evaluated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  
  await logToBlackbox(supabase, {
    event_type: 'update',
    module_name: 'ai_watcher',
    entity_type: 'behavior_analysis',
    entity_id: target_user_id,
    user_id: user.id,
    role_name: roleName,
    ip_address: clientIP,
    metadata: { behavior_score: behaviorScore, anomaly_level: anomalyLevel },
    risk_score: 20
  });
  
  return new Response(JSON.stringify({
    success: true,
    data: {
      user_id: target_user_id,
      behavior_score: behaviorScore,
      anomaly_level: anomalyLevel,
      high_risk_events: highRiskEvents.length
    }
  }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
