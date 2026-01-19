/**
 * REFUND & ADJUSTMENT SECTION
 * Refund Requests, Approved, Rejected, Wallet Adjustment
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface RefundAdjustmentProps {
  activeView: FinanceView;
}

const RefundAdjustment: React.FC<RefundAdjustmentProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'refund_requests': return 'Refund Requests';
      case 'refund_approved': return 'Approved Refunds';
      case 'refund_rejected': return 'Rejected Refunds';
      case 'refund_wallet_adjust': return 'Wallet Adjustments';
      default: return 'Refund & Adjustment';
    }
  };

  const refunds = [
    { id: 'REF001', user: 'Delhi User', amount: '₹15,000', reason: 'Service not delivered', date: '15 Jan 2024', status: 'Pending' },
    { id: 'REF002', user: 'Mumbai Franchise', amount: '₹50,000', reason: 'Duplicate charge', date: '14 Jan 2024', status: 'Approved' },
    { id: 'REF003', user: 'Bangalore Reseller', amount: '₹25,000', reason: 'Plan downgrade', date: '13 Jan 2024', status: 'Rejected' },
    { id: 'REF004', user: 'Chennai User', amount: '₹8,500', reason: 'Technical issue', date: '12 Jan 2024', status: 'Approved' },
    { id: 'REF005', user: 'Pune User', amount: '₹12,000', reason: 'Wrong subscription', date: '11 Jan 2024', status: 'Pending' },
  ];

  const adjustments = [
    { id: 'ADJ001', wallet: 'Delhi Franchise Wallet', type: 'Credit', amount: '₹10,000', reason: 'Promotional credit', date: '15 Jan 2024', by: 'Admin' },
    { id: 'ADJ002', wallet: 'Mumbai Reseller Wallet', type: 'Debit', amount: '₹5,000', reason: 'Penalty deduction', date: '14 Jan 2024', by: 'System' },
    { id: 'ADJ003', wallet: 'User Wallet', type: 'Credit', amount: '₹2,500', reason: 'Compensation', date: '13 Jan 2024', by: 'Support' },
  ];

  const stats = [
    { label: 'Pending Requests', value: '23', icon: Clock, color: 'amber' },
    { label: 'Approved', value: '156', icon: CheckCircle, color: 'emerald' },
    { label: 'Rejected', value: '12', icon: XCircle, color: 'red' },
    { label: 'Total Refunded', value: '₹8.5L', icon: RotateCcw, color: 'blue' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage refunds and wallet adjustments</p>
        </div>
        {activeView === 'refund_wallet_adjust' && (
          <Button size="sm" className="gap-2">
            <ArrowUpDown className="w-4 h-4" />
            New Adjustment
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search by ID, user, or amount..." className="pl-10" />
      </div>

      {/* Wallet Adjustments Table (for refund_wallet_adjust view) */}
      {activeView === 'refund_wallet_adjust' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Wallet Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Wallet</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adjustments.map((adj) => (
                    <tr key={adj.id} className="text-sm">
                      <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{adj.id}</td>
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{adj.wallet}</td>
                      <td className="py-3">
                        <Badge variant={adj.type === 'Credit' ? 'default' : 'destructive'} className="text-xs">
                          {adj.type}
                        </Badge>
                      </td>
                      <td className={`py-3 font-semibold ${adj.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {adj.type === 'Credit' ? '+' : '-'}{adj.amount}
                      </td>
                      <td className="py-3 text-slate-500">{adj.reason}</td>
                      <td className="py-3 text-slate-500">{adj.date}</td>
                      <td className="py-3 text-slate-500">{adj.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refunds Table */}
      {activeView !== 'refund_wallet_adjust' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Refund Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {refunds.map((refund) => (
                    <tr key={refund.id} className="text-sm">
                      <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{refund.id}</td>
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{refund.user}</td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{refund.amount}</td>
                      <td className="py-3 text-slate-500 max-w-[200px] truncate">{refund.reason}</td>
                      <td className="py-3 text-slate-500">{refund.date}</td>
                      <td className="py-3">
                        <Badge 
                          variant={
                            refund.status === 'Approved' ? 'default' : 
                            refund.status === 'Rejected' ? 'destructive' : 
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {refund.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {refund.status === 'Pending' && (
                            <>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-emerald-600">
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600">
                                <ThumbsDown className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RefundAdjustment;
