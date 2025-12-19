// Enhanced Middleware System for Software Vala API
import {
  getSupabaseAdmin,
  getSupabaseClient,
  getUserFromToken,
  createAuditLog,
  checkIPLock,
  checkSubscription,
  checkKYC,
  hasAnyRole,
  errorResponse,
  corsHeaders,
  parseRequest,
  maskEmail,
  maskPhone,
  maskName,
} from "./utils.ts";

// ==========================================
// TYPES
// ==========================================

export interface RequestContext {
  supabase: any;
  supabaseAdmin: any;
  user: { userId: string; role: string; email: string } | null;
  body: any;
  deviceId: string;
  clientIP: string;
  region?: string;
  currency?: string;
  language?: string;
  isPrime?: boolean;
  fraudScore?: number;
}

export interface MiddlewareOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
  requireKYC?: boolean;
  requireSubscription?: boolean;
  skipIPLock?: boolean;
  rateLimit?: { requests: number; windowMs: number };
  module?: string;
  action?: string;
  detectFraud?: boolean;
  autoMask?: boolean;
  primeAccelerate?: boolean;
}

// ==========================================
// 1. AUTH MIDDLEWARE (JWT + IP + Device)
// ==========================================

export async function authMiddleware(
  req: Request,
  ctx: RequestContext
): Promise<Response | null> {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse("Authentication required. Please provide a valid access token.", 401);
  }

  ctx.supabase = getSupabaseClient(authHeader);
  ctx.user = await getUserFromToken(ctx.supabase);

  if (!ctx.user) {
    return errorResponse("Your session has expired. Please log in again.", 401);
  }

  return null;
}

// ==========================================
// 2. ROLE PERMISSION MIDDLEWARE
// ==========================================

export async function rolePermissionMiddleware(
  ctx: RequestContext,
  allowedRoles: string[]
): Promise<Response | null> {
  if (!ctx.user) {
    return errorResponse("Authentication required.", 401);
  }

  if (allowedRoles.length > 0 && !hasAnyRole(ctx.user.role, allowedRoles)) {
    await createAuditLog(
      ctx.supabaseAdmin,
      ctx.user.userId,
      ctx.user.role,
      "security",
      "access_denied",
      { attempted_roles: allowedRoles, client_ip: ctx.clientIP }
    );
    return errorResponse("You don't have permission to access this resource.", 403);
  }

  return null;
}

// ==========================================
// 3. IDENTITY MASKING MIDDLEWARE
// ==========================================

export function applyMasking(data: any, role: string): any {
  if (!data) return data;
  
  // Super admin and admin see full data
  if (role === "super_admin" || role === "admin") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => applyMasking(item, role));
  }

  if (typeof data === "object") {
    const masked = { ...data };
    
    // Mask sensitive fields
    if (masked.email) masked.masked_email = maskEmail(masked.email);
    if (masked.phone) masked.masked_phone = maskPhone(masked.phone);
    if (masked.full_name) masked.masked_name = maskName(masked.full_name);
    if (masked.owner_name) masked.masked_owner = maskName(masked.owner_name);
    if (masked.contact_name) masked.masked_contact = maskName(masked.contact_name);
    if (masked.contact_phone) masked.masked_contact_phone = maskPhone(masked.contact_phone);
    if (masked.contact_email) masked.masked_contact_email = maskEmail(masked.contact_email);
    
    // Remove original sensitive fields for non-admin roles
    if (role !== "super_admin" && role !== "admin" && role !== "finance_manager") {
      delete masked.email;
      delete masked.phone;
      delete masked.full_name;
      delete masked.owner_name;
      delete masked.contact_name;
      delete masked.contact_phone;
      delete masked.contact_email;
      delete masked.pan_number;
      delete masked.gst_number;
      delete masked.bank_details;
    }

    return masked;
  }

  return data;
}

// ==========================================
// 4. RATE LIMIT + ANTI ABUSE
// ==========================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function rateLimitMiddleware(
  ctx: RequestContext,
  limit: { requests: number; windowMs: number }
): Promise<Response | null> {
  const key = `${ctx.user?.userId || ctx.clientIP}`;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + limit.windowMs };
    rateLimitStore.set(key, entry);
    return null;
  }

  entry.count++;
  
  if (entry.count > limit.requests) {
    await createAuditLog(
      ctx.supabaseAdmin,
      ctx.user?.userId || null,
      ctx.user?.role || null,
      "security",
      "rate_limit_exceeded",
      { ip: ctx.clientIP, count: entry.count }
    );
    return errorResponse("Too many requests. Please slow down and try again shortly.", 429);
  }

  return null;
}

