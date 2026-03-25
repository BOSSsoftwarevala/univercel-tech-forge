import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationAlert, NotificationType } from '@/components/shared/GlobalNotificationHeader';
import { callEdgeRoute } from '@/lib/api/edge-client';

interface NotificationRecord {
  id: string;
  type: NotificationType;
  message: string;
  created_at: string;
  event_type?: string;
  action_label?: string | null;
  action_url?: string | null;
  is_buzzer?: boolean;
  role_target?: string[];
  is_read?: boolean;
}

interface NotificationsPayload {
  items: NotificationRecord[];
  unread: number;
}

interface NotificationContextType {
  notifications: NotificationAlert[];
  addNotification: (type: NotificationType, message: string, eventType: string, options?: {
    actionLabel?: string;
    actionUrl?: string;
    isBuzzer?: boolean;
    roleTarget?: string[];
  }) => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  handleAction: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  unreadCount: number;
  buzzerNotifications: NotificationAlert[];
  hasBuzzer: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user, userRole } = useAuth();
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);

  const mapNotification = useCallback((record: NotificationRecord): NotificationAlert => ({
    id: record.id,
    type: record.type,
    message: record.message,
    timestamp: new Date(record.created_at),
    eventType: record.event_type || '',
    actionLabel: record.action_label || undefined,
      actionUrl: record.action_url || undefined,
    isBuzzer: Boolean(record.is_buzzer),
    roleTarget: Array.isArray(record.role_target) ? record.role_target : [],
  }), []);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const response = await callEdgeRoute<NotificationsPayload>('api-notifications', 'list', {
        query: { limit: 50 },
      });
      setNotifications((response.data.items || []).map(mapNotification));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [mapNotification, user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    fetchNotifications();
    const interval = window.setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [user, fetchNotifications]);

  const addNotification = useCallback(async (
    type: NotificationType,
    message: string,
    eventType: string,
    options?: {
      actionLabel?: string;
      actionUrl?: string;
      isBuzzer?: boolean;
      roleTarget?: string[];
    }
  ) => {
    if (!user) return;

    try {
      await callEdgeRoute<NotificationRecord>('api-notifications', 'create', {
        method: 'POST',
        body: {
          type,
          message,
          event_type: eventType,
          action_label: options?.actionLabel,
          action_url: options?.actionUrl,
          is_buzzer: options?.isBuzzer || false,
          role_target: options?.roleTarget || [],
        },
      });
      await fetchNotifications();
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }, [fetchNotifications, user]);

  const dismissNotification = useCallback(async (id: string) => {
    try {
      await callEdgeRoute<{ success: boolean }>('api-notifications', 'dismiss', {
        method: 'POST',
        body: { notification_id: id },
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await callEdgeRoute<{ success: boolean }>('api-notifications', 'read', {
        method: 'POST',
        body: { notification_id: id },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const handleAction = useCallback(async (id: string) => {
    await dismissNotification(id);
  }, [dismissNotification]);

  const clearAll = useCallback(async () => {
    if (!user) return;

    try {
      await callEdgeRoute<{ success: boolean }>('api-notifications', 'clear', {
        method: 'POST',
      });
      setNotifications(prev => prev.filter(n => n.isBuzzer));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, [user]);

  const filteredNotifications = notifications.filter(n => {
    if (!n.roleTarget || n.roleTarget.length === 0) return true;
    return n.roleTarget.includes(userRole || '') || userRole === 'boss_owner';
  });

  const buzzerNotifications = filteredNotifications.filter(n => n.isBuzzer && n.type === 'priority');
  const hasBuzzer = buzzerNotifications.length > 0;
  const unreadCount = filteredNotifications.length;

  return (
    <NotificationContext.Provider value={{
      notifications: filteredNotifications,
      addNotification,
      dismissNotification,
      markAsRead,
      handleAction,
      clearAll,
      unreadCount,
      buzzerNotifications,
      hasBuzzer,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
