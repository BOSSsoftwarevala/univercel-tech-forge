import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Subscribe to order notifications
export const subscribeToOrders = () => {
    return supabase
        .from('orders')
        .on('INSERT', payload => {
            console.log('New order!', payload);
            // Handle the new order
        })
        .subscribe();
};

// Subscribe to notifications
export const subscribeToNotifications = () => {
    return supabase
        .from('notifications')
        .on('INSERT', payload => {
            console.log('New notification!', payload);
            // Handle the new notification
        })
        .subscribe();
};