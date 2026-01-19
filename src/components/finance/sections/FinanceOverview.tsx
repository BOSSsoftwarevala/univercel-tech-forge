/**
 * FINANCE OVERVIEW SECTION
 * Total Balance, Today Inflow/Outflow, Net Profit, Pending Amount
 */

import React from 'react';
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
  ArrowDownRight
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface FinanceOverviewProps {
  activeView: FinanceView;
}

const FinanceOverview: React.FC<FinanceOverviewProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'overview_total_balance': return 'Total Balance';
      case 'overview_today_inflow': return 'Today Inflow';
      case 'overview_today_outflow': return 'Today Outflow';
      case 'overview_net_profit': return 'Net Profit / Loss';
      case 'overview_pending': return 'Pending Amount';
      default: return 'Finance Overview';
    }
  };

  const summaryCards = [
    { label: 'Total Balance', value: '₹45,67,890', change: '+12.5%', trend: 'up', icon: CircleDollarSign },
    { label: 'Today Inflow', value: '₹2,34,567', change: '+8.2%', trend: 'up', icon: TrendingUp },
    { label: 'Today Outflow', value: '₹1,23,456', change: '-3.1%', trend: 'down', icon: TrendingDown },
    { label: 'Net Profit', value: '₹1,11,111', change: '+15.4%', trend: 'up', icon: BarChart3 },
    { label: 'Pending', value: '₹78,900', change: '-5.2%', trend: 'down', icon: Clock },
  ];

  const recentTransactions = [
    { id: 'TXN001', type: 'Credit', amount: '₹25,000', from: 'Franchise - Delhi', time: '10:30 AM', status: 'Completed' },
    { id: 'TXN002', type: 'Debit', amount: '₹15,000', to: 'Server Cost', time: '09:45 AM', status: 'Completed' },
    { id: 'TXN003', type: 'Credit', amount: '₹50,000', from: 'Reseller - Mumbai', time: '09:15 AM', status: 'Pending' },
    { id: 'TXN004', type: 'Debit', amount: '₹8,500', to: 'AI API Cost', time: '08:30 AM', status: 'Completed' },
    { id: 'TXN005', type: 'Credit', amount: '₹12,000', from: 'User Subscription', time: '08:00 AM', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time financial overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((card, index) => {
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

      {/* Recent Transactions */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'Credit' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {txn.type === 'Credit' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{txn.id}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {txn.type === 'Credit' ? `From: ${txn.from}` : `To: ${txn.to}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {txn.type === 'Credit' ? '+' : '-'}{txn.amount}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-slate-500">{txn.time}</span>
                    <Badge variant={txn.status === 'Completed' ? 'default' : 'secondary'} className="text-[10px]">
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceOverview;
