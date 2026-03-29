import {
  withEnhancedMiddleware,
  notificationMiddleware,
} from '../_shared/enhanced-middleware.ts';
import {
  errorResponse,
  jsonResponse,
  validateRequired,
} from '../_shared/utils.ts';

const FINANCE_ALLOWED_ROLES = ['finance_manager', 'super_admin', 'boss_owner', 'ceo', 'admin'];
const REVENUE_SOURCE_TYPES = ['marketplace_sale', 'franchise_revenue', 'reseller_sale', 'influencer_conversion'];
const HIGH_AMOUNT_THRESHOLD = 100000;
const CRITICAL_AMOUNT_THRESHOLD = 500000;

function getRequestMeta(req: Request) {
  const url = new URL(req.url);
  return {
    url,
    method: req.method,
    path: url.pathname.replace(/^.*\/api-finance/, '') || '/',
  };
}

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function roundCurrency(value: unknown) {
  return Number(toNumber(value).toFixed(2));
}

function boolValue(value: unknown) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function normalizeLower(value: unknown, fallback = '') {
  return String(value || fallback).trim().toLowerCase();
}

function normalizeUpper(value: unknown, fallback = '') {
  return String(value || fallback).trim().toUpperCase();
}

function normalizeArray(value: unknown) {
  return Array.isArray(value) ? value.filter(Boolean).map((entry) => String(entry)) : [];
}

function matchesPath(path: string, ...candidates: string[]) {
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return candidates.includes(normalizedPath);
}

function inferExpenseAccount(category: string) {
  switch (category) {
    case 'salary':
      return 'expense_salary';
    case 'marketing':
      return 'expense_marketing';
    case 'infrastructure':
      return 'expense_infrastructure';
    case 'operations':
      return 'expense_operations';
    case 'tax':
      return 'expense_tax';
    case 'refund':
      return 'expense_refund';
    default:
      return 'expense_other';
  }
}

function inferRevenueAccount(sourceType: string) {
  switch (sourceType) {
    case 'marketplace_sale':
      return 'revenue_marketplace';
    case 'franchise_revenue':
      return 'revenue_franchise';
    case 'reseller_sale':
      return 'revenue_reseller';
    case 'influencer_conversion':
      return 'revenue_influencer';
    default:
      return 'revenue_other';
  }
}

function payoutLiabilityAccount(targetType: string) {
  return `commission_payable_${normalizeLower(targetType, 'partner')}`;
}

function getApprovalLevels(amount: number, includeBossByDefault = false) {
  const levels = ['system_check', 'manager_approval'];
  if (includeBossByDefault || amount >= HIGH_AMOUNT_THRESHOLD) {
    levels.push('boss_approval');
  }
  return levels;
}

async function logFinanceAudit(
  supabaseAdmin: any,
  actorUserId: string | null,
  actorRole: string | null,
  module: string,
  action: string,
  entityType: string | null,
  entityId: string | null,
  payload: Record<string, unknown> = {},
) {
  await supabaseAdmin.from('finance_audit_trail').insert({
    actor_user_id: actorUserId,
    actor_role: actorRole,
    module,
    action,
    entity_type: entityType,
    entity_id: entityId,
    payload,
  });

  await supabaseAdmin.from('audit_logs').insert({
    module: 'finance',
    action,
    user_id: actorUserId,
    role: actorRole,
    meta_json: {
      entity_type: entityType,
      entity_id: entityId,
      ...payload,
    },
  });
}

async function createAlert(
  supabaseAdmin: any,
  type: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  title: string,
  message: string,
  options: {
    transactionId?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
  } = {},
) {
  const { data: alert } = await supabaseAdmin
    .from('finance_alerts')
    .insert({
      alert_type: type,
      severity,
      title,
      message,
      transaction_id: options.transactionId || null,
      entity_type: options.entityType || null,
      entity_id: options.entityId || null,
      metadata: options.metadata || {},
    })
    .select('*')
    .single();

  return alert;
}

async function createApprovalRequest(
  supabaseAdmin: any,
  input: {
    entityType: 'expense' | 'payout' | 'refund' | 'tax' | 'transaction';
    entityId?: string | null;
    amount: number;
    requestedBy?: string | null;
    metadata?: Record<string, unknown>;
    includeBoss?: boolean;
  },
) {
  const { data: approval } = await supabaseAdmin
    .from('finance_approval_requests')
    .insert({
      entity_type: input.entityType,
      entity_id: input.entityId || null,
      amount: roundCurrency(input.amount),
      requested_by: input.requestedBy || null,
      current_level: 'system_check',
      required_levels: getApprovalLevels(input.amount, Boolean(input.includeBoss)),
      system_checked_at: new Date().toISOString(),
      metadata: input.metadata || {},
    })
    .select('*')
    .single();

  return approval;
}

async function attachApprovalRequest(supabaseAdmin: any, entityType: string, entityId: string, approvalId: string) {
  const tableMap: Record<string, string> = {
    expense: 'finance_expenses',
    payout: 'finance_payouts',
    refund: 'finance_refunds',
    transaction: 'finance_transactions',
    tax: 'finance_tax_records',
  };
  const table = tableMap[entityType];
  if (!table) return;

  await supabaseAdmin.from(table).update({ approval_request_id: approvalId }).eq('id', entityId);
  await supabaseAdmin.from('finance_approval_requests').update({ entity_id: entityId }).eq('id', approvalId);
}

