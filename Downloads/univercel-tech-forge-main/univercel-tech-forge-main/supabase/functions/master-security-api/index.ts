import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id, x-device-fingerprint',
};

// Rate limit check middleware
async function checkRateLimit(supabase: any, endpoint: string, identifier: string, identifierType: 'ip' | 'user'): Promise<{ allowed: boolean; remaining?: number; resetAt?: string; reason?: string; cooldown_until?: string }> {
  const { data, error } = await supabase.rpc('master_check_rate_limit', {
    p_endpoint: endpoint,
    p_identifier: identifier,
    p_identifier_type: identifierType
  });
  
  if (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true };
  }
  
  return data;
}

// Replay attack check
async function checkReplay(supabase: any, requestId: string, requestHash: string, userId: string | null, endpoint: string, ipAddress: string): Promise<{ allowed: boolean; reason?: string }> {
  const { data, error } = await supabase.rpc('master_check_replay', {
    p_request_id: requestId,
    p_request_hash: requestHash,
    p_user_id: userId,
    p_endpoint: endpoint,
    p_ip_address: ipAddress
  });
  
  if (error) {
    console.error('Replay check error:', error);
    return { allowed: true };
  }
  
  return data;
}

// Access control check
async function checkAccess(supabase: any, userId: string, action: string, module?: string | null, entityType?: string | null, entityId?: string | null, ipAddress?: string | null, deviceFingerprint?: string | null): Promise<any> {
  const { data, error } = await supabase.rpc('master_check_access', {
    p_user_id: userId,
    p_action: action,
    p_module: module || null,
    p_entity_type: entityType || null,
    p_entity_id: entityId || null,
    p_ip_address: ipAddress || null,
    p_device_fingerprint: deviceFingerprint || null
  });
  
  if (error) {
    console.error('Access check error:', error);
    return { allowed: false, denial_reason: error.message };
  }
  
  return data;
}

// Log to blackbox
async function logToBlackbox(supabase: any, eventType: string, moduleName: string, entityType: string | null, entityId: string | null, userId: string | null, ipAddress: string | null, deviceFingerprint: string | null, metadata: any = {}) {
  try {
    await supabase.from('blackbox_events').insert({
      event_type: eventType,
      module_name: moduleName,
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId,
      ip_address: ipAddress,
      device_fingerprint: deviceFingerprint,
      metadata: metadata
    });
  } catch (error) {
    console.error('Blackbox log error:', error);
  }
}

// Get client IP
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

