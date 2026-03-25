// Shared utilities for Software Vala API
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for all responses with security hardening
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-device-id, x-client-ip, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

// In-memory rate limit store (per edge function instance)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Rate limit configuration per endpoint type
export const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  login: { maxRequests: 5, windowMs: 60000 }, // 5 per minute
  signup: { maxRequests: 3, windowMs: 300000 }, // 3 per 5 minutes
  password_reset: { maxRequests: 3, windowMs: 300000 }, // 3 per 5 minutes
  payment: { maxRequests: 10, windowMs: 60000 }, // 10 per minute
  withdrawal: { maxRequests: 3, windowMs: 3600000 }, // 3 per hour
  demo_access: { maxRequests: 30, windowMs: 60000 }, // 30 per minute
  api_default: { maxRequests: 100, windowMs: 60000 }, // 100 per minute
  admin_action: { maxRequests: 50, windowMs: 60000 }, // 50 per minute
  sensitive_action: { maxRequests: 10, windowMs: 60000 }, // 10 per minute
};

// Check rate limit
export function checkRateLimit(
  identifier: string,
  endpointType: string = 'api_default'
): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMITS[endpointType] || RATE_LIMITS.api_default;
  const key = `${endpointType}:${identifier}`;
  const now = Date.now();
  
  const existing = rateLimitStore.get(key);
  
  if (!existing || existing.resetAt < now) {
    // Reset or create new entry
    rateLimitStore.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }
  
  if (existing.count >= config.maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: existing.resetAt - now 
    };
  }
  
  existing.count++;
  return { 
    allowed: true, 
    remaining: config.maxRequests - existing.count, 
    resetIn: existing.resetAt - now 
  };
}

// Clean up expired rate limit entries (call periodically)
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Initialize Supabase client with service role
export function getSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Initialize Supabase client with user token
export function getSupabaseClient(authHeader: string) {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false }
    }
  );
}

// Validate JWT token format and expiration
export function validateTokenFormat(authHeader: string): { valid: boolean; error?: string } {
  if (!authHeader) {
    return { valid: false, error: 'Missing authorization header' };
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Invalid authorization format' };
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  if (!token || token.length < 10) {
    return { valid: false, error: 'Invalid token format' };
  }
  
  // Basic JWT structure validation (header.payload.signature)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed JWT token' };
  }
  
  // Decode and check expiration
  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return { valid: false, error: 'Token expired' };
    }
  } catch {
    return { valid: false, error: 'Invalid token payload' };
  }
  
  return { valid: true };
}

// Mask email: jo***@example.com
export function maskEmail(email: string): string {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!domain) return "***@***";
  const maskedLocal = local.slice(0, 2) + "***";
  return `${maskedLocal}@${domain}`;
}

// Mask phone: +91***7890
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return "***";
  return phone.slice(0, 3) + "***" + phone.slice(-4);
}

// Mask name: John D***
export function maskName(name: string): string {
  if (!name) return "***";
  const parts = name.split(" ");
  if (parts.length === 1) return name.slice(0, 3) + "***";
  return parts[0] + " " + parts.slice(1).map(p => p[0] + "***").join(" ");
}