async function createFinanceTransaction(
  supabaseAdmin: any,
  input: {
    sourceModule: string;
    sourceType: string;
    direction: 'inflow' | 'outflow';
    entityType?: string | null;
    entityId?: string | null;
    sourceRecordId?: string | null;
    externalReference?: string | null;
    grossAmount: number;
    taxAmount?: number;
    netAmount?: number;
    status?: string;
    invoiceId?: string | null;
    approvalRequestId?: string | null;
    mismatchFlag?: boolean;
    fraudFlag?: boolean;
    immutableLocked?: boolean;
    createdBy?: string | null;
    managerApprovedBy?: string | null;
    bossApprovedBy?: string | null;
    approvedAt?: string | null;
    postedAt?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const payload = {
    source_module: input.sourceModule,
    source_type: input.sourceType,
    direction: input.direction,
    entity_type: input.entityType || null,
    entity_id: input.entityId || null,
    source_record_id: input.sourceRecordId || null,
    external_reference: input.externalReference || null,
    gross_amount: roundCurrency(input.grossAmount),
    tax_amount: roundCurrency(input.taxAmount || 0),
    net_amount: roundCurrency(input.netAmount ?? input.grossAmount - (input.taxAmount || 0)),
    invoice_id: input.invoiceId || null,
    approval_request_id: input.approvalRequestId || null,
    status: input.status || 'posted',
    mismatch_flag: input.mismatchFlag || false,
    fraud_flag: input.fraudFlag || false,
    immutable_locked: input.immutableLocked ?? true,
    created_by: input.createdBy || null,
    manager_approved_by: input.managerApprovedBy || null,
    boss_approved_by: input.bossApprovedBy || null,
    approved_at: input.approvedAt || null,
    posted_at: input.postedAt || new Date().toISOString(),
    metadata: input.metadata || {},
  };

  const { data: transaction, error } = await supabaseAdmin
    .from('finance_transactions')
    .insert(payload)
    .select('*')
    .single();

  if (error || !transaction) {
    throw new Error(error?.message || 'Unable to create finance transaction');
  }

  return transaction;
}

async function addLedgerEntry(
  supabaseAdmin: any,
  input: {
    transactionId: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    source: string;
    refId?: string | null;
    narration?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { data: entry, error } = await supabaseAdmin
    .from('finance_ledger_entries')
    .insert({
      transaction_id: input.transactionId,
      debit_account: input.debitAccount,
      credit_account: input.creditAccount,
      amount: roundCurrency(input.amount),
      source: input.source,
      ref_id: input.refId || null,
      narration: input.narration || null,
      metadata: input.metadata || {},
    })
    .select('*')
    .single();

  if (error || !entry) {
    throw new Error(error?.message || 'Unable to create ledger entry');
  }

  return entry;
}

async function resolvePayoutBalance(supabaseAdmin: any, targetType: string, targetId: string) {
  const normalizedTarget = normalizeLower(targetType);
  if (normalizedTarget === 'influencer') {
    const { data } = await supabaseAdmin
      .from('influencer_wallet')
      .select('available_balance,pending_balance,total_earned,total_withdrawn')
      .eq('influencer_id', targetId)
      .maybeSingle();
    return {
      availableBalance: roundCurrency(data?.available_balance || 0),
      pendingBalance: roundCurrency(data?.pending_balance || 0),
      source: 'influencer_wallet',
      raw: data,
    };
  }

  if (normalizedTarget === 'reseller') {
    const { data } = await supabaseAdmin
      .from('reseller_wallets')
      .select('available_balance,pending_balance,total_commission,total_payout')
      .eq('reseller_id', targetId)
      .is('deleted_at', null)
      .maybeSingle();
    return {
      availableBalance: roundCurrency(data?.available_balance || 0),
      pendingBalance: roundCurrency(data?.pending_balance || 0),
      source: 'reseller_wallets',
      raw: data,
    };
  }

  if (normalizedTarget === 'franchise') {
    const { data: ledger } = await supabaseAdmin
      .from('franchise_wallet_ledger')
      .select('transaction_type,amount,balance_after,created_at')
      .eq('franchise_id', targetId)
      .order('created_at', { ascending: false })
      .limit(1);

    const latest = ledger?.[0] || null;
    return {
      availableBalance: roundCurrency(latest?.balance_after || 0),
      pendingBalance: 0,
      source: 'franchise_wallet_ledger',
      raw: latest,
    };
  }

  return { availableBalance: 0, pendingBalance: 0, source: 'unknown', raw: null };
}

async function buildOverview(supabaseAdmin: any) {
  const today = new Date();
  const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [transactionsResult, alertsResult, payoutsResult, expensesResult, approvalResult, ledgerResult, taxesResult, refundsResult, reconciliationsResult] = await Promise.all([
    supabaseAdmin.from('finance_transactions').select('*').order('created_at', { ascending: false }).limit(200),
    supabaseAdmin.from('finance_alerts').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('finance_payouts').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('finance_expenses').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('finance_approval_requests').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('finance_ledger_entries').select('*').order('created_at', { ascending: false }).limit(100),
    supabaseAdmin.from('finance_tax_records').select('*').gte('created_at', lastWeek).order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('finance_refunds').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('finance_reconciliations').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  const transactions = transactionsResult.data || [];
  const alerts = alertsResult.data || [];
  const payouts = payoutsResult.data || [];
  const expenses = expensesResult.data || [];
  const approvals = approvalResult.data || [];
  const ledgerEntries = ledgerResult.data || [];
  const taxes = taxesResult.data || [];
  const refunds = refundsResult.data || [];
  const reconciliations = reconciliationsResult.data || [];

  const postedTransactions = transactions.filter((item: any) => ['posted', 'paid', 'approved', 'refunded'].includes(item.status));
  const totalRevenue = postedTransactions
    .filter((item: any) => item.direction === 'inflow' && REVENUE_SOURCE_TYPES.includes(item.source_type))
    .reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0);
  const totalExpenses = postedTransactions
    .filter((item: any) => item.direction === 'outflow')
    .reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0);
  const pendingPayments = payouts
    .filter((item: any) => item.payout_status === 'pending' || item.approval_status === 'pending')
    .reduce((sum: number, item: any) => sum + toNumber(item.amount), 0);
  const todayInflow = postedTransactions
    .filter((item: any) => item.direction === 'inflow' && item.created_at >= todayStart)
    .reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0);
  const todayOutflow = postedTransactions
    .filter((item: any) => item.direction === 'outflow' && item.created_at >= todayStart)
    .reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0);
  const mismatchCount = transactions.filter((item: any) => item.mismatch_flag).length + reconciliations.filter((item: any) => toNumber(item.mismatch_amount) > 0).length;
  const fraudCount = transactions.filter((item: any) => item.fraud_flag).length + alerts.filter((item: any) => item.alert_type === 'fraud_detected' && item.status === 'open').length;
  const openAlerts = alerts.filter((item: any) => item.status === 'open').length;
  const pendingApprovals = approvals.filter((item: any) => item.status === 'pending').length;
  const netProfit = roundCurrency(totalRevenue - totalExpenses);

  const sourceBreakdown = REVENUE_SOURCE_TYPES.map((sourceType) => ({
    source: sourceType,
    amount: roundCurrency(
      postedTransactions
        .filter((item: any) => item.source_type === sourceType && item.direction === 'inflow')
        .reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0),
    ),
  }));

  const accountTotals = new Map<string, number>();
  ledgerEntries.forEach((entry: any) => {
    accountTotals.set(entry.debit_account, roundCurrency((accountTotals.get(entry.debit_account) || 0) + toNumber(entry.amount)));
    accountTotals.set(entry.credit_account, roundCurrency((accountTotals.get(entry.credit_account) || 0) - toNumber(entry.amount)));
  });

  const balanceSheet = {
    assets: roundCurrency(
      Array.from(accountTotals.entries())
        .filter(([account]) => account.startsWith('cash') || account.startsWith('bank') || account.startsWith('wallet') || account.startsWith('receivable'))
        .reduce((sum, [, amount]) => sum + amount, 0),
    ),
    liabilities: roundCurrency(
      Math.abs(
        Array.from(accountTotals.entries())
          .filter(([account]) => account.includes('payable') || account.startsWith('tax_'))
          .reduce((sum, [, amount]) => sum + amount, 0),
      ),
    ),
    equity: netProfit,
  };

  const profitAndLoss = {
    revenue: roundCurrency(totalRevenue),
    expenses: roundCurrency(totalExpenses),
    refunds: roundCurrency(refunds.filter((item: any) => ['approved', 'processed'].includes(item.status)).reduce((sum: number, item: any) => sum + toNumber(item.amount), 0)),
    tax: roundCurrency(taxes.reduce((sum: number, item: any) => sum + toNumber(item.tax_amount), 0)),
    net_profit: netProfit,
  };

  const cashFlow = {
    inflow: roundCurrency(postedTransactions.filter((item: any) => item.direction === 'inflow').reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0)),
    outflow: roundCurrency(postedTransactions.filter((item: any) => item.direction === 'outflow').reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0)),
    net: roundCurrency(postedTransactions.reduce((sum: number, item: any) => sum + (item.direction === 'inflow' ? toNumber(item.net_amount) : -toNumber(item.net_amount)), 0)),
  };

  const engineStatus = {
    revenue_engine: totalRevenue > 0 ? 'live' : 'idle',
    expense_engine: expenses.length > 0 ? 'live' : 'idle',
    transaction_engine: transactions.length > 0 ? 'live' : 'idle',
    payout_engine: payouts.some((item: any) => item.payout_status === 'pending') ? 'attention' : 'stable',
    tax_engine: taxes.length > 0 ? 'live' : 'idle',
    audit_engine: ledgerEntries.length > 0 ? 'immutable' : 'idle',
    fraud_engine: fraudCount > 0 ? 'blocking' : 'stable',
  };

  return {
    summary: {
      total_revenue: roundCurrency(totalRevenue),
      total_expenses: roundCurrency(totalExpenses),
      net_profit: netProfit,
      pending_payments: roundCurrency(pendingPayments),
      today_inflow: roundCurrency(todayInflow),
      today_outflow: roundCurrency(todayOutflow),
      mismatch_count: mismatchCount,
      open_alerts: openAlerts,
      fraud_count: fraudCount,
      pending_approvals: pendingApprovals,
    },
    source_breakdown: sourceBreakdown,
    balance_sheet: balanceSheet,
    profit_and_loss: profitAndLoss,
    cash_flow: cashFlow,
    engine_status: engineStatus,
    recent_transactions: transactions.slice(0, 12),
    pending_payouts: payouts.slice(0, 8),
    pending_expenses: expenses.filter((item: any) => item.status === 'pending').slice(0, 8),
    alerts: alerts.slice(0, 8),
    taxes: taxes.slice(0, 8),
    refunds: refunds.slice(0, 8),
    reconciliations: reconciliations.slice(0, 5),
  };
}

