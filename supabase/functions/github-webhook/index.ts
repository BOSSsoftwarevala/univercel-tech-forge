import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hub-signature-256",
};

// Verify GitHub webhook signature
async function verifyWebhookSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSig = "sha256=" + Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return signature === expectedSig;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GITHUB_WEBHOOK_SECRET = Deno.env.get("GITHUB_WEBHOOK_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const signature = req.headers.get("x-hub-signature-256") || "";
    const event = req.headers.get("x-github-event") || "";
    const deliveryId = req.headers.get("x-github-delivery") || "";

    const body = await req.text();

    // Verify signature if secret is configured
    if (GITHUB_WEBHOOK_SECRET) {
      const isValid = await verifyWebhookSignature(body, signature, GITHUB_WEBHOOK_SECRET);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const payload = JSON.parse(body);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log(`GitHub webhook received: event=${event}, delivery=${deliveryId}`);

    // Store webhook event for processing
    await supabase.from("github_webhook_events").insert({
      event_type: event,
      delivery_id: deliveryId,
      payload,
      processed: false,
      created_at: new Date().toISOString(),
    }).select();

    // Process specific events
    if (event === "push" || event === "release" || event === "repository") {
      const repo = payload.repository;
      if (repo) {
        // Upsert marketplace product from repo
        await supabase.from("marketplace_products").upsert({
          github_repo_id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description || "",
          html_url: repo.html_url,
          topics: repo.topics || [],
          language: repo.language || "",
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          is_private: repo.private,
          updated_at: new Date().toISOString(),
        }, { onConflict: "github_repo_id" });

        console.log(`Updated marketplace product for repo: ${repo.full_name}`);
      }
    }

    if (event === "issues") {
      // Track issues as support tickets
      const issue = payload.issue;
      const repo = payload.repository;
      if (issue && repo) {
        await supabase.from("github_issues").upsert({
          github_issue_id: issue.id,
          repo_full_name: repo.full_name,
          title: issue.title,
          state: issue.state,
          html_url: issue.html_url,
          action: payload.action,
          updated_at: new Date().toISOString(),
        }, { onConflict: "github_issue_id" });
      }
    }

    return new Response(JSON.stringify({ received: true, event, deliveryId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GitHub webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
