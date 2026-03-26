/**
 * Real-time WebSocket System - Complete Implementation
 * Live updates across all 37+ role dashboards
 * Event-based communication with Supabase Realtime
 * Channel management, message handling, and user presence
 * React hook and provider for easy integration
 */

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { useSaaSGlobalStore, type User, type Notification } from '@/stores/saasGlobalStore';

// ============= WEBSOCKET CONFIGURATION =============
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============= WEBSOCKET EVENT TYPES =============
export enum WebSocketEventType {
  // User events
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  USER_STATUS_CHANGED = 'user_status_changed',
  
  // Data events
  LEAD_CREATED = 'lead_created',
  LEAD_UPDATED = 'lead_updated',
  LEAD_CONVERTED = 'lead_converted',
  
  SALE_CREATED = 'sale_created',
  SALE_UPDATED = 'sale_updated',
  SALE_COMPLETED = 'sale_completed',
  
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  
  LICENSE_ACTIVATED = 'license_activated',
  LICENSE_EXPIRED = 'license_expired',
  
  TICKET_CREATED = 'ticket_created',
  TICKET_UPDATED = 'ticket_updated',
  TICKET_RESOLVED = 'ticket_resolved',
  
  // System events
  NOTIFICATION_CREATED = 'notification_created',
  SYSTEM_ALERT = 'system_alert',
  PIPELINE_EVENT = 'pipeline_event',
  
  // Analytics events
  METRIC_UPDATED = 'metric_updated',
  DASHBOARD_VIEWED = 'dashboard_viewed',
  
  // Presence events
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  TYPING_STARTED = 'typing_started',
  TYPING_STOPPED = 'typing_stopped',
}

// ============= WEBSOCKET MESSAGE INTERFACE =============
export interface WebSocketMessage {
  id: string;
  type: WebSocketEventType;
  data: any;
  metadata: {
    userId?: string;
    userRole?: string;
    timestamp: string;
    channel: string;
    source: string;
  };
  recipients?: string[]; // User IDs or roles
}

// ============= WEBSOCKET CHANNEL CONFIGURATION =============
export interface ChannelConfig {
  name: string;
  table?: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
}

// ============= WEBSOCKET STATUS =============
export enum WebSocketStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

// ============= WEBSOCKET MANAGER =============
export class WebSocketManager {
  private static instance: WebSocketManager;
  private supabase: SupabaseClient;
  private channels: Map<string, RealtimeChannel> = new Map();
  private eventListeners: Map<WebSocketEventType, Set<(message: WebSocketMessage) => void>> = new Map();
  private status: WebSocketStatus = WebSocketStatus.DISCONNECTED;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval?: NodeJS.Timeout;

