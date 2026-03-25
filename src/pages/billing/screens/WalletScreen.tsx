import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, Plus, Minus, ArrowUpRight, ArrowDownRight, Clock,
  Settings, History, DollarSign, CreditCard, RefreshCw, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const walletHistory = [
  { id: 'W-001', type: 'credit', amount: 5000, description: 'Manual credit added', date: '2024-12-25', status: 'completed' },
  { id: 'W-002', type: 'debit', amount: 890, description: 'Invoice #INV-2024-140 auto-pay', date: '2024-12-24', status: 'completed' },
  { id: 'W-003', type: 'credit', amount: 2000, description: 'Refund - Order #ORD-456', date: '2024-12-23', status: 'completed' },
  { id: 'W-004', type: 'debit', amount: 1200, description: 'Subscription renewal', date: '2024-12-22', status: 'completed' },
  { id: 'W-005', type: 'credit', amount: 10000, description: 'Top-up via bank transfer', date: '2024-12-20', status: 'completed' },
  { id: 'W-006', type: 'debit', amount: 450, description: 'Server upgrade fee', date: '2024-12-18', status: 'completed' },
];

const WalletScreen = () => {
  const [balance, setBalance] = useState(8240);
  const [addAmount, setAddAmount] = useState('');
  const [autoPay, setAutoPay] = useState(true);
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  const [autoTopUp, setAutoTopUp] = useState(false);

  const creditAdded = walletHistory.filter(w => w.type === 'credit').reduce((acc, w) => acc + w.amount, 0);
  const creditUsed = walletHistory.filter(w => w.type === 'debit').reduce((acc, w) => acc + w.amount, 0);

  const handleAddCredit = () => {
    const amount = parseFloat(addAmount);
    if (amount && amount > 0) {
      setBalance(balance + amount);
      toast.success(`$${amount} added to wallet`);
      setAddAmount('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Wallet className="w-6 h-6 text-emerald-400" />
          Wallet & Credits
        </h2>
        <p className="text-slate-400">Manage wallet balance and credit settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-emerald-300">Available Balance</p>
                <p className="text-5xl font-bold text-white mt-2">${balance.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Wallet className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">Credit Added</span>
                </div>
                <p className="text-2xl font-semibold text-white">${creditAdded.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm">Credit Used</span>
                </div>
                <p className="text-2xl font-semibold text-white">${creditUsed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Credit */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Add Credit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-400">Amount</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-slate-800 border-slate-600"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddCredit}>
                  Add
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              {[100, 500, 1000, 5000].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 flex-1"
                  onClick={() => setAddAmount(amt.toString())}
                >
                  ${amt}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 text-xs text-slate-400">
              <CreditCard className="w-4 h-4" />
              <span>Credit added instantly via card or bank</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Settings */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" />
              Wallet Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div>
                <p className="font-medium text-white">Auto-Pay from Wallet</p>
                <p className="text-xs text-slate-400">Automatically deduct for invoices</p>
              </div>
              <Switch checked={autoPay} onCheckedChange={setAutoPay} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div>
                <p className="font-medium text-white">Low Balance Alert</p>
                <p className="text-xs text-slate-400">Alert when balance below $500</p>
              </div>
              <Switch checked={lowBalanceAlert} onCheckedChange={setLowBalanceAlert} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div>
                <p className="font-medium text-white">Auto Top-Up</p>
                <p className="text-xs text-slate-400">Auto-add $1000 when balance low</p>
              </div>
              <Switch checked={autoTopUp} onCheckedChange={setAutoTopUp} />
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Wallet History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {walletHistory.map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'credit' ? 'bg-green-500/20' : 'bg-amber-500/20'
                      }`}>
                        {tx.type === 'credit' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white">{tx.description}</p>
                        <p className="text-xs text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      tx.type === 'credit' ? 'text-green-400' : 'text-amber-400'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletScreen;
