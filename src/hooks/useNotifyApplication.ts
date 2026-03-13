import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useNotifyApplication() {
  const notifyApplication = useCallback(
    async (
      applicationId: string,
      userId: string,
      userName: string,
      userEmail: string,
      roleApplied: string,
      experience: number,
      portfolioUrl?: string
    ) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-on-application`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
            body: JSON.stringify({
              application_id: applicationId,
              user_id: userId,
              user_name: userName,
              user_email: userEmail,
              role_applied: roleApplied,
              experience,
              portfolio_url: portfolioUrl,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to send notification');
        }

        return await response.json();
      } catch (error) {
        console.error('Notification error:', error);
        toast.error('Failed to send notification');
      }
    },
    []
  );

  return { notifyApplication };
}
