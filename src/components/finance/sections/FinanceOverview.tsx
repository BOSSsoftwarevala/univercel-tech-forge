/**
 * FINANCE OVERVIEW SECTION
 * Live finance control center backed by api-finance
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Wallet,
  Scale,
  Landmark,
  Siren,
  Radar,
  ScanLine,
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import { financeApi, type FinanceOverviewResponse } from '@/lib/api/finance';

interface FinanceOverviewProps {
  activeView: FinanceView;
}

const FinanceOverview: React.FC<FinanceOverviewProps> = ({ activeView }) => {
  const { refresh, export: exportData } = useGlobalActions();
  const [overview, setOverview] = useState<FinanceOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);
        const data = await financeApi.getOverview();
        if (!cancelled) {
          setOverview(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load finance overview');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  const getTitle = () => {
    switch (activeView) {
      case 'overview_total_balance':
        return 'Total Revenue Control';
      case 'overview_today_inflow':
        return 'Today Inflow';
      case 'overview_today_outflow':
        return 'Today Outflow';
      case 'overview_net_profit':
        return 'Net Profit / Loss';
      case 'overview_pending':
        return 'Pending Payments';
      default:
        return 'Finance Overview';
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

  const formatTime = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' });
  };

  const engineTone: Record<string, string> = {
    live: 'text-emerald-600 border-emerald-200',
    stable: 'text-blue-600 border-blue-200',
    idle: 'text-slate-500 border-slate-200',
    attention: 'text-amber-600 border-amber-200',
    blocking: 'text-red-600 border-red-200',
    immutable: 'text-violet-600 border-violet-200',
  };

  const summaryCards = overview ? [
    { label: 'Total Revenue', value: formatCurrency(overview.summary.total_revenue), change: `${overview.summary.mismatch_count} mismatch`, trend: overview.summary.mismatch_count > 0 ? 'down' : 'up', icon: CircleDollarSign },
    { label: 'Today Inflow', value: formatCurrency(overview.summary.today_inflow), change: `${overview.summary.open_alerts} alerts`, trend: overview.summary.open_alerts > 0 ? 'down' : 'up', icon: TrendingUp },
    { label: 'Today Outflow', value: formatCurrency(overview.summary.today_outflow), change: `${overview.summary.pending_approvals} approvals`, trend: overview.summary.pending_approvals > 0 ? 'down' : 'up', icon: TrendingDown },
    { label: 'Net Profit', value: formatCurrency(overview.summary.net_profit), change: overview.summary.net_profit >= 0 ? 'healthy' : 'negative', trend: overview.summary.net_profit >= 0 ? 'up' : 'down', icon: BarChart3 },
    { label: 'Pending Payments', value: formatCurrency(overview.summary.pending_payments), change: `${overview.summary.fraud_count} fraud`, trend: overview.summary.fraud_count > 0 ? 'down' : 'up', icon: Clock },
  ] : [];

  const highlightMetric = overview ? {
    overview_total_balance: { label: 'Total Revenue', value: formatCurrency(overview.summary.total_revenue), icon: CircleDollarSign },
    overview_today_inflow: { label: 'Today Inflow', value: formatCurrency(overview.summary.today_inflow), icon: TrendingUp },
    overview_today_outflow: { label: 'Today Outflow', value: formatCurrency(overview.summary.today_outflow), icon: TrendingDown },
    overview_net_profit: { label: 'Net Profit', value: formatCurrency(overview.summary.net_profit), icon: BarChart3 },
    overview_pending: { label: 'Pending Payments', value: formatCurrency(overview.summary.pending_payments), icon: Clock },
  }[activeView] : null;

  const handleRefresh = () => {
    refresh('report');
    setLoading(true);
    financeApi.getOverview()
      .then((data) => {
        setOverview(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to refresh finance overview');
      })
      .finally(() => setLoading(false));
  };

  const handleExport = () => {
    exportData('report', 'pdf', { view: activeView });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time money system with audit, payout, tax, fraud, and mismatch visibility</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900">
          <CardContent className="p-4 flex items-center gap-3 text-red-700 dark:text-red-300">
            <ShieldAlert className="w-5 h-5" />
            <div>
              <p className="font-medium">Finance control center is not synced</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading && !overview ? Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 space-y-3">
              <div className="h-5 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-8 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </CardContent>
          </Card>
        )) : summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <Badge
                    variant="outline"
                    className={card.trend === 'up' ? 'text-emerald-600 border-emerald-200' : 'text-red-600 border-red-200'}
                  >
                    {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {card.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {overview && highlightMetric ? (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Focus Metric</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{highlightMetric.value}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{highlightMetric.label}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
              <highlightMetric.icon className="w-7 h-7 text-blue-600 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {overview ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 xl:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Radar className="w-5 h-5 text-blue-500" />
                Engine Status
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(overview.engine_status).map(([engine, status]) => (
                <div key={engine} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium capitalize text-slate-900 dark:text-white">{engine.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time money subsystem health</p>
                    </div>
                    <Badge variant="outline" className={engineTone[status] || 'text-slate-500 border-slate-200'}>
                      {status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Siren className="w-5 h-5 text-amber-500" />
                Live Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overview.alerts.length === 0 ? (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                  No active mismatch, fraud, or payout alerts.
                </div>
              ) : overview.alerts.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{alert.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{alert.message}</p>
                    </div>
                    <Badge variant="outline" className={engineTone[alert.severity === 'critical' ? 'blocking' : alert.severity === 'high' ? 'attention' : 'stable'] || ''}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">{formatTime(alert.created_at)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {overview ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 xl:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" />
                Revenue Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overview.source_breakdown.map((source) => (
                <div key={source.source} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950/40 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{source.source.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">System-generated inflow only</p>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-300">{formatCurrency(source.amount)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-500" />
                Balance Sheet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Assets</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(overview.balance_sheet.assets)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Liabilities</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(overview.balance_sheet.liabilities)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Equity</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(overview.balance_sheet.equity)}</span></div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-500" />
                Cash Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Inflow</span><span className="font-semibold text-emerald-600">{formatCurrency(overview.cash_flow.inflow)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Outflow</span><span className="font-semibold text-red-600">{formatCurrency(overview.cash_flow.outflow)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Net</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(overview.cash_flow.net)}</span></div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!overview && loading ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            )) : overview?.recent_transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.direction === 'inflow' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {txn.direction === 'inflow' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{txn.transaction_code}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {txn.source_module} · {txn.source_type.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.direction === 'inflow' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {txn.direction === 'inflow' ? '+' : '-'}{formatCurrency(txn.net_amount)}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-slate-500">{formatTime(txn.created_at)}</span>
                    <Badge variant={txn.status === 'posted' || txn.status === 'paid' ? 'default' : 'secondary'} className="text-[10px] capitalize">
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {overview ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                Pending Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overview.pending_payouts.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No payout queue right now.</p>
              ) : overview.pending_payouts.map((payout) => (
                <div key={payout.id} className="rounded-xl bg-slate-50 dark:bg-slate-950/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{payout.payout_code}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{payout.target_type}</p>
                    </div>
                    <Badge variant="outline" className={payout.risk_score >= 70 ? 'text-red-600 border-red-200' : 'text-amber-600 border-amber-200'}>
                      risk {payout.risk_score}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(payout.amount)}</span>
                    <span className="text-slate-500 capitalize">{payout.approval_status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-rose-500" />
                Pending Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overview.pending_expenses.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No pending expense approvals.</p>
              ) : overview.pending_expenses.map((expense) => (
                <div key={expense.id} className="rounded-xl bg-slate-50 dark:bg-slate-950/40 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{expense.category}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{expense.reason}</p>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-200 capitalize">{expense.status}</Badge>
                  </div>
                  <p className="mt-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-violet-500" />
                Tax + Refund Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Taxes</p>
                <div className="space-y-2">
                  {overview.taxes.slice(0, 3).map((tax) => (
                    <div key={tax.id} className="flex items-center justify-between">
                      <span className="capitalize text-slate-600 dark:text-slate-300">{tax.tax_type}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(tax.tax_amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Refunds</p>
                <div className="space-y-2">
                  {overview.refunds.slice(0, 3).map((refund) => (
                    <div key={refund.id} className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">{refund.refund_code}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(refund.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default FinanceOverview;
