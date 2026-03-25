import React, { useState } from 'react';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const dailySalesData = [
  { day: 'Mon', sales: 4500, orders: 42 },
  { day: 'Tue', sales: 5200, orders: 48 },
  { day: 'Wed', sales: 4800, orders: 45 },
  { day: 'Thu', sales: 6100, orders: 56 },
  { day: 'Fri', sales: 7200, orders: 68 },
  { day: 'Sat', sales: 8500, orders: 82 },
  { day: 'Sun', sales: 6800, orders: 65 },
];

const productSalesData = [
  { name: 'Grocery', value: 45, color: '#10B981' },
  { name: 'Dairy', value: 25, color: '#3B82F6' },
  { name: 'Beverages', value: 15, color: '#F59E0B' },
  { name: 'Bakery', value: 10, color: '#EF4444' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
];

const topProducts = [
  { name: 'Rice (1kg)', sold: 245, revenue: 13475 },
  { name: 'Cooking Oil (1L)', sold: 180, revenue: 25200 },
  { name: 'Milk (500ml)', sold: 320, revenue: 8960 },
  { name: 'Sugar (1kg)', sold: 195, revenue: 8775 },
  { name: 'Tea (250g)', sold: 85, revenue: 10200 },
];

const hourlyData = [
  { hour: '9AM', sales: 800 },
  { hour: '10AM', sales: 1200 },
  { hour: '11AM', sales: 1800 },
  { hour: '12PM', sales: 2200 },
  { hour: '1PM', sales: 1500 },
  { hour: '2PM', sales: 1000 },
  { hour: '3PM', sales: 1400 },
  { hour: '4PM', sales: 1800 },
  { hour: '5PM', sales: 2400 },
  { hour: '6PM', sales: 2800 },
  { hour: '7PM', sales: 2200 },
  { hour: '8PM', sales: 1600 },
];

export const POSReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('today');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-500">Sales and performance analytics</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1">
            {['today', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="outline" size="lg" className="h-12 px-5 rounded-xl">
            <Calendar className="w-5 h-5 mr-2" />
            Custom Date
          </Button>
          <Button size="lg" className="h-12 px-5 bg-slate-700 hover:bg-slate-800 rounded-xl">
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1">Today's Sales</p>
          <p className="text-2xl font-bold text-slate-800">₹42,580</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +8.2%
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-slate-800">156</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
              <TrendingDown className="w-4 h-4" />
              -3.1%
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1">Items Sold</p>
          <p className="text-2xl font-bold text-slate-800">842</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +5.8%
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1">Unique Customers</p>
          <p className="text-2xl font-bold text-slate-800">89</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Daily Sales Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Sales</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px'
                }} 
              />
              <Bar dataKey="sales" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={productSalesData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {productSalesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {productSalesData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}</span>
                <span className="font-medium text-slate-800 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Hourly Sales */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Hourly Sales Pattern</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="hour" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px'
                }} 
              />
              <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-bold text-slate-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{product.name}</p>
                  <p className="text-sm text-slate-500">{product.sold} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
