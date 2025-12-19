// Prime User Management API for Software Vala
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
  const path = url.pathname.replace("/api-prime", "");
  const method = req.method;

  // POST /prime/upgrade
  if (method === "POST" && path === "/upgrade") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["tier"]);
      if (validation) return errorResponse(validation);

      const validTiers = ["silver", "gold", "platinum", "enterprise"];
      if (!validTiers.includes(ctx.body.tier)) {
        return errorResponse("Invalid tier. Choose from: silver, gold, platinum, enterprise");
      }

      // Check existing subscription
      const { data: existingPrime } = await ctx.supabaseAdmin
        .from("prime_user_profiles")
        .select("*")
        .eq("user_id", ctx.user!.userId)
        .single();

      const tierPrices = {
        silver: 9999,
        gold: 24999,
        platinum: 49999,
        enterprise: 99999,
      };

      const tierFeatures = {
        silver: { priority_level: 1, dedicated_support: false, sla_hours: 24, max_tasks: 5 },
        gold: { priority_level: 2, dedicated_support: true, sla_hours: 12, max_tasks: 15 },
        platinum: { priority_level: 3, dedicated_support: true, sla_hours: 4, max_tasks: 50 },
        enterprise: { priority_level: 4, dedicated_support: true, sla_hours: 1, max_tasks: 999 },
      };

      const tier = ctx.body.tier as keyof typeof tierPrices;

      if (existingPrime) {
        // Upgrade existing
        const { data: prime, error } = await ctx.supabaseAdmin
          .from("prime_user_profiles")
          .update({
            tier,
            priority_level: tierFeatures[tier].priority_level,
            dedicated_support: tierFeatures[tier].dedicated_support,
            sla_hours: tierFeatures[tier].sla_hours,
            max_concurrent_tasks: tierFeatures[tier].max_tasks,
            upgraded_at: new Date().toISOString(),
            is_active: true,
          })
          .eq("id", existingPrime.id)
          .select()
          .single();

        if (error) return errorResponse("Unable to upgrade your subscription.");

        await notificationMiddleware(ctx, "prime.upgrade", {
          user_id: ctx.user!.userId,
          tier,
          target_role: "admin",
        });

        return jsonResponse({
          message: `Your account has been upgraded to ${tier.toUpperCase()} tier!`,
          prime,
          features: tierFeatures[tier],
        });
      }

      // Create new prime profile
      const { data: prime, error } = await ctx.supabaseAdmin
        .from("prime_user_profiles")
        .insert({
          user_id: ctx.user!.userId,
          tier,
          priority_level: tierFeatures[tier].priority_level,
          dedicated_support: tierFeatures[tier].dedicated_support,
          sla_hours: tierFeatures[tier].sla_hours,
          max_concurrent_tasks: tierFeatures[tier].max_tasks,
          is_active: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create prime subscription.");

      // Assign prime role
      await ctx.supabaseAdmin.from("user_roles").upsert({
        user_id: ctx.user!.userId,
        role: "prime",
      });

      await notificationMiddleware(ctx, "prime.new", {
        user_id: ctx.user!.userId,
        tier,
        target_role: "admin",
      });

      return jsonResponse({
        message: `Welcome to Software Vala ${tier.toUpperCase()}! Enjoy priority support and faster delivery.`,
        prime,
        features: tierFeatures[tier],
        price: tierPrices[tier],
      }, 201);
    }, {
      module: "prime",
      action: "upgrade",
      requireAuth: true,
    });
  }

  // GET /prime/support
  if (method === "GET" && path === "/support") {
    return withEnhancedMiddleware(req, async (ctx) => {
      // Get prime profile
      const { data: prime } = await ctx.supabaseAdmin
        .from("prime_user_profiles")
        .select("*")
        .eq("user_id", ctx.user!.userId)
        .single();

      if (!prime || !prime.is_active) {
        return errorResponse("Prime subscription required for dedicated support.", 403);
      }

      // Get support threads
      const { data: threads } = await ctx.supabaseAdmin
        .from("dedicated_support_threads")
        .select(`
          *,
          dedicated_support_messages(
            id, message, sender_role, created_at
          )
        `)
        .eq("prime_user_id", prime.id)
        .order("last_message_at", { ascending: false });

      // Get assigned developer if any
      const { data: assignment } = await ctx.supabaseAdmin
        .from("developer_assignment_priority")
        .select(`
          *,
          developers(id, masked_email, availability_status)
        `)
        .eq("prime_user_id", prime.id)
        .eq("is_active", true)
        .single();

      return jsonResponse({
        prime_tier: prime.tier,
        sla_hours: prime.sla_hours,
        support_threads: threads || [],
        assigned_developer: assignment?.developers ? {
          availability: assignment.developers.availability_status,
          assignment_type: assignment.assignment_type,
        } : null,
      });
    }, {
      module: "prime",
      action: "view_support",
      allowedRoles: ["prime", "super_admin", "admin"],
    });
  }

  // POST /prime/support/ticket
  if (method === "POST" && path === "/support/ticket") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["subject", "message"]);
      if (validation) return errorResponse(validation);

      // Get prime profile
      const { data: prime } = await ctx.supabaseAdmin
        .from("prime_user_profiles")
        .select("id, tier, sla_hours")
        .eq("user_id", ctx.user!.userId)
        .single();

      if (!prime) return errorResponse("Prime subscription required.");

      // Create support thread
      const { data: thread, error } = await ctx.supabaseAdmin
        .from("dedicated_support_threads")
        .insert({
          prime_user_id: prime.id,
          subject: ctx.body.subject,
          thread_type: ctx.body.type || "support",
          is_urgent: ctx.body.is_urgent || false,
          status: "active",
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create support ticket.");

      // Add first message
      await ctx.supabaseAdmin.from("dedicated_support_messages").insert({
        thread_id: thread.id,
        sender_id: ctx.user!.userId,
        sender_role: "prime",
        message: ctx.body.message,
        attachments: ctx.body.attachments || [],
      });

      // Create priority buzzer
      await createBuzzerAlert(
        ctx.supabaseAdmin,
        "prime.fasttrack",
        "support",
        null,
        null,
        ctx.body.is_urgent ? "urgent" : "high"
      );

      await notificationMiddleware(ctx, "support.ticket", {
        thread_id: thread.id,
        prime_tier: prime.tier,
        sla_hours: prime.sla_hours,
        is_urgent: ctx.body.is_urgent,
        target_role: "support",
        buzzer: true,
      });

      return jsonResponse({
        message: `Your support ticket has been created. Our team will respond within ${prime.sla_hours} hours.`,
        thread,
        sla_hours: prime.sla_hours,
      }, 201);
    }, {
      module: "prime",
      action: "create_support_ticket",
      allowedRoles: ["prime"],
    });
  }

  // POST /prime/fasttrack
  if (method === "POST" && path === "/fasttrack") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["task_title", "description", "category"]);
      if (validation) return errorResponse(validation);

      // Get prime profile
      const { data: prime } = await ctx.supabaseAdmin
        .from("prime_user_profiles")
        .select("*")
        .eq("user_id", ctx.user!.userId)
        .single();

      if (!prime || !prime.is_active) {
        return errorResponse("Active prime subscription required for fast-track tasks.");
      }

      // Check concurrent task limit
      const { count: activeTasks } = await ctx.supabaseAdmin
        .from("developer_tasks")
        .select("*", { count: "exact", head: true })
        .eq("client_id", ctx.user!.userId)
        .in("status", ["pending", "in_progress"]);

      if ((activeTasks || 0) >= prime.max_concurrent_tasks) {
        return errorResponse(`You've reached your limit of ${prime.max_concurrent_tasks} concurrent tasks.`);
      }

      // Calculate priority SLA
      const slaDueDate = new Date(Date.now() + prime.sla_hours * 60 * 60 * 1000);

      // Create fast-track task
      const { data: task, error } = await ctx.supabaseAdmin
        .from("developer_tasks")
        .insert({
          title: ctx.body.task_title,
          description: ctx.body.description,
          category: ctx.body.category,
          tech_stack: ctx.body.tech_stack || [],
          client_id: ctx.user!.userId,
          priority: "urgent",
          status: "pending",
          sla_hours: prime.sla_hours,
          deadline: slaDueDate.toISOString(),
          max_delivery_hours: prime.sla_hours,
          buzzer_active: true,
          masked_client_info: {
            tier: prime.tier,
            priority_level: prime.priority_level,
          },
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create fast-track task.");

      // Create urgent buzzer
      await createBuzzerAlert(
        ctx.supabaseAdmin,
        "prime.fasttrack",
        "developer",
        task.id,
        null,
        "urgent"
      );

      await notificationMiddleware(ctx, "task.assigned", {
        task_id: task.id,
        priority: "urgent",
        sla_hours: prime.sla_hours,
        prime_tier: prime.tier,
        target_role: "developer",
        buzzer: true,
      });

      return jsonResponse({
        message: `Fast-track task created! A developer will be assigned within minutes.`,
        task,
        sla_due: slaDueDate.toISOString(),
        priority_level: prime.priority_level,
      }, 201);
    }, {
      module: "prime",
      action: "create_fasttrack",
      allowedRoles: ["prime"],
      requireSubscription: true,
    });
  }

  // GET /prime/tasks
  if (method === "GET" && path === "/tasks") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data: tasks } = await ctx.supabaseAdmin
        .from("developer_tasks")
        .select(`
          *,
          developers(masked_email, availability_status)
        `)
        .eq("client_id", ctx.user!.userId)
        .order("created_at", { ascending: false });

      // Calculate SLA status for each task
      interface TaskRecord {
        deadline: string;
        status: string;
        [key: string]: unknown;
      }
      const tasksWithSLA = (tasks || []).map((task: TaskRecord) => {
        const now = new Date();
        const deadline = new Date(task.deadline);
        const remainingHours = Math.max(0, (deadline.getTime() - now.getTime()) / (60 * 60 * 1000));
        
        return {
          ...task,
          sla_status: remainingHours > 0 ? "on_track" : "breached",
          remaining_hours: remainingHours.toFixed(1),
        };
      });

      return jsonResponse({
        tasks: tasksWithSLA,
        total: tasksWithSLA.length,
        in_progress: tasksWithSLA.filter((t: { status: string }) => t.status === "in_progress").length,
        completed: tasksWithSLA.filter((t: { status: string }) => t.status === "completed").length,
      });
    }, {
      module: "prime",
      action: "view_tasks",
      allowedRoles: ["prime", "super_admin", "admin"],
    });
  }

  // GET /prime/invoices
  if (method === "GET" && path === "/invoices") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data: invoices } = await ctx.supabaseAdmin
        .from("invoices")
        .select("*")
        .eq("user_id", ctx.user!.userId)
        .order("created_at", { ascending: false });

      return jsonResponse(invoices || []);
    }, {
      module: "prime",
      action: "view_invoices",
      allowedRoles: ["prime", "super_admin", "admin", "finance_manager"],
    });
  }

  return errorResponse("Endpoint not found", 404);
});
