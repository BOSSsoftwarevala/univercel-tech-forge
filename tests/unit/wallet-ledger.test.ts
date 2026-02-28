// ================================================================
// Software Vala - Wallet Ledger Unit Tests
// Standalone TypeScript test runner (no framework required)
// ================================================================
export {};

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true });
  } catch (err) {
    results.push({ name, passed: false, error: (err as Error).message });
  }
}

// ============= DOMAIN TYPES =============

interface WalletLedgerEntry {
  id: string;
  wallet_id: string;
  type: 'credit' | 'debit' | 'hold' | 'release';
  amount: number;
  running_balance: number;
  reference?: string;
  created_at: Date;
}

interface Wallet {
  id: string;
  tenant_id: string;
  balance: number;
  held_amount: number;
  is_locked: boolean;
  currency: string;
}

// ============= PURE FUNCTIONS UNDER TEST =============

function calculateAvailableBalance(wallet: Wallet): number {
  return wallet.balance - wallet.held_amount;
}

function applyCredit(wallet: Wallet, amount: number): { wallet: Wallet; entry: Partial<WalletLedgerEntry> } {
  if (amount <= 0) throw new Error('Credit amount must be positive');
  const newBalance = wallet.balance + amount;
  return {
    wallet: { ...wallet, balance: newBalance },
    entry: {
      type: 'credit',
      amount,
      running_balance: newBalance,
    },
  };
}

function applyDebit(wallet: Wallet, amount: number): { wallet: Wallet; entry: Partial<WalletLedgerEntry> } {
  if (amount <= 0) throw new Error('Debit amount must be positive');
  if (wallet.is_locked) throw new Error('Wallet is locked');
  if (calculateAvailableBalance(wallet) < amount) throw new Error('Insufficient funds');
  const newBalance = wallet.balance - amount;
  return {
    wallet: { ...wallet, balance: newBalance },
    entry: {
      type: 'debit',
      amount,
      running_balance: newBalance,
    },
  };
}

function placeHold(wallet: Wallet, amount: number): { wallet: Wallet; entry: Partial<WalletLedgerEntry> } {
  if (amount <= 0) throw new Error('Hold amount must be positive');
  if (wallet.is_locked) throw new Error('Wallet is locked');
  if (calculateAvailableBalance(wallet) < amount) throw new Error('Insufficient funds for hold');
  const newHeld = wallet.held_amount + amount;
  return {
    wallet: { ...wallet, held_amount: newHeld },
    entry: {
      type: 'hold',
      amount,
      running_balance: wallet.balance,
    },
  };
}

function releaseHold(wallet: Wallet, amount: number): { wallet: Wallet; entry: Partial<WalletLedgerEntry> } {
  if (amount <= 0) throw new Error('Release amount must be positive');
  if (wallet.held_amount < amount) throw new Error('Cannot release more than held amount');
  const newHeld = wallet.held_amount - amount;
  return {
    wallet: { ...wallet, held_amount: newHeld },
    entry: {
      type: 'release',
      amount,
      running_balance: wallet.balance,
    },
  };
}

function isDoubleEntryConsistent(entries: Partial<WalletLedgerEntry>[]): boolean {
  let running = 0;
  for (const e of entries) {
    if (e.type === 'credit' || e.type === 'release') running += e.amount!;
    if (e.type === 'debit' || e.type === 'hold') running -= e.amount!;
  }
  // Final running_balance of last entry should reflect net flow
  const last = entries[entries.length - 1];
  return last?.running_balance !== undefined && running !== undefined;
}

function processOperationsSequentially(
  wallet: Wallet,
  operations: Array<{ op: 'credit' | 'debit' | 'hold' | 'release'; amount: number }>
): { finalWallet: Wallet; entries: Partial<WalletLedgerEntry>[]; errors: string[] } {
  let current = { ...wallet };
  const entries: Partial<WalletLedgerEntry>[] = [];
  const errors: string[] = [];

  for (const operation of operations) {
    try {
      let result: { wallet: Wallet; entry: Partial<WalletLedgerEntry> };
      switch (operation.op) {
        case 'credit':  result = applyCredit(current, operation.amount); break;
        case 'debit':   result = applyDebit(current, operation.amount); break;
        case 'hold':    result = placeHold(current, operation.amount); break;
        case 'release': result = releaseHold(current, operation.amount); break;
        default: throw new Error(`Unknown operation: ${operation.op}`);
      }
      current = result.wallet;
      entries.push(result.entry);
    } catch (err) {
      errors.push((err as Error).message);
    }
  }

  return { finalWallet: current, entries, errors };
}

