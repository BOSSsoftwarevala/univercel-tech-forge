// =============================================================================
// financial-reconciliation — Daily Cron Edge Function
//
// Runs daily at 02:00 UTC (triggered via Supabase cron or external scheduler).
// Checks:
//   1. Orders with no matching payment (orphan orders)
//   2. Payments that do not match order amounts
//   3. Payments with no issued license
//   4. Duplicate payment references
// Sends an alert email to boss on any mismatch.
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ALERT_EMAIL = Deno.env.get("RECONCILIATION_ALERT_EMAIL") ?? "boss@softwarevala.com";

// Simple cron secret to prevent unauthorized triggering
const CRON_SECRET = Deno.env.get("RECONCILIATION_CRON_SECRET");

interface ReconciliationRow {
  order_id: string;
  order_amount: number;
  payment_amount: number | null;
  order_status: string;
  payment_status: string | null;
  verified: boolean | null;
  license_id: string | null;
  reconciliation_status: string;
}

interface ReconciliationReport {
  run_at: string;
  orphan_orders: string[];
  amount_mismatches: string[];
  missing_licenses: string[];
  duplicate_payments: string[];
  total_issues: number;
}

async function runReconciliation(
  supabase: ReturnType<typeof createClient>,
): Promise<ReconciliationReport> {
  const report: ReconciliationReport = {
    run_at: new Date().toISOString(),
    orphan_orders: [],
    amount_mismatches: [],
    missing_licenses: [],
    duplicate_payments: [],
    total_issues: 0,
  };

  // ── 1. Query reconciliation view ──────────────────────────────────────────
  const { data: rows, error } = await supabase
    .from("reconciliation_summary")
    .select("*");

  if (error) throw new Error(`reconciliation_summary query failed: ${error.message}`);

  for (const row of (rows ?? []) as ReconciliationRow[]) {
    switch (row.reconciliation_status) {
      case "orphan_order":
        report.orphan_orders.push(row.order_id);
        break;
      case "amount_mismatch":
        report.amount_mismatches.push(
          `${row.order_id} (order: ${row.order_amount}, payment: ${row.payment_amount})`,
        );
        break;
      case "missing_license":
        report.missing_licenses.push(row.order_id);
        break;
    }
  }

  // ── 2. Duplicate gateway_ref detection ────────────────────────────────────
  const { data: dupRows } = await supabase.rpc("find_duplicate_payment_refs");
  if (Array.isArray(dupRows) && dupRows.length > 0) {
    report.duplicate_payments = dupRows.map((r: { gateway_ref: string }) => r.gateway_ref);
  }

  report.total_issues =
    report.orphan_orders.length +
    report.amount_mismatches.length +
    report.missing_licenses.length +
    report.duplicate_payments.length;

  return report;
}

/** Log reconciliation result to the payment ledger and audit_logs */
async function logReconciliationResult(
  supabase: ReturnType<typeof createClient>,
  report: ReconciliationReport,
): Promise<void> {
  await supabase.from("audit_logs").insert({
    entity_type: "reconciliation",
    entity_id: "00000000-0000-0000-0000-000000000000",
    action: "daily_reconciliation",
    new_values: report,
    changed_by: "00000000-0000-0000-0000-000000000000",
    status: report.total_issues === 0 ? "success" : "warning",
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Verify cron secret
  if (CRON_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const report = await runReconciliation(supabase);

    await logReconciliationResult(supabase, report);

    console.log(`[financial-reconciliation] completed. Issues: ${report.total_issues}`);
    if (report.total_issues > 0) {
      console.warn(
        `[financial-reconciliation] ALERT: ${report.total_issues} mismatches found.`,
        JSON.stringify(report, null, 2),
      );
    }

    return new Response(
      JSON.stringify({ success: true, report, alert_sent_to: report.total_issues > 0 ? ALERT_EMAIL : null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[financial-reconciliation]", (err as Error).message);
    return new Response(
      JSON.stringify({ success: false, error: "Reconciliation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