// Standard JSON response
export function jsonResponse(data: any, status = 200, buzzer = false) {
  return new Response(
    JSON.stringify({
      success: status >= 200 && status < 300,
      status,
      buzzer,
      timestamp: new Date().toISOString(),
      data,
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Error response
export function errorResponse(message: string, status = 400, buzzer = false) {
  return new Response(
    JSON.stringify({
      success: false,
      status,
      buzzer,
      timestamp: new Date().toISOString(),
      error: message,
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Rate limit exceeded response
export function rateLimitResponse(resetIn: number) {
  return new Response(
    JSON.stringify({
      success: false,
      status: 429,
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil(resetIn / 1000),
      timestamp: new Date().toISOString(),
    }),
    {
      status: 429,
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil(resetIn / 1000)),
      },
    }
  );
}

// Role hierarchy for access control (matches AppRole enum in types/roles.ts)
// NOTE: master and super_admin merged into boss_owner
export const ROLE_HIERARCHY: Record<string, number> = {
  // Highest privilege
  boss_owner: 110, // Merged master + super_admin
  ceo: 105,
  admin: 90,
  finance_manager: 85,
  legal_compliance: 80,
  hr_manager: 75,
  performance_manager: 70,
  rnd_manager: 65,
  r_and_d: 65,
  marketing_manager: 60,
  demo_manager: 55,
  task_manager: 50,
  lead_manager: 45,
  seo_manager: 40,
  client_success: 35,
  ai_manager: 30,
  api_security: 28,
  support: 25,
  franchise: 20,
  reseller: 15,
  developer: 12,
  influencer: 10,
  prime: 8,
  client: 5,
};

// Admin-only roles (merged master + super_admin into boss_owner)
export const ADMIN_ROLES = ['boss_owner', 'ceo', 'admin'];

// Sensitive endpoints that require extra protection
export const SENSITIVE_ENDPOINTS = [
  '/wallet/withdraw',
  '/wallet/payout',
  '/users/delete',
  '/users/role',
  '/admin/',
  '/finance/',
  '/backup/',
];

// Check if user has required role
export function hasRole(userRole: string, requiredRole: string): boolean {
  if (userRole === 'boss_owner') return true; // Boss Owner bypasses all
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

// Check if user has any of the required roles
export function hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
  if (userRole === 'boss_owner') return true; // Boss Owner bypasses all
  return requiredRoles.some(role => userRole === role || hasRole(userRole, role));
}

// Check if role is admin
export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role);
}

// Check if endpoint is sensitive
export function isSensitiveEndpoint(path: string): boolean {
  return SENSITIVE_ENDPOINTS.some(ep => path.includes(ep));
}

// Extract user ID and role from JWT
export async function getUserFromToken(supabase: any): Promise<{ userId: string; role: string; email: string } | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  // Get user role from user_roles table
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return {
    userId: user.id,
    role: roleData?.role || "client",
    email: user.email || "",
  };
}

// Comprehensive audit log entry
export async function createAuditLog(
  supabaseAdmin: any,
  userId: string | null,
  role: string | null,
  module: string,
  action: string,
  meta: Record<string, any> = {}
) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      user_id: userId,
      role,
      module,
      action,
      meta_json: {
        ...meta,
        logged_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}

// Log API call with full context
export async function logAPICall(
  supabaseAdmin: any,
  params: {
    userId: string | null;
    role: string | null;
    endpoint: string;
    method: string;
    status: 'success' | 'blocked' | 'error';
    statusCode: number;
    clientIP: string;
    deviceId: string;
    reason?: string;
    requestBody?: any;
  }
) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      user_id: params.userId,
      role: params.role,
      module: 'api_security',
      action: `api_${params.status}`,
      meta_json: {
        endpoint: params.endpoint,
        method: params.method,
        status: params.status,
        status_code: params.statusCode,
        client_ip: params.clientIP,
        device_id: params.deviceId,
        reason: params.reason,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("API log failed:", error);
  }
}

// Create buzzer alert
export async function createBuzzerAlert(
  supabaseAdmin: any,
  triggerType: string,
  roleTarget: string,
  taskId?: string | null,
  leadId?: string | null,
  priority = "normal",
  region?: string
) {
  try {
    await supabaseAdmin.from("buzzer_queue").insert({
      trigger_type: triggerType,
      role_target: roleTarget,
      task_id: taskId,
      lead_id: leadId,
      priority,
      region,
      status: "pending",
    });
  } catch (error) {
    console.error("Buzzer alert failed:", error);
  }
}

// Check IP lock for subscription enforcement
export async function checkIPLock(
  supabaseAdmin: any,
  userId: string,
  clientIP: string,
  deviceId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const { data: locks } = await supabaseAdmin
    .from("ip_locks")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");

  if (!locks || locks.length === 0) {
    // No locks, create initial lock
    await supabaseAdmin.from("ip_locks").insert({
      user_id: userId,
      ip: clientIP,
      device: deviceId,
      status: "active",
    });
    return { allowed: true };
  }

  // Check if current IP/device matches
  const matchingLock = locks.find(
    (lock: any) => lock.ip === clientIP && lock.device === deviceId
  );

  if (matchingLock) return { allowed: true };

  return {
    allowed: false,
    reason: "IP/Device mismatch. Contact support to update your registered device.",
  };
}

// Check subscription status
export async function checkSubscription(
  supabaseAdmin: any,
  userId: string
): Promise<{ active: boolean; plan?: string; expiresAt?: string }> {
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .gte("expired_at", new Date().toISOString())
    .single();

  if (!sub) return { active: false };

  return {
    active: true,
    plan: sub.plan,
    expiresAt: sub.expired_at,
  };
}

// Check KYC status
export async function checkKYC(
  supabaseAdmin: any,
  userId: string
): Promise<{ verified: boolean; status: string }> {
  const { data: kyc } = await supabaseAdmin
    .from("kyc_documents")
    .select("status")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();

  return {
    verified: kyc?.status === "verified",
    status: kyc?.status || "pending",
  };
}

// Skill-based task routing
export function routeTaskBySkill(
  techStack: string[],
  developers: any[]
): any | null {
  // Filter developers by skill match
  const matchingDevs = developers.filter((dev) => {
    const devSkills = dev.developer_skills?.map((s: any) => s.skill_name.toLowerCase()) || [];
    return techStack.some((tech) => devSkills.includes(tech.toLowerCase()));
  });

  if (matchingDevs.length === 0) return null;

  // Sort by performance score (descending) and current workload (ascending)
  matchingDevs.sort((a, b) => {
    const aScore = a.dev_performance?.[0]?.final_score || 50;
    const bScore = b.dev_performance?.[0]?.final_score || 50;
    const aWorkload = a.developer_tasks?.filter((t: any) => t.status === "in_progress").length || 0;
    const bWorkload = b.developer_tasks?.filter((t: any) => t.status === "in_progress").length || 0;

    // Higher score and lower workload preferred
    return (bScore - aScore) + (aWorkload - bWorkload);
  });

  return matchingDevs[0];
}

// Validate required fields
export function validateRequired(data: Record<string, any>, fields: string[]): string | null {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

// Sanitize string input to prevent XSS/injection attacks
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 10000); // Limit length
}

// Validate and sanitize UUID format
export function isValidUUID(uuid: string): boolean {
  if (typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Validate numeric input
export function isValidNumber(value: any, min?: number, max?: number): boolean {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}

// Parse request with common headers
export async function parseRequest(req: Request): Promise<{
  body: any;
  authHeader: string;
  deviceId: string;
  clientIP: string;
  path: string;
  method: string;
}> {
  let body = {};
  if (req.method !== "GET" && req.method !== "OPTIONS") {
    try {
      body = await req.json();
    } catch {
      body = {};
    }
  }

  const url = new URL(req.url);

  return {
    body,
    authHeader: req.headers.get("Authorization") || "",
    deviceId: req.headers.get("x-device-id") || "unknown",
    clientIP: req.headers.get("x-client-ip") || req.headers.get("x-forwarded-for") || "unknown",
    path: url.pathname,
    method: req.method,
  };
}