  private constructor() {
    this.supabase = supabase;
    this.initializeEventListeners();
  }

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  // ============= CONNECTION MANAGEMENT =============
  async connect(): Promise<void> {
    try {
      this.setStatus(WebSocketStatus.CONNECTING);
      
      // Initialize Supabase realtime connection
      const { error } = await this.supabase.realtime.connect();
      
      if (error) {
        throw error;
      }

      this.setStatus(WebSocketStatus.CONNECTED);
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      
      console.log('🔌 WebSocket connected successfully');
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.setStatus(WebSocketStatus.ERROR);
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    
    // Unsubscribe from all channels
    this.channels.forEach(channel => {
      this.supabase.removeChannel(channel);
    });
    this.channels.clear();
    
    this.setStatus(WebSocketStatus.DISCONNECTED);
    console.log('🔌 WebSocket disconnected');
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // ============= CHANNEL MANAGEMENT =============
  subscribe(config: ChannelConfig): RealtimeChannel {
    const channelName = config.name;
    
    // Check if channel already exists
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    let channel: RealtimeChannel;

    if (config.table) {
      // Subscribe to database changes
      channel = this.supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: config.event || '*',
            schema: config.schema || 'public',
            table: config.table,
            filter: config.filter,
          },
          (payload) => this.handleDatabaseChange(payload, config)
        );
    } else {
      // Subscribe to broadcast channel
      channel = this.supabase.channel(channelName);
    }

    // Subscribe to presence events
    channel.on('presence', { event: 'sync' }, () => this.handlePresenceSync(channelName));
    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => 
      this.handlePresenceJoin(channelName, key, newPresences)
    );
    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => 
      this.handlePresenceLeave(channelName, key, leftPresences)
    );

    // Subscribe to broadcast events
    channel.on('broadcast', { event: '*' }, ({ event, payload }) => 
      this.handleBroadcast(channelName, event, payload)
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log(`📡 Channel ${channelName} status:`, status);
      
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to channel: ${channelName}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`❌ Channel error: ${channelName}`);
      }
    });

    this.channels.set(channelName, channel);
    return channel;
  }

  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      this.supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`📡 Unsubscribed from channel: ${channelName}`);
    }
  }

  // ============= MESSAGE HANDLING =============
  private handleDatabaseChange(payload: any, config: ChannelConfig): void {
    const eventType = this.mapDatabaseEventToWebSocketEvent(payload.eventType, config.table!);
    const message: WebSocketMessage = {
      id: payload.id || `db_${Date.now()}_${Math.random()}`,
      type: eventType,
      data: payload.new || payload.old || payload,
      metadata: {
        timestamp: new Date().toISOString(),
        channel: config.name,
        source: 'database',
        userId: payload.new?.user_id || payload.old?.user_id,
      },
    };

    this.dispatchMessage(message);
  }

  private handleBroadcast(channelName: string, event: string, payload: any): void {
    const message: WebSocketMessage = {
      id: payload.id || `broadcast_${Date.now()}_${Math.random()}`,
      type: event as WebSocketEventType,
      data: payload.data,
      metadata: {
        timestamp: new Date().toISOString(),
        channel: channelName,
        source: 'broadcast',
        userId: payload.userId,
        userRole: payload.userRole,
      },
      recipients: payload.recipients,
    };

    this.dispatchMessage(message);
  }

  private handlePresenceSync(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      const presenceState = channel.presenceState();
      console.log(`👥 Presence sync for ${channelName}:`, presenceState);
      
      // Dispatch presence sync event
      const message: WebSocketMessage = {
        id: `presence_sync_${Date.now()}`,
        type: WebSocketEventType.USER_JOINED,
        data: { presenceState },
        metadata: {
          timestamp: new Date().toISOString(),
          channel: channelName,
          source: 'presence',
        },
      };
      
      this.dispatchMessage(message);
    }
  }

  private handlePresenceJoin(channelName: string, key: string, newPresences: any[]): void {
    newPresences.forEach(presence => {
      const message: WebSocketMessage = {
        id: `presence_join_${Date.now()}_${Math.random()}`,
        type: WebSocketEventType.USER_JOINED,
        data: { key, presence },
        metadata: {
          timestamp: new Date().toISOString(),
          channel: channelName,
          source: 'presence',
        },
      };
      
      this.dispatchMessage(message);
    });
  }

  private handlePresenceLeave(channelName: string, key: string, leftPresences: any[]): void {
    leftPresences.forEach(presence => {
      const message: WebSocketMessage = {
        id: `presence_leave_${Date.now()}_${Math.random()}`,
        type: WebSocketEventType.USER_LEFT,
        data: { key, presence },
        metadata: {
          timestamp: new Date().toISOString(),
          channel: channelName,
          source: 'presence',
        },
      };
      
      this.dispatchMessage(message);
    });
  }

  private mapDatabaseEventToWebSocketEvent(dbEvent: string, table: string): WebSocketEventType {
    const eventMap: Record<string, Record<string, WebSocketEventType>> = {
      leads: {
        INSERT: WebSocketEventType.LEAD_CREATED,
        UPDATE: WebSocketEventType.LEAD_UPDATED,
        DELETE: WebSocketEventType.LEAD_UPDATED,
      },
      sales: {
        INSERT: WebSocketEventType.SALE_CREATED,
        UPDATE: WebSocketEventType.SALE_UPDATED,
        DELETE: WebSocketEventType.SALE_UPDATED,
      },
      payments: {
        INSERT: WebSocketEventType.PAYMENT_RECEIVED,
        UPDATE: WebSocketEventType.PAYMENT_FAILED,
        DELETE: WebSocketEventType.PAYMENT_FAILED,
      },
      licenses: {
        INSERT: WebSocketEventType.LICENSE_ACTIVATED,
        UPDATE: WebSocketEventType.LICENSE_EXPIRED,
        DELETE: WebSocketEventType.LICENSE_EXPIRED,
      },
      support_tickets: {
        INSERT: WebSocketEventType.TICKET_CREATED,
        UPDATE: WebSocketEventType.TICKET_UPDATED,
        DELETE: WebSocketEventType.TICKET_RESOLVED,
      },
      notifications: {
        INSERT: WebSocketEventType.NOTIFICATION_CREATED,
        UPDATE: WebSocketEventType.NOTIFICATION_CREATED,
        DELETE: WebSocketEventType.NOTIFICATION_CREATED,
      },
    };

    return eventMap[table]?.[dbEvent] || WebSocketEventType.SYSTEM_ALERT;
  }

  // ============= EVENT LISTENERS =============
  private initializeEventListeners(): void {
    // Initialize event listener map
    Object.values(WebSocketEventType).forEach(eventType => {
      this.eventListeners.set(eventType, new Set());
    });
  }

  addEventListener(eventType: WebSocketEventType, callback: (message: WebSocketMessage) => void): () => void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.add(callback);
    }

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  removeEventListener(eventType: WebSocketEventType, callback: (message: WebSocketMessage) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private dispatchMessage(message: WebSocketMessage): void {
    const listeners = this.eventListeners.get(message.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in WebSocket event listener:', error);
        }
      });
    }
  }

  // ============= BROADCASTING =============
  async broadcast(channelName: string, event: string, data: any, options?: {
    recipients?: string[];
    userId?: string;
    userRole?: string;
  }): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      console.error(`Channel ${channelName} not found`);
      return;
    }

    const payload = {
      id: `broadcast_${Date.now()}_${Math.random()}`,
      data,
      recipients: options?.recipients,
      userId: options?.userId,
      userRole: options?.userRole,
    };

    await channel.send({
      type: 'broadcast',
      event,
      payload,
    });
  }

  // ============= PRESENCE =============
  async trackPresence(channelName: string, presence: any): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      console.error(`Channel ${channelName} not found`);
      return;
    }

    await channel.track(presence);
  }

  async untrackPresence(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      console.error(`Channel ${channelName} not found`);
      return;
    }

    await channel.untrack();
  }

  getPresenceState(channelName: string): any {
    const channel = this.channels.get(channelName);
    return channel?.presenceState() || {};
  }

  // ============= STATUS MANAGEMENT =============
  private setStatus(status: WebSocketStatus): void {
    this.status = status;
    console.log(`🔌 WebSocket status: ${status}`);
  }

  getStatus(): WebSocketStatus {
    return this.status;
  }

  isConnected(): boolean {
    return this.status === WebSocketStatus.CONNECTED;
  }

  // ============= HEARTBEAT =============
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        // Send heartbeat to maintain connection
        this.broadcast('heartbeat', 'ping', { timestamp: Date.now() });
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  // ============= UTILITY METHODS =============
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  getChannelCount(): number {
    return this.channels.size;
  }
}

