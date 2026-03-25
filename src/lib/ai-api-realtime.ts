// AI API SYSTEM ULTRA FIX — REALTIME HOOKS
// Subscribes to wallet and usage events for live updates

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function subscribeToWallet(userId: string, onUpdate: (balance: number) => void) {
  return supabase.channel('ai_wallet_update')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `user_id=eq.${userId}` }, payload => {
      onUpdate(payload.new.balance);
    })
    .subscribe();
}

export function subscribeToUsage(userId: string, onUpdate: (log: any) => void) {
  return supabase.channel('ai_usage_update')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wallet_logs', filter: `user_id=eq.${userId}` }, payload => {
      onUpdate(payload.new);
    })
    .subscribe();
}
