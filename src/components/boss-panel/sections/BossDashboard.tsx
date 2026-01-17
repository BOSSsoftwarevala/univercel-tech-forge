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

// LOCKED: Summary cards data
const summaryCards = [
  { label: 'Total Super Admins', value: '12', icon: Users, trend: '+2', trendUp: true },
  { label: 'Active Continents', value: '5', icon: Globe, trend: '0', trendUp: true },
  { label: 'Countries Live', value: '47', icon: MapPin, trend: '+3', trendUp: true },
  { label: 'Revenue Today', value: '$124.5K', icon: DollarSign, trend: '+12%', trendUp: true },
  { label: 'Critical Alerts', value: '2', icon: AlertTriangle, trend: '-1', trendUp: false },
  { label: 'System Health', value: '98.7%', icon: Activity, trend: '+0.2%', trendUp: true },
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
  { name: 'Low', value: 65, color: '#10B981' },
  { name: 'Medium', value: 25, color: '#F59E0B' },
  { name: 'High', value: 10, color: '#EF4444' },
];

// LOCKED: Dashboard Box Style
const boxStyle: React.CSSProperties = {
  background: '#0F172A',
  border: '1px solid #1F2937',
  borderRadius: '14px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
};

export function BossDashboard() {
  return (
    <div className="space-y-6">
      {/* Header - LOCKED */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
            Command Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Real-time overview of all operations
          </p>
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Summary Cards - LOCKED grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={boxStyle}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon style={{ width: '20px', height: '20px', color: '#2563EB' }} />
                <div 
                  className="flex items-center"
                  style={{ 
                    fontSize: '12px', 
                    color: card.trendUp ? '#10B981' : '#EF4444' 
                  }}
                >
                  {card.trendUp ? (
                    <ArrowUpRight style={{ width: '14px', height: '14px' }} />
                  ) : (
                    <ArrowDownRight style={{ width: '14px', height: '14px' }} />
                  )}
                  {card.trend}
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
                {card.value}
              </div>
              <div 
                className="mt-1 uppercase tracking-wider"
                style={{ fontSize: '10px', color: '#6B7280' }}
              >
                {card.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid - LOCKED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div style={boxStyle} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp style={{ width: '20px', height: '20px', color: '#2563EB' }} />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>
              Revenue Trend
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  border: '1px solid #1F2937',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Conversion Funnel */}
        <div style={boxStyle} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users style={{ width: '20px', height: '20px', color: '#2563EB' }} />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>
              Lead Conversion Funnel
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  border: '1px solid #1F2937',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Module Usage */}
        <div style={boxStyle} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity style={{ width: '20px', height: '20px', color: '#10B981' }} />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>
              Module Usage
            </span>
          </div>
          <div className="space-y-3">
            {moduleUsage.map((item) => (
              <div key={item.module} className="space-y-1">
                <div className="flex justify-between">
                  <span style={{ fontSize: '14px', color: '#BFC7D5' }}>{item.module}</span>
                  <span style={{ fontSize: '14px', color: '#FFFFFF' }}>{item.usage}%</span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: '#1F2937' }}
                >
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #10B981, #059669)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.usage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Index */}
        <div style={boxStyle} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle style={{ width: '20px', height: '20px', color: '#EF4444' }} />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>
              Risk Index
            </span>
          </div>
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
                    backgroundColor: '#0F172A', 
                    border: '1px solid #1F2937',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="rounded-full"
                  style={{ width: '12px', height: '12px', background: item.color }} 
                />
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
