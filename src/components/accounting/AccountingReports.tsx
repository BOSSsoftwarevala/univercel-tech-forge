import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  FileText,
  PieChart,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const profitLossData = {
  income: [
    { label: 'Sales Revenue', amount: 485000 },
    { label: 'Service Income', amount: 125000 },
    { label: 'Other Income', amount: 15000 },
  ],
  expenses: [
    { label: 'Cost of Goods Sold', amount: 285000 },
    { label: 'Operating Expenses', amount: 95000 },
    { label: 'Rent & Utilities', amount: 35000 },
    { label: 'Salaries', amount: 85000 },
    { label: 'Other Expenses', amount: 25000 },
  ],
};

const cashFlowData = {
  opening: 125000,
  inflows: [
    { label: 'Cash from Sales', amount: 420000 },
    { label: 'Receivables Collected', amount: 85000 },
    { label: 'Other Receipts', amount: 12000 },
  ],
  outflows: [
    { label: 'Payments to Suppliers', amount: 265000 },
    { label: 'Operating Expenses', amount: 125000 },
    { label: 'Salary Payments', amount: 85000 },
    { label: 'Other Payments', amount: 28000 },
  ],
};

const monthlyData = [
  { month: 'Jan', sales: 85000, expenses: 62000, profit: 23000 },
  { month: 'Feb', sales: 92000, expenses: 68000, profit: 24000 },
  { month: 'Mar', sales: 78000, expenses: 58000, profit: 20000 },
  { month: 'Apr', sales: 105000, expenses: 75000, profit: 30000 },
  { month: 'May', sales: 118000, expenses: 82000, profit: 36000 },
  { month: 'Jun', sales: 125000, expenses: 88000, profit: 37000 },
];

const AccountingReports: React.FC = () => {
  const [activeReport, setActiveReport] = useState('pnl');

  const totalIncome = profitLossData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = profitLossData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const totalInflows = cashFlowData.inflows.reduce((sum, item) => sum + item.amount, 0);
  const totalOutflows = cashFlowData.outflows.reduce((sum, item) => sum + item.amount, 0);
  const closingBalance = cashFlowData.opening + totalInflows - totalOutflows;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Reports & Analytics</h3>
          <p className="text-sm text-slate-500">Financial reports and business insights</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <Input type="date" className="border-0 p-0 h-auto w-32" defaultValue="2024-01-01" />
            <span className="text-slate-400">to</span>
            <Input type="date" className="border-0 p-0 h-auto w-32" defaultValue="2024-01-31" />
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Sales</p>
                <p className="text-xl font-bold text-slate-900">₹6,25,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Expenses</p>
                <p className="text-xl font-bold text-slate-900">₹5,20,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Net Profit</p>
                <p className="text-xl font-bold text-emerald-600">₹1,05,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Profit Margin</p>
                <p className="text-xl font-bold text-slate-900">16.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeReport} onValueChange={setActiveReport}>
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="pnl" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Profit & Loss
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Cash Flow
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-2">
            <Calendar className="w-4 h-4" />
            Monthly Summary
          </TabsTrigger>
        </TabsList>

        {/* Profit & Loss */}
        <TabsContent value="pnl" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <ArrowDownRight className="w-5 h-5 text-emerald-600" />
                    Income
                  </CardTitle>
                  <span className="text-lg font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {profitLossData.income.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium text-slate-900">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expenses */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                    Expenses
                  </CardTitle>
                  <span className="text-lg font-bold text-red-600">₹{totalExpenses.toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {profitLossData.expenses.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium text-slate-900">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Net Profit Summary */}
          <Card className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Net Profit</p>
                  <p className="text-3xl font-bold mt-1">₹{netProfit.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-100">Profit Margin</p>
                  <p className="text-3xl font-bold mt-1">{((netProfit / totalIncome) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow */}
        <TabsContent value="cashflow" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Opening Balance */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-slate-500">Opening Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">₹{cashFlowData.opening.toLocaleString()}</p>
              </CardContent>
            </Card>

            {/* Inflows */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-emerald-600 flex items-center gap-2">
                  <ArrowDownRight className="w-5 h-5" />
                  Cash Inflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cashFlowData.inflows.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className="font-medium text-emerald-600">+₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between font-semibold">
                    <span>Total Inflows</span>
                    <span className="text-emerald-600">₹{totalInflows.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outflows */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-red-600 flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5" />
                  Cash Outflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cashFlowData.outflows.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className="font-medium text-red-600">-₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between font-semibold">
                    <span>Total Outflows</span>
                    <span className="text-red-600">₹{totalOutflows.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Closing Balance */}
          <Card className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Closing Cash Balance</p>
                  <p className="text-3xl font-bold mt-1">₹{closingBalance.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100">Net Cash Flow</p>
                  <p className="text-3xl font-bold mt-1">
                    {totalInflows - totalOutflows > 0 ? '+' : ''}₹{(totalInflows - totalOutflows).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Summary */}
        <TabsContent value="monthly" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Month</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Sales (₹)</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Expenses (₹)</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Profit (₹)</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((row) => (
                      <tr key={row.month} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">{row.month} 2024</td>
                        <td className="py-3 px-4 text-right text-emerald-600">{row.sales.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-red-600">{row.expenses.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">{row.profit.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-emerald-600 font-medium">
                            {((row.profit / row.sales) * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingReports;
