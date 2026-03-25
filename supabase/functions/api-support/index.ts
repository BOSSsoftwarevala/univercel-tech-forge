// Support Ticket API for Software Vala
import {
  withEnhancedMiddleware,
  applyMasking,
  notificationMiddleware,
} from "../_shared/enhanced-middleware.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createBuzzerAlert,
} from "../_shared/utils.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-support", "");
  const method = req.method;

  // POST /support/ticket
  if (method === "POST" && path === "/ticket") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["subject", "message", "category"]);
      if (validation) return errorResponse(validation);

      // Generate ticket number
      const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

      // Check if user is prime for priority
      const { data: primeUser } = await ctx.supabaseAdmin
        .from("prime_user_profiles")
        .select("tier, sla_hours")
        .eq("user_id", ctx.user!.userId)
        .eq("is_active", true)
        .single();

      const priority = primeUser ? "high" : ctx.body.priority || "normal";
      const slaHours = primeUser?.sla_hours || 48;

      const { data: ticket, error } = await ctx.supabaseAdmin
        .from("support_tickets")
        .insert({
          ticket_number: ticketNumber,
          user_id: ctx.user!.userId,
          subject: ctx.body.subject,
          category: ctx.body.category,
          priority,
          status: "open",
          sla_hours: slaHours,
          sla_due_at: new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString(),
          is_prime: !!primeUser,
          prime_tier: primeUser?.tier,
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create support ticket.");

      // Add first message
      await ctx.supabaseAdmin.from("support_ticket_messages").insert({
        ticket_id: ticket.id,
        sender_id: ctx.user!.userId,
        sender_role: ctx.user!.role,
        message: ctx.body.message,
        attachments: ctx.body.attachments || [],
      });

      // Create buzzer for support team
      await createBuzzerAlert(
        ctx.supabaseAdmin,
        "support.ticket",
        "support",
        null,
        null,
        priority === "urgent" ? "urgent" : priority === "high" ? "high" : "normal"
      );

      await notificationMiddleware(ctx, "support.ticket", {
        ticket_id: ticket.id,
        ticket_number: ticketNumber,
        priority,
        is_prime: !!primeUser,
        target_role: "support",
        buzzer: priority === "urgent" || priority === "high",
      });

      return jsonResponse({
        message: `Your support ticket #${ticketNumber} has been created. We'll respond within ${slaHours} hours.`,
        ticket,
        sla_due_at: ticket.sla_due_at,
      }, 201);
    }, {
      module: "support",
      action: "create_ticket",
      requireAuth: true,
    });
  }

  // GET /support/tickets
  if (method === "GET" && path === "/tickets") {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from("support_tickets").select(`
        *,
        support_ticket_messages(count)
      `);

      // Filter based on role
      if (!["super_admin", "admin", "support"].includes(ctx.user!.role)) {
        query = query.eq("user_id", ctx.user!.userId);
      }

      // Apply filters
      const status = url.searchParams.get("status");
      if (status) query = query.eq("status", status);

      const priority = url.searchParams.get("priority");
      if (priority) query = query.eq("priority", priority);

      const category = url.searchParams.get("category");
      if (category) query = query.eq("category", category);

      query = query.order("created_at", { ascending: false });

      const { data: tickets, error } = await query;
      if (error) return errorResponse("Unable to retrieve tickets.");

      // Add SLA status
      interface TicketRecord {
        sla_due_at: string;
        status: string;
        [key: string]: unknown;
      }
      const ticketsWithSLA = (tickets || []).map((ticket: TicketRecord) => {
        const now = new Date();
        const slaDue = new Date(ticket.sla_due_at);
        const remainingMs = slaDue.getTime() - now.getTime();
        
        return {
          ...ticket,
          sla_status: remainingMs > 0 ? "on_track" : "breached",
          sla_remaining_hours: Math.max(0, remainingMs / (60 * 60 * 1000)).toFixed(1),
        };
      });

      return jsonResponse({
        tickets: applyMasking(ticketsWithSLA, ctx.user!.role),
        summary: {
          total: ticketsWithSLA.length,
          open: ticketsWithSLA.filter((t: { status: string }) => t.status === "open").length,
          in_progress: ticketsWithSLA.filter((t: { status: string }) => t.status === "in_progress").length,
          resolved: ticketsWithSLA.filter((t: { status: string }) => t.status === "resolved").length,
          sla_breached: ticketsWithSLA.filter((t: { sla_status: string }) => t.sla_status === "breached").length,
        },
      });
    }, {
      module: "support",
      action: "list_tickets",
      requireAuth: true,
    });
  }

  // POST /support/assign
  if (method === "POST" && path === "/assign") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["ticket_id", "assigned_to"]);
      if (validation) return errorResponse(validation);

      const { data: ticket, error } = await ctx.supabaseAdmin
        .from("support_tickets")
        .update({
          assigned_to: ctx.body.assigned_to,
          status: "in_progress",
          assigned_at: new Date().toISOString(),
        })
        .eq("id", ctx.body.ticket_id)
        .select()
        .single();

      if (error) return errorResponse("Unable to assign ticket.");

      await notificationMiddleware(ctx, "support.assigned", {
        ticket_id: ticket.id,
        target_user_id: ctx.body.assigned_to,
      });

      return jsonResponse({
        message: "Ticket assigned successfully.",
        ticket,
      });
    }, {
      module: "support",
      action: "assign_ticket",
      allowedRoles: ["super_admin", "admin", "support"],
    });
  }

  // POST /support/resolve
  if (method === "POST" && path === "/resolve") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["ticket_id", "resolution_notes"]);
      if (validation) return errorResponse(validation);

      const { data: ticket, error } = await ctx.supabaseAdmin
        .from("support_tickets")
        .update({
          status: "resolved",
          resolution_notes: ctx.body.resolution_notes,
          resolved_at: new Date().toISOString(),
          resolved_by: ctx.user!.userId,
        })
        .eq("id", ctx.body.ticket_id)
        .select()
        .single();

      if (error) return errorResponse("Unable to resolve ticket.");

      // Notify user
      await notificationMiddleware(ctx, "support.resolved", {
        ticket_id: ticket.id,
        target_user_id: ticket.user_id,
      });

      return jsonResponse({
        message: "Ticket resolved successfully.",
        ticket,
      });
    }, {
      module: "support",
      action: "resolve_ticket",
      allowedRoles: ["super_admin", "admin", "support"],
    });
  }

  // POST /support/reply
  if (method === "POST" && path === "/reply") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["ticket_id", "message"]);
      if (validation) return errorResponse(validation);

      // Get ticket
      const { data: ticket } = await ctx.supabaseAdmin
        .from("support_tickets")
        .select("user_id, status")
        .eq("id", ctx.body.ticket_id)
        .single();

      if (!ticket) return errorResponse("Ticket not found.");

      // Check permissions
      const canReply = 
        ["super_admin", "admin", "support"].includes(ctx.user!.role) ||
        ticket.user_id === ctx.user!.userId;

      if (!canReply) return errorResponse("You cannot reply to this ticket.");

      const { data: message, error } = await ctx.supabaseAdmin
        .from("support_ticket_messages")
        .insert({
          ticket_id: ctx.body.ticket_id,
          sender_id: ctx.user!.userId,
          sender_role: ctx.user!.role,
          message: ctx.body.message,
          attachments: ctx.body.attachments || [],
          is_internal: ctx.body.is_internal || false,
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to send reply.");

      // Update ticket timestamp
      await ctx.supabaseAdmin
        .from("support_tickets")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", ctx.body.ticket_id);

      // Notify appropriate party
      const targetUserId = ctx.user!.role === "support" 
        ? ticket.user_id 
        : ticket.assigned_to;

      if (targetUserId) {
        await notificationMiddleware(ctx, "support.reply", {
          ticket_id: ctx.body.ticket_id,
          target_user_id: targetUserId,
        });
      }

      return jsonResponse({
        message: "Reply sent successfully.",
        reply: message,
      });
    }, {
      module: "support",
      action: "reply_ticket",
      requireAuth: true,
    });
  }

  // GET /support/ticket/:id
  if (method === "GET" && path.startsWith("/ticket/")) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const ticketId = path.replace("/ticket/", "");

      const { data: ticket } = await ctx.supabaseAdmin
        .from("support_tickets")
        .select(`
          *,
          support_ticket_messages(*)
        `)
        .eq("id", ticketId)
        .single();

      if (!ticket) return errorResponse("Ticket not found.");

      // Check permissions
      const canView = 
        ["super_admin", "admin", "support"].includes(ctx.user!.role) ||
        ticket.user_id === ctx.user!.userId;

      if (!canView) return errorResponse("You cannot view this ticket.");

      // Filter internal messages for non-support
      if (!["super_admin", "admin", "support"].includes(ctx.user!.role)) {
        ticket.support_ticket_messages = ticket.support_ticket_messages?.filter(
          (m: any) => !m.is_internal
        );
      }

      return jsonResponse(applyMasking(ticket, ctx.user!.role));
    }, {
      module: "support",
      action: "view_ticket",
      requireAuth: true,
    });
  }

  // POST /support/escalate
  if (method === "POST" && path === "/escalate") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["ticket_id", "reason"]);
      if (validation) return errorResponse(validation);

      const { data: ticket, error } = await ctx.supabaseAdmin
        .from("support_tickets")
        .update({
          is_escalated: true,
          escalated_at: new Date().toISOString(),
          escalated_by: ctx.user!.userId,
          escalation_reason: ctx.body.reason,
          priority: "urgent",
        })
        .eq("id", ctx.body.ticket_id)
        .select()
        .single();

      if (error) return errorResponse("Unable to escalate ticket.");

      // Create urgent buzzer
      await createBuzzerAlert(
        ctx.supabaseAdmin,
        "support.ticket",
        "admin",
        null,
        null,
        "urgent"
      );

      await notificationMiddleware(ctx, "support.escalated", {
        ticket_id: ticket.id,
        reason: ctx.body.reason,
        target_role: "admin",
        buzzer: true,
      });

      return jsonResponse({
        message: "Ticket has been escalated to management.",
        ticket,
      });
    }, {
      module: "support",
      action: "escalate_ticket",
      allowedRoles: ["super_admin", "admin", "support"],
    });
  }

  return errorResponse("Endpoint not found", 404);
});
