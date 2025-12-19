// WebSocket Event System for Software Vala
// Handles real-time notifications, buzzers, and live updates

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, upgrade",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Event types
type EventType =
  | "lead.new"
  | "lead.unassigned.buzzer"
  | "demo.down.alert"
  | "developer.timer.expire"
  | "developer.timer.warning"
  | "prime.fasttrack"
  | "wallet.credit"
  | "wallet.debit"
  | "task.escalate"
  | "task.assigned"
  | "task.completed"
  | "support.ticket"
  | "legal.alert"
  | "fraud.alert"
  | "kyc.status"
  | "subscription.expiring"
  | "subscription.expired";

interface WebSocketEvent {
  type: EventType;
  payload: Record<string, any>;
  target_user_id?: string;
  target_role?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  buzzer?: boolean;
}

// Initialize Supabase admin client
function getSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Get user from token
async function getUserFromToken(supabase: any): Promise<{ userId: string; role: string } | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return {
    userId: user.id,
    role: roleData?.role || "client",
  };
}

// Connected clients store
const clients = new Map<string, {
  socket: WebSocket;
  userId: string;
  role: string;
  deviceId: string;
}>();

// Broadcast event to relevant clients
function broadcastEvent(event: WebSocketEvent) {
  const message = JSON.stringify({
    type: event.type,
    payload: event.payload,
    priority: event.priority || "normal",
    buzzer: event.buzzer || false,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client, id) => {
    try {
      let shouldSend = false;

      // Check if event targets specific user
      if (event.target_user_id && client.userId === event.target_user_id) {
        shouldSend = true;
      }
      // Check if event targets specific role
      else if (event.target_role && client.role === event.target_role) {
        shouldSend = true;
      }
      // Broadcast to admins for all events
      else if (client.role === "super_admin" || client.role === "admin") {
        shouldSend = true;
      }
      // Role-specific broadcasts
      else if (!event.target_user_id && !event.target_role) {
        // Broadcast to all connected clients
        shouldSend = true;
      }

      if (shouldSend && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(message);
      }
    } catch (error) {
      console.error(`Error sending to client ${id}:`, error);
      clients.delete(id);
    }
  });
}

// Process notification queue
async function processNotificationQueue(supabaseAdmin: any) {
  const { data: notifications } = await supabaseAdmin
    .from("notification_queue")
    .select("*")
    .eq("processed", false)
    .order("created_at", { ascending: true })
    .limit(100);

  if (!notifications || notifications.length === 0) return;

  for (const notification of notifications) {
    broadcastEvent({
      type: notification.event_type,
      payload: notification.payload,
      target_user_id: notification.target_user_id,
      target_role: notification.target_role,
      priority: notification.payload?.priority || "normal",
      buzzer: notification.payload?.buzzer || false,
    });

    // Mark as processed
    await supabaseAdmin
      .from("notification_queue")
      .update({ processed: true })
      .eq("id", notification.id);
  }
}

// Check for active buzzers
async function checkBuzzers(supabaseAdmin: any) {
  const { data: buzzers } = await supabaseAdmin
    .from("buzzer_queue")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (!buzzers || buzzers.length === 0) return;

  for (const buzzer of buzzers) {
    broadcastEvent({
      type: buzzer.trigger_type as EventType,
      payload: {
        buzzer_id: buzzer.id,
        task_id: buzzer.task_id,
        lead_id: buzzer.lead_id,
        region: buzzer.region,
      },
      target_role: buzzer.role_target,
      priority: buzzer.priority === "urgent" ? "urgent" : "high",
      buzzer: true,
    });
  }
}

// Check for expiring timers
async function checkTimerAlerts(supabaseAdmin: any) {
  // Get active timers
  const { data: activeTasks } = await supabaseAdmin
    .from("developer_tasks")
    .select(`
      id, 
      developer_id,
      title,
      promised_delivery_at,
      max_delivery_hours,
      started_at,
      developers!inner(user_id)
    `)
    .eq("status", "in_progress")
    .not("started_at", "is", null);

  if (!activeTasks) return;

  const now = new Date();

  for (const task of activeTasks) {
    const startTime = new Date(task.started_at);
    const maxMs = (task.max_delivery_hours || 2) * 60 * 60 * 1000;
    const elapsedMs = now.getTime() - startTime.getTime();
    const remainingMs = maxMs - elapsedMs;

    // Warning at 15 minutes remaining
    if (remainingMs <= 15 * 60 * 1000 && remainingMs > 0) {
      broadcastEvent({
        type: "developer.timer.warning",
        payload: {
          task_id: task.id,
          title: task.title,
          remaining_minutes: Math.ceil(remainingMs / 60000),
        },
        target_user_id: task.developers?.user_id,
        priority: "high",
        buzzer: true,
      });
    }

    // Expired
    if (remainingMs <= 0) {
      broadcastEvent({
        type: "developer.timer.expire",
        payload: {
          task_id: task.id,
          title: task.title,
          overtime_minutes: Math.floor(-remainingMs / 60000),
        },
        target_user_id: task.developers?.user_id,
        priority: "urgent",
        buzzer: true,
      });

      // Also notify task managers
      broadcastEvent({
        type: "task.escalate",
        payload: {
          task_id: task.id,
          developer_id: task.developer_id,
          reason: "timer_expired",
          overtime_minutes: Math.floor(-remainingMs / 60000),
        },
        target_role: "task_manager",
        priority: "high",
        buzzer: true,
      });
    }
  }
}