// ============= REACT HOOK =============
export const useWebSocket = () => {
  const wsManager = WebSocketManager.getInstance();
  const store = useSaaSGlobalStore();

  // Connect on mount
  React.useEffect(() => {
    wsManager.connect();
    
    return () => {
      wsManager.disconnect();
    };
  }, []);

  // Subscribe to user-specific channels based on role
  React.useEffect(() => {
    const { currentUser, activeRole } = store;
    
    if (currentUser && activeRole) {
      // Subscribe to user-specific notifications
      const notificationChannel = wsManager.subscribe({
        name: `user_${currentUser.id}`,
        table: 'notifications',
        filter: `user_id=eq.${currentUser.id}`,
        event: 'INSERT',
      });

      // Subscribe to role-specific updates
      const roleChannel = wsManager.subscribe({
        name: `role_${activeRole}`,
        table: 'users',
        filter: `role=eq.${activeRole}`,
        event: 'UPDATE',
      });

      // Subscribe to pipeline events
      const pipelineChannel = wsManager.subscribe({
        name: 'pipeline_events',
        table: 'pipeline_events',
        event: 'INSERT',
      });

      // Subscribe to presence in role channel
      wsManager.trackPresence(`role_${activeRole}`, {
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: activeRole,
        status: 'online',
        lastSeen: new Date().toISOString(),
      });

      return () => {
        wsManager.unsubscribe(`user_${currentUser.id}`);
        wsManager.unsubscribe(`role_${activeRole}`);
        wsManager.unsubscribe('pipeline_events');
        wsManager.untrackPresence(`role_${activeRole}`);
      };
    }
  }, [store.currentUser, store.activeRole]);

  return {
    // Connection status
    status: wsManager.getStatus(),
    isConnected: wsManager.isConnected(),
    
    // Channel management
    subscribe: wsManager.subscribe.bind(wsManager),
    unsubscribe: wsManager.unsubscribe.bind(wsManager),
    
    // Broadcasting
    broadcast: wsManager.broadcast.bind(wsManager),
    
    // Presence
    trackPresence: wsManager.trackPresence.bind(wsManager),
    untrackPresence: wsManager.untrackPresence.bind(wsManager),
    getPresenceState: wsManager.getPresenceState.bind(wsManager),
    
    // Event listeners
    addEventListener: wsManager.addEventListener.bind(wsManager),
    removeEventListener: wsManager.removeEventListener.bind(wsManager),
    
    // Utility
    getActiveChannels: wsManager.getActiveChannels.bind(wsManager),
    getChannelCount: wsManager.getChannelCount.bind(wsManager),
  };
};

