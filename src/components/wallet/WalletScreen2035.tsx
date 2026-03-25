import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calculator,
  FileText,
  Download,
  Filter,
  Search,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'pending' | 'commission';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  reference?: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'credit', amount: 2500, description: 'Task #DEV-2847 Payment', date: '2024-01-15', status: 'completed', reference: 'TXN-001' },
  { id: '2', type: 'commission', amount: 1200, description: 'Franchise Commission - January', date: '2024-01-14', status: 'completed', reference: 'TXN-002' },
  { id: '3', type: 'pending', amount: 3500, description: 'Task #DEV-2848 - Processing', date: '2024-01-14', status: 'processing' },
  { id: '4', type: 'debit', amount: 5000, description: 'Payout to Bank Account', date: '2024-01-13', status: 'completed', reference: 'TXN-003' },
  { id: '5', type: 'credit', amount: 1800, description: 'Referral Bonus', date: '2024-01-12', status: 'completed', reference: 'TXN-004' },
  { id: '6', type: 'pending', amount: 4200, description: 'Task #DEV-2849 - Under Review', date: '2024-01-12', status: 'pending' },
];

const WalletScreen2035 = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [commissionRate, setCommissionRate] = useState(15);
  const [saleAmount, setSaleAmount] = useState('');

  const totalBalance = 45200;
  const pendingBalance = 7700;
  const totalEarned = 125600;

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'credit': return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
      case 'debit': return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'commission': return <TrendingUp className="h-4 w-4 text-purple-400" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/20 text-blue-400">Processing</Badge>;
    }
  };

  const calculateCommission = () => {
    const amount = parseFloat(saleAmount);
    if (isNaN(amount)) return 0;
    return (amount * commissionRate) / 100;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Wallet
          </h1>
          <p className="text-muted-foreground mt-1">Manage your earnings and transactions</p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
          <CreditCard className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Wallet className="h-6 w-6 text-green-400" />
                </div>
                <Badge className="bg-green-500/30 text-green-400">Available</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-4xl font-bold text-green-400">₹{totalBalance.toLocaleString()}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <Badge className="bg-yellow-500/30 text-yellow-400">Pending</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Pending Balance</p>
              <p className="text-4xl font-bold text-yellow-400">₹{pendingBalance.toLocaleString()}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <Badge className="bg-purple-500/30 text-purple-400">Lifetime</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-4xl font-bold text-purple-400">₹{totalEarned.toLocaleString()}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="calculator">Commission Calculator</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payout">Payout Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Transaction History
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((txn, index) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          txn.type === 'credit' && "bg-green-500/20",
                          txn.type === 'debit' && "bg-red-500/20",
                          txn.type === 'pending' && "bg-yellow-500/20",
                          txn.type === 'commission' && "bg-purple-500/20"
                        )}>
                          {getTransactionIcon(txn.type)}
                        </div>
                        <div>
                          <p className="font-medium">{txn.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{txn.date}</span>
                            {txn.reference && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{txn.reference}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(txn.status)}
                        <span className={cn(
                          "text-lg font-semibold",
                          txn.type === 'credit' && "text-green-400",
                          txn.type === 'debit' && "text-red-400",
                          txn.type === 'pending' && "text-yellow-400",
                          txn.type === 'commission' && "text-purple-400"
                        )}>
                          {txn.type === 'debit' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <Card className="bg-card/50 border-border/50 max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Commission Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Sale Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter sale amount"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Commission Rate</span>
                  <span className="font-medium">{commissionRate}%</span>
                </div>
                <Progress value={commissionRate} max={30} className="h-2" />
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <p className="text-sm text-muted-foreground mb-2">Your Commission</p>
                <p className="text-4xl font-bold text-green-400">
                  ₹{calculateCommission().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 'INV-2024-001', date: 'Jan 15, 2024', amount: 15000, status: 'paid' },
                  { id: 'INV-2024-002', date: 'Jan 01, 2024', amount: 22500, status: 'paid' },
                  { id: 'INV-2023-012', date: 'Dec 15, 2023', amount: 18750, status: 'paid' },
                ].map((inv, i) => (
                  <div key={inv.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-mono font-medium">{inv.id}</p>
                        <p className="text-xs text-muted-foreground">{inv.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">₹{inv.amount.toLocaleString()}</span>
                      <Badge className="bg-green-500/20 text-green-400">Paid</Badge>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payout">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payout Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No pending payout requests
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletScreen2035;
