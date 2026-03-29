import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  isValidUUID,
  isValidNumber,
} from "../_shared/utils.ts";
import { withAuth, RequestContext } from "../_shared/middleware.ts";

// Valid plan types with pricing
const VALID_PLANS: Record<string, { validityDays: number; minAmount: number; maxAmount: number }> = {
  monthly: { validityDays: 30, minAmount: 500, maxAmount: 10000 },
  yearly: { validityDays: 365, minAmount: 5000, maxAmount: 100000 },
  lifetime: { validityDays: 36500, minAmount: 10000, maxAmount: 500000 }, // 100 years
};

// Tax rates by region
const TAX_RATES: Record<string, number> = {
  IN: 0.18, // 18% GST for India
  US: 0.0,  // No tax (handled by states)
  EU: 0.20, // 20% VAT for EU
  DEFAULT: 0.18,
};

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-subscriptions", "").replace("/api-subscribe", "").replace("/api-subscription", "").replace("/api-invoice", "");

  // POST /subscribe
  if ((path === "" || path === "/") && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["plan", "amount"]);
      if (validation) return errorResponse(validation);

      const plan = String(body.plan).toLowerCase();
      const amount = Number(body.amount);

      // Validate plan type
      if (!VALID_PLANS[plan]) {
        return errorResponse(`Invalid plan type. Valid plans: ${Object.keys(VALID_PLANS).join(', ')}`);
      }

      const planConfig = VALID_PLANS[plan];

      // Validate amount range for plan
      if (!isValidNumber(amount, planConfig.minAmount, planConfig.maxAmount)) {
        return errorResponse(`Amount for ${plan} plan must be between ₹${planConfig.minAmount} and ₹${planConfig.maxAmount}`);
      }

      // Check for existing active subscription to prevent duplicate charges
      const { data: existingSub } = await supabaseAdmin
        .from("subscriptions")
        .select("sub_id, plan, expired_at")
        .eq("user_id", user.userId)
        .eq("status", "active")
        .gte("expired_at", new Date().toISOString())
        .single();

      if (existingSub) {
        // Check if trying to subscribe to same or lower plan
        const existingPlanDays = VALID_PLANS[existingSub.plan]?.validityDays || 0;
        if (planConfig.validityDays <= existingPlanDays && plan !== 'lifetime') {
          return errorResponse(`You already have an active ${existingSub.plan} subscription until ${new Date(existingSub.expired_at).toLocaleDateString()}`);
        }
      }

      const activatedAt = new Date();
      const expiredAt = new Date(activatedAt.getTime() + planConfig.validityDays * 24 * 60 * 60 * 1000);

      // Deactivate existing subscriptions
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "replaced" })
        .eq("user_id", user.userId)
        .eq("status", "active");

      const { data, error } = await supabaseAdmin.from("subscriptions").insert({
        user_id: user.userId,
        plan: plan,
        amount: amount,
        validity: planConfig.validityDays,
        status: "active",
        activated_at: activatedAt.toISOString(),
        expired_at: expiredAt.toISOString(),
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      // Calculate tax based on region
      const region = body.region || 'IN';
      const taxRate = TAX_RATES[region] || TAX_RATES.DEFAULT;
      const tax = Math.round(amount * taxRate * 100) / 100;

      // Create invoice with unique number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
      
      await supabaseAdmin.from("invoices").insert({
        user_id: user.userId,
        invoice_number: invoiceNumber,
        amount: amount,
        tax: tax,
        currency: body.currency || "INR",
        status: "paid",
      });

      // Audit log
      await createAuditLog(supabaseAdmin, user.userId, user.role, "subscriptions", "subscription_activated", {
        plan,
        amount,
        tax,
        validity_days: planConfig.validityDays,
        expires_at: expiredAt.toISOString(),
      });

      return jsonResponse({
        message: "Subscription activated",
        subscription_id: data.sub_id,
        plan: plan,
        expires_at: expiredAt.toISOString(),
        invoice_number: invoiceNumber,
        total_paid: amount + tax,
      }, 201);
    }, { module: "subscriptions", action: "subscribe" });
  }

  // GET /subscription/status
  if (path === "/status" && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.userId)
        .eq("status", "active")
        .order("activated_at", { ascending: false })
        .limit(1)
        .single();

      if (!sub) {
        return jsonResponse({
          active: false,
          message: "No active subscription",
        });
      }

      const now = new Date();
      const expiry = new Date(sub.expired_at);
      const daysRemaining = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

      return jsonResponse({
        active: expiry > now,
        subscription_id: sub.sub_id,
        plan: sub.plan,
        activated_at: sub.activated_at,
        expires_at: sub.expired_at,
        days_remaining: daysRemaining,
        is_expired: expiry <= now,
      });
    }, { module: "subscriptions", action: "status" });
  }

  // POST /invoice/generate (admin only)
  if (path === "/generate" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "finance_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["user_id", "amount"]);
      if (validation) return errorResponse(validation);

      // Validate user_id
      if (!isValidUUID(body.user_id)) {
        return errorResponse("Invalid user ID format");
      }

      const amount = Number(body.amount);
      if (!isValidNumber(amount, 0.01, 100000000)) {
        return errorResponse("Amount must be between 0.01 and 100,000,000");
      }

      // Verify target user exists
      const { data: targetUser } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("user_id", body.user_id)
        .single();

      if (!targetUser) {
        return errorResponse("Target user not found", 404);
      }

      const taxRate = Number(body.tax_rate) || 0.18;
      if (!isValidNumber(taxRate, 0, 1)) {
        return errorResponse("Tax rate must be between 0 and 1 (e.g., 0.18 for 18%)");
      }

      const tax = Math.round(amount * taxRate * 100) / 100;
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

      const { data, error } = await supabaseAdmin.from("invoices").insert({
        user_id: body.user_id,
        invoice_number: invoiceNumber,
        amount: amount,
        tax: tax,
        currency: body.currency || "INR",
        pdf_link: body.pdf_link,
        status: body.status || "generated",
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      // Audit log
      await createAuditLog(supabaseAdmin, user.userId, user.role, "invoices", "invoice_generated", {
        target_user: body.user_id,
        invoice_number: invoiceNumber,
        amount,
        tax,
        total: amount + tax,
      });

      return jsonResponse({
        message: "Invoice generated",
        invoice_id: data.invoice_id,
        invoice_number: invoiceNumber,
        subtotal: amount,
        tax: tax,
        total: amount + tax,
      }, 201);
    }, { module: "invoices", action: "generate" });
  }

  // GET /invoices
  if ((path === "s" || path === "/list") && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      let query = supabaseAdmin.from("invoices").select("*");

      // Only admins can see all invoices
      if (!["super_admin", "admin", "finance_manager"].includes(user.role)) {
        query = query.eq("user_id", user.userId);
      }

      const { data, error } = await query.order("timestamp", { ascending: false }).limit(100);

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        invoices: data?.map((inv: any) => ({
          invoice_id: inv.invoice_id,
          invoice_number: inv.invoice_number,
          amount: Number(inv.amount) || 0,
          tax: Number(inv.tax) || 0,
          total: (Number(inv.amount) || 0) + (Number(inv.tax) || 0),
          currency: inv.currency,
          status: inv.status,
          pdf_link: inv.pdf_link,
          created_at: inv.timestamp,
        })) || [],
      });
    }, { module: "invoices", action: "list" });
  }

  // POST /refund (admin only)
  if (path === "/refund" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "finance_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["subscription_id", "reason"]);
      if (validation) return errorResponse(validation);

      if (!isValidUUID(body.subscription_id)) {
        return errorResponse("Invalid subscription ID format");
      }

      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("sub_id", body.subscription_id)
        .single();

      if (!sub) {
        return errorResponse("Subscription not found", 404);
      }

      // Calculate refund amount (prorated if applicable)
      const activatedAt = new Date(sub.activated_at);
      const expiredAt = new Date(sub.expired_at);
      const now = new Date();
      
      let refundAmount = Number(sub.amount) || 0;
      
      // Prorate refund for non-lifetime plans
      if (sub.plan !== 'lifetime' && now < expiredAt) {
        const totalDays = (expiredAt.getTime() - activatedAt.getTime()) / (24 * 60 * 60 * 1000);
        const usedDays = (now.getTime() - activatedAt.getTime()) / (24 * 60 * 60 * 1000);
        const remainingRatio = Math.max(0, (totalDays - usedDays) / totalDays);
        refundAmount = Math.round(refundAmount * remainingRatio * 100) / 100;
      }

      // Update subscription status
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "refunded" })
        .eq("sub_id", body.subscription_id);

      // Create refund invoice
      const invoiceNumber = `REF-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
      
      await supabaseAdmin.from("invoices").insert({
        user_id: sub.user_id,
        invoice_number: invoiceNumber,
        amount: -refundAmount,
        tax: 0,
        currency: "INR",
        status: "refunded",
      });

      // Audit log
      await createAuditLog(supabaseAdmin, user.userId, user.role, "subscriptions", "subscription_refunded", {
        subscription_id: body.subscription_id,
        original_amount: sub.amount,
        refund_amount: refundAmount,
        reason: body.reason,
      });

      return jsonResponse({
        message: "Refund processed",
        refund_amount: refundAmount,
        invoice_number: invoiceNumber,
      });
    }, { module: "subscriptions", action: "refund" });
  }

  return errorResponse("Not found", 404);
});