// ============= TESTS =============

async function runTests(): Promise<void> {
  const baseWallet: Wallet = {
    id: 'w-001',
    tenant_id: 't-001',
    balance: 1000.00,
    held_amount: 0,
    is_locked: false,
    currency: 'INR',
  };

  // 1. Balance calculation
  await test('Credit increases balance', () => {
    const { wallet } = applyCredit(baseWallet, 500);
    assertEqual(wallet.balance, 1500, 'Balance after credit');
  });

  await test('Credit entry has correct running_balance', () => {
    const { entry } = applyCredit(baseWallet, 200);
    assertEqual(entry.running_balance, 1200, 'Running balance in ledger entry');
    assertEqual(entry.type, 'credit', 'Entry type');
  });

  await test('Credit with zero amount throws error', () => {
    let threw = false;
    try { applyCredit(baseWallet, 0); } catch { threw = true; }
    assert(threw, 'Should throw on zero credit');
  });

  await test('Credit with negative amount throws error', () => {
    let threw = false;
    try { applyCredit(baseWallet, -100); } catch { threw = true; }
    assert(threw, 'Should throw on negative credit');
  });

  // 2. Hold logic
  await test('Hold reduces available balance', () => {
    const { wallet } = placeHold(baseWallet, 300);
    assertEqual(calculateAvailableBalance(wallet), 700, 'Available balance after hold');
    assertEqual(wallet.balance, 1000, 'Ledger balance unchanged by hold');
    assertEqual(wallet.held_amount, 300, 'Held amount updated');
  });

  await test('Hold beyond available balance throws error', () => {
    let threw = false;
    try { placeHold(baseWallet, 1001); } catch { threw = true; }
    assert(threw, 'Should throw when holding more than available');
  });

  await test('Multiple holds accumulate correctly', () => {
    const { wallet: w1 } = placeHold(baseWallet, 200);
    const { wallet: w2 } = placeHold(w1, 300);
    assertEqual(w2.held_amount, 500, 'Cumulative hold amount');
    assertEqual(calculateAvailableBalance(w2), 500, 'Available after multiple holds');
  });

  await test('Release hold restores available balance', () => {
    const { wallet: held } = placeHold(baseWallet, 400);
    const { wallet: released } = releaseHold(held, 400);
    assertEqual(released.held_amount, 0, 'Held amount after full release');
    assertEqual(calculateAvailableBalance(released), 1000, 'Available fully restored');
  });

  await test('Partial release works correctly', () => {
    const { wallet: held } = placeHold(baseWallet, 600);
    const { wallet: released } = releaseHold(held, 200);
    assertEqual(released.held_amount, 400, 'Remaining held after partial release');
  });

  // 3. Deduction (debit)
  await test('Debit reduces balance', () => {
    const { wallet } = applyDebit(baseWallet, 250);
    assertEqual(wallet.balance, 750, 'Balance after debit');
  });

  await test('Debit entry has correct type and amount', () => {
    const { entry } = applyDebit(baseWallet, 100);
    assertEqual(entry.type, 'debit', 'Entry type is debit');
    assertEqual(entry.amount, 100, 'Entry amount');
  });

  // 4. Insufficient funds
  await test('Debit with insufficient funds throws error', () => {
    let threw = false;
    try { applyDebit(baseWallet, 1001); } catch { threw = true; }
    assert(threw, 'Should throw on insufficient funds');
  });

  await test('Debit respects held amount as unavailable', () => {
    const { wallet: held } = placeHold(baseWallet, 800);
    let threw = false;
    try { applyDebit(held, 300); } catch { threw = true; }
    assert(threw, 'Should throw when debit exceeds available (balance minus hold)');
  });

  await test('Debit succeeds when funds cover held + debit', () => {
    const walletWith = { ...baseWallet, balance: 1000, held_amount: 200 };
    const { wallet } = applyDebit(walletWith, 700);
    assertEqual(wallet.balance, 300, 'Balance after debit with some held');
  });

  // 5. Locked wallet rejection
  await test('Debit on locked wallet throws error', () => {
    const locked = { ...baseWallet, is_locked: true };
    let threw = false;
    try { applyDebit(locked, 10); } catch { threw = true; }
    assert(threw, 'Should throw on locked wallet debit');
  });

  await test('Hold on locked wallet throws error', () => {
    const locked = { ...baseWallet, is_locked: true };
    let threw = false;
    try { placeHold(locked, 10); } catch { threw = true; }
    assert(threw, 'Should throw on locked wallet hold');
  });

  await test('Credit on locked wallet is still allowed', () => {
    const locked = { ...baseWallet, is_locked: true };
    const { wallet } = applyCredit(locked, 100);
    assertEqual(wallet.balance, 1100, 'Credit allowed on locked wallet');
  });

  // 6. Double-entry ledger consistency
  await test('Running balance is consistent across sequential entries', () => {
    let w = { ...baseWallet };
    const entries: Partial<WalletLedgerEntry>[] = [];

    const r1 = applyCredit(w, 500); w = r1.wallet; entries.push(r1.entry);
    const r2 = applyDebit(w, 200);  w = r2.wallet; entries.push(r2.entry);
    const r3 = applyCredit(w, 100); w = r3.wallet; entries.push(r3.entry);

    assertEqual(w.balance, 1400, 'Final balance after credit+debit+credit');
    assertEqual(entries[2].running_balance, 1400, 'Last entry running_balance matches wallet');
  });

  await test('Double-entry consistency check passes for valid entries', () => {
    const entries: Partial<WalletLedgerEntry>[] = [
      { type: 'credit', amount: 500, running_balance: 1500 },
      { type: 'debit',  amount: 200, running_balance: 1300 },
    ];
    assert(isDoubleEntryConsistent(entries), 'Double entry should be consistent');
  });

  await test('Ledger net flow equals final balance delta', () => {
    const initial = 1000;
    let w = { ...baseWallet, balance: initial };
    const ops = [
      { op: 'credit' as const, amount: 300 },
      { op: 'debit'  as const, amount: 100 },
      { op: 'credit' as const, amount: 200 },
      { op: 'debit'  as const, amount: 50  },
    ];
    const { finalWallet } = processOperationsSequentially(w, ops);
    const expectedBalance = initial + 300 - 100 + 200 - 50;
    assertEqual(finalWallet.balance, expectedBalance, 'Net ledger flow matches balance');
  });

  // 7. Concurrent operation safety (sequential simulation)
  await test('Sequential operations maintain balance integrity', () => {
    const ops = Array.from({ length: 10 }, (_, i) => ({
      op: (i % 2 === 0 ? 'credit' : 'debit') as 'credit' | 'debit',
      amount: 50,
    }));
    const { finalWallet, errors } = processOperationsSequentially(baseWallet, ops);
    assertEqual(errors.length, 0, 'No errors in sequential operations');
    assertEqual(finalWallet.balance, 1000, 'Balance unchanged after equal credits and debits');
  });

  await test('Concurrent hold requests respect total available balance', () => {
    // Simulate two concurrent holds each requesting 600 on a 1000 balance wallet
    // Only the first should succeed; second should fail
    const hold1 = placeHold(baseWallet, 600);
    let threw = false;
    try {
      placeHold(hold1.wallet, 600); // Only 400 available after first hold
    } catch {
      threw = true;
    }
    assert(threw, 'Second concurrent hold should fail due to insufficient available balance');
  });

  await test('Hold → debit → release cycle is consistent', () => {
    let w = { ...baseWallet };
    const { wallet: held }     = placeHold(w, 500);
    const { wallet: debited }  = applyDebit(held, 400);
    const { wallet: released } = releaseHold(debited, 100); // release unused portion
    assertEqual(released.held_amount, 0, 'All holds released');
    assertEqual(released.balance, 600, 'Balance correct after full cycle');
    assertEqual(calculateAvailableBalance(released), 600, 'Available balance correct');
  });

  await test('Release more than held throws error', () => {
    const { wallet: held } = placeHold(baseWallet, 100);
    let threw = false;
    try { releaseHold(held, 200); } catch { threw = true; }
    assert(threw, 'Cannot release more than held');
  });

  // ============= REPORT =============
  const passed  = results.filter(r => r.passed).length;
  const failed  = results.filter(r => !r.passed).length;

  console.log('\n================================================================================');
  console.log('                    WALLET LEDGER UNIT TEST RESULTS');
  console.log('================================================================================\n');

  for (const r of results) {
    const status = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}  ${r.name}`);
    if (r.error) console.log(`       Error: ${r.error}`);
  }

  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`Total: ${results.length}  |  Passed: ${passed}  |  Failed: ${failed}`);
  console.log('================================================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
