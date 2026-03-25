import {
  withEnhancedMiddleware,
  applyMasking,
  notificationMiddleware,
  withPublicEndpoint,
} from "../_shared/enhanced-middleware.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createBuzzerAlert,
  maskEmail,
  maskPhone,
} from "../_shared/utils.ts";

type FranchiseContext = Parameters<typeof withEnhancedMiddleware>[1] extends (ctx: infer T) => Promise<Response> ? T : never;

const FRANCHISE_SYSTEM_ROLE = "franchise_owner";
const FRANCHISE_DISPLAY_LABEL = "Franchise Manager";
const FRANCHISE_MODULE_NAME = "Franchise Owner";
const FRANCHISE_DASHBOARD_TITLE = "Franchise Manager Dashboard";
const PRIVILEGED_ROLES = ["super_admin", "boss_owner", "ceo", "admin"];
const FRANCHISE_REVIEWER_ROLES = ["franchise", "super_admin", "boss_owner", "master", "ceo", "admin"];
const FRANCHISE_ALLOWED_ROLES = [
  "franchise",
  "super_admin",
  "boss_owner",
  "ceo",
  "admin",
  "finance_manager",
  "ai_manager",
  "lead_manager",
  "marketing_manager",
  "support",
  "sales",
];

function getPath(req: Request) {
  const url = new URL(req.url);
  return {
    url,
    path: url.pathname.replace(/^.*\/api-franchise/, "") || "/",
    method: req.method,
  };
}

function buildRoleContext() {
  return {
    display_role: FRANCHISE_DISPLAY_LABEL,
    module_name: FRANCHISE_MODULE_NAME,
    system_role: FRANCHISE_SYSTEM_ROLE,
    dashboard_title: FRANCHISE_DASHBOARD_TITLE,
    alias_map: {
      franchise_manager: FRANCHISE_SYSTEM_ROLE,
      franchise_owner: FRANCHISE_SYSTEM_ROLE,
    },
  };
}

