import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Target, ArrowUpRight, 
  ArrowDownRight, Calendar, Filter, BarChart3, PieChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const FranchiseSalesCenter = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  const salesStats = {
    totalSales: '₹8.5L',
    totalSalesGrowth: 15,
    avgDealSize: '₹42,500',
    avgDealGrowth: 8,
    conversions: 24,
    conversionGrowth: 12,
    pipeline: '₹12.8L',
    pipelineGrowth: 22,
  };

  const monthlyData = [
    { month: 'Jan', sales: 420000, target: 500000 },
    { month: 'Feb', sales: 380000, target: 500000 },
    { month: 'Mar', sales: 560000, target: 500000 },
    { month: 'Apr', sales: 490000, target: 550000 },
    { month: 'May', sales: 620000, target: 550000 },
    { month: 'Jun', sales: 580000, target: 600000 },
  ];

  const topProducts = [
    { name: 'POS System', sales: '₹2.8L', units: 8, growth: 25 },
    { name: 'School ERP', sales: '₹2.1L', units: 5, growth: 18 },
    { name: 'Hospital Suite', sales: '₹1.8L', units: 3, growth: 32 },
    { name: 'E-Commerce', sales: '₹1.2L', units: 4, growth: -5 },
    { name: 'CRM Pro', sales: '₹0.6L', units: 4, growth: 45 },
  ];

  const recentDeals = [
    { client: 'TechRetail Stores', product: 'POS System', value: '₹85,000', date: 'Jan 15', status: 'closed' },
    { client: 'City Hospital', product: 'Hospital Suite', value: '₹1,20,000', date: 'Jan 14', status: 'closed' },
    { client: 'ABC School', product: 'School ERP', value: '₹65,000', date: 'Jan 12', status: 'negotiation' },
    { client: 'Fashion Hub', product: 'E-Commerce', value: '₹45,000', date: 'Jan 10', status: 'demo' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'text-emerald-400 bg-emerald-500/20';
      case 'negotiation': return 'text-amber-400 bg-amber-500/20';
      case 'demo': return 'text-indigo-400 bg-indigo-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Center</h1>
          <p className="text-slate-400">Track your sales performance and pipeline</p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700/50 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              {salesStats.totalSalesGrowth}%
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{salesStats.totalSales}</p>
          <p className="text-slate-400 text-sm">Total Sales</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex items-center gap-1 text-indigo-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              {salesStats.avgDealGrowth}%
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{salesStats.avgDealSize}</p>
          <p className="text-slate-400 text-sm">Avg Deal Size</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-purple-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              {salesStats.conversionGrowth}%
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{salesStats.conversions}</p>
          <p className="text-slate-400 text-sm">Conversions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              {salesStats.pipelineGrowth}%
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{salesStats.pipeline}</p>
          <p className="text-slate-400 text-sm">Pipeline Value</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Performance */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, index) => {
                const percentage = Math.round((month.sales / month.target) * 100);
                const isAboveTarget = month.sales >= month.target;
                return (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{month.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-white">₹{(month.sales / 100000).toFixed(1)}L</span>
                        <span className={`text-xs ${isAboveTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {percentage}% of target
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${isAboveTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PieChart className="w-5 h-5 text-purple-400" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-slate-900/50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-sm">{product.name}</span>
                  <span className={`text-xs flex items-center gap-1 ${product.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {product.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(product.growth)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-400">{product.sales}</span>
                  <span className="text-slate-400">{product.units} units</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Deals */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Recent Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDeals.map((deal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{deal.client}</p>
                    <p className="text-xs text-slate-400">{deal.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{deal.value}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{deal.date}</span>
                    <Badge className={getStatusColor(deal.status)}>
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseSalesCenter;
