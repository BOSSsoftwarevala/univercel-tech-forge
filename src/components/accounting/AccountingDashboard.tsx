import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Building, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  ShoppingCart,
  Users,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const balanceCards = [
  {
    title: 'Cash Balance',
    amount: '₹1,25,450',
    change: '+12.5%',
    trend: 'up',
    icon: Wallet,
    color: 'emerald',
  },
  {
    title: 'Bank Balance',
    amount: '₹4,56,780',
    change: '+8.2%',
    trend: 'up',
    icon: Building,
    color: 'blue',
  },
  {
    title: 'Today Sales',
    amount: '₹28,500',
    change: '+15.3%',
    trend: 'up',
    icon: TrendingUp,
    color: 'purple',
  },
  {
    title: 'Today Expenses',
    amount: '₹12,340',
    change: '-5.8%',
    trend: 'down',
    icon: TrendingDown,
    color: 'orange',
  },
];

const recentTransactions = [
  { id: 1, type: 'sale', party: 'ABC Electronics', amount: 15000, date: 'Today, 2:30 PM' },
  { id: 2, type: 'purchase', party: 'XYZ Suppliers', amount: 8500, date: 'Today, 11:45 AM' },
  { id: 3, type: 'expense', party: 'Office Rent', amount: 25000, date: 'Today, 10:00 AM' },
  { id: 4, type: 'sale', party: 'Tech Solutions', amount: 32000, date: 'Yesterday' },
  { id: 5, type: 'purchase', party: 'Global Traders', amount: 12000, date: 'Yesterday' },
];

const quickActions = [
  { label: 'New Invoice', icon: Receipt, color: 'emerald' },
  { label: 'Add Purchase', icon: ShoppingCart, color: 'blue' },
  { label: 'Record Expense', icon: Wallet, color: 'orange' },
  { label: 'View Reports', icon: FileText, color: 'purple' },
];

const AccountingDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {balanceCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = {
            emerald: 'bg-emerald-100 text-emerald-600',
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          };
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      card.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {card.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {card.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-slate-500">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{card.amount}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 hover:bg-slate-50"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    action.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                    action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    action.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'sale' ? 'bg-emerald-100 text-emerald-600' :
                      tx.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {tx.type === 'sale' ? <Receipt className="w-5 h-5" /> :
                       tx.type === 'purchase' ? <ShoppingCart className="w-5 h-5" /> :
                       <Wallet className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{tx.party}</p>
                      <p className="text-sm text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.type === 'sale' ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {tx.type === 'sale' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{tx.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Summary */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Outstanding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-red-700">Receivables</p>
                  <p className="text-xl font-bold text-red-600">₹2,45,000</p>
                </div>
              </div>
              <p className="text-xs text-red-500 mt-2">From 12 customers</p>
            </div>
            
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-orange-700">Payables</p>
                  <p className="text-xl font-bold text-orange-600">₹1,85,000</p>
                </div>
              </div>
              <p className="text-xs text-orange-500 mt-2">To 8 suppliers</p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-emerald-700">Net Position</p>
                  <p className="text-xl font-bold text-emerald-600">+₹60,000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountingDashboard;
