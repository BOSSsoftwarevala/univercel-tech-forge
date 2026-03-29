/**
 * COST & EXPENSE CONTROL SECTION
 * Server, AI/API, Marketing, Support, Manual Entry
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Server,
  Cpu,
  Megaphone,
  HeadphonesIcon,
  PenTool,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Download
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface CostExpenseControlProps {
  activeView: FinanceView;
}

const CostExpenseControl: React.FC<CostExpenseControlProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'cost_server': return 'Server Cost';
      case 'cost_ai_api': return 'AI / API Cost';
      case 'cost_marketing': return 'Marketing Cost';
      case 'cost_support': return 'Support Cost';
      case 'cost_manual_entry': return 'Manual Expense Entry';
      default: return 'Cost & Expense Control';
    }
  };

  const getIcon = () => {
    switch (activeView) {
      case 'cost_server': return Server;
      case 'cost_ai_api': return Cpu;
      case 'cost_marketing': return Megaphone;
      case 'cost_support': return HeadphonesIcon;
      case 'cost_manual_entry': return PenTool;
      default: return BarChart3;
    }
  };

  const expenses = [
    { id: 'EXP001', category: 'Server', vendor: 'AWS', amount: '₹2,50,000', date: '15 Jan 2024', status: 'Paid', recurring: true },
    { id: 'EXP002', category: 'AI/API', vendor: 'OpenAI', amount: '₹1,25,000', date: '14 Jan 2024', status: 'Paid', recurring: true },
    { id: 'EXP003', category: 'Marketing', vendor: 'Google Ads', amount: '₹75,000', date: '13 Jan 2024', status: 'Pending', recurring: false },
    { id: 'EXP004', category: 'Support', vendor: 'Zendesk', amount: '₹45,000', date: '12 Jan 2024', status: 'Paid', recurring: true },
    { id: 'EXP005', category: 'Server', vendor: 'Cloudflare', amount: '₹35,000', date: '11 Jan 2024', status: 'Paid', recurring: true },
  ];

  const costSummary = [
    { category: 'Server', monthly: '₹3.2L', ytd: '₹38.4L', trend: '+5%', icon: Server },
    { category: 'AI/API', monthly: '₹1.8L', ytd: '₹21.6L', trend: '+12%', icon: Cpu },
    { category: 'Marketing', monthly: '₹2.5L', ytd: '₹30L', trend: '-3%', icon: Megaphone },
    { category: 'Support', monthly: '₹0.8L', ytd: '₹9.6L', trend: '+2%', icon: HeadphonesIcon },
  ];

  const Icon = getIcon();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage all expenses</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {costSummary.map((item, index) => {
          const ItemIcon = item.icon;
          const isUp = item.trend.startsWith('+');
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ItemIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
                  </div>
                  <Badge variant={isUp ? 'destructive' : 'default'} className="text-[10px]">
                    {isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {item.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{item.monthly}</p>
                  <p className="text-xs text-slate-500">YTD: {item.ytd}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Manual Entry Form (for cost_manual_entry view) */}
      {activeView === 'cost_manual_entry' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Add Manual Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Category</label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                  <option>Select category</option>
                  <option>Server</option>
                  <option>AI/API</option>
                  <option>Marketing</option>
                  <option>Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Vendor</label>
                <Input placeholder="Enter vendor name" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Amount</label>
                <Input placeholder="₹0.00" type="number" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Date</label>
                <Input type="date" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Description</label>
                <Input placeholder="Expense description..." />
              </div>
            </div>
            <Button className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search expenses by vendor, category, or amount..." className="pl-10" />
      </div>

      {/* Expenses Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Expense Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Vendor</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Recurring</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="text-sm">
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{expense.id}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                    </td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{expense.vendor}</td>
                    <td className="py-3 font-semibold text-red-600">{expense.amount}</td>
                    <td className="py-3 text-slate-500">{expense.date}</td>
                    <td className="py-3">
                      <Badge variant={expense.recurring ? 'default' : 'secondary'} className="text-xs">
                        {expense.recurring ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge 
                        variant={expense.status === 'Paid' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {expense.status}
                      </Badge>
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
};

export default CostExpenseControl;