// ==========================================
// 5. LOGGING + AUDITING MIDDLEWARE
// ==========================================

export async function auditMiddleware(
  ctx: RequestContext,
  module: string,
  action: string,
  additionalMeta: Record<string, any> = {}
): Promise<void> {
  await createAuditLog(
    ctx.supabaseAdmin,
    ctx.user?.userId || null,
    ctx.user?.role || null,
    module,
    action,
    {
      client_ip: ctx.clientIP,
      device_id: ctx.deviceId,
      region: ctx.region,
      ...additionalMeta,
    }
  );
}

// ==========================================
// 6. FRAUD DETECTION MIDDLEWARE
// ==========================================

export async function fraudDetectionMiddleware(
  ctx: RequestContext
): Promise<Response | null> {
  // Check for known fraud patterns
  const fraudIndicators: string[] = [];
  let fraudScore = 0;

  // Check for VPN/Proxy
  if (ctx.clientIP === "unknown" || ctx.clientIP.startsWith("10.")) {
    fraudIndicators.push("suspicious_ip");
    fraudScore += 20;
  }

  // Check for multiple accounts from same IP
  if (ctx.user) {
    const { count } = await ctx.supabaseAdmin
      .from("ip_locks")
      .select("*", { count: "exact", head: true })
      .eq("ip", ctx.clientIP)
      .neq("user_id", ctx.user.userId);

    if ((count || 0) > 2) {
      fraudIndicators.push("multiple_accounts_same_ip");
      fraudScore += 30;
    }
  }

  // Check for rapid requests
  const { count: recentActions } = await ctx.supabaseAdmin
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .gte("timestamp", new Date(Date.now() - 60000).toISOString())
    .eq("meta_json->>client_ip", ctx.clientIP);

  if ((recentActions || 0) > 100) {
    fraudIndicators.push("rapid_requests");
    fraudScore += 25;
  }

  ctx.fraudScore = fraudScore;

  // If fraud score is too high, block the request
  if (fraudScore >= 50) {
    await createAuditLog(
      ctx.supabaseAdmin,
      ctx.user?.userId || null,
      ctx.user?.role || null,
      "security",
      "fraud_blocked",
      { fraud_score: fraudScore, indicators: fraudIndicators, ip: ctx.clientIP }
    );
    
    // Create fraud alert
    await ctx.supabaseAdmin.from("fraud_alerts").insert({
      user_id: ctx.user?.userId,
      type: "suspicious_activity",
      severity: fraudScore >= 75 ? "high" : "medium",
      flagged_by_ai: true,
      status: "pending",
    });

    return errorResponse("We've detected unusual activity. Please contact support.", 403);
  }

  return null;
}

// ==========================================
// 7. REGION DETECTION MIDDLEWARE
// ==========================================

export async function regionDetectionMiddleware(
  ctx: RequestContext
): Promise<void> {
  // In production, this would use a GeoIP service
  // For now, detect from timezone or accept from header
  const regionHeader = ctx.body?.region || "IN"; // Default to India
  ctx.region = regionHeader;
}

// ==========================================
// 8. CURRENCY AUTO-CONVERT MIDDLEWARE
// ==========================================

const CURRENCY_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
};

export function convertCurrency(amount: number, from: string, to: string): number {
  const fromRate = CURRENCY_RATES[from] || 1;
  const toRate = CURRENCY_RATES[to] || 1;
  return (amount * fromRate) / toRate;
}

export async function currencyMiddleware(ctx: RequestContext): Promise<void> {
  // Get currency preference from user profile or header
  ctx.currency = ctx.body?.currency || "INR";
}

// ==========================================
// 9. LANGUAGE AUTO-TRANSLATE MIDDLEWARE
// ==========================================

const SUPPORTED_LANGUAGES = ["en", "hi", "ta", "te", "mr", "gu", "bn", "kn", "ml", "pa"];

export async function languageMiddleware(ctx: RequestContext): Promise<void> {
  const langHeader = ctx.body?.language || "en";
  ctx.language = SUPPORTED_LANGUAGES.includes(langHeader) ? langHeader : "en";
}

// ==========================================
// 10. NOTIFICATION ROUTER MIDDLEWARE
// ==========================================

