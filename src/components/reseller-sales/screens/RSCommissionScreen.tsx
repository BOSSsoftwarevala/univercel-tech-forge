/**
 * RESELLER COMMISSION & PAYOUT
 * Auto-calculated, No manual edit, Withdrawal request only
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  IndianRupee,
  Clock,
  CheckCircle,
  ArrowDownCircle,
  TrendingUp,
  Calendar,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

const commissionHistory = [
  { id: 1, order: 'ORD-2024-001', product: 'School ERP', amount: 15000, status: 'paid', date: '2024-01-15' },
  { id: 2, order: 'ORD-2024-003', product: 'Retail POS', amount: 7000, status: 'paid', date: '2024-01-10' },
  { id: 3, order: 'ORD-2024-004', product: 'Business ERP', amount: 19000, status: 'pending', date: '2024-01-18' },
  { id: 4, order: 'ORD-2024-006', product: 'Hospital HMS', amount: 24000, status: 'pending', date: '2024-01-17' },
];

const payoutHistory = [
  { id: 1, amount: 25000, status: 'completed', requestDate: '2024-01-10', paidDate: '2024-01-12', method: 'Bank Transfer' },
  { id: 2, amount: 15000, status: 'processing', requestDate: '2024-01-16', paidDate: null, method: 'UPI' },
];

export function RSCommissionScreen() {
  const [activeTab, setActiveTab] = useState('summary');
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const walletBalance = 43000;
  const pendingCommission = 43000;
  const paidCommission = 41000;
  const totalEarned = 84000;

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (amount > 0 && amount <= walletBalance) {
      toast.success(`Withdrawal request for ₹${amount.toLocaleString()} submitted`);
      setWithdrawDialogOpen(false);
      setWithdrawAmount('');
    } else {
      toast.error('Invalid amount');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Commission & Payout</h1>
          <p className="text-sm text-slate-400">Auto-calculated earnings</p>
        </div>
        <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              Request Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Request Withdrawal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-slate-800">
                <p className="text-xs text-slate-400">Available Balance</p>
                <p className="text-2xl font-bold text-emerald-400">₹{walletBalance.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Withdrawal Amount</label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-slate-800 border-slate-700 text-white"
                  max={walletBalance}
                />
              </div>
              <p className="text-xs text-slate-500">
                Minimum withdrawal: ₹1,000 • Processing time: 2-3 business days
              </p>
            </div>
            <DialogFooter>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseInt(withdrawAmount) > walletBalance}
              >
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Wallet className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Wallet Balance</p>
                  <p className="text-xl font-bold text-emerald-400">₹{walletBalance.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pending Commission</p>
                  <p className="text-xl font-bold text-amber-400">₹{pendingCommission.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Paid Commission</p>
                  <p className="text-xl font-bold text-green-400">₹{paidCommission.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Earned</p>
                  <p className="text-xl font-bold text-blue-400">₹{totalEarned.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="summary" className="data-[state=active]:bg-emerald-600">
            Commission History
          </TabsTrigger>
          <TabsTrigger value="payouts" className="data-[state=active]:bg-emerald-600">
            Payout History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commissionHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div>
                      <p className="text-white font-medium">{item.order}</p>
                      <p className="text-xs text-slate-400">{item.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">₹{item.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            item.status === 'paid'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }
                        >
                          {item.status}
                        </Badge>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payoutHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-700">
                        <Receipt className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">₹{item.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">{item.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          item.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }
                      >
                        {item.status}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.paidDate || item.requestDate}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
