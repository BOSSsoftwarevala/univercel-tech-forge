import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Wallet, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Lock,
  Clock,
  IndianRupee,
  CreditCard,
  History,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'locked';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

const transactions: Transaction[] = [
  { id: '1', type: 'debit', amount: 35000, description: 'CRM Pro Suite Purchase', date: '2024-01-15', status: 'completed', reference: 'ORD-2024-001' },
  { id: '2', type: 'credit', amount: 50000, description: 'Wallet Recharge', date: '2024-01-14', status: 'completed' },
  { id: '3', type: 'locked', amount: 5000, description: 'Order Hold - E-Shop Builder', date: '2024-01-18', status: 'pending', reference: 'ORD-2024-002' },
  { id: '4', type: 'debit', amount: 24500, description: 'Marketing Autopilot Purchase', date: '2024-01-05', status: 'completed', reference: 'ORD-2024-003' },
  { id: '5', type: 'credit', amount: 100000, description: 'Wallet Recharge', date: '2024-01-01', status: 'completed' },
];

const quickAmounts = [10000, 25000, 50000, 100000];

export function MMWalletScreen() {
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);

  const walletBalance = 45230;
  const lockedAmount = 5000;
  const availableBalance = walletBalance - lockedAmount;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-purple-400" />
            Wallet
          </h1>
          <p className="text-slate-400 mt-1">Manage your wallet balance and transactions</p>
        </div>
        <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Money
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Quick Amounts */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Quick Select</label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="border-slate-600"
                      onClick={() => setRechargeAmount(amount.toString())}
                    >
                      ₹{(amount / 1000)}K
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Enter Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Payment Method</label>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-purple-500/50 bg-purple-500/10 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="font-medium">UPI / Bank Transfer</p>
                        <p className="text-xs text-slate-400">Instant credit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={!rechargeAmount || parseInt(rechargeAmount) < 1000}
              >
                Proceed to Pay ₹{parseInt(rechargeAmount || '0').toLocaleString()}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-emerald-500">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-slate-300">Available Balance</span>
            </div>
            <p className="text-4xl font-bold text-emerald-400">
              ₹{availableBalance.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-2">Ready to use</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-amber-500">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <span className="text-slate-300">Locked Amount</span>
            </div>
            <p className="text-4xl font-bold text-amber-400">
              ₹{lockedAmount.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-2">Held for pending orders</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-slate-600">
                <IndianRupee className="h-6 w-6 text-white" />
              </div>
              <span className="text-slate-300">Total Balance</span>
            </div>
            <p className="text-4xl font-bold">
              ₹{walletBalance.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-2">All funds</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert */}
      {availableBalance < 10000 && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
          <div>
            <p className="font-medium text-amber-400">Low Balance Warning</p>
            <p className="text-sm text-slate-400 mt-1">
              Your wallet balance is low. Add money to continue placing orders.
            </p>
          </div>
        </div>
      )}

      {/* Transactions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-purple-400" />
              Transaction History
            </CardTitle>
            <Button variant="outline" size="sm" className="border-slate-600">
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map(tx => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    tx.type === 'credit' 
                      ? 'bg-emerald-500/20' 
                      : tx.type === 'locked'
                      ? 'bg-amber-500/20'
                      : 'bg-red-500/20'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
                    ) : tx.type === 'locked' ? (
                      <Lock className="h-5 w-5 text-amber-400" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{tx.date}</span>
                      {tx.reference && (
                        <Badge variant="outline" className="text-xs border-slate-600">
                          {tx.reference}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    tx.type === 'credit' 
                      ? 'text-emerald-400' 
                      : tx.type === 'locked'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                  <Badge className={`text-xs ${
                    tx.status === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : tx.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
