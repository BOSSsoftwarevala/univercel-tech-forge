import React, { useState } from 'react';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const dailySalesData = [
  { date: 'Dec 25', sales: 18500, expenses: 8200 },
  { date: 'Dec 26', sales: 22000, expenses: 5500 },
  { date: 'Dec 27', sales: 15800, expenses: 12000 },
  { date: 'Dec 28', sales: 28500, expenses: 7800 },
  { date: 'Dec 29', sales: 32000, expenses: 9500 },
  { date: 'Dec 30', sales: 24500, expenses: 6200 },
  { date: 'Dec 31', sales: 38000, expenses: 4500 },
];

const monthlySalesData = [
  { month: 'Jul', sales: 320000, expenses: 180000, profit: 140000 },
  { month: 'Aug', sales: 380000, expenses: 195000, profit: 185000 },
  { month: 'Sep', sales: 420000, expenses: 210000, profit: 210000 },
  { month: 'Oct', sales: 390000, expenses: 185000, profit: 205000 },
  { month: 'Nov', sales: 450000, expenses: 220000, profit: 230000 },
  { month: 'Dec', sales: 485000, expenses: 235000, profit: 250000 },
];

const topProducts = [
  { name: 'Mobile Accessories', sales: 125000, units: 450 },
  { name: 'Computer Parts', sales: 98000, units: 120 },
  { name: 'Audio Equipment', sales: 85000, units: 85 },
  { name: 'Cables & Adapters', sales: 62000, units: 380 },
  { name: 'Power Banks', sales: 48000, units: 160 },
];

const topCustomers = [
  { name: 'Verma Supplies', purchases: 320000, orders: 45 },
  { name: 'Singh & Sons', purchases: 210000, orders: 32 },
  { name: 'Kumar Industries', purchases: 180000, orders: 28 },
  { name: 'Sharma Electronics', purchases: 125000, orders: 22 },
  { name: 'Patel Enterprises', purchases: 95000, orders: 18 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('this-month');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Business Reports</h2>
          <p className="text-slate-500">Track your sales, expenses, and profitability</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 bg-white border-slate-200">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-slate-200">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">₹4,85,000</p>
              </div>
              <span className="flex items-center text-sm text-green-600 font-medium">
                +12% <ArrowUpRight className="w-4 h-4 ml-1" />
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Expenses</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">₹2,35,000</p>
              </div>
              <span className="flex items-center text-sm text-red-600 font-medium">
                +8% <ArrowUpRight className="w-4 h-4 ml-1" />
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Net Profit</p>
                <p className="text-2xl font-bold text-green-600 mt-1">₹2,50,000</p>
              </div>
              <span className="flex items-center text-sm text-green-600 font-medium">
                +18% <ArrowUpRight className="w-4 h-4 ml-1" />
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Profit Margin</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">51.5%</p>
              </div>
              <span className="flex items-center text-sm text-green-600 font-medium">
                +3% <ArrowUpRight className="w-4 h-4 ml-1" />
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="daily" className="data-[state=active]:bg-white">Daily Report</TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-white">Monthly Report</TabsTrigger>
          <TabsTrigger value="profit" className="data-[state=active]:bg-white">Profit Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Daily Sales & Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
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
                    <Line type="monotone" dataKey="sales" name="Sales" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
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
        </TabsContent>

        <TabsContent value="profit">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Monthly Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Products & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.units} units sold</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-800">₹{product.sales.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">{customer.name}</p>
                      <p className="text-sm text-slate-500">{customer.orders} orders</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-800">₹{customer.purchases.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