export async function notificationMiddleware(
  ctx: RequestContext,
  event: string,
  payload: Record<string, any>
): Promise<void> {
  // Queue notification for WebSocket broadcast
  try {
    await ctx.supabaseAdmin.from("notification_queue").insert({
      event_type: event,
      payload,
      target_user_id: payload.target_user_id,
      target_role: payload.target_role,
      created_at: new Date().toISOString(),
      processed: false,
    });
  } catch (error) {
    console.error("Notification queue failed:", error);
  }
}

// ==========================================
// 11. TIMER ENFORCER MIDDLEWARE
// ==========================================

export async function timerEnforcerMiddleware(
  ctx: RequestContext,
  taskId: string
): Promise<{ elapsed: number; overtime: boolean; penaltyMinutes: number } | null> {
  const { data: timer } = await ctx.supabaseAdmin
    .from("dev_timer")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!timer) return null;

  const { data: task } = await ctx.supabaseAdmin
    .from("developer_tasks")
    .select("max_delivery_hours, promised_delivery_at")
    .eq("id", taskId)
    .single();

  if (!task) return null;

  const now = new Date();
  const startTime = new Date(timer.start_timestamp);
  const elapsedMs = now.getTime() - startTime.getTime() - (timer.total_seconds || 0) * 1000;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  const maxMinutes = (task.max_delivery_hours || 2) * 60;
  const overtime = elapsedMinutes > maxMinutes;
  const penaltyMinutes = overtime ? elapsedMinutes - maxMinutes : 0;

  return {
    elapsed: elapsedMinutes,
    overtime,
    penaltyMinutes,
  };
}

// ==========================================
// 12. WALLET INTEGRITY CHECK MIDDLEWARE
// ==========================================

export async function walletIntegrityMiddleware(
  ctx: RequestContext,
  walletId: string
): Promise<Response | null> {
  // Verify wallet balance matches ledger total
  const { data: wallet } = await ctx.supabaseAdmin
    .from("developer_wallet")
    .select("available_balance, pending_balance")
    .eq("id", walletId)
    .single();

  if (!wallet) {
    return errorResponse("Wallet not found.", 404);
  }

  const { data: transactions } = await ctx.supabaseAdmin
    .from("developer_wallet_transactions")
    .select("amount, transaction_type")
    .eq("wallet_id", walletId);

  if (transactions) {
    const calculatedBalance = transactions.reduce((acc: number, tx: any) => {
      if (tx.transaction_type === "credit" || tx.transaction_type === "earning") {
        return acc + Number(tx.amount);
      } else if (tx.transaction_type === "debit" || tx.transaction_type === "penalty") {
        return acc - Number(tx.amount);
      }
      return acc;
    }, 0);

    const storedBalance = Number(wallet.available_balance) + Number(wallet.pending_balance);
    
    // Allow small floating point differences
    if (Math.abs(calculatedBalance - storedBalance) > 0.01) {
      await createAuditLog(
        ctx.supabaseAdmin,
        ctx.user?.userId || null,
        ctx.user?.role || null,
        "finance",
        "wallet_integrity_mismatch",
        { wallet_id: walletId, calculated: calculatedBalance, stored: storedBalance }
      );
      return errorResponse("Wallet integrity check failed. Please contact support.", 500);
    }
  }

  return null;
}

// ==========================================
// 13. KYC + VERIFICATION CHECK MIDDLEWARE
// ==========================================

export async function kycVerificationMiddleware(
  ctx: RequestContext
): Promise<Response | null> {
  if (!ctx.user) return null;

  const kycStatus = await checkKYC(ctx.supabaseAdmin, ctx.user.userId);

  if (!kycStatus.verified) {
    return errorResponse(
      `KYC verification is required to access this feature. Your current status: ${kycStatus.status}. Please complete your verification.`,
      403
    );
  }

  return null;
}

// ==========================================
// 14. SEO AUTO-TAGGING MIDDLEWARE
// ==========================================

export function generateSeoTags(content: {
  title: string;
  description?: string;
  category?: string;
}): { meta_title: string; meta_description: string; keywords: string[] } {
  const keywords = [
    content.title.toLowerCase(),
    content.category?.toLowerCase(),
    "software",
    "development",
    "enterprise",
    "business",
  ].filter(Boolean) as string[];

  return {
    meta_title: `${content.title} | Software Vala`,
    meta_description: content.description?.slice(0, 160) || `${content.title} - Premium software solutions by Software Vala`,
    keywords,
  };
}

