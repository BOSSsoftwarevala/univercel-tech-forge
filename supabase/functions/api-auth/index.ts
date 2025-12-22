import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  maskEmail,
  maskPhone,
} from "../_shared/utils.ts";
import { withAuth, withPublic, RequestContext } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/auth", "");

  // POST /auth/register
  if (path === "/register" && req.method === "POST") {
    return withPublic(req, async ({ supabaseAdmin, body, clientIP, deviceId }) => {
      const validation = validateRequired(body, ["email", "password", "full_name"]);
      if (validation) return errorResponse(validation);

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
      });

      if (authError) return errorResponse(authError.message, 400);

      // Assign default role
      const defaultRole = body.role || "client";
      await supabaseAdmin.from("user_roles").insert({
        user_id: authData.user.id,
        role: defaultRole,
      });

      // Create profile if needed
      if (["franchise", "reseller", "influencer", "developer"].includes(defaultRole)) {
        const profileTable = `${defaultRole}_accounts`;
        if (defaultRole === "developer") {
          await supabaseAdmin.from("developers").insert({
            user_id: authData.user.id,
            email: body.email,
            full_name: body.full_name,
            phone: body.phone,
          });
        } else if (defaultRole === "franchise") {
          await supabaseAdmin.from("franchise_accounts").insert({
            user_id: authData.user.id,
            email: body.email,
            owner_name: body.full_name,
            business_name: body.business_name || body.full_name,
            phone: body.phone || "",
            franchise_code: `FR-${Date.now().toString(36).toUpperCase()}`,
          });
        } else if (defaultRole === "reseller") {
          await supabaseAdmin.from("reseller_accounts").insert({
            user_id: authData.user.id,
            email: body.email,
            full_name: body.full_name,
            phone: body.phone,
          });
        } else if (defaultRole === "influencer") {
          await supabaseAdmin.from("influencer_accounts").insert({
            user_id: authData.user.id,
            email: body.email,
            full_name: body.full_name,
            phone: body.phone,
          });
        }
      }

      await createAuditLog(supabaseAdmin, authData.user.id, defaultRole, "auth", "register", {
        ip: clientIP,
        device: deviceId,
      });

      return jsonResponse({
        message: "Registration successful",
        user_id: authData.user.id,
        role: defaultRole,
      }, 201);
    }, { module: "auth", action: "register" });
  }

  // POST /auth/login
  if (path === "/login" && req.method === "POST") {
    return withPublic(req, async ({ supabaseAdmin, body, clientIP, deviceId }) => {
      const validation = validateRequired(body, ["email", "password"]);
      if (validation) return errorResponse(validation);

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      );

      const { data, error } = await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });

      if (error) return errorResponse("Invalid credentials", 401);

      // Get user role
      const { data: roleData } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      const role = roleData?.role || "client";

      // Check IP lock for restricted roles
      if (["franchise", "reseller", "prime", "developer"].includes(role)) {
        const { data: locks } = await supabaseAdmin
          .from("ip_locks")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("status", "active");

        if (locks && locks.length > 0) {
          const match = locks.find((l: any) => l.ip === clientIP);
          if (!match) {
            await createAuditLog(supabaseAdmin, data.user.id, role, "security", "login_ip_mismatch", {
              expected_ip: locks[0].ip,
              actual_ip: clientIP,
            });
            return errorResponse("IP address not authorized. Contact support.", 403);
          }
        } else {
          // First login - register IP
          await supabaseAdmin.from("ip_locks").insert({
            user_id: data.user.id,
            ip: clientIP,
            device: deviceId,
            status: "active",
          });
        }
      }

      // Check subscription for restricted roles
      if (["franchise", "reseller", "prime"].includes(role)) {
        const { data: sub } = await supabaseAdmin
          .from("subscriptions")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("status", "active")
          .gte("expired_at", new Date().toISOString())
          .single();

        if (!sub) {
          return errorResponse("Subscription expired or inactive", 402);
        }
      }

      // Check KYC for restricted roles
      if (["franchise", "reseller", "developer", "influencer"].includes(role)) {
        const { data: kyc } = await supabaseAdmin
          .from("kyc_documents")
          .select("status")
          .eq("user_id", data.user.id)
          .order("timestamp", { ascending: false })
          .limit(1)
          .single();

        if (!kyc || kyc.status !== "verified") {
          // Allow login but flag
          await createAuditLog(supabaseAdmin, data.user.id, role, "auth", "login_kyc_pending", {});
        }
      }

      await createAuditLog(supabaseAdmin, data.user.id, role, "auth", "login", {
        ip: clientIP,
        device: deviceId,
      });

      // Log security event
      await supabaseAdmin.from("security_logs").insert({
        user_id: data.user.id,
        event_type: "login",
        event_details: "Successful login",
        ip: clientIP,
        device: deviceId,
      });

      return jsonResponse({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        user: {
          id: data.user.id,
          email: maskEmail(data.user.email || ""),
          role,
        },
      });
    }, { module: "auth", action: "login" });
  }

  // POST /auth/logout
  if (path === "/logout" && req.method === "POST") {
    return withAuth(req, [], async ({ supabase, supabaseAdmin, user, clientIP }) => {
      await supabase.auth.signOut();

      await supabaseAdmin.from("security_logs").insert({
        user_id: user.userId,
        event_type: "logout",
        event_details: "User logged out",
        ip: clientIP,
      });

      return jsonResponse({ message: "Logged out successfully" });
    }, { module: "auth", action: "logout" });
  }

  // POST /auth/logout-all (Master/Super Admin) - revoke refresh tokens + set force logout flag
  if (path === "/logout-all" && req.method === "POST") {
    return withAuth(req, ["super_admin"], async ({ supabaseAdmin, user, clientIP, deviceId }) => {
      // Get all users to logout (exclude privileged)
      const { data: rows, error } = await supabaseAdmin
        .from("user_roles")
        .select("user_id, role")
        .not("role", "in", "(master,super_admin)");

      if (error) return errorResponse(error.message, 400);

      const userIds = Array.from(new Set((rows || []).map((r: any) => r.user_id))).filter(Boolean);

      // Revoke refresh tokens for each user (prevents token refresh / session reuse)
      const authBase = `${Deno.env.get("SUPABASE_URL")}/auth/v1`;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      let revoked = 0;
      for (const uid of userIds) {
        try {
          const res = await fetch(`${authBase}/admin/users/${uid}/logout`, {
            method: "POST",
            headers: {
              apikey: serviceKey,
              authorization: `Bearer ${serviceKey}`,
              "content-type": "application/json",
            },
          });

          if (res.ok) revoked++;
        } catch (_) {
          // ignore individual failures; continue
        }
      }

      // Set force logout flags in DB so UI redirects immediately
      await supabaseAdmin
        .from("user_roles")
        .update({
          force_logged_out_at: new Date().toISOString(),
          force_logged_out_by: user.userId,
        })
        .not("role", "in", "(master,super_admin)");

      await createAuditLog(supabaseAdmin, user.userId, user.role, "security", "logout_all", {
        ip: clientIP,
        device: deviceId,
        targeted_users: userIds.length,
        revoked_refresh_tokens: revoked,
      });

      return jsonResponse({
        message: "Forced logout executed",
        targeted_users: userIds.length,
        revoked_refresh_tokens: revoked,
      });
    }, { module: "security", action: "logout_all" });
  }

  // POST /auth/ip-lock
  if (path === "/ip-lock" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["user_id", "ip", "device"]);
      if (validation) return errorResponse(validation);

      // Deactivate existing locks
      await supabaseAdmin
        .from("ip_locks")
        .update({ status: "inactive" })
        .eq("user_id", body.user_id);

      // Create new lock
      const { data, error } = await supabaseAdmin.from("ip_locks").insert({
        user_id: body.user_id,
        ip: body.ip,
        device: body.device,
        status: "active",
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: "IP lock updated",
        lock: data,
      });
    }, { module: "security", action: "ip_lock_update" });
  }

  // POST /auth/device-verify
  if (path === "/device-verify" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user, clientIP, deviceId }) => {
      const { data: lock } = await supabaseAdmin
        .from("ip_locks")
        .select("*")
        .eq("user_id", user.userId)
        .eq("status", "active")
        .single();

      if (!lock) {
        return jsonResponse({
          verified: true,
          message: "No IP lock configured",
        });
      }

      const isVerified = lock.ip === clientIP && lock.device === deviceId;

      return jsonResponse({
        verified: isVerified,
        current_ip: maskPhone(clientIP), // Mask IP partially
        registered_device: lock.device === deviceId,
      });
    }, { module: "auth", action: "device_verify" });
  }

  return errorResponse("Not found", 404);
});
