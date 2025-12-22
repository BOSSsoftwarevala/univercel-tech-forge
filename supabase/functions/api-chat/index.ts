import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  maskName,
  sanitizeInput,
} from "../_shared/utils.ts";
import { withAuth, RequestContext } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/chat", "");

  // POST /chat/send (masked, no edit/delete allowed)
  if (path === "/send" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["thread_id", "message_text"]);
      if (validation) return errorResponse(validation);

      // Get thread to verify access
      const { data: thread } = await supabaseAdmin
        .from("chat_threads")
        .select("*")
        .eq("thread_id", body.thread_id)
        .single();

      if (!thread) return errorResponse("Thread not found", 404);

      // Create masked sender name
      const maskedSender = `${user.role.toUpperCase()}-${user.userId.slice(0, 4)}`;

      // Sanitize message text to prevent XSS
      const sanitizedMessage = sanitizeInput(body.message_text);
      if (!sanitizedMessage) return errorResponse("Message cannot be empty");

      const { data, error } = await supabaseAdmin.from("chat_messages").insert({
        thread_id: body.thread_id,
        sender_id: user.userId,
        masked_sender: maskedSender,
        message_text: sanitizedMessage,
        language: body.language || "en",
        cannot_edit: true,
        cannot_delete: true,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message_id: data.message_id,
        masked_sender: maskedSender,
        sent_at: data.timestamp,
        // Important: No edit/delete endpoints exist by design
      }, 201);
    }, { module: "chat", action: "send" });
  }

  // GET /chat/thread
  if (path === "/thread" && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const urlParams = new URL(req.url);
      const threadId = urlParams.searchParams.get("thread_id");

      if (!threadId) return errorResponse("thread_id required");

      // Verify thread access
      const { data: thread } = await supabaseAdmin
        .from("chat_threads")
        .select("*")
        .eq("thread_id", threadId)
        .single();

      if (!thread) return errorResponse("Thread not found", 404);

      // Check access (creator or admin)
      if (thread.created_by !== user.userId && !["super_admin", "admin"].includes(user.role)) {
        // Check if user is part of related role
        if (thread.related_role && thread.related_role !== user.role) {
          return errorResponse("Access denied to this thread", 403);
        }
      }

      const { data: messages } = await supabaseAdmin
        .from("chat_messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("timestamp", { ascending: true });

      return jsonResponse({
        thread: {
          id: thread.thread_id,
          created_at: thread.created_at,
          related_lead: thread.related_lead,
          related_task: thread.related_task,
          is_active: thread.is_active,
        },
        messages: messages?.map((m: any) => ({
          id: m.message_id,
          sender: m.masked_sender, // Always masked
          text: m.message_text,
          language: m.language,
          translated: m.translated_text,
          timestamp: m.timestamp,
          // Explicitly showing these fields to indicate restrictions
          can_edit: false,
          can_delete: false,
        })) || [],
      });
    }, { module: "chat", action: "thread" });
  }

  // POST /chat/thread/create
  if (path === "/thread/create" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const { data, error } = await supabaseAdmin.from("chat_threads").insert({
        created_by: user.userId,
        related_lead: body.lead_id,
        related_task: body.task_id,
        related_role: body.role || user.role,
        is_active: true,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        thread_id: data.thread_id,
        created_at: data.created_at,
      }, 201);
    }, { module: "chat", action: "create_thread" });
  }

  // GET /chat/threads (list user's threads)
  if (path === "/threads" && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      let query = supabaseAdmin
        .from("chat_threads")
        .select(`
          *,
          chat_messages (message_id, timestamp)
        `);

      if (!["super_admin", "admin"].includes(user.role)) {
        query = query.or(`created_by.eq.${user.userId},related_role.eq.${user.role}`);
      }

      const { data, error } = await query
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        threads: data?.map((t: any) => ({
          id: t.thread_id,
          related_lead: t.related_lead,
          related_task: t.related_task,
          message_count: t.chat_messages?.length || 0,
          last_message: t.chat_messages?.[t.chat_messages.length - 1]?.timestamp,
          created_at: t.created_at,
        })) || [],
      });
    }, { module: "chat", action: "list_threads" });
  }

  // NOTE: No DELETE or PUT endpoints for messages - by design
  // All messages are permanent and cannot be edited or deleted

  return errorResponse("Not found", 404);
});
