/**
 * DASHBOARD HOME SCREEN
 * Stats cards + usage charts
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Languages, 
  Globe2, 
  Smartphone, 
  Heart,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const statsCards = [
  {
    title: 'Total AI Requests',
    value: '2.4M',
    change: '+12.5%',
    trend: 'up',
    icon: Activity,
    color: 'blue'
  },
  {
    title: 'Active Languages',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: Languages,
    color: 'emerald'
  },
  {
    title: 'Active Countries',
    value: '47',
    change: '+5',
    trend: 'up',
    icon: Globe2,
    color: 'violet'
  },
  {
    title: 'Android APK',
    value: 'v2.4.1',
    change: 'Production',
    trend: 'stable',
    icon: Smartphone,
    color: 'orange'
  },
  {
    title: 'API Health',
    value: '99.9%',
    change: 'Operational',
    trend: 'up',
    icon: Heart,
    color: 'green'
  }
];

const dailyUsageData = [
  { day: 'Mon', requests: 320000 },
  { day: 'Tue', requests: 350000 },
  { day: 'Wed', requests: 410000 },
  { day: 'Thu', requests: 380000 },
  { day: 'Fri', requests: 450000 },
  { day: 'Sat', requests: 280000 },
  { day: 'Sun', requests: 230000 },
];

const countryUsageData = [
  { country: 'India', usage: 45 },
  { country: 'USA', usage: 22 },
  { country: 'UK', usage: 12 },
  { country: 'Germany', usage: 8 },
  { country: 'Brazil', usage: 6 },
  { country: 'Others', usage: 7 },
];

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
  violet: 'from-violet-500 to-violet-600',
  orange: 'from-orange-500 to-orange-600',
  green: 'from-green-500 to-green-600',
};

export const SVDashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your AI platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      stat.trend === 'up' 
                        ? 'text-emerald-600 border-emerald-200 bg-emerald-50' 
                        : stat.trend === 'down'
                        ? 'text-red-600 border-red-200 bg-red-50'
                        : 'text-slate-600 border-slate-200 bg-slate-50'
                    }`}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Chart */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800">Daily Usage</CardTitle>
              <Badge variant="outline" className="text-xs">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`${(value/1000).toFixed(0)}k requests`, 'Usage']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Country Usage Chart */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800">Usage by Country</CardTitle>
              <Badge variant="outline" className="text-xs">% Distribution</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryUsageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} unit="%" />
                  <YAxis dataKey="country" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                  <Bar 
                    dataKey="usage" 
                    fill="#3b82f6" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
