/**
 * Real-time WebSocket System - Live Updates Across Dashboards
 * WebSocket / Socket.io implementation for real-time sync
 * Live updates: leads, sales, notifications, analytics, pipeline events
 */

import { supabase } from '@/integrations/supabase/client';
import { useUnifiedSaaSStore } from '@/stores/unifiedSaaSStore';
import { useJWTAuth } from '@/auth/jwtAuthSystem';

// ============= WEBSOCKET EVENT TYPES =============
export enum WebSocketEventType {
  // Pipeline events
  LEAD_CREATED = 'lead_created',
  LEAD_UPDATED = 'lead_updated',
  LEAD_CONVERTED = 'lead_converted',
  SALE_CREATED = 'sale_created',
  SALE_UPDATED = 'sale_updated',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  LICENSE_CREATED = 'license_created',
  LICENSE_ACTIVATED = 'license_activated',
  USAGE_UPDATED = 'usage_updated',
  TICKET_CREATED = 'ticket_created',
  TICKET_UPDATED = 'ticket_updated',
  
  // System events
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  NOTIFICATION_CREATED = 'notification_created',
  NOTIFICATION_READ = 'notification_read',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  
  // Analytics events
  METRIC_UPDATED = 'metric_updated',
  DASHBOARD_REFRESH = 'dashboard_refresh',
  REPORT_GENERATED = 'report_generated',
  
  // Collaboration events
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMPLETED = 'task_completed',
  COMMENT_ADDED = 'comment_added',
  FILE_UPLOADED = 'file_uploaded',
  
  // Security events
  LOGIN_ATTEMPT = 'login_attempt',
  SECURITY_ALERT = 'security_alert',
  PERMISSION_CHANGED = 'permission_changed',
}

export interface WebSocketMessage {
  type: WebSocketEventType;
  payload: any;
  timestamp: string;
  userId?: string;
  channelId?: string;
  metadata?: Record<string, any>;
}

export interface WebSocketChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'presence';
  userIds?: string[];
  metadata?: Record<string, any>;
}

