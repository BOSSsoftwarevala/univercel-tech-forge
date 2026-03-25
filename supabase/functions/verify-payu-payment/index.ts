import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

/**
 * verify-payu-payment
 *
 * - Accepts PayU callbacks (form-urlencoded or JSON).
 * - Verifies PayU reverse hash per PayU spec (uses udf10..udf1 order).
 * - Performs idempotent order creation by invoking downstream `create-order-on-payment` function.
 * - Logs audit entries for mismatches and failures.
 *
 * ENV:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - PAYU_MERCHANT_KEY
 * - PAYU_SALT
 *
 * Notes:
 * - This function uses the service role key to invoke the downstream edge function via REST.
 * - Adjust table names, field names and behavior as needed for your schema.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY") ?? "";
const PAYU_SALT = Deno.env.get("PAYU_SALT") ?? "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[verify-payu] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

if (!PAYU_SALT || !PAYU_MERCHANT_KEY) {
  console.warn("[verify-payu] PAYU_SALT or PAYU_MERCHANT_KEY not provided — verification may fail");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/* compute SHA-512 hex */
async function sha512Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hash = await crypto.subtle.digest("SHA-512", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* parse form-urlencoded or JSON */
async function parseBody(req: Request): Promise<Record<string, any>> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await req.json();
    } catch {
      return {};
    }
  }
  const text = await req.text();
  const params = new URLSearchParams(text || "");
  const obj: Record<string, any> = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  return obj;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await parseBody(req);

    // Common PayU fields
    const status = String(body.status ?? "").toString();
    const firstname = String(body.firstname ?? "");
    const email = String(body.email ?? "");
    const amountRaw = body.amount ?? body.txn_amount ?? "";
    const amount = String(amountRaw);
    const txnid = String(body.txnid ?? "");
    const productinfo = String(body.productinfo ?? "");
    const receivedHash = String(body.hash ?? "");
    const payuPaymentId = String(body.mihpayid ?? body.payu_payment_id ?? "");
    const buyer_name = firstname || null;
    const buyer_email = email || null;

    if (!txnid || !amount || !receivedHash) {
      return new Response(
        JSON.stringify({ error: "Missing required PayU fields (txnid, amount, hash)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Collect udf1..udf10 in array (udf1 index 0 .. udf10 index 9)
    const udf: string[] = [];
    for (let i = 1; i <= 10; i++) {
      udf.push(String(body[`udf${i}`] ?? ""));
    }

    // Build reverse hash per PayU spec:
    // reverseHash = salt|status|udf10|udf9|...|udf1|email|firstname|productinfo|amount|txnid|key
    const reverseParts = [
      PAYU_SALT,
      status,
      // udf10 down to udf1
      udf[9], udf[8], udf[7], udf[6], udf[5], udf[4], udf[3], udf[2], udf[1], udf[0],
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      PAYU_MERCHANT_KEY,
    ];
    const reverseHashString = reverseParts.join("|");

    let computedHash = "";
    try {
      computedHash = (await sha512Hex(reverseHashString)).toLowerCase();
    } catch (e) {
      console.error("[verify-payu] sha512 error:", e);
    }

    if (!computedHash || computedHash !== receivedHash.toLowerCase()) {
      // Log mismatch for audit
      try {
        await supabase.from("audit_logs").insert({
          action: "payment_hash_mismatch",
          module: "billing",
          meta_json: { txnid, amount, status, udf, receivedHash, computedHash },
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("[verify-payu] failed to insert audit_logs for mismatch:", e);
      }

      return new Response(
        JSON.stringify({ success: false, error: "Hash verification failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If payment not successful, record failed order/audit and return 200 (or 400 based on desired behavior)
    if (status.toLowerCase() !== "success") {
      try {
        const { data: existing, error: findErr } = await supabase
          .from("orders")
          .select("*")
          .or(`txnid.eq.${txnid},payment_id.eq.${payuPaymentId}`)
          .limit(1);

        if (findErr) console.warn("[verify-payu] existing order lookup error:", findErr);

        if (existing && existing.length > 0) {
          await supabase.from("orders").update({
            payment_status: status,
            status: "failed",
            updated_at: new Date().toISOString(),
          }).eq("id", existing[0].id);
        } else {
          await supabase.from("orders").insert({
            user_id: body.udf1 ?? null,
            product_id: body.udf2 ?? null,
            amount: Number(amount) || 0,
            currency: body.currency ?? "INR",
            payment_id: payuPaymentId || null,
            txnid,
            order_number: `ORD-F-${Date.now()}`,
            buyer_name,
            buyer_email,
            payment_status: status,
            status: "failed",
            is_verified: false,
            created_at: new Date().toISOString(),
          });
        }

        await supabase.from("audit_logs").insert({
          action: "payment_failed",
          module: "billing",
          meta_json: { txnid, amount, status, udf },
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error("[verify-payu] error recording failed payment:", e);
      }

      return new Response(
        JSON.stringify({ success: false, status, note: "Payment not successful" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Payment is successful and verified — proceed to idempotent order creation
    try {
      // Idempotency check by txnid or mihpayid
      const { data: existingOrders, error: idemErr } = await supabase
        .from("orders")
        .select("*")
        .or(`txnid.eq.${txnid},payment_id.eq.${payuPaymentId}`)
        .limit(1);

      if (idemErr) {
        console.warn("[verify-payu] idempotency lookup error:", idemErr);
      } else if (existingOrders && existingOrders.length > 0) {
        const existing = existingOrders[0];
        return new Response(
          JSON.stringify({ success: true, idempotent: true, order: existing }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Invoke downstream create-order-on-payment edge function (authenticated via service role key)
      const fnUrl = `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/create-order-on-payment`;
      const invokeBody = {
        user_id: body.udf1 ?? null,
        product_id: body.udf2 ?? null,
        amount,
        payment_id: txnid,
        buyer_name: firstname ?? null,
        buyer_email: email ?? null,
        license_type: body.udf3 ?? null,
        txnid,
        payu_payment_id: payuPaymentId || null,
      };

      const resp = await fetch(fnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify(invokeBody),
      });

      let result: any = null;
      try {
        result = await resp.json().catch(() => null);
      } catch {
        result = null;
      }

      if (!resp.ok) {
        console.warn("[verify-payu] create-order-on-payment returned non-200:", resp.status, result);
        try {
          await supabase.from("audit_logs").insert({
            action: "create_order_invoke_failed",
            module: "billing",
            meta_json: { txnid, respStatus: resp.status, respBody: result },
            created_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("[verify-payu] failed to log create_order_invoke_failed:", e);
        }
        return new Response(
          JSON.stringify({ error: "Downstream order creation failed", detail: result }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: result }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("[verify-payu] downstream call error:", e);
      try {
        await supabase.from("audit_logs").insert({
          action: "create_order_invoke_exception",
          module: "billing",
          meta_json: { txnid, error: String(e) },
          created_at: new Date().toISOString(),
        });
      } catch (ie) {
        console.warn("[verify-payu] failed to log invoke exception:", ie);
      }
      return new Response(
        JSON.stringify({ error: "Internal error while creating order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("[verify-payu] unexpected error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