// Generate request hash for replay protection
async function generateRequestHash(body: string, timestamp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(body + timestamp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/master-security-api', '');
  const ipAddress = getClientIP(req);
  const deviceFingerprint = req.headers.get('x-device-fingerprint') || null;
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get auth token if present
  const authHeader = req.headers.get('Authorization');
  let userId: string | null = null;
  
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id || null;
  }

  try {
    // ═══════════════════════════════════════════
    // RATE LIMIT CHECK (applied to all endpoints)
    // ═══════════════════════════════════════════
    const rateLimitResult = await checkRateLimit(supabase, path, ipAddress, 'ip');
    if (!rateLimitResult.allowed) {
      await logToBlackbox(supabase, 'rate_limit_blocked', 'security', null, null, userId, ipAddress, deviceFingerprint, { endpoint: path });
      
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        cooldown_until: rateLimitResult.cooldown_until,
        retry_after: rateLimitResult.remaining
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ═══════════════════════════════════════════
    // REPLAY PROTECTION (for POST/PUT/DELETE)
    // ═══════════════════════════════════════════
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const body = await req.clone().text();
      const timestamp = new Date().toISOString();
      const requestHash = await generateRequestHash(body, timestamp);
      
      const replayResult = await checkReplay(supabase, requestId, requestHash, userId, path, ipAddress);
      if (!replayResult.allowed) {
        await logToBlackbox(supabase, 'replay_attack_blocked', 'security', null, null, userId, ipAddress, deviceFingerprint, { endpoint: path, request_id: requestId });
        
        return new Response(JSON.stringify({
          error: 'Replay attack detected',
          reason: replayResult.reason
        }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // ═══════════════════════════════════════════
    // SECURITY ENDPOINTS
    // ═══════════════════════════════════════════

    // Login security check
    if (path === '/login/check' && req.method === 'POST') {
      const body = await req.json();
      const { email, device_fingerprint, geo_location } = body;

      const { data, error } = await supabase.rpc('master_check_login_security', {
        p_email: email,
        p_ip_address: ipAddress,
        p_device_fingerprint: device_fingerprint || deviceFingerprint,
        p_geo_location: geo_location
      });

      if (error) throw error;

      await logToBlackbox(supabase, 'login_security_check', 'security', 'user', null, null, ipAddress, deviceFingerprint, { email, result: data });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Register login attempt
    if (path === '/login/attempt' && req.method === 'POST') {
      const body = await req.json();
      const { user_id, email, attempt_type, failure_reason, risk_score, is_anomaly, anomaly_reasons, captcha_required, captcha_passed, session_id } = body;

      const { error } = await supabase.from('master_login_attempts').insert({
        user_id,
        email,
        ip_address: ipAddress,
        device_fingerprint: deviceFingerprint,
        attempt_type,
        failure_reason,
        risk_score: risk_score || 0,
        is_anomaly: is_anomaly || false,
        anomaly_reasons: anomaly_reasons || [],
        captcha_required: captcha_required || false,
        captcha_passed,
        session_id
      });

      if (error) throw error;

      await logToBlackbox(supabase, 'login_attempt', 'security', 'user', user_id, user_id, ipAddress, deviceFingerprint, { attempt_type, email });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Register device fingerprint
    if (path === '/device/register' && req.method === 'POST') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { fingerprint_hash, device_name, browser, os, geo_location } = body;

      const { data, error } = await supabase.from('master_device_fingerprints')
        .upsert({
          user_id: userId,
          fingerprint_hash: fingerprint_hash || deviceFingerprint,
          device_name,
          browser,
          os,
          ip_address: ipAddress,
          geo_location,
          last_seen_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,fingerprint_hash'
        })
        .select()
        .single();

      if (error) throw error;

      await logToBlackbox(supabase, 'device_registered', 'security', 'device', data.id, userId, ipAddress, deviceFingerprint, { device_name, browser, os });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Trust/untrust device
    if (path === '/device/trust' && req.method === 'POST') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check access
      const accessResult = await checkAccess(supabase, userId, 'device_manage', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { device_id, is_trusted, trust_level } = body;

      const { data, error } = await supabase.from('master_device_fingerprints')
        .update({
          is_trusted,
          trust_level: trust_level || (is_trusted ? 100 : 0)
        })
        .eq('id', device_id)
        .select()
        .single();

      if (error) throw error;

      await logToBlackbox(supabase, is_trusted ? 'device_trusted' : 'device_untrusted', 'security', 'device', device_id, userId, ipAddress, deviceFingerprint, { trust_level });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Block device
    if (path === '/device/block' && req.method === 'POST') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'device_block', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { device_id, reason } = body;

      const { data, error } = await supabase.from('master_device_fingerprints')
        .update({
          is_blocked: true,
          blocked_reason: reason,
          blocked_at: new Date().toISOString(),
          blocked_by: userId
        })
        .eq('id', device_id)
        .select()
        .single();

      if (error) throw error;

      await logToBlackbox(supabase, 'device_blocked', 'security', 'device', device_id, userId, ipAddress, deviceFingerprint, { reason });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Token management - revoke user tokens
    if (path === '/tokens/revoke' && req.method === 'POST') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'token_revoke', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { target_user_id, reason } = body;

      const { data, error } = await supabase.rpc('master_revoke_user_tokens', {
        p_user_id: target_user_id,
        p_reason: reason,
        p_revoked_by: userId
      });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, tokens_revoked: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get security threats
    if (path === '/threats' && req.method === 'GET') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'threats_view', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const severity = url.searchParams.get('severity');
      const resolved = url.searchParams.get('resolved');
      const limit = parseInt(url.searchParams.get('limit') || '50');

      let query = supabase.from('master_security_threats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (severity) query = query.eq('severity', severity);
      if (resolved !== null) query = query.eq('is_resolved', resolved === 'true');

      const { data, error } = await query;

      if (error) throw error;

      await logToBlackbox(supabase, 'threats_viewed', 'security', null, null, userId, ipAddress, deviceFingerprint, { count: data.length });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Resolve threat
    if (path.startsWith('/threats/') && path.endsWith('/resolve') && req.method === 'POST') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'threat_resolve', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const threatId = path.split('/')[2];
      const body = await req.json();
      const { resolution_notes } = body;

      const { data, error } = await supabase.from('master_security_threats')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: userId,
          resolution_notes
        })
        .eq('id', threatId)
        .select()
        .single();

      if (error) throw error;

      await logToBlackbox(supabase, 'threat_resolved', 'security', 'threat', threatId, userId, ipAddress, deviceFingerprint, { resolution_notes });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Auto threat response
    if (path === '/threats/auto-respond' && req.method === 'POST') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'threat_respond', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { threat_id } = body;

      const { data, error } = await supabase.rpc('master_auto_threat_response', {
        p_threat_id: threat_id
      });

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // IP watchlist management
    if (path === '/ip/block' && req.method === 'POST') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'ip_block', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { ip, risk_level, reason } = body;

      const { data, error } = await supabase.from('master_ip_watchlist')
        .upsert({
          ip_address: ip,
          risk_level: risk_level || 'high',
          blocked: true,
          reason
        }, { onConflict: 'ip_address' })
        .select()
        .single();

      if (error) throw error;

      await logToBlackbox(supabase, 'ip_blocked', 'security', 'ip', null, userId, ipAddress, deviceFingerprint, { blocked_ip: ip, reason });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify hash chain integrity
    if (path === '/blackbox/verify' && req.method === 'POST') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'blackbox_verify', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { start_sequence, end_sequence } = body;

      const { data, error } = await supabase.rpc('master_verify_hash_chain', {
        p_start_sequence: start_sequence || 1,
        p_end_sequence: end_sequence || null
      });

      if (error) throw error;

      await logToBlackbox(supabase, 'blackbox_verified', 'security', 'hash_chain', null, userId, ipAddress, deviceFingerprint, data);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Access check endpoint
    if (path === '/access/check' && req.method === 'POST') {
      const body = await req.json();
      const { user_id, action, module, entity_type, entity_id } = body;

      const result = await checkAccess(supabase, user_id || userId, action, module, entity_type, entity_id, ipAddress, deviceFingerprint || undefined);

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get security settings
    if (path === '/settings' && req.method === 'GET') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'security_settings_view', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data, error } = await supabase.from('master_security_settings')
        .select('*')
        .eq('is_secret', false);

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update security setting
    if (path === '/settings' && req.method === 'PUT') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'security_settings_update', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { setting_key, setting_value } = body;

      const { data, error } = await supabase.from('master_security_settings')
        .update({
          setting_value_encrypted: setting_value,
          updated_by: userId
        })
        .eq('setting_key', setting_key)
        .eq('is_secret', false)
        .select()
        .single();

      if (error) throw error;

      await logToBlackbox(supabase, 'security_setting_updated', 'security', 'setting', null, userId, ipAddress, deviceFingerprint, { setting_key });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get access check logs
    if (path === '/access/logs' && req.method === 'GET') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const accessResult = await checkAccess(supabase, userId, 'access_logs_view', 'security', null, undefined, ipAddress, deviceFingerprint || undefined);
      if (!accessResult.allowed) {
        return new Response(JSON.stringify({ error: 'Access denied', reason: accessResult.denial_reason }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const targetUserId = url.searchParams.get('user_id');
      const result = url.searchParams.get('result');
      const limit = parseInt(url.searchParams.get('limit') || '100');

      let query = supabase.from('master_access_checks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (targetUserId) query = query.eq('user_id', targetUserId);
      if (result) query = query.eq('final_result', result === 'true');

      const { data, error } = await query;

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 404 for unknown endpoints
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    const error = err as Error;
    console.error('Security API error:', error);
    
    await logToBlackbox(supabase, 'api_error', 'security', null, null, userId, ipAddress, deviceFingerprint, { 
      error: error.message,
      endpoint: path 
    });

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
