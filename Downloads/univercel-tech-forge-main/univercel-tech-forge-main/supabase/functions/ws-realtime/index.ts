import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * WebSocket Realtime Hub for SOFTWARE VALA
 * Handles: alerts, buzzer, timer updates, chat, demo status
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebSocketClient {
  socket: WebSocket;
  userId: string;
  roles: string[];
  channels: string[];
}

const clients = new Map<string, WebSocketClient>();

serve(async (req) => {
  // Handle HTTP upgrade to WebSocket
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response(JSON.stringify({
      success: false,
      message: "WebSocket connection required",
      available_channels: [
        "/ws/alerts - Real-time alert notifications",
        "/ws/buzzer - Task buzzer notifications",
        "/ws/chat - Internal chat messages",
        "/ws/timer - Live timer updates",
        "/ws/demo-status - Demo uptime/downtime alerts"
      ]
    }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { socket, response } = Deno.upgradeWebSocket(req);
  const clientId = crypto.randomUUID();
  
  console.log(`[WS] New connection: ${clientId}`);

  socket.onopen = () => {
    console.log(`[WS] Socket opened: ${clientId}`);
    
    socket.send(JSON.stringify({
      type: 'connection',
      status: 'connected',
      client_id: clientId,
      message: 'Welcome to SOFTWARE VALA Realtime Hub',
      available_commands: [
        'auth: { token: "jwt_token" }',
        'subscribe: { channels: ["alerts", "buzzer", "chat", "timer"] }',
        'unsubscribe: { channels: ["alerts"] }',
        'ping: {}',
        'send_chat: { thread_id, message }',
        'timer_update: { task_id, action: "start"|"stop"|"pause" }',
        'acknowledge_alert: { alert_id }'
      ]
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`[WS] Message from ${clientId}:`, data.type || data);

      // Handle authentication
      if (data.type === 'auth' || data.auth) {
        const token = data.token || data.auth?.token;
        
        if (!token) {
          socket.send(JSON.stringify({
            type: 'error',
            code: 'AUTH_REQUIRED',
            message: 'Please provide authentication token'
          }));
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
          socket.send(JSON.stringify({
            type: 'error',
            code: 'AUTH_FAILED',
            message: 'Invalid or expired token'
          }));
          return;
        }

        // Get user roles
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        const userRoles = roles?.map(r => r.role) || [];

        // Store client
        clients.set(clientId, {
          socket,
          userId: user.id,
          roles: userRoles,
          channels: []
        });

        socket.send(JSON.stringify({
          type: 'auth_success',
          user_id: user.id,
          roles: userRoles,
          message: 'Authentication successful'
        }));

        // Update user online status
        await supabase
          .from('chat_user_status')
          .upsert({
            user_id: user.id,
            is_online: true,
            last_seen: new Date().toISOString()
          }, { onConflict: 'user_id' });

        return;
      }

      // Check if authenticated
      const client = clients.get(clientId);
      if (!client) {
        socket.send(JSON.stringify({
          type: 'error',
          code: 'NOT_AUTHENTICATED',
          message: 'Please authenticate first'
        }));
        return;
      }

      // Handle subscription
      if (data.type === 'subscribe') {
        const channels = data.channels || [];
        const validChannels = ['alerts', 'buzzer', 'chat', 'timer', 'demo-status', 'prime-support'];
        
        const subscribedChannels: string[] = [];
        
        for (const channel of channels) {
          if (!validChannels.includes(channel)) continue;

          // Role-based channel access
          if (channel === 'prime-support' && !client.roles.includes('prime')) {
            continue;
          }

          if (!client.channels.includes(channel)) {
            client.channels.push(channel);
            subscribedChannels.push(channel);
          }
        }

        socket.send(JSON.stringify({
          type: 'subscribed',
          channels: subscribedChannels,
          all_subscriptions: client.channels
        }));

        // Send initial data for subscribed channels
        if (subscribedChannels.includes('alerts')) {
          const { data: alerts } = await supabase
            .from('buzzer_queue')
            .select('*')
            .eq('status', 'pending')
            .in('role_target', client.roles)
            .limit(10);

          if (alerts?.length) {
            socket.send(JSON.stringify({
              type: 'initial_alerts',
              data: alerts
            }));
          }
        }

        return;
      }

      // Handle unsubscribe
      if (data.type === 'unsubscribe') {
        const channels = data.channels || [];
        client.channels = client.channels.filter(c => !channels.includes(c));

        socket.send(JSON.stringify({
          type: 'unsubscribed',
          channels: channels,
          remaining: client.channels
        }));
        return;
      }

      // Handle ping
      if (data.type === 'ping') {
        socket.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Handle chat message
      if (data.type === 'send_chat') {
        const { thread_id, message } = data;

        if (!thread_id || !message) {
          socket.send(JSON.stringify({
            type: 'error',
            code: 'INVALID_MESSAGE',
            message: 'Thread ID and message are required'
          }));
          return;
        }

        // Get masked identity
        const { data: identity } = await supabase
          .from('masked_identities')
          .select('masked_email')
          .eq('user_id', client.userId)
          .single();

        // Insert message
        const { data: chatMessage, error } = await supabase
          .from('internal_chat_messages')
          .insert({
            channel_id: thread_id,
            sender_id: client.userId,
            masked_sender_name: identity?.masked_email || 'Anonymous',
            content: message,
            cannot_edit: true,
            cannot_delete: true
          })
          .select()
          .single();

        if (error) {
          socket.send(JSON.stringify({
            type: 'error',
            code: 'CHAT_ERROR',
            message: 'Failed to send message'
          }));
          return;
        }

        // Broadcast to all clients in chat channel
        broadcastToChannel('chat', {
          type: 'new_message',
          thread_id,
          message: {
            id: chatMessage.id,
            sender: identity?.masked_email || 'Anonymous',
            content: message,
            timestamp: chatMessage.created_at
          }
        });

        socket.send(JSON.stringify({
          type: 'message_sent',
          message_id: chatMessage.id
        }));
        return;
      }

      // Handle timer update
      if (data.type === 'timer_update') {
        const { task_id, action } = data;

        if (!client.roles.includes('developer')) {
          socket.send(JSON.stringify({
            type: 'error',
            code: 'PERMISSION_DENIED',
            message: 'Only developers can update timers'
          }));
          return;
        }

        // Broadcast timer update
        broadcastToChannel('timer', {
          type: 'timer_event',
          task_id,
          action,
          developer_id: client.userId,
          timestamp: new Date().toISOString()
        });

        return;
      }

      // Handle alert acknowledgment
      if (data.type === 'acknowledge_alert') {
        const { alert_id } = data;

        await supabase
          .from('buzzer_queue')
          .update({
            status: 'accepted',
            accepted_at: new Date().toISOString(),
            accepted_by: client.userId
          })
          .eq('id', alert_id);

        // Broadcast alert update
        broadcastToChannel('alerts', {
          type: 'alert_acknowledged',
          alert_id,
          acknowledged_by: client.userId
        });

        socket.send(JSON.stringify({
          type: 'alert_acknowledged',
          alert_id
        }));
        return;
      }

      // Unknown command
      socket.send(JSON.stringify({
        type: 'error',
        code: 'UNKNOWN_COMMAND',
        message: `Unknown command: ${data.type}`
      }));

    } catch (error) {
      console.error(`[WS] Error processing message:`, error);
      socket.send(JSON.stringify({
        type: 'error',
        code: 'PARSE_ERROR',
        message: 'Invalid message format'
      }));
    }
  };

  socket.onclose = async () => {
    console.log(`[WS] Socket closed: ${clientId}`);
    
    const client = clients.get(clientId);
    if (client) {
      // Update offline status
      await supabase
        .from('chat_user_status')
        .update({
          is_online: false,
          last_seen: new Date().toISOString()
        })
        .eq('user_id', client.userId);

      clients.delete(clientId);
    }
  };

  socket.onerror = (error) => {
    console.error(`[WS] Socket error:`, error);
  };

  // Broadcast function
  function broadcastToChannel(channel: string, message: any) {
    clients.forEach((client) => {
      if (client.channels.includes(channel) && client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(JSON.stringify(message));
        } catch (error) {
          console.error(`[WS] Broadcast error:`, error);
        }
      }
    });
  }

  return response;
});
