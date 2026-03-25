import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const kpiCards = [
  {
    title: 'Monthly Turnover',
    value: '₹45,68,500',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'indigo',
  },
  {
    title: 'Tax Payable',
    value: '₹8,22,330',
    change: 'This Month',
    trend: 'neutral',
    icon: IndianRupee,
    color: 'amber',
  },
  {
    title: 'Tax Paid (YTD)',
    value: '₹62,45,000',
    change: '87% of liability',
    trend: 'up',
    icon: CheckCircle2,
    color: 'emerald',
  },
  {
    title: 'Compliance Alerts',
    value: '3',
    change: '2 Critical',
    trend: 'down',
    icon: AlertTriangle,
    color: 'red',
  },
];

const complianceDeadlines = [
  { id: 1, filing: 'GSTR-1', period: 'December 2024', dueDate: '2025-01-11', status: 'pending', type: 'monthly' },
  { id: 2, filing: 'GSTR-3B', period: 'December 2024', dueDate: '2025-01-20', status: 'pending', type: 'monthly' },
  { id: 3, filing: 'TDS Return', period: 'Q3 FY24-25', dueDate: '2025-01-31', status: 'draft', type: 'quarterly' },
  { id: 4, filing: 'GSTR-9', period: 'FY 2023-24', dueDate: '2025-03-31', status: 'upcoming', type: 'annual' },
];

const recentTransactions = [
  { id: 1, type: 'Sale', party: 'Tech Solutions Pvt Ltd', invoice: 'INV-2024-156', amount: 125000, tax: 22500, date: 'Today' },
  { id: 2, type: 'Purchase', party: 'Global Suppliers', invoice: 'PUR-2024-089', amount: 85000, tax: 15300, date: 'Today' },
  { id: 3, type: 'Sale', party: 'ABC Industries', invoice: 'INV-2024-155', amount: 95000, tax: 17100, date: 'Yesterday' },
  { id: 4, type: 'Expense', party: 'Office Rent', invoice: 'EXP-2024-045', amount: 50000, tax: 9000, date: 'Yesterday' },
];

const taxSummary = {
  outputTax: 1245000,
  inputTax: 422670,
  netPayable: 822330,
  tdsCredits: 45000,
};

const ProAccountingDashboard: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 border border-amber-200">Pending</Badge>;
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">Draft</Badge>;
      case 'filed':
        return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Filed</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 border border-slate-200">Upcoming</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tax Dashboard</h2>
          <p className="text-slate-500">Financial Year 2024-25 • December 2024</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Change Period
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <BarChart3 className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses: Record<string, string> = {
            indigo: 'bg-indigo-100 text-indigo-600',
            amber: 'bg-amber-100 text-amber-600',
            emerald: 'bg-emerald-100 text-emerald-600',
            red: 'bg-red-100 text-red-600',
          };
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[card.color]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {card.trend !== 'neutral' && (
                      <div className={`flex items-center gap-1 text-sm ${
                        card.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                        {card.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">{card.change}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                    {card.trend === 'neutral' && (
                      <p className="text-xs text-slate-500 mt-1">{card.change}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tax Summary */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">GST Summary - December 2024</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-sm text-slate-600">Output Tax (Sales)</span>
                <span className="font-semibold text-emerald-600">₹{taxSummary.outputTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-slate-600">Input Tax (Purchases)</span>
                <span className="font-semibold text-blue-600">₹{taxSummary.inputTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-slate-600">TDS Credits</span>
                <span className="font-semibold text-purple-600">₹{taxSummary.tdsCredits.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                  <span className="font-medium">Net GST Payable</span>
                  <span className="text-xl font-bold">₹{taxSummary.netPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              View Detailed Breakdown
            </Button>
          </CardContent>
        </Card>

        {/* Compliance Calendar */}
        <Card className="lg:col-span-2 bg-white border-slate-200">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900">Upcoming Filings</CardTitle>
            <Button variant="ghost" size="sm" className="text-indigo-600">
              View Calendar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Filing</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Period</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Due Date</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceDeadlines.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{item.filing}</span>
                          <Badge variant="outline" className="text-[10px] px-1">
                            {item.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.period}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{item.dueDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                      <td className="py-3 px-3 text-right">
                        <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700">
                          {item.status === 'draft' ? 'Continue' : 'Prepare'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">Recent Transactions with Tax Impact</CardTitle>
          <Button variant="ghost" size="sm" className="text-indigo-600">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Party</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Invoice</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase">GST</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={
                        tx.type === 'Sale' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                        tx.type === 'Purchase' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                        'border-orange-200 text-orange-700 bg-orange-50'
                      }>
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">{tx.party}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-sm">{tx.invoice}</td>
                    <td className="py-3 px-3 text-right font-medium text-slate-900">
                      ₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={tx.type === 'Sale' ? 'text-emerald-600' : 'text-blue-600'}>
                        ₹{tx.tax.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{tx.date}</td>
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

export default ProAccountingDashboard;