function isPrivilegedRole(role: string) {
  return PRIVILEGED_ROLES.includes(role);
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isOnHoldStatus(status: unknown) {
  const normalized = String(status || "").toLowerCase();
  return ["hold", "on_hold", "paused", "suspended", "pending"].includes(normalized);
}

function bucketMonth(value: string | Date | null | undefined) {
  if (!value) return "unknown";
  const date = new Date(value);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function bucketDay(value: string | Date | null | undefined) {
  if (!value) return "unknown";
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

function generateFranchiseCode(seed?: string | null) {
  const normalized = String(seed || "FRA").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() || "FRA";
  return `${normalized}-${Date.now().toString(36).toUpperCase()}`;
}

function inferOwnerName(email: string, fallback?: string | null) {
  if (fallback && String(fallback).trim()) return String(fallback).trim();
  const localPart = email.split("@")[0] || "Franchise Owner";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Franchise Owner";
}

function normalizeSelectedPlan(plan: unknown) {
  const normalized = String(plan || "starter").trim().toLowerCase();
  if (["starter", "growth", "enterprise", "elite", "premium"].includes(normalized)) {
    return normalized;
  }
  return "starter";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(value: unknown) {
  return String(value || "").replace(/\D/g, "");
}

function createPhoneOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sha256(value: string) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buffer)).map((item) => item.toString(16).padStart(2, "0")).join("");
}

async function sendFranchiseOtpEmail(email: string, otpCode: string, phone: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.log(`Franchise phone verification OTP for ${email} (${phone}): ${otpCode}`);
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "SOFTWARE VALA <security@softwarevala.com>",
      to: [email],
      subject: `Phone verification code for ${phone}`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;background:#08111f;padding:24px;color:#f8fafc">
          <div style="max-width:560px;margin:0 auto;background:#0f172a;border:1px solid #1e293b;border-radius:20px;padding:32px">
            <p style="margin:0 0 12px;font-size:13px;letter-spacing:.24em;text-transform:uppercase;color:#38bdf8">Franchise Apply</p>
            <h1 style="margin:0 0 12px;font-size:28px;color:#f8fafc">Verify your phone ownership</h1>
            <p style="margin:0 0 24px;color:#cbd5e1">Use this OTP to verify ${phone} for your franchise application. The code expires in 5 minutes.</p>
            <div style="background:#020617;border:1px solid #0ea5e9;border-radius:16px;padding:20px;text-align:center">
              <div style="font-size:36px;letter-spacing:10px;font-weight:700;color:#38bdf8">${otpCode}</div>
            </div>
            <p style="margin:24px 0 0;font-size:13px;color:#94a3b8">If you did not request this verification, ignore this email.</p>
          </div>
        </div>
      `,
    }),
  });

  return response.ok;
}

async function createNotificationRecords(
  ctx: FranchiseContext,
  payload: {
    userIds: string[];
    type: "info" | "success" | "warning" | "danger" | "priority";
    message: string;
    eventType: string;
    actionUrl?: string | null;
    actionLabel?: string | null;
    roleTarget?: string[];
    isBuzzer?: boolean;
    metadata?: Record<string, unknown>;
  },
) {
  const dedupedUserIds = Array.from(new Set(payload.userIds.filter(Boolean)));
  if (!dedupedUserIds.length) return;

  const notificationRows = dedupedUserIds.map((userId) => ({
    user_id: userId,
    type: payload.type,
    message: payload.message,
    event_type: payload.eventType,
    action_label: payload.actionLabel || null,
    action_url: payload.actionUrl || null,
    is_buzzer: Boolean(payload.isBuzzer),
    role_target: payload.roleTarget || [],
  }));

  const mirrorRows = dedupedUserIds.map((userId) => ({
    user_id: userId,
    type: payload.type,
    message: payload.message,
    read_status: false,
    role_target: payload.roleTarget || [],
    action_url: payload.actionUrl || null,
    metadata: {
      event_type: payload.eventType,
      action_label: payload.actionLabel || null,
      ...(payload.metadata || {}),
    },
  }));

  await Promise.all([
    ctx.supabaseAdmin.from("user_notifications").insert(notificationRows),
    ctx.supabaseAdmin.from("notifications").insert(mirrorRows),
  ]);
}

async function getReviewerUserIds(ctx: FranchiseContext) {
  const { data } = await ctx.supabaseAdmin
    .from("user_roles")
    .select("user_id, role")
    .in("role", FRANCHISE_REVIEWER_ROLES);

  return Array.from(new Set((data || []).map((item: any) => item.user_id).filter(Boolean)));
}

async function getApplicationForUser(ctx: FranchiseContext, targetUserId?: string | null) {
  const query = ctx.supabaseAdmin
    .from("franchise_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (targetUserId && isPrivilegedRole(ctx.user!.role)) {
    const { data } = await query.eq("user_id", targetUserId).maybeSingle();
    return data;
  }

  const { data } = await query.eq("user_id", ctx.user!.userId).maybeSingle();
  return data;
}

function mapApplicationToApproval(application: any) {
  return {
    id: application.id,
    franchise_id: application.franchise_id || application.id,
    request_type: "franchise_application",
    request_title: `Franchise application ${application.application_id}`,
    request_description: `${application.city}, ${application.state}, ${application.country}`,
    amount: toNumber(application.investment_budget),
    requested_by_name: application.name,
    status: application.status,
    execution_blocked: application.status !== "approved",
    approval_note: application.approval_notes || null,
    created_at: application.created_at,
    source: "application",
    application_id: application.application_id,
  };
}

async function ensureApplicantIsUnique(
  ctx: FranchiseContext,
  payload: { email: string; phone: string; userId: string; applicationId?: string | null },
) {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const normalizedPhone = normalizePhone(payload.phone);

  const [existingApplicationByEmail, existingApplicationByPhone, existingFranchiseByEmail, existingFranchiseByPhone] = await Promise.all([
    ctx.supabaseAdmin.from("franchise_applications").select("id").eq("email", normalizedEmail).neq("id", payload.applicationId || "00000000-0000-0000-0000-000000000000").maybeSingle(),
    ctx.supabaseAdmin.from("franchise_applications").select("id").eq("phone", normalizedPhone).neq("id", payload.applicationId || "00000000-0000-0000-0000-000000000000").maybeSingle(),
    ctx.supabaseAdmin.from("franchise_accounts").select("id").eq("email", normalizedEmail).maybeSingle(),
    ctx.supabaseAdmin.from("franchise_accounts").select("id").eq("phone", normalizedPhone).maybeSingle(),
  ]);

  if (existingApplicationByEmail.data || existingFranchiseByEmail.data) {
    return "This email already has a franchise application or franchise profile.";
  }

  if (existingApplicationByPhone.data || existingFranchiseByPhone.data) {
    return "This phone number already has a franchise application or franchise profile.";
  }

  const { data: otherUserRole } = await ctx.supabaseAdmin
    .from("user_roles")
    .select("user_id")
    .eq("user_id", payload.userId)
    .eq("role", "franchise")
    .maybeSingle();

  if (otherUserRole) {
    return "This account already has franchise access.";
  }

  return null;
}

async function activateApprovedApplication(ctx: FranchiseContext, application: any, reviewerNote?: string | null) {
  const businessName = `${String(application.business_type || "Franchise").trim()} ${String(application.city || "Hub").trim()} Hub`;
  const ownerName = inferOwnerName(application.email, application.name);

  let franchise = await ctx.supabaseAdmin
    .from("franchise_accounts")
    .select("*")
    .eq("user_id", application.user_id)
    .maybeSingle();

  if (!franchise.data) {
    franchise = await ctx.supabaseAdmin
      .from("franchise_accounts")
      .insert({
        user_id: application.user_id,
        owner_id: application.user_id,
        franchise_code: generateFranchiseCode(application.city),
        business_name: businessName,
        owner_name: ownerName,
        email: application.email,
        phone: application.phone,
        masked_email: maskEmail(application.email),
        masked_phone: maskPhone(application.phone),
        city: application.city,
        state: application.state,
        country: application.country,
        status: "active",
        kyc_status: "pending",
        marketplace_connected: true,
        dashboard_ready: true,
        manager_panel_ready: true,
        joined_from_marketplace: true,
        role_alias: FRANCHISE_SYSTEM_ROLE,
        display_role_label: FRANCHISE_DISPLAY_LABEL,
        metadata: {
          source: "franchise_application",
          business_type: application.business_type,
          investment_budget: application.investment_budget,
          application_id: application.application_id,
        },
      })
      .select("*")
      .single();
  }

  if (!franchise.data) {
    throw new Error("Unable to provision franchise account.");
  }

  await ensureFranchiseWorkspace(ctx, franchise.data, {
    selectedPlan: "growth",
    city: application.city,
    businessType: application.business_type,
    linkId: application.id,
  });

  await ctx.supabaseAdmin.from("franchises").upsert({
    application_id: application.id,
    user_id: application.user_id,
    franchise_account_id: franchise.data.id,
    franchise_code: franchise.data.franchise_code,
    full_name: application.name,
    business_name: franchise.data.business_name,
    email: application.email,
    phone: application.phone,
    country: application.country,
    state: application.state,
    city: application.city,
    status: "active",
    onboarding_completed: false,
  }, { onConflict: "user_id" as never });

  const reviewedAt = new Date().toISOString();
  await ctx.supabaseAdmin
    .from("franchise_applications")
    .update({
      status: "approved",
      reviewed_by: ctx.user!.userId,
      reviewed_at: reviewedAt,
      approved_by: ctx.user!.userId,
      approved_at: reviewedAt,
      approval_notes: reviewerNote || null,
      franchise_id: franchise.data.id,
      metadata: {
        ...(application.metadata || {}),
        onboarding_route: "/franchise/onboarding",
        dashboard_route: "/franchise-dashboard",
        manager_route: "/franchise-manager",
        lead_route: "/franchise/lead-board",
        sales_route: "/franchise/sales-center",
      },
    })
    .eq("id", application.id);

  await createNotificationRecords(ctx, {
    userIds: [application.user_id],
    type: "success",
    message: `Franchise application ${application.application_id} approved. Your onboarding is ready.`,
    eventType: "franchise_apply_approved",
    actionLabel: "Open onboarding",
    actionUrl: "/franchise/onboarding",
    roleTarget: ["franchise"],
    metadata: { application_id: application.application_id, franchise_id: franchise.data.id },
  });

  await emitFranchiseSyncEvent(ctx, franchise.data.id, "approval_synced", {
    source_module: "franchise_apply",
    target_module: "franchise_dashboard",
    approval_status: "approved",
    application_id: application.application_id,
    user_id: application.user_id,
  }, application.id);

  return franchise.data;
}

async function ensureWalletAccount(ctx: FranchiseContext, userId: string) {
  const { data: wallet } = await ctx.supabaseAdmin
    .from("wallets")
    .select("wallet_id,user_id,balance,currency")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (wallet) return wallet;

  const { data: createdWallet } = await ctx.supabaseAdmin
    .from("wallets")
    .insert({ user_id: userId, balance: 0, currency: "INR" })
    .select("wallet_id,user_id,balance,currency")
    .single();

  return createdWallet;
}

async function emitFranchiseSyncEvent(
  ctx: FranchiseContext,
  franchiseId: string,
  eventType: "join_franchise" | "marketplace_connect" | "dashboard_ready" | "manager_ready" | "marketplace_lead_routed" | "marketplace_revenue_linked" | "approval_synced",
  payload: Record<string, unknown>,
  linkId?: string | null,
) {
  await ctx.supabaseAdmin.from("franchise_sync_events").insert({
    franchise_id: franchiseId,
    link_id: linkId || null,
    event_type: eventType,
    source_module: payload.source_module || "franchise",
    target_module: payload.target_module || "franchise",
    sync_status: "completed",
    payload,
  });
}

async function assignFranchiseRole(ctx: FranchiseContext, userId: string) {
  await ctx.supabaseAdmin.from("user_roles").upsert({
    user_id: userId,
    role: "franchise",
    approval_status: "approved",
    approved_at: new Date().toISOString(),
    approved_by: ctx.user!.userId,
  }, { onConflict: "user_id,role" as never });
}

async function ensureFranchiseWorkspace(
  ctx: FranchiseContext,
  franchise: any,
  options: { selectedPlan?: string; city?: string; businessType?: string; linkId?: string | null } = {},
) {
  await assignFranchiseRole(ctx, franchise.user_id);
  await ensureWalletAccount(ctx, franchise.user_id);

  const { data: existingStore } = await ctx.supabaseAdmin
    .from("franchise_stores")
    .select("*")
    .eq("franchise_id", franchise.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const store = existingStore || (await ctx.supabaseAdmin
    .from("franchise_stores")
    .insert({
      franchise_id: franchise.id,
      store_code: `STR-${String(franchise.city || options.city || "DIG").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() || "DIG"}-${Date.now().toString().slice(-4)}`,
      store_name: `${franchise.business_name} Central`,
      city: franchise.city || options.city || "Digital City",
      state: franchise.state || "Remote",
      country: franchise.country || "India",
      manager_user_id: franchise.owner_id || franchise.user_id,
      capacity: 100,
      current_load: 0,
      performance_score: 78,
      metadata: {
        source: options.selectedPlan ? "marketplace_join" : "franchise",
        selected_plan: options.selectedPlan || null,
        business_type: options.businessType || null,
        role_context: buildRoleContext(),
      },
    })
    .select("*")
    .single()).data;

  const { data: metrics } = await ctx.supabaseAdmin
    .from("franchise_live_metrics")
    .select("id")
    .eq("franchise_id", franchise.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!metrics) {
    await ctx.supabaseAdmin.from("franchise_live_metrics").insert({
      franchise_id: franchise.id,
      live_users: 24,
      live_leads: 3,
      live_conversions: 1,
      revenue_per_second: 0,
      active_stores: 1,
      queue_depth: 0,
      metadata: {
        bootstrap: true,
        source: options.selectedPlan ? "marketplace_join" : "franchise",
      },
    });
  }

  await ctx.supabaseAdmin.from("franchise_manager_staff").upsert({
    franchise_id: franchise.id,
    store_id: store?.id || null,
    full_name: inferOwnerName(franchise.email, franchise.owner_name),
    role: "manager",
    performance_score: 82,
    activity_status: "active",
    last_activity_at: new Date().toISOString(),
    metadata: {
      owner_user_id: franchise.owner_id || franchise.user_id,
      source: options.selectedPlan ? "marketplace_join" : "franchise",
    },
  }, { onConflict: "franchise_id,full_name,role" as never });

  const { count: leadCount } = await ctx.supabaseAdmin
    .from("franchise_leads")
    .select("id", { count: "exact", head: true })
    .eq("franchise_id", franchise.id);

  if (!leadCount) {
    await ctx.supabaseAdmin.from("franchise_leads").insert({
      franchise_id: franchise.id,
      lead_name: `${franchise.city || options.city || "New"} Marketplace Expansion`,
      masked_contact: maskPhone(franchise.phone || "0000000000"),
      industry: options.businessType || "franchise",
      region: franchise.state || "Remote",
      city: franchise.city || options.city || "Digital City",
      language_preference: "en",
      lead_score: 76,
      status: "assigned",
      demo_requested: true,
      sale_value: 0,
      commission_earned: 0,
    });
  }

  await ctx.supabaseAdmin.from("franchise_accounts").update({
    owner_id: franchise.owner_id || franchise.user_id,
    marketplace_connected: true,
    dashboard_ready: true,
    manager_panel_ready: true,
    joined_from_marketplace: options.selectedPlan ? true : franchise.joined_from_marketplace,
    role_alias: FRANCHISE_SYSTEM_ROLE,
    display_role_label: FRANCHISE_DISPLAY_LABEL,
    metadata: {
      ...(franchise.metadata || {}),
      selected_plan: options.selectedPlan || franchise.metadata?.selected_plan || null,
      business_type: options.businessType || franchise.metadata?.business_type || null,
      manager_route: "/franchise-manager",
      dashboard_route: "/franchise-dashboard",
    },
  }).eq("id", franchise.id);

  await emitFranchiseSyncEvent(ctx, franchise.id, "dashboard_ready", {
    source_module: "franchise",
    target_module: "franchise_dashboard",
    dashboard_route: "/franchise-dashboard",
    live: true,
  }, options.linkId);

  await emitFranchiseSyncEvent(ctx, franchise.id, "manager_ready", {
    source_module: "franchise",
    target_module: "franchise_manager",
    manager_route: "/franchise-manager",
    staff_seeded: true,
  }, options.linkId);

  return { store };
}

async function getFranchiseForUser(ctx: FranchiseContext, explicitFranchiseId?: string | null) {
  if (explicitFranchiseId) {
    const { data } = await ctx.supabaseAdmin
      .from("franchise_accounts")
      .select("*")
      .eq("id", explicitFranchiseId)
      .single();
    return data;
  }

  const { data } = await ctx.supabaseAdmin
    .from("franchise_accounts")
    .select("*")
    .eq("user_id", ctx.user!.userId)
    .single();

  return data;
}

async function getFranchiseScope(ctx: FranchiseContext, explicitFranchiseId?: string | null) {
  if (explicitFranchiseId) {
    const franchise = await getFranchiseForUser(ctx, explicitFranchiseId);
    return franchise ? [franchise] : [];
  }

  if (isPrivilegedRole(ctx.user!.role)) {
    const { data } = await ctx.supabaseAdmin
      .from("franchise_accounts")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  }

  const franchise = await getFranchiseForUser(ctx);
  return franchise ? [franchise] : [];
}

async function writeFranchiseAudit(
  ctx: FranchiseContext,
  action: string,
  meta: Record<string, unknown> = {},
) {
  await ctx.supabaseAdmin.from("audit_logs").insert({
    module: "franchise",
    action,
    user_id: ctx.user!.userId,
    role: ctx.user!.role,
    meta_json: {
      ...meta,
      role_context: buildRoleContext(),
      audit_display_label: FRANCHISE_DISPLAY_LABEL,
      audit_system_label: FRANCHISE_MODULE_NAME,
    },
  });
}

function chooseBestStore(stores: any[], lead: Record<string, unknown>) {
  const city = String(lead.city || "").toLowerCase();
  const country = String(lead.country || "India").toLowerCase();
  const scored = stores
    .filter((store) => store.status !== "frozen" && store.status !== "dead")
    .map((store) => {
      const cityMatch = String(store.city || "").toLowerCase() === city ? 30 : 0;
      const countryMatch = String(store.country || "").toLowerCase() === country ? 15 : 0;
      const capacityRoom = Math.max(0, toNumber(store.capacity) - toNumber(store.current_load));
      const performance = toNumber(store.performance_score);
      const liveLeadsPenalty = Math.min(toNumber(store.live_leads), 50);

      return {
        store,
        score: cityMatch + countryMatch + capacityRoom / 5 + performance - liveLeadsPenalty,
      };
    })
    .sort((left, right) => right.score - left.score);

  return scored[0]?.store || null;
}

async function ensureStoreTasks(ctx: FranchiseContext, franchiseId: string, stores: any[]) {
  for (const store of stores) {
    if (toNumber(store.performance_score) < 45 || store.status === "dead") {
      await ctx.supabaseAdmin
        .from("franchise_store_tasks")
        .upsert({
          franchise_id: franchiseId,
          store_id: store.id,
          task_type: store.status === "dead" ? "ops_check" : "performance_recovery",
          title: store.status === "dead" ? `Freeze review for ${store.store_name}` : `Recovery plan for ${store.store_name}`,
          details: store.status === "dead"
            ? "Store marked dead. Freeze review and escalation required."
            : "Store performance dropped below threshold. Recovery actions required.",
          status: "open",
          metadata: {
            performance_score: store.performance_score,
            auto_created: true,
            role_context: buildRoleContext(),
          },
        }, { onConflict: "franchise_id,store_id,title" as never });
    }
  }
}

Deno.serve(async (req) => {
  const { url, path, method } = getPath(req);

  if (method === "GET" && path === "/role/resolve") {
    return withEnhancedMiddleware(req, async () => {
      return jsonResponse({
        resolved_role: FRANCHISE_SYSTEM_ROLE,
        ...buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "role_resolve",
      requireAuth: true,
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/applications/request-otp") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const email = String(ctx.body.email || ctx.user!.email || "").trim().toLowerCase();
      const phone = normalizePhone(ctx.body.phone);

      if (!isValidEmail(email)) return errorResponse("Please enter a valid email address.", 400);
      if (phone.length < 10) return errorResponse("Please enter a valid phone number.", 400);

      const duplicateError = await ensureApplicantIsUnique(ctx, { email, phone, userId: ctx.user!.userId });
      if (duplicateError) return errorResponse(duplicateError, 409);

      const otpCode = createPhoneOtp();
      const codeHash = await sha256(`${ctx.user!.userId}:${phone}:${otpCode}`);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      const { error } = await ctx.supabaseAdmin
        .from("franchise_application_otps")
        .upsert({
          user_id: ctx.user!.userId,
          phone,
          email,
          code_hash: codeHash,
          verification_channel: "email",
          expires_at: expiresAt,
          verified_at: null,
          attempts: 0,
          last_sent_at: new Date().toISOString(),
        }, { onConflict: "user_id,phone" as never });

      if (error) return errorResponse("Unable to create verification challenge.", 500);

      const delivered = await sendFranchiseOtpEmail(email, otpCode, phone);
      await writeFranchiseAudit(ctx, "application_phone_otp_requested", { phone, delivered, email });

      return jsonResponse({
        sent: true,
        verification_channel: delivered ? "email" : "log",
        expires_at: expiresAt,
        phone,
      });
    }, {
      module: "franchise",
      action: "application_request_otp",
      requireAuth: true,
      rateLimit: { requests: 5, windowMs: 60_000 },
      detectFraud: true,
    });
  }

  if (method === "POST" && path === "/applications/verify-otp") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const phone = normalizePhone(ctx.body.phone);
      const code = String(ctx.body.code || "").trim();
      if (phone.length < 10 || code.length !== 6) {
        return errorResponse("Phone and 6-digit OTP are required.", 400);
      }

      const { data: otpRecord, error } = await ctx.supabaseAdmin
        .from("franchise_application_otps")
        .select("*")
        .eq("user_id", ctx.user!.userId)
        .eq("phone", phone)
        .maybeSingle();

      if (error || !otpRecord) return errorResponse("Verification challenge not found.", 404);
      if (otpRecord.verified_at) return jsonResponse({ verified: true, phone });
      if (new Date(otpRecord.expires_at).getTime() < Date.now()) return errorResponse("OTP has expired. Request a new one.", 400);
      if ((otpRecord.attempts || 0) >= 5) return errorResponse("Too many invalid attempts. Request a new OTP.", 429);

      const expectedHash = await sha256(`${ctx.user!.userId}:${phone}:${code}`);
      if (expectedHash !== otpRecord.code_hash) {
        await ctx.supabaseAdmin
          .from("franchise_application_otps")
          .update({ attempts: (otpRecord.attempts || 0) + 1 })
          .eq("id", otpRecord.id);
        return errorResponse("Invalid OTP. Please try again.", 400);
      }

      const verifiedAt = new Date().toISOString();
      await ctx.supabaseAdmin
        .from("franchise_application_otps")
        .update({ verified_at: verifiedAt, attempts: otpRecord.attempts || 0 })
        .eq("id", otpRecord.id);

      await writeFranchiseAudit(ctx, "application_phone_otp_verified", { phone });
      return jsonResponse({ verified: true, verified_at: verifiedAt, phone });
    }, {
      module: "franchise",
      action: "application_verify_otp",
      requireAuth: true,
      rateLimit: { requests: 10, windowMs: 60_000 },
      detectFraud: true,
    });
  }

  if (method === "POST" && path === "/applications/submit") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["name", "email", "phone", "country", "state", "city", "investment_budget", "business_type", "experience"]);
      if (validation) return errorResponse(validation, 400);

      const name = String(ctx.body.name || "").trim();
      const email = String(ctx.body.email || ctx.user!.email || "").trim().toLowerCase();
      const phone = normalizePhone(ctx.body.phone);
      const country = String(ctx.body.country || "").trim();
      const state = String(ctx.body.state || "").trim();
      const city = String(ctx.body.city || "").trim();
      const businessType = String(ctx.body.business_type || "").trim();
      const experience = String(ctx.body.experience || "").trim();
      const investmentBudget = toNumber(ctx.body.investment_budget);
      const agreeTerms = Boolean(ctx.body.agree_terms);
      const documentsUrl = Array.isArray(ctx.body.documents_url)
        ? ctx.body.documents_url.map((item: unknown) => String(item)).filter(Boolean)
        : [];

      if (!name) return errorResponse("Name is required.", 400);
      if (!isValidEmail(email)) return errorResponse("Please enter a valid email address.", 400);
      if (phone.length < 10) return errorResponse("Please enter a valid phone number.", 400);
      if (!country || !state || !city || !businessType || !experience) return errorResponse("All required franchise fields must be filled.", 400);
      if (investmentBudget <= 0) return errorResponse("Investment budget must be greater than zero.", 400);
      if (!agreeTerms) return errorResponse("You must agree to the franchise terms before submitting.", 400);

      const duplicateError = await ensureApplicantIsUnique(ctx, { email, phone, userId: ctx.user!.userId });
      if (duplicateError) return errorResponse(duplicateError, 409);

      const { data: verifiedOtp } = await ctx.supabaseAdmin
        .from("franchise_application_otps")
        .select("verified_at")
        .eq("user_id", ctx.user!.userId)
        .eq("phone", phone)
        .not("verified_at", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!verifiedOtp?.verified_at) {
        return errorResponse("Phone OTP verification is required before application submission.", 400);
      }

      const { data: existingApplication } = await ctx.supabaseAdmin
        .from("franchise_applications")
        .select("id,application_id,status")
        .eq("user_id", ctx.user!.userId)
        .maybeSingle();

      if (existingApplication) {
        return errorResponse(`Application ${existingApplication.application_id} already exists with status ${existingApplication.status}.`, 409);
      }

      const { data: application, error } = await ctx.supabaseAdmin
        .from("franchise_applications")
        .insert({
          user_id: ctx.user!.userId,
          name,
          email,
          phone,
          country,
          state,
          city,
          investment_budget: investmentBudget,
          business_type: businessType,
          experience,
          documents_url: documentsUrl,
          agree_terms: agreeTerms,
          otp_verified: true,
          otp_verified_at: verifiedOtp.verified_at,
          metadata: {
            source: "franchise_apply",
            submitter_email: ctx.user!.email,
          },
        })
        .select("*")
        .single();

      if (error || !application) return errorResponse("Unable to submit franchise application.", 500);

      const reviewerUserIds = await getReviewerUserIds(ctx);
      await createNotificationRecords(ctx, {
        userIds: reviewerUserIds,
        type: "priority",
        message: `New franchise application ${application.application_id} from ${name}.`,
        eventType: "franchise_apply_submitted",
        actionLabel: "Review applications",
        actionUrl: "/franchise",
        roleTarget: FRANCHISE_REVIEWER_ROLES,
        isBuzzer: true,
        metadata: { application_id: application.application_id, applicant_user_id: ctx.user!.userId },
      });

      await createNotificationRecords(ctx, {
        userIds: [ctx.user!.userId],
        type: "info",
        message: `Franchise application ${application.application_id} submitted successfully.`,
        eventType: "franchise_apply_submitted",
        actionLabel: "Track status",
        actionUrl: "/franchise/status",
        roleTarget: ["user", "franchise"],
        metadata: { application_id: application.application_id },
      });

      await notificationMiddleware(ctx, "franchise.application.submitted", {
        application_id: application.application_id,
        applicant_user_id: ctx.user!.userId,
        applicant_name: name,
        target_role: "franchise",
      });

      await writeFranchiseAudit(ctx, "application_submit", {
        application_id: application.application_id,
        country,
        state,
        city,
        investment_budget: investmentBudget,
      });

      return jsonResponse({
        application,
        status_route: "/franchise/status",
        onboarding_route: "/franchise/onboarding",
      }, 201);
    }, {
      module: "franchise",
      action: "application_submit",
      requireAuth: true,
      rateLimit: { requests: 5, windowMs: 60_000 },
      detectFraud: true,
    });
  }

  if (method === "GET" && path === "/applications/status") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const application = await getApplicationForUser(ctx, url.searchParams.get("user_id"));
      if (!application) {
        return jsonResponse({
          application: null,
          dashboard_route: "/franchise-dashboard",
          manager_route: "/franchise-manager",
          lead_route: "/franchise/lead-board",
          sales_route: "/franchise/sales-center",
          onboarding_route: "/franchise/onboarding",
        });
      }

      return jsonResponse({
        application,
        dashboard_route: "/franchise-dashboard",
        manager_route: "/franchise-manager",
        lead_route: "/franchise/lead-board",
        sales_route: "/franchise/sales-center",
        onboarding_route: "/franchise/onboarding",
      });
    }, {
      module: "franchise",
      action: "application_status",
      requireAuth: true,
    });
  }

  if (method === "POST" && path === "/register") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["business_name", "owner_name", "email", "phone", "city", "state"]);
      if (validation) return errorResponse(validation);

      const franchiseCode = `FR-${Date.now().toString(36).toUpperCase()}`;
      const { data: franchise, error } = await ctx.supabaseAdmin
        .from("franchise_accounts")
        .insert({
          user_id: ctx.user!.userId,
          franchise_code: franchiseCode,
          business_name: ctx.body.business_name,
          owner_name: ctx.body.owner_name,
          email: ctx.body.email,
          phone: ctx.body.phone,
          masked_email: maskEmail(ctx.body.email),
          masked_phone: maskPhone(ctx.body.phone),
          city: ctx.body.city,
          state: ctx.body.state,
          country: ctx.body.country || "India",
          pincode: ctx.body.pincode,
          address: ctx.body.address,
          status: "pending",
          kyc_status: "pending",
          role_alias: FRANCHISE_SYSTEM_ROLE,
          display_role_label: FRANCHISE_DISPLAY_LABEL,
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to register franchise. Please try again.");

      await ctx.supabaseAdmin.from("user_roles").upsert({ user_id: ctx.user!.userId, role: "franchise" });
      await notificationMiddleware(ctx, "franchise.registration", {
        franchise_id: franchise.id,
        business_name: ctx.body.business_name,
        target_role: "admin",
        role_context: buildRoleContext(),
      });
      await writeFranchiseAudit(ctx, "register", { franchise_id: franchise.id, franchise_code: franchiseCode });

      return jsonResponse({
        message: "Your franchise registration has been submitted.",
        franchise_code: franchiseCode,
        franchise: applyMasking(franchise, ctx.user!.role),
        role_context: buildRoleContext(),
      }, 201);
    }, { module: "franchise", action: "register", requireAuth: true });
  }

  if (method === "POST" && path === "/franchise/create") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const selectedPlan = normalizeSelectedPlan(ctx.body.selected_plan);
      const city = String(ctx.body.city || "Digital City").trim() || "Digital City";
      const businessType = String(ctx.body.business_type || "Franchise").trim() || "Franchise";
      const ownerName = inferOwnerName(ctx.user!.email, ctx.body.owner_name);
      const businessName = String(ctx.body.business_name || `${businessType} ${city} Hub`).trim();
      const phone = String(ctx.body.phone || "0000000000").trim() || "0000000000";

      let franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || null);

      if (!franchise) {
        const { data, error } = await ctx.supabaseAdmin
          .from("franchise_accounts")
          .insert({
            user_id: ctx.body.user_id || ctx.user!.userId,
            owner_id: ctx.body.user_id || ctx.user!.userId,
            franchise_code: generateFranchiseCode(city),
            business_name: businessName,
            owner_name: ownerName,
            email: ctx.body.email || ctx.user!.email,
            phone,
            masked_email: maskEmail(ctx.body.email || ctx.user!.email),
            masked_phone: maskPhone(phone),
            address: ctx.body.address || null,
            city,
            state: ctx.body.state || "Remote",
            country: ctx.body.country || "India",
            pincode: ctx.body.pincode || null,
            status: "active",
            kyc_status: "pending",
            role_alias: FRANCHISE_SYSTEM_ROLE,
            display_role_label: FRANCHISE_DISPLAY_LABEL,
            marketplace_connected: true,
            dashboard_ready: true,
            manager_panel_ready: true,
            joined_from_marketplace: Boolean(ctx.body.joined_from_marketplace ?? true),
            metadata: {
              source: ctx.body.source || "marketplace_join",
              selected_plan: selectedPlan,
              business_type: businessType,
            },
          })
          .select("*")
          .single();

        if (error || !data) return errorResponse("Unable to create franchise.");
        franchise = data;
      }

      await ensureFranchiseWorkspace(ctx, franchise, {
        selectedPlan,
        city,
        businessType,
      });
      await writeFranchiseAudit(ctx, "franchise_create", { franchise_id: franchise.id, selected_plan: selectedPlan, city, business_type: businessType });

      return jsonResponse({
        franchise: applyMasking(franchise, ctx.user!.role),
        dashboard_route: "/franchise-dashboard",
        manager_route: "/franchise-manager",
        role_context: buildRoleContext(),
      }, franchise.created_at ? 200 : 201);
    }, {
      module: "franchise",
      action: "franchise_create",
      requireAuth: true,
    });
  }

  if (method === "POST" && path === "/role/assign") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const role = String(ctx.body.role || "franchise").trim();
      const targetUserId = String(ctx.body.user_id || ctx.user!.userId);

      if (targetUserId !== ctx.user!.userId && !isPrivilegedRole(ctx.user!.role)) {
        return errorResponse("Only privileged users can assign roles for another user.", 403);
      }

      if (role !== "franchise") {
        return errorResponse("Only the franchise access role is supported by this endpoint.", 400);
      }

      await assignFranchiseRole(ctx, targetUserId);
      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || null);

      if (franchise) {
        await emitFranchiseSyncEvent(ctx, franchise.id, "approval_synced", {
          source_module: "franchise",
          target_module: "role_guard",
          approval_status: "approved",
          role,
          user_id: targetUserId,
        }, ctx.body.link_id || null);
      }

      await writeFranchiseAudit(ctx, "role_assign", { role, target_user_id: targetUserId, franchise_id: franchise?.id || null });
      return jsonResponse({ assigned: true, role, user_id: targetUserId, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "role_assign",
      requireAuth: true,
    });
  }

  if (method === "GET" && (path === "" || path === "/")) {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from("franchise_accounts").select(`
        *,
        franchise_territories(*),
        franchise_leads(count),
        franchise_commissions(sum:commission_amount)
      `);

      if (!isPrivilegedRole(ctx.user!.role)) {
        query = query.eq("user_id", ctx.user!.userId);
      }

      const { data, error } = await query;
      if (error) return errorResponse("Unable to retrieve franchise information.");

      return jsonResponse({
        items: applyMasking(data, ctx.user!.role),
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "list",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/overview") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const [linkResult, metricsResult, walletResult, syncResult] = await Promise.all([
        ctx.supabaseAdmin.from("marketplace_franchise_links").select("*").eq("franchise_id", franchise.id).limit(1).maybeSingle(),
        ctx.supabaseAdmin.from("franchise_live_metrics").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        ctx.supabaseAdmin.from("franchise_wallet_ledger").select("balance_after,created_at").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(5),
        ctx.supabaseAdmin.from("franchise_sync_events").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(10),
      ]);

      return jsonResponse({
        franchise: applyMasking(franchise, ctx.user!.role),
        link: linkResult.data || null,
        metrics: metricsResult.data || null,
        wallet_balance: toNumber(walletResult.data?.[0]?.balance_after),
        sync_events: syncResult.data || [],
        dashboard_route: "/franchise-dashboard",
        manager_route: "/franchise-manager",
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_overview",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/manager") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const [staffResult, approvalsResult, syncResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_manager_staff").select("*").eq("franchise_id", franchise.id).order("performance_score", { ascending: false }),
        ctx.supabaseAdmin.from("franchise_manager_approvals").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(10),
        ctx.supabaseAdmin.from("franchise_sync_events").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(10),
      ]);

      return jsonResponse({
        franchise: applyMasking(franchise, ctx.user!.role),
        staff: staffResult.data || [],
        approvals: approvalsResult.data || [],
        sync_events: syncResult.data || [],
        same_data_source: true,
        control_level: "manager",
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_manager_alias",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/manager/overview") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);

      const franchiseIds = scope.map((item: any) => item.id);
      const [staffResult, leadsResult, commissionsResult, productsResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_manager_staff").select("id,franchise_id").in("franchise_id", franchiseIds),
        ctx.supabaseAdmin.from("franchise_leads").select("id,franchise_id,status").in("franchise_id", franchiseIds),
        ctx.supabaseAdmin.from("franchise_commissions").select("franchise_id,commission_amount,status").in("franchise_id", franchiseIds),
        ctx.supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
      ]);

      const leads = leadsResult.data || [];
      const commissions = commissionsResult.data || [];
      const totalRevenue = commissions.reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0);
      const onHold = scope.filter((item: any) => isOnHoldStatus(item.status)).length;

      return jsonResponse({
        title: FRANCHISE_DASHBOARD_TITLE,
        subtext: "Manage Assigned Franchises • Marketplace Connected",
        badges: ["RUNNING", "AI ACTIVE", "MARKETPLACE CONNECTED"],
        role_context: buildRoleContext(),
        cards: {
          total_franchises: scope.length,
          active: scope.filter((item: any) => String(item.status || "").toLowerCase() === "active").length,
          on_hold: onHold,
          total_staff: (staffResult.data || []).length,
          total_leads: leads.length,
          revenue: totalRevenue,
          catalog_products: productsResult.count || 0,
        },
        highlight_alert: onHold > 0,
      });
    }, {
      module: "franchise",
      action: "manager_overview",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/list") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);

      const franchiseIds = scope.map((item: any) => item.id);
      const [staffResult, leadsResult, commissionsResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_manager_staff").select("franchise_id,id").in("franchise_id", franchiseIds),
        ctx.supabaseAdmin.from("franchise_leads").select("franchise_id,id,status,lead_score").in("franchise_id", franchiseIds),
        ctx.supabaseAdmin.from("franchise_commissions").select("franchise_id,commission_amount").in("franchise_id", franchiseIds),
      ]);

      const staffByFranchise = new Map<string, number>();
      for (const item of staffResult.data || []) {
        staffByFranchise.set(item.franchise_id, (staffByFranchise.get(item.franchise_id) || 0) + 1);
      }

      const leadsByFranchise = new Map<string, number>();
      for (const item of leadsResult.data || []) {
        leadsByFranchise.set(item.franchise_id, (leadsByFranchise.get(item.franchise_id) || 0) + 1);
      }

      const revenueByFranchise = new Map<string, number>();
      for (const item of commissionsResult.data || []) {
        revenueByFranchise.set(item.franchise_id, (revenueByFranchise.get(item.franchise_id) || 0) + toNumber(item.commission_amount));
      }

      const items = scope.map((franchise: any) => {
        const revenue = revenueByFranchise.get(franchise.id) || 0;
        const lowRevenue = revenue < 50000;
        return {
          id: franchise.id,
          franchise_name: franchise.business_name,
          staff_count: staffByFranchise.get(franchise.id) || 0,
          leads: leadsByFranchise.get(franchise.id) || 0,
          revenue,
          status: franchise.status,
          deep_analytics: {
            city: franchise.city,
            state: franchise.state,
            risk_level: franchise.risk_level,
            wallet_locked: franchise.wallet_locked,
          },
          ai_suggestion: lowRevenue ? "Revenue below target. Review local campaigns and assign top closer." : null,
          actions: {
            view: "deep_analytics",
            manage: "staff_config",
            hold: "stop_operations",
          },
        };
      });

      return jsonResponse({ items, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "franchise_list_manager",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/franchise/action") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["franchise_id", "action"]);
      if (validation) return errorResponse(validation);

      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id);
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const action = String(ctx.body.action || "").toLowerCase();
      let nextStatus: string;
      let reason: string;

      switch (action) {
        case "approve":
          nextStatus = "active";
          reason = "Approved by admin";
          break;
        case "suspend":
          nextStatus = "suspended";
          reason = ctx.body.reason || "Suspended by admin";
          break;
        case "terminate":
          nextStatus = "terminated";
          reason = ctx.body.reason || "Terminated by admin";
          break;
        case "reactivate":
        case "resume":
          nextStatus = "active";
          reason = "Reactivated by admin";
          break;
        default:
          return errorResponse("Unsupported franchise action.", 400);
      }

      const { data: updated, error } = await ctx.supabaseAdmin
        .from("franchise_accounts")
        .update({
          status: nextStatus,
          freeze_reason: reason,
        })
        .eq("id", franchise.id)
        .select()
        .single();

      if (error) return errorResponse("Unable to update franchise state.");

      if (action === "suspend" || action === "terminate") {
        await ctx.supabaseAdmin
          .from("franchise_stores")
          .update({ status: "frozen" })
          .eq("franchise_id", franchise.id)
          .neq("status", "dead");
      }

      if (action === "reactivate" || action === "resume") {
        await ctx.supabaseAdmin
          .from("franchise_stores")
          .update({ status: "active" })
          .eq("franchise_id", franchise.id)
          .eq("status", "frozen");
      }

      await writeFranchiseAudit(ctx, `franchise_${action}`, {
        franchise_id: franchise.id,
        previous_status: franchise.status,
        current_status: nextStatus,
      });

      return jsonResponse({ franchise: updated, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "franchise_action",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/map") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);

      const franchiseIds = scope.map((item: any) => item.id);
      const [storesResult, activityResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_stores").select("franchise_id,city,state,live_users,live_leads,revenue_per_second").in("franchise_id", franchiseIds),
        ctx.supabaseAdmin.from("franchise_customer_activity").select("franchise_id,city,traffic_density,revenue_amount,new_customers,predicted_churn_rate").in("franchise_id", franchiseIds),
      ]);

      const cityMap = new Map<string, { city: string; franchises: number; traffic_density: number; revenue: number; leads: number; high_demand: boolean }>();
      for (const store of storesResult.data || []) {
        const current = cityMap.get(store.city) || { city: store.city, franchises: 0, traffic_density: 0, revenue: 0, leads: 0, high_demand: false };
        current.franchises += 1;
        current.leads += toNumber(store.live_leads);
        current.revenue += toNumber(store.revenue_per_second) * 3600;
        cityMap.set(store.city, current);
      }

      for (const item of activityResult.data || []) {
        const current = cityMap.get(item.city) || { city: item.city, franchises: 0, traffic_density: 0, revenue: 0, leads: 0, high_demand: false };
        current.traffic_density = Math.max(current.traffic_density, toNumber(item.traffic_density));
        current.revenue += toNumber(item.revenue_amount);
        current.high_demand = current.traffic_density >= 75 || toNumber(item.new_customers) >= 15;
        cityMap.set(item.city, current);
      }

      const cities = Array.from(cityMap.values()).sort((left, right) => right.traffic_density - left.traffic_density);

      return jsonResponse({
        city_wise_distribution: cities.map((item) => ({ city: item.city, franchises: item.franchises })),
        traffic_density: cities.map((item) => ({ city: item.city, density: item.traffic_density })),
        revenue_heatmap: cities.map((item) => ({ city: item.city, revenue: item.revenue })),
        expansion_suggestions: cities.filter((item) => item.high_demand).map((item) => ({ city: item.city, reason: "High demand area detected. Suggest new franchise." })),
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_map",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/staff") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);

      const franchiseIds = scope.map((item: any) => item.id);
      const { data: staff, error } = await ctx.supabaseAdmin
        .from("franchise_manager_staff")
        .select("*")
        .in("franchise_id", franchiseIds)
        .order("performance_score", { ascending: false });

      if (error) return errorResponse("Unable to retrieve staff.");

      return jsonResponse({
        staff: staff || [],
        inactive_alerts: (staff || []).filter((item: any) => item.activity_status === "inactive"),
        top_staff: (staff || []).filter((item: any) => toNumber(item.performance_score) >= 85 || item.reward_status === "reward"),
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_staff",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/revenue") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);

      const franchiseIds = scope.map((item: any) => item.id);
      const [activityResult, commissionsResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_customer_activity").select("franchise_id,activity_date,revenue_amount").in("franchise_id", franchiseIds).order("activity_date", { ascending: false }),
        ctx.supabaseAdmin.from("franchise_commissions").select("franchise_id,commission_amount,created_at").in("franchise_id", franchiseIds).order("created_at", { ascending: false }),
      ]);

      const franchiseWise = scope.map((franchise: any) => {
        const activityRevenue = (activityResult.data || [])
          .filter((item: any) => item.franchise_id === franchise.id)
          .reduce((sum: number, item: any) => sum + toNumber(item.revenue_amount), 0);
        const commissionRevenue = (commissionsResult.data || [])
          .filter((item: any) => item.franchise_id === franchise.id)
          .reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0);
        return {
          franchise_id: franchise.id,
          franchise_name: franchise.business_name,
          revenue: activityRevenue + commissionRevenue,
          status: franchise.status,
        };
      });

      const dailyMap = new Map<string, number>();
      for (const item of activityResult.data || []) {
        const key = bucketDay(item.activity_date);
        dailyMap.set(key, (dailyMap.get(key) || 0) + toNumber(item.revenue_amount));
      }
      for (const item of commissionsResult.data || []) {
        const key = bucketDay(item.created_at);
        dailyMap.set(key, (dailyMap.get(key) || 0) + toNumber(item.commission_amount));
      }

      const monthlyMap = new Map<string, number>();
      for (const item of activityResult.data || []) {
        const key = bucketMonth(item.activity_date);
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + toNumber(item.revenue_amount));
      }
      for (const item of commissionsResult.data || []) {
        const key = bucketMonth(item.created_at);
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + toNumber(item.commission_amount));
      }

      const daily = Array.from(dailyMap.entries()).sort(([left], [right]) => left.localeCompare(right)).map(([date, revenue]) => ({ date, revenue }));
      const monthly = Array.from(monthlyMap.entries()).sort(([left], [right]) => left.localeCompare(right)).map(([month, revenue]) => ({ month, revenue }));
      const latestDaily = daily[daily.length - 1]?.revenue || 0;
      const previousDaily = daily[daily.length - 2]?.revenue || latestDaily;

      return jsonResponse({
        franchise_wise_revenue: franchiseWise,
        daily,
        monthly,
        investigation_triggered: latestDaily < previousDaily,
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_revenue",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/leads") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);

      const franchiseIds = scope.map((item: any) => item.id);
      const [leadsResult, queueResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_leads").select("*").in("franchise_id", franchiseIds).order("created_at", { ascending: false }).limit(50),
        ctx.supabaseAdmin.from("franchise_routing_queue").select("*").in("franchise_id", franchiseIds).order("created_at", { ascending: false }).limit(50),
      ]);

      const leads = leadsResult.data || [];
      const pipeline = leads.reduce((acc: Record<string, number>, lead: any) => {
        const key = String(lead.status || "new");
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return jsonResponse({
        leads,
        routing_queue: queueResult.data || [],
        pipeline,
        ai_score_average: leads.length ? leads.reduce((sum: number, lead: any) => sum + toNumber(lead.lead_score), 0) / leads.length : 0,
        no_lead_loss: !(queueResult.data || []).some((item: any) => item.queue_status === "queued" && !item.store_id),
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_leads",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/customers/activity") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);

      const franchiseIds = scope.map((item: any) => item.id);
      const { data: activity, error } = await ctx.supabaseAdmin
        .from("franchise_customer_activity")
        .select("*")
        .in("franchise_id", franchiseIds)
        .order("activity_date", { ascending: false });

      if (error) return errorResponse("Unable to retrieve customer activity.");

      const totals = (activity || []).reduce((acc: { new_customers: number; repeat_customers: number; churn_customers: number; predicted_churn_rate: number }, item: any) => ({
        new_customers: acc.new_customers + toNumber(item.new_customers),
        repeat_customers: acc.repeat_customers + toNumber(item.repeat_customers),
        churn_customers: acc.churn_customers + toNumber(item.churn_customers),
        predicted_churn_rate: Math.max(acc.predicted_churn_rate, toNumber(item.predicted_churn_rate)),
      }), { new_customers: 0, repeat_customers: 0, churn_customers: 0, predicted_churn_rate: 0 });

      return jsonResponse({
        activity: activity || [],
        totals,
        churn_prediction: totals.predicted_churn_rate,
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "customer_activity",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/approvals") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);
      const franchiseIds = scope.map((item: any) => item.id);

      const [{ data: approvals, error }, applicationResult] = await Promise.all([
        ctx.supabaseAdmin
          .from("franchise_manager_approvals")
          .select("*")
          .in("franchise_id", franchiseIds)
          .order("created_at", { ascending: false }),
        ctx.supabaseAdmin
          .from("franchise_applications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(25),
      ]);

      if (error) return errorResponse("Unable to retrieve approvals.");

      const applicationApprovals = (applicationResult.data || [])
        .filter((item: any) => FRANCHISE_REVIEWER_ROLES.includes(ctx.user!.role) || item.user_id === ctx.user!.userId)
        .map(mapApplicationToApproval);

      const mergedApprovals = [...(approvals || []), ...applicationApprovals]
        .sort((left: any, right: any) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());

      return jsonResponse({
        approvals: mergedApprovals,
        pending_count: mergedApprovals.filter((item: any) => item.status === "pending" || item.status === "under_review").length,
        blocked_execution: true,
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_approvals",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/approval/action") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["approval_id", "decision"]);
      if (validation) return errorResponse(validation);

      const decision = String(ctx.body.decision || "").toLowerCase();
      if (![
        "approve",
        "reject",
        "block",
      ].includes(decision)) return errorResponse("Decision must be approve, reject, or block.", 400);

      const { data: applicationApproval } = await ctx.supabaseAdmin
        .from("franchise_applications")
        .select("*")
        .eq("id", ctx.body.approval_id)
        .maybeSingle();

      if (applicationApproval) {
        if (!["pending", "under_review"].includes(String(applicationApproval.status || ""))) {
          return errorResponse("Application is already finalized.", 400);
        }

        if (decision === "approve") {
          const franchise = await activateApprovedApplication(ctx, applicationApproval, ctx.body.note || null);
          await writeFranchiseAudit(ctx, "application_approve", {
            application_id: applicationApproval.application_id,
            franchise_id: franchise.id,
          });
          return jsonResponse({ approval: mapApplicationToApproval({ ...applicationApproval, status: "approved", approval_notes: ctx.body.note || null }), role_context: buildRoleContext() });
        }

        const nextStatus = decision === "block" ? "blocked" : "rejected";
        const reviewedAt = new Date().toISOString();
        const { data: updatedApplication, error: updateError } = await ctx.supabaseAdmin
          .from("franchise_applications")
          .update({
            status: nextStatus,
            approval_notes: ctx.body.note || null,
            reviewed_by: ctx.user!.userId,
            reviewed_at: reviewedAt,
            blocked_by: decision === "block" ? ctx.user!.userId : null,
            blocked_at: decision === "block" ? reviewedAt : null,
          })
          .eq("id", applicationApproval.id)
          .select("*")
          .single();

        if (updateError || !updatedApplication) return errorResponse("Unable to update franchise application.", 500);

        await createNotificationRecords(ctx, {
          userIds: [applicationApproval.user_id],
          type: decision === "block" ? "danger" : "warning",
          message: `Franchise application ${applicationApproval.application_id} ${nextStatus}.`,
          eventType: decision === "block" ? "franchise_apply_blocked" : "franchise_apply_rejected",
          actionLabel: "View status",
          actionUrl: "/franchise/status",
          roleTarget: ["user"],
          metadata: { application_id: applicationApproval.application_id, note: ctx.body.note || null },
        });

        await writeFranchiseAudit(ctx, `application_${decision}`, {
          application_id: applicationApproval.application_id,
          next_status: nextStatus,
        });

        return jsonResponse({ approval: mapApplicationToApproval(updatedApplication), role_context: buildRoleContext() });
      }

      const { data: approval, error: approvalError } = await ctx.supabaseAdmin
        .from("franchise_manager_approvals")
        .select("*")
        .eq("id", ctx.body.approval_id)
        .single();

      if (approvalError || !approval) return errorResponse("Approval request not found.", 404);
      if (approval.status !== "pending") return errorResponse("Approval request is already finalized.", 400);

      if (decision === "block") return errorResponse("Block is only supported for franchise applications.", 400);

      const nextStatus = decision === "approve" ? "approved" : "rejected";
      const { data: updated, error } = await ctx.supabaseAdmin
        .from("franchise_manager_approvals")
        .update({
          status: nextStatus,
          execution_blocked: decision !== "approve",
          approved_by: ctx.user!.userId,
          approved_role: FRANCHISE_SYSTEM_ROLE,
          approval_note: ctx.body.note || null,
          approved_at: new Date().toISOString(),
        })
        .eq("id", approval.id)
        .select()
        .single();

      if (error) return errorResponse("Unable to update approval.");

      await writeFranchiseAudit(ctx, `approval_${decision}`, {
        approval_id: approval.id,
        franchise_id: approval.franchise_id,
        request_type: approval.request_type,
      });

      return jsonResponse({ approval: updated, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "approval_action",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/reports") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const scope = await getFranchiseScope(ctx, url.searchParams.get("franchise_id"));
      if (!scope.length) return errorResponse("Franchise not found.", 404);
      const franchiseIds = scope.map((item: any) => item.id);

      const [commissionsResult, leadsResult, staffResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_commissions").select("franchise_id,commission_amount,status").in("franchise_id", franchiseIds),
        ctx.supabaseAdmin.from("franchise_leads").select("franchise_id,status,lead_score").in("franchise_id", franchiseIds),
        ctx.supabaseAdmin.from("franchise_manager_staff").select("franchise_id,performance_score,activity_status").in("franchise_id", franchiseIds),
      ]);

      const revenueReport = scope.map((franchise: any) => ({
        franchise_name: franchise.business_name,
        revenue: (commissionsResult.data || []).filter((item: any) => item.franchise_id === franchise.id).reduce((sum: number, item: any) => sum + toNumber(item.commission_amount), 0),
      }));

      const leadsReport = scope.map((franchise: any) => ({
        franchise_name: franchise.business_name,
        total_leads: (leadsResult.data || []).filter((item: any) => item.franchise_id === franchise.id).length,
        avg_score: (() => {
          const franchiseLeads = (leadsResult.data || []).filter((item: any) => item.franchise_id === franchise.id);
          return franchiseLeads.length ? franchiseLeads.reduce((sum: number, item: any) => sum + toNumber(item.lead_score), 0) / franchiseLeads.length : 0;
        })(),
      }));

      const performanceReport = scope.map((franchise: any) => {
        const franchiseStaff = (staffResult.data || []).filter((item: any) => item.franchise_id === franchise.id);
        return {
          franchise_name: franchise.business_name,
          active_staff: franchiseStaff.filter((item: any) => item.activity_status === "active").length,
          avg_performance: franchiseStaff.length ? franchiseStaff.reduce((sum: number, item: any) => sum + toNumber(item.performance_score), 0) / franchiseStaff.length : 0,
        };
      });

      return jsonResponse({
        revenue: revenueReport,
        leads: leadsReport,
        performance: performanceReport,
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_reports",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/franchise/activity") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data: activityData, error: activityError } = await ctx.supabaseAdmin
        .from("audit_logs")
        .select("id,module,action,user_id,role,meta_json,timestamp")
        .eq("module", "franchise")
        .order("timestamp", { ascending: false })
        .limit(50);

      if (activityError) return errorResponse("Unable to retrieve franchise activity.");

      return jsonResponse({
        activity: activityData || [],
        append_only: true,
        editable: false,
        deletable: false,
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "franchise_activity",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/live-dashboard") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const [storesResult, metricsResult, leadsResult, payoutsResult, fraudResult, supportResult, recentLeadsResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_stores").select("*").eq("franchise_id", franchise.id).order("performance_score", { ascending: false }),
        ctx.supabaseAdmin.from("franchise_live_metrics").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        ctx.supabaseAdmin.from("franchise_leads").select("id,status,lead_score,last_activity_at").eq("franchise_id", franchise.id),
        ctx.supabaseAdmin.from("franchise_payouts").select("id,status,amount,requested_at").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(10),
        ctx.supabaseAdmin.from("franchise_fraud_alerts").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(5),
        ctx.supabaseAdmin.from("franchise_support_tickets").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(5),
        ctx.supabaseAdmin.from("franchise_leads").select("id,lead_name,city,region,status,lead_score,created_at").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(8),
      ]);

      const stores = storesResult.data || [];
      const leads = leadsResult.data || [];
      const metrics = metricsResult.data || null;
      const liveUsers = metrics?.live_users ?? stores.reduce((sum: number, store: any) => sum + toNumber(store.live_users), 0);
      const liveLeads = metrics?.live_leads ?? stores.reduce((sum: number, store: any) => sum + toNumber(store.live_leads), 0);
      const liveConversions = metrics?.live_conversions ?? stores.reduce((sum: number, store: any) => sum + toNumber(store.live_conversions), 0);
      const revenuePerSecond = metrics?.revenue_per_second ?? stores.reduce((sum: number, store: any) => sum + toNumber(store.revenue_per_second), 0);
      const activeStores = stores.filter((store: any) => store.status === "active").length;
      const convertedLeads = leads.filter((lead: any) => lead.status === "closed_won").length;
      const conversionRate = leads.length ? (convertedLeads / leads.length) * 100 : 0;
      const trafficSpike = liveUsers > 5000 || revenuePerSecond > 500;

      if (trafficSpike && franchise.auto_scale_enabled) {
        await ctx.supabaseAdmin.from("franchise_accounts").update({ last_auto_scale_at: new Date().toISOString() }).eq("id", franchise.id);
      }

      return jsonResponse({
        franchise: applyMasking(franchise, ctx.user!.role),
        metrics: {
          live_users: liveUsers,
          live_leads: liveLeads,
          live_conversions: liveConversions,
          revenue_per_second: revenuePerSecond,
          active_stores: metrics?.active_stores ?? activeStores,
          conversion_rate: conversionRate,
          auto_scale_triggered: trafficSpike && franchise.auto_scale_enabled,
        },
        stores,
        recent_leads: recentLeadsResult.data || [],
        recent_payouts: payoutsResult.data || [],
        fraud_alerts: fraudResult.data || [],
        support_tickets: supportResult.data || [],
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "live_dashboard",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/stores/advanced") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const { data: stores, error } = await ctx.supabaseAdmin
        .from("franchise_stores")
        .select("*")
        .eq("franchise_id", franchise.id)
        .order("performance_score", { ascending: false });

      if (error) return errorResponse("Unable to retrieve stores.");

      await ensureStoreTasks(ctx, franchise.id, stores || []);

      const cityComparison = (stores || []).reduce((acc: Record<string, { leads: number; revenuePerSecond: number; stores: number }>, store: any) => {
        const key = store.city || "Unknown";
        acc[key] = acc[key] || { leads: 0, revenuePerSecond: 0, stores: 0 };
        acc[key].leads += toNumber(store.live_leads);
        acc[key].revenuePerSecond += toNumber(store.revenue_per_second);
        acc[key].stores += 1;
        return acc;
      }, {});

      return jsonResponse({
        stores: stores || [],
        heatmap: (stores || []).map((store: any) => ({ city: store.city, score: toNumber(store.performance_score), status: store.status })),
        city_comparison: Object.entries(cityComparison).map(([city, summary]) => ({ city, ...summary })),
        ranking: (stores || []).map((store: any, index: number) => ({ rank: index + 1, ...store })),
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "stores_advanced",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/store/create") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const validation = validateRequired(ctx.body, ["store_name", "city"]);
      if (validation) return errorResponse(validation);

      const storeCode = ctx.body.store_code || `STR-${String(ctx.body.city).slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const { data: store, error } = await ctx.supabaseAdmin
        .from("franchise_stores")
        .insert({
          franchise_id: franchise.id,
          store_code: storeCode,
          store_name: ctx.body.store_name,
          city: ctx.body.city,
          state: ctx.body.state,
          country: ctx.body.country || franchise.country || "India",
          capacity: ctx.body.capacity || 100,
          current_load: 0,
          manager_user_id: ctx.body.manager_user_id,
          metadata: {
            ...(ctx.body.metadata || {}),
            role_context: buildRoleContext(),
          },
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create store.");
      await writeFranchiseAudit(ctx, "store_create", { franchise_id: franchise.id, store_id: store.id });
      return jsonResponse({ store, role_context: buildRoleContext() }, 201);
    }, {
      module: "franchise",
      action: "store_create",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/lead/create") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const validation = validateRequired(ctx.body, ["lead_name"]);
      if (validation) return errorResponse(validation);

      const leadScore = toNumber(ctx.body.lead_score, 55);
      const status = ctx.body.status || "new";

      const { data: lead, error } = await ctx.supabaseAdmin
        .from("franchise_leads")
        .insert({
          franchise_id: franchise.id,
          lead_name: ctx.body.lead_name,
          masked_contact: ctx.body.masked_contact || maskPhone(String(ctx.body.phone || "0000000000")),
          industry: ctx.body.industry,
          region: ctx.body.region || franchise.state,
          city: ctx.body.city || franchise.city,
          language_preference: ctx.body.language_preference || "en",
          lead_score: leadScore,
          status,
          demo_requested: !!ctx.body.demo_requested,
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create lead.");
      await writeFranchiseAudit(ctx, "lead_create", { franchise_id: franchise.id, lead_id: lead.id });
      return jsonResponse({ lead, role_context: buildRoleContext() }, 201);
    }, {
      module: "franchise",
      action: "lead_create",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && (path === "/lead/auto-route" || path === "/routing/auto")) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, [ctx.body.franchise_lead_id ? "franchise_lead_id" : "lead_id"]);
      if (validation) return errorResponse(validation);

      const franchiseLeadId = ctx.body.franchise_lead_id;
      const leadTable = franchiseLeadId ? "franchise_leads" : "leads";
      const leadValue = franchiseLeadId || ctx.body.lead_id;
      const { data: lead, error: leadError } = await ctx.supabaseAdmin
        .from(leadTable)
        .select("*")
        .eq("id", leadValue)
        .single();

      if (leadError || !lead) return errorResponse("Lead not found.", 404);

      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || lead.franchise_id || url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const { data: stores } = await ctx.supabaseAdmin
        .from("franchise_stores")
        .select("*")
        .eq("franchise_id", franchise.id);

      const chosenStore = chooseBestStore(stores || [], lead);
      const aiScore = toNumber(ctx.body.ai_score, toNumber(lead.lead_score, 72));
      const queueStatus = chosenStore?.manager_user_id ? "routed" : chosenStore ? "no_agent" : "queued";

      const { data: queueEntry, error } = await ctx.supabaseAdmin
        .from("franchise_routing_queue")
        .insert({
          franchise_id: franchise.id,
          lead_id: franchiseLeadId ? null : lead.id,
          store_id: chosenStore?.id || null,
          agent_user_id: chosenStore?.manager_user_id || null,
          city: lead.city,
          state: lead.state,
          country: lead.country,
          ai_score: aiScore,
          queue_status: queueStatus,
          metadata: {
            franchise_lead_id: franchiseLeadId || null,
            source: lead.source,
            capacity: chosenStore?.capacity,
            current_load: chosenStore?.current_load,
            role_context: buildRoleContext(),
          },
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to route lead.");

      if (chosenStore) {
        await ctx.supabaseAdmin
          .from("franchise_stores")
          .update({ current_load: toNumber(chosenStore.current_load) + 1, live_leads: toNumber(chosenStore.live_leads) + 1 })
          .eq("id", chosenStore.id);
      }

      if (queueStatus === "no_agent" || queueStatus === "queued") {
        await notificationMiddleware(ctx, "franchise.routing_queue", {
          franchise_id: franchise.id,
          lead_id: lead.id,
          target_role: "lead_manager",
          role_context: buildRoleContext(),
        });
      }

      await writeFranchiseAudit(ctx, "lead_auto_route", {
        franchise_id: franchise.id,
        lead_id: lead.id,
        route_id: queueEntry.id,
        queue_status: queueStatus,
      });

      return jsonResponse({
        route: queueEntry,
        selected_store: chosenStore,
        no_idle_agent: !chosenStore?.manager_user_id,
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "lead_auto_route",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/conversion/engine") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const { data: leads } = await ctx.supabaseAdmin.from("franchise_leads").select("status,lead_score,sale_value").eq("franchise_id", franchise.id);
      const stages = ["new", "assigned", "contacted", "demo_scheduled", "negotiation", "closed_won", "closed_lost"];
      const counts = Object.fromEntries(stages.map((stage) => [stage, 0]));
      let highIntent = 0;

      for (const lead of leads || []) {
        counts[lead.status] = (counts[lead.status] || 0) + 1;
        if (toNumber(lead.lead_score) >= 80) highIntent += 1;
      }

      return jsonResponse({
        funnel: counts,
        high_intent_leads: highIntent,
        payment_ready: counts.closed_won || 0,
        total_sale_value: (leads || []).reduce((sum: number, lead: any) => sum + toNumber(lead.sale_value), 0),
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "conversion_engine",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/ads/auto-optimize") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data: campaigns } = await ctx.supabaseAdmin
        .from("marketing_campaigns")
        .select("id,name,status,budget,spent,revenue,channel")
        .order("created_at", { ascending: false })
        .limit(10);

      const actions = (campaigns || []).map((campaign: any) => {
        const spent = toNumber(campaign.spent);
        const revenue = toNumber(campaign.revenue);
        const roi = spent > 0 ? ((revenue - spent) / spent) * 100 : 0;

        if (roi < 15 && campaign.status === "active") return { campaign_id: campaign.id, name: campaign.name, action: "pause", roi };
        if (roi > 60) return { campaign_id: campaign.id, name: campaign.name, action: "scale_budget", roi };
        return { campaign_id: campaign.id, name: campaign.name, action: "hold", roi };
      });

      for (const item of actions) {
        if (item.action === "pause") {
          await ctx.supabaseAdmin.from("marketing_campaigns").update({ status: "paused" }).eq("id", item.campaign_id);
        }
        if (item.action === "scale_budget") {
          const campaign = (campaigns || []).find((entry: any) => entry.id === item.campaign_id);
          await ctx.supabaseAdmin.from("marketing_campaigns").update({ budget: toNumber(campaign?.budget) * 1.15 }).eq("id", item.campaign_id);
        }
      }

      return jsonResponse({ actions, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "ads_auto_optimize",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/revenue/validate") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const gatewayAmount = toNumber(ctx.body.gateway_amount);
      const invoiceAmount = toNumber(ctx.body.invoice_amount);
      const reportedAmount = toNumber(ctx.body.reported_amount);
      const matched = gatewayAmount === invoiceAmount && invoiceAmount === reportedAmount;
      const status = matched ? "matched" : "blocked";
      const mismatchReason = matched ? null : "Revenue mismatch between gateway, invoice, and store report";

      const { data: validation, error } = await ctx.supabaseAdmin
        .from("franchise_revenue_validations")
        .insert({
          franchise_id: franchise.id,
          store_id: ctx.body.store_id,
          payout_id: ctx.body.payout_id,
          gateway_amount: gatewayAmount,
          invoice_amount: invoiceAmount,
          reported_amount: reportedAmount,
          status,
          mismatch_reason: mismatchReason,
          metadata: {
            ...(ctx.body.metadata || {}),
            role_context: buildRoleContext(),
          },
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to validate revenue.");

      if (!matched) {
        await ctx.supabaseAdmin.from("franchise_accounts").update({ wallet_locked: true, risk_level: "critical", freeze_reason: mismatchReason }).eq("id", franchise.id);
        await ctx.supabaseAdmin.from("franchise_fraud_alerts").insert({
          franchise_id: franchise.id,
          store_id: ctx.body.store_id,
          alert_type: "payout_manipulation",
          severity: "critical",
          status: "frozen",
          details: { gatewayAmount, invoiceAmount, reportedAmount, role_context: buildRoleContext() },
        });
      }

      await writeFranchiseAudit(ctx, "revenue_validate", {
        franchise_id: franchise.id,
        validation_id: validation.id,
        wallet_locked: !matched,
      });

      return jsonResponse({ validation, wallet_locked: !matched, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "revenue_validate",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
      requireKYC: true,
    });
  }

  if (method === "POST" && (path === "/payout/process" || path === "/wallet/withdraw" || path === "/wallet/payout")) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);
      if (franchise.wallet_locked) return errorResponse("Wallet is locked pending validation review.", 403);

      const amount = toNumber(ctx.body.amount);
      if (!amount || amount <= 0) return errorResponse("Amount is required.");

      const { data: ledger } = await ctx.supabaseAdmin
        .from("franchise_wallet_ledger")
        .select("balance_after")
        .eq("franchise_id", franchise.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const availableBalance = toNumber(ledger?.balance_after);
      if (availableBalance < amount) return errorResponse("Insufficient wallet balance.", 400);

      const { data: payout, error } = await ctx.supabaseAdmin
        .from("franchise_payouts")
        .insert({
          franchise_id: franchise.id,
          amount,
          type: path === "/wallet/withdraw" ? "withdrawal" : (ctx.body.type || "commission"),
          status: "pending",
          payment_method: ctx.body.payment_method || "bank_transfer",
          bank_details: ctx.body.bank_details || {},
          notes: ctx.body.notes || "Awaiting finance approval",
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to process payout.");

      await ctx.supabaseAdmin.from("franchise_wallet_ledger").insert({
        franchise_id: franchise.id,
        transaction_type: "debit",
        category: "withdrawal",
        amount,
        balance_after: availableBalance - amount,
        reference_id: payout.id,
        reference_type: "franchise_payouts",
        description: "Payout request locked for approval",
      });

      await notificationMiddleware(ctx, "wallet.payout_request", {
        payout_id: payout.id,
        franchise_id: franchise.id,
        amount,
        target_role: "finance_manager",
        role_context: buildRoleContext(),
      });
      await writeFranchiseAudit(ctx, "payout_process", { franchise_id: franchise.id, payout_id: payout.id, amount });

      return jsonResponse({ payout, available_balance: availableBalance - amount, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "payout_process",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
      requireKYC: true,
    });
  }

  if (method === "GET" && path === "/wallet/ledger") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const [ledgerResult, payoutsResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_wallet_ledger").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(50),
        ctx.supabaseAdmin.from("franchise_payouts").select("id,amount,status,type,created_at").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(20),
      ]);

      const ledgerItems = ledgerResult.data || [];
      const balance = ledgerItems[0]?.balance_after || 0;

      return jsonResponse({
        balance,
        wallet_locked: franchise.wallet_locked,
        risk_level: franchise.risk_level,
        ledger: ledgerItems,
        payouts: payoutsResult.data || [],
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "wallet_ledger",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && (path === "/ai/franchise/brain" || path === "/ai/franchise-manager")) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const [storesResult, leadsResult, staffResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_stores").select("*").eq("franchise_id", franchise.id).order("performance_score", { ascending: false }),
        ctx.supabaseAdmin.from("franchise_leads").select("lead_score,city,created_at,status").eq("franchise_id", franchise.id),
        ctx.supabaseAdmin.from("franchise_manager_staff").select("full_name,performance_score,activity_status,role").eq("franchise_id", franchise.id).order("performance_score", { ascending: false }),
      ]);

      const stores = storesResult.data || [];
      const leads = leadsResult.data || [];
      const staff = staffResult.data || [];
      const bestStore = stores[0];
      const worstStore = stores.slice().sort((a: any, b: any) => toNumber(a.performance_score) - toNumber(b.performance_score))[0];
      const topStaff = staff[0];
      const averageLeadScore = leads.length ? leads.reduce((sum: number, lead: any) => sum + toNumber(lead.lead_score), 0) / leads.length : 0;

      const suggestions = [
        {
          suggestion_type: "best_store",
          title: "Best franchise suggestion",
          summary: bestStore ? `${bestStore.store_name} is the best expansion-ready franchise node.` : "No active franchise store available.",
          payload: { store_id: bestStore?.id, performance_score: bestStore?.performance_score },
        },
        {
          suggestion_type: "best_agent",
          title: "Lead optimization",
          summary: topStaff ? `${topStaff.full_name} should receive the highest scoring leads.` : "No top staff signal available.",
          payload: { full_name: topStaff?.full_name, role: topStaff?.role },
        },
        {
          suggestion_type: "action_plan",
          title: "Revenue growth plan",
          summary: worstStore ? `Recover ${worstStore.store_name} and raise average lead score above ${averageLeadScore.toFixed(1)}.` : `Average lead score is ${averageLeadScore.toFixed(1)}.`,
          payload: { averageLeadScore, weak_store_id: worstStore?.id },
        },
        {
          suggestion_type: "churn_prevention",
          title: "Staff performance insights",
          summary: staff.filter((item: any) => item.activity_status === "inactive").length
            ? "Inactive staff detected. Review performance and reward top staff."
            : "Staff activity is healthy. Reward top performers.",
          payload: { inactive_count: staff.filter((item: any) => item.activity_status === "inactive").length },
        },
      ];

      const { data } = await ctx.supabaseAdmin
        .from("franchise_ai_suggestions")
        .insert(suggestions.map((suggestion) => ({ franchise_id: franchise.id, ...suggestion })))
        .select();

      await writeFranchiseAudit(ctx, "ai_franchise_manager", { franchise_id: franchise.id, suggestion_count: suggestions.length });
      return jsonResponse({ suggestions: data || [], suggest_only: true, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "ai_franchise_manager",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/support/priority") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const { data: tickets, error } = await ctx.supabaseAdmin
        .from("franchise_support_tickets")
        .select("*")
        .eq("franchise_id", franchise.id)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) return errorResponse("Unable to retrieve support tickets.");

      return jsonResponse({
        priority_queue: tickets || [],
        critical_count: (tickets || []).filter((ticket: any) => ticket.priority === "critical").length,
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "support_priority",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/ticket/create") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, ctx.body.franchise_id || url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const validation = validateRequired(ctx.body, ["subject", "description", "category"]);
      if (validation) return errorResponse(validation);

      const { data: ticket, error } = await ctx.supabaseAdmin
        .from("franchise_support_tickets")
        .insert({
          franchise_id: franchise.id,
          subject: ctx.body.subject,
          description: ctx.body.description,
          category: ctx.body.category,
          priority: ctx.body.priority || "high",
          status: ctx.body.priority === "critical" ? "escalated" : "open",
          escalation_level: ctx.body.priority === "critical" ? 2 : 1,
          metadata: {
            ...(ctx.body.metadata || {}),
            role_context: buildRoleContext(),
          },
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create support ticket.");

      await notificationMiddleware(ctx, "support.ticket", {
        franchise_id: franchise.id,
        ticket_id: ticket.id,
        target_role: "support",
        role_context: buildRoleContext(),
      });
      await writeFranchiseAudit(ctx, "ticket_create", { franchise_id: franchise.id, ticket_id: ticket.id });

      return jsonResponse({ ticket, role_context: buildRoleContext() }, 201);
    }, {
      module: "franchise",
      action: "ticket_create",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/ai-report") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchise = await getFranchiseForUser(ctx, url.searchParams.get("franchise_id"));
      if (!franchise) return errorResponse("Franchise not found.", 404);

      const [storesResult, leadsResult, fraudResult] = await Promise.all([
        ctx.supabaseAdmin.from("franchise_stores").select("*").eq("franchise_id", franchise.id),
        ctx.supabaseAdmin.from("franchise_leads").select("status,lead_score,city").eq("franchise_id", franchise.id),
        ctx.supabaseAdmin.from("franchise_fraud_alerts").select("*").eq("franchise_id", franchise.id).order("created_at", { ascending: false }).limit(10),
      ]);

      const stores = storesResult.data || [];
      const leads = leadsResult.data || [];
      const bestStore = stores.slice().sort((a: any, b: any) => toNumber(b.performance_score) - toNumber(a.performance_score))[0] || null;
      const worstStore = stores.slice().sort((a: any, b: any) => toNumber(a.performance_score) - toNumber(b.performance_score))[0] || null;
      const topAgents = stores
        .filter((store: any) => store.manager_user_id)
        .slice(0, 5)
        .map((store: any) => ({ user_id: store.manager_user_id, store_name: store.store_name, performance_score: store.performance_score }));
      const lossAreas = [
        ...(worstStore ? [{ type: "store", name: worstStore.store_name, score: worstStore.performance_score }] : []),
        ...((fraudResult.data || []).map((alert: any) => ({ type: "fraud", name: alert.alert_type, score: alert.severity }))),
      ];

      return jsonResponse({
        best_store: bestStore,
        worst_store: worstStore,
        top_agents: topAgents,
        loss_areas: lossAreas,
        action_plan: [
          bestStore ? `Scale best-performing store ${bestStore.store_name}` : "No active store to scale",
          worstStore ? `Recover or freeze ${worstStore.store_name}` : "No underperforming store",
          `Review ${(leads || []).filter((lead: any) => toNumber(lead.lead_score) < 50).length} low-score leads for churn prevention`,
        ],
        role_context: buildRoleContext(),
      });
    }, {
      module: "franchise",
      action: "ai_report",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/assign-lead") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["franchise_id", "lead_id"]);
      if (validation) return errorResponse(validation);

      const { data: lead, error } = await ctx.supabaseAdmin
        .from("franchise_leads")
        .insert({
          franchise_id: ctx.body.franchise_id,
          original_lead_id: ctx.body.lead_id,
          lead_name: ctx.body.lead_name || "Lead",
          status: "assigned",
          region: ctx.body.region,
          city: ctx.body.city,
          assigned_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to assign lead to franchise.");

      await createBuzzerAlert(ctx.supabaseAdmin, "lead.new", "franchise", null, lead.id, "high", ctx.body.region);
      await notificationMiddleware(ctx, "lead.new", { lead_id: lead.id, target_user_id: ctx.body.franchise_user_id, buzzer: true, role_context: buildRoleContext() });
      await writeFranchiseAudit(ctx, "assign_lead", { franchise_id: ctx.body.franchise_id, lead_id: lead.id });

      return jsonResponse({ message: "Lead has been assigned to the franchise successfully.", lead: applyMasking(lead, ctx.user!.role), role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "assign_lead",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "POST" && path === "/escalate") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["franchise_id", "subject", "description", "escalation_type"]);
      if (validation) return errorResponse(validation);

      const { data: escalation, error } = await ctx.supabaseAdmin
        .from("franchise_escalations")
        .insert({
          franchise_id: ctx.body.franchise_id,
          escalation_type: ctx.body.escalation_type,
          subject: ctx.body.subject,
          description: ctx.body.description,
          priority: ctx.body.priority || "normal",
          status: "open",
          attachments: ctx.body.attachments || [],
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create escalation.");

      const targetRole = ctx.body.escalation_type === "legal" ? "legal_compliance" : "admin";
      await createBuzzerAlert(ctx.supabaseAdmin, "legal.alert", targetRole, null, null, ctx.body.priority === "urgent" ? "urgent" : "high");
      await writeFranchiseAudit(ctx, "escalate", { franchise_id: ctx.body.franchise_id, escalation_id: escalation.id });

      return jsonResponse({ message: "Your escalation has been submitted.", escalation, role_context: buildRoleContext() }, 201);
    }, {
      module: "franchise",
      action: "escalate",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/territory") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchiseId = url.searchParams.get("franchise_id");
      let query = ctx.supabaseAdmin.from("franchise_territories").select(`
        *,
        franchise_accounts!inner(user_id, business_name)
      `);

      if (franchiseId) {
        query = query.eq("franchise_id", franchiseId);
      } else if (!isPrivilegedRole(ctx.user!.role)) {
        query = query.eq("franchise_accounts.user_id", ctx.user!.userId);
      }

      const { data, error } = await query;
      if (error) return errorResponse("Unable to retrieve territory information.");
      return jsonResponse({ items: data, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "view_territory",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  if (method === "GET" && path === "/commissions") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchiseId = url.searchParams.get("franchise_id");
      let targetFranchiseId = franchiseId;

      if (!targetFranchiseId && !["super_admin", "boss_owner", "ceo", "admin", "finance_manager"].includes(ctx.user!.role)) {
        const franchise = await getFranchiseForUser(ctx);
        if (franchise) targetFranchiseId = franchise.id;
      }

      let query = ctx.supabaseAdmin.from("franchise_commissions").select("*");
      if (targetFranchiseId) query = query.eq("franchise_id", targetFranchiseId);
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) return errorResponse("Unable to retrieve commission history.");

      const totals = (data || []).reduce((acc: { pending: number; approved: number; credited: number }, commission: any) => ({
        pending: acc.pending + (commission.status === "pending" ? toNumber(commission.commission_amount) : 0),
        approved: acc.approved + (commission.status === "approved" ? toNumber(commission.commission_amount) : 0),
        credited: acc.credited + (commission.status === "credited" ? toNumber(commission.commission_amount) : 0),
      }), { pending: 0, approved: 0, credited: 0 });

      return jsonResponse({ commissions: data || [], totals, role_context: buildRoleContext() });
    }, {
      module: "franchise",
      action: "view_commissions",
      allowedRoles: FRANCHISE_ALLOWED_ROLES,
    });
  }

  return errorResponse("Endpoint not found", 404);
});