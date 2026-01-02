import React, { useState } from 'react';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  UtensilsCrossed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const dailySalesData = [
  { day: 'Mon', revenue: 28500, orders: 85 },
  { day: 'Tue', revenue: 32000, orders: 92 },
  { day: 'Wed', revenue: 29800, orders: 88 },
  { day: 'Thu', revenue: 35200, orders: 105 },
  { day: 'Fri', revenue: 42500, orders: 128 },
  { day: 'Sat', revenue: 52000, orders: 156 },
  { day: 'Sun', revenue: 48500, orders: 142 },
];

const categorySales = [
  { name: 'Main Course', value: 45, color: '#F97316' },
  { name: 'Starters', value: 20, color: '#EF4444' },
  { name: 'Rice & Biryani', value: 18, color: '#10B981' },
  { name: 'Beverages', value: 10, color: '#3B82F6' },
  { name: 'Desserts', value: 7, color: '#8B5CF6' },
];

const topItems = [
  { name: 'Butter Chicken', orders: 145, revenue: 55100 },
  { name: 'Chicken Biryani', orders: 128, revenue: 44800 },
  { name: 'Paneer Butter Masala', orders: 112, revenue: 35840 },
  { name: 'Garlic Naan', orders: 280, revenue: 19600 },
  { name: 'Dal Makhani', orders: 95, revenue: 26600 },
];

const hourlyData = [
  { hour: '11 AM', orders: 12 },
  { hour: '12 PM', orders: 35 },
  { hour: '1 PM', orders: 48 },
  { hour: '2 PM', orders: 28 },
  { hour: '3 PM', orders: 15 },
  { hour: '4 PM', orders: 8 },
  { hour: '5 PM', orders: 18 },
  { hour: '6 PM', orders: 32 },
  { hour: '7 PM', orders: 45 },
  { hour: '8 PM', orders: 52 },
  { hour: '9 PM', orders: 38 },
  { hour: '10 PM', orders: 22 },
];

export const RestaurantReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('today');

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-auto">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Reports & Analytics</h1>
          <div className="flex gap-3">
            <div className="flex bg-zinc-900 rounded-xl p-1">
              {['today', 'week', 'month'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    dateRange === range 
                      ? 'bg-orange-500 text-white' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              Custom
            </Button>
            <Button className="bg-zinc-800 hover:bg-zinc-700 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-white/80" />
              <span className="flex items-center gap-1 text-white/80 text-sm">
                <TrendingUp className="w-4 h-4" />
                +15.2%
              </span>
            </div>
            <p className="text-white/80 text-sm">Today's Revenue</p>
            <p className="text-3xl font-bold text-white">₹52,480</p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <ShoppingCart className="w-8 h-8 text-blue-400" />
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                +8.5%
              </span>
            </div>
            <p className="text-zinc-400 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-white">156</p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-green-400" />
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <p className="text-zinc-400 text-sm">Customers Served</p>
            <p className="text-3xl font-bold text-white">284</p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <UtensilsCrossed className="w-8 h-8 text-purple-400" />
              <span className="flex items-center gap-1 text-red-400 text-sm">
                <TrendingDown className="w-4 h-4" />
                -2.1%
              </span>
            </div>
            <p className="text-zinc-400 text-sm">Avg Order Value</p>
            <p className="text-3xl font-bold text-white">₹336</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <div className="col-span-2 bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Revenue</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailySalesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="day" stroke="#71717A" />
                <YAxis stroke="#71717A" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181B', 
                    border: '1px solid #27272A',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#F97316" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categorySales.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-400">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Peak Hours */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Peak Hours</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="hour" stroke="#71717A" fontSize={10} />
                <YAxis stroke="#71717A" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181B', 
                    border: '1px solid #27272A',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="orders" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Items */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Top Selling Items</h3>
            <div className="space-y-3">
              {topItems.map((item, index) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-sm font-bold text-orange-400">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-zinc-500">{item.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-400">₹{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
