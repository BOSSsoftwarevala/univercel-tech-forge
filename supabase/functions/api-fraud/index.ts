import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
} from "../_shared/utils.ts";
import { withAuth, RequestContext } from "../_shared/middleware.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const AI_GATEWAY_URL = "https://api.openai.com/v1/chat/completions";

// AI-powered fraud analysis
async function analyzeWithAI(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not configured, using rule-based analysis");
    return "rule_based";
  }

  try {
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a fraud detection AI. Analyze the provided data and return a JSON response with:
- risk_score (0-100)
- risk_level (low/medium/high/critical)
- risk_factors (array of detected issues)
- recommendation (allow/review/block)
- explanation (brief reasoning)
Be strict but fair. Return only valid JSON.`,
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", response.status);
      return "rule_based";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "rule_based";
  } catch (error) {
    console.error("AI analysis error:", error);
    return "rule_based";
  }
}

// Rule-based risk scoring
function calculateRiskScore(data: any): any {
  let score = 0;
  const factors: string[] = [];

  // VPN/Proxy check
  if (data.is_vpn || data.is_proxy) {
    score += 25;
    factors.push("vpn_proxy_detected");
  }

  // Tor check
  if (data.is_tor) {
    score += 40;
    factors.push("tor_network");
  }

  // Datacenter IP
  if (data.is_datacenter) {
    score += 20;
    factors.push("datacenter_ip");
  }

  // Multiple devices
  if (data.device_count > 5) {
    score += 30;
    factors.push("excessive_devices");
  }

  // Failed logins
  if (data.failed_logins > 5) {
    score += 25;
    factors.push("multiple_failed_logins");
  }

  // Impossible travel
  if (data.impossible_travel) {
    score += 50;
    factors.push("impossible_travel");
  }

  // High velocity transactions
  if (data.transaction_velocity > 10) {
    score += 35;
    factors.push("high_transaction_velocity");
  }

  const risk_level = score >= 70 ? "critical" : score >= 50 ? "high" : score >= 30 ? "medium" : "low";
  const recommendation = score >= 70 ? "block" : score >= 50 ? "review" : "allow";

  return {
    risk_score: Math.min(score, 100),
    risk_level,
    risk_factors: factors,
    recommendation,
  };
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/fraud", "");

  // POST /fraud/check-login - Check login attempt
  if (path === "/check-login" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const { ip_address, device_fingerprint, latitude, longitude } = body;

      // Check blacklist
      const { data: accessCheck } = await supabaseAdmin.rpc("check_access_allowed", {
        p_ip_address: ip_address,
        p_device_fingerprint: device_fingerprint,
      });

      if (accessCheck?.blocked) {
        // Create fraud alert
        await supabaseAdmin.from("fraud_alerts").insert({
          user_id: user.userId,
          alert_type: "blocked_access",
          severity: "high",
          title: "Blocked Access Attempt",
          description: accessCheck.reason,
          ip_address,
          device_fingerprint,
        });

        return jsonResponse({
          allowed: false,
          reason: "Access blocked for security reasons",
          action: "block",
        });
      }

      // Check IP intelligence
      const { data: ipData } = await supabaseAdmin
        .from("ip_intelligence")
        .select("*")
        .eq("ip_address", ip_address)
        .single();

      // Check device
      const { data: devices } = await supabaseAdmin
        .from("device_fingerprints")
        .select("*")
        .eq("user_id", user.userId);

      const deviceCount = devices?.length || 0;
      const knownDevice = devices?.some((d: any) => d.fingerprint_hash === device_fingerprint);

      // Calculate risk
      const riskData = {
        is_vpn: ipData?.is_vpn || false,
        is_proxy: ipData?.is_proxy || false,
        is_tor: ipData?.is_tor || false,
        is_datacenter: ipData?.is_datacenter || false,
        device_count: deviceCount,
        new_device: !knownDevice,
      };

      const riskResult = calculateRiskScore(riskData);

      // For high-risk, try AI analysis
      if (riskResult.risk_score >= 50) {
        const aiResult = await analyzeWithAI(JSON.stringify({
          type: "login_attempt",
          user_id: user.userId,
          ip_data: ipData,
          device_count: deviceCount,
          is_new_device: !knownDevice,
          location: { latitude, longitude },
        }));

        if (aiResult !== "rule_based") {
          try {
            const parsed = JSON.parse(aiResult);
            Object.assign(riskResult, parsed);
          } catch (e) {
            console.log("Using rule-based result");
          }
        }
      }

      // Register device if new
      if (!knownDevice && device_fingerprint) {
        await supabaseAdmin.from("device_fingerprints").upsert({
          user_id: user.userId,
          fingerprint_hash: device_fingerprint,
          device_info: body.device_info || {},
          browser: body.browser,
          os: body.os,
          is_trusted: riskResult.risk_score < 30,
        }, { onConflict: "user_id,fingerprint_hash" });
      }

      // Create alert if high risk
      if (riskResult.risk_score >= 50) {
        await supabaseAdmin.from("fraud_alerts").insert({
          user_id: user.userId,
          alert_type: "suspicious_login",
          severity: riskResult.risk_level,
          title: "Suspicious Login Detected",
          description: `Risk score: ${riskResult.risk_score}`,
          ip_address,
          device_fingerprint,
          details: riskResult,
        });
      }

      return jsonResponse({
        allowed: riskResult.recommendation !== "block",
        risk_score: riskResult.risk_score,
        risk_level: riskResult.risk_level,
        requires_2fa: riskResult.risk_score >= 50,
        new_device: !knownDevice,
        action: riskResult.recommendation,
      });
    }, { module: "fraud", action: "check_login" });
  }

  // POST /fraud/check-transaction - Check transaction
  if (path === "/check-transaction" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["amount", "transaction_type"]);
      if (validation) return errorResponse(validation);

      const { amount, transaction_type, wallet_id } = body;

      // Get recent transactions
      const { data: recentTx } = await supabaseAdmin
        .from("unified_wallet_transactions")
        .select("*")
        .eq("user_id", user.userId)
        .gte("created_at", new Date(Date.now() - 3600000).toISOString());

      const hourlyTotal = recentTx?.reduce((sum: number, tx: any) => sum + Math.abs(tx.amount), 0) || 0;
      const txCount = recentTx?.length || 0;

      const riskData = {
        amount,
        transaction_type,
        hourly_total: hourlyTotal + amount,
        hourly_count: txCount + 1,
        transaction_velocity: txCount,
      };

      const riskResult = calculateRiskScore(riskData);

      // High value check
      if (amount > 50000) {
        riskResult.risk_score += 20;
        riskResult.risk_factors.push("high_value_transaction");
      }

      // Velocity check
      if (txCount > 10) {
        riskResult.risk_score += 25;
        riskResult.risk_factors.push("high_velocity");
      }

      // AI analysis for high-risk transactions
      if (riskResult.risk_score >= 40 || amount > 100000) {
        const aiResult = await analyzeWithAI(JSON.stringify({
          type: "transaction",
          user_id: user.userId,
          amount,
          transaction_type,
          hourly_stats: { total: hourlyTotal, count: txCount },
        }));

        if (aiResult !== "rule_based") {
          try {
            const parsed = JSON.parse(aiResult);
            riskResult.risk_score = Math.max(riskResult.risk_score, parsed.risk_score || 0);
            if (parsed.risk_factors) {
              riskResult.risk_factors.push(...parsed.risk_factors);
            }
          } catch (e) {
            console.log("Using rule-based result");
          }
        }
      }

      // Log transaction monitoring
      await supabaseAdmin.from("transaction_monitoring").insert({
        wallet_id,
        user_id: user.userId,
        transaction_type,
        amount,
        risk_score: riskResult.risk_score,
        risk_factors: riskResult.risk_factors,
        is_flagged: riskResult.risk_score >= 50,
        flag_reason: riskResult.risk_score >= 50 ? riskResult.risk_factors.join(", ") : null,
        requires_2fa: riskResult.risk_score >= 40,
        is_held: riskResult.risk_score >= 70,
        hold_reason: riskResult.risk_score >= 70 ? "High fraud risk detected" : null,
      });

      return jsonResponse({
        allowed: riskResult.risk_score < 70,
        risk_score: riskResult.risk_score,
        risk_level: riskResult.risk_level,
        requires_2fa: riskResult.risk_score >= 40,
        is_held: riskResult.risk_score >= 70,
        risk_factors: riskResult.risk_factors,
      });
    }, { module: "fraud", action: "check_transaction" });
  }

  // POST /fraud/analyze-lead - AI-powered lead fraud detection
  if (path === "/analyze-lead" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "lead_manager"], async ({ supabaseAdmin, body }) => {
      const { lead_id, email, phone, ip_address, device_fingerprint } = body;

      let validationScore = 100;
      const fraudIndicators: string[] = [];

      // Check for disposable email domains
      const disposableDomains = ["tempmail", "guerrillamail", "throwaway", "mailinator", "yopmail"];
      const emailDomain = email?.split("@")[1]?.toLowerCase() || "";
      if (disposableDomains.some(d => emailDomain.includes(d))) {
        validationScore -= 40;
        fraudIndicators.push("disposable_email");
      }

      // Check for duplicate leads
      const { data: duplicates } = await supabaseAdmin
        .from("franchise_leads")
        .select("id")
        .or(`masked_contact.ilike.%${phone?.slice(-4)}%`);

      if (duplicates && duplicates.length > 1) {
        validationScore -= 30;
        fraudIndicators.push("potential_duplicate");
      }

      // AI analysis
      const aiPrompt = JSON.stringify({
        type: "lead_validation",
        email_domain: emailDomain,
        phone_pattern: phone?.replace(/\d/g, "X"),
        has_duplicates: duplicates?.length || 0 > 0,
        ip_address,
      });

      const aiResult = await analyzeWithAI(aiPrompt);
      if (aiResult !== "rule_based") {
        try {
          const parsed = JSON.parse(aiResult);
          validationScore = Math.min(validationScore, 100 - (parsed.risk_score || 0));
          if (parsed.risk_factors) {
            fraudIndicators.push(...parsed.risk_factors);
          }
        } catch (e) {
          console.log("Using rule-based result");
        }
      }

      // Log detection
      await supabaseAdmin.from("lead_fraud_detection").insert({
        lead_id,
        validation_score: validationScore,
        is_duplicate: duplicates && duplicates.length > 1,
        is_disposable_email: disposableDomains.some(d => emailDomain.includes(d)),
        ip_address,
        device_fingerprint,
        fraud_indicators: fraudIndicators,
        status: validationScore < 50 ? "rejected" : validationScore < 70 ? "review" : "approved",
        quarantined: validationScore < 50,
        auto_rejected: validationScore < 30,
      });

      return jsonResponse({
        validation_score: validationScore,
        is_valid: validationScore >= 50,
        requires_review: validationScore >= 50 && validationScore < 70,
        fraud_indicators: fraudIndicators,
        recommendation: validationScore < 30 ? "reject" : validationScore < 70 ? "review" : "approve",
      });
    }, { module: "fraud", action: "analyze_lead" });
  }

  // POST /fraud/analyze-clicks - Analyze click fraud for influencers
  if (path === "/analyze-clicks" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "marketing_manager"], async ({ supabaseAdmin, body }) => {
      const { influencer_id, period_start, period_end } = body;

      // Get click data
      const { data: clicks } = await supabaseAdmin
        .from("demo_clicks")
        .select("*")
        .eq("reseller_id", influencer_id)
        .gte("clicked_at", period_start)
        .lte("clicked_at", period_end);

      if (!clicks || clicks.length === 0) {
        return jsonResponse({ message: "No clicks found for analysis" });
      }

      // Analyze patterns
      const ipCounts: Record<string, number> = {};
      let botClicks = 0;
      let vpnClicks = 0;

      for (const click of clicks) {
        // Count IP frequency
        ipCounts[click.ip_address] = (ipCounts[click.ip_address] || 0) + 1;

        // Check IP intelligence
        const { data: ipData } = await supabaseAdmin
          .from("ip_intelligence")
          .select("is_vpn, is_datacenter, is_tor")
          .eq("ip_address", click.ip_address)
          .single();

        if (ipData?.is_vpn || ipData?.is_tor) vpnClicks++;
        if (ipData?.is_datacenter) botClicks++;
      }

      // Calculate duplicate IP clicks
      const duplicateIpClicks = Object.values(ipCounts).filter(c => c > 3).reduce((a, b) => a + b, 0);

      const totalClicks = clicks.length;
      const validClicks = totalClicks - botClicks - vpnClicks - duplicateIpClicks;
      const fraudScore = Math.round((1 - validClicks / totalClicks) * 100);

      // AI analysis for pattern detection
      const aiResult = await analyzeWithAI(JSON.stringify({
        type: "click_fraud",
        total_clicks: totalClicks,
        unique_ips: Object.keys(ipCounts).length,
        max_clicks_per_ip: Math.max(...Object.values(ipCounts)),
        vpn_percentage: (vpnClicks / totalClicks) * 100,
        bot_percentage: (botClicks / totalClicks) * 100,
      }));

      let suspiciousPatterns: any = {};
      if (aiResult !== "rule_based") {
        try {
          suspiciousPatterns = JSON.parse(aiResult);
        } catch (e) {
          console.log("Using rule-based result");
        }
      }

      // Log detection
      await supabaseAdmin.from("click_fraud_detection").insert({
        influencer_id,
        total_clicks: totalClicks,
        valid_clicks: validClicks,
        invalid_clicks: totalClicks - validClicks,
        bot_clicks: botClicks,
        vpn_clicks: vpnClicks,
        duplicate_ip_clicks: duplicateIpClicks,
        suspicious_patterns: suspiciousPatterns,
        fraud_score: fraudScore,
        status: fraudScore > 50 ? "flagged" : "clean",
        flagged_at: fraudScore > 50 ? new Date().toISOString() : null,
        period_start,
        period_end,
      });

      return jsonResponse({
        total_clicks: totalClicks,
        valid_clicks: validClicks,
        fraud_score: fraudScore,
        status: fraudScore > 50 ? "flagged" : "clean",
        breakdown: {
          bot_clicks: botClicks,
          vpn_clicks: vpnClicks,
          duplicate_ip_clicks: duplicateIpClicks,
        },
        payout_eligible: fraudScore < 30,
      });
    }, { module: "fraud", action: "analyze_clicks" });
  }

  // GET /fraud/alerts - Get fraud alerts
  if (path === "/alerts" && req.method === "GET") {
    return withAuth(req, ["super_admin", "admin", "finance_manager"], async ({ supabaseAdmin }) => {
      const { data } = await supabaseAdmin
        .from("fraud_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      return jsonResponse({ alerts: data || [] });
    }, { module: "fraud", action: "get_alerts" });
  }

  // PATCH /fraud/alerts/:id/resolve - Resolve alert
  if (path.startsWith("/alerts/") && path.endsWith("/resolve") && req.method === "PATCH") {
    return withAuth(req, ["super_admin"], async ({ supabaseAdmin, body, user }) => {
      const alertId = path.split("/")[2];

      const { data, error } = await supabaseAdmin
        .from("fraud_alerts")
        .update({
          status: body.status || "resolved",
          manual_action: body.action,
          resolution_notes: body.notes,
          resolved_by: user.userId,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId)
        .select()
        .single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({ message: "Alert resolved", alert: data });
    }, { module: "fraud", action: "resolve_alert" });
  }

  // POST /fraud/suspend - Suspend account
  if (path === "/suspend" && req.method === "POST") {
    return withAuth(req, ["super_admin"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["user_id", "reason"]);
      if (validation) return errorResponse(validation);

      const maskedReason = body.show_reason ? body.reason : "Account suspended for security review";

      const { data, error } = await supabaseAdmin.from("account_suspensions").insert({
        user_id: body.user_id,
        suspension_type: body.type || "security",
        reason: body.reason,
        masked_reason: maskedReason,
        severity: body.severity || "temporary",
        auto_triggered: false,
        expires_at: body.duration ? new Date(Date.now() + body.duration * 3600000).toISOString() : null,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({ message: "Account suspended", suspension: data });
    }, { module: "fraud", action: "suspend_account" });
  }

  // POST /fraud/blacklist - Add to blacklist
  if (path === "/blacklist" && req.method === "POST") {
    return withAuth(req, ["super_admin"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["entry_type", "entry_value", "reason"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin.from("access_lists").insert({
        list_type: "blacklist",
        entry_type: body.entry_type,
        entry_value: body.entry_value,
        reason: body.reason,
        added_by: user.userId,
        expires_at: body.expires_at,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({ message: "Added to blacklist", entry: data });
    }, { module: "fraud", action: "blacklist" });
  }

  return errorResponse("Not found", 404);
});
