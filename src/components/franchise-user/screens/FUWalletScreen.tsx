import React from 'react';
import { Wallet, Plus, History, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const transactions = [
  { id: 1, type: 'debit', description: 'Marketing - Meta Ads', amount: '₹2,500', date: 'Today' },
  { id: 2, type: 'debit', description: 'Marketing - Google Ads', amount: '₹3,200', date: 'Yesterday' },
  { id: 3, type: 'credit', description: 'Added Money', amount: '₹10,000', date: '2 days ago' },
  { id: 4, type: 'debit', description: 'SEO Services', amount: '₹1,500', date: '3 days ago' },
];

export function FUWalletScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            My Wallet
          </h1>
          <p className="text-muted-foreground">Simple balance and usage.</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30">
        <CardContent className="p-8 text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-5xl font-bold mt-2">₹15,230</p>
          <Button size="lg" className="mt-6 text-lg px-8 py-6">
            <Plus className="h-6 w-6 mr-2" />
            Add Money
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Spent This Month</p>
            <p className="text-2xl font-bold text-amber-500">₹8,700</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Added This Month</p>
            <p className="text-2xl font-bold text-emerald-500">₹15,000</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    txn.type === 'credit' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                  }`}>
                    <IndianRupee className={`h-6 w-6 ${
                      txn.type === 'credit' ? 'text-emerald-500' : 'text-amber-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <p className="text-sm text-muted-foreground">{txn.date}</p>
                  </div>
                </div>
                <p className={`text-xl font-bold ${
                  txn.type === 'credit' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}{txn.amount}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
