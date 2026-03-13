// Marketplace Webhook Dispatch
// Processes order events and dispatches webhooks to registered endpoints

import {
  corsHeaders,
  errorResponse,
  getSupabaseAdmin,
  getSupabaseClient,
  getUserFromToken,
  jsonResponse,
  createAuditLog,
} from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = getSupabaseAdmin();

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const { event_type, order_id, payload } = body;

  if (!event_type) {
    return errorResponse("event_type is required", 400);
  }

  // 1. Find active webhooks for this event type
  const { data: webhooks, error: whError } = await supabaseAdmin
    .from("marketplace_webhooks")
    .select("*")
    .eq("is_active", true)
    .or(`event_type.eq.${event_type},event_type.eq.*`);

  if (whError) {
    return errorResponse("Failed to fetch webhooks", 500);
  }

  const results: any[] = [];

  // 2. Dispatch to each webhook
  for (const wh of (webhooks || [])) {
    const deliveryPayload = {
      event_type,
      order_id: order_id || null,
      timestamp: new Date().toISOString(),
      data: payload || {},
    };

    let responseStatus = 0;
    let responseBody = "";
    let status = "delivered";
    let errorMessage: string | null = null;

    try {
      const res = await fetch(wh.target_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Event": event_type,
          "X-Webhook-Id": wh.id,
        },
        body: JSON.stringify(deliveryPayload),
      });

      responseStatus = res.status;
      responseBody = await res.text();

      if (!res.ok) {
        status = "failed";
        errorMessage = `HTTP ${res.status}`;
      }
    } catch (err: any) {
      status = "failed";
      errorMessage = err.message || "Network error";
    }

    // 3. Log delivery
    await supabaseAdmin.from("webhook_delivery_log").insert({
      webhook_id: wh.id,
      event_type,
      payload: deliveryPayload,
      response_status: responseStatus,
      response_body: responseBody.slice(0, 2000),
      status,
      error_message: errorMessage,
      delivered_at: status === "delivered" ? new Date().toISOString() : null,
    });

    results.push({ webhook_id: wh.id, status, response_status: responseStatus });
  }

  // 4. If order_id provided, update queue steps
  if (order_id) {
    await supabaseAdmin
      .from("order_processing_queue")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("order_id", order_id)
      .eq("step_name", "notification_sent")
      .eq("status", "pending");
  }

  await createAuditLog(
    supabaseAdmin,
    null,
    null,
    "marketplace",
    "webhook_dispatched",
    { event_type, webhooks_triggered: results.length, order_id }
  );

  return jsonResponse({ dispatched: results.length, results }, 200);
});
