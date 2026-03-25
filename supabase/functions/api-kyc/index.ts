import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  maskEmail,
  maskPhone,
} from "../_shared/utils.ts";
import { withAuth, withSuperAdmin, RequestContext } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/kyc", "").replace("/api/legal", "");

  // POST /kyc/upload
  if (path === "/upload" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["doc_type", "doc_file"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin.from("kyc_documents").insert({
        user_id: user.userId,
        doc_type: body.doc_type,
        doc_file: body.doc_file,
        status: "pending",
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: "KYC document uploaded",
        kyc_id: data.kyc_id,
        status: "pending",
      }, 201);
    }, { module: "kyc", action: "upload" });
  }

  // GET /kyc/status
  if (path === "/status" && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { data: docs } = await supabaseAdmin
        .from("kyc_documents")
        .select("*")
        .eq("user_id", user.userId)
        .order("timestamp", { ascending: false });

      const latestStatus = docs?.[0]?.status || "not_submitted";

      return jsonResponse({
        status: latestStatus,
        documents: docs?.map((d: any) => ({
          kyc_id: d.kyc_id,
          doc_type: d.doc_type,
          status: d.status,
          submitted_at: d.timestamp,
          verified_by: d.verified_by ? "System" : null,
        })) || [],
      });
    }, { module: "kyc", action: "status_check" });
  }

  // POST /kyc/verify (Admin only)
  if (path === "/verify" && req.method === "POST") {
    return withAuth(req, ["boss_owner", "admin", "legal_compliance"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["kyc_id", "status"]);
      if (validation) return errorResponse(validation);

      if (!["verified", "rejected", "pending"].includes(body.status)) {
        return errorResponse("Invalid status. Use: verified, rejected, pending");
      }

      const { data, error } = await supabaseAdmin
        .from("kyc_documents")
        .update({
          status: body.status,
          verified_by: user.userId,
        })
        .eq("kyc_id", body.kyc_id)
        .select()
        .single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: `KYC ${body.status}`,
        kyc_id: data.kyc_id,
      });
    }, { module: "kyc", action: "verify" });
  }

  // POST /legal/report
  if (path === "/report" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["title", "description", "severity"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin.from("incidents").insert({
        title: body.title,
        description: body.description,
        severity: body.severity,
        reported_by: user.userId,
        status: "open",
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: "Incident reported",
        incident_id: data.incident_id,
      }, 201);
    }, { module: "legal", action: "report" });
  }

  return errorResponse("Not found", 404);
});
