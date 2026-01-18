/**
 * PD OVERVIEW
 * Dashboard overview with stats and charts
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Users, Calendar, CheckCircle2, TrendingUp, Globe, Monitor } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const statsCards = [
  { title: 'Total Demos', value: '1,284', change: '+12%', icon: Play, color: 'bg-blue-500' },
  { title: 'Active Demos', value: '47', change: '+5%', icon: Monitor, color: 'bg-green-500' },
  { title: 'Scheduled', value: '23', change: '+18%', icon: Calendar, color: 'bg-amber-500' },
  { title: 'Completed', value: '1,214', change: '+8%', icon: CheckCircle2, color: 'bg-purple-500' },
  { title: 'Conversion Rate', value: '34.2%', change: '+2.4%', icon: TrendingUp, color: 'bg-indigo-500' },
];

const dailyData = [
  { day: 'Mon', demos: 18 },
  { day: 'Tue', demos: 24 },
  { day: 'Wed', demos: 32 },
  { day: 'Thu', demos: 28 },
  { day: 'Fri', demos: 42 },
  { day: 'Sat', demos: 15 },
  { day: 'Sun', demos: 12 },
];

const funnelData = [
  { stage: 'Demo Requests', value: 450 },
  { stage: 'Scheduled', value: 320 },
  { stage: 'Attended', value: 280 },
  { stage: 'Follow-up', value: 180 },
  { stage: 'Converted', value: 95 },
];

const platformData = [
  { name: 'Web', value: 55, color: '#3B82F6' },
  { name: 'Android', value: 30, color: '#10B981' },
  { name: 'iOS', value: 15, color: '#8B5CF6' },
];

const countryData = [
  { country: 'India', demos: 420 },
  { country: 'USA', demos: 280 },
  { country: 'UK', demos: 145 },
  { country: 'UAE', demos: 98 },
  { country: 'Singapore', demos: 67 },
];

export const PDOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Demo Overview</h1>
        <p className="text-slate-500 mt-1">Track your product demo performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demos Per Day */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Demos Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="demos" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Demo to Purchase Funnel */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Demo to Purchase Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                  <YAxis dataKey="stage" type="category" stroke="#94A3B8" fontSize={11} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {platformData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Country-wise Demos */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <CardTitle className="text-base font-semibold text-slate-700">Country-wise Demos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countryData.map((item) => {
                const maxValue = Math.max(...countryData.map(c => c.demos));
                const percentage = (item.demos / maxValue) * 100;
                return (
                  <div key={item.country} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-24">{item.country}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700 w-12 text-right">{item.demos}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
