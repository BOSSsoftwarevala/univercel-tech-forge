import { motion } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, CreditCard, 
  Building2, Users, DollarSign, FileText, AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const FinanceManagerDashboard = () => {
  const financeStats = {
    totalRevenue: 12456780,
    pendingPayouts: 345600,
    processedToday: 89500,
    commissionsPaid: 234500,
    refundsPending: 12300,
    walletBalance: 5678900
  };

  const pendingPayouts = [
    { id: 1, type: 'Franchise', name: 'Fra***01', amount: 45000, status: 'pending' },
    { id: 2, type: 'Reseller', name: 'Res***12', amount: 23000, status: 'processing' },
    { id: 3, type: 'Developer', name: 'Dev***08', amount: 18500, status: 'pending' },
    { id: 4, type: 'Influencer', name: 'Inf***05', amount: 12000, status: 'pending' },
    { id: 5, type: 'Franchise', name: 'Fra***03', amount: 67000, status: 'approved' },
  ];

  const recentTransactions = [
    { id: 1, type: 'credit', desc: 'Prime Subscription - PRU***45', amount: 29999, time: '2m ago' },
    { id: 2, type: 'debit', desc: 'Developer Payout - Dev***08', amount: 18500, time: '15m ago' },
    { id: 3, type: 'credit', desc: 'Lead Conversion - Fra***01', amount: 5000, time: '32m ago' },
    { id: 4, type: 'debit', desc: 'Commission Paid - Res***12', amount: 2300, time: '1h ago' },
    { id: 5, type: 'credit', desc: 'Demo Access - CLI***78', amount: 4999, time: '2h ago' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <DashboardLayout roleOverride="finance_manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold text-foreground">Finance Command</h1>
            <p className="text-muted-foreground">Wallet, payouts & commission management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Export Report
            </Button>
            <Button className="gap-2 bg-neon-green/20 text-neon-green border border-neon-green/50">
              <CreditCard className="w-4 h-4" />
              Process Payouts
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Revenue', value: formatCurrency(financeStats.totalRevenue), icon: DollarSign, color: 'text-neon-green' },
            { label: 'Pending Payouts', value: formatCurrency(financeStats.pendingPayouts), icon: Wallet, color: 'text-neon-orange' },
            { label: 'Processed Today', value: formatCurrency(financeStats.processedToday), icon: CreditCard, color: 'text-neon-cyan' },
            { label: 'Commissions Paid', value: formatCurrency(financeStats.commissionsPaid), icon: Users, color: 'text-neon-purple' },
            { label: 'Refunds Pending', value: formatCurrency(financeStats.refundsPending), icon: AlertCircle, color: 'text-neon-red' },
            { label: 'Master Wallet', value: formatCurrency(financeStats.walletBalance), icon: Building2, color: 'text-primary' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-panel">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-lg font-mono font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Payouts */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Pending Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPayouts.map((payout) => (
                  <div 
                    key={payout.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {payout.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-foreground">{payout.name}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(payout.amount)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        payout.status === 'approved' ? 'bg-neon-green/20 text-neon-green' :
                        payout.status === 'processing' ? 'bg-neon-cyan/20 text-neon-cyan' :
                        'bg-neon-orange/20 text-neon-orange'
                      }`}>
                        {payout.status}
                      </Badge>
                      {payout.status === 'pending' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'credit' ? 'bg-neon-green/20' : 'bg-neon-red/20'
                      }`}>
                        {tx.type === 'credit' ? (
                          <ArrowDownRight className="w-4 h-4 text-neon-green" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-neon-red" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.desc}</p>
                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                      </div>
                    </div>
                    <span className={`font-mono font-bold ${
                      tx.type === 'credit' ? 'text-neon-green' : 'text-neon-red'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Breakdown */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg font-mono">Commission Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { role: 'Franchise', total: 145000, pending: 23000, percentage: 45 },
                { role: 'Reseller', total: 67000, pending: 12000, percentage: 28 },
                { role: 'Developer', total: 89000, pending: 8000, percentage: 18 },
                { role: 'Influencer', total: 34000, pending: 5000, percentage: 9 },
              ].map((item) => (
                <div key={item.role} className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{item.role}</span>
                    <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <p className="text-lg font-mono font-bold text-foreground">{formatCurrency(item.total)}</p>
                  <Progress value={item.percentage} className="h-2 mt-2" />
                  <p className="text-xs text-neon-orange mt-1">Pending: {formatCurrency(item.pending)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FinanceManagerDashboard;
