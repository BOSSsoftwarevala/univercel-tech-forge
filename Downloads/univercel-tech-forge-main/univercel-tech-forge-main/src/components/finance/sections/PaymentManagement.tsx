/**
 * PAYMENT MANAGEMENT SECTION
 * Incoming, Outgoing, Failed, Pending, Partial Payments
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp,
  TrendingDown,
  XCircle,
  Clock,
  PieChart,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface PaymentManagementProps {
  activeView: FinanceView;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({ activeView }) => {
  const { update, approve, export: exportData } = useGlobalActions();
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const getTitle = () => {
    switch (activeView) {
      case 'payment_incoming': return 'Incoming Payments';
      case 'payment_outgoing': return 'Outgoing Payments';
      case 'payment_failed': return 'Failed Payments';
      case 'payment_pending': return 'Pending Payments';
      case 'payment_partial': return 'Partial Payments';
      default: return 'Payment Management';
    }
  };

  const getIcon = () => {
    switch (activeView) {
      case 'payment_incoming': return TrendingUp;
      case 'payment_outgoing': return TrendingDown;
      case 'payment_failed': return XCircle;
      case 'payment_pending': return Clock;
      case 'payment_partial': return PieChart;
      default: return TrendingUp;
    }
  };

  const payments = [
    { id: 'PAY001', amount: '₹50,000', from: 'Delhi Franchise', gateway: 'UPI', time: '10:30 AM', status: 'Completed' },
    { id: 'PAY002', amount: '₹25,000', from: 'Mumbai Reseller', gateway: 'Bank Transfer', time: '09:45 AM', status: 'Pending' },
    { id: 'PAY003', amount: '₹15,000', from: 'User Subscription', gateway: 'Stripe', time: '09:15 AM', status: 'Failed' },
    { id: 'PAY004', amount: '₹8,500', from: 'Bangalore Franchise', gateway: 'PayPal', time: '08:30 AM', status: 'Completed' },
    { id: 'PAY005', amount: '₹12,000', from: 'Chennai Reseller', gateway: 'UPI', time: '08:00 AM', status: 'Partial' },
  ];

  const Icon = getIcon();

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setShowViewDialog(true);
    update('deal', payment.id, { action: 'view' });
  };

  const handleRetryPayment = (paymentId: string) => {
    update('deal', paymentId, { action: 'retry' });
  };

  const handleApprovePayment = (paymentId: string) => {
    approve('deal', paymentId, { action: 'approve' });
  };

  const handleFilter = () => {
    update('report', 'filter', { view: activeView });
  };

  const handleExport = () => {
    exportData('report', 'excel', { view: activeView });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage all payment transactions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleFilter}>
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${activeView === 'payment_incoming' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-xs text-slate-500">Incoming</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹2.5L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${activeView === 'payment_outgoing' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-xs text-slate-500">Outgoing</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹1.2L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${activeView === 'payment_failed' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-xs text-slate-500">Failed</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹45K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${activeView === 'payment_pending' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs text-slate-500">Pending</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹78K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${activeView === 'payment_partial' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <PieChart className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-slate-500">Partial</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹32K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search payments by ID, amount, or source..." className="pl-10" />
      </div>

      {/* Payments Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Payment ID</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">From/To</th>
                  <th className="pb-3 font-medium">Gateway</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((payment) => (
                  <tr key={payment.id} className="text-sm">
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{payment.id}</td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{payment.amount}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">{payment.from}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">{payment.gateway}</Badge>
                    </td>
                    <td className="py-3 text-slate-500">{payment.time}</td>
                    <td className="py-3">
                      <Badge 
                        variant={
                          payment.status === 'Completed' ? 'default' : 
                          payment.status === 'Failed' ? 'destructive' : 
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleViewPayment(payment)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payment.status === 'Failed' && (
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleRetryPayment(payment.id)}>
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        {payment.status === 'Pending' && (
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleApprovePayment(payment.id)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
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

      {/* View Payment Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Payment ID</label>
                  <p className="font-mono">{selectedPayment.id}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Amount</label>
                  <p className="font-semibold">{selectedPayment.amount}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Source</label>
                  <p>{selectedPayment.from}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Gateway</label>
                  <p>{selectedPayment.gateway}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManagement;
