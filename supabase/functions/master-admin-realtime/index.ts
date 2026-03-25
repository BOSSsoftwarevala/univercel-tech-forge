import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ═══════════════════════════════════════════════════════════════
// MASTER ADMIN REALTIME - WEBSOCKET FOR LIVE ACTIVITY
// ═══════════════════════════════════════════════════════════════

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  // Check for WebSocket upgrade
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response(JSON.stringify({
      error: "WebSocket connection required",
      usage: "Connect via WebSocket to receive live activity events"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Upgrade to WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  let authenticated = false;
  let userId: string | null = null;
  let userRole: string | null = null;
  let subscriptionChannel: any = null;
  
  console.log('[Master Realtime] New WebSocket connection');

  socket.onopen = () => {
    console.log('[Master Realtime] WebSocket opened');
    
    // Send welcome message
    socket.send(JSON.stringify({
      type: 'connection.established',
      message: 'Connected to Master Admin Realtime. Send auth token to authenticate.',
      timestamp: new Date().toISOString()
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('[Master Realtime] Received:', message.type);

      switch (message.type) {
        // ─────────────────────────────────────────────────────────
        // AUTHENTICATION
        // ─────────────────────────────────────────────────────────
        case 'auth.token':
          const token = message.token;
          
          if (!token) {
            socket.send(JSON.stringify({
              type: 'auth.error',
              error: 'Token required'
            }));
            return;
          }
          
          // Verify token
          const { data: { user }, error } = await supabase.auth.getUser(token);
          
          if (error || !user) {
            socket.send(JSON.stringify({
              type: 'auth.error',
              error: 'Invalid token'
            }));
            return;
          }
          
          // Get master user info
          const { data: masterUser } = await supabase
            .from('master_users')
            .select('*, master_roles(name, display_name)')
            .eq('auth_user_id', user.id)
            .single();
          
          authenticated = true;
          userId = masterUser?.id || user.id;
          userRole = masterUser?.master_roles?.name || 'unknown';
          
          console.log(`[Master Realtime] User authenticated: ${userId} (${userRole})`);
          
          // Log to blackbox
          await supabase.rpc('log_to_blackbox', {
            p_event_type: 'login',
            p_module_name: 'realtime',
            p_user_id: userId,
            p_role_name: userRole,
            p_metadata: { connection: 'websocket' }
          });
          
          socket.send(JSON.stringify({
            type: 'auth.success',
            user: {
              id: userId,
              role: userRole
            },
            timestamp: new Date().toISOString()
          }));
          
          // Start live activity subscription
          subscriptionChannel = supabase
            .channel('master_live_activity')
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'master_live_activity'
              },
              (payload) => {
                console.log('[Master Realtime] Live activity event:', payload.new.action_name);
                
                socket.send(JSON.stringify({
                  type: 'live_activity.event',
                  data: payload.new,
                  timestamp: new Date().toISOString()
                }));
              }
            )
            .subscribe();
          
          // Also subscribe to system locks
          supabase
            .channel('master_system_locks')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'master_system_locks'
              },
              (payload) => {
                const eventType = payload.eventType;
                const newData = payload.new as Record<string, unknown>;
                const isActive = newData?.is_active;
                
                socket.send(JSON.stringify({
                  type: 'system_lock.update',
                  event: eventType,
                  data: payload.new,
                  is_locked: isActive,
                  timestamp: new Date().toISOString()
                }));
              }
            )
            .subscribe();
          
          // Subscribe to approvals
          supabase
            .channel('master_approvals')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'master_approvals'
              },
              (payload) => {
                socket.send(JSON.stringify({
                  type: 'approval.update',
                  event: payload.eventType,
                  data: payload.new,
                  timestamp: new Date().toISOString()
                }));
              }
            )
            .subscribe();
          
          // Subscribe to security events
          supabase
            .channel('master_security_events')
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'master_security_events'
              },
              (payload) => {
                socket.send(JSON.stringify({
                  type: 'security_alert.new',
                  data: payload.new,
                  severity: payload.new.severity,
                  timestamp: new Date().toISOString()
                }));
              }
            )
            .subscribe();
          
          // Subscribe to AI alerts
          supabase
            .channel('master_ai_alerts')
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'master_ai_alerts'
              },
              (payload) => {
                socket.send(JSON.stringify({
                  type: 'ai_alert.new',
                  data: payload.new,
                  severity: payload.new.severity,
                  timestamp: new Date().toISOString()
                }));
              }
            )
            .subscribe();
          
          break;

        // ─────────────────────────────────────────────────────────
        // PING/PONG (Keep alive)
        // ─────────────────────────────────────────────────────────
        case 'ping':
          socket.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
          break;

        // ─────────────────────────────────────────────────────────
        // SUBSCRIBE TO SPECIFIC MODULE
        // ─────────────────────────────────────────────────────────
        case 'subscribe.module':
          if (!authenticated) {
            socket.send(JSON.stringify({
              type: 'error',
              error: 'Not authenticated'
            }));
            return;
          }
          
          const moduleName = message.module;
          console.log(`[Master Realtime] User subscribed to module: ${moduleName}`);
          
          socket.send(JSON.stringify({
            type: 'subscribe.success',
            module: moduleName,
            timestamp: new Date().toISOString()
          }));
          break;

        // ─────────────────────────────────────────────────────────
        // GET RECENT ACTIVITY
        // ─────────────────────────────────────────────────────────
        case 'get.recent_activity':
          if (!authenticated) {
            socket.send(JSON.stringify({
              type: 'error',
              error: 'Not authenticated'
            }));
            return;
          }
          
          const limit = message.limit || 20;
          const module = message.module;
          
          let query = supabase
            .from('master_live_activity')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
          
          if (module) {
            query = query.eq('source_module', module);
          }
          
          const { data: recentActivity } = await query;
          
          socket.send(JSON.stringify({
            type: 'recent_activity.data',
            data: recentActivity || [],
            timestamp: new Date().toISOString()
          }));
          break;

        // ─────────────────────────────────────────────────────────
        // GET SYSTEM STATUS
        // ─────────────────────────────────────────────────────────
        case 'get.system_status':
          if (!authenticated) {
            socket.send(JSON.stringify({
              type: 'error',
              error: 'Not authenticated'
            }));
            return;
          }
          
          // Check system lock
          const { data: activeLocks } = await supabase
            .from('master_system_locks')
            .select('*')
            .eq('is_active', true);
          
          // Get pending approvals count
          const { count: pendingApprovals } = await supabase
            .from('master_approvals')
            .select('*', { count: 'exact', head: true })
            .in('status', ['pending', 'in_review']);
          
          // Get unresolved security events
          const { count: unresolvedSecurity } = await supabase
            .from('master_security_events')
            .select('*', { count: 'exact', head: true })
            .eq('is_resolved', false);
          
          // Get active AI alerts
          const { count: activeAlerts } = await supabase
            .from('master_ai_alerts')
            .select('*', { count: 'exact', head: true })
            .eq('is_resolved', false);
          
          socket.send(JSON.stringify({
            type: 'system_status.data',
            data: {
              is_locked: (activeLocks?.length || 0) > 0,
              active_locks: activeLocks || [],
              pending_approvals: pendingApprovals || 0,
              unresolved_security_events: unresolvedSecurity || 0,
              active_ai_alerts: activeAlerts || 0
            },
            timestamp: new Date().toISOString()
          }));
          break;

        // ─────────────────────────────────────────────────────────
        // BROADCAST MESSAGE (Admin only)
        // ─────────────────────────────────────────────────────────
        case 'broadcast.message':
          if (!authenticated || !['master', 'super_admin'].includes(userRole || '')) {
            socket.send(JSON.stringify({
              type: 'error',
              error: 'Unauthorized'
            }));
            return;
          }
          
          // Log broadcast to live activity
          await supabase
            .from('master_live_activity')
            .insert({
              source_module: 'broadcast',
              action_name: 'admin_broadcast',
              action_description: message.message,
              user_id: userId,
              user_role: userRole,
              severity: message.severity || 'medium',
              payload: { message: message.message, from: userRole }
            });
          
          socket.send(JSON.stringify({
            type: 'broadcast.sent',
            timestamp: new Date().toISOString()
          }));
          break;

        default:
          socket.send(JSON.stringify({
            type: 'error',
            error: `Unknown message type: ${message.type}`
          }));
      }
    } catch (error) {
      console.error('[Master Realtime] Message error:', error);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Failed to process message'
      }));
    }
  };

  socket.onerror = (error) => {
    console.error('[Master Realtime] WebSocket error:', error);
  };

  socket.onclose = async () => {
    console.log('[Master Realtime] WebSocket closed');
    
    // Cleanup subscriptions
    if (subscriptionChannel) {
      await supabase.removeChannel(subscriptionChannel);
    }
    
    // Log disconnect
    if (authenticated && userId) {
      await supabase.rpc('log_to_blackbox', {
        p_event_type: 'logout',
        p_module_name: 'realtime',
        p_user_id: userId,
        p_role_name: userRole,
        p_metadata: { connection: 'websocket', reason: 'closed' }
      });
    }
  };

  return response;
});
