import { supabase } from '@/integrations/supabase/client';

interface Wallet {
  id: string;
  tenant_id: string;
  balance: number;
  hold_amount: number;
  currency: string;
  is_locked: boolean;
}

async function getWallet(tenantId: string): Promise<{ data: Wallet | null; error: any }> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('tenant_id', tenantId)
    .single();
  return { data: data as Wallet | null, error };
}

async function assertUnlocked(tenantId: string): Promise<Wallet> {
  const { data, error } = await getWallet(tenantId);
  if (error || !data) throw new Error('Wallet not found');
  if (data.is_locked) throw new Error('Wallet is locked and cannot process transactions');
  return data;
}

export async function getWalletBalance(tenantId: string) {
  return supabase.from('wallets').select('*').eq('tenant_id', tenantId).single();
}

export async function addFunds(tenantId: string, amount: number, description: string) {
  const wallet = await assertUnlocked(tenantId);
  const newBalance = wallet.balance + amount;

  const { error: walletErr } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', wallet.id);

  if (walletErr) return { data: null, error: walletErr };

  const { error: txErr } = await supabase.from('wallet_transactions').insert({
    tenant_id: tenantId,
    wallet_id: wallet.id,
    type: 'credit',
    amount,
    description,
  });

  if (txErr) {
    await supabase.from('wallets').update({ balance: wallet.balance }).eq('id', wallet.id);
    return { data: null, error: txErr };
  }

  return supabase.from('wallet_ledger').insert({
    tenant_id: tenantId,
    wallet_id: wallet.id,
    entry_type: 'credit',
    amount,
    running_balance: newBalance,
  }).select().single();
}

export async function placeHold(tenantId: string, amount: number, referenceId: string) {
  const wallet = await assertUnlocked(tenantId);
  const available = wallet.balance - wallet.hold_amount;
  if (available < amount) throw new Error('Insufficient available funds to place hold');

  const { data, error } = await supabase
    .from('wallets')
    .update({ hold_amount: wallet.hold_amount + amount })
    .eq('id', wallet.id)
    .select()
    .single();

  if (error) return { data: null, error };

  const { error: txErr } = await supabase.from('wallet_transactions').insert({
    tenant_id: tenantId,
    wallet_id: wallet.id,
    type: 'hold',
    amount,
    description: `Hold placed`,
    api_call_id: referenceId,
  });

  if (txErr) {
    await supabase.from('wallets').update({ hold_amount: wallet.hold_amount }).eq('id', wallet.id);
    return { data: null, error: txErr };
  }

  return { data, error: null };
}

export async function releaseHold(tenantId: string, amount: number, referenceId: string) {
  const wallet = await assertUnlocked(tenantId);
  const newHold = Math.max(0, wallet.hold_amount - amount);

  const { data, error } = await supabase
    .from('wallets')
    .update({ hold_amount: newHold })
    .eq('id', wallet.id)
    .select()
    .single();

  if (error) return { data: null, error };

  const { error: txErr } = await supabase.from('wallet_transactions').insert({
    tenant_id: tenantId,
    wallet_id: wallet.id,
    type: 'release',
    amount,
    description: `Hold released`,
    api_call_id: referenceId,
  });

  if (txErr) {
    await supabase.from('wallets').update({ hold_amount: wallet.hold_amount }).eq('id', wallet.id);
    return { data: null, error: txErr };
  }

  return { data, error: null };
}

export async function deductFunds(
  tenantId: string,
  amount: number,
  description: string,
  apiCallId?: string
) {
  const wallet = await assertUnlocked(tenantId);
  if (wallet.balance < amount) throw new Error('Insufficient funds');

  const newBalance = wallet.balance - amount;

  const { error: walletErr } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', wallet.id);

  if (walletErr) return { data: null, error: walletErr };

  const { error: txErr } = await supabase.from('wallet_transactions').insert({
    tenant_id: tenantId,
    wallet_id: wallet.id,
    type: 'debit',
    amount,
    description,
    api_call_id: apiCallId ?? null,
  });

  if (txErr) {
    await supabase.from('wallets').update({ balance: wallet.balance }).eq('id', wallet.id);
    return { data: null, error: txErr };
  }

  return supabase.from('wallet_ledger').insert({
    tenant_id: tenantId,
    wallet_id: wallet.id,
    entry_type: 'debit',
    amount,
    running_balance: newBalance,
    reference_id: apiCallId ?? null,
  }).select().single();
}

export async function getTransactionHistory(tenantId: string, limit = 50) {
  return supabase
    .from('wallet_transactions')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function getLedgerEntries(tenantId: string, limit = 50) {
  return supabase
    .from('wallet_ledger')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function checkSufficientFunds(tenantId: string, amount: number): Promise<boolean> {
  const { data } = await getWallet(tenantId);
  if (!data) return false;
  return data.balance - data.hold_amount >= amount;
}

export async function lockWallet(tenantId: string) {
  return supabase
    .from('wallets')
    .update({ is_locked: true })
    .eq('tenant_id', tenantId)
    .select()
    .single();
}

export async function unlockWallet(tenantId: string) {
  return supabase
    .from('wallets')
    .update({ is_locked: false })
    .eq('tenant_id', tenantId)
    .select()
    .single();
}
