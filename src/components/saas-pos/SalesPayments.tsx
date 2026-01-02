import React, { useState } from 'react';
import { 
  CreditCard, 
  Wifi, 
  WifiOff,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  orderId: string;
  outlet: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  syncStatus: 'online' | 'offline';
  timestamp: string;
  customer?: string;
}

const transactions: Transaction[] = [
  { id: '1', orderId: 'ORD-001', outlet: 'Downtown Store', amount: 45.80, paymentMethod: 'Card', status: 'completed', syncStatus: 'online', timestamp: '2 mins ago', customer: 'John D.' },
  { id: '2', orderId: 'ORD-002', outlet: 'Mall Outlet', amount: 32.50, paymentMethod: 'UPI', status: 'completed', syncStatus: 'online', timestamp: '5 mins ago' },
  { id: '3', orderId: 'ORD-003', outlet: 'Airport Kiosk', amount: 28.90, paymentMethod: 'Cash', status: 'pending', syncStatus: 'offline', timestamp: '15 mins ago', customer: 'Sarah M.' },
  { id: '4', orderId: 'ORD-004', outlet: 'Downtown Store', amount: 67.20, paymentMethod: 'Card', status: 'completed', syncStatus: 'online', timestamp: '22 mins ago' },
  { id: '5', orderId: 'ORD-005', outlet: 'Beach Front', amount: 15.00, paymentMethod: 'Wallet', status: 'failed', syncStatus: 'online', timestamp: '30 mins ago', customer: 'Mike T.' },
  { id: '6', orderId: 'ORD-006', outlet: 'Mall Outlet', amount: 89.99, paymentMethod: 'Card', status: 'completed', syncStatus: 'online', timestamp: '45 mins ago' },
];

const paymentGateways = [
  { name: 'Stripe', status: 'active', transactions: 1245, volume: '$45,890' },
  { name: 'PayPal', status: 'active', transactions: 890, volume: '$32,456' },
  { name: 'Razorpay', status: 'active', transactions: 567, volume: '$21,340' },
  { name: 'Square', status: 'inactive', transactions: 0, volume: '$0' },
];

export const SalesPayments: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats = [
    { label: 'Total Sales Today', value: '$12,450', change: '+12.5%', trend: 'up', icon: DollarSign },
    { label: 'Online Transactions', value: '156', change: '+8.2%', trend: 'up', icon: Wifi },
    { label: 'Offline (Pending Sync)', value: '12', change: '-2.1%', trend: 'down', icon: WifiOff },
    { label: 'Failed Transactions', value: '3', change: '-15%', trend: 'down', icon: XCircle },
  ];

  const filteredTransactions = selectedFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales & Payments</h1>
          <p className="text-slate-500">Monitor transactions and manage payment gateways</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" />
            Sync Offline
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                <span className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  stat.trend === 'up' ? "text-emerald-600" : "text-red-500"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
              <div className="flex items-center gap-2">
                {['all', 'completed', 'pending', 'failed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg capitalize transition-colors",
                      selectedFilter === filter 
                        ? "bg-violet-100 text-violet-700 font-medium" 
                        : "text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      transaction.status === 'completed' ? "bg-emerald-100" :
                      transaction.status === 'pending' ? "bg-amber-100" : "bg-red-100"
                    )}>
                      {transaction.status === 'completed' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
                       transaction.status === 'pending' ? <Clock className="w-5 h-5 text-amber-600" /> :
                       <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{transaction.orderId}</p>
                        {transaction.syncStatus === 'offline' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Offline</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{transaction.outlet} • {transaction.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${transaction.amount.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">{transaction.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Payment Gateways</h3>
            <p className="text-sm text-slate-500">Connected payment providers</p>
          </div>
          <div className="p-4 space-y-4">
            {paymentGateways.map((gateway, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <CreditCard className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{gateway.name}</p>
                      <p className={cn(
                        "text-xs font-medium",
                        gateway.status === 'active' ? "text-emerald-600" : "text-slate-400"
                      )}>
                        {gateway.status === 'active' ? '● Active' : '○ Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Transactions</p>
                    <p className="font-semibold text-slate-900">{gateway.transactions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Volume</p>
                    <p className="font-semibold text-slate-900">{gateway.volume}</p>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-violet-300 hover:text-violet-600 transition-colors">
              + Add Gateway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