// Main WebSocket handler
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  // Check for WebSocket upgrade request
  if (upgradeHeader.toLowerCase() !== "websocket") {
    // HTTP endpoint for sending events (internal use)
    if (req.method === "POST") {
      try {
        const body = await req.json();
        const supabaseAdmin = getSupabaseAdmin();

        // Verify internal API key or admin auth
        const authHeader = headers.get("authorization");
        if (!authHeader) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Broadcast the event
        broadcastEvent({
          type: body.type,
          payload: body.payload,
          target_user_id: body.target_user_id,
          target_role: body.target_role,
          priority: body.priority,
          buzzer: body.buzzer,
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response("WebSocket connection required", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Upgrade to WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);
  const clientId = crypto.randomUUID();
  const supabaseAdmin = getSupabaseAdmin();

  socket.onopen = () => {
    console.log(`WebSocket client connected: ${clientId}`);
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "auth": {
          // Authenticate the connection
          const token = message.token;
          if (!token) {
            socket.send(JSON.stringify({ type: "error", message: "Token required" }));
            return;
          }

          const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
              global: { headers: { Authorization: `Bearer ${token}` } },
              auth: { autoRefreshToken: false, persistSession: false },
            }
          );

          const user = await getUserFromToken(supabase);
          if (!user) {
            socket.send(JSON.stringify({ type: "error", message: "Invalid token" }));
            socket.close();
            return;
          }

          // Store client connection
          clients.set(clientId, {
            socket,
            userId: user.userId,
            role: user.role,
            deviceId: message.device_id || "unknown",
          });

          socket.send(JSON.stringify({
            type: "auth_success",
            user_id: user.userId,
            role: user.role,
          }));

          // Send any pending buzzers for this user
          const { data: pendingBuzzers } = await supabaseAdmin
            .from("buzzer_queue")
            .select("*")
            .eq("status", "pending")
            .or(`role_target.eq.${user.role},accepted_by.eq.${user.userId}`);

          if (pendingBuzzers && pendingBuzzers.length > 0) {
            socket.send(JSON.stringify({
              type: "pending_buzzers",
              buzzers: pendingBuzzers,
            }));
          }
          break;
        }

        case "buzzer_acknowledge": {
          // Mark buzzer as acknowledged
          const { buzzer_id } = message;
          const client = clients.get(clientId);
          
          if (!client) {
            socket.send(JSON.stringify({ type: "error", message: "Not authenticated" }));
            return;
          }

          await supabaseAdmin
            .from("buzzer_queue")
            .update({
              status: "accepted",
              accepted_by: client.userId,
              accepted_at: new Date().toISOString(),
            })
            .eq("id", buzzer_id);

          socket.send(JSON.stringify({
            type: "buzzer_acknowledged",
            buzzer_id,
          }));

          // Notify other clients that buzzer is taken
          broadcastEvent({
            type: "lead.unassigned.buzzer",
            payload: { buzzer_id, status: "accepted" },
            priority: "normal",
          });
          break;
        }

        case "ping": {
          socket.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
          break;
        }

        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error("WebSocket message error:", error);
      socket.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
  };

  socket.onerror = (error) => {
    console.error(`WebSocket error for ${clientId}:`, error);
  };

  socket.onclose = () => {
    console.log(`WebSocket client disconnected: ${clientId}`);
    clients.delete(clientId);
  };

  // Start background tasks for this connection
  const intervalId = setInterval(async () => {
    try {
      await processNotificationQueue(supabaseAdmin);
      await checkBuzzers(supabaseAdmin);
      await checkTimerAlerts(supabaseAdmin);
    } catch (error) {
      console.error("Background task error:", error);
    }
  }, 5000); // Check every 5 seconds

  // Cleanup on close
  socket.addEventListener("close", () => {
    clearInterval(intervalId);
  });

  return response;
});
