import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Store active WebSocket connections by session
const sessionConnections = new Map<string, { user?: WebSocket; agent?: WebSocket }>();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  // Handle non-WebSocket requests (session info endpoint)
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response(JSON.stringify({ 
      error: "Expected WebSocket connection",
      hint: "Connect via wss:// for real-time support" 
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Extract session ID and role from URL
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const role = url.searchParams.get('role'); // 'user' or 'agent'
    const token = url.searchParams.get('token');

    if (!sessionId || !role || !token) {
      return new Response(JSON.stringify({ error: "Missing session_id, role, or token" }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify token with Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify session exists and user is a participant
    const { data: session, error: sessionError } = await supabase
      .from('remote_assist_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return new Response(JSON.stringify({ error: "Session not found" }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate role matches session participant
    if (role === 'user' && session.user_id !== user.id) {
      console.error('User mismatch');
      return new Response(JSON.stringify({ error: "Access denied" }), { 
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (role === 'agent' && session.support_agent_id !== user.id) {
      console.error('Agent mismatch');
      return new Response(JSON.stringify({ error: "Access denied" }), { 
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Upgrade to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);

    // Initialize session connections if not exists
    if (!sessionConnections.has(sessionId)) {
      sessionConnections.set(sessionId, {});
    }

    const connections = sessionConnections.get(sessionId)!;

    socket.onopen = () => {
      console.log(`WebSocket opened for session ${sessionId}, role: ${role}`);
      
      // Store connection
      if (role === 'user') {
        connections.user = socket;
      } else {
        connections.agent = socket;
      }

      // Notify the other party
      const otherSocket = role === 'user' ? connections.agent : connections.user;
      if (otherSocket && otherSocket.readyState === WebSocket.OPEN) {
        otherSocket.send(JSON.stringify({
          type: 'peer_connected',
          role: role,
          timestamp: Date.now()
        }));
      }

      // Send connection confirmation
      socket.send(JSON.stringify({
        type: 'connected',
        session_id: sessionId,
        role: role,
        watermark: session.agent_watermark_text,
        max_duration_minutes: session.max_duration_minutes,
        timestamp: Date.now()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(`Message from ${role}:`, message.type);

        // Add sender info
        message.sender = role;
        message.timestamp = Date.now();

        // Handle different message types
        switch (message.type) {
          case 'screen_data':
            // Forward screen data from user to agent (view only)
            if (role === 'user' && connections.agent?.readyState === WebSocket.OPEN) {
              connections.agent.send(JSON.stringify(message));
            }
            break;

          case 'cursor_highlight':
            // Forward guided cursor from agent to user
            if (role === 'agent' && connections.user?.readyState === WebSocket.OPEN) {
              connections.user.send(JSON.stringify(message));
              
              // Log event for recording
              await supabase.from('remote_assist_events').insert({
                session_id: sessionId,
                event_type: 'cursor_highlight',
                event_data: { x: message.x, y: message.y, highlight_type: message.highlight_type },
                actor_type: 'agent'
              });
            }
            break;

          case 'chat':
            // Forward chat messages both ways
            const otherSocket = role === 'user' ? connections.agent : connections.user;
            if (otherSocket?.readyState === WebSocket.OPEN) {
              otherSocket.send(JSON.stringify(message));
            }
            
            // Log chat for recording
            await supabase.from('remote_assist_events').insert({
              session_id: sessionId,
              event_type: 'chat',
              event_data: { message: message.content, masked: true },
              actor_type: role
            });
            break;

          case 'end_session':
            // End session from either party
            await supabase.rpc('end_remote_assist_session', {
              p_session_id: sessionId,
              p_reason: message.reason || `Session ended by ${role}`
            });

            // Notify both parties
            const endMessage = JSON.stringify({
              type: 'session_ended',
              reason: message.reason || `Session ended by ${role}`,
              timestamp: Date.now()
            });

            if (connections.user?.readyState === WebSocket.OPEN) {
              connections.user.send(endMessage);
              connections.user.close();
            }
            if (connections.agent?.readyState === WebSocket.OPEN) {
              connections.agent.send(endMessage);
              connections.agent.close();
            }

            sessionConnections.delete(sessionId);
            break;

          case 'ping':
            socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;

          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    };

    socket.onclose = () => {
      console.log(`WebSocket closed for session ${sessionId}, role: ${role}`);
      
      // Remove from connections
      if (role === 'user') {
        connections.user = undefined;
      } else {
        connections.agent = undefined;
      }

      // Notify other party
      const otherSocket = role === 'user' ? connections.agent : connections.user;
      if (otherSocket && otherSocket.readyState === WebSocket.OPEN) {
        otherSocket.send(JSON.stringify({
          type: 'peer_disconnected',
          role: role,
          timestamp: Date.now()
        }));
      }

      // Cleanup if both disconnected
      if (!connections.user && !connections.agent) {
        sessionConnections.delete(sessionId);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return response;

  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
