import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useNotifyJoin() {
  const notifyJoin = useCallback(
    async (
      userId: string,
      userName: string,
      userEmail: string,
      panelName: string,
      role: string,
      company?: string
    ) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-on-join`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              user_name: userName,
              user_email: userEmail,
              panel_name: panelName,
              role,
              company,
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

  return { notifyJoin };
}
