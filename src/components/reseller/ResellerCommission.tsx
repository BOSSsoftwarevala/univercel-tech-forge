import { motion } from 'framer-motion';
import { 
  Percent, TrendingUp, DollarSign, Clock, CheckCircle2, 
  ArrowUpRight, ArrowDownRight, Calendar, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const commissionStats = [
  { label: 'Commission Rate', value: '20%', icon: Percent, color: 'emerald', subtitle: 'Fixed Rate' },
  { label: 'Earned This Month', value: '₹98,500', change: '+18%', trend: 'up', icon: TrendingUp, color: 'teal' },
  { label: 'Pending Commission', value: '₹45,000', icon: Clock, color: 'amber', subtitle: '3 orders' },
  { label: 'Paid Commission', value: '₹6.85L', icon: CheckCircle2, color: 'cyan', subtitle: 'Lifetime' },
];

const commissionHistory = [
  { id: 1, product: 'E-Commerce Platform', saleValue: 50000, commission: 10000, date: '2024-01-15', status: 'paid' },
  { id: 2, product: 'Hospital Management', saleValue: 125000, commission: 25000, date: '2024-01-14', status: 'pending' },
  { id: 3, product: 'School ERP', saleValue: 75000, commission: 15000, date: '2024-01-12', status: 'processing' },
  { id: 4, product: 'POS System', saleValue: 40000, commission: 8000, date: '2024-01-10', status: 'paid' },
  { id: 5, product: 'Inventory Management', saleValue: 65000, commission: 13000, date: '2024-01-08', status: 'paid' },
];

const monthlyTrend = [
  { month: 'Aug', amount: 45000 },
  { month: 'Sep', amount: 62000 },
  { month: 'Oct', amount: 78000 },
  { month: 'Nov', amount: 85000 },
  { month: 'Dec', amount: 92000 },
  { month: 'Jan', amount: 98500 },
];

const ResellerCommission = () => {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-emerald-500/20 text-emerald-400',
      pending: 'bg-amber-500/20 text-amber-400',
      processing: 'bg-blue-500/20 text-blue-400',
    };
    return styles[status] || styles.pending;
  };

  const maxAmount = Math.max(...monthlyTrend.map(m => m.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Commission</h1>
          <p className="text-slate-400">Track your earnings and commission history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {commissionStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                      <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                    </div>
                    {stat.change && (
                      <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.change}
                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    {stat.subtitle && <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Monthly Commission Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-4 h-48">
              {monthlyTrend.map((month, index) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.amount / maxAmount) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-emerald-500/50 to-teal-500/30 rounded-t-lg relative min-h-[20px]"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-emerald-400 whitespace-nowrap">
                      ₹{(month.amount / 1000).toFixed(0)}K
                    </span>
                  </motion.div>
                  <span className="text-xs text-slate-400">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commission Breakdown */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-400" />
              Commission Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Your Commission Rate</span>
                <span className="text-2xl font-bold text-emerald-400">20%</span>
              </div>
              <p className="text-slate-400 text-sm">Fixed rate on all software sales</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Sales Value (This Month)</span>
                <span className="text-white font-medium">₹4,92,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Your Commission (20%)</span>
                <span className="text-emerald-400 font-medium">₹98,500</span>
              </div>
              <Progress value={100} className="h-2 bg-slate-800" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission History */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Commission History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commissionHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Percent className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.product}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Sale Value</p>
                    <p className="text-white">₹{item.saleValue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Commission (20%)</p>
                    <p className="text-emerald-400 font-bold">+₹{item.commission.toLocaleString()}</p>
                  </div>
                  <Badge className={getStatusBadge(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerCommission;
