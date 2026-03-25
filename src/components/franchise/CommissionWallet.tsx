import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertTriangle, Download, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const transactions = [
  { id: 1, type: 'credit', description: 'Commission - POS System Sale', amount: '+₹45,000', date: '2 hours ago', status: 'completed' },
  { id: 2, type: 'credit', description: 'Bonus - Monthly Target', amount: '+₹15,000', date: '1 day ago', status: 'completed' },
  { id: 3, type: 'debit', description: 'Withdrawal to Bank', amount: '-₹1,00,000', date: '3 days ago', status: 'completed' },
  { id: 4, type: 'credit', description: 'Commission - School ERP', amount: '+₹72,000', date: '5 days ago', status: 'completed' },
  { id: 5, type: 'debit', description: 'Reseller Payout - Tech Solutions', amount: '-₹24,000', date: '1 week ago', status: 'pending' },
];

const bonusTiers = [
  { name: 'Monthly Target', current: 32, target: 40, bonus: '₹25,000' },
  { name: 'Quarterly Milestone', current: 89, target: 100, bonus: '₹1,00,000' },
  { name: 'Annual Elite', current: 89, target: 200, bonus: '₹5,00,000' },
];

export const CommissionWallet = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Commission & Wallet</h2>
          <p className="text-sm text-muted-foreground">Track earnings and manage payouts</p>
        </div>
        <Button variant="outline" className="border-primary/30">
          <Download className="w-4 h-4 mr-2" />
          Export Statement
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass-panel border-border/30 bg-gradient-to-br from-primary/10 to-neon-teal/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">Total Balance</span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">₹4,82,000</p>
            <p className="text-xs text-neon-green mt-1">+₹1,32,000 this month</p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpRight className="w-6 h-6 text-neon-green" />
              <span className="text-sm text-muted-foreground">Total Earnings</span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">₹18,45,000</p>
            <p className="text-xs text-muted-foreground mt-1">Lifetime</p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownLeft className="w-6 h-6 text-neon-orange" />
              <span className="text-sm text-muted-foreground">Withdrawable</span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">₹3,50,000</p>
            <p className="text-xs text-muted-foreground mt-1">After holds</p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-neon-purple" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">₹1,32,000</p>
            <p className="text-xs text-muted-foreground mt-1">Clearing in 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Transaction Ledger */}
        <Card className="lg:col-span-2 glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="text-foreground">Commission Ledger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-secondary/20 border border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-neon-green/10' : 'bg-neon-orange/10'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowUpRight className="w-5 h-5 text-neon-green" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-neon-orange" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-bold ${
                      tx.type === 'credit' ? 'text-neon-green' : 'text-neon-orange'
                    }`}>{tx.amount}</p>
                    <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Withdraw & Bonus */}
        <div className="space-y-6">
          {/* Withdraw Panel */}
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-primary" />
                Withdraw Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
                <Input
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-secondary/30 border-border/30"
                />
              </div>
              <div className="p-3 rounded-lg bg-neon-orange/10 border border-neon-orange/30">
                <div className="flex items-center gap-2 text-neon-orange text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Approval gate active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Withdrawals above ₹1L require admin approval
                </p>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-neon-teal text-background">
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>

          {/* Bonus Tiers */}
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="w-5 h-5 text-primary" />
                Bonus Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bonusTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-secondary/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{tier.name}</span>
                    <span className="text-sm font-mono text-primary">{tier.bonus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-neon-teal rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(tier.current / tier.target) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{tier.current}/{tier.target}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
