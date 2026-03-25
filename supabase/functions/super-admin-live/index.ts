import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// SUPER ADMIN LIVE ACTIVITY WEBSOCKET
// Real-time activity updates
// ============================================

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  // Handle regular HTTP requests (for health checks)
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response(JSON.stringify({ 
      status: 'ok', 
      message: 'Super Admin Live Activity WebSocket endpoint',
      usage: 'Connect via WebSocket for real-time updates'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Upgrade to WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let userId: string | null = null;
  let sessionId: string | null = null;
  let isAuthenticated = false;
  let heartbeatInterval: number | null = null;

  socket.onopen = () => {
    console.log('[SUPER-ADMIN-LIVE] WebSocket connection opened');
    
    // Send connection acknowledgment
    socket.send(JSON.stringify({
      type: 'connection',
      status: 'connected',
      message: 'WebSocket connected. Please authenticate.',
      timestamp: new Date().toISOString()
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('[SUPER-ADMIN-LIVE] Received:', message.type);

      switch (message.type) {
        case 'auth': {
          // Authenticate the WebSocket connection
          const token = message.token;
          if (!token) {
            socket.send(JSON.stringify({
              type: 'auth_error',
              message: 'Token required'
            }));
            return;
          }

          const { data: { user }, error: userError } = await supabase.auth.getUser(token);
          if (userError || !user) {
            socket.send(JSON.stringify({
              type: 'auth_error',
              message: 'Invalid token'
            }));
            return;
          }

          // Verify super admin role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'super_admin')
            .single();

          if (!roleData) {
            socket.send(JSON.stringify({
              type: 'auth_error',
              message: 'Not a Super Admin'
            }));
            return;
          }

          // Get active session
          const { data: sessionData } = await supabase
            .from('super_admin_sessions')
            .select('id')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('login_at', { ascending: false })
            .limit(1)
            .single();

          userId = user.id;
          sessionId = sessionData?.id || null;
          isAuthenticated = true;

          // Log live activity view start
          const { data: viewData } = await supabase
            .from('super_admin_live_activity_views')
            .insert({
              user_id: userId,
              session_id: sessionId
            })
            .select()
            .single();

          socket.send(JSON.stringify({
            type: 'auth_success',
            user_id: userId,
            view_id: viewData?.id,
            message: 'Authenticated successfully'
          }));

          // Start heartbeat
          heartbeatInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({
                type: 'heartbeat',
                timestamp: new Date().toISOString()
              }));
            }
          }, 30000);

          // Send initial data
          await sendInitialData(socket, supabase);

          // Start polling for updates
          startActivityPolling(socket, supabase, userId);

          break;
        }

        case 'subscribe': {
          if (!isAuthenticated) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Not authenticated'
            }));
            return;
          }

          const { channel } = message;
          socket.send(JSON.stringify({
            type: 'subscribed',
            channel,
            message: `Subscribed to ${channel}`
          }));
          break;
        }

        case 'ping': {
          socket.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
          break;
        }

        case 'get_stats': {
          if (!isAuthenticated) return;

          const stats = await getSystemStats(supabase);
          socket.send(JSON.stringify({
            type: 'stats',
            data: stats,
            timestamp: new Date().toISOString()
          }));
          break;
        }

        case 'get_alerts': {
          if (!isAuthenticated) return;

          const { data: alerts } = await supabase
            .from('super_admin_security_events')
            .select('*')
            .eq('is_resolved', false)
            .order('created_at', { ascending: false })
            .limit(20);

          socket.send(JSON.stringify({
            type: 'alerts',
            data: alerts || [],
            timestamp: new Date().toISOString()
          }));
          break;
        }

        default:
          socket.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${message.type}`
          }));
      }
    } catch (error) {
      console.error('[SUPER-ADMIN-LIVE] Message error:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  };

  socket.onclose = async () => {
    console.log('[SUPER-ADMIN-LIVE] WebSocket connection closed');

    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }

    // Log view end
    if (userId && sessionId) {
      await supabase
        .from('super_admin_live_activity_views')
        .update({ view_ended_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('session_id', sessionId)
        .is('view_ended_at', null);
    }
  };

  socket.onerror = (error) => {
    console.error('[SUPER-ADMIN-LIVE] WebSocket error:', error);
  };

  return response;
});

async function sendInitialData(socket: WebSocket, supabase: any) {
  // Get initial stats
  const stats = await getSystemStats(supabase);
  
  // Get recent activity
  const { data: recentActivity } = await supabase
    .from('super_admin_activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  // Get unresolved alerts
  const { data: alerts } = await supabase
    .from('super_admin_security_events')
    .select('*')
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })
    .limit(10);

  socket.send(JSON.stringify({
    type: 'initial_data',
    data: {
      stats,
      recent_activity: recentActivity || [],
      alerts: alerts || []
    },
    timestamp: new Date().toISOString()
  }));
}

async function getSystemStats(supabase: any) {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Get various counts
  const [
    { count: totalUsers },
    { count: activeAdmins },
    { count: activeLocks },
    { count: pendingApprovals },
    { count: unresolvedAlerts },
    { count: actionsToday }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('admins').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('system_locks').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('approvals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('super_admin_security_events').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
    supabase.from('super_admin_activity_log').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo.toISOString())
  ]);

  return {
    total_users: totalUsers || 0,
    active_admins: activeAdmins || 0,
    active_locks: activeLocks || 0,
    pending_approvals: pendingApprovals || 0,
    unresolved_alerts: unresolvedAlerts || 0,
    actions_today: actionsToday || 0
  };
}

function startActivityPolling(socket: WebSocket, supabase: any, userId: string) {
  let lastActivityTime = new Date().toISOString();

  const pollInterval = setInterval(async () => {
    if (socket.readyState !== WebSocket.OPEN) {
      clearInterval(pollInterval);
      return;
    }

    try {
      // Get new activities since last poll
      const { data: newActivities } = await supabase
        .from('super_admin_activity_log')
        .select('*')
        .gt('created_at', lastActivityTime)
        .order('created_at', { ascending: false })
        .limit(20);

      if (newActivities && newActivities.length > 0) {
        lastActivityTime = newActivities[0].created_at;
        
        socket.send(JSON.stringify({
          type: 'new_activity',
          data: newActivities,
          timestamp: new Date().toISOString()
        }));
      }

      // Check for new alerts
      const { data: newAlerts } = await supabase
        .from('super_admin_security_events')
        .select('*')
        .eq('is_resolved', false)
        .gt('created_at', lastActivityTime)
        .order('created_at', { ascending: false });

      if (newAlerts && newAlerts.length > 0) {
        socket.send(JSON.stringify({
          type: 'new_alert',
          data: newAlerts,
          timestamp: new Date().toISOString()
        }));
      }

    } catch (error) {
      console.error('[SUPER-ADMIN-LIVE] Polling error:', error);
    }
  }, 5000); // Poll every 5 seconds
}
