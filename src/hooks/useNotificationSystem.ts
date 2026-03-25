import { useState, useCallback, useEffect, useRef } from 'react';
import type { NotificationAlert, NotificationType } from '@/components/shared/GlobalNotificationHeader';

export type NotificationEventType = 
  | 'lead_activity'
  | 'task_assignment'
  | 'timer_expiry'
  | 'developer_delay'
  | 'demo_offline'
  | 'wallet_transaction'
  | 'support_ticket'
  | 'login_attempt'
  | 'payment_success'
  | 'payment_fail'
  | 'compliance_kyc'
  | 'vip_priority';

interface BuzzerConfig {
  eventType: NotificationEventType;
  roleTargets: string[];
  condition?: (payload: any) => boolean;
}

// Buzzer triggers for critical conditions
const buzzerTriggers: BuzzerConfig[] = [
  { 
    eventType: 'lead_activity', 
    roleTargets: ['lead_manager', 'franchise', 'super_admin'],
    condition: (payload) => payload?.unassignedMinutes > 5
  },
  { 
    eventType: 'task_assignment', 
    roleTargets: ['developer', 'super_admin'],
    condition: (payload) => payload?.notAccepted
  },
  { 
    eventType: 'demo_offline', 
    roleTargets: ['demo_manager', 'super_admin']
  },
  { 
    eventType: 'payment_fail', 
    roleTargets: ['finance', 'super_admin'],
    condition: (payload) => payload?.amount > 10000
  },
  { 
    eventType: 'vip_priority', 
    roleTargets: ['support', 'super_admin']
  },
];

const eventToRoleMap: Record<NotificationEventType, string[]> = {
  lead_activity: ['lead_manager', 'franchise', 'reseller', 'super_admin'],
  task_assignment: ['developer', 'super_admin'],
  timer_expiry: ['developer', 'super_admin'],
  developer_delay: ['developer', 'demo_manager', 'super_admin'],
  demo_offline: ['demo_manager', 'super_admin'],
  wallet_transaction: ['finance', 'franchise', 'reseller', 'super_admin'],
  support_ticket: ['support', 'super_admin'],
  login_attempt: ['super_admin'],
  payment_success: ['finance', 'super_admin'],
  payment_fail: ['finance', 'super_admin'],
  compliance_kyc: ['legal', 'super_admin'],
  vip_priority: ['support', 'client_success', 'super_admin'],
};

export const useNotificationSystem = (userRole: string) => {
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buzzerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if notification should trigger buzzer
  const shouldTriggerBuzzer = useCallback((eventType: NotificationEventType, payload?: any): boolean => {
    const trigger = buzzerTriggers.find(t => t.eventType === eventType);
    if (!trigger) return false;
    
    // Check if user role matches
    if (!trigger.roleTargets.includes(userRole) && userRole !== 'super_admin') {
      return false;
    }
    
    // Check condition if exists
    if (trigger.condition && !trigger.condition(payload)) {
      return false;
    }
    
    return true;
  }, [userRole]);

  // Add notification
  const addNotification = useCallback((
    type: NotificationType,
    message: string,
    eventType: NotificationEventType,
    options?: {
      actionLabel?: string;
      onAction?: () => void;
      payload?: any;
    }
  ) => {
    const isBuzzer = shouldTriggerBuzzer(eventType, options?.payload);
    const roleTargets = eventToRoleMap[eventType] || [];

    const newNotification: NotificationAlert = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: isBuzzer ? 'priority' : type,
      message,
      timestamp: new Date(),
      eventType: eventType.replace(/_/g, ' ').toUpperCase(),
      actionLabel: options?.actionLabel,
      onAction: options?.onAction,
      isBuzzer,
      roleTarget: roleTargets,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play buzzer sound if needed
    if (isBuzzer && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    return newNotification.id;
  }, [shouldTriggerBuzzer]);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      // Don't allow dismissing buzzer notifications
      if (notification?.isBuzzer) {
        return prev;
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  // Handle action (also dismisses)
  const handleAction = useCallback((id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification?.onAction) {
      notification.onAction();
    }
    // Remove notification after action
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [notifications]);

  // Clear all non-buzzer notifications
  const clearAll = useCallback(() => {
    setNotifications(prev => prev.filter(n => n.isBuzzer));
  }, []);

  // Get active buzzer notifications
  const buzzerNotifications = notifications.filter(n => n.isBuzzer);
  const hasBuzzer = buzzerNotifications.length > 0;

  // Cleanup
  useEffect(() => {
    return () => {
      if (buzzerIntervalRef.current) {
        clearInterval(buzzerIntervalRef.current);
      }
    };
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
    handleAction,
    clearAll,
    buzzerNotifications,
    hasBuzzer,
  };
};

export default useNotificationSystem;
