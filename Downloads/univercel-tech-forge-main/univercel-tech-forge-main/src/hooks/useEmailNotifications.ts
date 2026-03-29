import { supabase } from '@/integrations/supabase/client';
import { useCallback } from 'react';
import { toast } from 'sonner';

export type EmailType = 
  | 'password_reset' 
  | 'verification' 
  | 'lead_assignment' 
  | 'buzzer_alert' 
  | 'system_health' 
  | 'notification';

interface PasswordResetData {
  name: string;
  resetLink: string;
}

interface VerificationData {
  name: string;
  verifyLink: string;
}

interface LeadAssignmentData {
  assigneeName: string;
  leadName: string;
  leadDetails: string;
  priority: 'low' | 'medium' | 'high';
}

interface BuzzerAlertData {
  alertType: string;
  message: string;
  priority: string;
  timestamp: string;
}

interface SystemHealthData {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  metrics: Record<string, string>;
}

interface NotificationData {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

type EmailData = 
  | PasswordResetData 
  | VerificationData 
  | LeadAssignmentData 
  | BuzzerAlertData 
  | SystemHealthData 
  | NotificationData;

export function useEmailNotifications() {
  const sendEmail = useCallback(async (
    type: EmailType,
    to: string | string[],
    data: EmailData
  ) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('api-email', {
        body: { type, to, data },
      });

      if (error) throw error;

      if (response?.success) {
        console.log('Email sent successfully:', response);
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email send failed:', error);
      return { success: false, error };
    }
  }, []);

  // Convenience methods for each email type
  const sendPasswordReset = useCallback((to: string, data: PasswordResetData) => {
    return sendEmail('password_reset', to, data);
  }, [sendEmail]);

  const sendVerification = useCallback((to: string, data: VerificationData) => {
    return sendEmail('verification', to, data);
  }, [sendEmail]);

  const sendLeadAssignment = useCallback((to: string, data: LeadAssignmentData) => {
    return sendEmail('lead_assignment', to, data);
  }, [sendEmail]);

  const sendBuzzerAlert = useCallback((to: string | string[], data: BuzzerAlertData) => {
    return sendEmail('buzzer_alert', to, data);
  }, [sendEmail]);

  const sendSystemHealth = useCallback((to: string | string[], data: SystemHealthData) => {
    return sendEmail('system_health', to, data);
  }, [sendEmail]);

  const sendNotification = useCallback((to: string | string[], data: NotificationData) => {
    return sendEmail('notification', to, data);
  }, [sendEmail]);

  // Test email function
  const sendTestEmail = useCallback(async (to: string) => {
    const result = await sendEmail('notification', to, {
      title: '🧪 Test Email from Software Vala',
      message: 'This is a test email to confirm your email notification system is working correctly. If you received this, everything is set up properly!',
      actionUrl: 'https://softwarevala.net',
      actionText: 'Visit Dashboard',
    });

    if (result.success) {
      toast.success('Test email sent successfully!');
    } else {
      toast.error('Failed to send test email');
    }

    return result;
  }, [sendEmail]);

  return {
    sendEmail,
    sendPasswordReset,
    sendVerification,
    sendLeadAssignment,
    sendBuzzerAlert,
    sendSystemHealth,
    sendNotification,
    sendTestEmail,
  };
}
