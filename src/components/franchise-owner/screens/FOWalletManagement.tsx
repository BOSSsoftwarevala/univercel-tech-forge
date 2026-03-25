/**
 * FRANCHISE OWNER - WALLET MANAGEMENT
 * Live balance, add money, auto deduction, transaction history
 */

import React, { useState } from 'react';
import { 
  Wallet, Plus, Minus, AlertTriangle, History,
  ArrowUpRight, ArrowDownLeft, RefreshCw, XCircle, CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const transactionCategories = {
  credits: [
    { id: 1, desc: 'Wallet Recharge', amount: 50000, date: 'Jan 18, 2024', ref: 'TXN-CR-001' },
    { id: 2, desc: 'Commission Credit', amount: 4500, date: 'Jan 17, 2024', ref: 'TXN-CR-002' },
    { id: 3, desc: 'Refund Received', amount: 8500, date: 'Jan 15, 2024', ref: 'TXN-CR-003' },
  ],
  debits: [
    { id: 1, desc: 'Order Payment - ORD-2024-156', amount: 45000, date: 'Jan 18, 2024', ref: 'TXN-DB-001' },
    { id: 2, desc: 'Order Payment - ORD-2024-155', amount: 85000, date: 'Jan 17, 2024', ref: 'TXN-DB-002' },
    { id: 3, desc: 'Domain Renewal', amount: 1200, date: 'Jan 16, 2024', ref: 'TXN-DB-003' },
  ],
  refunds: [
    { id: 1, desc: 'Client Refund - ORD-2024-120', amount: 8500, date: 'Jan 15, 2024', ref: 'TXN-RF-001', status: 'Processed' },
    { id: 2, desc: 'Partial Refund - ORD-2024-98', amount: 5000, date: 'Jan 10, 2024', ref: 'TXN-RF-002', status: 'Processed' },
  ],
  adjustments: [
    { id: 1, desc: 'Promotional Credit', amount: 2000, date: 'Jan 12, 2024', ref: 'TXN-ADJ-001', type: 'credit' },
    { id: 2, desc: 'System Correction', amount: -500, date: 'Jan 08, 2024', ref: 'TXN-ADJ-002', type: 'debit' },
  ],
  failed: [
    { id: 1, desc: 'Payment Gateway Error', amount: 25000, date: 'Jan 14, 2024', ref: 'TXN-FL-001', reason: 'Insufficient balance' },
  ],
};

export function FOWalletManagement() {
  const { toast } = useToast();
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');

  const walletBalance = 245680;
  const lowBalanceThreshold = 10000;

  const handleAddMoney = () => {
    if (!addAmount || parseInt(addAmount) <= 0) {
      toast({ title: "Input Required", description: "Please enter a valid amount to continue" });
      return;
    }
    toast({
      title: "Payment Initiated",
      description: `Adding ₹${parseInt(addAmount).toLocaleString()} to your wallet...`,
    });
    setAddMoneyOpen(false);
    setAddAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Wallet Management
          </h1>
          <p className="text-muted-foreground">Balance • Add Money • Auto Deduction • History</p>
        </div>
        <Dialog open={addMoneyOpen} onOpenChange={setAddMoneyOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Money
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Add Money to Wallet
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {[5000, 10000, 25000, 50000].map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    size="sm"
                    onClick={() => setAddAmount(amt.toString())}
                  >
                    ₹{amt.toLocaleString()}
                  </Button>
                ))}
              </div>
              <Button onClick={handleAddMoney} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ₹{addAmount ? parseInt(addAmount).toLocaleString() : '0'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-primary/20 via-purple-500/10 to-cyan-500/10 border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Wallet Balance</span>
              </div>
              <p className="text-4xl font-bold">₹{walletBalance.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="bg-emerald-500">LIVE</Badge>
                <span className="text-sm text-muted-foreground">Auto-deduction enabled</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Low Balance Alert</span>
              </div>
              <p className="text-lg font-medium">Below ₹{lowBalanceThreshold.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History Tabs */}
      <Tabs defaultValue="credits" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="credits" className="gap-1">
            <ArrowDownLeft className="h-3 w-3" />
            Credits
          </TabsTrigger>
          <TabsTrigger value="debits" className="gap-1">
            <ArrowUpRight className="h-3 w-3" />
            Debits
          </TabsTrigger>
          <TabsTrigger value="refunds" className="gap-1">
            <RefreshCw className="h-3 w-3" />
            Refunds
          </TabsTrigger>
          <TabsTrigger value="adjustments" className="gap-1">
            <Minus className="h-3 w-3" />
            Adjustments
          </TabsTrigger>
          <TabsTrigger value="failed" className="gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credits">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
                Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactionCategories.credits.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium">{txn.desc}</p>
                        <p className="text-sm text-muted-foreground">{txn.ref} • {txn.date}</p>
                      </div>
                    </div>
                    <span className="font-medium text-emerald-500">+₹{txn.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debits">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-red-500" />
                Debits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactionCategories.debits.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium">{txn.desc}</p>
                        <p className="text-sm text-muted-foreground">{txn.ref} • {txn.date}</p>
                      </div>
                    </div>
                    <span className="font-medium text-red-500">-₹{txn.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                Refunds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactionCategories.refunds.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <RefreshCw className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{txn.desc}</p>
                        <p className="text-sm text-muted-foreground">{txn.ref} • {txn.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{txn.status}</Badge>
                      <span className="font-medium text-blue-500">₹{txn.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Minus className="h-5 w-5 text-purple-500" />
                Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactionCategories.adjustments.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        txn.type === 'credit' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                      }`}>
                        <Minus className={`h-5 w-5 ${
                          txn.type === 'credit' ? 'text-emerald-500' : 'text-amber-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{txn.desc}</p>
                        <p className="text-sm text-muted-foreground">{txn.ref} • {txn.date}</p>
                      </div>
                    </div>
                    <span className={`font-medium ${txn.amount > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Failed Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactionCategories.failed.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium">{txn.desc}</p>
                        <p className="text-sm text-muted-foreground">{txn.ref} • {txn.date}</p>
                        <p className="text-xs text-red-400">Reason: {txn.reason}</p>
                      </div>
                    </div>
                    <span className="font-medium text-red-500">₹{txn.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
