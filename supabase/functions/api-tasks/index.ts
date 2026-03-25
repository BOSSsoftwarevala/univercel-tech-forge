import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  createBuzzerAlert,
  routeTaskBySkill,
  maskName,
} from "../_shared/utils.ts";
import { withAuth, RequestContext } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/tasks", "");

  // POST /tasks/create
  if (path === "/create" && req.method === "POST") {
    return withAuth(req, ["boss_owner", "admin", "task_manager", "lead_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["title", "category"]);
      if (validation) return errorResponse(validation);

      // Auto-route to developer if tech_stack provided
      let assignedDev = null;
      if (body.tech_stack && body.auto_assign) {
        const { data: developers } = await supabaseAdmin
          .from("developers")
          .select(`
            *,
            developer_skills (*),
            developer_tasks (id, status)
          `)
          .eq("status", "active")
          .eq("availability_status", "available");

        assignedDev = routeTaskBySkill(body.tech_stack, developers || []);
      }

      const { data, error } = await supabaseAdmin.from("developer_tasks").insert({
        title: body.title,
        description: body.description,
        category: body.category,
        tech_stack: body.tech_stack || [],
        priority: body.priority || "medium",
        estimated_hours: body.estimated_hours || 2,
        sla_hours: body.sla_hours || 2,
        deadline: body.deadline,
        client_id: body.client_id,
        developer_id: assignedDev?.id,
        assigned_by: user.userId,
        status: assignedDev ? "assigned" : "pending",
        masked_client_info: body.client_info ? {
          name: maskName(body.client_info.name || "Client"),
          email: "***@***.com",
        } : null,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      // Create buzzer
      await createBuzzerAlert(
        supabaseAdmin,
        "new_task",
        "developer",
        data.id,
        null,
        body.priority || "normal"
      );

      return jsonResponse({
        message: "Task created",
        task_id: data.id,
        assigned_to: assignedDev?.id || null,
        buzzer: true,
      }, 201, true);
    }, { module: "tasks", action: "create" });
  }

  // PUT /tasks/assign
  if (path === "/assign" && req.method === "PUT") {
    return withAuth(req, ["boss_owner", "admin", "task_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["task_id", "developer_id"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin
        .from("developer_tasks")
        .update({
          developer_id: body.developer_id,
          assigned_by: user.userId,
          status: "assigned",
        })
        .eq("id", body.task_id)
        .select()
        .single();

      if (error) return errorResponse(error.message, 400);

      await createBuzzerAlert(supabaseAdmin, "task_assigned", "developer", data.id, null, "high");

      return jsonResponse({
        message: "Task assigned",
        task_id: data.id,
        developer_id: body.developer_id,
        buzzer: true,
      }, 200, true);
    }, { module: "tasks", action: "assign" });
  }

  // POST /tasks/promise (Developer accepts with promise)
  if (path === "/promise" && req.method === "POST") {
    return withAuth(req, ["developer"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["task_id", "promised_hours"]);
      if (validation) return errorResponse(validation);

      // Get developer ID
      const { data: dev } = await supabaseAdmin
        .from("developers")
        .select("id")
        .eq("user_id", user.userId)
        .single();

      if (!dev) return errorResponse("Developer profile not found", 404);

      const promisedAt = new Date();
      const promisedDelivery = new Date(promisedAt.getTime() + body.promised_hours * 60 * 60 * 1000);

      const { data, error } = await supabaseAdmin
        .from("developer_tasks")
        .update({
          status: "in_progress",
          accepted_at: promisedAt.toISOString(),
          promised_at: promisedAt.toISOString(),
          promised_delivery_at: promisedDelivery.toISOString(),
          started_at: promisedAt.toISOString(),
          buzzer_acknowledged_at: promisedAt.toISOString(),
          buzzer_active: false,
        })
        .eq("id", body.task_id)
        .eq("developer_id", dev.id)
        .select()
        .single();

      if (error) return errorResponse(error.message, 400);

      // Start timer automatically
      await supabaseAdmin.from("dev_timer").insert({
        task_id: body.task_id,
        dev_id: dev.id,
        start_timestamp: promisedAt.toISOString(),
      });

      await supabaseAdmin.from("developer_timer_logs").insert({
        task_id: body.task_id,
        developer_id: dev.id,
        action: "start",
        metadata: { promised_hours: body.promised_hours },
      });

      return jsonResponse({
        message: "Task accepted with promise",
        task_id: data.id,
        promised_delivery: promisedDelivery.toISOString(),
        timer_started: true,
      });
    }, { module: "tasks", action: "promise" });
  }

  // POST /tasks/timer/start
  if (path === "/timer/start" && req.method === "POST") {
    return withAuth(req, ["developer"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["task_id"]);
      if (validation) return errorResponse(validation);

      const { data: dev } = await supabaseAdmin
        .from("developers")
        .select("id")
        .eq("user_id", user.userId)
        .single();

      if (!dev) return errorResponse("Developer not found", 404);

      // Check if timer already running
      const { data: existingTimer } = await supabaseAdmin
        .from("dev_timer")
        .select("*")
        .eq("task_id", body.task_id)
        .eq("dev_id", dev.id)
        .is("stop_timestamp", null)
        .single();

      if (existingTimer && !existingTimer.pause_timestamp) {
        return errorResponse("Timer already running", 400);
      }

      const now = new Date().toISOString();

      if (existingTimer?.pause_timestamp) {
        // Resume from pause
        const pausedSeconds = Math.floor(
          (new Date().getTime() - new Date(existingTimer.pause_timestamp).getTime()) / 1000
        );

        await supabaseAdmin
          .from("dev_timer")
          .update({
            pause_timestamp: null,
            total_seconds: existingTimer.total_seconds + pausedSeconds,
          })
          .eq("timer_id", existingTimer.timer_id);

        await supabaseAdmin.from("developer_timer_logs").insert({
          task_id: body.task_id,
          developer_id: dev.id,
          action: "resume",
        });

        return jsonResponse({ message: "Timer resumed", timer_id: existingTimer.timer_id });
      }

      // Start new timer
      const { data: timer, error } = await supabaseAdmin.from("dev_timer").insert({
        task_id: body.task_id,
        dev_id: dev.id,
        start_timestamp: now,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      await supabaseAdmin.from("developer_timer_logs").insert({
        task_id: body.task_id,
        developer_id: dev.id,
        action: "start",
      });

      // Update task status
      await supabaseAdmin
        .from("developer_tasks")
        .update({ status: "in_progress", started_at: now })
        .eq("id", body.task_id);

      return jsonResponse({
        message: "Timer started",
        timer_id: timer.timer_id,
        started_at: now,
      });
    }, { module: "tasks", action: "timer_start" });
  }

  // POST /tasks/timer/pause
  if (path === "/timer/pause" && req.method === "POST") {
    return withAuth(req, ["developer"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["task_id"]);
      if (validation) return errorResponse(validation);

      const { data: dev } = await supabaseAdmin
        .from("developers")
        .select("id")
        .eq("user_id", user.userId)
        .single();

      if (!dev) return errorResponse("Developer not found", 404);

      const { data: timer } = await supabaseAdmin
        .from("dev_timer")
        .select("*")
        .eq("task_id", body.task_id)
        .eq("dev_id", dev.id)
        .is("stop_timestamp", null)
        .single();

      if (!timer) return errorResponse("No active timer found", 404);

      const now = new Date().toISOString();

      await supabaseAdmin
        .from("dev_timer")
        .update({ pause_timestamp: now })
        .eq("timer_id", timer.timer_id);

      await supabaseAdmin.from("developer_timer_logs").insert({
        task_id: body.task_id,
        developer_id: dev.id,
        action: "pause",
        pause_reason: body.reason,
      });

      // Update task
      await supabaseAdmin
        .from("developer_tasks")
        .update({
          paused_at: now,
          pause_reason: body.reason,
        })
        .eq("id", body.task_id);

      return jsonResponse({
        message: "Timer paused",
        timer_id: timer.timer_id,
        paused_at: now,
      });
    }, { module: "tasks", action: "timer_pause" });
  }

  // POST /tasks/timer/stop
  if (path === "/timer/stop" && req.method === "POST") {
    return withAuth(req, ["developer"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["task_id"]);
      if (validation) return errorResponse(validation);

      const { data: dev } = await supabaseAdmin
        .from("developers")
        .select("id")
        .eq("user_id", user.userId)
        .single();

      if (!dev) return errorResponse("Developer not found", 404);

      const { data: timer } = await supabaseAdmin
        .from("dev_timer")
        .select("*")
        .eq("task_id", body.task_id)
        .eq("dev_id", dev.id)
        .is("stop_timestamp", null)
        .single();

      if (!timer) return errorResponse("No active timer found", 404);

      const now = new Date();
      const startTime = new Date(timer.start_timestamp);
      const totalSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

      await supabaseAdmin
        .from("dev_timer")
        .update({
          stop_timestamp: now.toISOString(),
          total_seconds: totalSeconds,
        })
        .eq("timer_id", timer.timer_id);

      await supabaseAdmin.from("developer_timer_logs").insert({
        task_id: body.task_id,
        developer_id: dev.id,
        action: "stop",
        elapsed_minutes: Math.floor(totalSeconds / 60),
        checkpoint_type: body.checkpoint_type || "complete",
      });

      // Update task
      await supabaseAdmin
        .from("developer_tasks")
        .update({
          status: body.completed ? "completed" : "in_progress",
          completed_at: body.completed ? now.toISOString() : null,
          actual_delivery_at: body.completed ? now.toISOString() : null,
          delivery_notes: body.notes,
        })
        .eq("id", body.task_id);

      return jsonResponse({
        message: "Timer stopped",
        timer_id: timer.timer_id,
        total_seconds: totalSeconds,
        total_minutes: Math.floor(totalSeconds / 60),
      });
    }, { module: "tasks", action: "timer_stop" });
  }

  // GET /tasks (list tasks)
  if ((path === "" || path === "/") && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      let query = supabaseAdmin.from("developer_tasks").select(`
        *,
        dev_timer (timer_id, start_timestamp, stop_timestamp, total_seconds)
      `);

      // Role-based filtering
      if (user.role === "developer") {
        const { data: dev } = await supabaseAdmin
          .from("developers")
          .select("id")
          .eq("user_id", user.userId)
          .single();

        if (dev) query = query.eq("developer_id", dev.id);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) return errorResponse(error.message, 400);

      // Mask client info for developers
      const tasks = data?.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        status: t.status,
        priority: t.priority,
        client: user.role === "developer" ? t.masked_client_info : { id: t.client_id },
        deadline: t.deadline,
        promised_delivery: t.promised_delivery_at,
        actual_delivery: t.actual_delivery_at,
        timer: t.dev_timer?.[0],
        created_at: t.created_at,
      })) || [];

      return jsonResponse({ tasks });
    }, { module: "tasks", action: "list" });
  }

  return errorResponse("Not found", 404);
});
