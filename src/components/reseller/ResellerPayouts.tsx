import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Banknote, Clock, CheckCircle2, XCircle, Building2, 
  Plus, History, AlertTriangle, ArrowRight, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const payoutHistory = [
  { id: 'PAY-001', amount: 50000, date: '2024-01-10', status: 'completed', method: 'Bank Transfer', account: '****4521' },
  { id: 'PAY-002', amount: 35000, date: '2024-01-05', status: 'completed', method: 'Bank Transfer', account: '****4521' },
  { id: 'PAY-003', amount: 25000, date: '2023-12-28', status: 'completed', method: 'Bank Transfer', account: '****4521' },
  { id: 'PAY-004', amount: 40000, date: '2023-12-20', status: 'completed', method: 'Bank Transfer', account: '****4521' },
];

const pendingPayouts = [
  { id: 'PAY-005', amount: 45000, requestDate: '2024-01-14', expectedDate: '2024-01-18', status: 'processing' },
];

const bankDetails = {
  accountName: '[MASKED]',
  accountNumber: '****4521',
  bankName: 'HDFC Bank',
  ifsc: 'HDFC0001234',
  upi: 'user@upi',
};

const ResellerPayouts = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  const withdrawableBalance = 141500;

  const handleRequestPayout = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > withdrawableBalance) {
      toast.error('Amount exceeds withdrawable balance');
      return;
    }
    if (amount < 1000) {
      toast.error('Minimum payout amount is ₹1,000');
      return;
    }
    toast.success(`Payout request of ₹${amount.toLocaleString()} submitted for approval`);
    setWithdrawAmount('');
    setShowRequestForm(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; icon: any }> = {
      completed: { class: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
      processing: { class: 'bg-blue-500/20 text-blue-400', icon: Clock },
      failed: { class: 'bg-red-500/20 text-red-400', icon: XCircle },
      pending: { class: 'bg-amber-500/20 text-amber-400', icon: Clock },
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payout Requests</h1>
          <p className="text-slate-400">Request and track your commission payouts</p>
        </div>
        <Button 
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Balance & Request Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawable Balance */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Banknote className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Withdrawable Balance</p>
                <p className="text-3xl font-bold text-white">₹{withdrawableBalance.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 text-xs">Pending Payout</p>
                <p className="text-amber-400 font-bold">₹45,000</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 text-xs">Total Withdrawn</p>
                <p className="text-emerald-400 font-bold">₹5.35L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bank</span>
              <span className="text-white">{bankDetails.bankName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account</span>
              <span className="text-white">{bankDetails.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">IFSC</span>
              <span className="text-white">{bankDetails.ifsc}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">UPI</span>
              <span className="text-white">{bankDetails.upi}</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 mt-2"
              onClick={() => toast.info('Bank details update requires verification. Please contact support.')}
            >
              Update Bank Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-900/50 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-white">New Payout Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-amber-400 font-medium">Important</p>
                  <p className="text-slate-400">Minimum payout: ₹1,000 • Processing time: 2-3 business days</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Amount to Withdraw</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="pl-8 bg-slate-800/50 border-slate-700 text-white"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-500">Available: ₹{withdrawableBalance.toLocaleString()}</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleRequestPayout}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  Submit Request
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRequestForm(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pending Payouts */}
      {pendingPayouts.length > 0 && (
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Pending Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPayouts.map((payout) => {
                const statusInfo = getStatusBadge(payout.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-amber-500/5 border border-amber-500/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <StatusIcon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{payout.id}</p>
                        <p className="text-slate-400 text-sm">Requested: {payout.requestDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-bold">₹{payout.amount.toLocaleString()}</p>
                        <p className="text-slate-400 text-xs">Expected: {payout.expectedDate}</p>
                      </div>
                      <Badge className={statusInfo.class}>
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout History */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            Payout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payoutHistory.length === 0 ? (
              <div className="text-center py-12">
                <Banknote className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No payout history yet</p>
              </div>
            ) : (
              payoutHistory.map((payout, index) => {
                const statusInfo = getStatusBadge(payout.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <motion.div
                    key={payout.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <StatusIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{payout.id}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {payout.date}
                          <ArrowRight className="w-3 h-3" />
                          {payout.account}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">₹{payout.amount.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">{payout.method}</p>
                      </div>
                      <Badge className={statusInfo.class}>
                        {payout.status}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerPayouts;
