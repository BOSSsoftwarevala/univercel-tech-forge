/**
 * FINANCE DASHBOARD SECTION
 * Financial Overview, Revenue/Expense Summary, P&L, Recent Transactions, Pending, Alerts
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CircleDollarSign, TrendingUp, TrendingDown, BarChart3, Clock, AlertTriangle,
  ArrowUpRight, ArrowDownRight, RefreshCw, Download, Bell, CreditCard,
  CheckCircle, XCircle, ArrowRightLeft
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface Props { activeView: FinanceView; }

const FinanceDashboard: React.FC<Props> = ({ activeView }) => {
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
    { label: 'Total Revenue', value: '₹0.00', change: '0%', trend: 'neutral' as const, icon: CircleDollarSign, color: '#2ca01c' },
    { label: 'Total Expenses', value: '₹0.00', change: '0%', trend: 'neutral' as const, icon: TrendingDown, color: '#ef4444' },
    { label: 'Net Profit', value: '₹0.00', change: '0%', trend: 'neutral' as const, icon: BarChart3, color: '#3b82f6' },
    { label: 'Pending', value: '₹0.00', change: '0%', trend: 'neutral' as const, icon: Clock, color: '#f59e0b' },
    { label: 'Payouts Due', value: '₹0.00', change: '0%', trend: 'neutral' as const, icon: CreditCard, color: '#8b5cf6' },
  ];

  if (activeView === 'dash_alerts') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#0d333f]">Financial Alerts</h2>
            <p className="text-[13px] text-[#6b7280]">Important notifications requiring attention</p>
          </div>
        </div>
        <Card className="bg-white border-[#e5e7eb]">
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
            <p className="text-[14px] font-medium text-[#6b7280]">No alerts at this time</p>
            <p className="text-[12px] text-[#9ca3af] mt-1">Financial alerts will appear here when triggered</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeView === 'dash_pending_payments') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#0d333f]">Pending Payments</h2>
            <p className="text-[13px] text-[#6b7280]">Payments awaiting processing or approval</p>
          </div>
          <Button size="sm" className="bg-[#2ca01c] hover:bg-[#249317] text-white text-[12px]">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
        </div>
        <Card className="bg-white border-[#e5e7eb]">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
            <p className="text-[14px] font-medium text-[#6b7280]">No pending payments</p>
            <p className="text-[12px] text-[#9ca3af] mt-1">All payments are up to date</p>
          </CardContent>
        </Card>
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export
            </Button>
          </div>
        </div>
        <Card className="bg-white border-[#e5e7eb]">
          <CardContent className="p-8 text-center">
            <ArrowRightLeft className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
            <p className="text-[14px] font-medium text-[#6b7280]">No transactions yet</p>
            <p className="text-[12px] text-[#9ca3af] mt-1">Transactions will appear here as they occur</p>
          </CardContent>
        </Card>
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
          <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
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
                  <span className="text-[11px] text-[#9ca3af]">{card.change}</span>
                </div>
                <p className="text-[20px] font-bold text-[#0d333f]">{card.value}</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">{card.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue vs Expense Chart placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white border-[#e5e7eb]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[14px] font-semibold text-[#0d333f]">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-[#e5e7eb] rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-10 h-10 text-[#d1d5db] mx-auto mb-2" />
                <p className="text-[12px] text-[#9ca3af]">Revenue chart will appear with real data</p>
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
                <p className="text-[12px] text-[#9ca3af]">Expense chart will appear with real data</p>
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
              { label: 'Invoices Sent', value: '0', icon: CheckCircle, color: '#2ca01c' },
              { label: 'Payments Received', value: '0', icon: ArrowDownRight, color: '#3b82f6' },
              { label: 'Refunds Processed', value: '0', icon: ArrowUpRight, color: '#f59e0b' },
              { label: 'Failed Transactions', value: '0', icon: XCircle, color: '#ef4444' },
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
