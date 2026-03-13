import { supabase } from '@/integrations/supabase/client';

// Subscribe to order notifications
export const subscribeToOrders = () => {
  return supabase
    .channel('marketplace-orders')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        console.log('New order!', payload);
      }
    )
    .subscribe();
};

// Subscribe to notifications
export const subscribeToNotifications = () => {
  return supabase
    .channel('marketplace-notifications')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      (payload) => {
        console.log('New notification!', payload);
      }
    )
    .subscribe();
};
