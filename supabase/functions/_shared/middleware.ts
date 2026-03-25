// Middleware for Software Vala API - Enhanced Security
import {
  getSupabaseAdmin,
  getSupabaseClient,
  getUserFromToken,
  createAuditLog,
  logAPICall,
  checkIPLock,
  checkSubscription,
  checkKYC,
  hasAnyRole,
  isAdminRole,
  isSensitiveEndpoint,
  errorResponse,
  rateLimitResponse,
  corsHeaders,
  parseRequest,
  checkRateLimit,
  validateTokenFormat,
  RATE_LIMITS,
} from "./utils.ts";

export interface RequestContext {
  supabase: any;
  supabaseAdmin: any;
  user: { userId: string; role: string; email: string };
  body: any;
  deviceId: string;
  clientIP: string;
  path: string;
  method: string;
}

// Roles that require IP lock
const IP_LOCKED_ROLES = ["franchise", "reseller", "prime", "developer"];

// Roles that require KYC verification
const KYC_REQUIRED_ROLES = ["franchise", "reseller", "developer", "influencer"];

// Roles that require active subscription
const SUBSCRIPTION_REQUIRED_ROLES = ["franchise", "reseller", "prime"];

// Admin-only endpoints patterns
const ADMIN_ONLY_PATTERNS = [
  '/admin',
  '/super-admin',
  '/master-admin',
  '/finance',
  '/backup',
  '/system',
  '/users/delete',
  '/users/role',
  '/payout/approve',
  '/payout/reject',
];

// Determine rate limit type based on endpoint
function getRateLimitType(path: string, action?: string): string {
  if (path.includes('/auth/login') || path.includes('/login')) return 'login';
  if (path.includes('/auth/signup') || path.includes('/register')) return 'signup';
  if (path.includes('/password') || path.includes('/reset')) return 'password_reset';
  if (path.includes('/payment') || path.includes('/checkout')) return 'payment';
  if (path.includes('/withdraw') || path.includes('/payout')) return 'withdrawal';
  if (path.includes('/demo') && !path.includes('/manager')) return 'demo_access';
  if (ADMIN_ONLY_PATTERNS.some(p => path.includes(p))) return 'admin_action';
  if (isSensitiveEndpoint(path)) return 'sensitive_action';
  return 'api_default';
}

// Check if endpoint requires admin role
function requiresAdminRole(path: string): boolean {
  return ADMIN_ONLY_PATTERNS.some(pattern => path.includes(pattern));
}

