import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  // Handle WebSocket upgrade
  if (upgradeHeader.toLowerCase() === "websocket") {
    const url = new URL(req.url);
    const channel = url.searchParams.get('channel') || 'server_metrics';
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const allowedRoles = ['server_manager', 'boss_owner'];
    if (!roleData || !allowedRoles.includes(roleData.role)) {
      return new Response("Forbidden", { status: 403 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    // Track connection
    const connectionId = crypto.randomUUID();
    
    socket.onopen = async () => {
      console.log(`WebSocket connected: ${connectionId} on channel ${channel}`);
      
      // Register connection
      await supabase.from('websocket_connections').insert({
        id: connectionId,
        user_id: user.id,
        channel,
        session_id: connectionId,
        connected_at: new Date().toISOString(),
        is_active: true
      });

      // Send initial connection success
      socket.send(JSON.stringify({
        type: 'connected',
        channel,
        connection_id: connectionId,
        timestamp: new Date().toISOString()
      }));

      // Start sending events based on channel
      startEventStream(socket, supabase, channel, connectionId);
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle ping
        if (message.type === 'ping') {
          await supabase
            .from('websocket_connections')
            .update({ last_ping_at: new Date().toISOString() })
            .eq('id', connectionId);
          
          socket.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }
        
        // Handle subscription to specific server
        if (message.type === 'subscribe' && message.server_id) {
          socket.send(JSON.stringify({
            type: 'subscribed',
            server_id: message.server_id,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (e) {
        console.error('Message parse error:', e);
      }
    };

    socket.onclose = async () => {
      console.log(`WebSocket disconnected: ${connectionId}`);
      await supabase
        .from('websocket_connections')
        .update({ is_active: false })
        .eq('id', connectionId);
    };

    socket.onerror = (e) => {
      console.error('WebSocket error:', e);
    };

    return response;
  }

  // Non-WebSocket request - return event history
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const channel = url.searchParams.get('channel');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = supabase
      .from('websocket_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (channel) {
      query = query.eq('channel', channel);
    }

    const { data, error } = await query;

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function startEventStream(
  socket: WebSocket,
  supabase: any,
  channel: string,
  connectionId: string
) {
  const sendEvent = (event: any) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(event));
    }
  };

  // Metrics channel - send live metrics every 5 seconds
  if (channel === 'server_metrics' || channel === 'all') {
    const metricsInterval = setInterval(async () => {
      try {
        const { data: metrics } = await supabase
          .from('server_metrics_cache')
          .select('*, server_instances(name, status)')
          .order('recorded_at', { ascending: false })
          .limit(10);

        if (metrics) {
          metrics.forEach((m: any) => {
            sendEvent({
              type: 'metric_update',
              server_id: m.server_id,
              server_name: m.server_instances?.name,
              cpu: m.cpu_percent,
              ram: m.ram_percent,
              disk: m.disk_percent,
              network_in: m.network_in_mbps,
              network_out: m.network_out_mbps,
              timestamp: m.recorded_at
            });
          });
        }
      } catch (e) {
        console.error('Metrics fetch error:', e);
      }
    }, 5000);

    socket.addEventListener('close', () => clearInterval(metricsInterval));
  }

  // Alerts channel - check for new alerts every 10 seconds
  if (channel === 'server_alerts' || channel === 'all') {
    const alertsInterval = setInterval(async () => {
      try {
        const { data: alerts } = await supabase
          .from('server_alerts')
          .select('*')
          .in('status', ['active', 'triggered'])
          .order('triggered_at', { ascending: false })
          .limit(5);

        if (alerts) {
          alerts.forEach((a: any) => {
            sendEvent({
              type: 'alert',
              server_id: a.server_id,
              alert_id: a.id,
              severity: a.severity,
              alert_type: a.alert_type,
              message: a.message,
              threshold: a.threshold_value,
              current: a.current_value,
              timestamp: a.triggered_at
            });
          });
        }
      } catch (e) {
        console.error('Alerts fetch error:', e);
      }
    }, 10000);

    socket.addEventListener('close', () => clearInterval(alertsInterval));
  }

  // Actions channel - monitor scaling and server actions
  if (channel === 'server_actions' || channel === 'all') {
    const actionsInterval = setInterval(async () => {
      try {
        const { data: actions } = await supabase
          .from('server_actions')
          .select('*, server_instances(name)')
          .eq('status', 'in_progress')
          .order('requested_at', { ascending: false })
          .limit(5);

        if (actions) {
          actions.forEach((a: any) => {
            sendEvent({
              type: 'scale',
              server_id: a.server_id,
              server_name: a.server_instances?.name,
              action: a.action,
              action_type: a.action_type,
              previous: a.previous_config,
              new: a.new_config,
              status: a.status,
              timestamp: a.requested_at
            });
          });
        }

        // Also check scaling events
        const { data: scalingEvents } = await supabase
          .from('scaling_events')
          .select('*')
          .gte('created_at', new Date(Date.now() - 30000).toISOString())
          .order('created_at', { ascending: false });

        if (scalingEvents) {
          scalingEvents.forEach((s: any) => {
            sendEvent({
              type: 'scale',
              server_id: s.server_id,
              action: 'scale_' + s.scale_direction,
              cpu: s.scale_direction === 'up' ? `+${s.cpu_after - s.cpu_before}` : `-${s.cpu_before - s.cpu_after}`,
              ram: s.scale_direction === 'up' ? `+${s.ram_after - s.ram_before}GB` : `-${s.ram_before - s.ram_after}GB`,
              reason: s.trigger_reason,
              status: s.status,
              timestamp: s.created_at
            });
          });
        }
      } catch (e) {
        console.error('Actions fetch error:', e);
      }
    }, 5000);

    socket.addEventListener('close', () => clearInterval(actionsInterval));
  }

  // Health/Status channel
  if (channel === 'server_health' || channel === 'all') {
    const healthInterval = setInterval(async () => {
      try {
        const { data: servers } = await supabase
          .from('server_instances')
          .select('id, name, status, last_heartbeat_at')
          .order('updated_at', { ascending: false });

        if (servers) {
          servers.forEach((s: any) => {
            sendEvent({
              type: 'status',
              server_id: s.id,
              server_name: s.name,
              status: s.status,
              last_heartbeat: s.last_heartbeat_at,
              timestamp: new Date().toISOString()
            });
          });
        }
      } catch (e) {
        console.error('Health fetch error:', e);
      }
    }, 15000);

    socket.addEventListener('close', () => clearInterval(healthInterval));
  }
}
