/**
 * payment-recovery
 *
 * Cron job / manual trigger to retry failed payments.
 * Processes pending recovery jobs and attempts to re-verify or notify users.
 * Called by Supabase cron (pg_cron) or admin trigger.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  errorResponse,
  jsonResponse,
  getSupabaseAdmin,
  getSupabaseClient,
  getUserFromToken,
  validateTokenFormat,
} from "../_shared/utils.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Accept calls from cron (no auth) or from admin (with auth)
  let isAdmin = false;
  const authHeader = req.headers.get("Authorization") || "";
  const cronSecret = req.headers.get("x-cron-secret") || "";
  const expectedCronSecret = Deno.env.get("CRON_SECRET") || "";

  if (cronSecret && expectedCronSecret && cronSecret === expectedCronSecret) {
    isAdmin = true; // Trusted cron call
  } else if (authHeader) {
    const tokenCheck = validateTokenFormat(authHeader);
    if (tokenCheck.valid) {
      const supabaseClient = getSupabaseClient(authHeader);
      const user = await getUserFromToken(supabaseClient);
      if (user && (user.role === "boss_owner" || user.role === "admin" || user.role === "finance_manager")) {
        isAdmin = true;
      }
    }
  }

  if (!isAdmin) {
    return errorResponse("Unauthorized", 401);
  }

  const supabaseAdmin = getSupabaseAdmin();

  try {
    // Fetch pending recovery jobs that are due for retry
    const now = new Date().toISOString();
    const { data: jobs, error: jobsErr } = await supabaseAdmin
      .from("payment_recovery_jobs")
      .select("id, order_id, user_id, attempts, max_attempts, metadata")
      .in("status", ["pending", "processing"])
      .lte("next_retry", now)
      .order("next_retry", { ascending: true })
      .limit(50);

    if (jobsErr) {
      console.error("Recovery jobs fetch error:", jobsErr);
      return errorResponse("Failed to fetch recovery jobs", 500);
    }

    if (!jobs || jobs.length === 0) {
      return jsonResponse({ message: "No recovery jobs due", processed: 0 }, 200);
    }

    const results: Array<{ job_id: string; result: string }> = [];

    for (const job of jobs) {
      try {
        // Mark as processing
        await supabaseAdmin
          .from("payment_recovery_jobs")
          .update({ status: "processing", updated_at: now })
          .eq("id", job.id);

        // Look up the order
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id, status, user_id, amount_usd, gateway, application_id")
          .eq("id", job.order_id)
          .maybeSingle();

        if (!order) {
          await supabaseAdmin
            .from("payment_recovery_jobs")
            .update({
              status: "failed",
              last_error: "Order not found",
              updated_at: now,
            })
            .eq("id", job.id);
          results.push({ job_id: job.id, result: "failed: order not found" });
          continue;
        }

        // If order is already completed, mark job as recovered
        if (order.status === "completed") {
          await supabaseAdmin
            .from("payment_recovery_jobs")
            .update({ status: "recovered", updated_at: now })
            .eq("id", job.id);
          results.push({ job_id: job.id, result: "recovered: order already completed" });
          continue;
        }

        const newAttempts = (job.attempts || 0) + 1;

        if (newAttempts >= job.max_attempts) {
          // Max retries exceeded — abandon job
          await supabaseAdmin
            .from("payment_recovery_jobs")
            .update({
              status: "abandoned",
              attempts: newAttempts,
              last_error: "Max retry attempts reached",
              updated_at: now,
            })
            .eq("id", job.id);

          // Log abandonment for audit
          await supabaseAdmin.from("payment_audit_logs").insert({
            order_id: job.order_id,
            user_id: job.user_id,
            event_type: "payment_recovery_abandoned",
            payload: { attempts: newAttempts, max_attempts: job.max_attempts },
          });

          results.push({ job_id: job.id, result: "abandoned: max attempts reached" });
          continue;
        }

        // Schedule next retry with exponential back-off (1h, 4h, 12h)
        const backoffHours = [1, 4, 12];
        const nextRetryHours = backoffHours[newAttempts - 1] ?? 24;
        const nextRetry = new Date(
          Date.now() + nextRetryHours * 60 * 60 * 1000,
        ).toISOString();

        // Notify user via buzzer (payment follow-up)
        await supabaseAdmin.from("buzzer_queue").insert({
          trigger_type: "payment_recovery_reminder",
          role_target: "client",
          priority: "high",
          status: "pending",
        }).maybeSingle();

        await supabaseAdmin
          .from("payment_recovery_jobs")
          .update({
            status: "pending",
            attempts: newAttempts,
            next_retry: nextRetry,
            last_error: `Retry ${newAttempts} scheduled`,
            updated_at: now,
          })
          .eq("id", job.id);

        await supabaseAdmin.from("payment_audit_logs").insert({
          order_id: job.order_id,
          user_id: job.user_id,
          event_type: "payment_recovery_retry",
          payload: { attempt: newAttempts, next_retry: nextRetry },
        });

        results.push({ job_id: job.id, result: `retry ${newAttempts} scheduled` });
      } catch (jobErr) {
        console.error(`Recovery job ${job.id} error:`, jobErr);
        await supabaseAdmin
          .from("payment_recovery_jobs")
          .update({
            status: "pending",
            last_error: String(jobErr),
            updated_at: now,
          })
          .eq("id", job.id);
        results.push({ job_id: job.id, result: "error: " + String(jobErr) });
      }
    }

    return jsonResponse(
      { message: "Recovery run complete", processed: results.length, results },
      200,
    );
  } catch (err) {
    console.error("payment-recovery error:", err);
    return errorResponse("Internal server error", 500);
  }
});