// Main middleware wrapper with comprehensive security
export async function withAuth(
  req: Request,
  allowedRoles: string[],
  handler: (ctx: RequestContext) => Promise<Response>,
  options: {
    requireKYC?: boolean;
    requireSubscription?: boolean;
    skipKYC?: boolean;
    skipSubscription?: boolean;
    skipIPLock?: boolean;
    skipRateLimit?: boolean;
    module?: string;
    action?: string;
    rateLimitType?: string;
  } = {}
): Promise<Response> {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { body, authHeader, deviceId, clientIP, path, method } = await parseRequest(req);

  // 1. Validate token format first (before any DB calls)
  const tokenValidation = validateTokenFormat(authHeader);
  if (!tokenValidation.valid) {
    await logAPICall(supabaseAdmin, {
      userId: null,
      role: null,
      endpoint: path,
      method,
      status: 'blocked',
      statusCode: 401,
      clientIP,
      deviceId,
      reason: tokenValidation.error,
    });
    return errorResponse(`Unauthorized: ${tokenValidation.error}`, 401);
  }

  // 2. Rate limiting (before authentication to prevent abuse)
  if (!options.skipRateLimit) {
    const rateLimitType = options.rateLimitType || getRateLimitType(path, options.action);
    const rateLimitKey = `${clientIP}:${deviceId}`;
    const rateLimit = checkRateLimit(rateLimitKey, rateLimitType);
    
    if (!rateLimit.allowed) {
      await logAPICall(supabaseAdmin, {
        userId: null,
        role: null,
        endpoint: path,
        method,
        status: 'blocked',
        statusCode: 429,
        clientIP,
        deviceId,
        reason: `Rate limit exceeded for ${rateLimitType}`,
      });
      return rateLimitResponse(rateLimit.resetIn);
    }
  }

  const supabase = getSupabaseClient(authHeader);

  // 3. Authenticate user
  const user = await getUserFromToken(supabase);
  if (!user) {
    await logAPICall(supabaseAdmin, {
      userId: null,
      role: null,
      endpoint: path,
      method,
      status: 'blocked',
      statusCode: 401,
      clientIP,
      deviceId,
      reason: 'Invalid or expired token',
    });
    return errorResponse("Unauthorized: Invalid or expired token", 401);
  }

  // 4. Admin-only endpoint check
  if (requiresAdminRole(path) && !isAdminRole(user.role)) {
    await logAPICall(supabaseAdmin, {
      userId: user.userId,
      role: user.role,
      endpoint: path,
      method,
      status: 'blocked',
      statusCode: 403,
      clientIP,
      deviceId,
      reason: 'Admin-only endpoint accessed by non-admin',
    });
    
    // Create security alert
    await createAuditLog(supabaseAdmin, user.userId, user.role, 'security', 'admin_endpoint_breach_attempt', {
      endpoint: path,
      client_ip: clientIP,
      device_id: deviceId,
      flagged: true,
    });
    
    return errorResponse("Forbidden: Admin access required", 403);
  }

  // 5. Check role access
  if (allowedRoles.length > 0 && !hasAnyRole(user.role, allowedRoles)) {
    await logAPICall(supabaseAdmin, {
      userId: user.userId,
      role: user.role,
      endpoint: path,
      method,
      status: 'blocked',
      statusCode: 403,
      clientIP,
      deviceId,
      reason: `Role ${user.role} not in allowed roles: ${allowedRoles.join(', ')}`,
    });
    
    await createAuditLog(supabaseAdmin, user.userId, user.role, options.module || "auth", "access_denied", {
      attempted_action: options.action,
      endpoint: path,
      client_ip: clientIP,
      allowed_roles: allowedRoles,
    });
    
    return errorResponse("Forbidden: Insufficient permissions", 403);
  }

  // 6. IP Lock check for certain roles
  if (!options.skipIPLock && IP_LOCKED_ROLES.includes(user.role)) {
    const ipCheck = await checkIPLock(supabaseAdmin, user.userId, clientIP, deviceId);
    if (!ipCheck.allowed) {
      await logAPICall(supabaseAdmin, {
        userId: user.userId,
        role: user.role,
        endpoint: path,
        method,
        status: 'blocked',
        statusCode: 403,
        clientIP,
        deviceId,
        reason: 'IP/Device lock violation',
      });
      
      await createAuditLog(supabaseAdmin, user.userId, user.role, "security", "ip_lock_violation", {
        ip: clientIP,
        device: deviceId,
      });
      
      return errorResponse(ipCheck.reason || "IP/Device not authorized", 403);
    }
  }

  // 7. KYC check
  if (!options.skipKYC && (options.requireKYC || KYC_REQUIRED_ROLES.includes(user.role))) {
    const kycStatus = await checkKYC(supabaseAdmin, user.userId);
    if (!kycStatus.verified) {
      await logAPICall(supabaseAdmin, {
        userId: user.userId,
        role: user.role,
        endpoint: path,
        method,
        status: 'blocked',
        statusCode: 403,
        clientIP,
        deviceId,
        reason: 'KYC not verified',
      });
      return errorResponse(`KYC verification required. Current status: ${kycStatus.status}`, 403);
    }
  }

  // 8. Subscription check
  if (!options.skipSubscription && (options.requireSubscription || SUBSCRIPTION_REQUIRED_ROLES.includes(user.role))) {
    const subStatus = await checkSubscription(supabaseAdmin, user.userId);
    if (!subStatus.active) {
      await logAPICall(supabaseAdmin, {
        userId: user.userId,
        role: user.role,
        endpoint: path,
        method,
        status: 'blocked',
        statusCode: 402,
        clientIP,
        deviceId,
        reason: 'Subscription not active',
      });
      return errorResponse("Active subscription required", 402);
    }
  }

  // 9. Log successful API access
  await logAPICall(supabaseAdmin, {
    userId: user.userId,
    role: user.role,
    endpoint: path,
    method,
    status: 'success',
    statusCode: 200,
    clientIP,
    deviceId,
  });

  // 10. Create detailed audit log for this request
  if (options.module && options.action) {
    await createAuditLog(supabaseAdmin, user.userId, user.role, options.module, options.action, {
      client_ip: clientIP,
      device_id: deviceId,
      endpoint: path,
      method,
    });
  }

  // 11. Execute handler
  try {
    return await handler({ supabase, supabaseAdmin, user, body, deviceId, clientIP, path, method });
  } catch (err) {
    const error = err as Error;
    console.error("Handler error:", error);
    
    await logAPICall(supabaseAdmin, {
      userId: user.userId,
      role: user.role,
      endpoint: path,
      method,
      status: 'error',
      statusCode: 500,
      clientIP,
      deviceId,
      reason: error.message,
    });
    
    await createAuditLog(supabaseAdmin, user.userId, user.role, options.module || "system", "error", {
      error: error.message,
      action: options.action,
      endpoint: path,
    });
    
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// Public endpoint wrapper (no auth required, but still logs and rate limits)
export async function withPublic(
  req: Request,
  handler: (ctx: { supabaseAdmin: any; body: any; clientIP: string; deviceId: string; path: string; method: string }) => Promise<Response>,
  options: { module?: string; action?: string; rateLimitType?: string; skipRateLimit?: boolean } = {}
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { body, deviceId, clientIP, path, method } = await parseRequest(req);
  const supabaseAdmin = getSupabaseAdmin();

  // Rate limiting for public endpoints
  if (!options.skipRateLimit) {
    const rateLimitType = options.rateLimitType || getRateLimitType(path, options.action);
    const rateLimitKey = `${clientIP}:${deviceId}`;
    const rateLimit = checkRateLimit(rateLimitKey, rateLimitType);
    
    if (!rateLimit.allowed) {
      await logAPICall(supabaseAdmin, {
        userId: null,
        role: null,
        endpoint: path,
        method,
        status: 'blocked',
        statusCode: 429,
        clientIP,
        deviceId,
        reason: `Rate limit exceeded for ${rateLimitType}`,
      });
      return rateLimitResponse(rateLimit.resetIn);
    }
  }

  // Log public API access
  await logAPICall(supabaseAdmin, {
    userId: null,
    role: null,
    endpoint: path,
    method,
    status: 'success',
    statusCode: 200,
    clientIP,
    deviceId,
  });

  if (options.module && options.action) {
    await createAuditLog(supabaseAdmin, null, null, options.module, options.action, {
      client_ip: clientIP,
      device_id: deviceId,
      endpoint: path,
    });
  }

  try {
    return await handler({ supabaseAdmin, body, clientIP, deviceId, path, method });
  } catch (err) {
    const error = err as Error;
    console.error("Handler error:", error);
    
    await logAPICall(supabaseAdmin, {
      userId: null,
      role: null,
      endpoint: path,
      method,
      status: 'error',
      statusCode: 500,
      clientIP,
      deviceId,
      reason: error.message,
    });
    
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// Boss owner only wrapper (highest privilege - strictest security)
export async function withBossOwner(
  req: Request,
  handler: (ctx: RequestContext) => Promise<Response>,
  options: { module?: string; action?: string } = {}
): Promise<Response> {
  return withAuth(req, ["boss_owner"], handler, {
    ...options,
    skipIPLock: true,
    requireKYC: false,
    requireSubscription: false,
    rateLimitType: 'admin_action',
  });
}

// Alias for backward compatibility
export const withSuperAdmin = withBossOwner;
export const withMasterAdmin = withBossOwner;

// Sensitive action wrapper (extra logging, strict rate limiting)
export async function withSensitiveAction(
  req: Request,
  allowedRoles: string[],
  handler: (ctx: RequestContext) => Promise<Response>,
  options: { module?: string; action?: string } = {}
): Promise<Response> {
  return withAuth(req, allowedRoles, handler, {
    ...options,
    rateLimitType: 'sensitive_action',
  });
}

// Prime user priority wrapper
export async function withPrimePriority(
  req: Request,
  handler: (ctx: RequestContext & { isPrime: boolean }) => Promise<Response>,
  allowedRoles: string[],
  options: { module?: string; action?: string } = {}
): Promise<Response> {
  return withAuth(req, allowedRoles, async (ctx) => {
    const isPrime = ctx.user.role === "prime";
    return handler({ ...ctx, isPrime });
  }, options);
}