// ============= WEBSOCKET CLIENT CLASS =============
export class WebSocketSystem {
  private static instance: WebSocketSystem;
  private supabaseChannel: any = null;
  private channels: Map<string, WebSocketChannel> = new Map();
  private eventHandlers: Map<WebSocketEventType, Set<(message: WebSocketMessage) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.initializeEventHandlers();
  }

  static getInstance(): WebSocketSystem {
    if (!WebSocketSystem.instance) {
      WebSocketSystem.instance = new WebSocketSystem();
    }
    return WebSocketSystem.instance;
  }

  // ============= CONNECTION MANAGEMENT =============
  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.establishConnection();
    return this.connectionPromise;
  }

  private async establishConnection(): Promise<void> {
    try {
      const { user } = useJWTAuth.getState();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create Supabase realtime channel
      this.supabaseChannel = supabase
        .channel(`user_${user.id}`)
        .on('broadcast', { event: 'message' }, (payload: any) => {
          this.handleMessage(payload.payload);
        })
        .on('presence', { event: 'sync' }, () => {
          this.handlePresenceSync();
        })
        .subscribe((status) => {
          console.log('WebSocket connection status:', status);
          
          if (status === 'SUBSCRIBED') {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.emitEvent('connection_established', { userId: user.id });
          } else if (status === 'CHANNEL_ERROR') {
            this.handleConnectionError();
          }
        });

      // Join default channels
      await this.joinDefaultChannels(user);
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleConnectionError();
    }
  }

  disconnect(): void {
    if (this.supabaseChannel) {
      supabase.removeChannel(this.supabaseChannel);
      this.supabaseChannel = null;
    }
    
    this.isConnected = false;
    this.connectionPromise = null;
  }

  private async handleConnectionError(): void {
    this.isConnected = false;
    this.connectionPromise = null;
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emitEvent('connection_failed', { attempts: this.reconnectAttempts });
    }
  }

  // ============= CHANNEL MANAGEMENT =============
  async joinChannel(channelId: string, channelType: 'public' | 'private' | 'presence' = 'public'): Promise<void> {
    try {
      const { user } = useJWTAuth.getState();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const channel: WebSocketChannel = {
        id: channelId,
        name: channelId,
        type: channelType,
        userIds: channelType === 'private' ? [user.id] : undefined,
      };

      this.channels.set(channelId, channel);

      // Join Supabase channel
      const supabaseChannel = supabase.channel(channelId);
      
      if (channelType === 'presence') {
        supabaseChannel.on('presence', { event: 'sync' }, () => {
          this.handlePresenceSync();
        });
      }
      
      supabaseChannel.on('broadcast', { event: 'message' }, (payload: any) => {
        this.handleMessage(payload.payload);
      });

      await supabaseChannel.subscribe();
      
      console.log(`Joined channel: ${channelId}`);
    } catch (error) {
      console.error(`Failed to join channel ${channelId}:`, error);
    }
  }

  async leaveChannel(channelId: string): Promise<void> {
    try {
      const channel = this.channels.get(channelId);
      
      if (channel) {
        await supabase.removeChannel(supabase.channel(channelId));
        this.channels.delete(channelId);
        console.log(`Left channel: ${channelId}`);
      }
    } catch (error) {
      console.error(`Failed to leave channel ${channelId}:`, error);
    }
  }

  private async joinDefaultChannels(user: any): Promise<void> {
    const channels = [
      { id: `role_${user.role}`, type: 'private' as const },
      { id: 'global_announcements', type: 'public' as const },
      { id: 'pipeline_events', type: 'public' as const },
      { id: `user_${user.id}`, type: 'presence' as const },
    ];

    // Join role-specific channels
    for (const channel of channels) {
      await this.joinChannel(channel.id, channel.type);
    }

    // Join franchise/reseller channels if applicable
    if (user.metadata?.franchiseId) {
      await this.joinChannel(`franchise_${user.metadata.franchiseId}`, 'private');
    }
    
    if (user.metadata?.resellerId) {
      await this.joinChannel(`reseller_${user.metadata.resellerId}`, 'private');
    }
  }

  // ============= MESSAGE HANDLING =============
  private handleMessage(payload: WebSocketMessage): void {
    try {
      console.log('Received WebSocket message:', payload);
      
      // Update global store based on message type
      this.updateStoreFromMessage(payload);
      
      // Trigger event handlers
      this.emitEvent(payload.type, payload);
      
      // Handle specific message types
      this.handleSpecificMessageTypes(payload);
      
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  private updateStoreFromMessage(message: WebSocketMessage): void {
    const store = useUnifiedSaaSStore.getState();
    
    switch (message.type) {
      case WebSocketEventType.LEAD_CREATED:
        if (message.payload) {
          store.addLead(message.payload);
        }
        break;
        
      case WebSocketEventType.LEAD_UPDATED:
        if (message.payload && message.payload.id) {
          store.updateLead(message.payload.id, message.payload);
        }
        break;
        
      case WebSocketEventType.SALE_CREATED:
        if (message.payload) {
          store.addSale(message.payload);
        }
        break;
        
      case WebSocketEventType.SALE_UPDATED:
        if (message.payload && message.payload.id) {
          store.updateSale(message.payload.id, message.payload);
        }
        break;
        
      case WebSocketEventType.PAYMENT_COMPLETED:
        if (message.payload) {
          store.addPayment(message.payload);
        }
        break;
        
      case WebSocketEventType.LICENSE_CREATED:
        if (message.payload) {
          store.addLicense(message.payload);
        }
        break;
        
      case WebSocketEventType.TICKET_CREATED:
        if (message.payload) {
          store.addSupportTicket(message.payload);
        }
        break;
        
      case WebSocketEventType.NOTIFICATION_CREATED:
        if (message.payload) {
          store.addNotification(message.payload);
        }
        break;
        
      case WebSocketEventType.METRIC_UPDATED:
        if (message.payload) {
          store.updateRealTimeMetrics({
            newLeads: message.payload.newLeads || 0,
            newSales: message.payload.newSales || 0,
            newPayments: message.payload.newPayments || 0,
            newTickets: message.payload.newTickets || 0,
          });
        }
        break;
    }
  }

  private handleSpecificMessageTypes(message: WebSocketMessage): void {
    const { user } = useJWTAuth.getState();
    
    switch (message.type) {
      case WebSocketEventType.SYSTEM_ANNOUNCEMENT:
        // Show system announcement
        this.showSystemAnnouncement(message.payload);
        break;
        
      case WebSocketEventType.SECURITY_ALERT:
        // Handle security alerts
        this.handleSecurityAlert(message.payload);
        break;
        
      case WebSocketEventType.TASK_ASSIGNED:
        // Handle task assignment
        if (message.payload?.assignedTo === user?.id) {
          this.showTaskAssignment(message.payload);
        }
        break;
        
      case WebSocketEventType.DASHBOARD_REFRESH:
        // Refresh dashboard data
        this.refreshDashboardData(message.payload);
        break;
    }
  }

  // ============= MESSAGE SENDING =============
  async sendMessage(channelId: string, type: WebSocketEventType, payload: any): Promise<void> {
    try {
      if (!this.isConnected) {
        throw new Error('WebSocket not connected');
      }

      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date().toISOString(),
        userId: useJWTAuth.getState().user?.id,
        channelId,
      };

      await supabase.channel(channelId).send({
        type: 'broadcast',
        event: 'message',
        payload: message,
      });
      
      console.log(`Sent message to ${channelId}:`, message);
    } catch (error) {
      console.error(`Failed to send message to ${channelId}:`, error);
    }
  }

  async broadcastToRole(role: string, type: WebSocketEventType, payload: any): Promise<void> {
    await this.sendMessage(`role_${role}`, type, payload);
  }

  async broadcastToAll(type: WebSocketEventType, payload: any): Promise<void> {
    await this.sendMessage('global_announcements', type, payload);
  }

  async sendToUser(userId: string, type: WebSocketEventType, payload: any): Promise<void> {
    await this.sendMessage(`user_${userId}`, type, payload);
  }

  // ============= EVENT HANDLERS =============
  private initializeEventHandlers(): void {
    // Initialize event handler sets
    Object.values(WebSocketEventType).forEach(eventType => {
      this.eventHandlers.set(eventType, new Set());
    });
  }

  on(eventType: WebSocketEventType, handler: (message: WebSocketMessage) => void): () => void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.add(handler);
      
      // Return unsubscribe function
      return () => {
        handlers.delete(handler);
      };
    }
    
    return () => {}; // No-op if handlers not found
  }

  off(eventType: WebSocketEventType, handler: (message: WebSocketMessage) => void): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private emitEvent(eventType: WebSocketEventType, message: WebSocketMessage): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  // ============= PRESENCE MANAGEMENT =============
  private handlePresenceSync(): void {
    // Handle presence updates (online/offline users)
    const presence = supabase.channel('global_presence').presenceState();
    console.log('Presence state:', presence);
    
    // Update online users in store
    const onlineUsers = Object.keys(presence);
    // Update store with online users
  }

  async updatePresence(status: 'online' | 'away' | 'offline'): Promise<void> {
    try {
      const { user } = useJWTAuth.getState();
      
      if (!user) return;

      const presenceChannel = supabase.channel('global_presence');
      
      if (status === 'offline') {
        await presenceChannel.untrack();
      } else {
        await presenceChannel.track({
          user_id: user.id,
          user_name: user.name,
          status,
          last_seen: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  }

  // ============= UTILITY METHODS =============
  private showSystemAnnouncement(payload: any): void {
    // Show system announcement notification
    console.log('System announcement:', payload);
    
    const store = useUnifiedSaaSStore.getState();
    store.addNotification({
      userId: 'broadcast',
      type: 'info',
      title: payload.title || 'System Announcement',
      message: payload.message,
      actionUrl: payload.actionUrl,
      metadata: { type: 'system_announcement' },
    });
  }

  private handleSecurityAlert(payload: any): void {
    // Handle security alerts
    console.log('Security alert:', payload);
    
    const store = useUnifiedSaaSStore.getState();
    store.addNotification({
      userId: 'broadcast',
      type: 'warning',
      title: 'Security Alert',
      message: payload.message,
      metadata: { type: 'security_alert', severity: payload.severity },
    });
  }

  private showTaskAssignment(payload: any): void {
    // Show task assignment notification
    console.log('Task assigned:', payload);
    
    const store = useUnifiedSaaSStore.getState();
    store.addNotification({
      userId: useJWTAuth.getState().user?.id,
      type: 'info',
      title: 'New Task Assigned',
      message: `Task "${payload.title}" has been assigned to you`,
      actionUrl: `/dashboard/task-manager/tasks/${payload.id}`,
      metadata: { type: 'task_assignment', taskId: payload.id },
    });
  }

  private refreshDashboardData(payload: any): void {
    // Refresh dashboard data
    console.log('Refreshing dashboard data:', payload);
    
    // Trigger data refresh for specific modules
    if (payload.modules) {
      payload.modules.forEach((module: string) => {
        // Emit refresh event for module
        this.emitEvent('module_refresh', {
          type: 'module_refresh' as any,
          payload: { module },
          timestamp: new Date().toISOString(),
        });
      });
    }
  }

  // ============= PUBLIC ACCESSORS =============
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  getConnectedChannels(): WebSocketChannel[] {
    return Array.from(this.channels.values());
  }

  getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
    channels: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      channels: this.channels.size,
    };
  }
}

// ============= WEBSOCKET HOOK =============
export const useWebSocket = () => {
  const webSocketSystem = WebSocketSystem.getInstance();
  const { user } = useJWTAuth();

  // Initialize connection when user is available
  React.useEffect(() => {
    if (user && !webSocketSystem.isWebSocketConnected()) {
      webSocketSystem.connect();
    }

    return () => {
      // Cleanup on unmount
      if (webSocketSystem.isWebSocketConnected()) {
        webSocketSystem.updatePresence('offline');
      }
    };
  }, [user]);

  // Update presence when user becomes active/inactive
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        webSocketSystem.updatePresence('away');
      } else {
        webSocketSystem.updatePresence('online');
      }
    };

    const handleBeforeUnload = () => {
      webSocketSystem.updatePresence('offline');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    // Connection management
    connect: webSocketSystem.connect.bind(webSocketSystem),
    disconnect: webSocketSystem.disconnect.bind(webSocketSystem),
    
    // Channel management
    joinChannel: webSocketSystem.joinChannel.bind(webSocketSystem),
    leaveChannel: webSocketSystem.leaveChannel.bind(webSocketSystem),
    
    // Message sending
    sendMessage: webSocketSystem.sendMessage.bind(webSocketSystem),
    broadcastToRole: webSocketSystem.broadcastToRole.bind(webSocketSystem),
    broadcastToAll: webSocketSystem.broadcastToAll.bind(webSocketSystem),
    sendToUser: webSocketSystem.sendToUser.bind(webSocketSystem),
    
    // Event handling
    on: webSocketSystem.on.bind(webSocketSystem),
    off: webSocketSystem.off.bind(webSocketSystem),
    
    // Presence
    updatePresence: webSocketSystem.updatePresence.bind(webSocketSystem),
    
    // Status
    isConnected: webSocketSystem.isWebSocketConnected(),
    connectionStatus: webSocketSystem.getConnectionStatus(),
    connectedChannels: webSocketSystem.getConnectedChannels(),
  };
};

// ============= REAL-TIME PROVIDER COMPONENT =============
interface RealTimeProviderProps {
  children: React.ReactNode;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
  const { isConnected, connectionStatus } = useWebSocket();

  // Show connection status indicator
  const getConnectionStatusColor = () => {
    if (isConnected) return 'bg-green-500';
    if (connectionStatus.reconnectAttempts > 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative">
      {/* Connection status indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div 
          className={`w-3 h-3 rounded-full ${getConnectionStatusColor()} ${
            isConnected ? 'animate-pulse' : ''
          }`} 
          title={`WebSocket: ${isConnected ? 'Connected' : 'Disconnected'}`} 
        />
      </div>
      
      {children}
    </div>
  );
};

export default WebSocketSystem;
