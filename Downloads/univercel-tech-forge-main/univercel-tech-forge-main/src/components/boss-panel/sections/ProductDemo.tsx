import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package,
  Presentation,
  TrendingUp,
  Star,
  Eye,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const statsCards = [
  { label: 'Total Products', value: '156', icon: Package, color: 'blue' },
  { label: 'Active Demos', value: '42', icon: Presentation, color: 'purple' },
  { label: 'Conversion Rate', value: '34.2%', icon: TrendingUp, color: 'green' },
];

const topProducts = [
  { name: 'Enterprise Suite', demos: 156, conversions: 89, rate: 57 },
  { name: 'Starter Package', demos: 234, conversions: 67, rate: 29 },
  { name: 'Pro Bundle', demos: 189, conversions: 78, rate: 41 },
  { name: 'Agency License', demos: 112, conversions: 45, rate: 40 },
  { name: 'Custom Solution', demos: 67, conversions: 34, rate: 51 },
];

const conversionData = [
  { name: 'Converted', value: 34.2, color: '#22c55e' },
  { name: 'In Progress', value: 28.5, color: '#f59e0b' },
  { name: 'Lost', value: 37.3, color: '#ef4444' },
];

const colorMap: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
  green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
};

export function ProductDemo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product & Demo</h1>
          <p className="text-white/50 text-sm">Read-only overview of products and demos</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 flex items-center gap-1">
          <Eye className="w-3 h-3" />
          READ ONLY
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${colorMap[card.color]} border`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">{card.label}</p>
                      <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                    </div>
                    <Icon className="w-10 h-10 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Chart */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Demo Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a2e', 
                      border: '1px solid #ffffff20',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {conversionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-white/60">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white/50">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-xs text-white/50">{product.demos} demos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">{product.rate}%</p>
                    <p className="text-xs text-white/50">{product.conversions} converted</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* No Actions Notice */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 flex items-center justify-center gap-3">
          <Lock className="w-5 h-5 text-white/40" />
          <p className="text-white/50 text-sm">
            This is a read-only view. Product and demo management is handled by respective departments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
