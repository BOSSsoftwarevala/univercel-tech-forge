import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY")!;
const PAYU_SALT = Deno.env.get("PAYU_SALT_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-512", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const txnid = params.get("txnid") ?? "";
    const amount = params.get("amount") ?? "";
    const productinfo = params.get("productinfo") ?? "";
    const firstname = params.get("firstname") ?? "";
    const email = params.get("email") ?? "";
    const udf1 = params.get("udf1") ?? ""; // user_id
    const udf2 = params.get("udf2") ?? ""; // product_id
    const udf3 = params.get("udf3") ?? ""; // license_type
    const udf4 = params.get("udf4") ?? "";
    const udf5 = params.get("udf5") ?? "";
    const status = params.get("status") ?? "";
    const hash = params.get("hash") ?? "";

    // Verify PayU reverse hash
    // Formula: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    // The six consecutive pipes (||||||) are required by PayU's spec for empty udf fields
    const reverseHashString = `${PAYU_SALT}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
    const expectedHash = await generateHash(reverseHashString);

    if (expectedHash !== hash) {
      await supabase.from("audit_logs").insert({
        action: "payment_hash_mismatch",
        module: "billing",
        meta_json: { txnid, amount, status, user_id: udf1 },
      });
      return new Response(
        JSON.stringify({ success: false, error: "Hash verification failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (status === "success") {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/create-order-on-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            user_id: udf1,
            product_id: udf2,
            amount,
            payment_id: txnid,
            buyer_name: firstname,
            buyer_email: email,
            license_type: udf3,
          }),
        }
      );

      const result = await response.json();
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Payment failed - log it
      await supabase.from("audit_logs").insert({
        action: "payment_failed",
        module: "billing",
        meta_json: { txnid, amount, status, user_id: udf1 },
      });

      return new Response(
        JSON.stringify({ success: false, error: "Payment verification failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
