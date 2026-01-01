import { motion } from 'framer-motion';
import { 
  DollarSign, FileText, Clock, AlertTriangle, TrendingUp, Wallet,
  CheckCircle, Send, RefreshCw, Undo2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const summaryCards = [
  { label: 'Total Revenue', value: '$124,580', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'emerald' },
  { label: 'Paid Invoices', value: '156', change: '+8', trend: 'up', icon: CheckCircle, color: 'green' },
  { label: 'Pending Invoices', value: '23', change: '-3', trend: 'down', icon: Clock, color: 'amber' },
  { label: 'Overdue Invoices', value: '5', change: '+2', trend: 'up', icon: AlertTriangle, color: 'red' },
  { label: 'MRR', value: '$18,450', change: '+5.2%', trend: 'up', icon: TrendingUp, color: 'blue' },
  { label: 'Wallet Balance', value: '$8,240', change: '', trend: 'neutral', icon: Wallet, color: 'purple' },
];

const liveFeed = [
  { time: '2 min ago', type: 'invoice', message: 'Invoice #INV-2024-156 generated for Acme Corp', icon: FileText, color: 'blue' },
  { time: '5 min ago', type: 'payment', message: 'Payment of $2,450 received from TechStart Inc', icon: CheckCircle, color: 'green' },
  { time: '15 min ago', type: 'subscription', message: 'Subscription renewed for CloudBase Pro', icon: RefreshCw, color: 'purple' },
  { time: '1 hr ago', type: 'refund', message: 'Refund of $150 processed for Order #ORD-789', icon: Undo2, color: 'amber' },
  { time: '2 hrs ago', type: 'invoice', message: 'Invoice #INV-2024-155 sent to DataFlow Ltd', icon: Send, color: 'cyan' },
  { time: '3 hrs ago', type: 'payment', message: 'Payment of $890 received from StartupXYZ', icon: CheckCircle, color: 'green' },
];

const recentInvoices = [
  { id: 'INV-2024-156', client: 'Acme Corp', amount: '$3,200', status: 'sent', date: 'Dec 25, 2024' },
  { id: 'INV-2024-155', client: 'TechStart Inc', amount: '$2,450', status: 'paid', date: 'Dec 24, 2024' },
  { id: 'INV-2024-154', client: 'DataFlow Ltd', amount: '$5,800', status: 'pending', date: 'Dec 23, 2024' },
  { id: 'INV-2024-153', client: 'CloudBase Pro', amount: '$1,200', status: 'overdue', date: 'Dec 15, 2024' },
];

const BillingOverview = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'sent': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'overdue': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCardColor = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
      green: 'from-green-500/20 to-green-600/10 border-green-500/30',
      amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
      red: 'from-red-500/20 to-red-600/10 border-red-500/30',
      blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
      purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    };
    return colors[color] || colors.emerald;
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'text-emerald-400',
      green: 'text-green-400',
      amber: 'text-amber-400',
      red: 'text-red-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Billing Dashboard</h2>
        <p className="text-slate-400">Overview of all billing & payment activities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`bg-gradient-to-br ${getCardColor(card.color)} border`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <card.icon className={`w-5 h-5 ${getIconColor(card.color)}`} />
                  {card.change && (
                    <div className={`flex items-center text-xs ${
                      card.trend === 'up' ? 'text-green-400' : card.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {card.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                      {card.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                      {card.change}
                    </div>
                  )}
                </div>
                <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
                <p className="text-xs text-slate-400 mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Feed */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {liveFeed.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-${item.color}-500/20`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{item.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentInvoices.map((invoice, idx) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <FileText className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{invoice.id}</p>
                      <p className="text-xs text-slate-400">{invoice.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{invoice.amount}</p>
                    <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">98.5%</p>
            <p className="text-sm text-slate-400">Payment Success Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">2.3 days</p>
            <p className="text-sm text-slate-400">Avg. Payment Time</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">89</p>
            <p className="text-sm text-slate-400">Active Subscriptions</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">$4,280</p>
            <p className="text-sm text-slate-400">Outstanding Amount</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingOverview;
