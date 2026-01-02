import React from 'react';
import { 
  Store, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 4200, orders: 120 },
  { name: 'Tue', revenue: 5800, orders: 145 },
  { name: 'Wed', revenue: 4800, orders: 130 },
  { name: 'Thu', revenue: 7200, orders: 180 },
  { name: 'Fri', revenue: 8500, orders: 210 },
  { name: 'Sat', revenue: 9200, orders: 245 },
  { name: 'Sun', revenue: 6800, orders: 165 },
];

const outletData = [
  { name: 'Downtown', sales: 45000 },
  { name: 'Mall', sales: 38000 },
  { name: 'Airport', sales: 22000 },
];

const topProducts = [
  { name: 'Premium Coffee Blend', sales: 1240, revenue: '$12,400', trend: 12 },
  { name: 'Organic Green Tea', sales: 890, revenue: '$8,900', trend: 8 },
  { name: 'Chocolate Croissant', sales: 756, revenue: '$5,292', trend: -3 },
  { name: 'Avocado Toast', sales: 645, revenue: '$9,675', trend: 15 },
  { name: 'Fresh Juice Combo', sales: 534, revenue: '$4,272', trend: 5 },
];

const paymentMethods = [
  { name: 'Card', value: 45, color: '#8b5cf6' },
  { name: 'Cash', value: 25, color: '#06b6d4' },
  { name: 'UPI', value: 20, color: '#10b981' },
  { name: 'Wallet', value: 10, color: '#f59e0b' },
];

export const SaaSPOSDashboard: React.FC = () => {
  const stats = [
    { 
      label: 'Total Outlets', 
      value: '12', 
      change: '+2 this month',
      trend: 'up',
      icon: Store,
      gradient: 'from-violet-500 to-indigo-500'
    },
    { 
      label: 'Live Sales Today', 
      value: '$24,580', 
      change: '+18.2%',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      label: 'Total Orders', 
      value: '1,845', 
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingBag,
      gradient: 'from-orange-500 to-amber-500'
    },
    { 
      label: 'Avg. Order Value', 
      value: '$38.50', 
      change: '-2.1%',
      trend: 'down',
      icon: DollarSign,
      gradient: 'from-pink-500 to-rose-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
              <p className="text-sm text-slate-500">Weekly revenue performance</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Payment Methods</h3>
              <p className="text-sm text-slate-500">Distribution by type</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {paymentMethods.map((method) => (
              <div key={method.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                <span className="text-sm text-slate-600">{method.name}</span>
                <span className="text-sm font-medium text-slate-900 ml-auto">{method.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outlet Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Outlet Performance</h3>
              <p className="text-sm text-slate-500">Sales comparison by outlet</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outletData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Top Selling Items</h3>
              <p className="text-sm text-slate-500">Best performers this week</p>
            </div>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg flex items-center justify-center text-violet-600 font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{product.revenue}</p>
                  <p className={`text-sm flex items-center justify-end gap-1 ${product.trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(product.trend)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
