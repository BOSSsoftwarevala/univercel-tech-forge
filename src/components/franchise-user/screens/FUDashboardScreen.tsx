/**
 * FRANCHISE DASHBOARD - SHOPIFY PARTNER CLONE
 * Clean white UI with Shopify-style cards, earnings, and store management
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Store, TrendingUp, Users, DollarSign, ShoppingBag,
  BarChart3, ArrowUpRight, ArrowDownRight, Clock, Star,
  Package, Eye, MessageSquare, Bell, Settings, Zap,
  MapPin, Globe, Target, Wallet, HeadphonesIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const STATS = [
  { label: 'Total Earnings', value: '₹2,84,500', change: '+15.2%', trend: 'up', icon: DollarSign, color: '#008060' },
  { label: 'Active Stores', value: '12', change: '+2', trend: 'up', icon: Store, color: '#5c6ac4' },
  { label: 'Total Customers', value: '348', change: '+28', trend: 'up', icon: Users, color: '#006fbb' },
  { label: 'Pending Orders', value: '24', change: '-3', trend: 'down', icon: ShoppingBag, color: '#b98900' },
];

const RECENT_ACTIVITY = [
  { type: 'sale', message: 'New sale: Restaurant POS to ABC Corp', amount: '₹45,000', time: '2h ago' },
  { type: 'lead', message: 'New lead assigned: Digital First Ltd', amount: null, time: '3h ago' },
  { type: 'payout', message: 'Commission credited to wallet', amount: '₹12,500', time: '5h ago' },
  { type: 'support', message: 'Support ticket resolved #4521', amount: null, time: '1d ago' },
  { type: 'sale', message: 'Demo converted: CRM for Global Enterprises', amount: '₹68,000', time: '1d ago' },
];

const STORES = [
  { name: 'Mumbai West Store', status: 'active', revenue: '₹1.2L', customers: 128, growth: '+12%' },
  { name: 'Pune Central', status: 'active', revenue: '₹89K', customers: 84, growth: '+8%' },
  { name: 'Nashik Branch', status: 'setup', revenue: '₹0', customers: 0, growth: '—' },
];

const APPS = [
  { name: 'SEO Optimizer', installs: 45, rating: 4.8, revenue: '₹22K' },
  { name: 'AI Lead Scorer', installs: 32, rating: 4.6, revenue: '₹18K' },
  { name: 'Auto Ads Manager', installs: 28, rating: 4.5, revenue: '₹15K' },
];

export function FUDashboardScreen() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Shopify Partner Style Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Partner Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Premium Partner
          </Badge>
        </div>
      </div>

      {/* KPI Cards - Shopify Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="bg-card border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}12` }}>
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stores Section - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Managed Stores */}
          <Card className="bg-card border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Managed Stores</CardTitle>
              <Button variant="outline" size="sm" className="text-xs h-7">View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {STORES.map(store => (
                <div key={store.name} className="flex items-center gap-4 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: store.status === 'active' ? '#f0fdf4' : '#fef3c7' }}>
                    <Store className="w-5 h-5" style={{ color: store.status === 'active' ? '#16a34a' : '#d97706' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{store.name}</p>
                    <Badge variant="outline" className="text-[10px] mt-0.5" style={{
                      borderColor: store.status === 'active' ? '#bbf7d0' : '#fde68a',
                      color: store.status === 'active' ? '#16a34a' : '#d97706',
                    }}>{store.status}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{store.revenue}</p>
                    <p className="text-[10px] text-muted-foreground">{store.customers} customers</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: store.growth.startsWith('+') ? '#16a34a' : '#666' }}>
                    {store.growth}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                    background: activity.type === 'sale' ? '#f0fdf4' : activity.type === 'lead' ? '#eff6ff' : activity.type === 'payout' ? '#fdf4ff' : '#f0f9ff',
                  }}>
                    {activity.type === 'sale' && <ShoppingBag className="w-4 h-4 text-emerald-600" />}
                    {activity.type === 'lead' && <Target className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'payout' && <Wallet className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'support' && <HeadphonesIcon className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{activity.message}</p>
                    <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-semibold text-emerald-600">{activity.amount}</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Earnings Card */}
          <Card className="border shadow-sm" style={{ background: '#008060', color: '#fff' }}>
            <CardContent className="p-5">
              <p className="text-sm font-medium opacity-80">This Month's Earnings</p>
              <p className="text-3xl font-bold mt-2">₹84,500</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-4 h-4 opacity-80" />
                <span className="text-sm opacity-80">+22% from last month</span>
              </div>
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Pending Payout</span>
                  <span className="font-semibold">₹32,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Performance */}
          <Card className="bg-card border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">App Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {APPS.map(app => (
                <div key={app.name} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{app.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] text-muted-foreground">{app.rating} • {app.installs} installs</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{app.revenue}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { icon: Store, label: 'Add Store', color: '#008060' },
                { icon: Target, label: 'New Lead', color: '#5c6ac4' },
                { icon: Wallet, label: 'Withdraw', color: '#006fbb' },
                { icon: HeadphonesIcon, label: 'Support', color: '#b98900' },
              ].map(action => (
                <Button key={action.label} variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5 text-xs border-dashed">
                  <action.icon className="w-4 h-4" style={{ color: action.color }} />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card className="bg-card border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Your Region</span>
              </div>
              <p className="text-lg font-bold text-foreground">Mumbai West</p>
              <p className="text-xs text-muted-foreground mt-1">3 stores • 348 customers • 5 service points</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
