import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useNotifyPurchase() {
  const notifyPurchase = useCallback(
    async (
      userId: string,
      userName: string,
      productId: string,
      productName: string,
      amount: number,
      licenseType: string
    ) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-on-purchase`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              user_name: userName,
              product_id: productId,
              product_name: productName,
              amount,
              license_type: licenseType,
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

  return { notifyPurchase };
}