// ============= NOTIFICATION HOOK =============
export const useRealtimeNotifications = () => {
  const wsManager = WebSocketManager.getInstance();
  const store = useSaaSGlobalStore();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    // Listen for new notifications
    const unsubscribe = wsManager.addEventListener(
      WebSocketEventType.NOTIFICATION_CREATED,
      (message) => {
        const notification = message.data as Notification;
        
        // Add to local state
        setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
        
        // Add to global store
        store.addNotification(notification);
        
        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
          });
        }
      }
    );

    return unsubscribe;
  }, [store]);

  const markAsRead = React.useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    markAsRead,
    clearAll,
    unreadCount: notifications.filter(n => !n.isRead).length,
  };
};

// ============= PRESENCE HOOK =============
export const useRealtimePresence = (channelName: string) => {
  const wsManager = WebSocketManager.getInstance();
  const [presence, setPresence] = React.useState<any>({});
  const [onlineUsers, setOnlineUsers] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Listen for presence events
    const unsubscribeJoin = wsManager.addEventListener(
      WebSocketEventType.USER_JOINED,
      (message) => {
        if (message.metadata.channel === channelName) {
          setOnlineUsers(prev => [...prev, ...message.data.newPresences]);
        }
      }
    );

    const unsubscribeLeave = wsManager.addEventListener(
      WebSocketEventType.USER_LEFT,
      (message) => {
        if (message.metadata.channel === channelName) {
          setOnlineUsers(prev => 
            prev.filter(user => 
              !message.data.leftPresences.some((left: any) => left.presence_ref === user.presence_ref)
            )
          );
        }
      }
    );

    // Get initial presence state
    const initialPresence = wsManager.getPresenceState(channelName);
    setPresence(initialPresence);
    setOnlineUsers(Object.values(initialPresence).flat());

    return () => {
      unsubscribeJoin();
      unsubscribeLeave();
    };
  }, [channelName, wsManager]);

  const trackUser = React.useCallback((userPresence: any) => {
    wsManager.trackPresence(channelName, userPresence);
  }, [channelName, wsManager]);

  const untrackUser = React.useCallback(() => {
    wsManager.untrackPresence(channelName);
  }, [channelName, wsManager]);

  return {
    presence,
    onlineUsers,
    onlineCount: onlineUsers.length,
    trackUser,
    untrackUser,
  };
};

// ============= PIPELINE EVENTS HOOK =============
export const useRealtimePipeline = () => {
  const wsManager = WebSocketManager.getInstance();
  const store = useSaaSGlobalStore();
  const [pipelineEvents, setPipelineEvents] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Listen for pipeline events
    const unsubscribe = wsManager.addEventListener(
      WebSocketEventType.PIPELINE_EVENT,
      (message) => {
        const event = message.data;
        
        // Add to local state
        setPipelineEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100
        
        // Update global store real-time metrics
        store.updateRealTimeMetrics({
          newLeads: event.stage === 'lead' && event.type === 'created' ? 1 : 0,
          newSales: event.stage === 'sales' && event.type === 'created' ? 1 : 0,
          newPayments: event.stage === 'payment' && event.type === 'created' ? 1 : 0,
          newTickets: event.stage === 'support' && event.type === 'created' ? 1 : 0,
        });
      }
    );

    return unsubscribe;
  }, [store]);

  const clearEvents = React.useCallback(() => {
    setPipelineEvents([]);
  }, []);

  return {
    pipelineEvents,
    clearEvents,
    eventCount: pipelineEvents.length,
  };
};

// ============= EXPORTS =============
export const webSocketManager = WebSocketManager.getInstance();

export default {
  useWebSocket,
  useRealtimeNotifications,
  useRealtimePresence,
  useRealtimePipeline,
  webSocketManager,
  WebSocketEventType,
  WebSocketStatus,
};
