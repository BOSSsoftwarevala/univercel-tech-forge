import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign,
  TrendingUp,
  Globe,
  Building,
  Users,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const periodData = {
  today: { revenue: '$124,500', growth: '+12.5%', transactions: 234 },
  month: { revenue: '$2.4M', growth: '+8.3%', transactions: 4567 },
  year: { revenue: '$28.7M', growth: '+24.1%', transactions: 52340 },
};

const regionRevenue = [
  { region: 'North America', revenue: 8500000, growth: 15 },
  { region: 'Europe', revenue: 6200000, growth: 12 },
  { region: 'Asia Pacific', revenue: 5800000, growth: 28 },
  { region: 'Middle East', revenue: 3200000, growth: 18 },
  { region: 'Africa', revenue: 2100000, growth: 35 },
  { region: 'South America', revenue: 2900000, growth: 22 },
];

const monthlyTrend = [
  { month: 'Jan', revenue: 2100000 },
  { month: 'Feb', revenue: 2300000 },
  { month: 'Mar', revenue: 2150000 },
  { month: 'Apr', revenue: 2500000 },
  { month: 'May', revenue: 2800000 },
  { month: 'Jun', revenue: 2400000 },
];

const franchiseContribution = [
  { name: 'Top 10 Franchises', value: 45, amount: '$12.9M' },
  { name: 'Mid-tier (11-50)', value: 35, amount: '$10.0M' },
  { name: 'Others', value: 20, amount: '$5.8M' },
];

const resellerCommissions = {
  total: '$1.2M',
  pending: '$340K',
  paid: '$860K',
  count: 567,
};

export function RevenueSnapshot() {
  const [activePeriod, setActivePeriod] = useState<'today' | 'month' | 'year'>('month');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Snapshot</h1>
          <p className="text-white/50 text-sm">Financial overview across all regions</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Live Data
        </Badge>
      </div>

      {/* Period Tabs */}
      <Tabs value={activePeriod} onValueChange={(v) => setActivePeriod(v as any)}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="today" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Today
          </TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            This Month
          </TabsTrigger>
          <TabsTrigger value="year" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            This Year
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activePeriod} className="mt-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-400/70">Total Revenue</p>
                    <p className="text-3xl font-bold text-white mt-1">{periodData[activePeriod].revenue}</p>
                    <p className="text-sm text-green-400 mt-1">{periodData[activePeriod].growth} vs last period</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-400/70">Transactions</p>
                    <p className="text-3xl font-bold text-white mt-1">{periodData[activePeriod].transactions.toLocaleString()}</p>
                    <p className="text-sm text-blue-400 mt-1">Completed orders</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-blue-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-400/70">Avg. Transaction</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      ${Math.round(parseInt(periodData[activePeriod].revenue.replace(/[^0-9]/g, '')) / periodData[activePeriod].transactions).toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-400 mt-1">Per order</p>
                  </div>
                  <Calendar className="w-10 h-10 text-purple-400/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region-wise Revenue */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Region-wise Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regionRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" stroke="#ffffff40" fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <YAxis dataKey="region" type="category" stroke="#ffffff40" fontSize={11} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} />
                <YAxis stroke="#ffffff40" fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Franchise Contribution */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              Franchise Contribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {franchiseContribution.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">{item.name}</span>
                    <span className="text-white">{item.amount} ({item.value}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reseller Commissions */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Reseller Commissions (Summary)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-white">{resellerCommissions.total}</p>
                <p className="text-xs text-white/50">Total Commissions</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-green-400">{resellerCommissions.paid}</p>
                <p className="text-xs text-white/50">Paid Out</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-amber-400">{resellerCommissions.pending}</p>
                <p className="text-xs text-white/50">Pending</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-blue-400">{resellerCommissions.count}</p>
                <p className="text-xs text-white/50">Active Resellers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
