import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  Store,
  DollarSign,
  FileText,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const outletComparison = [
  { name: 'Downtown', revenue: 45000, orders: 1245, avg: 36.14 },
  { name: 'Mall', revenue: 38000, orders: 1050, avg: 36.19 },
  { name: 'Airport', revenue: 22000, orders: 580, avg: 37.93 },
  { name: 'Beach', revenue: 28000, orders: 720, avg: 38.89 },
  { name: 'Campus', revenue: 15000, orders: 450, avg: 33.33 },
];

const monthlyTrend = [
  { month: 'Jan', revenue: 125000, target: 120000 },
  { month: 'Feb', revenue: 132000, target: 125000 },
  { month: 'Mar', revenue: 145000, target: 130000 },
  { month: 'Apr', revenue: 138000, target: 135000 },
  { month: 'May', revenue: 155000, target: 140000 },
  { month: 'Jun', revenue: 168000, target: 150000 },
];

const taxBreakdown = [
  { name: 'GST', value: 18, color: '#8b5cf6' },
  { name: 'Service Tax', value: 5, color: '#06b6d4' },
  { name: 'Local Tax', value: 2, color: '#10b981' },
];

const complianceReports = [
  { name: 'Monthly GST Return', status: 'Filed', date: 'Dec 2024', action: 'Download' },
  { name: 'Quarterly TDS', status: 'Pending', date: 'Q4 2024', action: 'Generate' },
  { name: 'Annual Compliance', status: 'Filed', date: 'FY 2023-24', action: 'Download' },
  { name: 'Sales Tax Report', status: 'Filed', date: 'Dec 2024', action: 'Download' },
];

export const ReportsAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500">Outlet comparison and compliance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors",
                  dateRange === range ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-200 transition-all">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-3xl font-bold mt-3">$148,000</p>
          <p className="text-violet-200">Total Revenue</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between">
            <Store className="w-8 h-8 text-emerald-500" />
            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">Top</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">Downtown</p>
          <p className="text-slate-500">Best Performer</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">$37.25</p>
          <p className="text-slate-500">Avg Order Value</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between">
            <FileText className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">$26,640</p>
          <p className="text-slate-500">Total Tax Collected</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outlet Comparison */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Outlet Comparison</h3>
              <p className="text-sm text-slate-500">Revenue by outlet this month</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outletComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue vs Target</h3>
              <p className="text-sm text-slate-500">Monthly performance tracking</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
                <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outlet Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Detailed Outlet Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-slate-600">Outlet</th>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-slate-600">Revenue</th>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-slate-600">Orders</th>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-slate-600">Avg Order</th>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-slate-600">Performance</th>
                </tr>
              </thead>
              <tbody>
                {outletComparison.map((outlet, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-900">{outlet.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-900">${outlet.revenue.toLocaleString()}</td>
                    <td className="py-4 px-5 text-slate-600">{outlet.orders.toLocaleString()}</td>
                    <td className="py-4 px-5 text-slate-600">${outlet.avg.toFixed(2)}</td>
                    <td className="py-4 px-5">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full"
                          style={{ width: `${(outlet.revenue / 45000) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax & Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Tax & Compliance</h3>
            <p className="text-sm text-slate-500">Reports and filings</p>
          </div>
          <div className="p-5">
            {/* Tax Breakdown */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Tax Breakdown</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taxBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taxBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {taxBreakdown.map((tax) => (
                  <div key={tax.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tax.color }} />
                    <span className="text-xs text-slate-600">{tax.name} ({tax.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Reports */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Recent Filings</h4>
              {complianceReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{report.name}</p>
                    <p className="text-xs text-slate-500">{report.date}</p>
                  </div>
                  <button className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg",
                    report.status === 'Filed' 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-amber-100 text-amber-700"
                  )}>
                    {report.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
