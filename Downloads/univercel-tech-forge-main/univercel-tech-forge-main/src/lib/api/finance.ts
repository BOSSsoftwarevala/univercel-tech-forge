import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const response = await callEdgeRoute<T>('api-finance', path, { query });
  return response.data;
}

export interface FinanceOverviewSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  pending_payments: number;
  today_inflow: number;
  today_outflow: number;
  mismatch_count: number;
  open_alerts: number;
  fraud_count: number;
  pending_approvals: number;
}

export interface FinanceSourceBreakdown {
  source: string;
  amount: number;
}

export interface FinanceTransactionItem {
  id: string;
  transaction_code: string;
  source_module: string;
  source_type: string;
  direction: 'inflow' | 'outflow';
  status: string;
  net_amount: number;
  gross_amount: number;
  created_at: string;
  entity_type?: string | null;
  entity_id?: string | null;
}

export interface FinanceAlertItem {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  title: string;
  message: string;
  created_at: string;
}

export interface FinancePayoutItem {
  id: string;
  payout_code: string;
  target_type: string;
  amount: number;
  approval_status: string;
  payout_status: string;
  risk_score: number;
  created_at: string;
}

export interface FinanceExpenseItem {
  id: string;
  category: string;
  amount: number;
  status: string;
  reason: string;
  created_at: string;
}

export interface FinanceTaxItem {
  id: string;
  tax_type: string;
  tax_amount: number;
  tax_rate: number;
  region_code?: string | null;
  created_at: string;
}

export interface FinanceRefundItem {
  id: string;
  refund_code: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface FinanceReconciliationItem {
  id: string;
  reconciliation_date: string;
  mismatch_amount: number;
  status: string;
  created_at: string;
}

export interface FinanceOverviewResponse {
  summary: FinanceOverviewSummary;
  source_breakdown: FinanceSourceBreakdown[];
  balance_sheet: {
    assets: number;
    liabilities: number;
    equity: number;
  };
  profit_and_loss: {
    revenue: number;
    expenses: number;
    refunds: number;
    tax: number;
    net_profit: number;
  };
  cash_flow: {
    inflow: number;
    outflow: number;
    net: number;
  };
  engine_status: Record<string, string>;
  recent_transactions: FinanceTransactionItem[];
  pending_payouts: FinancePayoutItem[];
  pending_expenses: FinanceExpenseItem[];
  alerts: FinanceAlertItem[];
  taxes: FinanceTaxItem[];
  refunds: FinanceRefundItem[];
  reconciliations: FinanceReconciliationItem[];
}

export const financeApi = {
  async getOverview() {
    return getRoute<FinanceOverviewResponse>('overview');
  },

  async getTransactions(query?: Record<string, string | number | boolean | undefined | null>) {
    return getRoute<{ transactions: FinanceTransactionItem[] }>('transactions', query);
  },

  async getAccounting() {
    return getRoute<Pick<FinanceOverviewResponse, 'balance_sheet' | 'profit_and_loss' | 'cash_flow' | 'taxes' | 'reconciliations'>>('accounting');
  },

  async getAudit(limit?: number) {
    return getRoute<{ audit: Array<Record<string, unknown>> }>('audit', { limit });
  },
};