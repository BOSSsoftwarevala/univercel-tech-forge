// =============================================================================
// fraud-detection-engine — Risk Scoring Edge Function
//
// Evaluates each order for fraud signals and returns a risk score (0–100).
// FLAG ONLY — no automatic blocking; all flagged orders go to boss review.
//
// Signals:
//  - Rapid attempts: 3+ orders in 5 minutes from same user/IP
//  - Velocity:       more than 10 orders/user/day
//  - Country/currency mismatch
//  - Amount outlier vs. user's previous orders
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitExceededResponse } from "../_shared/rate-limiter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const MAX_ORDERS_PER_USER_PER_DAY = parseInt(
  Deno.env.get("MAX_ORDERS_PER_USER_PER_DAY") ?? "10",
  10,
);
const RISK_THRESHOLD = parseInt(Deno.env.get("FRAUD_RISK_THRESHOLD") ?? "70", 10);

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

interface FraudInput {
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  ip_address: string;
  user_country?: string;
}

interface FraudResult {
  risk_score: number;
  flagged: boolean;
  reasons: string[];
}

async function evaluateFraud(
  input: FraudInput,
  supabase: ReturnType<typeof createClient>,
): Promise<FraudResult> {
  const reasons: string[] = [];
  let score = 0;

  const windowStart24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const windowStart5m = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  // ── 1. Velocity: orders per user per day ──────────────────────────────────
  const { count: dayCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", input.user_id)
    .gte("created_at", windowStart24h);

  if ((dayCount ?? 0) >= MAX_ORDERS_PER_USER_PER_DAY) {
    reasons.push(`velocity: ${dayCount} orders in 24h (limit ${MAX_ORDERS_PER_USER_PER_DAY})`);
    score += 30;
  }

  // ── 2. Rapid attempts: 3+ orders in 5 minutes ────────────────────────────
  const { count: rapidCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", input.user_id)
    .gte("created_at", windowStart5m);

  if ((rapidCount ?? 0) >= 3) {
    reasons.push(`rapid_attempts: ${rapidCount} orders in 5 min`);
    score += 25;
  }

  // ── 3. IP velocity: 5+ orders from same IP in 1h ─────────────────────────
  const windowStart1h = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: ipCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", input.ip_address)
    .gte("created_at", windowStart1h);

  if ((ipCount ?? 0) >= 5) {
    reasons.push(`ip_velocity: ${ipCount} orders from same IP in 1h`);
    score += 20;
  }

  // ── 4. Amount outlier vs previous orders ─────────────────────────────────
  const { data: prevOrders } = await supabase
    .from("orders")
    .select("amount")
    .eq("user_id", input.user_id)
    .neq("id", input.order_id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (prevOrders && prevOrders.length > 2) {
    const amounts = prevOrders.map((o: { amount: number }) => o.amount);
    const avg = amounts.reduce((s: number, a: number) => s + a, 0) / amounts.length;
    if (input.amount > avg * 5) {
      reasons.push(`amount_outlier: ${input.amount} is >5× avg (${avg.toFixed(2)})`);
      score += 15;
    }
  }

  // ── 5. Currency / country mismatch (basic heuristic) ─────────────────────
  const currencyCountryMap: Record<string, string[]> = {
    INR: ["IN"], PKR: ["PK"], NGN: ["NG"], KES: ["KE"], GBP: ["GB"],
  };
  if (input.user_country && input.currency && currencyCountryMap[input.currency]) {
    if (!currencyCountryMap[input.currency].includes(input.user_country)) {
      reasons.push(`currency_country_mismatch: ${input.currency} used from ${input.user_country}`);
      score += 10;
    }
  }

  const riskScore = Math.min(100, score);
  const flagged = riskScore >= RISK_THRESHOLD;

  return { risk_score: riskScore, flagged, reasons };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP, "payment", "payment");
  if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit.resetIn);

  try {
    const input: FraudInput = await req.json();

    if (!input.order_id || !input.user_id || !input.amount || !input.currency) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const result = await evaluateFraud(input, supabase);

    // Persist risk score back to order
    await supabase
      .from("orders")
      .update({ risk_score: result.risk_score, fraud_flags: result.reasons })
      .eq("id", input.order_id);

    // If flagged, write a fraud_flags record for boss review
    if (result.flagged) {
      await supabase.from("fraud_flags").insert({
        user_id: input.user_id,
        order_id: input.order_id,
        ip_address: input.ip_address,
        reason: result.reasons.join("; "),
        risk_score: result.risk_score,
      });
    }

    // Ledger entry
    await supabase.rpc("append_payment_ledger", {
      p_event_type: result.flagged ? "order_fraud_flagged" : "order_risk_assessed",
      p_order_id: input.order_id,
      p_user_id: input.user_id,
      p_amount: input.amount,
      p_currency: input.currency,
      p_gateway: null,
      p_gateway_ref: null,
      p_event_data: { risk_score: result.risk_score, reasons: result.reasons },
    });

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[fraud-detection-engine]", (err as Error).message);
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
