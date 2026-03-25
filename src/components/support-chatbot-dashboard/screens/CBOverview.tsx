/**
 * OVERVIEW SCREEN
 * Dashboard with key metrics and charts
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageCircle, 
  Ticket, 
  Clock,
  Star,
  TrendingUp,
  Users,
  Smile
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const statsCards = [
  {
    title: 'Active Chatbots',
    value: '4',
    subtitle: '2 on Web, 1 Android, 1 WhatsApp',
    icon: Bot,
    color: 'from-blue-500 to-blue-600',
    trend: '+1 this month'
  },
  {
    title: 'Live Conversations',
    value: '23',
    subtitle: '18 with bot, 5 with agents',
    icon: MessageCircle,
    color: 'from-emerald-500 to-emerald-600',
    trend: 'Active now'
  },
  {
    title: 'Open Tickets',
    value: '12',
    subtitle: '3 urgent, 9 normal',
    icon: Ticket,
    color: 'from-orange-500 to-orange-600',
    trend: '↓ 4 from yesterday'
  },
  {
    title: 'Avg Response Time',
    value: '8s',
    subtitle: 'Bot responds instantly',
    icon: Clock,
    color: 'from-violet-500 to-violet-600',
    trend: '2s faster this week'
  },
  {
    title: 'Customer Satisfaction',
    value: '94%',
    subtitle: 'Based on 1,247 ratings',
    icon: Star,
    color: 'from-amber-500 to-amber-600',
    trend: '↑ 3% this month'
  },
];

const conversationsData = [
  { day: 'Mon', conversations: 145 },
  { day: 'Tue', conversations: 178 },
  { day: 'Wed', conversations: 203 },
  { day: 'Thu', conversations: 189 },
  { day: 'Fri', conversations: 234 },
  { day: 'Sat', conversations: 156 },
  { day: 'Sun', conversations: 98 },
];

const resolutionData = [
  { name: 'Bot Resolved', value: 72, color: '#3b82f6' },
  { name: 'Human Resolved', value: 28, color: '#f59e0b' },
];

const countryData = [
  { country: '🇮🇳 India', chats: 45 },
  { country: '🇺🇸 USA', chats: 28 },
  { country: '🇬🇧 UK', chats: 15 },
  { country: '🇩🇪 Germany', chats: 8 },
  { country: '🇧🇷 Brazil', chats: 4 },
];

export const CBOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back! 👋</h1>
            <p className="text-blue-100 mt-1">Here's what's happening with your chatbots today</p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3">
            <div className="text-center">
              <p className="text-2xl font-bold">1,203</p>
              <p className="text-xs text-blue-200">Chats today</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <p className="text-2xl font-bold">94%</p>
              <p className="text-xs text-blue-200">Resolved by bot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-200">
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{stat.title}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations Chart */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-800">Conversations This Week</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Daily chat volume across all channels</p>
              </div>
              <Badge variant="outline" className="text-xs">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`${value} chats`, 'Conversations']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversations" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Pie Chart */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">Who Resolves Chats?</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Bot vs human agent resolution</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resolutionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {resolutionData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '']}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {resolutionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-slate-600">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Stats */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800">Chats by Country</CardTitle>
          <p className="text-xs text-slate-500 mt-1">Where your customers are chatting from</p>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} unit="%" />
                <YAxis dataKey="country" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Share']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="chats" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
