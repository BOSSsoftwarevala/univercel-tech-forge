import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Globe, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const summaryCards = [
  { label: 'Total Super Admins', value: '12', icon: Users, trend: '+2', trendUp: true, color: 'amber' },
  { label: 'Active Continents', value: '5', icon: Globe, trend: '0', trendUp: true, color: 'blue' },
  { label: 'Countries Live', value: '47', icon: MapPin, trend: '+3', trendUp: true, color: 'green' },
  { label: 'Revenue Today', value: '$124.5K', icon: DollarSign, trend: '+12%', trendUp: true, color: 'emerald' },
  { label: 'Critical Alerts', value: '2', icon: AlertTriangle, trend: '-1', trendUp: false, color: 'red' },
  { label: 'System Health', value: '98.7%', icon: Activity, trend: '+0.2%', trendUp: true, color: 'cyan' },
];

const revenueData = [
  { month: 'Jan', revenue: 65000 },
  { month: 'Feb', revenue: 78000 },
  { month: 'Mar', revenue: 92000 },
  { month: 'Apr', revenue: 85000 },
  { month: 'May', revenue: 110000 },
  { month: 'Jun', revenue: 124500 },
];

const conversionData = [
  { name: 'New', value: 340 },
  { name: 'Contacted', value: 280 },
  { name: 'Qualified', value: 180 },
  { name: 'Demo', value: 120 },
  { name: 'Converted', value: 85 },
];

const moduleUsage = [
  { module: 'Leads', usage: 89 },
  { module: 'Products', usage: 76 },
  { module: 'Demos', usage: 65 },
  { module: 'Billing', usage: 92 },
  { module: 'AI Engine', usage: 45 },
];

const riskData = [
  { name: 'Low', value: 65, color: '#22c55e' },
  { name: 'Medium', value: 25, color: '#f59e0b' },
  { name: 'High', value: 10, color: '#ef4444' },
];

const colorMap: Record<string, string> = {
  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
};

export function BossDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Command Dashboard</h1>
          <p className="text-white/50 text-sm">Real-time overview of all operations</p>
        </div>
        <div className="text-xs text-white/40">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`bg-gradient-to-br ${colorMap[card.color]} border`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" />
                    <div className={`flex items-center text-xs ${card.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                      {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {card.trend}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{card.value}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">{card.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} />
                <YAxis stroke="#ffffff40" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Conversion Funnel */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Lead Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" stroke="#ffffff40" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#ffffff40" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Usage */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Module Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moduleUsage.map((item) => (
                <div key={item.module} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">{item.module}</span>
                    <span className="text-white">{item.usage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.usage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Index */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Risk Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a2e', 
                      border: '1px solid #ffffff20',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {riskData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-white/60">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