async function createInvoiceRecord(
  supabaseAdmin: any,
  input: {
    userId: string;
    amount: number;
    tax: number;
    currency?: string;
    pdfLink?: string | null;
    status?: string;
  },
) {
  const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 100000)}`;
  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .insert({
      user_id: input.userId,
      invoice_number: invoiceNumber,
      amount: roundCurrency(input.amount),
      tax: roundCurrency(input.tax),
      currency: input.currency || 'INR',
      pdf_link: input.pdfLink || null,
      status: input.status || 'generated',
    })
    .select('*')
    .single();

  if (error || !invoice) {
    throw new Error(error?.message || 'Unable to create invoice record');
  }

  return invoice;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok');
  }

  const { url, method, path } = getRequestMeta(req);

  if (method === 'GET' && matchesPath(path, '/overview')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const overview = await buildOverview(ctx.supabaseAdmin);

      if (overview.summary.mismatch_count > 0) {
        const hasMismatchAlert = overview.alerts.some((item: any) => item.alert_type === 'mismatch' && item.status === 'open');
        if (!hasMismatchAlert) {
          await createAlert(
            ctx.supabaseAdmin,
            'mismatch',
            'high',
            'Ledger mismatch detected',
            'Finance overview detected a mismatch between system movement and reconciliation state.',
            { metadata: { mismatch_count: overview.summary.mismatch_count } },
          );
        }
      }

      return jsonResponse(overview);
    }, {
      module: 'finance',
      action: 'overview',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'GET' && matchesPath(path, '/transactions')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from('finance_transactions').select('*').order('created_at', { ascending: false });

      const status = url.searchParams.get('status');
      const sourceModule = url.searchParams.get('source_module');
      const direction = url.searchParams.get('direction');
      const limit = Math.min(200, Math.max(1, toNumber(url.searchParams.get('limit'), 50)));

      if (status) query = query.eq('status', status);
      if (sourceModule) query = query.eq('source_module', sourceModule);
      if (direction) query = query.eq('direction', direction);

      const { data: transactions, error } = await query.limit(limit);
      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        transactions: transactions || [],
        immutable: true,
        deletable: false,
      });
    }, {
      module: 'finance',
      action: 'transactions',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'GET' && matchesPath(path, '/accounting', '/reports')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const overview = await buildOverview(ctx.supabaseAdmin);
      return jsonResponse({
        balance_sheet: overview.balance_sheet,
        profit_and_loss: overview.profit_and_loss,
        cash_flow: overview.cash_flow,
        tax_reports: overview.taxes,
        reconciliations: overview.reconciliations,
      });
    }, {
      module: 'finance',
      action: 'accounting',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'GET' && matchesPath(path, '/audit')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const limit = Math.min(200, Math.max(1, toNumber(url.searchParams.get('limit'), 100)));
      const { data, error } = await ctx.supabaseAdmin
        .from('finance_audit_trail')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({ audit: data || [], immutable: true, editable: false, deletable: false });
    }, {
      module: 'finance',
      action: 'audit',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/revenue')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['source_module', 'source_type', 'source_record_id', 'amount']);
      if (validation) return errorResponse(validation, 400);

      if (!REVENUE_SOURCE_TYPES.includes(String(ctx.body.source_type))) {
        return errorResponse('Revenue type must come from a system-generated sale source.', 400);
      }

      if (boolValue(ctx.body.manual_entry)) {
        return errorResponse('Manual revenue entry is blocked. Revenue must be system generated.', 403);
      }

      const amount = roundCurrency(ctx.body.amount);
      if (amount <= 0) return errorResponse('Revenue amount must be greater than zero.', 400);

      const { data: existing } = await ctx.supabaseAdmin
        .from('finance_transactions')
        .select('id,transaction_code')
        .eq('source_module', ctx.body.source_module)
        .eq('source_type', ctx.body.source_type)
        .eq('source_record_id', String(ctx.body.source_record_id))
        .limit(1)
        .maybeSingle();

      if (existing) {
        return jsonResponse({ success: true, deduplicated: true, transaction_id: existing.id, transaction_code: existing.transaction_code });
      }

      const taxAmount = roundCurrency(ctx.body.tax_amount || 0);
      const transaction = await createFinanceTransaction(ctx.supabaseAdmin, {
        sourceModule: String(ctx.body.source_module),
        sourceType: String(ctx.body.source_type),
        direction: 'inflow',
        entityType: ctx.body.entity_type ? String(ctx.body.entity_type) : null,
        entityId: ctx.body.entity_id || null,
        sourceRecordId: String(ctx.body.source_record_id),
        externalReference: ctx.body.external_reference ? String(ctx.body.external_reference) : null,
        grossAmount: amount,
        taxAmount,
        netAmount: roundCurrency(amount - taxAmount),
        status: 'posted',
        createdBy: ctx.user!.userId,
        metadata: {
          owner_id: ctx.body.owner_id || null,
          generated_by: 'system',
          raw_source: ctx.body.raw_source || null,
        },
      });

      const ledger = await addLedgerEntry(ctx.supabaseAdmin, {
        transactionId: transaction.id,
        debitAccount: 'cash_master',
        creditAccount: inferRevenueAccount(String(ctx.body.source_type)),
        amount: roundCurrency(amount - taxAmount),
        source: String(ctx.body.source_module),
        refId: String(ctx.body.source_record_id),
        narration: `Revenue booked from ${ctx.body.source_type}`,
      });

      if (taxAmount > 0) {
        await addLedgerEntry(ctx.supabaseAdmin, {
          transactionId: transaction.id,
          debitAccount: 'cash_master',
          creditAccount: 'tax_payable_output',
          amount: taxAmount,
          source: 'tax',
          refId: transaction.id,
          narration: 'Tax withheld from revenue booking',
        });
      }

      if (ctx.body.commission_split) {
        const split = ctx.body.commission_split as Record<string, unknown>;
        const { data: commissionSplit } = await ctx.supabaseAdmin
          .from('finance_commission_splits')
          .insert({
            transaction_id: transaction.id,
            source_module: String(ctx.body.source_module),
            source_record_id: String(ctx.body.source_record_id),
            sale_amount: amount,
            platform_amount: roundCurrency(split.platform_amount || 0),
            influencer_amount: roundCurrency(split.influencer_amount || 0),
            reseller_amount: roundCurrency(split.reseller_amount || 0),
            franchise_amount: roundCurrency(split.franchise_amount || 0),
            tax_withheld: taxAmount,
            status: 'computed',
            metadata: split,
          })
          .select('*')
          .single();

        if (commissionSplit) {
          const payableEntries = [
            ['influencer', toNumber(split.influencer_amount)],
            ['reseller', toNumber(split.reseller_amount)],
            ['franchise', toNumber(split.franchise_amount)],
          ].filter(([, value]) => value > 0);

          for (const [targetType, splitAmount] of payableEntries) {
            await addLedgerEntry(ctx.supabaseAdmin, {
              transactionId: transaction.id,
              debitAccount: 'revenue_pool',
              creditAccount: payoutLiabilityAccount(targetType),
              amount: splitAmount,
              source: 'commission_split',
              refId: transaction.id,
              narration: `${targetType} commission reserved`,
            });
          }
        }
      }

      await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'revenue_recorded', 'transaction', transaction.id, {
        ledger_id: ledger.id,
        source_module: ctx.body.source_module,
        source_type: ctx.body.source_type,
        source_record_id: ctx.body.source_record_id,
      });

      return jsonResponse({ success: true, transaction, ledger }, 201);
    }, {
      module: 'finance',
      action: 'revenue',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/commission-split')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['transaction_id', 'sale_amount']);
      if (validation) return errorResponse(validation, 400);

      const transactionId = String(ctx.body.transaction_id);
      const saleAmount = roundCurrency(ctx.body.sale_amount);
      const splitPayload = {
        platform_amount: roundCurrency(ctx.body.platform_amount || 0),
        influencer_amount: roundCurrency(ctx.body.influencer_amount || 0),
        reseller_amount: roundCurrency(ctx.body.reseller_amount || 0),
        franchise_amount: roundCurrency(ctx.body.franchise_amount || 0),
        tax_withheld: roundCurrency(ctx.body.tax_withheld || 0),
      };

      const totalSplit = Object.values(splitPayload).reduce((sum, value) => sum + toNumber(value), 0);
      if (totalSplit > saleAmount) {
        return errorResponse('Commission split exceeds sale amount.', 400);
      }

      const { data: commissionSplit, error } = await ctx.supabaseAdmin
        .from('finance_commission_splits')
        .insert({
          transaction_id: transactionId,
          source_module: normalizeLower(ctx.body.source_module, 'finance'),
          source_record_id: ctx.body.source_record_id ? String(ctx.body.source_record_id) : null,
          sale_amount: saleAmount,
          ...splitPayload,
          status: 'computed',
          metadata: ctx.body.metadata || {},
        })
        .select('*')
        .single();

      if (error || !commissionSplit) return errorResponse(error?.message || 'Unable to store commission split', 400);

      await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'commission_split_recorded', 'commission_split', commissionSplit.id, {
        transaction_id: transactionId,
      });

      return jsonResponse({ success: true, commission_split: commissionSplit }, 201);
    }, {
      module: 'finance',
      action: 'commission_split',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/expense')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['category', 'amount', 'reason']);
      if (validation) return errorResponse(validation, 400);

      const amount = roundCurrency(ctx.body.amount);
      if (amount <= 0) return errorResponse('Expense amount must be greater than zero.', 400);

      const { data: expense, error } = await ctx.supabaseAdmin
        .from('finance_expenses')
        .insert({
          category: normalizeLower(ctx.body.category),
          subcategory: ctx.body.subcategory ? String(ctx.body.subcategory) : null,
          amount,
          reason: String(ctx.body.reason),
          requested_by: ctx.user!.userId,
          status: 'pending',
          metadata: ctx.body.metadata || {},
        })
        .select('*')
        .single();

      if (error || !expense) return errorResponse(error?.message || 'Unable to create expense request', 400);

      const approval = await createApprovalRequest(ctx.supabaseAdmin, {
        entityType: 'expense',
        entityId: expense.id,
        amount,
        requestedBy: ctx.user!.userId,
        metadata: { category: expense.category, reason: expense.reason },
        includeBoss: amount >= HIGH_AMOUNT_THRESHOLD,
      });

      await attachApprovalRequest(ctx.supabaseAdmin, 'expense', expense.id, approval.id);

      if (amount >= HIGH_AMOUNT_THRESHOLD) {
        await createAlert(
          ctx.supabaseAdmin,
          'high_expense',
          amount >= CRITICAL_AMOUNT_THRESHOLD ? 'critical' : 'high',
          'High-value expense awaiting approval',
          `Expense request of INR ${amount.toLocaleString('en-IN')} requires multi-level approval.`,
          { entityType: 'expense', entityId: expense.id, metadata: { approval_request_id: approval.id } },
        );
      }

      await notificationMiddleware(ctx, 'finance.expense.pending', {
        target_role: 'finance_manager',
        entity_id: expense.id,
        amount,
      });

      await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'expense_requested', 'expense', expense.id, {
        approval_request_id: approval.id,
      });

      return jsonResponse({ success: true, expense, approval }, 201);
    }, {
      module: 'finance',
      action: 'expense',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/payout')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const action = normalizeLower(ctx.body.action, 'request');

      if (action === 'request') {
        const validation = validateRequired(ctx.body, ['target_type', 'target_id', 'amount', 'otp_code', 'device_fingerprint']);
        if (validation) return errorResponse(validation, 400);

        const amount = roundCurrency(ctx.body.amount);
        if (amount <= 0) return errorResponse('Payout amount must be greater than zero.', 400);

        const balance = await resolvePayoutBalance(ctx.supabaseAdmin, String(ctx.body.target_type), String(ctx.body.target_id));
        if (balance.availableBalance < amount) {
          const blockedAlert = await createAlert(
            ctx.supabaseAdmin,
            'payout_pending',
            'high',
            'Payout blocked for insufficient verified balance',
            'Requested payout exceeds verified wallet balance.',
            {
              entityType: 'payout',
              metadata: {
                target_type: ctx.body.target_type,
                target_id: ctx.body.target_id,
                available_balance: balance.availableBalance,
                requested_amount: amount,
              },
            },
          );

          return errorResponse(`Insufficient verified balance for payout. Alert ${blockedAlert?.id || ''}`.trim(), 400);
        }

        const { data: otpVerification } = await ctx.supabaseAdmin.rpc('verify_otp', {
          p_user_id: ctx.user!.userId,
          p_otp_code: String(ctx.body.otp_code),
          p_otp_type: 'financial',
        });

        if (!otpVerification?.success) {
          return errorResponse(String(otpVerification?.error || 'OTP verification failed.'), 400);
        }

        const riskScore = roundCurrency((amount / Math.max(balance.availableBalance || 1, 1)) * 40 + (amount >= HIGH_AMOUNT_THRESHOLD ? 35 : 10));
        const { data: payout, error } = await ctx.supabaseAdmin
          .from('finance_payouts')
          .insert({
            target_type: normalizeLower(ctx.body.target_type),
            target_id: String(ctx.body.target_id),
            target_user_id: ctx.body.target_user_id || null,
            amount,
            eligibility_status: 'verified',
            approval_status: 'pending',
            payout_status: riskScore >= 70 ? 'blocked' : 'pending',
            otp_verified: true,
            otp_verification_id: otpVerification.verification_id,
            device_fingerprint: String(ctx.body.device_fingerprint),
            payment_method: ctx.body.payment_method ? String(ctx.body.payment_method) : 'bank_transfer',
            bank_details: ctx.body.bank_details || {},
            risk_score: riskScore,
            requested_by: ctx.user!.userId,
            metadata: {
              balance_source: balance.source,
              balance_snapshot: balance.availableBalance,
            },
          })
          .select('*')
          .single();

        if (error || !payout) return errorResponse(error?.message || 'Unable to create payout request', 400);

        const approval = await createApprovalRequest(ctx.supabaseAdmin, {
          entityType: 'payout',
          entityId: payout.id,
          amount,
          requestedBy: ctx.user!.userId,
          metadata: {
            target_type: payout.target_type,
            target_id: payout.target_id,
            otp_verification_id: payout.otp_verification_id,
          },
          includeBoss: true,
        });
        await attachApprovalRequest(ctx.supabaseAdmin, 'payout', payout.id, approval.id);

        if (riskScore >= 70) {
          await createAlert(
            ctx.supabaseAdmin,
            'fraud_detected',
            riskScore >= 90 ? 'critical' : 'high',
            'Payout anomaly blocked',
            'Finance payout engine blocked a payout because the payout risk score exceeded the allowed threshold.',
            {
              entityType: 'payout',
              entityId: payout.id,
              metadata: { risk_score: riskScore },
            },
          );
        }

        await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'payout_requested', 'payout', payout.id, {
          approval_request_id: approval.id,
          risk_score: riskScore,
        });

        return jsonResponse({ success: true, payout, approval }, 201);
      }

      if (action === 'approve') {
        const validation = validateRequired(ctx.body, ['payout_id', 'decision']);
        if (validation) return errorResponse(validation, 400);

        const { data: payout } = await ctx.supabaseAdmin
          .from('finance_payouts')
          .select('*')
          .eq('id', ctx.body.payout_id)
          .maybeSingle();
        if (!payout) return errorResponse('Payout request not found.', 404);

        const { data: approval } = await ctx.supabaseAdmin
          .from('finance_approval_requests')
          .select('*')
          .eq('id', payout.approval_request_id)
          .maybeSingle();
        if (!approval) return errorResponse('Approval workflow not found for payout.', 404);

        const decision = normalizeLower(ctx.body.decision);
        if (!['approve', 'reject'].includes(decision)) {
          return errorResponse('Decision must be approve or reject.', 400);
        }

        if (decision === 'reject') {
          await ctx.supabaseAdmin.from('finance_payouts').update({
            approval_status: 'rejected',
            payout_status: 'rejected',
            rejection_reason: ctx.body.reason ? String(ctx.body.reason) : 'Rejected by approver',
          }).eq('id', payout.id);

          await ctx.supabaseAdmin.from('finance_approval_requests').update({
            status: 'rejected',
            notes: ctx.body.reason ? String(ctx.body.reason) : approval.notes,
          }).eq('id', approval.id);

          await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'payout_rejected', 'payout', payout.id, {
            approval_request_id: approval.id,
          });

          return jsonResponse({ success: true, payout_id: payout.id, status: 'rejected' });
        }

        const role = ctx.user!.role;
        const requiredLevels = normalizeArray(approval.required_levels);
        const updates: Record<string, unknown> = {};
        const approvalUpdates: Record<string, unknown> = {};

        if (requiredLevels.includes('manager_approval') && !approval.manager_approved_at && FINANCE_ALLOWED_ROLES.includes(role)) {
          updates.approval_status = requiredLevels.includes('boss_approval') ? 'manager_approved' : 'approved';
          updates.manager_approved_by = ctx.user!.userId;
          approvalUpdates.manager_approved_by = ctx.user!.userId;
          approvalUpdates.manager_approved_at = new Date().toISOString();
          approvalUpdates.current_level = requiredLevels.includes('boss_approval') ? 'boss_approval' : 'complete';
        }

        if (requiredLevels.includes('boss_approval') && ['boss_owner', 'super_admin', 'ceo', 'admin'].includes(role)) {
          updates.approval_status = 'approved';
          updates.boss_approved_by = ctx.user!.userId;
          updates.approved_at = new Date().toISOString();
          approvalUpdates.boss_approved_by = ctx.user!.userId;
          approvalUpdates.boss_approved_at = new Date().toISOString();
          approvalUpdates.current_level = 'complete';
          approvalUpdates.status = 'approved';
        }

        if (requiredLevels.includes('boss_approval') && !['boss_owner', 'super_admin', 'ceo', 'admin'].includes(role)) {
          return errorResponse('Boss approval is required for this payout.', 403);
        }

        if (!requiredLevels.includes('boss_approval')) {
          approvalUpdates.status = 'approved';
          updates.approved_at = new Date().toISOString();
        }

        await ctx.supabaseAdmin.from('finance_payouts').update(updates).eq('id', payout.id);
        await ctx.supabaseAdmin.from('finance_approval_requests').update(approvalUpdates).eq('id', approval.id);

        await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'payout_approved', 'payout', payout.id, {
          approval_request_id: approval.id,
          current_level: approvalUpdates.current_level || approval.current_level,
        });

        return jsonResponse({ success: true, payout_id: payout.id, approval_status: updates.approval_status || payout.approval_status });
      }

      if (action === 'pay') {
        const validation = validateRequired(ctx.body, ['payout_id', 'transaction_reference']);
        if (validation) return errorResponse(validation, 400);

        const { data: payout } = await ctx.supabaseAdmin
          .from('finance_payouts')
          .select('*')
          .eq('id', ctx.body.payout_id)
          .maybeSingle();
        if (!payout) return errorResponse('Payout request not found.', 404);
        if (payout.approval_status !== 'approved') return errorResponse('Payout must be fully approved before payment.', 400);
        if (payout.payout_status === 'paid') return errorResponse('Payout already completed.', 409);

        const transaction = await createFinanceTransaction(ctx.supabaseAdmin, {
          sourceModule: 'payout',
          sourceType: 'payout',
          direction: 'outflow',
          entityType: 'payout',
          entityId: payout.id,
          sourceRecordId: payout.payout_code,
          externalReference: String(ctx.body.transaction_reference),
          grossAmount: payout.amount,
          netAmount: payout.amount,
          status: 'paid',
          createdBy: ctx.user!.userId,
          managerApprovedBy: payout.manager_approved_by,
          bossApprovedBy: payout.boss_approved_by,
          approvedAt: payout.approved_at || new Date().toISOString(),
          postedAt: new Date().toISOString(),
          metadata: { target_type: payout.target_type, target_id: payout.target_id },
        });

        const ledger = await addLedgerEntry(ctx.supabaseAdmin, {
          transactionId: transaction.id,
          debitAccount: payoutLiabilityAccount(payout.target_type),
          creditAccount: 'cash_master',
          amount: payout.amount,
          source: 'payout',
          refId: payout.id,
          narration: `Payout settled for ${payout.target_type}`,
        });

        await ctx.supabaseAdmin.from('finance_payouts').update({
          payout_status: 'paid',
          paid_at: new Date().toISOString(),
          transaction_reference: String(ctx.body.transaction_reference),
          reference_transaction_id: transaction.id,
        }).eq('id', payout.id);

        await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'payout_paid', 'payout', payout.id, {
          transaction_id: transaction.id,
          ledger_id: ledger.id,
        });

        return jsonResponse({ success: true, payout_id: payout.id, transaction, ledger });
      }

      return errorResponse('Unsupported payout action.', 400);
    }, {
      module: 'finance',
      action: 'payout',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/refund')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const action = normalizeLower(ctx.body.action, 'request');

      if (action === 'request') {
        const validation = validateRequired(ctx.body, ['transaction_id', 'amount', 'reason']);
        if (validation) return errorResponse(validation, 400);

        const amount = roundCurrency(ctx.body.amount);
        const { data: transaction } = await ctx.supabaseAdmin
          .from('finance_transactions')
          .select('*')
          .eq('id', ctx.body.transaction_id)
          .maybeSingle();
        if (!transaction) return errorResponse('Original transaction not found.', 404);
        if (amount <= 0 || amount > toNumber(transaction.net_amount)) {
          return errorResponse('Refund amount must be positive and cannot exceed the original transaction amount.', 400);
        }

        const { data: refund, error } = await ctx.supabaseAdmin
          .from('finance_refunds')
          .insert({
            transaction_id: transaction.id,
            amount,
            reason: String(ctx.body.reason),
            requested_by: ctx.user!.userId,
            status: 'pending',
            metadata: ctx.body.metadata || {},
          })
          .select('*')
          .single();

        if (error || !refund) return errorResponse(error?.message || 'Unable to create refund request', 400);

        const approval = await createApprovalRequest(ctx.supabaseAdmin, {
          entityType: 'refund',
          entityId: refund.id,
          amount,
          requestedBy: ctx.user!.userId,
          metadata: { transaction_id: transaction.id },
          includeBoss: amount >= HIGH_AMOUNT_THRESHOLD,
        });
        await attachApprovalRequest(ctx.supabaseAdmin, 'refund', refund.id, approval.id);

        await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'refund_requested', 'refund', refund.id, {
          transaction_id: transaction.id,
          approval_request_id: approval.id,
        });

        return jsonResponse({ success: true, refund, approval }, 201);
      }

      if (action === 'approve') {
        const validation = validateRequired(ctx.body, ['refund_id']);
        if (validation) return errorResponse(validation, 400);

        const { data: refund } = await ctx.supabaseAdmin
          .from('finance_refunds')
          .select('*')
          .eq('id', ctx.body.refund_id)
          .maybeSingle();
        if (!refund) return errorResponse('Refund request not found.', 404);

        const { data: originalTx } = await ctx.supabaseAdmin
          .from('finance_transactions')
          .select('*')
          .eq('id', refund.transaction_id)
          .maybeSingle();
        if (!originalTx) return errorResponse('Original transaction not found.', 404);

        const refundTransaction = await createFinanceTransaction(ctx.supabaseAdmin, {
          sourceModule: 'refund',
          sourceType: 'refund',
          direction: 'outflow',
          entityType: 'refund',
          entityId: refund.id,
          sourceRecordId: refund.refund_code,
          grossAmount: refund.amount,
          netAmount: refund.amount,
          status: 'refunded',
          createdBy: ctx.user!.userId,
          metadata: { original_transaction_id: originalTx.id },
        });

        const ledger = await addLedgerEntry(ctx.supabaseAdmin, {
          transactionId: refundTransaction.id,
          debitAccount: 'expense_refund',
          creditAccount: 'cash_master',
          amount: refund.amount,
          source: 'refund',
          refId: refund.id,
          narration: `Refund reversal for ${originalTx.transaction_code}`,
        });

        await ctx.supabaseAdmin.from('finance_refunds').update({
          status: 'processed',
          approved_by: ctx.user!.userId,
          approved_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          refund_transaction_id: refundTransaction.id,
        }).eq('id', refund.id);

        await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'refund_processed', 'refund', refund.id, {
          refund_transaction_id: refundTransaction.id,
          ledger_id: ledger.id,
        });

        return jsonResponse({ success: true, refund_id: refund.id, refund_transaction: refundTransaction, ledger });
      }

      if (action === 'reject') {
        const validation = validateRequired(ctx.body, ['refund_id']);
        if (validation) return errorResponse(validation, 400);

        await ctx.supabaseAdmin.from('finance_refunds').update({
          status: 'rejected',
          approved_by: ctx.user!.userId,
          approved_at: new Date().toISOString(),
          metadata: { rejection_reason: ctx.body.reason || 'Rejected by finance' },
        }).eq('id', ctx.body.refund_id);

        await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'refund_rejected', 'refund', String(ctx.body.refund_id), {
          reason: ctx.body.reason || null,
        });

        return jsonResponse({ success: true, refund_id: ctx.body.refund_id, status: 'rejected' });
      }

      return errorResponse('Unsupported refund action.', 400);
    }, {
      module: 'finance',
      action: 'refund',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/invoice')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['user_id', 'amount']);
      if (validation) return errorResponse(validation, 400);

      const invoice = await createInvoiceRecord(ctx.supabaseAdmin, {
        userId: String(ctx.body.user_id),
        amount: roundCurrency(ctx.body.amount),
        tax: roundCurrency(ctx.body.tax || 0),
        currency: ctx.body.currency ? String(ctx.body.currency) : 'INR',
        pdfLink: ctx.body.pdf_link ? String(ctx.body.pdf_link) : null,
      });

      if (ctx.body.transaction_id) {
        await ctx.supabaseAdmin.from('finance_transactions').update({ invoice_id: invoice.invoice_id }).eq('id', ctx.body.transaction_id);
      }

      await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'invoice_generated', 'invoice', invoice.invoice_id, {
        transaction_id: ctx.body.transaction_id || null,
      });

      return jsonResponse({ success: true, invoice }, 201);
    }, {
      module: 'finance',
      action: 'invoice',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/tax', '/tax-calc')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['base_amount']);
      if (validation) return errorResponse(validation, 400);

      const baseAmount = roundCurrency(ctx.body.base_amount);
      const gstRate = toNumber(ctx.body.gst_rate, 18);
      const tdsRate = toNumber(ctx.body.tds_rate, 1);
      const regionalRate = toNumber(ctx.body.regional_rate, 0);
      const regionCode = ctx.body.region_code ? String(ctx.body.region_code) : 'IN';

      const records = [] as Array<Record<string, unknown>>;
      const taxSpecs = [
        ['gst', gstRate],
        ['tds', tdsRate],
        ['regional', regionalRate],
      ] as const;

      for (const [taxType, rate] of taxSpecs) {
        if (rate <= 0) continue;
        const taxAmount = roundCurrency((baseAmount * rate) / 100);
        const { data: record } = await ctx.supabaseAdmin
          .from('finance_tax_records')
          .insert({
            transaction_id: ctx.body.transaction_id || null,
            tax_type: taxType,
            region_code: regionCode,
            base_amount: baseAmount,
            tax_rate: Number((rate / 100).toFixed(4)),
            tax_amount: taxAmount,
            metadata: ctx.body.metadata || {},
          })
          .select('*')
          .single();
        if (record) records.push(record);
      }

      await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'tax_calculated', 'tax', null, {
        transaction_id: ctx.body.transaction_id || null,
        total_tax_records: records.length,
      });

      return jsonResponse({
        success: true,
        taxes: records,
        total_tax: roundCurrency(records.reduce((sum, record: any) => sum + toNumber(record.tax_amount), 0)),
      }, 201);
    }, {
      module: 'finance',
      action: 'tax',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/fraud-check', '/fraud-scan')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const transactionId = ctx.body.transaction_id ? String(ctx.body.transaction_id) : null;
      const payoutId = ctx.body.payout_id ? String(ctx.body.payout_id) : null;

      let flagged = false;
      let reasons: string[] = [];
      let riskScore = 0;

      if (transactionId) {
        const { data: transaction } = await ctx.supabaseAdmin
          .from('finance_transactions')
          .select('*')
          .eq('id', transactionId)
          .maybeSingle();
        if (!transaction) return errorResponse('Finance transaction not found.', 404);

        const { data: duplicates } = await ctx.supabaseAdmin
          .from('finance_transactions')
          .select('id')
          .eq('source_module', transaction.source_module)
          .eq('source_type', transaction.source_type)
          .eq('source_record_id', transaction.source_record_id)
          .limit(5);

        if ((duplicates || []).length > 1) {
          flagged = true;
          riskScore += 35;
          reasons.push('duplicate_transaction');
          await ctx.supabaseAdmin.from('finance_transactions').update({ fraud_flag: true, status: 'blocked' }).eq('id', transaction.id);
          await createAlert(ctx.supabaseAdmin, 'duplicate_transaction', 'high', 'Duplicate finance transaction detected', 'Transaction source record appeared more than once.', {
            transactionId: transaction.id,
            entityType: 'transaction',
            entityId: transaction.id,
          });
        }

        if (toNumber(transaction.gross_amount) >= CRITICAL_AMOUNT_THRESHOLD) {
          flagged = true;
          riskScore += 30;
          reasons.push('abnormal_spike');
        }

        if (transaction.mismatch_flag) {
          flagged = true;
          riskScore += 25;
          reasons.push('ledger_mismatch');
        }
      }

      if (payoutId) {
        const { data: payout } = await ctx.supabaseAdmin
          .from('finance_payouts')
          .select('*')
          .eq('id', payoutId)
          .maybeSingle();
        if (!payout) return errorResponse('Finance payout not found.', 404);
        if (toNumber(payout.risk_score) >= 70) {
          flagged = true;
          riskScore += toNumber(payout.risk_score);
          reasons.push('abnormal_payout');
          await ctx.supabaseAdmin.from('finance_payouts').update({ payout_status: 'blocked', approval_status: 'blocked' }).eq('id', payout.id);
          await createAlert(ctx.supabaseAdmin, 'fraud_detected', 'critical', 'Payout blocked by finance fraud engine', 'Payout risk score exceeded the safe threshold.', {
            entityType: 'payout',
            entityId: payout.id,
            metadata: { risk_score: payout.risk_score },
          });
        }
      }

      await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'fraud_scan', transactionId ? 'transaction' : payoutId ? 'payout' : 'finance', transactionId || payoutId, {
        flagged,
        risk_score: riskScore,
        reasons,
      });

      return jsonResponse({ success: true, flagged, blocked: flagged, risk_score: riskScore, reasons });
    }, {
      module: 'finance',
      action: 'fraud_check',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  if (method === 'POST' && matchesPath(path, '/reconcile')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ['bank_inflow', 'bank_outflow']);
      if (validation) return errorResponse(validation, 400);

      const { data: transactions } = await ctx.supabaseAdmin.from('finance_transactions').select('direction,net_amount').order('created_at', { ascending: false }).limit(500);
      const systemInflow = roundCurrency((transactions || []).filter((item: any) => item.direction === 'inflow').reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0));
      const systemOutflow = roundCurrency((transactions || []).filter((item: any) => item.direction === 'outflow').reduce((sum: number, item: any) => sum + toNumber(item.net_amount), 0));
      const bankInflow = roundCurrency(ctx.body.bank_inflow);
      const bankOutflow = roundCurrency(ctx.body.bank_outflow);
      const mismatchAmount = roundCurrency(Math.abs(bankInflow - systemInflow) + Math.abs(bankOutflow - systemOutflow));

      const { data: reconciliation, error } = await ctx.supabaseAdmin
        .from('finance_reconciliations')
        .insert({
          reconciliation_date: ctx.body.reconciliation_date || new Date().toISOString().slice(0, 10),
          bank_inflow: bankInflow,
          bank_outflow: bankOutflow,
          system_inflow: systemInflow,
          system_outflow: systemOutflow,
          mismatch_amount: mismatchAmount,
          status: mismatchAmount > 0 ? 'issue_detected' : 'matched',
          notes: ctx.body.notes || null,
          created_by: ctx.user!.userId,
        })
        .select('*')
        .single();

      if (error || !reconciliation) return errorResponse(error?.message || 'Unable to create reconciliation', 400);

      if (mismatchAmount > 0) {
        await createAlert(
          ctx.supabaseAdmin,
          'mismatch',
          mismatchAmount >= HIGH_AMOUNT_THRESHOLD ? 'critical' : 'high',
          'Bank reconciliation mismatch detected',
          'Reconciliation engine detected a difference between bank data and system data.',
          { entityType: 'reconciliation', entityId: reconciliation.id, metadata: { mismatch_amount: mismatchAmount } },
        );
      }

      await logFinanceAudit(ctx.supabaseAdmin, ctx.user!.userId, ctx.user!.role, 'finance', 'reconciliation_run', 'reconciliation', reconciliation.id, {
        mismatch_amount: mismatchAmount,
      });

      return jsonResponse({ success: true, reconciliation }, 201);
    }, {
      module: 'finance',
      action: 'reconcile',
      allowedRoles: FINANCE_ALLOWED_ROLES,
    });
  }

  return errorResponse('Finance route not found', 404);
});
