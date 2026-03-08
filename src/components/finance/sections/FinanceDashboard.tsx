/**
 * FINANCE DASHBOARD SECTION - CONNECTED TO REAL DATA
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CircleDollarSign, TrendingUp, TrendingDown, BarChart3, Clock, AlertTriangle,
  ArrowUpRight, ArrowDownRight, RefreshCw, Download, Bell, CreditCard,
  CheckCircle, XCircle, ArrowRightLeft, Loader2
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useFinanceStats, useTransactions, usePayouts, formatINR } from '@/hooks/useFinanceData';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Props { activeView: FinanceView; }

const FinanceDashboard: React.FC<Props> = ({ activeView }) => {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useFinanceStats();
  const { data: recentTxns, isLoading: txnLoading } = useTransactions(10);
  const { data: payouts, isLoading: payoutsLoading } = usePayouts(10);

  const isLoading = statsLoading;

  const getTitle = () => {
    const titles: Record<string, string> = {
      dash_financial_overview: 'Financial Overview',
      dash_revenue_summary: 'Revenue Summary',
      dash_expense_summary: 'Expense Summary',
      dash_profit_loss: 'Profit & Loss',
      dash_recent_transactions: 'Recent Transactions',
      dash_pending_payments: 'Pending Payments',
      dash_alerts: 'Financial Alerts',
    };
    return titles[activeView] || 'Dashboard';
  };

  const kpiCards = [
    { label: 'Total Revenue', value: formatINR(stats?.totalRevenue || 0), icon: CircleDollarSign, color: '#2ca01c' },
    { label: 'Total Expenses', value: formatINR(stats?.totalExpenses || 0), icon: TrendingDown, color: '#ef4444' },
    { label: 'Net Profit', value: formatINR(stats?.netProfit || 0), icon: BarChart3, color: '#3b82f6' },
    { label: 'Pending', value: formatINR(stats?.pendingAmount || 0), icon: Clock, color: '#f59e0b' },
    { label: 'Payouts Due', value: formatINR(stats?.payoutsDue || 0), icon: CreditCard, color: '#8b5cf6' },
  ];

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      success: 'bg-[#dcfce7] text-[#16a34a]', completed: 'bg-[#dcfce7] text-[#16a34a]',
      pending: 'bg-[#fef3c7] text-[#d97706]', processing: 'bg-[#dbeafe] text-[#2563eb]',
      failed: 'bg-[#fee2e2] text-[#dc2626]', approved: 'bg-[#dcfce7] text-[#16a34a]',
      rejected: 'bg-[#fee2e2] text-[#dc2626]',
    };
    return map[status] || 'bg-[#f3f4f6] text-[#6b7280]';
  };

  if (activeView === 'dash_alerts') {
    const pendingPayouts = (payouts || []).filter(p => p.status === 'pending');
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#0d333f]">Financial Alerts</h2>
            <p className="text-[13px] text-[#6b7280]">Important notifications requiring attention</p>
          </div>
        </div>
        {pendingPayouts.length > 0 ? (
          <div className="space-y-3">
            {pendingPayouts.map(p => (
              <Card key={p.payout_id} className="bg-white border-[#e5e7eb] border-l-4 border-l-[#f59e0b]">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                    <div>
                      <p className="text-[13px] font-medium text-[#0d333f]">Pending Payout Request</p>
                      <p className="text-[11px] text-[#6b7280]">{p.user_role} · {p.payment_method} · {format(new Date(p.requested_at || p.timestamp), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  <span className="text-[15px] font-bold text-[#0d333f]">{formatINR(p.amount)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-[#e5e7eb]">
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
              <p className="text-[14px] font-medium text-[#6b7280]">No alerts at this time</p>
              <p className="text-[12px] text-[#9ca3af] mt-1">Financial alerts will appear here when triggered</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (activeView === 'dash_pending_payments') {
    const pendingPayouts = (payouts || []).filter(p => p.status === 'pending' || p.status === 'approved' || p.status === 'processing');
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#0d333f]">Pending Payments</h2>
            <p className="text-[13px] text-[#6b7280]">Payments awaiting processing or approval</p>
          </div>
          <Button size="sm" className="bg-[#2ca01c] hover:bg-[#249317] text-white text-[12px]" onClick={() => refetchStats()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
        </div>
        {pendingPayouts.length > 0 ? (
          <Card className="bg-white border-[#e5e7eb]">
            <CardContent className="p-0">
              <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                <span>ID</span><span>Role</span><span>Method</span><span>Amount</span><span>Status</span><span>Requested</span>
              </div>
              {pendingPayouts.map(p => (
                <div key={p.payout_id} className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-[#f3f4f6] text-[12px] hover:bg-[#f9fafb]">
                  <span className="font-mono text-[11px] text-[#6b7280]">{p.payout_id.substring(0, 8)}</span>
                  <span className="capitalize">{p.user_role}</span>
                  <span className="capitalize">{p.payment_method?.replace('_', ' ')}</span>
                  <span className="font-semibold">{formatINR(p.amount)}</span>
                  <Badge className={`text-[10px] ${statusColor(p.status)}`}>{p.status}</Badge>
                  <span className="text-[#6b7280]">{format(new Date(p.requested_at || p.timestamp), 'dd MMM yy')}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border-[#e5e7eb]">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
              <p className="text-[14px] font-medium text-[#6b7280]">No pending payments</p>
              <p className="text-[12px] text-[#9ca3af] mt-1">All payments are up to date</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (activeView === 'dash_recent_transactions') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#0d333f]">Recent Transactions</h2>
            <p className="text-[13px] text-[#6b7280]">Latest financial activity</p>
          </div>
          <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
        </div>
        {txnLoading ? (
          <Card className="bg-white border-[#e5e7eb]"><CardContent className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#2ca01c] mx-auto" /></CardContent></Card>
        ) : (recentTxns || []).length > 0 ? (
          <Card className="bg-white border-[#e5e7eb]">
            <CardContent className="p-0">
              <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                <span>ID</span><span>Type</span><span>Amount</span><span>Status</span><span>Date</span>
              </div>
              {(recentTxns || []).map(t => (
                <div key={t.transaction_id} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#f3f4f6] text-[12px] hover:bg-[#f9fafb]">
                  <span className="font-mono text-[11px] text-[#6b7280]">{t.transaction_id.substring(0, 8)}</span>
                  <span className="capitalize">{t.type?.replace(/_/g, ' ')}</span>
                  <span className="font-semibold">{formatINR(t.amount)}</span>
                  <Badge className={`text-[10px] ${statusColor(t.status)}`}>{t.status}</Badge>
                  <span className="text-[#6b7280]">{format(new Date(t.timestamp), 'dd MMM yy')}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border-[#e5e7eb]">
            <CardContent className="p-8 text-center">
              <ArrowRightLeft className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
              <p className="text-[14px] font-medium text-[#6b7280]">No transactions yet</p>
              <p className="text-[12px] text-[#9ca3af] mt-1">Transactions will appear here as they occur</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0d333f]">{getTitle()}</h2>
          <p className="text-[13px] text-[#6b7280]">Real-time financial data · QuickBooks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]" onClick={() => refetchStats()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-[#2ca01c]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={i} className="bg-white border-[#e5e7eb] hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                      <Icon className="w-4 h-4" style={{ color: card.color }} />
                    </div>
                  </div>
                  <p className="text-[18px] font-bold text-[#0d333f]">{card.value}</p>
                  <p className="text-[11px] text-[#6b7280] mt-0.5">{card.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Revenue vs Expense placeholders with real data note */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white border-[#e5e7eb]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[14px] font-semibold text-[#0d333f]">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-[#e5e7eb] rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-10 h-10 text-[#d1d5db] mx-auto mb-2" />
                <p className="text-[12px] text-[#9ca3af]">Revenue: {formatINR(stats?.totalRevenue || 0)}</p>
                <p className="text-[10px] text-[#d1d5db]">Chart renders with sufficient data points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#e5e7eb]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[14px] font-semibold text-[#0d333f]">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-[#e5e7eb] rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-10 h-10 text-[#d1d5db] mx-auto mb-2" />
                <p className="text-[12px] text-[#9ca3af]">Expenses: {formatINR(stats?.totalExpenses || 0)}</p>
                <p className="text-[10px] text-[#d1d5db]">Chart renders with sufficient data points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="bg-white border-[#e5e7eb]">
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-semibold text-[#0d333f]">Quick Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Invoices Sent', value: String(stats?.invoicesSent || 0), icon: CheckCircle, color: '#2ca01c' },
              { label: 'Payments Received', value: String(stats?.paymentsReceived || 0), icon: ArrowDownRight, color: '#3b82f6' },
              { label: 'Refunds Processed', value: String(stats?.refundsProcessed || 0), icon: ArrowUpRight, color: '#f59e0b' },
              { label: 'Failed Transactions', value: String(stats?.failedTransactions || 0), icon: XCircle, color: '#ef4444' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#f9fafb]">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                <div>
                  <p className="text-[16px] font-bold text-[#0d333f]">{stat.value}</p>
                  <p className="text-[10px] text-[#9ca3af]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
