import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationAlert, NotificationType } from '@/components/shared/GlobalNotificationHeader';

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

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      const mapped: NotificationAlert[] = (data || []).map((n: any) => ({
        id: n.id,
        type: n.type as NotificationType,
        message: n.message,
        timestamp: new Date(n.created_at),
        eventType: n.event_type || '',
        actionLabel: n.action_label,
        isBuzzer: n.is_buzzer,
        roleTarget: n.role_target || [],
      }));

      setNotifications(mapped);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const n = payload.new as any;
            const newNotif: NotificationAlert = {
              id: n.id,
              type: n.type as NotificationType,
              message: n.message,
              timestamp: new Date(n.created_at),
              eventType: n.event_type || '',
              actionLabel: n.action_label,
              isBuzzer: n.is_buzzer,
              roleTarget: n.role_target || [],
            };
            setNotifications(prev => [newNotif, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== (payload.old as any).id));
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as any;
            if (updated.is_dismissed) {
              setNotifications(prev => prev.filter(n => n.id !== updated.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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

    const { error } = await supabase.from('user_notifications').insert({
      user_id: user.id,
      type,
      message,
      event_type: eventType,
      action_label: options?.actionLabel,
      action_url: options?.actionUrl,
      is_buzzer: options?.isBuzzer || false,
      role_target: options?.roleTarget || [],
    });

    if (error) {
      console.error('Error adding notification:', error);
    }
  }, [user]);

  const dismissNotification = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error dismissing notification:', error);
    } else {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const handleAction = useCallback(async (id: string) => {
    await dismissNotification(id);
  }, [dismissNotification]);

  const clearAll = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_notifications')
      .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_buzzer', false);

    if (error) {
      console.error('Error clearing notifications:', error);
    } else {
      setNotifications(prev => prev.filter(n => n.isBuzzer));
    }
  }, [user]);

  const filteredNotifications = notifications.filter(n => {
    if (!n.roleTarget || n.roleTarget.length === 0) return true;
    return n.roleTarget.includes(userRole || '') || userRole === 'super_admin';
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