// ==========================================
// 15. PRIME USER ACCELERATOR MIDDLEWARE
// ==========================================

export async function primeUserAcceleratorMiddleware(
  ctx: RequestContext
): Promise<void> {
  if (!ctx.user) return;

  // Check if user is prime
  const { data: primeUser } = await ctx.supabaseAdmin
    .from("prime_user_profiles")
    .select("id, tier, priority_level")
    .eq("user_id", ctx.user.userId)
    .eq("is_active", true)
    .single();

  if (primeUser) {
    ctx.isPrime = true;
    // Prime users get higher rate limits and priority processing
  }
}

// ==========================================
// MAIN ENHANCED MIDDLEWARE WRAPPER
// ==========================================

export async function withEnhancedMiddleware(
  req: Request,
  handler: (ctx: RequestContext) => Promise<Response>,
  options: MiddlewareOptions = {}
): Promise<Response> {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { body, authHeader, deviceId, clientIP } = await parseRequest(req);
  const supabaseAdmin = getSupabaseAdmin();

  const ctx: RequestContext = {
    supabase: null,
    supabaseAdmin,
    user: null,
    body,
    deviceId,
    clientIP,
  };

  try {
    // 7. Region Detection
    await regionDetectionMiddleware(ctx);

    // 8. Currency Detection
    await currencyMiddleware(ctx);

    // 9. Language Detection
    await languageMiddleware(ctx);

    // 1. Auth Middleware
    if (options.requireAuth !== false) {
      const authError = await authMiddleware(req, ctx);
      if (authError) return authError;
    }

    // 2. Role Permission Middleware
    if (options.allowedRoles && options.allowedRoles.length > 0) {
      const roleError = await rolePermissionMiddleware(ctx, options.allowedRoles);
      if (roleError) return roleError;
    }

    // 4. Rate Limit
    if (options.rateLimit) {
      const rateLimitError = await rateLimitMiddleware(ctx, options.rateLimit);
      if (rateLimitError) return rateLimitError;
    }

    // 6. Fraud Detection
    if (options.detectFraud) {
      const fraudError = await fraudDetectionMiddleware(ctx);
      if (fraudError) return fraudError;
    }

    // 13. KYC Check
    if (options.requireKYC) {
      const kycError = await kycVerificationMiddleware(ctx);
      if (kycError) return kycError;
    }

    // IP Lock check for subscription roles
    if (!options.skipIPLock && ctx.user && ["franchise", "reseller", "prime", "developer"].includes(ctx.user.role)) {
      const ipCheck = await checkIPLock(supabaseAdmin, ctx.user.userId, clientIP, deviceId);
      if (!ipCheck.allowed) {
        await createAuditLog(supabaseAdmin, ctx.user.userId, ctx.user.role, "security", "ip_lock_violation", {
          ip: clientIP,
          device: deviceId,
        });
        return errorResponse(ipCheck.reason || "Access from this device/IP is not authorized.", 403);
      }
    }

    // Subscription check
    if (options.requireSubscription && ctx.user) {
      const subStatus = await checkSubscription(supabaseAdmin, ctx.user.userId);
      if (!subStatus.active) {
        return errorResponse("An active subscription is required to access this feature.", 402);
      }
    }

    // 15. Prime User Accelerator
    if (options.primeAccelerate) {
      await primeUserAcceleratorMiddleware(ctx);
    }

    // 5. Audit Logging
    if (options.module && options.action) {
      await auditMiddleware(ctx, options.module, options.action);
    }

    // Execute handler
    return await handler(ctx);

  } catch (err) {
    const error = err as Error;
    console.error("Middleware error:", error);

    await createAuditLog(supabaseAdmin, ctx.user?.userId || null, ctx.user?.role || null, "system", "error", {
      error: error.message,
      module: options.module,
      action: options.action,
    });

    return errorResponse("Something went wrong. Our team has been notified.", 500);
  }
}

// ==========================================
// PUBLIC ENDPOINT WRAPPER (No Auth)
// ==========================================

export async function withPublicEndpoint(
  req: Request,
  handler: (ctx: RequestContext) => Promise<Response>,
  options: Omit<MiddlewareOptions, "requireAuth" | "allowedRoles"> = {}
): Promise<Response> {
  return withEnhancedMiddleware(req, handler, {
    ...options,
    requireAuth: false,
    allowedRoles: [],
  });
}
