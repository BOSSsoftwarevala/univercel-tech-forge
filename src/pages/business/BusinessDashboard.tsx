import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const stats = [
  { 
    label: 'Total Sales (Today)', 
    value: '₹24,500', 
    change: '+12%', 
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-green-50 text-green-600'
  },
  { 
    label: 'Monthly Sales', 
    value: '₹4,85,000', 
    change: '+8%', 
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-blue-50 text-blue-600'
  },
  { 
    label: 'Pending Payments', 
    value: '₹1,25,000', 
    change: '23 invoices', 
    trend: 'neutral',
    icon: Clock,
    color: 'bg-amber-50 text-amber-600'
  },
  { 
    label: 'Total Customers', 
    value: '248', 
    change: '+5 this week', 
    trend: 'up',
    icon: Users,
    color: 'bg-purple-50 text-purple-600'
  },
];

const chartData = [
  { month: 'Jan', sales: 65000, expenses: 42000 },
  { month: 'Feb', sales: 78000, expenses: 45000 },
  { month: 'Mar', sales: 85000, expenses: 48000 },
  { month: 'Apr', sales: 72000, expenses: 38000 },
  { month: 'May', sales: 95000, expenses: 52000 },
  { month: 'Jun', sales: 88000, expenses: 48000 },
];

const recentTransactions = [
  { id: 1, customer: 'Sharma Electronics', amount: '₹15,000', type: 'sale', date: 'Today, 2:30 PM' },
  { id: 2, customer: 'Office Rent', amount: '₹25,000', type: 'expense', date: 'Today, 10:00 AM' },
  { id: 3, customer: 'Gupta Traders', amount: '₹8,500', type: 'sale', date: 'Yesterday' },
  { id: 4, customer: 'Electricity Bill', amount: '₹3,200', type: 'expense', date: 'Yesterday' },
  { id: 5, customer: 'Singh & Sons', amount: '₹22,000', type: 'sale', date: 'Dec 28' },
];

export default function BusinessDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.trend === 'up' && (
                  <span className="flex items-center text-sm text-green-600 font-medium">
                    {stat.change} <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                )}
                {stat.trend === 'down' && (
                  <span className="flex items-center text-sm text-red-600 font-medium">
                    {stat.change} <ArrowDownRight className="w-4 h-4 ml-1" />
                  </span>
                )}
                {stat.trend === 'neutral' && (
                  <span className="text-sm text-slate-500">{stat.change}</span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales vs Expenses Chart */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800">Sales vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Summary */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800">Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ExpenseItem label="Rent & Utilities" amount="₹28,000" percentage={35} color="bg-blue-500" />
              <ExpenseItem label="Inventory" amount="₹22,000" percentage={28} color="bg-green-500" />
              <ExpenseItem label="Salaries" amount="₹18,000" percentage={22} color="bg-purple-500" />
              <ExpenseItem label="Marketing" amount="₹8,000" percentage={10} color="bg-amber-500" />
              <ExpenseItem label="Miscellaneous" amount="₹4,000" percentage={5} color="bg-slate-400" />
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Total Expenses</span>
                <span className="text-xl font-bold text-slate-800">₹80,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-800 font-medium">{tx.customer}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'sale' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {tx.type === 'sale' ? 'Sale' : 'Expense'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-sm">{tx.date}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      tx.type === 'sale' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'sale' ? '+' : '-'}{tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExpenseItem({ label, amount, percentage, color }: { 
  label: string; 
  amount: string; 
  percentage: number; 
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-medium text-slate-800">{amount}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
