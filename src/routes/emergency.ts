import { supabase } from '@/integrations/supabase/client';
import { lockWallet, unlockWallet } from '@/lib/ai-orchestration/wallet-ledger';

async function setSystemState(tenantId: string, key: string, value: string) {
  const { data: existing } = await supabase.from('system_state').select('id').eq('tenant_id', tenantId).eq('key', key).maybeSingle();
  if (existing) {
    return supabase.from('system_state').update({ value }).eq('tenant_id', tenantId).eq('key', key);
  }
  return supabase.from('system_state').insert({ tenant_id: tenantId, key, value });
}

async function logAudit(tenantId: string, userId: string, action: string, reason: string) {
  return supabase.from('audit_logs').insert({ tenant_id: tenantId, user_id: userId, action, entity_type: 'emergency', details: { reason } });
}

export async function killAll(tenantId: string, userId: string, reason: string) {
  await setSystemState(tenantId, 'kill_all', 'true');
  await setSystemState(tenantId, 'kill_ai', 'true');
  await logAudit(tenantId, userId, 'kill_all', reason);
  return { success: true };
}

export async function killAiOnly(tenantId: string, userId: string, reason: string) {
  await setSystemState(tenantId, 'kill_ai', 'true');
  await logAudit(tenantId, userId, 'kill_ai', reason);
  return { success: true };
}

export async function lockWalletEmergency(tenantId: string, userId: string, reason: string) {
  await lockWallet(tenantId);
  await logAudit(tenantId, userId, 'lock_wallet', reason);
  return { success: true };
}

export { lockWalletEmergency as lockWallet };

export async function resume(tenantId: string, userId: string, reason: string) {
  await setSystemState(tenantId, 'kill_all', 'false');
  await setSystemState(tenantId, 'kill_ai', 'false');
  await unlockWallet(tenantId);
  await logAudit(tenantId, userId, 'resume', reason);
  return { success: true };
}

export async function getEmergencyState(tenantId: string) {
  const { data, error } = await supabase
    .from('system_state')
    .select('key, value')
    .eq('tenant_id', tenantId)
    .in('key', ['kill_all', 'kill_ai']);

  if (error) return { data: null, error };

  const state: Record<string, string> = {};
  for (const row of data ?? []) {
    state[row.key] = row.value;
  }

  const { data: walletData } = await supabase.from('wallets').select('is_locked').eq('tenant_id', tenantId).maybeSingle();

  return {
    data: {
      killAll: state['kill_all'] === 'true',
      killAi: state['kill_ai'] === 'true',
      walletLocked: walletData?.is_locked ?? false,
      isEmergency: state['kill_all'] === 'true' || state['kill_ai'] === 'true' || (walletData?.is_locked ?? false),
    },
    error: null,
  };
}
