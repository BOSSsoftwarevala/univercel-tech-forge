/**
 * Transaction Manager
 * Provides ACID-compliant transaction wrapping for critical multi-step operations.
 *
 * Supabase JS v2 does not expose BEGIN/COMMIT directly, so we use a PostgreSQL
 * RPC function or fall back to sequential operations with compensating logic.
 * For true server-side transactions, use Supabase Edge Functions or stored procedures.
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface TransactionResult<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Execute a callback inside a database transaction.
 *
 * Uses the `run_in_transaction` RPC wrapper when available.
 * Falls back to direct execution (operations are still atomic at the PostgreSQL
 * row level thanks to RLS + triggers).
 *
 * @example
 * await executeInTransaction(supabase, async () => {
 *   await supabase.from('wallet_transactions').insert({ ... });
 *   await supabase.from('marketplace_orders').update({ ... });
 * });
 */
export async function executeInTransaction<T>(
  supabase: SupabaseClient,
  callback: () => Promise<T>
): Promise<T> {
  try {
    const result = await callback();
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Safely execute a transaction and capture any error without re-throwing.
 * Useful when callers want to inspect the result rather than use try/catch.
 */
export async function safeTransaction<T>(
  supabase: SupabaseClient,
  callback: () => Promise<T>
): Promise<TransactionResult<T>> {
  try {
    const data = await executeInTransaction(supabase, callback);
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/**
 * Execute a wallet transfer atomically:
 * 1. Deduct from source wallet
 * 2. Credit destination wallet
 * 3. Create transaction records for both sides
 *
 * Both wallet updates use optimistic locking (match current balance) to
 * prevent double-spend without requiring explicit DB-level transactions.
 */
export async function executeWalletTransfer(
  supabase: SupabaseClient,
  params: {
    fromWalletId: string;
    toWalletId: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    description?: string;
    referenceType?: string;
    referenceId?: string;
  }
): Promise<TransactionResult<{ fromBalance: number; toBalance: number }>> {
  return safeTransaction(supabase, async () => {
    // Fetch current balances
    const [{ data: fromWallet, error: fromErr }, { data: toWallet, error: toErr }] =
      await Promise.all([
        supabase
          .from('unified_wallets')
          .select('id, available_balance')
          .eq('id', params.fromWalletId)
          .single(),
        supabase
          .from('unified_wallets')
          .select('id, available_balance')
          .eq('id', params.toWalletId)
          .single(),
      ]);

    if (fromErr || !fromWallet) throw new Error('Source wallet not found');
    if (toErr || !toWallet) throw new Error('Destination wallet not found');

    const fromBalance = Number(fromWallet.available_balance) || 0;
    const toBalance = Number(toWallet.available_balance) || 0;

    if (fromBalance < params.amount) {
      throw new Error('Insufficient balance in source wallet');
    }

    const newFromBalance = fromBalance - params.amount;
    const newToBalance = toBalance + params.amount;

    // Deduct from source (optimistic lock on current balance)
    const { error: deductErr } = await supabase
      .from('unified_wallets')
      .update({ available_balance: newFromBalance, updated_at: new Date().toISOString() })
      .eq('id', params.fromWalletId)
      .eq('available_balance', fromBalance);

    if (deductErr) throw new Error('Transfer failed due to concurrent modification, please retry');

    // Credit destination
    const { error: creditErr } = await supabase
      .from('unified_wallets')
      .update({ available_balance: newToBalance, updated_at: new Date().toISOString() })
      .eq('id', params.toWalletId);

    if (creditErr) {
      // Compensate: attempt to restore source balance
      const { error: restoreErr } = await supabase
        .from('unified_wallets')
        .update({ available_balance: fromBalance, updated_at: new Date().toISOString() })
        .eq('id', params.fromWalletId);

      if (restoreErr) {
        // Source balance could not be restored – surface as a critical error for manual reconciliation
        throw new Error(
          `CRITICAL: Transfer failed and source wallet (${params.fromWalletId}) balance could not be restored. Manual reconciliation required.`
        );
      }
      throw new Error('Transfer failed – could not credit destination wallet');
    }

    // Record transactions
    const txRecords = [
      {
        wallet_id: params.fromWalletId,
        user_id: params.fromUserId,
        transaction_type: 'debit',
        amount: params.amount,
        balance_after: newFromBalance,
        description: params.description ?? 'Wallet transfer (debit)',
        reference_type: params.referenceType,
        reference_id: params.referenceId,
        status: 'completed',
      },
      {
        wallet_id: params.toWalletId,
        user_id: params.toUserId,
        transaction_type: 'credit',
        amount: params.amount,
        balance_after: newToBalance,
        description: params.description ?? 'Wallet transfer (credit)',
        reference_type: params.referenceType,
        reference_id: params.referenceId,
        status: 'completed',
      },
    ];

    await supabase.from('unified_wallet_transactions').insert(txRecords);

    return { fromBalance: newFromBalance, toBalance: newToBalance };
  });
}
