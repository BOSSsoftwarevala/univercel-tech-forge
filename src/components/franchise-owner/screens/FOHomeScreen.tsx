/**
 * FRANCHISE HOME SCREEN
 * Today Sales, Pending Orders, Wallet, Active Leads, SLA Alerts
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Package,
  Wallet,
  Users,
  AlertTriangle,
  ShoppingCart,
  Store,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const stats = [
  { label: 'Today Sales', value: '$12,450', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Pending Orders', value: '8', icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { label: 'Wallet Balance', value: '$45,200', icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Active Leads', value: '24', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'SLA Alerts', value: '3', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
];

const recentActivity = [
  { type: 'order', text: 'New order placed - ERP Software', time: '10 min ago' },
  { type: 'lead', text: 'Lead converted to customer', time: '25 min ago' },
  { type: 'payment', text: 'Wallet credited $5,000', time: '1 hour ago' },
  { type: 'sla', text: 'Promise deadline approaching', time: '2 hours ago' },
];

export function FOHomeScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Franchise Home</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Store className="h-4 w-4" />
            Go to Marketplace
          </Button>
          <Button variant="outline" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Place New Order
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              Browse Marketplace
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              View Active Orders
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              Check Lead Pipeline
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              Review SLA Promises
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm">{activity.text}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FOHomeScreen;
